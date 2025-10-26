// ==========================================
// try-copy.js (Nested iframe carousel) - Final Version
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const carouselEl = document.querySelector(".carousel-slide6");
  if (!carouselEl) {
    console.warn("Nested carousel: .carousel-slide6 not found");
    return;
  }

  // ============================
  // Carousel Config
  // ============================
  const options = {
    fullWidth: false,
    indicators: false,
    numVisible: 3,
    padding: 20,
    shift: 20,
    dist: -40,
    duration: 100,
  };

  let carouselInstance;
  let autoInterval = null;
  let autoPaused = false;
  let resumeTimeout = null;

  const slides = Array.from(carouselEl.querySelectorAll(".carousel-item"));
  const paginationContainer = document.querySelector(".carousel-pagination");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // ============================
  // Initialize Carousel
  // ============================
  function initCarousel() {
    try {
      if (carouselInstance && typeof carouselInstance.destroy === "function") {
        carouselInstance.destroy();
      }
      carouselInstance = M.Carousel.init(carouselEl, options);
      console.log("✅ Nested carousel initialized");
      updateDots();
    } catch (err) {
      console.error("❌ Carousel init error", err);
    }
  }

  // ============================
  // PostMessage Helpers
  // ============================
  function notifyParentPause() {
    try {
      window.parent.postMessage({ type: "pauseMainSwiper" }, "*");
    } catch (err) {
      console.warn("postMessage pause failed", err);
    }
  }

  function notifyParentResume() {
    try {
      window.parent.postMessage({ type: "resumeMainSwiper" }, "*");
    } catch (err) {
      console.warn("postMessage resume failed", err);
    }
  }

  // ============================
  // Autoplay Controls
  // ============================
  function startAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => {
      if (!autoPaused && carouselInstance && typeof carouselInstance.next === "function") {
        carouselInstance.next();
        updateDots();
      }
    }, 2500); // 2.5s per slide
    console.log("▶️ Nested carousel autoplay started");
  }

  function stopAuto() {
    autoPaused = true;
    clearInterval(autoInterval);
    clearTimeout(resumeTimeout);
    console.log("⏸️ Nested carousel autoplay paused");
  }

  function scheduleResume(delay = 4000) {
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      autoPaused = false;
      startAuto();
      notifyParentResume();
    }, delay);
  }

  // ============================
  // Pagination Dots
  // ============================
  function buildDots() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      dot.dataset.index = i;
      dot.addEventListener("click", (ev) => {
        ev.stopPropagation();
        stopAuto();
        notifyParentPause();
        requestAnimationFrame(() => {
          carouselInstance.set(i);
          updateDots();
        });
        scheduleResume();
      });
      paginationContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const activeIndex = slides.findIndex((s) => s.classList.contains("active"));
    const dots = paginationContainer ? Array.from(paginationContainer.querySelectorAll(".carousel-dot")) : [];
    dots.forEach((d, i) => d.classList.toggle("active", i === activeIndex));
  }

  // ============================
  // Flip Card Behavior
  // ============================
  function initFlip() {
    const cardInners = carouselEl.querySelectorAll(".card-inner, .flip-inner");
    cardInners.forEach((inner) => {
      inner.addEventListener("pointerup", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        stopAuto();
        notifyParentPause();

        const parentItem = inner.closest(".carousel-item");
        const target = parentItem || inner;

        inner.style.transition = "transform 0.6s cubic-bezier(0.45, 0, 0.55, 1)";
        inner.style.transformStyle = "preserve-3d";

        if (!target.classList.contains("flipped")) {
          target.classList.add("flipped");
          inner.style.transform = "rotateY(180deg) scale(1.02)";
        } else {
          target.classList.remove("flipped");
          inner.style.transform = "rotateY(0deg) scale(1)";
        }

        scheduleResume();
      });
    });
  }

  function unflipAllCards() {
    const flipped = carouselEl.querySelectorAll(".carousel-item.flipped, .card-inner.flipped, .flip-inner.flipped");
    flipped.forEach((item) => {
      item.classList.remove("flipped");
      const inner = item.querySelector(".card-inner, .flip-inner");
      if (inner) inner.style.transform = "rotateY(0deg) scale(1)";
    });
  }

  // ============================
  // Observe Active Class Changes
  // ============================
  const observer = new MutationObserver((mutations) => {
    let changed = false;
    for (const m of mutations) {
      const oldClass = m.oldValue || "";
      const newClass = m.target.className || "";
      if (oldClass.includes("active") !== newClass.includes("active")) changed = true;
    }
    if (changed) {
      updateDots();
      unflipAllCards();
    }
  });
  slides.forEach((s) =>
    observer.observe(s, { attributes: true, attributeFilter: ["class"], attributeOldValue: true })
  );

  // ============================
  // Prev / Next Buttons
  // ============================
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      stopAuto();
      notifyParentPause();
      if (carouselInstance && typeof carouselInstance.prev === "function") carouselInstance.prev();
      setTimeout(updateDots, 100);
      scheduleResume();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      stopAuto();
      notifyParentPause();
      if (carouselInstance && typeof carouselInstance.next === "function") carouselInstance.next();
      setTimeout(updateDots, 100);
      scheduleResume();
    });
  }

  // ============================
  // Interaction: Pause / Resume on Hover or Touch
  // ============================
  ["mouseenter", "focusin", "touchstart"].forEach((ev) => {
    carouselEl.addEventListener(ev, () => {
      stopAuto();
      notifyParentPause();
    });
  });

  ["mouseleave", "focusout", "touchend"].forEach((ev) => {
    carouselEl.addEventListener(ev, () => {
      scheduleResume();
      setTimeout(notifyParentResume, 3000);
    });
  });

  // ============================
  // Init on Window Load (after images/fonts ready)
  // ============================
  window.addEventListener("load", () => {
    initCarousel();
    buildDots();
    initFlip();

    setTimeout(() => {
      startAuto();
      updateDots();
    }, 300);
  });

  // ============================
  // Re-init on Resize (GitHub Pages scaling fix)
  // ============================
  window.addEventListener("resize", () => {
    setTimeout(() => {
      initCarousel();
      updateDots();
    }, 400);
  });

  // Debug export
  window.__nestedCarousel = { startAuto, stopAuto, scheduleResume, carouselInstance };
});
