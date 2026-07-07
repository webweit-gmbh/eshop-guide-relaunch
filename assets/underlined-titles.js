(function() {
  const initSection = () => {
    let sectionTitles = document.querySelectorAll('.shopify-section:not(.shopify-section-group-header-group):not(.shopify-section-group-footer-group) .title--rounded');

    if (sectionTitles.length > 0) {  
      sectionTitles.forEach(title => {
        const sectionResizeObserver = new ResizeObserver((entries) => {
          const [entry] = entries;
          let xs, s, m, l, xl;

          if (document.body.clientWidth < 1600) {
            xs = 95; s = 160; m = 280; l = 380; xl = 520;
          }
          else {
            xs = 95; s = 200; m = 360; l = 450; xl = 620;
          }

          entry.target.querySelectorAll('span[style="text-decoration:underline"]').forEach(span => {
            const titleWidth = span.getBoundingClientRect().width;
            span.classList.remove('title--rounded-xs', 'title--rounded-s', 'title--rounded-m', 'title--rounded-l', 'title--rounded-xl', 'title--rounded-xxl')
            if (titleWidth < xs) {
              span.classList.add('title--rounded-xs');
            }
            else if (titleWidth < s) {
              span.classList.add('title--rounded-s')
            }
            else if (titleWidth < m) {
              span.classList.add('title--rounded-m')
            }
            else if (titleWidth < l) {
              span.classList.add('title--rounded-l')
            }
            else if (titleWidth < xl) {
              span.classList.add('title--rounded-xl')
            }
            else {
              span.classList.add('title--rounded-xxl')
            }
          })
        })

        sectionResizeObserver.observe(title);
      });
    }
  }

  initSection();

  document.addEventListener("shopify:section:load", function () {
    initSection();
  });
})()