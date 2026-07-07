(function () {
	function swiperInit() {
		subSliderInit(true, 16);
		sliderInit(true);
		popupSliderInit(true);
	}

	document.addEventListener('shopify:section:load', function (e) {
		swiperInit();
	});

	swiperInit();
})();
