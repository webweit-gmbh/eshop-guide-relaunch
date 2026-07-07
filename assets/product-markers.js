(function () {
	const productMarkers = (section) => {
		let parent;

		if (document.currentScript) {
			parent = document.currentScript.parentElement;
		}
		else {
			parent = section;
		}

		if (parent) {
			parent.querySelectorAll('.js-product-markers__item').forEach(item => {
				item.addEventListener('click', () => {
					const index = item.dataset.index; 
					item.classList.toggle('active');

					parent.querySelectorAll('.product-markers-for-mobile .product-markers__item-inner').forEach(elem => {
						elem.classList.remove('active');

						if (elem.dataset.index == index) {
							elem.classList.add('active');
						}
					});

					parent.querySelector('.product-markers-for-mobile').classList.add('active');
				})
			});
		}

		const markers = document.querySelectorAll('.js-product-markers__item');
		document.addEventListener('click', (e) => {
			const parentClicked = e.target.closest('.js-product-markers__item');
			markers.forEach(marker => {
				if (parentClicked != marker) 
					marker.classList.remove('active');
			})
		})
	}

  productMarkers();
  
  document.addEventListener("shopify:section:load", function (section) {
    productMarkers(section.target);
  });
})();
