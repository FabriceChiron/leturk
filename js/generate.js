let viewPort, currentHash, isHomepage, wasHomepage, pageScroller;

const md = new MobileDetect(window.navigator.userAgent);

const arrayHomePage = ['', 'series', 'clients', 'videos'];

const hashHandler = (viewPortChange) => {
  let newHash = window.location.hash.split('?')[0].substring(1);

  scrollOnStart(newHash === '', viewPort);

  wasHomepage = (!currentHash || (currentHash && arrayHomePage.includes(currentHash))) ? true : false;

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
  }
  
  if(viewPortChange || pageChange) {
    // console.table(`currentHash: ${currentHash}`, `viewPortChange: ${viewPortChange}`, `pageChange: ${pageChange}`)
    generateStructure(viewPort, newHash, isHomepage);
  }

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


generateBurgerMenu = (container) => {
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

generateMenuLink = (group, item, path) => {
  let menuLink = createElem('a', item, {
    href: `#${path}`
  });
  menuLink.innerText = `${group.name}`;
}


const generateStructure = (viewPort, hash, isHomepage) => {

  fetch('data/content.json')
  .then(res => res.json())
  .then(data => {
    generateMenu(data.content, hash, isHomepage);

    generateContent(data.content, hash, isHomepage);
  });

}




initViewPort();

window.onresize = () => {
  initViewPort();
}

// window.addEventListener('hashchange', hashHandler, false);
window.onhashchange = function() {
  hashHandler();
}