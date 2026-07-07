(() => {
	let activeSlide;

	const initSlider = (section) => {		
		let parent;
		if (document.currentScript) {
			parent = document.currentScript.parentElement;
		}
		else {
			parent = section;
		}
		
		const caseSlider = parent.querySelector('.case-studies__slider');

		if (caseSlider) {
			let navigation;
			if (caseSlider.getAttribute("data-navigation") === "true") 
				navigation = parent.querySelector('.case-studies__navigation'); 
			const pagination = parent.querySelector('.case-studies__pagination'); 
			const caseThumbsSlider = parent.querySelector('.case-studies__thumbs');
			const layout = caseSlider.getAttribute("data-layout");
			let initialSlide = 0;

			if (activeSlide) {
				initialSlide = activeSlide;
			}

			let caseThumbsSwiper;
			if (caseThumbsSlider) {
				if (caseThumbsSlider && (document.documentElement.clientWidth > 749 || layout == 'tabs_bottom')) {
					let swiperParamsThumbs = {
						//loop: true,
						//loopedSlides: 4,
						initialSlide: initialSlide,
						freeMode: true,
						navigation: false,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						slideToClickedSlide: true,
						//centeredSlides: true,
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
					
					if (layout == 'tabs_bottom') {
						swiperParamsThumbs.slidesPerView = 'auto';
						swiperParamsThumbs.spaceBetween = 24;
						swiperParamsThumbs.direction = 'horizontal';
						swiperParamsThumbs.breakpoints = {
							750: {
								spaceBetween: 24
							},
							990: {
								spaceBetween: 40
							},
							1360: {
								spaceBetween: 88
							}
						}
					}
					if (layout == 'tabs_left') {
						swiperParamsThumbs.slidesPerView = 4;
						swiperParamsThumbs.spaceBetween = 24;
						swiperParamsThumbs.direction = 'vertical';
					}

					caseThumbsSwiper = new Swiper(caseThumbsSlider, swiperParamsThumbs);
				}
			}

			let swiperParams = {
				initialSlide: initialSlide,
				spaceBetween: 16,
				//loop: layout == 'overlay' ? true : false,
				loopPreventsSliding: false,
				//loopedSlides: 4,
				on: {
					slideChange: function () {
						activeSlide = this.activeIndex;
					}
				}
			};

			if (layout == 'tabs_bottom') {
				swiperParams.slidesPerView = 1;
			}

			if (layout == 'tabs_left') {
				swiperParams.slidesPerView = 1.2;
				swiperParams.breakpoints = {
					750: {
						slidesPerView: 1,
						spaceBetween: 24,
					}
				}
			}

			if (caseSlider.getAttribute("data-pagination") === "true") {
				swiperParams.pagination = {
					el: pagination,
					type: "bullets",
					clickable: true,
				};
			}

			if (caseSlider.getAttribute("data-navigation") === "true" && (layout == 'tabs_bottom' || layout == 'overlay')) {
				swiperParams.navigation = {
					nextEl: navigation.querySelector('.swiper-button-next'),
					prevEl: navigation.querySelector('.swiper-button-prev')
				};
			}

			if (caseThumbsSwiper) {
				swiperParams.thumbs = {
					swiper: caseThumbsSwiper
				}
			}

			const caseSwiper = new Swiper(caseSlider, swiperParams);

			if (caseThumbsSlider && caseThumbsSwiper && layout == 'tabs_left') {
				caseThumbsSlider.style.height = caseSlider.clientHeight + 'px';
			}

			if (pagination) {
				caseSwiper.on('slideChange', function() {
					caseSwiper.pagination.render();
					caseSwiper.pagination.update();
					activeSlide = this.activeIndex;
				});
			}

			if (caseThumbsSlider) {
				//caseSwiper.controller.control = caseThumbsSwiper;
				//caseThumbsSwiper.controller.control = caseSwiper;
			}
		}
	}


	const initSection = (section) => {
    let  sectionCase;
    if (document.currentScript) {
      sectionCase = document.currentScript.parentElement;
    }
    else {
      sectionCase = section;
    }

		const sectionResizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;

			if (entry.contentRect.width < 990 ) {
				const thumbs = entry.target.querySelector('.case-studies__thumbs--tabs_left');
				if (thumbs) {
					if (thumbs.swiper)
						thumbs.swiper.destroy();
				}

				initSlider(sectionCase);
			}
			else {
				initSlider(sectionCase);
			}
		})

		sectionResizeObserver.observe(sectionCase);
	}

	initSection();

	document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	})
})()