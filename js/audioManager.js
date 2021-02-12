(function(g){function h(){}function k(a,b,d){this.context=a;this.urlList=b;this.onload=d;this.bufferList=[];this.loadCount=0}function f(a){a=a||{};n||console.warn("not support user media");void 0===a.autoLoop&&(a.autoLoop=!0);this.context=null;this.sources={};this.analysers={};this.gains={};this.panners={};this.state={};this.fps=a.fps||60;this.fftSize=a.fftSize||2048;this.onEnterFrame=a.onEnterFrame||j;this.onInit=a.onInit||j;this.onMicInitSuccess=a.onMicInitSuccess||j;this.onMicInitFaild=a.onMicInitFaild||
j;this.onLoaded=a.onLoaded||j;this.autoLooop=!!a.autoLoop;this.useMicrophone=!!a.useMicrophone;this.isReady=this.isLoop=!1;this.buffers=null}function v(){for(var a=g.Utils,b=this.buffers.bufferList.length,d=0;d<b;d++){var c=this.sources[d]||d,e="";"object"===typeof c?e=c.name:(e=c,c=a.apply({},{name:e,loop:!0,sound:!0}));this.sources[e]=p.apply(this,[c,d]);this.analysers[e]=q.apply(this,[c]);if(c.gain||"number"===typeof c.volume)this.gains[e]=r.apply(this,[c]);c.panner&&(this.panners[e]=w.apply(this,
[c]));this.sources instanceof Array||delete this.sources[d]}this.isReady=!0;if("function"===typeof this.onLoaded)this.onLoaded()}function p(a,b){var d=g.Utils,c=this.context.createBufferSource();c.buffer=this.buffers.bufferList[b];c.loop=a.loop;a.gain?(c.start=c.start||c.noteGainOn,c.stop=c.stop||c.noteGainOff):(c.start=c.start||c.noteOn,c.stop=c.stop||c.noteOff);this.state[a.name]=d.applyIf(this.state[a.name]||a||{},{index:b,isReset:!0,playing:!1,startTime:0,pauseTime:0,retryTime:0,offsetTime:0,
pitch:1,volume:0.5});c.playbackRate.value=this.state[a.name].pitch;return c}function q(a){var b;return void 0===this.analysers[a.name]?(b=this.context.createAnalyser(),b.fftSize=a.fftSize||this.fftSize,{a:b,getByteTimeDomainData:function(a){var b=this.a,e=b.frequencyBinCount;a=new Uint8Array(a||e);b.getByteTimeDomainData(a);return a},getByteFrequencyData:function(a){var b=this.a,e=b.frequencyBinCount;a=new Uint8Array(a||e);b.getByteFrequencyData(a);return a},getFloatFrequencyData:function(a){var b=
this.a,e=b.frequencyBinCount;a=new Uint8Array(a||e);b.getFloatFrequencyData(a);return a}}):this.analysers[a.name]}function r(a){if(a.gain)return void 0===this.gains[a.gain]?a=this.context.createGain():this.gains[a.gain]}function w(a){if(a.panner)return void 0===this.panners[a.panner]?(a=this.context.createPanner(),a.coneOuterGain=0.5,a.coneOuterAngle=180,a.coneInnerAngle=0,a):this.panners[a.panner]}function x(a){var b=this.context.createOscillator();b.type="sawtooth";b.detune.value=0;b.frequency.value=
a;return b}function y(a){var b=this.state[a]||{},d=this.sources[a],c=this.gains[b.gain],e=this.panners[b.panner],f=d;d.connect(this.analysers[a].a);c&&d.connect(f=c);e&&d.connect(f=e);b.sound&&f.connect(this.context.destination)}function m(a){if(this.state[a])return this.state[a].playing;console.warn("\u6307\u5b9a\u3057\u305fKEY\u306e\u97f3\u6e90\u306f\u5b58\u5728\u3057\u307e\u305b\u3093");return!1}function s(a,b){this.gains[a]?(t<b&&(b=t),u>b&&(b=u),this.gains[a].gain.value=b):console.warn("\u97f3\u6e90\u306e\u97f3\u91cf\u3092\u5909\u66f4\u3059\u308b\u5834\u5408\u306fGain\u304c\u5fc5\u8981\u3067\u3059")}
var j=function(){},l,n;l=["valueOf","toLocaleString","toString","constructor"];n=!!(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia);var t=1,u=0;g.AudioContext=g.AudioContext||g.webkitAudioContext;g.requestAnimationFrame=g.requestAnimationFrame||g.mozRequestAnimationFrame||g.webkitRequestAnimationFrame||g.msRequestAnimationFrame;k.prototype.loadBuffer=function(a,b){var d=this,c=new XMLHttpRequest;c.open("GET",a,!0);c.responseType=
"arraybuffer";c.onload=function(){d.context.decodeAudioData(c.response,function(c){if(c){if(d.bufferList[b]=c,++d.loadCount===d.urlList.length)d.onload(d.bufferList)}else g.alert("error decoding file data: "+a)},function(a){console.error("decodeAudioData error",a)})};c.onerror=function(){g.alert("BufferLoader: XHR error")};c.send()};k.prototype.load=function(){for(var a=0;a<this.urlList.length;++a)this.loadBuffer(this.urlList[a],a)};f.prototype.init=function(){var a=this;a.context=new g.AudioContext;
if(a.useMicrophone)navigator.getUserMedia({audio:!0},function(b){a.micInitSuccess(b)},function(b){a.micInitFaild(b)});else{if("function"===typeof a.onInit)a.onInit();a.autoLooop&&(a.isReady=!0,a.startLoop())}return a};f.prototype.micInitSuccess=function(a){this.context.createAnalyser().fftSize=this.fftSize;this.sources.mic=this.context.createMediaStreamSource(a);this.analysers.mic=q.apply(this,[{name:"mic"}]);this.sources.mic.connect(this.analysers.mic.a);if("function"===typeof this.onMicInitSuccess)this.onMicInitSuccess();
this.isReady=!0;this.autoLooop&&(this.isLoop=!0,this.enterFrame())};f.prototype.micInitFaild=function(a){console.log("reject",a);if("function"===typeof this.onMicInitFaild)this.onMicInitFaild()};f.prototype.load=function(a){var b=this,d=null,c=g.Utils;if(a instanceof Array)d=a,b.sources=[],b.analysers=[];else{b.sources={};b.analysers={};d=c.values(a);a=Object.keys(a);for(var e=0;e<a.length;e++)"object"===typeof d[e]?(b.sources[e]=c.applyIf(d[e],{name:a[e],loop:!0,sound:!0}),d[e]=d[e].path):b.sources[e]=
a[e]}b.buffers=new k(b.context,d,function(){v.apply(b,arguments)});b.buffers.load()};f.prototype.startLoop=function(){this.isLoop||(this.isLoop=!0,this.enterFrame())};f.prototype.stopLoop=function(){this.isLoop=!1};f.prototype.enterFrame=function(){var a=this;if(a.isLoop&&a.isReady){if("function"===typeof a.onEnterFrame)a.onEnterFrame();60===a.fps?requestAnimationFrame(function(){a.enterFrame()}):setTimeout(function(){a.enterFrame()},1E3/a.fps)}};f.prototype.play=function(a){var b=0,d=0,c=0,e=b=0;
this.sources[a]?(this.sources[a]=p.apply(this,[this.state[a],this.state[a].index]),y.apply(this,[a]),this.state[a].isReset?(c=b=this.context.currentTime,e=0,this.state[a].startTime=b,this.state[a].retryTime=c,this.state[a].pauseTime=0,this.state[a].offsetTime=e,this.state[a].isReset=!1):(b=this.state[a].startTime,c=this.context.currentTime,d=this.state[a].pauseTime,e=this.state[a].offsetTime,e+=c-d,this.state[a].retryTime=c,this.state[a].pauseTime=d,this.state[a].offsetTime=e),b=c-b-e,s.apply(this,
[a,this.state[a].volume]),this.sources[a].start(0,b),this.state[a].playing=!0,this.context.listener.setPosition(0,0,0)):console.warn("\u6307\u5b9a\u3057\u305fKEY\u306e\u97f3\u6e90\u306f\u5b58\u5728\u3057\u307e\u305b\u3093")};f.prototype.stop=function(a){this.sources[a]?(this.sources[a].stop(0),this.state[a].playing=!1,this.state[a].isReset=!0):console.warn("\u6307\u5b9a\u3057\u305fKEY\u306e\u97f3\u6e90\u306f\u5b58\u5728\u3057\u307e\u305b\u3093")};f.prototype.pause=function(a){this.sources[a]?(this.sources[a].stop(0),
this.state[a].pauseTime=this.context.currentTime,this.state[a].playing=!1):console.warn("\u6307\u5b9a\u3057\u305fKEY\u306e\u97f3\u6e90\u306f\u5b58\u5728\u3057\u307e\u305b\u3093")};f.prototype.isPlaying=m;f.prototype.setPitch=function(a,b){this.sources[a]?(this.sources[a].playbackRate.value=b,this.state[a].pitch=b):console.warn("\u6307\u5b9a\u3057\u305fKEY\u306e\u97f3\u6e90\u306f\u5b58\u5728\u3057\u307e\u305b\u3093")};f.prototype.setVolume=s;f.prototype.bindEl=function(a,b){var d=document.querySelector(b);
b&&this.context.createMediaElementSource(d)};f.prototype.setPosition=function(a,b,d,c){var e=this.panners[a];b=void 0===b?0:b;d=void 0===d?0:d;c=void 0===c?-0.5:c;m.apply(this,[a])&&(e?e.setPosition(10*b,10*d,c):console.warn("\u97f3\u6e90\u306e\u518d\u751f\u4f4d\u7f6e\u3092\u5909\u66f4\u3059\u308b\u5834\u5408\u306fPanner\u304c\u5fc5\u8981\u3067\u3059"))};f.prototype.setOrientation=function(a,b){var d=this.panners[a];m.apply(this,[a])&&(d?d.setOrientation(Math.cos(b),-Math.sin(b),1):console.warn("\u97f3\u6e90\u306e\u518d\u751f\u4f4d\u7f6e\u3092\u5909\u66f4\u3059\u308b\u5834\u5408\u306fPanner\u304c\u5fc5\u8981\u3067\u3059"))};
f.prototype.createSampleTone=function(a,b,d){var c=x.apply(this,[a]);a=r.apply(this,[{gain:"sample"}]);b=b||0.05;d=d||1E3;c.connect(a);a.connect(this.context.destination);a.gain.value=b;c.start();setTimeout(function(){c.stop()},d)};h.prototype.sum=function(a){for(var b=a.length,d=0,c=0;c<b;c++)d+=a[c];return d};h.prototype.values=function(a){for(var b=Object.keys(a),d=b.length,c=[],e=0;e<d;e++)c[e]=a[b[e]];return c};h.prototype.apply=function(a,b,d){d&&Ext.apply(a,d);if(a&&b&&"object"===typeof b){for(var c in b)a[c]=
b[c];if(l)for(d=l.length;d--;)c=l[d],b.hasOwnProperty(c)&&(a[c]=b[c])}return a};h.prototype.applyIf=function(a,b){var d;if(a)for(d in b)void 0===a[d]&&(a[d]=b[d]);return a};g.BufferLoader=k;g.AudioManager=f;g.Utils=new h})((this||0).self||global);