(function () {
	const initSlider = (section) => {
		let slider;
		if (document.currentScript) {
			slider =
				document.currentScript.parentElement.querySelector(".blog__slider");
		} else {
			slider = section.querySelector(".blog__slider");
		}

		if (slider) {
			const navigation =
				slider.parentElement.querySelector(".blog__navigation");
			const pagination =
				slider.parentElement.querySelector(".blog__pagination");
			const columns = Number(slider.dataset.columns);
			let columns1200 = columns == 4 ? columns - 1 : columns;
			let columns990 = columns > 3 ? columns - 1 : columns;
			let columns576 = columns > 2 ? columns990 - 1 : columns990;

			const articlesSlider = new Swiper(slider, {
				slidesPerView: 1,
				spaceBetween: 24,
				speed: 1000,
				navigation: {
					nextEl: navigation.querySelector(".swiper-button-next"),
					prevEl: navigation.querySelector(".swiper-button-prev"),
				},
				pagination: {
					el: pagination,
					type: "bullets",
					clickable: true,
				},
				breakpoints: {
					576: {
						slidesPerView: columns576,
						slidesPerGroup: columns576,
					},
					990: {
						slidesPerView: columns990,
						slidesPerGroup: columns990,
					},
					1200: {
						slidesPerView: columns1200,
						slidesPerGroup: columns1200,
					},
					1360: {
						slidesPerView: columns,
						slidesPerGroup: columns,
					},
				},
			});
		}
	};

	initSlider();

	document.addEventListener("shopify:section:load", function (section) {
		initSlider(section.target);
	});
})();
