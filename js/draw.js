
let isDrawing = false;
let toolbar = document.querySelector(".toolbar");
board.addEventListener("mousedown", function(e) {
    isDrawing = true;
    let top = toolbar.getBoundingClientRect().height;
    canvas.beginPath();
    canvas.moveTo(e.clientX, e.clientY - top + window.scrollY);
    pencilPanel.classList.remove("show");
    pencilPanel.style.display = "none";
    let point = {
        x: e.clientX,
        y: e.clientY - top,
        identifier: "mousedown",
        color: canvas.strokeStyle,
        width: canvas.lineWidth
    };

    undoStack.push(point);
});


board.addEventListener("mousemove", function(e) {
    if (isDrawing) {
        let top = toolbar.getBoundingClientRect().height;
        canvas.lineTo(e.clientX, e.clientY - top );
        canvas.stroke();
        let point = {
            x: e.clientX,
            y: e.clientY - top,
            identifier: "mousemove",
            color: canvas.strokeStyle,
            width: canvas.lineWidth
        };
        undoStack.push(point);
    }
});
board.addEventListener("mouseup", function() {
    isDrawing = false;
});



function redraw() {
  canvas.clearRect(0, 0, board.width, board.height);
  console.log("I am here");
  for (let i = 0; i < undoStack.length; i++) {
    let { x, y, identifier, color, width } = undoStack[i];
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    if (identifier == "mousedown") {
      canvas.beginPath();
      canvas.moveTo(x, y);
    } else if (identifier == "mousemove") {
      canvas.lineTo(x, y);
      canvas.stroke();
    }
    else if (identifier == "mouseup") {
      canvas.closePath();
    }
  }
}