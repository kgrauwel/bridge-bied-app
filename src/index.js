const APP_VERSION = "2026-06-17-slam-fit-score-v1";
const MAIN_SESSION_PREFIX = "session:";
const PLAYER_REGISTRY_KEY = "players";
const SEATS = ["N", "E", "S", "W"];
const PARTNER_SEATS = ["N", "S"];
const OPPONENT_SEATS = ["E", "W"];
const FILTER_TARGETS = ["N", "S", "E", "W", "NZ"];
const SUITS = ["S", "H", "D", "C"];
const STRAINS = ["C", "D", "H", "S", "NT"];
const RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const DEALER_CYCLE = ["N", "E", "S", "W"];
const VULNERABILITIES = ["Niemand", "NZ", "OW", "Allen"];
const VULNERABILITY_CYCLE = [
  "Niemand",
  "NZ",
  "OW",
  "Allen",
  "NZ",
  "OW",
  "Allen",
  "Niemand",
  "OW",
  "Allen",
  "Niemand",
  "NZ",
  "Allen",
  "Niemand",
  "NZ",
  "OW",
];
const SUIT_SYMBOLS = { S: "\u2660", H: "\u2665", D: "\u2666", C: "\u2663" };
const SEAT_NAMES = { N: "Noord", E: "Oost", S: "Zuid", W: "West" };

let memoryStates = new Map();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultSettings() {
  const filters = {};
  for (const target of FILTER_TARGETS) {
    filters[target] = { minHcp: 0, minSuitLengths: { S: 0, H: 0, D: 0, C: 0 } };
  }
  return { dealerMode: "cycle", vulnerabilityMode: "cycle", opponentMode: "pass", filters };
}

function makeDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function sortHand(hand) {
  return [...hand].sort((left, right) => {
    const suitDiff = SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit);
    return suitDiff || RANKS.indexOf(left.rank) - RANKS.indexOf(right.rank);
  });
}

function dealerForBoard(board, dealerMode) {
  if (dealerMode === "cycle") return DEALER_CYCLE[(board - 1) % DEALER_CYCLE.length];
  if (dealerMode === "random") return SEATS[Math.floor(Math.random() * SEATS.length)];
  return SEATS.includes(dealerMode) ? dealerMode : DEALER_CYCLE[(board - 1) % DEALER_CYCLE.length];
}

function vulnerabilityForBoard(board, vulnerabilityMode) {
  if (vulnerabilityMode === "cycle") return VULNERABILITY_CYCLE[(board - 1) % VULNERABILITY_CYCLE.length];
  if (vulnerabilityMode === "random") return VULNERABILITIES[Math.floor(Math.random() * VULNERABILITIES.length)];
  return VULNERABILITIES.includes(vulnerabilityMode)
    ? vulnerabilityMode
    : VULNERABILITY_CYCLE[(board - 1) % VULNERABILITY_CYCLE.length];
}

function createRawDeal(board, dealer, vulnerability) {
  const deck = shuffle(makeDeck());
  const hands = { N: [], E: [], S: [], W: [] };
  deck.forEach((card, index) => hands[SEATS[index % SEATS.length]].push(card));
  return {
    board,
    dealer,
    vulnerability,
    hands: {
      N: sortHand(hands.N),
      E: sortHand(hands.E),
      S: sortHand(hands.S),
      W: sortHand(hands.W),
    },
    attempts: 1,
    matchedFilters: true,
  };
}

function handStats(hand) {
  const points = { A: 4, K: 3, Q: 2, J: 1 };
  const distribution = { S: 0, H: 0, D: 0, C: 0 };
  let hcp = 0;
  for (const card of hand) {
    hcp += points[card.rank] || 0;
    distribution[card.suit] += 1;
  }
  const counts = Object.values(distribution).sort((left, right) => right - left).join("-");
  return {
    hcp,
    distribution,
    shape: SUITS.map((suit) => distribution[suit]).join("-"),
    balanced: counts === "4-3-3-3" || counts === "4-4-3-2" || counts === "5-3-3-2",
  };
}

function targetHand(deal, target) {
  return target === "NZ" ? [...deal.hands.N, ...deal.hands.S] : deal.hands[target];
}

function normalizeInt(value, maximum) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(maximum, Math.round(parsed))) : 0;
}

function normalizeSettings(raw) {
  const settings = defaultSettings();
  const source = raw && typeof raw === "object" ? raw : {};
  settings.dealerMode = ["cycle", "random", ...SEATS].includes(source.dealerMode) ? source.dealerMode : "cycle";
  settings.vulnerabilityMode = ["cycle", "random", ...VULNERABILITIES].includes(source.vulnerabilityMode)
    ? source.vulnerabilityMode
    : "cycle";
  settings.opponentMode = ["pass", "auto"].includes(source.opponentMode) ? source.opponentMode : "pass";

  const rawFilters = source.filters && typeof source.filters === "object" ? source.filters : {};
  for (const target of FILTER_TARGETS) {
    const filter = rawFilters[target] && typeof rawFilters[target] === "object" ? rawFilters[target] : {};
    settings.filters[target].minHcp = normalizeInt(filter.minHcp, target === "NZ" ? 40 : 37);
    const lengths = filter.minSuitLengths && typeof filter.minSuitLengths === "object" ? filter.minSuitLengths : {};
    for (const suit of SUITS) {
      settings.filters[target].minSuitLengths[suit] = normalizeInt(lengths[suit], target === "NZ" ? 26 : 13);
    }
  }
  return settings;
}

function dealMatchesFilters(deal, settings) {
  for (const target of FILTER_TARGETS) {
    const filter = settings.filters[target];
    const stats = handStats(targetHand(deal, target));
    if (stats.hcp < filter.minHcp) return false;
    for (const suit of SUITS) {
      if (stats.distribution[suit] < filter.minSuitLengths[suit]) return false;
    }
  }
  return true;
}

function createDeal(board, settings) {
  let fallback = createRawDeal(
    board,
    dealerForBoard(board, settings.dealerMode),
    vulnerabilityForBoard(board, settings.vulnerabilityMode),
  );
  for (let attempts = 1; attempts <= 4000; attempts += 1) {
    const candidate = createRawDeal(
      board,
      dealerForBoard(board, settings.dealerMode),
      vulnerabilityForBoard(board, settings.vulnerabilityMode),
    );
    if (dealMatchesFilters(candidate, settings)) {
      candidate.attempts = attempts;
      candidate.matchedFilters = true;
      return candidate;
    }
    fallback = candidate;
  }
  fallback.attempts = 4000;
  fallback.matchedFilters = false;
  return fallback;
}

function currentSeat(dealer, auction) {
  return SEATS[(SEATS.indexOf(dealer) + auction.length) % SEATS.length];
}

function isContract(call) {
  return /^[1-7](C|D|H|S|NT)$/.test(call);
}

function bidParts(bid) {
  return [Number(bid.slice(0, 1)), bid.slice(1)];
}

function bidValue(bid) {
  const [level, strain] = bidParts(bid);
  return level * STRAINS.length + STRAINS.indexOf(strain);
}

function lastContract(auction) {
  for (let index = auction.length - 1; index >= 0; index -= 1) {
    if (isContract(auction[index].call)) return auction[index];
  }
  return null;
}

function lastContractIndex(auction) {
  for (let index = auction.length - 1; index >= 0; index -= 1) {
    if (isContract(auction[index].call)) return index;
  }
  return -1;
}

function isHigherBid(candidate, auction) {
  const previous = lastContract(auction);
  return !previous || bidValue(candidate) > bidValue(previous.call);
}

function allContractBids() {
  const bids = [];
  for (let level = 1; level <= 7; level += 1) {
    for (const strain of STRAINS) bids.push(`${level}${strain}`);
  }
  return bids;
}

function canDouble(auction, seat) {
  const contractIndex = lastContractIndex(auction);
  if (contractIndex < 0) return false;
  const contract = auction[contractIndex];
  if (sideForSeat(contract.seat) === sideForSeat(seat)) return false;
  return auction.slice(contractIndex + 1).every((entry) => entry.call === "P");
}

function canRedouble(auction, seat) {
  const contractIndex = lastContractIndex(auction);
  if (contractIndex < 0) return false;
  const contractSide = sideForSeat(auction[contractIndex].seat);
  if (sideForSeat(seat) !== contractSide) return false;
  const afterContract = auction.slice(contractIndex + 1);
  const doubleIndex = afterContract.findIndex((entry) => entry.call === "X");
  if (doubleIndex < 0) return false;
  const doubleEntry = afterContract[doubleIndex];
  if (sideForSeat(doubleEntry.seat) === contractSide) return false;
  return afterContract.every((entry) => entry.call === "P" || entry.call === "X") &&
    afterContract.slice(doubleIndex + 1).every((entry) => entry.call === "P");
}

function legalCalls(auction, seat) {
  const calls = [];
  if (canDouble(auction, seat)) calls.push("X");
  if (canRedouble(auction, seat)) calls.push("XX");
  return calls.concat(allContractBids().filter((bid) => isHigherBid(bid, auction)));
}

function isAuctionComplete(auction) {
  if (auction.length < 4) return false;
  if (auction.slice(-4).every((entry) => entry.call === "P")) return true;
  return Boolean(lastContract(auction) && auction.slice(-3).every((entry) => entry.call === "P"));
}

function displayCall(call) {
  if (call === "P") return "Pas";
  if (call === "X") return "DBL";
  if (call === "XX") return "RDBL";
  const [level, strain] = bidParts(call);
  return strain === "NT" ? `${level}SA` : `${level}${SUIT_SYMBOLS[strain]}`;
}

function chooseOpeningSuit(stats) {
  const majors = ["S", "H"].filter((suit) => stats.distribution[suit] >= 5);
  if (majors.length) return majors.sort((left, right) => stats.distribution[right] - stats.distribution[left])[0];
  return ["D", "C"].sort((left, right) => stats.distribution[right] - stats.distribution[left] || (left === "D" ? -1 : 1))[0];
}

function longestSuit(stats) {
  return [...SUITS].sort((left, right) => stats.distribution[right] - stats.distribution[left])[0];
}

function lowestLegalBid(strain, auction, minimumLevel = 1) {
  for (let level = minimumLevel; level <= 7; level += 1) {
    const bid = `${level}${strain}`;
    if (isHigherBid(bid, auction)) return bid;
  }
  return null;
}

function safeBid(call, auction) {
  return call && isHigherBid(call, auction) ? call : "P";
}

function sideContractBids(auction, partnership) {
  return auction.filter((entry) => partnership.includes(entry.seat) && isContract(entry.call));
}

function bidBySeat(sideBids, seat) {
  return sideBids.filter((entry) => entry.seat === seat);
}

function hasOpponentContract(auction, partnership) {
  return auction.some((entry) => !partnership.includes(entry.seat) && isContract(entry.call));
}

function naturalOpeningBid(stats, auction) {
  if (stats.balanced && stats.hcp >= 15 && stats.hcp <= 17) return safeBid("1NT", auction);
  if (stats.hcp >= 12) return safeBid(`1${chooseOpeningSuit(stats)}`, auction);
  const long = longestSuit(stats);
  if (stats.hcp >= 6 && stats.hcp <= 10 && stats.distribution[long] >= 6) {
    return safeBid(`${stats.distribution[long] === 6 ? 2 : 3}${long}`, auction);
  }
  return "P";
}

function bestMajor(stats, minimumLength = 4) {
  const majors = ["S", "H"].filter((suit) => stats.distribution[suit] >= minimumLength);
  return majors.sort((left, right) => stats.distribution[right] - stats.distribution[left] || (left === "S" ? -1 : 1))[0] || null;
}

function responseToOpening(seat, stats, auction, opening) {
  const [openLevel, openStrain] = bidParts(opening.call);
  if (openStrain === "NT") {
    if (stats.hcp >= 10) return safeBid("3NT", auction);
    if (stats.hcp >= 8) return safeBid("2NT", auction);
    const major = bestMajor(stats, 6);
    if (major && stats.hcp >= 6) return lowestLegalBid(major, auction, 2) || "P";
    return "P";
  }

  if (["H", "S"].includes(openStrain) && stats.distribution[openStrain] >= 3) {
    const level = stats.hcp >= 13 ? 4 : stats.hcp >= 10 ? 3 : stats.hcp >= 6 ? 2 : 0;
    return level ? safeBid(`${level}${openStrain}`, auction) : "P";
  }

  const major = bestMajor(stats, 4);
  if (major && major !== openStrain && stats.hcp >= 6) {
    const bid = lowestLegalBid(major, auction, openLevel);
    if (bid && (bidParts(bid)[0] === 1 || stats.hcp >= 10 || stats.distribution[major] >= 5)) return bid;
  }

  if (stats.balanced || stats.hcp >= 10) {
    if (stats.hcp >= 13) return safeBid("3NT", auction);
    if (stats.hcp >= 11) return safeBid("2NT", auction);
    if (stats.hcp >= 6) return safeBid("1NT", auction);
  }

  const long = longestSuit(stats);
  if (stats.hcp >= 10 && stats.distribution[long] >= 5 && long !== openStrain) {
    return lowestLegalBid(long, auction) || "P";
  }

  if (["C", "D"].includes(openStrain) && stats.hcp >= 6 && stats.distribution[openStrain] >= 4) {
    return safeBid(`2${openStrain}`, auction);
  }
  return "P";
}

function openerRebid(stats, auction, opening, response) {
  const [, openStrain] = bidParts(opening.call);
  const [responseLevel, responseStrain] = bidParts(response.call);

  if (responseStrain === "NT") {
    if (stats.balanced && stats.hcp >= 18) return safeBid("3NT", auction);
    if (stats.hcp >= 17) return safeBid("2NT", auction);
    return "P";
  }

  if (["H", "S"].includes(responseStrain) && stats.distribution[responseStrain] >= 4) {
    const level = stats.hcp >= 18 ? 4 : stats.hcp >= 15 ? 3 : 2;
    return safeBid(`${level}${responseStrain}`, auction);
  }

  if (stats.distribution[openStrain] >= 6) {
    return lowestLegalBid(openStrain, auction, Math.max(2, responseLevel)) || "P";
  }

  if (stats.balanced) {
    if (stats.hcp >= 18) return safeBid("3NT", auction);
    return safeBid("1NT", auction) !== "P" ? safeBid("1NT", auction) : safeBid("2NT", auction);
  }

  const secondSuit = [...SUITS]
    .filter((suit) => suit !== openStrain && stats.distribution[suit] >= 4)
    .sort((left, right) => stats.distribution[right] - stats.distribution[left])[0];
  if (secondSuit) return lowestLegalBid(secondSuit, auction) || "P";
  return "P";
}

function competitiveRebid(stats, auction, opening) {
  const [, openStrain] = bidParts(opening.call);
  const last = lastContract(auction);
  if (!last) return "P";
  const [lastLevel] = bidParts(last.call);
  if (lastLevel >= 5) return "P";

  const long = stats.distribution[openStrain];
  const playingStrength = stats.hcp + Math.max(0, long - 5) * 2;
  if (long >= 7 && playingStrength >= 17) {
    return safeBid(`${Math.min(5, lastLevel + 1)}${openStrain}`, auction);
  }
  if (long >= 6 && stats.hcp >= 17 && lastLevel <= 3) {
    return safeBid(`${lastLevel + 1}${openStrain}`, auction);
  }
  return "P";
}

function finalChoiceForSide(deal, auction, side) {
  const combinedStats = handStats(combinedHand(deal, side));
  const majorFit = Math.max(combinedStats.distribution.H, combinedStats.distribution.S);
  if (combinedStats.hcp >= 24 && majorFit < 8) {
    const notrump = safeBid("3NT", auction);
    if (notrump !== "P") return notrump;
  }
  const target = bestContractForSide(deal, side);
  if (!target.bid || target.bid === "Pas") return "P";
  const [level] = bidParts(target.bid);
  if (level >= 7 && combinedStats.hcp < 36) return "P";
  if (level >= 6 && combinedStats.hcp < 32) return "P";
  return safeBid(target.bid, auction);
}

function simpleAutoBid(seat, hand, auction, partnership, deal) {
  const stats = handStats(hand);
  const sideBids = sideContractBids(auction, partnership);
  const ownBids = bidBySeat(sideBids, seat);
  const partnerBids = sideBids.filter((entry) => entry.seat !== seat);

  if (!sideBids.length) {
    if (hasOpponentContract(auction, partnership) && stats.hcp < 12) return "P";
    return naturalOpeningBid(stats, auction);
  }

  if (!ownBids.length && partnerBids.length === 1) {
    return responseToOpening(seat, stats, auction, partnerBids[0]);
  }

  if (ownBids.length === 1 && !partnerBids.length && hasOpponentContract(auction, partnership)) {
    return competitiveRebid(stats, auction, ownBids[0]);
  }

  if (ownBids.length === 1 && partnerBids.length === 1 && sideBids.length === 2 && sideBids[0].seat === seat) {
    return openerRebid(stats, auction, ownBids[0], partnerBids[0]);
  }

  if (ownBids.length === 1 && partnerBids.length >= 2 && sideBids.length === 3) {
    return finalChoiceForSide(deal, auction, sideForSeat(seat));
  }

  return "P";
}

function processAutoOpponents(session, pairState) {
  let guard = 0;
  while (
    !isAuctionComplete(pairState.auction) &&
    OPPONENT_SEATS.includes(currentSeat(session.deal.dealer, pairState.auction)) &&
    guard < 20
  ) {
    const seat = currentSeat(session.deal.dealer, pairState.auction);
    let call = "P";
    if (session.settings.opponentMode === "auto") {
      call = simpleAutoBid(seat, session.deal.hands[seat], pairState.auction, OPPONENT_SEATS, session.deal);
      if (isContract(call) && !isHigherBid(call, pairState.auction)) call = "P";
    }
    pairState.auction.push({ seat, call });
    guard += 1;
  }
}

function undoAuctionForSeat(pairState, seat) {
  if (!PARTNER_SEATS.includes(seat)) return false;
  const index = pairState.auction.map((entry) => entry.seat).lastIndexOf(seat);
  if (index < 0) return false;
  pairState.auction = pairState.auction.slice(0, index);
  return true;
}

function sideForSeat(seat) {
  return PARTNER_SEATS.includes(seat) ? "NZ" : "OW";
}

function seatsForSide(side) {
  return side === "NZ" ? PARTNER_SEATS : OPPONENT_SEATS;
}

function sideVulnerable(side, vulnerability) {
  return vulnerability === "Allen" || (side === "NZ" && vulnerability === "NZ") || (side === "OW" && vulnerability === "OW");
}

function declarerForFinalContract(auction) {
  const contract = lastContract(auction);
  if (!contract) return null;
  const [, strain] = bidParts(contract.call);
  const sideSeats = seatsForSide(sideForSeat(contract.seat));
  for (const entry of auction) {
    if (sideSeats.includes(entry.seat) && isContract(entry.call) && bidParts(entry.call)[1] === strain) return entry.seat;
  }
  return contract.seat;
}

function contractScoreMade(bid, vulnerable, multiplier = 1) {
  const [level, strain] = bidParts(bid);
  const perTrick = ["C", "D"].includes(strain) ? 20 : 30;
  const baseContractPoints = strain === "NT" ? 40 + Math.max(0, level - 1) * 30 : level * perTrick;
  const contractPoints = baseContractPoints * multiplier;
  const gameBonus = contractPoints >= 100 ? (vulnerable ? 500 : 300) : 50;
  const slamBonus = level === 6 ? (vulnerable ? 750 : 500) : level === 7 ? (vulnerable ? 1500 : 1000) : 0;
  const insultBonus = multiplier === 4 ? 100 : multiplier === 2 ? 50 : 0;
  return contractPoints + gameBonus + slamBonus + insultBonus;
}

function contractPenaltyDown(down, vulnerable, multiplier = 1) {
  if (multiplier === 1) return down * (vulnerable ? 100 : 50);
  let doubledPenalty;
  if (vulnerable) doubledPenalty = 200 + Math.max(0, down - 1) * 300;
  else if (down === 1) doubledPenalty = 100;
  else if (down <= 3) doubledPenalty = 100 + (down - 1) * 200;
  else doubledPenalty = 500 + (down - 3) * 300;
  return multiplier === 4 ? doubledPenalty * 2 : doubledPenalty;
}

function scoreForNz(score, side) {
  return side === "NZ" ? score : -score;
}

function combinedHand(deal, side) {
  return seatsForSide(side).flatMap((seat) => deal.hands[seat]);
}

function honorControls(hand) {
  return hand.reduce((total, card) => total + (card.rank === "A" ? 2 : card.rank === "K" ? 1 : 0), 0);
}

function hasCombinedRanks(hand, suit, ranks) {
  const owned = new Set(hand.filter((card) => card.suit === suit).map((card) => card.rank));
  return ranks.every((rank) => owned.has(rank));
}

function combinedLength(hand, suit) {
  return hand.filter((card) => card.suit === suit).length;
}

function hasStrongTrumpFit(hand, strain) {
  if (strain === "NT") return false;
  const fit = combinedLength(hand, strain);
  if (fit < 8) return false;
  return hasCombinedRanks(hand, strain, ["A", "K", "Q"]) ||
    (hasCombinedRanks(hand, strain, ["A", "K", "J", "10"]) && fit >= 8);
}

function hasPotentialTrickSource(hand, trump) {
  return SUITS.some((suit) => {
    const length = combinedLength(hand, suit);
    if (length >= 10 && hasCombinedRanks(hand, suit, ["A", "K", "J", "10"])) return true;
    if (length >= 9 && hasCombinedRanks(hand, suit, ["A", "K", "Q"])) return true;
    if (suit === trump && length >= 8 && hasStrongTrumpFit(hand, trump)) return true;
    return false;
  });
}

function hasLongTrickSource(hand, stats) {
  return SUITS.some((suit) => {
    const length = stats.distribution[suit];
    if (length >= 8 && hasCombinedRanks(hand, suit, ["A", "K", "Q"])) return true;
    if (length >= 7 && hasCombinedRanks(hand, suit, ["A", "K", "Q", "J"])) return true;
    return false;
  });
}

function maxReasonableLevel(stats, controls, strain, hand) {
  const longSource = hasLongTrickSource(hand, stats);
  if (stats.hcp >= 33 && controls >= 10 && longSource) return 7;
  if (stats.hcp >= 37 && controls >= 9) return 7;
  if (stats.hcp >= 32 && controls >= 7) return 6;
  if (strain === "NT") {
    if (stats.hcp >= 25 && stats.balanced) return 3;
    if (stats.hcp >= 22) return 2;
    return 1;
  }
  const fit = stats.distribution[strain];
  if (fit >= 8 && stats.hcp >= 30 && controls >= 9 && hasStrongTrumpFit(hand, strain) && hasPotentialTrickSource(hand, strain)) return 6;
  if (fit >= 9 && stats.hcp >= 28 && controls >= 9 && hasStrongTrumpFit(hand, strain)) return 6;
  if (["H", "S"].includes(strain)) {
    if (stats.hcp >= 25 && fit >= 8) return 4;
    if (stats.hcp >= 22 && fit >= 8) return 3;
    return Math.min(2, Math.max(1, fit - 5));
  }
  if (stats.hcp >= 29 && fit >= 8) return 5;
  if (stats.hcp >= 26 && fit >= 9 && controls >= 5) return 5;
  if (stats.hcp >= 23 && fit >= 8) return 4;
  return fit >= 8 ? 3 : 2;
}

function estimateTricks(deal, side, strain) {
  const hand = combinedHand(deal, side);
  const stats = handStats(hand);
  const controls = honorControls(hand);
  let estimate = 6 + (stats.hcp - 18) / 2.9;
  if (strain !== "NT") {
    const fit = stats.distribution[strain];
    if (fit >= 8) estimate += 0.65;
    if (fit >= 9) estimate += 0.35;
    if (fit >= 10) estimate += 0.25;
    if (fit <= 6) estimate -= 1.0;
  } else if (stats.balanced) {
    estimate += 0.25;
  }
  if (controls >= 7) estimate += 0.25;
  if (controls <= 3) estimate -= 0.35;
  if (stats.hcp >= 33 && controls >= 10 && hasLongTrickSource(hand, stats)) estimate = Math.max(estimate, 13);
  if (stats.hcp >= 33 && controls >= 7) estimate = Math.max(estimate, 12);
  if (stats.hcp >= 37 && controls >= 9) estimate = Math.max(estimate, 13);
  if (strain !== "NT") {
    const fit = stats.distribution[strain];
    const slamSource = hasStrongTrumpFit(hand, strain) && hasPotentialTrickSource(hand, strain);
    if (fit >= 8 && stats.hcp >= 30 && controls >= 9 && slamSource) estimate = Math.max(estimate, 12);
    if (fit >= 9 && stats.hcp >= 32 && controls >= 10 && slamSource) estimate = Math.max(estimate, 13);
  }
  return Math.max(0, Math.min(13, Math.floor(estimate + 0.45)));
}

function bestContractForSide(deal, side) {
  let best = { side, bid: "Pas", score: 0, tricks: 0 };
  const hand = combinedHand(deal, side);
  const stats = handStats(hand);
  const controls = honorControls(hand);
  for (const strain of STRAINS) {
    const tricks = estimateTricks(deal, side, strain);
    const maxLevel = Math.max(0, Math.min(7, tricks - 6, maxReasonableLevel(stats, controls, strain, hand)));
    for (let level = 1; level <= maxLevel; level += 1) {
      const bid = `${level}${strain}`;
      const score = contractScoreMade(bid, sideVulnerable(side, deal.vulnerability));
      if (score > best.score) best = { side, bid, score, tricks };
    }
  }
  return best;
}

function indicativePar(deal) {
  const ns = bestContractForSide(deal, "NZ");
  const ow = bestContractForSide(deal, "OW");
  if (ns.score >= ow.score) {
    return { ...ns, nzScore: ns.score, label: ns.bid === "Pas" ? "Rondpas" : `NZ ${displayCall(ns.bid)}` };
  }
  return { ...ow, nzScore: -ow.score, label: `OW ${displayCall(ow.bid)}` };
}

function expectedFinalScore(deal, auction) {
  const contract = lastContract(auction);
  if (!contract) return { label: "Rondgepast", nzScore: 0, side: "NZ", made: true };
  const declarer = declarerForFinalContract(auction);
  const side = sideForSeat(declarer);
  const [level, strain] = bidParts(contract.call);
  const needed = level + 6;
  const tricks = estimateTricks(deal, side, strain);
  const vulnerable = sideVulnerable(side, deal.vulnerability);
  const multiplier = finalContractMultiplier(auction);
  const doubledText = multiplier === 4 ? " geredubbeld" : multiplier === 2 ? " gedubbeld" : "";
  if (tricks >= needed) {
    const rawScore = contractScoreMade(contract.call, vulnerable, multiplier);
    return {
      label: `${displayCall(contract.call)}${doubledText} door ${SEAT_NAMES[declarer]}, verwacht gemaakt`,
      nzScore: scoreForNz(rawScore, side),
      side,
      made: true,
    };
  }
  const down = needed - tricks;
  const rawScore = -contractPenaltyDown(down, vulnerable, multiplier);
  return {
    label: `${displayCall(contract.call)}${doubledText} door ${SEAT_NAMES[declarer]}, verwacht ${down} down`,
    nzScore: scoreForNz(rawScore, side),
    side,
    made: false,
  };
}

function finalContractMultiplier(auction) {
  const contractIndex = lastContractIndex(auction);
  if (contractIndex < 0) return 1;
  const calls = auction.slice(contractIndex + 1).map((entry) => entry.call);
  if (calls.includes("XX")) return 4;
  if (calls.includes("X")) return 2;
  return 1;
}

function nzFinalJudgement(deal, auction) {
  const contract = lastContract(auction);
  const par = indicativePar(deal);
  const finalScore = expectedFinalScore(deal, auction);
  if (!contract) return par.score === 0 ? "OK: rondpassen lijkt passend." : `Niet ideaal: indicatieve par is ${par.label}.`;
  const declarer = declarerForFinalContract(auction);
  if (sideForSeat(declarer) !== "NZ") return `NZ heeft niet het eindcontract; indicatieve par is ${par.label}.`;
  if (finalScore.nzScore < -20) return "Niet OK: het NZ-contract lijkt te hoog.";
  const gap = par.nzScore - finalScore.nzScore;
  const [finalLevel, finalStrain] = bidParts(contract.call);
  if (gap <= 30) {
    if (par.side === "NZ" && par.bid !== "Pas") {
      const [parLevel, parStrain] = bidParts(par.bid);
      if (parStrain === finalStrain && parLevel === finalLevel + 1) {
        return "OK: praktisch even goed als par; het lagere contract is veiliger.";
      }
    }
    return "OK: praktisch even goed als de indicatieve par.";
  }
  if (gap <= 140) return "Redelijk: NZ mist waarschijnlijk wat score.";
  return "Niet ideaal: NZ blijft duidelijk onder de indicatieve par.";
}

function scoreInfo(session, pairState) {
  if (!isAuctionComplete(pairState.auction)) return null;
  const par = indicativePar(session.deal);
  const final = expectedFinalScore(session.deal, pairState.auction);
  return {
    par,
    final,
    nzJudgement: nzFinalJudgement(session.deal, pairState.auction),
    note: "Richtscore: conservatief berekend uit punten, fit, controles en kwetsbaarheid. Echte par vereist double-dummy analyse.",
  };
}

function normalizeSessionId(value) {
  const clean = String(value || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);
  return clean.length >= 3 ? clean : "BRIDGE";
}

function normalizePair(value) {
  const clean = String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
  return clean || "Paar 1";
}

function normalizePlayerName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
}

function pairForPlayers(playerName, partnerName) {
  const names = [normalizePlayerName(playerName), normalizePlayerName(partnerName)].filter(Boolean);
  if (!names.length) return "";
  const uniqueNames = [...new Set(names)];
  return uniqueNames.sort((left, right) => left.localeCompare(right, "nl-BE")).join(" + ");
}

function randomSessionId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let index = 0; index < 6; index += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function normalizeSeat(value) {
  return PARTNER_SEATS.includes(value) ? value : "N";
}

function partnerSeat(seat) {
  return seat === "S" ? "N" : "S";
}

function makePairState(label) {
  return { label, auction: [], chat: [], nextChatId: 1 };
}

function ensurePair(session, pairLabel) {
  const pair = normalizePair(pairLabel);
  session.pairs ||= {};
  if (!session.pairs[pair]) session.pairs[pair] = makePairState(pair);
  session.pairs[pair].label = pair;
  return session.pairs[pair];
}

function resetPairsForNewBoard(session) {
  const existingLabels = Object.keys(session.pairs || {});
  session.pairs = {};
  for (const label of existingLabels) {
    session.pairs[label] = makePairState(label);
  }
}

function initialSession(sessionId, boardNumber = 1, sourceSettings = null) {
  const settings = normalizeSettings(sourceSettings || defaultSettings());
  return {
    sessionId,
    board: boardNumber,
    settings,
    deal: createDeal(boardNumber, settings),
    pairs: {},
    members: {},
  };
}

async function ensureDb(env) {
  if (!env.DB) return;
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS bied_state (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)"
  ).run();
}

function normalizeRegistry(value) {
  const registry = { players: {} };
  const players = value?.players && typeof value.players === "object" ? value.players : {};
  for (const [name, details] of Object.entries(players)) {
    const clean = normalizePlayerName(name || details?.name);
    if (!clean) continue;
    const sessions = {};
    const rawSessions = details?.sessions && typeof details.sessions === "object" ? details.sessions : {};
    for (const [sessionId, rawSession] of Object.entries(rawSessions)) {
      const cleanSessionId = normalizeSessionId(rawSession?.sessionId || sessionId);
      sessions[cleanSessionId] = {
        sessionId: cleanSessionId,
        pair: normalizePair(rawSession?.pair),
        partner: normalizePlayerName(rawSession?.partner),
        seat: normalizeSeat(rawSession?.seat),
        board: normalizeInt(rawSession?.board || 1, 9999) || 1,
        complete: Boolean(rawSession?.complete),
        updatedAt: Number(rawSession?.updatedAt || Date.now()),
      };
    }
    registry.players[clean] = {
      name: clean,
      updatedAt: Number(details?.updatedAt || Date.now()),
      sessions,
    };
  }
  return registry;
}

function playerList(registry) {
  return Object.values(registry.players || {})
    .map((player) => player.name)
    .sort((left, right) => left.localeCompare(right, "nl-BE"));
}

function touchPlayers(registry, ...names) {
  const now = Date.now();
  for (const name of names.map(normalizePlayerName).filter(Boolean)) {
    registry.players[name] = { name, sessions: registry.players[name]?.sessions || {}, updatedAt: now };
  }
}

function upsertPlayerSession(registry, playerName, session) {
  const name = normalizePlayerName(playerName);
  if (!name) return;
  touchPlayers(registry, name);
  registry.players[name].sessions ||= {};
  registry.players[name].sessions[session.sessionId] = {
    sessionId: session.sessionId,
    pair: normalizePair(session.pair),
    partner: normalizePlayerName(session.partner),
    seat: normalizeSeat(session.seat),
    board: normalizeInt(session.board || 1, 9999) || 1,
    complete: Boolean(session.complete),
    updatedAt: Date.now(),
  };
}

function sessionsForPlayer(registry, playerName) {
  const name = normalizePlayerName(playerName);
  const sessions = registry.players[name]?.sessions || {};
  return Object.values(sessions).sort((left, right) => right.updatedAt - left.updatedAt).slice(0, 40);
}

async function sessionsForPlayerWithCurrentStatus(env, registry, playerName) {
  const rows = sessionsForPlayer(registry, playerName);
  const detailed = [];
  for (const row of rows) {
    try {
      const session = await loadSession(env, row.sessionId);
      const pairState = session.pairs?.[normalizePair(row.pair)];
      detailed.push({
        ...row,
        board: normalizeInt(session.board || row.board || 1, 9999) || 1,
        complete: pairState ? isAuctionComplete(pairState.auction) : Boolean(row.complete),
      });
    } catch {
      detailed.push(row);
    }
  }
  return detailed.sort((left, right) => right.updatedAt - left.updatedAt).slice(0, 40);
}

function deleteSessionForPair(registry, sessionId, pair) {
  const cleanSessionId = normalizeSessionId(sessionId);
  const cleanPair = normalizePair(pair);
  for (const player of Object.values(registry.players || {})) {
    const stored = player.sessions?.[cleanSessionId];
    if (stored && normalizePair(stored.pair) === cleanPair) {
      delete player.sessions[cleanSessionId];
      player.updatedAt = Date.now();
    }
  }
}

function syncSessionPlayers(registry, session, pair, complete = false) {
  const members = session.members || {};
  for (const seat of PARTNER_SEATS) {
    const player = normalizePlayerName(members[seat]);
    if (!player) continue;
    const otherSeat = partnerSeat(seat);
    upsertPlayerSession(registry, player, {
      sessionId: session.sessionId,
      pair,
      partner: normalizePlayerName(members[otherSeat]),
      seat,
      board: session.board,
      complete,
    });
  }
}

async function loadRegistry(env) {
  if (!env.DB) {
    if (!memoryStates.has(PLAYER_REGISTRY_KEY)) memoryStates.set(PLAYER_REGISTRY_KEY, { players: {} });
    return normalizeRegistry(memoryStates.get(PLAYER_REGISTRY_KEY));
  }
  await ensureDb(env);
  const row = await env.DB.prepare("SELECT payload FROM bied_state WHERE id = ?").bind(PLAYER_REGISTRY_KEY).first();
  if (!row?.payload) return { players: {} };
  try {
    return normalizeRegistry(JSON.parse(row.payload));
  } catch {
    return { players: {} };
  }
}

async function saveRegistry(env, registry) {
  const clean = normalizeRegistry(registry);
  if (!env.DB) {
    memoryStates.set(PLAYER_REGISTRY_KEY, clone(clean));
    return clean;
  }
  await ensureDb(env);
  await env.DB.prepare(
    "INSERT INTO bied_state (id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at"
  )
    .bind(PLAYER_REGISTRY_KEY, JSON.stringify(clean), Date.now())
    .run();
  return clean;
}

async function loadSession(env, sessionId) {
  const key = `${MAIN_SESSION_PREFIX}${sessionId}`;
  if (!env.DB) {
    if (!memoryStates.has(key)) memoryStates.set(key, initialSession(sessionId));
    return clone(memoryStates.get(key));
  }
  await ensureDb(env);
  const row = await env.DB.prepare("SELECT payload FROM bied_state WHERE id = ?").bind(key).first();
  if (!row?.payload) return initialSession(sessionId);
  try {
    const parsed = JSON.parse(row.payload);
    parsed.sessionId = sessionId;
    parsed.settings = normalizeSettings(parsed.settings);
    parsed.pairs ||= {};
    parsed.members ||= {};
    return parsed;
  } catch {
    return initialSession(sessionId);
  }
}

async function saveSession(env, session) {
  const key = `${MAIN_SESSION_PREFIX}${session.sessionId}`;
  if (!env.DB) {
    memoryStates.set(key, clone(session));
    return;
  }
  await ensureDb(env);
  await env.DB.prepare(
    "INSERT INTO bied_state (id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at"
  )
    .bind(key, JSON.stringify(session), Date.now())
    .run();
}

function currentResults(session) {
  return Object.values(session.pairs || {}).map((pairState) => {
    const complete = isAuctionComplete(pairState.auction);
    const score = scoreInfo(session, pairState);
    return {
      pair: pairState.label,
      complete,
      calls: pairState.auction.length,
      final: score?.final || null,
      nzJudgement: score?.nzJudgement || null,
    };
  });
}

function publicState(session, pairLabel, seatValue, registry, playerName = "") {
  const pair = normalizePair(pairLabel);
  const selectedSeat = normalizeSeat(seatValue);
  const pairState = ensurePair(session, pair);
  processAutoOpponents(session, pairState);
  const complete = isAuctionComplete(pairState.auction);
  return {
    appVersion: APP_VERSION,
    sessionId: session.sessionId,
    pair,
    pairs: Object.keys(session.pairs || {}),
    players: registry ? playerList(registry) : [],
    mySessions: registry ? sessionsForPlayer(registry, playerName) : [],
    members: session.members || {},
    board: session.board,
    dealer: session.deal.dealer,
    vulnerability: session.deal.vulnerability,
    attempts: session.deal.attempts,
    matchedFilters: session.deal.matchedFilters,
    settings: session.settings,
    auction: pairState.auction,
    activeSeat: currentSeat(session.deal.dealer, pairState.auction),
    complete,
    canUndo: pairState.auction.some((entry) => entry.seat === selectedSeat),
    selectedSeat,
    myHand: session.deal.hands[selectedSeat],
    myStats: handStats(session.deal.hands[selectedSeat]),
    allHands: complete ? session.deal.hands : null,
    allStats: complete ? Object.fromEntries(SEATS.map((seat) => [seat, handStats(session.deal.hands[seat])])) : null,
    legalBids: legalCalls(pairState.auction, selectedSeat),
    chat: pairState.chat.slice(-80),
    score: scoreInfo(session, pairState),
    results: currentResults(session),
  };
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function belgianTime() {
  return new Intl.DateTimeFormat("nl-BE", {
    timeZone: "Europe/Brussels",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  const body = request.method === "POST" ? await readBody(request) : {};
  let registry = await loadRegistry(env);
  const playerName = normalizePlayerName(url.searchParams.get("player") || body.player);
  const partnerName = normalizePlayerName(url.searchParams.get("partner") || body.partner);
  const pair = normalizePair(url.searchParams.get("pair") || body.pair || pairForPlayers(playerName, partnerName));
  const seat = normalizeSeat(url.searchParams.get("seat") || body.seat);

  try {
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ appVersion: APP_VERSION, dbConnected: Boolean(env.DB) });
    }

    if (request.method === "GET" && url.pathname === "/api/players") {
      return json({ players: playerList(registry) });
    }

    if (request.method === "GET" && url.pathname === "/api/sessions") {
      return json({ players: playerList(registry), sessions: await sessionsForPlayerWithCurrentStatus(env, registry, playerName) });
    }

    if (request.method === "POST" && url.pathname === "/api/players") {
      touchPlayers(registry, playerName, partnerName);
      registry = await saveRegistry(env, registry);
      return json({ players: playerList(registry) });
    }

    if (request.method === "POST" && url.pathname === "/api/new-session") {
      touchPlayers(registry, playerName, partnerName);
      registry = await saveRegistry(env, registry);
      const newSessionId = randomSessionId();
      const newSession = initialSession(newSessionId);
      newSession.settings = normalizeSettings(body.settings || newSession.settings);
      newSession.deal = createDeal(newSession.board, newSession.settings);
      newSession.members = {
        [seat]: playerName,
        [partnerSeat(seat)]: partnerName,
      };
      ensurePair(newSession, pair);
      syncSessionPlayers(registry, newSession, pair, false);
      registry = await saveRegistry(env, registry);
      const data = publicState(newSession, pair, seat, registry, playerName);
      await saveSession(env, newSession);
      return json(data);
    }

    if (request.method === "POST" && (playerName || partnerName)) {
      touchPlayers(registry, playerName, partnerName);
      registry = await saveRegistry(env, registry);
    }

    const sessionId = normalizeSessionId(url.searchParams.get("session") || body.session);
    const session = await loadSession(env, sessionId);

    if (request.method === "GET" && url.pathname === "/api/state") {
      const before = JSON.stringify(session);
      const data = publicState(session, pair, seat, registry, playerName);
      if (JSON.stringify(session) !== before) await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/delete-session") {
      const pairStateExists = Boolean(session.pairs?.[pair]);
      if (session.pairs?.[pair]) delete session.pairs[pair];
      deleteSessionForPair(registry, session.sessionId, pair);
      registry = await saveRegistry(env, registry);
      await saveSession(env, session);
      return json({
        deleted: pairStateExists,
        players: playerList(registry),
        sessions: await sessionsForPlayerWithCurrentStatus(env, registry, playerName),
      });
    }

    if (request.method === "POST" && url.pathname === "/api/new-deal") {
      session.settings = normalizeSettings(body.settings || session.settings);
      session.board += 1;
      session.deal = createDeal(session.board, session.settings);
      resetPairsForNewBoard(session);
      ensurePair(session, pair);
      syncSessionPlayers(registry, session, pair, false);
      registry = await saveRegistry(env, registry);
      const data = publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/call") {
      const pairState = ensurePair(session, pair);
      processAutoOpponents(session, pairState);
      const active = currentSeat(session.deal.dealer, pairState.auction);
      const call = body.call;
      if (seat !== active) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Niet aan de beurt", ...data }, 409);
      }
      if (!PARTNER_SEATS.includes(seat)) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Alleen Noord en Zuid bieden op de GSM.", ...data }, 403);
      }
      if (call === "X" && !canDouble(pairState.auction, seat)) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "DBL is nu niet geldig.", ...data }, 400);
      }
      if (call === "XX" && !canRedouble(pairState.auction, seat)) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "RDBL is nu niet geldig.", ...data }, 400);
      }
      if (call !== "P" && call !== "X" && call !== "XX" && (!allContractBids().includes(call) || !isHigherBid(call, pairState.auction))) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Bod is niet geldig", ...data }, 400);
      }
      if (!isAuctionComplete(pairState.auction)) pairState.auction.push({ seat, call });
      syncSessionPlayers(registry, session, pair, isAuctionComplete(pairState.auction));
      registry = await saveRegistry(env, registry);
      const data = publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/undo") {
      const pairState = ensurePair(session, pair);
      const changed = undoAuctionForSeat(pairState, seat);
      if (!changed) {
        const data = publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Er is nog geen bod van jou om terug te nemen.", ...data }, 409);
      }
      syncSessionPlayers(registry, session, pair, isAuctionComplete(pairState.auction));
      registry = await saveRegistry(env, registry);
      const data = publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      const pairState = ensurePair(session, pair);
      const text = String(body.text || "").trim();
      if (text) {
        pairState.chat.push({
          id: pairState.nextChatId,
          seat,
          text: text.slice(0, 500),
          at: belgianTime(),
        });
        pairState.nextChatId += 1;
      }
      const data = publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    return json({ error: "Onbekende actie" }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
}

const EMBEDDED_ASSETS = {
  "/index.html": { body: "﻿<!doctype html>\r\n<html lang=\"nl\">\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\r\n  <meta name=\"theme-color\" content=\"#0e5b42\">\r\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\r\n  <meta name=\"apple-mobile-web-app-title\" content=\"Bridge Bieden\">\r\n  <link rel=\"manifest\" href=\"./manifest.webmanifest\">\r\n  <link rel=\"apple-touch-icon\" href=\"./apple-touch-icon.png\">\r\n  <title>Bridge Bied App</title>\r\n  <style>\r\n    :root{--background:#f4f7f2;--foreground:#18211d;--felt:#0e5b42;--felt-dark:#073b2d;--panel:#fff;--soft:#eef5ef;--line:#cbd8ce;--muted:#627168;--red:#b4233b;--black:#1c2521;--amber:#f1b94e;--blue:#2f6fa3}\r\n    *{box-sizing:border-box}body{margin:0;background:var(--background);color:var(--foreground);font-family:Arial,Helvetica,sans-serif}button,input,select{font:inherit}button{min-height:44px;border:0;border-radius:8px;font-weight:800;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}h1,h2,h3,p{margin-top:0}h1{margin-bottom:0;font-size:clamp(1.45rem,5vw,2.2rem);line-height:1;letter-spacing:0}h2{margin-bottom:0;font-size:1.18rem;line-height:1.15}h3{margin-bottom:8px;font-size:.95rem}\n    .shell{min-height:100svh;padding-bottom:max(20px,env(safe-area-inset-bottom))}.hero{background:linear-gradient(135deg,rgba(14,91,66,.98),rgba(7,59,45,.98));color:#fff;padding:max(10px,env(safe-area-inset-top)) 12px 10px}.hero-inner{display:grid;gap:9px;max-width:1120px;margin:0 auto}.eyebrow,.kicker{margin:0 0 4px;color:rgba(255,255,255,.76);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0}.kicker{color:var(--muted)}.top-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}.seat-switch{display:flex;gap:8px}.seat-switch button,.ghost,.primary,.secondary{padding:0 14px}.seat-switch button{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff}.seat-switch button.active{background:#fff;color:var(--felt-dark)}.device-pill{display:flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.28);border-radius:8px;background:rgba(255,255,255,.1);padding:6px 7px 6px 10px}.device-pill span{font-weight:850}.device-pill button{min-height:32px;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.12);color:#fff;padding:0 9px}.setup-card{max-width:700px;margin:12px auto 0;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:14px}.setup-card p{color:rgba(255,255,255,.82);line-height:1.4}.setup-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}.setup-fields label{display:grid;gap:5px;color:rgba(255,255,255,.82);font-size:.86rem;font-weight:800}.link-box{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:9px}.link-box strong{font-size:1rem}.setup-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.setup-actions button{background:#fff;color:var(--felt-dark);font-size:1rem}.primary{background:var(--amber);color:#211604}.secondary{border:1px solid var(--line);background:#fbfcfb;color:var(--felt-dark)}.ghost{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff}.status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.compact-status{display:flex;flex-wrap:wrap;gap:6px}.compact-status span{border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.1);padding:7px 9px;font-size:.92rem;font-weight:850}.status-card{border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(255,255,255,.1);padding:10px}.status-card span{display:block;color:rgba(255,255,255,.72);font-size:.78rem;font-weight:750}.status-card strong{display:block;margin-top:3px;font-size:.95rem}\n    .content{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:14px;max-width:1120px;margin:0 auto;padding:14px}.panel{border:1px solid var(--line);border-radius:8px;background:var(--panel);padding:14px;box-shadow:0 14px 34px rgba(24,33,29,.08)}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.turn-pill{border:1px solid #c8ddcf;border-radius:8px;background:#e8f6ec;color:#165734;padding:8px 10px;font-size:.84rem;font-weight:850;text-align:right}.turn-pill.done{border-color:#d5c38c;background:#fff5d8;color:#6d4d00}\r\n    .hand-view{display:grid;gap:4px}.suit-line{display:grid;grid-template-columns:28px minmax(0,1fr);gap:7px;align-items:center}.suit-badge{display:grid;place-items:center;width:28px;height:28px;border-radius:7px;background:#f1f5f2;font-size:1.02rem;font-weight:900}.rank-row{min-height:24px;display:flex;align-items:center}.rank-text{font-weight:850;font-size:1.1rem;line-height:1.2;word-break:break-word}.red{color:var(--red)}.black{color:var(--black)}.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.stats span{border-radius:8px;background:var(--soft);color:var(--muted);padding:7px 9px;font-size:.86rem;font-weight:750}.stats strong{color:var(--foreground)}\n    .all-hands{display:grid;grid-template-areas:\"north north north\" \"west center east\" \"south south south\";grid-template-columns:minmax(0,1fr) 16px minmax(0,1fr);gap:7px;align-items:center}.shown-hand{border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:8px;min-width:0}.shown-hand.partner{border-color:#b9d5c3;background:#f5fbf7}.shown-hand h3{margin:0 0 5px;font-size:.94rem}.shown-hand.north,.shown-hand.south{width:min(76%,360px);justify-self:center}.shown-hand.north{grid-area:north}.shown-hand.west{grid-area:west}.shown-hand.east{grid-area:east}.shown-hand.south{grid-area:south}.table-center{grid-area:center;display:grid;place-items:center;min-height:20px;color:var(--muted);font-size:.9rem;font-weight:900}.shown-hand .hand-view{display:grid;grid-template-columns:1fr;gap:2px}.shown-hand .suit-line{display:grid;grid-template-columns:18px minmax(0,1fr);gap:4px;align-items:center;min-width:0}.shown-hand .suit-badge{width:18px;min-width:18px;height:18px;border-radius:5px;background:transparent;font-size:.78rem}.shown-hand .rank-text{display:block;min-width:0;font-size:.86rem;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:clip}.shown-hand .rank-row{min-width:0;min-height:18px}.shown-hand .stats{margin-top:8px;gap:5px}.shown-hand .stats span{padding:5px 7px;font-size:.78rem}\n    .bid-tools{display:flex;justify-content:flex-end;margin:0 0 8px}.bid-pad{display:grid;grid-template-columns:repeat(5,minmax(50px,1fr));gap:8px;max-height:340px;overflow:auto}.bid-pad button{border:1px solid var(--line);background:#fbfcfb;color:var(--foreground)}.bid-pad .pass{grid-column:1/-1;background:var(--blue);color:#fff}.bid-pad .red-bid{color:var(--red)}.notice{margin:10px 0 0;color:var(--muted);font-size:.9rem;line-height:1.35}\n    .auction-table{display:grid;grid-template-columns:repeat(4,minmax(62px,1fr));overflow:hidden;border:1px solid var(--line);border-radius:8px;background:#fbfcfb}.auction-head,.auction-cell{min-height:38px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:7px}.auction-head:nth-child(4n),.auction-cell:nth-child(4n){border-right:0}.auction-head{background:#eef5ef;color:var(--muted);font-size:.86rem;font-weight:850}.auction-head.partner{background:#dff1e5;color:#165734}.auction-cell{display:flex;align-items:center;gap:6px}.auction-cell.partner{background:#f5fbf7}.auction-cell.empty-cell{background:#fbfcfb}.call{display:inline-grid;place-items:center;min-width:42px;min-height:30px;border-radius:6px;font-weight:850}.pass-call{background:#e9eeeb;color:#5e6d64}.contract-call{background:#0f654a;color:#fff}.empty{color:#9aa9a0}\r\n    .score-card{display:grid;gap:10px;border:1px solid #b9d5c3;border-radius:8px;background:#eff8f2;padding:12px}.score-card h3{margin:0;color:#165734}.score-line{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #d4e6da;padding-top:8px;color:var(--muted);font-size:.92rem}.score-line strong{color:var(--foreground);text-align:right}.score-note{margin:0;color:var(--muted);font-size:.82rem;line-height:1.35}.results-list{display:grid;gap:8px}.result-row{display:grid;grid-template-columns:minmax(92px,.8fr) minmax(0,1.35fr) minmax(0,1fr);gap:8px;align-items:start;border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:9px}.result-row strong{font-size:.95rem}.result-row span{color:var(--muted);font-size:.86rem}.result-row.done{border-color:#b9d5c3;background:#f5fbf7}\r\n    .settings{display:grid;gap:10px}.settings-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.settings label{display:grid;gap:5px;color:var(--muted);font-size:.84rem;font-weight:800}select,input{width:100%;min-height:40px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--foreground);padding:0 9px}.filter-grid{display:grid;grid-template-columns:minmax(92px,1fr) repeat(5,minmax(52px,.75fr));gap:7px;overflow-x:auto}.filter-row{display:contents}.filter-head,.filter-row strong{display:flex;align-items:center;min-height:34px;color:var(--muted);font-size:.8rem;font-weight:850}.filter-grid input{text-align:center;min-width:52px}\n    .session-list{display:grid;gap:8px;margin-top:12px}.session-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:9px}.session-row.complete{border-color:rgba(232,246,236,.62);background:rgba(232,246,236,.18)}.session-row strong{display:block}.session-row span{color:rgba(255,255,255,.76);font-size:.84rem}.session-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}.session-status{display:inline-flex;align-items:center;min-height:24px;border-radius:8px;padding:3px 7px;font-size:.78rem;font-weight:850}.session-status.done{background:#e8f6ec;color:#145333}.session-status.busy{background:#fff5d8;color:#6d4d00}.session-actions{display:flex;gap:6px}.session-row button{min-height:36px;background:#fff;color:var(--felt-dark);padding:0 12px}.session-row button.danger{border:1px solid #f0c3c3;background:#fff2f2;color:#8b1e1e}.chat-log{display:grid;gap:8px;max-height:260px;overflow:auto;border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:10px}.chat-msg{display:grid;gap:2px}.chat-msg.mine{text-align:right}.chat-msg span{color:var(--muted);font-size:.75rem;font-weight:750}.chat-msg p{display:inline-block;margin:0;border-radius:8px;background:var(--soft);padding:8px 10px;line-height:1.35}.chat-msg.mine p{background:#dff1e5}.chat-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:10px}.error{margin:0 0 10px;border:1px solid #f0c3c3;border-radius:8px;background:#fff2f2;color:#8b1e1e;padding:9px 10px;font-weight:750}\n    @media (max-width:860px){.content{grid-template-columns:1fr}.status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.settings-row,.setup-fields{grid-template-columns:1fr}}@media (max-width:520px){.content{padding:10px}.hero{padding-left:10px;padding-right:10px}.top-actions{align-items:stretch}.seat-switch,.top-actions .primary,.device-pill{width:100%}.seat-switch button{flex:1}.setup-actions{grid-template-columns:1fr}.bid-pad{grid-template-columns:repeat(4,minmax(50px,1fr))}.auction-head,.auction-cell{padding:6px}.call{min-width:38px}.all-hands{grid-template-columns:minmax(0,1fr) 14px minmax(0,1fr);gap:6px}.table-center{min-height:18px;font-size:.8rem}.shown-hand{padding:7px}.shown-hand.north,.shown-hand.south{width:min(78%,260px)}.shown-hand h3{font-size:.86rem}.shown-hand .rank-text{font-size:.8rem}.shown-hand .suit-line{grid-template-columns:16px minmax(0,1fr);gap:3px}.shown-hand .suit-badge{width:16px;min-width:16px;height:16px}}\n  </style>\r\n</head>\r\n<body>\r\n  <main class=\"shell\" id=\"app\"></main>\r\n  <script>\r\n    const seats = [\"N\", \"E\", \"S\", \"W\"];\r\n    const partnerSeats = [\"N\", \"S\"];\r\n    const suits = [\"S\", \"H\", \"D\", \"C\"];\r\n    const suitMeta = {\r\n      S: { label: \"Schoppen\", short: \"S\", symbol: \"\\u2660\", cls: \"black\" },\n      H: { label: \"Harten\", short: \"H\", symbol: \"\\u2665\", cls: \"red\" },\n      D: { label: \"Ruiten\", short: \"R\", symbol: \"\\u2666\", cls: \"red\" },\n      C: { label: \"Klaveren\", short: \"K\", symbol: \"\\u2663\", cls: \"black\" }\n    };\r\n    const seatNames = { N: \"Noord\", E: \"Oost\", S: \"Zuid\", W: \"West\" };\n    const filterTargets = [\"N\", \"S\", \"E\", \"W\", \"NZ\"];\n    const filterTargetNames = { N: \"Noord\", S: \"Zuid\", E: \"Oost\", W: \"West\", NZ: \"NZ samen\" };\n    const vulnerabilities = [\"Niemand\", \"NZ\", \"OW\", \"Allen\"];\n    function cleanSession(value) {\r\n      const clean = String(value || \"\").toUpperCase().replace(/[^A-Z0-9-]/g, \"\").slice(0, 24);\r\n      return clean.length >= 3 ? clean : \"\";\r\n    }\r\n    function newSessionCode() {\r\n      const chars = \"ABCDEFGHJKLMNPQRSTUVWXYZ23456789\";\r\n      let code = \"\";\r\n      for (let index = 0; index < 6; index += 1) code += chars[Math.floor(Math.random() * chars.length)];\r\n      return code;\r\n    }\r\n    function initialSession() {\n      const params = new URLSearchParams(location.search);\n      const fromUrl = cleanSession(params.get(\"tafel\"));\n      const session = fromUrl || newSessionCode();\n      if (fromUrl) localStorage.setItem(\"biedapp-last-session\", session);\n      if (fromUrl && params.get(\"tafel\") !== session) {\n        params.set(\"tafel\", session);\n        history.replaceState(null, \"\", `${location.pathname}?${params.toString()}${location.hash}`);\n      }\n      return session;\r\n    }\r\n    function storageKey(name, session) {\n      return `biedapp-${name}-${session}`;\n    }\n    function normalizePairName(value) {\n      return String(value || \"\").trim().replace(/\\s+/g, \" \").slice(0, 40) || \"Paar 1\";\n    }\n    function normalizeOptionalName(value) {\n      return String(value || \"\").trim().replace(/\\s+/g, \" \").slice(0, 40);\n    }\n    function pairForPlayers(playerName, partnerName) {\n      const names = [normalizeOptionalName(playerName), normalizeOptionalName(partnerName)].filter(Boolean);\n      if (!names.length) return \"\";\n      return [...new Set(names)].sort((left, right) => left.localeCompare(right, \"nl-BE\")).join(\" + \");\n    }\n    function urlParam(name) {\n      return new URLSearchParams(location.search).get(name) || \"\";\n    }\n    function normalizeSeat(value) {\n      return partnerSeats.includes(value) ? value : \"\";\n    }\n    function writeSessionToUrl(session) {\n      const params = new URLSearchParams(location.search);\n      params.set(\"tafel\", session);\n      history.replaceState(null, \"\", `${location.pathname}?${params.toString()}${location.hash}`);\n    }\n    const sessionId = initialSession();\n    const hasDirectSession = Boolean(cleanSession(urlParam(\"tafel\")));\n    const state = {\n      session: sessionId,\n      player: normalizeOptionalName(urlParam(\"speler\") || localStorage.getItem(\"biedapp-player\")),\n      partner: normalizeOptionalName(urlParam(\"partner\") || localStorage.getItem(storageKey(\"partner\", sessionId))),\n      pair: hasDirectSession ? normalizeOptionalName(urlParam(\"paar\")) || localStorage.getItem(storageKey(\"pair\", sessionId)) || \"\" : \"\",\n      seat: hasDirectSession ? normalizeSeat(urlParam(\"stoel\")) || localStorage.getItem(storageKey(\"seat\", sessionId)) || \"\" : \"\",\n      data: null,\n      draftSettings: null,\n      draftBoard: null,\n      error: \"\",\n      busy: false,\n      canInstall: false,\n      pendingRender: false\n    };\n    let deferredInstallPrompt = null;\n    function switchSession(value) {\n      const nextSession = cleanSession(value);\n      if (!nextSession || nextSession === state.session) return false;\n      state.session = nextSession;\n      state.pair = localStorage.getItem(storageKey(\"pair\", nextSession)) || \"\";\n      state.seat = localStorage.getItem(storageKey(\"seat\", nextSession)) || \"\";\n      state.partner = localStorage.getItem(storageKey(\"partner\", nextSession)) || \"\";\n      state.draftSettings = null;\n      state.draftBoard = null;\n      localStorage.setItem(\"biedapp-last-session\", nextSession);\n      writeSessionToUrl(nextSession);\n      return true;\n    }\n\r\n    function displayCall(call) {\n      if (call === \"P\") return \"Pas\";\n      if (call === \"X\") return \"DBL\";\n      if (call === \"XX\") return \"RDBL\";\n      const level = call.slice(0, 1);\n      const strain = call.slice(1);\n      return strain === \"NT\" ? `${level}SA` : `${level}${suitMeta[strain].symbol}`;\n    }\r\n    function formatNzScore(score) {\r\n      if (score > 0) return `+${score} NZ`;\r\n      if (score < 0) return `${score} NZ`;\r\n      return \"0\";\r\n    }\r\n    function htmlEscape(text) {\r\n      return String(text).replace(/[&<>\"']/g, (ch) => ({ \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" }[ch]));\r\n    }\r\n    function activePair() {\n      return normalizePairName(state.pair || pairForPlayers(state.player, state.partner) || \"Paar 1\");\n    }\n    function apiPath(path) {\n      const params = new URLSearchParams({\n        session: state.session,\n        pair: activePair(),\n        seat: state.seat || \"N\",\n        player: state.player || \"\",\n        partner: state.partner || \"\"\n      });\n      return `${path}?${params.toString()}`;\n    }\n    function apiBody(extra = {}) {\n      return JSON.stringify({\n        session: state.session,\n        pair: activePair(),\n        seat: state.seat || \"N\",\n        player: state.player || \"\",\n        partner: state.partner || \"\",\n        ...extra\n      });\n    }\n    function shareUrl() {\n      const url = new URL(location.href);\n      url.pathname = url.pathname.endsWith(\"/\") ? `${url.pathname}index.html` : url.pathname;\n      url.searchParams.set(\"tafel\", state.session);\n      url.searchParams.set(\"paar\", activePair());\n      if (state.seat) url.searchParams.set(\"stoel\", state.seat === \"N\" ? \"S\" : \"N\");\n      if (state.partner) url.searchParams.set(\"speler\", state.partner);\n      if (state.player) url.searchParams.set(\"partner\", state.player);\n      return url.toString();\n    }\n    async function shareSession() {\n      const url = shareUrl();\r\n      try {\r\n        if (navigator.share) {\r\n          await navigator.share({ title: \"Bridge Bied App\", text: `Bridge sessie ${state.session}`, url });\r\n        } else if (navigator.clipboard) {\r\n          await navigator.clipboard.writeText(url);\r\n          state.error = \"Link gekopieerd. Stuur die via WhatsApp, SMS of mail.\";\r\n          render();\r\n        }\r\n      } catch {\r\n        state.error = url;\r\n        render();\r\n      }\r\n    }\r\n    async function api(path, options = {}) {\n      const response = await fetch(apiPath(path), {\n        ...options,\n        headers: { \"Content-Type\": \"application/json\", ...(options.headers || {}) }\n      });\n      const data = await response.json();\r\n      if (!response.ok && data.error) state.error = data.error;\r\n      else state.error = \"\";\r\n      state.data = data;\r\n      render();\n      return data;\n    }\n    function shouldHoldRender() {\n      const el = document.activeElement;\n      if (!el) return false;\n      return el.matches(\"input, textarea, select\");\n    }\n    function renderWhenFree() {\n      if (shouldHoldRender()) {\n        state.pendingRender = true;\n        return;\n      }\n      state.pendingRender = false;\n      render();\n    }\n    async function refresh() {\n      if (state.busy) return;\n      try {\n        let response;\n        if (!state.player) {\n          response = await fetch(\"/api/players\", { cache: \"no-store\" });\n          const data = await response.json();\n          state.data = { players: data.players || [], mySessions: [] };\n          renderWhenFree();\n          return;\n        }\n        if (!state.seat || !state.pair) {\n          const params = new URLSearchParams({ player: state.player });\n          response = await fetch(`/api/sessions?${params.toString()}`, { cache: \"no-store\" });\n          const data = await response.json();\n          state.data = { players: data.players || [], mySessions: data.sessions || [] };\n          renderWhenFree();\n          return;\n        }\n        response = await fetch(apiPath(\"/api/state\"), { cache: \"no-store\" });\n        state.data = await response.json();\n        renderWhenFree();\n      } catch {\n        state.error = \"Geen verbinding met de biedserver.\";\n        renderWhenFree();\n      }\n    }\n    async function installApp() {\n      if (!deferredInstallPrompt) return;\n      const promptEvent = deferredInstallPrompt;\n      deferredInstallPrompt = null;\n      state.canInstall = false;\n      renderWhenFree();\n      await promptEvent.prompt();\n    }\n    function compactRank(rank) {\n      return rank === \"10\" ? \"T\" : rank;\n    }\n    function rankString(hand, suit) {\n      const value = hand.filter((card) => card.suit === suit).map((card) => compactRank(card.rank)).join(\"\");\n      return value || \"-\";\n    }\n    function handHtml(hand) {\n      return `<div class=\"hand-view\">${suits.map((suit) => `<div class=\"suit-line\"><span class=\"suit-badge ${suitMeta[suit].cls}\">${suitMeta[suit].symbol}</span><div class=\"rank-row\"><span class=\"rank-text ${suitMeta[suit].cls}\">${rankString(hand, suit)}</span></div></div>`).join(\"\")}</div>`;\n    }\n    function statsHtml(stats) {\r\n      return `<div class=\"stats\"><span><strong>${stats.hcp}</strong> punten</span><span><strong>${stats.shape}</strong> verdeling</span><span>${stats.balanced ? \"Gebalanceerd\" : \"Ongebalanceerd\"}</span></div>`;\r\n    }\r\n    function allHandsGridHtml(data) {\r\n      if (!data.complete) return \"\";\r\n      if (!data.allHands) {\r\n        return `<p class=\"notice\">De pagina is vernieuwd, maar de biedserver draait nog op de oude versie. Stop het zwarte servervenster en start <strong>start_biedapp.bat</strong> opnieuw.</p>`;\r\n      }\r\n      const order = [\"N\", \"W\", \"E\", \"S\"];\n      const area = { N: \"north\", E: \"east\", S: \"south\", W: \"west\" };\n      return `<div class=\"all-hands\">${order.map((seat) => `<div class=\"shown-hand ${area[seat]} ${partnerSeats.includes(seat) ? \"partner\" : \"\"}\"><h3>${seatNames[seat]}</h3>${handHtml(data.allHands[seat])}</div>`).join(\"\")}<div class=\"table-center\">*</div></div>`;\n    }\n    function auctionRoundRows(auction, dealer) {\r\n      const rows = [];\r\n      const dealerIndex = seats.indexOf(dealer);\r\n      auction.forEach((entry, index) => {\r\n        const rowIndex = Math.floor((dealerIndex + index) / seats.length);\r\n        if (!rows[rowIndex]) rows[rowIndex] = { N: null, E: null, S: null, W: null };\r\n        rows[rowIndex][entry.seat] = entry.call;\r\n      });\r\n      return rows.length ? rows : [{ N: null, E: null, S: null, W: null }];\r\n    }\r\n    function auctionTableHtml(auction, dealer) {\r\n      const rounds = auctionRoundRows(auction, dealer);\r\n      return `<div class=\"auction-table\">${seats.map((seat) => `<div class=\"auction-head ${partnerSeats.includes(seat) ? \"partner\" : \"\"}\">${seatNames[seat]}</div>`).join(\"\")}${rounds.map((round) => seats.map((seat) => {\r\n        const call = round[seat];\r\n        return `<div class=\"auction-cell ${partnerSeats.includes(seat) ? \"partner\" : \"\"} ${call ? \"\" : \"empty-cell\"}\">${call ? `<span class=\"call ${call === \"P\" ? \"pass-call\" : \"contract-call\"}\">${displayCall(call)}</span>` : `<span class=\"empty\">&middot;</span>`}</div>`;\n      }).join(\"\")).join(\"\")}</div>`;\r\n    }\r\n    function settingsHtml(settings) {\r\n      return `<div class=\"settings\">\r\n        <div class=\"settings-row\">\n          <label>Dealer<select data-setting=\"dealerMode\"><option value=\"cycle\"${settings.dealerMode === \"cycle\" ? \" selected\" : \"\"}>Boardvolgorde</option><option value=\"random\"${settings.dealerMode === \"random\" ? \" selected\" : \"\"}>Random</option>${seats.map((seat) => `<option value=\"${seat}\"${settings.dealerMode === seat ? \" selected\" : \"\"}>${seatNames[seat]}</option>`).join(\"\")}</select></label>\n          <label>Kwets<select data-setting=\"vulnerabilityMode\"><option value=\"cycle\"${settings.vulnerabilityMode === \"cycle\" ? \" selected\" : \"\"}>Boardvolgorde</option><option value=\"random\"${settings.vulnerabilityMode === \"random\" ? \" selected\" : \"\"}>Random</option>${vulnerabilities.map((vuln) => `<option value=\"${vuln}\"${settings.vulnerabilityMode === vuln ? \" selected\" : \"\"}>${vuln}</option>`).join(\"\")}</select></label>\n          <label>OW<select data-setting=\"opponentMode\"><option value=\"pass\"${settings.opponentMode === \"pass\" ? \" selected\" : \"\"}>Past automatisch</option><option value=\"auto\"${settings.opponentMode === \"auto\" ? \" selected\" : \"\"}>Biedt simpel mee</option></select></label>\n        </div>\n        <div class=\"filter-grid\">\r\n          <div class=\"filter-head\">Hand</div><div class=\"filter-head\">Min pntn</div>${suits.map((suit) => `<div class=\"filter-head\">${suitMeta[suit].short}</div>`).join(\"\")}\r\n          ${filterTargets.map((target) => `<div class=\"filter-row\"><strong>${filterTargetNames[target]}</strong><input data-hcp=\"${target}\" type=\"number\" min=\"0\" max=\"${target === \"NZ\" ? 40 : 37}\" value=\"${settings.filters[target].minHcp}\">${suits.map((suit) => `<input data-suit=\"${target}:${suit}\" type=\"number\" min=\"0\" max=\"${target === \"NZ\" ? 26 : 13}\" value=\"${settings.filters[target].minSuitLengths[suit]}\">`).join(\"\")}</div>`).join(\"\")}\r\n        </div>\r\n      </div>`;\r\n    }\r\n    function scoreHtml(score) {\r\n      if (!score) return \"\";\r\n      return `<div class=\"score-card\"><h3>Score na bieding</h3><div class=\"score-line\"><span>Par/richtscore</span><strong>${score.par.label} &middot; ${formatNzScore(score.par.nzScore)}</strong></div><div class=\"score-line\"><span>Eindcontract</span><strong>${score.final.label} &middot; ${formatNzScore(score.final.nzScore)}</strong></div><div class=\"score-line\"><span>Eindbod NZ</span><strong>${score.nzJudgement}</strong></div><p class=\"score-note\">${score.note}</p></div>`;\n    }\r\n    function resultsHtml(results) {\r\n      const rows = (results || []).slice().sort((left, right) => left.pair.localeCompare(right.pair));\r\n      if (!rows.length) return `<p class=\"notice\">Nog geen paren in deze sessie.</p>`;\r\n      return `<div class=\"results-list\">${rows.map((row) => `<div class=\"result-row ${row.complete ? \"done\" : \"\"}\"><strong>${htmlEscape(row.pair)}</strong><span>${row.complete && row.final ? `${htmlEscape(row.final.label)} &middot; ${formatNzScore(row.final.nzScore)}` : `${row.calls || 0} biedingen`}</span><span>${row.complete ? htmlEscape(row.nzJudgement || \"\") : \"Nog bezig\"}</span></div>`).join(\"\")}</div>`;\n    }\r\n    function chatHtml(chat) {\r\n      return `<div class=\"chat-log\">${chat.length ? chat.map((msg) => `<div class=\"chat-msg ${msg.seat === state.seat ? \"mine\" : \"\"}\"><span>${seatNames[msg.seat]} &middot; ${msg.at}</span><p>${htmlEscape(msg.text)}</p></div>`).join(\"\") : `<p class=\"notice\">Nog geen chatberichten.</p>`}</div><form class=\"chat-form\" data-chat-form><input name=\"text\" autocomplete=\"off\" placeholder=\"Bericht aan partner\"><button class=\"primary\" type=\"submit\">Stuur</button></form>`;\n    }\r\n    function cloneSettings(settings) {\r\n      return JSON.parse(JSON.stringify(settings));\r\n    }\r\n    function savedDraftKey(board) {\r\n      return `biedapp-settings-draft-${state.session}-${board}`;\r\n    }\r\n    function settingsDraft(data) {\r\n      if (!state.draftSettings || state.draftBoard !== data.board) {\r\n        const saved = localStorage.getItem(savedDraftKey(data.board));\r\n        try {\r\n          state.draftSettings = saved ? JSON.parse(saved) : cloneSettings(data.settings);\r\n        } catch {\r\n          state.draftSettings = cloneSettings(data.settings);\r\n        }\r\n        state.draftBoard = data.board;\r\n      }\r\n      return state.draftSettings;\r\n    }\r\n    function saveDraftSettings() {\n      if (state.draftSettings && state.draftBoard) {\n        localStorage.setItem(savedDraftKey(state.draftBoard), JSON.stringify(state.draftSettings));\n      }\n    }\n    function sessionRowHtml(item) {\n      const partnerText = item.partner ? `Met ${item.partner}` : item.pair;\n      const status = item.complete ? \"Klaar\" : \"Bezig\";\n      return `<div class=\"session-row ${item.complete ? \"complete\" : \"\"}\"><div><strong>${htmlEscape(partnerText)}</strong><div class=\"session-meta\"><span class=\"session-status ${item.complete ? \"done\" : \"busy\"}\">${status}</span><span>Board ${item.board}</span><span>${seatNames[item.seat]}</span></div></div><div class=\"session-actions\"><button data-open-session=\"${htmlEscape(item.sessionId)}\" data-open-seat=\"${htmlEscape(item.seat)}\" data-open-pair=\"${htmlEscape(item.pair)}\" data-open-partner=\"${htmlEscape(item.partner)}\" type=\"button\">Open</button><button class=\"danger\" data-delete-session=\"${htmlEscape(item.sessionId)}\" data-delete-board=\"${htmlEscape(item.board)}\" data-delete-pair=\"${htmlEscape(item.pair)}\" data-delete-partner=\"${htmlEscape(item.partner)}\" type=\"button\">Wis</button></div></div>`;\n    }\n    function setupHtml(data) {\n      const playerValue = htmlEscape(state.player || \"\");\n      const partnerValue = htmlEscape(state.partner || \"\");\n      const pairValue = htmlEscape(activePair());\n      const playerOptions = (data.players || []).map((name) => `<option value=\"${htmlEscape(name)}\"></option>`).join(\"\");\n      const mySessions = (data.mySessions || []).filter((item) => item && item.sessionId);\n      const sessionRows = mySessions.length\n        ? `<div class=\"session-list\">${mySessions.map(sessionRowHtml).join(\"\")}</div>`\n        : `<p class=\"notice\">Nog geen boards voor ${playerValue || \"deze speler\"}.</p>`;\n      if (!state.player) {\n        return `<section class=\"hero\"><div class=\"hero-inner\"><div><p class=\"eyebrow\">Bridge bied app</p><h1>Wie speelt?</h1></div><div class=\"setup-card\"><p>Geef je naam in. Daarna zie je automatisch je biedsessies en uitnodigingen.</p><div class=\"setup-fields\"><label>Jouw naam<input data-player-input list=\"player-options\" value=\"${playerValue}\" placeholder=\"bv. Koen\" autocomplete=\"name\"></label></div><div class=\"setup-actions\"><button data-save-player type=\"button\">Verder</button></div><datalist id=\"player-options\">${playerOptions}</datalist></div></div></section>`;\n      }\n      return `<section class=\"hero\"><div class=\"hero-inner\"><div><p class=\"eyebrow\">Bridge bied app</p><h1>${playerValue}</h1></div><div class=\"setup-card\"><div class=\"link-box\"><strong>Nieuw board</strong><button class=\"ghost\" data-reset-player type=\"button\">Andere speler</button></div><p>Kies of zoek je partner. De partner ziet boards automatisch wanneer die met dezelfde naam inlogt.</p><div class=\"setup-fields\"><label>Partner<input data-partner-input list=\"player-options\" value=\"${partnerValue}\" placeholder=\"zoek of typ naam\"></label><label>Paar<input data-pair-input value=\"${pairValue}\" placeholder=\"Paar 1\"></label></div><div class=\"setup-actions\"><button data-new-session-seat=\"N\" type=\"button\">Start als Noord</button><button data-new-session-seat=\"S\" type=\"button\">Start als Zuid</button></div>${sessionRows}<datalist id=\"player-options\">${playerOptions}</datalist></div></div></section>`;\n    }\n    function readSetupFields() {\n      const sessionInput = document.querySelector(\"[data-session-input]\");\n      if (sessionInput) switchSession(sessionInput.value);\n      const playerInput = document.querySelector(\"[data-player-input]\");\n      const partnerInput = document.querySelector(\"[data-partner-input]\");\n      const pairInput = document.querySelector(\"[data-pair-input]\");\n      state.player = normalizeOptionalName(playerInput ? playerInput.value : state.player);\n      state.partner = normalizeOptionalName(partnerInput ? partnerInput.value : state.partner);\n      const generatedPair = pairForPlayers(state.player, state.partner);\n      const manualPair = normalizeOptionalName(pairInput ? pairInput.value : state.pair);\n      state.pair = normalizePairName(generatedPair || manualPair || \"Paar 1\");\n      localStorage.setItem(\"biedapp-player\", state.player);\n      localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n      localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n    }\n    function saveDeviceChoice() {\n      localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n      localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n      localStorage.setItem(storageKey(\"seat\", state.session), state.seat);\n      localStorage.setItem(\"biedapp-last-session\", state.session);\n      localStorage.setItem(\"biedapp-player\", state.player);\n    }\n    async function registerPlayers() {\n      await fetch(\"/api/players\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: apiBody() }).catch(() => undefined);\n    }\n    async function deleteStoredSession(button) {\n      const board = button.dataset.deleteBoard || \"?\";\n      const partner = button.dataset.deletePartner || button.dataset.deletePair || \"dit partnership\";\n      if (!confirm(`Board ${board} met ${partner} verwijderen?`)) return;\n      state.busy = true;\n      try {\n        const response = await fetch(\"/api/delete-session\", {\n          method: \"POST\",\n          headers: { \"Content-Type\": \"application/json\" },\n          body: JSON.stringify({\n            session: button.dataset.deleteSession,\n            pair: button.dataset.deletePair,\n            player: state.player,\n            partner: button.dataset.deletePartner || state.partner,\n            seat: state.seat || \"N\",\n          }),\n        });\n        const data = await response.json();\n        if (!response.ok) state.error = data.error || \"Board kon niet verwijderd worden.\";\n        else {\n          state.error = \"\";\n          state.data = { ...(state.data || {}), players: data.players || [], mySessions: data.sessions || [] };\n        }\n      } catch {\n        state.error = \"Geen verbinding met de biedserver.\";\n      }\n      state.busy = false;\n      render();\n    }\n    async function startNewSession(seat) {\n      readSetupFields();\n      state.seat = seat;\n      state.busy = true;\n      try {\n        const response = await fetch(\"/api/new-session\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: apiBody({ settings: state.draftSettings || state.data?.settings }) });\n        const data = await response.json();\n        if (response.ok && data.sessionId) {\n          state.session = data.sessionId;\n          state.data = data;\n          writeSessionToUrl(state.session);\n          saveDeviceChoice();\n          state.error = \"\";\n        } else {\n          state.error = data.error || \"Nieuwe sessie kon niet gestart worden.\";\n        }\n      } catch {\n        state.error = \"Nieuwe sessie kon niet gestart worden.\";\n      }\n      state.busy = false;\n      render();\n    }\n    function shortVulnerability(value) {\n      if (value === \"Niemand\") return \"-\";\n      if (value === \"Allen\") return \"Allen\";\n      return value;\n    }\n    function render() {\n      const data = state.data;\r\n      if (!data) {\r\n        document.getElementById(\"app\").innerHTML = `<section class=\"hero\"><div class=\"hero-inner\"><p class=\"eyebrow\">Bridge bied app</p><h1>Verbinden...</h1></div></section>`;\r\n        return;\r\n      }\r\n      if (!state.player || !state.seat || !state.pair) {\n        document.getElementById(\"app\").innerHTML = setupHtml(data);\n        return;\n      }\n      const auctionTable = auctionTableHtml(data.auction, data.dealer);\n      const myTurn = data.activeSeat === state.seat && !data.complete;\n      const results = data.results || [];\n      const pairCountChip = results.length > 1 ? `<span>${results.length} paren</span>` : \"\";\n      document.getElementById(\"app\").innerHTML = `\n        <section class=\"hero\">\r\n          <div class=\"hero-inner\">\r\n            <div class=\"top-actions\">\n              <div><p class=\"eyebrow\">Bridge bied app</p><h1>${htmlEscape(state.player || \"Noord/Zuid\")}</h1></div>\n              <div class=\"device-pill\"><span>${htmlEscape(data.pair)} &middot; ${seatNames[state.seat]}</span>${state.canInstall ? `<button data-install-app type=\"button\">App</button>` : \"\"}<button data-reset-seat type=\"button\">Overzicht</button></div>\n            </div>\n            <div class=\"compact-status\">\n              <span>${data.board}:${data.dealer}/${shortVulnerability(data.vulnerability)}</span>\n              <span>Beurt ${data.complete ? \"klaar\" : data.activeSeat}</span>\n              <span>Paar ${htmlEscape(data.pair)}</span>\n              ${pairCountChip}\n            </div>\n          </div>\n        </section>\n        <section class=\"content\">\r\n          <div class=\"panel\">\r\n            ${state.error ? `<p class=\"error\">${htmlEscape(state.error)}</p>` : \"\"}\n            <div class=\"panel-head\"><div><p class=\"kicker\">${data.complete ? \"Open handen\" : \"Jouw hand\"}</p><h2>${data.complete ? \"Alle vier handen\" : seatNames[state.seat]}</h2></div><div class=\"turn-pill ${data.complete ? \"done\" : \"\"}\">${data.complete ? \"Klaar\" : myTurn ? \"Jij biedt\" : `Wacht op ${seatNames[data.activeSeat]}`}</div></div>\n            ${data.complete ? allHandsGridHtml(data) : handHtml(data.myHand)}\n          </div>\n          <div class=\"panel\">\n            <div class=\"panel-head\"><div><p class=\"kicker\">Biedverloop</p><h2>Vanaf ${seatNames[data.dealer]}</h2></div></div>\n            ${auctionTable}\n          </div>\n          <div class=\"panel\">\n            <div class=\"panel-head\"><div><p class=\"kicker\">Bieden</p><h2>${myTurn ? \"Kies je bod\" : data.complete ? \"Bieding klaar\" : \"Nog niet aan de beurt\"}</h2></div></div>\n            ${scoreHtml(data.score)}\n            <div class=\"bid-tools\"><button class=\"secondary\" data-undo type=\"button\" ${data.canUndo ? \"\" : \"disabled\"}>Undo</button></div>\n            ${data.complete ? \"\" : `<div class=\"bid-pad\"><button class=\"pass\" data-call=\"P\" ${myTurn ? \"\" : \"disabled\"} type=\"button\">Pas</button>${data.legalBids.map((bid) => `<button class=\"${bid.endsWith(\"H\") || bid.endsWith(\"D\") ? \"red-bid\" : \"\"}\" data-call=\"${bid}\" ${myTurn ? \"\" : \"disabled\"} type=\"button\">${displayCall(bid)}</button>`).join(\"\")}</div><p class=\"notice\">Er is geen biedadvies zichtbaar. Noord en Zuid beslissen zelf.</p>`}\n          </div>\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Vergelijken</p><h2>Resultaten paren</h2></div></div>\r\n            ${resultsHtml(results)}\r\n          </div>\r\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Nieuwe bieding</p><h2>Instellingen</h2></div><button class=\"primary\" data-new-deal type=\"button\">Nieuwe random hand</button></div>\r\n            <p class=\"notice\">${data.matchedFilters ? `Laatste deal gevonden in ${data.attempts} poging${data.attempts === 1 ? \"\" : \"en\"}.` : `Geen match binnen ${data.attempts} pogingen; filter is te streng.`}</p>\r\n            ${settingsHtml(settingsDraft(data))}\r\n          </div>\r\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Chat</p><h2>Overleg</h2></div></div>\r\n            ${chatHtml(data.chat)}\r\n          </div>\r\n        </section>`;\r\n    }\r\n    document.addEventListener(\"click\", async (event) => {\r\n      const button = event.target.closest(\"button\");\n      if (!button) return;\n      if (button.dataset.savePlayer !== undefined) {\n        readSetupFields();\n        state.seat = \"\";\n        state.pair = \"\";\n        await registerPlayers();\n        refresh();\n        return;\n      }\n      if (button.dataset.resetPlayer !== undefined) {\n        state.player = \"\";\n        state.partner = \"\";\n        state.pair = \"\";\n        state.seat = \"\";\n        localStorage.removeItem(\"biedapp-player\");\n        render();\n        return;\n      }\n      if (button.dataset.openSession) {\n        state.session = button.dataset.openSession;\n        state.seat = button.dataset.openSeat || \"N\";\n        state.pair = normalizePairName(button.dataset.openPair);\n        state.partner = normalizeOptionalName(button.dataset.openPartner);\n        writeSessionToUrl(state.session);\n        saveDeviceChoice();\n        refresh();\n        return;\n      }\n      if (button.dataset.deleteSession) {\n        await deleteStoredSession(button);\n        return;\n      }\n      if (button.dataset.newSessionSeat) {\n        await startNewSession(button.dataset.newSessionSeat);\n        return;\n      }\n      if (button.dataset.setupSeat) {\n        readSetupFields();\n        state.seat = button.dataset.setupSeat;\n        saveDeviceChoice();\n        await registerPlayers();\n        refresh();\n      }\n      if (button.dataset.resetSeat !== undefined) {\n        localStorage.removeItem(storageKey(\"pair\", state.session));\n        localStorage.removeItem(storageKey(\"seat\", state.session));\n        state.pair = \"\";\n        state.seat = \"\";\n        render();\n      }\n      if (button.dataset.shareLink !== undefined) {\n        await shareSession();\n      }\n      if (button.dataset.installApp !== undefined) {\n        await installApp();\n      }\n      if (button.dataset.call) {\n        state.busy = true;\n        await api(\"/api/call\", { method: \"POST\", body: apiBody({ call: button.dataset.call }) });\n        state.busy = false;\n      }\n      if (button.dataset.undo !== undefined) {\n        state.busy = true;\n        await api(\"/api/undo\", { method: \"POST\", body: apiBody() });\n        state.busy = false;\n      }\n      if (button.dataset.newDeal !== undefined) {\n        state.busy = true;\r\n        await api(\"/api/new-deal\", { method: \"POST\", body: apiBody({ settings: state.draftSettings || state.data.settings }) });\r\n        if (state.draftBoard) localStorage.removeItem(savedDraftKey(state.draftBoard));\r\n        state.draftSettings = null;\r\n        state.draftBoard = null;\r\n        state.busy = false;\r\n      }\r\n    });\r\n    function updateSettingFromElement(el) {\r\n      if (!state.data) return;\r\n      const settings = settingsDraft(state.data);\n      if (el.dataset.setting === \"dealerMode\") settings.dealerMode = el.value;\n      if (el.dataset.setting === \"vulnerabilityMode\") settings.vulnerabilityMode = el.value;\n      if (el.dataset.setting === \"opponentMode\") settings.opponentMode = el.value;\n      if (el.dataset.hcp) settings.filters[el.dataset.hcp].minHcp = Number(el.value || 0);\r\n      if (el.dataset.suit) {\r\n        const [target, suit] = el.dataset.suit.split(\":\");\r\n        settings.filters[target].minSuitLengths[suit] = Number(el.value || 0);\r\n      }\r\n      saveDraftSettings();\r\n    }\r\n    document.addEventListener(\"change\", (event) => {\n      const el = event.target;\n      if (el.dataset.sessionInput !== undefined) {\n        if (switchSession(el.value)) refresh();\n        return;\n      }\n      if (el.dataset.setting || el.dataset.hcp || el.dataset.suit) updateSettingFromElement(el);\n    });\n    document.addEventListener(\"input\", (event) => {\n      const el = event.target;\n      if (el.dataset.playerInput !== undefined) {\n        state.player = normalizeOptionalName(el.value);\n        localStorage.setItem(\"biedapp-player\", state.player);\n        return;\n      }\n      if (el.dataset.partnerInput !== undefined) {\n        state.partner = normalizeOptionalName(el.value);\n        localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n        return;\n      }\n      if (el.dataset.pairInput !== undefined) {\n        state.pair = normalizePairName(el.value);\n        localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n        return;\n      }\n      if (el.dataset.hcp || el.dataset.suit) updateSettingFromElement(el);\n    });\n    document.addEventListener(\"focusout\", () => {\n      setTimeout(() => {\n        if (state.pendingRender && !shouldHoldRender()) {\n          state.pendingRender = false;\n          render();\n        }\n      }, 60);\n    });\n    document.addEventListener(\"submit\", async (event) => {\r\n      const form = event.target.closest(\"[data-chat-form]\");\r\n      if (!form) return;\r\n      event.preventDefault();\r\n      const input = form.elements.text;\r\n      const text = input.value.trim();\r\n      input.value = \"\";\r\n      if (text) await api(\"/api/chat\", { method: \"POST\", body: apiBody({ text }) });\r\n    });\r\n    refresh();\n    window.addEventListener(\"beforeinstallprompt\", (event) => {\n      event.preventDefault();\n      deferredInstallPrompt = event;\n      state.canInstall = true;\n      renderWhenFree();\n    });\n    window.addEventListener(\"appinstalled\", () => {\n      deferredInstallPrompt = null;\n      state.canInstall = false;\n      renderWhenFree();\n    });\n    setInterval(refresh, 4000);\n    if (\"serviceWorker\" in navigator && location.protocol !== \"file:\") {\r\n      navigator.serviceWorker.register(\"./sw.js\").catch(() => undefined);\r\n    }\r\n  </script>\r\n</body>\r\n</html>\r\n", type: "text/html; charset=utf-8" },
  "/manifest.webmanifest": { body: "{\n  \"name\": \"Bridge Bied App\",\n  \"short_name\": \"Bridge Bieden\",\n  \"description\": \"Noord/Zuid bridge biedtrainer met random handen, filters, par-info en chat.\",\n  \"lang\": \"nl\",\n  \"start_url\": \"/index.html\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"orientation\": \"portrait-primary\",\n  \"background_color\": \"#f4f7f2\",\n  \"theme_color\": \"#0e5b42\",\n  \"icons\": [\n    {\n      \"src\": \"/icon-192.png\",\n      \"sizes\": \"192x192\",\n      \"type\": \"image/png\",\n      \"purpose\": \"any maskable\"\n    },\n    {\n      \"src\": \"/icon-512.png\",\n      \"sizes\": \"512x512\",\n      \"type\": \"image/png\",\n      \"purpose\": \"any maskable\"\n    }\n  ]\n}\n", type: "application/manifest+json; charset=utf-8" },
  "/sw.js": { body: "const CACHE_NAME = \"bridge-bied-app-v22\";\nconst APP_SHELL = [\"/index.html\", \"/manifest.webmanifest\", \"/icon-192.png\", \"/icon-512.png\", \"/apple-touch-icon.png\"];\n\nself.addEventListener(\"install\", (event) => {\n  event.waitUntil(\n    caches\n      .open(CACHE_NAME)\n      .then((cache) => cache.addAll(APP_SHELL))\n      .catch(() => undefined),\n  );\n  self.skipWaiting();\n});\n\nself.addEventListener(\"activate\", (event) => {\n  event.waitUntil(\n    caches\n      .keys()\n      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),\n  );\n  self.clients.claim();\n});\n\nself.addEventListener(\"fetch\", (event) => {\n  if (event.request.method !== \"GET\") {\n    return;\n  }\n\n  const url = new URL(event.request.url);\n\n  if (url.origin !== self.location.origin) {\n    return;\n  }\n\n  if (url.pathname.startsWith(\"/api/\")) {\n    event.respondWith(fetch(event.request));\n    return;\n  }\n\n  event.respondWith(\n    fetch(event.request)\n      .then((response) => {\n        const copy = response.clone();\n        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);\n        return response;\n      })\n      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(\"/index.html\"))),\n  );\n});\n", type: "text/javascript; charset=utf-8" },
  "/favicon.svg": { body: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n<path d=\"M22 19.2727C22 20.779 20.779 22 19.2727 22H14.7273C13.221 22 12 20.779 12 19.2727V12H19.2727C20.779 12 22 13.221 22 14.7273V19.2727Z\" fill=\"#68C4FF\"/>\r\n<path d=\"M20 2C21.1046 2 22 2.89543 22 4V7C22 8.10457 21.1046 9 20 9H17C15.8954 9 15 8.10457 15 7V4C15 2.89543 15.8954 2 17 2H20Z\" fill=\"#0C79D8\"/>\r\n<path d=\"M7 15C8.10457 15 9 15.8954 9 17V20C9 21.1046 8.10457 22 7 22H4C2.89543 22 2 21.1046 2 20V17C2 15.8954 2.89543 15 4 15H7Z\" fill=\"#0C79D8\"/>\r\n<path d=\"M12 12H4.72727C3.22104 12 2 10.779 2 9.27273V4.72727C2 3.22104 3.22104 2 4.72727 2H9.27273C10.779 2 12 3.22104 12 4.72727V12Z\" fill=\"#2E9EFF\"/>\r\n</svg>\r\n", type: "image/svg+xml; charset=utf-8" },
  "/icon-192.png": { base64: "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", type: "image/png" },
  "/icon-512.png": { base64: "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", type: "image/png" },
  "/apple-touch-icon.png": { base64: "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", type: "image/png" },
};

function base64ToBytes(value) {
  const raw = atob(value);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

function assetResponse(asset) {
  const body = asset.base64 ? base64ToBytes(asset.base64) : asset.body;
  return new Response(body, { headers: { "content-type": asset.type, "cache-control": "no-store" } });
}

async function serveAsset(request, env) {
  const url = new URL(request.url);
  let pathname = url.pathname;
  if (pathname === "/" || pathname === "") pathname = "/index.html";
  const asset = EMBEDDED_ASSETS[pathname] || EMBEDDED_ASSETS["/index.html"];
  return assetResponse(asset);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    return serveAsset(request, env);
  },
};
