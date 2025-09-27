// slide6.js
$(document).ready(function () {
  const $carousel = $('.carousel-slide6');

  $carousel.carousel({
    padding: 200,
    numVisible: 3,
    shift: 50,
    dist: -50,
    indicators: false, // we are using custom dots
    onCycleTo: function (el /* DOM element */) {
      // Find index of the new active item
      const items = $carousel[0].querySelectorAll('.carousel-item');
      const index = Array.prototype.indexOf.call(items, el);

      // Broadcast a custom event that pagination listens to
      $carousel[0].dispatchEvent(
        new CustomEvent('slide6:change', { detail: { index } })
      );
    }
  });

  // OPTIONAL autoplay (works with dots)
  // setInterval(() => $carousel.carousel('next'), 4500);

  // Sync once on load
  const active = $carousel[0].querySelector('.carousel-item.active');
  if (active) {
    const items = $carousel[0].querySelectorAll('.carousel-item');
    const index = Array.prototype.indexOf.call(items, active);
    $carousel[0].dispatchEvent(new CustomEvent('slide6:change', { detail: { index } }));
  }
});
