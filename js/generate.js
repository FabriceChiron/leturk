let viewPort;
let currentHash;

const hashHandler = () => {
  currentHash = window.location.hash.split('?')[0].substring(1);
  generateStructure(viewPort, currentHash);
}

const initViewPort = () => {
  
  let newViewPort = (window.innerWidth < 740) ? 'mobile' : 'desktop';

  if((newViewPort != viewPort) || !viewPort) {
    console.log(`viewPort change: ${newViewPort}`);

    viewPort = newViewPort;

    setAttributes(document.body, {
      class: viewPort
    });

    hashHandler();
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


const generateStructure = (viewPort, currentHash) => {

  console.log(`generating ${(currentHash === '') ? 'homepage' : `${currentHash} page`} on ${viewPort}`);
  
  fetch('data/content.json')
  .then(res => res.json())
  .then(data => {
    generateMenu(data.content);

    generateContent(data.content);
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