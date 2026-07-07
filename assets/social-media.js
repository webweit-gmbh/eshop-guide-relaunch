(function () {
  const initSlider1 = () => {
    const sliders1 = document.querySelectorAll('.js-social-media');

    if (sliders1 && sliders1.length > 0) {
      sliders1.forEach(el => {
        const speed1 = el.getAttribute('data-duration');

        let slider1 = new Swiper(el, {
          slidesPerView: 1,
          spaceBetween: 1,
          loop: true,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: false,
          autoplay: {
            delay: 2000
          },
          speed: speed1
        });
      });
    }
  }

  const initSlider2 = () => {
    const sliders2 = document.querySelectorAll('.js-social-media-slow');

    if (sliders2 && sliders2.length > 0) {
      sliders2.forEach(el => {
        const speed2 = el.getAttribute('data-duration');

        let slider2 = new Swiper(el, {
          slidesPerView: 1,
          spaceBetween: 1,
          loop: true,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: false,
          autoplay: {
            delay: 2000
          },
          speed: speed2
        });
      });
    }
  }

  const initSliders = () => {
    initSlider1();
    initSlider2();
  }

  const initSection = () => {
    const socialMediaSection = document.querySelectorAll('.social-media-section');

    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      const sliders = entry.target.querySelectorAll('.js-social-media');
      const slidersSlow = entry.target.querySelectorAll('.js-social-media');

      if (sliders.length != 0) {
        sliders.forEach(slider => {
          if (slider.swiper)
            slider.swiper.destroy();
        })
      }

      if (slidersSlow.length != 0) {
        slidersSlow.forEach(slider => {
          if (slider.swiper)
            slider.swiper.destroy();
        })
      }

      initSliders();
    });

    socialMediaSection.forEach(section => {
      sectionResizeObserver.observe(section);
    });
  }

  document.addEventListener('shopify:section:load', function () {
    initSliders();
    initSection();
  });

  initSliders();
  initSection();
})();
