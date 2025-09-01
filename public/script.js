//index.ejs
document.querySelectorAll(".like-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const postCard = btn.closest("[data-post-id]");
    const likesEl = postCard.querySelector(".likes-count");
    let likes = parseInt(likesEl.textContent);

    if (btn.classList.contains("liked")) {
      likes -= 1;
      btn.classList.remove("liked");
      btn.textContent = "💜";
    } else {
      likes += 1;
      btn.classList.add("liked");
      btn.textContent = "💖";
    }
    likesEl.textContent = likes + " likes";
  });
});
//edit.
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById("imagePreview");
    output.src = reader.result;
  };
  if (event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
  }
}
