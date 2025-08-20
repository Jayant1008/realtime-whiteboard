
let board = document.querySelector("#whiteboard");
board.width = window.innerWidth;
board.height = window.innerHeight;
let canvas = board.getContext("2d");
board.width = board.offsetWidth;
board.height = board.offsetHeight;

canvas.fillStyle = "white";
canvas.fillRect(0, 0, board.width, board.height);
let currWidth = 5;
let currEraserWidth = 5;
canvas.strokeStyle = "black";
canvas.lineWidth = currWidth;
canvas.lineJoin = "round";
canvas.lineCap = "round";
canvas.miterLimit = 1;
canvas.imageSmoothingEnabled = true;
canvas.imageSmoothingQuality = "high";

//default perncil comp from hmtl
let currTool = "pencil";
let currColor = "black";
//selecting pencil tools
const pencilTool = document.getElementById("pencil");
const pencilPanel = document.getElementById("pencil-style-panel");
const strokeWidthPencil = document.getElementById("stroke-width-slider-pencil");
//selecting eraser comp from hmtl
const eraserTool = document.getElementById("eraser");
const eraserPanel = document.getElementById("eraser-style-panel");
const strokeWidthEraser = document.getElementById("stroke-width-slider-eraser");
function handleToolChange(tool){
  handleTool(tool);
  socket.emit("toolchange", tool);
}
//handling tool change
function handleTool(tool) {
  const allTools = document.querySelectorAll(".toolbar .tool");
  allTools.forEach(t => t.classList.remove("active"));

  if (tool === 'pencil') {
    // if (currTool !== "pencil") {   // prevent repeated toggles
      currTool = "pencil";
      pencilTool.classList.add("active");
      console.log("pencil clicked");
      canvas.strokeStyle = currColor;
      canvas.lineWidth = currWidth;
      const rect = pencilTool.getBoundingClientRect();
      pencilPanel.style.top = `${rect.bottom + 10}px`;
      pencilPanel.style.left = `${rect.left}px`;
      pencilPanel.style.display = "block";
      requestAnimationFrame(() => pencilPanel.classList.add("show"));

      eraserPanel.classList.remove("show");
      eraserPanel.style.display = "none";
    // }
  } else if (tool === "eraser") {
    // if (currTool !== "eraser") {
      currTool = "eraser";
      canvas.strokeStyle = "white";
      canvas.lineWidth = currEraserWidth;
      eraserTool.classList.add("active");
      const rect = eraserTool.getBoundingClientRect();
      eraserPanel.style.top = `${rect.bottom + 10}px`;
      eraserPanel.style.left = `${rect.left - rect.width / 2}px`;

      eraserPanel.style.display = "block";
      requestAnimationFrame(() => eraserPanel.classList.add("show"));

      pencilPanel.classList.remove("show");
      pencilPanel.style.display = "none";
    // }
  } else if (tool === "sticky") {
    createSticky();
  }
}



function penSizeChange(value){
  penSize(value);
  socket.emit("pensize", value);
}
// for setting stroke width
function penSize(value) {
    canvas.lineWidth = value;
    currWidth = value;
    strokeWidthPencil.value = value;
}

function colorChange(color){
  colorChanger(color);
  socket.emit("color", color);
}
//function for setting the pencil color
function colorChanger(color) {
  currColor = color; 
  canvas.strokeStyle = color;
  const colors = document.querySelectorAll(".stroke-colors .color");

    colors.forEach(c => c.classList.remove("active"));
    const activeColor = document.querySelector(`.stroke-colors .${color}`);
    if (activeColor) {
        activeColor.classList.add("active");
    }
  
}
//setting the eraser width
function sizeChange(value) {
  eraserSize(value);
  socket.emit("erasersize", value);
}
function eraserSize(value) {
    canvas.lineWidth = value;
    currEraserWidth = value;
    canvas.strokeStyle = currTool === "eraser" ? "white" : currColor;
    strokeWidthEraser.value = value;
}

//clearing the canvas
function clearCanvas() {
  canvas.clearRect(0, 0, board.width, board.height);  
  canvas.fillStyle = "white";
  canvas.fillRect(0, 0, board.width, board.height);
  undoStack = [];
  redoStack = [];
  socket.emit("clearcanvas");
}


//for downloading the canvas
const downld = document.querySelector("#download");
downld.addEventListener("click", function(e) { 
  // canvas.fillStyle = "white";
  // canvas.fillRect(0, 0, board.width, board.height);
  const a=document.createElement("a");
  a.download="file.png";
  a.href=board.toDataURL("image/png");
  a.click();
  a.remove();
});

//for creating the pads
function createPad(){
    
  const stickyPad = document.createElement("div");
  const navBar = document.createElement("div");
  const writingPad = document.createElement("div");
  const minimize = document.createElement("div");
  const close = document.createElement("div");
  stickyPad.setAttribute("class", "sticky-pad");
  navBar.setAttribute("class", "nav");
  writingPad.setAttribute("class", "writing-pad");
  close.setAttribute("class", "close");
  minimize.setAttribute("class", "minimize");
  close.innerText = "X";
    minimize.innerText = "-";
  navBar.appendChild(minimize);
  navBar.appendChild(close);
  stickyPad.appendChild(navBar);
  stickyPad.appendChild(writingPad);
//   body.appendChild(stickyPad);
 
  close.addEventListener("click", function() {
    stickyPad.remove();
  });
  close.addEventListener("touchstart", () => stickyPad.remove(), { passive: true });

  let isMinimized = false;
  minimize.addEventListener("click", function() {
    if(isMinimized == false) writingPad.style.display = "none"
    else writingPad.style.display = "block"
    isMinimized = !isMinimized;
  });
  minimize.addEventListener("touchstart", () => {
  if (!isMinimized) writingPad.style.display = "none";
  else writingPad.style.display = "block";
  isMinimized = !isMinimized;
}, { passive: true });
  let initX = null;
  let initY = null;
  let isStickyHeld = false;

  // move sticky logic
  navBar.addEventListener("mousedown", function(e) {
    initX = e.clientX;
    initY = e.clientY;
    isStickyHeld = true;
  });

  navBar.addEventListener("mousemove", function(e) {
    if (isStickyHeld == true) {
      let finalX = e.clientX;
      let finalY = e.clientY;

      let diffX = finalX - initX;
      let diffY = finalY - initY;

      let { top, left } = stickyPad.getBoundingClientRect();
      stickyPad.style.top = top + diffY + "px";
      stickyPad.style.left = left + diffX + "px";
      // updating previous point with current point
      initX = finalX;
      initY = finalY;
    }
  });
  navBar.addEventListener("mouseup", function() {
    isStickyHeld = false;
  });
  navBar.addEventListener("mouseleave", function() {
    isStickyHeld = false;
  });
  navBar.addEventListener("touchstart", function (e) {
  e.preventDefault(); // stop scrolling
  let touch = e.touches[0];
  initX = touch.clientX;
  initY = touch.clientY;
  isStickyHeld = true;
}, { passive: false });

navBar.addEventListener("touchmove", function (e) {
  e.preventDefault();
  let touch = e.touches[0];
  if (isStickyHeld == true) {
      let finalX = touch.clientX;
      let finalY = touch.clientY;

      let diffX = finalX - initX;
      let diffY = finalY - initY;

      let { top, left } = stickyPad.getBoundingClientRect();
      stickyPad.style.top = top + diffY + "px";
      stickyPad.style.left = left + diffX + "px";
      // updating previous point with current point
      initX = finalX;
      initY = finalY;
    }
}, { passive: false });

navBar.addEventListener("touchend", function () {
  isStickyHeld = false;
});

  console.log("Sticky clicked");
  document.body.appendChild(stickyPad);
  return writingPad;
}


