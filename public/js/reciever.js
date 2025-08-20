const socket = io();
socket.on("onpensize", function(size) {
  penSize(size);
});
socket.on("onerasersize", function(size) {
  eraserSize(size);
});
socket.on("oncolor", function(color) {
  colorChanger(color);
});
socket.on("ontoolchange", function(tool) {
  handleTool(tool);
});

socket.on("onmousedown", function(point) {
  const { x, y, color, width } = point;
  canvas.lineWidth = width;
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.moveTo(x, y);
  undoStack.push(point);
});
socket.on("onmousemove", function(point) {
  const { x, y, color, width } = point;
  canvas.lineWidth = width;
  canvas.strokeStyle = color;
  canvas.lineTo(x, y);
  canvas.stroke();
  undoStack.push(point);
});
socket.on("onundo", function() {
  undoMaker();
});
socket.on("onredo", function() {
  redoMaker();
});
socket.on("onclearcanvas", function () {
    clearCanvas();
});