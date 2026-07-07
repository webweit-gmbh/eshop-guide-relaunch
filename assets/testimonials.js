(() => {
  const initSlider = (section) => {
    let  testimonialsSlider,
      navigation,
      pagination;

    if (document.currentScript) {
      testimonialsSlider = document.currentScript.parentElement.querySelector('.testimonials__slider');
      if (testimonialsSlider) {
        navigation = document.currentScript.parentElement.querySelector('.testimonials__navigation');
        pagination = document.currentScript.parentElement.querySelector('.testimonials__pagination');
      }
    }
    else {
      testimonialsSlider = section.querySelector('.testimonials__slider');
      if (testimonialsSlider) {
        navigation = section.querySelector('.testimonials__navigation');
        pagination = section.querySelector('.testimonials__pagination');
      }
    }

    if (testimonialsSlider) {
      const columns = Number(testimonialsSlider.dataset.columns);
      let columns750;
      if (columns > 1) 
        columns750 = columns - 1;
      else
        columns750 = columns;

        let swiperParams = {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 24,
          breakpoints: {
            750: {
              slidesPerView: columns750,
              slidesPerGroup: columns750,
            },
            1200: {
              slidesPerView: columns,
              slidesPerGroup: columns
            }
          }
        };

      if (testimonialsSlider.getAttribute("data-pagination") === "true") {
        swiperParams.pagination = {
          el: pagination,
          type: "bullets",
          clickable: true,
        };
      }

      if (testimonialsSlider.getAttribute("data-navigation") === "true") {
        swiperParams.navigation = {
          nextEl: navigation.querySelector('.swiper-button-next'),
          prevEl: navigation.querySelector('.swiper-button-prev')
        };
      }

      const testimonialsSwiper = new Swiper(testimonialsSlider, swiperParams);
    }
  }

  const initMarqueeDesktop = (section) => {
    let testimonialsMarquee;

    if (document.currentScript) {
      testimonialsMarquee = document.currentScript.parentElement.querySelectorAll('.testimonials__marquee-swiper');
    }
    else {
      testimonialsMarquee = section.querySelectorAll('.testimonials__marquee-swiper');
    }

    if (testimonialsMarquee.length != 0) {
      testimonialsMarquee.forEach(slider => {
        const slides = slider.querySelectorAll('.swiper-slide');
        let sum = 0;
        slides.forEach(slide => {
          slide.style.height = slide.clientHeight+'px';
          sum = sum + slide.clientHeight + 24;
        })
        sum = sum - 24;

        if (slides.length > 0) {
          let i = 0;
          while (sum < slider.clientHeight * 2 ) {
            if (i > slides.length - 1) {
              i = 0;
            }
            let clone =  slider.querySelectorAll('.swiper-slide')[i].cloneNode( true );
            slider.querySelector('.swiper-wrapper').append(clone);
            i++;
            sum = sum + clone.clientHeight + 24;
          }
        }

        const testimonialsMarqueeSlider = new Swiper(slider, {
          slidesPerView: 'auto',
          spaceBetween: 24,
          direction: 'vertical',
          loop: true,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: false,
          autoplay: {
            delay: 1
          },
          freeMode: true,
          speed: 15000
        })
      });
    }
  }

  const initMarqueeMobile = (section) => {
    let testimonialsMarquee;

    if (document.currentScript) {
      testimonialsMarquee = document.currentScript.parentElement.querySelectorAll('.testimonials__marquee-swiper_mobile');
    }
    else {
      testimonialsMarquee = section.querySelectorAll('.testimonials__marquee-swiper_mobile');
    }

    if (testimonialsMarquee.length != 0) {
      testimonialsMarquee.forEach(slider => {
        const testimonialsMarqueeSlider = new Swiper(slider, {
          slidesPerView: 3,
          spaceBetween: 24,
          direction: 'vertical',
          loop: true,
          shortSwipes: false,
          longSwipes: false,
          allowTouchMove: false,
          autoplay: {
            delay: 1
          },
          freeMode: true,
          speed: 15000
        })
      });
    }
  }

  const initSection = (section) => {
    let  sectionTestimonials;
    if (document.currentScript) {
      sectionTestimonials = document.currentScript.parentElement;
    }
    else {
      sectionTestimonials = section;
    }

    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;

      if (entry.contentRect.width > 989) {
        const sliders = entry.target.querySelectorAll('.testimonials__marquee-swiper');
        if (sliders.length != 0) {
          sliders.forEach(slider => {
            if (slider.swiper)
              slider.swiper.destroy();
          })
        }

        initMarqueeDesktop(sectionTestimonials);
      }
      else {
        const sliderMobile = entry.target.querySelector('.testimonials__marquee-swiper_mobile');
        if (sliderMobile) {
          if (sliderMobile.swiper)
            sliderMobile.swiper.destroy();  
        }

        initMarqueeMobile(sectionTestimonials);
      }
    });

    sectionResizeObserver.observe(sectionTestimonials);
  }

  initSlider();
  initMarqueeDesktop();
  initMarqueeMobile();
  initSection();

  document.addEventListener("shopify:section:load", function (section) {
    initSlider(section.target);
    initMarqueeDesktop(section.target);
    initMarqueeMobile(section.target);
    initSection(section.target);
  });
})()