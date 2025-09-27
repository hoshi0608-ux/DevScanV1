const sliderTabs = document.querySelectorAll('.slider-tabsss');
const sliderIndicator = document.querySelector('.slider-indicator');
const sliderPagination = document.querySelector('.slider-pagination');
const sliderControls = document.querySelector('.slider-controls');
const prevBtn = document.getElementById('slide-prev');
const nextBtn = document.getElementById('slide-next');

// Init Swiper
const swiper = new Swiper('.slider-container', {
  effect: 'coverflow',
  speed: 1500,
  navigation: {
    prevEl: '#slide-prev',
    nextEl: '#slide-next',
  },
  on: {
    slideChange: () => {
      const currentTab = sliderTabs[swiper.realIndex];
      updateIndicator(currentTab);
    }
  }
});

// Update Indicator and tab styles
function updateIndicator(tab) {
  if (!tab) return;

  sliderTabs.forEach(t => {
    t.classList.remove('active');
    t.style.color = 'white'; // reset all tabs color
    t.style.borderBottomColor = 'white'; // reset underline color
  });

  tab.classList.add('active');
  tab.style.color = '#a35bbe'; // active tab text color (hover color)
  tab.style.borderBottomColor = '#a35bbe'; // active tab underline color

  // Position sliderIndicator under the active tab's text
  const tabText = tab.querySelector('.tab-text');
  const tabTextRect = tabText.getBoundingClientRect();
  const containerRect = tab.parentElement.getBoundingClientRect();
  const offsetLeft = tabTextRect.left - containerRect.left;
  const width = tabTextRect.width;

  const extraWidthVW = (65 / 1536) * 100; // approx 4.23vw

  sliderIndicator.style.transform = `translateX(${offsetLeft}px)`;
  sliderIndicator.style.width = `calc(${width}px + ${extraWidthVW}vw)`;
  sliderIndicator.style.backgroundColor = '#a35bbe'; // underline hover color for active

  // Scroll active tab into view on smaller screens
  if (window.innerWidth <= 768) {
    tab.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }
}

// Check if pagination overflows and toggle scrollable class
function checkPaginationOverflow() {
  const isOverflowing = sliderPagination.scrollWidth > sliderControls.clientWidth;
  sliderControls.classList.toggle('scrollable', isOverflowing);
  sliderPagination.classList.toggle('scrollable', isOverflowing);
}

// Responsive styling adjustments
function responsiveAdjustments() {
  const width = window.innerWidth;

  const btnSize = width <= 480 ? 40 : width <= 768 ? 55 : 65;
  const btnWidth = width <= 480 ? 80 : width <= 768 ? 120 : 165;

  [prevBtn, nextBtn].forEach(btn => {
    btn.style.fontSize = `${btnSize}px`;
    btn.style.width = `${btnWidth}px`;
  });

  // <<<< CHANGE FONT SIZE OF .slider-tabsss ELEMENTS HERE >>>>
  sliderTabs.forEach(tab => {
    tab.style.fontSize =
      width <= 480 ? '1rem' : width <= 768 ? '1.2rem' : '1.5rem';  // <-- Edit these values to change font size
  });

  // Other responsive styles remain unchanged
  document.querySelectorAll('.Text').forEach(text => {
    text.style.fontSize =
      width <= 480 ? '2.5rem' : width <= 768 ? '4rem' : '6rem';
    text.style.paddingLeft =
      width <= 480 ? '20px' : width <= 768 ? '60px' : '100px';
  });

  document.querySelectorAll('.Info').forEach(info => {
    info.style.fontSize =
      width <= 480 ? '1rem' : width <= 768 ? '1.2rem' : '1.3rem';
    info.style.paddingLeft =
      width <= 480 ? '20px' : width <= 768 ? '60px' : '110px';
  });
}

// Tab click & hover handlers
sliderTabs.forEach((tab, index) => {
  tab.style.cursor = 'pointer';

  // On tab click, slide to that index and update indicator
  tab.addEventListener('click', () => {
    swiper.slideTo(index);
    updateIndicator(tab);
  });

  // On mouse enter, highlight the tab text only (not underline anymore)
  tab.addEventListener('mouseenter', () => {
    if (!tab.classList.contains('active')) {
      tab.style.color = '#a35bbe';             // hover color text
      // tab.style.borderBottomColor = '#a35bbe'; // ❌ removed so underline stays white
      sliderIndicator.style.backgroundColor = '#a35bbe'; // indicator hover color
    }
  });

  // On mouse leave, revert tab styles (active stays highlighted)
  tab.addEventListener('mouseleave', () => {
    if (tab.classList.contains('active')) {
      tab.style.color = '#a35bbe';             // active color text
      tab.style.borderBottomColor = '#a35bbe'; // active underline color
      sliderIndicator.style.backgroundColor = '#a35bbe';
    } else {
      tab.style.color = 'white';               // default text color
      tab.style.borderBottomColor = 'white';   // default underline color
      sliderIndicator.style.backgroundColor = 'white';
    }
  });
});

// Blur nav buttons after click for better UX
prevBtn.addEventListener('click', (e) => e.currentTarget.blur());
nextBtn.addEventListener('click', (e) => e.currentTarget.blur());

// Initial setup on load
window.addEventListener('load', () => {
  updateIndicator(sliderTabs[0]);
  checkPaginationOverflow();
  responsiveAdjustments();
});

// Window resize adjustments
window.addEventListener('resize', () => {
  const activeTab = document.querySelector('.slider-tabsss.active');
  if (activeTab) updateIndicator(activeTab);
  checkPaginationOverflow();
  responsiveAdjustments();
});

// Keyboard navigation (ArrowLeft, ArrowRight)
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    swiper.slidePrev();
    prevBtn.focus();
    prevBtn.classList.add('temp-focus');
  } else if (e.key === 'ArrowRight') {
    swiper.slideNext();
    nextBtn.focus();
    nextBtn.classList.add('temp-focus');
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    prevBtn.classList.remove('temp-focus');
    prevBtn.blur();
  } else if (e.key === 'ArrowRight') {
    nextBtn.classList.remove('temp-focus');
    nextBtn.blur();
  }
});
