generateMenu = (content, hash, isHomepage, pageChange) => {

  const header = document.querySelector('header');

  setAttributes(header, {
    class: viewPort
  });

  if(header.innerHTML.length === 0 || pageChange) {
    console.log('generating menu');

    if(pageChange === true) {
      emptyContainer(header);
    }

    const navHolder = createElem('nav', header);

    if(viewPort === 'mobile') {
      generateBurgerMenu(navHolder);
    } 

    const nav =  createElem('ul', navHolder, {
      id: 'menu',
    });

    content.categories.map(category => {
      let catElem = createElem('li', nav, {
        class: `category ${(category.id === 'home') ? category.id : category.type}`
      });


      if(category.id === 'home' && viewPort === 'desktop') {

        generateLogoLink(catElem, category, hash);
        
      } else {

        if(category.id === 'home' && viewPort === 'mobile') {
          catElem.remove();
          generateLogoLink(navHolder, category);
        } else {
          
          if(category.type != "blank"){
            
            let catLinkContainer = createElem('span', catElem);
            generateMenuLink(category, catLinkContainer, category.id, hash);
            
            if(category.type === "photos" && category.collection.length > 0) {
              if(viewPort === 'mobile') {
                let collectionInput = createElem('input', catElem, {
                  type: 'checkbox',
                  id: `toggle-${category.id}`
                }, 'prepend');

                let collectionBtn = createElem('label', catLinkContainer, {
                  for: `toggle-${category.id}`
                });
              }
              let collectionContainer = createElem('div', catElem);
              let collectionHolder = createElem('ul', collectionContainer);

              category.collection.map(collectionItem => {
                let collectionElem = createElem('li', collectionHolder, {
                  id: `${collectionItem.id}`
                });
                generateMenuLink(collectionItem, collectionElem, `${category.id}/${collectionItem.id}`, hash);
              });
            }

          }


        }

      }

    })

    console.log(`content.categories.length: ${content.categories.length}`);

  }
}