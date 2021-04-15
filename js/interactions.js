if(viewPort === 'desktop') {
  const header = document.querySelector('header');
  const mainContainer = document.querySelector('#main-container');

  window.onscroll = () => {
    if(document.querySelector('html').scrollTop > window.innerHeight) {
      header.classList.add('sticky');
    } else {
      if(document.querySelector('html').scrollTop > 0) {
        mainContainer.querySelector('#home .logo-link h2').classList.add('hide')
      }
      else {
        mainContainer.querySelector('#home .logo-link h2').classList.remove('hide')
      }
      header.classList.remove('sticky');
    }
  }
}