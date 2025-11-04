// script2.js — Modern Interactive Carousel (Oct 2025 Ultimate Edition)
(function () {
  // ============================
  // Element References
  // ============================
  const sliderTabs = document.querySelectorAll(".slider-tabsss");
  const sliderIndicator = document.querySelector(".slider-indicator");
  const sliderPagination = document.querySelector(".slider-pagination");
  const sliderControls = document.querySelector(".slider-controls");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const sliderEl = document.querySelector(".slider-container");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const mainContainer = document.querySelector(".main-container") || document.documentElement;

  // ============================
  // Swiper Initialization
  // ============================
  let swiper;
  try {
    swiper = new Swiper(".slider-container", {
      effect: "creative",
      speed: 1200,
      loop: true,
      parallax: true,
      grabCursor: false,
      resistanceRatio: 0.85,
      touchReleaseOnEdges: true,
      creativeEffect: {
        prev: { translate: ["-30%", 0, -400], rotate: [0, 0, -3], scale: 0.9, opacity: 0.7 },
        next: { translate: ["100%", 0, 0], rotate: [0, 0, 3], scale: 1, opacity: 1 },
      },
      navigation: {
        prevEl: "#slide-prev",
        nextEl: "#slide-next",
      },
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
    });

    window.swiper = swiper;
    console.log("✅ Swiper initialized successfully");

    // <<< we keep these
    const sliderContainer = document.querySelector(".slider-container");
    sliderContainer.addEventListener("mouseover", () => swiper.autoplay.stop());
    sliderContainer.addEventListener("mouseout", () => swiper.autoplay.start());
    // <<< END
  } catch (err) {
    console.error("❌ Swiper initialization failed:", err);
  }

  // ============================
  // Indicator Logic
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
    const idx = swiper?.realIndex ?? 0;
    const targetTab = sliderTabs[idx];
    if (targetTab) updateIndicator(targetTab);
  }

  if (swiper) {
    swiper.on("slideChange transitionStart", () => {
      syncIndicatorToSwiper();
      notifyIframesOfActiveSlide(swiper.realIndex);
    });
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
    swiper?.slideToLoop?.(0, 0);
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
      if (!tab.classList.contains("active")) updateIndicator(tab);
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
  // Modern Autoplay Enhancements
  // ============================
  sliderEl.addEventListener("mouseover", () => swiper?.autoplay?.stop());
  sliderEl.addEventListener("mouseout", () => swiper?.autoplay?.start());
  sliderEl.addEventListener("touchstart", () => swiper?.autoplay?.stop(), { passive: true });
  sliderEl.addEventListener("touchend", () => swiper?.autoplay?.start(), { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (!swiper) return;
    if (document.hidden) swiper.autoplay.stop();
    else swiper.autoplay.start();
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (swiper) {
          if (entry.isIntersecting) swiper.autoplay.start();
          else swiper.autoplay.stop();
        }
      });
    },
    { threshold: 0.4 }
  );
  if (sliderEl) observer.observe(sliderEl);

  // ============================
  // Progress Bar Indicator
  // ============================
  const progressEl = document.createElement("div");
  progressEl.className = "autoplay-progress";
  progressEl.innerHTML = `<span class="progress-bar"></span>`;
  document.body.appendChild(progressEl);

  swiper.on("autoplayTimeLeft", (s, time, progress) => {
    const bar = document.querySelector(".autoplay-progress .progress-bar");
    if (bar) {
      bar.style.width = `${(1 - progress) * 100}%`;
      bar.style.transition = "width 0.1s linear";
    }
  });

  // ============================
  // Iframe Communication
  // ============================
  function notifyIframesOfActiveSlide(activeIndex) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe, i) => {
      try {
        if (i === activeIndex) iframe.contentWindow.postMessage({ type: "startNestedCarousel" }, "*");
        else iframe.contentWindow.postMessage({ type: "pauseNestedCarousel" }, "*");
      } catch (err) {
        console.warn("Failed to message iframe", err);
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;
    const { type } = event.data;
    if (type === "pauseMainSwiper") swiper?.autoplay?.stop();
    else if (type === "resumeMainSwiper") swiper?.autoplay?.start();
  });

  // ============================
  // FULLSCREEN + IDLE CURSOR + AUTOPLAY PAUSE SYSTEM (Smooth Fade)
  // ============================
  let cursorTimeout, idleTimeout;
  const idleDelay = 4000; // idle before autoplay resumes
  const cursorFadeDelay = 2000; // 2s before fade

  // Inject fade style
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    body {
      transition: cursor 0.3s ease-in-out;
    }
    body.cursor-hidden {
      cursor: none;
    }
  `;
  document.head.appendChild(styleEl);

  function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    (window.innerHeight === screen.height && window.innerWidth === screen.width) // F11 FULLSCREEN
  );
}


  function handleUserActivity() {
    document.body.classList.remove("cursor-hidden");
    clearTimeout(cursorTimeout);
    clearTimeout(idleTimeout);
    swiper?.autoplay?.stop();

    if (isFullscreen()) {
      cursorTimeout = setTimeout(() => {
        if (isFullscreen()) document.body.classList.add("cursor-hidden");
      }, cursorFadeDelay);

      idleTimeout = setTimeout(() => {
        if (isFullscreen()) swiper?.autoplay?.start();
      }, idleDelay);
    } else {
      // <<< THIS WAS REMOVED
      // swiper?.autoplay?.start();
      // <<< DON'T AUTO RESUME HERE
    }
  }

  // handle F11 (key code 122) — browser fullscreen toggle
window.addEventListener("keydown", (e) => {
  if (e.key === "F11" || e.keyCode === 122) {
    // let the browser do its thing, then run lifecycle logic
    setTimeout(() => {
      if (isFullscreen()) {
        handleUserActivity(); // schedule cursor fade + idle timers
      } else {
        // just exited browser fullscreen
        document.body.classList.remove("cursor-hidden");
        clearTimeout(cursorTimeout);
        clearTimeout(idleTimeout);
        swiper?.autoplay?.start();
      }
    }, 120); // 80–200ms is usually enough
  }
});
let lastInnerHeight = window.innerHeight;
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // If viewport height changed a lot, treat like fullscreen toggle
    if (Math.abs(window.innerHeight - lastInnerHeight) > 100) {
      // either entered or exited browser fullscreen — run same logic
      if (isFullscreen()) handleUserActivity();
      else {
        document.body.classList.remove("cursor-hidden");
        clearTimeout(cursorTimeout);
        clearTimeout(idleTimeout);
        swiper?.autoplay?.start();
      }
    }
    lastInnerHeight = window.innerHeight;
  }, 150);
});


  [
    "mousemove",
    "mousedown",
    "mouseup",
    "click",
    "scroll",
    "keydown",
    "keyup",
    "wheel",
    "touchstart",
    "touchmove",
    "mouseenter",
    "input",
    "submit",
  ].forEach((eventName) => {
    document.addEventListener(eventName, handleUserActivity, { passive: true });
  });


  mainContainer.addEventListener("mousemove", handleUserActivity, { passive: true });
mainContainer.addEventListener("click", handleUserActivity, { passive: true });

// also attach to root surfaces in case browser directs events differently
document.documentElement.addEventListener("mousemove", handleUserActivity, { passive: true });
window.addEventListener("mousemove", handleUserActivity, { passive: true });


    document.addEventListener("fullscreenchange", () => {
      if (isFullscreen()) {
        // when fullscreen is confirmed THEN run idle logic
        handleUserActivity();
      } else {
        document.body.classList.remove("cursor-hidden");
        clearTimeout(cursorTimeout);
        clearTimeout(idleTimeout);
        swiper?.autoplay?.start();
      }
    });


  fullscreenBtn?.addEventListener("click", () => {
    if (!isFullscreen()) {
      mainContainer.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen();
    }
  });
})();
