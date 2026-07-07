if (!customElements.get("quick-add-modal")) {
	customElements.define(
		"quick-add-modal",
		class QuickAddModal extends ModalDialog {
			constructor() {
				super();
				this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');

				window.addEventListener("keyup", (event) => {
					if (event.code.toUpperCase() === "ESCAPE") this.hide();
				});

				window.addEventListener("resize", function () {
					$(".js-media-list").each(function () {
						this.swiper?.destroy();
					});
					$(".js-media-sublist").each(function () {
						this.swiper?.destroy();
					});

					setTimeout(() => {
						subSliderInit(true, 8);
						sliderInit(true);
					}, 200);
				});
			}

			hide(preventFocus = false) {
				const cartDrawer = document.querySelector("cart-drawer");
				if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
				this.modalContent.innerHTML = "";

				$(".js-media-list").each(function () {
					this.swiper.destroy();
				});
				$(".js-media-sublist").each(function () {
					this.swiper.destroy();
				});

				subSliderInit(true, 8);
				sliderInit(true);

				if (preventFocus) this.openedBy = null;
				super.hide();
			}

			show(opener) {
				opener.setAttribute("aria-disabled", true);
				opener.classList.add("loading");

				if (opener.querySelector(".loading-overlay__spinner")) {
					opener
						.querySelector(".loading-overlay__spinner")
						.classList.remove("hidden");
				}

				fetch(opener.getAttribute("data-product-url"))
					.then((response) => response.text())
					.then((responseText) => {
						const responseHTML = new DOMParser().parseFromString(
							responseText,
							"text/html",
						);
						this.productElement = responseHTML.querySelector(
							'section[id^="MainProduct-"]',
						);
						this.preventDuplicatedIDs();
						this.removeDOMElements();
						this.setInnerHTML(
							this.modalContent,
							this.productElement.innerHTML,
							opener,
						);

						if (window.Shopify && Shopify.PaymentButton) {
							Shopify.PaymentButton.init();
						}

						if (window.ProductModel) window.ProductModel.loadShopifyXR();

						this.updateImageSizes();
						this.preventVariantURLSwitching();
						super.show(opener);
					})
					.finally(() => {
						opener.removeAttribute("aria-disabled");
						opener.classList.remove("loading");

						if (opener.querySelector(".loading-overlay__spinner")) {
							opener
								.querySelector(".loading-overlay__spinner")
								.classList.add("hidden");
						}

						$(".js-media-list").each(function () {
							this.swiper?.destroy();
						});
						$(".js-media-sublist").each(function () {
							this.swiper?.destroy();
						});

						subSliderInit(true, 8);
						sliderInit(true);
					});
			}

			setInnerHTML(element, html, opener) {
				element.innerHTML = html;

				// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
				element.querySelectorAll("script").forEach((oldScriptTag) => {
					const newScriptTag = document.createElement("script");
					Array.from(oldScriptTag.attributes).forEach((attribute) => {
						newScriptTag.setAttribute(attribute.name, attribute.value);
					});
					newScriptTag.appendChild(
						document.createTextNode(oldScriptTag.innerHTML),
					);
					oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
				});

				// Read more button
				const moreBtn = document.createElement("a");
				moreBtn.innerHTML = `<span>${theme.quickviewMore}</span><svg class="icon icon-button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M7.30644 5.5C6.89223 5.5 6.55644 5.83579 6.55644 6.25C6.55644 6.66421 6.89223 7 7.30644 7L12.5669 7L5.5976 13.9693C5.30471 14.2622 5.30471 14.7371 5.5976 15.0299C5.89049 15.3228 6.36537 15.3228 6.65826 15.0299L13.6275 8.06069V13.3211C13.6275 13.7353 13.9633 14.0711 14.3775 14.0711C14.7917 14.0711 15.1275 13.7353 15.1275 13.3211V6.25C15.1275 6.14102 15.1043 6.03747 15.0625 5.94404C15.034 5.88021 14.9961 5.81955 14.9489 5.76414C14.8817 5.68521 14.7985 5.62038 14.7042 5.5747C14.6055 5.52684 14.4946 5.5 14.3775 5.5H7.30644Z" fill="currentColor"/>
				</svg>`;
				moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
				moreBtn.setAttribute(
					"class",
					"product__full-details button button--simple button--arrow",
				);
				if (
					element.querySelectorAll(".product__info-column") &&
					element.querySelectorAll(".product__info-column").length > 0
				) {
					element.querySelector(".product-form__buttons").appendChild(moreBtn);
				} else {
					element.querySelector(".product-form__buttons").appendChild(moreBtn);
				}
			}

			removeDOMElements() {
				const popup = this.productElement.querySelectorAll(".product-popup");
				if (popup)
					popup.forEach((el) => {
						el.remove();
					});

				const about = this.productElement.querySelectorAll(".about");
				if (about)
					about.forEach((el) => {
						el.remove();
					});

				const shareButtons =
					this.productElement.querySelector(".share-buttons");
				if (shareButtons) shareButtons.remove();

				const sku = this.productElement.querySelector(".product__sku");
				if (sku) sku.remove();

				const breadcrumb = this.productElement.querySelector(".breadcrumb");
				if (breadcrumb) breadcrumb.remove();

				const tags = this.productElement.querySelector(".product-tags");
				if (tags) tags.remove();

				const pickupAvailability = this.productElement.querySelector(
					".pickup-availability",
				);
				if (pickupAvailability) pickupAvailability.remove();

				const iconWithTexts = this.productElement.querySelectorAll(
					".product__text-icons",
				);
				if (iconWithTexts)
					iconWithTexts.forEach((el) => {
						el.remove();
					});

				const description = this.productElement.querySelector(
					".product__description",
				);
				if (description) description.remove();

				const recommendations = this.productElement.querySelector(
					".product-recommendations",
				);
				if (recommendations) recommendations.remove();
			}

			preventDuplicatedIDs() {
				const sectionId = this.productElement.dataset.section;
				this.productElement.innerHTML =
					this.productElement.innerHTML.replaceAll(
						sectionId,
						`quickadd-${sectionId}`,
					);
				this.productElement
					.querySelectorAll("variant-selects, variant-radios")
					.forEach((variantSelect) => {
						variantSelect.dataset.originalSection = sectionId;
					});
			}

			preventVariantURLSwitching() {
				if (this.modalContent.querySelector("variant-radios,variant-selects")) {
					this.modalContent
						.querySelector("variant-radios,variant-selects")
						.setAttribute("data-update-url", "false");
				}
			}

			updateImageSizes() {
				const product = this.modalContent.querySelector(".product");
				const desktopColumns = product.classList.contains("product--columns");
				if (!desktopColumns) return;

				const mediaImages = product.querySelectorAll(".product__media img");
				if (!mediaImages.length) return;

				let mediaImageSizes =
					"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

				if (product.classList.contains("product--medium")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "605px");
				} else if (product.classList.contains("product--small")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "495px");
				}

				mediaImages.forEach((img) =>
					img.setAttribute("sizes", mediaImageSizes),
				);
			}
		},
	);
}
