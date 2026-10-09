import{_ as jf}from"./pdfjs-DTak83_l.js";var tT=Object.create,uw=Object.defineProperty,rT=Object.getOwnPropertyDescriptor,lw=Object.getOwnPropertyNames,aT=Object.getPrototypeOf,iT=Object.prototype.hasOwnProperty,Eh=(e,t)=>function(){return t||(0,e[lw(e)[0]])((t={exports:{}}).exports,t),t.exports},nT=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of lw(t))!iT.call(e,i)&&i!==r&&uw(e,i,{get:()=>t[i],enumerable:!(a=rT(t,i))||a.enumerable});return e},Eu=(e,t,r)=>(r=e!=null?tT(aT(e)):{},nT(!e||!e.__esModule?uw(r,"default",{value:e,enumerable:!0}):r,e)),sT=Eh({"../../node_modules/.pnpm/iota-array@1.0.0/node_modules/iota-array/iota.js"(e,t){function r(a){for(var i=new Array(a),s=0;s<a;++s)i[s]=s;return i}t.exports=r}}),oT=Eh({"../../node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js"(e,t){t.exports=function(i){return i!=null&&(r(i)||a(i)||!!i._isBuffer)};function r(i){return!!i.constructor&&typeof i.constructor.isBuffer=="function"&&i.constructor.isBuffer(i)}function a(i){return typeof i.readFloatLE=="function"&&typeof i.slice=="function"&&r(i.slice(0,0))}}}),zu=Eh({"../../node_modules/.pnpm/ndarray@1.0.19/node_modules/ndarray/ndarray.js"(e,t){var r=sT(),a=oT(),i=typeof Float64Array<"u";function s(m,g){return m[0]-g[0]}function o(){var m=this.stride,g=new Array(m.length),_;for(_=0;_<g.length;++_)g[_]=[Math.abs(m[_]),_];g.sort(s);var v=new Array(g.length);for(_=0;_<v.length;++_)v[_]=g[_][1];return v}function u(m,g){var _=["View",g,"d",m].join("");g<0&&(_="View_Nil"+m);var v=m==="generic";if(g===-1){var w="function "+_+"(a){this.data=a;};var proto="+_+".prototype;proto.dtype='"+m+"';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new "+_+"(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_"+_+"(a){return new "+_+"(a);}",j=new Function(w);return j()}else if(g===0){var w="function "+_+"(a,d) {this.data = a;this.offset = d};var proto="+_+".prototype;proto.dtype='"+m+"';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function "+_+"_copy() {return new "+_+"(this.data,this.offset)};proto.pick=function "+_+"_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function "+_+"_get(){return "+(v?"this.data.get(this.offset)":"this.data[this.offset]")+"};proto.set=function "+_+"_set(v){return "+(v?"this.data.set(this.offset,v)":"this.data[this.offset]=v")+"};return function construct_"+_+"(a,b,c,d){return new "+_+"(a,d)}",j=new Function("TrivialArray",w);return j(p[m][0])}var w=["'use strict'"],k=r(g),b=k.map(function(W){return"i"+W}),$="this.offset+"+k.map(function(W){return"this.stride["+W+"]*i"+W}).join("+"),S=k.map(function(W){return"b"+W}).join(","),T=k.map(function(W){return"c"+W}).join(",");w.push("function "+_+"(a,"+S+","+T+",d){this.data=a","this.shape=["+S+"]","this.stride=["+T+"]","this.offset=d|0}","var proto="+_+".prototype","proto.dtype='"+m+"'","proto.dimension="+g),w.push("Object.defineProperty(proto,'size',{get:function "+_+"_size(){return "+k.map(function(W){return"this.shape["+W+"]"}).join("*"),"}})"),g===1?w.push("proto.order=[0]"):(w.push("Object.defineProperty(proto,'order',{get:"),g<4?(w.push("function "+_+"_order(){"),g===2?w.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})"):g===3&&w.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})")):w.push("ORDER})")),w.push("proto.set=function "+_+"_set("+b.join(",")+",v){"),v?w.push("return this.data.set("+$+",v)}"):w.push("return this.data["+$+"]=v}"),w.push("proto.get=function "+_+"_get("+b.join(",")+"){"),v?w.push("return this.data.get("+$+")}"):w.push("return this.data["+$+"]}"),w.push("proto.index=function "+_+"_index(",b.join(),"){return "+$+"}"),w.push("proto.hi=function "+_+"_hi("+b.join(",")+"){return new "+_+"(this.data,"+k.map(function(W){return["(typeof i",W,"!=='number'||i",W,"<0)?this.shape[",W,"]:i",W,"|0"].join("")}).join(",")+","+k.map(function(W){return"this.stride["+W+"]"}).join(",")+",this.offset)}");var I=k.map(function(W){return"a"+W+"=this.shape["+W+"]"}),A=k.map(function(W){return"c"+W+"=this.stride["+W+"]"});w.push("proto.lo=function "+_+"_lo("+b.join(",")+"){var b=this.offset,d=0,"+I.join(",")+","+A.join(","));for(var E=0;E<g;++E)w.push("if(typeof i"+E+"==='number'&&i"+E+">=0){d=i"+E+"|0;b+=c"+E+"*d;a"+E+"-=d}");w.push("return new "+_+"(this.data,"+k.map(function(W){return"a"+W}).join(",")+","+k.map(function(W){return"c"+W}).join(",")+",b)}"),w.push("proto.step=function "+_+"_step("+b.join(",")+"){var "+k.map(function(W){return"a"+W+"=this.shape["+W+"]"}).join(",")+","+k.map(function(W){return"b"+W+"=this.stride["+W+"]"}).join(",")+",c=this.offset,d=0,ceil=Math.ceil");for(var E=0;E<g;++E)w.push("if(typeof i"+E+"==='number'){d=i"+E+"|0;if(d<0){c+=b"+E+"*(a"+E+"-1);a"+E+"=ceil(-a"+E+"/d)}else{a"+E+"=ceil(a"+E+"/d)}b"+E+"*=d}");w.push("return new "+_+"(this.data,"+k.map(function(W){return"a"+W}).join(",")+","+k.map(function(W){return"b"+W}).join(",")+",c)}");for(var B=new Array(g),U=new Array(g),E=0;E<g;++E)B[E]="a[i"+E+"]",U[E]="b[i"+E+"]";w.push("proto.transpose=function "+_+"_transpose("+b+"){"+b.map(function(W,J){return W+"=("+W+"===undefined?"+J+":"+W+"|0)"}).join(";"),"var a=this.shape,b=this.stride;return new "+_+"(this.data,"+B.join(",")+","+U.join(",")+",this.offset)}"),w.push("proto.pick=function "+_+"_pick("+b+"){var a=[],b=[],c=this.offset");for(var E=0;E<g;++E)w.push("if(typeof i"+E+"==='number'&&i"+E+">=0){c=(c+this.stride["+E+"]*i"+E+")|0}else{a.push(this.shape["+E+"]);b.push(this.stride["+E+"])}");w.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}"),w.push("return function construct_"+_+"(data,shape,stride,offset){return new "+_+"(data,"+k.map(function(W){return"shape["+W+"]"}).join(",")+","+k.map(function(W){return"stride["+W+"]"}).join(",")+",offset)}");var j=new Function("CTOR_LIST","ORDER",w.join(`
`));return j(p[m],o)}function d(m){if(a(m))return"buffer";if(i)switch(Object.prototype.toString.call(m)){case"[object Float64Array]":return"float64";case"[object Float32Array]":return"float32";case"[object Int8Array]":return"int8";case"[object Int16Array]":return"int16";case"[object Int32Array]":return"int32";case"[object Uint8Array]":return"uint8";case"[object Uint16Array]":return"uint16";case"[object Uint32Array]":return"uint32";case"[object Uint8ClampedArray]":return"uint8_clamped";case"[object BigInt64Array]":return"bigint64";case"[object BigUint64Array]":return"biguint64"}return Array.isArray(m)?"array":"generic"}var p={float32:[],float64:[],int8:[],int16:[],int32:[],uint8:[],uint16:[],uint32:[],array:[],uint8_clamped:[],bigint64:[],biguint64:[],buffer:[],generic:[]};function f(m,g,_,v){if(m===void 0){var T=p.array[0];return T([])}else typeof m=="number"&&(m=[m]);g===void 0&&(g=[m.length]);var w=g.length;if(_===void 0){_=new Array(w);for(var k=w-1,b=1;k>=0;--k)_[k]=b,b*=g[k]}if(v===void 0){v=0;for(var k=0;k<w;++k)_[k]<0&&(v-=(g[k]-1)*_[k])}for(var $=d(m),S=p[$];S.length<=w+1;)S.push(u($,S.length-1));var T=S[w+1];return T(m,g,_,v)}t.exports=f}}),uT=typeof global=="object"&&global&&global.Object===Object&&global,lT=uT,dT=typeof self=="object"&&self&&self.Object===Object&&self,pT=lT||dT||Function("return this")(),zh=pT,cT=zh.Symbol,su=cT,dw=Object.prototype,hT=dw.hasOwnProperty,fT=dw.toString,bs=su?su.toStringTag:void 0;function mT(e){var t=hT.call(e,bs),r=e[bs];try{e[bs]=void 0;var a=!0}catch{}var i=fT.call(e);return a&&(t?e[bs]=r:delete e[bs]),i}var gT=mT,yT=Object.prototype,_T=yT.toString;function vT(e){return _T.call(e)}var $T=vT,wT="[object Null]",bT="[object Undefined]",Lf=su?su.toStringTag:void 0;function xT(e){return e==null?e===void 0?bT:wT:Lf&&Lf in Object(e)?gT(e):$T(e)}var kT=xT;function ST(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var pw=ST,TT="[object AsyncFunction]",CT="[object Function]",IT="[object GeneratorFunction]",ET="[object Proxy]";function zT(e){if(!pw(e))return!1;var t=kT(e);return t==CT||t==IT||t==TT||t==ET}var AT=zT,OT=zh["__core-js_shared__"],Xd=OT,Gf=(function(){var e=/[^.]+$/.exec(Xd&&Xd.keys&&Xd.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""})();function RT(e){return!!Gf&&Gf in e}var BT=RT,NT=Function.prototype,MT=NT.toString;function DT(e){if(e!=null){try{return MT.call(e)}catch{}try{return e+""}catch{}}return""}var PT=DT,UT=/[\\^$.*+?()[\]{}|]/g,WT=/^\[object .+?Constructor\]$/,VT=Function.prototype,qT=Object.prototype,jT=VT.toString,LT=qT.hasOwnProperty,GT=RegExp("^"+jT.call(LT).replace(UT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function FT(e){if(!pw(e)||BT(e))return!1;var t=AT(e)?GT:WT;return t.test(PT(e))}var HT=FT;function KT(e,t){return e?.[t]}var ZT=KT;function QT(e,t){var r=ZT(e,t);return HT(r)?r:void 0}var cw=QT,XT=cw(Object,"create"),to=XT;function JT(){this.__data__=to?to(null):{},this.size=0}var YT=JT;function eC(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}var tC=eC,rC="__lodash_hash_undefined__",aC=Object.prototype,iC=aC.hasOwnProperty;function nC(e){var t=this.__data__;if(to){var r=t[e];return r===rC?void 0:r}return iC.call(t,e)?t[e]:void 0}var sC=nC,oC=Object.prototype,uC=oC.hasOwnProperty;function lC(e){var t=this.__data__;return to?t[e]!==void 0:uC.call(t,e)}var dC=lC,pC="__lodash_hash_undefined__";function cC(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=to&&t===void 0?pC:t,this}var hC=cC;function ci(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}ci.prototype.clear=YT;ci.prototype.delete=tC;ci.prototype.get=sC;ci.prototype.has=dC;ci.prototype.set=hC;var Ff=ci;function fC(){this.__data__=[],this.size=0}var mC=fC;function gC(e,t){return e===t||e!==e&&t!==t}var yC=gC;function _C(e,t){for(var r=e.length;r--;)if(yC(e[r][0],t))return r;return-1}var Au=_C,vC=Array.prototype,$C=vC.splice;function wC(e){var t=this.__data__,r=Au(t,e);if(r<0)return!1;var a=t.length-1;return r==a?t.pop():$C.call(t,r,1),--this.size,!0}var bC=wC;function xC(e){var t=this.__data__,r=Au(t,e);return r<0?void 0:t[r][1]}var kC=xC;function SC(e){return Au(this.__data__,e)>-1}var TC=SC;function CC(e,t){var r=this.__data__,a=Au(r,e);return a<0?(++this.size,r.push([e,t])):r[a][1]=t,this}var IC=CC;function hi(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}hi.prototype.clear=mC;hi.prototype.delete=bC;hi.prototype.get=kC;hi.prototype.has=TC;hi.prototype.set=IC;var EC=hi,zC=cw(zh,"Map"),AC=zC;function OC(){this.size=0,this.__data__={hash:new Ff,map:new(AC||EC),string:new Ff}}var RC=OC;function BC(e){var t=typeof e;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?e!=="__proto__":e===null}var NC=BC;function MC(e,t){var r=e.__data__;return NC(t)?r[typeof t=="string"?"string":"hash"]:r.map}var Ou=MC;function DC(e){var t=Ou(this,e).delete(e);return this.size-=t?1:0,t}var PC=DC;function UC(e){return Ou(this,e).get(e)}var WC=UC;function VC(e){return Ou(this,e).has(e)}var qC=VC;function jC(e,t){var r=Ou(this,e),a=r.size;return r.set(e,t),this.size+=r.size==a?0:1,this}var LC=jC;function fi(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}fi.prototype.clear=RC;fi.prototype.delete=PC;fi.prototype.get=WC;fi.prototype.has=qC;fi.prototype.set=LC;var hw=fi,GC="Expected a function";function Ah(e,t){if(typeof e!="function"||t!=null&&typeof t!="function")throw new TypeError(GC);var r=function(){var a=arguments,i=t?t.apply(this,a):a[0],s=r.cache;if(s.has(i))return s.get(i);var o=e.apply(this,a);return r.cache=s.set(i,o)||s,o};return r.cache=new(Ah.Cache||hw),r}Ah.Cache=hw;var FC=Ah,Oh=Eu(zu()),fw=class Lc{constructor(t,r){this.type="application/octet-stream",this.params={},this.type=t,this.params=r}toString(){const t=[];for(const r in this.params){const a=this.params[r];t.push(`${r}=${a}`)}return[this.type,...t].join(";")}static create(t,r){return new Lc(t,r)}isIdentical(t){return this.type===t.type&&this.params===t.params}isEqual(t){return this.type===t.type}static fromString(t){const[r,...a]=t.split(";"),i={};for(const s of a){const[o,u]=s.split("=");i[o.trim()]=u.trim()}return new Lc(r,i)}},Jd=Eu(zu());async function HC(e){const t=fw.fromString(e.type);switch(t.type){case"image/x-alpha8":{const r=parseInt(t.params.width),a=parseInt(t.params.height);return(0,Jd.default)(new Uint8Array(await e.arrayBuffer()),[a,r,1])}case"image/x-rgba8":{const r=parseInt(t.params.width),a=parseInt(t.params.height);return(0,Jd.default)(new Uint8Array(await e.arrayBuffer()),[a,r,4])}case"application/octet-stream":case"image/png":case"image/jpeg":case"image/jpg":case"image/webp":{const r=await createImageBitmap(e),a=QC(r);return(0,Jd.default)(new Uint8Array(a.data),[a.height,a.width,4])}default:throw new Error(`Invalid format: ${t.type} with params: ${t.params}`)}}async function Ru(e,t=.8,r="image/png"){const[a,i,s]=e.shape;switch(r){case"image/x-alpha8":case"image/x-rgba8":{const d=fw.create(r,{width:i.toString(),height:a.toString()});return new Blob([e.data],{type:d.toString()})}case"image/png":case"image/jpeg":case"image/webp":{const d=new ImageData(new Uint8ClampedArray(e.data),i,a);var o=mw(d.width,d.height),u=o.getContext("2d");return u.putImageData(d,0,0),o.convertToBlob({quality:t,type:r})}default:throw new Error(`Invalid format: ${r}`)}}function KC(e){return new RegExp("^(?:[a-z+]+:)?//","i").test(e)}function ZC(e,t){return KC(e)?e:new URL(e,t).href}function QC(e){var t=mw(e.width,e.height),r=t.getContext("2d");return r.drawImage(e,0,0),r.getImageData(0,0,t.width,t.height)}function XC(e){if(typeof Uint8Array<"u")return new Uint8Array(e);if(typeof Uint8ClampedArray<"u")return new Uint8ClampedArray(e);if(typeof Uint16Array<"u")return new Uint16Array(e);if(typeof Uint32Array<"u")return new Uint32Array(e);if(typeof Float32Array<"u")return new Float32Array(e);if(typeof Float64Array<"u")return new Float64Array(e);throw new Error("TypedArray not supported")}function Gc(e,t,r,a=!1){const[i,s,o]=e.shape;let u=s/t,d=i/r;a&&(u=d=Math.max(u,d)>1?Math.max(u,d):Math.min(u,d));const p=(0,Oh.default)(XC(o*t*r),[r,t,o]);for(let f=0;f<r;f++)for(let m=0;m<t;m++){const g=m*u,_=f*d,v=Math.max(Math.floor(g),0),w=Math.min(Math.ceil(g),s-1),k=Math.max(Math.floor(_),0),b=Math.min(Math.ceil(_),i-1),$=g-v,S=_-k;for(let T=0;T<o;T++){const I=e.get(k,v,T),A=e.get(k,w,T),E=e.get(b,v,T),B=e.get(b,w,T),U=(1-$)*(1-S)*I+$*(1-S)*A+(1-$)*S*E+$*S*B;p.set(f,m,T,U)}}return p}function JC(e,t=[128,128,128],r=[256,256,256]){var a=e.data;const[i,s,o]=e.shape,u=i*s,d=new Float32Array(3*u);for(let p=0,f=0;p<a.length;p+=4,f+=1)d[f]=(a[p]-t[0])/r[0],d[f+u]=(a[p+1]-t[1])/r[1],d[f+u+u]=(a[p+2]-t[2])/r[2];return(0,Oh.default)(d,[1,3,i,s])}async function ro(e,t){return typeof e=="string"&&(e=ZC(e,t.publicPath),e=new URL(e)),e instanceof URL&&(e=await(await fetch(e,{})).blob()),(e instanceof ArrayBuffer||ArrayBuffer.isView(e))&&(e=new Blob([e])),e instanceof Blob&&(e=await HC(e)),e}function YC(e){const t=new Uint8Array(e.data.length);for(let r=0;r<e.data.length;r++)t[r]=e.data[r]*255;return(0,Oh.default)(t,e.shape)}function mw(e,t){let r;if(typeof OffscreenCanvas<"u"?r=new OffscreenCanvas(e,t):r=document.createElement("canvas"),!r)throw new Error("Canvas nor OffscreenCanvas are available in the current context.");return r}var eI=Eu(zu()),gw=async()=>navigator.gpu===void 0?!1:await navigator.gpu.requestAdapter()!==null,tI=()=>navigator.hardwareConcurrency??4;async function Hf(e,t){return URL.createObjectURL(await yw(e,t))}async function yw(e,t){const r=new URL("resources.json",t.publicPath),a=await fetch(r);if(!a.ok)throw new Error("Resource metadata not found. Ensure that the config.publicPath is configured correctly.");const s=(await a.json())[e];if(!s)throw new Error(`Resource ${e} not found. Ensure that the config.publicPath is configured correctly.`);const o=s.chunks;let u=0;const d=o.map(async m=>{const g=m.offsets[1]-m.offsets[0],_=t.publicPath?new URL(m.name,t.publicPath).toString():m.name,w=await(await fetch(_,t.fetchArgs)).blob();if(g!==w.size)throw new Error(`Failed to fetch ${e} with size ${g} but got ${w.size}`);return t.progress&&(u+=g,t.progress(`fetch:${e}`,u,s.size)),w}),p=await Promise.all(d),f=new Blob(p,{type:s.mime});if(f.size!==s.size)throw new Error(`Failed to fetch ${e} with size ${s.size} but got ${f.size}`);return f}var xs=null,_w=async e=>(xs!==null||(e?xs=(await jf(async()=>{const{default:t}=await Promise.resolve().then(()=>Pz);return{default:t}},void 0)).default:xs=(await jf(async()=>{const{default:t}=await Promise.resolve().then(()=>s4);return{default:t}},void 0)).default),xs);async function rI(e,t){const r=t.device==="gpu"&&await gw(),a=r&&t.proxyToWorker,i=[r?"webgpu":"wasm"],s=await _w(r);t.debug&&(console.debug("	Using WebGPU:",r),console.debug("	Proxy to Worker:",a),s.env.debug=!0,s.env.logLevel="verbose"),s.env.wasm.numThreads=tI(),s.env.wasm.proxy=a;const o=r?"/onnxruntime-web/ort-wasm-simd-threaded.jsep":"/onnxruntime-web/ort-wasm-simd-threaded",u=await Hf(`${o}.wasm`,t),d=await Hf(`${o}.mjs`,t);s.env.wasm.wasmPaths={mjs:d,wasm:u},t.debug&&console.debug("ort.env.wasm:",s.env.wasm);const p={executionProviders:i,graphOptimizationLevel:"all",executionMode:"parallel",enableCpuMemArena:!0};return await s.InferenceSession.create(e,p).catch(m=>{throw new Error(`Failed to create session: "${m}". Please check if the publicPath is set correctly.`)})}async function aI(e,t,r,a){const i=a.device==="gpu"&&await gw(),s=await _w(i),o={};for(const[p,f]of t)o[p]=new s.Tensor("float32",new Float32Array(f.data),f.shape);const u=await e.run(o,{}),d=[];for(const p of r){const f=u[p],m=f.dims,g=f.data,_=(0,eI.default)(g,m);d.push(_)}return d}var Ve;(function(e){e.assertEqual=i=>i;function t(i){}e.assertIs=t;function r(i){throw new Error}e.assertNever=r,e.arrayToEnum=i=>{const s={};for(const o of i)s[o]=o;return s},e.getValidEnumValues=i=>{const s=e.objectKeys(i).filter(u=>typeof i[i[u]]!="number"),o={};for(const u of s)o[u]=i[u];return e.objectValues(o)},e.objectValues=i=>e.objectKeys(i).map(function(s){return i[s]}),e.objectKeys=typeof Object.keys=="function"?i=>Object.keys(i):i=>{const s=[];for(const o in i)Object.prototype.hasOwnProperty.call(i,o)&&s.push(o);return s},e.find=(i,s)=>{for(const o of i)if(s(o))return o},e.isInteger=typeof Number.isInteger=="function"?i=>Number.isInteger(i):i=>typeof i=="number"&&isFinite(i)&&Math.floor(i)===i;function a(i,s=" | "){return i.map(o=>typeof o=="string"?`'${o}'`:o).join(s)}e.joinValues=a,e.jsonStringifyReplacer=(i,s)=>typeof s=="bigint"?s.toString():s})(Ve||(Ve={}));var Fc;(function(e){e.mergeShapes=(t,r)=>({...t,...r})})(Fc||(Fc={}));var ce=Ve.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),Mr=e=>{switch(typeof e){case"undefined":return ce.undefined;case"string":return ce.string;case"number":return isNaN(e)?ce.nan:ce.number;case"boolean":return ce.boolean;case"function":return ce.function;case"bigint":return ce.bigint;case"symbol":return ce.symbol;case"object":return Array.isArray(e)?ce.array:e===null?ce.null:e.then&&typeof e.then=="function"&&e.catch&&typeof e.catch=="function"?ce.promise:typeof Map<"u"&&e instanceof Map?ce.map:typeof Set<"u"&&e instanceof Set?ce.set:typeof Date<"u"&&e instanceof Date?ce.date:ce.object;default:return ce.unknown}},ne=Ve.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),iI=e=>JSON.stringify(e,null,2).replace(/"([^"]+)":/g,"$1:"),pr=class vw extends Error{get errors(){return this.issues}constructor(t){super(),this.issues=[],this.addIssue=a=>{this.issues=[...this.issues,a]},this.addIssues=(a=[])=>{this.issues=[...this.issues,...a]};const r=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,r):this.__proto__=r,this.name="ZodError",this.issues=t}format(t){const r=t||function(s){return s.message},a={_errors:[]},i=s=>{for(const o of s.issues)if(o.code==="invalid_union")o.unionErrors.map(i);else if(o.code==="invalid_return_type")i(o.returnTypeError);else if(o.code==="invalid_arguments")i(o.argumentsError);else if(o.path.length===0)a._errors.push(r(o));else{let u=a,d=0;for(;d<o.path.length;){const p=o.path[d];d===o.path.length-1?(u[p]=u[p]||{_errors:[]},u[p]._errors.push(r(o))):u[p]=u[p]||{_errors:[]},u=u[p],d++}}};return i(this),a}static assert(t){if(!(t instanceof vw))throw new Error(`Not a ZodError: ${t}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,Ve.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(t=r=>r.message){const r={},a=[];for(const i of this.issues)i.path.length>0?(r[i.path[0]]=r[i.path[0]]||[],r[i.path[0]].push(t(i))):a.push(t(i));return{formErrors:a,fieldErrors:r}}get formErrors(){return this.flatten()}};pr.create=e=>new pr(e);var ii=(e,t)=>{let r;switch(e.code){case ne.invalid_type:e.received===ce.undefined?r="Required":r=`Expected ${e.expected}, received ${e.received}`;break;case ne.invalid_literal:r=`Invalid literal value, expected ${JSON.stringify(e.expected,Ve.jsonStringifyReplacer)}`;break;case ne.unrecognized_keys:r=`Unrecognized key(s) in object: ${Ve.joinValues(e.keys,", ")}`;break;case ne.invalid_union:r="Invalid input";break;case ne.invalid_union_discriminator:r=`Invalid discriminator value. Expected ${Ve.joinValues(e.options)}`;break;case ne.invalid_enum_value:r=`Invalid enum value. Expected ${Ve.joinValues(e.options)}, received '${e.received}'`;break;case ne.invalid_arguments:r="Invalid function arguments";break;case ne.invalid_return_type:r="Invalid function return type";break;case ne.invalid_date:r="Invalid date";break;case ne.invalid_string:typeof e.validation=="object"?"includes"in e.validation?(r=`Invalid input: must include "${e.validation.includes}"`,typeof e.validation.position=="number"&&(r=`${r} at one or more positions greater than or equal to ${e.validation.position}`)):"startsWith"in e.validation?r=`Invalid input: must start with "${e.validation.startsWith}"`:"endsWith"in e.validation?r=`Invalid input: must end with "${e.validation.endsWith}"`:Ve.assertNever(e.validation):e.validation!=="regex"?r=`Invalid ${e.validation}`:r="Invalid";break;case ne.too_small:e.type==="array"?r=`Array must contain ${e.exact?"exactly":e.inclusive?"at least":"more than"} ${e.minimum} element(s)`:e.type==="string"?r=`String must contain ${e.exact?"exactly":e.inclusive?"at least":"over"} ${e.minimum} character(s)`:e.type==="number"?r=`Number must be ${e.exact?"exactly equal to ":e.inclusive?"greater than or equal to ":"greater than "}${e.minimum}`:e.type==="date"?r=`Date must be ${e.exact?"exactly equal to ":e.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(e.minimum))}`:r="Invalid input";break;case ne.too_big:e.type==="array"?r=`Array must contain ${e.exact?"exactly":e.inclusive?"at most":"less than"} ${e.maximum} element(s)`:e.type==="string"?r=`String must contain ${e.exact?"exactly":e.inclusive?"at most":"under"} ${e.maximum} character(s)`:e.type==="number"?r=`Number must be ${e.exact?"exactly":e.inclusive?"less than or equal to":"less than"} ${e.maximum}`:e.type==="bigint"?r=`BigInt must be ${e.exact?"exactly":e.inclusive?"less than or equal to":"less than"} ${e.maximum}`:e.type==="date"?r=`Date must be ${e.exact?"exactly":e.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(e.maximum))}`:r="Invalid input";break;case ne.custom:r="Invalid input";break;case ne.invalid_intersection_types:r="Intersection results could not be merged";break;case ne.not_multiple_of:r=`Number must be a multiple of ${e.multipleOf}`;break;case ne.not_finite:r="Number must be finite";break;default:r=t.defaultError,Ve.assertNever(e)}return{message:r}},$w=ii;function nI(e){$w=e}function ou(){return $w}var uu=e=>{const{data:t,path:r,errorMaps:a,issueData:i}=e,s=[...r,...i.path||[]],o={...i,path:s};if(i.message!==void 0)return{...i,path:s,message:i.message};let u="";const d=a.filter(p=>!!p).slice().reverse();for(const p of d)u=p(o,{data:t,defaultError:u}).message;return{...i,path:s,message:u}},sI=[];function pe(e,t){const r=ou(),a=uu({issueData:t,data:e.data,path:e.path,errorMaps:[e.common.contextualErrorMap,e.schemaErrorMap,r,r===ii?void 0:ii].filter(i=>!!i)});e.common.issues.push(a)}var It=class ww{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(t,r){const a=[];for(const i of r){if(i.status==="aborted")return Se;i.status==="dirty"&&t.dirty(),a.push(i.value)}return{status:t.value,value:a}}static async mergeObjectAsync(t,r){const a=[];for(const i of r){const s=await i.key,o=await i.value;a.push({key:s,value:o})}return ww.mergeObjectSync(t,a)}static mergeObjectSync(t,r){const a={};for(const i of r){const{key:s,value:o}=i;if(s.status==="aborted"||o.status==="aborted")return Se;s.status==="dirty"&&t.dirty(),o.status==="dirty"&&t.dirty(),s.value!=="__proto__"&&(typeof o.value<"u"||i.alwaysSet)&&(a[s.value]=o.value)}return{status:t.value,value:a}}},Se=Object.freeze({status:"aborted"}),ti=e=>({status:"dirty",value:e}),Ct=e=>({status:"valid",value:e}),Hc=e=>e.status==="aborted",Kc=e=>e.status==="dirty",Pa=e=>e.status==="valid",ao=e=>typeof Promise<"u"&&e instanceof Promise;function lu(e,t,r,a){if(typeof t=="function"?e!==t||!0:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t.get(e)}function bw(e,t,r,a,i){if(typeof t=="function"?e!==t||!0:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return t.set(e,r),r}var ve;(function(e){e.errToObj=t=>typeof t=="string"?{message:t}:t||{},e.toString=t=>typeof t=="string"?t:t?.message})(ve||(ve={}));var qs,js,$r=class{constructor(e,t,r,a){this._cachedPath=[],this.parent=e,this.data=t,this._path=r,this._key=a}get path(){return this._cachedPath.length||(this._key instanceof Array?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},Kf=(e,t)=>{if(Pa(t))return{success:!0,data:t.value};if(!e.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;const r=new pr(e.common.issues);return this._error=r,this._error}}};function Re(e){if(!e)return{};const{errorMap:t,invalid_type_error:r,required_error:a,description:i}=e;if(t&&(r||a))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return t?{errorMap:t,description:i}:{errorMap:(o,u)=>{var d,p;const{message:f}=e;return o.code==="invalid_enum_value"?{message:f??u.defaultError}:typeof u.data>"u"?{message:(d=f??a)!==null&&d!==void 0?d:u.defaultError}:o.code!=="invalid_type"?{message:u.defaultError}:{message:(p=f??r)!==null&&p!==void 0?p:u.defaultError}},description:i}}var Be=class{get description(){return this._def.description}_getType(e){return Mr(e.data)}_getOrReturnCtx(e,t){return t||{common:e.parent.common,data:e.data,parsedType:Mr(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new It,ctx:{common:e.parent.common,data:e.data,parsedType:Mr(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){const t=this._parse(e);if(ao(t))throw new Error("Synchronous parse encountered promise.");return t}_parseAsync(e){const t=this._parse(e);return Promise.resolve(t)}parse(e,t){const r=this.safeParse(e,t);if(r.success)return r.data;throw r.error}safeParse(e,t){var r;const a={common:{issues:[],async:(r=t?.async)!==null&&r!==void 0?r:!1,contextualErrorMap:t?.errorMap},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:Mr(e)},i=this._parseSync({data:e,path:a.path,parent:a});return Kf(a,i)}"~validate"(e){var t,r;const a={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:Mr(e)};if(!this["~standard"].async)try{const i=this._parseSync({data:e,path:[],parent:a});return Pa(i)?{value:i.value}:{issues:a.common.issues}}catch(i){!((r=(t=i?.message)===null||t===void 0?void 0:t.toLowerCase())===null||r===void 0)&&r.includes("encountered")&&(this["~standard"].async=!0),a.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:a}).then(i=>Pa(i)?{value:i.value}:{issues:a.common.issues})}async parseAsync(e,t){const r=await this.safeParseAsync(e,t);if(r.success)return r.data;throw r.error}async safeParseAsync(e,t){const r={common:{issues:[],contextualErrorMap:t?.errorMap,async:!0},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:Mr(e)},a=this._parse({data:e,path:r.path,parent:r}),i=await(ao(a)?a:Promise.resolve(a));return Kf(r,i)}refine(e,t){const r=a=>typeof t=="string"||typeof t>"u"?{message:t}:typeof t=="function"?t(a):t;return this._refinement((a,i)=>{const s=e(a),o=()=>i.addIssue({code:ne.custom,...r(a)});return typeof Promise<"u"&&s instanceof Promise?s.then(u=>u?!0:(o(),!1)):s?!0:(o(),!1)})}refinement(e,t){return this._refinement((r,a)=>e(r)?!0:(a.addIssue(typeof t=="function"?t(r,a):t),!1))}_refinement(e){return new cr({schema:this,typeName:ke.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:t=>this["~validate"](t)}}optional(){return vr.create(this,this._def)}nullable(){return Hr.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return Ua.create(this)}promise(){return oi.create(this,this._def)}or(e){return po.create([this,e],this._def)}and(e){return co.create(this,e,this._def)}transform(e){return new cr({...Re(this._def),schema:this,typeName:ke.ZodEffects,effect:{type:"transform",transform:e}})}default(e){const t=typeof e=="function"?e:()=>e;return new go({...Re(this._def),innerType:this,defaultValue:t,typeName:ke.ZodDefault})}brand(){return new Rh({typeName:ke.ZodBranded,type:this,...Re(this._def)})}catch(e){const t=typeof e=="function"?e:()=>e;return new yo({...Re(this._def),innerType:this,catchValue:t,typeName:ke.ZodCatch})}describe(e){const t=this.constructor;return new t({...this._def,description:e})}pipe(e){return Bh.create(this,e)}readonly(){return _o.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},oI=/^c[^\s-]{8,}$/i,uI=/^[0-9a-z]+$/,lI=/^[0-9A-HJKMNP-TV-Z]{26}$/i,dI=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,pI=/^[a-z0-9_-]{21}$/i,cI=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,hI=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,fI=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,mI="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",Yd,gI=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,yI=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,_I=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,vI=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,$I=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,wI=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,xw="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",bI=new RegExp(`^${xw}$`);function kw(e){let t="([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";return e.precision?t=`${t}\\.\\d{${e.precision}}`:e.precision==null&&(t=`${t}(\\.\\d+)?`),t}function xI(e){return new RegExp(`^${kw(e)}$`)}function Sw(e){let t=`${xw}T${kw(e)}`;const r=[];return r.push(e.local?"Z?":"Z"),e.offset&&r.push("([+-]\\d{2}:?\\d{2})"),t=`${t}(${r.join("|")})`,new RegExp(`^${t}$`)}function kI(e,t){return!!((t==="v4"||!t)&&gI.test(e)||(t==="v6"||!t)&&_I.test(e))}function SI(e,t){if(!cI.test(e))return!1;try{const[r]=e.split("."),a=r.replace(/-/g,"+").replace(/_/g,"/").padEnd(r.length+(4-r.length%4)%4,"="),i=JSON.parse(atob(a));return!(typeof i!="object"||i===null||!i.typ||!i.alg||t&&i.alg!==t)}catch{return!1}}function TI(e,t){return!!((t==="v4"||!t)&&yI.test(e)||(t==="v6"||!t)&&vI.test(e))}var ni=class Ls extends Be{_parse(t){if(this._def.coerce&&(t.data=String(t.data)),this._getType(t)!==ce.string){const s=this._getOrReturnCtx(t);return pe(s,{code:ne.invalid_type,expected:ce.string,received:s.parsedType}),Se}const a=new It;let i;for(const s of this._def.checks)if(s.kind==="min")t.data.length<s.value&&(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.too_small,minimum:s.value,type:"string",inclusive:!0,exact:!1,message:s.message}),a.dirty());else if(s.kind==="max")t.data.length>s.value&&(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.too_big,maximum:s.value,type:"string",inclusive:!0,exact:!1,message:s.message}),a.dirty());else if(s.kind==="length"){const o=t.data.length>s.value,u=t.data.length<s.value;(o||u)&&(i=this._getOrReturnCtx(t,i),o?pe(i,{code:ne.too_big,maximum:s.value,type:"string",inclusive:!0,exact:!0,message:s.message}):u&&pe(i,{code:ne.too_small,minimum:s.value,type:"string",inclusive:!0,exact:!0,message:s.message}),a.dirty())}else if(s.kind==="email")fI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"email",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="emoji")Yd||(Yd=new RegExp(mI,"u")),Yd.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"emoji",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="uuid")dI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"uuid",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="nanoid")pI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"nanoid",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="cuid")oI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"cuid",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="cuid2")uI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"cuid2",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="ulid")lI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"ulid",code:ne.invalid_string,message:s.message}),a.dirty());else if(s.kind==="url")try{new URL(t.data)}catch{i=this._getOrReturnCtx(t,i),pe(i,{validation:"url",code:ne.invalid_string,message:s.message}),a.dirty()}else s.kind==="regex"?(s.regex.lastIndex=0,s.regex.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"regex",code:ne.invalid_string,message:s.message}),a.dirty())):s.kind==="trim"?t.data=t.data.trim():s.kind==="includes"?t.data.includes(s.value,s.position)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:{includes:s.value,position:s.position},message:s.message}),a.dirty()):s.kind==="toLowerCase"?t.data=t.data.toLowerCase():s.kind==="toUpperCase"?t.data=t.data.toUpperCase():s.kind==="startsWith"?t.data.startsWith(s.value)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:{startsWith:s.value},message:s.message}),a.dirty()):s.kind==="endsWith"?t.data.endsWith(s.value)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:{endsWith:s.value},message:s.message}),a.dirty()):s.kind==="datetime"?Sw(s).test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:"datetime",message:s.message}),a.dirty()):s.kind==="date"?bI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:"date",message:s.message}),a.dirty()):s.kind==="time"?xI(s).test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.invalid_string,validation:"time",message:s.message}),a.dirty()):s.kind==="duration"?hI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"duration",code:ne.invalid_string,message:s.message}),a.dirty()):s.kind==="ip"?kI(t.data,s.version)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"ip",code:ne.invalid_string,message:s.message}),a.dirty()):s.kind==="jwt"?SI(t.data,s.alg)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"jwt",code:ne.invalid_string,message:s.message}),a.dirty()):s.kind==="cidr"?TI(t.data,s.version)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"cidr",code:ne.invalid_string,message:s.message}),a.dirty()):s.kind==="base64"?$I.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"base64",code:ne.invalid_string,message:s.message}),a.dirty()):s.kind==="base64url"?wI.test(t.data)||(i=this._getOrReturnCtx(t,i),pe(i,{validation:"base64url",code:ne.invalid_string,message:s.message}),a.dirty()):Ve.assertNever(s);return{status:a.value,value:t.data}}_regex(t,r,a){return this.refinement(i=>t.test(i),{validation:r,code:ne.invalid_string,...ve.errToObj(a)})}_addCheck(t){return new Ls({...this._def,checks:[...this._def.checks,t]})}email(t){return this._addCheck({kind:"email",...ve.errToObj(t)})}url(t){return this._addCheck({kind:"url",...ve.errToObj(t)})}emoji(t){return this._addCheck({kind:"emoji",...ve.errToObj(t)})}uuid(t){return this._addCheck({kind:"uuid",...ve.errToObj(t)})}nanoid(t){return this._addCheck({kind:"nanoid",...ve.errToObj(t)})}cuid(t){return this._addCheck({kind:"cuid",...ve.errToObj(t)})}cuid2(t){return this._addCheck({kind:"cuid2",...ve.errToObj(t)})}ulid(t){return this._addCheck({kind:"ulid",...ve.errToObj(t)})}base64(t){return this._addCheck({kind:"base64",...ve.errToObj(t)})}base64url(t){return this._addCheck({kind:"base64url",...ve.errToObj(t)})}jwt(t){return this._addCheck({kind:"jwt",...ve.errToObj(t)})}ip(t){return this._addCheck({kind:"ip",...ve.errToObj(t)})}cidr(t){return this._addCheck({kind:"cidr",...ve.errToObj(t)})}datetime(t){var r,a;return typeof t=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:t}):this._addCheck({kind:"datetime",precision:typeof t?.precision>"u"?null:t?.precision,offset:(r=t?.offset)!==null&&r!==void 0?r:!1,local:(a=t?.local)!==null&&a!==void 0?a:!1,...ve.errToObj(t?.message)})}date(t){return this._addCheck({kind:"date",message:t})}time(t){return typeof t=="string"?this._addCheck({kind:"time",precision:null,message:t}):this._addCheck({kind:"time",precision:typeof t?.precision>"u"?null:t?.precision,...ve.errToObj(t?.message)})}duration(t){return this._addCheck({kind:"duration",...ve.errToObj(t)})}regex(t,r){return this._addCheck({kind:"regex",regex:t,...ve.errToObj(r)})}includes(t,r){return this._addCheck({kind:"includes",value:t,position:r?.position,...ve.errToObj(r?.message)})}startsWith(t,r){return this._addCheck({kind:"startsWith",value:t,...ve.errToObj(r)})}endsWith(t,r){return this._addCheck({kind:"endsWith",value:t,...ve.errToObj(r)})}min(t,r){return this._addCheck({kind:"min",value:t,...ve.errToObj(r)})}max(t,r){return this._addCheck({kind:"max",value:t,...ve.errToObj(r)})}length(t,r){return this._addCheck({kind:"length",value:t,...ve.errToObj(r)})}nonempty(t){return this.min(1,ve.errToObj(t))}trim(){return new Ls({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new Ls({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new Ls({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(t=>t.kind==="datetime")}get isDate(){return!!this._def.checks.find(t=>t.kind==="date")}get isTime(){return!!this._def.checks.find(t=>t.kind==="time")}get isDuration(){return!!this._def.checks.find(t=>t.kind==="duration")}get isEmail(){return!!this._def.checks.find(t=>t.kind==="email")}get isURL(){return!!this._def.checks.find(t=>t.kind==="url")}get isEmoji(){return!!this._def.checks.find(t=>t.kind==="emoji")}get isUUID(){return!!this._def.checks.find(t=>t.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(t=>t.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(t=>t.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(t=>t.kind==="cuid2")}get isULID(){return!!this._def.checks.find(t=>t.kind==="ulid")}get isIP(){return!!this._def.checks.find(t=>t.kind==="ip")}get isCIDR(){return!!this._def.checks.find(t=>t.kind==="cidr")}get isBase64(){return!!this._def.checks.find(t=>t.kind==="base64")}get isBase64url(){return!!this._def.checks.find(t=>t.kind==="base64url")}get minLength(){let t=null;for(const r of this._def.checks)r.kind==="min"&&(t===null||r.value>t)&&(t=r.value);return t}get maxLength(){let t=null;for(const r of this._def.checks)r.kind==="max"&&(t===null||r.value<t)&&(t=r.value);return t}};ni.create=e=>{var t;return new ni({checks:[],typeName:ke.ZodString,coerce:(t=e?.coerce)!==null&&t!==void 0?t:!1,...Re(e)})};function CI(e,t){const r=(e.toString().split(".")[1]||"").length,a=(t.toString().split(".")[1]||"").length,i=r>a?r:a,s=parseInt(e.toFixed(i).replace(".","")),o=parseInt(t.toFixed(i).replace(".",""));return s%o/Math.pow(10,i)}var io=class Zc extends Be{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(t){if(this._def.coerce&&(t.data=Number(t.data)),this._getType(t)!==ce.number){const s=this._getOrReturnCtx(t);return pe(s,{code:ne.invalid_type,expected:ce.number,received:s.parsedType}),Se}let a;const i=new It;for(const s of this._def.checks)s.kind==="int"?Ve.isInteger(t.data)||(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.invalid_type,expected:"integer",received:"float",message:s.message}),i.dirty()):s.kind==="min"?(s.inclusive?t.data<s.value:t.data<=s.value)&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.too_small,minimum:s.value,type:"number",inclusive:s.inclusive,exact:!1,message:s.message}),i.dirty()):s.kind==="max"?(s.inclusive?t.data>s.value:t.data>=s.value)&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.too_big,maximum:s.value,type:"number",inclusive:s.inclusive,exact:!1,message:s.message}),i.dirty()):s.kind==="multipleOf"?CI(t.data,s.value)!==0&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.not_multiple_of,multipleOf:s.value,message:s.message}),i.dirty()):s.kind==="finite"?Number.isFinite(t.data)||(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.not_finite,message:s.message}),i.dirty()):Ve.assertNever(s);return{status:i.value,value:t.data}}gte(t,r){return this.setLimit("min",t,!0,ve.toString(r))}gt(t,r){return this.setLimit("min",t,!1,ve.toString(r))}lte(t,r){return this.setLimit("max",t,!0,ve.toString(r))}lt(t,r){return this.setLimit("max",t,!1,ve.toString(r))}setLimit(t,r,a,i){return new Zc({...this._def,checks:[...this._def.checks,{kind:t,value:r,inclusive:a,message:ve.toString(i)}]})}_addCheck(t){return new Zc({...this._def,checks:[...this._def.checks,t]})}int(t){return this._addCheck({kind:"int",message:ve.toString(t)})}positive(t){return this._addCheck({kind:"min",value:0,inclusive:!1,message:ve.toString(t)})}negative(t){return this._addCheck({kind:"max",value:0,inclusive:!1,message:ve.toString(t)})}nonpositive(t){return this._addCheck({kind:"max",value:0,inclusive:!0,message:ve.toString(t)})}nonnegative(t){return this._addCheck({kind:"min",value:0,inclusive:!0,message:ve.toString(t)})}multipleOf(t,r){return this._addCheck({kind:"multipleOf",value:t,message:ve.toString(r)})}finite(t){return this._addCheck({kind:"finite",message:ve.toString(t)})}safe(t){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:ve.toString(t)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:ve.toString(t)})}get minValue(){let t=null;for(const r of this._def.checks)r.kind==="min"&&(t===null||r.value>t)&&(t=r.value);return t}get maxValue(){let t=null;for(const r of this._def.checks)r.kind==="max"&&(t===null||r.value<t)&&(t=r.value);return t}get isInt(){return!!this._def.checks.find(t=>t.kind==="int"||t.kind==="multipleOf"&&Ve.isInteger(t.value))}get isFinite(){let t=null,r=null;for(const a of this._def.checks){if(a.kind==="finite"||a.kind==="int"||a.kind==="multipleOf")return!0;a.kind==="min"?(r===null||a.value>r)&&(r=a.value):a.kind==="max"&&(t===null||a.value<t)&&(t=a.value)}return Number.isFinite(r)&&Number.isFinite(t)}};io.create=e=>new io({checks:[],typeName:ke.ZodNumber,coerce:e?.coerce||!1,...Re(e)});var no=class Qc extends Be{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(t){if(this._def.coerce)try{t.data=BigInt(t.data)}catch{return this._getInvalidInput(t)}if(this._getType(t)!==ce.bigint)return this._getInvalidInput(t);let a;const i=new It;for(const s of this._def.checks)s.kind==="min"?(s.inclusive?t.data<s.value:t.data<=s.value)&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.too_small,type:"bigint",minimum:s.value,inclusive:s.inclusive,message:s.message}),i.dirty()):s.kind==="max"?(s.inclusive?t.data>s.value:t.data>=s.value)&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.too_big,type:"bigint",maximum:s.value,inclusive:s.inclusive,message:s.message}),i.dirty()):s.kind==="multipleOf"?t.data%s.value!==BigInt(0)&&(a=this._getOrReturnCtx(t,a),pe(a,{code:ne.not_multiple_of,multipleOf:s.value,message:s.message}),i.dirty()):Ve.assertNever(s);return{status:i.value,value:t.data}}_getInvalidInput(t){const r=this._getOrReturnCtx(t);return pe(r,{code:ne.invalid_type,expected:ce.bigint,received:r.parsedType}),Se}gte(t,r){return this.setLimit("min",t,!0,ve.toString(r))}gt(t,r){return this.setLimit("min",t,!1,ve.toString(r))}lte(t,r){return this.setLimit("max",t,!0,ve.toString(r))}lt(t,r){return this.setLimit("max",t,!1,ve.toString(r))}setLimit(t,r,a,i){return new Qc({...this._def,checks:[...this._def.checks,{kind:t,value:r,inclusive:a,message:ve.toString(i)}]})}_addCheck(t){return new Qc({...this._def,checks:[...this._def.checks,t]})}positive(t){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:ve.toString(t)})}negative(t){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:ve.toString(t)})}nonpositive(t){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:ve.toString(t)})}nonnegative(t){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:ve.toString(t)})}multipleOf(t,r){return this._addCheck({kind:"multipleOf",value:t,message:ve.toString(r)})}get minValue(){let t=null;for(const r of this._def.checks)r.kind==="min"&&(t===null||r.value>t)&&(t=r.value);return t}get maxValue(){let t=null;for(const r of this._def.checks)r.kind==="max"&&(t===null||r.value<t)&&(t=r.value);return t}};no.create=e=>{var t;return new no({checks:[],typeName:ke.ZodBigInt,coerce:(t=e?.coerce)!==null&&t!==void 0?t:!1,...Re(e)})};var so=class extends Be{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==ce.boolean){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.boolean,received:r.parsedType}),Se}return Ct(e.data)}};so.create=e=>new so({typeName:ke.ZodBoolean,coerce:e?.coerce||!1,...Re(e)});var oo=class Tw extends Be{_parse(t){if(this._def.coerce&&(t.data=new Date(t.data)),this._getType(t)!==ce.date){const s=this._getOrReturnCtx(t);return pe(s,{code:ne.invalid_type,expected:ce.date,received:s.parsedType}),Se}if(isNaN(t.data.getTime())){const s=this._getOrReturnCtx(t);return pe(s,{code:ne.invalid_date}),Se}const a=new It;let i;for(const s of this._def.checks)s.kind==="min"?t.data.getTime()<s.value&&(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.too_small,message:s.message,inclusive:!0,exact:!1,minimum:s.value,type:"date"}),a.dirty()):s.kind==="max"?t.data.getTime()>s.value&&(i=this._getOrReturnCtx(t,i),pe(i,{code:ne.too_big,message:s.message,inclusive:!0,exact:!1,maximum:s.value,type:"date"}),a.dirty()):Ve.assertNever(s);return{status:a.value,value:new Date(t.data.getTime())}}_addCheck(t){return new Tw({...this._def,checks:[...this._def.checks,t]})}min(t,r){return this._addCheck({kind:"min",value:t.getTime(),message:ve.toString(r)})}max(t,r){return this._addCheck({kind:"max",value:t.getTime(),message:ve.toString(r)})}get minDate(){let t=null;for(const r of this._def.checks)r.kind==="min"&&(t===null||r.value>t)&&(t=r.value);return t!=null?new Date(t):null}get maxDate(){let t=null;for(const r of this._def.checks)r.kind==="max"&&(t===null||r.value<t)&&(t=r.value);return t!=null?new Date(t):null}};oo.create=e=>new oo({checks:[],coerce:e?.coerce||!1,typeName:ke.ZodDate,...Re(e)});var du=class extends Be{_parse(e){if(this._getType(e)!==ce.symbol){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.symbol,received:r.parsedType}),Se}return Ct(e.data)}};du.create=e=>new du({typeName:ke.ZodSymbol,...Re(e)});var uo=class extends Be{_parse(e){if(this._getType(e)!==ce.undefined){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.undefined,received:r.parsedType}),Se}return Ct(e.data)}};uo.create=e=>new uo({typeName:ke.ZodUndefined,...Re(e)});var lo=class extends Be{_parse(e){if(this._getType(e)!==ce.null){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.null,received:r.parsedType}),Se}return Ct(e.data)}};lo.create=e=>new lo({typeName:ke.ZodNull,...Re(e)});var si=class extends Be{constructor(){super(...arguments),this._any=!0}_parse(e){return Ct(e.data)}};si.create=e=>new si({typeName:ke.ZodAny,...Re(e)});var Da=class extends Be{constructor(){super(...arguments),this._unknown=!0}_parse(e){return Ct(e.data)}};Da.create=e=>new Da({typeName:ke.ZodUnknown,...Re(e)});var Dr=class extends Be{_parse(e){const t=this._getOrReturnCtx(e);return pe(t,{code:ne.invalid_type,expected:ce.never,received:t.parsedType}),Se}};Dr.create=e=>new Dr({typeName:ke.ZodNever,...Re(e)});var pu=class extends Be{_parse(e){if(this._getType(e)!==ce.undefined){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.void,received:r.parsedType}),Se}return Ct(e.data)}};pu.create=e=>new pu({typeName:ke.ZodVoid,...Re(e)});var Ua=class eu extends Be{_parse(t){const{ctx:r,status:a}=this._processInputParams(t),i=this._def;if(r.parsedType!==ce.array)return pe(r,{code:ne.invalid_type,expected:ce.array,received:r.parsedType}),Se;if(i.exactLength!==null){const o=r.data.length>i.exactLength.value,u=r.data.length<i.exactLength.value;(o||u)&&(pe(r,{code:o?ne.too_big:ne.too_small,minimum:u?i.exactLength.value:void 0,maximum:o?i.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:i.exactLength.message}),a.dirty())}if(i.minLength!==null&&r.data.length<i.minLength.value&&(pe(r,{code:ne.too_small,minimum:i.minLength.value,type:"array",inclusive:!0,exact:!1,message:i.minLength.message}),a.dirty()),i.maxLength!==null&&r.data.length>i.maxLength.value&&(pe(r,{code:ne.too_big,maximum:i.maxLength.value,type:"array",inclusive:!0,exact:!1,message:i.maxLength.message}),a.dirty()),r.common.async)return Promise.all([...r.data].map((o,u)=>i.type._parseAsync(new $r(r,o,r.path,u)))).then(o=>It.mergeArray(a,o));const s=[...r.data].map((o,u)=>i.type._parseSync(new $r(r,o,r.path,u)));return It.mergeArray(a,s)}get element(){return this._def.type}min(t,r){return new eu({...this._def,minLength:{value:t,message:ve.toString(r)}})}max(t,r){return new eu({...this._def,maxLength:{value:t,message:ve.toString(r)}})}length(t,r){return new eu({...this._def,exactLength:{value:t,message:ve.toString(r)}})}nonempty(t){return this.min(1,t)}};Ua.create=(e,t)=>new Ua({type:e,minLength:null,maxLength:null,exactLength:null,typeName:ke.ZodArray,...Re(t)});function Ja(e){if(e instanceof jt){const t={};for(const r in e.shape){const a=e.shape[r];t[r]=vr.create(Ja(a))}return new jt({...e._def,shape:()=>t})}else return e instanceof Ua?new Ua({...e._def,type:Ja(e.element)}):e instanceof vr?vr.create(Ja(e.unwrap())):e instanceof Hr?Hr.create(Ja(e.unwrap())):e instanceof Fr?Fr.create(e.items.map(t=>Ja(t))):e}var jt=class ur extends Be{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;const t=this._def.shape(),r=Ve.objectKeys(t);return this._cached={shape:t,keys:r}}_parse(t){if(this._getType(t)!==ce.object){const p=this._getOrReturnCtx(t);return pe(p,{code:ne.invalid_type,expected:ce.object,received:p.parsedType}),Se}const{status:a,ctx:i}=this._processInputParams(t),{shape:s,keys:o}=this._getCached(),u=[];if(!(this._def.catchall instanceof Dr&&this._def.unknownKeys==="strip"))for(const p in i.data)o.includes(p)||u.push(p);const d=[];for(const p of o){const f=s[p],m=i.data[p];d.push({key:{status:"valid",value:p},value:f._parse(new $r(i,m,i.path,p)),alwaysSet:p in i.data})}if(this._def.catchall instanceof Dr){const p=this._def.unknownKeys;if(p==="passthrough")for(const f of u)d.push({key:{status:"valid",value:f},value:{status:"valid",value:i.data[f]}});else if(p==="strict")u.length>0&&(pe(i,{code:ne.unrecognized_keys,keys:u}),a.dirty());else if(p!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{const p=this._def.catchall;for(const f of u){const m=i.data[f];d.push({key:{status:"valid",value:f},value:p._parse(new $r(i,m,i.path,f)),alwaysSet:f in i.data})}}return i.common.async?Promise.resolve().then(async()=>{const p=[];for(const f of d){const m=await f.key,g=await f.value;p.push({key:m,value:g,alwaysSet:f.alwaysSet})}return p}).then(p=>It.mergeObjectSync(a,p)):It.mergeObjectSync(a,d)}get shape(){return this._def.shape()}strict(t){return ve.errToObj,new ur({...this._def,unknownKeys:"strict",...t!==void 0?{errorMap:(r,a)=>{var i,s,o,u;const d=(o=(s=(i=this._def).errorMap)===null||s===void 0?void 0:s.call(i,r,a).message)!==null&&o!==void 0?o:a.defaultError;return r.code==="unrecognized_keys"?{message:(u=ve.errToObj(t).message)!==null&&u!==void 0?u:d}:{message:d}}}:{}})}strip(){return new ur({...this._def,unknownKeys:"strip"})}passthrough(){return new ur({...this._def,unknownKeys:"passthrough"})}extend(t){return new ur({...this._def,shape:()=>({...this._def.shape(),...t})})}merge(t){return new ur({unknownKeys:t._def.unknownKeys,catchall:t._def.catchall,shape:()=>({...this._def.shape(),...t._def.shape()}),typeName:ke.ZodObject})}setKey(t,r){return this.augment({[t]:r})}catchall(t){return new ur({...this._def,catchall:t})}pick(t){const r={};return Ve.objectKeys(t).forEach(a=>{t[a]&&this.shape[a]&&(r[a]=this.shape[a])}),new ur({...this._def,shape:()=>r})}omit(t){const r={};return Ve.objectKeys(this.shape).forEach(a=>{t[a]||(r[a]=this.shape[a])}),new ur({...this._def,shape:()=>r})}deepPartial(){return Ja(this)}partial(t){const r={};return Ve.objectKeys(this.shape).forEach(a=>{const i=this.shape[a];t&&!t[a]?r[a]=i:r[a]=i.optional()}),new ur({...this._def,shape:()=>r})}required(t){const r={};return Ve.objectKeys(this.shape).forEach(a=>{if(t&&!t[a])r[a]=this.shape[a];else{let s=this.shape[a];for(;s instanceof vr;)s=s._def.innerType;r[a]=s}}),new ur({...this._def,shape:()=>r})}keyof(){return Ow(Ve.objectKeys(this.shape))}};jt.create=(e,t)=>new jt({shape:()=>e,unknownKeys:"strip",catchall:Dr.create(),typeName:ke.ZodObject,...Re(t)});jt.strictCreate=(e,t)=>new jt({shape:()=>e,unknownKeys:"strict",catchall:Dr.create(),typeName:ke.ZodObject,...Re(t)});jt.lazycreate=(e,t)=>new jt({shape:e,unknownKeys:"strip",catchall:Dr.create(),typeName:ke.ZodObject,...Re(t)});var po=class extends Be{_parse(e){const{ctx:t}=this._processInputParams(e),r=this._def.options;function a(i){for(const o of i)if(o.result.status==="valid")return o.result;for(const o of i)if(o.result.status==="dirty")return t.common.issues.push(...o.ctx.common.issues),o.result;const s=i.map(o=>new pr(o.ctx.common.issues));return pe(t,{code:ne.invalid_union,unionErrors:s}),Se}if(t.common.async)return Promise.all(r.map(async i=>{const s={...t,common:{...t.common,issues:[]},parent:null};return{result:await i._parseAsync({data:t.data,path:t.path,parent:s}),ctx:s}})).then(a);{let i;const s=[];for(const u of r){const d={...t,common:{...t.common,issues:[]},parent:null},p=u._parseSync({data:t.data,path:t.path,parent:d});if(p.status==="valid")return p;p.status==="dirty"&&!i&&(i={result:p,ctx:d}),d.common.issues.length&&s.push(d.common.issues)}if(i)return t.common.issues.push(...i.ctx.common.issues),i.result;const o=s.map(u=>new pr(u));return pe(t,{code:ne.invalid_union,unionErrors:o}),Se}}get options(){return this._def.options}};po.create=(e,t)=>new po({options:e,typeName:ke.ZodUnion,...Re(t)});var Nr=e=>e instanceof ho?Nr(e.schema):e instanceof cr?Nr(e.innerType()):e instanceof fo?[e.value]:e instanceof xo?e.options:e instanceof mo?Ve.objectValues(e.enum):e instanceof go?Nr(e._def.innerType):e instanceof uo?[void 0]:e instanceof lo?[null]:e instanceof vr?[void 0,...Nr(e.unwrap())]:e instanceof Hr?[null,...Nr(e.unwrap())]:e instanceof Rh||e instanceof _o?Nr(e.unwrap()):e instanceof yo?Nr(e._def.innerType):[],Cw=class Iw extends Be{_parse(t){const{ctx:r}=this._processInputParams(t);if(r.parsedType!==ce.object)return pe(r,{code:ne.invalid_type,expected:ce.object,received:r.parsedType}),Se;const a=this.discriminator,i=r.data[a],s=this.optionsMap.get(i);return s?r.common.async?s._parseAsync({data:r.data,path:r.path,parent:r}):s._parseSync({data:r.data,path:r.path,parent:r}):(pe(r,{code:ne.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[a]}),Se)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(t,r,a){const i=new Map;for(const s of r){const o=Nr(s.shape[t]);if(!o.length)throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);for(const u of o){if(i.has(u))throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(u)}`);i.set(u,s)}}return new Iw({typeName:ke.ZodDiscriminatedUnion,discriminator:t,options:r,optionsMap:i,...Re(a)})}};function Xc(e,t){const r=Mr(e),a=Mr(t);if(e===t)return{valid:!0,data:e};if(r===ce.object&&a===ce.object){const i=Ve.objectKeys(t),s=Ve.objectKeys(e).filter(u=>i.indexOf(u)!==-1),o={...e,...t};for(const u of s){const d=Xc(e[u],t[u]);if(!d.valid)return{valid:!1};o[u]=d.data}return{valid:!0,data:o}}else if(r===ce.array&&a===ce.array){if(e.length!==t.length)return{valid:!1};const i=[];for(let s=0;s<e.length;s++){const o=e[s],u=t[s],d=Xc(o,u);if(!d.valid)return{valid:!1};i.push(d.data)}return{valid:!0,data:i}}else return r===ce.date&&a===ce.date&&+e==+t?{valid:!0,data:e}:{valid:!1}}var co=class extends Be{_parse(e){const{status:t,ctx:r}=this._processInputParams(e),a=(i,s)=>{if(Hc(i)||Hc(s))return Se;const o=Xc(i.value,s.value);return o.valid?((Kc(i)||Kc(s))&&t.dirty(),{status:t.value,value:o.data}):(pe(r,{code:ne.invalid_intersection_types}),Se)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([i,s])=>a(i,s)):a(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}};co.create=(e,t,r)=>new co({left:e,right:t,typeName:ke.ZodIntersection,...Re(r)});var Fr=class Ew extends Be{_parse(t){const{status:r,ctx:a}=this._processInputParams(t);if(a.parsedType!==ce.array)return pe(a,{code:ne.invalid_type,expected:ce.array,received:a.parsedType}),Se;if(a.data.length<this._def.items.length)return pe(a,{code:ne.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),Se;!this._def.rest&&a.data.length>this._def.items.length&&(pe(a,{code:ne.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),r.dirty());const s=[...a.data].map((o,u)=>{const d=this._def.items[u]||this._def.rest;return d?d._parse(new $r(a,o,a.path,u)):null}).filter(o=>!!o);return a.common.async?Promise.all(s).then(o=>It.mergeArray(r,o)):It.mergeArray(r,s)}get items(){return this._def.items}rest(t){return new Ew({...this._def,rest:t})}};Fr.create=(e,t)=>{if(!Array.isArray(e))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Fr({items:e,typeName:ke.ZodTuple,rest:null,...Re(t)})};var zw=class Jc extends Be{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(t){const{status:r,ctx:a}=this._processInputParams(t);if(a.parsedType!==ce.object)return pe(a,{code:ne.invalid_type,expected:ce.object,received:a.parsedType}),Se;const i=[],s=this._def.keyType,o=this._def.valueType;for(const u in a.data)i.push({key:s._parse(new $r(a,u,a.path,u)),value:o._parse(new $r(a,a.data[u],a.path,u)),alwaysSet:u in a.data});return a.common.async?It.mergeObjectAsync(r,i):It.mergeObjectSync(r,i)}get element(){return this._def.valueType}static create(t,r,a){return r instanceof Be?new Jc({keyType:t,valueType:r,typeName:ke.ZodRecord,...Re(a)}):new Jc({keyType:ni.create(),valueType:t,typeName:ke.ZodRecord,...Re(r)})}},cu=class extends Be{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.parsedType!==ce.map)return pe(r,{code:ne.invalid_type,expected:ce.map,received:r.parsedType}),Se;const a=this._def.keyType,i=this._def.valueType,s=[...r.data.entries()].map(([o,u],d)=>({key:a._parse(new $r(r,o,r.path,[d,"key"])),value:i._parse(new $r(r,u,r.path,[d,"value"]))}));if(r.common.async){const o=new Map;return Promise.resolve().then(async()=>{for(const u of s){const d=await u.key,p=await u.value;if(d.status==="aborted"||p.status==="aborted")return Se;(d.status==="dirty"||p.status==="dirty")&&t.dirty(),o.set(d.value,p.value)}return{status:t.value,value:o}})}else{const o=new Map;for(const u of s){const d=u.key,p=u.value;if(d.status==="aborted"||p.status==="aborted")return Se;(d.status==="dirty"||p.status==="dirty")&&t.dirty(),o.set(d.value,p.value)}return{status:t.value,value:o}}}};cu.create=(e,t,r)=>new cu({valueType:t,keyType:e,typeName:ke.ZodMap,...Re(r)});var hu=class Yc extends Be{_parse(t){const{status:r,ctx:a}=this._processInputParams(t);if(a.parsedType!==ce.set)return pe(a,{code:ne.invalid_type,expected:ce.set,received:a.parsedType}),Se;const i=this._def;i.minSize!==null&&a.data.size<i.minSize.value&&(pe(a,{code:ne.too_small,minimum:i.minSize.value,type:"set",inclusive:!0,exact:!1,message:i.minSize.message}),r.dirty()),i.maxSize!==null&&a.data.size>i.maxSize.value&&(pe(a,{code:ne.too_big,maximum:i.maxSize.value,type:"set",inclusive:!0,exact:!1,message:i.maxSize.message}),r.dirty());const s=this._def.valueType;function o(d){const p=new Set;for(const f of d){if(f.status==="aborted")return Se;f.status==="dirty"&&r.dirty(),p.add(f.value)}return{status:r.value,value:p}}const u=[...a.data.values()].map((d,p)=>s._parse(new $r(a,d,a.path,p)));return a.common.async?Promise.all(u).then(d=>o(d)):o(u)}min(t,r){return new Yc({...this._def,minSize:{value:t,message:ve.toString(r)}})}max(t,r){return new Yc({...this._def,maxSize:{value:t,message:ve.toString(r)}})}size(t,r){return this.min(t,r).max(t,r)}nonempty(t){return this.min(1,t)}};hu.create=(e,t)=>new hu({valueType:e,minSize:null,maxSize:null,typeName:ke.ZodSet,...Re(t)});var Aw=class tu extends Be{constructor(){super(...arguments),this.validate=this.implement}_parse(t){const{ctx:r}=this._processInputParams(t);if(r.parsedType!==ce.function)return pe(r,{code:ne.invalid_type,expected:ce.function,received:r.parsedType}),Se;function a(u,d){return uu({data:u,path:r.path,errorMaps:[r.common.contextualErrorMap,r.schemaErrorMap,ou(),ii].filter(p=>!!p),issueData:{code:ne.invalid_arguments,argumentsError:d}})}function i(u,d){return uu({data:u,path:r.path,errorMaps:[r.common.contextualErrorMap,r.schemaErrorMap,ou(),ii].filter(p=>!!p),issueData:{code:ne.invalid_return_type,returnTypeError:d}})}const s={errorMap:r.common.contextualErrorMap},o=r.data;if(this._def.returns instanceof oi){const u=this;return Ct(async function(...d){const p=new pr([]),f=await u._def.args.parseAsync(d,s).catch(_=>{throw p.addIssue(a(d,_)),p}),m=await Reflect.apply(o,this,f);return await u._def.returns._def.type.parseAsync(m,s).catch(_=>{throw p.addIssue(i(m,_)),p})})}else{const u=this;return Ct(function(...d){const p=u._def.args.safeParse(d,s);if(!p.success)throw new pr([a(d,p.error)]);const f=Reflect.apply(o,this,p.data),m=u._def.returns.safeParse(f,s);if(!m.success)throw new pr([i(f,m.error)]);return m.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...t){return new tu({...this._def,args:Fr.create(t).rest(Da.create())})}returns(t){return new tu({...this._def,returns:t})}implement(t){return this.parse(t)}strictImplement(t){return this.parse(t)}static create(t,r,a){return new tu({args:t||Fr.create([]).rest(Da.create()),returns:r||Da.create(),typeName:ke.ZodFunction,...Re(a)})}},ho=class extends Be{get schema(){return this._def.getter()}_parse(e){const{ctx:t}=this._processInputParams(e);return this._def.getter()._parse({data:t.data,path:t.path,parent:t})}};ho.create=(e,t)=>new ho({getter:e,typeName:ke.ZodLazy,...Re(t)});var fo=class extends Be{_parse(e){if(e.data!==this._def.value){const t=this._getOrReturnCtx(e);return pe(t,{received:t.data,code:ne.invalid_literal,expected:this._def.value}),Se}return{status:"valid",value:e.data}}get value(){return this._def.value}};fo.create=(e,t)=>new fo({value:e,typeName:ke.ZodLiteral,...Re(t)});function Ow(e,t){return new xo({values:e,typeName:ke.ZodEnum,...Re(t)})}var xo=class eh extends Be{constructor(){super(...arguments),qs.set(this,void 0)}_parse(t){if(typeof t.data!="string"){const r=this._getOrReturnCtx(t),a=this._def.values;return pe(r,{expected:Ve.joinValues(a),received:r.parsedType,code:ne.invalid_type}),Se}if(lu(this,qs)||bw(this,qs,new Set(this._def.values)),!lu(this,qs).has(t.data)){const r=this._getOrReturnCtx(t),a=this._def.values;return pe(r,{received:r.data,code:ne.invalid_enum_value,options:a}),Se}return Ct(t.data)}get options(){return this._def.values}get enum(){const t={};for(const r of this._def.values)t[r]=r;return t}get Values(){const t={};for(const r of this._def.values)t[r]=r;return t}get Enum(){const t={};for(const r of this._def.values)t[r]=r;return t}extract(t,r=this._def){return eh.create(t,{...this._def,...r})}exclude(t,r=this._def){return eh.create(this.options.filter(a=>!t.includes(a)),{...this._def,...r})}};qs=new WeakMap;xo.create=Ow;var mo=class extends Be{constructor(){super(...arguments),js.set(this,void 0)}_parse(e){const t=Ve.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(e);if(r.parsedType!==ce.string&&r.parsedType!==ce.number){const a=Ve.objectValues(t);return pe(r,{expected:Ve.joinValues(a),received:r.parsedType,code:ne.invalid_type}),Se}if(lu(this,js)||bw(this,js,new Set(Ve.getValidEnumValues(this._def.values))),!lu(this,js).has(e.data)){const a=Ve.objectValues(t);return pe(r,{received:r.data,code:ne.invalid_enum_value,options:a}),Se}return Ct(e.data)}get enum(){return this._def.values}};js=new WeakMap;mo.create=(e,t)=>new mo({values:e,typeName:ke.ZodNativeEnum,...Re(t)});var oi=class extends Be{unwrap(){return this._def.type}_parse(e){const{ctx:t}=this._processInputParams(e);if(t.parsedType!==ce.promise&&t.common.async===!1)return pe(t,{code:ne.invalid_type,expected:ce.promise,received:t.parsedType}),Se;const r=t.parsedType===ce.promise?t.data:Promise.resolve(t.data);return Ct(r.then(a=>this._def.type.parseAsync(a,{path:t.path,errorMap:t.common.contextualErrorMap})))}};oi.create=(e,t)=>new oi({type:e,typeName:ke.ZodPromise,...Re(t)});var cr=class extends Be{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===ke.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){const{status:t,ctx:r}=this._processInputParams(e),a=this._def.effect||null,i={addIssue:s=>{pe(r,s),s.fatal?t.abort():t.dirty()},get path(){return r.path}};if(i.addIssue=i.addIssue.bind(i),a.type==="preprocess"){const s=a.transform(r.data,i);if(r.common.async)return Promise.resolve(s).then(async o=>{if(t.value==="aborted")return Se;const u=await this._def.schema._parseAsync({data:o,path:r.path,parent:r});return u.status==="aborted"?Se:u.status==="dirty"||t.value==="dirty"?ti(u.value):u});{if(t.value==="aborted")return Se;const o=this._def.schema._parseSync({data:s,path:r.path,parent:r});return o.status==="aborted"?Se:o.status==="dirty"||t.value==="dirty"?ti(o.value):o}}if(a.type==="refinement"){const s=o=>{const u=a.refinement(o,i);if(r.common.async)return Promise.resolve(u);if(u instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return o};if(r.common.async===!1){const o=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?Se:(o.status==="dirty"&&t.dirty(),s(o.value),{status:t.value,value:o.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(o=>o.status==="aborted"?Se:(o.status==="dirty"&&t.dirty(),s(o.value).then(()=>({status:t.value,value:o.value}))))}if(a.type==="transform")if(r.common.async===!1){const s=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!Pa(s))return s;const o=a.transform(s.value,i);if(o instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:t.value,value:o}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(s=>Pa(s)?Promise.resolve(a.transform(s.value,i)).then(o=>({status:t.value,value:o})):s);Ve.assertNever(a)}};cr.create=(e,t,r)=>new cr({schema:e,typeName:ke.ZodEffects,effect:t,...Re(r)});cr.createWithPreprocess=(e,t,r)=>new cr({schema:t,effect:{type:"preprocess",transform:e},typeName:ke.ZodEffects,...Re(r)});var vr=class extends Be{_parse(e){return this._getType(e)===ce.undefined?Ct(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};vr.create=(e,t)=>new vr({innerType:e,typeName:ke.ZodOptional,...Re(t)});var Hr=class extends Be{_parse(e){return this._getType(e)===ce.null?Ct(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};Hr.create=(e,t)=>new Hr({innerType:e,typeName:ke.ZodNullable,...Re(t)});var go=class extends Be{_parse(e){const{ctx:t}=this._processInputParams(e);let r=t.data;return t.parsedType===ce.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:t.path,parent:t})}removeDefault(){return this._def.innerType}};go.create=(e,t)=>new go({innerType:e,typeName:ke.ZodDefault,defaultValue:typeof t.default=="function"?t.default:()=>t.default,...Re(t)});var yo=class extends Be{_parse(e){const{ctx:t}=this._processInputParams(e),r={...t,common:{...t.common,issues:[]}},a=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return ao(a)?a.then(i=>({status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get error(){return new pr(r.common.issues)},input:r.data})})):{status:"valid",value:a.status==="valid"?a.value:this._def.catchValue({get error(){return new pr(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}};yo.create=(e,t)=>new yo({innerType:e,typeName:ke.ZodCatch,catchValue:typeof t.catch=="function"?t.catch:()=>t.catch,...Re(t)});var fu=class extends Be{_parse(e){if(this._getType(e)!==ce.nan){const r=this._getOrReturnCtx(e);return pe(r,{code:ne.invalid_type,expected:ce.nan,received:r.parsedType}),Se}return{status:"valid",value:e.data}}};fu.create=e=>new fu({typeName:ke.ZodNaN,...Re(e)});var II=Symbol("zod_brand"),Rh=class extends Be{_parse(e){const{ctx:t}=this._processInputParams(e),r=t.data;return this._def.type._parse({data:r,path:t.path,parent:t})}unwrap(){return this._def.type}},Bh=class Rw extends Be{_parse(t){const{status:r,ctx:a}=this._processInputParams(t);if(a.common.async)return(async()=>{const s=await this._def.in._parseAsync({data:a.data,path:a.path,parent:a});return s.status==="aborted"?Se:s.status==="dirty"?(r.dirty(),ti(s.value)):this._def.out._parseAsync({data:s.value,path:a.path,parent:a})})();{const i=this._def.in._parseSync({data:a.data,path:a.path,parent:a});return i.status==="aborted"?Se:i.status==="dirty"?(r.dirty(),{status:"dirty",value:i.value}):this._def.out._parseSync({data:i.value,path:a.path,parent:a})}}static create(t,r){return new Rw({in:t,out:r,typeName:ke.ZodPipeline})}},_o=class extends Be{_parse(e){const t=this._def.innerType._parse(e),r=a=>(Pa(a)&&(a.value=Object.freeze(a.value)),a);return ao(t)?t.then(a=>r(a)):r(t)}unwrap(){return this._def.innerType}};_o.create=(e,t)=>new _o({innerType:e,typeName:ke.ZodReadonly,...Re(t)});function Zf(e,t){const r=typeof e=="function"?e(t):typeof e=="string"?{message:e}:e;return typeof r=="string"?{message:r}:r}function Bw(e,t={},r){return e?si.create().superRefine((a,i)=>{var s,o;const u=e(a);if(u instanceof Promise)return u.then(d=>{var p,f;if(!d){const m=Zf(t,a),g=(f=(p=m.fatal)!==null&&p!==void 0?p:r)!==null&&f!==void 0?f:!0;i.addIssue({code:"custom",...m,fatal:g})}});if(!u){const d=Zf(t,a),p=(o=(s=d.fatal)!==null&&s!==void 0?s:r)!==null&&o!==void 0?o:!0;i.addIssue({code:"custom",...d,fatal:p})}}):si.create()}var EI={object:jt.lazycreate},ke;(function(e){e.ZodString="ZodString",e.ZodNumber="ZodNumber",e.ZodNaN="ZodNaN",e.ZodBigInt="ZodBigInt",e.ZodBoolean="ZodBoolean",e.ZodDate="ZodDate",e.ZodSymbol="ZodSymbol",e.ZodUndefined="ZodUndefined",e.ZodNull="ZodNull",e.ZodAny="ZodAny",e.ZodUnknown="ZodUnknown",e.ZodNever="ZodNever",e.ZodVoid="ZodVoid",e.ZodArray="ZodArray",e.ZodObject="ZodObject",e.ZodUnion="ZodUnion",e.ZodDiscriminatedUnion="ZodDiscriminatedUnion",e.ZodIntersection="ZodIntersection",e.ZodTuple="ZodTuple",e.ZodRecord="ZodRecord",e.ZodMap="ZodMap",e.ZodSet="ZodSet",e.ZodFunction="ZodFunction",e.ZodLazy="ZodLazy",e.ZodLiteral="ZodLiteral",e.ZodEnum="ZodEnum",e.ZodEffects="ZodEffects",e.ZodNativeEnum="ZodNativeEnum",e.ZodOptional="ZodOptional",e.ZodNullable="ZodNullable",e.ZodDefault="ZodDefault",e.ZodCatch="ZodCatch",e.ZodPromise="ZodPromise",e.ZodBranded="ZodBranded",e.ZodPipeline="ZodPipeline",e.ZodReadonly="ZodReadonly"})(ke||(ke={}));var zI=(e,t={message:`Input not instance of ${e.name}`})=>Bw(r=>r instanceof e,t),Nw=ni.create,Mw=io.create,AI=fu.create,OI=no.create,Dw=so.create,RI=oo.create,BI=du.create,NI=uo.create,MI=lo.create,DI=si.create,PI=Da.create,UI=Dr.create,WI=pu.create,VI=Ua.create,qI=jt.create,jI=jt.strictCreate,LI=po.create,GI=Cw.create,FI=co.create,HI=Fr.create,KI=zw.create,ZI=cu.create,QI=hu.create,XI=Aw.create,JI=ho.create,YI=fo.create,eE=xo.create,tE=mo.create,rE=oi.create,Qf=cr.create,aE=vr.create,iE=Hr.create,nE=cr.createWithPreprocess,sE=Bh.create,oE=()=>Nw().optional(),uE=()=>Mw().optional(),lE=()=>Dw().optional(),dE={string:e=>ni.create({...e,coerce:!0}),number:e=>io.create({...e,coerce:!0}),boolean:e=>so.create({...e,coerce:!0}),bigint:e=>no.create({...e,coerce:!0}),date:e=>oo.create({...e,coerce:!0})},pE=Se,vt=Object.freeze({__proto__:null,defaultErrorMap:ii,setErrorMap:nI,getErrorMap:ou,makeIssue:uu,EMPTY_PATH:sI,addIssueToContext:pe,ParseStatus:It,INVALID:Se,DIRTY:ti,OK:Ct,isAborted:Hc,isDirty:Kc,isValid:Pa,isAsync:ao,get util(){return Ve},get objectUtil(){return Fc},ZodParsedType:ce,getParsedType:Mr,ZodType:Be,datetimeRegex:Sw,ZodString:ni,ZodNumber:io,ZodBigInt:no,ZodBoolean:so,ZodDate:oo,ZodSymbol:du,ZodUndefined:uo,ZodNull:lo,ZodAny:si,ZodUnknown:Da,ZodNever:Dr,ZodVoid:pu,ZodArray:Ua,ZodObject:jt,ZodUnion:po,ZodDiscriminatedUnion:Cw,ZodIntersection:co,ZodTuple:Fr,ZodRecord:zw,ZodMap:cu,ZodSet:hu,ZodFunction:Aw,ZodLazy:ho,ZodLiteral:fo,ZodEnum:xo,ZodNativeEnum:mo,ZodPromise:oi,ZodEffects:cr,ZodTransformer:cr,ZodOptional:vr,ZodNullable:Hr,ZodDefault:go,ZodCatch:yo,ZodNaN:fu,BRAND:II,ZodBranded:Rh,ZodPipeline:Bh,ZodReadonly:_o,custom:Bw,Schema:Be,ZodSchema:Be,late:EI,get ZodFirstPartyTypeKind(){return ke},coerce:dE,any:DI,array:VI,bigint:OI,boolean:Dw,date:RI,discriminatedUnion:GI,effect:Qf,enum:eE,function:XI,instanceof:zI,intersection:FI,lazy:JI,literal:YI,map:ZI,nan:AI,nativeEnum:tE,never:UI,null:MI,nullable:iE,number:Mw,object:qI,oboolean:lE,onumber:uE,optional:aE,ostring:oE,pipeline:sE,preprocess:nE,promise:rE,record:KI,set:QI,strictObject:jI,string:Nw,symbol:BI,transformer:Qf,tuple:HI,undefined:NI,union:LI,unknown:PI,void:WI,NEVER:pE,ZodIssueCode:ne,quotelessJson:iI,ZodError:pr}),Xf={name:"@imgly/background-removal",version:"1.7.0"},cE=vt.object({publicPath:vt.string().optional().describe("The public path to the wasm files and the onnx model.").default("https://staticimgly.com/@imgly/background-removal-data/${PACKAGE_VERSION}/dist/").transform(e=>e.replace("${PACKAGE_NAME}",Xf.name).replace("${PACKAGE_VERSION}",Xf.version)),debug:vt.boolean().default(!1).describe("Whether to enable debug logging."),rescale:vt.boolean().default(!0).describe("Whether to rescale the image."),device:vt.enum(["cpu","gpu"]).default("cpu").describe("The device to run the model on."),proxyToWorker:vt.boolean().default(!1).describe("Whether to proxy inference to a web worker."),fetchArgs:vt.any().default({}).describe("Arguments to pass to fetch when loading the model."),progress:vt.function().args(vt.string(),vt.number(),vt.number()).returns(vt.void()).describe("Progress callback.").optional(),model:vt.preprocess(e=>{switch(e){case"large":return"isnet";case"small":return"isnet_quint8";case"medium":return"isnet_fp16";default:return e}},vt.enum(["isnet","isnet_fp16","isnet_quint8"])).default("medium"),output:vt.object({format:vt.enum(["image/png","image/jpeg","image/webp","image/x-rgba8","image/x-alpha8"]).default("image/png"),quality:vt.number().default(.8)}).default({})}).default({}).transform(e=>(e.debug&&console.log("Config:",e),e.debug&&!e.progress&&(e.progress=e.progress??((t,r,a)=>{console.debug(`Downloading ${t}: ${r} of ${a}`)}),crossOriginIsolated||e.debug&&console.debug("Cross-Origin-Isolated is not enabled. Performance will be degraded. Please see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer.")),e));function Pw(e){return cE.parse(e??{})}var hE=Eu(zu());async function fE(e){e.debug&&console.debug("Loading model...",e.model);const t=e.model,a=await(await yw(`/models/${t}`,e)).arrayBuffer();return await rI(a,e)}async function mE(e){e=Pw(e);const t=await fE(e);return{config:e,session:{base:t}}}async function Nh(e,t,r){const[i,s,o]=e.shape,u=!1;let d=Gc(e,1024,1024,u);const p=JC(d);let f=await aI(r.base,[["input",p]],["output"],t),m=(0,hE.default)(f[0].data,[1024,1024,1]),g=YC(m);return t.rescale?(g=Gc(g,s,i,u),[g,e]):[g,d]}var Bu=FC(mE,e=>JSON.stringify(e));async function u4(e){await Bu(e)}async function l4(e,t){const{config:r,session:a}=await Bu(t);r.progress&&r.progress("compute:decode",0,4);const i=await ro(e,r);r.progress?.("compute:inference",1,4);const[s,o]=await Nh(i,r,a);r.progress?.("compute:mask",2,4);const u=o,[d,p]=u.shape,f=d*p;for(let g=0;g<f;g+=1)u.data[4*g+3]=s.data[g];r.progress?.("compute:encode",3,4);const m=await Ru(u,r.output.quality,r.output.format);return r.progress?.("compute:encode",4,4),m}async function d4(e,t){const{config:r,session:a}=await Bu(t),i=await ro(e,r),[s,o]=await Nh(i,r,a),u=o,[d,p,f]=u.shape,m=d*p;for(let _=0;_<m;_+=1)u.data[4*_+3]=255-s.data[_];return await Ru(u,r.output.quality,r.output.format)}var p4=gE;async function gE(e,t){const{config:r,session:a}=await Bu(t),i=await ro(e,r);let[s,o,u]=i.shape;const[d,p]=await Nh(i,r,a),f=o*s,m=i;for(let _=0;_<f;_+=1){const v=4*_;let w=d.data[_];m.data[v]=255,m.data[v+1]=255,m.data[v+2]=255,m.data[v+3]=w}return await Ru(m,r.output.quality,r.output.format)}async function c4(e,t,r){r=Pw(r);const a=await ro(e,r),[i,s,o]=a.shape,u=await ro(t,r),[d,p,f]=u.shape,m=d!==i||p!==s?Gc(u,s,i):u,g=s*i;for(let v=0;v<g;v+=1){const w=o*v,k=f*v;a.data[w+3]=m.data[k+3]}return await Ru(a,r.output.quality,r.output.format)}var Mh=Object.defineProperty,yE=Object.getOwnPropertyDescriptor,_E=Object.getOwnPropertyNames,vE=Object.prototype.hasOwnProperty,$E=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),ee=(e,t)=>()=>(e&&(t=e(e=0)),t),ko=(e,t)=>{for(var r in t)Mh(e,r,{get:t[r],enumerable:!0})},wE=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of _E(t))!vE.call(e,i)&&i!==r&&Mh(e,i,{get:()=>t[i],enumerable:!(a=yE(t,i))||a.enumerable});return e},mu=e=>wE(Mh({},"__esModule",{value:!0}),e),ks,Wr,Na,Jf,Uw,Ww=ee(()=>{ks=new Map,Wr=[],Na=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=ks.get(e);if(a===void 0)ks.set(e,{backend:t,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let i=Wr.indexOf(e);i!==-1&&Wr.splice(i,1);for(let s=0;s<Wr.length;s++)if(ks.get(Wr[s]).priority<=r){Wr.splice(s,0,e);return}Wr.push(e)}return}throw new TypeError("not a valid backend")},Jf=async e=>{let t=ks.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(a){return r||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Uw=async e=>{let t=e.executionProviders||[],r=t.map(d=>typeof d=="string"?d:d.name),a=r.length===0?Wr:r,i,s=[],o=new Set;for(let d of a){let p=await Jf(d);typeof p=="string"?s.push({name:d,err:p}):(i||(i=p),i===p&&o.add(d))}if(!i)throw new Error(`no available backend found. ERR: ${s.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:p}of s)r.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${p}`);let u=t.filter(d=>o.has(typeof d=="string"?d:d.name));return[i,new Proxy(e,{get:(d,p)=>p==="executionProviders"?u:Reflect.get(d,p)})]}}),bE=ee(()=>{Ww()}),Vw,xE=ee(()=>{Vw="1.21.0"}),ep,Ut,qw=ee(()=>{xE(),ep="warning",Ut={wasm:{},webgl:{},webgpu:{},versions:{common:Vw},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);ep=e}},get logLevel(){return ep}},Object.defineProperty(Ut,"logLevel",{enumerable:!0})}),Ke,kE=ee(()=>{qw(),Ke=Ut}),jw,Lw,SE=ee(()=>{jw=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let a=r.getContext("2d");if(a!=null){let i,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(i=e.dims[2],s=e.dims[3]):(i=e.dims[3],s=e.dims[2]);let o=t?.format!==void 0?t.format:"RGB",u=t?.norm,d,p;u===void 0||u.mean===void 0?d=[255,255,255,255]:typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:(d=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(d[3]=u.mean[3])),u===void 0||u.bias===void 0?p=[0,0,0,0]:typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:(p=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(p[3]=u.bias[3]));let f=s*i,m=0,g=f,_=f*2,v=-1;o==="RGBA"?(m=0,g=f,_=f*2,v=f*3):o==="RGB"?(m=0,g=f,_=f*2):o==="RBG"&&(m=0,_=f,g=f*2);for(let w=0;w<s;w++)for(let k=0;k<i;k++){let b=(e.data[m++]-p[0])*d[0],$=(e.data[g++]-p[1])*d[1],S=(e.data[_++]-p[2])*d[2],T=v===-1?255:(e.data[v++]-p[3])*d[3];a.fillStyle="rgba("+b+","+$+","+S+","+T+")",a.fillRect(k,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Lw=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(r!=null){let i,s,o;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(i=e.dims[2],s=e.dims[1],o=e.dims[3]):(i=e.dims[3],s=e.dims[2],o=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t?.norm,p,f;d===void 0||d.mean===void 0?p=[255,255,255,255]:typeof d.mean=="number"?p=[d.mean,d.mean,d.mean,d.mean]:(p=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(p[3]=d.mean[3])),d===void 0||d.bias===void 0?f=[0,0,0,0]:typeof d.bias=="number"?f=[d.bias,d.bias,d.bias,d.bias]:(f=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(f[3]=d.bias[3]));let m=s*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,v=1,w=2,k=3,b=0,$=m,S=m*2,T=-1;u==="RGBA"?(b=0,$=m,S=m*2,T=m*3):u==="RGB"?(b=0,$=m,S=m*2):u==="RBG"&&(b=0,S=m,$=m*2),a=r.createImageData(i,s);for(let I=0;I<s*i;_+=g,v+=g,w+=g,k+=g,I++)a.data[_]=(e.data[b++]-f[0])*p[0],a.data[v]=(e.data[$++]-f[1])*p[1],a.data[w]=(e.data[S++]-f[2])*p[2],a.data[k]=T===-1?255:(e.data[T++]-f[3])*p[3]}else throw new Error("Can not access image data");return a}}),To,Gw,Fw,Hw,Kw,Zw,TE=ee(()=>{Dh(),To=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=t,i=t.norm??{mean:255,bias:0},s,o;typeof i.mean=="number"?s=[i.mean,i.mean,i.mean,i.mean]:s=[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],typeof i.bias=="number"?o=[i.bias,i.bias,i.bias,i.bias]:o=[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*a,f=d==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),m=4,g=0,_=1,v=2,w=3,k=0,b=p,$=p*2,S=-1;u==="RGB"&&(m=3,g=0,_=1,v=2,w=-1),d==="RGBA"?S=p*3:d==="RBG"?(k=0,$=p,b=p*2):d==="BGR"&&($=0,b=p,k=p*2);for(let T=0;T<p;T++,g+=m,v+=m,_+=m,w+=m)f[k++]=(e[g]+o[0])/s[0],f[b++]=(e[_]+o[1])/s[1],f[$++]=(e[v]+o[2])/s[2],S!==-1&&w!==-1&&(f[S++]=(e[w]+o[3])/s[3]);return d==="RGBA"?new Rt("float32",f,[1,4,r,a]):new Rt("float32",f,[1,3,r,a])},Gw=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,i=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",o,u=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=f=>typeof HTMLCanvasElement<"u"&&f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(r){let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=_}else u.tensorFormat="RGBA",u.height=g,u.width=_;m.drawImage(e,0,0),o=m.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(a){let f,m;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(f=t.resizedHeight,m=t.resizedWidth):(f=e.height,m=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=f,u.width=m,t!==void 0){let g=d();g.width=m,g.height=f;let _=p(g);if(_!=null)_.putImageData(e,0,0),o=_.getImageData(0,0,m,f).data;else throw new Error("Can not access image data")}else o=e.data}else if(i){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,_=e.width;return m.drawImage(e,0,0,_,g),o=m.getImageData(0,0,_,g).data,u.height=g,u.width=_,To(o,u)}else throw new Error("Can not access image data")}else{if(s)return new Promise((f,m)=>{let g=d(),_=p(g);if(!e||!_)return m();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{g.width=v.width,g.height=v.height,_.drawImage(v,0,0,g.width,g.height);let w=_.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,f(To(w.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(o!==void 0)return To(o,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Fw=(e,t)=>{let{width:r,height:a,download:i,dispose:s}=t,o=[1,a,r,4];return new Rt({location:"texture",type:"float32",texture:e,dims:o,download:i,dispose:s})},Hw=(e,t)=>{let{dataType:r,dims:a,download:i,dispose:s}=t;return new Rt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:a,download:i,dispose:s})},Kw=(e,t)=>{let{dataType:r,dims:a,download:i,dispose:s}=t;return new Rt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:a,download:i,dispose:s})},Zw=(e,t,r)=>new Rt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Ea,Gs,tp,Qw,CE=ee(()=>{Ea=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Gs=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),tp=!1,Qw=()=>{if(!tp){tp=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,a=typeof r<"u"&&r.from;e&&(Ea.set("int64",BigInt64Array),Gs.set(BigInt64Array,"int64")),t&&(Ea.set("uint64",BigUint64Array),Gs.set(BigUint64Array,"uint64")),a?(Ea.set("float16",r),Gs.set(r,"float16")):Ea.set("float16",Uint16Array)}}}),Xw,Jw,IE=ee(()=>{Dh(),Xw=e=>{let t=1;for(let r=0;r<e.length;r++){let a=e[r];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);t*=a}return t},Jw=(e,t)=>{switch(e.location){case"cpu":return new Rt(e.type,e.data,t);case"cpu-pinned":return new Rt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Rt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Rt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Rt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Rt,Dh=ee(()=>{SE(),TE(),CE(),IE(),Rt=class{constructor(e,t,r){Qw();let a,i;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,i=e.dims,e.location){case"cpu-pinned":{let o=Ea.get(a);if(!o)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof o))throw new TypeError(`buffer should be of type ${o.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let o,u;if(typeof e=="string")if(a=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");o=t}else{let d=Ea.get(e);if(d===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&d===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${d.name} as data.`);e==="uint64"||e==="int64"?o=d.from(t,BigInt):o=d.from(t)}else if(t instanceof d)o=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")o=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&d!==Uint16Array)o=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${d}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let d=typeof e[0];if(d==="string")a="string",o=e;else if(d==="boolean")a="bool",o=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${d}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",o=Uint8Array.from(e);else{let d=Gs.get(e.constructor);if(d===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=d,o=e}if(u===void 0)u=[o.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");i=u,this.cpuData=o,this.dataLocation="cpu"}let s=Xw(i);if(this.cpuData&&s!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=i,this.size=s}static async fromImage(e,t){return Gw(e,t)}static fromTexture(e,t){return Fw(e,t)}static fromGpuBuffer(e,t){return Hw(e,t)}static fromMLTensor(e,t){return Kw(e,t)}static fromPinnedBuffer(e,t,r){return Zw(e,t,r)}toDataURL(e){return jw(this,e)}toImageData(e){return Lw(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Jw(this,e)}}}),lr,Yw=ee(()=>{Dh(),lr=Rt}),vo,rp,hr,Vt,eb=ee(()=>{qw(),vo=(e,t)=>{(typeof Ut.trace>"u"?!Ut.wasm.trace:!Ut.trace)||console.timeStamp(`${e}::ORT::${t}`)},rp=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],a=!1;for(let i=0;i<r.length;i++){if(a&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),vo("CPU",s);return}r[i].includes("TRACE_FUNC")&&(a=!0)}},hr=e=>{(typeof Ut.trace>"u"?!Ut.wasm.trace:!Ut.trace)||rp("BEGIN",e)},Vt=e=>{(typeof Ut.trace>"u"?!Ut.wasm.trace:!Ut.trace)||rp("END",e)}}),tb,EE=ee(()=>{Ww(),Yw(),eb(),tb=class rb{constructor(t){this.handler=t}async run(t,r,a){hr();let i={},s={};if(typeof t!="object"||t===null||t instanceof lr||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let o=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof lr)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");o=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);i[p]=null}if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,f=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(f.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof lr)&&(p=!0,o=!1,i[m]=g)}if(p){if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(o)for(let p of this.outputNames)i[p]=null;let u=await this.handler.run(t,i,s),d={};for(let p in u)if(Object.hasOwnProperty.call(u,p)){let f=u[p];f instanceof lr?d[p]=f:d[p]=new lr(f.type,f.data,f.dims)}return Vt(),d}async release(){return this.handler.dispose()}static async create(t,r,a,i){hr();let s,o={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let f=t,m=0,g=t.byteLength;if(typeof r=="object"&&r!==null)o=r;else if(typeof r=="number"){if(m=r,!Number.isSafeInteger(m))throw new RangeError("'byteOffset' must be an integer.");if(m<0||m>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(g=t.byteLength-m,typeof a=="number"){if(g=a,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||m+g>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-m}].`);if(typeof i=="object"&&i!==null)o=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(f,m,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,d]=await Uw(o),p=await u.createInferenceSessionHandler(s,d);return Vt(),new rb(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}}),Ph,zE=ee(()=>{EE(),Ph=tb}),AE=ee(()=>{}),OE=ee(()=>{}),RE=ee(()=>{}),BE=ee(()=>{}),ab={};ko(ab,{InferenceSession:()=>Ph,TRACE:()=>vo,TRACE_FUNC_BEGIN:()=>hr,TRACE_FUNC_END:()=>Vt,Tensor:()=>lr,env:()=>Ke,registerBackend:()=>Na});var mr=ee(()=>{bE(),kE(),zE(),Yw(),AE(),OE(),eb(),RE(),BE()}),Uh=ee(()=>{}),ib={};ko(ib,{default:()=>nb});var ap,ip,nb,NE=ee(()=>{ux(),Fa(),Wh(),ap="ort-wasm-proxy-worker",ip=globalThis.self?.name===ap,ip&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":Vh(r.wasm).then(()=>{sf(r).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})})},a=>{postMessage({type:t,err:a})});break;case"init-ep":{let{epName:a,env:i}=r;of(i,a).then(()=>{postMessage({type:t})},s=>{postMessage({type:t,err:s})});break}case"copy-from":{let{buffer:a}=r,i=wu(a);postMessage({type:t,out:i});break}case"create":{let{model:a,options:i}=r;uf(a,i).then(s=>{postMessage({type:t,out:s})},s=>{postMessage({type:t,err:s})});break}case"release":lf(r),postMessage({type:t});break;case"run":{let{sessionId:a,inputIndices:i,inputs:s,outputIndices:o,options:u}=r;df(a,i,s,o,new Array(o.length).fill(null),u).then(d=>{d.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:d},cf([...s,...d]))},d=>{postMessage({type:t,err:d})});break}case"end-profiling":pf(r),postMessage({type:t});break;default:}}catch(a){postMessage({type:t,err:a})}}),nb=ip?null:e=>new Worker(e??At,{type:"module",name:ap})}),sb={};ko(sb,{default:()=>ob});var np,sp,ob,Yf,ME=ee(()=>{sp=(np=import.meta.url,async function(e={}){var t,r,a=e,i=new Promise((n,l)=>{t=n,r=l}),s=typeof window=="object",o=typeof WorkerGlobalScope<"u",u=o&&self.name?.startsWith("em-pthread");a.mountExternalData=(n,l)=>{n.startsWith("./")&&(n=n.substring(2)),(a.Bd||(a.Bd=new Map)).set(n,l)},a.unmountExternalData=()=>{delete a.Bd};var d=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let p=()=>{let n=(c,h,y)=>(...x)=>{let C=at,z=h?.();x=c(...x);let O=h?.();return z!==O&&(c=O,y(z),h=y=null),at!=C?new Promise((D,q)=>{ha={resolve:D,reject:q}}):x},l=c=>async(...h)=>{try{if(a.Cd)throw Error("Session already started");let y=a.Cd={be:h[0],errors:[]},x=await c(...h);if(a.Cd!==y)throw Error("Session mismatch");a.Dd?.flush();let C=y.errors;if(0<C.length){let z=await Promise.all(C);if(z=z.filter(O=>O),0<z.length)throw Error(z.join(`
`))}return x}finally{a.Cd=null}};a._OrtCreateSession=n(a._OrtCreateSession,()=>a._OrtCreateSession,c=>a._OrtCreateSession=c),a._OrtRun=l(n(a._OrtRun,()=>a._OrtRun,c=>a._OrtRun=c)),a._OrtRunWithBinding=l(n(a._OrtRunWithBinding,()=>a._OrtRunWithBinding,c=>a._OrtRunWithBinding=c)),a._OrtBindInput=n(a._OrtBindInput,()=>a._OrtBindInput,c=>a._OrtBindInput=c),p=void 0};a.jsepInit=(n,l)=>{if(p?.(),n==="webgpu"){[a.Dd,a.Rd,a.Vd,a.Hd,a.Ud,a.hc,a.Wd,a.Zd,a.Sd,a.Td,a.Xd]=l;let c=a.Dd;a.jsepRegisterBuffer=(h,y,x,C)=>c.registerBuffer(h,y,x,C),a.jsepGetBuffer=h=>c.getBuffer(h),a.jsepCreateDownloader=(h,y,x)=>c.createDownloader(h,y,x),a.jsepOnCreateSession=h=>{c.onCreateSession(h)},a.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},a.jsepOnRunStart=h=>c.onRunStart(h),a.$d=(h,y)=>{c.upload(h,y)}}else if(n==="webnn"){[a.Dd,a.Yd,a.Id,a.jsepEnsureTensor,a.Jd,a.jsepDownloadTensor]=l,a.jsepReleaseTensorId=a.Id,a.jsepUploadTensor=a.Jd;let c=a.Dd;a.jsepOnRunStart=h=>c.onRunStart(h),a.jsepOnRunEnd=c.onRunEnd.bind(c),a.jsepRegisterMLContext=(h,y)=>{c.registerMLContext(h,y)},a.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},a.jsepCreateMLTensorDownloader=(h,y)=>c.createMLTensorDownloader(h,y),a.jsepRegisterMLTensor=(h,y,x,C)=>c.registerMLTensor(h,y,x,C),a.jsepCreateMLContext=h=>c.createMLContext(h),a.jsepRegisterMLConstant=(h,y,x,C,z)=>c.registerMLConstant(h,y,x,C,z,a.Bd),a.jsepRegisterGraphInput=c.registerGraphInput.bind(c),a.jsepIsGraphInput=c.isGraphInput.bind(c),a.jsepCreateTemporaryTensor=c.createTemporaryTensor.bind(c)}};var f,m,g=Object.assign({},a),_=(n,l)=>{throw l},v="";(s||o)&&(o?v=self.location.href:typeof document<"u"&&document.currentScript&&(v=document.currentScript.src),np&&(v=np),v=v.startsWith("blob:")?"":v.slice(0,v.replace(/[?#].*/,"").lastIndexOf("/")+1),o&&(m=n=>{var l=new XMLHttpRequest;return l.open("GET",n,!1),l.responseType="arraybuffer",l.send(null),new Uint8Array(l.response)}),f=async n=>{if(le(n))return new Promise((c,h)=>{var y=new XMLHttpRequest;y.open("GET",n,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?c(y.response):h(y.status)},y.onerror=h,y.send(null)});var l=await fetch(n,{credentials:"same-origin"});if(l.ok)return l.arrayBuffer();throw Error(l.status+" : "+l.url)});var w=console.log.bind(console),k=console.error.bind(console),b=w,$=k;Object.assign(a,g),g=null;var S,T,I,A,E,B,U,j,W,J,P,se,ue,F=a.wasmBinary,oe=!1,le=n=>n.startsWith("file://");function H(){return S.buffer!=A.buffer&&Me(),A}function de(){return S.buffer!=A.buffer&&Me(),E}function M(){return S.buffer!=A.buffer&&Me(),B}function V(){return S.buffer!=A.buffer&&Me(),U}function R(){return S.buffer!=A.buffer&&Me(),j}function X(){return S.buffer!=A.buffer&&Me(),W}function Ie(){return S.buffer!=A.buffer&&Me(),J}function Fe(){return S.buffer!=A.buffer&&Me(),ue}if(u){let n=function(l){try{var c=l.data,h=c.yd;if(h==="load"){let y=[];self.onmessage=x=>y.push(x),self.startWorker=()=>{postMessage({yd:"loaded"});for(let x of y)n(x);self.onmessage=n};for(let x of c.Od)a[x]&&!a[x].proxy||(a[x]=(...C)=>{postMessage({yd:"callHandler",Nd:x,args:C})},x=="print"&&(b=a[x]),x=="printErr"&&($=a[x]));S=c.he,Me(),Ne(c.ie)}else if(h==="run"){Du(c.xd),ya(c.xd,0,0,1,0,0),bi(),pa(c.xd),Ee||(yn(),Ee=!0);try{Pu(c.de,c.Fd)}catch(y){if(y!="unwind")throw y}}else c.target!=="setimmediate"&&(h==="checkMailbox"?Ee&&xr():h&&($(`worker: received unknown command ${h}`),$(c)))}catch(y){throw _n(),y}};var Ne,Ee=!1;$=function(...l){l=l.join(" "),console.error(l)},self.alert=function(...l){postMessage({yd:"alert",text:l.join(" "),fe:Ar()})},self.onunhandledrejection=l=>{throw l.reason||l},self.onmessage=n}function Me(){var n=S.buffer;a.HEAP8=A=new Int8Array(n),a.HEAP16=B=new Int16Array(n),a.HEAPU8=E=new Uint8Array(n),a.HEAPU16=U=new Uint16Array(n),a.HEAP32=j=new Int32Array(n),a.HEAPU32=W=new Uint32Array(n),a.HEAPF32=J=new Float32Array(n),a.HEAPF64=ue=new Float64Array(n),a.HEAP64=P=new BigInt64Array(n),a.HEAPU64=se=new BigUint64Array(n)}function wr(){u?startWorker(a):N.Bb()}u||(S=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Me());var Lt,Gt=0,Ft=null;function mi(){if(--Gt==0&&Ft){var n=Ft;Ft=null,n()}}function nt(n){throw $(n="Aborted("+n+")"),oe=!0,n=new WebAssembly.RuntimeError(n+". Build with -sASSERTIONS for more info."),r(n),n}function gi(){return{a:{Ta:Mu,Va:Nu,W:Uu,la:Wu,b:qu,u:ju,R:Lu,Za:Gu,d:Fu,pb:Ti,g:Vu,T:Ei,Ga:zi,lb:Oi,nb:Ri,Ha:Bi,Ea:Ni,wb:Mi,Da:Di,pa:Pi,mb:Ui,jb:Wi,Fa:Vi,kb:qi,Ma:Hu,za:Ku,eb:Zu,cb:Xu,ya:Yu,V:el,N:tl,db:rl,ma:ll,fb:dl,zb:pl,hb:cl,qb:hl,ab:fl,Aa:ml,yb:pa,Ja:gl,S:yl,Wa:_l,$:wl,G:bl,E:kl,m:ua,H:Sl,B:Il,X:El,J:zl,v:Al,O:Ol,D:Rl,t:Bl,A:Nl,z:Ml,w:Dl,r:Pl,tb:Ul,ub:Wl,vb:Vl,rb:rn,sb:an,bb:nn,Oa:jl,La:Gl,y:Fl,ja:Hl,Ba:Kl,Ka:Ll,qa:Zl,Ia:Ql,ib:Xl,U:ql,fa:Jl,Sa:Yl,gb:ed,Qa:td,Pa:rd,Ab:ln,Ca:dn,ob:ra,aa:pn,oa:cn,xb:hn,na:fn,$a:Ed,ia:qd,sa:Hd,ga:Cd,da:Nd,ua:Gd,p:Sd,e:ld,c:od,ea:Rd,f:dd,n:cd,k:wd,Y:fd,ka:bd,j:Td,wa:Od,Ra:Qd,ca:Wd,Ua:Zd,P:Bd,K:gd,_:Ud,Q:Id,Z:jd,x:md,l:ud,va:Pd,i:sd,h:hd,ra:Kd,ta:Fd,o:pd,q:yd,s:vd,I:$d,C:kd,L:xd,xa:Ad,_a:zd,F:Vd,Ya:Md,ba:Ld,M:_d,Xa:Dd,ha:id,a:S,Na:ta}}}var Jr={1319426:()=>typeof wasmOffsetConverter<"u",1319483:(n,l,c,h,y)=>{if(a===void 0||!a.Bd)return 1;if((n=Oe(Number(n>>>0))).startsWith("./")&&(n=n.substring(2)),!(n=a.Bd.get(n)))return 2;if(l=Number(l>>>0),c=Number(c>>>0),h=Number(h>>>0),l+c>n.byteLength)return 3;try{let x=n.subarray(l,l+c);switch(y){case 0:de().set(x,h>>>0);break;case 1:a.$d(h,x);break;default:return 4}return 0}catch{return 4}},1320198:(n,l,c)=>{a.Jd(n,de().subarray(l>>>0,l+c>>>0))},1320261:()=>a.Yd(),1320302:n=>{a.Id(n)},1320338:()=>{a.Sd()},1320369:()=>{a.Td()},1320398:()=>{a.Xd()},1320423:n=>a.Rd(n),1320456:n=>a.Vd(n),1320488:(n,l,c)=>{a.Hd(Number(n),Number(l),Number(c),!0)},1320551:(n,l,c)=>{a.Hd(Number(n),Number(l),Number(c))},1320608:n=>{a.hc("Abs",n,void 0)},1320659:n=>{a.hc("Neg",n,void 0)},1320710:n=>{a.hc("Floor",n,void 0)},1320763:n=>{a.hc("Ceil",n,void 0)},1320815:n=>{a.hc("Reciprocal",n,void 0)},1320873:n=>{a.hc("Sqrt",n,void 0)},1320925:n=>{a.hc("Exp",n,void 0)},1320976:n=>{a.hc("Erf",n,void 0)},1321027:n=>{a.hc("Sigmoid",n,void 0)},1321082:(n,l,c)=>{a.hc("HardSigmoid",n,{alpha:l,beta:c})},1321161:n=>{a.hc("Log",n,void 0)},1321212:n=>{a.hc("Sin",n,void 0)},1321263:n=>{a.hc("Cos",n,void 0)},1321314:n=>{a.hc("Tan",n,void 0)},1321365:n=>{a.hc("Asin",n,void 0)},1321417:n=>{a.hc("Acos",n,void 0)},1321469:n=>{a.hc("Atan",n,void 0)},1321521:n=>{a.hc("Sinh",n,void 0)},1321573:n=>{a.hc("Cosh",n,void 0)},1321625:n=>{a.hc("Asinh",n,void 0)},1321678:n=>{a.hc("Acosh",n,void 0)},1321731:n=>{a.hc("Atanh",n,void 0)},1321784:n=>{a.hc("Tanh",n,void 0)},1321836:n=>{a.hc("Not",n,void 0)},1321887:(n,l,c)=>{a.hc("Clip",n,{min:l,max:c})},1321956:n=>{a.hc("Clip",n,void 0)},1322008:(n,l)=>{a.hc("Elu",n,{alpha:l})},1322066:n=>{a.hc("Gelu",n,void 0)},1322118:n=>{a.hc("Relu",n,void 0)},1322170:(n,l)=>{a.hc("LeakyRelu",n,{alpha:l})},1322234:(n,l)=>{a.hc("ThresholdedRelu",n,{alpha:l})},1322304:(n,l)=>{a.hc("Cast",n,{to:l})},1322362:n=>{a.hc("Add",n,void 0)},1322413:n=>{a.hc("Sub",n,void 0)},1322464:n=>{a.hc("Mul",n,void 0)},1322515:n=>{a.hc("Div",n,void 0)},1322566:n=>{a.hc("Pow",n,void 0)},1322617:n=>{a.hc("Equal",n,void 0)},1322670:n=>{a.hc("Greater",n,void 0)},1322725:n=>{a.hc("GreaterOrEqual",n,void 0)},1322787:n=>{a.hc("Less",n,void 0)},1322839:n=>{a.hc("LessOrEqual",n,void 0)},1322898:(n,l,c,h,y)=>{a.hc("ReduceMean",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323073:(n,l,c,h,y)=>{a.hc("ReduceMax",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323247:(n,l,c,h,y)=>{a.hc("ReduceMin",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323421:(n,l,c,h,y)=>{a.hc("ReduceProd",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323596:(n,l,c,h,y)=>{a.hc("ReduceSum",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323770:(n,l,c,h,y)=>{a.hc("ReduceL1",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323943:(n,l,c,h,y)=>{a.hc("ReduceL2",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324116:(n,l,c,h,y)=>{a.hc("ReduceLogSum",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324293:(n,l,c,h,y)=>{a.hc("ReduceSumSquare",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324473:(n,l,c,h,y)=>{a.hc("ReduceLogSumExp",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324653:n=>{a.hc("Where",n,void 0)},1324706:(n,l,c)=>{a.hc("Transpose",n,{perm:l?Array.from(R().subarray(Number(l)>>>0,Number(c)>>>0)):[]})},1324830:(n,l,c,h)=>{a.hc("DepthToSpace",n,{blocksize:l,mode:Oe(c),format:h?"NHWC":"NCHW"})},1324963:(n,l,c,h)=>{a.hc("DepthToSpace",n,{blocksize:l,mode:Oe(c),format:h?"NHWC":"NCHW"})},1325096:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe)=>{a.hc("ConvTranspose",n,{format:O?"NHWC":"NCHW",autoPad:l,dilations:[c],group:h,kernelShape:[y],pads:[x,C],strides:[z],wIsConst:()=>!!H()[D>>>0],outputPadding:q?Array.from(R().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:ie?Array.from(R().subarray(Number(ie)>>>0,Number($e)>>>0)):[],activation:Oe(Xe)})},1325529:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("ConvTranspose",n,{format:z?"NHWC":"NCHW",autoPad:l,dilations:Array.from(R().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(R().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(R().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!H()[O>>>0],outputPadding:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],outputShape:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[],activation:Oe($e)})},1326190:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe)=>{a.hc("ConvTranspose",n,{format:O?"NHWC":"NCHW",autoPad:l,dilations:[c],group:h,kernelShape:[y],pads:[x,C],strides:[z],wIsConst:()=>!!H()[D>>>0],outputPadding:q?Array.from(R().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:ie?Array.from(R().subarray(Number(ie)>>>0,Number($e)>>>0)):[],activation:Oe(Xe)})},1326623:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("ConvTranspose",n,{format:z?"NHWC":"NCHW",autoPad:l,dilations:Array.from(R().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(R().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(R().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!H()[O>>>0],outputPadding:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],outputShape:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[],activation:Oe($e)})},1327284:(n,l)=>{a.hc("GlobalAveragePool",n,{format:l?"NHWC":"NCHW"})},1327375:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("AveragePool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1327854:(n,l)=>{a.hc("GlobalAveragePool",n,{format:l?"NHWC":"NCHW"})},1327945:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("AveragePool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1328424:(n,l)=>{a.hc("GlobalMaxPool",n,{format:l?"NHWC":"NCHW"})},1328511:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("MaxPool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1328986:(n,l)=>{a.hc("GlobalMaxPool",n,{format:l?"NHWC":"NCHW"})},1329073:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("MaxPool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1329548:(n,l,c,h,y)=>{a.hc("Gemm",n,{alpha:l,beta:c,transA:h,transB:y})},1329652:n=>{a.hc("MatMul",n,void 0)},1329706:(n,l,c,h)=>{a.hc("ArgMax",n,{keepDims:!!l,selectLastIndex:!!c,axis:h})},1329814:(n,l,c,h)=>{a.hc("ArgMin",n,{keepDims:!!l,selectLastIndex:!!c,axis:h})},1329922:(n,l)=>{a.hc("Softmax",n,{axis:l})},1329985:(n,l)=>{a.hc("Concat",n,{axis:l})},1330045:(n,l,c,h,y)=>{a.hc("Split",n,{axis:l,numOutputs:c,splitSizes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1330201:n=>{a.hc("Expand",n,void 0)},1330255:(n,l)=>{a.hc("Gather",n,{axis:Number(l)})},1330326:(n,l)=>{a.hc("GatherElements",n,{axis:Number(l)})},1330405:(n,l)=>{a.hc("GatherND",n,{batch_dims:Number(l)})},1330484:(n,l,c,h,y,x,C,z,O,D,q)=>{a.hc("Resize",n,{antialias:l,axes:c?Array.from(R().subarray(Number(c)>>>0,Number(h)>>>0)):[],coordinateTransformMode:Oe(y),cubicCoeffA:x,excludeOutside:C,extrapolationValue:z,keepAspectRatioPolicy:Oe(O),mode:Oe(D),nearestMode:Oe(q)})},1330846:(n,l,c,h,y,x,C)=>{a.hc("Slice",n,{starts:l?Array.from(R().subarray(Number(l)>>>0,Number(c)>>>0)):[],ends:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[],axes:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[]})},1331110:n=>{a.hc("Tile",n,void 0)},1331162:(n,l,c)=>{a.hc("InstanceNormalization",n,{epsilon:l,format:c?"NHWC":"NCHW"})},1331276:(n,l,c)=>{a.hc("InstanceNormalization",n,{epsilon:l,format:c?"NHWC":"NCHW"})},1331390:n=>{a.hc("Range",n,void 0)},1331443:(n,l)=>{a.hc("Einsum",n,{equation:Oe(l)})},1331524:(n,l,c,h,y)=>{a.hc("Pad",n,{mode:l,value:c,pads:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1331667:(n,l,c,h,y,x)=>{a.hc("BatchNormalization",n,{epsilon:l,momentum:c,spatial:!!y,trainingMode:!!h,format:x?"NHWC":"NCHW"})},1331836:(n,l,c,h,y,x)=>{a.hc("BatchNormalization",n,{epsilon:l,momentum:c,spatial:!!y,trainingMode:!!h,format:x?"NHWC":"NCHW"})},1332005:(n,l,c)=>{a.hc("CumSum",n,{exclusive:Number(l),reverse:Number(c)})},1332102:(n,l,c)=>{a.hc("DequantizeLinear",n,{axis:l,blockSize:c})},1332192:(n,l,c,h,y)=>{a.hc("GridSample",n,{align_corners:l,mode:Oe(c),padding_mode:Oe(h),format:y?"NHWC":"NCHW"})},1332362:(n,l,c,h,y)=>{a.hc("GridSample",n,{align_corners:l,mode:Oe(c),padding_mode:Oe(h),format:y?"NHWC":"NCHW"})},1332532:(n,l)=>{a.hc("ScatterND",n,{reduction:Oe(l)})},1332617:(n,l,c,h,y,x,C,z,O)=>{a.hc("Attention",n,{numHeads:l,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:x,qkvHiddenSizes:C?Array.from(R().subarray(Number(z)>>>0,Number(z)+C>>>0)):[],pastPresentShareBuffer:!!O})},1332889:n=>{a.hc("BiasAdd",n,void 0)},1332944:n=>{a.hc("BiasSplitGelu",n,void 0)},1333005:n=>{a.hc("FastGelu",n,void 0)},1333061:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe,Xt)=>{a.hc("Conv",n,{format:Q?"NHWC":"NCHW",auto_pad:l,dilations:c?Array.from(R().subarray(Number(c)>>>0,Number(h)>>>0)):[],group:y,kernel_shape:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],pads:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],strides:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],w_is_const:()=>!!H()[Number(ie)>>>0],activation:Oe($e),activation_params:Xe?Array.from(Ie().subarray(Number(Xe)>>>0,Number(Xt)>>>0)):[]})},1333645:n=>{a.hc("Gelu",n,void 0)},1333697:(n,l,c,h,y,x,C,z,O)=>{a.hc("GroupQueryAttention",n,{numHeads:l,kvNumHeads:c,scale:h,softcap:y,doRotary:x,rotaryInterleaved:C,smoothSoftmax:z,localWindowSize:O})},1333914:(n,l,c,h)=>{a.hc("LayerNormalization",n,{axis:l,epsilon:c,simplified:!!h})},1334025:(n,l,c,h)=>{a.hc("LayerNormalization",n,{axis:l,epsilon:c,simplified:!!h})},1334136:(n,l,c,h,y,x)=>{a.hc("MatMulNBits",n,{k:l,n:c,accuracyLevel:h,bits:y,blockSize:x})},1334263:(n,l,c,h,y,x)=>{a.hc("MultiHeadAttention",n,{numHeads:l,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:x})},1334422:(n,l)=>{a.hc("QuickGelu",n,{alpha:l})},1334486:(n,l,c,h,y)=>{a.hc("RotaryEmbedding",n,{interleaved:!!l,numHeads:c,rotaryEmbeddingDim:h,scale:y})},1334625:(n,l,c)=>{a.hc("SkipLayerNormalization",n,{epsilon:l,simplified:!!c})},1334727:(n,l,c)=>{a.hc("SkipLayerNormalization",n,{epsilon:l,simplified:!!c})},1334829:(n,l,c,h)=>{a.hc("GatherBlockQuantized",n,{gatherAxis:l,quantizeAxis:c,blockSize:h})},1334950:n=>{a.Wd(n)},1334984:(n,l)=>a.Zd(Number(n),Number(l),a.Cd.be,a.Cd.errors)};function Nu(n,l,c){return Qi(async()=>{await a.Ud(Number(n),Number(l),Number(c))})}function Mu(){return typeof wasmOffsetConverter<"u"}class Yr{name="ExitStatus";constructor(l){this.message=`Program terminated with exit(${l})`,this.status=l}}var yi=n=>{n.terminate(),n.onmessage=()=>{}},ea=[],_i=n=>{mt.length==0&&(ki(),xi(mt[0]));var l=mt.pop();if(!l)return 6;Ht.push(l),kt[n.xd]=l,l.xd=n.xd;var c={yd:"run",de:n.ce,Fd:n.Fd,xd:n.xd};return l.postMessage(c,n.Ld),0},ft=0,xe=(n,l,...c)=>{for(var h=2*c.length,y=re(),x=va(8*h),C=x>>>3,z=0;z<c.length;z++){var O=c[z];typeof O=="bigint"?(P[C+2*z]=1n,P[C+2*z+1]=O):(P[C+2*z]=0n,Fe()[C+2*z+1>>>0]=O)}return n=vn(n,0,h,x,l),Y(y),n};function ta(n){if(u)return xe(0,1,n);if(I=n,!(0<ft)){for(var l of Ht)yi(l);for(l of mt)yi(l);mt=[],Ht=[],kt={},oe=!0}_(0,new Yr(n))}function vi(n){if(u)return xe(1,0,n);ra(n)}var ra=n=>{if(I=n,u)throw vi(n),"unwind";ta(n)},mt=[],Ht=[],$i=[],kt={},wi=n=>{var l=n.xd;delete kt[l],mt.push(n),Ht.splice(Ht.indexOf(n),1),n.xd=0,$n(l)};function bi(){$i.forEach(n=>n())}var xi=n=>new Promise(l=>{n.onmessage=y=>{var x=(y=y.data).yd;if(y.Ed&&y.Ed!=Ar()){var C=kt[y.Ed];C?C.postMessage(y,y.Ld):$(`Internal error! Worker sent a message "${x}" to target pthread ${y.Ed}, but that thread no longer exists!`)}else x==="checkMailbox"?xr():x==="spawnThread"?_i(y):x==="cleanupThread"?wi(kt[y.ee]):x==="loaded"?(n.loaded=!0,l(n)):x==="alert"?alert(`Thread ${y.fe}: ${y.text}`):y.target==="setimmediate"?n.postMessage(y):x==="callHandler"?a[y.Nd](...y.args):x&&$(`worker sent an unknown command ${x}`)},n.onerror=y=>{throw $(`worker sent an error! ${y.filename}:${y.lineno}: ${y.message}`),y};var c,h=[];for(c of[])a.propertyIsEnumerable(c)&&h.push(c);n.postMessage({yd:"load",Od:h,he:S,ie:T})});function ki(){var n=new Worker(import.meta.url.startsWith("file:")?new URL("/assets/ort.webgpu.bundle.min-CEayb2S6.mjs",import.meta.url):new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});mt.push(n)}var Du=n=>{Me();var l=X()[n+52>>>2>>>0];n=X()[n+56>>>2>>>0],xn(l,l-n),Y(l)},Pu=(n,l)=>{ft=0,n=$a(n,l),0<ft?I=n:_a(n)},br=[];function Uu(n){var l=new aa(n>>>=0);if(H()[l.wd+12>>>0]==0){var c=1;H()[l.wd+12>>>0]=c}return c=0,H()[l.wd+13>>>0]=c,br.push(l),Sn(n),Cn(n)}var Et=0,Wu=()=>{ae(0,0);var n=br.pop();kn(n.Gd),Et=0};class aa{constructor(l){this.Gd=l,this.wd=l-24}}function Vu(n){throw Et||=n>>>0,Et}var ia=n=>{var l=Et;if(!l)return Qt(0),0;var c=new aa(l);X()[c.wd+16>>>2>>>0]=l;var h=X()[c.wd+4>>>2>>>0];if(!h)return Qt(0),l;for(var y of n){if(y===0||y===h)break;if(Tn(y,h,c.wd+16))return Qt(y),l}return Qt(h),l};function qu(){return ia([])}function ju(n){return ia([n>>>0])}function Lu(n,l){return ia([n>>>0,l>>>0])}var Gu=()=>{var n=br.pop();n||nt("no exception to throw");var l=n.Gd;if(H()[n.wd+13>>>0]==0){br.push(n);var c=1;H()[n.wd+13>>>0]=c,c=0,H()[n.wd+12>>>0]=c}throw Et=l};function Fu(n,l,c){var h=new aa(n>>>=0);throw l>>>=0,c>>>=0,X()[h.wd+16>>>2>>>0]=0,X()[h.wd+4>>>2>>>0]=l,X()[h.wd+8>>>2>>>0]=c,Et=n}function Si(n,l,c,h){return u?xe(2,1,n,l,c,h):Ti(n,l,c,h)}function Ti(n,l,c,h){if(n>>>=0,c>>>=0,h>>>=0,d===void 0)return 6;var y=[];return u&&y.length===0?Si(n,l>>>=0,c,h):(n={ce:c,xd:n,Fd:h,Ld:y},u?(n.yd="spawnThread",postMessage(n,y),0):_i(n))}var Ci=typeof TextDecoder<"u"?new TextDecoder:void 0,Ii=(n,l=0,c=NaN)=>{var h=(l>>>=0)+c;for(c=l;n[c]&&!(c>=h);)++c;if(16<c-l&&n.buffer&&Ci)return Ci.decode(n.buffer instanceof ArrayBuffer?n.subarray(l,c):n.slice(l,c));for(h="";l<c;){var y=n[l++];if(128&y){var x=63&n[l++];if((224&y)==192)h+=String.fromCharCode((31&y)<<6|x);else{var C=63&n[l++];65536>(y=(240&y)==224?(15&y)<<12|x<<6|C:(7&y)<<18|x<<12|C<<6|63&n[l++])?h+=String.fromCharCode(y):(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y))}}else h+=String.fromCharCode(y)}return h},Oe=(n,l)=>(n>>>=0)?Ii(de(),n,l):"";function Ei(n,l,c){return u?xe(3,1,n,l,c):0}function zi(n,l){if(u)return xe(4,1,n,l)}var Ai=n=>{for(var l=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);127>=h?l++:2047>=h?l+=2:55296<=h&&57343>=h?(l+=4,++c):l+=3}return l},zt=(n,l,c)=>{var h=de();if(l>>>=0,0<c){var y=l;c=l+c-1;for(var x=0;x<n.length;++x){var C=n.charCodeAt(x);if(55296<=C&&57343>=C&&(C=65536+((1023&C)<<10)|1023&n.charCodeAt(++x)),127>=C){if(l>=c)break;h[l++>>>0]=C}else{if(2047>=C){if(l+1>=c)break;h[l++>>>0]=192|C>>6}else{if(65535>=C){if(l+2>=c)break;h[l++>>>0]=224|C>>12}else{if(l+3>=c)break;h[l++>>>0]=240|C>>18,h[l++>>>0]=128|C>>12&63}h[l++>>>0]=128|C>>6&63}h[l++>>>0]=128|63&C}}h[l>>>0]=0,n=l-y}else n=0;return n};function Oi(n,l){if(u)return xe(5,1,n,l)}function Ri(n,l,c){if(u)return xe(6,1,n,l,c)}function Bi(n,l,c){return u?xe(7,1,n,l,c):0}function Ni(n,l){if(u)return xe(8,1,n,l)}function Mi(n,l,c){if(u)return xe(9,1,n,l,c)}function Di(n,l,c,h){if(u)return xe(10,1,n,l,c,h)}function Pi(n,l,c,h){if(u)return xe(11,1,n,l,c,h)}function Ui(n,l,c,h){if(u)return xe(12,1,n,l,c,h)}function Wi(n){if(u)return xe(13,1,n)}function Vi(n,l){if(u)return xe(14,1,n,l)}function qi(n,l,c){if(u)return xe(15,1,n,l,c)}var ji,gt,Hu=()=>nt(""),rt=n=>{for(var l="";de()[n>>>0];)l+=ji[de()[n++>>>0]];return l},na={},sa={};function st(n,l,c={}){return(function(h,y,x={}){var C=y.name;if(!h)throw new gt(`type "${C}" must have a positive integer typeid pointer`);if(sa.hasOwnProperty(h)){if(x.Pd)return;throw new gt(`Cannot register type '${C}' twice`)}sa[h]=y,na.hasOwnProperty(h)&&(y=na[h],delete na[h],y.forEach(z=>z()))})(n,l,c)}var Li=(n,l,c)=>{switch(l){case 1:return c?h=>H()[h>>>0]:h=>de()[h>>>0];case 2:return c?h=>M()[h>>>1>>>0]:h=>V()[h>>>1>>>0];case 4:return c?h=>R()[h>>>2>>>0]:h=>X()[h>>>2>>>0];case 8:return c?h=>P[h>>>3]:h=>se[h>>>3];default:throw new TypeError(`invalid integer width (${l}): ${n}`)}};function Ku(n,l,c){c>>>=0,st(n>>>=0,{name:l=rt(l>>>0),fromWireType:h=>h,toWireType:function(h,y){if(typeof y!="bigint"&&typeof y!="number")throw y=y===null?"null":(h=typeof y)=="object"||h==="array"||h==="function"?y.toString():""+y,new TypeError(`Cannot convert "${y}" to ${this.name}`);return typeof y=="number"&&(y=BigInt(y)),y},zd:yt,readValueFromPointer:Li(l,c,l.indexOf("u")==-1),Ad:null})}var yt=8;function Zu(n,l,c,h){st(n>>>=0,{name:l=rt(l>>>0),fromWireType:function(y){return!!y},toWireType:function(y,x){return x?c:h},zd:yt,readValueFromPointer:function(y){return this.fromWireType(de()[y>>>0])},Ad:null})}var oa=[],ot=[];function ua(n){9<(n>>>=0)&&--ot[n+1]==0&&(ot[n]=void 0,oa.push(n))}var He=n=>{if(!n)throw new gt("Cannot use deleted val. handle = "+n);return ot[n]},Qe=n=>{switch(n){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let l=oa.pop()||ot.length;return ot[l]=n,ot[l+1]=1,l}};function la(n){return this.fromWireType(X()[n>>>2>>>0])}var Qu={name:"emscripten::val",fromWireType:n=>{var l=He(n);return ua(n),l},toWireType:(n,l)=>Qe(l),zd:yt,readValueFromPointer:la,Ad:null};function Xu(n){return st(n>>>0,Qu)}var Ju=(n,l)=>{switch(l){case 4:return function(c){return this.fromWireType(Ie()[c>>>2>>>0])};case 8:return function(c){return this.fromWireType(Fe()[c>>>3>>>0])};default:throw new TypeError(`invalid float width (${l}): ${n}`)}};function Yu(n,l,c){c>>>=0,st(n>>>=0,{name:l=rt(l>>>0),fromWireType:h=>h,toWireType:(h,y)=>y,zd:yt,readValueFromPointer:Ju(l,c),Ad:null})}function el(n,l,c,h,y){if(n>>>=0,c>>>=0,l=rt(l>>>0),y===-1&&(y=4294967295),y=z=>z,h===0){var x=32-8*c;y=z=>z<<x>>>x}var C=l.includes("unsigned")?function(z,O){return O>>>0}:function(z,O){return O};st(n,{name:l,fromWireType:y,toWireType:C,zd:yt,readValueFromPointer:Li(l,c,h!==0),Ad:null})}function tl(n,l,c){function h(x){var C=X()[x>>>2>>>0];return x=X()[x+4>>>2>>>0],new y(H().buffer,x,C)}var y=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][l];st(n>>>=0,{name:c=rt(c>>>0),fromWireType:h,zd:yt,readValueFromPointer:h},{Pd:!0})}function rl(n,l){st(n>>>=0,{name:l=rt(l>>>0),fromWireType:function(c){for(var h,y=X()[c>>>2>>>0],x=c+4,C=x,z=0;z<=y;++z){var O=x+z;z!=y&&de()[O>>>0]!=0||(C=Oe(C,O-C),h===void 0?h=C:(h+="\0",h+=C),C=O+1)}return it(c),h},toWireType:function(c,h){h instanceof ArrayBuffer&&(h=new Uint8Array(h));var y=typeof h=="string";if(!(y||h instanceof Uint8Array||h instanceof Uint8ClampedArray||h instanceof Int8Array))throw new gt("Cannot pass non-string to std::string");var x=y?Ai(h):h.length,C=Or(4+x+1),z=C+4;if(X()[C>>>2>>>0]=x,y)zt(h,z,x+1);else if(y)for(y=0;y<x;++y){var O=h.charCodeAt(y);if(255<O)throw it(C),new gt("String has UTF-16 code units that do not fit in 8 bits");de()[z+y>>>0]=O}else for(y=0;y<x;++y)de()[z+y>>>0]=h[y];return c!==null&&c.push(it,C),C},zd:yt,readValueFromPointer:la,Ad(c){it(c)}})}var Gi=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,al=(n,l)=>{for(var c=n>>1,h=c+l/2;!(c>=h)&&V()[c>>>0];)++c;if(32<(c<<=1)-n&&Gi)return Gi.decode(de().slice(n,c));for(c="",h=0;!(h>=l/2);++h){var y=M()[n+2*h>>>1>>>0];if(y==0)break;c+=String.fromCharCode(y)}return c},il=(n,l,c)=>{if(c??=2147483647,2>c)return 0;var h=l;c=(c-=2)<2*n.length?c/2:n.length;for(var y=0;y<c;++y){var x=n.charCodeAt(y);M()[l>>>1>>>0]=x,l+=2}return M()[l>>>1>>>0]=0,l-h},nl=n=>2*n.length,sl=(n,l)=>{for(var c=0,h="";!(c>=l/4);){var y=R()[n+4*c>>>2>>>0];if(y==0)break;++c,65536<=y?(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y)):h+=String.fromCharCode(y)}return h},ol=(n,l,c)=>{if(l>>>=0,c??=2147483647,4>c)return 0;var h=l;c=h+c-4;for(var y=0;y<n.length;++y){var x=n.charCodeAt(y);if(55296<=x&&57343>=x&&(x=65536+((1023&x)<<10)|1023&n.charCodeAt(++y)),R()[l>>>2>>>0]=x,(l+=4)+4>c)break}return R()[l>>>2>>>0]=0,l-h},ul=n=>{for(var l=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);55296<=h&&57343>=h&&++c,l+=4}return l};function ll(n,l,c){if(n>>>=0,l>>>=0,c=rt(c>>>=0),l===2)var h=al,y=il,x=nl,C=z=>V()[z>>>1>>>0];else l===4&&(h=sl,y=ol,x=ul,C=z=>X()[z>>>2>>>0]);st(n,{name:c,fromWireType:z=>{for(var O,D=X()[z>>>2>>>0],q=z+4,Q=0;Q<=D;++Q){var ie=z+4+Q*l;Q!=D&&C(ie)!=0||(q=h(q,ie-q),O===void 0?O=q:(O+="\0",O+=q),q=ie+l)}return it(z),O},toWireType:(z,O)=>{if(typeof O!="string")throw new gt(`Cannot pass non-string to C++ string type ${c}`);var D=x(O),q=Or(4+D+l);return X()[q>>>2>>>0]=D/l,y(O,q+4,D+l),z!==null&&z.push(it,q),q},zd:yt,readValueFromPointer:la,Ad(z){it(z)}})}function dl(n,l){st(n>>>=0,{Qd:!0,name:l=rt(l>>>0),zd:0,fromWireType:()=>{},toWireType:()=>{}})}function pl(n){ya(n>>>0,!o,1,!s,131072,!1),bi()}var da=n=>{if(!oe)try{if(n(),!(0<ft))try{u?_a(I):ra(I)}catch(l){l instanceof Yr||l=="unwind"||_(0,l)}}catch(l){l instanceof Yr||l=="unwind"||_(0,l)}};function pa(n){n>>>=0,typeof Atomics.ge=="function"&&(Atomics.ge(R(),n>>>2,n).value.then(xr),n+=128,Atomics.store(R(),n>>>2,1))}var xr=()=>{var n=Ar();n&&(pa(n),da(bn))};function cl(n,l){(n>>>=0)==l>>>0?setTimeout(xr):u?postMessage({Ed:n,yd:"checkMailbox"}):(n=kt[n])&&n.postMessage({yd:"checkMailbox"})}var ca=[];function hl(n,l,c,h,y){for(l>>>=0,h/=2,ca.length=h,c=y>>>0>>>3,y=0;y<h;y++)ca[y]=P[c+2*y]?P[c+2*y+1]:Fe()[c+2*y+1>>>0];return(l?Jr[l]:nd[n])(...ca)}var fl=()=>{ft=0};function ml(n){n>>>=0,u?postMessage({yd:"cleanupThread",ee:n}):wi(kt[n])}function gl(n){}var kr=(n,l)=>{var c=sa[n];if(c===void 0)throw n=gn(n),c=rt(n),it(n),new gt(`${l} has unknown type ${c}`);return c},Fi=(n,l,c)=>{var h=[];return n=n.toWireType(h,c),h.length&&(X()[l>>>2>>>0]=Qe(h)),n};function yl(n,l,c){return l>>>=0,c>>>=0,n=He(n>>>0),l=kr(l,"emval::as"),Fi(l,c,n)}function _l(n,l){return l>>>=0,n=He(n>>>0),(l=kr(l,"emval::as")).toWireType(null,n)}var Sr=n=>{try{n()}catch(l){nt(l)}},_t=0,at=null,Hi=0,Tr=[],Ki={},Zi={},vl=0,ha=null,$l=[];function Qi(n){return(function(l){if(!oe){if(_t===0){var c=!1,h=!1;l((y=0)=>{if(!oe&&(Hi=y,c=!0,h)){_t=2,Sr(()=>$s(at)),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.resume(),y=!1;try{var x=(function(){var O=R()[at+8>>>2>>>0];return O=N[Zi[O]],--ft,O()})()}catch(O){x=O,y=!0}var C=!1;if(!at){var z=ha;z&&(ha=null,(y?z.reject:z.resolve)(x),C=!0)}if(y&&!C)throw x}}),h=!0,c||(_t=1,at=(function(){var y=Or(65548),x=y+12;X()[y>>>2>>>0]=x,X()[y+4>>>2>>>0]=x+65536,x=Tr[0];var C=Ki[x];return C===void 0&&(C=vl++,Ki[x]=C,Zi[C]=x),x=C,R()[y+8>>>2>>>0]=x,y})(),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.pause(),Sr(()=>_s(at)))}else _t===2?(_t=0,Sr(ws),it(at),at=null,$l.forEach(da)):nt(`invalid state: ${_t}`);return Hi}})(l=>{n().then(l)})}function wl(n){return n>>>=0,Qi(async()=>{var l=await He(n);return Qe(l)})}var Cr=[];function bl(n,l,c,h){return c>>>=0,h>>>=0,(n=Cr[n>>>0])(null,l=He(l>>>0),c,h)}var xl={},Ir=n=>{var l=xl[n];return l===void 0?rt(n):l};function kl(n,l,c,h,y){return c>>>=0,h>>>=0,y>>>=0,(n=Cr[n>>>0])(l=He(l>>>0),l[c=Ir(c)],h,y)}var Xi=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Sl(n){return(n>>>=0)==0?Qe(Xi()):(n=Ir(n),Qe(Xi()[n]))}var Tl=n=>{var l=Cr.length;return Cr.push(n),l},Cl=(n,l)=>{for(var c=Array(n),h=0;h<n;++h)c[h]=kr(X()[l+4*h>>>2>>>0],"parameter "+h);return c},Ji=(n,l)=>Object.defineProperty(l,"name",{value:n});function Il(n,l,c){var h=(l=Cl(n,l>>>0)).shift();n--;var y=`return function (obj, func, destructorsRef, args) {
`,x=0,C=[];c===0&&C.push("obj");for(var z=["retType"],O=[h],D=0;D<n;++D)C.push("arg"+D),z.push("argType"+D),O.push(l[D]),y+=`  var arg${D} = argType${D}.readValueFromPointer(args${x?"+"+x:""});
`,x+=l[D].zd;return y+=`  var rv = ${c===1?"new func":"func.call"}(${C.join(", ")});
`,h.Qd||(z.push("emval_returnValue"),O.push(Fi),y+=`  return emval_returnValue(retType, destructorsRef, rv);
`),z.push(y+`};
`),n=(function(q){var Q=Function;if(!(Q instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof Q} which is not a function`);var ie=Ji(Q.name||"unknownFunctionName",function(){});return ie.prototype=Q.prototype,ie=new ie,(q=Q.apply(ie,q))instanceof Object?q:ie})(z)(...O),c=`methodCaller<(${l.map(q=>q.name).join(", ")}) => ${h.name}>`,Tl(Ji(c,n))}function El(n){return n=Ir(n>>>0),Qe(a[n])}function zl(n,l){return l>>>=0,n=He(n>>>0),l=He(l),Qe(n[l])}function Al(n){9<(n>>>=0)&&(ot[n+1]+=1)}function Ol(){return Qe([])}function Rl(n){n=He(n>>>0);for(var l=Array(n.length),c=0;c<n.length;c++)l[c]=n[c];return Qe(l)}function Bl(n){return Qe(Ir(n>>>0))}function Nl(){return Qe({})}function Ml(n){for(var l=He(n>>>=0);l.length;){var c=l.pop();l.pop()(c)}ua(n)}function Dl(n,l,c){l>>>=0,c>>>=0,n=He(n>>>0),l=He(l),c=He(c),n[l]=c}function Pl(n,l){return l>>>=0,n=(n=kr(n>>>0,"_emval_take_value")).readValueFromPointer(l),Qe(n)}function Ul(n,l){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),l>>>=0,n=new Date(1e3*n),R()[l>>>2>>>0]=n.getUTCSeconds(),R()[l+4>>>2>>>0]=n.getUTCMinutes(),R()[l+8>>>2>>>0]=n.getUTCHours(),R()[l+12>>>2>>>0]=n.getUTCDate(),R()[l+16>>>2>>>0]=n.getUTCMonth(),R()[l+20>>>2>>>0]=n.getUTCFullYear()-1900,R()[l+24>>>2>>>0]=n.getUTCDay(),n=(n.getTime()-Date.UTC(n.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,R()[l+28>>>2>>>0]=n}var Yi=n=>n%4==0&&(n%100!=0||n%400==0),en=[0,31,60,91,121,152,182,213,244,274,305,335],tn=[0,31,59,90,120,151,181,212,243,273,304,334];function Wl(n,l){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),l>>>=0,n=new Date(1e3*n),R()[l>>>2>>>0]=n.getSeconds(),R()[l+4>>>2>>>0]=n.getMinutes(),R()[l+8>>>2>>>0]=n.getHours(),R()[l+12>>>2>>>0]=n.getDate(),R()[l+16>>>2>>>0]=n.getMonth(),R()[l+20>>>2>>>0]=n.getFullYear()-1900,R()[l+24>>>2>>>0]=n.getDay();var c=(Yi(n.getFullYear())?en:tn)[n.getMonth()]+n.getDate()-1|0;R()[l+28>>>2>>>0]=c,R()[l+36>>>2>>>0]=-60*n.getTimezoneOffset(),c=new Date(n.getFullYear(),6,1).getTimezoneOffset();var h=new Date(n.getFullYear(),0,1).getTimezoneOffset();n=0|(c!=h&&n.getTimezoneOffset()==Math.min(h,c)),R()[l+32>>>2>>>0]=n}function Vl(n){n>>>=0;var l=new Date(R()[n+20>>>2>>>0]+1900,R()[n+16>>>2>>>0],R()[n+12>>>2>>>0],R()[n+8>>>2>>>0],R()[n+4>>>2>>>0],R()[n>>>2>>>0],0),c=R()[n+32>>>2>>>0],h=l.getTimezoneOffset(),y=new Date(l.getFullYear(),6,1).getTimezoneOffset(),x=new Date(l.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(x,y);return 0>c?R()[n+32>>>2>>>0]=+(y!=x&&C==h):0<c!=(C==h)&&(y=Math.max(x,y),l.setTime(l.getTime()+6e4*((0<c?C:y)-h))),R()[n+24>>>2>>>0]=l.getDay(),c=(Yi(l.getFullYear())?en:tn)[l.getMonth()]+l.getDate()-1|0,R()[n+28>>>2>>>0]=c,R()[n>>>2>>>0]=l.getSeconds(),R()[n+4>>>2>>>0]=l.getMinutes(),R()[n+8>>>2>>>0]=l.getHours(),R()[n+12>>>2>>>0]=l.getDate(),R()[n+16>>>2>>>0]=l.getMonth(),R()[n+20>>>2>>>0]=l.getYear(),n=l.getTime(),BigInt(isNaN(n)?-1:n/1e3)}function rn(n,l,c,h,y,x,C){return u?xe(16,1,n,l,c,h,y,x,C):-52}function an(n,l,c,h,y,x){if(u)return xe(17,1,n,l,c,h,y,x)}var Kt={},ql=()=>performance.timeOrigin+performance.now();function nn(n,l){if(u)return xe(18,1,n,l);if(Kt[n]&&(clearTimeout(Kt[n].id),delete Kt[n]),!l)return 0;var c=setTimeout(()=>{delete Kt[n],da(()=>wn(n,performance.timeOrigin+performance.now()))},l);return Kt[n]={id:c,ke:l},0}function jl(n,l,c,h){n>>>=0,l>>>=0,c>>>=0,h>>>=0;var y=new Date().getFullYear(),x=new Date(y,0,1).getTimezoneOffset();y=new Date(y,6,1).getTimezoneOffset();var C=Math.max(x,y);X()[n>>>2>>>0]=60*C,R()[l>>>2>>>0]=+(x!=y),n=(l=z=>{var O=Math.abs(z);return`UTC${0<=z?"-":"+"}${String(Math.floor(O/60)).padStart(2,"0")}${String(O%60).padStart(2,"0")}`})(x),l=l(y),y<x?(zt(n,c,17),zt(l,h,17)):(zt(n,h,17),zt(l,c,17))}var Ll=()=>Date.now();function Gl(n,l,c){return 0<=n&&3>=n?(n===0?n=Date.now():n=performance.timeOrigin+performance.now(),P[c>>>0>>>3]=BigInt(Math.round(1e6*n)),0):28}var fa=[],sn=(n,l)=>{fa.length=0;for(var c;c=de()[n++>>>0];){var h=c!=105;l+=(h&=c!=112)&&l%8?4:0,fa.push(c==112?X()[l>>>2>>>0]:c==106?P[l>>>3]:c==105?R()[l>>>2>>>0]:Fe()[l>>>3>>>0]),l+=h?8:4}return fa};function Fl(n,l,c){return n>>>=0,l=sn(l>>>0,c>>>0),Jr[n](...l)}function Hl(n,l,c){return n>>>=0,l=sn(l>>>0,c>>>0),Jr[n](...l)}var Kl=()=>{};function Zl(n,l){return $(Oe(n>>>0,l>>>0))}var Ql=()=>{throw ft+=1,"unwind"};function Xl(){return 4294901760}var Jl=()=>navigator.hardwareConcurrency;function Yl(){return nt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function ed(n){n>>>=0;var l=de().length;if(n<=l||4294901760<n)return!1;for(var c=1;4>=c;c*=2){var h=l*(1+.2/c);h=Math.min(h,n+100663296);e:{h=(Math.min(4294901760,65536*Math.ceil(Math.max(n,h)/65536))-S.buffer.byteLength+65535)/65536|0;try{S.grow(h),Me();var y=1;break e}catch{}y=void 0}if(y)return!0}return!1}var Er=()=>(nt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Zt={},on=n=>{n.forEach(l=>{Er()})};function td(){var n=Error().stack.toString().split(`
`);return n[0]=="Error"&&n.shift(),on(n),Zt.Kd=Er(),Zt.ae=n,Zt.Kd}function rd(n,l,c){if(n>>>=0,l>>>=0,Zt.Kd==n)var h=Zt.ae;else(h=Error().stack.toString().split(`
`))[0]=="Error"&&h.shift(),on(h);for(var y=3;h[y]&&Er()!=n;)++y;for(n=0;n<c&&h[n+y];++n)R()[l+4*n>>>2>>>0]=Er();return n}var ma,ga={},un=()=>{if(!ma){var n,l={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(n in ga)ga[n]===void 0?delete l[n]:l[n]=ga[n];var c=[];for(n in l)c.push(`${n}=${l[n]}`);ma=c}return ma};function ln(n,l){if(u)return xe(19,1,n,l);n>>>=0,l>>>=0;var c=0;return un().forEach((h,y)=>{var x=l+c;for(y=X()[n+4*y>>>2>>>0]=x,x=0;x<h.length;++x)H()[y++>>>0]=h.charCodeAt(x);H()[y>>>0]=0,c+=h.length+1}),0}function dn(n,l){if(u)return xe(20,1,n,l);n>>>=0,l>>>=0;var c=un();X()[n>>>2>>>0]=c.length;var h=0;return c.forEach(y=>h+=y.length+1),X()[l>>>2>>>0]=h,0}function pn(n){return u?xe(21,1,n):52}function cn(n,l,c,h){return u?xe(22,1,n,l,c,h):52}function hn(n,l,c,h){return u?xe(23,1,n,l,c,h):70}var ad=[null,[],[]];function fn(n,l,c,h){if(u)return xe(24,1,n,l,c,h);l>>>=0,c>>>=0,h>>>=0;for(var y=0,x=0;x<c;x++){var C=X()[l>>>2>>>0],z=X()[l+4>>>2>>>0];l+=8;for(var O=0;O<z;O++){var D=de()[C+O>>>0],q=ad[n];D===0||D===10?((n===1?b:$)(Ii(q)),q.length=0):q.push(D)}y+=z}return X()[h>>>2>>>0]=y,0}function id(n){return n>>>0}u||(function(){for(var n=a.numThreads-1;n--;)ki();ea.unshift(()=>{Gt++,(function(l){u?l():Promise.all(mt.map(xi)).then(l)})(()=>mi())})})();for(var mn=Array(256),zr=0;256>zr;++zr)mn[zr]=String.fromCharCode(zr);ji=mn,gt=a.BindingError=class extends Error{constructor(n){super(n),this.name="BindingError"}},a.InternalError=class extends Error{constructor(n){super(n),this.name="InternalError"}},ot.push(0,1,void 0,1,null,1,!0,1,!1,1),a.count_emval_handles=()=>ot.length/2-5-oa.length;var N,nd=[ta,vi,Si,Ei,zi,Oi,Ri,Bi,Ni,Mi,Di,Pi,Ui,Wi,Vi,qi,rn,an,nn,ln,dn,pn,cn,hn,fn];(async function(){function n(h,y){return N=h.exports,N=(function(){var x=N,C={};for(let[z,O]of Object.entries(x))C[z]=typeof O=="function"?(...D)=>{Tr.push(z);try{return O(...D)}finally{oe||(Tr.pop(),at&&_t===1&&Tr.length===0&&(_t=0,ft+=1,Sr(vs),typeof Fibers<"u"&&Fibers.le()))}}:O;return C})(),N=(function(){var x=N,C=O=>D=>O(D)>>>0,z=O=>()=>O()>>>0;return(x=Object.assign({},x)).Cb=C(x.Cb),x.fc=z(x.fc),x.ic=C(x.ic),x.vc=C(x.vc),x.wc=z(x.wc),x.Ac=C(x.Ac),x})(),$i.push(N.jc),T=y,mi(),N}Gt++;var l=gi();if(a.instantiateWasm)return new Promise(h=>{a.instantiateWasm(l,(y,x)=>{n(y,x),h(y.exports)})});if(u)return new Promise(h=>{Ne=y=>{var x=new WebAssembly.Instance(y,gi());h(n(x,y))}});Lt??=a.locateFile?a.locateFile?a.locateFile("ort-wasm-simd-threaded.jsep.wasm",v):v+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href;try{var c=await(async function(h){var y=Lt;if(!F&&typeof WebAssembly.instantiateStreaming=="function"&&!le(y))try{var x=fetch(y,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(x,h)}catch(C){$(`wasm streaming compile failed: ${C}`),$("falling back to ArrayBuffer instantiation")}return(async function(C,z){try{var O=await(async function(D){if(!F)try{var q=await f(D);return new Uint8Array(q)}catch{}if(D==Lt&&F)D=new Uint8Array(F);else{if(!m)throw"both async and sync fetching of the wasm failed";D=m(D)}return D})(C);return await WebAssembly.instantiate(O,z)}catch(D){$(`failed to asynchronously prepare wasm: ${D}`),nt(D)}})(y,h)})(l);return n(c.instance,c.module)}catch(h){return r(h),Promise.reject(h)}})();var gn=n=>(gn=N.Cb)(n),yn=()=>(yn=N.Db)();a._OrtInit=(n,l)=>(a._OrtInit=N.Eb)(n,l),a._OrtGetLastError=(n,l)=>(a._OrtGetLastError=N.Fb)(n,l),a._OrtCreateSessionOptions=(n,l,c,h,y,x,C,z,O,D)=>(a._OrtCreateSessionOptions=N.Gb)(n,l,c,h,y,x,C,z,O,D),a._OrtAppendExecutionProvider=(n,l)=>(a._OrtAppendExecutionProvider=N.Hb)(n,l),a._OrtAddFreeDimensionOverride=(n,l,c)=>(a._OrtAddFreeDimensionOverride=N.Ib)(n,l,c),a._OrtAddSessionConfigEntry=(n,l,c)=>(a._OrtAddSessionConfigEntry=N.Jb)(n,l,c),a._OrtReleaseSessionOptions=n=>(a._OrtReleaseSessionOptions=N.Kb)(n),a._OrtCreateSession=(n,l,c)=>(a._OrtCreateSession=N.Lb)(n,l,c),a._OrtReleaseSession=n=>(a._OrtReleaseSession=N.Mb)(n),a._OrtGetInputOutputCount=(n,l,c)=>(a._OrtGetInputOutputCount=N.Nb)(n,l,c),a._OrtGetInputName=(n,l)=>(a._OrtGetInputName=N.Ob)(n,l),a._OrtGetOutputName=(n,l)=>(a._OrtGetOutputName=N.Pb)(n,l),a._OrtFree=n=>(a._OrtFree=N.Qb)(n),a._OrtCreateTensor=(n,l,c,h,y,x)=>(a._OrtCreateTensor=N.Rb)(n,l,c,h,y,x),a._OrtGetTensorData=(n,l,c,h,y)=>(a._OrtGetTensorData=N.Sb)(n,l,c,h,y),a._OrtReleaseTensor=n=>(a._OrtReleaseTensor=N.Tb)(n),a._OrtCreateRunOptions=(n,l,c,h)=>(a._OrtCreateRunOptions=N.Ub)(n,l,c,h),a._OrtAddRunConfigEntry=(n,l,c)=>(a._OrtAddRunConfigEntry=N.Vb)(n,l,c),a._OrtReleaseRunOptions=n=>(a._OrtReleaseRunOptions=N.Wb)(n),a._OrtCreateBinding=n=>(a._OrtCreateBinding=N.Xb)(n),a._OrtBindInput=(n,l,c)=>(a._OrtBindInput=N.Yb)(n,l,c),a._OrtBindOutput=(n,l,c,h)=>(a._OrtBindOutput=N.Zb)(n,l,c,h),a._OrtClearBoundOutputs=n=>(a._OrtClearBoundOutputs=N._b)(n),a._OrtReleaseBinding=n=>(a._OrtReleaseBinding=N.$b)(n),a._OrtRunWithBinding=(n,l,c,h,y)=>(a._OrtRunWithBinding=N.ac)(n,l,c,h,y),a._OrtRun=(n,l,c,h,y,x,C,z)=>(a._OrtRun=N.bc)(n,l,c,h,y,x,C,z),a._OrtEndProfiling=n=>(a._OrtEndProfiling=N.cc)(n),a._JsepOutput=(n,l,c)=>(a._JsepOutput=N.dc)(n,l,c),a._JsepGetNodeName=n=>(a._JsepGetNodeName=N.ec)(n);var Ar=()=>(Ar=N.fc)(),it=a._free=n=>(it=a._free=N.gc)(n),Or=a._malloc=n=>(Or=a._malloc=N.ic)(n),ya=(n,l,c,h,y,x)=>(ya=N.kc)(n,l,c,h,y,x),_n=()=>(_n=N.lc)(),vn=(n,l,c,h,y)=>(vn=N.mc)(n,l,c,h,y),$n=n=>($n=N.nc)(n),_a=n=>(_a=N.oc)(n),wn=(n,l)=>(wn=N.pc)(n,l),bn=()=>(bn=N.qc)(),ae=(n,l)=>(ae=N.rc)(n,l),Qt=n=>(Qt=N.sc)(n),xn=(n,l)=>(xn=N.tc)(n,l),Y=n=>(Y=N.uc)(n),va=n=>(va=N.vc)(n),re=()=>(re=N.wc)(),kn=n=>(kn=N.xc)(n),Sn=n=>(Sn=N.yc)(n),Tn=(n,l,c)=>(Tn=N.zc)(n,l,c),Cn=n=>(Cn=N.Ac)(n),In=a.dynCall_iii=(n,l,c)=>(In=a.dynCall_iii=N.Bc)(n,l,c),En=a.dynCall_vi=(n,l)=>(En=a.dynCall_vi=N.Cc)(n,l),$a=a.dynCall_ii=(n,l)=>($a=a.dynCall_ii=N.Dc)(n,l),zn=a.dynCall_vii=(n,l,c)=>(zn=a.dynCall_vii=N.Ec)(n,l,c),An=a.dynCall_iiii=(n,l,c,h)=>(An=a.dynCall_iiii=N.Fc)(n,l,c,h),On=a.dynCall_viii=(n,l,c,h)=>(On=a.dynCall_viii=N.Gc)(n,l,c,h),Rn=a.dynCall_iiiii=(n,l,c,h,y)=>(Rn=a.dynCall_iiiii=N.Hc)(n,l,c,h,y),Bn=a.dynCall_viiii=(n,l,c,h,y)=>(Bn=a.dynCall_viiii=N.Ic)(n,l,c,h,y),Nn=a.dynCall_viiiiii=(n,l,c,h,y,x,C)=>(Nn=a.dynCall_viiiiii=N.Jc)(n,l,c,h,y,x,C),Mn=a.dynCall_viiiiiii=(n,l,c,h,y,x,C,z)=>(Mn=a.dynCall_viiiiiii=N.Kc)(n,l,c,h,y,x,C,z),Dn=a.dynCall_ji=(n,l)=>(Dn=a.dynCall_ji=N.Lc)(n,l),Pn=a.dynCall_v=n=>(Pn=a.dynCall_v=N.Mc)(n),Un=a.dynCall_viiiii=(n,l,c,h,y,x)=>(Un=a.dynCall_viiiii=N.Nc)(n,l,c,h,y,x),Wn=a.dynCall_i=n=>(Wn=a.dynCall_i=N.Oc)(n),Vn=a.dynCall_fii=(n,l,c)=>(Vn=a.dynCall_fii=N.Pc)(n,l,c),qn=a.dynCall_viiiiiiii=(n,l,c,h,y,x,C,z,O)=>(qn=a.dynCall_viiiiiiii=N.Qc)(n,l,c,h,y,x,C,z,O),jn=a.dynCall_viiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q)=>(jn=a.dynCall_viiiiiiiiii=N.Rc)(n,l,c,h,y,x,C,z,O,D,q),Ln=a.dynCall_jiii=(n,l,c,h)=>(Ln=a.dynCall_jiii=N.Sc)(n,l,c,h),Gn=a.dynCall_dii=(n,l,c)=>(Gn=a.dynCall_dii=N.Tc)(n,l,c),Fn=a.dynCall_viiiiiiiii=(n,l,c,h,y,x,C,z,O,D)=>(Fn=a.dynCall_viiiiiiiii=N.Uc)(n,l,c,h,y,x,C,z,O,D),Hn=a.dynCall_viiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q)=>(Hn=a.dynCall_viiiiiiiiiii=N.Vc)(n,l,c,h,y,x,C,z,O,D,q,Q),Kn=a.dynCall_iiiiii=(n,l,c,h,y,x)=>(Kn=a.dynCall_iiiiii=N.Wc)(n,l,c,h,y,x),Zn=a.dynCall_iij=(n,l,c)=>(Zn=a.dynCall_iij=N.Xc)(n,l,c),Qn=a.dynCall_iiiiiiiiii=(n,l,c,h,y,x,C,z,O,D)=>(Qn=a.dynCall_iiiiiiiiii=N.Yc)(n,l,c,h,y,x,C,z,O,D),Xn=a.dynCall_iiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q)=>(Xn=a.dynCall_iiiiiiiiiii=N.Zc)(n,l,c,h,y,x,C,z,O,D,q),Jn=a.dynCall_vij=(n,l,c)=>(Jn=a.dynCall_vij=N._c)(n,l,c),Yn=a.dynCall_iiif=(n,l,c,h)=>(Yn=a.dynCall_iiif=N.$c)(n,l,c,h),es=a.dynCall_iiij=(n,l,c,h)=>(es=a.dynCall_iiij=N.ad)(n,l,c,h),ts=a.dynCall_fiii=(n,l,c,h)=>(ts=a.dynCall_fiii=N.bd)(n,l,c,h),rs=a.dynCall_viiiiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>(rs=a.dynCall_viiiiiiiiiiiii=N.cd)(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e),as=a.dynCall_vjiii=(n,l,c,h,y)=>(as=a.dynCall_vjiii=N.dd)(n,l,c,h,y),is=a.dynCall_vif=(n,l,c)=>(is=a.dynCall_vif=N.ed)(n,l,c),ns=a.dynCall_iiiiiii=(n,l,c,h,y,x,C)=>(ns=a.dynCall_iiiiiii=N.fd)(n,l,c,h,y,x,C),ss=a.dynCall_iiiij=(n,l,c,h,y)=>(ss=a.dynCall_iiiij=N.gd)(n,l,c,h,y),os=a.dynCall_iiiiiiii=(n,l,c,h,y,x,C,z)=>(os=a.dynCall_iiiiiiii=N.hd)(n,l,c,h,y,x,C,z),us=a.dynCall_viiiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q,ie)=>(us=a.dynCall_viiiiiiiiiiii=N.id)(n,l,c,h,y,x,C,z,O,D,q,Q,ie),ls=a.dynCall_diii=(n,l,c,h)=>(ls=a.dynCall_diii=N.jd)(n,l,c,h),ds=a.dynCall_jiiii=(n,l,c,h,y)=>(ds=a.dynCall_jiiii=N.kd)(n,l,c,h,y),ps=a.dynCall_viiij=(n,l,c,h,y)=>(ps=a.dynCall_viiij=N.ld)(n,l,c,h,y),cs=a.dynCall_fiiii=(n,l,c,h,y)=>(cs=a.dynCall_fiiii=N.md)(n,l,c,h,y),hs=a.dynCall_viiif=(n,l,c,h,y)=>(hs=a.dynCall_viiif=N.nd)(n,l,c,h,y),fs=a.dynCall_diiii=(n,l,c,h,y)=>(fs=a.dynCall_diiii=N.od)(n,l,c,h,y),ms=a.dynCall_viiid=(n,l,c,h,y)=>(ms=a.dynCall_viiid=N.pd)(n,l,c,h,y),gs=a.dynCall_iiiijii=(n,l,c,h,y,x,C)=>(gs=a.dynCall_iiiijii=N.qd)(n,l,c,h,y,x,C),ys=a.dynCall_iiiiiij=(n,l,c,h,y,x,C)=>(ys=a.dynCall_iiiiiij=N.rd)(n,l,c,h,y,x,C),_s=n=>(_s=N.sd)(n),vs=()=>(vs=N.td)(),$s=n=>($s=N.ud)(n),ws=()=>(ws=N.vd)();function sd(n,l,c){var h=re();try{zn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function od(n,l,c){var h=re();try{return In(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function ud(n,l){var c=re();try{En(n,l)}catch(h){if(Y(c),h!==h+0)throw h;ae(1,0)}}function ld(n,l){var c=re();try{return $a(n,l)}catch(h){if(Y(c),h!==h+0)throw h;ae(1,0)}}function dd(n,l,c,h){var y=re();try{return An(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function pd(n,l,c,h,y){var x=re();try{Bn(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function cd(n,l,c,h,y){var x=re();try{return Rn(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function hd(n,l,c,h){var y=re();try{On(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function fd(n,l,c,h,y,x,C){var z=re();try{return ns(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function md(n){var l=re();try{Pn(n)}catch(c){if(Y(l),c!==c+0)throw c;ae(1,0)}}function gd(n,l,c){var h=re();try{return Zn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function yd(n,l,c,h,y,x){var C=re();try{Un(n,l,c,h,y,x)}catch(z){if(Y(C),z!==z+0)throw z;ae(1,0)}}function _d(n,l,c){var h=re();try{Jn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function vd(n,l,c,h,y,x,C){var z=re();try{Nn(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function $d(n,l,c,h,y,x,C,z){var O=re();try{Mn(n,l,c,h,y,x,C,z)}catch(D){if(Y(O),D!==D+0)throw D;ae(1,0)}}function wd(n,l,c,h,y,x){var C=re();try{return Kn(n,l,c,h,y,x)}catch(z){if(Y(C),z!==z+0)throw z;ae(1,0)}}function bd(n,l,c,h,y,x,C,z){var O=re();try{return os(n,l,c,h,y,x,C,z)}catch(D){if(Y(O),D!==D+0)throw D;ae(1,0)}}function xd(n,l,c,h,y,x,C,z,O,D){var q=re();try{Fn(n,l,c,h,y,x,C,z,O,D)}catch(Q){if(Y(q),Q!==Q+0)throw Q;ae(1,0)}}function kd(n,l,c,h,y,x,C,z,O){var D=re();try{qn(n,l,c,h,y,x,C,z,O)}catch(q){if(Y(D),q!==q+0)throw q;ae(1,0)}}function Sd(n){var l=re();try{return Wn(n)}catch(c){if(Y(l),c!==c+0)throw c;ae(1,0)}}function Td(n,l,c,h,y,x,C,z,O,D){var q=re();try{return Qn(n,l,c,h,y,x,C,z,O,D)}catch(Q){if(Y(q),Q!==Q+0)throw Q;ae(1,0)}}function Cd(n,l,c){var h=re();try{return Vn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function Id(n,l,c,h){var y=re();try{return Ln(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;return ae(1,0),0n}}function Ed(n,l,c){var h=re();try{return Gn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function zd(n,l,c,h,y,x,C,z,O,D,q,Q){var ie=re();try{Hn(n,l,c,h,y,x,C,z,O,D,q,Q)}catch($e){if(Y(ie),$e!==$e+0)throw $e;ae(1,0)}}function Ad(n,l,c,h,y,x,C,z,O,D,q){var Q=re();try{jn(n,l,c,h,y,x,C,z,O,D,q)}catch(ie){if(Y(Q),ie!==ie+0)throw ie;ae(1,0)}}function Od(n,l,c,h,y,x,C,z,O,D,q){var Q=re();try{return Xn(n,l,c,h,y,x,C,z,O,D,q)}catch(ie){if(Y(Q),ie!==ie+0)throw ie;ae(1,0)}}function Rd(n,l,c,h){var y=re();try{return Yn(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Bd(n,l,c,h){var y=re();try{return es(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Nd(n,l,c,h){var y=re();try{return ts(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Md(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e){var Xe=re();try{rs(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)}catch(Xt){if(Y(Xe),Xt!==Xt+0)throw Xt;ae(1,0)}}function Dd(n,l,c,h,y){var x=re();try{as(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Pd(n,l,c){var h=re();try{is(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function Ud(n,l){var c=re();try{return Dn(n,l)}catch(h){if(Y(c),h!==h+0)throw h;return ae(1,0),0n}}function Wd(n,l,c,h,y){var x=re();try{return ss(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Vd(n,l,c,h,y,x,C,z,O,D,q,Q,ie){var $e=re();try{us(n,l,c,h,y,x,C,z,O,D,q,Q,ie)}catch(Xe){if(Y($e),Xe!==Xe+0)throw Xe;ae(1,0)}}function qd(n,l,c,h){var y=re();try{return ls(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function jd(n,l,c,h,y){var x=re();try{return ds(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;return ae(1,0),0n}}function Ld(n,l,c,h,y){var x=re();try{ps(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Gd(n,l,c,h,y){var x=re();try{return cs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Fd(n,l,c,h,y){var x=re();try{hs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Hd(n,l,c,h,y){var x=re();try{return fs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Kd(n,l,c,h,y){var x=re();try{ms(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Zd(n,l,c,h,y,x,C){var z=re();try{return gs(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function Qd(n,l,c,h,y,x,C){var z=re();try{return ys(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}return a.stackSave=()=>re(),a.stackRestore=n=>Y(n),a.stackAlloc=n=>va(n),a.setValue=function(n,l,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":H()[n>>>0]=l;break;case"i16":M()[n>>>1>>>0]=l;break;case"i32":R()[n>>>2>>>0]=l;break;case"i64":P[n>>>3]=BigInt(l);break;case"float":Ie()[n>>>2>>>0]=l;break;case"double":Fe()[n>>>3>>>0]=l;break;case"*":X()[n>>>2>>>0]=l;break;default:nt(`invalid type for setValue: ${c}`)}},a.getValue=function(n,l="i8"){switch(l.endsWith("*")&&(l="*"),l){case"i1":case"i8":return H()[n>>>0];case"i16":return M()[n>>>1>>>0];case"i32":return R()[n>>>2>>>0];case"i64":return P[n>>>3];case"float":return Ie()[n>>>2>>>0];case"double":return Fe()[n>>>3>>>0];case"*":return X()[n>>>2>>>0];default:nt(`invalid type for getValue: ${l}`)}},a.UTF8ToString=Oe,a.stringToUTF8=zt,a.lengthBytesUTF8=Ai,(function n(){if(0<Gt)Ft=n;else if(u)t(a),wr();else{for(;0<ea.length;)ea.shift()(a);0<Gt?Ft=n:(a.calledRun=!0,oe||(wr(),t(a)))}})(),a.PTR_SIZE=4,i}),ob=sp,Yf=globalThis.self?.name?.startsWith("em-pthread"),Yf&&sp()}),op,em,At,ub,Co,tm,rm,up,am,lp,lb,dp,db,Wh=ee(()=>{Uh(),op=typeof location>"u"?void 0:location.origin,em=()=>import.meta.url?.startsWith("file:")?new URL(new URL("/assets/ort.webgpu.bundle.min-CEayb2S6.mjs",import.meta.url).href,op).href:import.meta.url,At=em(),ub=()=>{if(At&&!At.startsWith("blob:"))return At.substring(0,At.lastIndexOf("/")+1)},Co=(e,t)=>{try{let r=t??At;return(r?new URL(e,r):new URL(e)).origin===op}catch{return!1}},tm=(e,t)=>{let r=t??At;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},rm=(e,t)=>`${t??"./"}${e}`,up=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},am=async e=>(await import(e)).default,lp=(NE(),mu(ib)).default,lb=async()=>{if(!At)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Co(At))return[void 0,lp()];let e=await up(At);return[e,lp(e)]},dp=(ME(),mu(sb)).default,db=async(e,t,r)=>{if(!e&&!t&&dp&&At&&Co(At))return[void 0,dp];{let a="ort-wasm-simd-threaded.jsep.mjs",i=e??tm(a,t),s=r&&i&&!Co(i,t),o=s?await up(i):i??rm(a,t);return[s?o:void 0,await am(o)]}}}),pp,Io,Ss,cp,im,nm,Vh,ut,Fa=ee(()=>{Wh(),Io=!1,Ss=!1,cp=!1,im=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},nm=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Vh=async e=>{if(Io)return Promise.resolve();if(Ss)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(cp)throw new Error("previous call to 'initializeWebAssembly()' failed.");Ss=!0;let t=e.initTimeout,r=e.numThreads;if(!nm())throw new Error("WebAssembly SIMD is not supported in the current environment.");let a=im();r>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let i=e.wasmPaths,s=typeof i=="string"?i:void 0,o=i?.mjs,u=o?.href??o,d=i?.wasm,p=d?.href??d,f=e.wasmBinary,[m,g]=await db(u,s,r>1),_=!1,v=[];if(t>0&&v.push(new Promise(w=>{setTimeout(()=>{_=!0,w()},t)})),v.push(new Promise((w,k)=>{let b={numThreads:r};if(f)b.wasmBinary=f;else if(p||s)b.locateFile=$=>p??s+$;else if(u&&u.indexOf("blob:")!==0)b.locateFile=$=>new URL($,u).href;else if(m){let $=ub();$&&(b.locateFile=S=>$+S)}g(b).then($=>{Ss=!1,Io=!0,pp=$,w(),m&&URL.revokeObjectURL(m)},$=>{Ss=!1,cp=!0,k($)})})),await Promise.race(v),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ut=()=>{if(Io&&pp)return pp;throw new Error("WebAssembly is not initialized yet.")}}),$t,gu,qe,qh=ee(()=>{Fa(),$t=(e,t)=>{let r=ut(),a=r.lengthBytesUTF8(e)+1,i=r._malloc(a);return r.stringToUTF8(e,i,a),t.push(i),i},gu=(e,t,r,a)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([i,s])=>{let o=t?t+i:i;if(typeof s=="object")gu(s,o+".",r,a);else if(typeof s=="string"||typeof s=="number")a(o,s.toString());else if(typeof s=="boolean")a(o,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},qe=e=>{let t=ut(),r=t.stackSave();try{let a=t.PTR_SIZE,i=t.stackAlloc(2*a);t._OrtGetLastError(i,i+a);let s=Number(t.getValue(i,a===4?"i32":"i64")),o=t.getValue(i+a,"*"),u=o?t.UTF8ToString(o):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),pb,DE=ee(()=>{Fa(),qh(),pb=e=>{let t=ut(),r=0,a=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let s=0;return e?.tag!==void 0&&(s=$t(e.tag,a)),r=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,s),r===0&&qe("Can't create run options."),e?.extra!==void 0&&gu(e.extra,"",new WeakSet,(o,u)=>{let d=$t(o,a),p=$t(u,a);t._OrtAddRunConfigEntry(r,d,p)!==0&&qe(`Can't set a run config entry: ${o} - ${u}.`)}),[r,a]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),a.forEach(o=>t._free(o)),s}}}),sm,om,um,lm,cb,PE=ee(()=>{Fa(),qh(),sm=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},om=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},um=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},lm=(e,t,r)=>{for(let a of t){let i=typeof a=="string"?a:a.name;switch(i){case"webnn":if(i="WEBNN",typeof a!="string"){let o=a?.deviceType;if(o){let u=$t("deviceType",r),d=$t(o,r);ut()._OrtAddSessionConfigEntry(e,u,d)!==0&&qe(`Can't set a session config entry: 'deviceType' - ${o}.`)}}break;case"webgpu":if(i="JS",typeof a!="string"){let o=a;if(o?.preferredLayout){if(o.preferredLayout!=="NCHW"&&o.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${o.preferredLayout}`);let u=$t("preferredLayout",r),d=$t(o.preferredLayout,r);ut()._OrtAddSessionConfigEntry(e,u,d)!==0&&qe(`Can't set a session config entry: 'preferredLayout' - ${o.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${i}`)}let s=$t(i,r);ut()._OrtAppendExecutionProvider(e,s)!==0&&qe(`Can't append execution provider: ${i}.`)}},cb=e=>{let t=ut(),r=0,a=[],i=e||{};um(i);try{let s=sm(i.graphOptimizationLevel??"all"),o=om(i.executionMode??"sequential"),u=typeof i.logId=="string"?$t(i.logId,a):0,d=i.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let p=i.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let f=typeof i.optimizedModelFilePath=="string"?$t(i.optimizedModelFilePath,a):0;if(r=t._OrtCreateSessionOptions(s,!!i.enableCpuMemArena,!!i.enableMemPattern,o,!!i.enableProfiling,0,u,d,p,f),r===0&&qe("Can't create session options."),i.executionProviders&&lm(r,i.executionProviders,a),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);let m=$t("enableGraphCapture",a),g=$t(i.enableGraphCapture.toString(),a);t._OrtAddSessionConfigEntry(r,m,g)!==0&&qe(`Can't set a session config entry: 'enableGraphCapture' - ${i.enableGraphCapture}.`)}if(i.freeDimensionOverrides)for(let[m,g]of Object.entries(i.freeDimensionOverrides)){if(typeof m!="string")throw new Error(`free dimension override name must be a string: ${m}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=$t(m,a);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&qe(`Can't set a free dimension override: ${m} - ${g}.`)}return i.extra!==void 0&&gu(i.extra,"",new WeakSet,(m,g)=>{let _=$t(m,a),v=$t(g,a);t._OrtAddSessionConfigEntry(r,_,v)!==0&&qe(`Can't set a session config entry: ${m} - ${g}.`)}),[r,a]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&qe("Can't release session options."),a.forEach(o=>t._free(o)),s}}}),Ya,za,Aa,jh,yu,Lh,Gh,th,we=ee(()=>{Ya=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},za=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Aa=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((i,s)=>i*s,1);return r>0?Math.ceil(a*r):void 0},jh=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},yu=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Lh=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Gh=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",th=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Fh,hb=ee(()=>{Uh(),Fh=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let i=t.body.getReader(),s;try{s=new ArrayBuffer(a)}catch(u){if(u instanceof RangeError){let d=Math.ceil(a/65536);s=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw u}let o=0;for(;;){let{done:u,value:d}=await i.read();if(u)break;let p=d.byteLength;new Uint8Array(s,o,p).set(d),o+=p}return new Uint8Array(s,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),dm,pm,cm,hm,Hh,fm,De,Pr=ee(()=>{we(),dm=["V","I","W","E","F"],pm=(e,t)=>{console.log(`[${dm[e]},${new Date().toISOString()}]${t}`)},Hh=(e,t)=>{cm=e,hm=t},fm=(e,t)=>{let r=yu(e),a=yu(cm);r>=a&&pm(r,typeof t=="function"?t():t)},De=(...e)=>{hm&&fm(...e)}}),Kh,fb=ee(()=>{we(),Kh=(e,t)=>new(jh(t))(e)}),Zh=ee(()=>{}),hp,Eo,zo,mm,gm,fp,rh,ym,mb,UE=ee(()=>{Pr(),Zh(),hp=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Eo=[],zo=e=>Math.ceil(Number(e)/16)*16,mm=e=>{for(let t=0;t<Eo.length;t++){let r=Eo[t];if(e<=r)return r}return Math.ceil(e/16)*16},gm=1,fp=()=>gm++,rh=async(e,t,r,a)=>{let i=zo(r),s=e.device.createBuffer({size:i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=e.getCommandEncoder();e.endComputePass(),o.copyBufferToBuffer(t,0,s,0,i),e.flush(),await s.mapAsync(GPUMapMode.READ);let u=s.getMappedRange();if(a){let d=a();return d.set(new Uint8Array(u,0,r)),d}else return new Uint8Array(u.slice(0,r))}finally{s.destroy()}},ym=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of hp)Eo.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,a=t.byteOffset,i=t.byteLength,s=zo(i),o=this.storageCache.get(e);if(!o)throw new Error("gpu data for uploading does not exist");if(Number(o.originalSize)!==i)throw new Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${i}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),d=u.getMappedRange();new Uint8Array(d).set(new Uint8Array(r,a,i)),u.unmap();let p=this.backend.device.createCommandEncoder();p.copyBufferToBuffer(u,0,o.gpuData.buffer,0,s),this.backend.device.queue.submit([p.finish()]),u.destroy(),De("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=zo(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,i)}registerExternalBuffer(e,t,r){let a;if(r){if(a=r[0],e===r[1])return De("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=fp();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),De("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),De("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=mm(e),a,i=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||s){let u=(i?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?a=u.pop():a=this.backend.device.createBuffer({size:r,usage:t}):a=this.backend.device.createBuffer({size:r,usage:t})}else a=this.backend.device.createBuffer({size:r,usage:t});let o={id:fp(),type:0,buffer:a};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(e)}),De("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${o.id}`),o}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return De("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await rh(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=hp.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(De("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},mb=(...e)=>new ym(...e)}),_m,Le,et=ee(()=>{_m=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Le=e=>new _m(e)}),vm,ui,L,_u,gb,yb,_b,Te=ee(()=>{vm=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},ui=class{static calcShape(e,t,r=!1){let a=e.length,i=t.length;if(a===0)return t;if(i===0)return e;let s=Math.max(e.length,t.length),o=new Array(s);if(r){if(a<2||i<2)return;let u=vm.calcMatMulShape([e[a-2],e[a-1]],[t[i-2],t[i-1]]);if(u===void 0)return;[o[s-2],o[s-1]]=u}for(let u=r?3:1;u<=s;u++){let d=a-u<0?1:e[a-u],p=i-u<0?1:t[i-u];if(d!==p&&d>1&&p>1)return;let f=Math.max(d,p);if(d&&p)o[s-u]=Math.max(d,p);else{if(f>1)return;o[s-u]=0}}return o}static isValidBroadcast(e,t){let r=e.length,a=t.length;if(r>a)return!1;for(let i=1;i<=r;i++)if(e[r-i]!==1&&e[r-i]!==t[a-i])return!1;return!0}},L=class ru{static size(t){return ru.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let a=t.length;if(a===0)return[];let i=new Array(a),s=a-1;for(;s>=0;){if(t[s]%r===0){i[s]=t[s]/r;break}if(r%t[s]!==0)throw new Error("cannot convert shape");i[s]=1,r/=t[s],s--}for(s--;s>=0;s--)i[s]=t[s];return i}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ru.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ru.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,a){let i=1;for(let s=r;s<a;s++){if(t[s]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");i*=Number(t[s])}return i}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let a=new Array(r);a[r-1]=1,a[r-2]=t[r-1];for(let i=r-3;i>=0;--i)a[i]=a[i+1]*t[i+1];return a}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(a=>this.normalizeAxis(a,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(a=>t[a]):t.slice().reverse()}static padShape(t,r){let a=t.length;return t.map((i,s)=>i+r[s]+r[s+a])}static areEqual(t,r){return t.length!==r.length?!1:t.every((a,i)=>a===r[i])}},_u=class Fs{static adjustPoolAttributes(t,r,a,i,s,o){if(!t&&a.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=a.length?a.push(r[u+2]):a[u]=r[u+2];for(let u=0;u<a.length;u++)if(u<i.length){if(i[u]<0)throw new Error("strides should be greater than or equal to 1")}else i.push(1);for(let u=0;u<a.length;u++)if(u<s.length){if(s[u]<0)throw new Error("dilations should be greater than or equal to 1")}else s.push(1);for(let u=0;u<a.length*2;u++)if(u<o.length){if(o[u]<0)throw new Error("pad should be greater than or equal to 1")}else o.push(0);for(let u=0;u<a.length;u++){if(a[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(o[u]>=a[u]||o[u+a.length]>=a[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,a,i,s,o,u){if(u){if(s.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(i.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)Fs.adjustPadAndReturnShape(t[d+(o?1:2)],r[d],a[d],i[d],s,d,d+t.length-2,u)}}static computePoolOutputShape(t,r,a,i,s,o,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return Fs.computeShapeHelper(t,r,d,a,i,s,o,u),d}static computeConvOutputShape(t,r,a,i,s,o,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],r[0]];return Fs.computeShapeHelper(!1,t,d,a,i,s,o,u),d}static computeShapeHelper(t,r,a,i,s,o,u,d){if(t)for(let p=0;p<r.length-2;p++)a.push(1);else for(let p=0;p<r.length-2;p++)a.push(Fs.adjustPadAndReturnShape(r[p+2],i[p],s[p],o[p],u,p,p+r.length-2,d))}static adjustPadAndReturnShape(t,r,a,i,s,o,u,d){let p=a*(i-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return s[o]=0,s[u]=0,Math.floor((t-p)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let f=((t+r-1)/r-1)*r+i-t;return s[o]=Math.floor(d==="SAME_LOWER"?(f+1)/2:f/2),s[u]=f-s[o],Math.floor((t+f-i)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+s[o]+s[u]-p)/r+1)}},gb=class{static getShapeOfGemmResult(e,t,r,a,i){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let s,o,u;t?(s=e[1],o=e[0]):(s=e[0],o=e[1]);let d=-1;if(a?(u=r[0],d=1):(u=r[1],d=0),r[d]!==o)throw new Error("dimension mismatch");if(s<=0||u<=0||o<=0)throw new Error("invalid shape specified");if(i&&!ui.isValidBroadcast(i,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,o]}},yb=-34028234663852886e22,_b=34028234663852886e22}),li,Ao,dt,bt,ye,Je,ah,ri,Kr,me,Ts,K,he,vb,Qh,$m,$b,ze=ee(()=>{we(),Te(),li=64,Ao=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},dt=(e,t=1)=>{let r=Ao(e,t);return typeof r=="string"?r:r[0]},bt=(e,t=1)=>{let r=Ao(e,t);return typeof r=="string"?r:r[1]},ye=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:L.computeStrides(r)})}),t},Je=e=>e%4===0?4:e%2===0?2:1,ah=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,ri=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Kr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,me=(e,t,r,a)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Ts=(e,t,r,a,i)=>{let s=typeof r=="number",o=s?r:r.length,u=[...new Array(o).keys()],d=o<2?"u32":o<=4?`vec${o}<u32>`:`array<u32, ${o}>`,p=Ao(t,i),f=typeof p=="string"?p:p[1],m=typeof p=="string"?p:p[0],g={indices:d,value:f,storage:m,tensor:t},_=M=>typeof M=="string"?M:`${M}u`,v={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=s?"uniforms.":"",k=`${w}${e}_shape`,b=`${w}${e}_strides`,$="";for(let M=0;M<o-1;M++)$+=`
    let dim${M} = current / ${me(b,M,o)};
    let rest${M} = current % ${me(b,M,o)};
    indices[${M}] = dim${M};
    current = rest${M};
    `;$+=`indices[${o-1}] = current;`;let S=o<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${$}
    return indices;
  }`,T=M=>(v.offsetToIndices=!0,o<2?M:`o2i_${e}(${M})`),I=[];if(o>=2)for(let M=o-1;M>=0;M--)I.push(`${me(b,M,o)} * (indices[${M}])`);let A=o<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${I.join("+")};
  }`,E=M=>(v.indicesToOffset=!0,o<2?M:`i2o_${e}(${M})`),B=(...M)=>o===0?"0u":`${g.indices}(${M.map(_).join(",")})`,U=(M,V)=>o<2?`${M}`:`${me(M,V,o)}`,j=(M,V,R)=>o<2?`${M}=${R};`:`${me(M,V,o)}=${R};`,W={},J=(M,V)=>{v.broadcastedIndicesToOffset=!0;let R=`${V.name}broadcastedIndicesTo${e}Offset`;if(R in W)return`${R}(${M})`;let X=[];for(let Ie=o-1;Ie>=0;Ie--){let Fe=V.indicesGet("outputIndices",Ie+V.rank-o);X.push(`${U(b,Ie)} * (${Fe} % ${U(k,Ie)})`)}return W[R]=`fn ${R}(outputIndices: ${V.type.indices}) -> u32 {
             return ${X.length>0?X.join("+"):"0u"};
           }`,`${R}(${M})`},P=(M,V)=>(()=>{if(g.storage===g.value)return`${e}[${M}]=${V};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${M}]=vec2<u32>(u32(${V}), select(0u, 0xFFFFFFFFu, ${V} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${M}]=vec2<u32>(u32(${V}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${M}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${V}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),se=M=>(()=>{if(g.storage===g.value)return`${e}[${M}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${M}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${M}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${M}] & 0xFFu), bool(${e}[${M}] & 0xFF00u), bool(${e}[${M}] & 0xFF0000u), bool(${e}[${M}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ue=o<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${f} {
    return ${se(`i2o_${e}(indices)`)};
  }`,F=o<2?"":(()=>{let M=u.map(R=>`d${R}: u32`).join(", "),V=u.map(R=>`d${R}`).join(", ");return`
  fn get_${e}(${M}) -> ${f} {
    return get_${e}ByIndices(${B(V)});
  }`})(),oe=(...M)=>{if(M.length!==o)throw new Error(`indices length must be ${o}`);let V=M.map(_).join(",");return o===0?se("0u"):o===1?se(V[0]):(v.get=!0,v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}(${V})`)},le=M=>o<2?se(M):(v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}ByIndices(${M})`),H=o<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${f}) {
    ${P(`i2o_${e}(indices)`,"value")}
  }`,de=o<2?"":(()=>{let M=u.map(R=>`d${R}: u32`).join(", "),V=u.map(R=>`d${R}`).join(", ");return`
  fn set_${e}(${M}, value: ${f}) {
    set_${e}ByIndices(${B(V)}, value);
  }`})();return{impl:()=>{let M=[],V=!1;return v.offsetToIndices&&(M.push(S),V=!0),v.indicesToOffset&&(M.push(A),V=!0),v.broadcastedIndicesToOffset&&(Object.values(W).forEach(R=>M.push(R)),V=!0),v.set&&(M.push(de),V=!0),v.setByIndices&&(M.push(H),V=!0),v.get&&(M.push(F),V=!0),v.getByIndices&&(M.push(ue),V=!0),!s&&V&&M.unshift(`const ${k} = ${g.indices}(${r.join(",")});`,`const ${b} = ${g.indices}(${L.computeStrides(r).join(",")});`),M.join(`
`)},type:g,offsetToIndices:T,indicesToOffset:E,broadcastedIndicesToOffset:J,indices:B,indicesGet:U,indicesSet:j,set:(...M)=>{if(M.length!==o+1)throw new Error(`indices length must be ${o}`);let V=M[o];if(typeof V!="string")throw new Error("value must be string");let R=M.slice(0,o).map(_).join(",");return o===0?P("0u",V):o===1?P(R[0],V):(v.set=!0,v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}(${R}, ${V})`)},setByOffset:P,setByIndices:(M,V)=>o<2?P(M,V):(v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}ByIndices(${M}, ${V});`),get:oe,getByOffset:se,getByIndices:le,usage:a,name:e,strides:b,shape:k,rank:o}},K=(e,t,r,a=1)=>Ts(e,t,r,"input",a),he=(e,t,r,a=1)=>Ts(e,t,r,"output",a),vb=(e,t,r)=>Ts(e,t,r,"atomicOutput",1),Qh=(e,t,r,a=1)=>Ts(e,t,r,"internal",a),$m=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=li){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,o=i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${a})
  fn main(${s}) {
    ${o}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:a}of this.uniforms)if(a&&a>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(a/4)}>`);else{let i=a==null||a===1?r:`vec${a}<${r}>`;e.push(`${t}:${i}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},$b=(e,t)=>new $m(e,t)}),wm,mp,bm,xm,km,Sm,Nt,wb,bb,Qr=ee(()=>{we(),Te(),et(),ze(),wm=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},mp=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),bm=(e,t)=>L.sortBasedOnPerm(e,mp(e.length,t)),xm=(e,t,r,a)=>{let i=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let s=0;s<t;++s)i+=`a[${e[s]}]=i[${s}];`;return i+="return a;}"},km=(e,t)=>{let r=[],a=[];for(let i=0;i<e.length;++i)e[i]!==1&&r.push(e[i]),e[t[i]]!==1&&a.push(t[i]);return{newShape:r,newPerm:a}},Sm=(e,t)=>{let r=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<r)return!1;r=e[a]}return!0},Nt=(e,t)=>{let r=e.dataType,a=e.dims.length,i=mp(a,t),s=bm(e.dims,i),o=e.dims,u=s,d=a<2||Sm(i,e.dims),p;if(d)return p=v=>{let w=K("input",r,o,4),k=he("output",r,u,4);return`
  ${v.registerUniform("output_size","u32").declareVariables(w,k)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let v=L.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64/4)},programUniforms:[{type:12,data:Math.ceil(v/4)}]}},getShaderSource:p};let{newShape:f,newPerm:m}=km(e.dims,i),g=L.areEqual(m,[2,3,1]),_=L.areEqual(m,[3,1,2]);if(f.length===2||g||_){o=g?[f[0],f[1]*f[2]]:_?[f[0]*f[1],f[2]]:f,u=[o[1],o[0]];let v=16;return p=w=>{let k=K("a",r,o.length),b=he("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(k,b)}
  var<workgroup> tile : array<array<${b.type.value}, ${v+1}>, ${v}>;
  ${w.mainStart([v,v,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${v} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${v}u + local_id.x;
    let input_row = workgroup_id_x * ${v}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${v}u + local_id.x;
    let output_row = workgroup_id_y * ${v}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${b.setByIndices(`${b.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=L.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/v),y:Math.ceil(u[0]/v)},programUniforms:[{type:12,data:w},...ye(o,u)]}},getShaderSource:p}}return p=v=>{let w=K("a",r,o.length),k=he("output",r,u.length);return`
  ${v.registerUniform("output_size","u32").declareVariables(w,k)}

  ${xm(i,a,w,k)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let v=L.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...ye(o,u)]}},getShaderSource:p}},wb=(e,t)=>{wm(e.inputs,t.perm),e.compute(Nt(e.inputs[0],t.perm))},bb=e=>Le({perm:e.perm})}),Tm,Cm,Im,Em,zm,Am,Om,Rm,Bm,Nm,Jt,xb,kb,Sb,Tb,Cb,Ib,Eb,zb,Ab,Ob,WE=ee(()=>{we(),Te(),ze(),Xh(),Qr(),Tm={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Cm={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Im={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Em={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},zm=(e,t)=>{let r=[];for(let a=t-e;a<t;++a)r.push(a);return r},Am=(e,t)=>{let r=[],a=e.length;for(let s=0;s<a;s++)t.indexOf(s)===-1&&r.push(e[s]);let i=t.map(s=>e[s]);return[r,i]},Om=(e,t)=>{let r=e.length+t.length,a=[],i=0;for(let s=0;s<r;s++)t.indexOf(s)===-1?a.push(e[i++]):a.push(1);return a},Rm=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Bm=(e,t)=>{let r=[];if(!Rm(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&r.push(a);e.forEach(a=>r.push(a))}return r},Nm=(e,t,r,a,i,s,o)=>{let u=r[0].dims,d=L.size(s),p=L.size(o),f=K("_A",r[0].dataType,u),m=he("output",i,s),g=64;d===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,v=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(f,m)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Im[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${Tm[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Cm[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex",`${a==="mean"?`${m.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${m.type.storage}(${Em[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:s,dataType:i}],dispatchGroup:{x:d},programUniforms:[{type:12,data:p}]})}},Jt=(e,t,r,a)=>{let i=e.inputs.length===1?r:ih(e.inputs,r),s=i.axes;s.length===0&&!i.noopWithEmptyAxes&&(s=e.inputs[0].dims.map((_,v)=>v));let o=L.normalizeAxes(s,e.inputs[0].dims.length),u=o,d=e.inputs[0],p=Bm(u,e.inputs[0].dims.length);p.length>0&&(d=e.compute(Nt(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],u=zm(u.length,d.dims.length));let[f,m]=Am(d.dims,u),g=f;i.keepDims&&(g=Om(f,o)),e.compute(Nm(t,i.cacheKey,[d],a,e.inputs[0].dataType,g,m),{inputs:[d]})},xb=(e,t)=>{Jt(e,"ReduceMeanShared",t,"mean")},kb=(e,t)=>{Jt(e,"ReduceL1Shared",t,"l1")},Sb=(e,t)=>{Jt(e,"ReduceL2Shared",t,"l2")},Tb=(e,t)=>{Jt(e,"ReduceLogSumExpShared",t,"logSumExp")},Cb=(e,t)=>{Jt(e,"ReduceMaxShared",t,"max")},Ib=(e,t)=>{Jt(e,"ReduceMinShared",t,"min")},Eb=(e,t)=>{Jt(e,"ReduceProdShared",t,"prod")},zb=(e,t)=>{Jt(e,"ReduceSumShared",t,"sum")},Ab=(e,t)=>{Jt(e,"ReduceSumSquareShared",t,"sumSquare")},Ob=(e,t)=>{Jt(e,"ReduceLogSumShared",t,"logSum")}}),Yt,Mm,vu,ih,er,Dm,Pm,Um,Wm,Vm,qm,jm,Lm,Gm,Fm,tr,Rb,Bb,Nb,Mb,Db,Pb,Ub,Wb,Vb,qb,Xh=ee(()=>{we(),Te(),et(),ze(),WE(),Yt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Mm=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],vu=(e,t,r,a,i,s,o=!1,u=!1)=>{let d=[],p=r[0].dims,f=p.length,m=L.normalizeAxes(i,f),g=!u&&m.length===0;p.forEach((w,k)=>{g||m.indexOf(k)>=0?o&&d.push(1):d.push(w)});let _=d.length,v=L.size(d);return{name:e,shaderCache:t,getShaderSource:w=>{let k=[],b=K("_A",r[0].dataType,f),$=he("output",s,_),S=a(b,$,m),T=S[2];for(let I=0,A=0;I<f;I++)g||m.indexOf(I)>=0?(o&&A++,T=`for(var j${I}: u32 = 0; j${I} < ${p[I]}; j${I}++) {
                  ${S[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${b.indicesSet("input_indices",I,`j${I}`)}
                  ${T}
                }`):(k.push(`${b.indicesSet("input_indices",I,$.indicesGet("output_indices",A))};`),A++);return`

        ${w.registerUniform("output_size","u32").declareVariables(b,$)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${b.type.indices};
          let output_indices = ${$.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${T}
          ${S[3]}
          ${S.length===4?$.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:s}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...ye(p,d)]})}},ih=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),Le({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},er=(e,t,r,a)=>{let i=e.inputs,s=i.length===1?r:ih(i,r);e.compute(vu(t,{hint:s.cacheKey,inputDependencies:["rank"]},[i[0]],s.noopWithEmptyAxes&&s.axes.length===0?Mm:a,s.axes,i[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},Dm=(e,t)=>{Yt(e.inputs),er(e,"ReduceLogSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Pm=(e,t)=>{Yt(e.inputs),er(e,"ReduceL1",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Um=(e,t)=>{Yt(e.inputs),er(e,"ReduceL2",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Wm=(e,t)=>{Yt(e.inputs),er(e,"ReduceLogSumExp",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Vm=(e,t)=>{Yt(e.inputs),er(e,"ReduceMax",t,(r,a,i)=>{let s=[];for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&s.push(r.indicesSet("input_indices",o,0));return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},qm=(e,t)=>{Yt(e.inputs),er(e,"ReduceMean",t,(r,a,i)=>{let s=1;for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&(s*=e.inputs[0].dims[o]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${s});`]})},jm=(e,t)=>{Yt(e.inputs),er(e,"ReduceMin",t,(r,a,i)=>{let s=[];for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Lm=(e,t)=>{Yt(e.inputs),er(e,"ReduceProd",t,(r,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Gm=(e,t)=>{Yt(e.inputs),er(e,"ReduceSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Fm=(e,t)=>{Yt(e.inputs),er(e,"ReduceSumSquare",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},tr=(e,t,r)=>{if(t.length===0)return r;let a=1,i=1;for(let s=0;s<t.length;s++)t.indexOf(s)===-1?a*=e[s]:i*=e[s];return i<32&&a>1024},Rb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qm(e,t):xb(e,t)},Bb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pm(e,t):kb(e,t)},Nb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Um(e,t):Sb(e,t)},Mb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wm(e,t):Tb(e,t)},Db=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vm(e,t):Cb(e,t)},Pb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?jm(e,t):Ib(e,t)},Ub=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lm(e,t):Eb(e,t)},Wb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gm(e,t):zb(e,t)},Vb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fm(e,t):Ab(e,t)},qb=(e,t)=>{tr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Dm(e,t):Ob(e,t)}}),gp,jb,Lb,nh,VE=ee(()=>{we(),et(),Xh(),gp=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},jb=(e,t)=>{gp(e.inputs);let r=(a,i,s)=>{let o=[];for(let u=0;u<a.rank;u++)(s.indexOf(u)>=0||s.length===0)&&o.push(`input_indices[${u}] = 0;`);return[`${o.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(vu("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Lb=(e,t)=>{gp(e.inputs);let r=(a,i,s)=>{let o=[];for(let u=0;u<a.rank;u++)(s.indexOf(u)>=0||s.length===0)&&o.push(`input_indices[${u}] = 0;`);return[`${o.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(vu("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},nh=e=>Le(e)}),Hm,Oo,Km,Zm,Qm,$o,Xm,Gb,Jh=ee(()=>{we(),Te(),Zh(),ze(),Hm=(e,t)=>{let r=e[0],a=e[1],i=e[2],s=e[3],o=e[4],u=e[5];if(o&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=r.dims[0],p=r.dims[1],f=r.dims[2];if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(i.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let m=i.dims[0]/3,g=m,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");m=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let v=p;if(m!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(i.dims[0]!==m+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(o){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(o.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(o.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(o.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(o.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(o.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=o.dims[3])}let k=v+w,b=-1,$=0;if(s)throw new Error("Mask not supported");if(o)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:p,pastSequenceLength:w,kvSequenceLength:v,totalSequenceLength:k,maxSequenceLength:b,inputHiddenSize:f,hiddenSize:m,vHiddenSize:_,headSize:Math.floor(m/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:$,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Oo=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Km=(e,t,r,a,i,s,o,u)=>{let d=Je(o?1:s),p=64,f=s/d;f<p&&(p=32);let m=Math.ceil(s/d/p),g=[{type:12,data:t},{type:12,data:r},{type:12,data:a},{type:12,data:i},{type:12,data:f},{type:12,data:m}],_=dt(e.dataType,d),v=bt(1,d),w=["type"];o&&w.push("type"),u&&w.push("type");let k=b=>{let $=he("x",e.dataType,e.dims,d),S=[$],T=o?K("seq_lens",o.dataType,o.dims):void 0;T&&S.push(T);let I=u?K("total_sequence_length_input",u.dataType,u.dims):void 0;I&&S.push(I);let A=bt(e.dataType),E=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${b.registerUniforms(E).declareVariables(...S)}
  ${b.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Oo(T,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${o?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${v}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${v}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(d){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${v}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${v}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(d){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${$.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${v}(x[offset + i]);
        x[offset + i] = ${$.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${o?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${$.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${_};${d}`,inputDependencies:w},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:Math.ceil(s/p),y:i,z:t*r},programUniforms:g})}},Zm=(e,t,r,a,i,s,o,u,d)=>{let p=o+s.kvSequenceLength,f=[s.batchSize,s.numHeads,s.sequenceLength,p],m=e>1&&a,g=s.kvNumHeads?s.kvNumHeads:s.numHeads,_=m?[s.batchSize,g,p,s.headSize]:void 0,v=s.nReps?s.nReps:1,w=s.scale===0?1/Math.sqrt(s.headSize):s.scale,k=Je(s.headSize),b=s.headSize/k,$=12,S={x:Math.ceil(p/$),y:Math.ceil(s.sequenceLength/$),z:s.batchSize*s.numHeads},T=[{type:12,data:s.sequenceLength},{type:12,data:b},{type:12,data:p},{type:12,data:s.numHeads},{type:12,data:s.headSize},{type:1,data:w},{type:12,data:o},{type:12,data:s.kvSequenceLength},{type:12,data:v}],I=m&&a&&L.size(a.dims)>0,A=["type","type"];I&&A.push("type"),i&&A.push("type"),u&&A.push("type"),d&&A.push("type");let E=[{dims:f,dataType:t.dataType,gpuDataType:0}];m&&E.push({dims:_,dataType:t.dataType,gpuDataType:0});let B=U=>{let j=K("q",t.dataType,t.dims,k),W=K("key",r.dataType,r.dims,k),J=[j,W];if(I){let H=K("past_key",a.dataType,a.dims,k);J.push(H)}i&&J.push(K("attention_bias",i.dataType,i.dims));let P=u?K("seq_lens",u.dataType,u.dims):void 0;P&&J.push(P);let se=d?K("total_sequence_length_input",d.dataType,d.dims):void 0;se&&J.push(se);let ue=he("output",t.dataType,f),F=[ue];m&&F.push(he("present_key",t.dataType,_,k));let oe=bt(1,k),le=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;

  var<workgroup> tileQ: array<${j.type.storage}, ${$*$}>;
  var<workgroup> tileK: array<${j.type.storage}, ${$*$}>;
  ${U.registerUniforms(le).declareVariables(...J,...F)}
  ${U.mainStart([$,$,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${v===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${v===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Oo(P,se,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&m?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${oe}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&m?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${oe}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${ue.type.value} (sum * uniforms.alpha) + ${i?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${i!==void 0};${a!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:E,dispatchGroup:S,programUniforms:T}),getShaderSource:B}},Qm=(e,t,r,a,i,s,o=void 0,u=void 0)=>{let d=s+i.kvSequenceLength,p=i.nReps?i.nReps:1,f=i.vHiddenSize*p,m=e>1&&a,g=i.kvNumHeads?i.kvNumHeads:i.numHeads,_=m?[i.batchSize,g,d,i.headSize]:void 0,v=[i.batchSize,i.sequenceLength,f],w=12,k={x:Math.ceil(i.vHeadSize/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},b=[{type:12,data:i.sequenceLength},{type:12,data:d},{type:12,data:i.vHeadSize},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:f},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:p}],$=m&&a&&L.size(a.dims)>0,S=["type","type"];$&&S.push("type"),o&&S.push("type"),u&&S.push("type");let T=[{dims:v,dataType:t.dataType,gpuDataType:0}];m&&T.push({dims:_,dataType:t.dataType,gpuDataType:0});let I=A=>{let E=K("probs",t.dataType,t.dims),B=K("v",r.dataType,r.dims),U=[E,B];$&&U.push(K("past_value",a.dataType,a.dims));let j=o?K("seq_lens",o.dataType,o.dims):void 0;o&&U.push(j);let W=u?K("total_sequence_length_input",u.dataType,u.dims):void 0;u&&U.push(W);let J=[he("output",t.dataType,v)];m&&J.push(he("present_value",t.dataType,_));let P=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${E.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${E.type.value}, ${w*w}>;
  ${A.registerUniforms(P).declareVariables(...U,...J)}
  ${A.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Oo(j,W,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${$&&m?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${E.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${$&&m?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:T,dispatchGroup:k,programUniforms:b}),getShaderSource:I}},$o=(e,t,r,a,i,s,o,u,d,p,f=void 0,m=void 0)=>{let g=Math.min(e.outputCount,1+(o?1:0)+(u?1:0)),_=g>1?p.pastSequenceLength:0,v=_+p.kvSequenceLength,w=d&&L.size(d.dims)>0?d:void 0,k=[t,r];g>1&&o&&L.size(o.dims)>0&&k.push(o),w&&k.push(w),f&&k.push(f),m&&k.push(m);let b=e.compute(Zm(g,t,r,o,w,p,_,f,m),{inputs:k,outputs:g>1?[-1,1]:[-1]})[0];e.compute(Km(b,p.batchSize,p.numHeads,_,p.sequenceLength,v,f,m),{inputs:f&&m?[b,f,m]:[b],outputs:[]});let $=[b,a];g>1&&u&&L.size(u.dims)>0&&$.push(u),f&&$.push(f),m&&$.push(m),e.compute(Qm(g,b,a,u,p,_,f,m),{inputs:$,outputs:g>1?[0,2]:[0]})},Xm=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,i=t.inputHiddenSize,s=t.headSize,o=12,u={x:Math.ceil(t.headSize/o),y:Math.ceil(t.sequenceLength/o),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:a},{type:12,data:i},{type:12,data:s},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],f=m=>{let g=he("output_q",d[0].dataType,r),_=he("output_k",d[0].dataType,r),v=he("output_v",d[0].dataType,r),w=K("input",d[0].dataType,d[0].dims),k=K("weight",d[1].dataType,d[1].dims),b=K("bias",d[2].dataType,d[2].dims),$=w.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${o}u;
  var<workgroup> tileInput: array<${$}, ${o*o}>;
  var<workgroup> tileWeightQ: array<${$}, ${o*o}>;
  var<workgroup> tileWeightK: array<${$}, ${o*o}>;
  var<workgroup> tileWeightV: array<${$}, ${o*o}>;
  ${m.registerUniforms(S).declareVariables(w,k,b,g,_,v)}
  ${m.mainStart([o,o,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${$}(0);
    var valueK = ${$}(0);
    var valueV = ${$}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:p}),getShaderSource:f},{inputs:d,outputs:[-1,-1,-1]})},Gb=(e,t)=>{let r=Hm(e.inputs,t),[a,i,s]=Xm(e,r);return $o(e,a,i,s,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Jm,Ym,eg,Fb,qE=ee(()=>{mr(),we(),Te(),et(),ze(),Jm=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(a,i,s)=>{let o=i.length;if(o!==a.length)throw new Error(`${s}: num dimensions != ${o}`);i.forEach((u,d)=>{if(u!==a[d])throw new Error(`${s}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,a,"Invalid input scale"),r(e[2].dims,a,"Invalid input B"),r(e[3].dims,a,"Invalid input mean"),r(e[4].dims,a,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Ym=(e,t)=>{let{epsilon:r,spatial:a,format:i}=t,s=e[0].dims,o=a?Je(s[s.length-1]):1,u=i==="NHWC"&&s.length>1?o:1,d=L.size(s)/o,p=a,f=p?s.length:s,m=K("x",e[0].dataType,e[0].dims,o),g=K("scale",e[1].dataType,e[1].dims,u),_=K("bias",e[2].dataType,e[2].dims,u),v=K("inputMean",e[3].dataType,e[3].dims,u),w=K("inputVar",e[4].dataType,e[4].dims,u),k=he("y",e[0].dataType,f,o),b=()=>{let S="";if(a)S=`let cOffset = ${s.length===1?"0u":i==="NHWC"?`outputIndices[${s.length-1}] / ${o}`:"outputIndices[1]"};`;else if(i==="NCHW")S=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let T=1;T<g.rank;T++)S+=`cIndices[${T}] = outputIndices[${T}];`;S+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return S},$=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(m,g,_,v,w,k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${o}`)};
    ${b()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${v.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${o}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p?[{type:12,data:d},...ye(s)]:[{type:12,data:d}]})}},eg=e=>Le(e),Fb=(e,t)=>{let{inputs:r,outputCount:a}=e,i=eg({...t,outputCount:a});if(Ke.webgpu.validateInputContent&&Jm(r,i),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ym(r,i))}}),tg,rg,Hb,jE=ee(()=>{Te(),ze(),tg=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},rg=e=>{let t=e[0].dims,r=e[0].dims[2],a=L.size(t)/4,i=e[0].dataType,s=K("input",i,t,4),o=K("bias",i,[r],4),u=K("residual",i,t,4),d=he("output",i,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(s,o,u,d)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${s.getByOffset("global_idx")}
      + ${o.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},Hb=e=>{tg(e.inputs),e.compute(rg(e.inputs))}}),ag,Ue,Kb,Zb,Qb,Xb,Jb,Yb,e1,t1,r1,ig,a1,i1,n1,s1,Hs,o1,au,u1,l1,d1,p1,c1,h1,f1,m1,g1,y1,_1,v1,$1,w1,b1,x1,yp,k1,sh,oh,S1,T1,C1,ng,sg,I1,Yh=ee(()=>{we(),Te(),et(),ze(),ag=(e,t,r,a,i,s,o)=>{let u=Math.ceil(t/4),d="";typeof i=="string"?d=`${i}(a)`:d=i("a");let p=K("inputData",r,[u],4),f=he("outputData",a,[u],4),m=[{name:"vec_size",type:"u32"}];return o&&m.push(...o),`
      ${e.registerUniforms(m).declareVariables(p,f)}

  ${s??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${f.setByOffset("global_idx",d)}
  }`},Ue=(e,t,r,a,i,s=e.dataType,o,u)=>{let d=[{type:12,data:Math.ceil(L.size(e.dims)/4)}];return o&&d.push(...o),{name:t,shaderCache:{hint:i,inputDependencies:["type"]},getShaderSource:p=>ag(p,L.size(e.dims),e.dataType,s,r,a,u),getRunData:p=>({outputs:[{dims:e.dims,dataType:s}],dispatchGroup:{x:Math.ceil(L.size(p[0].dims)/64/4)},programUniforms:d})}},Kb=e=>{e.compute(Ue(e.inputs[0],"Abs","abs"))},Zb=e=>{e.compute(Ue(e.inputs[0],"Acos","acos"))},Qb=e=>{e.compute(Ue(e.inputs[0],"Acosh","acosh"))},Xb=e=>{e.compute(Ue(e.inputs[0],"Asin","asin"))},Jb=e=>{e.compute(Ue(e.inputs[0],"Asinh","asinh"))},Yb=e=>{e.compute(Ue(e.inputs[0],"Atan","atan"))},e1=e=>{e.compute(Ue(e.inputs[0],"Atanh","atanh"))},t1=e=>Le(e),r1=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Ue(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},ig=e=>{let t,r,a=e.length>=2&&e[1].data!==0,i=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,r=i?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,r=i?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Le({min:t,max:r})},a1=(e,t)=>{let r=t||ig(e.inputs),a=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"Clip",i=>`clamp(${i}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},i1=e=>{e.compute(Ue(e.inputs[0],"Ceil","ceil"))},n1=e=>{e.compute(Ue(e.inputs[0],"Cos","cos"))},s1=e=>{e.compute(Ue(e.inputs[0],"Cosh","cosh"))},Hs=e=>Le(e),o1=(e,t)=>{let r=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},au=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,u1=e=>{let t=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,au(t)))},l1=e=>{e.compute(Ue(e.inputs[0],"Exp","exp"))},d1=e=>{e.compute(Ue(e.inputs[0],"Floor","floor"))},p1=e=>{let t=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,au(t)))},c1=(e,t)=>{let r=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},h1=e=>{e.compute(Ue(e.inputs[0],"Not",t=>`!${t}`))},f1=e=>{e.compute(Ue(e.inputs[0],"Neg",t=>`-${t}`))},m1=e=>{e.compute(Ue(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},g1=e=>{let t=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},y1=e=>{e.compute(Ue(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},_1=e=>Le(e),v1=(e,t)=>{let r=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"HardSigmoid",a=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${a} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},$1=e=>{e.compute(Ue(e.inputs[0],"Sin","sin"))},w1=e=>{e.compute(Ue(e.inputs[0],"Sinh","sinh"))},b1=e=>{e.compute(Ue(e.inputs[0],"Sqrt","sqrt"))},x1=e=>{e.compute(Ue(e.inputs[0],"Tan","tan"))},yp=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,k1=e=>{e.compute(Ue(e.inputs[0],"Tanh",yp))},sh=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${yp("v")};
}
`,oh=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,S1=e=>{let t=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"FastGelu",oh,sh(t),void 0,e.inputs[0].dataType))},T1=(e,t)=>{let r=bt(e.inputs[0].dataType);return e.compute(Ue(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${r}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},C1=e=>{e.compute(Ue(e.inputs[0],"Log","log"))},ng=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,sg=e=>`quick_gelu_impl(${e})`,I1=(e,t)=>{let r=bt(e.inputs[0].dataType);e.compute(Ue(e.inputs[0],"QuickGelu",sg,ng(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),og,ug,E1,LE=ee(()=>{Te(),ze(),Yh(),og=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},ug=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=K("input",e[0].dataType,e[0].dims,4),a=K("bias",e[0].dataType,[e[0].dims[2]],4),i=he("output",e[0].dataType,t,4),s=L.size(t)/4,o=dt(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,a,i)}

  ${au(o)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${i.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},E1=e=>{og(e.inputs),e.compute(ug(e.inputs))}}),lg,dg,rr,z1,A1,O1,R1,B1,N1,M1,D1,P1,U1,GE=ee(()=>{we(),Te(),ze(),lg=(e,t,r,a,i,s,o,u,d,p,f,m)=>{let g,_;typeof u=="string"?g=_=($,S)=>`${u}((${$}),(${S}))`:typeof u=="function"?g=_=u:(g=u.scalar,_=u.vector);let v=he("outputData",f,a.length,4),w=K("aData",d,t.length,4),k=K("bData",p,r.length,4),b;if(i)if(s){let $=L.size(t)===1,S=L.size(r)===1,T=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;$||S?b=v.setByOffset("global_idx",_($?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),S?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):b=`
            let outputIndices = ${v.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",v)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",v)};
            ${v.setByOffset("global_idx",_(o||T?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,o||I?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else b=v.setByOffset("global_idx",_(w.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let $=(S,T,I="")=>{let A=`aData[indexA${T}][componentA${T}]`,E=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${v.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${w.broadcastedIndicesToOffset(`outputIndices${T}`,v)};
            let offsetB${T} = ${k.broadcastedIndicesToOffset(`outputIndices${T}`,v)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${S}[${T}] = ${I}(${g(A,E)});
          `};f===9?b=`
            var data = vec4<u32>(0);
            ${$("data",0,"u32")}
            ${$("data",1,"u32")}
            ${$("data",2,"u32")}
            ${$("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:b=`
            ${$("outputData[global_idx]",0)}
            ${$("outputData[global_idx]",1)}
            ${$("outputData[global_idx]",2)}
            ${$("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,k,v)}

        ${m??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${b}
      }`},dg=(e,t,r,a,i,s,o=r.dataType)=>{let u=r.dims.map(w=>Number(w)??1),d=a.dims.map(w=>Number(w)??1),p=!L.areEqual(u,d),f=u,m=L.size(u),g=!1,_=!1,v=[p];if(p){let w=ui.calcShape(u,d,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");f=w.slice(),m=L.size(f);let k=L.size(u)===1,b=L.size(d)===1,$=u.length>0&&u[u.length-1]%4===0,S=d.length>0&&d[d.length-1]%4===0;v.push(k),v.push(b),v.push($),v.push(S);let T=1;for(let I=1;I<f.length;I++){let A=u[u.length-I],E=d[d.length-I];if(A===E)T*=A;else break}T%4===0?(_=!0,g=!0):(k||b||$||S)&&(g=!0)}else g=!0;return v.push(g),{name:e,shaderCache:{hint:t+v.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>lg(w,u,d,f,g,p,_,i,r.dataType,a.dataType,o,s),getRunData:()=>({outputs:[{dims:f,dataType:o}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(L.size(f)/4)},...ye(u,d,f)]})}},rr=(e,t,r,a,i,s)=>{e.compute(dg(t,i??"",e.inputs[0],e.inputs[1],r,a,s))},z1=e=>{rr(e,"Add",(t,r)=>`${t}+${r}`)},A1=e=>{rr(e,"Div",(t,r)=>`${t}/${r}`)},O1=e=>{rr(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},R1=e=>{rr(e,"Mul",(t,r)=>`${t}*${r}`)},B1=e=>{let t=K("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;rr(e,"Pow",{scalar:(r,a)=>`pow_custom(${r},${a})`,vector:(r,a)=>`pow_vector_custom(${r},${a})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},N1=e=>{rr(e,"Sub",(t,r)=>`${t}-${r}`)},M1=e=>{rr(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},D1=e=>{rr(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},P1=e=>{rr(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},U1=e=>{rr(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),pg,cg,hg,fg,W1,V1,FE=ee(()=>{we(),Te(),et(),ze(),pg=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,a=e[r],i=a.dataType,s=a.dims.length;e.forEach((o,u)=>{if(u!==r){if(o.dataType!==i)throw new Error("input tensors should be one type");if(o.dims.length!==s)throw new Error("input tensors should have the same shape");o.dims.forEach((d,p)=>{if(p!==t&&d!==a.dims[p])throw new Error("non concat dimensions must match")})}})},cg=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,hg=(e,t)=>{let r=e.length,a=[];for(let i=0;i<r;++i){let s=t.setByOffset("global_idx",e[i].getByIndices("indices"));r===1?a.push(s):i===0?a.push(`if (inputIndex == ${i}u) { ${s} }`):i===r-1?a.push(`else { ${s} }`):a.push(`else if (inputIndex == ${i}) { ${s} }`)}return a.join(`
`)},fg=(e,t,r,a)=>{let i=L.size(r),s=new Array(e.length),o=new Array(e.length),u=0,d=[],p=[],f=[{type:12,data:i}];for(let w=0;w<e.length;++w)u+=e[w].dims[t],s[w]=u,p.push(e[w].dims.length),o[w]=K(`input${w}`,a,p[w]),d.push("rank"),f.push({type:12,data:s[w]});for(let w=0;w<e.length;++w)f.push(...ye(e[w].dims));f.push(...ye(r));let m=he("output",a,r.length),g=m.indicesGet("indices",t),_=Array.from(Array(s.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),v=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)w.registerUniform(`sizeInConcatAxis${k}`,"u32");return w.declareVariables(...o,m)})()}

  ${cg(s.length,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${hg(o,m)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f}),getShaderSource:v}},W1=(e,t)=>{let r=e.inputs,a=r[0].dims,i=L.normalizeAxis(t.axis,a.length);pg(r,i);let s=a.slice();s[i]=r.reduce((u,d)=>u+(d.dims.length>i?d.dims[i]:0),0);let o=r.filter(u=>L.size(u.dims)>0);e.compute(fg(o,i,s,r[0].dataType),{inputs:o})},V1=e=>Le({axis:e.axis})}),Wa,Va,qa,ef,Ha=ee(()=>{we(),Te(),Wa=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Va=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},qa=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},ef=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,a]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:a}}else if(t==="Clip"){let[r,a]=e?.activation_params||[yb,_b];return{activation:t,clipMax:a,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ct,q1,tf=ee(()=>{ct=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},q1=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),j1,HE=ee(()=>{j1=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Ys,rf,af=ee(()=>{we(),Te(),ze(),Ha(),Ys=(e,t,r,a,i)=>{let s=a-r;return`
      ${Array.from({length:r}).map((o,u)=>`
      if (${me(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,me(i,u+s,a))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},rf=(e,t,r,a,i=!1,s)=>{let o=e[0].dims,u=e[1].dims,d=o[o.length-2],p=u[u.length-1],f=o[o.length-1],m=Je(p),g=Je(f),_=Je(d),v=L.size(r)/m/_,w=e.length>2,k=a?a.slice(0,-2):r.slice(0,-2),b=[L.size(k),d,p],$=[{type:12,data:v},{type:12,data:d},{type:12,data:p},{type:12,data:f}];Va(t,$),$.push(...ye(k,o,u)),w&&$.push(...ye(e[2].dims)),$.push(...ye(b));let S=T=>{let I=Qh("batch_dims",e[0].dataType,k.length),A=K("a",e[0].dataType,o.length,g),E=K("b",e[1].dataType,u.length,m),B=he("output",e[0].dataType,b.length,m),U=dt(B.type.tensor),j=Wa(t,B.type.value,U),W=[A,E],J="";if(w){let ue=i?m:1;W.push(K("bias",e[2].dataType,e[2].dims.length,ue)),J=`${i?`value += bias[col / ${ue}];`:`value += ${B.type.value}(bias[row + i]);`}`}let P=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];qa(t,P);let se=()=>{let ue=`var a_data: ${A.type.value};`;for(let F=0;F<g;F++)ue+=`
              let b_data${F} = b[(b_offset + (k + ${F}) * uniforms.N + col) / ${m}];`;for(let F=0;F<_;F++){ue+=`a_data = a[(a_offset + (row + ${F}) * uniforms.K + k) / ${g}];`;for(let oe=0;oe<g;oe++)ue+=`
            values[${F}] = fma(${E.type.value}(a_data${g===1?"":`[${oe}]`}), b_data${oe}, values[${F}]);
`}return ue};return`
  ${T.registerUniforms(P).registerInternalVariables(I).declareVariables(...W,B)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${Ys("a_indices",A,A.rank-2,I.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${E.type.indices};
    ${Ys("b_indices",E,E.rank-2,I.rank,"batch_indices")}
    ${E.indicesSet("b_indices",E.rank-2,0)}
    ${E.indicesSet("b_indices",E.rank-1,0)}
    let b_offset = ${E.indicesToOffset("b_indices")};
    var values: array<${B.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${se()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${J}
      ${j}
      let cur_indices = ${B.type.indices}(batch, row + i, col);
      let offset = ${B.indicesToOffset("cur_indices")};
      ${B.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${g};${_};${i}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:$}),getShaderSource:S}}}),mg,gg,uh,_p,yg,lh,_g,$u,nf=ee(()=>{we(),Te(),ze(),Ha(),af(),tf(),mg=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,gg=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,uh=(e,t,r="f32",a,i=!1,s=32,o=!1,u=32)=>{let d=t[1]*e[1],p=t[0]*e[0],f=i?d:s,m=i?s:d,g=f/t[0],_=s/t[1];if(!((i&&g===4&&e[1]===4||!i&&(g===3||g===4))&&f%t[0]===0&&s%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${i} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${f/g}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${s}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${mg(i,a)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${a?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${gg(i,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},_p=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,yg=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",lh=(e,t,r="f32",a,i=!1,s=32,o=!1,u=32,d=!1)=>{let p=e[1]*t[1],f=e[0]*t[0],m=i?p:s,g=i?s:p;if(!(g%t[1]===0&&m%t[0]===0&&s%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}, tileInner ${s} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],v=m/t[0],w=s/t[1],k=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          ${_p(i,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${a?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${i?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${v};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${v}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${_p(i,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${a?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${yg(i)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${m}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${f}>, ${s}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},_g=(e,t,r,a,i=!1)=>{let[s,o,u,d]=a,p=dt(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ct(e,p)} {
      var value = ${ct(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${Ys("aIndices",o,o.rank-2,s.rank,"batchIndices")}
        ${o.indicesSet("aIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("aIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ct(e,p)} {
      var value = ${ct(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Ys("bIndices",u,u.rank-2,s.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ct(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?"bias[colIn]":`${ct(e,p)}(bias[row])`};`:""}
        ${r}
        ${d.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},$u=(e,t,r,a,i=!1,s)=>{let o=e[0].dims,u=e[1].dims,d=o.slice(0,-2),p=u.slice(0,-2),f=a?a.slice(0,-2):r.slice(0,-2),m=L.size(f),g=o[o.length-2],_=o[o.length-1],v=u[u.length-1],w=_%4===0&&v%4===0,k=g<=8?[4,1,1]:[4,4,1],b=[8,8,1],$=[Math.ceil(v/b[0]/k[0]),Math.ceil(g/b[1]/k[1]),Math.ceil(m/b[2]/k[2])],S=w?4:1,T=[...d,g,_/S],I=T.length,A=[...p,_,v/S],E=A.length,B=[m,g,v/S],U=[{type:6,data:g},{type:6,data:v},{type:6,data:_}];Va(t,U),U.push(...ye(f,T,A));let j=["rank","rank"],W=e.length>2;W&&(U.push(...ye(e[2].dims)),j.push("rank")),U.push(...ye(B));let J=P=>{let se=f.length,ue=Qh("batchDims",e[0].dataType,se,1),F=dt(e[0].dataType),oe=K("a",e[0].dataType,I,S),le=K("b",e[1].dataType,E,S),H=he("result",e[0].dataType,B.length,S),de=[oe,le];if(W){let Ie=i?S:1;de.push(K("bias",e[2].dataType,e[2].dims.length,Ie))}let M=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];qa(t,M);let V=dt(H.type.tensor),R=Wa(t,H.type.value,V),X=_g(S,W,R,[ue,oe,le,H],i);return`
  ${P.registerUniforms(M).registerInternalVariables(ue).declareVariables(...de,H)}
  ${X}
  ${w?uh(k,b,F,ue):lh(k,b,F,ue)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${w};${i}`,inputDependencies:j},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:$[0],y:$[1],z:$[2]},programUniforms:U}),getShaderSource:J}}}),vg,L1,KE=ee(()=>{we(),Pr(),ze(),Ha(),tf(),HE(),nf(),vg=(e,t,r,a,i=!1,s,o=4,u=4,d=4,p="f32")=>{let f=U=>{switch(U){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},m=U=>{switch(U){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,v=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",b=e?"col":"row",$=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${b} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${b} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${b} % inChannels;
    var resData = ${ct(o,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${v} && xCol >= 0 && xCol < ${w}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(o)}
    }
    return resData;`,S=e?t&&a?`
    let col = colIn * ${o};
    ${$}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${$}
    }
    return ${ct(o,p)}(0.0);`:a&&r?`
    let col = colIn * ${o};
    ${$}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${$}
    }
    return ${ct(o,p)}(0.0);`,T=e?a&&r?m(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(u)}
    }
    return ${ct(u,p)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(u)}
    }
    return ${ct(u,p)}(0.0);`,I=ct(d,p),A=ct(e?o:u,p),E=ct(e?u:o,p),B=Wa(s,I,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?S:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?T:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${q1(i)}
      ${B}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},L1=(e,t,r,a,i,s,o,u,d)=>{let p=t.format==="NHWC",f=p?e[0].dims[3]:e[0].dims[1],m=r[0],g=p?r[2]:r[3],_=p?r[1]:r[2],v=p?r[3]:r[1],w=p&&(f%4===0||f%3===0)&&v%4===0,k=p?v:g*_,b=p?g*_:v,$=[8,8,1],S=a<=8?[4,1,1]:[4,4,1],T=[Math.ceil(k/$[0]/S[0]),Math.ceil(b/$[1]/S[1]),Math.ceil(m/$[2]/S[2])];De("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let I=w?p&&f%4!==0?3:4:1,A=$[1]*S[1],E=$[0]*S[0],B=Math.max($[0]*I,$[1]),U=a%A===0,j=i%E===0,W=s%B===0,J=w?[I,4,4]:[1,1,1],P=[{type:6,data:a},{type:6,data:i},{type:6,data:s},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Va(t,P),P.push(...ye(e[0].dims,e[1].dims));let se=["rank","rank"];o&&(P.push(...ye(e[2].dims)),se.push("rank")),P.push(...ye(r));let ue=F=>{let oe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];qa(t,oe);let le=w?4:1,H=dt(e[0].dataType),de=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${H}>`:H}) {
        result[flatIndex] = ${w?`vec4<${H}>`:H}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${H}>`:H}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,M=K("x",e[0].dataType,e[0].dims.length,I===3?1:I),V=K("w",e[1].dataType,e[1].dims.length,le),R=[M,V],X=he("result",e[0].dataType,r.length,le);if(o){let Ie=K("bias",e[2].dataType,e[2].dims.length,le);R.push(Ie),de+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${H}>`:H} {
          return bias[coords.${p?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${j1("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${F.registerUniforms(oe).declareVariables(...R,X)}
        ${de}
        ${vg(p,U,j,W,o,t,J[0],J[1],J[2],H)}
        ${w?uh(S,$,H,void 0,!p,B):lh(S,$,H,void 0,!p,B,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${w};${U};${j};${W};${A};${E};${B}`,inputDependencies:se},getRunData:()=>({outputs:[{dims:d?d(r):r,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:P}),getShaderSource:ue}}}),$g,vp,Cs,wg,$p,bg,G1,F1,ZE=ee(()=>{we(),Pr(),Te(),ze(),Ha(),tf(),$g=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},vp=e=>typeof e=="number"?[e,e,e]:e,Cs=(e,t)=>t<=1?e:e+(e-1)*(t-1),wg=(e,t,r,a=1)=>{let i=Cs(t,a);return Math.floor((e[0]*(r-1)-r+i)/2)},$p=(e,t,r,a,i)=>{i==null&&(i=wg(e,t[0],a[0]));let s=[0,0,0,r];for(let o=0;o<3;o++)e[o]+2*i>=t[o]&&(s[o]=Math.trunc((e[o]-t[o]+2*i)/a[o]+1));return s},bg=(e,t,r,a,i,s,o,u,d,p)=>{let f,m,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e};let v=$p([t,r,a,1],[u,d,p],1,[i,s,o],e);m=v[0],g=v[1],_=v[2]}else if(Array.isArray(e)){if(!e.every((w,k,b)=>w===b[0]))throw Error(`Unsupported padding parameter: ${e}`);f={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let v=$p([t,r,a,1],[u,d,p],1,[i,s,o],e[0]);m=v[0],g=v[1],_=v[2]}else if(e==="SAME_UPPER"){m=Math.ceil(t/i),g=Math.ceil(r/s),_=Math.ceil(a/o);let v=(m-1)*i+u-t,w=(g-1)*s+d-r,k=(_-1)*o+p-a,b=Math.floor(v/2),$=v-b,S=Math.floor(w/2),T=w-S,I=Math.floor(k/2),A=k-I;f={top:S,bottom:T,left:I,right:A,front:b,back:$}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:m,outHeight:g,outWidth:_}},G1=(e,t,r,a,i,s=!1,o="channelsLast")=>{let u,d,p,f,m;if(o==="channelsLast")[u,d,p,f,m]=e;else if(o==="channelsFirst")[u,m,d,p,f]=e;else throw new Error(`Unknown dataFormat ${o}`);let[g,,_,v,w]=t,[k,b,$]=vp(r),[S,T,I]=vp(a),A=Cs(_,S),E=Cs(v,T),B=Cs(w,I),{padInfo:U,outDepth:j,outHeight:W,outWidth:J}=bg(i,d,p,f,k,b,$,A,E,B),P=s?g*m:g,se=[0,0,0,0,0];return o==="channelsFirst"?se=[u,P,j,W,J]:o==="channelsLast"&&(se=[u,j,W,J,P]),{batchSize:u,dataFormat:o,inDepth:d,inHeight:p,inWidth:f,inChannels:m,outDepth:j,outHeight:W,outWidth:J,outChannels:P,padInfo:U,strideDepth:k,strideHeight:b,strideWidth:$,filterDepth:_,filterHeight:v,filterWidth:w,effectiveFilterDepth:A,effectiveFilterHeight:E,effectiveFilterWidth:B,dilationDepth:S,dilationHeight:T,dilationWidth:I,inShape:e,outShape:se,filterShape:t}},F1=(e,t,r,a,i,s)=>{let o=s==="channelsLast";o?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],d={x:r.map((k,b)=>b)},p=[Math.ceil($g(d.x.map(k=>r[k]))/u[0]),1,1];De("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let f=1,m=L.size(r),g=[{type:12,data:m},{type:12,data:a},{type:12,data:i},{type:12,data:t.strides},{type:12,data:t.dilations}];Va(t,g),g.push(...ye(e[0].dims,e[1].dims));let _=["rank","rank"],v=e.length===3;v&&(g.push(...ye(e[2].dims)),_.push("rank")),g.push(...ye(r));let w=k=>{let b=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:i.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];qa(t,b);let $=1,S=dt(e[0].dataType),T=K("x",e[0].dataType,e[0].dims.length,f),I=K("W",e[1].dataType,e[1].dims.length,$),A=[T,I],E=he("result",e[0].dataType,r.length,$),B="";if(v){let W=K("bias",e[2].dataType,e[2].dims.length,$);A.push(W),B+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${S} {
          return bias[${o?me("coords",4,5):me("coords",1,5)}];
        }`}let U=ct(f,S),j=Wa(t,U,S);return`
            ${B}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
          ${k.registerUniforms(b).declareVariables(...A,E)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${E.offsetToIndices("global_idx")};
              let batch = ${me("coords",0,T.rank)};
              let d2 = ${o?me("coords",T.rank-1,T.rank):me("coords",1,T.rank)};
              let xFRCCorner = vec3<u32>(${o?me("coords",1,T.rank):me("coords",2,T.rank)},
              ${o?me("coords",2,T.rank):me("coords",3,T.rank)},
              ${o?me("coords",3,T.rank):me("coords",4,T.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?me("uniforms.x_shape",1,T.rank):me("uniforms.x_shape",2,T.rank)};
              let xShapeZ = ${o?me("uniforms.x_shape",2,T.rank):me("uniforms.x_shape",3,T.rank)};
              let xShapeW = ${o?me("uniforms.x_shape",3,T.rank):me("uniforms.x_shape",4,T.rank)};
              let xShapeU = ${o?me("uniforms.x_shape",4,T.rank):me("uniforms.x_shape",1,T.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${o?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${o?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${v?"value = value + getBiasByOutputCoords(coords)":""};
              ${j}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${o};${f};${v}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:g}),getShaderSource:w}}}),H1,K1,QE=ee(()=>{we(),Te(),ze(),Ha(),H1=(e,t,r,a)=>{let i=e.length>2,s=i?"value += b[output_channel];":"",o=e[0].dims,u=e[1].dims,d=t.format==="NHWC",p=d?r[3]:r[1],f=p/t.group,m=d&&f>=4?Je(p):1,g=L.size(r)/m,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:f}];Va(t,_),_.push(...ye(o,[u[0],u[1],u[2],u[3]/m]));let v=i?["rank","rank","rank"]:["rank","rank"];_.push(...ye([r[0],r[1],r[2],r[3]/m]));let w=k=>{let b=he("output",e[0].dataType,r.length,m),$=dt(b.type.tensor),S=Wa(t,b.type.value,$),T=K("x",e[0].dataType,o.length),I=K("w",e[1].dataType,u.length,m),A=[T,I];i&&A.push(K("b",e[2].dataType,e[2].dims,m));let E=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];qa(t,E);let B=d?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(E).declareVariables(...A,b)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${b.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d?2:1}];

    var value: ${b.type.value} = ${b.type.value}(0);
    ${B}
    ${s}
    ${S}
    ${b.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${m}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},K1=(e,t,r,a)=>{let i=e.length>2,s=Je(r[3]),o=Je(r[2]),u=L.size(r)/s/o,d=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/s],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/s],f=[r[0],r[1],r[2],r[3]/s],m=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Va(t,m),m.push(...ye(d,p,f));let g=(o-1)*t.strides[1]+p[1],_=v=>{let w=he("output",e[0].dataType,f.length,s),k=dt(w.type.tensor),b=Wa(t,w.type.value,k),$=K("x",e[0].dataType,d.length,s),S=K("w",e[1].dataType,p.length,s),T=[$,S];i&&T.push(K("b",e[2].dataType,e[2].dims,s));let I=i?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return qa(t,A),`
  ${v.registerUniforms(A).declareVariables(...T,w)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${$.type.value}, ${g}>;
    var values: array<${w.type.value}, ${o}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${$.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${$.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${I}
      ${b}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${s};${o};${g};${p[0]};${p[1]}`,inputDependencies:i?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:_}}}),xg,Ro,kg,Bo,dh,wp,Sg,Tg,ph,XE=ee(()=>{Te(),KE(),ZE(),nf(),QE(),Ha(),af(),Qr(),xg=(e,t,r,a,i,s)=>{let o=e[0],u=e.slice(s?1:2,s?3:4),d=u.length,p=t[0],f=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),m=u.map((g,_)=>g+a[_]+a[_+d]).map((g,_)=>Math.floor((g-f[_]+i[_])/i[_]));return m.splice(0,0,o),m.splice(s?3:1,0,p),m},Ro=[2,3,1,0],kg=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Bo=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let s=2;s<t[1].dims.length;++s)r[s-2]===0&&(r[s-2]=t[1].dims[s]);let a=e.pads.slice();_u.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,a,e.format==="NHWC",e.autoPad);let i=Object.assign({},e);return Object.assign(i,{kernelShape:r,pads:a}),i},dh=e=>{let t=ef(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],i=e.dilations,s=e.group,o=e.kernel_shape,u=e.pads,d=e.strides,p=e.w_is_const();return{autoPad:a,format:r,dilations:i,group:s,kernelShape:o,pads:u,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},wp=(e,t,r,a)=>{let i=r.format==="NHWC",s=xg(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,i);if(r.group!==1){let A=[t[0]];if(i){let E=e.kernelCustomData.wT??e.compute(Nt(t[1],Ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=E),A.push(E)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&i&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(K1(A,r,s,a),{inputs:A}):e.compute(H1(A,r,s,a),{inputs:A});return}let o=t.length===3,u=t[0].dims[i?1:2],d=t[0].dims[i?2:3],p=t[0].dims[i?3:1],f=t[1].dims[2],m=t[1].dims[3],g=s[i?1:2],_=s[i?2:3],v=s[i?3:1],w=i&&f===u&&m===d&&r.pads[0]===0&&r.pads[1]===0;if(w||f===1&&m===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=s[0],E,B,U,j=[];if(i){let P=e.kernelCustomData.wT??e.compute(Nt(t[1],Ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=P),w){let se=u*d*p;E=t[0].reshape([1,A,se]),B=P.reshape([1,se,v]),U=[1,A,v]}else E=t[0].reshape([A,u*d,p]),B=P.reshape([1,p,v]),U=[A,g*_,v];j.push(E),j.push(B)}else E=t[0].reshape([A,p,u*d]),B=t[1].reshape([1,v,p]),U=[A,v,g*_],j.push(B),j.push(E);o&&j.push(t[2]);let W=U[2],J=j[0].dims[j[0].dims.length-1];W<8&&J<8?e.compute(rf(j,r,s,U,i,a),{inputs:j}):e.compute($u(j,r,s,U,i,a),{inputs:j});return}let k=!0,b=e.kernelCustomData.wT??e.compute(Nt(t[1],Ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=b);let $=[t[0],b];o&&$.push(t[2]);let S=i?g*_:v,T=i?v:g*_,I=f*m*p;e.compute(L1($,r,s,S,T,I,o,k,a),{inputs:$})},Sg=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let i=[0,t.pads[0],0,t.pads[1]],s=[1].concat(t.strides),o=[1].concat(t.dilations),u=[1].concat(t.kernelShape),d=Bo({...t,pads:i,strides:s,dilations:o,kernelShape:u},a);wp(e,a,d,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},Tg=(e,t,r)=>{let a=r.format==="NHWC"?"channelsLast":"channelsFirst",i=Bo(r,t),s=r.autoPad==="NOTSET"?r.pads:r.autoPad,o=G1(t[0].dims,t[1].dims,r.strides,r.dilations,s,!1,a);e.compute(F1(t,i,o.outShape,[o.filterDepth,o.filterHeight,o.filterWidth],[o.padInfo.front,o.padInfo.top,o.padInfo.left],a))},ph=(e,t)=>{if(kg(e.inputs,t),e.inputs[0].dims.length===3)Sg(e,t);else if(e.inputs[0].dims.length===5)Tg(e,e.inputs,t);else{let r=Bo(t,e.inputs);wp(e,e.inputs,r)}}}),Z1,JE=ee(()=>{we(),Pr(),Te(),ze(),Z1=(e,t,r)=>{let a=e.length>2,i=t.outputShape,s=t.format==="NHWC",o=t.group,u=e[1].dims,d=u[2]/o,p=u[3],f=s?Je(d):1,m=s?Je(p):1,g=s?p===1?f:m:1,_=L.size(i)/m,v=[Math.ceil(_/64),1,1];De("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],b=[t.kernelShape[s?1:2],t.kernelShape[s?2:3]],$=[t.dilations[0],t.dilations[1]],S=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[s?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[s?2:3]-1)*(t.dilations[1]-1))],T=[S[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),S[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],I=[{type:12,data:_},{type:12,data:k},{type:12,data:b},{type:12,data:$},{type:12,data:S},{type:6,data:T},{type:12,data:d},{type:12,data:p},...ye(e[0].dims,e[1].dims)];a&&(I.push(...ye(e[2].dims)),w.push("rank")),I.push(...ye(i));let A=E=>{let B=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:b.length},{name:"dilations",type:"u32",length:b.length},{name:"effective_filter_dims",type:"u32",length:S.length},{name:"pads",type:"i32",length:T.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],U=dt(e[0].dataType),j=s?1:2,W=s?2:3,J=s?3:1,P=K("W",e[1].dataType,e[1].dims.length,g),se=K("Dy",e[0].dataType,e[0].dims.length,f),ue=[se,P];a&&ue.push(K("bias",e[2].dataType,[i[J]].length,m));let F=he("result",e[0].dataType,i.length,m),oe=()=>{let H="";if(f===1)H+=`
        let w_offset = ${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
        let wValue = ${P.getByOffset(`w_offset / ${g}`)};
        dotProd = dotProd + xValue * wValue;`;else if(p===1)H+=`
          let wValue = ${P.getByOffset(`${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)} / ${g}`)};
          dotProd = dotProd + dot(xValue, wValue);`;else for(let de=0;de<f;de++)H+=`
            let wValue${de} = ${P.getByOffset(`${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${de}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${de}] * wValue${de};`;return H},le=`
            let outputIndices = ${F.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${F.indicesGet("outputIndices",0)};
            let d1 = ${F.indicesGet("outputIndices",J)};
            let r = ${F.indicesGet("outputIndices",j)};
            let c = ${F.indicesGet("outputIndices",W)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${F.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${U}(dyRCorner) + ${U}(wR)) / ${U}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${U}(uniforms.Dy_shape[${j}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }

              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${U}(dyCCorner) + ${U}(wC)) / ${U}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${U}(uniforms.Dy_shape[${W}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + ${f}) {
                  let xValue = ${s?se.getByOffset(`${se.indicesToOffset(`${se.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f}`):se.get("batch","inputChannel","idyR","idyC")};
                  ${oe()}
                  inputChannel = inputChannel + ${f};
                }
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${m}]`:""};
            ${F.setByOffset("global_idx","value")};
          `;return`
    ${E.registerUniforms(B).declareVariables(...ue,F)}
      ${E.mainStart()}
      ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${le}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${f}${g}${m}${p===1}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(i):i,dataType:e[0].dataType}],programUniforms:I}),getShaderSource:A}}}),Cg,Ig,Eg,bp,Q1,zg,xp,Ag,X1,YE=ee(()=>{JE(),Ha(),Qr(),Cg=(e,t,r,a,i,s)=>(e-1)*t+r+(a-1)*i+1-s,Ig=(e,t,r,a,i)=>{let s=Math.floor(e/2);t==="SAME_UPPER"?(r[a]=s,r[i]=e-s):t==="SAME_LOWER"&&(r[a]=e-s,r[i]=s)},Eg=(e,t,r,a,i,s,o,u,d,p)=>{let f=e.length-2,m=p.length===0;d.length<f&&d.push(...Array(f-d.length).fill(0));let g=e[0],_=t[u?3:1]*i;for(let v=0,w=e.length-f-(u?1:0);v<f;++v,++w){let k=e[w],b=m?k*o[v]:p[v],$=Cg(k,o[v],s[v],t[w],r[v],b);Ig($,a,s,v,v+f),m&&p.push(o[v]*(k-1)+d[v]+(t[w]-1)*r[v]+1-s[v]-s[v+f])}p.splice(0,0,g),p.splice(u?3:1,0,_)},bp=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((m,g)=>m*g,1)===0){r.length=0;for(let m=2;m<t[1].dims.length;++m)r.push(t[1].dims[m])}let a=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(a?3:1,0,t[1].dims[1]);let i=e.pads.slice(),s=e.outputShape.slice(),o=e.outputPadding.slice(),u=t[0].dims,d=e.dilations.slice();if(d.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;d=new Array(m).fill(1)}let p=e.strides.slice();if(p.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;p=new Array(m).fill(1)}Eg(u,r,d,e.autoPad,e.group,i,p,a,o,s);let f=Object.assign({},e);return Object.assign(f,{kernelShape:r,pads:i,outputPadding:o,outputShape:s,dilations:d,strides:p}),f},Q1=e=>{let t=ef(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],i=e.dilations,s=e.group,o=e.kernelShape,u=e.pads,d=e.strides,p=e.wIsConst(),f=e.outputPadding,m=e.outputShape;return{autoPad:a,format:r,dilations:i,group:s,kernelShape:o,outputPadding:f,outputShape:m,pads:u,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},zg=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let i=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==i))throw new Error("invalid bias");let s=e[0].dims.length-2;if(t.dilations.reduce((o,u)=>o+u,0)>0&&t.dilations.length!==s)throw new Error(`dilations should be ${s}D`);if(t.strides.reduce((o,u)=>o+u,0)>0&&t.strides.length!==s)throw new Error(`strides should be ${s}D`);if(t.pads.reduce((o,u)=>o+u,0)>0&&t.pads.length!==s*2)throw new Error(`pads should be ${s*2}D`);if(t.outputPadding.length!==s&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${s}D`);if(t.kernelShape.reduce((o,u)=>o+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},xp=(e,t,r,a)=>{let i=e.kernelCustomData.wT??e.compute(Nt(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=i);let s=[t[0],i];t.length===3&&s.push(t[2]),e.compute(Z1(s,r,a),{inputs:s})},Ag=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let i=t.kernelShape;(i.length===0||i[0]===0)&&(i=[e.inputs[1].dims[2]]);let s=t.dilations;(s.length===0||s[0]===0)&&(s=[1]);let o=t.strides;(o.length===0||o[0]===0)&&(o=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],o=[1].concat(o),s=[1].concat(s),i=[1].concat(i);let d=t.outputPadding;d=[0].concat(d);let p=bp({...t,pads:u,strides:o,dilations:s,kernelShape:i,outputPadding:d},a);xp(e,a,p,f=>r?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},X1=(e,t)=>{if(zg(e.inputs,t),e.inputs[0].dims.length===3)Ag(e,t);else{let r=bp(t,e.inputs);xp(e,e.inputs,r)}}}),Og,J1,Y1,ez=ee(()=>{we(),Te(),et(),ze(),Og=(e,t,r,a)=>{let i=L.size(t),s=t.length,o=K("input",e,s),u=he("output",e,s),d=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=L.normalizeAxis(d,s),f=m=>{let g=` i32(${o.indicesGet("inputIndices","uniforms.axis")}) `,_=me("uniforms.input_shape","uniforms.axis",s),v=a.reverse?g+(a.exclusive?" + 1":""):"0",w=a.reverse?_:g+(a.exclusive?"":" + 1");return`
                ${m.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(o,u)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${v};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${o.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${o.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},{type:12,data:p},...ye(t,t)]}),getShaderSource:f}},J1=(e,t)=>{let r=e.inputs[0].dims,a=e.inputs[0].dataType,i=e.inputs[1];e.compute(Og(a,r,i,t),{inputs:[0]})},Y1=e=>{let t=e.exclusive===1,r=e.reverse===1;return Le({exclusive:t,reverse:r})}}),Rg,Bg,Ng,e2,t2,tz=ee(()=>{we(),Te(),et(),ze(),Rg=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Bg=(e,t,r,a)=>{let i=[];i.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let s=0;s<t;++s)i.push(r.indicesSet("a",e[s],`i[${s}]`));return i.push("return a;}"),i.join(`
`)},Ng=(e,t)=>{let r,a,i,s,o,u,d=t.format==="NHWC",p=t.blocksize,f=t.mode==="DCR";d?([r,a,i,s]=e.dims,o=f?[r,a,i,p,p,s/p**2]:[r,a,i,s/p**2,p,p],u=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,a,i,s]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],o=f?[r,p,p,s/p**2,a,i]:[r,s/p**2,p,p,a,i],u=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let m=e.reshape(o),g=m.dims.length,_=e.dataType,v=K("a",_,g),w=he("output",_,g),k=b=>`
  ${b.registerUniform("output_size","u32").declareVariables(v,w)}

  ${Bg(u,g,v,w)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",v.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:b=>{let $=d?[r,a*p,i*p,s/p**2]:[r,s/p**2,a*p,i*p],S=L.size($),T=m.dims,I=L.sortBasedOnPerm(T,u);return{outputs:[{dims:$,dataType:b[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...ye(T,I)]}},getShaderSource:k}},e2=(e,t)=>{Rg(e.inputs),e.compute(Ng(e.inputs[0],t))},t2=e=>Le({blocksize:e.blocksize,mode:e.mode,format:e.format})}),No,Is,kp,Mg,Dg,Pg,Ug,Sp,Wg,r2,a2,rz=ee(()=>{we(),Te(),et(),ze(),No="[a-zA-Z]|\\.\\.\\.",Is="("+No+")+",kp="^"+Is+"$",Mg="("+Is+",)*"+Is,Dg="^"+Mg+"$",Pg=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},Ug=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,a]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Dg)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let o=e[s].dims.slice();if(!i.match(RegExp(kp)))throw new Error("Invalid LHS term");let u=this.processTerm(i,!0,o,s);this.lhs.push(u)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!a.match(RegExp(Is)))throw new Error("Invalid RHS");a.match(RegExp(No,"g"))?.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,r){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,a)}processTerm(e,t,r,a=-1){let i=r.length,s=!1,o=[],u=0;if(!e.match(RegExp(kp))&&!t&&e!=="")throw new Error("Invalid LHS term");let d=e.match(RegExp(No,"g")),p=new Pg(a);return d?.forEach((f,m)=>{if(f==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let g=i-d.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(o=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=o;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<o.length;_++){let v=String.fromCharCode(48+_);p.addSymbol(v,m+_),this.addSymbol(v,r[u++],a)}}else p.addSymbol(f,m+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(f,r[u++],a)}),p}},Sp=e=>e+"_max",Wg=(e,t,r,a)=>{let i=e.map(p=>p.length).map((p,f)=>K(`input${f}`,t,p)),s=L.size(a),o=he("output",t,a.length),u=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),d=p=>{let f=[],m="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",v=[],w=[],k=[],b=[],$=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((T,I)=>{if(r.rhs.symbolToIndices.has(I)){let A=r.rhs.symbolToIndices.get(I)?.[0];A!==void 0&&r.lhs.forEach((E,B)=>{if(T.inputIndices.includes(B)){let U=E.symbolToIndices.get(I);if(U===void 0)throw new Error("Invalid symbol error");U.forEach(j=>{f.push(`${i[B].indicesSet(`input${B}Indices`,j,o.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,E)=>{if(T.inputIndices.includes(E)){let B=A.symbolToIndices.get(I);if(B===void 0)throw new Error("Invalid symbol error");B.forEach(U=>{v.push(`${i[E].indicesSet(`input${E}Indices`,U,`${I}`)}`)}),b.push(`prod *= ${i[E].getByIndices(`input${E}Indices`)};`)}}),w.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${Sp(I)}; ${I}++) {`),k.push("}")});let S=$?[...f,`let sum = ${i.map((T,I)=>T.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...f,g,...w,...v,m,...b,_,...k];return`
            ${p.registerUniforms(u.map(T=>({name:`${Sp(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,o)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${o.offsetToIndices("global_idx")};
            ${i.map((T,I)=>`var input${I}Indices: ${i[I].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${o.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=u.filter(m=>r.symbolToInfo.has(m)).map(m=>({type:12,data:r.symbolToInfo.get(m)?.dimValue||0}));p.push({type:12,data:s});let f=e.map((m,g)=>[...ye(m)]).reduce((m,g)=>m.concat(g),p);return f.push(...ye(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:f}},getShaderSource:d}},r2=(e,t)=>{let r=new Ug(e.inputs,t.equation),a=r.outputDims,i=e.inputs.map((s,o)=>s.dims);e.compute(Wg(i,e.inputs[0].dataType,r,a))},a2=e=>{let t=e.equation.replace(/\s+/g,"");return Le({equation:t})}}),Vg,Tp,qg,jg,i2,az=ee(()=>{we(),Te(),ze(),Vg=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=r.length<t.length?0:r.length-t.length,i=t.length<r.length?0:t.length-r.length;for(;a<r.length&&i<t.length;++a,++i)if(r[a]!==t[i]&&r[a]!==1&&t[i]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Tp=(e,t)=>{let r=e.length-t.length,a=[];for(let i=0;i<r;++i)a.push(e[i]);for(let i=0;i<t.length;++i)a.push(t[i]===1?e[i+r]:t[i]);return a},qg=(e,t)=>e.length>t.length?Tp(e,t):Tp(t,e),jg=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=qg(t,r),i=e[0].dataType,s=i===9||L.size(t)===1,o=i===9||t.length>0&&t[t.length-1]%4===0?4:1,u=s||a.length>0&&a[a.length-1]%4===0?4:1,d=Math.ceil(L.size(a)/u),p=m=>{let g=K("input",i,t.length,o),_=he("output",i,a.length,u),v;if(i===9){let w=(k,b,$="")=>`
          let outputIndices${b} = ${_.offsetToIndices(`outputOffset + ${b}u`)};
          let offset${b} = ${g.broadcastedIndicesToOffset(`outputIndices${b}`,_)};
          let index${b} = offset${b} / 4u;
          let component${b} = offset${b} % 4u;
          ${k}[${b}] = ${$}(${g.getByOffset(`index${b}`)}[component${b}]);
        `;v=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else v=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${o}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${m.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${v}`},f=[{type:12,data:d},...ye(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${o}${u}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f})}},i2=e=>{Vg(e.inputs),e.compute(jg(e.inputs),{inputs:[0]})}}),Lg,n2,iz=ee(()=>{we(),Te(),ze(),Yh(),Lg=e=>{let t=e[0].dataType,r=L.size(e[0].dims),a=L.size(e[1].dims),i=a%4===0,s=o=>{let u=K("x",t,[1],4),d=K("bias",t,[1],4),p=he("y",t,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],m=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${d.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=i?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${o.registerUniforms(f).declareVariables(u,d,p)}

    ${sh(bt(t))}

    ${o.mainStart(li)}
      ${o.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",oh("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${i}`,inputDependencies:["type","type"]},getShaderSource:s,getRunData:o=>({outputs:[{dims:o[0].dims,dataType:o[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(r/li/4)}})}},n2=e=>{e.inputs.length<2||L.size(e.inputs[1].dims)===0?S1(e):e.compute(Lg(e.inputs))}}),Gg,Fg,s2,o2,nz=ee(()=>{we(),Te(),et(),ze(),Gg=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Fg=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r.length,s=L.normalizeAxis(t.axis,i),o=r.slice(0);o.splice(s,1,...a);let u=r[s],d=e[0].dataType===9?4:1,p=Math.ceil(L.size(o)/d),f=[{type:12,data:p},{type:6,data:u},{type:12,data:s},...ye(e[0].dims,e[1].dims,o)],m=g=>{let _=K("data",e[0].dataType,e[0].dims.length,d),v=K("inputIndices",e[1].dataType,e[1].dims.length),w=he("output",e[0].dataType,o.length,d),k=$=>{let S=a.length,T=`var indicesIndices${$}  = ${v.type.indices}(0);`;for(let I=0;I<S;I++)T+=`${S>1?`indicesIndices${$}[${I}]`:`indicesIndices${$}`} = ${o.length>1?`outputIndices${$}[uniforms.axis + ${I}]`:`outputIndices${$}`};`;T+=`
          var idx${$} = ${v.getByIndices(`indicesIndices${$}`)};
          if (idx${$} < 0) {
            idx${$} = idx${$} + uniforms.axisDimLimit;
          }
          var dataIndices${$} : ${_.type.indices};
        `;for(let I=0,A=0;I<i;I++)I===s?(T+=`${i>1?`dataIndices${$}[${I}]`:`dataIndices${$}`} = u32(idx${$});`,A+=S):(T+=`${i>1?`dataIndices${$}[${I}]`:`dataIndices${$}`} = ${o.length>1?`outputIndices${$}[${A}]`:`outputIndices${$}`};`,A++);return T},b;if(e[0].dataType===9){let $=(S,T,I="")=>`
          let outputIndices${T} = ${w.offsetToIndices(`outputOffset + ${T}u`)};
          ${k(T)};
          let offset${T} = ${_.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${S}[${T}] = ${I}(${_.getByOffset(`index${T}`)}[component${T}]);
        `;b=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${$("value",0,"u32")}
        ${$("value",1,"u32")}
        ${$("value",2,"u32")}
        ${$("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else b=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${_.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,v,w)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${b}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:m}},s2=e=>Le({axis:e.axis}),o2=(e,t)=>{let r=e.inputs;Gg(r),e.compute(Fg(e.inputs,t))}}),Hg,u2,l2,sz=ee(()=>{we(),Te(),ze(),Hg=(e,t,r,a,i,s,o,u,d)=>{let p=[{type:12,data:s},{type:12,data:a},{type:12,data:i},{type:12,data:r},{type:12,data:o},{type:12,data:u},{type:12,data:d}],f=[s];p.push(...ye(t.dims,f));let m=g=>{let _=K("indices_data",t.dataType,t.dims.length),v=he("input_slice_offsets_data",12,1,1),w=[_,v],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:i.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(k).declareVariables(...w)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${i.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${i.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:m},{inputs:[t],outputs:[-1]})[0]},u2=(e,t)=>{let r=e.inputs,a=r[0].dims,i=r[0].dataType,s=r[1].dims,o=s[s.length-1],u=L.sizeToDimension(s,s.length-1),d=L.sizeFromDimension(a,t.batchDims+o),p=L.sizeToDimension(a,t.batchDims),f=L.sizeFromDimension(a,t.batchDims),m=u/p,g=new Array(o),_=d;for(let T=0;T<o;++T)g[o-1-T]=_,_*=a[t.batchDims+o-1-T];let v=Hg(e,r[1],g,t.batchDims,a,u,m,f,o),w=t.batchDims+o;if(w>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=s.slice(0,-1).concat(a.slice(w)),b=L.size(k),$=[{type:12,data:b},{type:12,data:d},...ye(r[0].dims,v.dims,k)],S=T=>{let I=K("data",r[0].dataType,r[0].dims.length),A=K("slice_offsets",12,v.dims.length),E=he("output",r[0].dataType,k.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,A,E)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:i}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:$}),getShaderSource:S},{inputs:[r[0],v]})},l2=e=>({batchDims:e.batch_dims,cacheKey:""})}),Kg,Zg,d2,p2,oz=ee(()=>{we(),Te(),et(),ze(),Kg=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=L.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,i=e[0],s=e[2],o=e.length===4?e[3]:void 0;if(s.dims.length!==i.dims.length||!i.dims.map((u,d)=>d===r?Math.ceil(u/a)===s.dims[d]:u===s.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(o){if(o.dataType!==i.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(o.dims.length!==s.dims.length||!o.dims.map((u,d)=>u===s.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Zg=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r.length,s=L.normalizeAxis(t.gatherAxis,i),o=L.normalizeAxis(t.quantizeAxis,i),u=r.slice(0);u.splice(s,1,...a);let d=L.size(u),p=e[2].dataType,f=e[0].dataType===22,m=[{type:12,data:d},{type:12,data:o},{type:12,data:s},{type:12,data:t.blockSize},...ye(...e.map((_,v)=>_.dims),u)],g=_=>{let v=K("data",e[0].dataType,e[0].dims.length),w=K("inputIndices",e[1].dataType,e[1].dims.length),k=K("scales",e[2].dataType,e[2].dims.length),b=e.length>3?K("zeroPoint",e[3].dataType,e[3].dims.length):void 0,$=he("output",p,u.length),S=[v,w,k];b&&S.push(b);let T=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(T).declareVariables(...S,$)}
        ${_.mainStart()}
        let output_indices = ${$.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${$.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${$.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${v.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${$.indicesGet("output_indices","i")};
          ${v.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[s]};
        }
        ${v.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${$.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${v.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${v.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${v.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${b?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${b.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${b.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${bt(p)}(quantized_data - zero_point) * scale;
        ${$.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,v)=>v!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,v)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:p}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:m}),getShaderSource:g}},d2=(e,t)=>{let r=e.inputs;Kg(r,t),e.compute(Zg(e.inputs,t))},p2=e=>Le({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Qg,Xg,c2,h2,uz=ee(()=>{we(),Te(),et(),ze(),Qg=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Xg=(e,t)=>{let r=e[0].dims,a=e[0].dataType,i=r.length,s=e[1].dims,o=e[1].dataType,u=L.normalizeAxis(t.axis,i),d=r[u],p=s.slice(0),f=L.size(p),m=K("input",a,i),g=K("indicesInput",o,s.length),_=he("output",a,p.length),v=[{type:12,data:f},{type:6,data:d},{type:12,data:u}];return v.push(...ye(r,s,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:v}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,g,_)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},c2=e=>Le({axis:e.axis}),h2=(e,t)=>{let r=e.inputs;Qg(r),e.compute(Xg(e.inputs,t))}}),Jg,Yg,f2,m2,lz=ee(()=>{we(),Te(),ze(),Jg=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Yg=(e,t)=>{let r=e[0].dims.slice(),a=e[1].dims.slice(),[i,s,o]=gb.getShapeOfGemmResult(r,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),u=[i,s];if(!u)throw new Error("Can't use gemm on the given tensors");let d=16,p=Math.ceil(s/d),f=Math.ceil(i/d),m=!0,g=L.size(u),_=[{type:12,data:m?p:g},{type:12,data:i},{type:12,data:s},{type:12,data:o},{type:1,data:t.alpha},{type:1,data:t.beta}],v=["type","type"];e.length===3&&(_.push(...ye(e[2].dims)),v.push("rank")),_.push(...ye(u));let w=b=>{let $="";t.transA&&t.transB?$="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?$="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?$="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&($="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",T=K("a",e[0].dataType,e[0].dims),I=K("b",e[1].dataType,e[1].dims),A=T.type.value,E=null,B=[T,I];e.length===3&&(E=K("c",e[2].dataType,e[2].dims.length),B.push(E));let U=he("output",e[0].dataType,u.length);B.push(U);let j=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${b.registerUniforms(j).declareVariables(...B)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${$}
    }

    ${S}
    ${E!=null?`let cOffset = ${E.broadcastedIndicesToOffset("vec2(m, n)",U)}; value += ${A}(uniforms.beta) * ${E.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=b=>{let $=K("a",e[0].dataType,e[0].dims),S=K("b",e[1].dataType,e[1].dims),T=null,I=[$,S];e.length===3&&(T=K("c",e[2].dataType,e[2].dims.length),I.push(T));let A=he("output",e[0].dataType,u.length);I.push(A);let E=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],B="",U="";t.transA&&t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let j=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${b.registerUniforms(E).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${$.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${d}>, ${d}>;
  ${b.mainStart([d,d,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${U}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${B}
      }
      workgroupBarrier();
    }

    ${j}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return m?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:p*f},programUniforms:_}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},f2=e=>{let t=e.transA,r=e.transB,a=e.alpha,i=e.beta;return{transA:t,transB:r,alpha:a,beta:i,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},m2=(e,t)=>{Jg(e.inputs),e.compute(Yg(e.inputs,t))}}),yr,Rr,wa,ba,ey,ty,ry,ay,iy,ny,sy,oy,g2,y2,dz=ee(()=>{we(),Te(),et(),ze(),[yr,Rr,wa,ba]=[0,1,2,3],ey=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},ty=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,ry=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,ay=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,iy=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,ny=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${yr}] = batch;
     indices[${Rr}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${wa}] = u32(r);
            indices[${ba}] = u32(c);
          }
        `;case"border":return`
          indices[${wa}] = u32(clamp(r, 0, H - 1));
          indices[${ba}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${wa}] = gs_reflect(r, border[1], border[3]);
          indices[${ba}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,sy=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${yr}], indices[${Rr}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${yr}], indices[${Rr}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${yr}], indices[${Rr}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${yr}], indices[${Rr}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${yr}], indices[${Rr}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${yr}], indices[${Rr}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,oy=(e,t)=>{let r=K("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],i=K("grid",e[1].dataType,a.length,2),s=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(s=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[yr,Rr,wa,ba]=[0,3,1,2]);let o=he("output",e[0].dataType,s.length),u=r.type.value,d=L.size(s),p=[{type:12,data:d},...ye(e[0].dims,a,s)],f=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(r,i,o)}
  ${ty}
  ${ry(u)}
  ${ay(t)}
  ${iy(t)}
  ${ny(r,u,t)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${wa}]);
      let W_in = i32(uniforms.x_shape[${ba}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${o.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${yr}], indices[${wa}], indices[${ba}]);
      let nxy = ${i.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${sy(o,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:m=>{let g=L.size(s);return{outputs:[{dims:s,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:f}},g2=(e,t)=>{ey(e.inputs),e.compute(oy(e.inputs,t))},y2=e=>Le({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),St,uy,_2,Cp,ly,Ks,v2,$2=ee(()=>{we(),Te(),et(),Zh(),Jh(),ze(),Qr(),St=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,uy=(e,t)=>{let r=e[0],a=St(e,1),i=St(e,2),s=St(e,3),o=St(e,4),u=St(e,5),d=St(e,6),p=St(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=r.dims[0],m=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=m,v=0,w=0,k=Math.floor(g/t.numHeads);if(d&&p&&L.size(d.dims)&&L.size(p.dims)){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==f||d.dims[1]!==t.numHeads||d.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==f||p.dims[1]!==t.numHeads||p.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=d.dims[2],w=d.dims[2]}else if(d&&L.size(d.dims)||p&&L.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b;if(a&&L.size(a.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');b=2,_=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(i)throw new Error('Expect "value" be none when "key" has packed kv format.');b=5,_=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');b=0,_=a.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}if(s&&L.size(s.dims)>0){if(s.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let $=v+_,S=0;if(o&&L.size(o.dims)>0){S=8;let E=o.dims;throw E.length===1?E[0]===f?S=1:E[0]===3*f+2&&(S=3):E.length===2&&E[0]===f&&E[1]===$&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,I=g;if(i&&L.size(i.dims)>0){if(i.dims.length!==3&&i.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(i.dims.length===3){if(_!==i.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=i.dims[2]}else{if(_!==i.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=i.dims[1]*i.dims[3],T=!0}}let A=!1;if(o&&L.size(o.dims)>0)throw new Error("Key padding mask is not supported");if(u&&L.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==f||u.dims[1]!==t.numHeads||u.dims[2]!==m||u.dims[3]!==$)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:f,sequenceLength:m,pastSequenceLength:v,kvSequenceLength:_,totalSequenceLength:$,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:g,vHiddenSize:I,headSize:k,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:A,passPastInKv:T,qkvFormat:b}},_2=e=>Le({...e}),Cp=Le({perm:[0,2,1,3]}),ly=(e,t,r,a,i,s,o)=>{let u=[a,i,s],d=L.size(u),p=[{type:12,data:d},{type:12,data:o},{type:12,data:s}],f=m=>{let g=he("qkv_with_bias",t.dataType,u),_=K("qkv",t.dataType,u),v=K("bias",r.dataType,u),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${m.registerUniforms(w).declareVariables(_,v,g)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:f},{inputs:[t,r],outputs:[-1]})[0]},Ks=(e,t,r,a,i,s,o,u)=>{let d=s;if(o&&L.size(o.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=ly(e,s,o,t,a,r*i,u),d=d.reshape([t,a,r,i]),r===1||a===1?d:e.compute(Nt(d,Cp.perm),{inputs:[d],outputs:[-1]})[0]}else return s.dims.length===3&&(d=s.reshape([t,a,r,i])),r===1||a===1?d:e.compute(Nt(d,Cp.perm),{inputs:[d],outputs:[-1]})[0]},v2=(e,t)=>{let r=uy(e.inputs,t),a=e.inputs[0],i=St(e.inputs,1),s=St(e.inputs,2),o=St(e.inputs,3),u=St(e.inputs,4),d=St(e.inputs,5),p=St(e.inputs,6),f=St(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if(i?.dims.length===5)throw new Error("Packed KV is not implemented");let m=i&&s&&i.dims.length===4&&s.dims.length===4,g=Ks(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,o,0);if(m)return $o(e,g,i,s,u,void 0,p,f,d,r);if(!i||!s)throw new Error("key and value must be provided");let _=Ks(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,i,o,r.hiddenSize),v=Ks(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,o,2*r.hiddenSize);$o(e,g,_,v,u,void 0,p,f,d,r)}}),dy,py,cy,hy,ch,w2,b2,x2=ee(()=>{we(),Te(),et(),ze(),dy=e=>{if(!e||e.length<1)throw new Error("too few inputs")},py=(e,t)=>{let r=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),a=r.length),Le({numOutputs:a,axis:t.axis,splitSizes:r})},cy=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${me("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,hy=e=>{let t=e.length,r=[];for(let a=0;a<t;++a){let i=e[a].setByIndices("indices","input[global_idx]");t===1?r.push(i):a===0?r.push(`if (output_number == ${a}u) { ${i} }`):a===t-1?r.push(`else { ${i} }`):r.push(`else if (output_number == ${a}) { ${i} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},ch=(e,t)=>{let r=e[0].dims,a=L.size(r),i=e[0].dataType,s=L.normalizeAxis(t.axis,r.length),o=new Array(t.numOutputs),u=K("input",i,r.length),d=new Array(t.numOutputs),p=[],f=[],m=0,g=[{type:12,data:a}];for(let v=0;v<t.numOutputs;v++){m+=t.splitSizes[v],d[v]=m;let w=r.slice();w[s]=t.splitSizes[v],f.push(w),o[v]=he(`output${v}`,i,w.length),p.push({dims:f[v],dataType:e[0].dataType})}g.push({type:12,data:d},...ye(r,...f));let _=v=>`
  ${v.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(u,...o)}
  ${cy(d.length)}
  ${hy(o)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${me("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${u.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g})}},w2=(e,t)=>{dy(e.inputs);let r=e.inputs.length===1?t:py(e.inputs,t);e.compute(ch(e.inputs,r),{inputs:[0]})},b2=e=>{let t=e.axis,r=e.splitSizes,a=e.numOutputs<0?r.length:e.numOutputs;if(a!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return Le({axis:t,numOutputs:a,splitSizes:r})}}),fy,my,Ip,k2,pz=ee(()=>{et(),Jh(),$2(),x2(),Qr(),fy=(e,t)=>{if(t.doRotary)throw new Error("GroupQuerryAttention do_rotary attribute is not supported");if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],a=e[1],i=e[2],s=e[3],o=e[4];if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,d=r.dims[0],p=r.dims[1],f=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],m=p,g=0,_=!a||a.dims.length===0,v=Math.floor(_?f/(t.numHeads+2*t.kvNumHeads):f/t.numHeads);_&&(f=v*t.numHeads);let w=s&&s.dims.length!==0,k=o&&o.dims.length!==0;if(w&&s.dims.length===4&&s.dims[0]===d&&s.dims[1]!==t.kvNumHeads&&s.dims[2]===t.kvNumHeads&&s.dims[3]===v)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&k){if(s.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(o.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=s.dims[2]}else if(w||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b=1;if(a&&a.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(r.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');m=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(i)throw new Error('Expect "value" be none when "key" has packed kv format.');m=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=a.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}let $=0,S=!1,T=t.kvNumHeads?v*t.kvNumHeads:f;if(i&&i.dims.length>0){if(i.dims.length!==3&&i.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(i.dims.length===3){if(m!==i.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=i.dims[2]}else{if(m!==i.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=i.dims[1]*i.dims[3],S=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==d)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:d,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:f,vHiddenSize:T,headSize:v,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:$,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:b}},my=Le({perm:[0,2,1,3]}),Ip=(e,t,r)=>{let a=t,i=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(a=t.reshape([r.batchSize,r.kvSequenceLength,i,r.headSize]),a=e.compute(Nt(a,my.perm),{inputs:[a],outputs:[-1]})[0]),a},k2=(e,t)=>{let r=fy(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],i=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,s=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,d=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,f=r.kvNumHeads?r.kvNumHeads:r.numHeads,m=Le({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,f*r.headSize,f*r.headSize]}),[g,_,v]=!i&&!s?e.compute(ch([a],m),{inputs:[a],outputs:[-1,-1,-1]}):[a,i,s],w=Ks(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,g,void 0,0);$o(e,w,Ip(e,_,r),Ip(e,v,r),void 0,void 0,o,u,void 0,r,d,p)}}),Ep,gy,yy,S2,cz=ee(()=>{we(),Te(),Qr(),ze(),Ep=(e,t,r,a,i,s,o,u)=>{let d=Je(s),p=d===1?"f32":`vec${d}f`,f=d===1?"vec2f":`mat2x${d}f`,m=i*o,g=64;m===1&&(g=256);let _=[i,o,s/d],v=[i,o,2],w=["rank","type","type"],k=[];k.push(...ye(_,v));let b=$=>{let S=K("x",t.dataType,3,d),T=K("scale",r.dataType,r.dims),I=K("bias",a.dataType,a.dims),A=he("output",1,3,2),E=[S,T,I,A];return`
  var<workgroup> workgroup_shared : array<${f}, ${g}>;
  const workgroup_size = ${g}u;
  ${$.declareVariables(...E)}
  ${$.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${f}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Kr("workgroup_shared[0][0]",d)} / f32(hight * ${d});
      let squared_sum_final = ${Kr("workgroup_shared[0][1]",d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${u};${g}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:v,dataType:1}],dispatchGroup:{x:m},programUniforms:k}),getShaderSource:b},{inputs:[t,r,a],outputs:[-1]})[0]},gy=(e,t,r)=>{let a=t[0].dims,i=a,s=2,o=a[0],u=a[1],d=L.sizeFromDimension(a,s),p=Je(d),f=L.size(i)/p,m=Ep(e,t[0],t[1],t[2],o,d,u,r.epsilon),g=[o,u,d/p],_=[o,u],v=["type","none"],w=k=>{let b=K("x",t[0].dataType,g.length,p),$=K("scale_shift",1,_.length,2),S=he("output",t[0].dataType,g.length,p),T=[b,$,S];return`
  ${k.registerUniform("output_size","u32").declareVariables(...T)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${$.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${b.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...ye(g,_,g)]}),getShaderSource:w},{inputs:[t[0],m]})},yy=(e,t,r)=>{let a=t[0].dims,i=a,s=a[0],o=a[a.length-1],u=L.sizeFromDimension(a,1)/o,d=Je(o),p=L.size(i)/d,f=[{type:12,data:u},{type:12,data:Math.floor(o/d)}],m=["type","type"],g=!1,_=[0,a.length-1];for(let b=0;b<a.length-2;b++)g=g||a[b+1]!==1,_.push(b+1);g=g&&a[a.length-1]!==1;let v=g?e.compute(Nt(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},(b,$)=>a[_[$]])),w=Ep(e,v,t[1],t[2],s,u,o,r.epsilon),k=b=>{let $=dt(t[0].dataType),S=d===1?"vec2f":`mat${d}x2f`,T=E=>{let B=E===0?"x":"y",U=d===1?"f32":`vec${d}f`;switch(d){case 1:return`${$}(${U}(scale.${B}))`;case 2:return`vec2<${$}>(${U}(scale[0].${B}, scale[1].${B}))`;case 4:return`vec4<${$}>(${U}(scale[0].${B}, scale[1].${B}, scale[2].${B}, scale[3].${B}))`;default:throw new Error(`Not supported compoents ${d}`)}},I=K("input",t[0].dataType,t[0].dims,d),A=he("output",t[0].dataType,i,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${b.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:k},{inputs:[t[0],w]})},S2=(e,t)=>{t.format==="NHWC"?yy(e,e.inputs,t):gy(e,e.inputs,t)}}),_y,vy,T2,hz=ee(()=>{we(),Te(),ze(),_y=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},vy=(e,t,r)=>{let a=t.simplified,i=e[0].dims,s=e[1],o=!a&&e[2],u=i,d=L.normalizeAxis(t.axis,i.length),p=L.sizeToDimension(i,d),f=L.sizeFromDimension(i,d),m=L.size(s.dims),g=o?L.size(o.dims):0;if(m!==f||o&&g!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${g}`);let _=[];for(let I=0;I<i.length;++I)I<d?_.push(i[I]):_.push(1);let v=Je(f),w=["type","type"],k=[{type:12,data:p},{type:1,data:f},{type:12,data:Math.floor(f/v)},{type:1,data:t.epsilon}];o&&w.push("type");let b=r>1,$=r>2,S=I=>{let A=dt(e[0].dataType),E=[K("x",e[0].dataType,e[0].dims,v),K("scale",s.dataType,s.dims,v)];o&&E.push(K("bias",o.dataType,o.dims,v)),E.push(he("output",e[0].dataType,u,v)),b&&E.push(he("mean_data_output",1,_)),$&&E.push(he("inv_std_output",1,_));let B=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(B).declareVariables(...E)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ah("f32",v)};
    var mean_square_vector = ${ah("f32",v)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${ri(A,v,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Kr("mean_vector",v)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Kr("mean_square_vector",v)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${ri(A,v,"x[j + offset]")};
      let f32scale = ${ri(A,v,"scale[j]")};
      output[j + offset] = ${E[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${o?`+ ${ri(A,v,"bias[j]")}`:""}
      );
    }

    ${b?"mean_data_output[global_idx] = mean":""};
    ${$?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:u,dataType:e[0].dataType}];return b&&T.push({dims:_,dataType:1}),$&&T.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${v};${r};${a}`,inputDependencies:w},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:k}),getShaderSource:S}},T2=(e,t)=>{_y(e.inputs),e.compute(vy(e.inputs,t,e.outputCount))}}),$y,C2,fz=ee(()=>{Te(),af(),nf(),$y=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},C2=e=>{$y(e.inputs);let t=ui.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&a<8)e.compute(rf(e.inputs,{activation:""},t));else{let i=t[t.length-2],s=L.size(e.inputs[0].dims.slice(0,-2)),o=L.size(e.inputs[1].dims.slice(0,-2));if(s!==1&&i===1&&o===1){let u=e.inputs[0].reshape([1,s,a]),d=e.inputs[1].reshape([1,a,r]),p=[1,s,r],f=[u,d];e.compute($u(f,{activation:""},t,p),{inputs:f})}else e.compute($u(e.inputs,{activation:""},t))}}}),wy,by,xy,I2,E2,mz=ee(()=>{we(),Te(),et(),ze(),wy=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],a=r.dims.length;if(r.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let i=Math.floor((t.k+t.blockSize-1)/t.blockSize),s=t.blockSize/8*t.bits,o=e[1];if(!L.areEqual(o.dims,[t.n,i,s]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(L.size(u)!==t.n*i)throw new Error("scales input size error.");if(e.length===4){let d=e[3].dims,p=t.bits>4?t.n*i:t.n*Math.floor((i+1)/2);if(L.size(d)!==p)throw new Error("zeroPoints input size error.")}},by=(e,t)=>{let r=e[0].dims,a=r.length,i=r[a-2],s=t.k,o=t.n,u=r.slice(0,a-2),d=L.size(u),p=e[1].dims[2]/4,f=e[0].dataType,m=Je(t.k),g=Je(p),_=Je(o),v=u.concat([i,o]),w=i>1&&o/_%2===0?2:1,k=L.size(v)/_/w,b=64,$=[],S=[d,i,s/m],T=L.convertShape(e[1].dims).slice();T.splice(-1,1,p/g),$.push(...ye(S)),$.push(...ye(T)),$.push(...ye(e[2].dims)),e.length===4&&$.push(...ye(L.convertShape(e[3].dims)));let I=[d,i,o/_];$.push(...ye(I));let A=E=>{let B=S.length,U=K("a",e[0].dataType,B,m),j=K("b",12,T.length,g),W=K("scales",e[2].dataType,e[2].dims.length),J=[U,j,W],P=e.length===4?K("zero_points",12,e[3].dims.length):void 0;P&&J.push(P);let se=I.length,ue=he("output",e[0].dataType,se,_),F=dt(e[0].dataType),oe=(()=>{switch(m){case 1:return`array<${F}, 8>`;case 2:return`mat4x2<${F}>`;case 4:return`mat2x4<${F}>`;default:throw new Error(`${m}-component is not supported.`)}})(),le=()=>{let M=`
          // reuse a data
            var input_offset = ${U.indicesToOffset(`${U.type.indices}(batch, row, word_offset)`)};
            var a_data: ${oe};
            for (var j: u32 = 0; j < ${8/m}; j++) {
              a_data[j] = ${U.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let V=0;V<_*w;V++)M+=`
            b_value = ${g===1?`b${V}_data`:`b${V}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${oe}(${Array.from({length:4},(R,X)=>`${F}(b_value_lower[${X}]), ${F}(b_value_upper[${X}])`).join(", ")});
            b_dequantized_values = ${m===1?`${oe}(${Array.from({length:8},(R,X)=>`(b_quantized_values[${X}] - ${P?`zero_point${V}`:"zero_point"}) * scale${V}`).join(", ")});`:`(b_quantized_values - ${oe}(${Array(8).fill(`${P?`zero_point${V}`:"zero_point"}`).join(",")})) * scale${V};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(V/_)}]${_>1?`[${V%_}]`:""} += ${Array.from({length:8/m},(R,X)=>`${m===1?`a_data[${X}] * b_dequantized_values[${X}]`:`dot(a_data[${X}], b_dequantized_values[${X}])`}`).join(" + ")};
          `;return M},H=()=>{let M=`
            var col_index = col * ${_};
            ${P?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${F}(8);`}
            `;for(let V=0;V<_*w;V++)M+=`
            let scale${V} = ${W.getByOffset("col_index * nBlocksPerCol + block")};
            ${P?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${P.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${F}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return M},de=()=>{let M=`col_index = col * ${_};`;for(let V=0;V<_*w;V++)M+=`
            let b${V}_data = ${j.getByIndices(`${j.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return M+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${oe};
            var b_dequantized_values: ${oe};`,M};return`
        var<workgroup> workgroup_shared: array<${ue.type.value}, ${w*b}>;
        ${E.declareVariables(...J,ue)}
        ${E.mainStart([b,1,1])}
          let output_indices = ${ue.offsetToIndices(`(global_idx / ${b}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${b}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/m};
            ${H()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${de()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${le()}
                word_offset += ${8/m};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${ue.type.value} = ${ue.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${b}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${ue.setByIndices(`${ue.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${m};${g};${_};${w};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:v,dataType:f}],dispatchGroup:{x:k},programUniforms:$}),getShaderSource:A}},xy=(e,t)=>{let r=e[0].dims,a=r.length,i=r[a-2],s=t.k,o=t.n,u=r.slice(0,a-2),d=L.size(u),p=e[1].dims[2]/4,f=e[0].dataType,m=Je(t.k),g=Je(p),_=u.concat([i,o]),v=128,w=o%8===0?8:o%4===0?4:1,k=v/w,b=k*g*8,$=b/m,S=b/t.blockSize,T=L.size(_)/w,I=[],A=[d,i,s/m],E=L.convertShape(e[1].dims).slice();E.splice(-1,1,p/g),I.push(...ye(A)),I.push(...ye(E)),I.push(...ye(e[2].dims)),e.length===4&&I.push(...ye(L.convertShape(e[3].dims)));let B=[d,i,o];I.push(...ye(B));let U=j=>{let W=A.length,J=K("a",e[0].dataType,W,m),P=K("b",12,E.length,g),se=K("scales",e[2].dataType,e[2].dims.length),ue=[J,P,se],F=e.length===4?K("zero_points",12,e[3].dims.length):void 0;F&&ue.push(F);let oe=B.length,le=he("output",e[0].dataType,oe),H=dt(e[0].dataType),de=()=>{switch(m){case 1:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${m}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${J.type.value}, ${$}>;
        var<workgroup> inter_results: array<array<${le.type.value}, ${k}>, ${w}>;
        ${j.declareVariables(...ue,le)}
        ${j.mainStart([k,w,1])}
          let output_indices = ${le.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${$};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${$}; a_offset += ${v})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${J.getByIndices(`${J.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${J.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${F?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${H}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${H}(8);`}
            let scale = ${se.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${P.getByIndices(`${P.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/m};
            for (var i: u32 = 0; i < ${g}; i++) {
              ${de()}
              let b_value = ${g===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${H}>(${Array.from({length:4},(M,V)=>`${H}(b_value_lower[${V}]), ${H}(b_value_upper[${V}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${H}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(M,V)=>`${`dot(a_data${V}, b_dequantized_values[${V}])`}`).join(" + ")};
              word_offset += ${8/m};
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${le.type.value} = ${le.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${le.setByIndices(`${le.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${m};${g};${k};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:f}],dispatchGroup:{x:T},programUniforms:I}),getShaderSource:U}},I2=(e,t)=>{wy(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(xy(e.inputs,t)):e.compute(by(e.inputs,t))},E2=e=>Le(e)}),ky,Sy,Ty,Cy,Iy,Ey,zy,Ay,z2,gz=ee(()=>{we(),Te(),ze(),ky=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Sy=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
            k = i32(${e.indicesGet("indices",i)}) - ${me("uniforms.pads",i,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${me("uniforms.x_shape",i,t)})) {
              break;
            }
            offset += k * i32(${me("uniforms.x_strides",i,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},Ty=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${me("uniforms.pads",i,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${me("uniforms.x_shape",i,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${me("uniforms.x_shape",i,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${me("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Cy=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${me("uniforms.pads",i,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${me("uniforms.x_shape",i,t)})) {
                  k = i32(${me("uniforms.x_shape",i,t)}) - 1;
                }
                offset += k * i32(${me("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Iy=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${me("uniforms.pads",i,r)};
                if (k < 0)  {
                  k += i32(${me("uniforms.x_shape",i,t)}]);
                }
                if (k >= i32(${me("uniforms.x_shape",i,t)})) {
                  k -= i32(${me("uniforms.x_shape",i,t)});
                }
                offset += k * i32(${me("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Ey=(e,t,r)=>{switch(r.mode){case 0:return Sy(e,t,r.pads.length);case 1:return Ty(e,t,r.pads.length);case 2:return Cy(e,t,r.pads.length);case 3:return Iy(e,t,r.pads.length);default:throw new Error("Invalid mode")}},zy=(e,t)=>{let r=L.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,i=L.size(r),s=[{type:12,data:i},{type:6,data:t.pads}],o=e.length>=3&&e[2].data;t.mode===0&&s.push({type:o?e[2].dataType:1,data:t.value}),s.push(...ye(e[0].dims,r));let u=["rank"],d=p=>{let f=he("output",e[0].dataType,r.length),m=K("x",e[0].dataType,a.length),g=m.type.value,_=Ey(f,a.length,t),v=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&v.push({name:"constant_value",type:o?g:"f32"}),`
            ${p.registerUniforms(v).declareVariables(m,f)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${f.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${o}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(r)/64)},programUniforms:s}),getShaderSource:d}},Ay=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,i=e[0].dims.length,s=new Int32Array(2*i).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let d=0;d<u.length;d++)s[Number(u[d])]=Number(r[d]),s[Number(u[d])+i]=Number(r[d+u.length])}else r.forEach((u,d)=>s[Number(d)]=Number(u));let o=[];return s.forEach(u=>o.push(u)),{mode:t.mode,value:a,pads:o}}else return t},z2=(e,t)=>{ky(e.inputs);let r=Ay(e.inputs,t);e.compute(zy(e.inputs,r),{inputs:[0]})}}),Es,zp,Ap,Op,Rp,Oy,Ry,Bp,Np,A2,O2,Mp,R2,B2,Dp,N2,M2,D2,P2,yz=ee(()=>{mr(),we(),Te(),ze(),Es=e=>{if(Ke.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},zp=(e,t,r)=>{let a=t.format==="NHWC",i=e.dims.slice();a&&i.splice(1,0,i.pop());let s=Object.hasOwnProperty.call(t,"dilations"),o=t.kernelShape.slice(),u=t.strides.slice(),d=s?t.dilations.slice():[],p=t.pads.slice();_u.adjustPoolAttributes(r,i,o,u,d,p);let f=_u.computePoolOutputShape(r,i,u,d,o,p,t.autoPad),m=Object.assign({},t);s?Object.assign(m,{kernelShape:o,strides:u,pads:p,dilations:d,cacheKey:t.cacheKey}):Object.assign(m,{kernelShape:o,strides:u,pads:p,cacheKey:t.cacheKey});let g=f.slice();return g.push(g.splice(1,1)[0]),[m,a?g:f]},Ap=(e,t)=>{let r=t.format==="NHWC",a=L.size(e),i=L.size(t.kernelShape),s=[{type:12,data:a},{type:12,data:i}],o=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],f=t.pads[t.pads.length-1],m=!!(p+f);s.push({type:12,data:u},{type:12,data:d},{type:12,data:p},{type:12,data:f}),o.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],v=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];g=!!(w+k),s.push({type:12,data:_},{type:12,data:v},{type:12,data:w},{type:12,data:k}),o.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[s,o,!0,m,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=L.computeStrides(t.kernelShape);s.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((p,f)=>p+f);return[s,o,!!d,!1,!1]}},Op=(e,t,r,a,i,s,o,u,d,p,f,m)=>{let g=i.format==="NHWC",_=t.type.value,v=he("output",t.type.tensor,a);if(i.kernelShape.length<=2){let w="",k="",b="",$=r-(g?2:1);if(f?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${$}] < 0 || xIndices[${$}]
                      >= uniforms.x_shape[${$}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`,i.kernelShape.length===2){let S=r-(g?3:2);m?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,b=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${k}
              ${w}
              ${b}
              ${o}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=i.kernelShape.length,k=i.pads.length,b="";return p?b=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${s}
              }`:b=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${e.registerUniforms(d).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${me("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${me("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${me("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${me("uniforms.pads","j - 2u",k)};
                  ${b}
              }
              ${o}

              output[global_idx] = value;
            }`}},Rp=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Oy=e=>`${Rp(e)};${e.countIncludePad}`,Ry=e=>`${Rp(e)};${e.storageOrder};${e.dilations}`,Bp=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Np=(e,t,r,a)=>{let[i,s]=zp(t,a,r),o=K("x",t.dataType,t.dims.length),u=o.type.value,d="value += x_val;",p="";i.countIncludePad?p+=`value /= ${u}(uniforms.kernelSize);`:p+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[f,m,g,_,v]=Ap(s,i);f.push(...ye(t.dims,s));let w=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${g};${_};${v}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(s)/64)},programUniforms:f}),getShaderSource:k=>Op(k,o,t.dims.length,s.length,i,d,p,0,m,g,_,v)}},A2=e=>{let t=e.count_include_pad!==0,r=Bp(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let a={countIncludePad:t,...r,cacheKey:""};return{...a,cacheKey:Oy(a)}},O2=(e,t)=>{Es(e.inputs),e.compute(Np("AveragePool",e.inputs[0],!1,t))},Mp={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},R2=e=>{let t=e.format;return{format:t,...Mp,cacheKey:t}},B2=(e,t)=>{Es(e.inputs),e.compute(Np("GlobalAveragePool",e.inputs[0],!0,t))},Dp=(e,t,r,a)=>{let[i,s]=zp(t,a,r),o=`
      value = max(x_val, value);
    `,u="",d=K("x",t.dataType,t.dims.length),p=["rank"],[f,m,g,_,v]=Ap(s,i);return f.push(...ye(t.dims,s)),{name:e,shaderCache:{hint:`${a.cacheKey};${g};${_};${v}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(s)/64)},programUniforms:f}),getShaderSource:w=>Op(w,d,t.dims.length,s.length,i,o,u,t.dataType===10?-65504:-1e5,m,g,_,v)}},N2=(e,t)=>{Es(e.inputs),e.compute(Dp("MaxPool",e.inputs[0],!1,t))},M2=e=>{let t=e.storage_order,r=e.dilations,a=Bp(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let i={storageOrder:t,dilations:r,...a,cacheKey:""};return{...i,cacheKey:Ry(i)}},D2=e=>{let t=e.format;return{format:t,...Mp,cacheKey:t}},P2=(e,t)=>{Es(e.inputs),e.compute(Dp("GlobalMaxPool",e.inputs[0],!0,t))}}),By,Ny,U2,W2,_z=ee(()=>{we(),Te(),et(),ze(),By=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,a)=>r===e[2].dims[a]).reduce((r,a)=>r&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((i,s)=>s===t.axis||i===e[0].dims[s]).reduce((i,s)=>i&&s,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/a)||t.blockSize>Math.ceil(r/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Ny=(e,t)=>{let r=L.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,i=a===3,s=e[0].dims,o=e[1].dataType,u=L.size(s),d=a===3||a===2,p=d?[Math.ceil(L.size(e[0].dims)/4)]:e[0].dims,f=e[1].dims,m=e.length>2?e[2]:void 0,g=m?d?[Math.ceil(L.size(m.dims)/4)]:m.dims:void 0,_=f.length===0||f.length===1&&f[0]===1,v=_===!1&&f.length===1,w=Je(u),k=_&&(!d||w===4),b=k?w:1,$=k&&!d?w:1,S=K("input",d?12:a,p.length,$),T=K("scale",o,f.length),I=m?K("zero_point",d?12:a,g.length):void 0,A=he("output",o,s.length,b),E=[S,T];I&&E.push(I);let B=[p,f];m&&B.push(g);let U=[{type:12,data:u/b},{type:12,data:r},{type:12,data:t.blockSize},...ye(...B,s)],j=W=>{let J=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${W.registerUniforms(J).declareVariables(...E,A)}
      ${W.mainStart()}
          ${W.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${d?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${i?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${b===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${T.getByOffset("0")}`:v?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?_?d?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:v?d?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:d?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${d?i?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:j,getRunData:()=>({outputs:[{dims:s,dataType:o}],dispatchGroup:{x:Math.ceil(u/b/64),y:1,z:1},programUniforms:U})}},U2=(e,t)=>{By(e.inputs,t),e.compute(Ny(e.inputs,t))},W2=e=>Le({axis:e.axis,blockSize:e.blockSize})}),My,Dy,V2,vz=ee(()=>{mr(),we(),ze(),My=(e,t,r)=>{let a=e===t,i=e<t&&r<0,s=e>t&&r>0;if(a||i||s)throw new Error("Range these inputs' contents are invalid.")},Dy=(e,t,r,a)=>{let i=Math.abs(Math.ceil((t-e)/r)),s=[i],o=i,u=[{type:12,data:o},{type:a,data:e},{type:a,data:r},...ye(s)],d=p=>{let f=he("output",a,s.length),m=f.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:m},{name:"delta",type:m}];return`
        ${p.registerUniforms(g).declareVariables(f)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u})}},V2=e=>{let t=0,r=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),Ke.webgpu.validateInputContent&&My(t,r,a),e.compute(Dy(t,r,a,e.inputs[0].dataType),{inputs:[]})}}),Py,Uy,q2,j2,$z=ee(()=>{we(),Te(),et(),ze(),Py=(e,t,r,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let i=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return a==="i32"||a==="u32"?`atomicAdd(&${t}, bitcast<${a}>(${r}));`:`
              ${i}bitcast<${a}>(oldValue) + (${r})${s}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${r}));`:`
                ${i}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${r}));`:`${i}min(bitcast<${a}>(oldValue), (${r}))${s}`;case"mul":return`${i}(bitcast<${a}>(oldValue) * (${r}))${s}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Uy=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r,s=1,o=Math.ceil(L.size(a)/s),u=a[a.length-1],d=L.sizeFromDimension(r,u),p=[{type:12,data:o},{type:12,data:u},{type:12,data:d},...ye(e[1].dims,e[2].dims,i)],f=m=>{let g=K("indices",e[1].dataType,e[1].dims.length),_=K("updates",e[2].dataType,e[2].dims.length,s),v=t.reduction!=="none"&&t.reduction!==""?vb("output",e[0].dataType,i.length):he("output",e[0].dataType,i.length,s);return`
      ${m.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,v)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    let n = ${L.size(a)};
    for (var i = 0; i < n; i = i + 1) {
      for (var j = i + 1; j < n; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    indices_start = 0u;
  }
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start + uniforms.last_index_dimension];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${Py(t.reduction,"output[data_offset + i]","value",v.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:f}},q2=e=>Le({reduction:e.reduction}),j2=(e,t)=>{e.compute(Uy(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Wy,Vy,qy,Pp,jy,Ly,Gy,Fy,Hy,Ky,Zy,Qy,Up,Xy,Jy,Yy,e_,t_,L2,G2,wz=ee(()=>{we(),Te(),et(),ze(),Wy=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Vy=(e,t,r)=>{t.every(i=>i>=0&&i<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(r).fill(1);return t.forEach((i,s)=>a[i]=e[s]),a},qy=(e,t,r,a,i,s)=>{let[o,u,d]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(o>0&&e.length>o&&e[o].dims.length>0)e[o].getFloat32Array().forEach(f=>s.push(f));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(f=>a.push(f)),a.length!==0&&a.length!==p&&r>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Wy(a,t),t.axes.length>0&&Vy(a,t.axes,p).forEach((f,m)=>a[m]=f)}if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0&&(e[d].getBigInt64Array().forEach(f=>i.push(Number(f))),i.length!==0&&i.length!==p&&r>=18&&i.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof i<"u"&&a.length>0&&i.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},Pp=(e,t,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,jy=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Pp("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Pp("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Ly=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Gy=(e,t,r)=>{let a=new Array(r).fill(0).concat(new Array(r).fill(1)),i=e.length===0?a:e.slice();return t.length>0?(t.forEach((s,o)=>{a[s]=i[o],a[o+r]=i[t.length+o]}),a):i},Fy=(e,t,r,a)=>{let i=[];if(r.length>0)if(a.length>0){if(e.forEach(s=>i.push(s)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((s,o)=>i[s]=r[o])}else r.forEach(s=>i.push(s));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");i=e.map((s,o)=>Math.round(s*t[o]))}return i},Hy=(e,t,r)=>{let a=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(s=>t[s]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(s=>t[s]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let i=e.slice();return r.axes.length>0?(r.axes.forEach(s=>t[s]=a),r.axes.forEach(s=>i[s]=Math.round(e[s]*t[s]))):(t.fill(a,0,t.length),i.forEach((s,o)=>i[o]=Math.round(s*t[o]))),i},Ky=(e,t,r,a,i)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${me("uniforms.scales","i",a)};
        var roi_low = ${me("uniforms.roi","i",i)};
        var roi_hi = ${me("uniforms.roi",`i + ${t.length}`,i)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${me("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${me("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Zy=(e,t,r,a,i,s,o)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${me("uniforms.scales","i",i)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${me("uniforms.roi","i",s)};
          var roi_hi = ${me("uniforms.roi",`i + ${r.length}`,s)};
          var input_shape_i = ${me("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${me("uniforms.output_shape","i",a.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${o} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Qy=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${me("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Up=(e,t,r,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Xy=(e,t,r,a,i)=>{let[s,o,u,d]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",o,`max(0, min(row, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${Up(e,d,s,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${o}];
      var col:${p} = originalIndices[${u}];
      ${a?`if (row < 0 || row > (${r[o]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${i};
      }`:""};
      row = max(0, min(row, ${r[o]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Jy=(e,t,r,a,i,s,o,u,d,p)=>{let f=r.length===2,[m,g]=f?[0,1]:[2,3],_=e.type.value,v=w=>{let k=w===m?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${_} {
        var output_index = ${t.indicesGet("output_indices",w)};
        var originalIdx: ${_} = getOriginalCoordinateFromResizedCoordinate(output_index, ${i[w]},
        ${a[w]}, ${r[w]}, ${s[w]}, ${s[w]} + ${r.length});
        var fractOriginalIdx: ${_} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[w]} - 1))) {
          return ${d};
        }
        var data: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${_} = originalIdx + ${_}(i);
          if (${k} < 0 || ${k} >= ${r[w]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${d};`:`${k} = max(0, min(${k}, ${r[w]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",w,`u32(${k})`)};
          data[i + 1] = ${w===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${v(m)};
    ${v(g)};
  fn getCubicInterpolationCoefs(s: ${_}) -> array<${_}, 4> {
    var absS = abs(s);
    var coeffs: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${_} = 1.0 - absS;
    var twoMinusAbsS: ${_} = 2.0 - absS;
    var onePlusAbsS: ${_} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${_}, 4>, coefs: array<${_}, 4>) -> ${_} {
    var coefsSum: ${_} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${_} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Yy=(e,t,r,a,i)=>{let[s,o,u,d,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",o,`max(0, min(depth, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(width, ${r[d]} - 1))`)};
      ${Up(e,p,s,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${f} = originalIndices[${o}];
      var height:${f} = originalIndices[${u}];
      var width:${f} = originalIndices[${d}];
      ${a?`if (depth < 0 || depth > (${r[o]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[d]} - 1)) {
      return ${i};
        }`:""};

    depth = max(0, min(depth, ${r[o]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[d]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${f} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${f} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${f} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${f} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${f} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${f} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${f} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${f} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${f} = abs(depth - ${f}(depth1));
      var dx2: ${f} = abs(${f}(depth2) - depth);
      var dy1: ${f} = abs(height - ${f}(height1));
      var dy2: ${f} = abs(${f}(height2) - height);
      var dz1: ${f} = abs(width - ${f}(width1));
      var dz2: ${f} = abs(${f}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},e_=(e,t,r,a,i,s)=>{let o=e.dims,u=Gy(s,t.axes,o.length),d=Fy(o,a,i,t.axes),p=a.slice();a.length===0&&(p=o.map(($,S)=>$===0?1:d[S]/$),t.keepAspectRatioPolicy!=="stretch"&&(d=Hy(o,p,t)));let f=he("output",e.dataType,d.length),m=K("input",e.dataType,o.length),g=L.size(d),_=o.length===d.length&&o.every(($,S)=>$===d[S]),v=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,k=m.type.value,b=$=>`
      ${_?"":`
      ${jy(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Qy(m,o)};
              ${Ly(t.nearestMode,r,k)};
              ${Zy(m,f,o,d,p.length,u.length,v)};
              `;case"linear":return`
              ${Ky(f,o,d,p.length,u.length)};
              ${(()=>{if(o.length===2||o.length===4)return`${Xy(m,f,o,v,w)}`;if(o.length===3||o.length===5)return`${Yy(m,f,o,v,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(o.length===2||o.length===4)return`${Jy(m,f,o,d,p,u,t.cubicCoeffA,v,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${$.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",u.length).declareVariables(m,f)}
      ${$.mainStart()}
        ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${o.length===2||o.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${i.length>0?i:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?o.length:o}`,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:u},...ye(o,d)]})}},t_=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},L2=(e,t)=>{let r=[],a=[],i=[],s=t_(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");qy(e.inputs,t,s,r,a,i),e.compute(e_(e.inputs[0],t,s,r,a,i),{inputs:[0]})},G2=e=>{let t=e.antialias,r=e.axes,a=e.coordinateTransformMode,i=e.cubicCoeffA,s=e.excludeOutside!==0,o=e.extrapolationValue,u=e.keepAspectRatioPolicy,d=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return Le({antialias:t,axes:r,coordinateTransformMode:a,cubicCoeffA:i,excludeOutside:s,extrapolationValue:o,keepAspectRatioPolicy:u,mode:d,nearestMode:p})}}),r_,a_,F2,bz=ee(()=>{we(),Te(),et(),ze(),r_=(e,t)=>{let[r,a,i,s]=e,{numHeads:o,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!L.areEqual(a.dims,[])&&!L.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(s.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!L.areEqual(i.dims,s.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&o===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=r.dims[0],p=r.dims[r.dims.length-2],f=i.dims[0],m=L.sizeFromDimension(r.dims,1)/p,g=u===0?i.dims[1]*2:m/o;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(d!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(p!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(g/2!==i.dims[1]&&u/2!==i.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${i.dims[1]}`);if(p>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},a_=(e,t)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:i,scale:s}=t,o=e[0].dims[0],u=L.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],p=u/d,f=e[2].dims[1],m=i===0?f*2:p/a,g=new Array(o,d,p/m,m-f),_=L.computeStrides(g),v=[{type:1,data:s},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,p,m,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,m,d*m,1]}):[],...ye(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=k=>{let b=K("input",e[0].dataType,e[0].dims.length),$=K("position_ids",e[1].dataType,e[1].dims.length),S=K("cos_cache",e[2].dataType,e[2].dims.length),T=K("sin_cache",e[3].dataType,e[3].dims.length),I=he("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${k.declareVariables(b,$,S,T,I)}

        ${k.mainStart(li)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${$.broadcastedIndicesToOffset("bsnh.xy",he("",$.type.tensor,2))};
            let position_id =
                u32(${$.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${b.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${b.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${b.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${b.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",b.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Le({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(g)/li)},programUniforms:v})}},F2=(e,t)=>{r_(e.inputs,t),e.compute(a_(e.inputs,t))}}),i_,n_,H2,xz=ee(()=>{we(),Te(),ze(),i_=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],a=e[2];if(t.dataType!==r.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let i=t.dims[t.dims.length-1],s=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==i)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==i)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let o=e[3];if(o.dims.length!==1)throw new Error("Beta must be 1D");if(o.dims[o.dims.length-1]!==i)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let o=e[4];if(o.dims.length!==1)throw new Error("Bias must be 1D");if(o.dims[o.dims.length-1]!==i)throw new Error("Bias must have the same hidden size as input")}},n_=(e,t,r,a)=>{let i=t.simplified,s=e[0].dims,o=L.size(s),u=s,d=o,p=s.slice(-1)[0],f=a?s.slice(0,-1).concat(1):[],m=!i&&e.length>3,g=e.length>4,_=a&&r>1,v=a&&r>2,w=r>3,k=64,b=Je(p),$=[{type:12,data:d},{type:12,data:b},{type:12,data:p},{type:1,data:t.epsilon}],S=I=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],E=[K("x",e[0].dataType,e[0].dims,b),K("skip",e[1].dataType,e[1].dims,b),K("gamma",e[2].dataType,e[2].dims,b)];m&&E.push(K("beta",e[3].dataType,e[3].dims,b)),g&&E.push(K("bias",e[4].dataType,e[4].dims,b)),E.push(he("output",e[0].dataType,u,b)),_&&E.push(he("mean_output",1,f)),v&&E.push(he("inv_std_output",1,f)),w&&E.push(he("input_skip_bias_sum",e[0].dataType,u,b));let B=dt(e[0].dataType),U=dt(1,b);return`

      ${I.registerUniforms(A).declareVariables(...E)}
      var<workgroup> sum_shared : array<${U}, ${k}>;
      var<workgroup> sum_squared_shared : array<${U}, ${k}>;

      ${I.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":B+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${ri(B,b,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Kr("sum",b)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Kr("square_sum",b)} / f32(uniforms.hidden_size) ${i?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${v?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${i?"":`- ${B}(mean)`}) *
            ${B}(inv_std_dev) * gamma[offset1d + i]
            ${m?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:u,dataType:e[0].dataType}];return r>1&&T.push({dims:f,dataType:1}),r>2&&T.push({dims:f,dataType:1}),r>3&&T.push({dims:s,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${b};${_};${v};${w}`,inputDependencies:e.map((I,A)=>"type")},getShaderSource:S,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(d/p)},programUniforms:$})}},H2=(e,t)=>{i_(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(n_(e.inputs,t,e.outputCount,!1),{outputs:r})}}),s_,zs,o_,Wp,u_,l_,K2,Z2,kz=ee(()=>{we(),Te(),et(),ze(),s_=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},zs=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>r.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>r.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},o_=(e,t)=>{if(e.length>1){let r=zs(e,1),a=zs(e,2),i=zs(e,3);return i.length===0&&(i=[...Array(e[0].dims.length).keys()]),Le({starts:r,ends:a,axes:i})}else return t},Wp=(e,t,r,a,i)=>{let s=e;return e<0&&(s+=r[a[t]]),i[t]<0?Math.max(0,Math.min(s,r[a[t]]-1)):Math.max(0,Math.min(s,r[a[t]]))},u_=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${me("uniforms.input_shape","i",r.length)};
            let steps_i = ${me("uniforms.steps","i",r.length)};
            let signs_i = ${me("uniforms.signs","i",r.length)};
            let starts_i = ${me("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,l_=(e,t)=>{let r=e[0].dims,a=L.size(r),i=t.axes.length>0?L.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],s=zs(e,4);s.forEach(b=>b!==0||(()=>{throw new Error("step cannot be 0")})),s.length===0&&(s=Array(i.length).fill(1));let o=t.starts.map((b,$)=>Wp(b,$,r,i,s)),u=t.ends.map((b,$)=>Wp(b,$,r,i,s));if(i.length!==o.length||i.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(i.length!==r.length)for(let b=0;b<r.length;++b)i.includes(b)||(o.splice(b,0,0),u.splice(b,0,r[b]),s.splice(b,0,1));let d=s.map(b=>Math.sign(b));s.forEach((b,$,S)=>{if(b<0){let T=(u[$]-o[$])/b,I=o[$],A=I+T*s[$];o[$]=A,u[$]=I,S[$]=-b}});let p=r.slice(0);i.forEach((b,$)=>{p[b]=Math.ceil((u[b]-o[b])/s[b])});let f={dims:p,dataType:e[0].dataType},m=he("output",e[0].dataType,p.length),g=K("input",e[0].dataType,e[0].dims.length),_=L.size(p),v=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:o.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:s.length}],w=[{type:12,data:_},{type:12,data:o},{type:6,data:d},{type:12,data:s},...ye(e[0].dims,p)],k=b=>`
      ${b.registerUniforms(v).declareVariables(g,m)}
        ${u_(g,m,r)}
        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${o.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:w})}},K2=(e,t)=>{s_(e.inputs,t);let r=o_(e.inputs,t);e.compute(l_(e.inputs,r),{inputs:[0]})},Z2=e=>{let t=e.starts,r=e.ends,a=e.axes;return Le({starts:t,ends:r,axes:a})}}),d_,p_,Q2,X2,Sz=ee(()=>{we(),Te(),et(),Qr(),ze(),d_=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},p_=(e,t)=>{let r=e.inputs[0],a=r.dims,i=L.size(a),s=a.length,o=L.normalizeAxis(t.axis,s),u=o<a.length-1,d,p=[];u?(p=Array.from({length:s},(E,B)=>B),p[o]=s-1,p[s-1]=o,d=e.compute(Nt(r,p),{inputs:[r],outputs:[-1]})[0]):d=r;let f=d.dims,m=f[s-1],g=i/m,_=Je(m),v=m/_,w=64;g===1&&(w=256);let k=(E,B)=>B===4?`max(max(${E}.x, ${E}.y), max(${E}.z, ${E}.w))`:B===2?`max(${E}.x, ${E}.y)`:B===3?`max(max(${E}.x, ${E}.y), ${E}.z)`:E,b=K("x",d.dataType,d.dims,_),$=he("result",d.dataType,d.dims,_),S=b.type.value,T=dt(d.dataType)==="f32"?`var threadMax = ${S}(-3.402823e+38f);`:`var threadMax = ${S}(-65504.0h);`,I=E=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${E.registerUniform("packedCols","i32").declareVariables(b,$)}
      ${E.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${k("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${Kr("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${_};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:f,dataType:d.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:v}]}),getShaderSource:I},{inputs:[d],outputs:[u?-1:0]})[0];u&&e.compute(Nt(A,p),{inputs:[A]})},Q2=(e,t)=>{d_(e.inputs),p_(e,t)},X2=e=>Le({axis:e.axis})}),Vp,c_,h_,f_,J2,Tz=ee(()=>{we(),Te(),ze(),Vp=e=>Array.from(e.getBigInt64Array(),Number),c_=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Vp(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},h_=(e,t)=>{let r=[];for(let a=0;a<e.length;++a)r.push(e[a]*t[a]);return r},f_=(e,t)=>{let r=e[0].dims,a=t??Vp(e[1]),i=h_(r,a),s=L.size(i),o=e[0].dataType,u=K("input",o,r.length),d=he("output",o,i.length),p=f=>`
      const inputShape = ${u.indices(...r)};
      ${f.registerUniform("output_size","u32").declareVariables(u,d)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},...ye(e[0].dims,i)]}),getShaderSource:p}},J2=e=>{c_(e.inputs),e.compute(f_(e.inputs),{inputs:[0]})}}),m_,g_,Y2,Cz=ee(()=>{we(),Te(),ze(),m_=(e,t,r,a,i)=>{let s=he("output_data",i,r.length,4),o=K("a_data",t[1].dataType,t[1].dims.length,4),u=K("b_data",t[2].dataType,t[2].dims.length,4),d=K("c_data",t[0].dataType,t[0].dims.length,4),p,f=(m,g,_)=>`select(${g}, ${m}, ${_})`;if(!a)p=s.setByOffset("global_idx",f(o.getByOffset("global_idx"),u.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let m=(g,_,v="")=>{let w=`a_data[index_a${_}][component_a${_}]`,k=`b_data[index_b${_}][component_b${_}]`,b=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${s.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${o.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_c${_} = ${d.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${v}(${f(w,k,b)});
          `};i===9?p=`
            var data = vec4<u32>(0);
            ${m("data",0,"u32")}
            ${m("data",1,"u32")}
            ${m("data",2,"u32")}
            ${m("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${m("output_data[global_idx]",0)}
            ${m("output_data[global_idx]",1)}
            ${m("output_data[global_idx]",2)}
            ${m("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(d,o,u,s)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},g_=e=>{let t=e[1].dims,r=e[2].dims,a=e[0].dims,i=e[1].dataType,s=!(L.areEqual(t,r)&&L.areEqual(r,a)),o=t,u=L.size(t);if(s){let p=ui.calcShape(ui.calcShape(t,r,!1),a,!1);if(!p)throw new Error("Can't perform where op on the given tensors");o=p,u=L.size(o)}let d=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>m_(p,e,o,s,i),getRunData:()=>({outputs:[{dims:o,dataType:i}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:d},...ye(a,t,r,o)]})}},Y2=e=>{e.compute(g_(e.inputs))}}),ex,Iz=ee(()=>{VE(),Jh(),qE(),jE(),LE(),GE(),FE(),XE(),YE(),ez(),tz(),rz(),az(),iz(),nz(),sz(),oz(),uz(),lz(),dz(),pz(),cz(),hz(),fz(),mz(),$2(),gz(),yz(),_z(),vz(),$z(),Xh(),wz(),bz(),xz(),kz(),Sz(),x2(),Tz(),Qr(),Yh(),Cz(),ex=new Map([["Abs",[Kb]],["Acos",[Zb]],["Acosh",[Qb]],["Add",[z1]],["ArgMax",[Lb,nh]],["ArgMin",[jb,nh]],["Asin",[Xb]],["Asinh",[Jb]],["Atan",[Yb]],["Atanh",[e1]],["Attention",[Gb]],["AveragePool",[O2,A2]],["BatchNormalization",[Fb]],["BiasAdd",[Hb]],["BiasSplitGelu",[E1]],["Cast",[r1,t1]],["Ceil",[i1]],["Clip",[a1]],["Concat",[W1,V1]],["Conv",[ph,dh]],["ConvTranspose",[X1,Q1]],["Cos",[n1]],["Cosh",[s1]],["CumSum",[J1,Y1]],["DepthToSpace",[e2,t2]],["DequantizeLinear",[U2,W2]],["Div",[A1]],["Einsum",[r2,a2]],["Elu",[o1,Hs]],["Equal",[O1]],["Erf",[u1]],["Exp",[l1]],["Expand",[i2]],["FastGelu",[n2]],["Floor",[d1]],["FusedConv",[ph,dh]],["Gather",[o2,s2]],["GatherElements",[h2,c2]],["GatherBlockQuantized",[d2,p2]],["GatherND",[u2,l2]],["Gelu",[p1]],["Gemm",[m2,f2]],["GlobalAveragePool",[B2,R2]],["GlobalMaxPool",[P2,D2]],["Greater",[M1]],["GreaterOrEqual",[P1]],["GridSample",[g2,y2]],["GroupQueryAttention",[k2]],["HardSigmoid",[v1,_1]],["InstanceNormalization",[S2]],["LayerNormalization",[T2]],["LeakyRelu",[c1,Hs]],["Less",[D1]],["LessOrEqual",[U1]],["Log",[C1]],["MatMul",[C2]],["MatMulNBits",[I2,E2]],["MaxPool",[N2,M2]],["Mul",[R1]],["MultiHeadAttention",[v2,_2]],["Neg",[f1]],["Not",[h1]],["Pad",[z2]],["Pow",[B1]],["QuickGelu",[I1,Hs]],["Range",[V2]],["Reciprocal",[m1]],["ReduceMin",[Pb]],["ReduceMean",[Rb]],["ReduceMax",[Db]],["ReduceSum",[Wb]],["ReduceProd",[Ub]],["ReduceL1",[Bb]],["ReduceL2",[Nb]],["ReduceLogSum",[qb]],["ReduceLogSumExp",[Mb]],["ReduceSumSquare",[Vb]],["Relu",[g1]],["Resize",[L2,G2]],["RotaryEmbedding",[F2]],["ScatterND",[j2,q2]],["Sigmoid",[y1]],["Sin",[$1]],["Sinh",[w1]],["Slice",[K2,Z2]],["SkipLayerNormalization",[H2]],["Split",[w2,b2]],["Sqrt",[b1]],["Softmax",[Q2,X2]],["Sub",[N1]],["Tan",[x1]],["Tanh",[k1]],["ThresholdedRelu",[T1,Hs]],["Tile",[J2]],["Transpose",[wb,bb]],["Where",[Y2]]])}),tx,Ez=ee(()=>{mr(),Pr(),ze(),tx=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,a,i){hr(e.programInfo.name);let s=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let p of t)u.push({binding:u.length,resource:{buffer:p.buffer}});for(let p of r)u.push({binding:u.length,resource:{buffer:p.buffer}});i&&u.push({binding:u.length,resource:i});let d=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:d,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}o.setPipeline(e.computePipeline),o.setBindGroup(0,d),o.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Vt(e.programInfo.name)}dispose(){}build(e,t){hr(e.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"},{feature:"subgroups-f16",extension:"subgroups_f16"}].forEach(p=>{r.features.has(p.feature)&&a.push(`enable ${p.extension};`)});let i=$b(t,this.backend.device.limits),s=e.getShaderSource(i),o=`${a.join(`
`)}
${i.additionalImplementations}
${s}`,u=r.createShaderModule({code:o,label:e.name});De("verbose",()=>`[WebGPU] ${e.name} shader code: ${o}`);let d=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Vt(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=i&&r<=i&&a<=i)return[t,r,a];let s=t*r*a,o=Math.ceil(Math.sqrt(s));if(o>i){if(o=Math.ceil(Math.cbrt(s)),o>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[o,o,o]}else return[o,o,1]}}}),y_,__,v_,$_,rx,zz=ee(()=>{mr(),we(),Pr(),fb(),UE(),Iz(),Ez(),y_=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let a=0;a<e.length;++a){let i=e[a].dataType;switch(t[a]){case"none":{r.push("");break}case"type":{r.push(`${i}`);break}case"rank":{let s=e[a].dims.length;r.push(`${i};${s}`);break}case"dims":{let s=e[a].dims.join(",");r.push(`${i};${s}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return r.join("|")},__=(e,t,r)=>{let a=e.name;return e.shaderCache?.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+r+`:${y_(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,a},v_=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},$_=class{constructor(e){this.subgroupsSupported=e.features.has("subgroups"),this.subgroupsF16Supported=e.features.has("subgroups");let t=e.limits;!this.subgroupsSupported||!t.minSubgroupSize||!t.maxSubgroupSize?this.subgroupSizeRange=void 0:this.subgroupSizeRange=[t.minSubgroupSize,t.maxSubgroupSize]}},rx=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},i=s=>t.features.has(s)&&r.push(s)&&!0;i("chromium-experimental-timestamp-query-inside-passes")||i("timestamp-query"),i("shader-f16"),i("subgroups")&&i("subgroups-f16"),this.device=await t.requestDevice(a),this.deviceInfo=new $_(this.device),this.adapterInfo=new v_(t.info||await t.requestAdapterInfo()),this.gpuDataManager=mb(this),this.programManager=new tx(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Hh(e.logLevel,!!e.debug),this.device.onuncapturederror=s=>{s.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${s.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;hr(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let i=r[a],s=i.kernelId,o=this.kernels.get(s),u=o.kernelType,d=o.kernelName,p=i.programName,f=i.inputTensorViews,m=i.outputTensorViews,g=t[a*2],_=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let v=Number(g-this.queryTimeBase),w=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(v)||!Number.isSafeInteger(w))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(k=>({dims:k.dims,dataType:za(k.dataType)})),outputsMetadata:m.map(k=>({dims:k.dims,dataType:za(k.dataType)})),kernelId:s,kernelType:u,kernelName:d,programName:p,startTime:v,endTime:w});else{let k="";f.forEach(($,S)=>{k+=`input[${S}]: [${$.dims}] | ${za($.dataType)}, `});let b="";m.forEach(($,S)=>{b+=`output[${S}]: [${$.dims}] | ${za($.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${d}|${p}" ${k}${b}execution time: ${w-v} ns`)}vo("GPU",`${p}::${g}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),Vt()}run(e,t,r,a,i,s){hr(e.name);let o=[];for(let $=0;$<t.length;++$){let S=t[$].data;if(S===0)continue;let T=this.gpuDataManager.get(S);if(!T)throw new Error(`no GPU data for input: ${S}`);o.push(T)}let{outputs:u,dispatchGroup:d,programUniforms:p}=e.getRunData(t),f=r.length===0?u.map(($,S)=>S):r;if(f.length!==u.length)throw new Error(`Output size ${f.length} must be equal to ${u.length}.`);let m=[],g=[];for(let $=0;$<u.length;++$){if(!Number.isInteger(f[$])||f[$]<-3||f[$]>=s)throw new Error(`Invalid output index: ${f[$]}`);if(f[$]===-3)continue;let S=f[$]===-1,T=f[$]===-2,I=S||T?i(u[$].dataType,u[$].dims):a(f[$],u[$].dataType,u[$].dims);if(m.push(I),I.data===0)continue;let A=this.gpuDataManager.get(I.data);if(!A)throw new Error(`no GPU data for output: ${I.data}`);if(S&&this.temporaryData.push(A),T){let E=this.kernelPersistentData.get(this.currentKernelId);E||(E=[],this.kernelPersistentData.set(this.currentKernelId,E)),E.push(A)}g.push(A)}if(o.length!==t.length||g.length!==m.length){if(g.length===0)return Vt(e.name),m;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(p){let $=0,S=[];p.forEach(E=>{let B=typeof E.data=="number"?[E.data]:E.data;if(B.length===0)return;let U=E.type===10?2:4,j,W;E.type===10?(W=B.length>4?16:B.length>2?8:B.length*U,j=B.length>4?16:U*B.length):(W=B.length<=2?B.length*U:16,j=16),$=Math.ceil($/W)*W,S.push($);let J=E.type===10?8:4;$+=B.length>4?Math.ceil(B.length/J)*j:B.length*U});let T=16;$=Math.ceil($/T)*T;let I=new ArrayBuffer($);p.forEach((E,B)=>{let U=S[B],j=typeof E.data=="number"?[E.data]:E.data;if(E.type===6)new Int32Array(I,U,j.length).set(j);else if(E.type===12)new Uint32Array(I,U,j.length).set(j);else if(E.type===10)new Uint16Array(I,U,j.length).set(j);else if(E.type===1)new Float32Array(I,U,j.length).set(j);else throw new Error(`Unsupported uniform type: ${za(E.type)}`)});let A=this.gpuDataManager.create($,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,I,0,$),this.gpuDataManager.release(A.id),_={offset:0,size:$,buffer:A.buffer}}let v=this.programManager.normalizeDispatchGroupSize(d),w=v[1]===1&&v[2]===1,k=__(e,t,w),b=this.programManager.getArtifact(k);if(b||(b=this.programManager.build(e,v),this.programManager.setArtifact(k,b),De("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),p&&b.uniformVariablesInfo){if(p.length!==b.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${b.uniformVariablesInfo.length}, got ${p.length} in program "${b.programInfo.name}".`);for(let $=0;$<p.length;$++){let S=p[$],T=S.type,I=typeof S.data=="number"?1:S.data.length,[A,E]=b.uniformVariablesInfo[$];if(T!==A||I!==E)throw new Error(`Uniform variable ${$} mismatch: expect type ${A} with size ${E}, got type ${T} with size ${I} in program "${b.programInfo.name}".`)}}if(De("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${v[0]}x${v[1]}x${v[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let $={kernelId:this.currentKernelId,programName:b.programInfo.name,inputTensorViews:t,outputTensorViews:m};this.pendingKernels.push($),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push($)}return this.programManager.run(b,o,g,v,_),Vt(e.name),m}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,a){let i=ex.get(e);if(!i)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:a,kernelEntry:i[0],attributes:[i[1],r]};this.kernels.set(t,s)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let i=a.kernelType,s=a.kernelName,o=a.kernelEntry,u=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),De("info",()=>`[WebGPU] Start to run kernel "[${i}] ${s}"...`);let d=this.env.debug;this.temporaryData=[];try{return d&&this.device.pushErrorScope("validation"),o(t,u[1]),0}catch(p){return r.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${s}" failed. ${p}`)),1}finally{d&&r.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${i}] ${s}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,a){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let s=i.get(t),o=this.gpuDataManager.registerExternalBuffer(r,a,s);return i.set(t,[o,r]),o}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let a=await rh(this,e,t);return Kh(a.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){De("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){De("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){De("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let a=0;a<r;a++){let i=this.getComputePassEncoder(),s=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(s.computePipeline),i.setBindGroup(0,s.bindGroup),i.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),w_,qp,b_,jp,Lp,Gp,x_,ax,Az=ee(()=>{Pr(),w_=1,qp=()=>w_++,b_=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),jp=(e,t)=>{let r=b_.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((a,i)=>a*i)*r/8):0},Lp=class{constructor(e){this.sessionId=e.sessionId,this.mlContext=e.context,this.mlTensor=e.tensor,this.dataType=e.dataType,this.tensorShape=e.shape}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return jp(this.dataType,this.tensorShape)}destroy(){De("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((a,i)=>a===r[i])}},Gp=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,a){let i=this.tensorManager.getMLContext(e);if(this.wrapper){if(this.wrapper.canReuseTensor(i,t,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==jp(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){if(this.wrapper)if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(e);return}else De("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(e):this.activeUpload=new Uint8Array(e)}async download(e){if(this.activeUpload)if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(this.activeUpload):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(this.activeUpload);return}else return this.activeUpload.buffer;if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},x_=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=qp();return this.tensorTrackersById.set(e,new Gp(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,a,i){De("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${a}, copyOld: ${i}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,a,i)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){De("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,a){let i=this.getMLContext(e),s=qp(),o=new Lp({sessionId:e,context:i,tensor:t,dataType:r,shape:a});return this.tensorTrackersById.set(s,new Gp(this,o)),this.externalTensors.add(o),s}async getCachedTensor(e,t,r,a,i,s){let o=this.getMLContext(e);for(let[d,p]of this.freeTensors.entries())if(p.canReuseTensor(o,t,r)){De("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}De("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let u=await o.createTensor({dataType:t,shape:r,dimensions:r,usage:a,writable:i,readable:s});return new Lp({sessionId:e,context:o,tensor:u,dataType:t,shape:r})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},ax=(...e)=>new x_(...e)}),Mo,k_,ix,Oz=ee(()=>{we(),Fa(),fb(),Az(),Pr(),Mo=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),k_=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),a=Object.keys(t).sort();return r.length===a.length&&r.every((i,s)=>i===a[s]&&e[i]===t[i])},ix=class{constructor(e){this.tensorManager=ax(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,Hh(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){De("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){De("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)De("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let r=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(r=>k_(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(i=>i.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){De("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,a,i){let s=Mo.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,a,i)}async createTemporaryTensor(e,t,r){De("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let a=Mo.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,a,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,t){if(!ut().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");De("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Kh(r,t)}}registerMLTensor(e,t,r,a){let i=Mo.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,i,a);return De("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${i}, dimensions: ${a}} -> {tensorId: ${s}}`),s}registerMLConstant(e,t,r,a,i,s){if(!s)throw new Error("External mounted files are not available.");let o=e;e.startsWith("./")&&(o=e.substring(2));let u=s.get(o);if(!u)throw new Error(`File with name ${o} not found in preloaded files.`);if(t+r>u.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=u.slice(t,t+r).buffer,p;switch(i.dataType){case"float32":p=new Float32Array(d);break;case"float16":p=new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return De("verbose",()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}}`),a.constant(i,p)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}flush(){}}}),nx={};ko(nx,{init:()=>sx});var Do,S_,sx,Rz=ee(()=>{we(),zz(),Pr(),Te(),Oz(),Do=class ox{constructor(t,r,a,i){this.module=t,this.dataType=r,this.data=a,this.dims=i}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(L.size(t)!==L.size(this.dims))throw new Error("Invalid new shape");return new ox(this.module,this.dataType,this.data,t)}},S_=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceInfo=t.deviceInfo;let a=e.PTR_SIZE,i=r/e.PTR_SIZE,s=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*i++,s));let o=Number(e.getValue(a*i++,s));this.outputCount=Number(e.getValue(a*i++,s)),this.customDataOffset=Number(e.getValue(a*i++,"*")),this.customDataSize=Number(e.getValue(a*i++,s));let u=[];for(let d=0;d<o;d++){let p=Number(e.getValue(a*i++,s)),f=Number(e.getValue(a*i++,"*")),m=Number(e.getValue(a*i++,s)),g=[];for(let _=0;_<m;_++)g.push(Number(e.getValue(a*i++,s)));u.push(new Do(e,p,f,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(o=>typeof o=="number"?this.inputs[o]:o)??this.inputs,a=t?.outputs??[],i=(o,u,d)=>new Do(this.module,u,this.output(o,d),d),s=(o,u)=>{let d=Aa(o,u);if(!d)throw new Error(`Unsupported data type: ${o}`);let p=d>0?this.backend.gpuDataManager.create(d).id:0;return new Do(this.module,o,p,u)};return this.backend.run(e,r,a,i,s,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let a=this.module.PTR_SIZE,i=a===4?"i32":"i64",s=this.module.stackAlloc((1+t.length)*a);this.module.setValue(s,t.length,i);for(let o=0;o<t.length;o++)this.module.setValue(s+a*(o+1),t[o],i);return this.module._JsepOutput(this.opKernelContext,e,s)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(r)}}},sx=async(e,t,r,a)=>{let i=t.jsepInit;if(!i)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let s=new rx;await s.initialize(r,a),i("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,d,p=!1)=>{if(p)De("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(d)}`),s.memcpy(Number(o),Number(u));else{De("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(u),f)}},async(o,u,d)=>{De("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+d)>>>0))},(o,u,d)=>s.createKernel(o,Number(u),d,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,d,p)=>{De("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${u}`);let f=new S_(t,s,Number(u));return s.computeKernel(Number(o),f,p)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let s=new ix(r);i("webnn",[s,()=>s.reserveTensorId(),o=>s.releaseTensorId(o),async(o,u,d,p,f)=>s.ensureTensor(o,u,d,p,f),(o,u)=>{s.uploadTensor(o,u)},async(o,u)=>s.downloadTensor(o,u)])}}}),T_,sf,of,Vr,C_,wu,uf,lf,Fp,df,pf,cf,ux=ee(()=>{DE(),PE(),we(),Fa(),qh(),hb(),T_=(e,t)=>{ut()._OrtInit(e,t)!==0&&qe("Can't initialize onnxruntime.")},sf=async e=>{T_(e.wasm.numThreads,yu(e.logLevel))},of=async(e,t)=>{{let r=(Rz(),mu(nx)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let a=e.webgpu.adapter;if(a){if(typeof a.limits!="object"||typeof a.features!="object"||typeof a.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(a=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:s}),!a)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",ut(),e,a)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",ut(),e)}}},Vr=new Map,C_=e=>{let t=ut(),r=t.stackSave();try{let a=t.PTR_SIZE,i=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,i,i+a)!==0&&qe("Can't get session input/output count.");let s=a===4?"i32":"i64";return[Number(t.getValue(i,s)),Number(t.getValue(i+a,s))]}finally{t.stackRestore(r)}},wu=e=>{let t=ut(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},uf=async(e,t)=>{let r,a,i=ut();Array.isArray(e)?[r,a]=e:e.buffer===i.HEAPU8.buffer?[r,a]=[e.byteOffset,e.byteLength]:[r,a]=wu(e);let s=0,o=0,u=0,d=[],p=[],f=[];try{if([o,d]=cb(t),t?.externalData&&i.mountExternalData){let $=[];for(let S of t.externalData){let T=typeof S=="string"?S:S.path;$.push(Fh(typeof S=="string"?S:S.data).then(I=>{i.mountExternalData(T,I)}))}await Promise.all($)}for(let $ of t?.executionProviders??[])if((typeof $=="string"?$:$.name)==="webnn"){if(i.shouldTransferToMLTensor=!1,typeof $!="string"){let S=$,T=S?.context,I=S?.gpuDevice,A=S?.deviceType,E=S?.powerPreference;T?i.currentContext=T:I?i.currentContext=await i.jsepCreateMLContext(I):i.currentContext=await i.jsepCreateMLContext({deviceType:A,powerPreference:E})}else i.currentContext=await i.jsepCreateMLContext();break}s=await i._OrtCreateSession(r,a,o),s===0&&qe("Can't create a session."),i.jsepOnCreateSession?.(),i.currentContext&&(i.jsepRegisterMLContext(s,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[m,g]=C_(s),_=!!t?.enableGraphCapture,v=[],w=[],k=[];for(let $=0;$<m;$++){let S=i._OrtGetInputName(s,$);S===0&&qe("Can't get an input name."),p.push(S),v.push(i.UTF8ToString(S))}for(let $=0;$<g;$++){let S=i._OrtGetOutputName(s,$);S===0&&qe("Can't get an output name."),f.push(S);let T=i.UTF8ToString(S);w.push(T);{if(_&&t?.preferredOutputLocation===void 0){k.push("gpu-buffer");continue}let I=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[T]??"cpu";if(I!=="cpu"&&I!=="cpu-pinned"&&I!=="gpu-buffer"&&I!=="ml-tensor")throw new Error(`Not supported preferred output location: ${I}.`);if(_&&I!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${I}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);k.push(I)}}let b=null;return k.some($=>$==="gpu-buffer"||$==="ml-tensor")&&(u=i._OrtCreateBinding(s),u===0&&qe("Can't create IO binding."),b={handle:u,outputPreferredLocations:k,outputPreferredLocationsEncoded:k.map($=>th($))}),Vr.set(s,[s,p,f,b,_,!1]),[s,v,w]}catch(m){throw p.forEach(g=>i._OrtFree(g)),f.forEach(g=>i._OrtFree(g)),u!==0&&i._OrtReleaseBinding(u)!==0&&qe("Can't release IO binding."),s!==0&&i._OrtReleaseSession(s)!==0&&qe("Can't release session."),m}finally{i._free(r),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&qe("Can't release session options."),d.forEach(m=>i._free(m)),i.unmountExternalData?.()}},lf=e=>{let t=ut(),r=Vr.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,i,s,o,u]=r;o&&(u&&t._OrtClearBoundOutputs(o.handle)!==0&&qe("Can't clear bound outputs."),t._OrtReleaseBinding(o.handle)!==0&&qe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),i.forEach(d=>t._OrtFree(d)),s.forEach(d=>t._OrtFree(d)),t._OrtReleaseSession(a)!==0&&qe("Can't release session."),Vr.delete(e)},Fp=async(e,t,r,a,i,s=!1)=>{if(!e){t.push(0);return}let o=ut(),u=o.PTR_SIZE,d=e[0],p=e[1],f=e[3],m=f,g,_;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let k=e[2].gpuBuffer;_=Aa(Ya(d),p);let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=b(a,i,k,_)}else if(f==="ml-tensor"){let k=e[2].mlTensor;_=Aa(Ya(d),p);let b=o.jsepRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=b(a,k,Ya(d),p)}else{let k=e[2];if(Array.isArray(k)){_=u*k.length,g=o._malloc(_),r.push(g);for(let b=0;b<k.length;b++){if(typeof k[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(g+b*u,$t(k[b],r),"*")}}else{let b=o.jsepIsGraphInput;if(d!=="string"&&b){let $=o._OrtGetInputName(a,i),S=o.UTF8ToString($);if(b(a,S)){let T=Ya(d);_=Aa(T,p),m="ml-tensor";let I=o.jsepCreateTemporaryTensor,A=o.jsepUploadTensor;if(!I||!A)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let E=await I(a,T,p);A(E,new Uint8Array(k.buffer,k.byteOffset,k.byteLength)),g=E}else _=k.byteLength,g=o._malloc(_),r.push(g),o.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}else _=k.byteLength,g=o._malloc(_),r.push(g),o.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}}let v=o.stackSave(),w=o.stackAlloc(4*p.length);try{p.forEach((b,$)=>o.setValue(w+$*u,b,u===4?"i32":"i64"));let k=o._OrtCreateTensor(Ya(d),g,_,w,p.length,th(m));k===0&&qe(`Can't create tensor for input/output. session=${a}, index=${i}.`),t.push(k)}finally{o.stackRestore(v)}},df=async(e,t,r,a,i,s)=>{let o=ut(),u=o.PTR_SIZE,d=Vr.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=d[0],f=d[1],m=d[2],g=d[3],_=d[4],v=d[5],w=t.length,k=a.length,b=0,$=[],S=[],T=[],I=[],A=o.stackSave(),E=o.stackAlloc(w*u),B=o.stackAlloc(w*u),U=o.stackAlloc(k*u),j=o.stackAlloc(k*u);try{[b,$]=pb(s);for(let P=0;P<w;P++)await Fp(r[P],S,I,e,t[P],_);for(let P=0;P<k;P++)await Fp(i[P],T,I,e,w+a[P],_);for(let P=0;P<w;P++)o.setValue(E+P*u,S[P],"*"),o.setValue(B+P*u,f[t[P]],"*");for(let P=0;P<k;P++)o.setValue(U+P*u,T[P],"*"),o.setValue(j+P*u,m[a[P]],"*");if(g&&!v){let{handle:P,outputPreferredLocations:se,outputPreferredLocationsEncoded:ue}=g;if(f.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${f.length}).`);for(let F=0;F<w;F++){let oe=t[F];await o._OrtBindInput(P,f[oe],S[F])!==0&&qe(`Can't bind input[${F}] for session=${e}.`)}for(let F=0;F<k;F++){let oe=a[F];i[F]?.[3]?o._OrtBindOutput(P,m[oe],T[F],0)!==0&&qe(`Can't bind pre-allocated output[${F}] for session=${e}.`):o._OrtBindOutput(P,m[oe],0,ue[oe])!==0&&qe(`Can't bind output[${F}] to ${se[F]} for session=${e}.`)}Vr.set(e,[p,f,m,g,_,!0])}o.jsepOnRunStart?.(p);let W;g?W=await o._OrtRunWithBinding(p,g.handle,k,U,b):W=await o._OrtRun(p,B,E,w,j,k,U,b),W!==0&&qe("failed to call OrtRun().");let J=[];for(let P=0;P<k;P++){let se=Number(o.getValue(U+P*u,"*"));if(se===T[P]){J.push(i[P]);continue}let ue=o.stackSave(),F=o.stackAlloc(4*u),oe=!1,le,H=0;try{o._OrtGetTensorData(se,F,F+u,F+2*u,F+3*u)!==0&&qe(`Can't access output tensor data on index ${P}.`);let de=u===4?"i32":"i64",M=Number(o.getValue(F,de));H=o.getValue(F+u,"*");let V=o.getValue(F+u*2,"*"),R=Number(o.getValue(F+u*3,de)),X=[];for(let Ne=0;Ne<R;Ne++)X.push(Number(o.getValue(V+Ne*u,de)));o._OrtFree(V)!==0&&qe("Can't free memory for tensor dims.");let Ie=X.reduce((Ne,Ee)=>Ne*Ee,1);le=za(M);let Fe=g?.outputPreferredLocations[a[P]];if(le==="string"){if(Fe==="gpu-buffer"||Fe==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ne=[];for(let Ee=0;Ee<Ie;Ee++){let Me=o.getValue(H+Ee*u,"*"),wr=o.getValue(H+(Ee+1)*u,"*"),Lt=Ee===Ie-1?void 0:wr-Me;Ne.push(o.UTF8ToString(Me,Lt))}J.push([le,X,Ne,"cpu"])}else if(Fe==="gpu-buffer"&&Ie>0){let Ne=o.jsepGetBuffer;if(!Ne)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Ee=Ne(H),Me=Aa(M,Ie);if(Me===void 0||!Lh(le))throw new Error(`Unsupported data type: ${le}`);oe=!0,J.push([le,X,{gpuBuffer:Ee,download:o.jsepCreateDownloader(Ee,Me,le),dispose:()=>{o._OrtReleaseTensor(se)!==0&&qe("Can't release tensor.")}},"gpu-buffer"])}else if(Fe==="ml-tensor"&&Ie>0){let Ne=o.jsepEnsureTensor;if(!Ne)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Aa(M,Ie)===void 0||!Gh(le))throw new Error(`Unsupported data type: ${le}`);let Ee=await Ne(e,H,M,X,!1);oe=!0,J.push([le,X,{mlTensor:Ee,download:o.jsepCreateMLTensorDownloader(H,le),dispose:()=>{o.jsepReleaseTensorId(H),o._OrtReleaseTensor(se)}},"ml-tensor"])}else{let Ne=jh(le),Ee=new Ne(Ie);new Uint8Array(Ee.buffer,Ee.byteOffset,Ee.byteLength).set(o.HEAPU8.subarray(H,H+Ee.byteLength)),J.push([le,X,Ee,"cpu"])}}finally{o.stackRestore(ue),le==="string"&&H&&o._free(H),oe||o._OrtReleaseTensor(se),o.jsepOnRunEnd?.(p)}}return g&&!_&&(o._OrtClearBoundOutputs(g.handle)!==0&&qe("Can't clear bound outputs."),Vr.set(e,[p,f,m,g,_,!1])),J}finally{o.stackRestore(A),S.forEach(W=>o._OrtReleaseTensor(W)),T.forEach(W=>o._OrtReleaseTensor(W)),I.forEach(W=>o._free(W)),b!==0&&o._OrtReleaseRunOptions(b),$.forEach(W=>o._free(W))}},pf=e=>{let t=ut(),r=Vr.get(e);if(!r)throw new Error("invalid session id");let a=r[0],i=t._OrtEndProfiling(a);i===0&&qe("Can't get an profile file name."),t._OrtFree(i)},cf=e=>{let t=[];for(let r of e){let a=r[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),qr,Dt,Qa,As,Os,Po,Hp,Uo,xa,ka,I_,lx,dx,px,cx,hx,fx,mx,gx=ee(()=>{mr(),ux(),Fa(),Wh(),qr=()=>!!Ke.wasm.proxy&&typeof document<"u",Qa=!1,As=!1,Os=!1,Uo=new Map,xa=(e,t)=>{let r=Uo.get(e);r?r.push(t):Uo.set(e,[t])},ka=()=>{if(Qa||!As||Os||!Dt)throw new Error("worker not ready")},I_=e=>{switch(e.data.type){case"init-wasm":Qa=!1,e.data.err?(Os=!0,Hp[1](e.data.err)):(As=!0,Hp[0]()),Po&&(URL.revokeObjectURL(Po),Po=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Uo.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},lx=async()=>{if(!As){if(Qa)throw new Error("multiple calls to 'initWasm()' detected.");if(Os)throw new Error("previous call to 'initWasm()' failed.");if(Qa=!0,qr())return new Promise((e,t)=>{Dt?.terminate(),lb().then(([r,a])=>{try{Dt=a,Dt.onerror=s=>t(s),Dt.onmessage=I_,Hp=[e,t];let i={type:"init-wasm",in:Ke};!i.in.wasm.wasmPaths&&(r||import.meta.url?.startsWith("file:"))&&(i.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href}),Dt.postMessage(i),Po=r}catch(i){t(i)}},t)});try{await Vh(Ke.wasm),await sf(Ke),As=!0}catch(e){throw Os=!0,e}finally{Qa=!1}}},dx=async e=>{if(qr())return ka(),new Promise((t,r)=>{xa("init-ep",[t,r]);let a={type:"init-ep",in:{epName:e,env:Ke}};Dt.postMessage(a)});await of(Ke,e)},px=async e=>qr()?(ka(),new Promise((t,r)=>{xa("copy-from",[t,r]);let a={type:"copy-from",in:{buffer:e}};Dt.postMessage(a,[e.buffer])})):wu(e),cx=async(e,t)=>{if(qr()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return ka(),new Promise((r,a)=>{xa("create",[r,a]);let i={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),Dt.postMessage(i,s)})}else return uf(e,t)},hx=async e=>{if(qr())return ka(),new Promise((t,r)=>{xa("release",[t,r]);let a={type:"release",in:e};Dt.postMessage(a)});lf(e)},fx=async(e,t,r,a,i,s)=>{if(qr()){if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(i.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return ka(),new Promise((o,u)=>{xa("run",[o,u]);let d=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:a,options:s}};Dt.postMessage(p,cf(d))})}else return df(e,t,r,a,i,s)},mx=async e=>{if(qr())return ka(),new Promise((t,r)=>{xa("end-profiling",[t,r]);let a={type:"end-profiling",in:e};Dt.postMessage(a)});pf(e)}}),Kp,E_,yx,Bz=ee(()=>{mr(),gx(),we(),Uh(),hb(),Kp=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},E_=e=>{switch(e[3]){case"cpu":return new lr(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Lh(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:i}=e[2];return lr.fromGpuBuffer(r,{dataType:t,dims:e[1],download:a,dispose:i})}case"ml-tensor":{let t=e[0];if(!Gh(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:i}=e[2];return lr.fromMLTensor(r,{dataType:t,dims:e[1],download:a,dispose:i})}default:throw new Error(`invalid data location: ${e[3]}`)}},yx=class{async fetchModelAndCopyToWasmMemory(e){return px(await Fh(e))}async loadModel(e,t){hr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames]=await cx(r,t),Vt()}async dispose(){return hx(this.sessionId)}async run(e,t,r){hr();let a=[],i=[];Object.entries(e).forEach(m=>{let g=m[0],_=m[1],v=this.inputNames.indexOf(g);if(v===-1)throw new Error(`invalid input '${g}'`);a.push(_),i.push(v)});let s=[],o=[];Object.entries(t).forEach(m=>{let g=m[0],_=m[1],v=this.outputNames.indexOf(g);if(v===-1)throw new Error(`invalid output '${g}'`);s.push(_),o.push(v)});let u=a.map((m,g)=>Kp(m,()=>`input "${this.inputNames[i[g]]}"`)),d=s.map((m,g)=>m?Kp(m,()=>`output "${this.outputNames[o[g]]}"`):null),p=await fx(this.sessionId,i,u,o,d,r),f={};for(let m=0;m<p.length;m++)f[this.outputNames[o[m]]]=s[m]??E_(p[m]);return Vt(),f}startProfiling(){}endProfiling(){mx(this.sessionId)}}}),_x={};ko(_x,{OnnxruntimeWebAssemblyBackend:()=>fh,initializeFlags:()=>hh,wasmBackend:()=>vx});var hh,fh,vx,Nz=ee(()=>{mr(),gx(),Bz(),hh=()=>{if((typeof Ke.wasm.initTimeout!="number"||Ke.wasm.initTimeout<0)&&(Ke.wasm.initTimeout=0),Ke.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof Ke.wasm.proxy!="boolean"&&(Ke.wasm.proxy=!1),typeof Ke.wasm.trace!="boolean"&&(Ke.wasm.trace=!1),typeof Ke.wasm.numThreads!="number"||!Number.isInteger(Ke.wasm.numThreads)||Ke.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ke.wasm.numThreads=1;else{let e=typeof navigator>"u"?$E("node:os").cpus().length:navigator.hardwareConcurrency;Ke.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},fh=class{async init(e){hh(),await lx(),await dx(e)}async createInferenceSessionHandler(e,t){let r=new yx;return await r.loadModel(e,t),Promise.resolve(r)}},vx=new fh});mr();mr();mr();var Mz="1.21.0",Dz=ab;{let e=(Nz(),mu(_x)).wasmBackend;Na("webgpu",e,5),Na("webnn",e,5),Na("cpu",e,10),Na("wasm",e,10)}Object.defineProperty(Ke.versions,"web",{value:Mz,enumerable:!0});const Pz=Object.freeze(Object.defineProperty({__proto__:null,get InferenceSession(){return Ph},get TRACE(){return vo},get TRACE_FUNC_BEGIN(){return hr},get TRACE_FUNC_END(){return Vt},get Tensor(){return lr},default:Dz,get env(){return Ke},get registerBackend(){return Na}},Symbol.toStringTag,{value:"Module"}));var hf=Object.defineProperty,Uz=Object.getOwnPropertyDescriptor,Wz=Object.getOwnPropertyNames,Vz=Object.prototype.hasOwnProperty,qz=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),te=(e,t)=>()=>(e&&(t=e(e=0)),t),So=(e,t)=>{for(var r in t)hf(e,r,{get:t[r],enumerable:!0})},jz=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Wz(t))!Vz.call(e,i)&&i!==r&&hf(e,i,{get:()=>t[i],enumerable:!(a=Uz(t,i))||a.enumerable});return e},bu=e=>jz(hf({},"__esModule",{value:!0}),e),Rs,jr,Ma,z_,$x,wx=te(()=>{Rs=new Map,jr=[],Ma=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=Rs.get(e);if(a===void 0)Rs.set(e,{backend:t,priority:r});else{if(a.priority>r)return;if(a.priority===r&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let i=jr.indexOf(e);i!==-1&&jr.splice(i,1);for(let s=0;s<jr.length;s++)if(Rs.get(jr[s]).priority<=r){jr.splice(s,0,e);return}jr.push(e)}return}throw new TypeError("not a valid backend")},z_=async e=>{let t=Rs.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(a){return r||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},$x=async e=>{let t=e.executionProviders||[],r=t.map(d=>typeof d=="string"?d:d.name),a=r.length===0?jr:r,i,s=[],o=new Set;for(let d of a){let p=await z_(d);typeof p=="string"?s.push({name:d,err:p}):(i||(i=p),i===p&&o.add(d))}if(!i)throw new Error(`no available backend found. ERR: ${s.map(d=>`[${d.name}] ${d.err}`).join(", ")}`);for(let{name:d,err:p}of s)r.includes(d)&&console.warn(`removing requested execution provider "${d}" from session options because it is not available: ${p}`);let u=t.filter(d=>o.has(typeof d=="string"?d:d.name));return[i,new Proxy(e,{get:(d,p)=>p==="executionProviders"?u:Reflect.get(d,p)})]}}),Lz=te(()=>{wx()}),bx,Gz=te(()=>{bx="1.21.0"}),Zp,Wt,xx=te(()=>{Gz(),Zp="warning",Wt={wasm:{},webgl:{},webgpu:{},versions:{common:bx},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Zp=e}},get logLevel(){return Zp}},Object.defineProperty(Wt,"logLevel",{enumerable:!0})}),Ze,Fz=te(()=>{xx(),Ze=Wt}),kx,Sx,Hz=te(()=>{kx=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let a=r.getContext("2d");if(a!=null){let i,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(i=e.dims[2],s=e.dims[3]):(i=e.dims[3],s=e.dims[2]);let o=t?.format!==void 0?t.format:"RGB",u=t?.norm,d,p;u===void 0||u.mean===void 0?d=[255,255,255,255]:typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:(d=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(d[3]=u.mean[3])),u===void 0||u.bias===void 0?p=[0,0,0,0]:typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:(p=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(p[3]=u.bias[3]));let f=s*i,m=0,g=f,_=f*2,v=-1;o==="RGBA"?(m=0,g=f,_=f*2,v=f*3):o==="RGB"?(m=0,g=f,_=f*2):o==="RBG"&&(m=0,_=f,g=f*2);for(let w=0;w<s;w++)for(let k=0;k<i;k++){let b=(e.data[m++]-p[0])*d[0],$=(e.data[g++]-p[1])*d[1],S=(e.data[_++]-p[2])*d[2],T=v===-1?255:(e.data[v++]-p[3])*d[3];a.fillStyle="rgba("+b+","+$+","+S+","+T+")",a.fillRect(k,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Sx=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(r!=null){let i,s,o;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(i=e.dims[2],s=e.dims[1],o=e.dims[3]):(i=e.dims[3],s=e.dims[2],o=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",d=t?.norm,p,f;d===void 0||d.mean===void 0?p=[255,255,255,255]:typeof d.mean=="number"?p=[d.mean,d.mean,d.mean,d.mean]:(p=[d.mean[0],d.mean[1],d.mean[2],255],d.mean[3]!==void 0&&(p[3]=d.mean[3])),d===void 0||d.bias===void 0?f=[0,0,0,0]:typeof d.bias=="number"?f=[d.bias,d.bias,d.bias,d.bias]:(f=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(f[3]=d.bias[3]));let m=s*i;if(t!==void 0&&(t.format!==void 0&&o===4&&t.format!=="RGBA"||o===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,v=1,w=2,k=3,b=0,$=m,S=m*2,T=-1;u==="RGBA"?(b=0,$=m,S=m*2,T=m*3):u==="RGB"?(b=0,$=m,S=m*2):u==="RBG"&&(b=0,S=m,$=m*2),a=r.createImageData(i,s);for(let I=0;I<s*i;_+=g,v+=g,w+=g,k+=g,I++)a.data[_]=(e.data[b++]-f[0])*p[0],a.data[v]=(e.data[$++]-f[1])*p[1],a.data[w]=(e.data[S++]-f[2])*p[2],a.data[k]=T===-1?255:(e.data[T++]-f[3])*p[3]}else throw new Error("Can not access image data");return a}}),Wo,Tx,Cx,Ix,Ex,zx,Kz=te(()=>{ff(),Wo=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:a}=t,i=t.norm??{mean:255,bias:0},s,o;typeof i.mean=="number"?s=[i.mean,i.mean,i.mean,i.mean]:s=[i.mean[0],i.mean[1],i.mean[2],i.mean[3]??255],typeof i.bias=="number"?o=[i.bias,i.bias,i.bias,i.bias]:o=[i.bias[0],i.bias[1],i.bias[2],i.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",d=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",p=r*a,f=d==="RGBA"?new Float32Array(p*4):new Float32Array(p*3),m=4,g=0,_=1,v=2,w=3,k=0,b=p,$=p*2,S=-1;u==="RGB"&&(m=3,g=0,_=1,v=2,w=-1),d==="RGBA"?S=p*3:d==="RBG"?(k=0,$=p,b=p*2):d==="BGR"&&($=0,b=p,k=p*2);for(let T=0;T<p;T++,g+=m,v+=m,_+=m,w+=m)f[k++]=(e[g]+o[0])/s[0],f[b++]=(e[_]+o[1])/s[1],f[$++]=(e[v]+o[2])/s[2],S!==-1&&w!==-1&&(f[S++]=(e[w]+o[3])/s[3]);return d==="RGBA"?new Bt("float32",f,[1,4,r,a]):new Bt("float32",f,[1,3,r,a])},Tx=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,i=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",o,u=t??{},d=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},p=f=>typeof HTMLCanvasElement<"u"&&f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(r){let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=g,u.width=_}else u.tensorFormat="RGBA",u.height=g,u.width=_;m.drawImage(e,0,0),o=m.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(a){let f,m;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(f=t.resizedHeight,m=t.resizedWidth):(f=e.height,m=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=f,u.width=m,t!==void 0){let g=d();g.width=m,g.height=f;let _=p(g);if(_!=null)_.putImageData(e,0,0),o=_.getImageData(0,0,m,f).data;else throw new Error("Can not access image data")}else o=e.data}else if(i){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=d();f.width=e.width,f.height=e.height;let m=p(f);if(m!=null){let g=e.height,_=e.width;return m.drawImage(e,0,0,_,g),o=m.getImageData(0,0,_,g).data,u.height=g,u.width=_,Wo(o,u)}else throw new Error("Can not access image data")}else{if(s)return new Promise((f,m)=>{let g=d(),_=p(g);if(!e||!_)return m();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{g.width=v.width,g.height=v.height,_.drawImage(v,0,0,g.width,g.height);let w=_.getImageData(0,0,g.width,g.height);u.height=g.height,u.width=g.width,f(Wo(w.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(o!==void 0)return Wo(o,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Cx=(e,t)=>{let{width:r,height:a,download:i,dispose:s}=t,o=[1,a,r,4];return new Bt({location:"texture",type:"float32",texture:e,dims:o,download:i,dispose:s})},Ix=(e,t)=>{let{dataType:r,dims:a,download:i,dispose:s}=t;return new Bt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:a,download:i,dispose:s})},Ex=(e,t)=>{let{dataType:r,dims:a,download:i,dispose:s}=t;return new Bt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:a,download:i,dispose:s})},zx=(e,t,r)=>new Bt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Oa,Zs,Qp,Ax,Zz=te(()=>{Oa=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Zs=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Qp=!1,Ax=()=>{if(!Qp){Qp=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,a=typeof r<"u"&&r.from;e&&(Oa.set("int64",BigInt64Array),Zs.set(BigInt64Array,"int64")),t&&(Oa.set("uint64",BigUint64Array),Zs.set(BigUint64Array,"uint64")),a?(Oa.set("float16",r),Zs.set(r,"float16")):Oa.set("float16",Uint16Array)}}}),Ox,Rx,Qz=te(()=>{ff(),Ox=e=>{let t=1;for(let r=0;r<e.length;r++){let a=e[r];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${r}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${a}`);t*=a}return t},Rx=(e,t)=>{switch(e.location){case"cpu":return new Bt(e.type,e.data,t);case"cpu-pinned":return new Bt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Bt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Bt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Bt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Bt,ff=te(()=>{Hz(),Kz(),Zz(),Qz(),Bt=class{constructor(e,t,r){Ax();let a,i;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,i=e.dims,e.location){case"cpu-pinned":{let o=Oa.get(a);if(!o)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof o))throw new TypeError(`buffer should be of type ${o.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let o,u;if(typeof e=="string")if(a=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");o=t}else{let d=Oa.get(e);if(d===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&d===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${d.name} as data.`);e==="uint64"||e==="int64"?o=d.from(t,BigInt):o=d.from(t)}else if(t instanceof d)o=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")o=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&d!==Uint16Array)o=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${d}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let d=typeof e[0];if(d==="string")a="string",o=e;else if(d==="boolean")a="bool",o=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${d}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",o=Uint8Array.from(e);else{let d=Zs.get(e.constructor);if(d===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=d,o=e}if(u===void 0)u=[o.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");i=u,this.cpuData=o,this.dataLocation="cpu"}let s=Ox(i);if(this.cpuData&&s!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=i,this.size=s}static async fromImage(e,t){return Tx(e,t)}static fromTexture(e,t){return Cx(e,t)}static fromGpuBuffer(e,t){return Ix(e,t)}static fromMLTensor(e,t){return Ex(e,t)}static fromPinnedBuffer(e,t,r){return zx(e,t,r)}toDataURL(e){return kx(this,e)}toImageData(e){return Sx(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Rx(this,e)}}}),dr,Bx=te(()=>{ff(),dr=Bt}),wo,Xp,fr,qt,Nx=te(()=>{xx(),wo=(e,t)=>{(typeof Wt.trace>"u"?!Wt.wasm.trace:!Wt.trace)||console.timeStamp(`${e}::ORT::${t}`)},Xp=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],a=!1;for(let i=0;i<r.length;i++){if(a&&!r[i].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[i].trim().split(" ")[1]}`;t&&(s+=`::${t}`),wo("CPU",s);return}r[i].includes("TRACE_FUNC")&&(a=!0)}},fr=e=>{(typeof Wt.trace>"u"?!Wt.wasm.trace:!Wt.trace)||Xp("BEGIN",e)},qt=e=>{(typeof Wt.trace>"u"?!Wt.wasm.trace:!Wt.trace)||Xp("END",e)}}),Mx,Xz=te(()=>{wx(),Bx(),Nx(),Mx=class Dx{constructor(t){this.handler=t}async run(t,r,a){fr();let i={},s={};if(typeof t!="object"||t===null||t instanceof dr||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let o=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof dr)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");o=!1;for(let p of r){if(typeof p!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(p)===-1)throw new RangeError(`'fetches' contains invalid output name: ${p}.`);i[p]=null}if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let p=!1,f=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(f.indexOf(m)!==-1){let g=r[m];(g===null||g instanceof dr)&&(p=!0,o=!1,i[m]=g)}if(p){if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let p of this.inputNames)if(typeof t[p]>"u")throw new Error(`input '${p}' is missing in 'feeds'.`);if(o)for(let p of this.outputNames)i[p]=null;let u=await this.handler.run(t,i,s),d={};for(let p in u)if(Object.hasOwnProperty.call(u,p)){let f=u[p];f instanceof dr?d[p]=f:d[p]=new dr(f.type,f.data,f.dims)}return qt(),d}async release(){return this.handler.dispose()}static async create(t,r,a,i){fr();let s,o={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)o=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let f=t,m=0,g=t.byteLength;if(typeof r=="object"&&r!==null)o=r;else if(typeof r=="number"){if(m=r,!Number.isSafeInteger(m))throw new RangeError("'byteOffset' must be an integer.");if(m<0||m>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(g=t.byteLength-m,typeof a=="number"){if(g=a,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||m+g>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-m}].`);if(typeof i=="object"&&i!==null)o=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(f,m,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,d]=await $x(o),p=await u.createInferenceSessionHandler(s,d);return qt(),new Dx(p)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}}),mf,Jz=te(()=>{Xz(),mf=Mx}),Yz=te(()=>{}),eA=te(()=>{}),tA=te(()=>{}),rA=te(()=>{}),Px={};So(Px,{InferenceSession:()=>mf,TRACE:()=>wo,TRACE_FUNC_BEGIN:()=>fr,TRACE_FUNC_END:()=>qt,Tensor:()=>dr,env:()=>Ze,registerBackend:()=>Ma});var gr=te(()=>{Lz(),Fz(),Jz(),Bx(),Yz(),eA(),Nx(),tA(),rA()}),gf=te(()=>{}),Ux={};So(Ux,{default:()=>Wx});var Jp,Yp,Wx,aA=te(()=>{jS(),Ka(),yf(),Jp="ort-wasm-proxy-worker",Yp=globalThis.self?.name===Jp,Yp&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":_f(r.wasm).then(()=>{Mf(r).then(()=>{postMessage({type:t})},a=>{postMessage({type:t,err:a})})},a=>{postMessage({type:t,err:a})});break;case"init-ep":{let{epName:a,env:i}=r;Df(i,a).then(()=>{postMessage({type:t})},s=>{postMessage({type:t,err:s})});break}case"copy-from":{let{buffer:a}=r,i=Iu(a);postMessage({type:t,out:i});break}case"create":{let{model:a,options:i}=r;Pf(a,i).then(s=>{postMessage({type:t,out:s})},s=>{postMessage({type:t,err:s})});break}case"release":Uf(r),postMessage({type:t});break;case"run":{let{sessionId:a,inputIndices:i,inputs:s,outputIndices:o,options:u}=r;Wf(a,i,s,o,new Array(o.length).fill(null),u).then(d=>{d.some(p=>p[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:d},qf([...s,...d]))},d=>{postMessage({type:t,err:d})});break}case"end-profiling":Vf(r),postMessage({type:t});break;default:}}catch(a){postMessage({type:t,err:a})}}),Wx=Yp?null:e=>new Worker(e??Ot,{type:"module",name:Jp})}),Vx={};So(Vx,{default:()=>qx});var ec,tc,qx,A_,iA=te(()=>{tc=(ec=import.meta.url,async function(e={}){var t,r,a=e,i=new Promise((n,l)=>{t=n,r=l}),s=typeof window=="object",o=typeof WorkerGlobalScope<"u",u=o&&self.name?.startsWith("em-pthread");a.mountExternalData=(n,l)=>{n.startsWith("./")&&(n=n.substring(2)),(a.Bd||(a.Bd=new Map)).set(n,l)},a.unmountExternalData=()=>{delete a.Bd};var d=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let p=()=>{let n=(c,h,y)=>(...x)=>{let C=at,z=h?.();x=c(...x);let O=h?.();return z!==O&&(c=O,y(z),h=y=null),at!=C?new Promise((D,q)=>{ha={resolve:D,reject:q}}):x},l=c=>async(...h)=>{try{if(a.Cd)throw Error("Session already started");let y=a.Cd={be:h[0],errors:[]},x=await c(...h);if(a.Cd!==y)throw Error("Session mismatch");a.Dd?.flush();let C=y.errors;if(0<C.length){let z=await Promise.all(C);if(z=z.filter(O=>O),0<z.length)throw Error(z.join(`
`))}return x}finally{a.Cd=null}};a._OrtCreateSession=n(a._OrtCreateSession,()=>a._OrtCreateSession,c=>a._OrtCreateSession=c),a._OrtRun=l(n(a._OrtRun,()=>a._OrtRun,c=>a._OrtRun=c)),a._OrtRunWithBinding=l(n(a._OrtRunWithBinding,()=>a._OrtRunWithBinding,c=>a._OrtRunWithBinding=c)),a._OrtBindInput=n(a._OrtBindInput,()=>a._OrtBindInput,c=>a._OrtBindInput=c),p=void 0};a.jsepInit=(n,l)=>{if(p?.(),n==="webgpu"){[a.Dd,a.Rd,a.Vd,a.Hd,a.Ud,a.hc,a.Wd,a.Zd,a.Sd,a.Td,a.Xd]=l;let c=a.Dd;a.jsepRegisterBuffer=(h,y,x,C)=>c.registerBuffer(h,y,x,C),a.jsepGetBuffer=h=>c.getBuffer(h),a.jsepCreateDownloader=(h,y,x)=>c.createDownloader(h,y,x),a.jsepOnCreateSession=h=>{c.onCreateSession(h)},a.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},a.jsepOnRunStart=h=>c.onRunStart(h),a.$d=(h,y)=>{c.upload(h,y)}}else if(n==="webnn"){[a.Dd,a.Yd,a.Id,a.jsepEnsureTensor,a.Jd,a.jsepDownloadTensor]=l,a.jsepReleaseTensorId=a.Id,a.jsepUploadTensor=a.Jd;let c=a.Dd;a.jsepOnRunStart=h=>c.onRunStart(h),a.jsepOnRunEnd=c.onRunEnd.bind(c),a.jsepRegisterMLContext=(h,y)=>{c.registerMLContext(h,y)},a.jsepOnReleaseSession=h=>{c.onReleaseSession(h)},a.jsepCreateMLTensorDownloader=(h,y)=>c.createMLTensorDownloader(h,y),a.jsepRegisterMLTensor=(h,y,x,C)=>c.registerMLTensor(h,y,x,C),a.jsepCreateMLContext=h=>c.createMLContext(h),a.jsepRegisterMLConstant=(h,y,x,C,z)=>c.registerMLConstant(h,y,x,C,z,a.Bd),a.jsepRegisterGraphInput=c.registerGraphInput.bind(c),a.jsepIsGraphInput=c.isGraphInput.bind(c),a.jsepCreateTemporaryTensor=c.createTemporaryTensor.bind(c)}};var f,m,g=Object.assign({},a),_=(n,l)=>{throw l},v="";(s||o)&&(o?v=self.location.href:typeof document<"u"&&document.currentScript&&(v=document.currentScript.src),ec&&(v=ec),v=v.startsWith("blob:")?"":v.slice(0,v.replace(/[?#].*/,"").lastIndexOf("/")+1),o&&(m=n=>{var l=new XMLHttpRequest;return l.open("GET",n,!1),l.responseType="arraybuffer",l.send(null),new Uint8Array(l.response)}),f=async n=>{if(le(n))return new Promise((c,h)=>{var y=new XMLHttpRequest;y.open("GET",n,!0),y.responseType="arraybuffer",y.onload=()=>{y.status==200||y.status==0&&y.response?c(y.response):h(y.status)},y.onerror=h,y.send(null)});var l=await fetch(n,{credentials:"same-origin"});if(l.ok)return l.arrayBuffer();throw Error(l.status+" : "+l.url)});var w=console.log.bind(console),k=console.error.bind(console),b=w,$=k;Object.assign(a,g),g=null;var S,T,I,A,E,B,U,j,W,J,P,se,ue,F=a.wasmBinary,oe=!1,le=n=>n.startsWith("file://");function H(){return S.buffer!=A.buffer&&Me(),A}function de(){return S.buffer!=A.buffer&&Me(),E}function M(){return S.buffer!=A.buffer&&Me(),B}function V(){return S.buffer!=A.buffer&&Me(),U}function R(){return S.buffer!=A.buffer&&Me(),j}function X(){return S.buffer!=A.buffer&&Me(),W}function Ie(){return S.buffer!=A.buffer&&Me(),J}function Fe(){return S.buffer!=A.buffer&&Me(),ue}if(u){let n=function(l){try{var c=l.data,h=c.yd;if(h==="load"){let y=[];self.onmessage=x=>y.push(x),self.startWorker=()=>{postMessage({yd:"loaded"});for(let x of y)n(x);self.onmessage=n};for(let x of c.Od)a[x]&&!a[x].proxy||(a[x]=(...C)=>{postMessage({yd:"callHandler",Nd:x,args:C})},x=="print"&&(b=a[x]),x=="printErr"&&($=a[x]));S=c.he,Me(),Ne(c.ie)}else if(h==="run"){Du(c.xd),ya(c.xd,0,0,1,0,0),bi(),pa(c.xd),Ee||(yn(),Ee=!0);try{Pu(c.de,c.Fd)}catch(y){if(y!="unwind")throw y}}else c.target!=="setimmediate"&&(h==="checkMailbox"?Ee&&xr():h&&($(`worker: received unknown command ${h}`),$(c)))}catch(y){throw _n(),y}};var Ne,Ee=!1;$=function(...l){l=l.join(" "),console.error(l)},self.alert=function(...l){postMessage({yd:"alert",text:l.join(" "),fe:Ar()})},self.onunhandledrejection=l=>{throw l.reason||l},self.onmessage=n}function Me(){var n=S.buffer;a.HEAP8=A=new Int8Array(n),a.HEAP16=B=new Int16Array(n),a.HEAPU8=E=new Uint8Array(n),a.HEAPU16=U=new Uint16Array(n),a.HEAP32=j=new Int32Array(n),a.HEAPU32=W=new Uint32Array(n),a.HEAPF32=J=new Float32Array(n),a.HEAPF64=ue=new Float64Array(n),a.HEAP64=P=new BigInt64Array(n),a.HEAPU64=se=new BigUint64Array(n)}function wr(){u?startWorker(a):N.Bb()}u||(S=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Me());var Lt,Gt=0,Ft=null;function mi(){if(--Gt==0&&Ft){var n=Ft;Ft=null,n()}}function nt(n){throw $(n="Aborted("+n+")"),oe=!0,n=new WebAssembly.RuntimeError(n+". Build with -sASSERTIONS for more info."),r(n),n}function gi(){return{a:{Ta:Mu,Va:Nu,W:Uu,la:Wu,b:qu,u:ju,R:Lu,Za:Gu,d:Fu,pb:Ti,g:Vu,T:Ei,Ga:zi,lb:Oi,nb:Ri,Ha:Bi,Ea:Ni,wb:Mi,Da:Di,pa:Pi,mb:Ui,jb:Wi,Fa:Vi,kb:qi,Ma:Hu,za:Ku,eb:Zu,cb:Xu,ya:Yu,V:el,N:tl,db:rl,ma:ll,fb:dl,zb:pl,hb:cl,qb:hl,ab:fl,Aa:ml,yb:pa,Ja:gl,S:yl,Wa:_l,$:wl,G:bl,E:kl,m:ua,H:Sl,B:Il,X:El,J:zl,v:Al,O:Ol,D:Rl,t:Bl,A:Nl,z:Ml,w:Dl,r:Pl,tb:Ul,ub:Wl,vb:Vl,rb:rn,sb:an,bb:nn,Oa:jl,La:Gl,y:Fl,ja:Hl,Ba:Kl,Ka:Ll,qa:Zl,Ia:Ql,ib:Xl,U:ql,fa:Jl,Sa:Yl,gb:ed,Qa:td,Pa:rd,Ab:ln,Ca:dn,ob:ra,aa:pn,oa:cn,xb:hn,na:fn,$a:Ed,ia:qd,sa:Hd,ga:Cd,da:Nd,ua:Gd,p:Sd,e:ld,c:od,ea:Rd,f:dd,n:cd,k:wd,Y:fd,ka:bd,j:Td,wa:Od,Ra:Qd,ca:Wd,Ua:Zd,P:Bd,K:gd,_:Ud,Q:Id,Z:jd,x:md,l:ud,va:Pd,i:sd,h:hd,ra:Kd,ta:Fd,o:pd,q:yd,s:vd,I:$d,C:kd,L:xd,xa:Ad,_a:zd,F:Vd,Ya:Md,ba:Ld,M:_d,Xa:Dd,ha:id,a:S,Na:ta}}}var Jr={1319426:()=>typeof wasmOffsetConverter<"u",1319483:(n,l,c,h,y)=>{if(a===void 0||!a.Bd)return 1;if((n=Oe(Number(n>>>0))).startsWith("./")&&(n=n.substring(2)),!(n=a.Bd.get(n)))return 2;if(l=Number(l>>>0),c=Number(c>>>0),h=Number(h>>>0),l+c>n.byteLength)return 3;try{let x=n.subarray(l,l+c);switch(y){case 0:de().set(x,h>>>0);break;case 1:a.$d(h,x);break;default:return 4}return 0}catch{return 4}},1320198:(n,l,c)=>{a.Jd(n,de().subarray(l>>>0,l+c>>>0))},1320261:()=>a.Yd(),1320302:n=>{a.Id(n)},1320338:()=>{a.Sd()},1320369:()=>{a.Td()},1320398:()=>{a.Xd()},1320423:n=>a.Rd(n),1320456:n=>a.Vd(n),1320488:(n,l,c)=>{a.Hd(Number(n),Number(l),Number(c),!0)},1320551:(n,l,c)=>{a.Hd(Number(n),Number(l),Number(c))},1320608:n=>{a.hc("Abs",n,void 0)},1320659:n=>{a.hc("Neg",n,void 0)},1320710:n=>{a.hc("Floor",n,void 0)},1320763:n=>{a.hc("Ceil",n,void 0)},1320815:n=>{a.hc("Reciprocal",n,void 0)},1320873:n=>{a.hc("Sqrt",n,void 0)},1320925:n=>{a.hc("Exp",n,void 0)},1320976:n=>{a.hc("Erf",n,void 0)},1321027:n=>{a.hc("Sigmoid",n,void 0)},1321082:(n,l,c)=>{a.hc("HardSigmoid",n,{alpha:l,beta:c})},1321161:n=>{a.hc("Log",n,void 0)},1321212:n=>{a.hc("Sin",n,void 0)},1321263:n=>{a.hc("Cos",n,void 0)},1321314:n=>{a.hc("Tan",n,void 0)},1321365:n=>{a.hc("Asin",n,void 0)},1321417:n=>{a.hc("Acos",n,void 0)},1321469:n=>{a.hc("Atan",n,void 0)},1321521:n=>{a.hc("Sinh",n,void 0)},1321573:n=>{a.hc("Cosh",n,void 0)},1321625:n=>{a.hc("Asinh",n,void 0)},1321678:n=>{a.hc("Acosh",n,void 0)},1321731:n=>{a.hc("Atanh",n,void 0)},1321784:n=>{a.hc("Tanh",n,void 0)},1321836:n=>{a.hc("Not",n,void 0)},1321887:(n,l,c)=>{a.hc("Clip",n,{min:l,max:c})},1321956:n=>{a.hc("Clip",n,void 0)},1322008:(n,l)=>{a.hc("Elu",n,{alpha:l})},1322066:n=>{a.hc("Gelu",n,void 0)},1322118:n=>{a.hc("Relu",n,void 0)},1322170:(n,l)=>{a.hc("LeakyRelu",n,{alpha:l})},1322234:(n,l)=>{a.hc("ThresholdedRelu",n,{alpha:l})},1322304:(n,l)=>{a.hc("Cast",n,{to:l})},1322362:n=>{a.hc("Add",n,void 0)},1322413:n=>{a.hc("Sub",n,void 0)},1322464:n=>{a.hc("Mul",n,void 0)},1322515:n=>{a.hc("Div",n,void 0)},1322566:n=>{a.hc("Pow",n,void 0)},1322617:n=>{a.hc("Equal",n,void 0)},1322670:n=>{a.hc("Greater",n,void 0)},1322725:n=>{a.hc("GreaterOrEqual",n,void 0)},1322787:n=>{a.hc("Less",n,void 0)},1322839:n=>{a.hc("LessOrEqual",n,void 0)},1322898:(n,l,c,h,y)=>{a.hc("ReduceMean",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323073:(n,l,c,h,y)=>{a.hc("ReduceMax",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323247:(n,l,c,h,y)=>{a.hc("ReduceMin",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323421:(n,l,c,h,y)=>{a.hc("ReduceProd",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323596:(n,l,c,h,y)=>{a.hc("ReduceSum",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323770:(n,l,c,h,y)=>{a.hc("ReduceL1",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1323943:(n,l,c,h,y)=>{a.hc("ReduceL2",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324116:(n,l,c,h,y)=>{a.hc("ReduceLogSum",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324293:(n,l,c,h,y)=>{a.hc("ReduceSumSquare",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324473:(n,l,c,h,y)=>{a.hc("ReduceLogSumExp",n,{keepDims:!!l,noopWithEmptyAxes:!!c,axes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1324653:n=>{a.hc("Where",n,void 0)},1324706:(n,l,c)=>{a.hc("Transpose",n,{perm:l?Array.from(R().subarray(Number(l)>>>0,Number(c)>>>0)):[]})},1324830:(n,l,c,h)=>{a.hc("DepthToSpace",n,{blocksize:l,mode:Oe(c),format:h?"NHWC":"NCHW"})},1324963:(n,l,c,h)=>{a.hc("DepthToSpace",n,{blocksize:l,mode:Oe(c),format:h?"NHWC":"NCHW"})},1325096:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe)=>{a.hc("ConvTranspose",n,{format:O?"NHWC":"NCHW",autoPad:l,dilations:[c],group:h,kernelShape:[y],pads:[x,C],strides:[z],wIsConst:()=>!!H()[D>>>0],outputPadding:q?Array.from(R().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:ie?Array.from(R().subarray(Number(ie)>>>0,Number($e)>>>0)):[],activation:Oe(Xe)})},1325529:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("ConvTranspose",n,{format:z?"NHWC":"NCHW",autoPad:l,dilations:Array.from(R().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(R().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(R().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!H()[O>>>0],outputPadding:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],outputShape:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[],activation:Oe($e)})},1326190:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe)=>{a.hc("ConvTranspose",n,{format:O?"NHWC":"NCHW",autoPad:l,dilations:[c],group:h,kernelShape:[y],pads:[x,C],strides:[z],wIsConst:()=>!!H()[D>>>0],outputPadding:q?Array.from(R().subarray(Number(q)>>>0,Number(Q)>>>0)):[],outputShape:ie?Array.from(R().subarray(Number(ie)>>>0,Number($e)>>>0)):[],activation:Oe(Xe)})},1326623:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("ConvTranspose",n,{format:z?"NHWC":"NCHW",autoPad:l,dilations:Array.from(R().subarray(Number(c)>>>0,2+(Number(c)>>>0)>>>0)),group:h,kernelShape:Array.from(R().subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),pads:Array.from(R().subarray(Number(x)>>>0,4+(Number(x)>>>0)>>>0)),strides:Array.from(R().subarray(Number(C)>>>0,2+(Number(C)>>>0)>>>0)),wIsConst:()=>!!H()[O>>>0],outputPadding:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],outputShape:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[],activation:Oe($e)})},1327284:(n,l)=>{a.hc("GlobalAveragePool",n,{format:l?"NHWC":"NCHW"})},1327375:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("AveragePool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1327854:(n,l)=>{a.hc("GlobalAveragePool",n,{format:l?"NHWC":"NCHW"})},1327945:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("AveragePool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1328424:(n,l)=>{a.hc("GlobalMaxPool",n,{format:l?"NHWC":"NCHW"})},1328511:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("MaxPool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1328986:(n,l)=>{a.hc("GlobalMaxPool",n,{format:l?"NHWC":"NCHW"})},1329073:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>{a.hc("MaxPool",n,{format:$e?"NHWC":"NCHW",auto_pad:l,ceil_mode:c,count_include_pad:h,storage_order:y,dilations:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],kernel_shape:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],pads:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],strides:Q?Array.from(R().subarray(Number(Q)>>>0,Number(ie)>>>0)):[]})},1329548:(n,l,c,h,y)=>{a.hc("Gemm",n,{alpha:l,beta:c,transA:h,transB:y})},1329652:n=>{a.hc("MatMul",n,void 0)},1329706:(n,l,c,h)=>{a.hc("ArgMax",n,{keepDims:!!l,selectLastIndex:!!c,axis:h})},1329814:(n,l,c,h)=>{a.hc("ArgMin",n,{keepDims:!!l,selectLastIndex:!!c,axis:h})},1329922:(n,l)=>{a.hc("Softmax",n,{axis:l})},1329985:(n,l)=>{a.hc("Concat",n,{axis:l})},1330045:(n,l,c,h,y)=>{a.hc("Split",n,{axis:l,numOutputs:c,splitSizes:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1330201:n=>{a.hc("Expand",n,void 0)},1330255:(n,l)=>{a.hc("Gather",n,{axis:Number(l)})},1330326:(n,l)=>{a.hc("GatherElements",n,{axis:Number(l)})},1330405:(n,l)=>{a.hc("GatherND",n,{batch_dims:Number(l)})},1330484:(n,l,c,h,y,x,C,z,O,D,q)=>{a.hc("Resize",n,{antialias:l,axes:c?Array.from(R().subarray(Number(c)>>>0,Number(h)>>>0)):[],coordinateTransformMode:Oe(y),cubicCoeffA:x,excludeOutside:C,extrapolationValue:z,keepAspectRatioPolicy:Oe(O),mode:Oe(D),nearestMode:Oe(q)})},1330846:(n,l,c,h,y,x,C)=>{a.hc("Slice",n,{starts:l?Array.from(R().subarray(Number(l)>>>0,Number(c)>>>0)):[],ends:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[],axes:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[]})},1331110:n=>{a.hc("Tile",n,void 0)},1331162:(n,l,c)=>{a.hc("InstanceNormalization",n,{epsilon:l,format:c?"NHWC":"NCHW"})},1331276:(n,l,c)=>{a.hc("InstanceNormalization",n,{epsilon:l,format:c?"NHWC":"NCHW"})},1331390:n=>{a.hc("Range",n,void 0)},1331443:(n,l)=>{a.hc("Einsum",n,{equation:Oe(l)})},1331524:(n,l,c,h,y)=>{a.hc("Pad",n,{mode:l,value:c,pads:h?Array.from(R().subarray(Number(h)>>>0,Number(y)>>>0)):[]})},1331667:(n,l,c,h,y,x)=>{a.hc("BatchNormalization",n,{epsilon:l,momentum:c,spatial:!!y,trainingMode:!!h,format:x?"NHWC":"NCHW"})},1331836:(n,l,c,h,y,x)=>{a.hc("BatchNormalization",n,{epsilon:l,momentum:c,spatial:!!y,trainingMode:!!h,format:x?"NHWC":"NCHW"})},1332005:(n,l,c)=>{a.hc("CumSum",n,{exclusive:Number(l),reverse:Number(c)})},1332102:(n,l,c)=>{a.hc("DequantizeLinear",n,{axis:l,blockSize:c})},1332192:(n,l,c,h,y)=>{a.hc("GridSample",n,{align_corners:l,mode:Oe(c),padding_mode:Oe(h),format:y?"NHWC":"NCHW"})},1332362:(n,l,c,h,y)=>{a.hc("GridSample",n,{align_corners:l,mode:Oe(c),padding_mode:Oe(h),format:y?"NHWC":"NCHW"})},1332532:(n,l)=>{a.hc("ScatterND",n,{reduction:Oe(l)})},1332617:(n,l,c,h,y,x,C,z,O)=>{a.hc("Attention",n,{numHeads:l,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:x,qkvHiddenSizes:C?Array.from(R().subarray(Number(z)>>>0,Number(z)+C>>>0)):[],pastPresentShareBuffer:!!O})},1332889:n=>{a.hc("BiasAdd",n,void 0)},1332944:n=>{a.hc("BiasSplitGelu",n,void 0)},1333005:n=>{a.hc("FastGelu",n,void 0)},1333061:(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e,Xe,Xt)=>{a.hc("Conv",n,{format:Q?"NHWC":"NCHW",auto_pad:l,dilations:c?Array.from(R().subarray(Number(c)>>>0,Number(h)>>>0)):[],group:y,kernel_shape:x?Array.from(R().subarray(Number(x)>>>0,Number(C)>>>0)):[],pads:z?Array.from(R().subarray(Number(z)>>>0,Number(O)>>>0)):[],strides:D?Array.from(R().subarray(Number(D)>>>0,Number(q)>>>0)):[],w_is_const:()=>!!H()[Number(ie)>>>0],activation:Oe($e),activation_params:Xe?Array.from(Ie().subarray(Number(Xe)>>>0,Number(Xt)>>>0)):[]})},1333645:n=>{a.hc("Gelu",n,void 0)},1333697:(n,l,c,h,y,x,C,z,O)=>{a.hc("GroupQueryAttention",n,{numHeads:l,kvNumHeads:c,scale:h,softcap:y,doRotary:x,rotaryInterleaved:C,smoothSoftmax:z,localWindowSize:O})},1333914:(n,l,c,h)=>{a.hc("LayerNormalization",n,{axis:l,epsilon:c,simplified:!!h})},1334025:(n,l,c,h)=>{a.hc("LayerNormalization",n,{axis:l,epsilon:c,simplified:!!h})},1334136:(n,l,c,h,y,x)=>{a.hc("MatMulNBits",n,{k:l,n:c,accuracyLevel:h,bits:y,blockSize:x})},1334263:(n,l,c,h,y,x)=>{a.hc("MultiHeadAttention",n,{numHeads:l,isUnidirectional:c,maskFilterValue:h,scale:y,doRotary:x})},1334422:(n,l)=>{a.hc("QuickGelu",n,{alpha:l})},1334486:(n,l,c,h,y)=>{a.hc("RotaryEmbedding",n,{interleaved:!!l,numHeads:c,rotaryEmbeddingDim:h,scale:y})},1334625:(n,l,c)=>{a.hc("SkipLayerNormalization",n,{epsilon:l,simplified:!!c})},1334727:(n,l,c)=>{a.hc("SkipLayerNormalization",n,{epsilon:l,simplified:!!c})},1334829:(n,l,c,h)=>{a.hc("GatherBlockQuantized",n,{gatherAxis:l,quantizeAxis:c,blockSize:h})},1334950:n=>{a.Wd(n)},1334984:(n,l)=>a.Zd(Number(n),Number(l),a.Cd.be,a.Cd.errors)};function Nu(n,l,c){return Qi(async()=>{await a.Ud(Number(n),Number(l),Number(c))})}function Mu(){return typeof wasmOffsetConverter<"u"}class Yr{name="ExitStatus";constructor(l){this.message=`Program terminated with exit(${l})`,this.status=l}}var yi=n=>{n.terminate(),n.onmessage=()=>{}},ea=[],_i=n=>{mt.length==0&&(ki(),xi(mt[0]));var l=mt.pop();if(!l)return 6;Ht.push(l),kt[n.xd]=l,l.xd=n.xd;var c={yd:"run",de:n.ce,Fd:n.Fd,xd:n.xd};return l.postMessage(c,n.Ld),0},ft=0,xe=(n,l,...c)=>{for(var h=2*c.length,y=re(),x=va(8*h),C=x>>>3,z=0;z<c.length;z++){var O=c[z];typeof O=="bigint"?(P[C+2*z]=1n,P[C+2*z+1]=O):(P[C+2*z]=0n,Fe()[C+2*z+1>>>0]=O)}return n=vn(n,0,h,x,l),Y(y),n};function ta(n){if(u)return xe(0,1,n);if(I=n,!(0<ft)){for(var l of Ht)yi(l);for(l of mt)yi(l);mt=[],Ht=[],kt={},oe=!0}_(0,new Yr(n))}function vi(n){if(u)return xe(1,0,n);ra(n)}var ra=n=>{if(I=n,u)throw vi(n),"unwind";ta(n)},mt=[],Ht=[],$i=[],kt={},wi=n=>{var l=n.xd;delete kt[l],mt.push(n),Ht.splice(Ht.indexOf(n),1),n.xd=0,$n(l)};function bi(){$i.forEach(n=>n())}var xi=n=>new Promise(l=>{n.onmessage=y=>{var x=(y=y.data).yd;if(y.Ed&&y.Ed!=Ar()){var C=kt[y.Ed];C?C.postMessage(y,y.Ld):$(`Internal error! Worker sent a message "${x}" to target pthread ${y.Ed}, but that thread no longer exists!`)}else x==="checkMailbox"?xr():x==="spawnThread"?_i(y):x==="cleanupThread"?wi(kt[y.ee]):x==="loaded"?(n.loaded=!0,l(n)):x==="alert"?alert(`Thread ${y.fe}: ${y.text}`):y.target==="setimmediate"?n.postMessage(y):x==="callHandler"?a[y.Nd](...y.args):x&&$(`worker sent an unknown command ${x}`)},n.onerror=y=>{throw $(`worker sent an error! ${y.filename}:${y.lineno}: ${y.message}`),y};var c,h=[];for(c of[])a.propertyIsEnumerable(c)&&h.push(c);n.postMessage({yd:"load",Od:h,he:S,ie:T})});function ki(){var n=new Worker(import.meta.url.startsWith("file:")?new URL("/assets/ort.bundle.min-OfoG_cy9.mjs",import.meta.url):new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});mt.push(n)}var Du=n=>{Me();var l=X()[n+52>>>2>>>0];n=X()[n+56>>>2>>>0],xn(l,l-n),Y(l)},Pu=(n,l)=>{ft=0,n=$a(n,l),0<ft?I=n:_a(n)},br=[];function Uu(n){var l=new aa(n>>>=0);if(H()[l.wd+12>>>0]==0){var c=1;H()[l.wd+12>>>0]=c}return c=0,H()[l.wd+13>>>0]=c,br.push(l),Sn(n),Cn(n)}var Et=0,Wu=()=>{ae(0,0);var n=br.pop();kn(n.Gd),Et=0};class aa{constructor(l){this.Gd=l,this.wd=l-24}}function Vu(n){throw Et||=n>>>0,Et}var ia=n=>{var l=Et;if(!l)return Qt(0),0;var c=new aa(l);X()[c.wd+16>>>2>>>0]=l;var h=X()[c.wd+4>>>2>>>0];if(!h)return Qt(0),l;for(var y of n){if(y===0||y===h)break;if(Tn(y,h,c.wd+16))return Qt(y),l}return Qt(h),l};function qu(){return ia([])}function ju(n){return ia([n>>>0])}function Lu(n,l){return ia([n>>>0,l>>>0])}var Gu=()=>{var n=br.pop();n||nt("no exception to throw");var l=n.Gd;if(H()[n.wd+13>>>0]==0){br.push(n);var c=1;H()[n.wd+13>>>0]=c,c=0,H()[n.wd+12>>>0]=c}throw Et=l};function Fu(n,l,c){var h=new aa(n>>>=0);throw l>>>=0,c>>>=0,X()[h.wd+16>>>2>>>0]=0,X()[h.wd+4>>>2>>>0]=l,X()[h.wd+8>>>2>>>0]=c,Et=n}function Si(n,l,c,h){return u?xe(2,1,n,l,c,h):Ti(n,l,c,h)}function Ti(n,l,c,h){if(n>>>=0,c>>>=0,h>>>=0,d===void 0)return 6;var y=[];return u&&y.length===0?Si(n,l>>>=0,c,h):(n={ce:c,xd:n,Fd:h,Ld:y},u?(n.yd="spawnThread",postMessage(n,y),0):_i(n))}var Ci=typeof TextDecoder<"u"?new TextDecoder:void 0,Ii=(n,l=0,c=NaN)=>{var h=(l>>>=0)+c;for(c=l;n[c]&&!(c>=h);)++c;if(16<c-l&&n.buffer&&Ci)return Ci.decode(n.buffer instanceof ArrayBuffer?n.subarray(l,c):n.slice(l,c));for(h="";l<c;){var y=n[l++];if(128&y){var x=63&n[l++];if((224&y)==192)h+=String.fromCharCode((31&y)<<6|x);else{var C=63&n[l++];65536>(y=(240&y)==224?(15&y)<<12|x<<6|C:(7&y)<<18|x<<12|C<<6|63&n[l++])?h+=String.fromCharCode(y):(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y))}}else h+=String.fromCharCode(y)}return h},Oe=(n,l)=>(n>>>=0)?Ii(de(),n,l):"";function Ei(n,l,c){return u?xe(3,1,n,l,c):0}function zi(n,l){if(u)return xe(4,1,n,l)}var Ai=n=>{for(var l=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);127>=h?l++:2047>=h?l+=2:55296<=h&&57343>=h?(l+=4,++c):l+=3}return l},zt=(n,l,c)=>{var h=de();if(l>>>=0,0<c){var y=l;c=l+c-1;for(var x=0;x<n.length;++x){var C=n.charCodeAt(x);if(55296<=C&&57343>=C&&(C=65536+((1023&C)<<10)|1023&n.charCodeAt(++x)),127>=C){if(l>=c)break;h[l++>>>0]=C}else{if(2047>=C){if(l+1>=c)break;h[l++>>>0]=192|C>>6}else{if(65535>=C){if(l+2>=c)break;h[l++>>>0]=224|C>>12}else{if(l+3>=c)break;h[l++>>>0]=240|C>>18,h[l++>>>0]=128|C>>12&63}h[l++>>>0]=128|C>>6&63}h[l++>>>0]=128|63&C}}h[l>>>0]=0,n=l-y}else n=0;return n};function Oi(n,l){if(u)return xe(5,1,n,l)}function Ri(n,l,c){if(u)return xe(6,1,n,l,c)}function Bi(n,l,c){return u?xe(7,1,n,l,c):0}function Ni(n,l){if(u)return xe(8,1,n,l)}function Mi(n,l,c){if(u)return xe(9,1,n,l,c)}function Di(n,l,c,h){if(u)return xe(10,1,n,l,c,h)}function Pi(n,l,c,h){if(u)return xe(11,1,n,l,c,h)}function Ui(n,l,c,h){if(u)return xe(12,1,n,l,c,h)}function Wi(n){if(u)return xe(13,1,n)}function Vi(n,l){if(u)return xe(14,1,n,l)}function qi(n,l,c){if(u)return xe(15,1,n,l,c)}var ji,gt,Hu=()=>nt(""),rt=n=>{for(var l="";de()[n>>>0];)l+=ji[de()[n++>>>0]];return l},na={},sa={};function st(n,l,c={}){return(function(h,y,x={}){var C=y.name;if(!h)throw new gt(`type "${C}" must have a positive integer typeid pointer`);if(sa.hasOwnProperty(h)){if(x.Pd)return;throw new gt(`Cannot register type '${C}' twice`)}sa[h]=y,na.hasOwnProperty(h)&&(y=na[h],delete na[h],y.forEach(z=>z()))})(n,l,c)}var Li=(n,l,c)=>{switch(l){case 1:return c?h=>H()[h>>>0]:h=>de()[h>>>0];case 2:return c?h=>M()[h>>>1>>>0]:h=>V()[h>>>1>>>0];case 4:return c?h=>R()[h>>>2>>>0]:h=>X()[h>>>2>>>0];case 8:return c?h=>P[h>>>3]:h=>se[h>>>3];default:throw new TypeError(`invalid integer width (${l}): ${n}`)}};function Ku(n,l,c){c>>>=0,st(n>>>=0,{name:l=rt(l>>>0),fromWireType:h=>h,toWireType:function(h,y){if(typeof y!="bigint"&&typeof y!="number")throw y=y===null?"null":(h=typeof y)=="object"||h==="array"||h==="function"?y.toString():""+y,new TypeError(`Cannot convert "${y}" to ${this.name}`);return typeof y=="number"&&(y=BigInt(y)),y},zd:yt,readValueFromPointer:Li(l,c,l.indexOf("u")==-1),Ad:null})}var yt=8;function Zu(n,l,c,h){st(n>>>=0,{name:l=rt(l>>>0),fromWireType:function(y){return!!y},toWireType:function(y,x){return x?c:h},zd:yt,readValueFromPointer:function(y){return this.fromWireType(de()[y>>>0])},Ad:null})}var oa=[],ot=[];function ua(n){9<(n>>>=0)&&--ot[n+1]==0&&(ot[n]=void 0,oa.push(n))}var He=n=>{if(!n)throw new gt("Cannot use deleted val. handle = "+n);return ot[n]},Qe=n=>{switch(n){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let l=oa.pop()||ot.length;return ot[l]=n,ot[l+1]=1,l}};function la(n){return this.fromWireType(X()[n>>>2>>>0])}var Qu={name:"emscripten::val",fromWireType:n=>{var l=He(n);return ua(n),l},toWireType:(n,l)=>Qe(l),zd:yt,readValueFromPointer:la,Ad:null};function Xu(n){return st(n>>>0,Qu)}var Ju=(n,l)=>{switch(l){case 4:return function(c){return this.fromWireType(Ie()[c>>>2>>>0])};case 8:return function(c){return this.fromWireType(Fe()[c>>>3>>>0])};default:throw new TypeError(`invalid float width (${l}): ${n}`)}};function Yu(n,l,c){c>>>=0,st(n>>>=0,{name:l=rt(l>>>0),fromWireType:h=>h,toWireType:(h,y)=>y,zd:yt,readValueFromPointer:Ju(l,c),Ad:null})}function el(n,l,c,h,y){if(n>>>=0,c>>>=0,l=rt(l>>>0),y===-1&&(y=4294967295),y=z=>z,h===0){var x=32-8*c;y=z=>z<<x>>>x}var C=l.includes("unsigned")?function(z,O){return O>>>0}:function(z,O){return O};st(n,{name:l,fromWireType:y,toWireType:C,zd:yt,readValueFromPointer:Li(l,c,h!==0),Ad:null})}function tl(n,l,c){function h(x){var C=X()[x>>>2>>>0];return x=X()[x+4>>>2>>>0],new y(H().buffer,x,C)}var y=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][l];st(n>>>=0,{name:c=rt(c>>>0),fromWireType:h,zd:yt,readValueFromPointer:h},{Pd:!0})}function rl(n,l){st(n>>>=0,{name:l=rt(l>>>0),fromWireType:function(c){for(var h,y=X()[c>>>2>>>0],x=c+4,C=x,z=0;z<=y;++z){var O=x+z;z!=y&&de()[O>>>0]!=0||(C=Oe(C,O-C),h===void 0?h=C:(h+="\0",h+=C),C=O+1)}return it(c),h},toWireType:function(c,h){h instanceof ArrayBuffer&&(h=new Uint8Array(h));var y=typeof h=="string";if(!(y||h instanceof Uint8Array||h instanceof Uint8ClampedArray||h instanceof Int8Array))throw new gt("Cannot pass non-string to std::string");var x=y?Ai(h):h.length,C=Or(4+x+1),z=C+4;if(X()[C>>>2>>>0]=x,y)zt(h,z,x+1);else if(y)for(y=0;y<x;++y){var O=h.charCodeAt(y);if(255<O)throw it(C),new gt("String has UTF-16 code units that do not fit in 8 bits");de()[z+y>>>0]=O}else for(y=0;y<x;++y)de()[z+y>>>0]=h[y];return c!==null&&c.push(it,C),C},zd:yt,readValueFromPointer:la,Ad(c){it(c)}})}var Gi=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,al=(n,l)=>{for(var c=n>>1,h=c+l/2;!(c>=h)&&V()[c>>>0];)++c;if(32<(c<<=1)-n&&Gi)return Gi.decode(de().slice(n,c));for(c="",h=0;!(h>=l/2);++h){var y=M()[n+2*h>>>1>>>0];if(y==0)break;c+=String.fromCharCode(y)}return c},il=(n,l,c)=>{if(c??=2147483647,2>c)return 0;var h=l;c=(c-=2)<2*n.length?c/2:n.length;for(var y=0;y<c;++y){var x=n.charCodeAt(y);M()[l>>>1>>>0]=x,l+=2}return M()[l>>>1>>>0]=0,l-h},nl=n=>2*n.length,sl=(n,l)=>{for(var c=0,h="";!(c>=l/4);){var y=R()[n+4*c>>>2>>>0];if(y==0)break;++c,65536<=y?(y-=65536,h+=String.fromCharCode(55296|y>>10,56320|1023&y)):h+=String.fromCharCode(y)}return h},ol=(n,l,c)=>{if(l>>>=0,c??=2147483647,4>c)return 0;var h=l;c=h+c-4;for(var y=0;y<n.length;++y){var x=n.charCodeAt(y);if(55296<=x&&57343>=x&&(x=65536+((1023&x)<<10)|1023&n.charCodeAt(++y)),R()[l>>>2>>>0]=x,(l+=4)+4>c)break}return R()[l>>>2>>>0]=0,l-h},ul=n=>{for(var l=0,c=0;c<n.length;++c){var h=n.charCodeAt(c);55296<=h&&57343>=h&&++c,l+=4}return l};function ll(n,l,c){if(n>>>=0,l>>>=0,c=rt(c>>>=0),l===2)var h=al,y=il,x=nl,C=z=>V()[z>>>1>>>0];else l===4&&(h=sl,y=ol,x=ul,C=z=>X()[z>>>2>>>0]);st(n,{name:c,fromWireType:z=>{for(var O,D=X()[z>>>2>>>0],q=z+4,Q=0;Q<=D;++Q){var ie=z+4+Q*l;Q!=D&&C(ie)!=0||(q=h(q,ie-q),O===void 0?O=q:(O+="\0",O+=q),q=ie+l)}return it(z),O},toWireType:(z,O)=>{if(typeof O!="string")throw new gt(`Cannot pass non-string to C++ string type ${c}`);var D=x(O),q=Or(4+D+l);return X()[q>>>2>>>0]=D/l,y(O,q+4,D+l),z!==null&&z.push(it,q),q},zd:yt,readValueFromPointer:la,Ad(z){it(z)}})}function dl(n,l){st(n>>>=0,{Qd:!0,name:l=rt(l>>>0),zd:0,fromWireType:()=>{},toWireType:()=>{}})}function pl(n){ya(n>>>0,!o,1,!s,131072,!1),bi()}var da=n=>{if(!oe)try{if(n(),!(0<ft))try{u?_a(I):ra(I)}catch(l){l instanceof Yr||l=="unwind"||_(0,l)}}catch(l){l instanceof Yr||l=="unwind"||_(0,l)}};function pa(n){n>>>=0,typeof Atomics.ge=="function"&&(Atomics.ge(R(),n>>>2,n).value.then(xr),n+=128,Atomics.store(R(),n>>>2,1))}var xr=()=>{var n=Ar();n&&(pa(n),da(bn))};function cl(n,l){(n>>>=0)==l>>>0?setTimeout(xr):u?postMessage({Ed:n,yd:"checkMailbox"}):(n=kt[n])&&n.postMessage({yd:"checkMailbox"})}var ca=[];function hl(n,l,c,h,y){for(l>>>=0,h/=2,ca.length=h,c=y>>>0>>>3,y=0;y<h;y++)ca[y]=P[c+2*y]?P[c+2*y+1]:Fe()[c+2*y+1>>>0];return(l?Jr[l]:nd[n])(...ca)}var fl=()=>{ft=0};function ml(n){n>>>=0,u?postMessage({yd:"cleanupThread",ee:n}):wi(kt[n])}function gl(n){}var kr=(n,l)=>{var c=sa[n];if(c===void 0)throw n=gn(n),c=rt(n),it(n),new gt(`${l} has unknown type ${c}`);return c},Fi=(n,l,c)=>{var h=[];return n=n.toWireType(h,c),h.length&&(X()[l>>>2>>>0]=Qe(h)),n};function yl(n,l,c){return l>>>=0,c>>>=0,n=He(n>>>0),l=kr(l,"emval::as"),Fi(l,c,n)}function _l(n,l){return l>>>=0,n=He(n>>>0),(l=kr(l,"emval::as")).toWireType(null,n)}var Sr=n=>{try{n()}catch(l){nt(l)}},_t=0,at=null,Hi=0,Tr=[],Ki={},Zi={},vl=0,ha=null,$l=[];function Qi(n){return(function(l){if(!oe){if(_t===0){var c=!1,h=!1;l((y=0)=>{if(!oe&&(Hi=y,c=!0,h)){_t=2,Sr(()=>$s(at)),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.resume(),y=!1;try{var x=(function(){var O=R()[at+8>>>2>>>0];return O=N[Zi[O]],--ft,O()})()}catch(O){x=O,y=!0}var C=!1;if(!at){var z=ha;z&&(ha=null,(y?z.reject:z.resolve)(x),C=!0)}if(y&&!C)throw x}}),h=!0,c||(_t=1,at=(function(){var y=Or(65548),x=y+12;X()[y>>>2>>>0]=x,X()[y+4>>>2>>>0]=x+65536,x=Tr[0];var C=Ki[x];return C===void 0&&(C=vl++,Ki[x]=C,Zi[C]=x),x=C,R()[y+8>>>2>>>0]=x,y})(),typeof MainLoop<"u"&&MainLoop.Md&&MainLoop.pause(),Sr(()=>_s(at)))}else _t===2?(_t=0,Sr(ws),it(at),at=null,$l.forEach(da)):nt(`invalid state: ${_t}`);return Hi}})(l=>{n().then(l)})}function wl(n){return n>>>=0,Qi(async()=>{var l=await He(n);return Qe(l)})}var Cr=[];function bl(n,l,c,h){return c>>>=0,h>>>=0,(n=Cr[n>>>0])(null,l=He(l>>>0),c,h)}var xl={},Ir=n=>{var l=xl[n];return l===void 0?rt(n):l};function kl(n,l,c,h,y){return c>>>=0,h>>>=0,y>>>=0,(n=Cr[n>>>0])(l=He(l>>>0),l[c=Ir(c)],h,y)}var Xi=()=>typeof globalThis=="object"?globalThis:Function("return this")();function Sl(n){return(n>>>=0)==0?Qe(Xi()):(n=Ir(n),Qe(Xi()[n]))}var Tl=n=>{var l=Cr.length;return Cr.push(n),l},Cl=(n,l)=>{for(var c=Array(n),h=0;h<n;++h)c[h]=kr(X()[l+4*h>>>2>>>0],"parameter "+h);return c},Ji=(n,l)=>Object.defineProperty(l,"name",{value:n});function Il(n,l,c){var h=(l=Cl(n,l>>>0)).shift();n--;var y=`return function (obj, func, destructorsRef, args) {
`,x=0,C=[];c===0&&C.push("obj");for(var z=["retType"],O=[h],D=0;D<n;++D)C.push("arg"+D),z.push("argType"+D),O.push(l[D]),y+=`  var arg${D} = argType${D}.readValueFromPointer(args${x?"+"+x:""});
`,x+=l[D].zd;return y+=`  var rv = ${c===1?"new func":"func.call"}(${C.join(", ")});
`,h.Qd||(z.push("emval_returnValue"),O.push(Fi),y+=`  return emval_returnValue(retType, destructorsRef, rv);
`),z.push(y+`};
`),n=(function(q){var Q=Function;if(!(Q instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof Q} which is not a function`);var ie=Ji(Q.name||"unknownFunctionName",function(){});return ie.prototype=Q.prototype,ie=new ie,(q=Q.apply(ie,q))instanceof Object?q:ie})(z)(...O),c=`methodCaller<(${l.map(q=>q.name).join(", ")}) => ${h.name}>`,Tl(Ji(c,n))}function El(n){return n=Ir(n>>>0),Qe(a[n])}function zl(n,l){return l>>>=0,n=He(n>>>0),l=He(l),Qe(n[l])}function Al(n){9<(n>>>=0)&&(ot[n+1]+=1)}function Ol(){return Qe([])}function Rl(n){n=He(n>>>0);for(var l=Array(n.length),c=0;c<n.length;c++)l[c]=n[c];return Qe(l)}function Bl(n){return Qe(Ir(n>>>0))}function Nl(){return Qe({})}function Ml(n){for(var l=He(n>>>=0);l.length;){var c=l.pop();l.pop()(c)}ua(n)}function Dl(n,l,c){l>>>=0,c>>>=0,n=He(n>>>0),l=He(l),c=He(c),n[l]=c}function Pl(n,l){return l>>>=0,n=(n=kr(n>>>0,"_emval_take_value")).readValueFromPointer(l),Qe(n)}function Ul(n,l){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),l>>>=0,n=new Date(1e3*n),R()[l>>>2>>>0]=n.getUTCSeconds(),R()[l+4>>>2>>>0]=n.getUTCMinutes(),R()[l+8>>>2>>>0]=n.getUTCHours(),R()[l+12>>>2>>>0]=n.getUTCDate(),R()[l+16>>>2>>>0]=n.getUTCMonth(),R()[l+20>>>2>>>0]=n.getUTCFullYear()-1900,R()[l+24>>>2>>>0]=n.getUTCDay(),n=(n.getTime()-Date.UTC(n.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,R()[l+28>>>2>>>0]=n}var Yi=n=>n%4==0&&(n%100!=0||n%400==0),en=[0,31,60,91,121,152,182,213,244,274,305,335],tn=[0,31,59,90,120,151,181,212,243,273,304,334];function Wl(n,l){n=-9007199254740992>n||9007199254740992<n?NaN:Number(n),l>>>=0,n=new Date(1e3*n),R()[l>>>2>>>0]=n.getSeconds(),R()[l+4>>>2>>>0]=n.getMinutes(),R()[l+8>>>2>>>0]=n.getHours(),R()[l+12>>>2>>>0]=n.getDate(),R()[l+16>>>2>>>0]=n.getMonth(),R()[l+20>>>2>>>0]=n.getFullYear()-1900,R()[l+24>>>2>>>0]=n.getDay();var c=(Yi(n.getFullYear())?en:tn)[n.getMonth()]+n.getDate()-1|0;R()[l+28>>>2>>>0]=c,R()[l+36>>>2>>>0]=-60*n.getTimezoneOffset(),c=new Date(n.getFullYear(),6,1).getTimezoneOffset();var h=new Date(n.getFullYear(),0,1).getTimezoneOffset();n=0|(c!=h&&n.getTimezoneOffset()==Math.min(h,c)),R()[l+32>>>2>>>0]=n}function Vl(n){n>>>=0;var l=new Date(R()[n+20>>>2>>>0]+1900,R()[n+16>>>2>>>0],R()[n+12>>>2>>>0],R()[n+8>>>2>>>0],R()[n+4>>>2>>>0],R()[n>>>2>>>0],0),c=R()[n+32>>>2>>>0],h=l.getTimezoneOffset(),y=new Date(l.getFullYear(),6,1).getTimezoneOffset(),x=new Date(l.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(x,y);return 0>c?R()[n+32>>>2>>>0]=+(y!=x&&C==h):0<c!=(C==h)&&(y=Math.max(x,y),l.setTime(l.getTime()+6e4*((0<c?C:y)-h))),R()[n+24>>>2>>>0]=l.getDay(),c=(Yi(l.getFullYear())?en:tn)[l.getMonth()]+l.getDate()-1|0,R()[n+28>>>2>>>0]=c,R()[n>>>2>>>0]=l.getSeconds(),R()[n+4>>>2>>>0]=l.getMinutes(),R()[n+8>>>2>>>0]=l.getHours(),R()[n+12>>>2>>>0]=l.getDate(),R()[n+16>>>2>>>0]=l.getMonth(),R()[n+20>>>2>>>0]=l.getYear(),n=l.getTime(),BigInt(isNaN(n)?-1:n/1e3)}function rn(n,l,c,h,y,x,C){return u?xe(16,1,n,l,c,h,y,x,C):-52}function an(n,l,c,h,y,x){if(u)return xe(17,1,n,l,c,h,y,x)}var Kt={},ql=()=>performance.timeOrigin+performance.now();function nn(n,l){if(u)return xe(18,1,n,l);if(Kt[n]&&(clearTimeout(Kt[n].id),delete Kt[n]),!l)return 0;var c=setTimeout(()=>{delete Kt[n],da(()=>wn(n,performance.timeOrigin+performance.now()))},l);return Kt[n]={id:c,ke:l},0}function jl(n,l,c,h){n>>>=0,l>>>=0,c>>>=0,h>>>=0;var y=new Date().getFullYear(),x=new Date(y,0,1).getTimezoneOffset();y=new Date(y,6,1).getTimezoneOffset();var C=Math.max(x,y);X()[n>>>2>>>0]=60*C,R()[l>>>2>>>0]=+(x!=y),n=(l=z=>{var O=Math.abs(z);return`UTC${0<=z?"-":"+"}${String(Math.floor(O/60)).padStart(2,"0")}${String(O%60).padStart(2,"0")}`})(x),l=l(y),y<x?(zt(n,c,17),zt(l,h,17)):(zt(n,h,17),zt(l,c,17))}var Ll=()=>Date.now();function Gl(n,l,c){return 0<=n&&3>=n?(n===0?n=Date.now():n=performance.timeOrigin+performance.now(),P[c>>>0>>>3]=BigInt(Math.round(1e6*n)),0):28}var fa=[],sn=(n,l)=>{fa.length=0;for(var c;c=de()[n++>>>0];){var h=c!=105;l+=(h&=c!=112)&&l%8?4:0,fa.push(c==112?X()[l>>>2>>>0]:c==106?P[l>>>3]:c==105?R()[l>>>2>>>0]:Fe()[l>>>3>>>0]),l+=h?8:4}return fa};function Fl(n,l,c){return n>>>=0,l=sn(l>>>0,c>>>0),Jr[n](...l)}function Hl(n,l,c){return n>>>=0,l=sn(l>>>0,c>>>0),Jr[n](...l)}var Kl=()=>{};function Zl(n,l){return $(Oe(n>>>0,l>>>0))}var Ql=()=>{throw ft+=1,"unwind"};function Xl(){return 4294901760}var Jl=()=>navigator.hardwareConcurrency;function Yl(){return nt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function ed(n){n>>>=0;var l=de().length;if(n<=l||4294901760<n)return!1;for(var c=1;4>=c;c*=2){var h=l*(1+.2/c);h=Math.min(h,n+100663296);e:{h=(Math.min(4294901760,65536*Math.ceil(Math.max(n,h)/65536))-S.buffer.byteLength+65535)/65536|0;try{S.grow(h),Me();var y=1;break e}catch{}y=void 0}if(y)return!0}return!1}var Er=()=>(nt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Zt={},on=n=>{n.forEach(l=>{Er()})};function td(){var n=Error().stack.toString().split(`
`);return n[0]=="Error"&&n.shift(),on(n),Zt.Kd=Er(),Zt.ae=n,Zt.Kd}function rd(n,l,c){if(n>>>=0,l>>>=0,Zt.Kd==n)var h=Zt.ae;else(h=Error().stack.toString().split(`
`))[0]=="Error"&&h.shift(),on(h);for(var y=3;h[y]&&Er()!=n;)++y;for(n=0;n<c&&h[n+y];++n)R()[l+4*n>>>2>>>0]=Er();return n}var ma,ga={},un=()=>{if(!ma){var n,l={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(n in ga)ga[n]===void 0?delete l[n]:l[n]=ga[n];var c=[];for(n in l)c.push(`${n}=${l[n]}`);ma=c}return ma};function ln(n,l){if(u)return xe(19,1,n,l);n>>>=0,l>>>=0;var c=0;return un().forEach((h,y)=>{var x=l+c;for(y=X()[n+4*y>>>2>>>0]=x,x=0;x<h.length;++x)H()[y++>>>0]=h.charCodeAt(x);H()[y>>>0]=0,c+=h.length+1}),0}function dn(n,l){if(u)return xe(20,1,n,l);n>>>=0,l>>>=0;var c=un();X()[n>>>2>>>0]=c.length;var h=0;return c.forEach(y=>h+=y.length+1),X()[l>>>2>>>0]=h,0}function pn(n){return u?xe(21,1,n):52}function cn(n,l,c,h){return u?xe(22,1,n,l,c,h):52}function hn(n,l,c,h){return u?xe(23,1,n,l,c,h):70}var ad=[null,[],[]];function fn(n,l,c,h){if(u)return xe(24,1,n,l,c,h);l>>>=0,c>>>=0,h>>>=0;for(var y=0,x=0;x<c;x++){var C=X()[l>>>2>>>0],z=X()[l+4>>>2>>>0];l+=8;for(var O=0;O<z;O++){var D=de()[C+O>>>0],q=ad[n];D===0||D===10?((n===1?b:$)(Ii(q)),q.length=0):q.push(D)}y+=z}return X()[h>>>2>>>0]=y,0}function id(n){return n>>>0}u||(function(){for(var n=a.numThreads-1;n--;)ki();ea.unshift(()=>{Gt++,(function(l){u?l():Promise.all(mt.map(xi)).then(l)})(()=>mi())})})();for(var mn=Array(256),zr=0;256>zr;++zr)mn[zr]=String.fromCharCode(zr);ji=mn,gt=a.BindingError=class extends Error{constructor(n){super(n),this.name="BindingError"}},a.InternalError=class extends Error{constructor(n){super(n),this.name="InternalError"}},ot.push(0,1,void 0,1,null,1,!0,1,!1,1),a.count_emval_handles=()=>ot.length/2-5-oa.length;var N,nd=[ta,vi,Si,Ei,zi,Oi,Ri,Bi,Ni,Mi,Di,Pi,Ui,Wi,Vi,qi,rn,an,nn,ln,dn,pn,cn,hn,fn];(async function(){function n(h,y){return N=h.exports,N=(function(){var x=N,C={};for(let[z,O]of Object.entries(x))C[z]=typeof O=="function"?(...D)=>{Tr.push(z);try{return O(...D)}finally{oe||(Tr.pop(),at&&_t===1&&Tr.length===0&&(_t=0,ft+=1,Sr(vs),typeof Fibers<"u"&&Fibers.le()))}}:O;return C})(),N=(function(){var x=N,C=O=>D=>O(D)>>>0,z=O=>()=>O()>>>0;return(x=Object.assign({},x)).Cb=C(x.Cb),x.fc=z(x.fc),x.ic=C(x.ic),x.vc=C(x.vc),x.wc=z(x.wc),x.Ac=C(x.Ac),x})(),$i.push(N.jc),T=y,mi(),N}Gt++;var l=gi();if(a.instantiateWasm)return new Promise(h=>{a.instantiateWasm(l,(y,x)=>{n(y,x),h(y.exports)})});if(u)return new Promise(h=>{Ne=y=>{var x=new WebAssembly.Instance(y,gi());h(n(x,y))}});Lt??=a.locateFile?a.locateFile?a.locateFile("ort-wasm-simd-threaded.jsep.wasm",v):v+"ort-wasm-simd-threaded.jsep.wasm":new URL("/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href;try{var c=await(async function(h){var y=Lt;if(!F&&typeof WebAssembly.instantiateStreaming=="function"&&!le(y))try{var x=fetch(y,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(x,h)}catch(C){$(`wasm streaming compile failed: ${C}`),$("falling back to ArrayBuffer instantiation")}return(async function(C,z){try{var O=await(async function(D){if(!F)try{var q=await f(D);return new Uint8Array(q)}catch{}if(D==Lt&&F)D=new Uint8Array(F);else{if(!m)throw"both async and sync fetching of the wasm failed";D=m(D)}return D})(C);return await WebAssembly.instantiate(O,z)}catch(D){$(`failed to asynchronously prepare wasm: ${D}`),nt(D)}})(y,h)})(l);return n(c.instance,c.module)}catch(h){return r(h),Promise.reject(h)}})();var gn=n=>(gn=N.Cb)(n),yn=()=>(yn=N.Db)();a._OrtInit=(n,l)=>(a._OrtInit=N.Eb)(n,l),a._OrtGetLastError=(n,l)=>(a._OrtGetLastError=N.Fb)(n,l),a._OrtCreateSessionOptions=(n,l,c,h,y,x,C,z,O,D)=>(a._OrtCreateSessionOptions=N.Gb)(n,l,c,h,y,x,C,z,O,D),a._OrtAppendExecutionProvider=(n,l)=>(a._OrtAppendExecutionProvider=N.Hb)(n,l),a._OrtAddFreeDimensionOverride=(n,l,c)=>(a._OrtAddFreeDimensionOverride=N.Ib)(n,l,c),a._OrtAddSessionConfigEntry=(n,l,c)=>(a._OrtAddSessionConfigEntry=N.Jb)(n,l,c),a._OrtReleaseSessionOptions=n=>(a._OrtReleaseSessionOptions=N.Kb)(n),a._OrtCreateSession=(n,l,c)=>(a._OrtCreateSession=N.Lb)(n,l,c),a._OrtReleaseSession=n=>(a._OrtReleaseSession=N.Mb)(n),a._OrtGetInputOutputCount=(n,l,c)=>(a._OrtGetInputOutputCount=N.Nb)(n,l,c),a._OrtGetInputName=(n,l)=>(a._OrtGetInputName=N.Ob)(n,l),a._OrtGetOutputName=(n,l)=>(a._OrtGetOutputName=N.Pb)(n,l),a._OrtFree=n=>(a._OrtFree=N.Qb)(n),a._OrtCreateTensor=(n,l,c,h,y,x)=>(a._OrtCreateTensor=N.Rb)(n,l,c,h,y,x),a._OrtGetTensorData=(n,l,c,h,y)=>(a._OrtGetTensorData=N.Sb)(n,l,c,h,y),a._OrtReleaseTensor=n=>(a._OrtReleaseTensor=N.Tb)(n),a._OrtCreateRunOptions=(n,l,c,h)=>(a._OrtCreateRunOptions=N.Ub)(n,l,c,h),a._OrtAddRunConfigEntry=(n,l,c)=>(a._OrtAddRunConfigEntry=N.Vb)(n,l,c),a._OrtReleaseRunOptions=n=>(a._OrtReleaseRunOptions=N.Wb)(n),a._OrtCreateBinding=n=>(a._OrtCreateBinding=N.Xb)(n),a._OrtBindInput=(n,l,c)=>(a._OrtBindInput=N.Yb)(n,l,c),a._OrtBindOutput=(n,l,c,h)=>(a._OrtBindOutput=N.Zb)(n,l,c,h),a._OrtClearBoundOutputs=n=>(a._OrtClearBoundOutputs=N._b)(n),a._OrtReleaseBinding=n=>(a._OrtReleaseBinding=N.$b)(n),a._OrtRunWithBinding=(n,l,c,h,y)=>(a._OrtRunWithBinding=N.ac)(n,l,c,h,y),a._OrtRun=(n,l,c,h,y,x,C,z)=>(a._OrtRun=N.bc)(n,l,c,h,y,x,C,z),a._OrtEndProfiling=n=>(a._OrtEndProfiling=N.cc)(n),a._JsepOutput=(n,l,c)=>(a._JsepOutput=N.dc)(n,l,c),a._JsepGetNodeName=n=>(a._JsepGetNodeName=N.ec)(n);var Ar=()=>(Ar=N.fc)(),it=a._free=n=>(it=a._free=N.gc)(n),Or=a._malloc=n=>(Or=a._malloc=N.ic)(n),ya=(n,l,c,h,y,x)=>(ya=N.kc)(n,l,c,h,y,x),_n=()=>(_n=N.lc)(),vn=(n,l,c,h,y)=>(vn=N.mc)(n,l,c,h,y),$n=n=>($n=N.nc)(n),_a=n=>(_a=N.oc)(n),wn=(n,l)=>(wn=N.pc)(n,l),bn=()=>(bn=N.qc)(),ae=(n,l)=>(ae=N.rc)(n,l),Qt=n=>(Qt=N.sc)(n),xn=(n,l)=>(xn=N.tc)(n,l),Y=n=>(Y=N.uc)(n),va=n=>(va=N.vc)(n),re=()=>(re=N.wc)(),kn=n=>(kn=N.xc)(n),Sn=n=>(Sn=N.yc)(n),Tn=(n,l,c)=>(Tn=N.zc)(n,l,c),Cn=n=>(Cn=N.Ac)(n),In=a.dynCall_iii=(n,l,c)=>(In=a.dynCall_iii=N.Bc)(n,l,c),En=a.dynCall_vi=(n,l)=>(En=a.dynCall_vi=N.Cc)(n,l),$a=a.dynCall_ii=(n,l)=>($a=a.dynCall_ii=N.Dc)(n,l),zn=a.dynCall_vii=(n,l,c)=>(zn=a.dynCall_vii=N.Ec)(n,l,c),An=a.dynCall_iiii=(n,l,c,h)=>(An=a.dynCall_iiii=N.Fc)(n,l,c,h),On=a.dynCall_viii=(n,l,c,h)=>(On=a.dynCall_viii=N.Gc)(n,l,c,h),Rn=a.dynCall_iiiii=(n,l,c,h,y)=>(Rn=a.dynCall_iiiii=N.Hc)(n,l,c,h,y),Bn=a.dynCall_viiii=(n,l,c,h,y)=>(Bn=a.dynCall_viiii=N.Ic)(n,l,c,h,y),Nn=a.dynCall_viiiiii=(n,l,c,h,y,x,C)=>(Nn=a.dynCall_viiiiii=N.Jc)(n,l,c,h,y,x,C),Mn=a.dynCall_viiiiiii=(n,l,c,h,y,x,C,z)=>(Mn=a.dynCall_viiiiiii=N.Kc)(n,l,c,h,y,x,C,z),Dn=a.dynCall_ji=(n,l)=>(Dn=a.dynCall_ji=N.Lc)(n,l),Pn=a.dynCall_v=n=>(Pn=a.dynCall_v=N.Mc)(n),Un=a.dynCall_viiiii=(n,l,c,h,y,x)=>(Un=a.dynCall_viiiii=N.Nc)(n,l,c,h,y,x),Wn=a.dynCall_i=n=>(Wn=a.dynCall_i=N.Oc)(n),Vn=a.dynCall_fii=(n,l,c)=>(Vn=a.dynCall_fii=N.Pc)(n,l,c),qn=a.dynCall_viiiiiiii=(n,l,c,h,y,x,C,z,O)=>(qn=a.dynCall_viiiiiiii=N.Qc)(n,l,c,h,y,x,C,z,O),jn=a.dynCall_viiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q)=>(jn=a.dynCall_viiiiiiiiii=N.Rc)(n,l,c,h,y,x,C,z,O,D,q),Ln=a.dynCall_jiii=(n,l,c,h)=>(Ln=a.dynCall_jiii=N.Sc)(n,l,c,h),Gn=a.dynCall_dii=(n,l,c)=>(Gn=a.dynCall_dii=N.Tc)(n,l,c),Fn=a.dynCall_viiiiiiiii=(n,l,c,h,y,x,C,z,O,D)=>(Fn=a.dynCall_viiiiiiiii=N.Uc)(n,l,c,h,y,x,C,z,O,D),Hn=a.dynCall_viiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q)=>(Hn=a.dynCall_viiiiiiiiiii=N.Vc)(n,l,c,h,y,x,C,z,O,D,q,Q),Kn=a.dynCall_iiiiii=(n,l,c,h,y,x)=>(Kn=a.dynCall_iiiiii=N.Wc)(n,l,c,h,y,x),Zn=a.dynCall_iij=(n,l,c)=>(Zn=a.dynCall_iij=N.Xc)(n,l,c),Qn=a.dynCall_iiiiiiiiii=(n,l,c,h,y,x,C,z,O,D)=>(Qn=a.dynCall_iiiiiiiiii=N.Yc)(n,l,c,h,y,x,C,z,O,D),Xn=a.dynCall_iiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q)=>(Xn=a.dynCall_iiiiiiiiiii=N.Zc)(n,l,c,h,y,x,C,z,O,D,q),Jn=a.dynCall_vij=(n,l,c)=>(Jn=a.dynCall_vij=N._c)(n,l,c),Yn=a.dynCall_iiif=(n,l,c,h)=>(Yn=a.dynCall_iiif=N.$c)(n,l,c,h),es=a.dynCall_iiij=(n,l,c,h)=>(es=a.dynCall_iiij=N.ad)(n,l,c,h),ts=a.dynCall_fiii=(n,l,c,h)=>(ts=a.dynCall_fiii=N.bd)(n,l,c,h),rs=a.dynCall_viiiiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)=>(rs=a.dynCall_viiiiiiiiiiiii=N.cd)(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e),as=a.dynCall_vjiii=(n,l,c,h,y)=>(as=a.dynCall_vjiii=N.dd)(n,l,c,h,y),is=a.dynCall_vif=(n,l,c)=>(is=a.dynCall_vif=N.ed)(n,l,c),ns=a.dynCall_iiiiiii=(n,l,c,h,y,x,C)=>(ns=a.dynCall_iiiiiii=N.fd)(n,l,c,h,y,x,C),ss=a.dynCall_iiiij=(n,l,c,h,y)=>(ss=a.dynCall_iiiij=N.gd)(n,l,c,h,y),os=a.dynCall_iiiiiiii=(n,l,c,h,y,x,C,z)=>(os=a.dynCall_iiiiiiii=N.hd)(n,l,c,h,y,x,C,z),us=a.dynCall_viiiiiiiiiiii=(n,l,c,h,y,x,C,z,O,D,q,Q,ie)=>(us=a.dynCall_viiiiiiiiiiii=N.id)(n,l,c,h,y,x,C,z,O,D,q,Q,ie),ls=a.dynCall_diii=(n,l,c,h)=>(ls=a.dynCall_diii=N.jd)(n,l,c,h),ds=a.dynCall_jiiii=(n,l,c,h,y)=>(ds=a.dynCall_jiiii=N.kd)(n,l,c,h,y),ps=a.dynCall_viiij=(n,l,c,h,y)=>(ps=a.dynCall_viiij=N.ld)(n,l,c,h,y),cs=a.dynCall_fiiii=(n,l,c,h,y)=>(cs=a.dynCall_fiiii=N.md)(n,l,c,h,y),hs=a.dynCall_viiif=(n,l,c,h,y)=>(hs=a.dynCall_viiif=N.nd)(n,l,c,h,y),fs=a.dynCall_diiii=(n,l,c,h,y)=>(fs=a.dynCall_diiii=N.od)(n,l,c,h,y),ms=a.dynCall_viiid=(n,l,c,h,y)=>(ms=a.dynCall_viiid=N.pd)(n,l,c,h,y),gs=a.dynCall_iiiijii=(n,l,c,h,y,x,C)=>(gs=a.dynCall_iiiijii=N.qd)(n,l,c,h,y,x,C),ys=a.dynCall_iiiiiij=(n,l,c,h,y,x,C)=>(ys=a.dynCall_iiiiiij=N.rd)(n,l,c,h,y,x,C),_s=n=>(_s=N.sd)(n),vs=()=>(vs=N.td)(),$s=n=>($s=N.ud)(n),ws=()=>(ws=N.vd)();function sd(n,l,c){var h=re();try{zn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function od(n,l,c){var h=re();try{return In(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function ud(n,l){var c=re();try{En(n,l)}catch(h){if(Y(c),h!==h+0)throw h;ae(1,0)}}function ld(n,l){var c=re();try{return $a(n,l)}catch(h){if(Y(c),h!==h+0)throw h;ae(1,0)}}function dd(n,l,c,h){var y=re();try{return An(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function pd(n,l,c,h,y){var x=re();try{Bn(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function cd(n,l,c,h,y){var x=re();try{return Rn(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function hd(n,l,c,h){var y=re();try{On(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function fd(n,l,c,h,y,x,C){var z=re();try{return ns(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function md(n){var l=re();try{Pn(n)}catch(c){if(Y(l),c!==c+0)throw c;ae(1,0)}}function gd(n,l,c){var h=re();try{return Zn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function yd(n,l,c,h,y,x){var C=re();try{Un(n,l,c,h,y,x)}catch(z){if(Y(C),z!==z+0)throw z;ae(1,0)}}function _d(n,l,c){var h=re();try{Jn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function vd(n,l,c,h,y,x,C){var z=re();try{Nn(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function $d(n,l,c,h,y,x,C,z){var O=re();try{Mn(n,l,c,h,y,x,C,z)}catch(D){if(Y(O),D!==D+0)throw D;ae(1,0)}}function wd(n,l,c,h,y,x){var C=re();try{return Kn(n,l,c,h,y,x)}catch(z){if(Y(C),z!==z+0)throw z;ae(1,0)}}function bd(n,l,c,h,y,x,C,z){var O=re();try{return os(n,l,c,h,y,x,C,z)}catch(D){if(Y(O),D!==D+0)throw D;ae(1,0)}}function xd(n,l,c,h,y,x,C,z,O,D){var q=re();try{Fn(n,l,c,h,y,x,C,z,O,D)}catch(Q){if(Y(q),Q!==Q+0)throw Q;ae(1,0)}}function kd(n,l,c,h,y,x,C,z,O){var D=re();try{qn(n,l,c,h,y,x,C,z,O)}catch(q){if(Y(D),q!==q+0)throw q;ae(1,0)}}function Sd(n){var l=re();try{return Wn(n)}catch(c){if(Y(l),c!==c+0)throw c;ae(1,0)}}function Td(n,l,c,h,y,x,C,z,O,D){var q=re();try{return Qn(n,l,c,h,y,x,C,z,O,D)}catch(Q){if(Y(q),Q!==Q+0)throw Q;ae(1,0)}}function Cd(n,l,c){var h=re();try{return Vn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function Id(n,l,c,h){var y=re();try{return Ln(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;return ae(1,0),0n}}function Ed(n,l,c){var h=re();try{return Gn(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function zd(n,l,c,h,y,x,C,z,O,D,q,Q){var ie=re();try{Hn(n,l,c,h,y,x,C,z,O,D,q,Q)}catch($e){if(Y(ie),$e!==$e+0)throw $e;ae(1,0)}}function Ad(n,l,c,h,y,x,C,z,O,D,q){var Q=re();try{jn(n,l,c,h,y,x,C,z,O,D,q)}catch(ie){if(Y(Q),ie!==ie+0)throw ie;ae(1,0)}}function Od(n,l,c,h,y,x,C,z,O,D,q){var Q=re();try{return Xn(n,l,c,h,y,x,C,z,O,D,q)}catch(ie){if(Y(Q),ie!==ie+0)throw ie;ae(1,0)}}function Rd(n,l,c,h){var y=re();try{return Yn(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Bd(n,l,c,h){var y=re();try{return es(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Nd(n,l,c,h){var y=re();try{return ts(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function Md(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e){var Xe=re();try{rs(n,l,c,h,y,x,C,z,O,D,q,Q,ie,$e)}catch(Xt){if(Y(Xe),Xt!==Xt+0)throw Xt;ae(1,0)}}function Dd(n,l,c,h,y){var x=re();try{as(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Pd(n,l,c){var h=re();try{is(n,l,c)}catch(y){if(Y(h),y!==y+0)throw y;ae(1,0)}}function Ud(n,l){var c=re();try{return Dn(n,l)}catch(h){if(Y(c),h!==h+0)throw h;return ae(1,0),0n}}function Wd(n,l,c,h,y){var x=re();try{return ss(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Vd(n,l,c,h,y,x,C,z,O,D,q,Q,ie){var $e=re();try{us(n,l,c,h,y,x,C,z,O,D,q,Q,ie)}catch(Xe){if(Y($e),Xe!==Xe+0)throw Xe;ae(1,0)}}function qd(n,l,c,h){var y=re();try{return ls(n,l,c,h)}catch(x){if(Y(y),x!==x+0)throw x;ae(1,0)}}function jd(n,l,c,h,y){var x=re();try{return ds(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;return ae(1,0),0n}}function Ld(n,l,c,h,y){var x=re();try{ps(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Gd(n,l,c,h,y){var x=re();try{return cs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Fd(n,l,c,h,y){var x=re();try{hs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Hd(n,l,c,h,y){var x=re();try{return fs(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Kd(n,l,c,h,y){var x=re();try{ms(n,l,c,h,y)}catch(C){if(Y(x),C!==C+0)throw C;ae(1,0)}}function Zd(n,l,c,h,y,x,C){var z=re();try{return gs(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}function Qd(n,l,c,h,y,x,C){var z=re();try{return ys(n,l,c,h,y,x,C)}catch(O){if(Y(z),O!==O+0)throw O;ae(1,0)}}return a.stackSave=()=>re(),a.stackRestore=n=>Y(n),a.stackAlloc=n=>va(n),a.setValue=function(n,l,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":H()[n>>>0]=l;break;case"i16":M()[n>>>1>>>0]=l;break;case"i32":R()[n>>>2>>>0]=l;break;case"i64":P[n>>>3]=BigInt(l);break;case"float":Ie()[n>>>2>>>0]=l;break;case"double":Fe()[n>>>3>>>0]=l;break;case"*":X()[n>>>2>>>0]=l;break;default:nt(`invalid type for setValue: ${c}`)}},a.getValue=function(n,l="i8"){switch(l.endsWith("*")&&(l="*"),l){case"i1":case"i8":return H()[n>>>0];case"i16":return M()[n>>>1>>>0];case"i32":return R()[n>>>2>>>0];case"i64":return P[n>>>3];case"float":return Ie()[n>>>2>>>0];case"double":return Fe()[n>>>3>>>0];case"*":return X()[n>>>2>>>0];default:nt(`invalid type for getValue: ${l}`)}},a.UTF8ToString=Oe,a.stringToUTF8=zt,a.lengthBytesUTF8=Ai,(function n(){if(0<Gt)Ft=n;else if(u)t(a),wr();else{for(;0<ea.length;)ea.shift()(a);0<Gt?Ft=n:(a.calledRun=!0,oe||(wr(),t(a)))}})(),a.PTR_SIZE=4,i}),qx=tc,A_=globalThis.self?.name?.startsWith("em-pthread"),A_&&tc()}),rc,O_,Ot,jx,Vo,R_,B_,ac,N_,ic,Lx,nc,Gx,yf=te(()=>{gf(),rc=typeof location>"u"?void 0:location.origin,O_=()=>import.meta.url?.startsWith("file:")?new URL(new URL("/assets/ort.bundle.min-OfoG_cy9.mjs",import.meta.url).href,rc).href:import.meta.url,Ot=O_(),jx=()=>{if(Ot&&!Ot.startsWith("blob:"))return Ot.substring(0,Ot.lastIndexOf("/")+1)},Vo=(e,t)=>{try{let r=t??Ot;return(r?new URL(e,r):new URL(e)).origin===rc}catch{return!1}},R_=(e,t)=>{let r=t??Ot;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},B_=(e,t)=>`${t??"./"}${e}`,ac=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},N_=async e=>(await import(e)).default,ic=(aA(),bu(Ux)).default,Lx=async()=>{if(!Ot)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Vo(Ot))return[void 0,ic()];let e=await ac(Ot);return[e,ic(e)]},nc=(iA(),bu(Vx)).default,Gx=async(e,t,r)=>{if(!e&&!t&&nc&&Ot&&Vo(Ot))return[void 0,nc];{let a="ort-wasm-simd-threaded.jsep.mjs",i=e??R_(a,t),s=r&&i&&!Vo(i,t),o=s?await ac(i):i??B_(a,t);return[s?o:void 0,await N_(o)]}}}),sc,qo,Bs,oc,M_,D_,_f,lt,Ka=te(()=>{yf(),qo=!1,Bs=!1,oc=!1,M_=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},D_=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},_f=async e=>{if(qo)return Promise.resolve();if(Bs)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(oc)throw new Error("previous call to 'initializeWebAssembly()' failed.");Bs=!0;let t=e.initTimeout,r=e.numThreads;if(!D_())throw new Error("WebAssembly SIMD is not supported in the current environment.");let a=M_();r>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let i=e.wasmPaths,s=typeof i=="string"?i:void 0,o=i?.mjs,u=o?.href??o,d=i?.wasm,p=d?.href??d,f=e.wasmBinary,[m,g]=await Gx(u,s,r>1),_=!1,v=[];if(t>0&&v.push(new Promise(w=>{setTimeout(()=>{_=!0,w()},t)})),v.push(new Promise((w,k)=>{let b={numThreads:r};if(f)b.wasmBinary=f;else if(p||s)b.locateFile=$=>p??s+$;else if(u&&u.indexOf("blob:")!==0)b.locateFile=$=>new URL($,u).href;else if(m){let $=jx();$&&(b.locateFile=S=>$+S)}g(b).then($=>{Bs=!1,qo=!0,sc=$,w(),m&&URL.revokeObjectURL(m)},$=>{Bs=!1,oc=!0,k($)})})),await Promise.race(v),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},lt=()=>{if(qo&&sc)return sc;throw new Error("WebAssembly is not initialized yet.")}}),wt,xu,je,vf=te(()=>{Ka(),wt=(e,t)=>{let r=lt(),a=r.lengthBytesUTF8(e)+1,i=r._malloc(a);return r.stringToUTF8(e,i,a),t.push(i),i},xu=(e,t,r,a)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([i,s])=>{let o=t?t+i:i;if(typeof s=="object")xu(s,o+".",r,a);else if(typeof s=="string"||typeof s=="number")a(o,s.toString());else if(typeof s=="boolean")a(o,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},je=e=>{let t=lt(),r=t.stackSave();try{let a=t.PTR_SIZE,i=t.stackAlloc(2*a);t._OrtGetLastError(i,i+a);let s=Number(t.getValue(i,a===4?"i32":"i64")),o=t.getValue(i+a,"*"),u=o?t.UTF8ToString(o):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Fx,nA=te(()=>{Ka(),vf(),Fx=e=>{let t=lt(),r=0,a=[],i=e||{};try{if(e?.logSeverityLevel===void 0)i.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)i.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(i.terminate=!1);let s=0;return e?.tag!==void 0&&(s=wt(e.tag,a)),r=t._OrtCreateRunOptions(i.logSeverityLevel,i.logVerbosityLevel,!!i.terminate,s),r===0&&je("Can't create run options."),e?.extra!==void 0&&xu(e.extra,"",new WeakSet,(o,u)=>{let d=wt(o,a),p=wt(u,a);t._OrtAddRunConfigEntry(r,d,p)!==0&&je(`Can't set a run config entry: ${o} - ${u}.`)}),[r,a]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),a.forEach(o=>t._free(o)),s}}}),P_,U_,W_,V_,Hx,sA=te(()=>{Ka(),vf(),P_=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},U_=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},W_=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},V_=(e,t,r)=>{for(let a of t){let i=typeof a=="string"?a:a.name;switch(i){case"webnn":if(i="WEBNN",typeof a!="string"){let o=a?.deviceType;if(o){let u=wt("deviceType",r),d=wt(o,r);lt()._OrtAddSessionConfigEntry(e,u,d)!==0&&je(`Can't set a session config entry: 'deviceType' - ${o}.`)}}break;case"webgpu":if(i="JS",typeof a!="string"){let o=a;if(o?.preferredLayout){if(o.preferredLayout!=="NCHW"&&o.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${o.preferredLayout}`);let u=wt("preferredLayout",r),d=wt(o.preferredLayout,r);lt()._OrtAddSessionConfigEntry(e,u,d)!==0&&je(`Can't set a session config entry: 'preferredLayout' - ${o.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${i}`)}let s=wt(i,r);lt()._OrtAppendExecutionProvider(e,s)!==0&&je(`Can't append execution provider: ${i}.`)}},Hx=e=>{let t=lt(),r=0,a=[],i=e||{};W_(i);try{let s=P_(i.graphOptimizationLevel??"all"),o=U_(i.executionMode??"sequential"),u=typeof i.logId=="string"?wt(i.logId,a):0,d=i.logSeverityLevel??2;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log serverity level is not valid: ${d}`);let p=i.logVerbosityLevel??0;if(!Number.isInteger(p)||p<0||p>4)throw new Error(`log verbosity level is not valid: ${p}`);let f=typeof i.optimizedModelFilePath=="string"?wt(i.optimizedModelFilePath,a):0;if(r=t._OrtCreateSessionOptions(s,!!i.enableCpuMemArena,!!i.enableMemPattern,o,!!i.enableProfiling,0,u,d,p,f),r===0&&je("Can't create session options."),i.executionProviders&&V_(r,i.executionProviders,a),i.enableGraphCapture!==void 0){if(typeof i.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);let m=wt("enableGraphCapture",a),g=wt(i.enableGraphCapture.toString(),a);t._OrtAddSessionConfigEntry(r,m,g)!==0&&je(`Can't set a session config entry: 'enableGraphCapture' - ${i.enableGraphCapture}.`)}if(i.freeDimensionOverrides)for(let[m,g]of Object.entries(i.freeDimensionOverrides)){if(typeof m!="string")throw new Error(`free dimension override name must be a string: ${m}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=wt(m,a);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&je(`Can't set a free dimension override: ${m} - ${g}.`)}return i.extra!==void 0&&xu(i.extra,"",new WeakSet,(m,g)=>{let _=wt(m,a),v=wt(g,a);t._OrtAddSessionConfigEntry(r,_,v)!==0&&je(`Can't set a session config entry: ${m} - ${g}.`)}),[r,a]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&je("Can't release session options."),a.forEach(o=>t._free(o)),s}}}),ei,Ra,Ba,$f,ku,wf,bf,mh,be=te(()=>{ei=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Ra=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ba=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((i,s)=>i*s,1);return r>0?Math.ceil(a*r):void 0},$f=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},ku=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},wf=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",bf=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",mh=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),xf,Kx=te(()=>{gf(),xf=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),a=r?parseInt(r,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let i=t.body.getReader(),s;try{s=new ArrayBuffer(a)}catch(u){if(u instanceof RangeError){let d=Math.ceil(a/65536);s=new WebAssembly.Memory({initial:d,maximum:d}).buffer}else throw u}let o=0;for(;;){let{done:u,value:d}=await i.read();if(u)break;let p=d.byteLength;new Uint8Array(s,o,p).set(d),o+=p}return new Uint8Array(s,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),q_,j_,L_,G_,kf,F_,Pe,Ur=te(()=>{be(),q_=["V","I","W","E","F"],j_=(e,t)=>{console.log(`[${q_[e]},${new Date().toISOString()}]${t}`)},kf=(e,t)=>{L_=e,G_=t},F_=(e,t)=>{let r=ku(e),a=ku(L_);r>=a&&j_(r,typeof t=="function"?t():t)},Pe=(...e)=>{G_&&F_(...e)}}),Sf,Zx=te(()=>{be(),Sf=(e,t)=>new($f(t))(e)}),Tf=te(()=>{}),uc,jo,Lo,H_,K_,lc,gh,Z_,Qx,oA=te(()=>{Ur(),Tf(),uc=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),jo=[],Lo=e=>Math.ceil(Number(e)/16)*16,H_=e=>{for(let t=0;t<jo.length;t++){let r=jo[t];if(e<=r)return r}return Math.ceil(e/16)*16},K_=1,lc=()=>K_++,gh=async(e,t,r,a)=>{let i=Lo(r),s=e.device.createBuffer({size:i,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let o=e.getCommandEncoder();e.endComputePass(),o.copyBufferToBuffer(t,0,s,0,i),e.flush(),await s.mapAsync(GPUMapMode.READ);let u=s.getMappedRange();if(a){let d=a();return d.set(new Uint8Array(u,0,r)),d}else return new Uint8Array(u.slice(0,r))}finally{s.destroy()}},Z_=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of uc)jo.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,a=t.byteOffset,i=t.byteLength,s=Lo(i),o=this.storageCache.get(e);if(!o)throw new Error("gpu data for uploading does not exist");if(Number(o.originalSize)!==i)throw new Error(`inconsistent data size. gpu data size=${o.originalSize}, data size=${i}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),d=u.getMappedRange();new Uint8Array(d).set(new Uint8Array(r,a,i)),u.unmap();let p=this.backend.device.createCommandEncoder();p.copyBufferToBuffer(u,0,o.gpuData.buffer,0,s),this.backend.device.queue.submit([p.finish()]),u.destroy(),Pe("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=Lo(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,a.gpuData.buffer,0,i)}registerExternalBuffer(e,t,r){let a;if(r){if(a=r[0],e===r[1])return Pe("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=lc();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),Pe("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),Pe("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=H_(e),a,i=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||s){let u=(i?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?a=u.pop():a=this.backend.device.createBuffer({size:r,usage:t}):a=this.backend.device.createBuffer({size:r,usage:t})}else a=this.backend.device.createBuffer({size:r,usage:t});let o={id:lc(),type:0,buffer:a};return this.storageCache.set(o.id,{gpuData:o,originalSize:Number(e)}),Pe("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${o.id}`),o}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return Pe("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await gh(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=uc.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(Pe("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Qx=(...e)=>new Z_(...e)}),Q_,Ge,tt=te(()=>{Q_=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Ge=e=>new Q_(e)}),X_,di,G,Su,Xx,Jx,Yx,Ce=te(()=>{X_=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},di=class{static calcShape(e,t,r=!1){let a=e.length,i=t.length;if(a===0)return t;if(i===0)return e;let s=Math.max(e.length,t.length),o=new Array(s);if(r){if(a<2||i<2)return;let u=X_.calcMatMulShape([e[a-2],e[a-1]],[t[i-2],t[i-1]]);if(u===void 0)return;[o[s-2],o[s-1]]=u}for(let u=r?3:1;u<=s;u++){let d=a-u<0?1:e[a-u],p=i-u<0?1:t[i-u];if(d!==p&&d>1&&p>1)return;let f=Math.max(d,p);if(d&&p)o[s-u]=Math.max(d,p);else{if(f>1)return;o[s-u]=0}}return o}static isValidBroadcast(e,t){let r=e.length,a=t.length;if(r>a)return!1;for(let i=1;i<=r;i++)if(e[r-i]!==1&&e[r-i]!==t[a-i])return!1;return!0}},G=class iu{static size(t){return iu.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let a=t.length;if(a===0)return[];let i=new Array(a),s=a-1;for(;s>=0;){if(t[s]%r===0){i[s]=t[s]/r;break}if(r%t[s]!==0)throw new Error("cannot convert shape");i[s]=1,r/=t[s],s--}for(s--;s>=0;s--)i[s]=t[s];return i}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return iu.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return iu.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,a){let i=1;for(let s=r;s<a;s++){if(t[s]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");i*=Number(t[s])}return i}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let a=new Array(r);a[r-1]=1,a[r-2]=t[r-1];for(let i=r-3;i>=0;--i)a[i]=a[i+1]*t[i+1];return a}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(a=>this.normalizeAxis(a,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(a=>t[a]):t.slice().reverse()}static padShape(t,r){let a=t.length;return t.map((i,s)=>i+r[s]+r[s+a])}static areEqual(t,r){return t.length!==r.length?!1:t.every((a,i)=>a===r[i])}},Su=class Qs{static adjustPoolAttributes(t,r,a,i,s,o){if(!t&&a.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=a.length?a.push(r[u+2]):a[u]=r[u+2];for(let u=0;u<a.length;u++)if(u<i.length){if(i[u]<0)throw new Error("strides should be greater than or equal to 1")}else i.push(1);for(let u=0;u<a.length;u++)if(u<s.length){if(s[u]<0)throw new Error("dilations should be greater than or equal to 1")}else s.push(1);for(let u=0;u<a.length*2;u++)if(u<o.length){if(o[u]<0)throw new Error("pad should be greater than or equal to 1")}else o.push(0);for(let u=0;u<a.length;u++){if(a[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(o[u]>=a[u]||o[u+a.length]>=a[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,a,i,s,o,u){if(u){if(s.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(i.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)Qs.adjustPadAndReturnShape(t[d+(o?1:2)],r[d],a[d],i[d],s,d,d+t.length-2,u)}}static computePoolOutputShape(t,r,a,i,s,o,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return Qs.computeShapeHelper(t,r,d,a,i,s,o,u),d}static computeConvOutputShape(t,r,a,i,s,o,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let d=[t[0],r[0]];return Qs.computeShapeHelper(!1,t,d,a,i,s,o,u),d}static computeShapeHelper(t,r,a,i,s,o,u,d){if(t)for(let p=0;p<r.length-2;p++)a.push(1);else for(let p=0;p<r.length-2;p++)a.push(Qs.adjustPadAndReturnShape(r[p+2],i[p],s[p],o[p],u,p,p+r.length-2,d))}static adjustPadAndReturnShape(t,r,a,i,s,o,u,d){let p=a*(i-1)+1;if(d&&d!=="NOTSET")switch(d){case"VALID":return s[o]=0,s[u]=0,Math.floor((t-p)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let f=((t+r-1)/r-1)*r+i-t;return s[o]=Math.floor(d==="SAME_LOWER"?(f+1)/2:f/2),s[u]=f-s[o],Math.floor((t+f-i)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+s[o]+s[u]-p)/r+1)}},Xx=class{static getShapeOfGemmResult(e,t,r,a,i){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let s,o,u;t?(s=e[1],o=e[0]):(s=e[0],o=e[1]);let d=-1;if(a?(u=r[0],d=1):(u=r[1],d=0),r[d]!==o)throw new Error("dimension mismatch");if(s<=0||u<=0||o<=0)throw new Error("invalid shape specified");if(i&&!di.isValidBroadcast(i,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,o]}},Jx=-34028234663852886e22,Yx=34028234663852886e22}),pi,Go,pt,xt,_e,Ye,yh,ai,Zr,ge,Ns,Z,fe,e3,Cf,J_,t3,Ae=te(()=>{be(),Ce(),pi=64,Go=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},pt=(e,t=1)=>{let r=Go(e,t);return typeof r=="string"?r:r[0]},xt=(e,t=1)=>{let r=Go(e,t);return typeof r=="string"?r:r[1]},_e=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:G.computeStrides(r)})}),t},Ye=e=>e%4===0?4:e%2===0?2:1,yh=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,ai=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Zr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,ge=(e,t,r,a)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Ns=(e,t,r,a,i)=>{let s=typeof r=="number",o=s?r:r.length,u=[...new Array(o).keys()],d=o<2?"u32":o<=4?`vec${o}<u32>`:`array<u32, ${o}>`,p=Go(t,i),f=typeof p=="string"?p:p[1],m=typeof p=="string"?p:p[0],g={indices:d,value:f,storage:m,tensor:t},_=M=>typeof M=="string"?M:`${M}u`,v={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=s?"uniforms.":"",k=`${w}${e}_shape`,b=`${w}${e}_strides`,$="";for(let M=0;M<o-1;M++)$+=`
    let dim${M} = current / ${ge(b,M,o)};
    let rest${M} = current % ${ge(b,M,o)};
    indices[${M}] = dim${M};
    current = rest${M};
    `;$+=`indices[${o-1}] = current;`;let S=o<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${$}
    return indices;
  }`,T=M=>(v.offsetToIndices=!0,o<2?M:`o2i_${e}(${M})`),I=[];if(o>=2)for(let M=o-1;M>=0;M--)I.push(`${ge(b,M,o)} * (indices[${M}])`);let A=o<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${I.join("+")};
  }`,E=M=>(v.indicesToOffset=!0,o<2?M:`i2o_${e}(${M})`),B=(...M)=>o===0?"0u":`${g.indices}(${M.map(_).join(",")})`,U=(M,V)=>o<2?`${M}`:`${ge(M,V,o)}`,j=(M,V,R)=>o<2?`${M}=${R};`:`${ge(M,V,o)}=${R};`,W={},J=(M,V)=>{v.broadcastedIndicesToOffset=!0;let R=`${V.name}broadcastedIndicesTo${e}Offset`;if(R in W)return`${R}(${M})`;let X=[];for(let Ie=o-1;Ie>=0;Ie--){let Fe=V.indicesGet("outputIndices",Ie+V.rank-o);X.push(`${U(b,Ie)} * (${Fe} % ${U(k,Ie)})`)}return W[R]=`fn ${R}(outputIndices: ${V.type.indices}) -> u32 {
             return ${X.length>0?X.join("+"):"0u"};
           }`,`${R}(${M})`},P=(M,V)=>(()=>{if(g.storage===g.value)return`${e}[${M}]=${V};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${M}]=vec2<u32>(u32(${V}), select(0u, 0xFFFFFFFFu, ${V} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${M}]=vec2<u32>(u32(${V}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${M}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${V}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),se=M=>(()=>{if(g.storage===g.value)return`${e}[${M}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${M}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${M}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${M}] & 0xFFu), bool(${e}[${M}] & 0xFF00u), bool(${e}[${M}] & 0xFF0000u), bool(${e}[${M}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ue=o<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${f} {
    return ${se(`i2o_${e}(indices)`)};
  }`,F=o<2?"":(()=>{let M=u.map(R=>`d${R}: u32`).join(", "),V=u.map(R=>`d${R}`).join(", ");return`
  fn get_${e}(${M}) -> ${f} {
    return get_${e}ByIndices(${B(V)});
  }`})(),oe=(...M)=>{if(M.length!==o)throw new Error(`indices length must be ${o}`);let V=M.map(_).join(",");return o===0?se("0u"):o===1?se(V[0]):(v.get=!0,v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}(${V})`)},le=M=>o<2?se(M):(v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}ByIndices(${M})`),H=o<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${f}) {
    ${P(`i2o_${e}(indices)`,"value")}
  }`,de=o<2?"":(()=>{let M=u.map(R=>`d${R}: u32`).join(", "),V=u.map(R=>`d${R}`).join(", ");return`
  fn set_${e}(${M}, value: ${f}) {
    set_${e}ByIndices(${B(V)}, value);
  }`})();return{impl:()=>{let M=[],V=!1;return v.offsetToIndices&&(M.push(S),V=!0),v.indicesToOffset&&(M.push(A),V=!0),v.broadcastedIndicesToOffset&&(Object.values(W).forEach(R=>M.push(R)),V=!0),v.set&&(M.push(de),V=!0),v.setByIndices&&(M.push(H),V=!0),v.get&&(M.push(F),V=!0),v.getByIndices&&(M.push(ue),V=!0),!s&&V&&M.unshift(`const ${k} = ${g.indices}(${r.join(",")});`,`const ${b} = ${g.indices}(${G.computeStrides(r).join(",")});`),M.join(`
`)},type:g,offsetToIndices:T,indicesToOffset:E,broadcastedIndicesToOffset:J,indices:B,indicesGet:U,indicesSet:j,set:(...M)=>{if(M.length!==o+1)throw new Error(`indices length must be ${o}`);let V=M[o];if(typeof V!="string")throw new Error("value must be string");let R=M.slice(0,o).map(_).join(",");return o===0?P("0u",V):o===1?P(R[0],V):(v.set=!0,v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}(${R}, ${V})`)},setByOffset:P,setByIndices:(M,V)=>o<2?P(M,V):(v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}ByIndices(${M}, ${V});`),get:oe,getByOffset:se,getByIndices:le,usage:a,name:e,strides:b,shape:k,rank:o}},Z=(e,t,r,a=1)=>Ns(e,t,r,"input",a),fe=(e,t,r,a=1)=>Ns(e,t,r,"output",a),e3=(e,t,r)=>Ns(e,t,r,"atomicOutput",1),Cf=(e,t,r,a=1)=>Ns(e,t,r,"internal",a),J_=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=pi){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,o=i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${a})
  fn main(${s}) {
    ${o}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:a}of this.uniforms)if(a&&a>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(a/4)}>`);else{let i=a==null||a===1?r:`vec${a}<${r}>`;e.push(`${t}:${i}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},t3=(e,t)=>new J_(e,t)}),Y_,dc,e0,t0,r0,a0,Mt,r3,a3,Xr=te(()=>{be(),Ce(),tt(),Ae(),Y_=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},dc=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),e0=(e,t)=>G.sortBasedOnPerm(e,dc(e.length,t)),t0=(e,t,r,a)=>{let i=`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let s=0;s<t;++s)i+=`a[${e[s]}]=i[${s}];`;return i+="return a;}"},r0=(e,t)=>{let r=[],a=[];for(let i=0;i<e.length;++i)e[i]!==1&&r.push(e[i]),e[t[i]]!==1&&a.push(t[i]);return{newShape:r,newPerm:a}},a0=(e,t)=>{let r=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<r)return!1;r=e[a]}return!0},Mt=(e,t)=>{let r=e.dataType,a=e.dims.length,i=dc(a,t),s=e0(e.dims,i),o=e.dims,u=s,d=a<2||a0(i,e.dims),p;if(d)return p=v=>{let w=Z("input",r,o,4),k=fe("output",r,u,4);return`
  ${v.registerUniform("output_size","u32").declareVariables(w,k)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let v=G.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64/4)},programUniforms:[{type:12,data:Math.ceil(v/4)}]}},getShaderSource:p};let{newShape:f,newPerm:m}=r0(e.dims,i),g=G.areEqual(m,[2,3,1]),_=G.areEqual(m,[3,1,2]);if(f.length===2||g||_){o=g?[f[0],f[1]*f[2]]:_?[f[0]*f[1],f[2]]:f,u=[o[1],o[0]];let v=16;return p=w=>{let k=Z("a",r,o.length),b=fe("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(k,b)}
  var<workgroup> tile : array<array<${b.type.value}, ${v+1}>, ${v}>;
  ${w.mainStart([v,v,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${v} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${v}u + local_id.x;
    let input_row = workgroup_id_x * ${v}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${v}u + local_id.x;
    let output_row = workgroup_id_y * ${v}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${b.setByIndices(`${b.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=G.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/v),y:Math.ceil(u[0]/v)},programUniforms:[{type:12,data:w},..._e(o,u)]}},getShaderSource:p}}return p=v=>{let w=Z("a",r,o.length),k=fe("output",r,u.length);return`
  ${v.registerUniform("output_size","u32").declareVariables(w,k)}

  ${t0(i,a,w,k)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let v=G.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},..._e(o,u)]}},getShaderSource:p}},r3=(e,t)=>{Y_(e.inputs,t.perm),e.compute(Mt(e.inputs[0],t.perm))},a3=e=>Ge({perm:e.perm})}),i0,n0,s0,o0,u0,l0,d0,p0,c0,h0,ar,i3,n3,s3,o3,u3,l3,d3,p3,c3,h3,uA=te(()=>{be(),Ce(),Ae(),If(),Xr(),i0={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},n0={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},s0={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},o0={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},u0=(e,t)=>{let r=[];for(let a=t-e;a<t;++a)r.push(a);return r},l0=(e,t)=>{let r=[],a=e.length;for(let s=0;s<a;s++)t.indexOf(s)===-1&&r.push(e[s]);let i=t.map(s=>e[s]);return[r,i]},d0=(e,t)=>{let r=e.length+t.length,a=[],i=0;for(let s=0;s<r;s++)t.indexOf(s)===-1?a.push(e[i++]):a.push(1);return a},p0=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},c0=(e,t)=>{let r=[];if(!p0(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&r.push(a);e.forEach(a=>r.push(a))}return r},h0=(e,t,r,a,i,s,o)=>{let u=r[0].dims,d=G.size(s),p=G.size(o),f=Z("_A",r[0].dataType,u),m=fe("output",i,s),g=64;d===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,v=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(f,m)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${s0[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${i0[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${n0[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex",`${a==="mean"?`${m.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${m.type.storage}(${o0[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:s,dataType:i}],dispatchGroup:{x:d},programUniforms:[{type:12,data:p}]})}},ar=(e,t,r,a)=>{let i=e.inputs.length===1?r:_h(e.inputs,r),s=i.axes;s.length===0&&!i.noopWithEmptyAxes&&(s=e.inputs[0].dims.map((_,v)=>v));let o=G.normalizeAxes(s,e.inputs[0].dims.length),u=o,d=e.inputs[0],p=c0(u,e.inputs[0].dims.length);p.length>0&&(d=e.compute(Mt(e.inputs[0],p),{inputs:[0],outputs:[-1]})[0],u=u0(u.length,d.dims.length));let[f,m]=l0(d.dims,u),g=f;i.keepDims&&(g=d0(f,o)),e.compute(h0(t,i.cacheKey,[d],a,e.inputs[0].dataType,g,m),{inputs:[d]})},i3=(e,t)=>{ar(e,"ReduceMeanShared",t,"mean")},n3=(e,t)=>{ar(e,"ReduceL1Shared",t,"l1")},s3=(e,t)=>{ar(e,"ReduceL2Shared",t,"l2")},o3=(e,t)=>{ar(e,"ReduceLogSumExpShared",t,"logSumExp")},u3=(e,t)=>{ar(e,"ReduceMaxShared",t,"max")},l3=(e,t)=>{ar(e,"ReduceMinShared",t,"min")},d3=(e,t)=>{ar(e,"ReduceProdShared",t,"prod")},p3=(e,t)=>{ar(e,"ReduceSumShared",t,"sum")},c3=(e,t)=>{ar(e,"ReduceSumSquareShared",t,"sumSquare")},h3=(e,t)=>{ar(e,"ReduceLogSumShared",t,"logSum")}}),ir,f0,Tu,_h,nr,m0,g0,y0,_0,v0,$0,w0,b0,x0,k0,sr,f3,m3,g3,y3,_3,v3,$3,w3,b3,x3,If=te(()=>{be(),Ce(),tt(),Ae(),uA(),ir=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},f0=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Tu=(e,t,r,a,i,s,o=!1,u=!1)=>{let d=[],p=r[0].dims,f=p.length,m=G.normalizeAxes(i,f),g=!u&&m.length===0;p.forEach((w,k)=>{g||m.indexOf(k)>=0?o&&d.push(1):d.push(w)});let _=d.length,v=G.size(d);return{name:e,shaderCache:t,getShaderSource:w=>{let k=[],b=Z("_A",r[0].dataType,f),$=fe("output",s,_),S=a(b,$,m),T=S[2];for(let I=0,A=0;I<f;I++)g||m.indexOf(I)>=0?(o&&A++,T=`for(var j${I}: u32 = 0; j${I} < ${p[I]}; j${I}++) {
                  ${S[2].includes("last_index")?`let last_index = j${I};`:""}
                  ${b.indicesSet("input_indices",I,`j${I}`)}
                  ${T}
                }`):(k.push(`${b.indicesSet("input_indices",I,$.indicesGet("output_indices",A))};`),A++);return`

        ${w.registerUniform("output_size","u32").declareVariables(b,$)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${b.type.indices};
          let output_indices = ${$.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${T}
          ${S[3]}
          ${S.length===4?$.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:d,dataType:s}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},..._e(p,d)]})}},_h=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),Ge({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},nr=(e,t,r,a)=>{let i=e.inputs,s=i.length===1?r:_h(i,r);e.compute(Tu(t,{hint:s.cacheKey,inputDependencies:["rank"]},[i[0]],s.noopWithEmptyAxes&&s.axes.length===0?f0:a,s.axes,i[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},m0=(e,t)=>{ir(e.inputs),nr(e,"ReduceLogSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},g0=(e,t)=>{ir(e.inputs),nr(e,"ReduceL1",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},y0=(e,t)=>{ir(e.inputs),nr(e,"ReduceL2",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},_0=(e,t)=>{ir(e.inputs),nr(e,"ReduceLogSumExp",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},v0=(e,t)=>{ir(e.inputs),nr(e,"ReduceMax",t,(r,a,i)=>{let s=[];for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&s.push(r.indicesSet("input_indices",o,0));return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},$0=(e,t)=>{ir(e.inputs),nr(e,"ReduceMean",t,(r,a,i)=>{let s=1;for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&(s*=e.inputs[0].dims[o]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${s});`]})},w0=(e,t)=>{ir(e.inputs),nr(e,"ReduceMin",t,(r,a,i)=>{let s=[];for(let o=0;o<r.rank;o++)(i.indexOf(o)>=0||i.length===0)&&s.push(`input_indices[${o}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},b0=(e,t)=>{ir(e.inputs),nr(e,"ReduceProd",t,(r,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},x0=(e,t)=>{ir(e.inputs),nr(e,"ReduceSum",t,(r,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},k0=(e,t)=>{ir(e.inputs),nr(e,"ReduceSumSquare",t,(r,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},sr=(e,t,r)=>{if(t.length===0)return r;let a=1,i=1;for(let s=0;s<t.length;s++)t.indexOf(s)===-1?a*=e[s]:i*=e[s];return i<32&&a>1024},f3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?$0(e,t):i3(e,t)},m3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?g0(e,t):n3(e,t)},g3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?y0(e,t):s3(e,t)},y3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_0(e,t):o3(e,t)},_3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?v0(e,t):u3(e,t)},v3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?w0(e,t):l3(e,t)},$3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?b0(e,t):d3(e,t)},w3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?x0(e,t):p3(e,t)},b3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?k0(e,t):c3(e,t)},x3=(e,t)=>{sr(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?m0(e,t):h3(e,t)}}),pc,k3,S3,vh,lA=te(()=>{be(),tt(),If(),pc=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},k3=(e,t)=>{pc(e.inputs);let r=(a,i,s)=>{let o=[];for(let u=0;u<a.rank;u++)(s.indexOf(u)>=0||s.length===0)&&o.push(`input_indices[${u}] = 0;`);return[`${o.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(Tu("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},S3=(e,t)=>{pc(e.inputs);let r=(a,i,s)=>{let o=[];for(let u=0;u<a.rank;u++)(s.indexOf(u)>=0||s.length===0)&&o.push(`input_indices[${u}] = 0;`);return[`${o.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",i.setByOffset("global_idx","best_index")]};e.compute(Tu("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},vh=e=>Ge(e)}),S0,Fo,T0,C0,I0,bo,E0,T3,Ef=te(()=>{be(),Ce(),Tf(),Ae(),S0=(e,t)=>{let r=e[0],a=e[1],i=e[2],s=e[3],o=e[4],u=e[5];if(o&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let d=r.dims[0],p=r.dims[1],f=r.dims[2];if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(i.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let m=i.dims[0]/3,g=m,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");m=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let v=p;if(m!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(i.dims[0]!==m+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(o){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(o.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(o.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(o.dims[1]!==d)throw new Error('Input "past" second dimension must be batch_size');if(o.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(o.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=o.dims[3])}let k=v+w,b=-1,$=0;if(s)throw new Error("Mask not supported");if(o)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:p,pastSequenceLength:w,kvSequenceLength:v,totalSequenceLength:k,maxSequenceLength:b,inputHiddenSize:f,hiddenSize:m,vHiddenSize:_,headSize:Math.floor(m/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:$,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Fo=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,T0=(e,t,r,a,i,s,o,u)=>{let d=Ye(o?1:s),p=64,f=s/d;f<p&&(p=32);let m=Math.ceil(s/d/p),g=[{type:12,data:t},{type:12,data:r},{type:12,data:a},{type:12,data:i},{type:12,data:f},{type:12,data:m}],_=pt(e.dataType,d),v=xt(1,d),w=["type"];o&&w.push("type"),u&&w.push("type");let k=b=>{let $=fe("x",e.dataType,e.dims,d),S=[$],T=o?Z("seq_lens",o.dataType,o.dims):void 0;T&&S.push(T);let I=u?Z("total_sequence_length_input",u.dataType,u.dims):void 0;I&&S.push(I);let A=xt(e.dataType),E=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${p}>;
  var<workgroup> thread_sum: array<f32, ${p}>;
  ${b.registerUniforms(E).declareVariables(...S)}
  ${b.mainStart([p,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Fo(T,I,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${p}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${o?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${v}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${v}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(d){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${p}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${v}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${v}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(d){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${d}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${p}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${$.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${v}(x[offset + i]);
        x[offset + i] = ${$.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${o?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${$.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${p};${_};${d}`,inputDependencies:w},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:Math.ceil(s/p),y:i,z:t*r},programUniforms:g})}},C0=(e,t,r,a,i,s,o,u,d)=>{let p=o+s.kvSequenceLength,f=[s.batchSize,s.numHeads,s.sequenceLength,p],m=e>1&&a,g=s.kvNumHeads?s.kvNumHeads:s.numHeads,_=m?[s.batchSize,g,p,s.headSize]:void 0,v=s.nReps?s.nReps:1,w=s.scale===0?1/Math.sqrt(s.headSize):s.scale,k=Ye(s.headSize),b=s.headSize/k,$=12,S={x:Math.ceil(p/$),y:Math.ceil(s.sequenceLength/$),z:s.batchSize*s.numHeads},T=[{type:12,data:s.sequenceLength},{type:12,data:b},{type:12,data:p},{type:12,data:s.numHeads},{type:12,data:s.headSize},{type:1,data:w},{type:12,data:o},{type:12,data:s.kvSequenceLength},{type:12,data:v}],I=m&&a&&G.size(a.dims)>0,A=["type","type"];I&&A.push("type"),i&&A.push("type"),u&&A.push("type"),d&&A.push("type");let E=[{dims:f,dataType:t.dataType,gpuDataType:0}];m&&E.push({dims:_,dataType:t.dataType,gpuDataType:0});let B=U=>{let j=Z("q",t.dataType,t.dims,k),W=Z("key",r.dataType,r.dims,k),J=[j,W];if(I){let H=Z("past_key",a.dataType,a.dims,k);J.push(H)}i&&J.push(Z("attention_bias",i.dataType,i.dims));let P=u?Z("seq_lens",u.dataType,u.dims):void 0;P&&J.push(P);let se=d?Z("total_sequence_length_input",d.dataType,d.dims):void 0;se&&J.push(se);let ue=fe("output",t.dataType,f),F=[ue];m&&F.push(fe("present_key",t.dataType,_,k));let oe=xt(1,k),le=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${$}u;

  var<workgroup> tileQ: array<${j.type.storage}, ${$*$}>;
  var<workgroup> tileK: array<${j.type.storage}, ${$*$}>;
  ${U.registerUniforms(le).declareVariables(...J,...F)}
  ${U.mainStart([$,$,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${v===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${v===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Fo(P,se,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${I&&m?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${oe}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${I&&m?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${oe}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${ue.type.value} (sum * uniforms.alpha) + ${i?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${i!==void 0};${a!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:E,dispatchGroup:S,programUniforms:T}),getShaderSource:B}},I0=(e,t,r,a,i,s,o=void 0,u=void 0)=>{let d=s+i.kvSequenceLength,p=i.nReps?i.nReps:1,f=i.vHiddenSize*p,m=e>1&&a,g=i.kvNumHeads?i.kvNumHeads:i.numHeads,_=m?[i.batchSize,g,d,i.headSize]:void 0,v=[i.batchSize,i.sequenceLength,f],w=12,k={x:Math.ceil(i.vHeadSize/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},b=[{type:12,data:i.sequenceLength},{type:12,data:d},{type:12,data:i.vHeadSize},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:f},{type:12,data:s},{type:12,data:i.kvSequenceLength},{type:12,data:p}],$=m&&a&&G.size(a.dims)>0,S=["type","type"];$&&S.push("type"),o&&S.push("type"),u&&S.push("type");let T=[{dims:v,dataType:t.dataType,gpuDataType:0}];m&&T.push({dims:_,dataType:t.dataType,gpuDataType:0});let I=A=>{let E=Z("probs",t.dataType,t.dims),B=Z("v",r.dataType,r.dims),U=[E,B];$&&U.push(Z("past_value",a.dataType,a.dims));let j=o?Z("seq_lens",o.dataType,o.dims):void 0;o&&U.push(j);let W=u?Z("total_sequence_length_input",u.dataType,u.dims):void 0;u&&U.push(W);let J=[fe("output",t.dataType,v)];m&&J.push(fe("present_value",t.dataType,_));let P=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${E.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${E.type.value}, ${w*w}>;
  ${A.registerUniforms(P).declareVariables(...U,...J)}
  ${A.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${p===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${p===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Fo(j,W,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${$&&m?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${E.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${$&&m?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:T,dispatchGroup:k,programUniforms:b}),getShaderSource:I}},bo=(e,t,r,a,i,s,o,u,d,p,f=void 0,m=void 0)=>{let g=Math.min(e.outputCount,1+(o?1:0)+(u?1:0)),_=g>1?p.pastSequenceLength:0,v=_+p.kvSequenceLength,w=d&&G.size(d.dims)>0?d:void 0,k=[t,r];g>1&&o&&G.size(o.dims)>0&&k.push(o),w&&k.push(w),f&&k.push(f),m&&k.push(m);let b=e.compute(C0(g,t,r,o,w,p,_,f,m),{inputs:k,outputs:g>1?[-1,1]:[-1]})[0];e.compute(T0(b,p.batchSize,p.numHeads,_,p.sequenceLength,v,f,m),{inputs:f&&m?[b,f,m]:[b],outputs:[]});let $=[b,a];g>1&&u&&G.size(u.dims)>0&&$.push(u),f&&$.push(f),m&&$.push(m),e.compute(I0(g,b,a,u,p,_,f,m),{inputs:$,outputs:g>1?[0,2]:[0]})},E0=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,i=t.inputHiddenSize,s=t.headSize,o=12,u={x:Math.ceil(t.headSize/o),y:Math.ceil(t.sequenceLength/o),z:t.batchSize*t.numHeads},d=[e.inputs[0],e.inputs[1],e.inputs[2]],p=[{type:12,data:a},{type:12,data:i},{type:12,data:s},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],f=m=>{let g=fe("output_q",d[0].dataType,r),_=fe("output_k",d[0].dataType,r),v=fe("output_v",d[0].dataType,r),w=Z("input",d[0].dataType,d[0].dims),k=Z("weight",d[1].dataType,d[1].dims),b=Z("bias",d[2].dataType,d[2].dims),$=w.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${o}u;
  var<workgroup> tileInput: array<${$}, ${o*o}>;
  var<workgroup> tileWeightQ: array<${$}, ${o*o}>;
  var<workgroup> tileWeightK: array<${$}, ${o*o}>;
  var<workgroup> tileWeightV: array<${$}, ${o*o}>;
  ${m.registerUniforms(S).declareVariables(w,k,b,g,_,v)}
  ${m.mainStart([o,o,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${$}(0);
    var valueK = ${$}(0);
    var valueV = ${$}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:p}),getShaderSource:f},{inputs:d,outputs:[-1,-1,-1]})},T3=(e,t)=>{let r=S0(e.inputs,t),[a,i,s]=E0(e,r);return bo(e,a,i,s,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),z0,A0,O0,C3,dA=te(()=>{gr(),be(),Ce(),tt(),Ae(),z0=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(a,i,s)=>{let o=i.length;if(o!==a.length)throw new Error(`${s}: num dimensions != ${o}`);i.forEach((u,d)=>{if(u!==a[d])throw new Error(`${s}: dim[${d}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,a,"Invalid input scale"),r(e[2].dims,a,"Invalid input B"),r(e[3].dims,a,"Invalid input mean"),r(e[4].dims,a,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},A0=(e,t)=>{let{epsilon:r,spatial:a,format:i}=t,s=e[0].dims,o=a?Ye(s[s.length-1]):1,u=i==="NHWC"&&s.length>1?o:1,d=G.size(s)/o,p=a,f=p?s.length:s,m=Z("x",e[0].dataType,e[0].dims,o),g=Z("scale",e[1].dataType,e[1].dims,u),_=Z("bias",e[2].dataType,e[2].dims,u),v=Z("inputMean",e[3].dataType,e[3].dims,u),w=Z("inputVar",e[4].dataType,e[4].dims,u),k=fe("y",e[0].dataType,f,o),b=()=>{let S="";if(a)S=`let cOffset = ${s.length===1?"0u":i==="NHWC"?`outputIndices[${s.length-1}] / ${o}`:"outputIndices[1]"};`;else if(i==="NCHW")S=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let T=1;T<g.rank;T++)S+=`cIndices[${T}] = outputIndices[${T}];`;S+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return S},$=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(m,g,_,v,w,k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${o}`)};
    ${b()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${v.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${o}`,inputDependencies:p?["rank","type","type","type","type"]:void 0},getShaderSource:$,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p?[{type:12,data:d},..._e(s)]:[{type:12,data:d}]})}},O0=e=>Ge(e),C3=(e,t)=>{let{inputs:r,outputCount:a}=e,i=O0({...t,outputCount:a});if(Ze.webgpu.validateInputContent&&z0(r,i),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(A0(r,i))}}),R0,B0,I3,pA=te(()=>{Ce(),Ae(),R0=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},B0=e=>{let t=e[0].dims,r=e[0].dims[2],a=G.size(t)/4,i=e[0].dataType,s=Z("input",i,t,4),o=Z("bias",i,[r],4),u=Z("residual",i,t,4),d=fe("output",i,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(s,o,u,d)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${s.getByOffset("global_idx")}
      + ${o.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${d.setByOffset("global_idx","value")}
  }`}},I3=e=>{R0(e.inputs),e.compute(B0(e.inputs))}}),N0,We,E3,z3,A3,O3,R3,B3,N3,M3,D3,M0,P3,U3,W3,V3,Xs,q3,nu,j3,L3,G3,F3,H3,K3,Z3,Q3,X3,J3,Y3,ek,tk,rk,ak,ik,cc,nk,$h,wh,sk,ok,uk,D0,P0,lk,zf=te(()=>{be(),Ce(),tt(),Ae(),N0=(e,t,r,a,i,s,o)=>{let u=Math.ceil(t/4),d="";typeof i=="string"?d=`${i}(a)`:d=i("a");let p=Z("inputData",r,[u],4),f=fe("outputData",a,[u],4),m=[{name:"vec_size",type:"u32"}];return o&&m.push(...o),`
      ${e.registerUniforms(m).declareVariables(p,f)}

  ${s??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${p.getByOffset("global_idx")};
    ${f.setByOffset("global_idx",d)}
  }`},We=(e,t,r,a,i,s=e.dataType,o,u)=>{let d=[{type:12,data:Math.ceil(G.size(e.dims)/4)}];return o&&d.push(...o),{name:t,shaderCache:{hint:i,inputDependencies:["type"]},getShaderSource:p=>N0(p,G.size(e.dims),e.dataType,s,r,a,u),getRunData:p=>({outputs:[{dims:e.dims,dataType:s}],dispatchGroup:{x:Math.ceil(G.size(p[0].dims)/64/4)},programUniforms:d})}},E3=e=>{e.compute(We(e.inputs[0],"Abs","abs"))},z3=e=>{e.compute(We(e.inputs[0],"Acos","acos"))},A3=e=>{e.compute(We(e.inputs[0],"Acosh","acosh"))},O3=e=>{e.compute(We(e.inputs[0],"Asin","asin"))},R3=e=>{e.compute(We(e.inputs[0],"Asinh","asinh"))},B3=e=>{e.compute(We(e.inputs[0],"Atan","atan"))},N3=e=>{e.compute(We(e.inputs[0],"Atanh","atanh"))},M3=e=>Ge(e),D3=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(We(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},M0=e=>{let t,r,a=e.length>=2&&e[1].data!==0,i=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,r=i?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,r=i?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Ge({min:t,max:r})},P3=(e,t)=>{let r=t||M0(e.inputs),a=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"Clip",i=>`clamp(${i}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},U3=e=>{e.compute(We(e.inputs[0],"Ceil","ceil"))},W3=e=>{e.compute(We(e.inputs[0],"Cos","cos"))},V3=e=>{e.compute(We(e.inputs[0],"Cosh","cosh"))},Xs=e=>Ge(e),q3=(e,t)=>{let r=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},nu=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,j3=e=>{let t=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,nu(t)))},L3=e=>{e.compute(We(e.inputs[0],"Exp","exp"))},G3=e=>{e.compute(We(e.inputs[0],"Floor","floor"))},F3=e=>{let t=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,nu(t)))},H3=(e,t)=>{let r=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},K3=e=>{e.compute(We(e.inputs[0],"Not",t=>`!${t}`))},Z3=e=>{e.compute(We(e.inputs[0],"Neg",t=>`-${t}`))},Q3=e=>{e.compute(We(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},X3=e=>{let t=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},J3=e=>{e.compute(We(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Y3=e=>Ge(e),ek=(e,t)=>{let r=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"HardSigmoid",a=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${a} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},tk=e=>{e.compute(We(e.inputs[0],"Sin","sin"))},rk=e=>{e.compute(We(e.inputs[0],"Sinh","sinh"))},ak=e=>{e.compute(We(e.inputs[0],"Sqrt","sqrt"))},ik=e=>{e.compute(We(e.inputs[0],"Tan","tan"))},cc=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,nk=e=>{e.compute(We(e.inputs[0],"Tanh",cc))},$h=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${cc("v")};
}
`,wh=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,sk=e=>{let t=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"FastGelu",wh,$h(t),void 0,e.inputs[0].dataType))},ok=(e,t)=>{let r=xt(e.inputs[0].dataType);return e.compute(We(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${r}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},uk=e=>{e.compute(We(e.inputs[0],"Log","log"))},D0=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,P0=e=>`quick_gelu_impl(${e})`,lk=(e,t)=>{let r=xt(e.inputs[0].dataType);e.compute(We(e.inputs[0],"QuickGelu",P0,D0(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),U0,W0,dk,cA=te(()=>{Ce(),Ae(),zf(),U0=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},W0=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=Z("input",e[0].dataType,e[0].dims,4),a=Z("bias",e[0].dataType,[e[0].dims[2]],4),i=fe("output",e[0].dataType,t,4),s=G.size(t)/4,o=pt(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,a,i)}

  ${nu(o)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${i.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},dk=e=>{U0(e.inputs),e.compute(W0(e.inputs))}}),V0,q0,or,pk,ck,hk,fk,mk,gk,yk,_k,vk,$k,hA=te(()=>{be(),Ce(),Ae(),V0=(e,t,r,a,i,s,o,u,d,p,f,m)=>{let g,_;typeof u=="string"?g=_=($,S)=>`${u}((${$}),(${S}))`:typeof u=="function"?g=_=u:(g=u.scalar,_=u.vector);let v=fe("outputData",f,a.length,4),w=Z("aData",d,t.length,4),k=Z("bData",p,r.length,4),b;if(i)if(s){let $=G.size(t)===1,S=G.size(r)===1,T=t.length>0&&t[t.length-1]%4===0,I=r.length>0&&r[r.length-1]%4===0;$||S?b=v.setByOffset("global_idx",_($?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),S?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):b=`
            let outputIndices = ${v.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",v)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",v)};
            ${v.setByOffset("global_idx",_(o||T?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,o||I?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else b=v.setByOffset("global_idx",_(w.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let $=(S,T,I="")=>{let A=`aData[indexA${T}][componentA${T}]`,E=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${v.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${w.broadcastedIndicesToOffset(`outputIndices${T}`,v)};
            let offsetB${T} = ${k.broadcastedIndicesToOffset(`outputIndices${T}`,v)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${S}[${T}] = ${I}(${g(A,E)});
          `};f===9?b=`
            var data = vec4<u32>(0);
            ${$("data",0,"u32")}
            ${$("data",1,"u32")}
            ${$("data",2,"u32")}
            ${$("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:b=`
            ${$("outputData[global_idx]",0)}
            ${$("outputData[global_idx]",1)}
            ${$("outputData[global_idx]",2)}
            ${$("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,k,v)}

        ${m??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${b}
      }`},q0=(e,t,r,a,i,s,o=r.dataType)=>{let u=r.dims.map(w=>Number(w)??1),d=a.dims.map(w=>Number(w)??1),p=!G.areEqual(u,d),f=u,m=G.size(u),g=!1,_=!1,v=[p];if(p){let w=di.calcShape(u,d,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");f=w.slice(),m=G.size(f);let k=G.size(u)===1,b=G.size(d)===1,$=u.length>0&&u[u.length-1]%4===0,S=d.length>0&&d[d.length-1]%4===0;v.push(k),v.push(b),v.push($),v.push(S);let T=1;for(let I=1;I<f.length;I++){let A=u[u.length-I],E=d[d.length-I];if(A===E)T*=A;else break}T%4===0?(_=!0,g=!0):(k||b||$||S)&&(g=!0)}else g=!0;return v.push(g),{name:e,shaderCache:{hint:t+v.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>V0(w,u,d,f,g,p,_,i,r.dataType,a.dataType,o,s),getRunData:()=>({outputs:[{dims:f,dataType:o}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(G.size(f)/4)},..._e(u,d,f)]})}},or=(e,t,r,a,i,s)=>{e.compute(q0(t,i??"",e.inputs[0],e.inputs[1],r,a,s))},pk=e=>{or(e,"Add",(t,r)=>`${t}+${r}`)},ck=e=>{or(e,"Div",(t,r)=>`${t}/${r}`)},hk=e=>{or(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},fk=e=>{or(e,"Mul",(t,r)=>`${t}*${r}`)},mk=e=>{let t=Z("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;or(e,"Pow",{scalar:(r,a)=>`pow_custom(${r},${a})`,vector:(r,a)=>`pow_vector_custom(${r},${a})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},gk=e=>{or(e,"Sub",(t,r)=>`${t}-${r}`)},yk=e=>{or(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},_k=e=>{or(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},vk=e=>{or(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},$k=e=>{or(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),j0,L0,G0,F0,wk,bk,fA=te(()=>{be(),Ce(),tt(),Ae(),j0=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,a=e[r],i=a.dataType,s=a.dims.length;e.forEach((o,u)=>{if(u!==r){if(o.dataType!==i)throw new Error("input tensors should be one type");if(o.dims.length!==s)throw new Error("input tensors should have the same shape");o.dims.forEach((d,p)=>{if(p!==t&&d!==a.dims[p])throw new Error("non concat dimensions must match")})}})},L0=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,G0=(e,t)=>{let r=e.length,a=[];for(let i=0;i<r;++i){let s=t.setByOffset("global_idx",e[i].getByIndices("indices"));r===1?a.push(s):i===0?a.push(`if (inputIndex == ${i}u) { ${s} }`):i===r-1?a.push(`else { ${s} }`):a.push(`else if (inputIndex == ${i}) { ${s} }`)}return a.join(`
`)},F0=(e,t,r,a)=>{let i=G.size(r),s=new Array(e.length),o=new Array(e.length),u=0,d=[],p=[],f=[{type:12,data:i}];for(let w=0;w<e.length;++w)u+=e[w].dims[t],s[w]=u,p.push(e[w].dims.length),o[w]=Z(`input${w}`,a,p[w]),d.push("rank"),f.push({type:12,data:s[w]});for(let w=0;w<e.length;++w)f.push(..._e(e[w].dims));f.push(..._e(r));let m=fe("output",a,r.length),g=m.indicesGet("indices",t),_=Array.from(Array(s.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),v=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)w.registerUniform(`sizeInConcatAxis${k}`,"u32");return w.declareVariables(...o,m)})()}

  ${L0(s.length,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${G0(o,m)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:r,dataType:a}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:f}),getShaderSource:v}},wk=(e,t)=>{let r=e.inputs,a=r[0].dims,i=G.normalizeAxis(t.axis,a.length);j0(r,i);let s=a.slice();s[i]=r.reduce((u,d)=>u+(d.dims.length>i?d.dims[i]:0),0);let o=r.filter(u=>G.size(u.dims)>0);e.compute(F0(o,i,s,r[0].dataType),{inputs:o})},bk=e=>Ge({axis:e.axis})}),ja,La,Ga,Af,Za=te(()=>{be(),Ce(),ja=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},La=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Ga=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Af=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,a]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:a}}else if(t==="Clip"){let[r,a]=e?.activation_params||[Jx,Yx];return{activation:t,clipMax:a,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),ht,xk,Of=te(()=>{ht=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},xk=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),kk,mA=te(()=>{kk=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),eo,Rf,Bf=te(()=>{be(),Ce(),Ae(),Za(),eo=(e,t,r,a,i)=>{let s=a-r;return`
      ${Array.from({length:r}).map((o,u)=>`
      if (${ge(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,ge(i,u+s,a))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Rf=(e,t,r,a,i=!1,s)=>{let o=e[0].dims,u=e[1].dims,d=o[o.length-2],p=u[u.length-1],f=o[o.length-1],m=Ye(p),g=Ye(f),_=Ye(d),v=G.size(r)/m/_,w=e.length>2,k=a?a.slice(0,-2):r.slice(0,-2),b=[G.size(k),d,p],$=[{type:12,data:v},{type:12,data:d},{type:12,data:p},{type:12,data:f}];La(t,$),$.push(..._e(k,o,u)),w&&$.push(..._e(e[2].dims)),$.push(..._e(b));let S=T=>{let I=Cf("batch_dims",e[0].dataType,k.length),A=Z("a",e[0].dataType,o.length,g),E=Z("b",e[1].dataType,u.length,m),B=fe("output",e[0].dataType,b.length,m),U=pt(B.type.tensor),j=ja(t,B.type.value,U),W=[A,E],J="";if(w){let ue=i?m:1;W.push(Z("bias",e[2].dataType,e[2].dims.length,ue)),J=`${i?`value += bias[col / ${ue}];`:`value += ${B.type.value}(bias[row + i]);`}`}let P=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Ga(t,P);let se=()=>{let ue=`var a_data: ${A.type.value};`;for(let F=0;F<g;F++)ue+=`
              let b_data${F} = b[(b_offset + (k + ${F}) * uniforms.N + col) / ${m}];`;for(let F=0;F<_;F++){ue+=`a_data = a[(a_offset + (row + ${F}) * uniforms.K + k) / ${g}];`;for(let oe=0;oe<g;oe++)ue+=`
            values[${F}] = fma(${E.type.value}(a_data${g===1?"":`[${oe}]`}), b_data${oe}, values[${F}]);
`}return ue};return`
  ${T.registerUniforms(P).registerInternalVariables(I).declareVariables(...W,B)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${I.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${eo("a_indices",A,A.rank-2,I.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${E.type.indices};
    ${eo("b_indices",E,E.rank-2,I.rank,"batch_indices")}
    ${E.indicesSet("b_indices",E.rank-2,0)}
    ${E.indicesSet("b_indices",E.rank-1,0)}
    let b_offset = ${E.indicesToOffset("b_indices")};
    var values: array<${B.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${se()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${J}
      ${j}
      let cur_indices = ${B.type.indices}(batch, row + i, col);
      let offset = ${B.indicesToOffset("cur_indices")};
      ${B.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${g};${_};${i}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:$}),getShaderSource:S}}}),H0,K0,bh,hc,Z0,xh,Q0,Cu,Nf=te(()=>{be(),Ce(),Ae(),Za(),Bf(),Of(),H0=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,K0=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,bh=(e,t,r="f32",a,i=!1,s=32,o=!1,u=32)=>{let d=t[1]*e[1],p=t[0]*e[0],f=i?d:s,m=i?s:d,g=f/t[0],_=s/t[1];if(!((i&&g===4&&e[1]===4||!i&&(g===3||g===4))&&f%t[0]===0&&s%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${i} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${f/g}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${p/e[0]}>, ${s}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${o?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${d};

  let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${H0(i,a)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${a?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${K0(i,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},hc=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Z0=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",xh=(e,t,r="f32",a,i=!1,s=32,o=!1,u=32,d=!1)=>{let p=e[1]*t[1],f=e[0]*t[0],m=i?p:s,g=i?s:p;if(!(g%t[1]===0&&m%t[0]===0&&s%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}, tileInner ${s} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],v=m/t[0],w=s/t[1],k=d?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${p};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          ${hc(i,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${a?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${i?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${p};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${v};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${v}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${hc(i,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${a?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Z0(i)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${m}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${f}>, ${s}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${o?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${o?`${Math.ceil(u/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${o?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},Q0=(e,t,r,a,i=!1)=>{let[s,o,u,d]=a,p=pt(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ht(e,p)} {
      var value = ${ht(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${o.type.indices};
        ${eo("aIndices",o,o.rank-2,s.rank,"batchIndices")}
        ${o.indicesSet("aIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("aIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${ht(e,p)} {
      var value = ${ht(e,p)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${eo("bIndices",u,u.rank-2,s.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${ht(e,p)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${i?"bias[colIn]":`${ht(e,p)}(bias[row])`};`:""}
        ${r}
        ${d.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Cu=(e,t,r,a,i=!1,s)=>{let o=e[0].dims,u=e[1].dims,d=o.slice(0,-2),p=u.slice(0,-2),f=a?a.slice(0,-2):r.slice(0,-2),m=G.size(f),g=o[o.length-2],_=o[o.length-1],v=u[u.length-1],w=_%4===0&&v%4===0,k=g<=8?[4,1,1]:[4,4,1],b=[8,8,1],$=[Math.ceil(v/b[0]/k[0]),Math.ceil(g/b[1]/k[1]),Math.ceil(m/b[2]/k[2])],S=w?4:1,T=[...d,g,_/S],I=T.length,A=[...p,_,v/S],E=A.length,B=[m,g,v/S],U=[{type:6,data:g},{type:6,data:v},{type:6,data:_}];La(t,U),U.push(..._e(f,T,A));let j=["rank","rank"],W=e.length>2;W&&(U.push(..._e(e[2].dims)),j.push("rank")),U.push(..._e(B));let J=P=>{let se=f.length,ue=Cf("batchDims",e[0].dataType,se,1),F=pt(e[0].dataType),oe=Z("a",e[0].dataType,I,S),le=Z("b",e[1].dataType,E,S),H=fe("result",e[0].dataType,B.length,S),de=[oe,le];if(W){let Ie=i?S:1;de.push(Z("bias",e[2].dataType,e[2].dims.length,Ie))}let M=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Ga(t,M);let V=pt(H.type.tensor),R=ja(t,H.type.value,V),X=Q0(S,W,R,[ue,oe,le,H],i);return`
  ${P.registerUniforms(M).registerInternalVariables(ue).declareVariables(...de,H)}
  ${X}
  ${w?bh(k,b,F,ue):xh(k,b,F,ue)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${w};${i}`,inputDependencies:j},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:$[0],y:$[1],z:$[2]},programUniforms:U}),getShaderSource:J}}}),X0,Sk,gA=te(()=>{be(),Ur(),Ae(),Za(),Of(),mA(),Nf(),X0=(e,t,r,a,i=!1,s,o=4,u=4,d=4,p="f32")=>{let f=U=>{switch(U){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${p}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},m=U=>{switch(U){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${U} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,v=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",b=e?"col":"row",$=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${b} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${b} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${b} % inChannels;
    var resData = ${ht(o,p)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${v} && xCol >= 0 && xCol < ${w}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(o)}
    }
    return resData;`,S=e?t&&a?`
    let col = colIn * ${o};
    ${$}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${$}
    }
    return ${ht(o,p)}(0.0);`:a&&r?`
    let col = colIn * ${o};
    ${$}`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${$}
    }
    return ${ht(o,p)}(0.0);`,T=e?a&&r?m(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(u)}
    }
    return ${ht(u,p)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(u)}
    }
    return ${ht(u,p)}(0.0);`,I=ht(d,p),A=ht(e?o:u,p),E=ht(e?u:o,p),B=ja(s,I,p);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?S:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?T:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${I}) {
      let col = colIn * ${d};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${xk(i)}
      ${B}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Sk=(e,t,r,a,i,s,o,u,d)=>{let p=t.format==="NHWC",f=p?e[0].dims[3]:e[0].dims[1],m=r[0],g=p?r[2]:r[3],_=p?r[1]:r[2],v=p?r[3]:r[1],w=p&&(f%4===0||f%3===0)&&v%4===0,k=p?v:g*_,b=p?g*_:v,$=[8,8,1],S=a<=8?[4,1,1]:[4,4,1],T=[Math.ceil(k/$[0]/S[0]),Math.ceil(b/$[1]/S[1]),Math.ceil(m/$[2]/S[2])];Pe("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let I=w?p&&f%4!==0?3:4:1,A=$[1]*S[1],E=$[0]*S[0],B=Math.max($[0]*I,$[1]),U=a%A===0,j=i%E===0,W=s%B===0,J=w?[I,4,4]:[1,1,1],P=[{type:6,data:a},{type:6,data:i},{type:6,data:s},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];La(t,P),P.push(..._e(e[0].dims,e[1].dims));let se=["rank","rank"];o&&(P.push(..._e(e[2].dims)),se.push("rank")),P.push(..._e(r));let ue=F=>{let oe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Ga(t,oe);let le=w?4:1,H=pt(e[0].dataType),de=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${H}>`:H}) {
        result[flatIndex] = ${w?`vec4<${H}>`:H}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${H}>`:H}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,M=Z("x",e[0].dataType,e[0].dims.length,I===3?1:I),V=Z("w",e[1].dataType,e[1].dims.length,le),R=[M,V],X=fe("result",e[0].dataType,r.length,le);if(o){let Ie=Z("bias",e[2].dataType,e[2].dims.length,le);R.push(Ie),de+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${H}>`:H} {
          return bias[coords.${p?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${kk("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${F.registerUniforms(oe).declareVariables(...R,X)}
        ${de}
        ${X0(p,U,j,W,o,t,J[0],J[1],J[2],H)}
        ${w?bh(S,$,H,void 0,!p,B):xh(S,$,H,void 0,!p,B,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${I};${w};${U};${j};${W};${A};${E};${B}`,inputDependencies:se},getRunData:()=>({outputs:[{dims:d?d(r):r,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:P}),getShaderSource:ue}}}),J0,fc,Ms,Y0,mc,ev,Tk,Ck,yA=te(()=>{be(),Ur(),Ce(),Ae(),Za(),Of(),J0=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},fc=e=>typeof e=="number"?[e,e,e]:e,Ms=(e,t)=>t<=1?e:e+(e-1)*(t-1),Y0=(e,t,r,a=1)=>{let i=Ms(t,a);return Math.floor((e[0]*(r-1)-r+i)/2)},mc=(e,t,r,a,i)=>{i==null&&(i=Y0(e,t[0],a[0]));let s=[0,0,0,r];for(let o=0;o<3;o++)e[o]+2*i>=t[o]&&(s[o]=Math.trunc((e[o]-t[o]+2*i)/a[o]+1));return s},ev=(e,t,r,a,i,s,o,u,d,p)=>{let f,m,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){f={top:e,bottom:e,left:e,right:e,front:e,back:e};let v=mc([t,r,a,1],[u,d,p],1,[i,s,o],e);m=v[0],g=v[1],_=v[2]}else if(Array.isArray(e)){if(!e.every((w,k,b)=>w===b[0]))throw Error(`Unsupported padding parameter: ${e}`);f={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let v=mc([t,r,a,1],[u,d,p],1,[i,s,o],e[0]);m=v[0],g=v[1],_=v[2]}else if(e==="SAME_UPPER"){m=Math.ceil(t/i),g=Math.ceil(r/s),_=Math.ceil(a/o);let v=(m-1)*i+u-t,w=(g-1)*s+d-r,k=(_-1)*o+p-a,b=Math.floor(v/2),$=v-b,S=Math.floor(w/2),T=w-S,I=Math.floor(k/2),A=k-I;f={top:S,bottom:T,left:I,right:A,front:b,back:$}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:f,outDepth:m,outHeight:g,outWidth:_}},Tk=(e,t,r,a,i,s=!1,o="channelsLast")=>{let u,d,p,f,m;if(o==="channelsLast")[u,d,p,f,m]=e;else if(o==="channelsFirst")[u,m,d,p,f]=e;else throw new Error(`Unknown dataFormat ${o}`);let[g,,_,v,w]=t,[k,b,$]=fc(r),[S,T,I]=fc(a),A=Ms(_,S),E=Ms(v,T),B=Ms(w,I),{padInfo:U,outDepth:j,outHeight:W,outWidth:J}=ev(i,d,p,f,k,b,$,A,E,B),P=s?g*m:g,se=[0,0,0,0,0];return o==="channelsFirst"?se=[u,P,j,W,J]:o==="channelsLast"&&(se=[u,j,W,J,P]),{batchSize:u,dataFormat:o,inDepth:d,inHeight:p,inWidth:f,inChannels:m,outDepth:j,outHeight:W,outWidth:J,outChannels:P,padInfo:U,strideDepth:k,strideHeight:b,strideWidth:$,filterDepth:_,filterHeight:v,filterWidth:w,effectiveFilterDepth:A,effectiveFilterHeight:E,effectiveFilterWidth:B,dilationDepth:S,dilationHeight:T,dilationWidth:I,inShape:e,outShape:se,filterShape:t}},Ck=(e,t,r,a,i,s)=>{let o=s==="channelsLast";o?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],d={x:r.map((k,b)=>b)},p=[Math.ceil(J0(d.x.map(k=>r[k]))/u[0]),1,1];Pe("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let f=1,m=G.size(r),g=[{type:12,data:m},{type:12,data:a},{type:12,data:i},{type:12,data:t.strides},{type:12,data:t.dilations}];La(t,g),g.push(..._e(e[0].dims,e[1].dims));let _=["rank","rank"],v=e.length===3;v&&(g.push(..._e(e[2].dims)),_.push("rank")),g.push(..._e(r));let w=k=>{let b=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:i.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Ga(t,b);let $=1,S=pt(e[0].dataType),T=Z("x",e[0].dataType,e[0].dims.length,f),I=Z("W",e[1].dataType,e[1].dims.length,$),A=[T,I],E=fe("result",e[0].dataType,r.length,$),B="";if(v){let W=Z("bias",e[2].dataType,e[2].dims.length,$);A.push(W),B+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${S} {
          return bias[${o?ge("coords",4,5):ge("coords",1,5)}];
        }`}let U=ht(f,S),j=ja(t,U,S);return`
            ${B}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
          ${k.registerUniforms(b).declareVariables(...A,E)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${E.offsetToIndices("global_idx")};
              let batch = ${ge("coords",0,T.rank)};
              let d2 = ${o?ge("coords",T.rank-1,T.rank):ge("coords",1,T.rank)};
              let xFRCCorner = vec3<u32>(${o?ge("coords",1,T.rank):ge("coords",2,T.rank)},
              ${o?ge("coords",2,T.rank):ge("coords",3,T.rank)},
              ${o?ge("coords",3,T.rank):ge("coords",4,T.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${o?ge("uniforms.x_shape",1,T.rank):ge("uniforms.x_shape",2,T.rank)};
              let xShapeZ = ${o?ge("uniforms.x_shape",2,T.rank):ge("uniforms.x_shape",3,T.rank)};
              let xShapeW = ${o?ge("uniforms.x_shape",3,T.rank):ge("uniforms.x_shape",4,T.rank)};
              let xShapeU = ${o?ge("uniforms.x_shape",4,T.rank):ge("uniforms.x_shape",1,T.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${o?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${o?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${o?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${o?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${v?"value = value + getBiasByOutputCoords(coords)":""};
              ${j}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${o};${f};${v}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:g}),getShaderSource:w}}}),Ik,Ek,_A=te(()=>{be(),Ce(),Ae(),Za(),Ik=(e,t,r,a)=>{let i=e.length>2,s=i?"value += b[output_channel];":"",o=e[0].dims,u=e[1].dims,d=t.format==="NHWC",p=d?r[3]:r[1],f=p/t.group,m=d&&f>=4?Ye(p):1,g=G.size(r)/m,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:f}];La(t,_),_.push(..._e(o,[u[0],u[1],u[2],u[3]/m]));let v=i?["rank","rank","rank"]:["rank","rank"];_.push(..._e([r[0],r[1],r[2],r[3]/m]));let w=k=>{let b=fe("output",e[0].dataType,r.length,m),$=pt(b.type.tensor),S=ja(t,b.type.value,$),T=Z("x",e[0].dataType,o.length),I=Z("w",e[1].dataType,u.length,m),A=[T,I];i&&A.push(Z("b",e[2].dataType,e[2].dims,m));let E=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Ga(t,E);let B=d?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${I.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${I.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(E).declareVariables(...A,b)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${b.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${d?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${d?1:2}], outputIndices[${d?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${d?2:1}];

    var value: ${b.type.value} = ${b.type.value}(0);
    ${B}
    ${s}
    ${S}
    ${b.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${m}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},Ek=(e,t,r,a)=>{let i=e.length>2,s=Ye(r[3]),o=Ye(r[2]),u=G.size(r)/s/o,d=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/s],p=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/s],f=[r[0],r[1],r[2],r[3]/s],m=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];La(t,m),m.push(..._e(d,p,f));let g=(o-1)*t.strides[1]+p[1],_=v=>{let w=fe("output",e[0].dataType,f.length,s),k=pt(w.type.tensor),b=ja(t,w.type.value,k),$=Z("x",e[0].dataType,d.length,s),S=Z("w",e[1].dataType,p.length,s),T=[$,S];i&&T.push(Z("b",e[2].dataType,e[2].dims,s));let I=i?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Ga(t,A),`
  ${v.registerUniforms(A).declareVariables(...T,w)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${o}u;
    let col = (index1 % width1) * ${o}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${$.type.value}, ${g}>;
    var values: array<${w.type.value}, ${o}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${p[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${$.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${$.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${p[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${o}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${o}u; i++) {
      var value = values[i];
      ${I}
      ${b}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${s};${o};${g};${p[0]};${p[1]}`,inputDependencies:i?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:_}}}),tv,Ho,rv,Ko,kh,gc,av,iv,Sh,vA=te(()=>{Ce(),gA(),yA(),Nf(),_A(),Za(),Bf(),Xr(),tv=(e,t,r,a,i,s)=>{let o=e[0],u=e.slice(s?1:2,s?3:4),d=u.length,p=t[0],f=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),m=u.map((g,_)=>g+a[_]+a[_+d]).map((g,_)=>Math.floor((g-f[_]+i[_])/i[_]));return m.splice(0,0,o),m.splice(s?3:1,0,p),m},Ho=[2,3,1,0],rv=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ko=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let s=2;s<t[1].dims.length;++s)r[s-2]===0&&(r[s-2]=t[1].dims[s]);let a=e.pads.slice();Su.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,a,e.format==="NHWC",e.autoPad);let i=Object.assign({},e);return Object.assign(i,{kernelShape:r,pads:a}),i},kh=e=>{let t=Af(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],i=e.dilations,s=e.group,o=e.kernel_shape,u=e.pads,d=e.strides,p=e.w_is_const();return{autoPad:a,format:r,dilations:i,group:s,kernelShape:o,pads:u,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},gc=(e,t,r,a)=>{let i=r.format==="NHWC",s=tv(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,i);if(r.group!==1){let A=[t[0]];if(i){let E=e.kernelCustomData.wT??e.compute(Mt(t[1],Ho),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=E),A.push(E)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&i&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Ek(A,r,s,a),{inputs:A}):e.compute(Ik(A,r,s,a),{inputs:A});return}let o=t.length===3,u=t[0].dims[i?1:2],d=t[0].dims[i?2:3],p=t[0].dims[i?3:1],f=t[1].dims[2],m=t[1].dims[3],g=s[i?1:2],_=s[i?2:3],v=s[i?3:1],w=i&&f===u&&m===d&&r.pads[0]===0&&r.pads[1]===0;if(w||f===1&&m===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let A=s[0],E,B,U,j=[];if(i){let P=e.kernelCustomData.wT??e.compute(Mt(t[1],Ho),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=P),w){let se=u*d*p;E=t[0].reshape([1,A,se]),B=P.reshape([1,se,v]),U=[1,A,v]}else E=t[0].reshape([A,u*d,p]),B=P.reshape([1,p,v]),U=[A,g*_,v];j.push(E),j.push(B)}else E=t[0].reshape([A,p,u*d]),B=t[1].reshape([1,v,p]),U=[A,v,g*_],j.push(B),j.push(E);o&&j.push(t[2]);let W=U[2],J=j[0].dims[j[0].dims.length-1];W<8&&J<8?e.compute(Rf(j,r,s,U,i,a),{inputs:j}):e.compute(Cu(j,r,s,U,i,a),{inputs:j});return}let k=!0,b=e.kernelCustomData.wT??e.compute(Mt(t[1],Ho),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=b);let $=[t[0],b];o&&$.push(t[2]);let S=i?g*_:v,T=i?v:g*_,I=f*m*p;e.compute(Sk($,r,s,S,T,I,o,k,a),{inputs:$})},av=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let i=[0,t.pads[0],0,t.pads[1]],s=[1].concat(t.strides),o=[1].concat(t.dilations),u=[1].concat(t.kernelShape),d=Ko({...t,pads:i,strides:s,dilations:o,kernelShape:u},a);gc(e,a,d,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},iv=(e,t,r)=>{let a=r.format==="NHWC"?"channelsLast":"channelsFirst",i=Ko(r,t),s=r.autoPad==="NOTSET"?r.pads:r.autoPad,o=Tk(t[0].dims,t[1].dims,r.strides,r.dilations,s,!1,a);e.compute(Ck(t,i,o.outShape,[o.filterDepth,o.filterHeight,o.filterWidth],[o.padInfo.front,o.padInfo.top,o.padInfo.left],a))},Sh=(e,t)=>{if(rv(e.inputs,t),e.inputs[0].dims.length===3)av(e,t);else if(e.inputs[0].dims.length===5)iv(e,e.inputs,t);else{let r=Ko(t,e.inputs);gc(e,e.inputs,r)}}}),zk,$A=te(()=>{be(),Ur(),Ce(),Ae(),zk=(e,t,r)=>{let a=e.length>2,i=t.outputShape,s=t.format==="NHWC",o=t.group,u=e[1].dims,d=u[2]/o,p=u[3],f=s?Ye(d):1,m=s?Ye(p):1,g=s?p===1?f:m:1,_=G.size(i)/m,v=[Math.ceil(_/64),1,1];Pe("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let w=["rank","rank"],k=[t.strides[0],t.strides[1]],b=[t.kernelShape[s?1:2],t.kernelShape[s?2:3]],$=[t.dilations[0],t.dilations[1]],S=[b[0]+(t.dilations[0]<=1?0:(t.kernelShape[s?1:2]-1)*(t.dilations[0]-1)),b[1]+(t.dilations[1]<=1?0:(t.kernelShape[s?2:3]-1)*(t.dilations[1]-1))],T=[S[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),S[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],I=[{type:12,data:_},{type:12,data:k},{type:12,data:b},{type:12,data:$},{type:12,data:S},{type:6,data:T},{type:12,data:d},{type:12,data:p},..._e(e[0].dims,e[1].dims)];a&&(I.push(..._e(e[2].dims)),w.push("rank")),I.push(..._e(i));let A=E=>{let B=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:k.length},{name:"filter_dims",type:"u32",length:b.length},{name:"dilations",type:"u32",length:b.length},{name:"effective_filter_dims",type:"u32",length:S.length},{name:"pads",type:"i32",length:T.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],U=pt(e[0].dataType),j=s?1:2,W=s?2:3,J=s?3:1,P=Z("W",e[1].dataType,e[1].dims.length,g),se=Z("Dy",e[0].dataType,e[0].dims.length,f),ue=[se,P];a&&ue.push(Z("bias",e[2].dataType,[i[J]].length,m));let F=fe("result",e[0].dataType,i.length,m),oe=()=>{let H="";if(f===1)H+=`
        let w_offset = ${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
        let wValue = ${P.getByOffset(`w_offset / ${g}`)};
        dotProd = dotProd + xValue * wValue;`;else if(p===1)H+=`
          let wValue = ${P.getByOffset(`${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)} / ${g}`)};
          dotProd = dotProd + dot(xValue, wValue);`;else for(let de=0;de<f;de++)H+=`
            let wValue${de} = ${P.getByOffset(`${P.indicesToOffset(`${P.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${de}, wOutChannel)`)} / ${g}`)};
            dotProd = dotProd + xValue[${de}] * wValue${de};`;return H},le=`
            let outputIndices = ${F.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${F.indicesGet("outputIndices",0)};
            let d1 = ${F.indicesGet("outputIndices",J)};
            let r = ${F.indicesGet("outputIndices",j)};
            let c = ${F.indicesGet("outputIndices",W)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${F.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${U}(dyRCorner) + ${U}(wR)) / ${U}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${U}(uniforms.Dy_shape[${j}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }

              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${U}(dyCCorner) + ${U}(wC)) / ${U}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${U}(uniforms.Dy_shape[${W}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + ${f}) {
                  let xValue = ${s?se.getByOffset(`${se.indicesToOffset(`${se.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${f}`):se.get("batch","inputChannel","idyR","idyC")};
                  ${oe()}
                  inputChannel = inputChannel + ${f};
                }
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${m}]`:""};
            ${F.setByOffset("global_idx","value")};
          `;return`
    ${E.registerUniforms(B).declareVariables(...ue,F)}
      ${E.mainStart()}
      ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${le}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${f}${g}${m}${p===1}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(i):i,dataType:e[0].dataType}],programUniforms:I}),getShaderSource:A}}}),nv,sv,ov,yc,Ak,uv,_c,lv,Ok,wA=te(()=>{$A(),Za(),Xr(),nv=(e,t,r,a,i,s)=>(e-1)*t+r+(a-1)*i+1-s,sv=(e,t,r,a,i)=>{let s=Math.floor(e/2);t==="SAME_UPPER"?(r[a]=s,r[i]=e-s):t==="SAME_LOWER"&&(r[a]=e-s,r[i]=s)},ov=(e,t,r,a,i,s,o,u,d,p)=>{let f=e.length-2,m=p.length===0;d.length<f&&d.push(...Array(f-d.length).fill(0));let g=e[0],_=t[u?3:1]*i;for(let v=0,w=e.length-f-(u?1:0);v<f;++v,++w){let k=e[w],b=m?k*o[v]:p[v],$=nv(k,o[v],s[v],t[w],r[v],b);sv($,a,s,v,v+f),m&&p.push(o[v]*(k-1)+d[v]+(t[w]-1)*r[v]+1-s[v]-s[v+f])}p.splice(0,0,g),p.splice(u?3:1,0,_)},yc=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((m,g)=>m*g,1)===0){r.length=0;for(let m=2;m<t[1].dims.length;++m)r.push(t[1].dims[m])}let a=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(a?3:1,0,t[1].dims[1]);let i=e.pads.slice(),s=e.outputShape.slice(),o=e.outputPadding.slice(),u=t[0].dims,d=e.dilations.slice();if(d.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;d=new Array(m).fill(1)}let p=e.strides.slice();if(p.reduce((m,g)=>m+g,0)===0){let m=t[0].dims.length-2;p=new Array(m).fill(1)}ov(u,r,d,e.autoPad,e.group,i,p,a,o,s);let f=Object.assign({},e);return Object.assign(f,{kernelShape:r,pads:i,outputPadding:o,outputShape:s,dilations:d,strides:p}),f},Ak=e=>{let t=Af(e),r=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],i=e.dilations,s=e.group,o=e.kernelShape,u=e.pads,d=e.strides,p=e.wIsConst(),f=e.outputPadding,m=e.outputShape;return{autoPad:a,format:r,dilations:i,group:s,kernelShape:o,outputPadding:f,outputShape:m,pads:u,strides:d,wIsConst:p,...t,cacheKey:`${e.format};${t.activation};`}},uv=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(r!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let i=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==i))throw new Error("invalid bias");let s=e[0].dims.length-2;if(t.dilations.reduce((o,u)=>o+u,0)>0&&t.dilations.length!==s)throw new Error(`dilations should be ${s}D`);if(t.strides.reduce((o,u)=>o+u,0)>0&&t.strides.length!==s)throw new Error(`strides should be ${s}D`);if(t.pads.reduce((o,u)=>o+u,0)>0&&t.pads.length!==s*2)throw new Error(`pads should be ${s*2}D`);if(t.outputPadding.length!==s&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${s}D`);if(t.kernelShape.reduce((o,u)=>o+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},_c=(e,t,r,a)=>{let i=e.kernelCustomData.wT??e.compute(Mt(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=i);let s=[t[0],i];t.length===3&&s.push(t[2]),e.compute(zk(s,r,a),{inputs:s})},lv=(e,t)=>{let r=t.format==="NHWC",a=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let i=t.kernelShape;(i.length===0||i[0]===0)&&(i=[e.inputs[1].dims[2]]);let s=t.dilations;(s.length===0||s[0]===0)&&(s=[1]);let o=t.strides;(o.length===0||o[0]===0)&&(o=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],o=[1].concat(o),s=[1].concat(s),i=[1].concat(i);let d=t.outputPadding;d=[0].concat(d);let p=yc({...t,pads:u,strides:o,dilations:s,kernelShape:i,outputPadding:d},a);_c(e,a,p,f=>r?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},Ok=(e,t)=>{if(uv(e.inputs,t),e.inputs[0].dims.length===3)lv(e,t);else{let r=yc(t,e.inputs);_c(e,e.inputs,r)}}}),dv,Rk,Bk,bA=te(()=>{be(),Ce(),tt(),Ae(),dv=(e,t,r,a)=>{let i=G.size(t),s=t.length,o=Z("input",e,s),u=fe("output",e,s),d=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),p=G.normalizeAxis(d,s),f=m=>{let g=` i32(${o.indicesGet("inputIndices","uniforms.axis")}) `,_=ge("uniforms.input_shape","uniforms.axis",s),v=a.reverse?g+(a.exclusive?" + 1":""):"0",w=a.reverse?_:g+(a.exclusive?"":" + 1");return`
                ${m.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(o,u)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${v};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${o.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${o.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},{type:12,data:p},..._e(t,t)]}),getShaderSource:f}},Rk=(e,t)=>{let r=e.inputs[0].dims,a=e.inputs[0].dataType,i=e.inputs[1];e.compute(dv(a,r,i,t),{inputs:[0]})},Bk=e=>{let t=e.exclusive===1,r=e.reverse===1;return Ge({exclusive:t,reverse:r})}}),pv,cv,hv,Nk,Mk,xA=te(()=>{be(),Ce(),tt(),Ae(),pv=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},cv=(e,t,r,a)=>{let i=[];i.push(`fn perm(i: ${a.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let s=0;s<t;++s)i.push(r.indicesSet("a",e[s],`i[${s}]`));return i.push("return a;}"),i.join(`
`)},hv=(e,t)=>{let r,a,i,s,o,u,d=t.format==="NHWC",p=t.blocksize,f=t.mode==="DCR";d?([r,a,i,s]=e.dims,o=f?[r,a,i,p,p,s/p**2]:[r,a,i,s/p**2,p,p],u=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,a,i,s]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],o=f?[r,p,p,s/p**2,a,i]:[r,s/p**2,p,p,a,i],u=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let m=e.reshape(o),g=m.dims.length,_=e.dataType,v=Z("a",_,g),w=fe("output",_,g),k=b=>`
  ${b.registerUniform("output_size","u32").declareVariables(v,w)}

  ${cv(u,g,v,w)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",v.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:b=>{let $=d?[r,a*p,i*p,s/p**2]:[r,s/p**2,a*p,i*p],S=G.size($),T=m.dims,I=G.sortBasedOnPerm(T,u);return{outputs:[{dims:$,dataType:b[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},..._e(T,I)]}},getShaderSource:k}},Nk=(e,t)=>{pv(e.inputs),e.compute(hv(e.inputs[0],t))},Mk=e=>Ge({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Zo,Ds,vc,fv,mv,gv,yv,$c,_v,Dk,Pk,kA=te(()=>{be(),Ce(),tt(),Ae(),Zo="[a-zA-Z]|\\.\\.\\.",Ds="("+Zo+")+",vc="^"+Ds+"$",fv="("+Ds+",)*"+Ds,mv="^"+fv+"$",gv=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},yv=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,a]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(mv)))throw new Error("Invalid LHS term");if(r.split(",").forEach((i,s)=>{let o=e[s].dims.slice();if(!i.match(RegExp(vc)))throw new Error("Invalid LHS term");let u=this.processTerm(i,!0,o,s);this.lhs.push(u)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([i,s])=>s.count===1||i==="...").map(([i])=>i).join("");else if(!a.match(RegExp(Ds)))throw new Error("Invalid RHS");a.match(RegExp(Zo,"g"))?.forEach(i=>{if(i==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(i);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,r){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(r)}else a={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,a)}processTerm(e,t,r,a=-1){let i=r.length,s=!1,o=[],u=0;if(!e.match(RegExp(vc))&&!t&&e!=="")throw new Error("Invalid LHS term");let d=e.match(RegExp(Zo,"g")),p=new gv(a);return d?.forEach((f,m)=>{if(f==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let g=i-d.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(o=r.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==o.length||this.ellipsisDims.toString()!==o.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=o;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<o.length;_++){let v=String.fromCharCode(48+_);p.addSymbol(v,m+_),this.addSymbol(v,r[u++],a)}}else p.addSymbol(f,m+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(f,r[u++],a)}),p}},$c=e=>e+"_max",_v=(e,t,r,a)=>{let i=e.map(p=>p.length).map((p,f)=>Z(`input${f}`,t,p)),s=G.size(a),o=fe("output",t,a.length),u=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),d=p=>{let f=[],m="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",v=[],w=[],k=[],b=[],$=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((T,I)=>{if(r.rhs.symbolToIndices.has(I)){let A=r.rhs.symbolToIndices.get(I)?.[0];A!==void 0&&r.lhs.forEach((E,B)=>{if(T.inputIndices.includes(B)){let U=E.symbolToIndices.get(I);if(U===void 0)throw new Error("Invalid symbol error");U.forEach(j=>{f.push(`${i[B].indicesSet(`input${B}Indices`,j,o.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,E)=>{if(T.inputIndices.includes(E)){let B=A.symbolToIndices.get(I);if(B===void 0)throw new Error("Invalid symbol error");B.forEach(U=>{v.push(`${i[E].indicesSet(`input${E}Indices`,U,`${I}`)}`)}),b.push(`prod *= ${i[E].getByIndices(`input${E}Indices`)};`)}}),w.push(`for(var ${I}: u32 = 0; ${I} < uniforms.${$c(I)}; ${I}++) {`),k.push("}")});let S=$?[...f,`let sum = ${i.map((T,I)=>T.getByIndices(`input${I}Indices`)).join(" * ")};`]:[...f,g,...w,...v,m,...b,_,...k];return`
            ${p.registerUniforms(u.map(T=>({name:`${$c(T)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,o)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${o.offsetToIndices("global_idx")};
            ${i.map((T,I)=>`var input${I}Indices: ${i[I].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${o.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=u.filter(m=>r.symbolToInfo.has(m)).map(m=>({type:12,data:r.symbolToInfo.get(m)?.dimValue||0}));p.push({type:12,data:s});let f=e.map((m,g)=>[..._e(m)]).reduce((m,g)=>m.concat(g),p);return f.push(..._e(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:f}},getShaderSource:d}},Dk=(e,t)=>{let r=new yv(e.inputs,t.equation),a=r.outputDims,i=e.inputs.map((s,o)=>s.dims);e.compute(_v(i,e.inputs[0].dataType,r,a))},Pk=e=>{let t=e.equation.replace(/\s+/g,"");return Ge({equation:t})}}),vv,wc,$v,wv,Uk,SA=te(()=>{be(),Ce(),Ae(),vv=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=r.length<t.length?0:r.length-t.length,i=t.length<r.length?0:t.length-r.length;for(;a<r.length&&i<t.length;++a,++i)if(r[a]!==t[i]&&r[a]!==1&&t[i]!==1)throw new Error("Expand requires shape to be broadcastable to input")},wc=(e,t)=>{let r=e.length-t.length,a=[];for(let i=0;i<r;++i)a.push(e[i]);for(let i=0;i<t.length;++i)a.push(t[i]===1?e[i+r]:t[i]);return a},$v=(e,t)=>e.length>t.length?wc(e,t):wc(t,e),wv=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),a=$v(t,r),i=e[0].dataType,s=i===9||G.size(t)===1,o=i===9||t.length>0&&t[t.length-1]%4===0?4:1,u=s||a.length>0&&a[a.length-1]%4===0?4:1,d=Math.ceil(G.size(a)/u),p=m=>{let g=Z("input",i,t.length,o),_=fe("output",i,a.length,u),v;if(i===9){let w=(k,b,$="")=>`
          let outputIndices${b} = ${_.offsetToIndices(`outputOffset + ${b}u`)};
          let offset${b} = ${g.broadcastedIndicesToOffset(`outputIndices${b}`,_)};
          let index${b} = offset${b} / 4u;
          let component${b} = offset${b} % 4u;
          ${k}[${b}] = ${$}(${g.getByOffset(`index${b}`)}[component${b}]);
        `;v=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else v=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${o}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${m.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${v}`},f=[{type:12,data:d},..._e(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${o}${u}`,inputDependencies:["rank"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f})}},Uk=e=>{vv(e.inputs),e.compute(wv(e.inputs),{inputs:[0]})}}),bv,Wk,TA=te(()=>{be(),Ce(),Ae(),zf(),bv=e=>{let t=e[0].dataType,r=G.size(e[0].dims),a=G.size(e[1].dims),i=a%4===0,s=o=>{let u=Z("x",t,[1],4),d=Z("bias",t,[1],4),p=fe("y",t,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],m=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${d.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=i?`
      let bias = ${d.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${o.registerUniforms(f).declareVariables(u,d,p)}

    ${$h(xt(t))}

    ${o.mainStart(pi)}
      ${o.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${p.setByOffset("global_idx",wh("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${i}`,inputDependencies:["type","type"]},getShaderSource:s,getRunData:o=>({outputs:[{dims:o[0].dims,dataType:o[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(r/pi/4)}})}},Wk=e=>{e.inputs.length<2||G.size(e.inputs[1].dims)===0?sk(e):e.compute(bv(e.inputs))}}),xv,kv,Vk,qk,CA=te(()=>{be(),Ce(),tt(),Ae(),xv=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},kv=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r.length,s=G.normalizeAxis(t.axis,i),o=r.slice(0);o.splice(s,1,...a);let u=r[s],d=e[0].dataType===9?4:1,p=Math.ceil(G.size(o)/d),f=[{type:12,data:p},{type:6,data:u},{type:12,data:s},..._e(e[0].dims,e[1].dims,o)],m=g=>{let _=Z("data",e[0].dataType,e[0].dims.length,d),v=Z("inputIndices",e[1].dataType,e[1].dims.length),w=fe("output",e[0].dataType,o.length,d),k=$=>{let S=a.length,T=`var indicesIndices${$}  = ${v.type.indices}(0);`;for(let I=0;I<S;I++)T+=`${S>1?`indicesIndices${$}[${I}]`:`indicesIndices${$}`} = ${o.length>1?`outputIndices${$}[uniforms.axis + ${I}]`:`outputIndices${$}`};`;T+=`
          var idx${$} = ${v.getByIndices(`indicesIndices${$}`)};
          if (idx${$} < 0) {
            idx${$} = idx${$} + uniforms.axisDimLimit;
          }
          var dataIndices${$} : ${_.type.indices};
        `;for(let I=0,A=0;I<i;I++)I===s?(T+=`${i>1?`dataIndices${$}[${I}]`:`dataIndices${$}`} = u32(idx${$});`,A+=S):(T+=`${i>1?`dataIndices${$}[${I}]`:`dataIndices${$}`} = ${o.length>1?`outputIndices${$}[${A}]`:`outputIndices${$}`};`,A++);return T},b;if(e[0].dataType===9){let $=(S,T,I="")=>`
          let outputIndices${T} = ${w.offsetToIndices(`outputOffset + ${T}u`)};
          ${k(T)};
          let offset${T} = ${_.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${S}[${T}] = ${I}(${_.getByOffset(`index${T}`)}[component${T}]);
        `;b=`
        let outputOffset = global_idx * ${d};
        var value = vec4<u32>(0);
        ${$("value",0,"u32")}
        ${$("value",1,"u32")}
        ${$("value",2,"u32")}
        ${$("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else b=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${_.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,v,w)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${b}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:m}},Vk=e=>Ge({axis:e.axis}),qk=(e,t)=>{let r=e.inputs;xv(r),e.compute(kv(e.inputs,t))}}),Sv,jk,Lk,IA=te(()=>{be(),Ce(),Ae(),Sv=(e,t,r,a,i,s,o,u,d)=>{let p=[{type:12,data:s},{type:12,data:a},{type:12,data:i},{type:12,data:r},{type:12,data:o},{type:12,data:u},{type:12,data:d}],f=[s];p.push(..._e(t.dims,f));let m=g=>{let _=Z("indices_data",t.dataType,t.dims.length),v=fe("input_slice_offsets_data",12,1,1),w=[_,v],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:i.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(k).declareVariables(...w)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${i.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${i.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:m},{inputs:[t],outputs:[-1]})[0]},jk=(e,t)=>{let r=e.inputs,a=r[0].dims,i=r[0].dataType,s=r[1].dims,o=s[s.length-1],u=G.sizeToDimension(s,s.length-1),d=G.sizeFromDimension(a,t.batchDims+o),p=G.sizeToDimension(a,t.batchDims),f=G.sizeFromDimension(a,t.batchDims),m=u/p,g=new Array(o),_=d;for(let T=0;T<o;++T)g[o-1-T]=_,_*=a[t.batchDims+o-1-T];let v=Sv(e,r[1],g,t.batchDims,a,u,m,f,o),w=t.batchDims+o;if(w>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=s.slice(0,-1).concat(a.slice(w)),b=G.size(k),$=[{type:12,data:b},{type:12,data:d},..._e(r[0].dims,v.dims,k)],S=T=>{let I=Z("data",r[0].dataType,r[0].dims.length),A=Z("slice_offsets",12,v.dims.length),E=fe("output",r[0].dataType,k.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(I,A,E)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:i}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:$}),getShaderSource:S},{inputs:[r[0],v]})},Lk=e=>({batchDims:e.batch_dims,cacheKey:""})}),Tv,Cv,Gk,Fk,EA=te(()=>{be(),Ce(),tt(),Ae(),Tv=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=G.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,i=e[0],s=e[2],o=e.length===4?e[3]:void 0;if(s.dims.length!==i.dims.length||!i.dims.map((u,d)=>d===r?Math.ceil(u/a)===s.dims[d]:u===s.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(o){if(o.dataType!==i.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(o.dims.length!==s.dims.length||!o.dims.map((u,d)=>u===s.dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Cv=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r.length,s=G.normalizeAxis(t.gatherAxis,i),o=G.normalizeAxis(t.quantizeAxis,i),u=r.slice(0);u.splice(s,1,...a);let d=G.size(u),p=e[2].dataType,f=e[0].dataType===22,m=[{type:12,data:d},{type:12,data:o},{type:12,data:s},{type:12,data:t.blockSize},..._e(...e.map((_,v)=>_.dims),u)],g=_=>{let v=Z("data",e[0].dataType,e[0].dims.length),w=Z("inputIndices",e[1].dataType,e[1].dims.length),k=Z("scales",e[2].dataType,e[2].dims.length),b=e.length>3?Z("zeroPoint",e[3].dataType,e[3].dims.length):void 0,$=fe("output",p,u.length),S=[v,w,k];b&&S.push(b);let T=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(T).declareVariables(...S,$)}
        ${_.mainStart()}
        let output_indices = ${$.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${$.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${$.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${v.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${$.indicesGet("output_indices","i")};
          ${v.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[s]};
        }
        ${v.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${$.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${v.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${v.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${v.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${b?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${b.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${b.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${f?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${xt(p)}(quantized_data - zero_point) * scale;
        ${$.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,v)=>v!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,v)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:p}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:m}),getShaderSource:g}},Gk=(e,t)=>{let r=e.inputs;Tv(r,t),e.compute(Cv(e.inputs,t))},Fk=e=>Ge({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Iv,Ev,Hk,Kk,zA=te(()=>{be(),Ce(),tt(),Ae(),Iv=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Ev=(e,t)=>{let r=e[0].dims,a=e[0].dataType,i=r.length,s=e[1].dims,o=e[1].dataType,u=G.normalizeAxis(t.axis,i),d=r[u],p=s.slice(0),f=G.size(p),m=Z("input",a,i),g=Z("indicesInput",o,s.length),_=fe("output",a,p.length),v=[{type:12,data:f},{type:6,data:d},{type:12,data:u}];return v.push(..._e(r,s,p)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:v}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,g,_)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Hk=e=>Ge({axis:e.axis}),Kk=(e,t)=>{let r=e.inputs;Iv(r),e.compute(Ev(e.inputs,t))}}),zv,Av,Zk,Qk,AA=te(()=>{be(),Ce(),Ae(),zv=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Av=(e,t)=>{let r=e[0].dims.slice(),a=e[1].dims.slice(),[i,s,o]=Xx.getShapeOfGemmResult(r,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),u=[i,s];if(!u)throw new Error("Can't use gemm on the given tensors");let d=16,p=Math.ceil(s/d),f=Math.ceil(i/d),m=!0,g=G.size(u),_=[{type:12,data:m?p:g},{type:12,data:i},{type:12,data:s},{type:12,data:o},{type:1,data:t.alpha},{type:1,data:t.beta}],v=["type","type"];e.length===3&&(_.push(..._e(e[2].dims)),v.push("rank")),_.push(..._e(u));let w=b=>{let $="";t.transA&&t.transB?$="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?$="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?$="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&($="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",T=Z("a",e[0].dataType,e[0].dims),I=Z("b",e[1].dataType,e[1].dims),A=T.type.value,E=null,B=[T,I];e.length===3&&(E=Z("c",e[2].dataType,e[2].dims.length),B.push(E));let U=fe("output",e[0].dataType,u.length);B.push(U);let j=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${b.registerUniforms(j).declareVariables(...B)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${$}
    }

    ${S}
    ${E!=null?`let cOffset = ${E.broadcastedIndicesToOffset("vec2(m, n)",U)}; value += ${A}(uniforms.beta) * ${E.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=b=>{let $=Z("a",e[0].dataType,e[0].dims),S=Z("b",e[1].dataType,e[1].dims),T=null,I=[$,S];e.length===3&&(T=Z("c",e[2].dataType,e[2].dims.length),I.push(T));let A=fe("output",e[0].dataType,u.length);I.push(A);let E=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],B="",U="";t.transA&&t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(U=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(U=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${$.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let j=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${b.registerUniforms(E).declareVariables(...I)}
  var<workgroup> tile_a: array<array<${$.type.storage}, ${d}>, ${d}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${d}>, ${d}>;
  ${b.mainStart([d,d,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${d};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${d};
    let num_tiles = (uniforms.K - 1) / ${d} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${U}
      k_start = k_start + ${d};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${d}; k++) {
        ${B}
      }
      workgroupBarrier();
    }

    ${j}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return m?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:p*f},programUniforms:_}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:w}},Zk=e=>{let t=e.transA,r=e.transB,a=e.alpha,i=e.beta;return{transA:t,transB:r,alpha:a,beta:i,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Qk=(e,t)=>{zv(e.inputs),e.compute(Av(e.inputs,t))}}),_r,Br,Sa,Ta,Ov,Rv,Bv,Nv,Mv,Dv,Pv,Uv,Xk,Jk,OA=te(()=>{be(),Ce(),tt(),Ae(),[_r,Br,Sa,Ta]=[0,1,2,3],Ov=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Rv=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Bv=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Nv=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Mv=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Dv=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${_r}] = batch;
     indices[${Br}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Sa}] = u32(r);
            indices[${Ta}] = u32(c);
          }
        `;case"border":return`
          indices[${Sa}] = u32(clamp(r, 0, H - 1));
          indices[${Ta}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Sa}] = gs_reflect(r, border[1], border[3]);
          indices[${Ta}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Pv=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${_r}], indices[${Br}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${_r}], indices[${Br}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${_r}], indices[${Br}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${_r}], indices[${Br}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${_r}], indices[${Br}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${_r}], indices[${Br}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Uv=(e,t)=>{let r=Z("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],i=Z("grid",e[1].dataType,a.length,2),s=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(s=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[_r,Br,Sa,Ta]=[0,3,1,2]);let o=fe("output",e[0].dataType,s.length),u=r.type.value,d=G.size(s),p=[{type:12,data:d},..._e(e[0].dims,a,s)],f=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(r,i,o)}
  ${Rv}
  ${Bv(u)}
  ${Nv(t)}
  ${Mv(t)}
  ${Dv(r,u,t)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Sa}]);
      let W_in = i32(uniforms.x_shape[${Ta}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${o.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${_r}], indices[${Sa}], indices[${Ta}]);
      let nxy = ${i.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Pv(o,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:m=>{let g=G.size(s);return{outputs:[{dims:s,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:p}},getShaderSource:f}},Xk=(e,t)=>{Ov(e.inputs),e.compute(Uv(e.inputs,t))},Jk=e=>Ge({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Tt,Wv,Yk,bc,Vv,Js,eS,tS=te(()=>{be(),Ce(),tt(),Tf(),Ef(),Ae(),Xr(),Tt=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Wv=(e,t)=>{let r=e[0],a=Tt(e,1),i=Tt(e,2),s=Tt(e,3),o=Tt(e,4),u=Tt(e,5),d=Tt(e,6),p=Tt(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=r.dims[0],m=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=m,v=0,w=0,k=Math.floor(g/t.numHeads);if(d&&p&&G.size(d.dims)&&G.size(p.dims)){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims[0]!==f||d.dims[1]!==t.numHeads||d.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(p.dims[0]!==f||p.dims[1]!==t.numHeads||p.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[2]!==p.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=d.dims[2],w=d.dims[2]}else if(d&&G.size(d.dims)||p&&G.size(p.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b;if(a&&G.size(a.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');b=2,_=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(i)throw new Error('Expect "value" be none when "key" has packed kv format.');b=5,_=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');b=0,_=a.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}if(s&&G.size(s.dims)>0){if(s.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let $=v+_,S=0;if(o&&G.size(o.dims)>0){S=8;let E=o.dims;throw E.length===1?E[0]===f?S=1:E[0]===3*f+2&&(S=3):E.length===2&&E[0]===f&&E[1]===$&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,I=g;if(i&&G.size(i.dims)>0){if(i.dims.length!==3&&i.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(i.dims.length===3){if(_!==i.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=i.dims[2]}else{if(_!==i.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');I=i.dims[1]*i.dims[3],T=!0}}let A=!1;if(o&&G.size(o.dims)>0)throw new Error("Key padding mask is not supported");if(u&&G.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==f||u.dims[1]!==t.numHeads||u.dims[2]!==m||u.dims[3]!==$)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:f,sequenceLength:m,pastSequenceLength:v,kvSequenceLength:_,totalSequenceLength:$,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:g,vHiddenSize:I,headSize:k,vHeadSize:Math.floor(I/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:A,passPastInKv:T,qkvFormat:b}},Yk=e=>Ge({...e}),bc=Ge({perm:[0,2,1,3]}),Vv=(e,t,r,a,i,s,o)=>{let u=[a,i,s],d=G.size(u),p=[{type:12,data:d},{type:12,data:o},{type:12,data:s}],f=m=>{let g=fe("qkv_with_bias",t.dataType,u),_=Z("qkv",t.dataType,u),v=Z("bias",r.dataType,u),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${m.registerUniforms(w).declareVariables(_,v,g)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:p}),getShaderSource:f},{inputs:[t,r],outputs:[-1]})[0]},Js=(e,t,r,a,i,s,o,u)=>{let d=s;if(o&&G.size(o.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return d=Vv(e,s,o,t,a,r*i,u),d=d.reshape([t,a,r,i]),r===1||a===1?d:e.compute(Mt(d,bc.perm),{inputs:[d],outputs:[-1]})[0]}else return s.dims.length===3&&(d=s.reshape([t,a,r,i])),r===1||a===1?d:e.compute(Mt(d,bc.perm),{inputs:[d],outputs:[-1]})[0]},eS=(e,t)=>{let r=Wv(e.inputs,t),a=e.inputs[0],i=Tt(e.inputs,1),s=Tt(e.inputs,2),o=Tt(e.inputs,3),u=Tt(e.inputs,4),d=Tt(e.inputs,5),p=Tt(e.inputs,6),f=Tt(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if(i?.dims.length===5)throw new Error("Packed KV is not implemented");let m=i&&s&&i.dims.length===4&&s.dims.length===4,g=Js(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,a,o,0);if(m)return bo(e,g,i,s,u,void 0,p,f,d,r);if(!i||!s)throw new Error("key and value must be provided");let _=Js(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,i,o,r.hiddenSize),v=Js(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,o,2*r.hiddenSize);bo(e,g,_,v,u,void 0,p,f,d,r)}}),qv,jv,Lv,Gv,Th,rS,aS,iS=te(()=>{be(),Ce(),tt(),Ae(),qv=e=>{if(!e||e.length<1)throw new Error("too few inputs")},jv=(e,t)=>{let r=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),a=r.length),Ge({numOutputs:a,axis:t.axis,splitSizes:r})},Lv=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${ge("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Gv=e=>{let t=e.length,r=[];for(let a=0;a<t;++a){let i=e[a].setByIndices("indices","input[global_idx]");t===1?r.push(i):a===0?r.push(`if (output_number == ${a}u) { ${i} }`):a===t-1?r.push(`else { ${i} }`):r.push(`else if (output_number == ${a}) { ${i} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Th=(e,t)=>{let r=e[0].dims,a=G.size(r),i=e[0].dataType,s=G.normalizeAxis(t.axis,r.length),o=new Array(t.numOutputs),u=Z("input",i,r.length),d=new Array(t.numOutputs),p=[],f=[],m=0,g=[{type:12,data:a}];for(let v=0;v<t.numOutputs;v++){m+=t.splitSizes[v],d[v]=m;let w=r.slice();w[s]=t.splitSizes[v],f.push(w),o[v]=fe(`output${v}`,i,w.length),p.push({dims:f[v],dataType:e[0].dataType})}g.push({type:12,data:d},..._e(r,...f));let _=v=>`
  ${v.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",d.length).declareVariables(u,...o)}
  ${Lv(d.length)}
  ${Gv(o)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${ge("uniforms.size_in_split_axis","output_number - 1u",d.length)};
      ${u.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:p,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:g})}},rS=(e,t)=>{qv(e.inputs);let r=e.inputs.length===1?t:jv(e.inputs,t);e.compute(Th(e.inputs,r),{inputs:[0]})},aS=e=>{let t=e.axis,r=e.splitSizes,a=e.numOutputs<0?r.length:e.numOutputs;if(a!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return Ge({axis:t,numOutputs:a,splitSizes:r})}}),Fv,Hv,xc,nS,RA=te(()=>{tt(),Ef(),tS(),iS(),Xr(),Fv=(e,t)=>{if(t.doRotary)throw new Error("GroupQuerryAttention do_rotary attribute is not supported");if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],a=e[1],i=e[2],s=e[3],o=e[4];if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,d=r.dims[0],p=r.dims[1],f=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],m=p,g=0,_=!a||a.dims.length===0,v=Math.floor(_?f/(t.numHeads+2*t.kvNumHeads):f/t.numHeads);_&&(f=v*t.numHeads);let w=s&&s.dims.length!==0,k=o&&o.dims.length!==0;if(w&&s.dims.length===4&&s.dims[0]===d&&s.dims[1]!==t.kvNumHeads&&s.dims[2]===t.kvNumHeads&&s.dims[3]===v)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&k){if(s.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(o.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=s.dims[2]}else if(w||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let b=1;if(a&&a.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(r.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');m=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(i)throw new Error('Expect "value" be none when "key" has packed kv format.');m=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=a.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');b=3}let $=0,S=!1,T=t.kvNumHeads?v*t.kvNumHeads:f;if(i&&i.dims.length>0){if(i.dims.length!==3&&i.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(i.dims.length===3){if(m!==i.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=i.dims[2]}else{if(m!==i.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');T=i.dims[1]*i.dims[3],S=!0}}let I=e.length>4?e[5]:void 0;if(I&&I.dims.length!==1&&I.dims[0]!==d)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:d,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:m,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:f,vHiddenSize:T,headSize:v,vHeadSize:Math.floor(T/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:$,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:b}},Hv=Ge({perm:[0,2,1,3]}),xc=(e,t,r)=>{let a=t,i=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(a=t.reshape([r.batchSize,r.kvSequenceLength,i,r.headSize]),a=e.compute(Mt(a,Hv.perm),{inputs:[a],outputs:[-1]})[0]),a},nS=(e,t)=>{let r=Fv(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],i=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,s=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,o=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,d=e.inputs.length>4?e.inputs[5]:void 0,p=e.inputs.length>5?e.inputs[6]:void 0,f=r.kvNumHeads?r.kvNumHeads:r.numHeads,m=Ge({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,f*r.headSize,f*r.headSize]}),[g,_,v]=!i&&!s?e.compute(Th([a],m),{inputs:[a],outputs:[-1,-1,-1]}):[a,i,s],w=Js(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,g,void 0,0);bo(e,w,xc(e,_,r),xc(e,v,r),void 0,void 0,o,u,void 0,r,d,p)}}),kc,Kv,Zv,sS,BA=te(()=>{be(),Ce(),Xr(),Ae(),kc=(e,t,r,a,i,s,o,u)=>{let d=Ye(s),p=d===1?"f32":`vec${d}f`,f=d===1?"vec2f":`mat2x${d}f`,m=i*o,g=64;m===1&&(g=256);let _=[i,o,s/d],v=[i,o,2],w=["rank","type","type"],k=[];k.push(..._e(_,v));let b=$=>{let S=Z("x",t.dataType,3,d),T=Z("scale",r.dataType,r.dims),I=Z("bias",a.dataType,a.dims),A=fe("output",1,3,2),E=[S,T,I,A];return`
  var<workgroup> workgroup_shared : array<${f}, ${g}>;
  const workgroup_size = ${g}u;
  ${$.declareVariables(...E)}
  ${$.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${p}(0);
    var squared_sum = ${p}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${p}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${f}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Zr("workgroup_shared[0][0]",d)} / f32(hight * ${d});
      let squared_sum_final = ${Zr("workgroup_shared[0][1]",d)} / f32(hight * ${d});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${d};${u};${g}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:v,dataType:1}],dispatchGroup:{x:m},programUniforms:k}),getShaderSource:b},{inputs:[t,r,a],outputs:[-1]})[0]},Kv=(e,t,r)=>{let a=t[0].dims,i=a,s=2,o=a[0],u=a[1],d=G.sizeFromDimension(a,s),p=Ye(d),f=G.size(i)/p,m=kc(e,t[0],t[1],t[2],o,d,u,r.epsilon),g=[o,u,d/p],_=[o,u],v=["type","none"],w=k=>{let b=Z("x",t[0].dataType,g.length,p),$=Z("scale_shift",1,_.length,2),S=fe("output",t[0].dataType,g.length,p),T=[b,$,S];return`
  ${k.registerUniform("output_size","u32").declareVariables(...T)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${$.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${b.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${p}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},..._e(g,_,g)]}),getShaderSource:w},{inputs:[t[0],m]})},Zv=(e,t,r)=>{let a=t[0].dims,i=a,s=a[0],o=a[a.length-1],u=G.sizeFromDimension(a,1)/o,d=Ye(o),p=G.size(i)/d,f=[{type:12,data:u},{type:12,data:Math.floor(o/d)}],m=["type","type"],g=!1,_=[0,a.length-1];for(let b=0;b<a.length-2;b++)g=g||a[b+1]!==1,_.push(b+1);g=g&&a[a.length-1]!==1;let v=g?e.compute(Mt(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},(b,$)=>a[_[$]])),w=kc(e,v,t[1],t[2],s,u,o,r.epsilon),k=b=>{let $=pt(t[0].dataType),S=d===1?"vec2f":`mat${d}x2f`,T=E=>{let B=E===0?"x":"y",U=d===1?"f32":`vec${d}f`;switch(d){case 1:return`${$}(${U}(scale.${B}))`;case 2:return`vec2<${$}>(${U}(scale[0].${B}, scale[1].${B}))`;case 4:return`vec4<${$}>(${U}(scale[0].${B}, scale[1].${B}, scale[2].${B}, scale[3].${B}))`;default:throw new Error(`Not supported compoents ${d}`)}},I=Z("input",t[0].dataType,t[0].dims,d),A=fe("output",t[0].dataType,i,d);return`
  @group(0) @binding(0) var<storage, read> input : array<${I.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${b.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${d}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:i,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:f}),getShaderSource:k},{inputs:[t[0],w]})},sS=(e,t)=>{t.format==="NHWC"?Zv(e,e.inputs,t):Kv(e,e.inputs,t)}}),Qv,Xv,oS,NA=te(()=>{be(),Ce(),Ae(),Qv=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Xv=(e,t,r)=>{let a=t.simplified,i=e[0].dims,s=e[1],o=!a&&e[2],u=i,d=G.normalizeAxis(t.axis,i.length),p=G.sizeToDimension(i,d),f=G.sizeFromDimension(i,d),m=G.size(s.dims),g=o?G.size(o.dims):0;if(m!==f||o&&g!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${g}`);let _=[];for(let I=0;I<i.length;++I)I<d?_.push(i[I]):_.push(1);let v=Ye(f),w=["type","type"],k=[{type:12,data:p},{type:1,data:f},{type:12,data:Math.floor(f/v)},{type:1,data:t.epsilon}];o&&w.push("type");let b=r>1,$=r>2,S=I=>{let A=pt(e[0].dataType),E=[Z("x",e[0].dataType,e[0].dims,v),Z("scale",s.dataType,s.dims,v)];o&&E.push(Z("bias",o.dataType,o.dims,v)),E.push(fe("output",e[0].dataType,u,v)),b&&E.push(fe("mean_data_output",1,_)),$&&E.push(fe("inv_std_output",1,_));let B=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${I.registerUniforms(B).declareVariables(...E)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${yh("f32",v)};
    var mean_square_vector = ${yh("f32",v)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${ai(A,v,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Zr("mean_vector",v)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Zr("mean_square_vector",v)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${ai(A,v,"x[j + offset]")};
      let f32scale = ${ai(A,v,"scale[j]")};
      output[j + offset] = ${E[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${o?`+ ${ai(A,v,"bias[j]")}`:""}
      );
    }

    ${b?"mean_data_output[global_idx] = mean":""};
    ${$?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:u,dataType:e[0].dataType}];return b&&T.push({dims:_,dataType:1}),$&&T.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${v};${r};${a}`,inputDependencies:w},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(p/64)},programUniforms:k}),getShaderSource:S}},oS=(e,t)=>{Qv(e.inputs),e.compute(Xv(e.inputs,t,e.outputCount))}}),Jv,uS,MA=te(()=>{Ce(),Bf(),Nf(),Jv=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},uS=e=>{Jv(e.inputs);let t=di.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&a<8)e.compute(Rf(e.inputs,{activation:""},t));else{let i=t[t.length-2],s=G.size(e.inputs[0].dims.slice(0,-2)),o=G.size(e.inputs[1].dims.slice(0,-2));if(s!==1&&i===1&&o===1){let u=e.inputs[0].reshape([1,s,a]),d=e.inputs[1].reshape([1,a,r]),p=[1,s,r],f=[u,d];e.compute(Cu(f,{activation:""},t,p),{inputs:f})}else e.compute(Cu(e.inputs,{activation:""},t))}}}),Yv,e$,t$,lS,dS,DA=te(()=>{be(),Ce(),tt(),Ae(),Yv=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],a=r.dims.length;if(r.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let i=Math.floor((t.k+t.blockSize-1)/t.blockSize),s=t.blockSize/8*t.bits,o=e[1];if(!G.areEqual(o.dims,[t.n,i,s]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(G.size(u)!==t.n*i)throw new Error("scales input size error.");if(e.length===4){let d=e[3].dims,p=t.bits>4?t.n*i:t.n*Math.floor((i+1)/2);if(G.size(d)!==p)throw new Error("zeroPoints input size error.")}},e$=(e,t)=>{let r=e[0].dims,a=r.length,i=r[a-2],s=t.k,o=t.n,u=r.slice(0,a-2),d=G.size(u),p=e[1].dims[2]/4,f=e[0].dataType,m=Ye(t.k),g=Ye(p),_=Ye(o),v=u.concat([i,o]),w=i>1&&o/_%2===0?2:1,k=G.size(v)/_/w,b=64,$=[],S=[d,i,s/m],T=G.convertShape(e[1].dims).slice();T.splice(-1,1,p/g),$.push(..._e(S)),$.push(..._e(T)),$.push(..._e(e[2].dims)),e.length===4&&$.push(..._e(G.convertShape(e[3].dims)));let I=[d,i,o/_];$.push(..._e(I));let A=E=>{let B=S.length,U=Z("a",e[0].dataType,B,m),j=Z("b",12,T.length,g),W=Z("scales",e[2].dataType,e[2].dims.length),J=[U,j,W],P=e.length===4?Z("zero_points",12,e[3].dims.length):void 0;P&&J.push(P);let se=I.length,ue=fe("output",e[0].dataType,se,_),F=pt(e[0].dataType),oe=(()=>{switch(m){case 1:return`array<${F}, 8>`;case 2:return`mat4x2<${F}>`;case 4:return`mat2x4<${F}>`;default:throw new Error(`${m}-component is not supported.`)}})(),le=()=>{let M=`
          // reuse a data
            var input_offset = ${U.indicesToOffset(`${U.type.indices}(batch, row, word_offset)`)};
            var a_data: ${oe};
            for (var j: u32 = 0; j < ${8/m}; j++) {
              a_data[j] = ${U.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let V=0;V<_*w;V++)M+=`
            b_value = ${g===1?`b${V}_data`:`b${V}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${oe}(${Array.from({length:4},(R,X)=>`${F}(b_value_lower[${X}]), ${F}(b_value_upper[${X}])`).join(", ")});
            b_dequantized_values = ${m===1?`${oe}(${Array.from({length:8},(R,X)=>`(b_quantized_values[${X}] - ${P?`zero_point${V}`:"zero_point"}) * scale${V}`).join(", ")});`:`(b_quantized_values - ${oe}(${Array(8).fill(`${P?`zero_point${V}`:"zero_point"}`).join(",")})) * scale${V};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(V/_)}]${_>1?`[${V%_}]`:""} += ${Array.from({length:8/m},(R,X)=>`${m===1?`a_data[${X}] * b_dequantized_values[${X}]`:`dot(a_data[${X}], b_dequantized_values[${X}])`}`).join(" + ")};
          `;return M},H=()=>{let M=`
            var col_index = col * ${_};
            ${P?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${F}(8);`}
            `;for(let V=0;V<_*w;V++)M+=`
            let scale${V} = ${W.getByOffset("col_index * nBlocksPerCol + block")};
            ${P?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${P.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${F}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return M},de=()=>{let M=`col_index = col * ${_};`;for(let V=0;V<_*w;V++)M+=`
            let b${V}_data = ${j.getByIndices(`${j.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return M+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${oe};
            var b_dequantized_values: ${oe};`,M};return`
        var<workgroup> workgroup_shared: array<${ue.type.value}, ${w*b}>;
        ${E.declareVariables(...J,ue)}
        ${E.mainStart([b,1,1])}
          let output_indices = ${ue.offsetToIndices(`(global_idx / ${b}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${b}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/m};
            ${H()}
            for (var word: u32 = 0; word < ${p}; word += ${g}) {
              ${de()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${le()}
                word_offset += ${8/m};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${ue.type.value} = ${ue.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${b}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${ue.setByIndices(`${ue.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${m};${g};${_};${w};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:v,dataType:f}],dispatchGroup:{x:k},programUniforms:$}),getShaderSource:A}},t$=(e,t)=>{let r=e[0].dims,a=r.length,i=r[a-2],s=t.k,o=t.n,u=r.slice(0,a-2),d=G.size(u),p=e[1].dims[2]/4,f=e[0].dataType,m=Ye(t.k),g=Ye(p),_=u.concat([i,o]),v=128,w=o%8===0?8:o%4===0?4:1,k=v/w,b=k*g*8,$=b/m,S=b/t.blockSize,T=G.size(_)/w,I=[],A=[d,i,s/m],E=G.convertShape(e[1].dims).slice();E.splice(-1,1,p/g),I.push(..._e(A)),I.push(..._e(E)),I.push(..._e(e[2].dims)),e.length===4&&I.push(..._e(G.convertShape(e[3].dims)));let B=[d,i,o];I.push(..._e(B));let U=j=>{let W=A.length,J=Z("a",e[0].dataType,W,m),P=Z("b",12,E.length,g),se=Z("scales",e[2].dataType,e[2].dims.length),ue=[J,P,se],F=e.length===4?Z("zero_points",12,e[3].dims.length):void 0;F&&ue.push(F);let oe=B.length,le=fe("output",e[0].dataType,oe),H=pt(e[0].dataType),de=()=>{switch(m){case 1:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${H}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${H}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${m}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${J.type.value}, ${$}>;
        var<workgroup> inter_results: array<array<${le.type.value}, ${k}>, ${w}>;
        ${j.declareVariables(...ue,le)}
        ${j.mainStart([k,w,1])}
          let output_indices = ${le.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${$};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${$}; a_offset += ${v})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${J.getByIndices(`${J.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${J.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${F?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${F.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${H}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${H}(8);`}
            let scale = ${se.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${P.getByIndices(`${P.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/m};
            for (var i: u32 = 0; i < ${g}; i++) {
              ${de()}
              let b_value = ${g===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${H}>(${Array.from({length:4},(M,V)=>`${H}(b_value_lower[${V}]), ${H}(b_value_upper[${V}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${H}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(M,V)=>`${`dot(a_data${V}, b_dequantized_values[${V}])`}`).join(" + ")};
              word_offset += ${8/m};
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${le.type.value} = ${le.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${le.setByIndices(`${le.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${m};${g};${k};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:f}],dispatchGroup:{x:T},programUniforms:I}),getShaderSource:U}},lS=(e,t)=>{Yv(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(t$(e.inputs,t)):e.compute(e$(e.inputs,t))},dS=e=>Ge(e)}),r$,a$,i$,n$,s$,o$,u$,l$,pS,PA=te(()=>{be(),Ce(),Ae(),r$=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},a$=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
            k = i32(${e.indicesGet("indices",i)}) - ${ge("uniforms.pads",i,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${ge("uniforms.x_shape",i,t)})) {
              break;
            }
            offset += k * i32(${ge("uniforms.x_strides",i,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},i$=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${ge("uniforms.pads",i,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${ge("uniforms.x_shape",i,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${ge("uniforms.x_shape",i,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${ge("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},n$=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${ge("uniforms.pads",i,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${ge("uniforms.x_shape",i,t)})) {
                  k = i32(${ge("uniforms.x_shape",i,t)}) - 1;
                }
                offset += k * i32(${ge("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},s$=(e,t,r)=>{let a="";for(let i=t-1;i>=0;--i)a+=`
                k = i32(${e.indicesGet("indices",i)}) - ${ge("uniforms.pads",i,r)};
                if (k < 0)  {
                  k += i32(${ge("uniforms.x_shape",i,t)}]);
                }
                if (k >= i32(${ge("uniforms.x_shape",i,t)})) {
                  k -= i32(${ge("uniforms.x_shape",i,t)});
                }
                offset += k * i32(${ge("uniforms.x_strides",i,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},o$=(e,t,r)=>{switch(r.mode){case 0:return a$(e,t,r.pads.length);case 1:return i$(e,t,r.pads.length);case 2:return n$(e,t,r.pads.length);case 3:return s$(e,t,r.pads.length);default:throw new Error("Invalid mode")}},u$=(e,t)=>{let r=G.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,i=G.size(r),s=[{type:12,data:i},{type:6,data:t.pads}],o=e.length>=3&&e[2].data;t.mode===0&&s.push({type:o?e[2].dataType:1,data:t.value}),s.push(..._e(e[0].dims,r));let u=["rank"],d=p=>{let f=fe("output",e[0].dataType,r.length),m=Z("x",e[0].dataType,a.length),g=m.type.value,_=o$(f,a.length,t),v=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&v.push({name:"constant_value",type:o?g:"f32"}),`
            ${p.registerUniforms(v).declareVariables(m,f)}
            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${f.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${o}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(G.size(r)/64)},programUniforms:s}),getShaderSource:d}},l$=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,i=e[0].dims.length,s=new Int32Array(2*i).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let d=0;d<u.length;d++)s[Number(u[d])]=Number(r[d]),s[Number(u[d])+i]=Number(r[d+u.length])}else r.forEach((u,d)=>s[Number(d)]=Number(u));let o=[];return s.forEach(u=>o.push(u)),{mode:t.mode,value:a,pads:o}}else return t},pS=(e,t)=>{r$(e.inputs);let r=l$(e.inputs,t);e.compute(u$(e.inputs,r),{inputs:[0]})}}),Ps,Sc,Tc,Cc,Ic,d$,p$,Ec,zc,cS,hS,Ac,fS,mS,Oc,gS,yS,_S,vS,UA=te(()=>{gr(),be(),Ce(),Ae(),Ps=e=>{if(Ze.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Sc=(e,t,r)=>{let a=t.format==="NHWC",i=e.dims.slice();a&&i.splice(1,0,i.pop());let s=Object.hasOwnProperty.call(t,"dilations"),o=t.kernelShape.slice(),u=t.strides.slice(),d=s?t.dilations.slice():[],p=t.pads.slice();Su.adjustPoolAttributes(r,i,o,u,d,p);let f=Su.computePoolOutputShape(r,i,u,d,o,p,t.autoPad),m=Object.assign({},t);s?Object.assign(m,{kernelShape:o,strides:u,pads:p,dilations:d,cacheKey:t.cacheKey}):Object.assign(m,{kernelShape:o,strides:u,pads:p,cacheKey:t.cacheKey});let g=f.slice();return g.push(g.splice(1,1)[0]),[m,a?g:f]},Tc=(e,t)=>{let r=t.format==="NHWC",a=G.size(e),i=G.size(t.kernelShape),s=[{type:12,data:a},{type:12,data:i}],o=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],p=t.pads[t.pads.length/2-1],f=t.pads[t.pads.length-1],m=!!(p+f);s.push({type:12,data:u},{type:12,data:d},{type:12,data:p},{type:12,data:f}),o.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],v=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];g=!!(w+k),s.push({type:12,data:_},{type:12,data:v},{type:12,data:w},{type:12,data:k}),o.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[s,o,!0,m,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=G.computeStrides(t.kernelShape);s.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),o.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let d=t.pads.reduce((p,f)=>p+f);return[s,o,!!d,!1,!1]}},Cc=(e,t,r,a,i,s,o,u,d,p,f,m)=>{let g=i.format==="NHWC",_=t.type.value,v=fe("output",t.type.tensor,a);if(i.kernelShape.length<=2){let w="",k="",b="",$=r-(g?2:1);if(f?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${$}] < 0 || xIndices[${$}]
                      >= uniforms.x_shape[${$}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`,i.kernelShape.length===2){let S=r-(g?3:2);m?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,b=`
              }
            `}return`
            ${e.registerUniforms(d).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${k}
              ${w}
              ${b}
              ${o}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=i.kernelShape.length,k=i.pads.length,b="";return p?b=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${s}
              }`:b=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${e.registerUniforms(d).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${ge("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${ge("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${ge("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${ge("uniforms.pads","j - 2u",k)};
                  ${b}
              }
              ${o}

              output[global_idx] = value;
            }`}},Ic=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,d$=e=>`${Ic(e)};${e.countIncludePad}`,p$=e=>`${Ic(e)};${e.storageOrder};${e.dilations}`,Ec=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),zc=(e,t,r,a)=>{let[i,s]=Sc(t,a,r),o=Z("x",t.dataType,t.dims.length),u=o.type.value,d="value += x_val;",p="";i.countIncludePad?p+=`value /= ${u}(uniforms.kernelSize);`:p+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[f,m,g,_,v]=Tc(s,i);f.push(..._e(t.dims,s));let w=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${g};${_};${v}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(G.size(s)/64)},programUniforms:f}),getShaderSource:k=>Cc(k,o,t.dims.length,s.length,i,d,p,0,m,g,_,v)}},cS=e=>{let t=e.count_include_pad!==0,r=Ec(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let a={countIncludePad:t,...r,cacheKey:""};return{...a,cacheKey:d$(a)}},hS=(e,t)=>{Ps(e.inputs),e.compute(zc("AveragePool",e.inputs[0],!1,t))},Ac={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},fS=e=>{let t=e.format;return{format:t,...Ac,cacheKey:t}},mS=(e,t)=>{Ps(e.inputs),e.compute(zc("GlobalAveragePool",e.inputs[0],!0,t))},Oc=(e,t,r,a)=>{let[i,s]=Sc(t,a,r),o=`
      value = max(x_val, value);
    `,u="",d=Z("x",t.dataType,t.dims.length),p=["rank"],[f,m,g,_,v]=Tc(s,i);return f.push(..._e(t.dims,s)),{name:e,shaderCache:{hint:`${a.cacheKey};${g};${_};${v}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(G.size(s)/64)},programUniforms:f}),getShaderSource:w=>Cc(w,d,t.dims.length,s.length,i,o,u,t.dataType===10?-65504:-1e5,m,g,_,v)}},gS=(e,t)=>{Ps(e.inputs),e.compute(Oc("MaxPool",e.inputs[0],!1,t))},yS=e=>{let t=e.storage_order,r=e.dilations,a=Ec(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let i={storageOrder:t,dilations:r,...a,cacheKey:""};return{...i,cacheKey:p$(i)}},_S=e=>{let t=e.format;return{format:t,...Ac,cacheKey:t}},vS=(e,t)=>{Ps(e.inputs),e.compute(Oc("GlobalMaxPool",e.inputs[0],!0,t))}}),c$,h$,$S,wS,WA=te(()=>{be(),Ce(),tt(),Ae(),c$=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,a)=>r===e[2].dims[a]).reduce((r,a)=>r&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((i,s)=>s===t.axis||i===e[0].dims[s]).reduce((i,s)=>i&&s,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/a)||t.blockSize>Math.ceil(r/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},h$=(e,t)=>{let r=G.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,i=a===3,s=e[0].dims,o=e[1].dataType,u=G.size(s),d=a===3||a===2,p=d?[Math.ceil(G.size(e[0].dims)/4)]:e[0].dims,f=e[1].dims,m=e.length>2?e[2]:void 0,g=m?d?[Math.ceil(G.size(m.dims)/4)]:m.dims:void 0,_=f.length===0||f.length===1&&f[0]===1,v=_===!1&&f.length===1,w=Ye(u),k=_&&(!d||w===4),b=k?w:1,$=k&&!d?w:1,S=Z("input",d?12:a,p.length,$),T=Z("scale",o,f.length),I=m?Z("zero_point",d?12:a,g.length):void 0,A=fe("output",o,s.length,b),E=[S,T];I&&E.push(I);let B=[p,f];m&&B.push(g);let U=[{type:12,data:u/b},{type:12,data:r},{type:12,data:t.blockSize},..._e(...B,s)],j=W=>{let J=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${W.registerUniforms(J).declareVariables(...E,A)}
      ${W.mainStart()}
          ${W.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${d?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${i?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${b===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${T.getByOffset("0")}`:v?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${I?_?d?`
                let zero_point_input = ${I.getByOffset("0")};
                let zero_point_vec =  ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${I.getByOffset("0")}`:v?d?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${I.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${I.getByOffset("zero_point_index")};`:d?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${I.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${i?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${I.getByIndices("scale_indices")};`:`let zero_point_value = ${d?i?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:I?["rank","rank","rank"]:["rank","rank"]},getShaderSource:j,getRunData:()=>({outputs:[{dims:s,dataType:o}],dispatchGroup:{x:Math.ceil(u/b/64),y:1,z:1},programUniforms:U})}},$S=(e,t)=>{c$(e.inputs,t),e.compute(h$(e.inputs,t))},wS=e=>Ge({axis:e.axis,blockSize:e.blockSize})}),f$,m$,bS,VA=te(()=>{gr(),be(),Ae(),f$=(e,t,r)=>{let a=e===t,i=e<t&&r<0,s=e>t&&r>0;if(a||i||s)throw new Error("Range these inputs' contents are invalid.")},m$=(e,t,r,a)=>{let i=Math.abs(Math.ceil((t-e)/r)),s=[i],o=i,u=[{type:12,data:o},{type:a,data:e},{type:a,data:r},..._e(s)],d=p=>{let f=fe("output",a,s.length),m=f.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:m},{name:"delta",type:m}];return`
        ${p.registerUniforms(g).declareVariables(f)}
        ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:d,getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u})}},bS=e=>{let t=0,r=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),Ze.webgpu.validateInputContent&&f$(t,r,a),e.compute(m$(t,r,a,e.inputs[0].dataType),{inputs:[]})}}),g$,y$,xS,kS,qA=te(()=>{be(),Ce(),tt(),Ae(),g$=(e,t,r,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let i=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return a==="i32"||a==="u32"?`atomicAdd(&${t}, bitcast<${a}>(${r}));`:`
              ${i}bitcast<${a}>(oldValue) + (${r})${s}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${r}));`:`
                ${i}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${r}));`:`${i}min(bitcast<${a}>(oldValue), (${r}))${s}`;case"mul":return`${i}(bitcast<${a}>(oldValue) * (${r}))${s}`;default:throw new Error(`Reduction ${e} is not supported.`)}},y$=(e,t)=>{let r=e[0].dims,a=e[1].dims,i=r,s=1,o=Math.ceil(G.size(a)/s),u=a[a.length-1],d=G.sizeFromDimension(r,u),p=[{type:12,data:o},{type:12,data:u},{type:12,data:d},..._e(e[1].dims,e[2].dims,i)],f=m=>{let g=Z("indices",e[1].dataType,e[1].dims.length),_=Z("updates",e[2].dataType,e[2].dims.length,s),v=t.reduction!=="none"&&t.reduction!==""?e3("output",e[0].dataType,i.length):fe("output",e[0].dataType,i.length,s);return`
      ${m.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,v)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    let n = ${G.size(a)};
    for (var i = 0; i < n; i = i + 1) {
      for (var j = i + 1; j < n; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    indices_start = 0u;
  }
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start + uniforms.last_index_dimension];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${g$(t.reduction,"output[data_offset + i]","value",v.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:f}},xS=e=>Ge({reduction:e.reduction}),kS=(e,t)=>{e.compute(y$(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),_$,v$,$$,Rc,w$,b$,x$,k$,S$,T$,C$,I$,Bc,E$,z$,A$,O$,R$,SS,TS,jA=te(()=>{be(),Ce(),tt(),Ae(),_$=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},v$=(e,t,r)=>{t.every(i=>i>=0&&i<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(r).fill(1);return t.forEach((i,s)=>a[i]=e[s]),a},$$=(e,t,r,a,i,s)=>{let[o,u,d]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],p=e[0].dims.length;if(o>0&&e.length>o&&e[o].dims.length>0)e[o].getFloat32Array().forEach(f=>s.push(f));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(f=>a.push(f)),a.length!==0&&a.length!==p&&r>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");_$(a,t),t.axes.length>0&&v$(a,t.axes,p).forEach((f,m)=>a[m]=f)}if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0&&(e[d].getBigInt64Array().forEach(f=>i.push(Number(f))),i.length!==0&&i.length!==p&&r>=18&&i.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof i<"u"&&a.length>0&&i.length>p)throw new Error("Resize requires only of scales or sizes to be specified")},Rc=(e,t,r,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${r}));
  let fract = ${a}(big % (${r})) / ${a}(${r});
  return whole + fract;
`,w$=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Rc("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Rc("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",b$=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",x$=(e,t,r)=>{let a=new Array(r).fill(0).concat(new Array(r).fill(1)),i=e.length===0?a:e.slice();return t.length>0?(t.forEach((s,o)=>{a[s]=i[o],a[o+r]=i[t.length+o]}),a):i},k$=(e,t,r,a)=>{let i=[];if(r.length>0)if(a.length>0){if(e.forEach(s=>i.push(s)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((s,o)=>i[s]=r[o])}else r.forEach(s=>i.push(s));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");i=e.map((s,o)=>Math.round(s*t[o]))}return i},S$=(e,t,r)=>{let a=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(s=>t[s]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(s=>t[s]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let i=e.slice();return r.axes.length>0?(r.axes.forEach(s=>t[s]=a),r.axes.forEach(s=>i[s]=Math.round(e[s]*t[s]))):(t.fill(a,0,t.length),i.forEach((s,o)=>i[o]=Math.round(s*t[o]))),i},T$=(e,t,r,a,i)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${ge("uniforms.scales","i",a)};
        var roi_low = ${ge("uniforms.roi","i",i)};
        var roi_hi = ${ge("uniforms.roi",`i + ${t.length}`,i)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${ge("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${ge("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,C$=(e,t,r,a,i,s,o)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${ge("uniforms.scales","i",i)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${ge("uniforms.roi","i",s)};
          var roi_hi = ${ge("uniforms.roi",`i + ${r.length}`,s)};
          var input_shape_i = ${ge("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${ge("uniforms.output_shape","i",a.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${o} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,I$=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${ge("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Bc=(e,t,r,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",E$=(e,t,r,a,i)=>{let[s,o,u,d]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",o,`max(0, min(row, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${Bc(e,d,s,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${o}];
      var col:${p} = originalIndices[${u}];
      ${a?`if (row < 0 || row > (${r[o]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${i};
      }`:""};
      row = max(0, min(row, ${r[o]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},z$=(e,t,r,a,i,s,o,u,d,p)=>{let f=r.length===2,[m,g]=f?[0,1]:[2,3],_=e.type.value,v=w=>{let k=w===m?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${_} {
        var output_index = ${t.indicesGet("output_indices",w)};
        var originalIdx: ${_} = getOriginalCoordinateFromResizedCoordinate(output_index, ${i[w]},
        ${a[w]}, ${r[w]}, ${s[w]}, ${s[w]} + ${r.length});
        var fractOriginalIdx: ${_} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[w]} - 1))) {
          return ${d};
        }
        var data: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${_} = originalIdx + ${_}(i);
          if (${k} < 0 || ${k} >= ${r[w]}) {
            ${p?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${d};`:`${k} = max(0, min(${k}, ${r[w]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",w,`u32(${k})`)};
          data[i + 1] = ${w===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${v(m)};
    ${v(g)};
  fn getCubicInterpolationCoefs(s: ${_}) -> array<${_}, 4> {
    var absS = abs(s);
    var coeffs: array<${_}, 4> = array<${_}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${_} = 1.0 - absS;
    var twoMinusAbsS: ${_} = 2.0 - absS;
    var onePlusAbsS: ${_} = 1.0 + absS;
    coeffs[0] = ((${o} * onePlusAbsS - 5 * ${o}) * onePlusAbsS + 8 * ${o}) * onePlusAbsS - 4 * ${o};
    coeffs[1] = ((${o} + 2) * absS - (${o} + 3)) * absS * absS + 1;
    coeffs[2] = ((${o} + 2) * oneMinusAbsS - (${o} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${o} * twoMinusAbsS - 5 * ${o}) * twoMinusAbsS + 8 * ${o}) * twoMinusAbsS - 4 * ${o};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${_}, 4>, coefs: array<${_}, 4>) -> ${_} {
    var coefsSum: ${_} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${_} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},A$=(e,t,r,a,i)=>{let[s,o,u,d,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",o,`max(0, min(depth, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(width, ${r[d]} - 1))`)};
      ${Bc(e,p,s,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${f} = originalIndices[${o}];
      var height:${f} = originalIndices[${u}];
      var width:${f} = originalIndices[${d}];
      ${a?`if (depth < 0 || depth > (${r[o]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[d]} - 1)) {
      return ${i};
        }`:""};

    depth = max(0, min(depth, ${r[o]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[d]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${f} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${f} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${f} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${f} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${f} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${f} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${f} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${f} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${f} = abs(depth - ${f}(depth1));
      var dx2: ${f} = abs(${f}(depth2) - depth);
      var dy1: ${f} = abs(height - ${f}(height1));
      var dy2: ${f} = abs(${f}(height2) - height);
      var dz1: ${f} = abs(width - ${f}(width1));
      var dz2: ${f} = abs(${f}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},O$=(e,t,r,a,i,s)=>{let o=e.dims,u=x$(s,t.axes,o.length),d=k$(o,a,i,t.axes),p=a.slice();a.length===0&&(p=o.map(($,S)=>$===0?1:d[S]/$),t.keepAspectRatioPolicy!=="stretch"&&(d=S$(o,p,t)));let f=fe("output",e.dataType,d.length),m=Z("input",e.dataType,o.length),g=G.size(d),_=o.length===d.length&&o.every(($,S)=>$===d[S]),v=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,k=m.type.value,b=$=>`
      ${_?"":`
      ${w$(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${I$(m,o)};
              ${b$(t.nearestMode,r,k)};
              ${C$(m,f,o,d,p.length,u.length,v)};
              `;case"linear":return`
              ${T$(f,o,d,p.length,u.length)};
              ${(()=>{if(o.length===2||o.length===4)return`${E$(m,f,o,v,w)}`;if(o.length===3||o.length===5)return`${A$(m,f,o,v,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(o.length===2||o.length===4)return`${z$(m,f,o,d,p,u,t.cubicCoeffA,v,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${$.registerUniform("output_size","u32").registerUniform("scales","f32",p.length).registerUniform("roi","f32",u.length).declareVariables(m,f)}
      ${$.mainStart()}
        ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${o.length===2||o.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${p.length>0?t.mode==="cubic"?p:p.length:""}|${i.length>0?i:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?o.length:o}`,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:p},{type:1,data:u},..._e(o,d)]})}},R$=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},SS=(e,t)=>{let r=[],a=[],i=[],s=R$(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");$$(e.inputs,t,s,r,a,i),e.compute(O$(e.inputs[0],t,s,r,a,i),{inputs:[0]})},TS=e=>{let t=e.antialias,r=e.axes,a=e.coordinateTransformMode,i=e.cubicCoeffA,s=e.excludeOutside!==0,o=e.extrapolationValue,u=e.keepAspectRatioPolicy,d=e.mode,p=e.nearestMode===""?"simple":e.nearestMode;return Ge({antialias:t,axes:r,coordinateTransformMode:a,cubicCoeffA:i,excludeOutside:s,extrapolationValue:o,keepAspectRatioPolicy:u,mode:d,nearestMode:p})}}),B$,N$,CS,LA=te(()=>{be(),Ce(),tt(),Ae(),B$=(e,t)=>{let[r,a,i,s]=e,{numHeads:o,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!G.areEqual(a.dims,[])&&!G.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(s.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!G.areEqual(i.dims,s.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&o===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let d=r.dims[0],p=r.dims[r.dims.length-2],f=i.dims[0],m=G.sizeFromDimension(r.dims,1)/p,g=u===0?i.dims[1]*2:m/o;if(u>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(d!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(p!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(g/2!==i.dims[1]&&u/2!==i.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${i.dims[1]}`);if(p>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},N$=(e,t)=>{let{interleaved:r,numHeads:a,rotaryEmbeddingDim:i,scale:s}=t,o=e[0].dims[0],u=G.sizeFromDimension(e[0].dims,1),d=e[0].dims[e[0].dims.length-2],p=u/d,f=e[2].dims[1],m=i===0?f*2:p/a,g=new Array(o,d,p/m,m-f),_=G.computeStrides(g),v=[{type:1,data:s},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,p,m,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,m,d*m,1]}):[],..._e(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=k=>{let b=Z("input",e[0].dataType,e[0].dims.length),$=Z("position_ids",e[1].dataType,e[1].dims.length),S=Z("cos_cache",e[2].dataType,e[2].dims.length),T=Z("sin_cache",e[3].dataType,e[3].dims.length),I=fe("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${k.declareVariables(b,$,S,T,I)}

        ${k.mainStart(pi)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${$.broadcastedIndicesToOffset("bsnh.xy",fe("",$.type.tensor,2))};
            let position_id =
                u32(${$.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${b.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${b.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${I.setByOffset("i","re")}
            let im = ${b.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${b.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${I.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${I.setByOffset("k",b.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Ge({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(G.size(g)/pi)},programUniforms:v})}},CS=(e,t)=>{B$(e.inputs,t),e.compute(N$(e.inputs,t))}}),M$,D$,IS,GA=te(()=>{be(),Ce(),Ae(),M$=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],a=e[2];if(t.dataType!==r.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let i=t.dims[t.dims.length-1],s=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==i)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==i)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let o=e[3];if(o.dims.length!==1)throw new Error("Beta must be 1D");if(o.dims[o.dims.length-1]!==i)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let o=e[4];if(o.dims.length!==1)throw new Error("Bias must be 1D");if(o.dims[o.dims.length-1]!==i)throw new Error("Bias must have the same hidden size as input")}},D$=(e,t,r,a)=>{let i=t.simplified,s=e[0].dims,o=G.size(s),u=s,d=o,p=s.slice(-1)[0],f=a?s.slice(0,-1).concat(1):[],m=!i&&e.length>3,g=e.length>4,_=a&&r>1,v=a&&r>2,w=r>3,k=64,b=Ye(p),$=[{type:12,data:d},{type:12,data:b},{type:12,data:p},{type:1,data:t.epsilon}],S=I=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],E=[Z("x",e[0].dataType,e[0].dims,b),Z("skip",e[1].dataType,e[1].dims,b),Z("gamma",e[2].dataType,e[2].dims,b)];m&&E.push(Z("beta",e[3].dataType,e[3].dims,b)),g&&E.push(Z("bias",e[4].dataType,e[4].dims,b)),E.push(fe("output",e[0].dataType,u,b)),_&&E.push(fe("mean_output",1,f)),v&&E.push(fe("inv_std_output",1,f)),w&&E.push(fe("input_skip_bias_sum",e[0].dataType,u,b));let B=pt(e[0].dataType),U=pt(1,b);return`

      ${I.registerUniforms(A).declareVariables(...E)}
      var<workgroup> sum_shared : array<${U}, ${k}>;
      var<workgroup> sum_squared_shared : array<${U}, ${k}>;

      ${I.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":B+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${ai(B,b,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Zr("sum",b)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Zr("square_sum",b)} / f32(uniforms.hidden_size) ${i?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${v?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${i?"":`- ${B}(mean)`}) *
            ${B}(inv_std_dev) * gamma[offset1d + i]
            ${m?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:u,dataType:e[0].dataType}];return r>1&&T.push({dims:f,dataType:1}),r>2&&T.push({dims:f,dataType:1}),r>3&&T.push({dims:s,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${b};${_};${v};${w}`,inputDependencies:e.map((I,A)=>"type")},getShaderSource:S,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(d/p)},programUniforms:$})}},IS=(e,t)=>{M$(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(D$(e.inputs,t,e.outputCount,!1),{outputs:r})}}),P$,Us,U$,Nc,W$,V$,ES,zS,FA=te(()=>{be(),Ce(),tt(),Ae(),P$=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},Us=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>r.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>r.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},U$=(e,t)=>{if(e.length>1){let r=Us(e,1),a=Us(e,2),i=Us(e,3);return i.length===0&&(i=[...Array(e[0].dims.length).keys()]),Ge({starts:r,ends:a,axes:i})}else return t},Nc=(e,t,r,a,i)=>{let s=e;return e<0&&(s+=r[a[t]]),i[t]<0?Math.max(0,Math.min(s,r[a[t]]-1)):Math.max(0,Math.min(s,r[a[t]]))},W$=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${ge("uniforms.input_shape","i",r.length)};
            let steps_i = ${ge("uniforms.steps","i",r.length)};
            let signs_i = ${ge("uniforms.signs","i",r.length)};
            let starts_i = ${ge("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,V$=(e,t)=>{let r=e[0].dims,a=G.size(r),i=t.axes.length>0?G.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],s=Us(e,4);s.forEach(b=>b!==0||(()=>{throw new Error("step cannot be 0")})),s.length===0&&(s=Array(i.length).fill(1));let o=t.starts.map((b,$)=>Nc(b,$,r,i,s)),u=t.ends.map((b,$)=>Nc(b,$,r,i,s));if(i.length!==o.length||i.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(i.length!==r.length)for(let b=0;b<r.length;++b)i.includes(b)||(o.splice(b,0,0),u.splice(b,0,r[b]),s.splice(b,0,1));let d=s.map(b=>Math.sign(b));s.forEach((b,$,S)=>{if(b<0){let T=(u[$]-o[$])/b,I=o[$],A=I+T*s[$];o[$]=A,u[$]=I,S[$]=-b}});let p=r.slice(0);i.forEach((b,$)=>{p[b]=Math.ceil((u[b]-o[b])/s[b])});let f={dims:p,dataType:e[0].dataType},m=fe("output",e[0].dataType,p.length),g=Z("input",e[0].dataType,e[0].dims.length),_=G.size(p),v=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:o.length},{name:"signs",type:"i32",length:d.length},{name:"steps",type:"u32",length:s.length}],w=[{type:12,data:_},{type:12,data:o},{type:6,data:d},{type:12,data:s},..._e(e[0].dims,p)],k=b=>`
      ${b.registerUniforms(v).declareVariables(g,m)}
        ${W$(g,m,r)}
        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${d.length}_${o.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:w})}},ES=(e,t)=>{P$(e.inputs,t);let r=U$(e.inputs,t);e.compute(V$(e.inputs,r),{inputs:[0]})},zS=e=>{let t=e.starts,r=e.ends,a=e.axes;return Ge({starts:t,ends:r,axes:a})}}),q$,j$,AS,OS,HA=te(()=>{be(),Ce(),tt(),Xr(),Ae(),q$=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},j$=(e,t)=>{let r=e.inputs[0],a=r.dims,i=G.size(a),s=a.length,o=G.normalizeAxis(t.axis,s),u=o<a.length-1,d,p=[];u?(p=Array.from({length:s},(E,B)=>B),p[o]=s-1,p[s-1]=o,d=e.compute(Mt(r,p),{inputs:[r],outputs:[-1]})[0]):d=r;let f=d.dims,m=f[s-1],g=i/m,_=Ye(m),v=m/_,w=64;g===1&&(w=256);let k=(E,B)=>B===4?`max(max(${E}.x, ${E}.y), max(${E}.z, ${E}.w))`:B===2?`max(${E}.x, ${E}.y)`:B===3?`max(max(${E}.x, ${E}.y), ${E}.z)`:E,b=Z("x",d.dataType,d.dims,_),$=fe("result",d.dataType,d.dims,_),S=b.type.value,T=pt(d.dataType)==="f32"?`var threadMax = ${S}(-3.402823e+38f);`:`var threadMax = ${S}(-65504.0h);`,I=E=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${E.registerUniform("packedCols","i32").declareVariables(b,$)}
      ${E.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${k("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${Zr("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${_};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:f,dataType:d.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:v}]}),getShaderSource:I},{inputs:[d],outputs:[u?-1:0]})[0];u&&e.compute(Mt(A,p),{inputs:[A]})},AS=(e,t)=>{q$(e.inputs),j$(e,t)},OS=e=>Ge({axis:e.axis})}),Mc,L$,G$,F$,RS,KA=te(()=>{be(),Ce(),Ae(),Mc=e=>Array.from(e.getBigInt64Array(),Number),L$=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Mc(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},G$=(e,t)=>{let r=[];for(let a=0;a<e.length;++a)r.push(e[a]*t[a]);return r},F$=(e,t)=>{let r=e[0].dims,a=t??Mc(e[1]),i=G$(r,a),s=G.size(i),o=e[0].dataType,u=Z("input",o,r.length),d=fe("output",o,i.length),p=f=>`
      const inputShape = ${u.indices(...r)};
      ${f.registerUniform("output_size","u32").declareVariables(u,d)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${d.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${d.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${d.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},..._e(e[0].dims,i)]}),getShaderSource:p}},RS=e=>{L$(e.inputs),e.compute(F$(e.inputs),{inputs:[0]})}}),H$,K$,BS,ZA=te(()=>{be(),Ce(),Ae(),H$=(e,t,r,a,i)=>{let s=fe("output_data",i,r.length,4),o=Z("a_data",t[1].dataType,t[1].dims.length,4),u=Z("b_data",t[2].dataType,t[2].dims.length,4),d=Z("c_data",t[0].dataType,t[0].dims.length,4),p,f=(m,g,_)=>`select(${g}, ${m}, ${_})`;if(!a)p=s.setByOffset("global_idx",f(o.getByOffset("global_idx"),u.getByOffset("global_idx"),d.getByOffset("global_idx")));else{let m=(g,_,v="")=>{let w=`a_data[index_a${_}][component_a${_}]`,k=`b_data[index_b${_}][component_b${_}]`,b=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${s.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${o.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_c${_} = ${d.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${v}(${f(w,k,b)});
          `};i===9?p=`
            var data = vec4<u32>(0);
            ${m("data",0,"u32")}
            ${m("data",1,"u32")}
            ${m("data",2,"u32")}
            ${m("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:p=`
            ${m("output_data[global_idx]",0)}
            ${m("output_data[global_idx]",1)}
            ${m("output_data[global_idx]",2)}
            ${m("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(d,o,u,s)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${p}
      }`},K$=e=>{let t=e[1].dims,r=e[2].dims,a=e[0].dims,i=e[1].dataType,s=!(G.areEqual(t,r)&&G.areEqual(r,a)),o=t,u=G.size(t);if(s){let p=di.calcShape(di.calcShape(t,r,!1),a,!1);if(!p)throw new Error("Can't perform where op on the given tensors");o=p,u=G.size(o)}let d=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:p=>H$(p,e,o,s,i),getRunData:()=>({outputs:[{dims:o,dataType:i}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:d},..._e(a,t,r,o)]})}},BS=e=>{e.compute(K$(e.inputs))}}),NS,QA=te(()=>{lA(),Ef(),dA(),pA(),cA(),hA(),fA(),vA(),wA(),bA(),xA(),kA(),SA(),TA(),CA(),IA(),EA(),zA(),AA(),OA(),RA(),BA(),NA(),MA(),DA(),tS(),PA(),UA(),WA(),VA(),qA(),If(),jA(),LA(),GA(),FA(),HA(),iS(),KA(),Xr(),zf(),ZA(),NS=new Map([["Abs",[E3]],["Acos",[z3]],["Acosh",[A3]],["Add",[pk]],["ArgMax",[S3,vh]],["ArgMin",[k3,vh]],["Asin",[O3]],["Asinh",[R3]],["Atan",[B3]],["Atanh",[N3]],["Attention",[T3]],["AveragePool",[hS,cS]],["BatchNormalization",[C3]],["BiasAdd",[I3]],["BiasSplitGelu",[dk]],["Cast",[D3,M3]],["Ceil",[U3]],["Clip",[P3]],["Concat",[wk,bk]],["Conv",[Sh,kh]],["ConvTranspose",[Ok,Ak]],["Cos",[W3]],["Cosh",[V3]],["CumSum",[Rk,Bk]],["DepthToSpace",[Nk,Mk]],["DequantizeLinear",[$S,wS]],["Div",[ck]],["Einsum",[Dk,Pk]],["Elu",[q3,Xs]],["Equal",[hk]],["Erf",[j3]],["Exp",[L3]],["Expand",[Uk]],["FastGelu",[Wk]],["Floor",[G3]],["FusedConv",[Sh,kh]],["Gather",[qk,Vk]],["GatherElements",[Kk,Hk]],["GatherBlockQuantized",[Gk,Fk]],["GatherND",[jk,Lk]],["Gelu",[F3]],["Gemm",[Qk,Zk]],["GlobalAveragePool",[mS,fS]],["GlobalMaxPool",[vS,_S]],["Greater",[yk]],["GreaterOrEqual",[vk]],["GridSample",[Xk,Jk]],["GroupQueryAttention",[nS]],["HardSigmoid",[ek,Y3]],["InstanceNormalization",[sS]],["LayerNormalization",[oS]],["LeakyRelu",[H3,Xs]],["Less",[_k]],["LessOrEqual",[$k]],["Log",[uk]],["MatMul",[uS]],["MatMulNBits",[lS,dS]],["MaxPool",[gS,yS]],["Mul",[fk]],["MultiHeadAttention",[eS,Yk]],["Neg",[Z3]],["Not",[K3]],["Pad",[pS]],["Pow",[mk]],["QuickGelu",[lk,Xs]],["Range",[bS]],["Reciprocal",[Q3]],["ReduceMin",[v3]],["ReduceMean",[f3]],["ReduceMax",[_3]],["ReduceSum",[w3]],["ReduceProd",[$3]],["ReduceL1",[m3]],["ReduceL2",[g3]],["ReduceLogSum",[x3]],["ReduceLogSumExp",[y3]],["ReduceSumSquare",[b3]],["Relu",[X3]],["Resize",[SS,TS]],["RotaryEmbedding",[CS]],["ScatterND",[kS,xS]],["Sigmoid",[J3]],["Sin",[tk]],["Sinh",[rk]],["Slice",[ES,zS]],["SkipLayerNormalization",[IS]],["Split",[rS,aS]],["Sqrt",[ak]],["Softmax",[AS,OS]],["Sub",[gk]],["Tan",[ik]],["Tanh",[nk]],["ThresholdedRelu",[ok,Xs]],["Tile",[RS]],["Transpose",[r3,a3]],["Where",[BS]]])}),MS,XA=te(()=>{gr(),Ur(),Ae(),MS=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,a,i){fr(e.programInfo.name);let s=this.backend.device,o=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let p of t)u.push({binding:u.length,resource:{buffer:p.buffer}});for(let p of r)u.push({binding:u.length,resource:{buffer:p.buffer}});i&&u.push({binding:u.length,resource:i});let d=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:d,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}o.setPipeline(e.computePipeline),o.setBindGroup(0,d),o.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),qt(e.programInfo.name)}dispose(){}build(e,t){fr(e.name);let r=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"},{feature:"subgroups-f16",extension:"subgroups_f16"}].forEach(p=>{r.features.has(p.feature)&&a.push(`enable ${p.extension};`)});let i=t3(t,this.backend.device.limits),s=e.getShaderSource(i),o=`${a.join(`
`)}
${i.additionalImplementations}
${s}`,u=r.createShaderModule({code:o,label:e.name});Pe("verbose",()=>`[WebGPU] ${e.name} shader code: ${o}`);let d=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return qt(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=i&&r<=i&&a<=i)return[t,r,a];let s=t*r*a,o=Math.ceil(Math.sqrt(s));if(o>i){if(o=Math.ceil(Math.cbrt(s)),o>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[o,o,o]}else return[o,o,1]}}}),Z$,Q$,X$,J$,DS,JA=te(()=>{gr(),be(),Ur(),Zx(),oA(),QA(),XA(),Z$=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let a=0;a<e.length;++a){let i=e[a].dataType;switch(t[a]){case"none":{r.push("");break}case"type":{r.push(`${i}`);break}case"rank":{let s=e[a].dims.length;r.push(`${i};${s}`);break}case"dims":{let s=e[a].dims.join(",");r.push(`${i};${s}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return r.join("|")},Q$=(e,t,r)=>{let a=e.name;return e.shaderCache?.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+r+`:${Z$(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,a},X$=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},J$=class{constructor(e){this.subgroupsSupported=e.features.has("subgroups"),this.subgroupsF16Supported=e.features.has("subgroups");let t=e.limits;!this.subgroupsSupported||!t.minSubgroupSize||!t.maxSubgroupSize?this.subgroupSizeRange=void 0:this.subgroupSizeRange=[t.minSubgroupSize,t.maxSubgroupSize]}},DS=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},i=s=>t.features.has(s)&&r.push(s)&&!0;i("chromium-experimental-timestamp-query-inside-passes")||i("timestamp-query"),i("shader-f16"),i("subgroups")&&i("subgroups-f16"),this.device=await t.requestDevice(a),this.deviceInfo=new J$(this.device),this.adapterInfo=new X$(t.info||await t.requestAdapterInfo()),this.gpuDataManager=Qx(this),this.programManager=new MS(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,kf(e.logLevel,!!e.debug),this.device.onuncapturederror=s=>{s.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${s.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;fr(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let a=0;a<t.length/2;a++){let i=r[a],s=i.kernelId,o=this.kernels.get(s),u=o.kernelType,d=o.kernelName,p=i.programName,f=i.inputTensorViews,m=i.outputTensorViews,g=t[a*2],_=t[a*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let v=Number(g-this.queryTimeBase),w=Number(_-this.queryTimeBase);if(!Number.isSafeInteger(v)||!Number.isSafeInteger(w))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(k=>({dims:k.dims,dataType:Ra(k.dataType)})),outputsMetadata:m.map(k=>({dims:k.dims,dataType:Ra(k.dataType)})),kernelId:s,kernelType:u,kernelName:d,programName:p,startTime:v,endTime:w});else{let k="";f.forEach(($,S)=>{k+=`input[${S}]: [${$.dims}] | ${Ra($.dataType)}, `});let b="";m.forEach(($,S)=>{b+=`output[${S}]: [${$.dims}] | ${Ra($.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${d}|${p}" ${k}${b}execution time: ${w-v} ns`)}wo("GPU",`${p}::${g}::${_}`)}e.unmap(),this.pendingQueries.delete(e)}),qt()}run(e,t,r,a,i,s){fr(e.name);let o=[];for(let $=0;$<t.length;++$){let S=t[$].data;if(S===0)continue;let T=this.gpuDataManager.get(S);if(!T)throw new Error(`no GPU data for input: ${S}`);o.push(T)}let{outputs:u,dispatchGroup:d,programUniforms:p}=e.getRunData(t),f=r.length===0?u.map(($,S)=>S):r;if(f.length!==u.length)throw new Error(`Output size ${f.length} must be equal to ${u.length}.`);let m=[],g=[];for(let $=0;$<u.length;++$){if(!Number.isInteger(f[$])||f[$]<-3||f[$]>=s)throw new Error(`Invalid output index: ${f[$]}`);if(f[$]===-3)continue;let S=f[$]===-1,T=f[$]===-2,I=S||T?i(u[$].dataType,u[$].dims):a(f[$],u[$].dataType,u[$].dims);if(m.push(I),I.data===0)continue;let A=this.gpuDataManager.get(I.data);if(!A)throw new Error(`no GPU data for output: ${I.data}`);if(S&&this.temporaryData.push(A),T){let E=this.kernelPersistentData.get(this.currentKernelId);E||(E=[],this.kernelPersistentData.set(this.currentKernelId,E)),E.push(A)}g.push(A)}if(o.length!==t.length||g.length!==m.length){if(g.length===0)return qt(e.name),m;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(p){let $=0,S=[];p.forEach(E=>{let B=typeof E.data=="number"?[E.data]:E.data;if(B.length===0)return;let U=E.type===10?2:4,j,W;E.type===10?(W=B.length>4?16:B.length>2?8:B.length*U,j=B.length>4?16:U*B.length):(W=B.length<=2?B.length*U:16,j=16),$=Math.ceil($/W)*W,S.push($);let J=E.type===10?8:4;$+=B.length>4?Math.ceil(B.length/J)*j:B.length*U});let T=16;$=Math.ceil($/T)*T;let I=new ArrayBuffer($);p.forEach((E,B)=>{let U=S[B],j=typeof E.data=="number"?[E.data]:E.data;if(E.type===6)new Int32Array(I,U,j.length).set(j);else if(E.type===12)new Uint32Array(I,U,j.length).set(j);else if(E.type===10)new Uint16Array(I,U,j.length).set(j);else if(E.type===1)new Float32Array(I,U,j.length).set(j);else throw new Error(`Unsupported uniform type: ${Ra(E.type)}`)});let A=this.gpuDataManager.create($,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,I,0,$),this.gpuDataManager.release(A.id),_={offset:0,size:$,buffer:A.buffer}}let v=this.programManager.normalizeDispatchGroupSize(d),w=v[1]===1&&v[2]===1,k=Q$(e,t,w),b=this.programManager.getArtifact(k);if(b||(b=this.programManager.build(e,v),this.programManager.setArtifact(k,b),Pe("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),p&&b.uniformVariablesInfo){if(p.length!==b.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${b.uniformVariablesInfo.length}, got ${p.length} in program "${b.programInfo.name}".`);for(let $=0;$<p.length;$++){let S=p[$],T=S.type,I=typeof S.data=="number"?1:S.data.length,[A,E]=b.uniformVariablesInfo[$];if(T!==A||I!==E)throw new Error(`Uniform variable ${$} mismatch: expect type ${A} with size ${E}, got type ${T} with size ${I} in program "${b.programInfo.name}".`)}}if(Pe("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${v[0]}x${v[1]}x${v[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let $={kernelId:this.currentKernelId,programName:b.programInfo.name,inputTensorViews:t,outputTensorViews:m};this.pendingKernels.push($),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push($)}return this.programManager.run(b,o,g,v,_),qt(e.name),m}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,a){let i=NS.get(e);if(!i)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:a,kernelEntry:i[0],attributes:[i[1],r]};this.kernels.set(t,s)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let i=a.kernelType,s=a.kernelName,o=a.kernelEntry,u=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),Pe("info",()=>`[WebGPU] Start to run kernel "[${i}] ${s}"...`);let d=this.env.debug;this.temporaryData=[];try{return d&&this.device.pushErrorScope("validation"),o(t,u[1]),0}catch(p){return r.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${s}" failed. ${p}`)),1}finally{d&&r.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${i}] ${s}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,a){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let s=i.get(t),o=this.gpuDataManager.registerExternalBuffer(r,a,s);return i.set(t,[o,r]),o}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let a=await gh(this,e,t);return Sf(a.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){Pe("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){Pe("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){Pe("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let a=0;a<r;a++){let i=this.getComputePassEncoder(),s=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(s.computePipeline),i.setBindGroup(0,s.bindGroup),i.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Y$,Dc,ew,Pc,Uc,Wc,tw,PS,YA=te(()=>{Ur(),Y$=1,Dc=()=>Y$++,ew=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Pc=(e,t)=>{let r=ew.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((a,i)=>a*i)*r/8):0},Uc=class{constructor(e){this.sessionId=e.sessionId,this.mlContext=e.context,this.mlTensor=e.tensor,this.dataType=e.dataType,this.tensorShape=e.shape}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return Pc(this.dataType,this.tensorShape)}destroy(){Pe("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((a,i)=>a===r[i])}},Wc=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,a){let i=this.tensorManager.getMLContext(e);if(this.wrapper){if(this.wrapper.canReuseTensor(i,t,r))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==Pc(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){if(this.wrapper)if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(e);return}else Pe("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(e):this.activeUpload=new Uint8Array(e)}async download(e){if(this.activeUpload)if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(this.activeUpload):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(this.activeUpload);return}else return this.activeUpload.buffer;if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},tw=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=Dc();return this.tensorTrackersById.set(e,new Wc(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,a,i){Pe("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${a}, copyOld: ${i}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,a,i)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){Pe("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,a){let i=this.getMLContext(e),s=Dc(),o=new Uc({sessionId:e,context:i,tensor:t,dataType:r,shape:a});return this.tensorTrackersById.set(s,new Wc(this,o)),this.externalTensors.add(o),s}async getCachedTensor(e,t,r,a,i,s){let o=this.getMLContext(e);for(let[d,p]of this.freeTensors.entries())if(p.canReuseTensor(o,t,r)){Pe("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, shape: ${r}}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}Pe("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, shape: ${r}}`);let u=await o.createTensor({dataType:t,shape:r,dimensions:r,usage:a,writable:i,readable:s});return new Uc({sessionId:e,context:o,tensor:u,dataType:t,shape:r})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},PS=(...e)=>new tw(...e)}),Qo,rw,US,e4=te(()=>{be(),Ka(),Zx(),YA(),Ur(),Qo=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),rw=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),a=Object.keys(t).sort();return r.length===a.length&&r.every((i,s)=>i===a[s]&&e[i]===t[i])},US=class{constructor(e){this.tensorManager=PS(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,kf(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){Pe("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){Pe("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)Pe("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let r=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(r=>rw(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(i=>i.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){Pe("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,a,i){let s=Qo.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,a,i)}async createTemporaryTensor(e,t,r){Pe("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let a=Qo.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,a,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,t){if(!lt().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");Pe("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Sf(r,t)}}registerMLTensor(e,t,r,a){let i=Qo.get(r);if(!i)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,i,a);return Pe("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${i}, dimensions: ${a}} -> {tensorId: ${s}}`),s}registerMLConstant(e,t,r,a,i,s){if(!s)throw new Error("External mounted files are not available.");let o=e;e.startsWith("./")&&(o=e.substring(2));let u=s.get(o);if(!u)throw new Error(`File with name ${o} not found in preloaded files.`);if(t+r>u.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=u.slice(t,t+r).buffer,p;switch(i.dataType){case"float32":p=new Float32Array(d);break;case"float16":p=new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return Pe("verbose",()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}}`),a.constant(i,p)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}flush(){}}}),WS={};So(WS,{init:()=>VS});var Xo,aw,VS,t4=te(()=>{be(),JA(),Ur(),Ce(),e4(),Xo=class qS{constructor(t,r,a,i){this.module=t,this.dataType=r,this.data=a,this.dims=i}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=G.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=G.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=G.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=G.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(G.size(t)!==G.size(this.dims))throw new Error("Invalid new shape");return new qS(this.module,this.dataType,this.data,t)}},aw=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceInfo=t.deviceInfo;let a=e.PTR_SIZE,i=r/e.PTR_SIZE,s=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*i++,s));let o=Number(e.getValue(a*i++,s));this.outputCount=Number(e.getValue(a*i++,s)),this.customDataOffset=Number(e.getValue(a*i++,"*")),this.customDataSize=Number(e.getValue(a*i++,s));let u=[];for(let d=0;d<o;d++){let p=Number(e.getValue(a*i++,s)),f=Number(e.getValue(a*i++,"*")),m=Number(e.getValue(a*i++,s)),g=[];for(let _=0;_<m;_++)g.push(Number(e.getValue(a*i++,s)));u.push(new Xo(e,p,f,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(o=>typeof o=="number"?this.inputs[o]:o)??this.inputs,a=t?.outputs??[],i=(o,u,d)=>new Xo(this.module,u,this.output(o,d),d),s=(o,u)=>{let d=Ba(o,u);if(!d)throw new Error(`Unsupported data type: ${o}`);let p=d>0?this.backend.gpuDataManager.create(d).id:0;return new Xo(this.module,o,p,u)};return this.backend.run(e,r,a,i,s,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let a=this.module.PTR_SIZE,i=a===4?"i32":"i64",s=this.module.stackAlloc((1+t.length)*a);this.module.setValue(s,t.length,i);for(let o=0;o<t.length;o++)this.module.setValue(s+a*(o+1),t[o],i);return this.module._JsepOutput(this.opKernelContext,e,s)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(r)}}},VS=async(e,t,r,a)=>{let i=t.jsepInit;if(!i)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let s=new DS;await s.initialize(r,a),i("webgpu",[s,o=>s.alloc(Number(o)),o=>s.free(o),(o,u,d,p=!1)=>{if(p)Pe("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(d)}`),s.memcpy(Number(o),Number(u));else{Pe("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(d));s.upload(Number(u),f)}},async(o,u,d)=>{Pe("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${d}`),await s.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+d)>>>0))},(o,u,d)=>s.createKernel(o,Number(u),d,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>s.releaseKernel(o),(o,u,d,p)=>{Pe("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${o}, contextDataOffset=${u}`);let f=new aw(t,s,Number(u));return s.computeKernel(Number(o),f,p)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let s=new US(r);i("webnn",[s,()=>s.reserveTensorId(),o=>s.releaseTensorId(o),async(o,u,d,p,f)=>s.ensureTensor(o,u,d,p,f),(o,u)=>{s.uploadTensor(o,u)},async(o,u)=>s.downloadTensor(o,u)])}}}),iw,Mf,Df,Lr,nw,Iu,Pf,Uf,Vc,Wf,Vf,qf,jS=te(()=>{nA(),sA(),be(),Ka(),vf(),Kx(),iw=(e,t)=>{lt()._OrtInit(e,t)!==0&&je("Can't initialize onnxruntime.")},Mf=async e=>{iw(e.wasm.numThreads,ku(e.logLevel))},Df=async(e,t)=>{{let r=(t4(),bu(WS)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let a=e.webgpu.adapter;if(a){if(typeof a.limits!="object"||typeof a.features!="object"||typeof a.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let i=e.webgpu.powerPreference;if(i!==void 0&&i!=="low-power"&&i!=="high-performance")throw new Error(`Invalid powerPreference setting: "${i}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(a=await navigator.gpu.requestAdapter({powerPreference:i,forceFallbackAdapter:s}),!a)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",lt(),e,a)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",lt(),e)}}},Lr=new Map,nw=e=>{let t=lt(),r=t.stackSave();try{let a=t.PTR_SIZE,i=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,i,i+a)!==0&&je("Can't get session input/output count.");let s=a===4?"i32":"i64";return[Number(t.getValue(i,s)),Number(t.getValue(i+a,s))]}finally{t.stackRestore(r)}},Iu=e=>{let t=lt(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},Pf=async(e,t)=>{let r,a,i=lt();Array.isArray(e)?[r,a]=e:e.buffer===i.HEAPU8.buffer?[r,a]=[e.byteOffset,e.byteLength]:[r,a]=Iu(e);let s=0,o=0,u=0,d=[],p=[],f=[];try{if([o,d]=Hx(t),t?.externalData&&i.mountExternalData){let $=[];for(let S of t.externalData){let T=typeof S=="string"?S:S.path;$.push(xf(typeof S=="string"?S:S.data).then(I=>{i.mountExternalData(T,I)}))}await Promise.all($)}for(let $ of t?.executionProviders??[])if((typeof $=="string"?$:$.name)==="webnn"){if(i.shouldTransferToMLTensor=!1,typeof $!="string"){let S=$,T=S?.context,I=S?.gpuDevice,A=S?.deviceType,E=S?.powerPreference;T?i.currentContext=T:I?i.currentContext=await i.jsepCreateMLContext(I):i.currentContext=await i.jsepCreateMLContext({deviceType:A,powerPreference:E})}else i.currentContext=await i.jsepCreateMLContext();break}s=await i._OrtCreateSession(r,a,o),s===0&&je("Can't create a session."),i.jsepOnCreateSession?.(),i.currentContext&&(i.jsepRegisterMLContext(s,i.currentContext),i.currentContext=void 0,i.shouldTransferToMLTensor=!0);let[m,g]=nw(s),_=!!t?.enableGraphCapture,v=[],w=[],k=[];for(let $=0;$<m;$++){let S=i._OrtGetInputName(s,$);S===0&&je("Can't get an input name."),p.push(S),v.push(i.UTF8ToString(S))}for(let $=0;$<g;$++){let S=i._OrtGetOutputName(s,$);S===0&&je("Can't get an output name."),f.push(S);let T=i.UTF8ToString(S);w.push(T);{if(_&&t?.preferredOutputLocation===void 0){k.push("gpu-buffer");continue}let I=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[T]??"cpu";if(I!=="cpu"&&I!=="cpu-pinned"&&I!=="gpu-buffer"&&I!=="ml-tensor")throw new Error(`Not supported preferred output location: ${I}.`);if(_&&I!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${I}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);k.push(I)}}let b=null;return k.some($=>$==="gpu-buffer"||$==="ml-tensor")&&(u=i._OrtCreateBinding(s),u===0&&je("Can't create IO binding."),b={handle:u,outputPreferredLocations:k,outputPreferredLocationsEncoded:k.map($=>mh($))}),Lr.set(s,[s,p,f,b,_,!1]),[s,v,w]}catch(m){throw p.forEach(g=>i._OrtFree(g)),f.forEach(g=>i._OrtFree(g)),u!==0&&i._OrtReleaseBinding(u)!==0&&je("Can't release IO binding."),s!==0&&i._OrtReleaseSession(s)!==0&&je("Can't release session."),m}finally{i._free(r),o!==0&&i._OrtReleaseSessionOptions(o)!==0&&je("Can't release session options."),d.forEach(m=>i._free(m)),i.unmountExternalData?.()}},Uf=e=>{let t=lt(),r=Lr.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,i,s,o,u]=r;o&&(u&&t._OrtClearBoundOutputs(o.handle)!==0&&je("Can't clear bound outputs."),t._OrtReleaseBinding(o.handle)!==0&&je("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),i.forEach(d=>t._OrtFree(d)),s.forEach(d=>t._OrtFree(d)),t._OrtReleaseSession(a)!==0&&je("Can't release session."),Lr.delete(e)},Vc=async(e,t,r,a,i,s=!1)=>{if(!e){t.push(0);return}let o=lt(),u=o.PTR_SIZE,d=e[0],p=e[1],f=e[3],m=f,g,_;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let k=e[2].gpuBuffer;_=Ba(ei(d),p);let b=o.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=b(a,i,k,_)}else if(f==="ml-tensor"){let k=e[2].mlTensor;_=Ba(ei(d),p);let b=o.jsepRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=b(a,k,ei(d),p)}else{let k=e[2];if(Array.isArray(k)){_=u*k.length,g=o._malloc(_),r.push(g);for(let b=0;b<k.length;b++){if(typeof k[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);o.setValue(g+b*u,wt(k[b],r),"*")}}else{let b=o.jsepIsGraphInput;if(d!=="string"&&b){let $=o._OrtGetInputName(a,i),S=o.UTF8ToString($);if(b(a,S)){let T=ei(d);_=Ba(T,p),m="ml-tensor";let I=o.jsepCreateTemporaryTensor,A=o.jsepUploadTensor;if(!I||!A)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let E=await I(a,T,p);A(E,new Uint8Array(k.buffer,k.byteOffset,k.byteLength)),g=E}else _=k.byteLength,g=o._malloc(_),r.push(g),o.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}else _=k.byteLength,g=o._malloc(_),r.push(g),o.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,_),g)}}let v=o.stackSave(),w=o.stackAlloc(4*p.length);try{p.forEach((b,$)=>o.setValue(w+$*u,b,u===4?"i32":"i64"));let k=o._OrtCreateTensor(ei(d),g,_,w,p.length,mh(m));k===0&&je(`Can't create tensor for input/output. session=${a}, index=${i}.`),t.push(k)}finally{o.stackRestore(v)}},Wf=async(e,t,r,a,i,s)=>{let o=lt(),u=o.PTR_SIZE,d=Lr.get(e);if(!d)throw new Error(`cannot run inference. invalid session id: ${e}`);let p=d[0],f=d[1],m=d[2],g=d[3],_=d[4],v=d[5],w=t.length,k=a.length,b=0,$=[],S=[],T=[],I=[],A=o.stackSave(),E=o.stackAlloc(w*u),B=o.stackAlloc(w*u),U=o.stackAlloc(k*u),j=o.stackAlloc(k*u);try{[b,$]=Fx(s);for(let P=0;P<w;P++)await Vc(r[P],S,I,e,t[P],_);for(let P=0;P<k;P++)await Vc(i[P],T,I,e,w+a[P],_);for(let P=0;P<w;P++)o.setValue(E+P*u,S[P],"*"),o.setValue(B+P*u,f[t[P]],"*");for(let P=0;P<k;P++)o.setValue(U+P*u,T[P],"*"),o.setValue(j+P*u,m[a[P]],"*");if(g&&!v){let{handle:P,outputPreferredLocations:se,outputPreferredLocationsEncoded:ue}=g;if(f.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${f.length}).`);for(let F=0;F<w;F++){let oe=t[F];await o._OrtBindInput(P,f[oe],S[F])!==0&&je(`Can't bind input[${F}] for session=${e}.`)}for(let F=0;F<k;F++){let oe=a[F];i[F]?.[3]?o._OrtBindOutput(P,m[oe],T[F],0)!==0&&je(`Can't bind pre-allocated output[${F}] for session=${e}.`):o._OrtBindOutput(P,m[oe],0,ue[oe])!==0&&je(`Can't bind output[${F}] to ${se[F]} for session=${e}.`)}Lr.set(e,[p,f,m,g,_,!0])}o.jsepOnRunStart?.(p);let W;g?W=await o._OrtRunWithBinding(p,g.handle,k,U,b):W=await o._OrtRun(p,B,E,w,j,k,U,b),W!==0&&je("failed to call OrtRun().");let J=[];for(let P=0;P<k;P++){let se=Number(o.getValue(U+P*u,"*"));if(se===T[P]){J.push(i[P]);continue}let ue=o.stackSave(),F=o.stackAlloc(4*u),oe=!1,le,H=0;try{o._OrtGetTensorData(se,F,F+u,F+2*u,F+3*u)!==0&&je(`Can't access output tensor data on index ${P}.`);let de=u===4?"i32":"i64",M=Number(o.getValue(F,de));H=o.getValue(F+u,"*");let V=o.getValue(F+u*2,"*"),R=Number(o.getValue(F+u*3,de)),X=[];for(let Ne=0;Ne<R;Ne++)X.push(Number(o.getValue(V+Ne*u,de)));o._OrtFree(V)!==0&&je("Can't free memory for tensor dims.");let Ie=X.reduce((Ne,Ee)=>Ne*Ee,1);le=Ra(M);let Fe=g?.outputPreferredLocations[a[P]];if(le==="string"){if(Fe==="gpu-buffer"||Fe==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ne=[];for(let Ee=0;Ee<Ie;Ee++){let Me=o.getValue(H+Ee*u,"*"),wr=o.getValue(H+(Ee+1)*u,"*"),Lt=Ee===Ie-1?void 0:wr-Me;Ne.push(o.UTF8ToString(Me,Lt))}J.push([le,X,Ne,"cpu"])}else if(Fe==="gpu-buffer"&&Ie>0){let Ne=o.jsepGetBuffer;if(!Ne)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Ee=Ne(H),Me=Ba(M,Ie);if(Me===void 0||!wf(le))throw new Error(`Unsupported data type: ${le}`);oe=!0,J.push([le,X,{gpuBuffer:Ee,download:o.jsepCreateDownloader(Ee,Me,le),dispose:()=>{o._OrtReleaseTensor(se)!==0&&je("Can't release tensor.")}},"gpu-buffer"])}else if(Fe==="ml-tensor"&&Ie>0){let Ne=o.jsepEnsureTensor;if(!Ne)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ba(M,Ie)===void 0||!bf(le))throw new Error(`Unsupported data type: ${le}`);let Ee=await Ne(e,H,M,X,!1);oe=!0,J.push([le,X,{mlTensor:Ee,download:o.jsepCreateMLTensorDownloader(H,le),dispose:()=>{o.jsepReleaseTensorId(H),o._OrtReleaseTensor(se)}},"ml-tensor"])}else{let Ne=$f(le),Ee=new Ne(Ie);new Uint8Array(Ee.buffer,Ee.byteOffset,Ee.byteLength).set(o.HEAPU8.subarray(H,H+Ee.byteLength)),J.push([le,X,Ee,"cpu"])}}finally{o.stackRestore(ue),le==="string"&&H&&o._free(H),oe||o._OrtReleaseTensor(se),o.jsepOnRunEnd?.(p)}}return g&&!_&&(o._OrtClearBoundOutputs(g.handle)!==0&&je("Can't clear bound outputs."),Lr.set(e,[p,f,m,g,_,!1])),J}finally{o.stackRestore(A),S.forEach(W=>o._OrtReleaseTensor(W)),T.forEach(W=>o._OrtReleaseTensor(W)),I.forEach(W=>o._free(W)),b!==0&&o._OrtReleaseRunOptions(b),$.forEach(W=>o._free(W))}},Vf=e=>{let t=lt(),r=Lr.get(e);if(!r)throw new Error("invalid session id");let a=r[0],i=t._OrtEndProfiling(a);i===0&&je("Can't get an profile file name."),t._OrtFree(i)},qf=e=>{let t=[];for(let r of e){let a=r[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),Gr,Pt,Xa,Ws,Vs,Jo,qc,Yo,Ca,Ia,sw,LS,GS,FS,HS,KS,ZS,QS,XS=te(()=>{gr(),jS(),Ka(),yf(),Gr=()=>!!Ze.wasm.proxy&&typeof document<"u",Xa=!1,Ws=!1,Vs=!1,Yo=new Map,Ca=(e,t)=>{let r=Yo.get(e);r?r.push(t):Yo.set(e,[t])},Ia=()=>{if(Xa||!Ws||Vs||!Pt)throw new Error("worker not ready")},sw=e=>{switch(e.data.type){case"init-wasm":Xa=!1,e.data.err?(Vs=!0,qc[1](e.data.err)):(Ws=!0,qc[0]()),Jo&&(URL.revokeObjectURL(Jo),Jo=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Yo.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},LS=async()=>{if(!Ws){if(Xa)throw new Error("multiple calls to 'initWasm()' detected.");if(Vs)throw new Error("previous call to 'initWasm()' failed.");if(Xa=!0,Gr())return new Promise((e,t)=>{Pt?.terminate(),Lx().then(([r,a])=>{try{Pt=a,Pt.onerror=s=>t(s),Pt.onmessage=sw,qc=[e,t];let i={type:"init-wasm",in:Ze};!i.in.wasm.wasmPaths&&(r||import.meta.url?.startsWith("file:"))&&(i.in.wasm.wasmPaths={wasm:new URL("/assets/ort-wasm-simd-threaded.jsep-D5Jk56-t.wasm",import.meta.url).href}),Pt.postMessage(i),Jo=r}catch(i){t(i)}},t)});try{await _f(Ze.wasm),await Mf(Ze),Ws=!0}catch(e){throw Vs=!0,e}finally{Xa=!1}}},GS=async e=>{if(Gr())return Ia(),new Promise((t,r)=>{Ca("init-ep",[t,r]);let a={type:"init-ep",in:{epName:e,env:Ze}};Pt.postMessage(a)});await Df(Ze,e)},FS=async e=>Gr()?(Ia(),new Promise((t,r)=>{Ca("copy-from",[t,r]);let a={type:"copy-from",in:{buffer:e}};Pt.postMessage(a,[e.buffer])})):Iu(e),HS=async(e,t)=>{if(Gr()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Ia(),new Promise((r,a)=>{Ca("create",[r,a]);let i={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),Pt.postMessage(i,s)})}else return Pf(e,t)},KS=async e=>{if(Gr())return Ia(),new Promise((t,r)=>{Ca("release",[t,r]);let a={type:"release",in:e};Pt.postMessage(a)});Uf(e)},ZS=async(e,t,r,a,i,s)=>{if(Gr()){if(r.some(o=>o[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(i.some(o=>o))throw new Error("pre-allocated output tensor is not supported for proxy.");return Ia(),new Promise((o,u)=>{Ca("run",[o,u]);let d=r,p={type:"run",in:{sessionId:e,inputIndices:t,inputs:d,outputIndices:a,options:s}};Pt.postMessage(p,qf(d))})}else return Wf(e,t,r,a,i,s)},QS=async e=>{if(Gr())return Ia(),new Promise((t,r)=>{Ca("end-profiling",[t,r]);let a={type:"end-profiling",in:e};Pt.postMessage(a)});Vf(e)}}),jc,ow,JS,r4=te(()=>{gr(),XS(),be(),gf(),Kx(),jc=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},ow=e=>{switch(e[3]){case"cpu":return new dr(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!wf(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:a,dispose:i}=e[2];return dr.fromGpuBuffer(r,{dataType:t,dims:e[1],download:a,dispose:i})}case"ml-tensor":{let t=e[0];if(!bf(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:a,dispose:i}=e[2];return dr.fromMLTensor(r,{dataType:t,dims:e[1],download:a,dispose:i})}default:throw new Error(`invalid data location: ${e[3]}`)}},JS=class{async fetchModelAndCopyToWasmMemory(e){return FS(await xf(e))}async loadModel(e,t){fr();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames]=await HS(r,t),qt()}async dispose(){return KS(this.sessionId)}async run(e,t,r){fr();let a=[],i=[];Object.entries(e).forEach(m=>{let g=m[0],_=m[1],v=this.inputNames.indexOf(g);if(v===-1)throw new Error(`invalid input '${g}'`);a.push(_),i.push(v)});let s=[],o=[];Object.entries(t).forEach(m=>{let g=m[0],_=m[1],v=this.outputNames.indexOf(g);if(v===-1)throw new Error(`invalid output '${g}'`);s.push(_),o.push(v)});let u=a.map((m,g)=>jc(m,()=>`input "${this.inputNames[i[g]]}"`)),d=s.map((m,g)=>m?jc(m,()=>`output "${this.outputNames[o[g]]}"`):null),p=await ZS(this.sessionId,i,u,o,d,r),f={};for(let m=0;m<p.length;m++)f[this.outputNames[o[m]]]=s[m]??ow(p[m]);return qt(),f}startProfiling(){}endProfiling(){QS(this.sessionId)}}}),YS={};So(YS,{OnnxruntimeWebAssemblyBackend:()=>Ih,initializeFlags:()=>Ch,wasmBackend:()=>eT});var Ch,Ih,eT,a4=te(()=>{gr(),XS(),r4(),Ch=()=>{if((typeof Ze.wasm.initTimeout!="number"||Ze.wasm.initTimeout<0)&&(Ze.wasm.initTimeout=0),Ze.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof Ze.wasm.proxy!="boolean"&&(Ze.wasm.proxy=!1),typeof Ze.wasm.trace!="boolean"&&(Ze.wasm.trace=!1),typeof Ze.wasm.numThreads!="number"||!Number.isInteger(Ze.wasm.numThreads)||Ze.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Ze.wasm.numThreads=1;else{let e=typeof navigator>"u"?qz("node:os").cpus().length:navigator.hardwareConcurrency;Ze.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},Ih=class{async init(e){Ch(),await LS(),await GS(e)}async createInferenceSessionHandler(e,t){let r=new JS;return await r.loadModel(e,t),Promise.resolve(r)}},eT=new Ih});gr();gr();gr();var i4="1.21.0",n4=Px;{let e=(a4(),bu(YS)).wasmBackend;Ma("webgpu",e,5),Ma("webnn",e,5),Ma("cpu",e,10),Ma("wasm",e,10)}Object.defineProperty(Ze.versions,"web",{value:i4,enumerable:!0});const s4=Object.freeze(Object.defineProperty({__proto__:null,get InferenceSession(){return mf},get TRACE(){return wo},get TRACE_FUNC_BEGIN(){return fr},get TRACE_FUNC_END(){return qt},get Tensor(){return dr},default:n4,get env(){return Ze},get registerBackend(){return Ma}},Symbol.toStringTag,{value:"Module"}));export{p4 as alphamask,c4 as applySegmentationMask,u4 as preload,l4 as removeBackground,d4 as removeForeground,gE as segmentForeground};
