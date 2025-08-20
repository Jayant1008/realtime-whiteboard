let undoStack = [];
let redoStack = [];
function undoMaker() {
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    redraw();
    return true;
  }
  return false;
}
function redoMaker() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    redraw();
    return true;
  }
  return false;
}

let undo = document.querySelector("#undo");
let redo = document.querySelector("#redo");
let interval;
undo.addEventListener("mousedown", function() {
  interval = setInterval(function() {
    if (undoMaker()) socket.emit("undo");
  }, 50);
});

undo.addEventListener("mouseup", function () {
  clearInterval(interval); 
});

undo.addEventListener("mouseleave", function () {
  clearInterval(interval);
});
//for phone
undo.addEventListener("touchstart", function(e) {
  e.preventDefault();
  interval = setInterval(function() {
    if (undoMaker()) socket.emit("undo");
  }, 50);
}, { passive: false });

undo.addEventListener("touchend", function() {
  clearInterval(interval);
});
undo.addEventListener("touchcancel", function() {
  clearInterval(interval);
});

redo.addEventListener("mousedown", function() {
  interval = setInterval(function() {
    if (redoMaker()) socket.emit("redo");
  }, 50);
});

redo.addEventListener("mouseup", function () {
  clearInterval(interval); 
});

redo.addEventListener("mouseleave", function () {
  clearInterval(interval);
});

//for phone
redo.addEventListener("touchstart", function(e) {
  e.preventDefault();
  interval = setInterval(function() {
    if (redoMaker()) socket.emit("redo");
  }, 50);
}, { passive: false });

redo.addEventListener("touchend", function() {
  clearInterval(interval);
});
redo.addEventListener("touchcancel", function() {
  clearInterval(interval);
});