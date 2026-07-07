(() => {
	const playVideo = (slider) => {
		if (slider.swiper) {
			const sliderSwiper = slider.swiper;

			if (sliderSwiper.slides[sliderSwiper.previousIndex]) {
				const videoPrev = sliderSwiper.slides[sliderSwiper.previousIndex].querySelector('.slideshow__video video');
        if (videoPrev) {
          videoPrev.pause();
        }
			}

			if (sliderSwiper.slides[sliderSwiper.activeIndex]) {
				const videoActive = sliderSwiper.slides[sliderSwiper.activeIndex].querySelector('.slideshow__video video');
        if (videoActive) {
					videoActive.play();
				}
			}
		}
	}

	const stopVideo = (slider) => {
		if (slider.swiper) {
			const sliderSwiper = slider.swiper

			if (sliderSwiper.slides[sliderSwiper.activeIndex]) {
				const videoActive = sliderSwiper.slides[sliderSwiper.activeIndex].querySelector('.slideshow__video video');
				if (videoActive) {
					videoActive.pause();
				}
			}
		}
	}

	const heightPagination = (section) => {
		let paginationWrapper = section.querySelector('.slideshow__bottom');
		let pagination = section.querySelector('.slideshow__bottom .swiper-pagination-bullets');

		if (pagination) {
			const heightPagination = pagination.getBoundingClientRect().height;
			const bottomPagination = parseFloat(window.getComputedStyle(paginationWrapper, null).getPropertyValue("bottom"));
			const paddingBottom = parseFloat(window.getComputedStyle(section.querySelector('.slideshow__content-wrapper'), null).getPropertyValue("padding-bottom"));
			
			if (heightPagination + bottomPagination > paddingBottom ) {
				section.querySelectorAll('.slideshow__content-wrapper').forEach(wrapper => {
					wrapper.style.paddingBottom = `${heightPagination + bottomPagination + 20}px`;
				});
			}
		}
	}

	const initSlider = (section) => {
		let parent;
		if (document.currentScript) {
			parent = document.currentScript.parentElement;
		}
		else {
			parent = section;
		}

		const slideshow = parent.querySelector(".slideshow__swiper");
		const prevBtn = parent.querySelector(".swiper-button-prev");
		const nextBtn = parent.querySelector(".swiper-button-next");
		const thumbs = parent.querySelector('.slideshow__thumbs');
		const thumbsFull = parent.querySelector('.slideshow__thumbs-full');

		if (slideshow) {
			const paginationNumber = slideshow.querySelector('.slideshow__pagination-number');
			const duration = slideshow.querySelector('.slideshow__slide').getAttribute("data-swiper-autoplay");
			const countSlides = slideshow.querySelectorAll('.slideshow__slide').length;

			let thumbsSwiper;
			if (thumbs) {
				let slidesPerView990 = countSlides < 4 ? countSlides : 4;
				let slidesPerView750 = countSlides < 4 ? slidesPerView990: 3;
				let slidesPerView576 = countSlides < 3 ? slidesPerView750: 2;
				let slidesPerView = countSlides < 2 ? slidesPerView576: 1.8;


				let swiperThumbsParams = {
					slidesPerView: slidesPerView,
					spaceBetween: 8,				
					breakpoints: {
						576: {
							slidesPerView: slidesPerView576,
							spaceBetween: 20
						},
						750: {
							slidesPerView: slidesPerView750,
							spaceBetween: 20
						},
						990: {
							slidesPerView: slidesPerView990,
							spaceBetween: 20
						}
					},
					on: {
						touchEnd: function (s, e) {
							let range = 5;
							let diff = (s.touches.diff = s.isHorizontal()
								? s.touches.currentX - s.touches.startX
								: s.touches.currentY - s.touches.startY);
							if (diff < range || diff > -range) s.allowClick = true;
						}
					}
				}
				thumbsSwiper = new Swiper(thumbs, swiperThumbsParams);
			}

			let thumbsFullSwiper;
			if (thumbsFull) {
				let slidesPerView990 = countSlides < 4 ? countSlides : 4;
				let slidesPerView750 = countSlides < 4 ? slidesPerView990: 3;
				let slidesPerView576 = countSlides < 3 ? slidesPerView750: 2;
				let slidesPerView = countSlides < 2 ? slidesPerView576: 1.8;

				let swiperThumbsParams = {
					slidesPerView: slidesPerView,
					spaceBetween: 24,
					breakpoints: {
						576: {
							slidesPerView: slidesPerView576,
							spaceBetween: 32
						},
						750: {
							slidesPerView: slidesPerView750,
							spaceBetween: 48
						},
						990: {
							slidesPerView: slidesPerView990,
							spaceBetween: 64
						}
					},
					on: {
						touchEnd: function (s, e) {
							let range = 5;
							let diff = (s.touches.diff = s.isHorizontal()
								? s.touches.currentX - s.touches.startX
								: s.touches.currentY - s.touches.startY);
							if (diff < range || diff > -range) s.allowClick = true;
						}
					}
				}
				thumbsFullSwiper = new Swiper(thumbsFull, swiperThumbsParams);
			}


			let swiperParams = {
				speed: 700,
				autoHeight: false,
				allowTouchMove: true,
				on: {
					slideChange() {
						playVideo(slideshow);
					}
				}
			};

			if (slideshow.getAttribute("data-autoplay") === "true") {
				swiperParams.autoplay = {
					disableOnInteraction: true,
					pauseOnMouseEnter: true,
				};
			}

			if (slideshow.getAttribute("data-loop") === "true") {
				swiperParams.loop = true;
				swiperParams.loopPreventsSliding = false;
			}

			if (slideshow.getAttribute("data-pagination") === "true") {
				switch (slideshow.getAttribute("data-pagination-type")) {
					case "bullets":
						swiperParams.pagination = {
							el: ".swiper-pagination",
							type: "bullets",
							clickable: true
						};
						break;
					case "numbers":
						swiperParams.pagination = {
							el: ".slideshow__pagination-number",
							clickable: true,
							renderBullet: function(index, className) {
								return '<span class="' + className + '"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle class="circle" style="animation-duration: ' + duration / 1000 + 's" cx="24" cy="24" r="22" stroke="currentColor"/></svg><span class="h6">'+(index+1)+'</span></span>';
							}
						};
						swiperParams.on = {
							slideChange() {
								if (paginationNumber && paginationNumber.querySelector('.swiper-pagination-bullet-active .circle'))
									paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "running";
								playVideo(slideshow);
							}
						}
						break;
					case "tabs":
						swiperParams.thumbs = {
							swiper: thumbsSwiper
						}
						break;
					case "tabs_full":
						swiperParams.thumbs = {
							swiper: thumbsFullSwiper 
						}
						break;
				}
			}

			if (slideshow.getAttribute("data-navigation") === "true") {
				swiperParams.navigation = {
					nextEl: nextBtn,
					prevEl: prevBtn,
				};
			}

			if (slideshow.getAttribute("data-parallax") === "true") {
				swiperParams.parallax = true;
			}

			const slideshowSwiper = new Swiper(slideshow, swiperParams);				

			if (slideshow.getAttribute("data-autoplay") === "true") { 
				const slides = slideshow.querySelectorAll('.slideshow__slide');
				slides.forEach(slide => {
					slide.addEventListener('mouseenter', () => {
						if (paginationNumber)
							paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "paused";
					});
				});
				slides.forEach(slide => {
					slide.addEventListener('mouseleave', () => {
						if (paginationNumber)
							paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "running";
					});
				});
			}
		}
		
		/*if (slideshowSwiper.addSlide.length < 2) {
			slideshowSwiper.allowTouchMove = false;
		} else {
			slideshowSwiper.allowTouchMove = true;
		}
		if (slideshowSwiper.addSlide.length > 1)
			slideshow.classList.add("slideshow__swiper--multiple-slides");*/
	};

	const initSection = (section) => {
		let  sectionSlideshow;
    if (document.currentScript) {
      sectionSlideshow = document.currentScript.parentElement;
    }
    else {
      sectionSlideshow = section;
    }

		if (sectionSlideshow) {
			const slider = sectionSlideshow.querySelector('.slideshow__swiper');
			const paginationNumber = sectionSlideshow.querySelector('.slideshow__pagination-number');
			const thumbs = sectionSlideshow.querySelector('.slideshow__thumbs') || sectionSlideshow.querySelector('.slideshow__thumbs-full');

			const sectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							if (slider) {
								playVideo(slider);
								if (slider.swiper && slider.getAttribute("data-autoplay") === "true")
									slider.swiper.autoplay.resume();
								if (paginationNumber)
									paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "running";
							}
						}
						else {
							if (slider) {
								stopVideo(slider);
								if (slider.swiper && slider.getAttribute("data-autoplay") === "true")
									slider.swiper.autoplay.pause();
								if (paginationNumber)
									paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "paused";
							}
						}
					})
				}
			)

			const sectionResizeObserver = new ResizeObserver((entries) => {
				const [entry] = entries;
				heightPagination(sectionSlideshow);

				if (slider) {
					if (slider.swiper && slider.getAttribute("data-pagination") === "true" && thumbs && thumbs.swiper) {
						if (entry.contentRect.width < 576) {
							thumbs.swiper.slideTo(slider.swiper.realIndex);
							slider.swiper.on('slideChange', (swiper) => {
								thumbs.swiper.slideTo(swiper.realIndex);
								playVideo(slider);
							})
							slider.swiper.update();
						}
						else {
							slider.swiper.on('slideChange', () => {
								playVideo(slider);
							})
							slider.swiper.update();
						}
					}
				}
			})

			sectionObserver.observe(sectionSlideshow);
			sectionResizeObserver.observe(sectionSlideshow);
		}
	}

	initSlider();
	initSection();

	document.addEventListener("shopify:section:load", function (section) {
		initSlider(section.target);
		initSection(section.target);
	});

	window.addEventListener("focus", () => {
		const sections = document.querySelectorAll('.section-slideshow');
		const sectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const paginationNumber = entry.target.querySelector('.slideshow__pagination-number');
						if (paginationNumber) {
							paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "running";
						}
					}
				})
			}
		)

		sections.forEach(section => {
			sectionObserver.observe(section);
		})
	});

	window.addEventListener("blur", () => {
		const sections = document.querySelectorAll('.section-slideshow');
		sections.forEach(section => {
			const paginationNumber = section.querySelector('.slideshow__pagination-number');
			if (paginationNumber) {
				paginationNumber.querySelector('.swiper-pagination-bullet-active .circle').style.animationPlayState = "paused";
			}
		})
	})
})();
