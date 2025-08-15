
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
//handling tool change
function handleToolChange(tool) {

  const allTools = document.querySelectorAll(".toolbar .tool");
    allTools.forEach(t => t.classList.remove("active"));
  
  if (tool === 'pencil') {
    currTool = "pencil";
    pencilTool.classList.add("active");
    console.log("pencil clicked");
    canvas.strokeStyle = "black";
    canvas.lineWidth = currWidth;
    const rect = pencilTool.getBoundingClientRect();
    pencilPanel.style.top = `${rect.bottom + 10}px`;
    pencilPanel.style.left = `${rect.left}px`;

    if (!pencilPanel.classList.contains("show")) {
      // Show pencil panel
      pencilPanel.style.display = "block";
      requestAnimationFrame(() => pencilPanel.classList.add("show"));
    } else {
      // Hide pencil panel
      pencilPanel.classList.remove("show");
      pencilPanel.addEventListener("transitionend", () => {
        pencilPanel.style.display = "none";
      }, { once: true });
    }
    eraserPanel.classList.remove("show");
    eraserPanel.style.display = "none";

  } else if (tool === "eraser") {
    currTool = "eraser";
    canvas.strokeStyle = "white";
    canvas.lineWidth = currEraserWidth;
    eraserTool.classList.add("active");
    const rect = eraserTool.getBoundingClientRect();
    eraserPanel.style.top = `${rect.bottom + 10}px`;
    eraserPanel.style.left = `${rect.left - rect.width / 2}px`;

    if (!eraserPanel.classList.contains("show")) {
      eraserPanel.style.display = "block";
      requestAnimationFrame(() => eraserPanel.classList.add("show"));
    } else {
      eraserPanel.classList.remove("show");
      eraserPanel.addEventListener("transitionend", () => {
        eraserPanel.style.display = "none";
      }, { once: true });
    }

    pencilPanel.classList.remove("show");
    pencilPanel.style.display = "none";

  } else if (tool === "sticky") {
    createSticky();
  }
}

// for setting stroke width
strokeWidthPencil.addEventListener("input", () => {
    canvas.lineWidth = strokeWidthPencil.value;
    currWidth = strokeWidthPencil.value;
    canvas.strokeStyle = currColor; // preserve current color
});


//function for setting the pencil color
function colorChange(color) {
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
strokeWidthEraser.addEventListener("input", () => {
    canvas.lineWidth = strokeWidthEraser.value;
    currEraserWidth = strokeWidthEraser.value;
    canvas.strokeStyle = currTool === "eraser" ? "white" : currColor;
});


//for downloading the canvas
const downld = document.querySelector("#download");
downld.addEventListener("click", function(e) {
  
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

  let isMinimized = false;
  minimize.addEventListener("click", function() {
    if(isMinimized == false) writingPad.style.display = "none"
    else writingPad.style.display = "block"
    isMinimized = !isMinimized;
  });
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

  console.log("Sticky clicked");
  document.body.appendChild(stickyPad);
  return writingPad;
}


