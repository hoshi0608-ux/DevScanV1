const drawer = document.querySelector('.drawer');
const drawerToggle = document.querySelector('.drawer-toggle');
const drawerClose = document.querySelector('.drawer-close');
const drawerOverlay = document.querySelector('.drawer-overlay');
const drawerTabs = document.querySelectorAll('.drawer-tabs .slider-tab');
const paginationTabs = document.querySelectorAll('.slider-pagination .slider-tabsss');

const MOBILE_BREAKPOINT = 768; // match your CSS @media breakpoint

// ===== Drawer Functions =====
function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners
drawerToggle.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// Close on ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// ===== Auto-Close on Resize to Desktop =====
window.addEventListener('resize', () => {
  if (window.innerWidth > MOBILE_BREAKPOINT && drawer.classList.contains('open')) {
    closeDrawer();
  }
});

// ===== Helper to update active state everywhere =====
function setActiveTab(index) {
  // Drawer tabs
  drawerTabs.forEach(t => t.classList.remove('active'));
  if (drawerTabs[index]) drawerTabs[index].classList.add('active');

  // Pagination tabs
  paginationTabs.forEach(t => t.classList.remove('active'));
  if (paginationTabs[index]) paginationTabs[index].classList.add('active');
}

// ===== Always Reset to Home (first tab) on refresh =====
window.addEventListener("load", () => {
  swiper.slideTo(0, 0); // jump to first slide instantly
  setActiveTab(0);      // set Home as active
});

// ===== Link Drawer Tabs to Swiper =====
drawerTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    swiper.slideTo(index);
    setActiveTab(index);
    closeDrawer();
  });
});

// ===== Link Pagination Tabs to Swiper =====
paginationTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    swiper.slideTo(index);
    setActiveTab(index);
  });
});

// ===== Sync When Swiper Changes =====
swiper.on('slideChange', () => {
  const activeIndex = swiper.activeIndex;
  setActiveTab(activeIndex);
});
