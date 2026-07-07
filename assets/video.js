(function () {
  const playVideo = (video) => {

  }

  const stopVideo = (video) => {

  }

  const initSection = (section) => {
    let sectionVideo = document.currentScript ? document.currentScript.parentElement: section;

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          
        }
      })
    })
  }

  document.addEventListener("shopify:section:load", function (section) {
		initSection(section.target);
	});
})()