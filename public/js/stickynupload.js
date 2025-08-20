
function createSticky(){
    let writingPad = createPad();
    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "writing-pad");
    writingPad.appendChild(textArea);
}


const uploadImg = document.querySelector(".upload-img");
const FileInput = document.querySelector(".input-img");
uploadImg.addEventListener("click", function(e) {
  e.preventDefault();
  FileInput.click();
  FileInput.addEventListener("change", function(e) {
    const writingPad = createPad();

    const img = document.createElement("img");
    let src = URL.createObjectURL(e.target.files[0]);
    img.src = src;
    img.setAttribute("class", "uploadedImgStyle");
    writingPad.appendChild(img);
    img.onload = function() {
      URL.revokeObjectURL(img.src);
    };
  });
});