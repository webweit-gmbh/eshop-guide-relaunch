(() => {
	const categoriesList = () => {
		const categiriesItems = document.querySelectorAll(".categories-list__item-inner");
		categiriesItems.forEach((item) => {
			item.addEventListener("mouseover", () => {
				item.classList.remove(`${item.getAttribute("data-base")}`);
				item.classList.add(`${item.getAttribute("data-hover")}`);
			});
			item.addEventListener("mouseout", () => {
				item.classList.remove(`${item.getAttribute("data-hover")}`);
				item.classList.add(`${item.getAttribute("data-base")}`);
			});
		});
	};

	categoriesList();

	document.addEventListener("shopify:section:load", categoriesList);
})();
