
let isDrawing = false;
let toolbar = document.querySelector(".toolbar");
board.addEventListener("mousedown", function(e) {
    isDrawing = true;
    let top = toolbar.getBoundingClientRect().height;
    canvas.beginPath();
    canvas.moveTo(e.clientX, e.clientY - top + window.scrollY);
    if(currTool === "pencil" ){
     pencilPanel.classList.remove("show");
    pencilPanel.style.display = "none";
    }
    if(currTool === "eraser"){
      eraserPanel.classList.remove("show");
      eraserPanel.style.display = "none";
    }
    let point = {
        x: e.clientX,
        y: e.clientY - top,
        identifier: "mousedown",
        color: canvas.strokeStyle,
        width: canvas.lineWidth
    };

    undoStack.push(point);
    socket.emit("mousedown", point);
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
        socket.emit("mousemove", point);
    }
});
board.addEventListener("mouseup", function() {
    isDrawing = false;
});

board.addEventListener("touchstart", function(e) {
    e.preventDefault(); // stop page scrolling
    isDrawing = true;
    let touch = e.touches[0]; // first finger
    if(currTool === "pencil" ){
     pencilPanel.classList.remove("show");
    pencilPanel.style.display = "none";
    }
    if(currTool === "eraser"){
      eraserPanel.classList.remove("show");
      eraserPanel.style.display = "none";
    }
   
    let top = toolbar.getBoundingClientRect().height;
    canvas.beginPath();
    canvas.moveTo(touch.clientX, touch.clientY - top);

    let point = {
        x: touch.clientX,
        y: touch.clientY - top,
        identifier: "mousedown",
        color: canvas.strokeStyle,
        width: canvas.lineWidth
    };

    undoStack.push(point);
    socket.emit("mousedown", point);
}, { passive: false });

board.addEventListener("touchmove", function(e) {
    e.preventDefault();
    if (isDrawing) {
        let touch = e.touches[0];
        let top = toolbar.getBoundingClientRect().height;
        canvas.lineTo(touch.clientX, touch.clientY - top);
        canvas.stroke();

        let point = {
            x: touch.clientX,
            y: touch.clientY - top,
            identifier: "mousemove",
            color: canvas.strokeStyle,
            width: canvas.lineWidth
        };
        undoStack.push(point);
        socket.emit("mousemove", point);
    }
}, { passive: false });

board.addEventListener("touchend", function() {
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