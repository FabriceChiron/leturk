let viewPort, currentHash, isHomepage, wasHomepage, pageScroller;
let pageChange = true;
let lastScrollTop = 0;
let scrollDirection = 'down';

const md = new MobileDetect(window.navigator.userAgent);

const arrayHomePage = ['', 'series', 'clients', 'videos'];

const hashHandler = (viewPortChange) => {
  let newHash = window.location.hash.split('?')[0].substring(1);

  scrollOnStart(newHash === '', viewPort);

  wasHomepage = (!currentHash || (currentHash && arrayHomePage.includes(currentHash))) ? true : false;

  // if(newHash === '') {
  //   document.body.classList.remove('to-content');
  // }

  if(arrayHomePage.includes(newHash)) {
    isHomepage = true;
    handleScroll(pageScroller);
    document.body.classList.add('on-homepage');
  
  } 
  else {
    isHomepage = false;
    document.body.classList.remove('on-homepage');
  }

  if(isHomepage ===  true && wasHomepage === true) {
    pageChange = false;
  }

  else {
    pageChange = true;
    pageScroller.scrollTo(0, 0);
    scrollDirection = 'down';
  }
  
  if(viewPortChange || pageChange) {
    // console.table(`currentHash: ${currentHash}`, `viewPortChange: ${viewPortChange}`, `pageChange: ${pageChange}`)
    generateStructure(viewPort, newHash, isHomepage, pageChange);
  }

  toggleLinksHighLight(newHash);

  currentHash = newHash;
  

}

const getPageScroller= (viewPort) => { 
  pageScroller = (viewPort === 'mobile') ? document.querySelector('#main-container') : window;
}

const initViewPort = () => {

  let newViewPort;

  if(md.mobile()) {
    newViewPort = 'mobile';
  } else {
    newViewPort = (window.innerWidth < 740) ? 'mobile' : 'desktop';
  }


  if((newViewPort != viewPort) || !viewPort) {

    viewPort = newViewPort;
    
    getPageScroller(viewPort);

    [...document.querySelectorAll('body, header, #main-container')].map(el => {
      setAttributes(el, {
        class: viewPort
      });
    })

    hashHandler(true);
  }
}


const generateBurgerMenu = (container) => {
  const toggleMenuInput = createElem('input', container, {
    type:"checkbox",
    id: "toggle-menu"
  });


  const toggleMenuButton = createElem('label', container, {
    for: "toggle-menu",
    class: "toggle-menu-btn"
  });

  toggleMenuButton.innerHTML = '<span></span><span></span><span></span>';
}


const generateStructure = (viewPort, hash, isHomepage, pageChange) => {

  console.log(`Generating page`);

  fetch('data/content.json')
  .then(res => res.json())
  .then(data => {

    // console.log(pageChange);
    generateMenu(data.content, hash, isHomepage, pageChange);

    generateContent(data.content, hash, isHomepage, pageChange);
  });

}




initViewPort();

window.onresize = () => {
  initViewPort();

  checkPopinPhoto();
}

// window.addEventListener('hashchange', hashHandler, false);
window.onhashchange = function() {
  hashHandler();
}