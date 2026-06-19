import DDS_WASM_MODULE from "./bridge-dds.wasm";
// Embedded bridge-dds runtime. Source: https://github.com/bookchris/bridge-dds-js
var process = undefined;
var WorkerGlobalScope = globalThis.WorkerGlobalScope || function WorkerGlobalScope() {};
var self = { location: { href: "" } };
var bridgeDdsLoader = (() => {
  var _scriptName = import.meta.url;
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

var Module=moduleArg;var readyPromiseResolve,readyPromiseReject;var readyPromise=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof WorkerGlobalScope!="undefined";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&process.type!="renderer";var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(ENVIRONMENT_IS_NODE){throw new Error("DDS Node runtime is disabled for the Cloudflare Worker build")}var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var scriptDirectory="";var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){if(typeof process=="undefined"||!process.release||process.release.name!=="node")throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");var nodeVersion=process.versions.node;var numericVersion=nodeVersion.split(".").slice(0,3);numericVersion=numericVersion[0]*1e4+numericVersion[1]*100+numericVersion[2].split("-")[0]*1;if(numericVersion<16e4){throw new Error("This emscripten-generated code requires node v16.0.0 (detected v"+nodeVersion+")")}var fs=undefined;var nodePath=undefined;if(!import.meta.url.startsWith("data:")){scriptDirectory=nodePath.dirname(undefined.fileURLToPath(import.meta.url))+"/"}readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);assert(Buffer.isBuffer(ret));return ret};readAsync=async(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");assert(binary?Buffer.isBuffer(ret):typeof ret=="string");return ret};if(process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else if(ENVIRONMENT_IS_SHELL){if(typeof process=="object"&&typeof require==="function"||typeof window=="object"||typeof WorkerGlobalScope!="undefined")throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)")}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptName){scriptDirectory=_scriptName}if(scriptDirectory.startsWith("blob:")){scriptDirectory=""}else{scriptDirectory=scriptDirectory.slice(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}if(!(typeof window=="object"||typeof WorkerGlobalScope!="undefined"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");{if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=async url=>{if(isFileURI(url)){return new Promise((resolve,reject)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){resolve(xhr.response);return}reject(xhr.status)};xhr.onerror=reject;xhr.send(null)})}var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{throw new Error("environment detection error")}var out=console.log.bind(console);var err=console.error.bind(console);assert(!ENVIRONMENT_IS_SHELL,"shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");var wasmBinary;if(typeof WebAssembly!="object"){err("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort("Assertion failed"+(text?": "+text:""))}}var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAP64,HEAPU64,HEAPF64;var runtimeInitialized=false;var isFileURI=filename=>typeof filename==="string"&&filename.startsWith("file://");function writeStackCookie(){var max=_emscripten_stack_get_end();assert((max&3)==0);if(max==0){max+=4}HEAPU32[max>>2]=34821223;HEAPU32[max+4>>2]=2310721022;HEAPU32[0>>2]=1668509029}function checkStackCookie(){if(ABORT)return;var max=_emscripten_stack_get_end();if(max==0){max+=4}var cookie1=HEAPU32[max>>2];var cookie2=HEAPU32[max+4>>2];if(cookie1!=34821223||cookie2!=2310721022){abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`)}if(HEAPU32[0>>2]!=1668509029){abort("Runtime error: The application has corrupted its heap memory area (address zero)!")}}(()=>{var h16=new Int16Array(1);var h8=new Int8Array(h16.buffer);h16[0]=25459;if(h8[0]!==115||h8[1]!==99)throw"Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)"})();function consumedModuleProp(prop){if(!Object.getOwnPropertyDescriptor(Module,prop)){Object.defineProperty(Module,prop,{configurable:true,set(){abort(`Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`)}})}}function ignoredModuleProp(prop){if(Object.getOwnPropertyDescriptor(Module,prop)){abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`)}}function isExportedByForceFilesystem(name){return name==="FS_createPath"||name==="FS_createDataFile"||name==="FS_createPreloadedFile"||name==="FS_unlink"||name==="addRunDependency"||name==="FS_createLazyFile"||name==="FS_createDevice"||name==="removeRunDependency"}function hookGlobalSymbolAccess(sym,func){if(typeof globalThis!="undefined"&&!Object.getOwnPropertyDescriptor(globalThis,sym)){Object.defineProperty(globalThis,sym,{configurable:true,get(){func();return undefined}})}}function missingGlobal(sym,msg){hookGlobalSymbolAccess(sym,()=>{warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`)})}missingGlobal("buffer","Please use HEAP8.buffer or wasmMemory.buffer");missingGlobal("asm","Please use wasmExports instead");function missingLibrarySymbol(sym){hookGlobalSymbolAccess(sym,()=>{var msg=`\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;var librarySymbol=sym;if(!librarySymbol.startsWith("_")){librarySymbol="$"+sym}msg+=` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;if(isExportedByForceFilesystem(sym)){msg+=". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"}warnOnce(msg)});unexportedRuntimeSymbol(sym)}function unexportedRuntimeSymbol(sym){if(!Object.getOwnPropertyDescriptor(Module,sym)){Object.defineProperty(Module,sym,{configurable:true,get(){var msg=`'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;if(isExportedByForceFilesystem(sym)){msg+=". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"}abort(msg)}})}}var runtimeDebug=true;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);HEAP16=new Int16Array(b);HEAPU8=new Uint8Array(b);HEAPU16=new Uint16Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}assert(typeof Int32Array!="undefined"&&typeof Float64Array!=="undefined"&&Int32Array.prototype.subarray!=undefined&&Int32Array.prototype.set!=undefined,"JS engine does not provide full typed array support");function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}consumedModuleProp("preRun");callRuntimeCallbacks(onPreRuns)}function initRuntime(){assert(!runtimeInitialized);runtimeInitialized=true;checkStackCookie();if(!Module["noFSInit"]&&!FS.initialized)FS.init();TTY.init();wasmExports["__wasm_call_ctors"]();FS.ignorePermissions=false}function postRun(){checkStackCookie();if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}consumedModuleProp("postRun");callRuntimeCallbacks(onPostRuns)}var runDependencies=0;var dependenciesFulfilled=null;var runDependencyTracking={};var runDependencyWatcher=null;function getUniqueRunDependency(id){var orig=id;while(1){if(!runDependencyTracking[id])return id;id=orig+Math.random()}}function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies);if(id){assert(!runDependencyTracking[id]);runDependencyTracking[id]=1;if(runDependencyWatcher===null&&typeof setInterval!="undefined"){runDependencyWatcher=setInterval(()=>{if(ABORT){clearInterval(runDependencyWatcher);runDependencyWatcher=null;return}var shown=false;for(var dep in runDependencyTracking){if(!shown){shown=true;err("still waiting on run dependencies:")}err(`dependency: ${dep}`)}if(shown){err("(end of list)")}},1e4)}}else{err("warning: run dependency added without ID")}}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(id){assert(runDependencyTracking[id]);delete runDependencyTracking[id]}else{err("warning: run dependency removed without ID")}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}function createExportWrapper(name,nargs){return(...args)=>{assert(runtimeInitialized,`native function \`${name}\` called before runtime initialization`);var f=wasmExports[name];assert(f,`exported native function \`${name}\` not found`);assert(args.length<=nargs,`native function \`${name}\` called with ${args.length} args but expects ${nargs}`);return f(...args)}}var wasmBinaryFile;function findWasmBinary(){throw new Error("DDS wasm is loaded as a Cloudflare module")}function getBinarySync(file){if(ArrayBuffer.isView(file)){return file}if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);if(isFileURI(wasmBinaryFile)){err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`)}abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){return WebAssembly.instantiate(binary||binaryFile,imports)}function getWasmImports(){return{env:wasmImports,wasi_snapshot_preview1:wasmImports}}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["memory"];assert(wasmMemory,"memory not found in wasm exports");updateMemoryViews();removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");var trueModule=Module;function receiveInstantiationResult(result){assert(Module===trueModule,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");trueModule=null;return receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{try{Module["instantiateWasm"](info,(mod,inst)=>{resolve(receiveInstance(mod,inst))})}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);reject(e)}})}wasmBinaryFile??=findWasmBinary();try{var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}catch(e){readyPromiseReject(e);return Promise.reject(e)}}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);var base64Decode=b64=>{if(ENVIRONMENT_IS_NODE){var buf=Buffer.from(b64,"base64");return new Uint8Array(buf.buffer,buf.byteOffset,buf.length)}assert(b64.length%4==0);var b1,b2,i=0,j=0,bLength=b64.length;var output=new Uint8Array((bLength*3>>2)-(b64[bLength-2]=="=")-(b64[bLength-1]=="="));for(;i<bLength;i+=4,j+=3){b1=base64ReverseLookup[b64.charCodeAt(i+1)];b2=base64ReverseLookup[b64.charCodeAt(i+2)];output[j]=base64ReverseLookup[b64.charCodeAt(i)]<<2|b1>>4;output[j+1]=b1<<4|b2>>2;output[j+2]=b2<<6|base64ReverseLookup[b64.charCodeAt(i+3)]}return output};function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP64[ptr>>3];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}var noExitRuntime=true;var ptrToString=ptr=>{assert(typeof ptr==="number");ptr>>>=0;return"0x"+ptr.toString(16).padStart(8,"0")};function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":HEAP64[ptr>>3]=BigInt(value);break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();var warnOnce=text=>{warnOnce.shown||={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;if(ENVIRONMENT_IS_NODE)text="warning: "+text;err(text)}};var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder:undefined;var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead=NaN)=>{var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{if((u0&248)!=240)warnOnce("Invalid UTF-8 leading byte "+ptrToString(u0)+" encountered when deserializing a UTF-8 string in wasm memory to a JS string!");u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var UTF8ToString=(ptr,maxBytesToRead)=>{assert(typeof ptr=="number",`UTF8ToString expects a number (got ${typeof ptr})`);return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""};var ___assert_fail=(condition,filename,line,func)=>abort(`Assertion failed: ${UTF8ToString(condition)}, at: `+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"]);class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>2]=type}get_type(){return HEAPU32[this.ptr+4>>2]}set_destructor(destructor){HEAPU32[this.ptr+8>>2]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>2]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12]=caught}get_caught(){return HEAP8[this.ptr+12]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13]=rethrown}get_rethrown(){return HEAP8[this.ptr+13]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>2]}}var exceptionLast=0;var uncaughtExceptionCount=0;var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;assert(false,"Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.")};var syscallGetVarargI=()=>{assert(SYSCALLS.varargs!=undefined);var ret=HEAP32[+SYSCALLS.varargs>>2];SYSCALLS.varargs+=4;return ret};var syscallGetVarargP=syscallGetVarargI;var PATH={isAbs:path=>path.charAt(0)==="/",splitPath:filename=>{var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.slice(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(p=>!!p),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.slice(0,-1)}return root+dir},basename:path=>path&&path.match(/([^\/]+|\/)\/*$/)[1],join:(...paths)=>PATH.normalize(paths.join("/")),join2:(l,r)=>PATH.normalize(l+"/"+r)};var initRandomFill=()=>{if(ENVIRONMENT_IS_NODE){var nodeCrypto=undefined;return view=>nodeCrypto.randomFillSync(view)}return view=>crypto.getRandomValues(view)};var randomFill=view=>{(randomFill=initRandomFill())(view)};var PATH_FS={resolve:(...args)=>{var resolvedPath="",resolvedAbsolute=false;for(var i=args.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?args[i]:FS.cwd();if(typeof path!="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:(from,to)=>{from=PATH_FS.resolve(from).slice(1);to=PATH_FS.resolve(to).slice(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var FS_stdin_getChar_buffer=[];var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{assert(typeof str==="string",`stringToUTF8Array expects a string (got ${typeof str})`);if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;if(u>1114111)warnOnce("Invalid Unicode code point "+ptrToString(u)+" encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx};var intArrayFromString=(stringy,dontAddNull,length)=>{var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array};var FS_stdin_getChar=()=>{if(!FS_stdin_getChar_buffer.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;var fd=process.stdin.fd;try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else{}if(!result){return null}FS_stdin_getChar_buffer=intArrayFromString(result,true)}return FS_stdin_getChar_buffer.shift()};var TTY={ttys:[],init(){},shutdown(){},register(dev,ops){TTY.ttys[dev]={input:[],output:[],ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close(stream){stream.tty.ops.fsync(stream.tty)},fsync(stream){stream.tty.ops.fsync(stream.tty)},read(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}},default_tty_ops:{get_char(tty){return FS_stdin_getChar()},put_char(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output?.length>0){out(UTF8ArrayToString(tty.output));tty.output=[]}},ioctl_tcgets(tty){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(tty,optional_actions,data){return 0},ioctl_tiocgwinsz(tty){return[24,80]}},default_tty1_ops:{put_char(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output?.length>0){err(UTF8ArrayToString(tty.output));tty.output=[]}}}};var mmapAlloc=size=>{abort("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported")};var MEMFS={ops_table:null,mount(mount){return MEMFS.createNode(null,"/",16895,0)},createNode(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}MEMFS.ops_table||={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}};var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.atime=node.mtime=node.ctime=Date.now();if(parent){parent.contents[name]=node;parent.atime=parent.mtime=parent.ctime=node.atime}return node},getFileDataAsTypedArray(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.atime);attr.mtime=new Date(node.mtime);attr.ctime=new Date(node.ctime);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr(node,attr){for(const key of["mode","atime","mtime","ctime"]){if(attr[key]!=null){node[key]=attr[key]}}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup(parent,name){throw new FS.ErrnoError(44)},mknod(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename(old_node,new_dir,new_name){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){if(FS.isDir(old_node.mode)){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}FS.hashRemoveNode(new_node)}delete old_node.parent.contents[old_node.name];new_dir.contents[new_name]=old_node;old_node.name=new_name;new_dir.ctime=new_dir.mtime=old_node.parent.ctime=old_node.parent.mtime=Date.now()},unlink(parent,name){delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},rmdir(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},readdir(node){return[".","..",...Object.keys(node.contents)]},symlink(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);assert(size>=0);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write(stream,buffer,offset,length,position,canOwn){assert(!(buffer instanceof ArrayBuffer));if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.mtime=node.ctime=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){assert(position===0,"canOwn must imply no weird position inside the file");node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},mmap(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents&&contents.buffer===HEAP8.buffer){allocated=false;ptr=contents.byteOffset}else{allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}if(contents){if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}HEAP8.set(contents,ptr)}}return{ptr,allocated}},msync(stream,buffer,offset,length,mmapFlags){MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var asyncLoad=async url=>{var arrayBuffer=await readAsync(url);assert(arrayBuffer,`Loading data file "${url}" failed (no arrayBuffer).`);return new Uint8Array(arrayBuffer)};var FS_createDataFile=(parent,name,fileData,canRead,canWrite,canOwn)=>{FS.createDataFile(parent,name,fileData,canRead,canWrite,canOwn)};var preloadPlugins=[];var FS_handledByPreloadPlugin=(byteArray,fullname,finish,onerror)=>{if(typeof Browser!="undefined")Browser.init();var handled=false;preloadPlugins.forEach(plugin=>{if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,onerror);handled=true}});return handled};var FS_createPreloadedFile=(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency(`cp ${fullname}`);function processData(byteArray){function finish(byteArray){preFinish?.();if(!dontCreateFile){FS_createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}onload?.();removeRunDependency(dep)}if(FS_handledByPreloadPlugin(byteArray,fullname,finish,()=>{onerror?.();removeRunDependency(dep)})){return}finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){asyncLoad(url).then(processData,onerror)}else{processData(url)}};var FS_modeStringToFlags=str=>{var flagModes={r:0,"r+":2,w:512|64|1,"w+":512|64|2,a:1024|64|1,"a+":1024|64|2};var flags=flagModes[str];if(typeof flags=="undefined"){throw new Error(`Unknown file open mode: ${str}`)}return flags};var FS_getMode=(canRead,canWrite)=>{var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode};var strError=errno=>UTF8ToString(_strerror(errno));var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class extends Error{name="ErrnoError";constructor(errno){super(runtimeInitialized?strError(errno):"");this.errno=errno;for(var key in ERRNO_CODES){if(ERRNO_CODES[key]===errno){this.code=key;break}}}},FSStream:class{shared={};get object(){return this.node}set object(val){this.node=val}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(val){this.shared.flags=val}get position(){return this.shared.position}set position(val){this.shared.position=val}},FSNode:class{node_ops={};stream_ops={};readMode=292|73;writeMode=146;mounted=null;constructor(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.rdev=rdev;this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(val){val?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(val){val?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return FS.isDir(this.mode)}get isDevice(){return FS.isChrdev(this.mode)}},lookupPath(path,opts={}){if(!path){throw new FS.ErrnoError(44)}opts.follow_mount??=true;if(!PATH.isAbs(path)){path=FS.cwd()+"/"+path}linkloop:for(var nlinks=0;nlinks<40;nlinks++){var parts=path.split("/").filter(p=>!!p);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}if(parts[i]==="."){continue}if(parts[i]===".."){current_path=PATH.dirname(current_path);if(FS.isRoot(current)){path=current_path+"/"+parts.slice(i+1).join("/");continue linkloop}else{current=current.parent}continue}current_path=PATH.join2(current_path,parts[i]);try{current=FS.lookupNode(current,parts[i])}catch(e){if(e?.errno===44&&islast&&opts.noent_okay){return{path:current_path}}throw e}if(FS.isMountpoint(current)&&(!islast||opts.follow_mount)){current=current.mounted.root}if(FS.isLink(current.mode)&&(!islast||opts.follow)){if(!current.node_ops.readlink){throw new FS.ErrnoError(52)}var link=current.node_ops.readlink(current);if(!PATH.isAbs(link)){link=PATH.dirname(current_path)+"/"+link}path=link+"/"+parts.slice(i+1).join("/");continue linkloop}}return{path:current_path,node:current}}throw new FS.ErrnoError(32)},getPath(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?`${mount}/${path}`:mount+path}path=path?`${node.name}/${path}`:node.name;node=node.parent}},hashName(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode(parent,name,mode,rdev){assert(typeof parent=="object");var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode(node){FS.hashRemoveNode(node)},isRoot(node){return node===node.parent},isMountpoint(node){return!!node.mounted},isFile(mode){return(mode&61440)===32768},isDir(mode){return(mode&61440)===16384},isLink(mode){return(mode&61440)===40960},isChrdev(mode){return(mode&61440)===8192},isBlkdev(mode){return(mode&61440)===24576},isFIFO(mode){return(mode&61440)===4096},isSocket(mode){return(mode&49152)===49152},flagsToPermissionString(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup(dir){if(!FS.isDir(dir.mode))return 54;var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate(dir,name){if(!FS.isDir(dir.mode)){return 54}try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&(512|64)){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},checkOpExists(op,err){if(!op){throw new FS.ErrnoError(err)}return op},MAX_OPEN_FDS:4096,nextfd(){for(var fd=0;fd<=FS.MAX_OPEN_FDS;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStreamChecked(fd){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}return stream},getStream:fd=>FS.streams[fd],createStream(stream,fd=-1){assert(fd>=-1);stream=Object.assign(new FS.FSStream,stream);if(fd==-1){fd=FS.nextfd()}stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream(fd){FS.streams[fd]=null},dupStream(origStream,fd=-1){var stream=FS.createStream(origStream,fd);stream.stream_ops?.dup?.(stream);return stream},doSetAttr(stream,node,attr){var setattr=stream?.stream_ops.setattr;var arg=setattr?stream:node;setattr??=node.node_ops.setattr;FS.checkOpExists(setattr,63);setattr(arg,attr)},chrdev_stream_ops:{open(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;stream.stream_ops.open?.(stream)},llseek(){throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push(...m.mounts)}return mounts},syncfs(populate,callback){if(typeof populate=="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){assert(FS.syncFSRequests>0);FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount(type,opts,mountpoint){if(typeof type=="string"){throw type}var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type,opts,mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);assert(idx!==-1);node.mount.mounts.splice(idx,1)},lookup(parent,name){return parent.node_ops.lookup(parent,name)},mknod(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name){throw new FS.ErrnoError(28)}if(name==="."||name===".."){throw new FS.ErrnoError(20)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},statfs(path){return FS.statfsNode(FS.lookupPath(path,{follow:true}).node)},statfsStream(stream){return FS.statfsNode(stream.node)},statfsNode(node){var rtn={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:FS.nextInode,ffree:FS.nextInode-1,fsid:42,flags:2,namelen:255};if(node.node_ops.statfs){Object.assign(rtn,node.node_ops.statfs(node.mount.opts.root))}return rtn},create(path,mode=438){mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir(path,mode=511){mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree(path,mode){var dirs=path.split("/");var d="";for(var dir of dirs){if(!dir)continue;if(d||PATH.isAbs(path))d+="/";d+=dir;try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev(path,mode,dev){if(typeof dev=="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name);old_node.parent=new_dir}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;var readdir=FS.checkOpExists(node.node_ops.readdir,54);return readdir(node)},unlink(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return link.node_ops.readlink(link)},stat(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;var getattr=FS.checkOpExists(node.node_ops.getattr,63);return getattr(node)},fstat(fd){var stream=FS.getStreamChecked(fd);var node=stream.node;var getattr=stream.stream_ops.getattr;var arg=getattr?stream:node;getattr??=node.node_ops.getattr;FS.checkOpExists(getattr,63);return getattr(arg)},lstat(path){return FS.stat(path,true)},doChmod(stream,node,mode,dontFollow){FS.doSetAttr(stream,node,{mode:mode&4095|node.mode&~4095,ctime:Date.now(),dontFollow})},chmod(path,mode,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}FS.doChmod(null,node,mode,dontFollow)},lchmod(path,mode){FS.chmod(path,mode,true)},fchmod(fd,mode){var stream=FS.getStreamChecked(fd);FS.doChmod(stream,stream.node,mode,false)},doChown(stream,node,dontFollow){FS.doSetAttr(stream,node,{timestamp:Date.now(),dontFollow})},chown(path,uid,gid,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}FS.doChown(null,node,dontFollow)},lchown(path,uid,gid){FS.chown(path,uid,gid,true)},fchown(fd,uid,gid){var stream=FS.getStreamChecked(fd);FS.doChown(stream,stream.node,false)},doTruncate(stream,node,len){if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}FS.doSetAttr(stream,node,{size:len,timestamp:Date.now()})},truncate(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}FS.doTruncate(null,node,len)},ftruncate(fd,len){var stream=FS.getStreamChecked(fd);if(len<0||(stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.doTruncate(stream,stream.node,len)},utime(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;var setattr=FS.checkOpExists(node.node_ops.setattr,63);setattr(node,{atime,mtime})},open(path,flags,mode=438){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags=="string"?FS_modeStringToFlags(flags):flags;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;var isDirPath;if(typeof path=="object"){node=path}else{isDirPath=path.endsWith("/");var lookup=FS.lookupPath(path,{follow:!(flags&131072),noent_okay:true});node=lookup.node;path=lookup.path}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else if(isDirPath){throw new FS.ErrnoError(31)}else{node=FS.mknod(path,mode|511,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node,path:FS.getPath(node),flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(created){FS.chmod(node,mode&511)}if(Module["logReadFiles"]&&!(flags&1)){if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed(stream){return stream.fd===null},llseek(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read(stream,buffer,offset,length,position){assert(offset>=0);if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write(stream,buffer,offset,length,position,canOwn){assert(offset>=0);if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},mmap(stream,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}if(!length){throw new FS.ErrnoError(28)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync(stream,buffer,offset,length,mmapFlags){assert(offset>=0);if(!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},ioctl(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile(path,opts={}){opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error(`Invalid encoding type "${opts.encoding}"`)}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile(path,data,opts={}){opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data=="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:()=>FS.currentPath,chdir(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length,llseek:()=>0});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var randomBuffer=new Uint8Array(1024),randomLeft=0;var randomByte=()=>{if(randomLeft===0){randomFill(randomBuffer);randomLeft=randomBuffer.byteLength}return randomBuffer[--randomLeft]};FS.createDevice("/dev","random",randomByte);FS.createDevice("/dev","urandom",randomByte);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount(){var node=FS.createNode(proc_self,"fd",16895,73);node.stream_ops={llseek:MEMFS.stream_ops.llseek};node.node_ops={lookup(parent,name){var fd=+name;var stream=FS.getStreamChecked(fd);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>stream.path},id:fd+1};ret.parent=ret;return ret},readdir(){return Array.from(FS.streams.entries()).filter(([k,v])=>v).map(([k,v])=>k.toString())}};return node}},{},"/proc/self/fd")},createStandardStreams(input,output,error){if(input){FS.createDevice("/dev","stdin",input)}else{FS.symlink("/dev/tty","/dev/stdin")}if(output){FS.createDevice("/dev","stdout",null,output)}else{FS.symlink("/dev/tty","/dev/stdout")}if(error){FS.createDevice("/dev","stderr",null,error)}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1);assert(stdin.fd===0,`invalid handle for stdin (${stdin.fd})`);assert(stdout.fd===1,`invalid handle for stdout (${stdout.fd})`);assert(stderr.fd===2,`invalid handle for stderr (${stderr.fd})`)},staticInit(){FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={MEMFS}},init(input,output,error){assert(!FS.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");FS.initialized=true;input??=Module["stdin"];output??=Module["stdout"];error??=Module["stderr"];FS.createStandardStreams(input,output,error)},quit(){FS.initialized=false;_fflush(0);for(var stream of FS.streams){if(stream){FS.close(stream)}}},findObject(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(!ret.exists){return null}return ret.object},analyzePath(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath(parent,path,canRead,canWrite){parent=typeof parent=="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){if(e.errno!=20)throw e}parent=current}return current},createFile(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile(parent,name,data,canRead,canWrite,canOwn){var path=name;if(parent){parent=typeof parent=="string"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS_getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data=="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}},createDevice(parent,name,input,output){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(!!input,!!output);FS.createDevice.major??=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open(stream){stream.seekable=false},close(stream){if(output?.buffer?.length){output(10)}},read(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else{try{obj.contents=readBinary(obj.url);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}},createLazyFile(parent,name,url,canRead,canWrite){class LazyUint8Array{lengthKnown=false;chunks=[];get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]}setDataGetter(getter){this.getter=getter}cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}return intArrayFromString(xhr.responseText||"",true)};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]=="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]=="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true}get length(){if(!this.lengthKnown){this.cacheLength()}return this._length}get chunkSize(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}if(typeof XMLHttpRequest!="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=(...args)=>{FS.forceLoadFile(node);return fn(...args)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);assert(size>=0);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr,allocated:true}};node.stream_ops=stream_ops;return node},absolutePath(){abort("FS.absolutePath has been removed; use PATH_FS.resolve instead")},createFolder(){abort("FS.createFolder has been removed; use FS.mkdir instead")},createLink(){abort("FS.createLink has been removed; use FS.symlink instead")},joinPath(){abort("FS.joinPath has been removed; use PATH.join instead")},mmapAlloc(){abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc")},standardizePath(){abort("FS.standardizePath has been removed; use PATH.normalize instead")}};var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=SYSCALLS.getStreamFromFD(dirfd);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return dir+"/"+path},writeStat(buf,stat){HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=stat.mode;HEAPU32[buf+8>>2]=stat.nlink;HEAP32[buf+12>>2]=stat.uid;HEAP32[buf+16>>2]=stat.gid;HEAP32[buf+20>>2]=stat.rdev;HEAP64[buf+24>>3]=BigInt(stat.size);HEAP32[buf+32>>2]=4096;HEAP32[buf+36>>2]=stat.blocks;var atime=stat.atime.getTime();var mtime=stat.mtime.getTime();var ctime=stat.ctime.getTime();HEAP64[buf+40>>3]=BigInt(Math.floor(atime/1e3));HEAPU32[buf+48>>2]=atime%1e3*1e3*1e3;HEAP64[buf+56>>3]=BigInt(Math.floor(mtime/1e3));HEAPU32[buf+64>>2]=mtime%1e3*1e3*1e3;HEAP64[buf+72>>3]=BigInt(Math.floor(ctime/1e3));HEAPU32[buf+80>>2]=ctime%1e3*1e3*1e3;HEAP64[buf+88>>3]=BigInt(stat.ino);return 0},writeStatFs(buf,stats){HEAP32[buf+4>>2]=stats.bsize;HEAP32[buf+40>>2]=stats.bsize;HEAP32[buf+8>>2]=stats.blocks;HEAP32[buf+12>>2]=stats.bfree;HEAP32[buf+16>>2]=stats.bavail;HEAP32[buf+20>>2]=stats.files;HEAP32[buf+24>>2]=stats.ffree;HEAP32[buf+28>>2]=stats.fsid;HEAP32[buf+44>>2]=stats.flags;HEAP32[buf+36>>2]=stats.namelen},doMsync(addr,stream,len,flags,offset){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(flags&2){return 0}var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},getStreamFromFD(fd){var stream=FS.getStreamChecked(fd);return stream},varargs:undefined,getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=syscallGetVarargI();if(arg<0){return-28}while(FS.streams[arg]){arg++}var newStream;newStream=FS.dupStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=syscallGetVarargI();stream.flags|=arg;return 0}case 12:{var arg=syscallGetVarargP();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 13:case 14:return 0}return-28}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:{if(!stream.tty)return-59;return 0}case 21505:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcgets){var termios=stream.tty.ops.ioctl_tcgets(stream);var argp=syscallGetVarargP();HEAP32[argp>>2]=termios.c_iflag||0;HEAP32[argp+4>>2]=termios.c_oflag||0;HEAP32[argp+8>>2]=termios.c_cflag||0;HEAP32[argp+12>>2]=termios.c_lflag||0;for(var i=0;i<32;i++){HEAP8[argp+i+17]=termios.c_cc[i]||0}return 0}return 0}case 21510:case 21511:case 21512:{if(!stream.tty)return-59;return 0}case 21506:case 21507:case 21508:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcsets){var argp=syscallGetVarargP();var c_iflag=HEAP32[argp>>2];var c_oflag=HEAP32[argp+4>>2];var c_cflag=HEAP32[argp+8>>2];var c_lflag=HEAP32[argp+12>>2];var c_cc=[];for(var i=0;i<32;i++){c_cc.push(HEAP8[argp+i+17])}return stream.tty.ops.ioctl_tcsets(stream.tty,op,{c_iflag,c_oflag,c_cflag,c_lflag,c_cc})}return 0}case 21519:{if(!stream.tty)return-59;var argp=syscallGetVarargP();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=syscallGetVarargP();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tiocgwinsz){var winsize=stream.tty.ops.ioctl_tiocgwinsz(stream.tty);var argp=syscallGetVarargP();HEAP16[argp>>1]=winsize[0];HEAP16[argp+2>>1]=winsize[1]}return 0}case 21524:{if(!stream.tty)return-59;return 0}case 21515:{if(!stream.tty)return-59;return 0}default:return-28}}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?syscallGetVarargI():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var __abort_js=()=>abort("native code called abort()");var stringToUTF8=(str,outPtr,maxBytesToWrite)=>{assert(typeof maxBytesToWrite=="number","stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)};var __tzset_js=(timezone,daylight,std_name,dst_name)=>{var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);var extractZone=timezoneOffset=>{var sign=timezoneOffset>=0?"-":"+";var absOffset=Math.abs(timezoneOffset);var hours=String(Math.floor(absOffset/60)).padStart(2,"0");var minutes=String(absOffset%60).padStart(2,"0");return`UTC${sign}${hours}${minutes}`};var winterName=extractZone(winterOffset);var summerName=extractZone(summerOffset);assert(winterName);assert(summerName);assert(lengthBytesUTF8(winterName)<=16,`timezone name truncated to fit in TZNAME_MAX (${winterName})`);assert(lengthBytesUTF8(summerName)<=16,`timezone name truncated to fit in TZNAME_MAX (${summerName})`);if(summerOffset<winterOffset){stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};var getHeapMax=()=>2147483648;var alignMemory=(size,alignment)=>{assert(alignment,"alignment argument is required");return Math.ceil(size/alignment)*alignment};var growMemory=size=>{var b=wasmMemory.buffer;var pages=(size-b.byteLength+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`)}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;assert(requestedSize>oldSize);var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);return false};var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){var lang=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:lang,_:getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var _environ_get=(__environ,environ_buf)=>{var bufSize=0;var envp=0;for(var string of getEnvStrings()){var ptr=environ_buf+bufSize;HEAPU32[__environ+envp>>2]=ptr;bufSize+=stringToUTF8(string,ptr,Infinity)+1;envp+=4}return 0};var _environ_sizes_get=(penviron_count,penviron_buf_size)=>{var strings=getEnvStrings();HEAPU32[penviron_count>>2]=strings.length;var bufSize=0;for(var string of strings){bufSize+=lengthBytesUTF8(string)+1}HEAPU32[penviron_buf_size>>2]=bufSize;return 0};var runtimeKeepaliveCounter=0;var keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0;var _proc_exit=code=>{EXITSTATUS=code;if(!keepRuntimeAlive()){Module["onExit"]?.(code);ABORT=true}quit_(code,new ExitStatus(code))};var exitJS=(status,implicit)=>{EXITSTATUS=status;checkUnflushedContent();if(keepRuntimeAlive()&&!implicit){var msg=`program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;readyPromiseReject(msg);err(msg)}_proc_exit(status)};var _exit=exitJS;function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doReadv=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break;if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var INT53_MAX=9007199254740992;var INT53_MIN=-9007199254740992;var bigintToI53Checked=num=>num<INT53_MIN||num>INT53_MAX?NaN:Number(num);function _fd_seek(fd,offset,whence,newOffset){offset=bigintToI53Checked(offset);try{if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);HEAP64[newOffset>>3]=BigInt(stream.position);if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doWritev=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len){break}if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var getCFunc=ident=>{var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func};var writeArrayToMemory=(array,buffer)=>{assert(array.length>=0,"writeArrayToMemory array must have a length (should be an array or typed array)");HEAP8.set(array,buffer)};var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;assert(returnType!=="array",'Return type should not be "array".');if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>(...args)=>ccall(ident,returnType,argTypes,args,opts);for(var base64ReverseLookup=new Uint8Array(123),i=25;i>=0;--i){base64ReverseLookup[48+i]=52+i;base64ReverseLookup[65+i]=i;base64ReverseLookup[97+i]=26+i}base64ReverseLookup[43]=62;base64ReverseLookup[47]=63;FS.createPreloadedFile=FS_createPreloadedFile;FS.staticInit();{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["preloadPlugins"])preloadPlugins=Module["preloadPlugins"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];checkIncomingModuleAPI();if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];assert(typeof Module["memoryInitializerPrefixURL"]=="undefined","Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["pthreadMainPrefixURL"]=="undefined","Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["cdInitializerPrefixURL"]=="undefined","Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["filePackagePrefixURL"]=="undefined","Module.filePackagePrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["read"]=="undefined","Module.read option was removed");assert(typeof Module["readAsync"]=="undefined","Module.readAsync option was removed (modify readAsync in JS)");assert(typeof Module["readBinary"]=="undefined","Module.readBinary option was removed (modify readBinary in JS)");assert(typeof Module["setWindowTitle"]=="undefined","Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");assert(typeof Module["TOTAL_MEMORY"]=="undefined","Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");assert(typeof Module["ENVIRONMENT"]=="undefined","Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");assert(typeof Module["STACK_SIZE"]=="undefined","STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");assert(typeof Module["wasmMemory"]=="undefined","Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");assert(typeof Module["INITIAL_MEMORY"]=="undefined","Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically")}Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["setValue"]=setValue;Module["getValue"]=getValue;Module["UTF8ToString"]=UTF8ToString;Module["stringToUTF8"]=stringToUTF8;var missingLibrarySymbols=["writeI53ToI64","writeI53ToI64Clamped","writeI53ToI64Signaling","writeI53ToU64Clamped","writeI53ToU64Signaling","readI53FromI64","readI53FromU64","convertI32PairToI53","convertI32PairToI53Checked","convertU32PairToI53","getTempRet0","setTempRet0","zeroMemory","inetPton4","inetNtop4","inetPton6","inetNtop6","readSockaddr","writeSockaddr","emscriptenLog","readEmAsmArgs","jstoi_q","listenOnce","autoResumeAudioContext","getDynCaller","dynCall","handleException","runtimeKeepalivePush","runtimeKeepalivePop","callUserCallback","maybeExit","asmjsMangle","HandleAllocator","getNativeTypeSize","addOnInit","addOnPostCtor","addOnPreMain","addOnExit","STACK_SIZE","STACK_ALIGN","POINTER_SIZE","ASSERTIONS","uleb128Encode","sigToWasmTypes","generateFuncType","convertJsFunctionToWasm","getEmptyTableSlot","updateTableMap","getFunctionAddress","addFunction","removeFunction","reallyNegative","unSign","strLen","reSign","formatString","intArrayToString","AsciiToString","stringToAscii","UTF16ToString","stringToUTF16","lengthBytesUTF16","UTF32ToString","stringToUTF32","lengthBytesUTF32","stringToNewUTF8","registerKeyEventCallback","maybeCStringToJsString","findEventTarget","getBoundingClientRect","fillMouseEventData","registerMouseEventCallback","registerWheelEventCallback","registerUiEventCallback","registerFocusEventCallback","fillDeviceOrientationEventData","registerDeviceOrientationEventCallback","fillDeviceMotionEventData","registerDeviceMotionEventCallback","screenOrientation","fillOrientationChangeEventData","registerOrientationChangeEventCallback","fillFullscreenChangeEventData","registerFullscreenChangeEventCallback","JSEvents_requestFullscreen","JSEvents_resizeCanvasForFullscreen","registerRestoreOldStyle","hideEverythingExceptGivenElement","restoreHiddenElements","setLetterbox","softFullscreenResizeWebGLRenderTarget","doRequestFullscreen","fillPointerlockChangeEventData","registerPointerlockChangeEventCallback","registerPointerlockErrorEventCallback","requestPointerLock","fillVisibilityChangeEventData","registerVisibilityChangeEventCallback","registerTouchEventCallback","fillGamepadEventData","registerGamepadEventCallback","registerBeforeUnloadEventCallback","fillBatteryEventData","battery","registerBatteryEventCallback","setCanvasElementSize","getCanvasElementSize","jsStackTrace","getCallstack","convertPCtoSourceLocation","checkWasiClock","wasiRightsToMuslOFlags","wasiOFlagsToMuslOFlags","safeSetTimeout","setImmediateWrapped","safeRequestAnimationFrame","clearImmediateWrapped","registerPostMainLoop","registerPreMainLoop","getPromise","makePromise","idsToPromises","makePromiseCallback","findMatchingCatch","Browser_asyncPrepareDataCounter","isLeapYear","ydayFromDate","arraySum","addDays","getSocketFromFD","getSocketAddress","FS_unlink","FS_mkdirTree","_setNetworkCallback","heapObjectForWebGLType","toTypedArrayIndex","webgl_enable_ANGLE_instanced_arrays","webgl_enable_OES_vertex_array_object","webgl_enable_WEBGL_draw_buffers","webgl_enable_WEBGL_multi_draw","webgl_enable_EXT_polygon_offset_clamp","webgl_enable_EXT_clip_control","webgl_enable_WEBGL_polygon_mode","emscriptenWebGLGet","computeUnpackAlignedImageSize","colorChannelsInGlTextureFormat","emscriptenWebGLGetTexPixelData","emscriptenWebGLGetUniform","webglGetUniformLocation","webglPrepareUniformLocationsBeforeFirstUse","webglGetLeftBracePos","emscriptenWebGLGetVertexAttrib","__glGetActiveAttribOrUniform","writeGLArray","registerWebGlEventCallback","runAndAbortIfError","ALLOC_NORMAL","ALLOC_STACK","allocate","writeStringToMemory","writeAsciiToMemory","demangle","stackTrace"];missingLibrarySymbols.forEach(missingLibrarySymbol);var unexportedSymbols=["run","addRunDependency","removeRunDependency","out","err","callMain","abort","wasmMemory","wasmExports","HEAPF32","HEAPF64","HEAP8","HEAPU8","HEAP16","HEAPU16","HEAP32","HEAPU32","HEAP64","HEAPU64","writeStackCookie","checkStackCookie","INT53_MAX","INT53_MIN","bigintToI53Checked","stackSave","stackRestore","stackAlloc","ptrToString","exitJS","getHeapMax","growMemory","ENV","ERRNO_CODES","strError","DNS","Protocols","Sockets","timers","warnOnce","readEmAsmArgsArray","jstoi_s","getExecutableName","keepRuntimeAlive","asyncLoad","alignMemory","mmapAlloc","wasmTable","noExitRuntime","addOnPreRun","addOnPostRun","getCFunc","freeTableIndexes","functionsInTableMap","PATH","PATH_FS","UTF8Decoder","UTF8ArrayToString","stringToUTF8Array","lengthBytesUTF8","intArrayFromString","UTF16Decoder","stringToUTF8OnStack","writeArrayToMemory","JSEvents","specialHTMLTargets","findCanvasEventTarget","currentFullscreenStrategy","restoreOldWindowedStyle","UNWIND_CACHE","ExitStatus","getEnvStrings","doReadv","doWritev","initRandomFill","randomFill","emSetImmediate","emClearImmediate_deps","emClearImmediate","promiseMap","uncaughtExceptionCount","exceptionLast","exceptionCaught","ExceptionInfo","Browser","getPreloadedImageData__data","wget","MONTH_DAYS_REGULAR","MONTH_DAYS_LEAP","MONTH_DAYS_REGULAR_CUMULATIVE","MONTH_DAYS_LEAP_CUMULATIVE","base64Decode","SYSCALLS","preloadPlugins","FS_createPreloadedFile","FS_modeStringToFlags","FS_getMode","FS_stdin_getChar_buffer","FS_stdin_getChar","FS_createPath","FS_createDevice","FS_readFile","FS","FS_createDataFile","FS_createLazyFile","MEMFS","TTY","PIPEFS","SOCKFS","tempFixedLengthArray","miniTempWebGLFloatBuffers","miniTempWebGLIntBuffers","GL","AL","GLUT","EGL","GLEW","IDBStore","SDL","SDL_gfx","allocateUTF8","allocateUTF8OnStack","print","printErr"];unexportedSymbols.forEach(unexportedRuntimeSymbol);function checkIncomingModuleAPI(){ignoredModuleProp("fetchSettings")}var wasmImports={__assert_fail:___assert_fail,__cxa_throw:___cxa_throw,__syscall_fcntl64:___syscall_fcntl64,__syscall_ioctl:___syscall_ioctl,__syscall_openat:___syscall_openat,_abort_js:__abort_js,_tzset_js:__tzset_js,emscripten_resize_heap:_emscripten_resize_heap,environ_get:_environ_get,environ_sizes_get:_environ_sizes_get,exit:_exit,fd_close:_fd_close,fd_read:_fd_read,fd_seek:_fd_seek,fd_write:_fd_write};var wasmExports=await createWasm();var ___wasm_call_ctors=createExportWrapper("__wasm_call_ctors",0);var _CalcDDtablePBN=Module["_CalcDDtablePBN"]=createExportWrapper("CalcDDtablePBN",2);var _DealerPar=Module["_DealerPar"]=createExportWrapper("DealerPar",4);var _SetMaxThreads=Module["_SetMaxThreads"]=createExportWrapper("SetMaxThreads",1);var _AnalysePlayPBN=Module["_AnalysePlayPBN"]=createExportWrapper("AnalysePlayPBN",4);var _SolveBoardPBN=Module["_SolveBoardPBN"]=createExportWrapper("SolveBoardPBN",6);var _free=Module["_free"]=createExportWrapper("free",1);var _malloc=Module["_malloc"]=createExportWrapper("malloc",1);var _fflush=createExportWrapper("fflush",1);var _strerror=createExportWrapper("strerror",1);var _emscripten_stack_get_end=wasmExports["emscripten_stack_get_end"];var _emscripten_stack_get_base=wasmExports["emscripten_stack_get_base"];var _emscripten_stack_init=wasmExports["emscripten_stack_init"];var _emscripten_stack_get_free=wasmExports["emscripten_stack_get_free"];var __emscripten_stack_restore=wasmExports["_emscripten_stack_restore"];var __emscripten_stack_alloc=wasmExports["_emscripten_stack_alloc"];var _emscripten_stack_get_current=wasmExports["emscripten_stack_get_current"];var calledRun;function stackCheckInit(){_emscripten_stack_init();writeStackCookie()}function run(){if(runDependencies>0){dependenciesFulfilled=run;return}stackCheckInit();preRun();if(runDependencies>0){dependenciesFulfilled=run;return}function doRun(){assert(!calledRun);calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);Module["onRuntimeInitialized"]?.();consumedModuleProp("onRuntimeInitialized");assert(!Module["_main"],'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(()=>{setTimeout(()=>Module["setStatus"](""),1);doRun()},1)}else{doRun()}checkStackCookie()}function checkUnflushedContent(){var oldOut=out;var oldErr=err;var has=false;out=err=x=>{has=true};try{_fflush(0);["stdout","stderr"].forEach(name=>{var info=FS.analyzePath("/dev/"+name);if(!info)return;var stream=info.object;var rdev=stream.rdev;var tty=TTY.ttys[rdev];if(tty?.output?.length){has=true}})}catch(e){}out=oldOut;err=oldErr;if(has){warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.")}}function preInit(){if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()()}}consumedModuleProp("preInit")}preInit();run();moduleRtn=readyPromise;for(const prop of Object.keys(Module)){if(!(prop in moduleArg)){Object.defineProperty(moduleArg,prop,{configurable:true,get(){abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)}})}}


  return moduleRtn;
}
);
})();



const APP_VERSION = "2026-06-19-dds-v8";
const MAIN_SESSION_PREFIX = "session:";
const PLAYER_REGISTRY_KEY = "players";
const ADMIN_SETTINGS_KEY = "admin-settings";
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
const VAPID_PUBLIC_KEY = "BOUkt8INimIE5E6gqgoRNdg-ex-pCLx7_mm-Kue3mchDNy8mvlVkq1Uhq19Yj6nXAErqstaElc1Jaxt3l_O0MM0";
const VAPID_PRIVATE_KEY = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvPfX_YoYgk7GvlmEev4M6bF-cw9lFKUWc_rlW7Kf366hRANCAATlJLfCDYpiBOROoKoKETXYPnsfqQi8e_5pvirnt5nIQzcvJr5VZKtVIatfWI-p1wBK6rLWhJXNSWsbd5fztDDN";
const VAPID_SUBJECT = "mailto:bridge-bied-app@example.com";

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

function textBytes(value) {
  return new TextEncoder().encode(String(value));
}

function concatBytes(...chunks) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

function base64UrlToBytes(value) {
  const base64 = String(value || "").replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(String(value || "").length / 4) * 4, "=");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

function bytesToBase64Url(bytes) {
  let raw = "";
  for (const byte of bytes) raw += String.fromCharCode(byte);
  return btoa(raw).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacSha256(keyBytes, data) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
}

async function hkdfExtract(salt, inputKeyMaterial) {
  return hmacSha256(salt, inputKeyMaterial);
}

async function hkdfExpand(pseudoRandomKey, info, length) {
  const blocks = [];
  let previous = new Uint8Array(0);
  let total = 0;
  for (let counter = 1; total < length; counter += 1) {
    previous = await hmacSha256(pseudoRandomKey, concatBytes(previous, info, new Uint8Array([counter])));
    blocks.push(previous);
    total += previous.length;
  }
  return concatBytes(...blocks).slice(0, length);
}

async function vapidAuthorization(endpoint) {
  const audience = new URL(endpoint).origin;
  const header = bytesToBase64Url(textBytes(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = bytesToBase64Url(textBytes(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: VAPID_SUBJECT,
  })));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    base64UrlToBytes(VAPID_PRIVATE_KEY),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, textBytes(`${header}.${payload}`)));
  return `vapid t=${header}.${payload}.${bytesToBase64Url(signature)}, k=${VAPID_PUBLIC_KEY}`;
}

async function encryptPushPayload(subscription, payload) {
  const receiverPublic = base64UrlToBytes(subscription.keys?.p256dh);
  const authSecret = base64UrlToBytes(subscription.keys?.auth);
  const serverKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const receiverKey = await crypto.subtle.importKey("raw", receiverPublic, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const serverPublic = new Uint8Array(await crypto.subtle.exportKey("raw", serverKeys.publicKey));
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: receiverKey }, serverKeys.privateKey, 256));
  const keyInfo = concatBytes(textBytes("WebPush: info\0"), receiverPublic, serverPublic);
  const ikm = await hkdfExpand(await hkdfExtract(authSecret, sharedSecret), keyInfo, 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdfExtract(salt, ikm);
  const cek = await hkdfExpand(prk, textBytes("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk, textBytes("Content-Encoding: nonce\0"), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const plaintext = concatBytes(textBytes(JSON.stringify(payload)), new Uint8Array([2]));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, plaintext));
  return concatBytes(salt, new Uint8Array([0, 0, 16, 0]), new Uint8Array([serverPublic.length]), serverPublic, ciphertext);
}

function normalizePushSubscription(subscription) {
  const endpoint = String(subscription?.endpoint || "").trim();
  const p256dh = String(subscription?.keys?.p256dh || "").trim();
  const auth = String(subscription?.keys?.auth || "").trim();
  if (!endpoint || !p256dh || !auth) return null;
  return { endpoint, keys: { p256dh, auth } };
}

async function sendWebPush(subscription, payload) {
  const clean = normalizePushSubscription(subscription);
  if (!clean) return { ok: false, status: 0 };
  const body = await encryptPushPayload(clean, payload);
  const response = await fetch(clean.endpoint, {
    method: "POST",
    headers: {
      "authorization": await vapidAuthorization(clean.endpoint),
      "content-encoding": "aes128gcm",
      "content-type": "application/octet-stream",
      "ttl": "14400",
      "urgency": "normal",
    },
    body,
  });
  return { ok: response.ok, status: response.status };
}

function defaultSettings() {
  const filters = {};
  for (const target of FILTER_TARGETS) {
    filters[target] = { minHcp: 0, minSuitLengths: { S: 0, H: 0, D: 0, C: 0 } };
  }
  return { dealerMode: "cycle", vulnerabilityMode: "cycle", opponentMode: "pass", filters };
}

function defaultAdminSettings() {
  return {
    defaultGeneratorSettings: defaultSettings(),
    ddEnabled: true,
    ddConfigured: false,
  };
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

function contractScoreMadeWithTricks(bid, vulnerable, multiplier = 1, tricks = null) {
  const [level, strain] = bidParts(bid);
  const needed = level + 6;
  const madeTricks = Number.isFinite(tricks) ? Math.max(needed, tricks) : needed;
  const overtricks = Math.max(0, madeTricks - needed);
  let overtrickPoints = 0;
  if (overtricks && multiplier === 1) {
    overtrickPoints = overtricks * (["C", "D"].includes(strain) ? 20 : 30);
  } else if (overtricks && multiplier === 2) {
    overtrickPoints = overtricks * (vulnerable ? 200 : 100);
  } else if (overtricks && multiplier === 4) {
    overtrickPoints = overtricks * (vulnerable ? 400 : 200);
  }
  return contractScoreMade(bid, vulnerable, multiplier) + overtrickPoints;
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

function pbnRank(rank) {
  return rank === "10" ? "T" : rank;
}

function pbnHand(hand) {
  return SUITS.map((suit) => hand
    .filter((card) => card.suit === suit)
    .map((card) => pbnRank(card.rank))
    .join(""))
    .join(".");
}

function pbnDealCards(deal) {
  return `N:${pbnHand(deal.hands.N)} ${pbnHand(deal.hands.E)} ${pbnHand(deal.hands.S)} ${pbnHand(deal.hands.W)}`;
}

const DDS_STRAIN_INDEX = { S: 0, H: 1, D: 2, C: 3, NT: 4 };
const DDS_INDEX_TO_STRAIN = ["S", "H", "D", "C", "NT"];
const DDS_SEAT_INDEX = { N: 0, E: 1, S: 2, W: 3 };
const DDS_INDEX_TO_SEAT = ["N", "E", "S", "W"];
const DDS_VULNERABILITY_INDEX = { Niemand: 0, Allen: 1, NZ: 2, OW: 3 };
const DDS_TABLE_DEAL_PBN_SIZE = 80;
const DDS_TABLE_RESULTS_SIZE = 5 * 4 * 4;
const DDS_PAR_RESULTS_DEALER_SIZE = 4 + 4 + 10 * 10;
let ddsModulePromise = null;

function hasEmbeddedDdsRuntime() {
  return typeof bridgeDdsLoader === "function";
}

function ddsLoaderOptions() {
  if (typeof DDS_WASM_MODULE === "undefined") return {};
  return {
    instantiateWasm(imports, receiveInstance) {
      const instance = new WebAssembly.Instance(DDS_WASM_MODULE, imports);
      receiveInstance(instance, DDS_WASM_MODULE);
      return instance.exports;
    },
  };
}

async function loadDdsModule() {
  if (!hasEmbeddedDdsRuntime()) throw new Error("DDS runtime ontbreekt in deze build.");
  if (!ddsModulePromise) {
    ddsModulePromise = bridgeDdsLoader(ddsLoaderOptions()).then((module) => {
      module.ccall("SetMaxThreads", null, ["number"], [0]);
      return module;
    });
  }
  return ddsModulePromise;
}

function readDdsTableFromPointer(module, tablePointer) {
  const cells = {};
  for (let strainIndex = 0; strainIndex < DDS_INDEX_TO_STRAIN.length; strainIndex += 1) {
    const strain = DDS_INDEX_TO_STRAIN[strainIndex];
    cells[strain] = {};
    for (let seatIndex = 0; seatIndex < DDS_INDEX_TO_SEAT.length; seatIndex += 1) {
      const seat = DDS_INDEX_TO_SEAT[seatIndex];
      cells[strain][seat] = module.getValue(tablePointer + 4 * (strainIndex * 4 + seatIndex), "i32");
    }
  }
  return cells;
}

function ddsParContractInfo(contract) {
  const clean = String(contract || "").trim();
  const match = clean.match(/^([1-7])([CDHSN])([*X]{0,2})-([NSEW]{1,2})([+=-]\d+|=)?$/);
  if (!match) return null;
  const [, level, strainCode, doubledText, sideText, result = ""] = match;
  const strain = strainCode === "N" ? "NT" : strainCode;
  const doubled = doubledText.replace(/\*/g, "X");
  const side = ["N", "S", "NS"].includes(sideText) ? "NZ" : "OW";
  return { call: `${level}${strain}`, doubled, side, sideText, result };
}

function ddsParContractLabel(contract) {
  const clean = String(contract || "").trim();
  const info = ddsParContractInfo(clean);
  if (!info) return clean;
  const { call, doubled, side, result } = info;
  const doubleText = doubled === "XX" ? " geredubbeld" : doubled === "X" ? " gedubbeld" : "";
  const resultText = result ? ` ${result}` : "";
  return `${side} ${displayCall(call)}${doubleText}${resultText}`;
}

function normalizeDdsPar(par) {
  if (!par) return par;
  const primary = Array.isArray(par.contracts) && par.contracts[0] ? par.contracts[0] : par.label;
  const info = ddsParContractInfo(primary);
  if (!info) return par;
  return {
    ...par,
    side: info.side,
    bid: info.call,
    label: ddsParContractLabel(primary),
  };
}

function readDdsDealerParFromPointer(module, parPointer) {
  const number = module.getValue(parPointer, "i32");
  const score = module.getValue(parPointer + 4, "i32");
  const contracts = [];
  for (let index = 0; index < number; index += 1) {
    const raw = module.UTF8ToString(parPointer + 8 + index * 10, 10).replace(/\0/g, "").trim();
    if (raw) contracts.push(raw);
  }
  const primary = contracts[0] || "";
  const contractInfo = ddsParContractInfo(primary);
  const side = contractInfo?.side || (score >= 0 ? "NZ" : "OW");
  return {
    side,
    bid: contractInfo?.call || "Pas",
    score: Math.abs(score),
    nzScore: score,
    label: primary ? ddsParContractLabel(primary) : "Rondpas",
    contracts,
  };
}

async function computeDoubleDummyTable(deal) {
  const module = await loadDdsModule();
  const dealPointer = module._malloc(DDS_TABLE_DEAL_PBN_SIZE);
  const tablePointer = module._malloc(DDS_TABLE_RESULTS_SIZE);
  const parPointer = module._malloc(DDS_PAR_RESULTS_DEALER_SIZE);
  try {
    module.stringToUTF8(pbnDealCards(deal), dealPointer, DDS_TABLE_DEAL_PBN_SIZE);
    const tableResult = module.ccall("CalcDDtablePBN", "number", ["number", "number"], [dealPointer, tablePointer]);
    if (tableResult !== 1) throw new Error(`CalcDDtablePBN gaf code ${tableResult}.`);
    const parResult = module.ccall("DealerPar", "number", ["number", "number", "number", "number"], [
      tablePointer,
      parPointer,
      DDS_SEAT_INDEX[deal.dealer],
      DDS_VULNERABILITY_INDEX[deal.vulnerability] ?? 0,
    ]);
    if (parResult !== 1) throw new Error(`DealerPar gaf code ${parResult}.`);
    return {
      source: "dds",
      cells: readDdsTableFromPointer(module, tablePointer),
      par: readDdsDealerParFromPointer(module, parPointer),
    };
  } finally {
    module._free(dealPointer);
    module._free(tablePointer);
    module._free(parPointer);
  }
}

async function doubleDummyTableForSession(session) {
  if (session.deal.ddTable?.source === "dds" && session.deal.ddTable.cells && session.deal.ddTable.par) {
    return session.deal.ddTable;
  }
  session.deal.ddTable = await computeDoubleDummyTable(session.deal);
  return session.deal.ddTable;
}

function doubleDummyTricks(ddTable, declarer, strain) {
  return ddTable?.cells?.[strain]?.[declarer] ?? null;
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

function hasSmallSlamTrumpFit(hand, strain) {
  if (strain === "NT") return false;
  const fit = combinedLength(hand, strain);
  if (fit < 9) return false;
  return hasStrongTrumpFit(hand, strain) || hasCombinedRanks(hand, strain, ["K", "Q", "J", "10"]);
}

function hasSideControlsForSlam(hand, trump) {
  return SUITS.filter((suit) => suit !== trump).every((suit) => {
    const owned = new Set(hand.filter((card) => card.suit === suit).map((card) => card.rank));
    return owned.has("A") || owned.has("K");
  });
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
  if (fit >= 9 && stats.hcp >= 28 && controls >= 9 && hasSmallSlamTrumpFit(hand, strain) && hasSideControlsForSlam(hand, strain)) return 6;
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
    if (fit >= 9 && stats.hcp >= 28 && controls >= 9 && hasSmallSlamTrumpFit(hand, strain) && hasSideControlsForSlam(hand, strain)) {
      estimate = Math.max(estimate, 12);
    }
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
      const score = contractScoreMadeWithTricks(bid, sideVulnerable(side, deal.vulnerability), 1, tricks);
      if (score > best.score) best = { side, bid, score, tricks };
    }
  }
  return best;
}

function bestDoubleDummyContractForSide(deal, ddTable, side) {
  let best = { side, bid: "Pas", score: 0, tricks: 0, declarer: seatsForSide(side)[0] };
  for (const strain of STRAINS) {
    for (const declarer of seatsForSide(side)) {
      const tricks = doubleDummyTricks(ddTable, declarer, strain);
      if (!Number.isFinite(tricks)) continue;
      const maxLevel = Math.max(0, Math.min(7, tricks - 6));
      for (let level = 1; level <= maxLevel; level += 1) {
        const bid = `${level}${strain}`;
        const score = contractScoreMadeWithTricks(bid, sideVulnerable(side, deal.vulnerability), 1, tricks);
        if (
          score > best.score ||
          (score === best.score && best.bid !== "Pas" && bidValue(bid) < bidValue(best.bid))
        ) {
          best = { side, bid, score, tricks, declarer };
        }
      }
    }
  }
  return best;
}

function indicativePar(deal, ddTable = null) {
  if (ddTable?.par) {
    return normalizeDdsPar(ddTable.par);
  }
  const ns = ddTable ? bestDoubleDummyContractForSide(deal, ddTable, "NZ") : bestContractForSide(deal, "NZ");
  const ow = ddTable ? bestDoubleDummyContractForSide(deal, ddTable, "OW") : bestContractForSide(deal, "OW");
  if (ns.score >= ow.score) {
    return { ...ns, nzScore: ns.score, label: ns.bid === "Pas" ? "Rondpas" : `NZ ${displayCall(ns.bid)}` };
  }
  return { ...ow, nzScore: -ow.score, label: `OW ${displayCall(ow.bid)}` };
}

function expectedFinalScore(deal, auction, ddTable = null) {
  const contract = lastContract(auction);
  if (!contract) return { label: "Rondgepast", nzScore: 0, side: "NZ", made: true };
  const declarer = declarerForFinalContract(auction);
  const side = sideForSeat(declarer);
  const [level, strain] = bidParts(contract.call);
  const needed = level + 6;
  const ddTricks = ddTable ? doubleDummyTricks(ddTable, declarer, strain) : null;
  const tricks = Number.isFinite(ddTricks) ? ddTricks : estimateTricks(deal, side, strain);
  const vulnerable = sideVulnerable(side, deal.vulnerability);
  const multiplier = finalContractMultiplier(auction);
  const doubledText = multiplier === 4 ? " geredubbeld" : multiplier === 2 ? " gedubbeld" : "";
  if (tricks >= needed) {
    const rawScore = contractScoreMadeWithTricks(contract.call, vulnerable, multiplier, tricks);
    const madeText = ddTable ? `DD ${tricks} slagen` : "verwacht gemaakt";
    return {
      label: `${displayCall(contract.call)}${doubledText} door ${SEAT_NAMES[declarer]}, ${madeText}`,
      nzScore: scoreForNz(rawScore, side),
      side,
      made: true,
      tricks,
    };
  }
  const down = needed - tricks;
  const rawScore = -contractPenaltyDown(down, vulnerable, multiplier);
  return {
    label: `${displayCall(contract.call)}${doubledText} door ${SEAT_NAMES[declarer]}, ${ddTable ? "DD" : "verwacht"} ${down} down`,
    nzScore: scoreForNz(rawScore, side),
    side,
    made: false,
    tricks,
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

function linCardRank(rank) {
  return rank === "10" ? "T" : rank;
}

function linHand(hand) {
  return SUITS.map((suit) => `${suit}${hand
    .filter((card) => card.suit === suit)
    .map((card) => linCardRank(card.rank))
    .join("")}`).join("");
}

function linBid(call) {
  if (call === "P") return "P";
  if (call === "X") return "D";
  if (call === "XX") return "R";
  const [level, strain] = bidParts(call);
  return `${level}${strain === "NT" ? "N" : strain}`;
}

function bboVulnerability(vulnerability) {
  if (vulnerability === "NZ") return "n";
  if (vulnerability === "OW") return "e";
  if (vulnerability === "Allen") return "b";
  return "0";
}

function bboDealerCode(dealer) {
  return { S: "1", W: "2", N: "3", E: "4" }[dealer] || "3";
}

function bboHandviewerUrl(session, pairState) {
  const hands = session.deal.hands;
  const md = `${bboDealerCode(session.deal.dealer)}${[hands.S, hands.W, hands.N, hands.E].map(linHand).join(",")}`;
  const linParts = [
    "pn", "Zuid,West,Noord,Oost",
    "st", "",
    "md", md,
    "sv", bboVulnerability(session.deal.vulnerability),
    "ah", `Board ${session.board}`,
  ];
  for (const entry of pairState.auction || []) {
    linParts.push("mb", linBid(entry.call));
  }
  const lin = `${linParts.join("|")}|`;
  return `https://www.bridgebase.com/tools/handviewer.html?bbo=y&lin=${encodeURIComponent(lin)}`;
}

function nzFinalJudgement(deal, auction, ddTable = null) {
  const contract = lastContract(auction);
  const par = indicativePar(deal, ddTable);
  const finalScore = expectedFinalScore(deal, auction, ddTable);
  const parText = ddTable ? "DD par" : "indicatieve par";
  if (!contract) return par.score === 0 ? "OK: rondpassen lijkt passend." : `Niet ideaal: ${parText} is ${par.label}.`;
  const declarer = declarerForFinalContract(auction);
  if (sideForSeat(declarer) !== "NZ") return `NZ heeft niet het eindcontract; ${parText} is ${par.label}.`;
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
    return ddTable ? "OK: praktisch even goed als DD par." : "OK: praktisch even goed als de indicatieve par.";
  }
  if (gap <= 140) return "Redelijk: NZ mist waarschijnlijk wat score.";
  return `Niet ideaal: NZ blijft duidelijk onder ${parText}.`;
}

async function scoreInfo(session, pairState) {
  if (!isAuctionComplete(pairState.auction)) return null;
  let ddTable = null;
  let ddError = "";
  const ddEnabled = session.ddEnabled !== false;
  if (ddEnabled) {
    try {
      ddTable = await doubleDummyTableForSession(session);
    } catch (error) {
      ddError = error instanceof Error ? error.message : String(error);
    }
  }
  const par = indicativePar(session.deal, ddTable);
  const final = expectedFinalScore(session.deal, pairState.auction, ddTable);
  const note = ddTable
    ? "DDS double-dummy analyse: parscore en eindcontract worden berekend met open kaarten."
    : ddEnabled
      ? `DDS analyse lukte niet (${ddError || "onbekende fout"}). Tijdelijk teruggevallen op richtscore.`
      : "Richtscore: conservatief berekend uit punten, fit, controles en kwetsbaarheid. Zet DD analyse aan in admin voor echte double-dummy score.";
  return {
    par,
    final,
    nzJudgement: nzFinalJudgement(session.deal, pairState.auction, ddTable),
    bboUrl: bboHandviewerUrl(session, pairState),
    note,
    analysisMode: ddTable ? "dds" : "heuristic",
    ddRequested: ddEnabled,
    ddTable: ddTable?.cells || null,
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
  return { label, auction: [], chat: [], nextChatId: 1, lastNotificationKey: "" };
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
    const highestBoard = Object.values(sessions).reduce((highest, session) => Math.max(highest, session.board || 0), 0);
    const storedNextBoard = normalizeInt(details?.nextBoard || 1, 9999) || 1;
    const pushSubscriptions = Array.isArray(details?.pushSubscriptions)
      ? details.pushSubscriptions.map(normalizePushSubscription).filter(Boolean).slice(-5)
      : [];
    registry.players[clean] = {
      name: clean,
      nextBoard: Math.max(storedNextBoard, highestBoard + 1, 1),
      updatedAt: Number(details?.updatedAt || Date.now()),
      sessions,
      pushSubscriptions,
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
    const existing = registry.players[name];
    registry.players[name] = {
      name,
      nextBoard: nextBoardForPlayer(existing),
      sessions: existing?.sessions || {},
      pushSubscriptions: existing?.pushSubscriptions || [],
      updatedAt: now,
    };
  }
}

function upsertPushSubscription(registry, playerName, subscription) {
  const name = normalizePlayerName(playerName);
  const clean = normalizePushSubscription(subscription);
  if (!name || !clean) return false;
  touchPlayers(registry, name);
  const player = registry.players[name];
  const existing = (player.pushSubscriptions || []).filter((item) => item.endpoint !== clean.endpoint);
  player.pushSubscriptions = [...existing, clean].slice(-5);
  player.updatedAt = Date.now();
  return true;
}

async function sendPushToPlayer(registry, playerName, payload) {
  const name = normalizePlayerName(playerName);
  const player = registry.players[name];
  if (!player?.pushSubscriptions?.length) return false;
  const kept = [];
  let sent = false;
  for (const subscription of player.pushSubscriptions) {
    try {
      const result = await sendWebPush(subscription, payload);
      if (result.ok) sent = true;
      if (![404, 410].includes(result.status)) kept.push(subscription);
    } catch {
      kept.push(subscription);
    }
  }
  player.pushSubscriptions = kept;
  player.updatedAt = Date.now();
  return sent;
}

function nextBoardForPlayer(player) {
  const sessions = player?.sessions || {};
  const highestBoard = Object.values(sessions).reduce((highest, session) => Math.max(highest, session.board || 0), 0);
  const storedNextBoard = normalizeInt(player?.nextBoard || 1, 9999) || 1;
  return Math.max(storedNextBoard, highestBoard + 1, 1);
}

function reserveNextBoard(registry, ...names) {
  const cleanNames = [...new Set(names.map(normalizePlayerName).filter(Boolean))];
  if (!cleanNames.length) return 1;
  touchPlayers(registry, ...cleanNames);
  const board = Math.max(...cleanNames.map((name) => nextBoardForPlayer(registry.players[name])));
  for (const name of cleanNames) {
    registry.players[name].nextBoard = Math.min(9999, board + 1);
    registry.players[name].updatedAt = Date.now();
  }
  return board;
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
  registry.players[name].nextBoard = Math.max(nextBoardForPlayer(registry.players[name]), normalizeInt(session.board || 1, 9999) + 1);
  registry.players[name].updatedAt = Date.now();
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
      const before = JSON.stringify(session);
      const complete = pairState ? isAuctionComplete(pairState.auction) : Boolean(row.complete);
      const score = complete && pairState ? await scoreInfo(session, pairState) : null;
      if (JSON.stringify(session) !== before) await saveSession(env, session);
      detailed.push({
        ...row,
        board: normalizeInt(session.board || row.board || 1, 9999) || 1,
        activeSeat: pairState && !complete ? currentSeat(session.deal.dealer, pairState.auction) : null,
        pairCount: Object.keys(session.pairs || {}).length,
        complete,
        analysisMode: score?.analysisMode || null,
        parLabel: score?.par?.label || "",
        parNzScore: score?.par?.nzScore ?? null,
        finalLabel: score?.final?.label || "",
        finalNzScore: score?.final?.nzScore ?? null,
        nzJudgement: score?.nzJudgement || "",
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

function adminCode(env) {
  return String(env.ADMIN_CODE || "bridge").trim();
}

function isAdmin(env, code) {
  return String(code || "").trim() === adminCode(env);
}

function normalizeAdminSettings(value) {
  const defaults = defaultAdminSettings();
  const source = value && typeof value === "object" ? value : {};
  const ddConfigured = Boolean(source.ddConfigured);
  return {
    defaultGeneratorSettings: normalizeSettings(source.defaultGeneratorSettings || defaults.defaultGeneratorSettings),
    ddEnabled: ddConfigured ? Boolean(source.ddEnabled) : defaults.ddEnabled,
    ddConfigured,
  };
}

async function loadAdminSettings(env) {
  if (!env.DB) {
    if (!memoryStates.has(ADMIN_SETTINGS_KEY)) memoryStates.set(ADMIN_SETTINGS_KEY, defaultAdminSettings());
    return normalizeAdminSettings(memoryStates.get(ADMIN_SETTINGS_KEY));
  }
  await ensureDb(env);
  const row = await env.DB.prepare("SELECT payload FROM bied_state WHERE id = ?").bind(ADMIN_SETTINGS_KEY).first();
  if (!row?.payload) return defaultAdminSettings();
  try {
    return normalizeAdminSettings(JSON.parse(row.payload));
  } catch {
    return defaultAdminSettings();
  }
}

async function saveAdminSettings(env, settings) {
  const clean = normalizeAdminSettings(settings);
  if (!env.DB) {
    memoryStates.set(ADMIN_SETTINGS_KEY, clone(clean));
    return clean;
  }
  await ensureDb(env);
  await env.DB.prepare(
    "INSERT INTO bied_state (id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at"
  )
    .bind(ADMIN_SETTINGS_KEY, JSON.stringify(clean), Date.now())
    .run();
  return clean;
}

async function deletePlayer(env, registry, playerName) {
  const name = normalizePlayerName(playerName);
  const player = registry.players[name];
  if (!name || !player) return { registry, deleted: false };
  const sessionIds = Object.keys(player.sessions || {});
  delete registry.players[name];
  for (const sessionId of sessionIds) {
    const session = await loadSession(env, sessionId);
    let changed = false;
    for (const seat of PARTNER_SEATS) {
      if (normalizePlayerName(session.members?.[seat]) === name) {
        session.members[seat] = "";
        changed = true;
      }
    }
    if (changed) await saveSession(env, session);
  }
  return { registry, deleted: true };
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

async function currentResults(session) {
  const rows = [];
  for (const pairState of Object.values(session.pairs || {})) {
    const complete = isAuctionComplete(pairState.auction);
    const score = await scoreInfo(session, pairState);
    rows.push({
      pair: pairState.label,
      complete,
      calls: pairState.auction.length,
      auction: pairState.auction,
      par: score?.par || null,
      final: score?.final || null,
      nzJudgement: score?.nzJudgement || null,
      analysisMode: score?.analysisMode || null,
    });
  }
  return rows;
}

async function notifyNextTurn(registry, session, pairState, actorSeat) {
  if (isAuctionComplete(pairState.auction)) return false;
  const targetSeat = currentSeat(session.deal.dealer, pairState.auction);
  if (!PARTNER_SEATS.includes(targetSeat) || targetSeat === actorSeat) return false;
  const targetPlayer = normalizePlayerName(session.members?.[targetSeat]);
  if (!targetPlayer) return false;
  const key = `${session.sessionId}:${pairState.label}:${pairState.auction.length}:${targetSeat}`;
  if (pairState.lastNotificationKey === key) return false;
  pairState.lastNotificationKey = key;
  return sendPushToPlayer(registry, targetPlayer, {
    title: "Bridge Bieden",
    body: `${SEAT_NAMES[targetSeat]} is aan de beurt op board ${session.board}.`,
    tag: key,
    url: `/index.html?tafel=${encodeURIComponent(session.sessionId)}&speler=${encodeURIComponent(targetPlayer)}&paar=${encodeURIComponent(pairState.label)}&stoel=${encodeURIComponent(targetSeat)}`,
  });
}

async function publicState(session, pairLabel, seatValue, registry, playerName = "") {
  const pair = normalizePair(pairLabel);
  const selectedSeat = normalizeSeat(seatValue);
  const pairState = ensurePair(session, pair);
  processAutoOpponents(session, pairState);
  const complete = isAuctionComplete(pairState.auction);
  const score = await scoreInfo(session, pairState);
  const results = await currentResults(session);
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
    score,
    results,
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
  let adminSettings = null;
  const playerName = normalizePlayerName(url.searchParams.get("player") || body.player);
  const partnerName = normalizePlayerName(url.searchParams.get("partner") || body.partner);
  const pair = normalizePair(url.searchParams.get("pair") || body.pair || pairForPlayers(playerName, partnerName));
  const seat = normalizeSeat(url.searchParams.get("seat") || body.seat);

  try {
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ appVersion: APP_VERSION, dbConnected: Boolean(env.DB) });
    }

    if (request.method === "GET" && url.pathname === "/api/push-public-key") {
      return json({ publicKey: VAPID_PUBLIC_KEY });
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

    if (request.method === "POST" && url.pathname === "/api/push-subscribe") {
      const saved = upsertPushSubscription(registry, playerName, body.subscription);
      registry = await saveRegistry(env, registry);
      return json({ saved });
    }

    if (request.method === "POST" && url.pathname === "/api/admin") {
      if (!isAdmin(env, body.adminCode)) return json({ error: "Admin code is niet juist." }, 403);
      adminSettings = await loadAdminSettings(env);
      return json({ settings: adminSettings, players: playerList(registry) });
    }

    if (request.method === "POST" && url.pathname === "/api/admin-settings") {
      if (!isAdmin(env, body.adminCode)) return json({ error: "Admin code is niet juist." }, 403);
      adminSettings = await saveAdminSettings(env, {
        defaultGeneratorSettings: body.defaultGeneratorSettings,
        ddEnabled: body.ddEnabled,
        ddConfigured: true,
      });
      return json({ settings: adminSettings, players: playerList(registry) });
    }

    if (request.method === "POST" && url.pathname === "/api/admin-delete-player") {
      if (!isAdmin(env, body.adminCode)) return json({ error: "Admin code is niet juist." }, 403);
      const result = await deletePlayer(env, registry, body.playerName);
      registry = await saveRegistry(env, result.registry);
      return json({ deleted: result.deleted, settings: await loadAdminSettings(env), players: playerList(registry) });
    }

    if (request.method === "POST" && url.pathname === "/api/new-session") {
      adminSettings = await loadAdminSettings(env);
      const newSessionId = randomSessionId();
      const boardNumber = reserveNextBoard(registry, playerName, partnerName);
      registry = await saveRegistry(env, registry);
      const newSession = initialSession(newSessionId, boardNumber, body.settings || adminSettings.defaultGeneratorSettings);
      newSession.ddEnabled = adminSettings.ddEnabled !== false;
      newSession.members = {
        [seat]: playerName,
        [partnerSeat(seat)]: partnerName,
      };
      ensurePair(newSession, pair);
      syncSessionPlayers(registry, newSession, pair, false);
      registry = await saveRegistry(env, registry);
      const data = await publicState(newSession, pair, seat, registry, playerName);
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
      const data = await publicState(session, pair, seat, registry, playerName);
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
      session.board = reserveNextBoard(registry, playerName || session.members?.[seat], partnerName || session.members?.[partnerSeat(seat)]);
      session.deal = createDeal(session.board, session.settings);
      resetPairsForNewBoard(session);
      ensurePair(session, pair);
      syncSessionPlayers(registry, session, pair, false);
      registry = await saveRegistry(env, registry);
      const data = await publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/call") {
      const pairState = ensurePair(session, pair);
      processAutoOpponents(session, pairState);
      const active = currentSeat(session.deal.dealer, pairState.auction);
      const call = body.call;
      if (seat !== active) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Niet aan de beurt", ...data }, 409);
      }
      if (!PARTNER_SEATS.includes(seat)) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Alleen Noord en Zuid bieden op de GSM.", ...data }, 403);
      }
      if (call === "X" && !canDouble(pairState.auction, seat)) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "DBL is nu niet geldig.", ...data }, 400);
      }
      if (call === "XX" && !canRedouble(pairState.auction, seat)) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "RDBL is nu niet geldig.", ...data }, 400);
      }
      if (call !== "P" && call !== "X" && call !== "XX" && (!allContractBids().includes(call) || !isHigherBid(call, pairState.auction))) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Bod is niet geldig", ...data }, 400);
      }
      if (!isAuctionComplete(pairState.auction)) pairState.auction.push({ seat, call });
      const data = await publicState(session, pair, seat, registry, playerName);
      await notifyNextTurn(registry, session, pairState, seat);
      syncSessionPlayers(registry, session, pair, isAuctionComplete(pairState.auction));
      registry = await saveRegistry(env, registry);
      await saveSession(env, session);
      return json(data);
    }

    if (request.method === "POST" && url.pathname === "/api/undo") {
      const pairState = ensurePair(session, pair);
      const changed = undoAuctionForSeat(pairState, seat);
      if (!changed) {
        const data = await publicState(session, pair, seat, registry, playerName);
        await saveSession(env, session);
        return json({ error: "Er is nog geen bod van jou om terug te nemen.", ...data }, 409);
      }
      const data = await publicState(session, pair, seat, registry, playerName);
      await notifyNextTurn(registry, session, pairState, seat);
      syncSessionPlayers(registry, session, pair, isAuctionComplete(pairState.auction));
      registry = await saveRegistry(env, registry);
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
      const data = await publicState(session, pair, seat, registry, playerName);
      await saveSession(env, session);
      return json(data);
    }

    return json({ error: "Onbekende actie" }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
}

const EMBEDDED_ASSETS = {
  "/index.html": { body: "﻿<!doctype html>\r\n<html lang=\"nl\">\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\r\n  <meta name=\"theme-color\" content=\"#0e5b42\">\r\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\r\n  <meta name=\"apple-mobile-web-app-title\" content=\"Bridge Bieden\">\r\n  <link rel=\"manifest\" href=\"./manifest.webmanifest\">\r\n  <link rel=\"apple-touch-icon\" href=\"./apple-touch-icon.png\">\r\n  <title>Bridge Bied App</title>\r\n  <style>\r\n    :root{--background:#f4f7f2;--foreground:#18211d;--felt:#0e5b42;--felt-dark:#073b2d;--panel:#fff;--soft:#eef5ef;--line:#cbd8ce;--muted:#627168;--red:#b4233b;--black:#1c2521;--amber:#f1b94e;--blue:#2f6fa3}\r\n    *{box-sizing:border-box}body{margin:0;background:var(--background);color:var(--foreground);font-family:Arial,Helvetica,sans-serif}button,input,select{font:inherit}button{min-height:44px;border:0;border-radius:8px;font-weight:800;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}h1,h2,h3,p{margin-top:0}h1{margin-bottom:0;font-size:clamp(1.45rem,5vw,2.2rem);line-height:1;letter-spacing:0}h2{margin-bottom:0;font-size:1.18rem;line-height:1.15}h3{margin-bottom:8px;font-size:.95rem}\n    .shell{min-height:100svh;padding-bottom:max(20px,env(safe-area-inset-bottom))}.hero{background:linear-gradient(135deg,rgba(14,91,66,.98),rgba(7,59,45,.98));color:#fff;padding:max(10px,env(safe-area-inset-top)) 12px 10px}.hero-inner{display:grid;gap:9px;max-width:1120px;margin:0 auto}.eyebrow,.kicker{margin:0 0 4px;color:rgba(255,255,255,.76);font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0}.kicker{color:var(--muted)}.top-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}.seat-switch{display:flex;gap:8px}.seat-switch button,.ghost,.primary,.secondary{padding:0 14px}.seat-switch button{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff}.seat-switch button.active{background:#fff;color:var(--felt-dark)}.device-pill{display:flex;flex-wrap:wrap;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.28);border-radius:8px;background:rgba(255,255,255,.1);padding:6px 7px 6px 10px}.device-pill span{font-weight:850}.device-pill button{min-height:32px;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.12);color:#fff;padding:0 9px}.setup-card{max-width:700px;margin:12px auto 0;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:14px}.setup-card p{color:rgba(255,255,255,.82);line-height:1.4}.setup-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}.setup-fields label{display:grid;gap:5px;color:rgba(255,255,255,.82);font-size:.86rem;font-weight:800}.link-box{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:9px}.link-box strong{font-size:1rem}.setup-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.setup-actions button{background:#fff;color:var(--felt-dark);font-size:1rem}.primary{background:var(--amber);color:#211604}.secondary{border:1px solid var(--line);background:#fbfcfb;color:var(--felt-dark)}.ghost{border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff}.status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.compact-status{display:flex;flex-wrap:wrap;gap:6px}.compact-status span{border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.1);padding:7px 9px;font-size:.92rem;font-weight:850}.status-card{border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(255,255,255,.1);padding:10px}.status-card span{display:block;color:rgba(255,255,255,.72);font-size:.78rem;font-weight:750}.status-card strong{display:block;margin-top:3px;font-size:.95rem}\n    .content{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:14px;max-width:1120px;margin:0 auto;padding:14px}.panel{border:1px solid var(--line);border-radius:8px;background:var(--panel);padding:14px;box-shadow:0 14px 34px rgba(24,33,29,.08)}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.turn-pill{border:1px solid #c8ddcf;border-radius:8px;background:#e8f6ec;color:#165734;padding:8px 10px;font-size:.84rem;font-weight:850;text-align:right}.turn-pill.done{border-color:#d5c38c;background:#fff5d8;color:#6d4d00}\r\n    .hand-view{display:grid;gap:4px}.suit-line{display:grid;grid-template-columns:28px minmax(0,1fr);gap:7px;align-items:center}.suit-badge{display:grid;place-items:center;width:28px;height:28px;border-radius:7px;background:#f1f5f2;font-size:1.02rem;font-weight:900}.rank-row{min-height:24px;display:flex;align-items:center}.rank-text{font-weight:850;font-size:1.1rem;line-height:1.2;word-break:break-word}.red{color:var(--red)}.black{color:var(--black)}.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.stats span{border-radius:8px;background:var(--soft);color:var(--muted);padding:7px 9px;font-size:.86rem;font-weight:750}.stats strong{color:var(--foreground)}\n    .all-hands{display:grid;grid-template-areas:\"north north north\" \"west center east\" \"south south south\";grid-template-columns:minmax(0,1fr) 16px minmax(0,1fr);gap:7px;align-items:center}.shown-hand{border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:8px;min-width:0}.shown-hand.partner{border-color:#b9d5c3;background:#f5fbf7}.shown-hand h3{margin:0 0 5px;font-size:.94rem}.shown-hand.north,.shown-hand.south{width:min(76%,360px);justify-self:center}.shown-hand.north{grid-area:north}.shown-hand.west{grid-area:west}.shown-hand.east{grid-area:east}.shown-hand.south{grid-area:south}.table-center{grid-area:center;display:grid;place-items:center;min-height:20px;color:var(--muted);font-size:.9rem;font-weight:900}.shown-hand .hand-view{display:grid;grid-template-columns:1fr;gap:2px}.shown-hand .suit-line{display:grid;grid-template-columns:18px minmax(0,1fr);gap:4px;align-items:center;min-width:0}.shown-hand .suit-badge{width:18px;min-width:18px;height:18px;border-radius:5px;background:transparent;font-size:.78rem}.shown-hand .rank-text{display:block;min-width:0;font-size:.86rem;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:clip}.shown-hand .rank-row{min-width:0;min-height:18px}.shown-hand .stats{margin-top:8px;gap:5px}.shown-hand .stats span{padding:5px 7px;font-size:.78rem}\n    .bid-tools{display:flex;justify-content:flex-end;margin:0 0 8px}.bid-pad{display:grid;grid-template-columns:repeat(5,minmax(50px,1fr));gap:8px;max-height:340px;overflow:auto}.bid-pad button{border:1px solid var(--line);background:#fbfcfb;color:var(--foreground)}.bid-pad .pass{grid-column:1/-1;background:var(--blue);color:#fff}.bid-pad .red-bid{color:var(--red)}.notice{margin:10px 0 0;color:var(--muted);font-size:.9rem;line-height:1.35}\n    .auction-table{display:grid;grid-template-columns:repeat(4,minmax(62px,1fr));overflow:hidden;border:1px solid var(--line);border-radius:8px;background:#fbfcfb}.auction-head,.auction-cell{min-height:38px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:7px}.auction-head:nth-child(4n),.auction-cell:nth-child(4n){border-right:0}.auction-head{background:#eef5ef;color:var(--muted);font-size:.86rem;font-weight:850}.auction-head.partner{background:#dff1e5;color:#165734}.auction-cell{display:flex;align-items:center;gap:6px}.auction-cell.partner{background:#f5fbf7}.auction-cell.empty-cell{background:#fbfcfb}.call{display:inline-grid;place-items:center;min-width:42px;min-height:30px;border-radius:6px;font-weight:850}.pass-call{background:#e9eeeb;color:#5e6d64}.contract-call{background:#0f654a;color:#fff}.empty{color:#9aa9a0}\r\n    .score-card{display:grid;gap:10px;border:1px solid #b9d5c3;border-radius:8px;background:#eff8f2;padding:12px}.score-card h3{margin:0;color:#165734}.score-line{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #d4e6da;padding-top:8px;color:var(--muted);font-size:.92rem}.score-line strong{color:var(--foreground);text-align:right}.score-note{margin:0;color:var(--muted);font-size:.82rem;line-height:1.35}.results-list{display:grid;gap:8px}.result-row{display:grid;grid-template-columns:minmax(92px,.8fr) minmax(0,1.35fr) minmax(0,1fr);gap:8px;align-items:start;border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:9px}.result-row strong{font-size:.95rem}.result-row span{color:var(--muted);font-size:.86rem}.result-row.done{border-color:#b9d5c3;background:#f5fbf7}\r\n    .settings{display:grid;gap:10px}.settings-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.settings label{display:grid;gap:5px;color:var(--muted);font-size:.84rem;font-weight:800}select,input{width:100%;min-height:40px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--foreground);padding:0 9px}.filter-grid{display:grid;grid-template-columns:minmax(92px,1fr) repeat(5,minmax(52px,.75fr));gap:7px;overflow-x:auto}.filter-row{display:contents}.filter-head,.filter-row strong{display:flex;align-items:center;min-height:34px;color:var(--muted);font-size:.8rem;font-weight:850}.filter-grid input{text-align:center;min-width:52px}\n    .session-list{display:grid;gap:8px;margin-top:12px}.session-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:9px}.session-row.complete{border-color:rgba(232,246,236,.62);background:rgba(232,246,236,.18)}.session-row strong{display:block}.session-row span{color:rgba(255,255,255,.76);font-size:.84rem}.session-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}.session-status{display:inline-flex;align-items:center;min-height:24px;border-radius:8px;padding:3px 7px;font-size:.78rem;font-weight:850}.session-status.done{background:#e8f6ec;color:#145333}.session-status.busy{background:#fff5d8;color:#6d4d00}.session-actions{display:flex;gap:6px}.session-row button{min-height:36px;background:#fff;color:var(--felt-dark);padding:0 12px}.session-row button.danger{border:1px solid #f0c3c3;background:#fff2f2;color:#8b1e1e}.admin-panel{display:grid;gap:10px;margin-top:12px;border:1px solid rgba(255,255,255,.22);border-radius:8px;background:rgba(255,255,255,.1);padding:10px}.admin-panel h2{font-size:1rem}.admin-panel .settings{border-radius:8px;background:#fff;padding:10px;color:var(--foreground)}.admin-panel label.checkbox{display:flex;align-items:center;gap:8px;color:#fff;font-weight:850}.admin-panel input[type=\"checkbox\"]{width:18px;min-height:18px}.admin-users{display:grid;gap:7px}.admin-user{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.22);border-radius:8px;padding:8px}.admin-user button{min-height:34px;border:1px solid #f0c3c3;background:#fff2f2;color:#8b1e1e;padding:0 10px}.chat-log{display:grid;gap:8px;max-height:260px;overflow:auto;border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:10px}.chat-msg{display:grid;gap:2px}.chat-msg.mine{text-align:right}.chat-msg span{color:var(--muted);font-size:.75rem;font-weight:750}.chat-msg p{display:inline-block;margin:0;border-radius:8px;background:var(--soft);padding:8px 10px;line-height:1.35}.chat-msg.mine p{background:#dff1e5}.chat-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:10px}.error{margin:0 0 10px;border:1px solid #f0c3c3;border-radius:8px;background:#fff2f2;color:#8b1e1e;padding:9px 10px;font-weight:750}\n    @media (max-width:860px){.content{grid-template-columns:1fr}.status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.settings-row,.setup-fields{grid-template-columns:1fr}}@media (max-width:520px){.content{padding:10px}.hero{padding-left:10px;padding-right:10px}.top-actions{align-items:stretch}.seat-switch,.top-actions .primary,.device-pill{width:100%}.seat-switch button{flex:1}.setup-actions{grid-template-columns:1fr}.bid-pad{grid-template-columns:repeat(4,minmax(50px,1fr))}.auction-head,.auction-cell{padding:6px}.call{min-width:38px}.all-hands{grid-template-columns:minmax(0,1fr) 14px minmax(0,1fr);gap:6px}.table-center{min-height:18px;font-size:.8rem}.shown-hand{padding:7px}.shown-hand.north,.shown-hand.south{width:min(78%,260px)}.shown-hand h3{font-size:.86rem}.shown-hand .rank-text{font-size:.8rem}.shown-hand .suit-line{grid-template-columns:16px minmax(0,1fr);gap:3px}.shown-hand .suit-badge{width:16px;min-width:16px;height:16px}}\n  </style>\n  <style>\n    .info-button{display:inline-grid;place-items:center;width:34px;min-width:34px;height:34px;min-height:34px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-weight:900;padding:0}\n    .help-overlay{position:fixed;inset:0;z-index:20;display:grid;place-items:center;background:rgba(7,28,22,.58);padding:18px}\n    .help-card{width:min(520px,100%);border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--foreground);padding:16px;box-shadow:0 22px 60px rgba(0,0,0,.28)}\n    .help-card h2{margin-bottom:10px}\n    .help-card ul{margin:0 0 12px;padding-left:18px;line-height:1.35}\n    .help-card li{margin-bottom:7px}\n    .help-card button{width:100%;background:var(--felt);color:#fff}\n    .session-toolbar{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.session-toolbar button,.link-box button{min-height:34px;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.1);color:#fff;padding:0 10px}.link-box button{background:#fff;color:var(--felt-dark)}.session-toolbar button.active{background:#fff;color:var(--felt-dark)}.session-score{display:grid;gap:3px;margin-top:7px;color:rgba(255,255,255,.8);font-size:.82rem}.session-score strong{display:inline;color:#fff}.result-card{display:grid;gap:8px;border:1px solid var(--line);border-radius:8px;background:#fbfcfb;padding:9px}.result-card.done{border-color:#b9d5c3;background:#f5fbf7}.result-main{display:grid;grid-template-columns:minmax(92px,.8fr) minmax(0,1.35fr) minmax(0,1fr) auto;gap:8px;align-items:start}.result-main strong{font-size:.95rem}.result-main span{color:var(--muted);font-size:.86rem}.result-main button{min-height:32px;border:1px solid var(--line);background:#fff;color:var(--felt-dark);padding:0 9px;font-size:.82rem}.result-auction{display:grid;gap:6px}.result-auction h3{margin:0;color:var(--muted);font-size:.82rem}.par-summary{border:1px solid #b9d5c3;border-radius:8px;background:#eff8f2;color:#165734;padding:8px 9px;font-weight:850}\n    @media (max-width:520px){.result-main{grid-template-columns:1fr auto}.result-main span{grid-column:1/-1}.session-toolbar button{flex:1}.session-actions{flex-direction:column}.session-row{grid-template-columns:1fr auto}}\n  </style>\n</head>\n<body>\r\n  <main class=\"shell\" id=\"app\"></main>\r\n  <script>\r\n    const seats = [\"N\", \"E\", \"S\", \"W\"];\r\n    const partnerSeats = [\"N\", \"S\"];\r\n    const suits = [\"S\", \"H\", \"D\", \"C\"];\r\n    const suitMeta = {\r\n      S: { label: \"Schoppen\", short: \"S\", symbol: \"\\u2660\", cls: \"black\" },\n      H: { label: \"Harten\", short: \"H\", symbol: \"\\u2665\", cls: \"red\" },\n      D: { label: \"Ruiten\", short: \"R\", symbol: \"\\u2666\", cls: \"red\" },\n      C: { label: \"Klaveren\", short: \"K\", symbol: \"\\u2663\", cls: \"black\" }\n    };\r\n    const seatNames = { N: \"Noord\", E: \"Oost\", S: \"Zuid\", W: \"West\" };\n    const filterTargets = [\"N\", \"S\", \"E\", \"W\", \"NZ\"];\n    const filterTargetNames = { N: \"Noord\", S: \"Zuid\", E: \"Oost\", W: \"West\", NZ: \"NZ samen\" };\n    const vulnerabilities = [\"Niemand\", \"NZ\", \"OW\", \"Allen\"];\n    function cleanSession(value) {\r\n      const clean = String(value || \"\").toUpperCase().replace(/[^A-Z0-9-]/g, \"\").slice(0, 24);\r\n      return clean.length >= 3 ? clean : \"\";\r\n    }\r\n    function newSessionCode() {\r\n      const chars = \"ABCDEFGHJKLMNPQRSTUVWXYZ23456789\";\r\n      let code = \"\";\r\n      for (let index = 0; index < 6; index += 1) code += chars[Math.floor(Math.random() * chars.length)];\r\n      return code;\r\n    }\r\n    function initialSession() {\n      const params = new URLSearchParams(location.search);\n      const fromUrl = cleanSession(params.get(\"tafel\"));\n      const session = fromUrl || newSessionCode();\n      if (fromUrl) localStorage.setItem(\"biedapp-last-session\", session);\n      if (fromUrl && params.get(\"tafel\") !== session) {\n        params.set(\"tafel\", session);\n        history.replaceState(null, \"\", `${location.pathname}?${params.toString()}${location.hash}`);\n      }\n      return session;\r\n    }\r\n    function storageKey(name, session) {\n      return `biedapp-${name}-${session}`;\n    }\n    function normalizePairName(value) {\n      return String(value || \"\").trim().replace(/\\s+/g, \" \").slice(0, 40) || \"Paar 1\";\n    }\n    function normalizeOptionalName(value) {\n      return String(value || \"\").trim().replace(/\\s+/g, \" \").slice(0, 40);\n    }\n    function pairForPlayers(playerName, partnerName) {\n      const names = [normalizeOptionalName(playerName), normalizeOptionalName(partnerName)].filter(Boolean);\n      if (!names.length) return \"\";\n      return [...new Set(names)].sort((left, right) => left.localeCompare(right, \"nl-BE\")).join(\" + \");\n    }\n    function urlParam(name) {\n      return new URLSearchParams(location.search).get(name) || \"\";\n    }\n    function normalizeSeat(value) {\n      return partnerSeats.includes(value) ? value : \"\";\n    }\n    function otherSeat(value) {\n      return value === \"N\" ? \"S\" : \"N\";\n    }\n    function writeSessionToUrl(session) {\n      const params = new URLSearchParams(location.search);\n      params.set(\"tafel\", session);\n      history.replaceState(null, \"\", `${location.pathname}?${params.toString()}${location.hash}`);\n    }\n    const sessionId = initialSession();\n    const hasDirectSession = Boolean(cleanSession(urlParam(\"tafel\")));\n    const state = {\n      session: sessionId,\n      player: normalizeOptionalName(urlParam(\"speler\") || localStorage.getItem(\"biedapp-player\")),\n      partner: normalizeOptionalName(urlParam(\"partner\") || localStorage.getItem(storageKey(\"partner\", sessionId))),\n      pair: hasDirectSession ? normalizeOptionalName(urlParam(\"paar\")) || localStorage.getItem(storageKey(\"pair\", sessionId)) || \"\" : \"\",\n      seat: hasDirectSession ? normalizeSeat(urlParam(\"stoel\")) || localStorage.getItem(storageKey(\"seat\", sessionId)) || \"\" : \"\",\n      data: null,\n      draftSettings: null,\n      draftBoard: null,\n      error: \"\",\n      busy: false,\n      canInstall: false,\n      pendingRender: false,\n      sessionFilter: localStorage.getItem(\"biedapp-session-filter\") || \"all\",\n      comparePair: \"\",\n      notificationsEnabled: false,\n      notificationsSupported: false\n    };\n    state.showAdmin = false;\n    state.admin = { code: localStorage.getItem(\"biedapp-admin-code\") || \"\", settings: null, players: [], error: \"\", loggedIn: false };\n    let deferredInstallPrompt = null;\n    function switchSession(value) {\n      const nextSession = cleanSession(value);\n      if (!nextSession || nextSession === state.session) return false;\n      state.session = nextSession;\n      state.pair = localStorage.getItem(storageKey(\"pair\", nextSession)) || \"\";\n      state.seat = localStorage.getItem(storageKey(\"seat\", nextSession)) || \"\";\n      state.partner = localStorage.getItem(storageKey(\"partner\", nextSession)) || \"\";\n      state.draftSettings = null;\n      state.draftBoard = null;\n      localStorage.setItem(\"biedapp-last-session\", nextSession);\n      writeSessionToUrl(nextSession);\n      return true;\n    }\n\r\n    function displayCall(call) {\n      if (call === \"P\") return \"Pas\";\n      if (call === \"X\") return \"DBL\";\n      if (call === \"XX\") return \"RDBL\";\n      const level = call.slice(0, 1);\n      const strain = call.slice(1);\n      return strain === \"NT\" ? `${level}SA` : `${level}${suitMeta[strain].symbol}`;\n    }\r\n    function formatNzScore(score) {\r\n      if (score > 0) return `+${score} NZ`;\r\n      if (score < 0) return `${score} NZ`;\r\n      return \"0\";\r\n    }\r\n    function htmlEscape(text) {\n      return String(text).replace(/[&<>\"']/g, (ch) => ({ \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" }[ch]));\n    }\n    function infoButtonHtml() {\n      return `<button class=\"info-button\" data-info-help type=\"button\" aria-label=\"Uitleg\">i</button>`;\n    }\n    function helpOverlayHtml() {\n      return `<div class=\"help-overlay\" data-help-overlay><section class=\"help-card\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"help-title\"><h2 id=\"help-title\">Kort gebruik</h2><ul><li>Kies je naam op deze GSM. Die naam blijft op dit toestel bewaard.</li><li>Kies je partner en start als Noord of Zuid. Laat partner leeg om alleen op één GSM te testen.</li><li>Noord en Zuid bieden om de beurt. Oost/West past of biedt volgens de instelling.</li><li>Na de bieding zie je alle handen, richtscore, oordeel, vergelijking en chat.</li><li>Met Overzicht ga je terug naar je boards. Wis verwijdert een board uit jullie lijst.</li></ul><button data-close-help type=\"button\">Sluit</button></section></div>`;\n    }\n    function showHelp() {\n      document.querySelector(\"[data-help-overlay]\")?.remove();\n      document.body.insertAdjacentHTML(\"beforeend\", helpOverlayHtml());\n    }\n    function activePair() {\n      return normalizePairName(state.pair || pairForPlayers(state.player, state.partner) || \"Paar 1\");\n    }\n    function apiPath(path) {\n      const params = new URLSearchParams({\n        session: state.session,\n        pair: activePair(),\n        seat: state.seat || \"N\",\n        player: state.player || \"\",\n        partner: state.partner || \"\"\n      });\n      return `${path}?${params.toString()}`;\n    }\n    function apiBody(extra = {}) {\n      return JSON.stringify({\n        session: state.session,\n        pair: activePair(),\n        seat: state.seat || \"N\",\n        player: state.player || \"\",\n        partner: state.partner || \"\",\n        ...extra\n      });\n    }\n    function shareUrl() {\n      const url = new URL(location.href);\n      url.pathname = url.pathname.endsWith(\"/\") ? `${url.pathname}index.html` : url.pathname;\n      url.searchParams.set(\"tafel\", state.session);\n      url.searchParams.set(\"paar\", activePair());\n      if (state.seat) url.searchParams.set(\"stoel\", state.seat === \"N\" ? \"S\" : \"N\");\n      if (state.partner) url.searchParams.set(\"speler\", state.partner);\n      if (state.player) url.searchParams.set(\"partner\", state.player);\n      return url.toString();\n    }\n    async function shareSession() {\n      const url = shareUrl();\n      try {\n        if (navigator.share) {\n          await navigator.share({ title: \"Bridge Bied App\", text: `Bridge sessie ${state.session}`, url });\r\n        } else if (navigator.clipboard) {\r\n          await navigator.clipboard.writeText(url);\r\n          state.error = \"Link gekopieerd. Stuur die via WhatsApp, SMS of mail.\";\r\n          render();\r\n        }\r\n      } catch {\r\n        state.error = url;\r\n        render();\n      }\n    }\n    function base64UrlToUint8Array(value) {\n      const padding = \"=\".repeat((4 - value.length % 4) % 4);\n      const base64 = `${value}${padding}`.replace(/-/g, \"+\").replace(/_/g, \"/\");\n      const raw = atob(base64);\n      const output = new Uint8Array(raw.length);\n      for (let index = 0; index < raw.length; index += 1) output[index] = raw.charCodeAt(index);\n      return output;\n    }\n    function updateNotificationSupport() {\n      state.notificationsSupported = \"Notification\" in window && \"serviceWorker\" in navigator && \"PushManager\" in window && location.protocol !== \"file:\";\n    }\n    async function updateNotificationState() {\n      updateNotificationSupport();\n      if (!state.notificationsSupported) return;\n      try {\n        const registration = await navigator.serviceWorker.ready;\n        const subscription = await registration.pushManager.getSubscription();\n        state.notificationsEnabled = Boolean(subscription) && Notification.permission === \"granted\";\n        renderWhenFree();\n      } catch {\n        state.notificationsEnabled = false;\n      }\n    }\n    async function enableNotifications() {\n      updateNotificationSupport();\n      if (!state.notificationsSupported) {\n        state.error = \"Meldingen worden niet ondersteund in deze browser. Op iPhone werkt dit alleen als de app op het beginscherm staat.\";\n        render();\n        return;\n      }\n      if (!state.player) {\n        state.error = \"Kies eerst je naam, dan kan de app meldingen aan jou koppelen.\";\n        render();\n        return;\n      }\n      const permission = await Notification.requestPermission();\n      if (permission !== \"granted\") {\n        state.error = \"Meldingen zijn niet toegestaan op dit toestel.\";\n        render();\n        return;\n      }\n      try {\n        const registration = await navigator.serviceWorker.ready;\n        const current = await registration.pushManager.getSubscription();\n        const keyResponse = await fetch(\"/api/push-public-key\", { cache: \"no-store\" });\n        const keyData = await keyResponse.json();\n        const subscription = current || await registration.pushManager.subscribe({\n          userVisibleOnly: true,\n          applicationServerKey: base64UrlToUint8Array(keyData.publicKey),\n        });\n        await fetch(\"/api/push-subscribe\", {\n          method: \"POST\",\n          headers: { \"Content-Type\": \"application/json\" },\n          body: JSON.stringify({ player: state.player, subscription }),\n        });\n        state.notificationsEnabled = true;\n        state.error = \"Meldingen staan aan voor deze naam op dit toestel.\";\n      } catch {\n        state.error = \"Meldingen konden niet aangezet worden op dit toestel.\";\n      }\n      render();\n    }\n    async function api(path, options = {}) {\n      const response = await fetch(apiPath(path), {\n        ...options,\n        headers: { \"Content-Type\": \"application/json\", ...(options.headers || {}) }\n      });\n      const data = await response.json();\r\n      if (!response.ok && data.error) state.error = data.error;\r\n      else state.error = \"\";\r\n      state.data = data;\r\n      render();\n      return data;\n    }\n    function shouldHoldRender() {\n      const el = document.activeElement;\n      if (!el) return false;\n      return el.matches(\"input, textarea, select\");\n    }\n    function renderWhenFree() {\n      if (shouldHoldRender()) {\n        state.pendingRender = true;\n        return;\n      }\n      state.pendingRender = false;\n      render();\n    }\n    async function refresh() {\n      if (state.busy) return;\n      try {\n        let response;\n        if (!state.player) {\n          response = await fetch(\"/api/players\", { cache: \"no-store\" });\n          const data = await response.json();\n          state.data = { players: data.players || [], mySessions: [] };\n          renderWhenFree();\n          return;\n        }\n        if (!state.seat || !state.pair) {\n          const params = new URLSearchParams({ player: state.player });\n          response = await fetch(`/api/sessions?${params.toString()}`, { cache: \"no-store\" });\n          const data = await response.json();\n          state.data = { players: data.players || [], mySessions: data.sessions || [] };\n          renderWhenFree();\n          return;\n        }\n        response = await fetch(apiPath(\"/api/state\"), { cache: \"no-store\" });\n        state.data = await response.json();\n        renderWhenFree();\n      } catch {\n        state.error = \"Geen verbinding met de biedserver.\";\n        renderWhenFree();\n      }\n    }\n    async function installApp() {\n      if (!deferredInstallPrompt) return;\n      const promptEvent = deferredInstallPrompt;\n      deferredInstallPrompt = null;\n      state.canInstall = false;\n      renderWhenFree();\n      await promptEvent.prompt();\n    }\n    function compactRank(rank) {\n      return rank === \"10\" ? \"T\" : rank;\n    }\n    function rankString(hand, suit) {\n      const value = hand.filter((card) => card.suit === suit).map((card) => compactRank(card.rank)).join(\"\");\n      return value || \"-\";\n    }\n    function handHtml(hand) {\n      return `<div class=\"hand-view\">${suits.map((suit) => `<div class=\"suit-line\"><span class=\"suit-badge ${suitMeta[suit].cls}\">${suitMeta[suit].symbol}</span><div class=\"rank-row\"><span class=\"rank-text ${suitMeta[suit].cls}\">${rankString(hand, suit)}</span></div></div>`).join(\"\")}</div>`;\n    }\n    function statsHtml(stats) {\r\n      return `<div class=\"stats\"><span><strong>${stats.hcp}</strong> punten</span><span><strong>${stats.shape}</strong> verdeling</span><span>${stats.balanced ? \"Gebalanceerd\" : \"Ongebalanceerd\"}</span></div>`;\r\n    }\r\n    function allHandsGridHtml(data) {\r\n      if (!data.complete) return \"\";\r\n      if (!data.allHands) {\r\n        return `<p class=\"notice\">De pagina is vernieuwd, maar de biedserver draait nog op de oude versie. Stop het zwarte servervenster en start <strong>start_biedapp.bat</strong> opnieuw.</p>`;\r\n      }\r\n      const order = [\"N\", \"W\", \"E\", \"S\"];\n      const area = { N: \"north\", E: \"east\", S: \"south\", W: \"west\" };\n      return `<div class=\"all-hands\">${order.map((seat) => `<div class=\"shown-hand ${area[seat]} ${partnerSeats.includes(seat) ? \"partner\" : \"\"}\"><h3>${seatNames[seat]}</h3>${handHtml(data.allHands[seat])}</div>`).join(\"\")}<div class=\"table-center\">*</div></div>`;\n    }\n    function auctionRoundRows(auction, dealer) {\r\n      const rows = [];\r\n      const dealerIndex = seats.indexOf(dealer);\r\n      auction.forEach((entry, index) => {\r\n        const rowIndex = Math.floor((dealerIndex + index) / seats.length);\r\n        if (!rows[rowIndex]) rows[rowIndex] = { N: null, E: null, S: null, W: null };\r\n        rows[rowIndex][entry.seat] = entry.call;\r\n      });\r\n      return rows.length ? rows : [{ N: null, E: null, S: null, W: null }];\r\n    }\r\n    function auctionTableHtml(auction, dealer) {\r\n      const rounds = auctionRoundRows(auction, dealer);\r\n      return `<div class=\"auction-table\">${seats.map((seat) => `<div class=\"auction-head ${partnerSeats.includes(seat) ? \"partner\" : \"\"}\">${seatNames[seat]}</div>`).join(\"\")}${rounds.map((round) => seats.map((seat) => {\r\n        const call = round[seat];\r\n        return `<div class=\"auction-cell ${partnerSeats.includes(seat) ? \"partner\" : \"\"} ${call ? \"\" : \"empty-cell\"}\">${call ? `<span class=\"call ${call === \"P\" ? \"pass-call\" : \"contract-call\"}\">${displayCall(call)}</span>` : `<span class=\"empty\">&middot;</span>`}</div>`;\n      }).join(\"\")).join(\"\")}</div>`;\r\n    }\r\n    function settingsHtml(settings, mode = \"board\") {\n      const settingAttr = mode === \"admin\" ? \"data-admin-setting\" : \"data-setting\";\n      const hcpAttr = mode === \"admin\" ? \"data-admin-hcp\" : \"data-hcp\";\n      const suitAttr = mode === \"admin\" ? \"data-admin-suit\" : \"data-suit\";\n      return `<div class=\"settings\">\n        <div class=\"settings-row\">\n          <label>Dealer<select ${settingAttr}=\"dealerMode\"><option value=\"cycle\"${settings.dealerMode === \"cycle\" ? \" selected\" : \"\"}>Boardvolgorde</option><option value=\"random\"${settings.dealerMode === \"random\" ? \" selected\" : \"\"}>Random</option>${seats.map((seat) => `<option value=\"${seat}\"${settings.dealerMode === seat ? \" selected\" : \"\"}>${seatNames[seat]}</option>`).join(\"\")}</select></label>\n          <label>Kwets<select ${settingAttr}=\"vulnerabilityMode\"><option value=\"cycle\"${settings.vulnerabilityMode === \"cycle\" ? \" selected\" : \"\"}>Boardvolgorde</option><option value=\"random\"${settings.vulnerabilityMode === \"random\" ? \" selected\" : \"\"}>Random</option>${vulnerabilities.map((vuln) => `<option value=\"${vuln}\"${settings.vulnerabilityMode === vuln ? \" selected\" : \"\"}>${vuln}</option>`).join(\"\")}</select></label>\n          <label>OW<select ${settingAttr}=\"opponentMode\"><option value=\"pass\"${settings.opponentMode === \"pass\" ? \" selected\" : \"\"}>Past automatisch</option><option value=\"auto\"${settings.opponentMode === \"auto\" ? \" selected\" : \"\"}>Biedt simpel mee</option></select></label>\n        </div>\n        <div class=\"filter-grid\">\n          <div class=\"filter-head\">Hand</div><div class=\"filter-head\">Min pntn</div>${suits.map((suit) => `<div class=\"filter-head\">${suitMeta[suit].short}</div>`).join(\"\")}\n          ${filterTargets.map((target) => `<div class=\"filter-row\"><strong>${filterTargetNames[target]}</strong><input ${hcpAttr}=\"${target}\" type=\"number\" min=\"0\" max=\"${target === \"NZ\" ? 40 : 37}\" value=\"${settings.filters[target].minHcp}\">${suits.map((suit) => `<input ${suitAttr}=\"${target}:${suit}\" type=\"number\" min=\"0\" max=\"${target === \"NZ\" ? 26 : 13}\" value=\"${settings.filters[target].minSuitLengths[suit]}\">`).join(\"\")}</div>`).join(\"\")}\n        </div>\n      </div>`;\n    }\n    function scoreHtml(score) {\n      if (!score) return \"\";\n      const bbo = score.bboUrl ? `<div class=\"score-line\"><span>BBO</span><strong><a href=\"${htmlEscape(score.bboUrl)}\" target=\"_blank\" rel=\"noopener\">Open hand in BBO</a></strong></div>` : \"\";\n      const parLabel = score.analysisMode === \"dds\" ? \"DDS par (double dummy)\" : score.ddRequested ? \"DDS niet gelukt: richtscore\" : \"Par/richtscore\";\n      return `<div class=\"score-card\"><h3>Score na bieding</h3><div class=\"score-line\"><span>${parLabel}</span><strong>${score.par.label} &middot; ${formatNzScore(score.par.nzScore)}</strong></div><div class=\"score-line\"><span>Eindcontract</span><strong>${score.final.label} &middot; ${formatNzScore(score.final.nzScore)}</strong></div><div class=\"score-line\"><span>Eindbod NZ</span><strong>${score.nzJudgement}</strong></div>${bbo}<p class=\"score-note\">${score.note}</p></div>`;\n    }\n    function resultsHtml(results, dealer) {\n      const rows = (results || []).slice().sort((left, right) => left.pair.localeCompare(right.pair));\n      if (!rows.length) return `<p class=\"notice\">Nog geen paren in deze sessie.</p>`;\n      const par = rows.find((row) => row.par)?.par;\n      const parHtml = par ? `<div class=\"par-summary\">DDS par: ${htmlEscape(par.label)} &middot; ${formatNzScore(par.nzScore)}</div>` : \"\";\n      return `${parHtml}<div class=\"results-list\">${rows.map((row) => {\n        const mode = row.analysisMode === \"dds\" ? \"DDS\" : \"Richtscore\";\n        const finalText = row.complete && row.final ? `${htmlEscape(row.final.label)} &middot; ${formatNzScore(row.final.nzScore)}` : `${row.calls || 0} biedingen`;\n        const selected = state.comparePair === row.pair;\n        const auction = selected ? `<div class=\"result-auction\"><h3>Biedverloop ${htmlEscape(row.pair)}</h3>${auctionTableHtml(row.auction || [], dealer)}</div>` : \"\";\n        return `<div class=\"result-card ${row.complete ? \"done\" : \"\"}\"><div class=\"result-main\"><strong>${htmlEscape(row.pair)}</strong><span>${finalText}${row.complete ? ` · ${mode}` : \"\"}</span><span>${row.complete ? htmlEscape(row.nzJudgement || \"\") : \"Nog bezig\"}</span><button data-compare-pair=\"${htmlEscape(row.pair)}\" type=\"button\">${selected ? \"Sluit\" : \"Bieding\"}</button></div>${auction}</div>`;\n      }).join(\"\")}</div>`;\n    }\n    function chatHtml(chat) {\r\n      return `<div class=\"chat-log\">${chat.length ? chat.map((msg) => `<div class=\"chat-msg ${msg.seat === state.seat ? \"mine\" : \"\"}\"><span>${seatNames[msg.seat]} &middot; ${msg.at}</span><p>${htmlEscape(msg.text)}</p></div>`).join(\"\") : `<p class=\"notice\">Nog geen chatberichten.</p>`}</div><form class=\"chat-form\" data-chat-form><input name=\"text\" autocomplete=\"off\" placeholder=\"Bericht aan partner\"><button class=\"primary\" type=\"submit\">Stuur</button></form>`;\n    }\r\n    function cloneSettings(settings) {\r\n      return JSON.parse(JSON.stringify(settings));\r\n    }\r\n    function savedDraftKey(board) {\r\n      return `biedapp-settings-draft-${state.session}-${board}`;\r\n    }\r\n    function settingsDraft(data) {\r\n      if (!state.draftSettings || state.draftBoard !== data.board) {\r\n        const saved = localStorage.getItem(savedDraftKey(data.board));\r\n        try {\r\n          state.draftSettings = saved ? JSON.parse(saved) : cloneSettings(data.settings);\r\n        } catch {\r\n          state.draftSettings = cloneSettings(data.settings);\r\n        }\r\n        state.draftBoard = data.board;\r\n      }\r\n      return state.draftSettings;\r\n    }\r\n    function saveDraftSettings() {\n      if (state.draftSettings && state.draftBoard) {\n        localStorage.setItem(savedDraftKey(state.draftBoard), JSON.stringify(state.draftSettings));\n      }\n    }\n    function notificationButtonHtml() {\n      updateNotificationSupport();\n      if (!state.notificationsSupported) return \"\";\n      return `<button data-enable-notifications type=\"button\">${state.notificationsEnabled ? \"Meldingen aan\" : \"Meldingen\"}</button>`;\n    }\n    function sessionFilterOptions(sessions) {\n      const options = [\n        { value: \"all\", label: \"Alles\" },\n        { value: \"busy\", label: \"Bezig\" },\n        { value: \"done\", label: \"Klaar\" },\n      ];\n      if (sessions.some((item) => !item.partner)) options.push({ value: \"solo\", label: \"Alleen\" });\n      const partner = normalizeOptionalName(state.partner);\n      if (partner && sessions.some((item) => normalizeOptionalName(item.partner) === partner)) {\n        options.push({ value: `partner:${partner}`, label: `Met ${partner}` });\n      }\n      return options;\n    }\n    function filterSessions(sessions) {\n      if (state.sessionFilter === \"busy\") return sessions.filter((item) => !item.complete);\n      if (state.sessionFilter === \"done\") return sessions.filter((item) => item.complete);\n      if (state.sessionFilter === \"solo\") return sessions.filter((item) => !item.partner);\n      if (state.sessionFilter.startsWith(\"partner:\")) {\n        const partner = state.sessionFilter.slice(\"partner:\".length);\n        return sessions.filter((item) => normalizeOptionalName(item.partner) === partner);\n      }\n      return sessions;\n    }\n    function sessionToolbarHtml(sessions) {\n      const options = sessionFilterOptions(sessions);\n      if (!options.some((option) => option.value === state.sessionFilter)) state.sessionFilter = \"all\";\n      return `<div class=\"session-toolbar\">${options.map((option) => `<button class=\"${state.sessionFilter === option.value ? \"active\" : \"\"}\" data-session-filter=\"${htmlEscape(option.value)}\" type=\"button\">${htmlEscape(option.label)}</button>`).join(\"\")}</div>`;\n    }\n    function sessionRowHtml(item) {\n      const partnerText = item.partner ? `Met ${item.partner}` : item.pair;\n      const status = item.complete ? \"Klaar\" : \"Bezig\";\n      const turnText = item.complete ? \"klaar\" : item.activeSeat ? `beurt ${seatNames[item.activeSeat]}` : \"bezig\";\n      const modeText = item.complete ? (item.analysisMode === \"dds\" ? \"DDS\" : item.analysisMode ? \"Richtscore\" : \"Score?\") : \"\";\n      const scoreText = item.complete && item.finalLabel\n        ? `<div class=\"session-score\"><span>${modeText}${item.parLabel ? ` · par <strong>${htmlEscape(item.parLabel)}</strong>` : \"\"}</span><span>Eind <strong>${htmlEscape(item.finalLabel)}</strong> ${formatNzScore(item.finalNzScore)}</span></div>`\n        : \"\";\n      return `<div class=\"session-row ${item.complete ? \"complete\" : \"\"}\"><div><strong>${htmlEscape(partnerText)}</strong><div class=\"session-meta\"><span class=\"session-status ${item.complete ? \"done\" : \"busy\"}\">${status}</span><span>Board ${item.board}</span><span>${turnText}</span><span>${seatNames[item.seat]}</span>${item.pairCount > 1 ? `<span>${item.pairCount} paren</span>` : \"\"}</div>${scoreText}</div><div class=\"session-actions\"><button data-open-session=\"${htmlEscape(item.sessionId)}\" data-open-seat=\"${htmlEscape(item.seat)}\" data-open-pair=\"${htmlEscape(item.pair)}\" data-open-partner=\"${htmlEscape(item.partner)}\" type=\"button\">Open</button><button class=\"danger\" data-delete-session=\"${htmlEscape(item.sessionId)}\" data-delete-board=\"${htmlEscape(item.board)}\" data-delete-pair=\"${htmlEscape(item.pair)}\" data-delete-partner=\"${htmlEscape(item.partner)}\" type=\"button\">Wis</button></div></div>`;\n    }\n    function adminPanelHtml() {\n      if (!state.showAdmin) return `<div class=\"setup-actions\"><button data-admin-open type=\"button\">Admin</button></div>`;\n      if (!state.admin.loggedIn || !state.admin.settings) {\n        return `<div class=\"admin-panel\"><h2>Admin</h2>${state.admin.error ? `<p class=\"error\">${htmlEscape(state.admin.error)}</p>` : \"\"}<div class=\"setup-fields\"><label>Admin code<input data-admin-code type=\"password\" value=\"${htmlEscape(state.admin.code)}\" placeholder=\"admin code\"></label></div><div class=\"setup-actions\"><button data-admin-login type=\"button\">Login</button><button data-admin-close type=\"button\">Sluit</button></div></div>`;\n      }\n      const users = state.admin.players.length\n        ? `<div class=\"admin-users\">${state.admin.players.map((name) => `<div class=\"admin-user\"><strong>${htmlEscape(name)}</strong><button data-admin-delete-player=\"${htmlEscape(name)}\" type=\"button\">Wis user</button></div>`).join(\"\")}</div>`\n        : `<p class=\"notice\">Geen gebruikers gevonden.</p>`;\n      return `<div class=\"admin-panel\"><h2>Admin</h2>${state.admin.error ? `<p class=\"error\">${htmlEscape(state.admin.error)}</p>` : \"\"}<label class=\"checkbox\"><input data-admin-dd type=\"checkbox\" ${state.admin.settings.ddEnabled ? \"checked\" : \"\"}> DDS analyse aan voor nieuwe boards</label><p class=\"notice\">Defaults voor nieuwe boards. Gebruikers kunnen ze daarna zelf wijzigen.</p>${settingsHtml(state.admin.settings.defaultGeneratorSettings, \"admin\")}<div class=\"setup-actions\"><button data-admin-save type=\"button\">Bewaar defaults</button><button data-admin-close type=\"button\">Sluit</button></div><h2>Gebruikers</h2>${users}</div>`;\n    }\n    async function adminPost(path, extra = {}) {\n      const response = await fetch(path, {\n        method: \"POST\",\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify({ adminCode: state.admin.code, ...extra })\n      });\n      const data = await response.json();\n      if (!response.ok) throw new Error(data.error || \"Admin actie mislukt.\");\n      state.admin.settings = data.settings || state.admin.settings;\n      state.admin.players = data.players || state.admin.players;\n      state.admin.loggedIn = true;\n      state.admin.error = \"\";\n      localStorage.setItem(\"biedapp-admin-code\", state.admin.code);\n      render();\n      return data;\n    }\n    function updateAdminSettingFromElement(el) {\n      if (!state.admin.settings) return;\n      const settings = state.admin.settings.defaultGeneratorSettings;\n      if (el.dataset.adminSetting === \"dealerMode\") settings.dealerMode = el.value;\n      if (el.dataset.adminSetting === \"vulnerabilityMode\") settings.vulnerabilityMode = el.value;\n      if (el.dataset.adminSetting === \"opponentMode\") settings.opponentMode = el.value;\n      if (el.dataset.adminHcp) settings.filters[el.dataset.adminHcp].minHcp = Number(el.value || 0);\n      if (el.dataset.adminSuit) {\n        const [target, suit] = el.dataset.adminSuit.split(\":\");\n        settings.filters[target].minSuitLengths[suit] = Number(el.value || 0);\n      }\n      if (el.dataset.adminDd !== undefined) state.admin.settings.ddEnabled = el.checked;\n    }\n    function setupHtml(data) {\n      const playerValue = htmlEscape(state.player || \"\");\n      const partnerValue = htmlEscape(state.partner || \"\");\n      const pairValue = htmlEscape(activePair());\n      const playerOptions = (data.players || []).map((name) => `<option value=\"${htmlEscape(name)}\"></option>`).join(\"\");\n      const mySessions = (data.mySessions || []).filter((item) => item && item.sessionId);\n      const filteredSessions = filterSessions(mySessions);\n      const sessionRows = mySessions.length\n        ? `${sessionToolbarHtml(mySessions)}${filteredSessions.length ? `<div class=\"session-list\">${filteredSessions.map(sessionRowHtml).join(\"\")}</div>` : `<p class=\"notice\">Geen boards in deze filter.</p>`}`\n        : `<p class=\"notice\">Nog geen boards voor ${playerValue || \"deze speler\"}.</p>`;\n      if (!state.player) {\n        return `<section class=\"hero\"><div class=\"hero-inner\"><div class=\"top-actions\"><div><p class=\"eyebrow\">Bridge bied app</p><h1>Wie speelt?</h1></div>${infoButtonHtml()}</div><div class=\"setup-card\"><p>Geef je naam in. Daarna zie je automatisch je biedsessies en uitnodigingen.</p><div class=\"setup-fields\"><label>Jouw naam<input data-player-input list=\"player-options\" value=\"${playerValue}\" placeholder=\"bv. Koen\" autocomplete=\"name\"></label></div><div class=\"setup-actions\"><button data-save-player type=\"button\">Verder</button></div><datalist id=\"player-options\">${playerOptions}</datalist></div></div></section>`;\n      }\n      return `<section class=\"hero\"><div class=\"hero-inner\"><div class=\"top-actions\"><div><p class=\"eyebrow\">Bridge bied app</p><h1>${playerValue}</h1></div>${infoButtonHtml()}</div><div class=\"setup-card\"><div class=\"link-box\"><strong>Nieuw board</strong>${notificationButtonHtml()}</div><p>Kies of zoek je partner. Laat partner leeg om alleen op één GSM te testen; in het board kun je dan wisselen tussen Noord en Zuid.</p><div class=\"setup-fields\"><label>Partner<input data-partner-input list=\"player-options\" value=\"${partnerValue}\" placeholder=\"zoek of typ naam\"></label><label>Paar<input data-pair-input value=\"${pairValue}\" placeholder=\"Paar 1\"></label></div><div class=\"setup-actions\"><button data-new-session-seat=\"N\" type=\"button\">Start als Noord</button><button data-new-session-seat=\"S\" type=\"button\">Start als Zuid</button></div>${sessionRows}${adminPanelHtml()}<datalist id=\"player-options\">${playerOptions}</datalist></div></div></section>`;\n    }\n    function readSetupFields() {\n      const sessionInput = document.querySelector(\"[data-session-input]\");\n      if (sessionInput) switchSession(sessionInput.value);\n      const playerInput = document.querySelector(\"[data-player-input]\");\n      const partnerInput = document.querySelector(\"[data-partner-input]\");\n      const pairInput = document.querySelector(\"[data-pair-input]\");\n      state.player = normalizeOptionalName(playerInput ? playerInput.value : state.player);\n      state.partner = normalizeOptionalName(partnerInput ? partnerInput.value : state.partner);\n      const generatedPair = pairForPlayers(state.player, state.partner);\n      const manualPair = normalizeOptionalName(pairInput ? pairInput.value : state.pair);\n      state.pair = normalizePairName(generatedPair || manualPair || \"Paar 1\");\n      localStorage.setItem(\"biedapp-player\", state.player);\n      localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n      localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n    }\n    function saveDeviceChoice() {\n      localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n      localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n      localStorage.setItem(storageKey(\"seat\", state.session), state.seat);\n      localStorage.setItem(\"biedapp-last-session\", state.session);\n      localStorage.setItem(\"biedapp-player\", state.player);\n    }\n    async function registerPlayers() {\n      await fetch(\"/api/players\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: apiBody() }).catch(() => undefined);\n    }\n    async function deleteStoredSession(button) {\n      const board = button.dataset.deleteBoard || \"?\";\n      const partner = button.dataset.deletePartner || button.dataset.deletePair || \"dit partnership\";\n      if (!confirm(`Board ${board} met ${partner} verwijderen?`)) return;\n      state.busy = true;\n      try {\n        const response = await fetch(\"/api/delete-session\", {\n          method: \"POST\",\n          headers: { \"Content-Type\": \"application/json\" },\n          body: JSON.stringify({\n            session: button.dataset.deleteSession,\n            pair: button.dataset.deletePair,\n            player: state.player,\n            partner: button.dataset.deletePartner || state.partner,\n            seat: state.seat || \"N\",\n          }),\n        });\n        const data = await response.json();\n        if (!response.ok) state.error = data.error || \"Board kon niet verwijderd worden.\";\n        else {\n          state.error = \"\";\n          state.data = { ...(state.data || {}), players: data.players || [], mySessions: data.sessions || [] };\n        }\n      } catch {\n        state.error = \"Geen verbinding met de biedserver.\";\n      }\n      state.busy = false;\n      render();\n    }\n    async function startNewSession(seat) {\n      readSetupFields();\n      state.seat = seat;\n      state.busy = true;\n      try {\n        const response = await fetch(\"/api/new-session\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: apiBody({ settings: state.draftSettings || state.data?.settings }) });\n        const data = await response.json();\n        if (response.ok && data.sessionId) {\n          state.session = data.sessionId;\n          state.data = data;\n          writeSessionToUrl(state.session);\n          saveDeviceChoice();\n          state.error = \"\";\n        } else {\n          state.error = data.error || \"Nieuwe sessie kon niet gestart worden.\";\n        }\n      } catch {\n        state.error = \"Nieuwe sessie kon niet gestart worden.\";\n      }\n      state.busy = false;\n      render();\n    }\n    function shortVulnerability(value) {\n      if (value === \"Niemand\") return \"-\";\n      if (value === \"Allen\") return \"Allen\";\n      return value;\n    }\n    function isSoloBoard(data) {\n      const members = data.members || {};\n      const names = [members.N, members.S].map(normalizeOptionalName).filter(Boolean);\n      return new Set(names).size <= 1;\n    }\n    function render() {\n      const data = state.data;\n      if (!data) {\r\n        document.getElementById(\"app\").innerHTML = `<section class=\"hero\"><div class=\"hero-inner\"><p class=\"eyebrow\">Bridge bied app</p><h1>Verbinden...</h1></div></section>`;\r\n        return;\r\n      }\r\n      if (!state.player || !state.seat || !state.pair) {\n        document.getElementById(\"app\").innerHTML = setupHtml(data);\n        return;\n      }\n      const auctionTable = auctionTableHtml(data.auction, data.dealer);\n      const myTurn = data.activeSeat === state.seat && !data.complete;\n      const results = data.results || [];\n      const pairCountChip = results.length > 1 ? `<span>${results.length} paren</span>` : \"\";\n      const switchSeatButton = isSoloBoard(data) ? `<button data-switch-seat type=\"button\">Wissel N/Z</button>` : \"\";\n      document.getElementById(\"app\").innerHTML = `\n        <section class=\"hero\">\r\n          <div class=\"hero-inner\">\r\n            <div class=\"top-actions\">\n              <div><p class=\"eyebrow\">Bridge bied app</p><h1>${htmlEscape(state.player || \"Noord/Zuid\")}</h1></div>\n              <div class=\"device-pill\"><span>${htmlEscape(data.pair)} &middot; ${seatNames[state.seat]}</span>${state.canInstall ? `<button data-install-app type=\"button\">App</button>` : \"\"}${switchSeatButton}<button data-reset-seat type=\"button\">Overzicht</button></div>\n            </div>\n            <div class=\"compact-status\">\n              <span>${data.board}:${data.dealer}/${shortVulnerability(data.vulnerability)}</span>\n              <span>Beurt ${data.complete ? \"klaar\" : data.activeSeat}</span>\n              <span>Paar ${htmlEscape(data.pair)}</span>\n              ${pairCountChip}\n            </div>\n          </div>\n        </section>\n        <section class=\"content\">\r\n          <div class=\"panel\">\r\n            ${state.error ? `<p class=\"error\">${htmlEscape(state.error)}</p>` : \"\"}\n            <div class=\"panel-head\"><div><p class=\"kicker\">${data.complete ? \"Open handen\" : \"Jouw hand\"}</p><h2>${data.complete ? \"Alle vier handen\" : seatNames[state.seat]}</h2></div><div class=\"turn-pill ${data.complete ? \"done\" : \"\"}\">${data.complete ? \"Klaar\" : myTurn ? \"Jij biedt\" : `Wacht op ${seatNames[data.activeSeat]}`}</div></div>\n            ${data.complete ? allHandsGridHtml(data) : handHtml(data.myHand)}\n          </div>\n          <div class=\"panel\">\n            <div class=\"panel-head\"><div><p class=\"kicker\">Biedverloop</p><h2>Vanaf ${seatNames[data.dealer]}</h2></div></div>\n            ${auctionTable}\n          </div>\n          <div class=\"panel\">\n            <div class=\"panel-head\"><div><p class=\"kicker\">Bieden</p><h2>${myTurn ? \"Kies je bod\" : data.complete ? \"Bieding klaar\" : \"Nog niet aan de beurt\"}</h2></div></div>\n            ${scoreHtml(data.score)}\n            <div class=\"bid-tools\"><button class=\"secondary\" data-undo type=\"button\" ${data.canUndo ? \"\" : \"disabled\"}>Undo</button></div>\n            ${data.complete ? \"\" : `<div class=\"bid-pad\"><button class=\"pass\" data-call=\"P\" ${myTurn ? \"\" : \"disabled\"} type=\"button\">Pas</button>${data.legalBids.map((bid) => `<button class=\"${bid.endsWith(\"H\") || bid.endsWith(\"D\") ? \"red-bid\" : \"\"}\" data-call=\"${bid}\" ${myTurn ? \"\" : \"disabled\"} type=\"button\">${displayCall(bid)}</button>`).join(\"\")}</div><p class=\"notice\">Er is geen biedadvies zichtbaar. Noord en Zuid beslissen zelf.</p>`}\n          </div>\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Vergelijken</p><h2>Resultaten paren</h2></div></div>\n            ${resultsHtml(results, data.dealer)}\n          </div>\r\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Nieuwe bieding</p><h2>Instellingen</h2></div><button class=\"primary\" data-new-deal type=\"button\">Nieuwe random hand</button></div>\r\n            <p class=\"notice\">${data.matchedFilters ? `Laatste deal gevonden in ${data.attempts} poging${data.attempts === 1 ? \"\" : \"en\"}.` : `Geen match binnen ${data.attempts} pogingen; filter is te streng.`}</p>\r\n            ${settingsHtml(settingsDraft(data))}\r\n          </div>\r\n          <div class=\"panel\">\r\n            <div class=\"panel-head\"><div><p class=\"kicker\">Chat</p><h2>Overleg</h2></div></div>\r\n            ${chatHtml(data.chat)}\r\n          </div>\r\n        </section>`;\r\n    }\r\n    document.addEventListener(\"click\", async (event) => {\n      if (event.target.matches(\"[data-help-overlay]\")) {\n        event.target.remove();\n        return;\n      }\n      const button = event.target.closest(\"button\");\n      if (!button) return;\n      if (button.dataset.infoHelp !== undefined) {\n        showHelp();\n        return;\n      }\n      if (button.dataset.closeHelp !== undefined) {\n        button.closest(\"[data-help-overlay]\")?.remove();\n        return;\n      }\n      if (button.dataset.savePlayer !== undefined) {\n        readSetupFields();\n        state.seat = \"\";\n        state.pair = \"\";\n        await registerPlayers();\n        refresh();\n        return;\n      }\n      if (button.dataset.adminOpen !== undefined) {\n        state.showAdmin = true;\n        render();\n        return;\n      }\n      if (button.dataset.enableNotifications !== undefined) {\n        await enableNotifications();\n        return;\n      }\n      if (button.dataset.sessionFilter) {\n        state.sessionFilter = button.dataset.sessionFilter;\n        localStorage.setItem(\"biedapp-session-filter\", state.sessionFilter);\n        render();\n        return;\n      }\n      if (button.dataset.comparePair) {\n        state.comparePair = state.comparePair === button.dataset.comparePair ? \"\" : button.dataset.comparePair;\n        render();\n        return;\n      }\n      if (button.dataset.adminClose !== undefined) {\n        state.showAdmin = false;\n        state.admin.error = \"\";\n        render();\n        return;\n      }\n      if (button.dataset.adminLogin !== undefined) {\n        const input = document.querySelector(\"[data-admin-code]\");\n        state.admin.code = input ? input.value : state.admin.code;\n        try {\n          await adminPost(\"/api/admin\");\n        } catch (error) {\n          state.admin.error = error instanceof Error ? error.message : String(error);\n          render();\n        }\n        return;\n      }\n      if (button.dataset.adminSave !== undefined) {\n        try {\n          await adminPost(\"/api/admin-settings\", {\n            defaultGeneratorSettings: state.admin.settings.defaultGeneratorSettings,\n            ddEnabled: state.admin.settings.ddEnabled,\n          });\n        } catch (error) {\n          state.admin.error = error instanceof Error ? error.message : String(error);\n          render();\n        }\n        return;\n      }\n      if (button.dataset.adminDeletePlayer) {\n        const name = button.dataset.adminDeletePlayer;\n        if (!confirm(`User ${name} verwijderen?`)) return;\n        try {\n          await adminPost(\"/api/admin-delete-player\", { playerName: name });\n          if (name === state.player) {\n            state.player = \"\";\n            state.pair = \"\";\n            state.seat = \"\";\n            localStorage.removeItem(\"biedapp-player\");\n            render();\n          }\n        } catch (error) {\n          state.admin.error = error instanceof Error ? error.message : String(error);\n          render();\n        }\n        return;\n      }\n      if (button.dataset.resetPlayer !== undefined) {\n        state.player = \"\";\n        state.partner = \"\";\n        state.pair = \"\";\n        state.seat = \"\";\n        localStorage.removeItem(\"biedapp-player\");\n        render();\n        return;\n      }\n      if (button.dataset.openSession) {\n        state.session = button.dataset.openSession;\n        state.seat = localStorage.getItem(storageKey(\"seat\", state.session)) || button.dataset.openSeat || \"N\";\n        state.pair = normalizePairName(button.dataset.openPair);\n        state.partner = normalizeOptionalName(button.dataset.openPartner);\n        writeSessionToUrl(state.session);\n        saveDeviceChoice();\n        refresh();\n        return;\n      }\n      if (button.dataset.deleteSession) {\n        await deleteStoredSession(button);\n        return;\n      }\n      if (button.dataset.newSessionSeat) {\n        await startNewSession(button.dataset.newSessionSeat);\n        return;\n      }\n      if (button.dataset.setupSeat) {\n        readSetupFields();\n        state.seat = button.dataset.setupSeat;\n        saveDeviceChoice();\n        await registerPlayers();\n        refresh();\n      }\n      if (button.dataset.resetSeat !== undefined) {\n        localStorage.removeItem(storageKey(\"pair\", state.session));\n        localStorage.removeItem(storageKey(\"seat\", state.session));\n        state.pair = \"\";\n        state.seat = \"\";\n        render();\n      }\n      if (button.dataset.switchSeat !== undefined) {\n        state.seat = otherSeat(state.seat);\n        saveDeviceChoice();\n        await refresh();\n        return;\n      }\n      if (button.dataset.shareLink !== undefined) {\n        await shareSession();\n      }\n      if (button.dataset.installApp !== undefined) {\n        await installApp();\n      }\n      if (button.dataset.call) {\n        state.busy = true;\n        await api(\"/api/call\", { method: \"POST\", body: apiBody({ call: button.dataset.call }) });\n        state.busy = false;\n      }\n      if (button.dataset.undo !== undefined) {\n        state.busy = true;\n        await api(\"/api/undo\", { method: \"POST\", body: apiBody() });\n        state.busy = false;\n      }\n      if (button.dataset.newDeal !== undefined) {\n        state.busy = true;\r\n        await api(\"/api/new-deal\", { method: \"POST\", body: apiBody({ settings: state.draftSettings || state.data.settings }) });\r\n        if (state.draftBoard) localStorage.removeItem(savedDraftKey(state.draftBoard));\r\n        state.draftSettings = null;\r\n        state.draftBoard = null;\r\n        state.busy = false;\r\n      }\r\n    });\r\n    function updateSettingFromElement(el) {\r\n      if (!state.data) return;\r\n      const settings = settingsDraft(state.data);\n      if (el.dataset.setting === \"dealerMode\") settings.dealerMode = el.value;\n      if (el.dataset.setting === \"vulnerabilityMode\") settings.vulnerabilityMode = el.value;\n      if (el.dataset.setting === \"opponentMode\") settings.opponentMode = el.value;\n      if (el.dataset.hcp) settings.filters[el.dataset.hcp].minHcp = Number(el.value || 0);\r\n      if (el.dataset.suit) {\r\n        const [target, suit] = el.dataset.suit.split(\":\");\r\n        settings.filters[target].minSuitLengths[suit] = Number(el.value || 0);\r\n      }\r\n      saveDraftSettings();\r\n    }\r\n    document.addEventListener(\"change\", (event) => {\n      const el = event.target;\n      if (el.dataset.sessionInput !== undefined) {\n        if (switchSession(el.value)) refresh();\n        return;\n      }\n      if (el.dataset.setting || el.dataset.hcp || el.dataset.suit) updateSettingFromElement(el);\n      if (el.dataset.adminSetting || el.dataset.adminHcp || el.dataset.adminSuit || el.dataset.adminDd !== undefined) updateAdminSettingFromElement(el);\n    });\n    document.addEventListener(\"input\", (event) => {\n      const el = event.target;\n      if (el.dataset.adminCode !== undefined) {\n        state.admin.code = el.value;\n        return;\n      }\n      if (el.dataset.playerInput !== undefined) {\n        state.player = normalizeOptionalName(el.value);\n        localStorage.setItem(\"biedapp-player\", state.player);\n        return;\n      }\n      if (el.dataset.partnerInput !== undefined) {\n        state.partner = normalizeOptionalName(el.value);\n        localStorage.setItem(storageKey(\"partner\", state.session), state.partner);\n        return;\n      }\n      if (el.dataset.pairInput !== undefined) {\n        state.pair = normalizePairName(el.value);\n        localStorage.setItem(storageKey(\"pair\", state.session), state.pair);\n        return;\n      }\n      if (el.dataset.hcp || el.dataset.suit) updateSettingFromElement(el);\n      if (el.dataset.adminHcp || el.dataset.adminSuit) updateAdminSettingFromElement(el);\n    });\n    document.addEventListener(\"focusout\", () => {\n      setTimeout(() => {\n        if (state.pendingRender && !shouldHoldRender()) {\n          state.pendingRender = false;\n          render();\n        }\n      }, 60);\n    });\n    document.addEventListener(\"submit\", async (event) => {\r\n      const form = event.target.closest(\"[data-chat-form]\");\r\n      if (!form) return;\r\n      event.preventDefault();\r\n      const input = form.elements.text;\r\n      const text = input.value.trim();\r\n      input.value = \"\";\r\n      if (text) await api(\"/api/chat\", { method: \"POST\", body: apiBody({ text }) });\r\n    });\r\n    refresh();\n    window.addEventListener(\"beforeinstallprompt\", (event) => {\n      event.preventDefault();\n      deferredInstallPrompt = event;\n      state.canInstall = true;\n      renderWhenFree();\n    });\n    window.addEventListener(\"appinstalled\", () => {\n      deferredInstallPrompt = null;\n      state.canInstall = false;\n      renderWhenFree();\n    });\n    setInterval(refresh, 4000);\n    if (\"serviceWorker\" in navigator && location.protocol !== \"file:\") {\n      navigator.serviceWorker.register(\"./sw.js\").then(() => updateNotificationState()).catch(() => undefined);\n    }\n    updateNotificationSupport();\n  </script>\n</body>\r\n</html>\r\n", type: "text/html; charset=utf-8" },
  "/manifest.webmanifest": { body: "{\n  \"name\": \"Bridge Bied App\",\n  \"short_name\": \"Bridge Bieden\",\n  \"id\": \"/index.html\",\n  \"description\": \"Noord/Zuid bridge biedtrainer met random handen, filters, par-info en chat.\",\n  \"lang\": \"nl\",\n  \"start_url\": \"/index.html\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"orientation\": \"portrait-primary\",\n  \"background_color\": \"#f4f7f2\",\n  \"theme_color\": \"#0e5b42\",\n  \"icons\": [\n    {\n      \"src\": \"/icon-192.png\",\n      \"sizes\": \"192x192\",\n      \"type\": \"image/png\",\n      \"purpose\": \"any maskable\"\n    },\n    {\n      \"src\": \"/icon-512.png\",\n      \"sizes\": \"512x512\",\n      \"type\": \"image/png\",\n      \"purpose\": \"any maskable\"\n    }\n  ]\n}\n", type: "application/manifest+json; charset=utf-8" },
  "/sw.js": { body: "const CACHE_NAME = \"bridge-bied-app-v34\";\nconst APP_SHELL = [\"/index.html\", \"/manifest.webmanifest\", \"/icon-192.png\", \"/icon-512.png\", \"/apple-touch-icon.png\"];\n\nself.addEventListener(\"install\", (event) => {\n  event.waitUntil(\n    caches\n      .open(CACHE_NAME)\n      .then((cache) => cache.addAll(APP_SHELL))\n      .catch(() => undefined),\n  );\n  self.skipWaiting();\n});\n\nself.addEventListener(\"activate\", (event) => {\n  event.waitUntil(\n    caches\n      .keys()\n      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),\n  );\n  self.clients.claim();\n});\n\nself.addEventListener(\"fetch\", (event) => {\n  if (event.request.method !== \"GET\") {\n    return;\n  }\n\n  const url = new URL(event.request.url);\n\n  if (url.origin !== self.location.origin) {\n    return;\n  }\n\n  if (url.pathname.startsWith(\"/api/\")) {\n    event.respondWith(fetch(event.request));\n    return;\n  }\n\n  event.respondWith(\n    fetch(event.request)\n      .then((response) => {\n        const copy = response.clone();\n        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => undefined);\n        return response;\n      })\n      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(\"/index.html\"))),\n  );\n});\n\nself.addEventListener(\"push\", (event) => {\n  let data = {};\n  try {\n    data = event.data ? event.data.json() : {};\n  } catch {\n    data = { body: event.data ? event.data.text() : \"\" };\n  }\n  event.waitUntil(\n    self.registration.showNotification(data.title || \"Bridge Bieden\", {\n      body: data.body || \"Je bent aan de beurt.\",\n      tag: data.tag || \"bridge-bied-app\",\n      icon: \"/icon-192.png\",\n      badge: \"/icon-192.png\",\n      data: { url: data.url || \"/index.html\" },\n    }),\n  );\n});\n\nself.addEventListener(\"notificationclick\", (event) => {\n  event.notification.close();\n  const url = new URL(event.notification.data?.url || \"/index.html\", self.location.origin).toString();\n  event.waitUntil(\n    clients.matchAll({ type: \"window\", includeUncontrolled: true }).then((clientList) => {\n      for (const client of clientList) {\n        if (\"focus\" in client) {\n          client.navigate(url);\n          return client.focus();\n        }\n      }\n      return clients.openWindow(url);\n    }),\n  );\n});\n", type: "text/javascript; charset=utf-8" },
  "/favicon.svg": { body: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n<path d=\"M22 19.2727C22 20.779 20.779 22 19.2727 22H14.7273C13.221 22 12 20.779 12 19.2727V12H19.2727C20.779 12 22 13.221 22 14.7273V19.2727Z\" fill=\"#68C4FF\"/>\r\n<path d=\"M20 2C21.1046 2 22 2.89543 22 4V7C22 8.10457 21.1046 9 20 9H17C15.8954 9 15 8.10457 15 7V4C15 2.89543 15.8954 2 17 2H20Z\" fill=\"#0C79D8\"/>\r\n<path d=\"M7 15C8.10457 15 9 15.8954 9 17V20C9 21.1046 8.10457 22 7 22H4C2.89543 22 2 21.1046 2 20V17C2 15.8954 2.89543 15 4 15H7Z\" fill=\"#0C79D8\"/>\r\n<path d=\"M12 12H4.72727C3.22104 12 2 10.779 2 9.27273V4.72727C2 3.22104 3.22104 2 4.72727 2H9.27273C10.779 2 12 3.22104 12 4.72727V12Z\" fill=\"#2E9EFF\"/>\r\n</svg>\r\n", type: "image/svg+xml; charset=utf-8" },
  "/icon-192.png": { base64: "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", type: "image/png" },
  "/icon-512.png": { base64: "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", type: "image/png" },
  "/apple-touch-icon.png": { base64: "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAZfSURBVHhe7dy9bxRHGMdxuhRB+QviIolcpo8EldtIEeKlSoFESUMJEqSjJnVcuKCjT2MkI4ToKNJZWC4o6CiQYiNRTjQXv+zN7O5vdu3bm+fZb/FpuLs5i/t69MzuwZXvft8KgBdX0j8ALCNouELQcIWg4QpBwxWChisEDVcIGq4QNFwhaLhC0HCFoOEKQcMVgoYrBA1XCBquEDRcubSgr966Hr799RdglNhP2tQYlxZ0/KG+ufYzMErsJ21qDIJGFQgarhA0XCFouELQcIWg4QpBwxWChisEDVcIGq4QNFwhaLjiNuit+3fDH3/9CSPi55V+hmO4DTr+JX35egQj4ueVfoZjEDSqQNACQdtC0AJB20LQAkHbQtACQdtC0AJB20LQAkHbQtACQdtC0EKdQb8JR7u/hX9X4e2LcJy9nx0ELcwu6Iajj+n71o+ghTkHvWBsxyZoYfZBR4aiJmiBoE/886bl56gPQQsEfc7CTE3QAkE3GBg9CFowGfSI8I4PHuTrZB6E48/5a2tC0MJcgi5a18DYQdDCvILWOzVBD0PQRVYX9JfPL3rXPjo4zF9TEYIWZhe0WJsdehiCLtIf3YWC7t2hORQORdBFVhd07wx9gXWnQtDCrILu3Z3rn58jghbmEfRhOH7bss6SZwPXXA+CFkwGfenqn51PEbRA0HZijghamHXQg0eX9SNoYdZBGzkINhG0MPegT9V+Q+UUQQsE3WDgS/4ELRD0stpHEIIWTAY96jAn1jxT91UPghbmE/QJcbdwoeLRg6CF2QUdfXyWr7mk3ruGBC3MMmh5K7zesYOgBYJuV+tlPIIWCLodQZch6CIrDloeDBk5ShF0kVUGrXdnDoXlCLrIaoLu/dcqTVy2K0bQRUTQK1br/BwRtEDQiZG7/1QIWiDopnoPg6cIWiDoc7V/MSkiaIGg/1fz3NxE0MLsg658Zk4RtDDPoOu9zqwQtFBn0OhC0AJB20LQAkHbQtACQdtC0AJB20LQAkHbQtACQdtC0AJB20LQAkHbQtACQdtC0AJB20LQAkHbQtACQdtC0AJB20LQQs1Bv3zyY/h+84fMjZ397Lm99h6dvXbjznZ4nz5+4v3OzfPnPdnNHq8BQQtVBt0IsMvG5s2wfdjy2jYEnSHoyeyGh5vtO3NqY/NReJm9vgVBZwh6IktRtezCzcejh3v5GhmCzhD0REqias7WXc9ZQtAZgp5IugMPPgC2IegMQU/lcDvc6Jih+2LsRdAZgp5SyVWOIcEVrJcatP6ECFqoMugFfbVjzFWOUgRdhqBH6Y67KDyCzhB0NfbD9p3GVY6WS3sZZugMQU+hcSDsD/V8x+5/3gmCzhD0JJZ33+5LdgR9UQQ9EX0denmeLjoYEnSGoCfTfQBskwffgqAzBD2lnpsrTcXREXSGoNcgHT/OYisZM5oIOkPQqAJBCwRtC0ELBG0LQQsEbQtBCwRtC0ELVQW99zT8/dO1Mo9f5a/vs7T20/AhffzEh8cXfJ8VI2jBbNAizExB0J927i2vf/t5+NTyvHUiaMF20AN2UBG0hZgjghaqDbozqFfh3VLUeZyt+oJOf5E633v9CFqwF3Qa4L2wr75tl72mEbShmCOCFmYd9OHz8LoZc7pzV4igBXtBJyNH5/N61o7hGow5Imih2qALvSv5n5NK1y49YK4RQQuWg369c5Cv0aVw7eJfkDUhaMFe0CNHg9a14/w9coRZE4IWqg26GVY27xYeBLvWTtdIHhu080+MoAUTQUdZ1AN36t4rIwdh/3ZH7JUhaMFM0G1384Yc4tKrHOnj6S/MkLUnRNCCpaDznXTAIU4F3fLFpOK1J0TQgq2gW3bSjjgzBUGPXntCBC2YC7pl9Cg6xJUE3bJ2baMHQQsWg85Hj4JDXGHQ2Z3IkrUnRNBCVUFDImiBoG0haIGgbSFogaBtIWiBoG0haIGgbSFogaBtIWiBoG0haIGgbSFogaBtIWiBoG0haIGgbSFogaBtIWhh6/7dxV8SbIifV/oZjuE2aMwTQcMVgoYrBA1XCBquEDRcIWi4QtBwhaDhCkHDFYKGKwQNVwgarhA0XKku6Ku3ri9+KGCM2E/a1BiXFjRQA4KGKwQNVwgarhA0XCFouELQcIWg4QpBwxWChisEDVcIGq4QNFwhaLhC0HCFoOEKQcOV/wDPcyLznH9feQAAAABJRU5ErkJggg==", type: "image/png" },
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
