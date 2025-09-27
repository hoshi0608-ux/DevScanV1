const drawer = document.querySelector('.drawer');
const drawerToggle = document.querySelector('.drawer-toggle');
const drawerClose = document.querySelector('.drawer-close');
const drawerOverlay = document.querySelector('.drawer-overlay');
const drawerTabs = document.querySelectorAll('.drawer-tabs .slider-tab');

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

// ===== Restore Active Tab from Local Storage =====
const savedTabIndex = localStorage.getItem('activeDrawerTab');
if (savedTabIndex !== null && drawerTabs[savedTabIndex]) {
  drawerTabs.forEach(t => t.classList.remove('active'));
  drawerTabs[savedTabIndex].classList.add('active');
}

// ===== Link Drawer Tabs to Swiper & Set Active =====
drawerTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    drawerTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    localStorage.setItem('activeDrawerTab', index);
    swiper.slideTo(index);
    closeDrawer();
  });
});

// ===== Sync Active Tab When Swiper Changes =====
swiper.on('slideChange', () => {
  const activeIndex = swiper.activeIndex;
  drawerTabs.forEach(t => t.classList.remove('active'));
  if (drawerTabs[activeIndex]) {
    drawerTabs[activeIndex].classList.add('active');
    localStorage.setItem('activeDrawerTab', activeIndex);
  }
});
