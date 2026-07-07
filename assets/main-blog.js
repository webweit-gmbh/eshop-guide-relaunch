(function() {
  const initSlider = (section) => {
    let parent;
    if (document.currentScript) {
      parent = document.currentScript.parentElement;
    }
    else {
      parent = section;
    }
    const slider = parent.querySelector('.main-blog__slider');

    if (slider) {
      const buttonNext = parent.querySelector('.main-blog__navigation .swiper-button-next');
      const buttonPrev = parent.querySelector('.main-blog__navigation .swiper-button-prev');

      const featuredArticlesSlider = new Swiper(slider, {
        loop: true,
        navigation: {
          nextEl: buttonNext,
          prevEl: buttonPrev,
        },
        pagination: {
          el: ".main-blog__pagination",
          type: "bullets",
          clickable: true,
        }
      })
    }
  }

  initSlider();

  document.addEventListener('shopify:section:load', function (section) {
    initSlider(section.target);
  });
})()