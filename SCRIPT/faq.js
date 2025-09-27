const slide6 = document.querySelector(".faq-slide6");
if (slide6) {
  const faq = slide6.getElementsByClassName("faq-box-question");

  for (let i = 0; i < faq.length; i++) {
    faq[i].addEventListener("click", function () {

      // Close all other boxes
      for (let j = 0; j < faq.length; j++) {
        if (faq[j] !== this) {
          faq[j].classList.remove("active");
          faq[j].nextElementSibling.style.maxHeight = "0px";
        }
      }

      // Toggle the clicked box
      this.classList.toggle("active");
      const body = this.nextElementSibling;
      if (body.style.maxHeight === "200px") {
        body.style.maxHeight = "0px";
      } else {
        body.style.maxHeight = "200px";
      }

    });
  }
}
