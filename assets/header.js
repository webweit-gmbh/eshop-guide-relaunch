(function () {
	const header = () => {
		const header = document.querySelector(".shopify-section-header");
		const menu = document.querySelector(".list-menu--inline");
		const menuLinks = document.querySelectorAll(".list-menu-item");
		const search = document.querySelector(".header__search");

		header.addEventListener("keydown", (e) => {
			if (e.code === "Escape" && search.isOpen) {
				search.close();
			}
		});

		const annBar = document.querySelector(".section-announcement");
		const annBarObserver = new IntersectionObserver((entries) => {
			const [entry] = entries;

			if (entry.isIntersecting) {
				document.documentElement.style.setProperty(
					"--ann-height",
					`${entry.intersectionRect.height}px`,
				);
			} else {
				document.documentElement.style.setProperty("--ann-height", `0px`);
			}
		});
		if (annBar) annBarObserver.observe(annBar);

		const megaMenus = document.querySelectorAll(".mega-menu");

		menuLinks.forEach((link) => {
			link.addEventListener("mouseenter", (e) => {
				if (link.classList.contains("list-menu--megamenu")) {
					link.classList.add("list-menu--megamenu-visible");

					if (!megaMenus) return;
					megaMenus.forEach((megaMenu) => {
						const megaMenuPositionRight =
							megaMenu.getBoundingClientRect().right;
						const windowRight = window.innerWidth;
						if (megaMenuPositionRight > windowRight) {
							megaMenu.style.right = "0";
						}
						if (megaMenu == link.querySelector('.mega-menu')) {
							megaMenu.style.opacity = 0;
							megaMenu.style.display = "grid";
							setTimeout(() => {
								megaMenu.style.opacity = 1;
							}, 100);
						}
					});

					menuLinks.forEach((el) => {
						if (el !== link) {
							el.classList.remove("list-menu--megamenu-visible");
						}
					});
				} else {
					menuLinks.forEach((el) => {
						el.classList.remove("list-menu--megamenu-visible");
					});
				}
			});
			link.addEventListener("mouseleave", (e) => {
				if (link.classList.contains("list-menu--megamenu")) {
					if (!megaMenus) return;
					megaMenus.forEach((megaMenu) => {
						if (megaMenu == link.querySelector('.mega-menu')) {
							megaMenu.style.opacity = 0;
							setTimeout(() => {
								megaMenu.style.display = "none";
							}, 300);
						}
					});
				}
			})
			link.addEventListener("focus", (e) => {
				if (link.classList.contains("list-menu--megamenu")) {
					link.classList.add("list-menu--megamenu-visible");

					if (!megaMenus) return;
					megaMenus.forEach((megaMenu) => {
						const megaMenuPositionRight =
							megaMenu.getBoundingClientRect().right;
						const windowRight = window.innerWidth;
						if (megaMenuPositionRight > windowRight) {
							megaMenu.style.right = "0";
						}
					});

					menuLinks.forEach((el) => {
						if (el !== link) {
							el.classList.remove("list-menu--megamenu-visible");
						}
					});
				} else {
					menuLinks.forEach((el) => {
						el.classList.remove("list-menu--megamenu-visible");
					});
				}
			});
		});
		menu.addEventListener("mouseleave", (e) => {
			if (!megaMenus) return;
			setTimeout(() => {
				megaMenus.forEach((megaMenu) => {
					megaMenu.style.right = "auto";
				});
			}, 500);
			menuLinks.forEach((link) => {
				link.classList.remove("list-menu--megamenu-visible");
			});
		});
		menu.addEventListener("focusout", (e) => {
			if (!megaMenus) return;
			setTimeout(() => {
				megaMenus.forEach((megaMenu) => {
					megaMenu.style.right = "auto";
				});
			}, 500);
			menuLinks.forEach((link) => {
				link.classList.remove("list-menu--megamenu-visible");
			});
		});

    const megaMenuTabs = () => {
      // Initialize: Set the first tab and image active
      $(".mega-menu__tab-wrapper").first().addClass("mega-menu__tab-wrapper--active");
      $(".mega-menu__image").hide();
      $(".mega-menu__image[data-tab='1']").show();
    
      // Event handlers for tab interaction
      $(".mega-menu__tab-wrapper").on('mouseenter focus focusin', function () {
        // Remove active class from all tabs
        $(".mega-menu__tab-wrapper").removeClass("mega-menu__tab-wrapper--active");
        // Add active class to the current tab
        $(this).addClass("mega-menu__tab-wrapper--active");
    
        // Get the tab index
        var tabIndex = $(this).data('tab-index');
    
        // Hide all images and show the one corresponding to the active tab
        $(".mega-menu__image").hide();
        $(".mega-menu__image[data-tab='" + tabIndex + "']").show();
      });
    };
    megaMenuTabs();

		const main = document.querySelector("main");
		const breadcrumbs = document.querySelector(".breadcrumbs-wrapper");
		if (
			main.querySelectorAll(".shopify-section")[0] &&
			main
				.querySelectorAll(".shopify-section")[0]
				.classList.contains("section--has-overlay")
		) {
		}

		const menuCloseBtn = document.querySelector(".header__modal-close-button");
		const mobileMenuDrawer = document.querySelector("header-drawer");
		menuCloseBtn.addEventListener("click", (e) => {
			mobileMenuDrawer.closeMenuDrawer(e);
		});
	};

	document.addEventListener("shopify:section:load", header);
	document.addEventListener("shopify:section:unload", header);
	document.addEventListener("shopify:section:reorder", header);

	header();
})();
