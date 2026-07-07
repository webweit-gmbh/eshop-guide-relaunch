(function() {
  let typewriterObjects = [];

  function fixHtml(html){
    var div = document.createElement('div');
    div.innerHTML=html
    return (div.innerHTML);
  }

  /* Create animated phrase wrapper */
  const initPhraseWrapper = (title) => {
    title.forEach(el => {
      const regex = /\[(.*?)\]/g;

      const dataContent = el.getAttribute("data-content").split(/([\[\]])/)
      for (let i = 0; i < dataContent.length; i++) {
        dataContent[i] = fixHtml(dataContent[i]);
      }
      if (dataContent.indexOf('[') != -1) 
        dataContent[dataContent.indexOf('[')+1] = dataContent[dataContent.indexOf('[')+1].replace(/<(.|\n)*?>/g, '');
      const dataContentStr = dataContent.join('');
      
      //el.innerHTML = el.getAttribute("data-content").replace(regex, `<span class="js-anim-title">$&</span>`);
      el.innerHTML = dataContentStr.replace(regex, `<span class="js-anim-title">$&</span>`);
      
      if (el.classList.contains("js-anim-rolling") || el.classList.contains("js-anim-appearing")) {
        el.querySelectorAll(".js-anim-title").forEach(parent => {
          const text = parent.innerHTML;
          //const text = parent.innerText;
          const words = text.substring(1, text.length - 1).split("|");
          let newStr = "";

          for (let i = 0; i < words.length; i++) {
            newStr += `<span>${words[i]}</span> `;
          }
          parent.innerHTML = newStr;
        });
      }
    });
  };

  /* Set max height to animation container */
  const setContainerHeight = (container) => {
    let maxH = 0;
    container.querySelectorAll("span").forEach(child => {
      if (child.offsetHeight > maxH) {
        maxH = child.offsetHeight;
      }
    });
    container.style.height = `${maxH}px`;
    container.querySelectorAll("span").forEach(child => child.style.height = `${maxH}px`);
  };

  /* Set max width to rolling animation container */
  const setContainerWidth = (container) => {
    let maxW = 0;
    container.querySelectorAll("span").forEach(child => {
      if (child.offsetWidth > maxW) {
        maxW = child.offsetWidth;
      }
    });
    container.style.width = `${maxW + 2}px`;
    container.querySelectorAll("span").forEach(child => child.style.position = 'absolute');
  };

  const setContainerOpacity = (container) => {
    container.parentElement.style.opacity = '1';
  };

  const initTypewriterAnim = (section) => {
    if (section) {
      const typewriterTitle = section.querySelectorAll(".js-anim-typewriter");

      if (typewriterTitle && typewriterTitle.length > 0) {
        initPhraseWrapper(typewriterTitle);
  
        section.querySelectorAll(".js-anim-title").forEach(el => {
          setContainerOpacity(el);
          const text = el.innerHTML;
          //const text = el.innerText;
          const words = text.substring(1, text.length - 1).split("|"); // remove brackets and get array of words
  
          let typewriter = new Typewriter(el, {
            loop: true,
            delay: 110
          });
  
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
  
            typewriter.typeString(word);
            typewriter.pauseFor(500);
            typewriter.deleteChars(word.length);
          }
          typewriter.start();
  
          let obj = typewriterObjects.find(el => el.section === section);
          obj.animation.push(typewriter);
        });
  
        typewriterTitle.forEach(title => {
          title.style.opacity = '1';
        }); 

        initUnderlinedTitles();
      }
    }
  }

  const initRollingAnim = (section) => {
    if (section) {
      const rollingTitle = section.querySelectorAll(".js-anim-rolling");

      if (rollingTitle && rollingTitle.length > 0) {
        initPhraseWrapper(rollingTitle);

        section.querySelectorAll(".js-anim-title").forEach(el => {
          setContainerHeight(el);
          setContainerOpacity(el);
          setContainerWidth(el);

          const words = gsap.utils.toArray(el.querySelectorAll("span"));
          gsap.set(el.querySelectorAll("span:not(:first-child)"), { yPercent: 100 });

          let gsapRolling = gsap.timeline({ repeat: -1 });
          words.forEach((word, i) => {
            if (i) {
              gsapRolling
                .to(word, { yPercent: 0 }, "<")
                .to(word, { yPercent: -100, onComplete: () => gsap.set(word, { yPercent: 100 }) }, "+=2");
            } else {
              gsapRolling
                .to(word, { yPercent: -100, onComplete: () => gsap.set(word, { yPercent: 100 }) }, "+=2");
            }
          });
          gsapRolling.to(words[0], { yPercent: 0 }, "<");
        });

        rollingTitle.forEach(title => {
          title.style.opacity = '1';
        }); 

        initUnderlinedTitles();
      }
    }
  }

  const initAppearingAnim = (section) => {
    if (section) {
      const appearingTitle = section.querySelectorAll(".js-anim-appearing");

      if (appearingTitle && appearingTitle.length > 0) {
        initPhraseWrapper(appearingTitle);

        section.querySelectorAll(".js-anim-title").forEach(el => {
          setContainerHeight(el);
          setContainerOpacity(el);
          setContainerWidth(el);

          const words = gsap.utils.toArray(el.querySelectorAll("span"));
          gsap.set(el.querySelectorAll("span:not(:first-child)"), { opacity: "0" });

          let gsapAppearing = gsap.timeline({ repeat: -1 });
          words.forEach((word, i) => {
            if (i) {
              gsapAppearing
                .to(word, 0, { opacity: "1" }, "<")
                .to(word, 0, { opacity: "0", onComplete: () => gsap.set(word, { opacity: "0" }) }, "+=2");
            } else {
              gsapAppearing
                .to(word, 0, { opacity: "0", onComplete: () => gsap.set(word, { opacity: "0" }) }, "+=2");
            }
          });
          //gsapAppearing.to(words[0], { opacity: "1" }, "<");
        });

        appearingTitle.forEach(title => {
          title.style.opacity = '1';
        }); 

        initUnderlinedTitles();
      }
    }
  }

  const initSection = () => {
    let sectionTitles = document.querySelectorAll('.shopify-section:not(.shopify-section-group-header-group):not(.shopify-section-group-footer-group) .title');
    
    sectionTitles.forEach(title => {
      typewriterObjects.push({section: title.closest('.shopify-section'), animation: []});
    })

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initTypewriterAnim(entry.target.closest('.shopify-section'));
            initRollingAnim(entry.target.closest('.shopify-section'));
            initAppearingAnim(entry.target.closest('.shopify-section'));
          }
          else {
            let obj = typewriterObjects.find(el => el.section === entry.target.closest('.shopify-section'));
            if (obj) {
              obj.animation.forEach(animation => {
                animation.pause();
              });
            }
          }
        })
      }
    )

    sectionTitles.forEach(title => {
      sectionObserver.observe(title);

      const sectionResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;
        initRollingAnim(title.closest('.shopify-section'));
        initAppearingAnim(title.closest('.shopify-section'));
      });
      sectionResizeObserver.observe(title);
    });
  }

  initSection();

  document.addEventListener("shopify:section:load", function () {
    setTimeout(() => {
      initSection();
    }, 100);
  });
})();
