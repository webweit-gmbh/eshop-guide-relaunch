(function () {
	const initSlider = (section) => {
		let sliders, horizontalSlider, slidersWrapper;

		if (document.currentScript) {
			sliders =
				document.currentScript.parentElement.querySelectorAll(".aic__marquee");
			horizontalSlider = document.currentScript.parentElement.querySelector(
				".aic__marquee-horizontal",
			);
			slidersWrapper =
				document.currentScript.parentElement.querySelector(".aic__marquees");
		} else {
			sliders = section.querySelectorAll(".aic__marquee");
			horizontalSlider = section.querySelector(".aic__marquee-horizontal");
			slidersWrapper = section.querySelector(".aic__marquees");
		}
		const evenSliders = [];
		const oddSliders = [];

		if (sliders.length > 0) {
			sliders.forEach((slider, i) => {
				if (i % 2 === 0) {
					oddSliders.push(slider);
				} else {
					evenSliders.push(slider);
				}
			});

			oddSliders.forEach((oddSlider) => {
				if (!oddSlider.querySelector(".js-marquee-wrapper")) {
					let duration = 50000;
					if (oddSlider.closest(".aic--right")) {
						duration = 40000;
					}
					oddSlider.classList.add("marquee-down");
					const $oddSlider = $(oddSlider);
					$oddSlider.marquee({
						delayBeforeStart: 0,
						direction: "down",
						allowCss3Support: true,
						startVisible: true,
						duplicated: true,
						duration: duration,
						gap: 0,
					});
				}
			});

			evenSliders.forEach((evenSlider) => {
				if (!evenSlider.querySelector(".js-marquee-wrapper")) {
					let duration = 50000;
					if (evenSlider.closest(".aic--right")) {
						duration = 40000;
					}
					evenSlider.classList.add("marquee-up");
					const $evenSlider = $(evenSlider);
					$evenSlider.marquee({
						delayBeforeStart: 0,
						direction: "up",
						allowCss3Support: true,
						startVisible: true,
						duplicated: true,
						duration: duration,
						gap: 0,
					});
				}
			});
		}

		if (horizontalSlider) {
			if (!horizontalSlider.querySelector(".js-marquee-wrapper")) {
				const width = horizontalSlider.scrollWidth;
				const speed =
					document.documentElement.clientWidth > 575
						? Math.round(document.documentElement.clientWidth * 0.03)
						: Math.round(document.documentElement.clientWidth * 0.08);
				horizontalSlider.classList.add("marquee");
				const $horizontalSlider = $(horizontalSlider);
				$horizontalSlider.marquee({
					delayBeforeStart: 0,
					direction: "left",
					allowCss3Support: true,
					startVisible: true,
					speed: speed,
					gap: 0,
				});

				const resizeObserve = new ResizeObserver((entries) => {
					const [entry] = entries;
					const speed =
						entry.contentRect.width > 575
							? Math.round(entry.contentRect.width * 0.03)
							: Math.round(entry.contentRect.width * 0.08);
					$horizontalSlider.marquee("destroy");
					$horizontalSlider.marquee({
						direction: "left",
						allowCss3Support: true,
						startVisible: true,
						speed: speed,
						gap: 0,
					});
				});
				resizeObserve.observe(slidersWrapper);
			}
		}
	};

	const checkImagesLazyLoaded = () => {
		const lazyImages = document.querySelectorAll(".aic__slide img");
		console.log(lazyImages);

		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		};

		const imagesObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.removeAttribute("loading");
					observer.unobserve(entry.target);
				}
			});
		}, options);

		lazyImages.forEach((image) => {
			imagesObserver.observe(image);
		});

		const checkVisibility = () => {
			lazyImages.forEach((image) => {
				const rect = image.getBoundingClientRect();
				if (rect.top < window.innerHeight && rect.bottom > 0) {
					image.removeAttribute("loading");
				}
			});
			requestAnimationFrame(checkVisibility);
		};

		requestAnimationFrame(checkVisibility);
	};

	initSlider();
	checkImagesLazyLoaded();

	document.addEventListener("DOMContentLoaded", checkImagesLazyLoaded);

	document.addEventListener("shopify:section:load", function (section) {
		initSlider(section.target);
		checkImagesLazyLoaded();
	});
	document.addEventListener("shopify:section:reorder", function (section) {
		initSlider(section.target);
		checkImagesLazyLoaded();
	});
})();
