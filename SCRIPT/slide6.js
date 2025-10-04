// Wait for everything to load completely
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure CSS is fully applied
    setTimeout(initSecuritySlider, 100);
});

function initSecuritySlider() {
    const SecuritySlider = new Swiper('.security-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // Force proper initialization
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        // Re-initialize on window resize
        on: {
            init: function () {
                console.log('Swiper initialized successfully');
            },
            resize: function () {
                this.update();
            }
        }
    });
    
    return SecuritySlider;
}

// Additional fix: Update Swiper when window loads completely
window.addEventListener('load', function() {
    const slider = document.querySelector('.security-slider')?.swiper;
    if (slider) {
        setTimeout(() => {
            slider.update();
            slider.slideTo(0);
        }, 150);
    }
});
