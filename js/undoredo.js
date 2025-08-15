let undoStack = [];
let redoStack = [];
function undoMaker() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    redraw();
  }
}
function redoMaker() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    redraw();
  }
  
}

let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");
let interval;
undo.addEventListener("mousedown", function () {
    console.log("undo clicked");
    interval = setInterval(function () {
    undoMaker();
  }, 20);
});

undo.addEventListener("mouseup", function () {
  clearInterval(interval); 
});

undo.addEventListener("mouseleave", function () {
  clearInterval(interval);
});

redo.addEventListener("mousedown", function () {
  interval = setInterval(function () {
    redoMaker();
  }, 20);
});

redo.addEventListener("mouseup", function () {
  clearInterval(interval); 
});

redo.addEventListener("mouseleave", function () {
  clearInterval(interval);
});
