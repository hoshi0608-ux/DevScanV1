// try-copy.js
document.addEventListener("DOMContentLoaded", function () {
  // Grab single element and initialize — returns a single instance (not an array)
  const carouselEl = document.querySelector(".carousel-slide6");
  if (!carouselEl) return;

  // Faster, smoother slide settings
  const options = {
    fullWidth: false,
    indicators: false,
    numVisible: 3,
    padding: 20,
    shift: 20,
    dist: -40,
    duration: 100 // 💨 faster slide transition (default ~300)
  };

  // Initialize and keep the returned instance
  const carouselInstance = M.Carousel.init(carouselEl, options);

  // Helper: get all slide elements
  const slides = Array.from(carouselEl.querySelectorAll(".carousel-item"));
  const paginationContainer = document.querySelector(".carousel-pagination");

  // ---------------- Pagination Dots ----------------
  function buildDots() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = ""; // clear old dots

    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      dot.dataset.index = i;

      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        requestAnimationFrame(() => {
          carouselInstance.set(i);
          updateDots();
          unflipAllCards();
        });
      });

      paginationContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const activeIndex = slides.findIndex((s) =>
      s.classList.contains("active")
    );
    const dots = paginationContainer
      ? Array.from(paginationContainer.querySelectorAll(".carousel-dot"))
      : [];
    dots.forEach((d, i) => d.classList.toggle("active", i === activeIndex));
  }

  buildDots();
  updateDots();

  // ---------------- Prev / Next Buttons ----------------
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      unflipAllCards();
      requestAnimationFrame(() => {
        carouselInstance.prev();
        setTimeout(updateDots, 80);
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      unflipAllCards();
      requestAnimationFrame(() => {
        carouselInstance.next();
        setTimeout(updateDots, 80);
      });
    });
  }

  // ---------------- Watch for Active Slide Changes ----------------
  const observer = new MutationObserver((mutations) => {
    let activeChanged = false;
    for (const m of mutations) {
      const oldClass = m.oldValue || "";
      const newClass = m.target.className || "";
      const hadActive = oldClass.split(/\s+/).includes("active");
      const hasActive = newClass.split(/\s+/).includes("active");
      if (hadActive !== hasActive) activeChanged = true;
    }

    if (activeChanged) {
      updateDots();
      unflipAllCards();
    }
  });

  slides.forEach((slide) =>
    observer.observe(slide, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    })
  );

  // ---------------- Flip Card Behavior ----------------
  function initFlip() {
    const cardInners = carouselEl.querySelectorAll(".card-inner, .flip-inner");

    cardInners.forEach((inner) => {
      inner.addEventListener("pointerup", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        const parentItem = inner.closest(".carousel-item");
        const target = parentItem || inner;

        // GPU-friendly smooth flip
        inner.style.transition =
          "transform 0.6s cubic-bezier(0.45, 0, 0.55, 1)";
        inner.style.transformStyle = "preserve-3d";

        if (!target.classList.contains("flipped")) {
          target.classList.add("flipped");
          inner.style.transform = "rotateY(180deg) scale(1.02)";
        } else {
          target.classList.remove("flipped");
          inner.style.transform = "rotateY(0deg) scale(1)";
        }
      });
    });
  }

  initFlip();

  function unflipAllCards() {
    const flippedItems = carouselEl.querySelectorAll(
      ".carousel-item.flipped, .card-inner.flipped, .flip-inner.flipped"
    );
    flippedItems.forEach((item) => {
      item.classList.remove("flipped");
      const inner = item.querySelector(".card-inner, .flip-inner");
      if (inner) inner.style.transform = "rotateY(0deg) scale(1)";
    });
  }

  window.addEventListener("load", () => {
    setTimeout(updateDots, 100);
  });
});
