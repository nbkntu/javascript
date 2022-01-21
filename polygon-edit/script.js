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
var isRightClick = false;
var polyPointId;

var poly={
  points:[ {x:175, y:75}, {x:250, y:150}, {x:175, y:225}, {x:100, y:180} ],
}

const dotSize = 8;

// ctx.fillStyle='skyblue';
// ctx.strokeStyle='gray';
// ctx.lineWidth=3;

draw();

$("#canvas").mousedown(function(e) { handleMouseDown(e); });
$("#canvas").mousemove(function(e) { handleMouseMove(e); });
$("#canvas").mouseup(function(e) { handleMouseUp(e); });
$("#canvas").mouseout(function(e) { handleMouseOut(e); });
// disable right-click showing context menu
$("#canvas").contextmenu(function(e) { e.preventDefault(); return false; });


function removePoint(poly, pointIndex) {
  if (poly.points.length <= 3) {
    return;
  }

  console.log(poly.points);
  console.log(pointIndex);

  poly.points.splice(pointIndex, 1);

  console.log(poly.points);
}

function addPoint(poly, x, y) {
  insertIndex = -1;
  minSquareDistance = -1;
  for (i = 0; i < poly.points.length; i++) {
    i1 = (i + 1) % poly.points.length;
    sqDist = Math.pow(x - poly.points[i].x, 2) + Math.pow(y - poly.points[i].y, 2)
        + Math.pow(x - poly.points[i1].x, 2) + Math.pow(y - poly.points[i1].y, 2);
    if (minSquareDistance == -1 || minSquareDistance > sqDist) {
      minSquareDistance = sqDist;
      insertIndex = i1;
    }
  }

  console.log(poly.points);
  console.log(insertIndex);

  poly.points.splice(insertIndex, 0, {x: x, y: y});

  console.log(poly.points);
}

function draw() {
  console.log('draw')
  ctx.clearRect(0, 0, cw, ch);
  define();
}

function define(){

    // draw box at points
    // ctx.beginPath();

    for(var i=0; i < poly.points.length; i++){
        // draw rectangle at the points
        ctx.rect(
            poly.points[i].x - dotSize / 2,
            poly.points[i].y - dotSize / 2,
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
    
    ctx.moveTo(poly.points[0].x,poly.points[0].y);
    for (var i=0; i<poly.points.length; i++) {
      ctx.lineTo(poly.points[i].x,poly.points[i].y);
    }
    ctx.lineTo(poly.points[0].x, poly.points[0].y);

    // ctx.fillStyle='skyblue';
    ctx.fillStyle = "rgba(180, 240, 245, 0.5)";
    ctx.strokeStyle='red';
    ctx.lineWidth=1;
  
    ctx.fill();
    ctx.stroke();

    // ctx.closePath();
}


function handleMouseDown(e) {
  console.log('handleMouseDown start: isDown=' + isDown);
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  startX=parseInt(e.clientX - offsetX);
  startY=parseInt(e.clientY - offsetY);

  // Put your mousedown stuff here
  if (e.button == 0) {  // left click
    polyPointIndex = getPointClicked(startX, startY);
    if (polyPointIndex != null){
      isDown=true;
    }
  } else if (e.button == 2) {  // right click
    // either add or remove points
    polyPointIndex = getPointClicked(startX, startY);
    if (polyPointIndex != null) {
      // right-click on a point -> remove it
      removePoint(poly, polyPointIndex);
    } else {
      addPoint(poly, startX, startY);
    }
    draw();
  }
  console.log('handleMouseDown end: isDown=' + isDown);
}

function getPointClicked(x, y) {
  for (var i=0; i < poly.points.length; i++) {
    const x1 = poly.points[i].x - dotSize/2;
    const x2 = poly.points[i].x + dotSize/2;
    const y1 = poly.points[i].y - dotSize/2;
    const y2 = poly.points[i].y + dotSize/2;
    if (x1 <= x && x2 >= x && y1 <= y && y2 >= y) {
      return i;
    }
  }
  
  return null;
}

function handleMouseUp(e){
  console.log('handleMouseUp start: isDown=' + isDown);

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX = parseInt(e.clientX-offsetX);
  mouseY = parseInt(e.clientY-offsetY);

  draw();

  // Put your mouseup stuff here
  isDown = false;

  console.log('handleMouseUp end: isDown=' + isDown);
}

function handleMouseOut(e){
    console.log('handleMouseOut start: isDown=' + isDown);

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX=parseInt(e.clientX-offsetX);
  mouseY=parseInt(e.clientY-offsetY);

  // Put your mouseOut stuff here
  isDown=false;

  console.log('handleMouseOut end: isDown=' + isDown);
}

function handleMouseMove(e){
    console.log('handleMouseMove start: isDown=' + isDown);

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

  poly.points[polyPointIndex].x += dx;
  poly.points[polyPointIndex].y += dy;

  draw();

  console.log('handleMouseMove end: isDown=' + isDown);
}