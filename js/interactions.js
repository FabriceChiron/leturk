const handleScroll = (pageScroller) => {
  const header = document.querySelector('header');
  const mainContainer = document.querySelector('#main-container');

  pageScroller.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
     var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
     if (st > lastScrollTop){
        // downscroll code
        scrollDirection = 'down';
     } else {
        // upscroll code
        scrollDirection = 'up';
     }
     lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }, false);


  pageScroller.onscroll = () => {

    if(viewPort === 'mobile') {

      if(isHomepage === true) {

        if(mainContainer.scrollTop > 0) {
          mainContainer.querySelector('#home .logo-link').classList.add('hide')
        }
        else {
          mainContainer.querySelector('#home .logo-link').classList.remove('hide')
        }
      }
    }
    else {
      const homeLogo = document.querySelector('#home .logo-link');
      
      if(isHomepage === true) {
        const headerLogo = header.querySelector('.logo-link');
        
        if(homeLogo) {
          if(homeLogo.getBoundingClientRect().top >= header.getBoundingClientRect().top) {
            homeLogo.classList.add('invisible');
            homeLogo.classList.remove('visible');

            headerLogo.classList.add('visible');
            headerLogo.classList.remove('invisible');
          }
          else {
            homeLogo.classList.add('visible');
            homeLogo.classList.remove('invisible');

            headerLogo.classList.add('invisible');
            headerLogo.classList.remove('visible');
          }
        }

        if(document.querySelector('html').scrollTop > window.innerHeight) {
          header.classList.add('sticky');
        } 
        else {
          header.classList.remove('sticky');
        }

        if(document.querySelector('html').scrollTop > 0) {
          document.querySelector('#home .logo-link h2').classList.add('hide')
        }
        else {
          document.querySelector('#home .logo-link h2').classList.remove('hide')
        }

        [...mainContainer.querySelectorAll('h2.section-title')].map(elemTitle => {

          if(elemTitle.getBoundingClientRect().top == header.getBoundingClientRect().bottom) {
            if(scrollDirection === 'down') {
              elemTitle.classList.add('sticky');
            }
            else {
              
            }
          }
          else {
            if(elemTitle.getBoundingClientRect().top <= header.getBoundingClientRect().bottom) {
              if(scrollDirection === 'down') {
                elemTitle.classList.add('fade');
              } else {
                elemTitle.classList.remove('fade');
              }
            }
            if(scrollDirection === 'up' && (elemTitle.getBoundingClientRect().top <= header.getBoundingClientRect().bottom)) {
              elemTitle.classList.remove('fade');
            }
          }
          if(scrollDirection === 'up' && (elemTitle.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom)) {
            elemTitle.classList.remove('fade');
          }

          if(elemTitle.getBoundingClientRect().top > header.getBoundingClientRect().bottom) {
            elemTitle.classList.remove('sticky');
          }
        })
      }

      else {
        header.classList.add('sticky');
        (homeLogo) && homeLogo.classList.remove('visible');
        (homeLogo) && homeLogo.classList.remove('invisible');
      }

    }
    
  }
}
  // On scroll : desktop

