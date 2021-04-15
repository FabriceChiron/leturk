generateLogoLink = (container, category, target) => {
  console.log(category.id);
  const logoLink = createElem('a', container, {
    href: `#${(target !== undefined) ? `${target}` : ''}`,
    class: 'logo-link'
  });

  const logoImg = createElem('img', logoLink, {
    src: `images/logo/${category.source}`
  });

  if(target) {
    const logoSubTitle = createElem('h2', logoLink);

    logoSubTitle.innerHTML = category.subtitle;
  }
}

generateMenu = (content) => {

  const header = document.querySelector('header');

  setAttributes(header, {
    class: viewPort
  })

  header.innerHTML = '';

  const navHolder = createElem('nav', header);

  if(viewPort === 'mobile') {
    generateBurgerMenu(navHolder);
  } 

  const nav =  createElem('ul', navHolder, {
    id: 'menu',
  });

  content.categories.map(category => {
    let catElem = createElem('li', nav, {
      class: `category ${(category.id === 'home') ? category.id : category.home}`
    });


    if(category.id === 'home' && viewPort === 'desktop') {

      generateLogoLink(catElem, category);
      
    } else {

      if(category.id === 'home' && viewPort === 'mobile') {
        catElem.remove();
        generateLogoLink(navHolder, category);
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

    }

  })
}