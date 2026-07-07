(() => {
  /* If number of slides is less than slidesPerView * 2, duplicate slides */
  const setSlides = (sliders) => {
    if (sliders && sliders.length > 0) {
      sliders.forEach(swiper => {
        let SLIDES_REQUIRED;
        const wrapper = swiper.querySelector('.swiper-wrapper');
        const srcElems = wrapper.querySelectorAll('.logo-list__item');
        const isHorizontal = swiper.classList.contains('logo-list__content--horizontal-carousel');

        if (window.matchMedia("(min-width: 1200px)").matches) {
          if (srcElems.length > 5) {
            SLIDES_REQUIRED = isHorizontal ? 12 : 6;
          } else {
            SLIDES_REQUIRED = srcElems.length;
          }
        } else if (window.matchMedia("(min-width: 990px)").matches) {
          if (srcElems.length > 4) {
            SLIDES_REQUIRED = isHorizontal ? 8 : 6;
          } else {
            SLIDES_REQUIRED = srcElems.length;
          }
        } else if (window.matchMedia("(min-width: 750px)").matches) {
          if (srcElems.length > 3) {
            SLIDES_REQUIRED = isHorizontal ? 6 : 6;
          } else {
            SLIDES_REQUIRED = srcElems.length;
          }
        } else {
          if (srcElems.length > 2) {
            SLIDES_REQUIRED = isHorizontal ? 4 : 6;
          } else {
            SLIDES_REQUIRED = srcElems.length;
          }
        }

        while (wrapper.querySelectorAll('.logo-list__item').length < SLIDES_REQUIRED) {
          srcElems.forEach(el => {
            const cloneElem = el.cloneNode(true);
            wrapper.appendChild(cloneElem);
          });
        }
      });
    }
  }

  const recalculateSlidesLength = () => {
    setSlides(document.querySelectorAll('.js-slider-logos'));
    setSlides(document.querySelectorAll('.js-slider-logos-slow'));
  }

  const initSlider = (section) => {
    let logosSlider;
    let logosSliderSlow;

    if (document.currentScript) {
      logosSlider = document.currentScript.parentElement.querySelectorAll('.js-slider-logos');
      logosSliderSlow = document.currentScript.parentElement.querySelectorAll('.js-slider-logos-slow');
    }
    else {
      logosSlider = section.querySelectorAll('.js-slider-logos');
      logosSliderSlow = section.querySelectorAll('.js-slider-logos-slow');
    }

    if (logosSlider && logosSlider.length > 0) {
      logosSlider.forEach(el => {
        let autoplay = {delay: 1};
        let allowTouchMove = false;
        let freeMode = false;

        if (el.classList.contains("no-animation")) {
          autoplay = false;
          allowTouchMove = true;
          freeMode = true;          
        }
  
        const speed1 = el.getAttribute('data-duration');

        const logosSwiper1 = new Swiper(el, {
          slidesPerView: el.classList.contains('logo-list__content--horizontal-carousel') ? 2 : 3,
          spaceBetween: 16,
          autoplay: autoplay,
          direction: 'horizontal',
          loop: true,
          speed: speed1,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: allowTouchMove,
          freeMode: freeMode,
          breakpoints: {
            750: {
              direction: el.classList.contains('logo-list__content--vertical-carousel') ? 'vertical' : 'horizontal',
              slidesPerView: 3,
              spaceBetween: 20
            },
            990: {
              direction: el.classList.contains('logo-list__content--vertical-carousel') ? 'vertical' : 'horizontal',
              slidesPerView: el.classList.contains('logo-list__content--horizontal-carousel') ? 4 : 3,
              spaceBetween: 24
            },
            1200: {
              direction: el.classList.contains('logo-list__content--vertical-carousel') ? 'vertical' : 'horizontal',
              slidesPerView: el.classList.contains('logo-list__content--horizontal-carousel') ? 6 : 3,
              spaceBetween: 24
            }
          }
        });
      });
    }

    if (logosSliderSlow && logosSliderSlow.length > 0) {
      logosSliderSlow.forEach(el => {
        const speed2 = el.getAttribute('data-duration');

        const logosSwiper2 = new Swiper(el, {
          slidesPerView: 3,
          spaceBetween: 16,
          autoplay: {
            delay: 1
          },
          direction: 'horizontal',
          loop: true,
          speed: speed2,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: false,
          breakpoints: {
            750: {
              direction: 'vertical',
              slidesPerView: 3,
              spaceBetween: 20
            },
            990: {
              direction: 'vertical',
              slidesPerView: 3,
              spaceBetween: 24
            }
          }
        });
      });
    }
  }

  const initSection = (section) => {
    let sectionLogos;

    if (document.currentScript) {
      sectionLogos = document.currentScript.parentElement;
    }
    else {
      sectionLogos = section;
    }

    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      const sliders = entry.target.querySelectorAll('.js-slider-logos');
      const slidersSlow = entry.target.querySelectorAll('.js-slider-logos-slow');

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

      recalculateSlidesLength();
      initSlider(sectionLogos);
    });

    recalculateSlidesLength();
    initSlider(sectionLogos);

    sectionResizeObserver.observe(sectionLogos);
  }

  initSection();

  document.addEventListener("shopify:section:load", function (section) {
    initSection(section.target);
  });
})()