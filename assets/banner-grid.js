(() => {
  const calcHeightButton = (section, width) => {
    let parent;
		if (document.currentScript) {
			parent = document.currentScript.parentElement;
		}
		else {
			parent = section;
		}

    const cards = parent.querySelectorAll('.banner-grid__card_full-link');
    cards.forEach(card => {
      const button = card.querySelector('.banner-grid__button');
      let heightButton;
      if (button && width >= 750) {
        heightButton = button.getBoundingClientRect().height 
          + parseFloat(window.getComputedStyle(button, null).getPropertyValue("margin-top"));
      }
      else {
        if (width < 750)
          heightButton = 16;
        else
          heightButton = 24;
      }

      card.style = `--height-button: ${heightButton}px`;
      if (card.querySelector('.banner-grid__top')) {
        card.querySelector('.banner-grid__top').style.marginBottom = heightButton + 'px';
      }
      else if (card.querySelector('.banner-grid__title-content')) {
        card.querySelector('.banner-grid__title-content').style.marginTop = heightButton + 'px';
      }
    });
  }

  const initSection = (section) => {
    let  sectionBannerGrid;
    if (document.currentScript) {
      sectionBannerGrid = document.currentScript.parentElement;
    }
    else {
      sectionBannerGrid = section;
    }

    if (sectionBannerGrid) {
      const sectionResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;

        calcHeightButton(sectionBannerGrid, entry.contentRect.width)
      })

      sectionResizeObserver.observe(sectionBannerGrid);
    }
  }

  initSection();

  document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	})
})()