// script2.js (main page) — refined autoplay + iframe sync (Oct 2025 final)
(function () {
  // ============================
  // Element references
  // ============================
  const sliderTabs = document.querySelectorAll(".slider-tabsss");
  const sliderIndicator = document.querySelector(".slider-indicator");
  const sliderPagination = document.querySelector(".slider-pagination");
  const sliderControls = document.querySelector(".slider-controls");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");

  // Safety setup
  try {
    if (sliderIndicator) {
      sliderIndicator.style.pointerEvents = "none";
      sliderIndicator.style.zIndex = 0;
      sliderTabs.forEach((t) => (t.style.zIndex = 1));
    }
  } catch (err) {
    console.warn("Init styling failed:", err);
  }

  // ============================
  // Swiper Initialization
  // ============================
  let swiper;
  try {
    swiper = new Swiper(".slider-container", {
      effect: "creative",
      speed: 1500,
      loop: true,
      creativeEffect: {
        prev: { translate: ["-30%", 0, -400], scale: 0.85, opacity: 0.6 },
        next: { translate: ["100%", 0, 0], scale: 1, opacity: 1 },
      },
      navigation: {
        prevEl: "#slide-prev",
        nextEl: "#slide-next",
      },
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
    });

    // ✅ Added: make Swiper globally accessible for scripthamborg.js
    window.swiper = swiper;

    console.log("Main Swiper initialized with autoplay delay:", swiper?.params?.autoplay?.delay);
  } catch (err) {
    console.error("Swiper init failed:", err);
  }

  // ============================
  // Tab Indicator Logic
  // ============================
  function updateIndicator(tab) {
    if (!tab || !sliderIndicator) return;

    sliderTabs.forEach((t) => {
      t.classList.remove("active");
      t.style.color = "white";
      t.style.borderBottomColor = "white";
    });

    tab.classList.add("active");
    tab.style.color = "#a35bbe";
    tab.style.borderBottomColor = "#a35bbe";

    requestAnimationFrame(() => {
      const tabText = tab.querySelector(".tab-text");
      if (!tabText) return;
      const tabTextRect = tabText.getBoundingClientRect();
      const containerRect = sliderPagination
        ? sliderPagination.getBoundingClientRect()
        : tab.parentElement.getBoundingClientRect();
      const offsetLeft = tabTextRect.left - containerRect.left;
      const width = tabTextRect.width;
      const extraWidthVW = (65 / 1536) * 100;
      sliderIndicator.style.transform = `translateX(${offsetLeft}px)`;
      sliderIndicator.style.width = `calc(${width}px + ${extraWidthVW}vw)`;
      sliderIndicator.style.backgroundColor = "#a35bbe";
    });
  }

  function syncIndicatorToSwiper() {
    if (!swiper) return;
    const idx = typeof swiper.realIndex === "number" ? swiper.realIndex : 0;
    const targetTab = sliderTabs[idx];
    if (targetTab) updateIndicator(targetTab);
  }

  if (swiper && typeof swiper.on === "function") {
    swiper.on("slideChange transitionStart", () => {
      syncIndicatorToSwiper();
      notifyIframesOfActiveSlide(swiper.realIndex);
    });
    if (swiper.initialized) syncIndicatorToSwiper();
  }

  // ============================
  // Responsive Adjustments
  // ============================
  function checkPaginationOverflow() {
    const isOverflowing =
      sliderPagination && sliderControls && sliderPagination.scrollWidth > sliderControls.clientWidth;
    sliderControls?.classList.toggle("scrollable", isOverflowing);
    sliderPagination?.classList.toggle("scrollable", isOverflowing);
  }

  function responsiveAdjustments() {
    const width = window.innerWidth;
    const btnSize = width <= 480 ? 40 : width <= 768 ? 55 : 65;
    const btnWidth = width <= 480 ? 80 : width <= 768 ? 120 : 165;

    [prevBtn, nextBtn].forEach((btn) => {
      if (!btn) return;
      btn.style.fontSize = `${btnSize}px`;
      btn.style.width = `${btnWidth}px`;
    });

    sliderTabs.forEach((tab) => {
      tab.style.fontSize = width <= 480 ? "1rem" : width <= 768 ? "1.2rem" : "1.5rem";
    });

    document.querySelectorAll(".Text").forEach((text) => {
      text.style.fontSize = width <= 480 ? "2.5rem" : width <= 768 ? "4rem" : "6rem";
      text.style.paddingLeft = width <= 480 ? "20px" : width <= 768 ? "60px" : "100px";
    });

    document.querySelectorAll(".Info").forEach((info) => {
      info.style.fontSize = width <= 480 ? "1rem" : width <= 768 ? "1.2rem" : "1.3rem";
      info.style.paddingLeft = width <= 480 ? "20px" : width <= 768 ? "60px" : "110px";
    });
  }

  window.addEventListener("load", () => {
    if (swiper?.slideToLoop) swiper.slideToLoop(0, 0);
    syncIndicatorToSwiper();
    checkPaginationOverflow();
    responsiveAdjustments();
    notifyIframesOfActiveSlide(swiper.realIndex || 0);
  });

  window.addEventListener("resize", () => {
    const activeTab = document.querySelector(".slider-tabsss.active");
    if (activeTab) updateIndicator(activeTab);
    checkPaginationOverflow();
    responsiveAdjustments();
  });

  // ============================
  // Tab Events
  // ============================
  sliderTabs.forEach((tab, index) => {
    tab.style.cursor = "pointer";
    tab.addEventListener("click", () => {
      swiper?.slideToLoop?.(index);
      updateIndicator(tab);
    });
    tab.addEventListener("mouseenter", () => {
      if (!tab.classList.contains("active")) {
        tab.style.color = "#a35bbe";
        sliderIndicator.style.backgroundColor = "#a35bbe";
        updateIndicator(tab);
      }
    });
    tab.addEventListener("mouseleave", () => syncIndicatorToSwiper());
  });

  // ============================
  // Navigation Buttons
  // ============================
  prevBtn?.addEventListener("click", (e) => {
    e.currentTarget.blur();
    swiper?.slidePrev?.();
    swiper?.autoplay?.start?.();
  });

  nextBtn?.addEventListener("click", (e) => {
    e.currentTarget.blur();
    swiper?.slideNext?.();
    swiper?.autoplay?.start?.();
  });

  // ============================
  // Keyboard Support
  // ============================
  window.addEventListener("keydown", (e) => {
    if (!swiper) return;
    if (e.key === "ArrowLeft") {
      swiper.slidePrev();
      prevBtn?.focus();
    } else if (e.key === "ArrowRight") {
      swiper.slideNext();
      nextBtn?.focus();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") prevBtn?.blur();
    if (e.key === "ArrowRight") nextBtn?.blur();
  });

  // ============================
  // Autoplay Pause / Resume Logic
  // ============================
  let inactivityTimeout;
  let isPaused = false;

  function pauseAutoplay(reason = "") {
    if (!swiper?.autoplay?.running || isPaused) return;
    swiper.autoplay.stop();
    isPaused = true;
    clearTimeout(inactivityTimeout);
    console.log("Main Swiper paused:", reason);
  }

  function resumeAutoplay(delay = 5000) {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      if (!swiper) return;
      swiper.autoplay.start();
      isPaused = false;
      console.log("Main Swiper resumed");
    }, delay);
  }

  // Pause only on real interactions
  ["scroll", "mousedown", "wheel", "touchstart", "keydown", "focusin"].forEach((evt) => {
    document.addEventListener(evt, () => pauseAutoplay(evt.type), { passive: true });
  });

  // Resume after inactivity (5s)
  ["mouseup", "touchend", "keyup", "focusout"].forEach((evt) => {
    document.addEventListener(evt, () => resumeAutoplay(5000), { passive: true });
  });

  // ============================
  // Iframe Communication Logic
  // ============================
  function notifyIframesOfActiveSlide(activeIndex) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe, i) => {
      try {
        if (i === activeIndex) {
          iframe.contentWindow.postMessage({ type: "startNestedCarousel" }, "*");
        } else {
          iframe.contentWindow.postMessage({ type: "pauseNestedCarousel" }, "*");
        }
      } catch (err) {
        console.warn("Failed to message iframe", err);
      }
    });
  }

  // Listen for iframe messages
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;
    const { type } = event.data;
    if (type === "pauseMainSwiper") pauseAutoplay("iframe");
    else if (type === "resumeMainSwiper") resumeAutoplay(5000);
  });

  // ============================
  // Debug helper
  // ============================
  window.__mainSwiper = {
    swiperInstance: swiper,
    pause: pauseAutoplay,
    resume: resumeAutoplay,
  };
})();
