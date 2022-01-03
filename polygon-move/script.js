// Implementation of polygon drag to move
// https://stackoverflow.com/questions/32407364/in-html5-javascript-is-there-a-way-to-make-a-polygon-i-just-draw-draggable-or

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
function reOffset(){
  var BB=canvas.getBoundingClientRect();
  offsetX=BB.left;
  offsetY=BB.top;        
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }

var isDown=false;
var startX,startY;

var poly={
  x:0,
  y:0,
  points:[{x:50,y:50},{x:75,y:25},{x:100,y:50},{x:75,y:125},{x:50,y:50}],
}

ctx.fillStyle='skyblue';
ctx.strokeStyle='gray';
ctx.lineWidth=3;

draw();

$("#canvas").mousedown(function(e){handleMouseDown(e);});
$("#canvas").mousemove(function(e){handleMouseMove(e);});
$("#canvas").mouseup(function(e){handleMouseUp(e);});
$("#canvas").mouseout(function(e){handleMouseOut(e);});


function draw(){
    console.log('draw')
    
  ctx.clearRect(0,0,cw,ch);
  define();
}

function define(){

    // draw box at points
    // ctx.beginPath();

    dotSize = 8;
    for(var i=0;i<poly.points.length - 1;i++){
        // draw rectangle at the points
        ctx.rect(
            poly.points[i].x+poly.x - dotSize / 2,
            poly.points[i].y+poly.y - dotSize / 2,
            dotSize,
            dotSize
        );
    }
    ctx.strokeStyle='green';
    ctx.lineWidth=1;
    ctx.stroke();

    // ctx.closePath();

    // draw polygon
    ctx.beginPath();  // need this for clearRect to work
    
    ctx.moveTo(poly.points[0].x+poly.x,poly.points[0].y+poly.y);
    for(var i=0;i<poly.points.length;i++){
      ctx.lineTo(poly.points[i].x+poly.x,poly.points[i].y+poly.y);
    }

    // ctx.fillStyle='skyblue';
    ctx.fillStyle = "rgba(180, 240, 245, 0.5)";
    ctx.strokeStyle='red';
    ctx.lineWidth=1;
  
    ctx.fill();
    ctx.stroke();

    // ctx.closePath();
}


function handleMouseDown(e){
  console.log('handleMouseDown start: isDown ' + isDown);
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  startX=parseInt(e.clientX-offsetX);
  startY=parseInt(e.clientY-offsetY);

  // Put your mousedown stuff here
//   define();

  if(ctx.isPointInPath(startX,startY)){
    isDown=true;
  }
  console.log('handleMouseDown end: isDown ' + isDown);
}

function handleMouseUp(e){
    console.log('handleMouseUp start: isDown ' + isDown);

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX=parseInt(e.clientX-offsetX);
  mouseY=parseInt(e.clientY-offsetY);

  draw();

  // Put your mouseup stuff here
  isDown=false;

  console.log('handleMouseUp end: isDown ' + isDown);
}

function handleMouseOut(e){
    console.log('handleMouseOut start: isDown ' + isDown);

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX=parseInt(e.clientX-offsetX);
  mouseY=parseInt(e.clientY-offsetY);

  // Put your mouseOut stuff here
  isDown=false;

  console.log('handleMouseOut end: isDown ' + isDown);
}

function handleMouseMove(e){
    console.log('handleMouseMove start: isDown ' + isDown);

  if(!isDown){return;}

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX=parseInt(e.clientX-offsetX);
  mouseY=parseInt(e.clientY-offsetY);

  // Put your mousemove stuff here
  var dx=mouseX-startX;
  var dy=mouseY-startY;
  startX=mouseX;
  startY=mouseY;

  poly.x+=dx;
  poly.y+=dy;
  draw();

  console.log('handleMouseMove end: isDown ' + isDown);
}