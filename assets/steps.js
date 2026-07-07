window.initStepsSection = function(sectionElement) {
  const progressBar = (steps, heightSection, stepsItems, progress) => {
    let scrollTop = window.scrollY + window.innerHeight / 2;
    let topSteps = window.scrollY + steps.getBoundingClientRect().top;

    let heightProgress;
    if (scrollTop < topSteps)
      heightProgress = 0;
    else if (scrollTop > heightSection + topSteps)
      heightProgress = 100;
    else
      heightProgress = (scrollTop - topSteps)/heightSection * 100;
    progress.style.height = heightProgress + '%';

    for (let step of stepsItems) {
      let number = step.querySelector('.step__number');
      let topNumber = window.scrollY + number.getBoundingClientRect().top;
      if (topNumber < scrollTop) 
        number.classList.add('active');
      else 
        number.classList.remove('active');
    }
  }

  const collapsibleSteps = (container) => {
    // Use a scoped query so it works with multiple sections
    const toggles = container.querySelectorAll(".step__toggle");
    toggles.forEach(toggle => {
      toggle.removeEventListener("click", handleToggleClick);
      toggle.addEventListener("click", handleToggleClick);
    });

    function handleToggleClick() {
      const parent = this.parentElement;
      const wrapper = parent.closest(".steps__wrapper");
      const i = Array.from(wrapper.querySelectorAll(".step")).indexOf(parent);

      if (!parent.classList.contains("active")) {
        const activeStep = wrapper.querySelector(".step.active");
        if (activeStep) activeStep.classList.remove("active");

        const activeImage = wrapper.querySelector(".step__image:not(.step__image-mobile).active");
        if (activeImage) activeImage.classList.remove("active");

        parent.classList.add("active");
        const images = wrapper.querySelectorAll(".step__image:not(.step__image-mobile)");
        if (images[i]) images[i].classList.add("active");

        // Slide up all contents
        const contents = wrapper.querySelectorAll(".step__toggle-content");
        contents.forEach(content => {
          $(content).stop().slideUp(300);
        });

        // Slide down the clicked one
        const content = parent.querySelector(".step__toggle-content");
        if (content) $(content).stop().slideDown(300);
      }
    }
  }

  const initSlider = (sectionSteps) => {
    const stepsThumbs = sectionSteps.querySelector('.steps__thumbs');
    const stepsSlider = sectionSteps.querySelector('.steps__swiper');
    const navigation = sectionSteps.querySelector('.steps__navigation');
    const pagination = sectionSteps.querySelector('.steps__pagination');
    
    let stepsThumbsSwiper;
    if (stepsThumbs) {
      let swiperParamsThumbs = {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 32
          },
          750: {
            slidesPerView: 2,
            spaceBetween: 64
          },
          990: {
            slidesPerView: 3,
            spaceBetween: 129
          }
        },
        on: {
          click: function (swiper, event) {
            if (!event.target.classList.contains('swiper-wrapper')) {
              if (swiper.clickedIndex != 0 && swiper.clickedIndex != swiper.slides.length - 1) {
                if (swiper.clickedIndex == swiper.visibleSlidesIndexes[swiper.visibleSlidesIndexes.length - 1]) {
                  swiper.slideNext();
                }
                  
                if (swiper.clickedIndex == swiper.visibleSlidesIndexes[0])
                  swiper.slidePrev();
              }
            }
          },
        }
      }

      stepsThumbsSwiper = new Swiper(stepsThumbs, swiperParamsThumbs);
    }

    if (stepsSlider) {
      let swiperParams = {
        slidesPerView: 1,
        navigation: {
          nextEl: navigation ? navigation.querySelector('.swiper-button-next') : null,
          prevEl: navigation ? navigation.querySelector('.swiper-button-prev') : null
        },
        pagination: {
          el: pagination,
          type: "bullets",
          clickable: true,
        },
        thumbs: {
          swiper: stepsThumbsSwiper
        }
      }

      new Swiper(stepsSlider, swiperParams);
    }
  }

  const setupResizeObserver = (sectionSteps) => {
    const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries; 

      const progress = sectionSteps.querySelector(".steps__progress");
      const steps = sectionSteps.querySelector(".steps__content--scroll");
      let stepsItems, heightSection;
      if (steps) {
        stepsItems = sectionSteps.querySelectorAll(".steps__content--scroll .step");
        heightSection = steps.clientHeight;
      }

      if (progress) {
        progressBar(steps, heightSection, stepsItems, progress);
        window.addEventListener("scroll", () => {
          progressBar(steps, heightSection, stepsItems, progress);
        });
      }

      const slider = sectionSteps.querySelector('.steps__swiper');
      const thumbs = sectionSteps.querySelector('.steps__thumbs');
      if (slider && slider.swiper) {
        if (entry.contentRect.width < 576) {
          slider.swiper.thumbs = { swiper: '' };
          if (thumbs && thumbs.swiper) {
            thumbs.swiper.controller.control = slider.swiper;
            slider.swiper.controller.control = thumbs.swiper;
            thumbs.swiper.update();
          }
          slider.swiper.update();
        } else {
          slider.swiper.thumbs = { swiper: thumbs ? thumbs.swiper : null };
          if (thumbs && thumbs.swiper) {
            thumbs.swiper.controller.control = thumbs.swiper;
            slider.swiper.controller.control = slider.swiper;
            thumbs.swiper.update();
          }
          slider.swiper.update();
        }
      }
    });

    sectionResizeObserver.observe(sectionSteps);
  }

  // Initialize the given steps section element
  const sectionSteps = sectionElement.querySelector(".steps");
  if (!sectionSteps) return;

  initSlider(sectionSteps);
  collapsibleSteps(sectionSteps);
  setupResizeObserver(sectionSteps);
};

// Initialize existing sections on page load
document.addEventListener("DOMContentLoaded", function() {
  initStepsSection(document);
});

// Re-initialize on Shopify section load
document.addEventListener("shopify:section:load", function (event) {
  initStepsSection(event.target);
});