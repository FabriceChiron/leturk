generateContent = (content) => {
  const mainContainer = document.querySelector('#main-container');

  setAttributes(mainContainer, {
    class: viewPort
  })

  mainContainer.innerHTML = '';

  content.categories.map(category => {
    if(category.onHome === true) {
      const categorySection = createElem('section', mainContainer, {
        id: `${category.id}`
      }, (category.id === 'home') ? 'prepend' : null);

      if(category.id === 'home') {
        category.animation.map(animationItem => {
          createElem('div', categorySection, {
            class: `animate ${animationItem.animationClass}`,
            style: `background-image: url(images/photos/${category.id}/${animationItem.file}.jpg)`
          })
        })

        if(viewPort === 'desktop') {
          generateLogoLink(categorySection, category, content.categories[0].id);
        }
      }

      else {
        const categoryTitle = createElem('h2', categorySection);
        categoryTitle.innerText = category.name;
      }
    }
  })
}