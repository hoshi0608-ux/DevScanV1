document.addEventListener('DOMContentLoaded', function () {
  const carouselEl = document.querySelector('.carousel-slide6');
  const paginationContainer = document.querySelector('.carousel-pagination-slide6');
  if (!carouselEl || !paginationContainer) return;

  const items = carouselEl.querySelectorAll('.carousel-item');
  if (!items.length) return;

  // Create dots
  paginationContainer.innerHTML = '';
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.dataset.index = i;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    paginationContainer.appendChild(dot);

    dot.addEventListener('click', function (e) {
      e.preventDefault();
      const inst = M.Carousel.getInstance(carouselEl);
      if (!inst) return;

      const activeItem = carouselEl.querySelector('.carousel-item.active');
      const currentIndex = Array.prototype.indexOf.call(items, activeItem);
      const targetIndex = i;

      if (currentIndex === targetIndex) return;

      let diff = targetIndex - currentIndex;

      // Shortest direction
      const direction = diff > 0 ? 'next' : 'prev';
      diff = Math.abs(diff);

      // Temporarily disable animation for fast jump
      const originalDuration = inst.options.duration;
      inst.options.duration = 0;

      for (let x = 0; x < diff; x++) {
        inst[direction]();
      }

      // Restore original animation speed
      inst.options.duration = originalDuration;
    });
  });

  const dots = paginationContainer.querySelectorAll('.dot');

  function updateDots(activeIndex) {
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
  }

  // Listen for custom event from slide6.js
  carouselEl.addEventListener('slide6:change', (e) => {
    if (e && e.detail && typeof e.detail.index === 'number') {
      updateDots(e.detail.index);
    }
  });

  // Initial state
  requestAnimationFrame(() => {
    const active = carouselEl.querySelector('.carousel-item.active');
    if (active) {
      const idx = Array.prototype.indexOf.call(items, active);
      updateDots(idx === -1 ? 0 : idx);
    } else {
      updateDots(0);
    }
  });
});
