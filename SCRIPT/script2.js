// ============================
//  MAIN SWIPER SETUP
// ============================
const sliderTabs = document.querySelectorAll(".slider-tabsss");
const sliderIndicator = document.querySelector(".slider-indicator");
const sliderPagination = document.querySelector(".slider-pagination");
const sliderControls = document.querySelector(".slider-controls");
const prevBtn = document.getElementById("slide-prev");
const nextBtn = document.getElementById("slide-next");

// ============================
//  INIT SWIPER (Expo-like effect)
// ============================
const swiper = new Swiper(".slider-container", {
  effect: "creative",
  speed: 1500,
  loop: true,
  creativeEffect: {
    prev: {
      translate: ["-30%", 0, -400],
      scale: 0.85,
      opacity: 0.6,
    },
    next: {
      translate: ["100%", 0, 0],
      scale: 1,
      opacity: 1,
    },
    // You can also add a mid effect if supported, or tweak shadows
  },
  navigation: {
    prevEl: "#slide-prev",
    nextEl: "#slide-next",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});


// ============================
//  INDICATOR UPDATE
// ============================
function updateIndicator(tab) {
  if (!tab) return;

  sliderTabs.forEach((t) => {
    t.classList.remove("active");
    t.style.color = "white";
    t.style.borderBottomColor = "white";
  });

  tab.classList.add("active");
  tab.style.color = "#a35bbe";
  tab.style.borderBottomColor = "#a35bbe";

  const tabText = tab.querySelector(".tab-text");
  const tabTextRect = tabText.getBoundingClientRect();
  const containerRect = tab.parentElement.getBoundingClientRect();
  const offsetLeft = tabTextRect.left - containerRect.left;
  const width = tabTextRect.width;
  const extraWidthVW = (65 / 1536) * 100; // ~4.23vw

  sliderIndicator.style.transform = `translateX(${offsetLeft}px)`;
  sliderIndicator.style.width = `calc(${width}px + ${extraWidthVW}vw)`;
  sliderIndicator.style.backgroundColor = "#a35bbe";

  if (window.innerWidth <= 768) {
    tab.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

// ============================
//  RESPONSIVENESS & BUTTONS
// ============================
function checkPaginationOverflow() {
  const isOverflowing = sliderPagination.scrollWidth > sliderControls.clientWidth;
  sliderControls.classList.toggle("scrollable", isOverflowing);
  sliderPagination.classList.toggle("scrollable", isOverflowing);
}

function responsiveAdjustments() {
  const width = window.innerWidth;
  const btnSize = width <= 480 ? 40 : width <= 768 ? 55 : 65;
  const btnWidth = width <= 480 ? 80 : width <= 768 ? 120 : 165;

  [prevBtn, nextBtn].forEach((btn) => {
    btn.style.fontSize = `${btnSize}px`;
    btn.style.width = `${btnWidth}px`;
  });

  sliderTabs.forEach((tab) => {
    tab.style.fontSize =
      width <= 480 ? "1rem" : width <= 768 ? "1.2rem" : "1.5rem";
  });

  document.querySelectorAll(".Text").forEach((text) => {
    text.style.fontSize =
      width <= 480 ? "2.5rem" : width <= 768 ? "4rem" : "6rem";
    text.style.paddingLeft =
      width <= 480 ? "20px" : width <= 768 ? "60px" : "100px";
  });

  document.querySelectorAll(".Info").forEach((info) => {
    info.style.fontSize =
      width <= 480 ? "1rem" : width <= 768 ? "1.2rem" : "1.3rem";
    info.style.paddingLeft =
      width <= 480 ? "20px" : width <= 768 ? "60px" : "110px";
  });
}

// ============================
//  TABS & EVENTS
// ============================
sliderTabs.forEach((tab, index) => {
  tab.style.cursor = "pointer";

  tab.addEventListener("click", () => {
    swiper.slideToLoop(index);
    updateIndicator(tab);
  });

  tab.addEventListener("mouseenter", () => {
    if (!tab.classList.contains("active")) {
      tab.style.color = "#a35bbe";
      sliderIndicator.style.backgroundColor = "#a35bbe";
    }
  });

  tab.addEventListener("mouseleave", () => {
    if (tab.classList.contains("active")) {
      tab.style.color = "#a35bbe";
      tab.style.borderBottomColor = "#a35bbe";
      sliderIndicator.style.backgroundColor = "#a35bbe";
    } else {
      tab.style.color = "white";
      tab.style.borderBottomColor = "white";
      sliderIndicator.style.backgroundColor = "white";
    }
  });
});

// ============================
//  BUTTONS & KEYS
// ============================
prevBtn.addEventListener("click", (e) => {
  e.currentTarget.blur();
  swiper.slidePrev();
  swiper.autoplay.start();
});

nextBtn.addEventListener("click", (e) => {
  e.currentTarget.blur();
  swiper.slideNext();
  swiper.autoplay.start();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    swiper.slidePrev();
    prevBtn.focus();
    prevBtn.classList.add("temp-focus");
  } else if (e.key === "ArrowRight") {
    swiper.slideNext();
    nextBtn.focus();
    nextBtn.classList.add("temp-focus");
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    prevBtn.classList.remove("temp-focus");
    prevBtn.blur();
  } else if (e.key === "ArrowRight") {
    nextBtn.classList.remove("temp-focus");
    nextBtn.blur();
  }
});

// ============================
//  INIT ON LOAD / RESIZE
// ============================
window.addEventListener("load", () => {
  swiper.slideToLoop(0, 0);
  updateIndicator(sliderTabs[0]);
  checkPaginationOverflow();
  responsiveAdjustments();
});

window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".slider-tabsss.active");
  if (activeTab) updateIndicator(activeTab);
  checkPaginationOverflow();
  responsiveAdjustments();
});
