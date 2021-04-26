let imagesRoot, imagesFolder;

const imageFormat = () => {
  if(browserDetect().includes('safari') || browserDetect().includes('explorer')) {
    return 'jpg';
  }
  else {
    return 'webp';
  }
}

if(window.location.pathname.indexOf('/wip') === -1 || window.location.hostname === 'localhost'){
  imagesRoot = 'images';
  imagesFolder = 'photos';
}
else {
  imagesRoot = '../images';
  imagesFolder = 'tinified';
}  

async function getData(url) {
  const response = await fetch(url);

  return response.json();
}

const styles = getComputedStyle(document.documentElement);
var transitionSpeed = parseFloat(styles.getPropertyValue('--transitionSpeed')) * 1000;


const setAttributes = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

const scrollOnStart = (check, viewPort) => {

  let targetElem = document.body;

  if(viewPort === 'desktop') {
    switch(check) {
      case true:
        targetElem.classList.add('no-scroll');
      break;

      case false:
        targetElem.classList.remove('no-scroll');
      break;
    }
  }

}

const toggleScroll = (scroller, toggle) => {
  switch(toggle) {
    case 'disable':
      currentScroll = scroller.scrollY || scroller.scrollTop;

      scroller.onscroll = function() {
          scroller.scrollTo(0, currentScroll);
      };
    break;

    case 'enable':
      handleScroll(scroller);
    break;
  }
}

const createElem = (el, ctnr, attrs, where) => {
  const element = document.createElement(el);
  if(attrs) {
    setAttributes(element, attrs);
  }
  if(where && where === 'prepend') {
    ctnr.prepend(element);
  } else {
    ctnr.append(element);
  }
  return element;
}

const highLightLink = (elem, hash, path) => {
  if(hash.includes(path.replace('#',''))) {
    elem.classList.add('active');
  }
  else {
    elem.classList.remove('active');
  }
}

const toggleLinksHighLight = (hash) => {
  [...document.querySelectorAll('header a')].map(link => {
    highLightLink(link, hash, link.getAttribute('href'));
  })
}

const generateMenuLink = (group, item, path, hash) => {

  let menuLink = createElem('a', item, {
    href: `${(group.type === 'link') ? `${group.url}` : `#${path}`}`
  });
  
  highLightLink(menuLink, hash, path);

  if(group.type === 'link') {
    setAttributes(menuLink, {
      target: '_blank'
    });
  }

  if(arrayHomePage.includes(path)) {
    // menuLink.addEventListener("click", dirtyHack(menuLink));
    setAttributes(menuLink, {
      onclick: `dirtyHack(this, event)`
    });
  }

  menuLink.innerText = `${group.name}`;
}

const generateLogoLink = (container, category, hash, target) => {
  const logoLink = createElem('a', container, {
    href: `#${(target !== undefined) ? `${target}` : ''}`,
    class: 'logo-link',
    onclick: `dirtyHack(this, event)`
  });

  const logoImg = createElem('img', logoLink, {
    src: `${imagesRoot}/logo/${category.source}`
  });

  if(target) {
    const logoSubTitle = createElem('h2', logoLink);
    logoSubTitle.innerHTML = category.subtitle;
  }
}

const toggleLoaded = (elem, loaded) => {
  if(loaded) {
    elem.classList.remove('loading');
    elem.classList.add('loaded');
  }
  else {
    elem.classList.add('loading');
  }
}

const createImage = (imgElem, imgSrc, toBackground, zoomButtons) => {
  // console.log(imgElem, imgSrc);

  const container = imgElem.parentElement;

  toggleLoaded(container);

  const newImg = new Image();

  const loaded = () => {
    setTimeout(function() {
      if(toBackground) {
        setAttributes(imgElem.parentElement, {
          style: `background-image: url(${imgSrc})`
        });
        // imgElem.parentElement.style += `background-image: url(${imgSrc})`;

        imgElem.parentElement.classList.add('bg-img');
      }
      getAspectRatio(imgElem, (zoomButtons) ? zoomButtons : null);
      toggleLoaded(container, true);
    });
  }

  newImg.onload = function() {
    imgElem.src = this.src;
  }
  newImg.onerror = function() {
    imgElem.src = this.src.replace('webp', 'jpg');
  }

  newImg.src = imgSrc;

  if (imgElem.complete) {
    loaded()
  } else {
    imgElem.addEventListener('load', loaded)
    imgElem.addEventListener('error', function() {
      alert('error')
    })
  }

}

const getAspectRatio = (img, zoomButtons) => {

  let imgWidth = img.naturalWidth;
  let imgHeight = img.naturalHeight;
  let imgInitialWidth = img.width;
  let imgInitialHeight = img.height;
  let ratio;


  let container = img.parentElement;

  if(imgWidth > imgHeight) {
    ratio = 'landscape';
  }
  else if (imgHeight > imgWidth) {
    ratio = 'portrait';
  }
  else {
    ratio = 'square';
  }

  container.classList.add(ratio);
  container.dataset.aspectRatio = `${imgWidth} / ${imgHeight}`;
  container.dataset.orientation = `${ratio}`;
  container.dataset.naturalWidth = `${imgWidth}`;
  container.dataset.naturalHeight = `${imgHeight}`;
  container.dataset.initialWidth = `${imgInitialWidth}`;
  container.dataset.initialHeight = `${imgInitialHeight}`;
  // container.style = `--max-width: ${imgWidth}px; --max-height: ${imgHeight}px;` 

  if(img.naturalWidth === 0) {
    setTimeout(function(){
      getAspectRatio(img, zoomButtons);
    }, 100);
  }

  else {
    if(zoomButtons) {
      img.style = ` --aspect-ratio: ${imgWidth} / ${imgHeight}; width: ${imgInitialWidth}px; height: ${imgInitialHeight};`;
      
      const imgWrapper = createElem('span', container, {
        class: `${(viewPort === 'desktop') ? 'dragscroll' : ''}`,
      });

      if(typeof dragscroll !== undefined) {
        dragscroll.reset();
      }

      imgWrapper.appendChild(img);

      enableZoom(container, imgWrapper, zoomButtons);
    }
  }

}

const getVideoThumbnail = (type, videoId, res = 'maxres') => {
  // 109320228
  let videoThumbnail;

  if(type === 'youtube') {
    videoThumbnail = `http://i.ytimg.com/vi/${videoId}/${res}default.jpg`;
  }

  if(type === 'vimeo') {

    // const data = await getData(`http://vimeo.com/api/v2/video/${videoId}.json`);

    // videoThumbnail = data[0].thumbnail_large;

    // console.log({ data })

    // videoThumbnail = fetch(`http://vimeo.com/api/v2/video/${videoId}.json`)
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data[0].thumbnail_large);
    //   return data[0].thumbnail_large;
    // });

    videoThumbnail = 'https://i.vimeocdn.com/video/493258720_640.jpg'
  }

  return videoThumbnail;
}

const emptyContainer = (container) => {
  container.innerHTML = '';
}

const closePopin = (mediaPopin, popinContainer) => {
  mediaPopin.classList.remove('open');

  popinContainer.classList.add('hide');

  toggleScroll(pageScroller, 'enable');

  setTimeout(function() {
    emptyContainer(popinContainer);
  }, transitionSpeed);
}

const getMediaPopin = (originElem, elemData, container, type) => {
  const mediaPopin = document.querySelector('#media-popin') || createElem('div', container, {
    id: 'media-popin'
  });

  const popinToolbar = document.querySelector('#media-popin .toolbar') || createElem('div', mediaPopin, {
    class: 'toolbar'
  });

  emptyContainer(popinToolbar);

  const popinContainer = document.querySelector('#media-popin-container') || createElem('div', mediaPopin, {
    id: "media-popin-container"
  });

  if(originElem.previousSibling) {
    const btnPrevious = createElem('button', popinToolbar, {
      class: 'btn-go previous'
    });

    btnPrevious.innerText = 'Ô';

    btnPrevious.onclick = () => {
      // emptyContainer(popinContainer);
      originElem.previousSibling.querySelector('button').click();
    }
  }
  if(originElem.nextSibling) {
    const btnNext = createElem('button', popinToolbar, {
      class: 'btn-go next'
    });

    btnNext.innerText = '×';

    btnNext.onclick = () => {
      originElem.nextSibling.querySelector('button').click();
    }
  }

  let zoomButtons;

  if(type === 'photos') {
    zoomButtons = createElem('div', popinToolbar, {
      id: 'zoom-buttons',
      class: `${viewPort}`
    });
    
    const btnZoomImageMinus = createElem('label', zoomButtons, {
      for: 'zoom-image'
    });
    btnZoomImageMinus.innerText = 'Å';

    const checkboxZoomImage = createElem('input', zoomButtons, {
      type: 'checkbox',
      id: 'zoom-image'
    });
    
    const btnZoomImagePlus = createElem('label', zoomButtons, {
      for: 'zoom-image'
    });
    btnZoomImagePlus.innerText = 'Â';
  }

  const btnClosePopin = createElem('button', popinToolbar, {
    id: 'close-popin'
  })
  btnClosePopin.innerText = 'Î';


  btnClosePopin.onclick = function() {
    closePopin(mediaPopin, popinContainer);
  }

  return {mediaPopin, popinToolbar, popinContainer, zoomButtons};
}


const zoomImage = (container, imgWrapper, image, value) => {
  container.classList.add('zoom');
  image.style = `width: ${value}px`;
  
  let userScroll = false;
 
  let scrollPosition = {
    x: (image.width - imgWrapper.offsetWidth) / 2,
    y: (image.height - imgWrapper.offsetHeight) / 2
  }
  
  imgWrapper.scrollTo(scrollPosition.x, scrollPosition.y);
}

const enableZoom = (container, imgWrapper, zoomButtons) => {
  console.log(container.dataset.orientation);
  const imgData = container.dataset;

  const image = imgWrapper.querySelector('img');

  const rangeWrapper = createElem('div', zoomButtons);

  zoomButtons.insertBefore(rangeWrapper, zoomButtons.querySelector('#zoom-image').nextSibling);

  const zoomRange = createElem('input', rangeWrapper, {
    type: 'range',
    step: '1',
    min: `${imgData.initialWidth}`,
    value: `${imgData.initialWidth}`,
    max: `${imgData.naturalWidth}`,
  });

  if(viewPort === 'desktop') {
    image.ondblclick = () => {
      if(zoomRange.value === zoomRange.max) {
        zoomRange.value = zoomRange.min;
      }
      else {
        zoomRange.value = zoomRange.max;
      }

      zoomImage(container, imgWrapper, image, zoomRange.value);
    }
  } 

  // window.onresize = () => {

  //   initViewPort();

  //   let imageClone = image.cloneNode();

  //   setAttributes(imageClone, {
  //     style: '',
  //     class: 'clone'
  //   })

  //   container.appendChild(imageClone);

  //   setTimeout(function() {
  //     container.dataset.initialWidth = `${imageClone.width}`;
  //     container.dataset.initialHeight = `${imageClone.height}`;

  //     zoomRange.min = `${parseInt(imageClone.width)}`;

  //     imageClone.remove();
  //     zoomImage(container, imgWrapper, image, zoomRange.value);
  //   }, 10);


  // }

  zoomRange.oninput = function() {
    zoomImage(container, imgWrapper, image, zoomRange.value);
  }
}

const checkPopinPhoto = () => {
  const popinOpen = document.querySelector('#media-popin.open');

  if(!!popinOpen) {
    const photoInPopin = popinOpen.querySelector('.photos');
    
    if(!!photoInPopin) {

      let imgToCheck = photoInPopin.querySelector('img');
      let wrapperImage = imgToCheck.parentElement;
      let imageClone = imgToCheck.cloneNode();

      let zoomRangeToCheck = popinOpen.querySelector('#zoom-buttons div input');

      setAttributes(imageClone, {
        style: '',
        class: 'clone'
      });

      photoInPopin.appendChild(imageClone);

      setTimeout(function() {
        photoInPopin.dataset.initialWidth = `${imageClone.width}`;
        photoInPopin.dataset.initialHeight = `${imageClone.height}`;

        zoomRangeToCheck.min = `${parseInt(imageClone.width)}`;

        imageClone.remove();
        zoomImage(photoInPopin, wrapperImage, imgToCheck, zoomRangeToCheck.value);
      }, 10);
    }
  }
}

const insertContentInPopin = (elemData, type, container, originElem, zoomButtons) => {

  let popinContent;

  switch(type) {
    case 'videos':
      popinContent = createElem('iframe', container, {
        src: elemData.url,
        webkitallowfullscreen: "",
        mozallowfullscreen: "",
        allowfullscreen: "",
        frameborder: "0",
        class: "loading"
      });
    break;

    case 'photos':
      popinContent = createElem('div', container, {
        class: `${type}`
      });

      const popinImage = createElem('img', popinContent);

      createImage(popinImage, originElem.querySelector('img').src.replace('default', 'full'), null, zoomButtons);
    break;
  }
}

const scrollToCenter = (elem, container) => {
  let scroller;
  
  if(viewPort === 'mobile') {
    scroller = document.querySelector('#main-container');

    
    if(isHomepage) {
      console.log(elem.offsetTop, elem.parentElement.parentElement.offsetTop);
      console.log(scroller.scrollTop);

      scroller.scroll({
        left: 0, 
        top: elem.offsetTop + elem.parentElement.parentElement.offsetTop - ((scroller.offsetHeight - elem.offsetHeight) / 2),
        behavior: 'smooth'
      });
    }

    else {
      scroller.scroll({
        left: 0, 
        top: elem.offsetTop - ((scroller.offsetHeight - elem.offsetHeight) / 2),
        behavior: 'smooth'
      });
    }
    // scroller = elem.parentElement;
    /*scroller.scrollTo(0, elem.offsetTop - ((window.innerHeight - elem.offsetheight) / 2) + 10);*/
  }

  else {
    if(isHomepage) {
      scroller = window;
      scroller.scroll({
        left: 0, 
        top: elem.offsetTop + elem.parentElement.parentElement.offsetTop - ((window.innerHeight - elem.offsetHeight) / 2),
        behavior: 'smooth'
      });
    }

    else {
      scroller = elem.parentElement;
      scroller.scroll({
        left: elem.offsetLeft - ((window.innerWidth - elem.offsetWidth) / 2) + 10, 
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}

const toPopin = (originElem, elemData, container, type) => {


  const popin = getMediaPopin(originElem, elemData, container, type);

  emptyContainer(popin.popinContainer);

  insertContentInPopin(elemData, type, popin.popinContainer, originElem, popin.zoomButtons);

  // toggleScroll(pageScroller, 'disable');

  if(!popin.mediaPopin.classList.contains('open')){
    setTimeout(function() {
      scrollToCenter(originElem, container);
      popin.mediaPopin.classList.add('open');
    }, transitionSpeed);
  } else {
    scrollToCenter(originElem, container);
  }

}


const scrollToElem = (hash) => {
  
  if(pageChange === true) {
    window.location.hash = hash;
  }

  if(arrayHomePage.includes(hash.replace('#',''))) {


    if(hash.charAt(0) !== '#') {
      hash = `#${hash}`;
    }
    
    $(function() {
      var scroller = (viewPort === "mobile") ? '#main-container' : 'html, body';

      var scrollAmount;

      if(viewPort === 'mobile') {
        scrollAmount = $((hash === '#') ? 'body' : hash).position().top;
      } else {
        scrollAmount = $((hash === '#') ? 'body' : hash).offset().top;
      }

      $(scroller).animate({
        scrollTop: scrollAmount
      }, 250, function() {
        window.location.hash = hash;
      });

    });

  }
}


const dirtyHack = (elem, event) => {
  let hash = elem.hash;

  if(arrayHomePage.includes(hash.replace('#',''))) {
    event.preventDefault();

    scrollToElem(hash);
  }
}