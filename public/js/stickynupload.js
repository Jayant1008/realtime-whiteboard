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
  // console.log("pad is updating")
  textarea.value+=text;
}


const uploadImg = document.querySelector(".upload-img");
const FileInput = document.querySelector(".input-img");
// uploadImg.addEventListener("click", function(e) {
//   e.preventDefault();
//   FileInput.click();
//   FileInput.addEventListener("change", function(e) {
//     const writingPad = createPad();
//     const img = document.createElement("img");
//     let src = URL.createObjectURL(e.target.files[0]);
//     socket.emit("imgUpload",src);
//     img.src = src;
//     img.setAttribute("class", "uploadedImgStyle");
//     writingPad.appendChild(img);
//     img.onload = function() {
//       URL.revokeObjectURL(img.src);
//     };
//   });
// });

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