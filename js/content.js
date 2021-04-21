const generatePageGallery = (collection, mainContainer, type) => {

  const photosHolder = createElem('div', mainContainer, {
    class: `photos-holder ${(viewPort === 'desktop') ? 'dragscroll' : ''}`
  });
  
  collection.photos.map(photo => {
    const photoTile = createElem('div', photosHolder, {
      class: 'photo-tile'
    });

    const tileImage = createElem('img', photoTile, {
      style: `aspect-ratio: ${photo.aspectRatio}`
    });
    createImage(tileImage, `${imagesRoot}/${imagesFolder}/${collection.id}/default/${photo.file}.jpg`, null);

    const infosImage = createElem('div', photoTile, {
      class: 'infos-image'
    });

    const toolbarImage = createElem('div', photoTile, {
      class: 'toolbar'
    }, 'prepend');

    const btnZoomImage = createElem('button', toolbarImage);
    btnZoomImage.innerText = 'Ñ';

    btnZoomImage.onclick = function() {
      toPopin(photoTile, collection, mainContainer, type);
    }
    
    const photoCopyRight = createElem('div', infosImage, {
      class: 'copyright'
    }).innerHTML = `&copy LeTurk`;

    if(photo.title) {
      const photoTitle = createElem('h2', infosImage).innerText = `${photo.title}`;
    }

    if(viewPort === 'desktop') {
      photoTile.ondblclick = function() {
        toPopin(photoTile, collection, mainContainer, type);
      }
    } 

    if(viewPort === 'mobile') {
      tileImage.onclick = function() {
        toPopin(photoTile, collection, mainContainer, type);
      }
    } 
  });
}

const generateSection = (category, mainContainer, content, hash) => {
  const categorySection = createElem('section', mainContainer, {
    id: `${category.id}`
  }, (category.type === 'home') ? 'prepend' : null);

  // if(category === 'home' && viewPort === 'desktop') {
  //     document.body.insertBefore(categorySection, mainContainer);
  // }

  let categoryTitle, tilesHolder;

  switch(category.type) {
    case 'home':
      category.animation.map(animationItem => {
        createElem('div', categorySection, {
          class: `animate ${animationItem.animationClass}`,
          style: `background-image: url(${imagesRoot}/${imagesFolder}/${category.id}/${animationItem.file}.jpg)`
        })
      })

      generateLogoLink(categorySection, category, hash, content.categories[0].id);

      // jQuery Hack for non-chromium browsers;
      // dirtyHack();
          
    break;
    
    case 'photos':
      categoryTitle = createElem('h2', categorySection, {
        class: 'section-title'
      });

      categoryTitle.innerHTML = `<span>${category.name}</span>`;

      tilesHolder = createElem('div', categorySection, {
        class: 'tiles-holder'
      });

      category.collection.map(collection => {
        const tile = createElem('a', tilesHolder, {
          class: `tile ${(collection.highlight && collection.highlight === true) ? 'highlight' : ''}`,
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
        
        console.log(coverImage.file);

        const tileImage = createElem('img', tile, {
          style: `aspect-ratio: ${coverImage.aspectRatio}`
        });


        createImage(tileImage, `${imagesRoot}/${imagesFolder}/${collection.id}/default/${coverImage.file}.jpg`, true);

        const tileTitle = createElem('h3', tile);
        tileTitle.innerText = `${collection.name}`;

        // tile.onclick = function() {
        //   toPopin(tile, collection, mainContainer, category.type);
        // }

      });
    break;

    case 'videos':
      categoryTitle = createElem('h2', categorySection, {
        class: 'section-title'
      });

      categoryTitle.innerHTML = `<span>${category.name}</span>`;

      tilesHolder = createElem('div', categorySection, {
        class: 'tiles-holder'
      });

      category.collection.map(collection => {
        const tile = createElem('div', tilesHolder, {
          class:`tile ${collection.type} ${(collection.highlight && collection.highlight === true) ? 'highlight' : ''}`,
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

        const tileBtn = createElem('button', tile)
        tileBtn.innerText = 'Ù';
        tileBtn.dataset.href = `${collection.url}`;

        tileBtn.onclick = function() {
          toPopin(tile, collection, mainContainer, category.type);
        }
      });
    break;
  }
}

const generatePageAgenda = (category, mainContainer) => {
  const agendaHolder = createElem('div', mainContainer, {
    class:'agenda-holder',
    style: `background-image: url('${imagesRoot}/${imagesFolder}/backgrounds/${category.background}.jpg')`
  });

  const agendaContainer = createElem('div', agendaHolder, {
    class:'agenda-container'
  });

  const agendaList = createElem('ul', agendaContainer, {
    class: 'events-list'
  })

  category.collection.map(eventDate => {
    eventItem = createElem('li', agendaList);

    eventName = createElem('span', eventItem, {
      class:'name'
    })
    eventName.innerText = `${eventDate.name}`;

    eventLocation = createElem('span', eventItem, {
      class:'location'
    })
    eventLocation.innerText = `${eventDate.location}`;

    eventDay = createElem('span', eventItem, {
      class:'date'
    })
    eventDay.innerText = `${eventDate.day}`;

  })
}


const generateContent = (content, hash, isHomepage, pageChange) => {
  console.log('generating content');

  const mainContainer = document.querySelector('#main-container');

  setAttributes(mainContainer, {
    class: viewPort
  });

  emptyContainer(mainContainer);

  console.log(mainContainer.innerHTML.length > 0);

    content.categories.map((category, index) => {

      if(isHomepage) {
        if(category.onHome === true) {
          generateSection(category, mainContainer, content, hash);
        }
   
        if(index === content.categories.length - 1) {
          console.log(`autoscroll to ${hash}`);
          setTimeout(function() {
            scrollToElem(`#${hash}`);
          }, transitionSpeed * 2);
        }
      }
      
      else if(category.type === "photos") {
        const splitHash = hash.split('/');

        if(category.id === splitHash[0]) {

          category.collection.map(collection => {
            if(collection.id === splitHash[1]) {
              generatePageGallery(collection, mainContainer, category.type);
            }
          });
        }
      }

      else if(category.type === "agenda") {
        generatePageAgenda(category, mainContainer);
      }


    });

}