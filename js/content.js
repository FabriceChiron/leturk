const generatePage = (collection, mainContainer, type) => {
  switch(type) {
    case 'photos':
      const photosHolder = createElem('div', mainContainer, {
        class: 'photos-holder'
      });
      
      collection.photos.map(photo => {
        const photoTile = createElem('div', photosHolder, {
          class: 'photo-tile'
        });

        const tileImage = createElem('img', photoTile);
        createImage(tileImage, `${imagesRoot}/${imagesFolder}/${collection.id}/default/${photo.file}.jpg`);

        const infosImage = createElem('div', photoTile, {
          class: 'infos-image'
        });

        const photoTitle = createElem('h2', infosImage).innerText = `${photo.title}`;
      });
    break;
  }
}

const generateSection = (category, mainContainer, content) => {
  const categorySection = createElem('section', mainContainer, {
    id: `${category.id}`
  }, (category.type === 'home') ? 'prepend' : null);

  let categoryTitle, tilesHolder;

  switch(category.type) {
    case 'home':
      category.animation.map(animationItem => {
        createElem('div', categorySection, {
          class: `animate ${animationItem.animationClass}`,
          style: `background-image: url(${imagesRoot}/${imagesFolder}/${category.id}/${animationItem.file}.jpg)`
        })
      })

      generateLogoLink(categorySection, category, content.categories[0].id);
          
    break;
    
    case 'photos':
      categoryTitle = createElem('h2', categorySection);

      categoryTitle.innerText = category.name;

      tilesHolder = createElem('div', categorySection, {
        class: 'tiles-holder'
      });

      category.collection.map(collection => {
        const tile = createElem('a', tilesHolder, {
          class: `tile ${(collection.highlight && collection.highlight === true) && 'highlight'}`,
          id: `${collection.id}`,
          href: `#${category.id}/${collection.id}`
        }, (collection.highlight && collection.highlight === true) && 'prepend');

        // if(collection.highlight && collection.highlight === true) {
        //   tile.classList.add('highlight');
        // }

        let coverImage;
        if(collection.cover && collection.cover.file && collection.cover.file.length > 0 ) {
          coverImage = collection.cover;
        }
        else {
          coverImage = collection.photos[0];
        }
        
        
        const tileImage = createElem('img', tile);

        createImage(tileImage, `${imagesRoot}/${imagesFolder}/${collection.id}/default/${coverImage.file}.jpg`, true);

        const tileTitle = createElem('h3', tile);
        tileTitle.innerText = `${collection.name}`;

        // tile.onclick = function() {
        //   toPopin(tile, collection, mainContainer, category.type);
        // }

      });
    break;

    case 'videos':
      categoryTitle = createElem('h2', categorySection);
      categoryTitle.innerText = category.name;

      tilesHolder = createElem('div', categorySection, {
        class: 'tiles-holder'
      });

      category.collection.map(collection => {
        const tile = createElem('div', tilesHolder, {
          class:`tile ${collection.type} ${(collection.highlight && collection.highlight === true) && 'highlight'}`,
          id: `video-${collection.id}`,
        }, (collection.highlight && collection.highlight === true) && 'prepend');

        // if(collection.highlight && collection.highlight === true) {
        //   tile.classList.add('highlight');
        // }

        const tileImage = createElem('img', tile);

        createImage(tileImage, getVideoThumbnail(collection.type, collection.id, collection.res), true);

        tile.classList.add('video');

        const tileTitle = createElem('h3', tile);
        tileTitle.innerText = `${collection.name}`;

        const tileBtn = createElem('button', tile);
        tileBtn.dataset.href = `${collection.url}`;
        tileBtn.innerText = 'Ù';

        tileBtn.onclick = function() {
          toPopin(tile, collection, mainContainer, category.type);
        }
      });
    break;
  }
}


const generateContent = (content, hash, isHomepage) => {
  const mainContainer = document.querySelector('#main-container');

  setAttributes(mainContainer, {
    class: viewPort
  });

  mainContainer.innerHTML = '';
  console.log(mainContainer.innerHTML.length > 0);

    content.categories.map(category => {
      if(isHomepage) {
        if(category.onHome === true) {
          generateSection(category, mainContainer, content);
        }
      }
      else {
        const splitHash = hash.split('/');

        if(category.id === splitHash[0]) {

          category.collection.map(collection => {
            if(collection.id === splitHash[1]) {
              generatePage(collection, mainContainer, category.type);
            }
          });
        }

      }
    })


}