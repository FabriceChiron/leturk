const handleScroll = (pageScroller) => {
  const header = document.querySelector('header');
  const mainContainer = document.querySelector('#main-container');


  pageScroller.onscroll = () => {
    if(isHomepage) {

    }

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
      if(isHomepage === true) {
        const homeLogo = document.querySelector('#home .logo-link');
        const headerLogo = header.querySelector('.logo-link');
        
        // if(viewPort === 'desktop') {
          // console.log(homeLogo.getBoundingClientRect().top, header.getBoundingClientRect().top);

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

          if(document.querySelector('html').scrollTop > window.innerHeight) {
            header.classList.add('sticky');
          } 
          else {
            header.classList.remove('sticky');
          }
        // }

        if(document.querySelector('html').scrollTop > 0) {
          mainContainer.querySelector('#home .logo-link h2').classList.add('hide')
        }
        else {
          mainContainer.querySelector('#home .logo-link h2').classList.remove('hide')
        }
      }

      else {
        header.classList.add('sticky');
      }

    }
    
  }
}


  // On scroll : desktop

