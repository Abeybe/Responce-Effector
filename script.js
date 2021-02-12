const Peer = window.Peer;
let room;
let localStream;


let mic;//p5.js
let micVolume=0;

let status="listner";

let listner={};
let pListner={};
let listnerCount=0;

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  const getRoomModeByHash = () => (location.hash === '#sfu' ? 'sfu' : 'mesh');

  // roomMode.textContent = getRoomModeByHash();
  // window.addEventListener(
  //   'hashchange',
  //   () => (roomMode.textContent = getRoomModeByHash())
  // );

  // navigator.getUserMedia = navigator.getUserMedia ||
  //                    navigator.webkitGetUserMedia ||
  //                    navigator.mozGetUserMedia;
  try{
  localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    });
  }
  finally{
    var audioContext = new AudioContext();
      var analyser = audioContext.createAnalyser();
      var microphone = audioContext.createMediaStreamSource(localStream);
      var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
    
      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      javascriptNode.onaudioprocess = function() {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;
    
          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += (array[i]);
          }
          micVolume=(values/length)*5;
      }
  }
    // .catch(console.error);

    // mic=new p5.AudioIn();
    // mic.start();

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);

  // eslint-disable-next-line require-atomic-updates
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));

  // Register join handler
  joinTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    room = peer.joinRoom(roomId.value, {
      mode:getRoomModeByHash(),
      stream: localStream,
    });

    room.once('open', () => {
      messages.textContent += '=== You joined ===\n';
    });
    room.on('peerJoin', peerId => {
      messages.textContent += `=== ${peerId} joined ===\n`;
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.id=stream.peerId;
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);

      listner[stream.peerId]=[0,0,0];
      pListner[stream.peerId]=[0,0,0];

    });

    room.on('data', ({ data, src }) => {
      // Show a message sent to the room and who sent
      // messages.textContent += `${src}: ${data}\n`;

      if(data=="presenter" && status=="listner"){
        $("video").each(function(index,element){
          if($(element).attr("id")==src){
             $(element).addClass("presenter");
          }else{
            $(element).addClass("listner");
          }
        });
        $("#js-local-stream").addClass("listner");
        $("#video-canvas").addClass("listner");
      }else if(data=="presenter" && status=="presenter"){
        $("#js-local-streams video").addClass("listner");
      } else{
        pListner[src]=(listner[src] === void 0)?[0,0,0]:listner[src];
        listner[src]=data;
      }
    });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

      delete listner[peerId];
      delete pListner[peerId];

      messages.textContent += `=== ${peerId} left ===\n`;
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== You left ===\n';
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    sendTrigger.addEventListener('click', onClickSend);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });

    function onClickSend() {
      // Send message to all of the peers in the room via websocket
      room.send(localText.value);

      messages.textContent += `${peer.id}: ${localText.value}\n`;
      localText.value = '';
    }

    $("#share-screen").on("click",async function(){
      status="presenter";
      //. 画面サイズ取得
      var sw = window.parent.screen.width;
      var sh = window.parent.screen.height;
      //sw : sh = x : 480; => x = 480 * sw / sh;
      var x = Math.floor( 480 * sw / sh );
      $('#js-local-stream').css( { width: "100vw" } );
      $("#video-canvas").css({width:$("#js-local-stream").width()});
      $("#js-remote-streams").addClass("listner");
      room.send("presenter");
    
      // var mediaStreamConstraints = { video: true };
      // // _localVideo = document.querySelector( "video" );
      // navigator.mediaDevices.getDisplayMedia( mediaStreamConstraints )
      //   .then( gotLocalMediaStream )
      //   .catch( handleLocalMediaStreamError );
  
      // localStream.replaceTrack(navigator.mediaDevices.getDisplayMedia({video:true}));

      var replaceStream;
      try{
        // console.log(localStream.getVideoTracks()[0],localStream.getAudioTracks()[0]);
        replaceStream=await navigator.mediaDevices.getDisplayMedia({video:true});
        // localVideo.srcObject=replaceStream;
      }finally{ 
        replaceStream.addTrack(localStream.getAudioTracks()[0]);     
        // console.log(replaceStream.getVideoTracks()[0],replaceStream.getAudioTracks()[0]);
        room.replaceStream(replaceStream);
        localVideo.srcObject=replaceStream;
        await localVideo.play().catch(console.error);
      }
        
      // localStream.getVideoTracks()[0] = await navigator.mediaDevices
      // .getUserMedia({
      //   audio: true,
      //   video: true,
      // }).getVideoTracks()[0];

    });

  });

  peer.on('error', console.error);

  var _localVideo=null;
  function gotLocalMediaStream( mediaStream ){
    // _localVideo.srcObject = mediaStream;
    // localVideo.srcObject=_localVideo.srcObject;
    localStream=mediaStream;
  }
  
  function handleLocalMediaStreamError( error ){
    console.log( "navigator.getUserMedia error: ", error );
  }
  
  
})();



$("#js-join-trigger").on("click", function(){

    if(!room || status=="presenter")return;
    const detectInterval = setInterval(async () => {
      const result = await faceTrack();
      if(result){
        var box=result["_box"];
        var facepos=[box["x"]+box["width"]/2,box["y"]+box["height"]/2,micVolume];
        room.send(facepos);          
      }else{
        room.send([null,null,micVolume]);
      }
    }, 500);

});




 

  $("#camera-onoff").on("click",function(){
    if (localStream) {
      var b=localStream.getVideoTracks()[0].enabled;
      localStream.getVideoTracks()[0].enabled = !b;
      $("#camera-onoff").text((b)?"Camera On":"Camera Off");

    }
  });
  $("#mic-onoff").on("click",function(){
    if (localStream) {
      var b=localStream.getAudioTracks()[0].enabled;
      localStream.getAudioTracks()[0].enabled = !b;
      $("#mic-onoff").text((b)?"Mic On":"Mic Off");
    }
  });

