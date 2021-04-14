let viewPort;

const hashHandler = () => {
  return window.location.hash.split('?')[0].substring(1);
}

const initViewPort = () => {
  
  let newViewPort = (window.innerWidth < 740) ? 'mobile' : 'desktop';

  if((newViewPort != viewPort) || !viewPort) {
    console.log(`viewport change: ${newViewPort}`);

    viewPort = newViewPort; 

    generatePage(newViewPort, hashHandler());
  }
}


const generatePage = (viewPort, currentHash) => {

  console.log(`generating page for ${viewPort}`)

  fetch('data/content.json')
  .then(res => res.json())
  .then(data => {
    generateMenu(data.content);
});

}

generateBurgerMenu = (container) => {
  const toggleMenuButton = createElem('label', container, {
    for: "toggle-menu"
  });

  const toggleMenuInput = createElem('input', container, {
    type:"checkbox",
    id: "toggle-menu"
  });
}

generateMenuLink = (group, item, path) => {
  let menuLink = createElem('a', item, {
    href: `#${path}`
  });
  menuLink.innerText = `${group.name}`;
}

generateMenu = (content) => {
  const header = createElem('header', document.body);
  const navHolder = createElem('nav', header);

  generateBurgerMenu(navHolder);

  const nav =  createElem('ul', navHolder, {
    id: 'menu',
  });


  content.categories.map(category => {
    let catElem = createElem('li', nav, {
      class: `category ${category.type}`
    });


    if(category.type === 'logo') {
      const logo = createElem('img', catElem, {
        src: `images/logo/${category.source}`
      });
    } else {

      generateMenuLink(category, catElem, category.id);
      
      if(category.type === "photos" && category.collection.length > 0) {
        let collectionContainer = createElem('div', catElem);
        let collectionHolder = createElem('ul', collectionContainer);

        category.collection.map(collectionItem => {
          let collectionElem = createElem('li', collectionHolder);
          generateMenuLink(collectionItem, collectionElem, `${category.id}/${collectionItem.id}`);
        });
      }
    }

  })
}

hashHandler();
initViewPort();

window.onresize = () => {
  initViewPort();
}

// window.addEventListener('hashchange', hashHandler, false);
window.onhashchange = function() {
  hashHandler();
}