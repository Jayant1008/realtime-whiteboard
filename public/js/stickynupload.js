function createSticky(){
    let writingPad = createPad();
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "writing-pad");
    textArea.addEventListener("keydown", function (event) {
      socket.emit("text", event.key);
    });
    writingPad.appendChild(textArea);
}
function updatePad(text){
  var textarea = document.querySelector("textarea.writing-pad");
  console.log(text)
  if(text==='Backspace'){
    textarea.value = textarea.value.slice(0, -1);
    return;
  }
  if(text==='Enter'){
    textarea.value += "\n";
    return;
  }
  if(text.length === 1){
    textarea.value+=text;
  }
}


const uploadImg = document.querySelector(".upload-img");
const FileInput = document.querySelector(".input-img");

uploadImg.addEventListener("click", function(e) {
  e.preventDefault();
  FileInput.click();
});

FileInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    const base64 = reader.result;
    socket.emit("imgUpload", base64);
    const writingPad = createPad();
    const img = document.createElement("img");
    img.src = base64;
    img.className = "uploadedImgStyle";
    writingPad.appendChild(img);
  };

  reader.readAsDataURL(file);
});