const sliderInit = (isUpdate) => {
	if (
		document.querySelectorAll(".js-media-list") &&
		document.querySelectorAll(".js-media-list").length > 0
	) {
		document.querySelectorAll(".js-media-list").forEach((elem, index) => {
			let slider = new Swiper(elem, {
				slidesPerView: 1,
				spaceBetween: 1,
				autoHeight: false,
				speed: 500,
				navigation: {
					nextEl: ".product .product__slider-nav .swiper-button-next",
					prevEl: ".product .product__slider-nav .swiper-button-prev",
				},
				pagination: {
					el: ".product .product__pagination",
					type: "bullets",
					clickable: true,
				},
				thumbs: {
					swiper:
						document.querySelectorAll(".js-media-sublist").length > 0
							? document.querySelectorAll(".js-media-sublist")[index]?.swiper
							: "",
				},
				on: {
					afterInit: function (swiper) {},
					slideChangeTransitionStart: function () {
						if (document.querySelector(".js-media-sublist")) {
							document
								.querySelector(".js-media-sublist")
								.swiper.slideTo(
									document.querySelector(".js-media-list").swiper.activeIndex,
								);
						}
					},
					slideChange: function () {
						window.pauseAllMedia();
						this.params.noSwiping = false;

						if (
							document.querySelector(".js-popup-slider") &&
							document.querySelector(".js-popup-slider").swiper
						) {
							document
								.querySelector(".js-popup-slider")
								.swiper.slideTo(this.activeIndex);
						}
					},
					slideChangeTransitionEnd: function () {
						if (this.slides[this.activeIndex].querySelector("model-viewer")) {
							this.slides[this.activeIndex]
								.querySelector(".shopify-model-viewer-ui__button--poster")
								.removeAttribute("hidden");
						}
					},
					touchStart: function () {
						if (this.slides[this.activeIndex].querySelector("model-viewer")) {
							if (
								!this.slides[this.activeIndex]
									.querySelector("model-viewer")
									.classList.contains("shopify-model-viewer-ui__disabled")
							) {
								this.params.noSwiping = true;
								this.params.noSwipingClass = "swiper-slide";
							} else {
								this.params.noSwiping = false;
							}
						}
					},
				},
			});

			if (isUpdate) {
				setTimeout(function () {
					slider.update();
				}, 800);
			}
		});
	}
};

const subSliderInit = (isUpdate, margin) => {
	if (
		document.querySelectorAll(".js-media-sublist") &&
		document.querySelectorAll(".js-media-sublist").length > 0
	) {
		document.querySelectorAll(".js-media-sublist").forEach((elem, index) => {
			const slides = elem.querySelectorAll(".product__media-subitem");
			const slidesAmount = slides.length;
			const slidesPerView = slidesAmount < 3 ? slidesAmount : 3;
			let subSlider = new Swiper(elem, {
				slidesPerView: slidesPerView,
				spaceBetween: 8,
				direction: "horizontal",
				freeMode: false,
				watchSlidesProgress: true,
				watchSlidesVisibility: true,
				on: {
					touchEnd: function (s, e) {
						let range = 5;
						let diff = (s.touches.diff = s.isHorizontal()
							? s.touches.currentX - s.touches.startX
							: s.touches.currentY - s.touches.startY);
						if (diff < range || diff > -range) s.allowClick = true;
					},
				},
				breakpoints: {
					1200: {
						spaceBetween: margin,
						slidesPerView: slidesPerView,
					},
				},
			});

			if (isUpdate) {
				setTimeout(function () {
					subSlider.update();
				}, 800);
			}
		});
	}
};

const popupSliderInit = (isUpdate) => {
	if (document.querySelector(".js-popup-slider")) {
		let popupSlider = new Swiper(document.querySelector(".js-popup-slider"), {
			slidesPerView: 1,
			navigation: {
				nextEl: ".product-media-modal .product__slider-nav .swiper-button-next",
				prevEl: ".product-media-modal .product__slider-nav .swiper-button-prev",
			},
			pagination: {
				el: ".product-media-modal .product__pagination",
				type: "bullets",
				clickable: true,
			},
			on: {
				afterInit: function () {
					if (
						document.querySelector(".product__outer--grid-gallery") ||
						document.querySelector(".product__outer--stacked-gallery")
					) {
						document
							.querySelectorAll(".product__media-list .product__media-toggle")
							.forEach((elem, index) => {
								elem.addEventListener("click", (e) => {
									if (
										document.querySelector(".js-popup-slider") &&
										document.querySelector(".js-popup-slider").swiper
									) {
										document
											.querySelector(".js-popup-slider")
											.swiper.slideTo(index);
									}
								});
							});
					}
				},
				slideChange: function () {
					window.pauseAllMedia();
					this.params.noSwiping = false;
					document
						.querySelector(".product-media-modal__content")
						.classList.remove("zoom");
				},
				touchMove: function () {
					document
						.querySelector(".product-media-modal__content")
						.classList.remove("zoom");
				},
				slideChangeTransitionEnd: function () {
					if (this.slides[this.activeIndex].querySelector("model-viewer")) {
						this.slides[this.activeIndex]
							.querySelector(".shopify-model-viewer-ui__button--poster")
							.removeAttribute("hidden");
					}
				},
				touchStart: function () {
					if (this.slides[this.activeIndex].querySelector("model-viewer")) {
						if (
							!this.slides[this.activeIndex]
								.querySelector("model-viewer")
								.classList.contains("shopify-model-viewer-ui__disabled")
						) {
							this.params.noSwiping = true;
							this.params.noSwipingClass = "swiper-slide";
						} else {
							this.params.noSwiping = false;
						}
					}
				},
			},
		});

		if (isUpdate) {
			setTimeout(function () {
				popupSlider.update();
			}, 800);
		}
	}
};

if (navigator.userAgent.indexOf("iPhone") > -1) {
	document
		.querySelector("[name=viewport]")
		.setAttribute(
			"content",
			"width=device-width, initial-scale=1, maximum-scale=1",
		);
}

function getFocusableElements(container) {
	return Array.from(
		container.querySelectorAll(
			"summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe",
		),
	);
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
	summary.setAttribute("role", "button");
	summary.setAttribute("aria-expanded", "false");

	if (summary.nextElementSibling.getAttribute("id")) {
		summary.setAttribute("aria-controls", summary.nextElementSibling.id);
	}

	summary.addEventListener("click", (event) => {
		event.currentTarget.setAttribute(
			"aria-expanded",
			!event.currentTarget.closest("details").hasAttribute("open"),
		);
	});

	if (summary.closest("header-drawer")) return;
	summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
	if (event.code.toUpperCase() !== "ESCAPE") return;

	const openDetailsElement = event.target.closest("details[open]");
	if (!openDetailsElement) return;

	const summaryElement = openDetailsElement.querySelector("summary");
	openDetailsElement.removeAttribute("open");
	summaryElement.setAttribute("aria-expanded", false);
	summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
	var elements = getFocusableElements(container);
	var first = elements[0];
	var last = elements[elements.length - 1];

	removeTrapFocus();

	trapFocusHandlers.focusin = (event) => {
		if (
			event.target !== container &&
			event.target !== last &&
			event.target !== first
		)
			return;

		document.addEventListener("keydown", trapFocusHandlers.keydown);
	};

	trapFocusHandlers.focusout = function () {
		document.removeEventListener("keydown", trapFocusHandlers.keydown);
	};

	trapFocusHandlers.keydown = function (event) {
		if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
		// On the last focusable element and tab forward, focus the first element.
		if (event.target === last && !event.shiftKey) {
			event.preventDefault();
			first.focus();
		}

		//  On the first focusable element and tab backward, focus the last element.
		if (
			(event.target === container || event.target === first) &&
			event.shiftKey
		) {
			event.preventDefault();
			last.focus();
		}
	};

	document.addEventListener("focusout", trapFocusHandlers.focusout);
	document.addEventListener("focusin", trapFocusHandlers.focusin);

	elementToFocus.focus();
}

function pauseAllMedia() {
	document.querySelectorAll(".js-youtube").forEach((video) => {
		video.contentWindow.postMessage(
			'{"event":"command","func":"' + "pauseVideo" + '","args":""}',
			"*",
		);
	});
	document.querySelectorAll(".js-vimeo").forEach((video) => {
		video.contentWindow.postMessage('{"method":"pause"}', "*");
	});
	document.querySelectorAll("video").forEach((video) => {
		if (!video.closest('.hero__image') && !video.closest('.multirow__video'))
			video.pause();
	});
	document.querySelectorAll("product-model").forEach((model) => {
		if (model.modelViewerUI) model.modelViewerUI.pause();
	});
}

function removeTrapFocus(elementToFocus = null) {
	document.removeEventListener("focusin", trapFocusHandlers.focusin);
	document.removeEventListener("focusout", trapFocusHandlers.focusout);
	document.removeEventListener("keydown", trapFocusHandlers.keydown);

	if (elementToFocus && !elementToFocus.classList.contains("card-focused"))
		elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
	constructor() {
		super();
		this.input = this.querySelector("input");
		this.changeEvent = new Event("change", { bubbles: true });

		this.querySelectorAll("button").forEach((button) => {
			this.setMinimumDisable();

			button.addEventListener("click", this.onButtonClick.bind(this));
		});

		var eventList = ["paste", "input"];

		for (event of eventList) {
			this.input.addEventListener(event, function (e) {
				const numberRegex = /^0*?[1-9]\d*$/;

				if (
					numberRegex.test(e.currentTarget.value) ||
					e.currentTarget.value === ""
				) {
					e.currentTarget.value;
				} else {
					e.currentTarget.value = 1;
				}

				if (e.currentTarget.value === 1 || e.currentTarget.value === "") {
					this.previousElementSibling.classList.add("disabled");
				} else {
					this.previousElementSibling.classList.remove("disabled");
				}
			});
		}

		this.input.addEventListener("focusout", function (e) {
			if (e.currentTarget.value === "") {
				e.currentTarget.value = 1;
			}
		});
	}

	setMinimumDisable() {
		if (this.input.value == 1) {
			this.querySelector('button[name="minus"]').classList.add("disabled");
		} else {
			this.querySelector('button[name="minus"]').classList.remove("disabled");
		}
	}

	onButtonClick(event) {
		event.preventDefault();
		const previousValue = this.input.value;

		event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
		if (previousValue !== this.input.value)
			this.input.dispatchEvent(this.changeEvent);

		this.setMinimumDisable();
	}
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
	let t;
	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn.apply(this, args), wait);
	};
}

const serializeForm = (form) => {
	const obj = {};
	const formData = new FormData(form);
	for (const key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: `application/${type}`,
		},
	};
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
	window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	};
};

Shopify.setSelectorByValue = function (selector, value) {
	for (var i = 0, count = selector.options.length; i < count; i++) {
		var option = selector.options[i];
		if (value == option.value || value == option.innerHTML) {
			selector.selectedIndex = i;
			return i;
		}
	}
};

Shopify.addListener = function (target, eventName, callback) {
	target.addEventListener
		? target.addEventListener(eventName, callback, false)
		: target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
	options = options || {};
	var method = options["method"] || "post";
	var params = options["parameters"] || {};

	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);

	for (var key in params) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", key);
		hiddenField.setAttribute("value", params[key]);
		form.appendChild(hiddenField);
	}
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
	country_domid,
	province_domid,
	options,
) {
	this.countryEl = document.getElementById(country_domid);
	this.provinceEl = document.getElementById(province_domid);
	this.provinceContainer = document.getElementById(
		options["hideElement"] || province_domid,
	);

	Shopify.addListener(
		this.countryEl,
		"change",
		Shopify.bind(this.countryHandler, this),
	);

	this.initCountry();
	this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
	initCountry: function () {
		var value = this.countryEl.getAttribute("data-default");
		Shopify.setSelectorByValue(this.countryEl, value);
		this.countryHandler();
	},

	initProvince: function () {
		var value = this.provinceEl.getAttribute("data-default");
		if (value && this.provinceEl.options.length > 0) {
			Shopify.setSelectorByValue(this.provinceEl, value);
		}
	},

	countryHandler: function (e) {
		var opt = this.countryEl.options[this.countryEl.selectedIndex];
		var raw = opt.getAttribute("data-provinces");
		var provinces = JSON.parse(raw);

		this.clearOptions(this.provinceEl);
		if (provinces && provinces.length == 0) {
			this.provinceContainer.style.display = "none";
		} else {
			for (var i = 0; i < provinces.length; i++) {
				var opt = document.createElement("option");
				opt.value = provinces[i][0];
				opt.innerHTML = provinces[i][1];
				this.provinceEl.appendChild(opt);
			}

			this.provinceContainer.style.display = "";
		}
	},

	clearOptions: function (selector) {
		while (selector.firstChild) {
			selector.removeChild(selector.firstChild);
		}
	},

	setOptions: function (selector, values) {
		for (var i = 0, count = values.length; i < values.length; i++) {
			var opt = document.createElement("option");
			opt.value = values[i];
			opt.innerHTML = values[i];
			selector.appendChild(opt);
		}
	},
};

class MenuDrawer extends HTMLElement {
	constructor() {
		super();

		this.mainDetailsToggle = this.querySelector("details");
		const summaryElements = this.querySelectorAll("summary");
		this.addAccessibilityAttributes(summaryElements);

		if (navigator.platform === "iPhone")
			document.documentElement.style.setProperty(
				"--viewport-height",
				`${window.innerHeight}px`,
			);

		this.addEventListener("keyup", this.onKeyUp.bind(this));
		this.addEventListener("focusout", this.onFocusOut.bind(this));
		this.bindEvents();
	}

	bindEvents() {
		this.querySelectorAll("summary").forEach((summary) =>
			summary.addEventListener("click", this.onSummaryClick.bind(this)),
		);
		this.querySelectorAll("button").forEach((button) => {
			if (this.querySelector(".toggle-scheme-button") === button) return;
			if (this.querySelector(".header__localization-button") === button) return;
			if (this.querySelector(".header__localization-lang-button") === button)
				return;
			if (!button.classList.contains("mobile-facets__footer__button"))
				button.addEventListener("click", this.onCloseButtonClick.bind(this));
		});
	}

	addAccessibilityAttributes(summaryElements) {
		summaryElements.forEach((element) => {
			element.setAttribute("role", "button");
			element.setAttribute("aria-expanded", false);
			element.setAttribute("aria-controls", element.nextElementSibling.id);
		});
	}

	onKeyUp(event) {
		if (event.code.toUpperCase() !== "ESCAPE") return;

		const openDetailsElement = event.target.closest("details[open]");
		if (!openDetailsElement) return;

		openDetailsElement === this.mainDetailsToggle
			? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
			: this.closeSubmenu(openDetailsElement);
	}

	onSummaryClick(event) {
		const summaryElement = event.currentTarget;
		const detailsElement = summaryElement.parentNode;
		const isOpen = detailsElement.hasAttribute("open");

		if (detailsElement === this.mainDetailsToggle) {
			if (isOpen) event.preventDefault();
			isOpen
				? this.closeMenuDrawer(summaryElement)
				: this.openMenuDrawer(summaryElement);
		} else {
			trapFocus(
				summaryElement.nextElementSibling,
				detailsElement.querySelector("button"),
			);

			setTimeout(() => {
				detailsElement.classList.add("menu-opening");
			});
		}
	}

	openMenuDrawer(summaryElement) {
		setTimeout(() => {
			this.mainDetailsToggle.classList.add("menu-opening");
		});
		summaryElement.setAttribute("aria-expanded", true);
		trapFocus(this.mainDetailsToggle, summaryElement);
		document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
	}

	closeMenuDrawer(event, elementToFocus = false) {
		if (event !== undefined) {
			this.mainDetailsToggle.classList.remove("menu-opening");
			this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
				details.removeAttribute("open");
				details.classList.remove("menu-opening");
			});
			this.mainDetailsToggle
				.querySelector("summary")
				.setAttribute("aria-expanded", false);
			document.body.classList.remove(
				`overflow-hidden-${this.dataset.breakpoint}`,
			);
			removeTrapFocus(elementToFocus);
			this.closeAnimation(this.mainDetailsToggle);
			this.header =
				this.header || document.querySelector(".shopify-section-header");
			const main = document.querySelector("main");
			if (
				main
					.querySelectorAll(".shopify-section")[0]
					.classList.contains("section--has-overlay") &&
				!this.header.classList.contains("animate")
			) {
			}
		}
	}

	onFocusOut(event) {
		setTimeout(() => {
			if (
				this.mainDetailsToggle.hasAttribute("open") &&
				!this.mainDetailsToggle.contains(document.activeElement)
			)
				this.closeMenuDrawer(event);
		});
	}

	onCloseButtonClick(event) {
		const detailsElement = event.currentTarget.closest("details");
		this.closeSubmenu(detailsElement);
	}

	closeSubmenu(detailsElement) {
		detailsElement.classList.remove("menu-opening");
		removeTrapFocus();
		this.closeAnimation(detailsElement);
	}

	closeAnimation(detailsElement) {
		let animationStart;

		const handleAnimation = (time) => {
			if (animationStart === undefined) {
				animationStart = time;
			}

			const elapsedTime = time - animationStart;

			if (elapsedTime < 400) {
				window.requestAnimationFrame(handleAnimation);
			} else {
				detailsElement.removeAttribute("open");
				if (detailsElement.closest("details[open]")) {
					trapFocus(
						detailsElement.closest("details[open]"),
						detailsElement.querySelector("summary"),
					);
				}
			}
		};

		window.requestAnimationFrame(handleAnimation);
	}
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
	constructor() {
		super();
	}

	openMenuDrawer(summaryElement) {
		this.headerWrapper = document.querySelector(".header-wrapper");
		document.documentElement.style.setProperty(
			"--header-bottom-position",
			`${parseInt(this.headerWrapper.getBoundingClientRect().top)}px`,
		);
		const main = document.querySelector("main");
		if (
			main
				.querySelectorAll(".shopify-section")[0]
				.classList.contains("section--has-overlay")
		) {
		}

		setTimeout(() => {
			this.mainDetailsToggle.classList.add("menu-opening");
		});

		summaryElement.setAttribute("aria-expanded", true);
		trapFocus(this.mainDetailsToggle, summaryElement);
		document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
	}
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
	constructor() {
		super();
		this.querySelector('[id^="ModalClose-"]').addEventListener(
			"click",
			this.hide.bind(this, false),
		);
		this.addEventListener("keyup", (event) => {
			if (event.code.toUpperCase() === "ESCAPE") this.hide();
		});
		if (this.classList.contains("media-modal")) {
			this.addEventListener("pointerup", (event) => {
				if (
					event.pointerType === "mouse" &&
					!event.target.closest("deferred-media, product-model")
				)
					this.hide();
			});
		} else {
			this.addEventListener("click", (event) => {
				if (event.target === this) this.hide();
			});
		}
	}

	connectedCallback() {
		if (this.moved) return;
		this.moved = true;
		document.body.appendChild(this);
	}

	show(opener) {
		this.openedBy = opener;
		const popup = this.querySelector(".template-popup");
		document.body.classList.add("overflow-hidden");
		this.setAttribute("open", "");
		if (popup) popup.loadContent();
		trapFocus(this, this.querySelector('[role="dialog"]'));
		window.pauseAllMedia();
	}

	hide() {
		let isOpen = false;

		this.removeAttribute("open");
		removeTrapFocus(this.openedBy);
		window.pauseAllMedia();

		document.querySelectorAll("body > quick-add-modal").forEach((el) => {
			if (el.hasAttribute("open")) {
				isOpen = true;
			}
		});

		if (!isOpen) {
			document.body.classList.remove("overflow-hidden");
			document.body.dispatchEvent(new CustomEvent("modalClosed"));
		}

		const images = document.querySelector(".product-media-modal__content");

		if (images) {
			images.classList.remove("zoom");
		}
	}
}

customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
	constructor() {
		super();

		const button = this.querySelector("button");

		if (!button) return;
		button.addEventListener("click", () => {
			const modal = document.querySelector(this.getAttribute("data-modal"));
			if (modal) modal.show(button);
		});
	}
}

customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
	constructor() {
		super();
		this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
			"click",
			this.loadContent.bind(this),
		);
		if (this.getAttribute("data-autoplay")) {
			this.loadContent();
		}
	}

	loadContent() {
		if (!this.getAttribute("loaded")) {
			const content = document.createElement("div");
			content.appendChild(
				this.querySelector("template").content.firstElementChild.cloneNode(
					true,
				),
			);

			this.setAttribute("loaded", true);
			window.pauseAllMedia();
			/*this.appendChild(
				content.querySelector("video, model-viewer, iframe"),
			).focus();*/

			const videoObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (this.getAttribute("data-autoplay")) {
							if (deferredElement.nodeName == "VIDEO") {
								let playPromise = entry.target.play();
								if (playPromise !== undefined) {
									playPromise.then((_) => {}).catch((error) => {});
								}
							} else {
								if (entry.target.classList.contains("js-youtube")) {
									entry.target.contentWindow.postMessage(
										'{"event":"command","func":"' +
											"playVideo" +
											'","args":""}',
										"*",
									);
								} else {
									entry.target.contentWindow.postMessage(
										'{"method":"play"}',
										"*",
									);
								}
							}
							//entry.target.play()
						}
					} else {
						if (deferredElement.nodeName == "VIDEO") {
							entry.target.pause();
						} else {
							if (entry.target.classList.contains("js-youtube")) {
								entry.target.contentWindow.postMessage(
									'{"event":"command","func":"' + "pauseVideo" + '","args":""}',
									"*",
								);
							} else {
								entry.target.contentWindow.postMessage(
									'{"method":"pause"}',
									"*",
								);
							}
						}
					}
				});
			});

			const deferredElement = this.appendChild(
				content.querySelector("video, model-viewer, iframe"),
			);
			//if (focus) deferredElement.focus();

			if (
				deferredElement.nodeName == "VIDEO" ||
				deferredElement.nodeName == "IFRAME"
			) {
				// force autoplay for safari

				if (this.classList.contains("video-section__media")) {
					if (deferredElement.nodeName == "VIDEO") {
						let playPromise = deferredElement.play();
						if (playPromise !== undefined) {
							playPromise.then((_) => {}).catch((error) => {});
						}
					}

					videoObserver.observe(deferredElement);
				} else {
					deferredElement.play();
				}
			}

			if (
				this.closest(".swiper")?.swiper.slides[
					this.closest(".swiper").swiper.activeIndex
				].querySelector("model-viewer")
			) {
				if (
					!this.closest(".swiper")
						.swiper.slides[
							this.closest(".swiper").swiper.activeIndex
						].querySelector("model-viewer")
						.classList.contains("shopify-model-viewer-ui__disabled")
				) {
					this.closest(".swiper").swiper.params.noSwiping = true;
					this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
				}
			}
		}
	}
}

customElements.define("deferred-media", DeferredMedia);

class VariantSelects extends HTMLElement {
	constructor() {
		super();
		this.addEventListener("change", this.onVariantChange);
	}

	onVariantChange() {
		this.updateOptions();
		this.updateMasterId();
		this.toggleAddButton(true, "", false);
		this.updatePickupAvailability();
		this.updateVariantStatuses();

		if (!this.currentVariant) {
			this.toggleAddButton(true, "", true);
			this.setUnavailable();
		} else {
			if (this.currentVariant?.featured_media) {
				this.updateMedia(
					`${this.dataset.section}-${this.currentVariant.featured_media.id}`,
				);
			}
			this.updateURL();
			this.updateVariantInput();
			this.renderProductInfo();
		}
	}

	updateOptions() {
		const fieldsets = Array.from(this.querySelectorAll(".js-radio-colors"));

		this.options = Array.from(
			this.querySelectorAll("select"),
			(select) => select.value,
		).concat(
			fieldsets.map((fieldset) => {
				return Array.from(fieldset.querySelectorAll("input")).find(
					(radio) => radio.checked,
				).value;
			}),
		);
	}

	updateMasterId() {
		if (this.variantData || this.querySelector('[type="application/json"]')) {
			this.currentVariant = this.getVariantData().find((variant) => {
				this.options.sort();
				variant.options.sort();

				return !variant.options
					.map((option, index) => {
						return this.options[index] === option;
					})
					.includes(false);
			});
		}
	}

	isHidden(elem) {
		const styles = window.getComputedStyle(elem);
		return styles.display === "none" || styles.visibility === "hidden";
	}

	updateMedia(mediaId) {
		if (!this.currentVariant || !this.currentVariant?.featured_media) return;
		const currentSection = document.querySelector(
			`[data-section="main-${this.dataset.section}"]`,
		);
		this.mediaList = currentSection.querySelector(".product__media-list");
		const activeMedia = this.mediaList.querySelector(
			`[data-media-id="${mediaId}"]`,
		);
		this.mediaList.querySelectorAll("[data-media-id]").forEach((element) => {
			element.classList.remove("active");
		});
		if (activeMedia) activeMedia.classList.add("active");

		const swiperWrappers = document.querySelectorAll(".product__media-wrapper");

		swiperWrappers.forEach((elem) => {
			if (!this.isHidden(elem)) {
				const newMedia = elem.querySelector(
					`[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`,
				);

				if (elem.querySelector(".js-media-list")) {
					elem
						.querySelector(".js-media-list")
						.swiper.slideTo(
							elem
								.querySelector(".js-media-list")
								.swiper.slides.indexOf(newMedia),
						);
				}
			}
		});
	}

	updateURL() {
		if (!this.classList.contains("featured-product-radios")) {
			if (!this.currentVariant || this.dataset.updateUrl === "false") return;
			window.history.replaceState(
				{},
				"",
				`${this.dataset.url}?variant=${this.currentVariant.id}`,
			);
		}
	}

	updateVariantInput() {
		const productForms = document.querySelectorAll(
			`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
		);
		productForms.forEach((productForm) => {
			const input = productForm.querySelector('input[name="id"]');
			input.value = this.currentVariant.id;
			input.dispatchEvent(new Event("change", { bubbles: true }));
		});
	}

	updateVariantStatuses() {
		const selectedOptionOneVariants = this.variantData.filter(
			(variant) => this.querySelector(":checked").value === variant.option1,
		);
		const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
		inputWrappers.forEach((option, index) => {
			if (index === 0) return;
			const optionInputs = [
				...option.querySelectorAll('input[type="radio"], option'),
			];
			const previousOptionSelected =
				inputWrappers[index - 1].querySelector(":checked").value;
			const availableOptionInputsValue = selectedOptionOneVariants
				.filter(
					(variant) =>
						variant.available &&
						variant[`option${index}`] === previousOptionSelected,
				)
				.map((variantOption) => variantOption[`option${index + 1}`]);
			this.setInputAvailability(optionInputs, availableOptionInputsValue);
		});
	}

	setInputAvailability(listOfOptions, listOfAvailableOptions) {
		listOfOptions.forEach((input) => {
			if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
				if (input.tagName === "OPTION") {
					input.innerText = input.getAttribute("value");
				} else if (input.tagName === "INPUT") {
					input.classList.remove("disabled");
				}
			} else {
				if (input.tagName === "OPTION") {
					input.innerText =
						window.variantStrings.unavailable_with_option.replace(
							"[value]",
							input.getAttribute("value"),
						);
				} else if (input.tagName === "INPUT") {
					input.classList.add("disabled");
				}
			}
		});
	}

	updatePickupAvailability() {
		const pickUpAvailability = document.querySelector("pickup-availability");
		if (!pickUpAvailability) return;

		if (this.currentVariant && this.currentVariant.available) {
			pickUpAvailability.fetchAvailability(this.currentVariant.id);
		} else {
			pickUpAvailability.removeAttribute("available");
			pickUpAvailability.innerHTML = "";
		}
	}

	renderProductInfo() {
		const requestedVariantId = this.currentVariant.id;
		const sectionId = this.dataset.originalSection
			? this.dataset.originalSection
			: this.dataset.section;

		fetch(
			`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${
				this.dataset.originalSection
					? this.dataset.originalSection
					: this.dataset.section
			}`,
		)
			.then((response) => response.text())
			.then((responseText) => {
				// prevent unnecessary ui changes from abandoned selections
				if (this.currentVariant.id !== requestedVariantId) return;

				const html = new DOMParser().parseFromString(responseText, "text/html");
				const destination = document.getElementById(
					`price-${this.dataset.section}`,
				);
				const source = html.getElementById(
					`price-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`,
				);
				const skuSource = html.getElementById(
					`Sku-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`,
				);
				const skuDestination = document.getElementById(
					`Sku-${this.dataset.section}`,
				);
				const inventorySource = html.getElementById(
					`Inventory-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`,
				);
				const inventoryDestination = document.getElementById(
					`Inventory-${this.dataset.section}`,
				);
				const colorNameSource = html.getElementById(
					`ColorName-${
						this.dataset.originalSection
							? this.dataset.originalSection
							: this.dataset.section
					}`,
				);
				const colorNameDestination = document.getElementById(
					`ColorName-${this.dataset.section}`,
				);

				if (source && destination) destination.innerHTML = source.innerHTML;
				if (inventorySource && inventoryDestination)
					inventoryDestination.innerHTML = inventorySource.innerHTML;
				if (skuSource && skuDestination) {
					skuDestination.innerHTML = skuSource.innerHTML;
					skuDestination.classList.toggle(
						"visibility-hidden",
						skuSource.classList.contains("visibility-hidden"),
					);
				}
				if (colorNameSource && colorNameDestination)
					colorNameDestination.innerHTML = colorNameSource.innerHTML;

				const price = document.getElementById(`price-${this.dataset.section}`);

				if (price) price.classList.remove("visibility-hidden");

				if (inventoryDestination)
					inventoryDestination.classList.toggle(
						"visibility-hidden",
						inventorySource.innerText === "",
					);

				this.toggleAddButton(
					!this.currentVariant.available,
					window.variantStrings.soldOut,
				);
			});
	}

	toggleAddButton(disable = true, text, modifyClass = true) {
		const productForm = document.getElementById(
			`product-form-${this.dataset.section}`,
		);
		if (!productForm) return;
		const addButton = productForm.querySelector('[name="add"]');
		const addButtonText = productForm.querySelector('[name="add"] > span');
		if (!addButton) return;

		if (disable) {
			addButton.setAttribute("disabled", "disabled");
			if (text) addButtonText.textContent = text;
		} else {
			addButton.removeAttribute("disabled");
			addButtonText.textContent = window.variantStrings.addToCart;
		}

		if (!modifyClass) return;
	}

	setUnavailable() {
		const button = document.getElementById(
			`product-form-${this.dataset.section}`,
		);
		const addButton = button.querySelector('[name="add"]');
		const price = document.getElementById(`price-${this.dataset.section}`);
		const inventory = document.getElementById(
			`Inventory-${this.dataset.section}`,
		);
		const sku = document.getElementById(`Sku-${this.dataset.section}`);

		if (!addButton) return;
		this.toggleAddButton(true, window.variantStrings.unavailable);
		if (inventory) inventory.classList.add("visibility-hidden");
		if (sku) sku.classList.add("visibility-hidden");
	}

	getVariantData() {
		this.variantData =
			this.variantData ||
			JSON.parse(this.querySelector('[type="application/json"]').textContent);
		return this.variantData;
	}
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
	constructor() {
		super();
	}

	setInputAvailability(listOfOptions, listOfAvailableOptions) {
		listOfOptions.forEach((input) => {
			if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
				input.classList.remove("disabled");
				input.disabled = false;
			} else {
				input.classList.add("disabled");
				input.disabled = true;
			}
		});
	}

	updateOptions() {
		const fieldsets = Array.from(this.querySelectorAll("fieldset"));
		this.options = fieldsets.map((fieldset) => {
			return Array.from(fieldset.querySelectorAll("input")).find(
				(radio) => radio.checked,
			).value;
		});
	}
}

customElements.define("variant-radios", VariantRadios);

class PasswordViewer {
	constructor() {
		const passwordField = document.querySelectorAll(".field--pass");

		passwordField.forEach((el) => {
			const input = el.querySelector("input");
			const btnWrapper = el.querySelector(".button-pass-visibility");
			const btnOpen = el.querySelector(".icon-eye-close");
			const btnClose = el.querySelector(".icon-eye");

			input.addEventListener("input", () => {
				input.value !== ""
					? (btnWrapper.style.display = "block")
					: (btnWrapper.style.display = "none");
			});

			btnOpen.addEventListener("click", () => {
				input.type = "text";
				btnOpen.style.display = "none";
				btnClose.style.display = "block";
			});

			btnClose.addEventListener("click", () => {
				input.type = "password";
				btnOpen.style.display = "block";
				btnClose.style.display = "none";
			});
		});
	}
}

class ProductRecommendations extends HTMLElement {
	constructor() {
		super();

		const handleIntersection = (entries, observer) => {
			if (!entries[0].isIntersecting) return;
			observer.unobserve(this);

			fetch(this.dataset.url)
				.then((response) => response.text())
				.then((text) => {
					const html = document.createElement("div");
					html.innerHTML = text;
					const recommendations = html.querySelector("product-recommendations");
					if (recommendations && recommendations.innerHTML.trim().length) {
						this.innerHTML = recommendations.innerHTML;
					}

					/* Color swatches */
					const generateSrcset = (image, widths = []) => {
						const imageUrl = new URL(image["src"]);
						return widths
							.filter((width) => width <= image["width"])
							.map((width) => {
								imageUrl.searchParams.set("width", width.toString());
								return `${imageUrl.href} ${width}w`;
							})
							.join(", ");
					};

					const createImageElement = (image, classes, sizes, productTitle) => {
						const previewImage = image["preview_image"];
						const newImage = new Image(
							previewImage["width"],
							previewImage["height"],
						);
						newImage.className = classes;
						newImage.alt = image["alt"] || productTitle;
						newImage.sizes = sizes;
						newImage.src = previewImage["src"];
						newImage.srcset = generateSrcset(
							previewImage,
							[165, 360, 533, 720, 940, 1066],
						);
						newImage.loading = "lazy";
						return newImage;
					};

					const checkSwatches = () => {
						document
							.querySelectorAll(".js-color-swatches-wrapper")
							.forEach((wrapper) => {
								wrapper
									.querySelectorAll(".js-color-swatches input")
									.forEach((input) => {
										input.addEventListener("click", (event) => {
											const primaryImage =
												wrapper.querySelector(".media--first");
											const secondaryImage =
												wrapper.querySelector(".media--second");
											const handleProduct = wrapper.dataset.product;

											if (event.currentTarget.checked && primaryImage) {
												wrapper
													.querySelector(".js-color-swatches-link")
													.setAttribute(
														"href",
														event.currentTarget.dataset.variantLink,
													);
												const currentColor = event.currentTarget.value;

												jQuery.getJSON(
													window.Shopify.routes.root +
														`products/${handleProduct}.js`,
													function (product) {
														const variant = product.variants.filter(
															(item) =>
																item.featured_media != null &&
																item.options.includes(currentColor),
														)[0];

														if (variant) {
															const newPrimaryImage = createImageElement(
																variant["featured_media"],
																primaryImage.className,
																primaryImage.sizes,
																product.title,
															);

															if (newPrimaryImage.src !== primaryImage.src) {
																let flag = false;
																if (secondaryImage) {
																	const secondaryImagePathname = new URL(
																		secondaryImage.src,
																	).pathname;
																	const newPrimaryImagePathname = new URL(
																		newPrimaryImage.src,
																	).pathname;

																	if (
																		secondaryImagePathname ==
																		newPrimaryImagePathname
																	) {
																		primaryImage.remove();
																		secondaryImage.classList.remove(
																			"media--second",
																		);
																		secondaryImage.classList.add(
																			"media--first",
																		);
																		flag = true;
																	}
																}
																if (flag == false) {
																	primaryImage.animate(
																		{ opacity: [1, 0] },
																		{
																			duration: 200,
																			easing: "ease-in",
																			fill: "forwards",
																		},
																	).finished;
																	setTimeout(function () {
																		primaryImage.replaceWith(newPrimaryImage);
																		newPrimaryImage.animate(
																			{ opacity: [0, 1] },
																			{ duration: 200, easing: "ease-in" },
																		);
																		if (secondaryImage) {
																			secondaryImage.remove();
																		}
																	}, 200);
																}
															}
														}
													},
												);
											}
										});
									});
							});
					};

					checkSwatches();

					const calcTop = (section) => {
						const imageWrapper = section.querySelectorAll(".card__inner");
						let top = 0;

						if (imageWrapper) {
							top = imageWrapper[0].offsetHeight / 2;
						} else {
							top = 50;
						}

						return top;
					};

					const initSlider = () => {
						let mobileLayout = 1;
						if (this.dataset.mobileLayout) {
							mobileLayout = this.dataset.mobileLayout;
						}
						let slider = new Swiper(
							this.querySelector(".js-recommendation-swiper"),
							{
								slidesPerView: mobileLayout,
								slidesPerGroup: 1,
								spaceBetween: 8,
								speed: 500,
								navigation: {
									nextEl: this.querySelector(
										".product-recommendations__slider-nav .swiper-button-next",
									),
									prevEl: this.querySelector(
										".product-recommendations__slider-nav .swiper-button-prev",
									),
								},
								breakpoints: {
									576: {
										slidesPerView: 2,
										slidesPerGroup: 2,
									},
									750: {
										slidesPerView: 3,
										slidesPerGroup: 3,
										spaceBetween: 24,
									},
								},
							},
						);
					};

					const initSection = () => {
						const section = this;

						const sectionResizeObserver = new ResizeObserver((entries) => {
							const [entry] = entries;
							let top = calcTop(section);
							if (section.querySelector(".product-recommendations__slider-nav"))
								section.querySelector(
									".product-recommendations__slider-nav",
								).style.top = top + "px";
						});

						sectionResizeObserver.observe(section);

						initSlider();
					};

					initSection();
				})
				.catch((e) => {
					console.error(e);
				});
		};

		new IntersectionObserver(handleIntersection.bind(this), {
			rootMargin: "0px 0px 400px 0px",
		}).observe(this);
	}
}

customElements.define("product-recommendations", ProductRecommendations);

(function () {
	const initHeaderOverlay = () => {
		const main = document.getElementById("MainContent");
		const sections = main.querySelectorAll(".shopify-section");
		if (sections.length > 0) {
			const sectionFirstChild = sections[0].querySelector(
				".section--has-overlay",
			);
			const headerGroupSections = document.querySelectorAll(
				".shopify-section-group-header-group",
			);
			const header = document.querySelector(".shopify-section-header");

			if (sectionFirstChild) {
				if (sectionFirstChild.classList.contains("section--has-overlay")) {
					if (headerGroupSections[headerGroupSections.length - 1] === header) {
						sections[0].classList.remove("not-margin");

						if (sectionFirstChild.classList.contains("section--header-light")) {
							header.classList.add("color-background-overlay");
						} else {
							header.classList.remove("color-background-overlay");
						}
					} else {
						sections[0].classList.add("not-margin");
						header.classList.remove("color-background-overlay");
					}
				} else {
					sections[0].classList.remove("not-margin");

					header.classList.remove("color-background-overlay");
				}
			} else {
				header.classList.remove("color-background-overlay");
			}
		}
	};

	initHeaderOverlay();

	document.addEventListener("shopify:section:load", initHeaderOverlay);
	document.addEventListener("shopify:section:unload", initHeaderOverlay);
	document.addEventListener("shopify:section:reorder", initHeaderOverlay);
})();

function formatMoney(cents, format = "") {
	if (typeof cents === "string") {
		cents = cents.replace(".", "");
	}
	let value = "";
	const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
	const formatString = format || theme.moneyFormat;

	function formatWithDelimiters(
		number,
		precision = 2,
		thousands = ",",
		decimal = ".",
	) {
		if (isNaN(number) || number == null) {
			return 0;
		}

		number = (number / 100.0).toFixed(precision);

		const parts = number.split(".");
		const dollarsAmount = parts[0].replace(
			/(\d)(?=(\d\d\d)+(?!\d))/g,
			`$1${thousands}`,
		);
		const centsAmount = parts[1] ? decimal + parts[1] : "";

		return dollarsAmount + centsAmount;
	}

	switch (formatString.match(placeholderRegex)[1]) {
		case "amount":
			value = formatWithDelimiters(cents, 2);
			break;
		case "amount_no_decimals":
			value = formatWithDelimiters(cents, 0);
			break;
		case "amount_with_comma_separator":
			value = formatWithDelimiters(cents, 2, ".", ",");
			break;
		case "amount_no_decimals_with_comma_separator":
			value = formatWithDelimiters(cents, 0, ".", ",");
			break;
	}

	return formatString.replace(placeholderRegex, value);
}

const initUnderlinedTitles = () => {
	let sectionTitles = document.querySelectorAll(
		".shopify-section:not(.shopify-section-group-header-group):not(.shopify-section-group-footer-group) .title--rounded",
	);

	if (sectionTitles.length > 0) {
		sectionTitles.forEach((title) => {
			const sectionResizeObserver = new ResizeObserver((entries) => {
				const [entry] = entries;
				let xs, s, m, l, xl;

				if (document.body.clientWidth < 1600) {
					xs = 95;
					s = 160;
					m = 280;
					l = 380;
					xl = 520;
				} else {
					xs = 95;
					s = 200;
					m = 360;
					l = 450;
					xl = 620;
				}

				entry.target
					.querySelectorAll('span[style="text-decoration:underline"]')
					.forEach((span) => {
						const titleWidth = span.getBoundingClientRect().width;
						span.classList.remove(
							"title--rounded-xs",
							"title--rounded-s",
							"title--rounded-m",
							"title--rounded-l",
							"title--rounded-xl",
							"title--rounded-xxl",
						);
						if (titleWidth < xs) {
							span.classList.add("title--rounded-xs");
						} else if (titleWidth < s) {
							span.classList.add("title--rounded-s");
						} else if (titleWidth < m) {
							span.classList.add("title--rounded-m");
						} else if (titleWidth < l) {
							span.classList.add("title--rounded-l");
						} else if (titleWidth < xl) {
							span.classList.add("title--rounded-xl");
						} else {
							span.classList.add("title--rounded-xxl");
						}
					});
			});

			sectionResizeObserver.observe(title);
		});
	}
};


// Tab js
function resetTabButtons(tab_buttons) {
	tab_buttons.forEach(button => {
		if (!button.classList.contains("tab-button")) {
			button.classList.add("tab-button")
		}
		if (button.classList.contains("tab-button-active")) {
			button.classList.remove("tab-button-active")
		}
	})
}
function activateButton(button) {
	if (button.classList.contains("tab-button")) {
		button.classList.remove("tab-button")
	}
	if (!button.classList.contains("tab-button-active")) {
		button.classList.add("tab-button-active")
	}
}
function resetTabs(tabs) {
	tabs.forEach(tab => {
		if (!tab.classList.contains("tab-content")) {
			tab.classList.add("tab-content");
		}
	});
}
function activateTab(tab){
	if (tab.classList.contains("tab-content")) {
		tab.classList.remove("tab-content");
	}
}

var links = document.links;
for (let i = 0, len = links.length; i < len; i++) {
  const link = links[i];
  if (link.hasAttribute('data-gated-trigger')) {
    continue;
  }
  if (link.hostname !== window.location.hostname) {
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
  }
}