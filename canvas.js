 //==================
  //Canvas.js
  
let anbientPositions=[[0.0,50.0,10,0],[40.0,0,0,10],[70.0,0.0,10,0],[40.0,100.0,-10,0],[0.0,0.0,10,10]];
let canvas;

function setup(){
    canvas=createCanvas(640,480);
    canvas.parent("video-canvas");
    canvas.style("position","absolute");
    canvas.style("z-index","2");
    canvas.id("my-canvas");

    // mic.start();
    // mic=new p5.AudioIn();
    // mic.start();

    frameRate(60);
    colorMode(HSB,360,100,100,100);
    noStroke();
    fill(20,100,100,20);
  }

  var dx=0;
  var dy=0;
  function draw(){
      if(Math.random()>0.8)clear();
      if(status=="listner")return;

      var s=millis()/1000;
      var cnt=0;
      for(var i in listner){   
        if(listner[i][0] == null){
            var vol=listner[i][2];
            fill(360*Math.abs(Math.sin(p5.TWO_PI*vol/100)),100,100,20);
            ellipse(width*anbientPositions[cnt][0],height*anbientPositions[cnt][1],vol+50*sin(s),vol+50*sin(s));
            continue;
        }
        var vol=listner[i][2];
        dx=(pListner[i][0]==listner[i][0])?dx:(pListner[i][0]-listner[i][0])/100;
        dy=(pListner[i][1]==listner[i][1])?dy:(pListner[i][1]-listner[i][1])/100;
        fill(360*Math.abs(Math.sin(p5.TWO_PI*vol/100)),100,100,20);
          ellipse(
              width*anbientPositions[cnt][0]/100+Math.abs(dx)*anbientPositions[cnt][2]/100,
              height*anbientPositions[cnt][1]/100+Math.abs(dy)*anbientPositions[cnt][3]/100,
              vol+50*sin(s),vol+50*sin(s)
          );
          cnt++;
      }
  }