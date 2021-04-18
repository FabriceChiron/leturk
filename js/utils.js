let imagesRoot, imagesFolder; 

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

const generateMenuLink = (group, item, path) => {
  console.log(group.type);
  let menuLink = createElem('a', item, {
    href: `${(group.type === 'link') ? `${group.url}` : `#${path}`}`
  });
  
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

const generateLogoLink = (container, category, target) => {
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

const createImage = (imgElem, imgSrc, toBackground) => {
  // console.log(imgElem, imgSrc);
  const newImg = new Image();

  const loaded = () => {
    getAspectRatio(imgElem);
  }

  newImg.onload = function() {
    imgElem.src = this.src;

    if(toBackground) {
      setAttributes(imgElem.parentElement, {
        style: `background-image: url(${imgSrc})`
      });

      // imgElem.parentElement.style += `background-image: url(${imgSrc})`;

      imgElem.parentElement.classList.add('bg-img');
    }
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

const getAspectRatio = (img) => {
  let imgWidth = img.naturalWidth;
  let imgHeight = img.naturalHeight;
  let ratio;

  if(imgWidth > imgHeight) {
    ratio = 'landscape';
  }
  else if (imgHeight > imgWidth) {
    ratio = 'portrait';
  }
  else {
    ratio = 'square';
  }

  img.parentElement.classList.add(ratio);
  img.parentElement.dataset.aspectRatio = `${imgWidth} / ${imgHeight}`;
  img.parentElement.dataset.naturalWidth = `${imgWidth}`;
  img.parentElement.dataset.naturalHeight = `${imgHeight}`;
  img.style = ` --aspect-ratio: ${imgWidth} / ${imgHeight}`;

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

  console.log(originElem.previousSibling);
  console.log(originElem.nextSibling);

  const popinContainer = document.querySelector('#media-popin-container') || createElem('div', mediaPopin, {
    id: "media-popin-container"
  });

  // if(popinToolbar.innerHTML.length === 0) {
    if(type === 'photos') {
      const btnZoomImage = createElem('button', popinToolbar, {
        id: 'zoom-image'
      })
      btnZoomImage.innerText = 'Ñ';
    }

    const btnClosePopin = createElem('button', popinToolbar, {
      id: 'close-popin'
    })
    btnClosePopin.innerText = 'Î';
  // }


  btnClosePopin.onclick = function() {
    closePopin(mediaPopin, popinContainer);
  }

  return {mediaPopin, popinToolbar, popinContainer};
}

const insertContentInPopin = (elemData, type, container, originElem) => {

  let popinContent;

  switch(type) {
    case 'videos':
      popinContent = createElem('iframe', container, {
        src: elemData.url,
        webkitallowfullscreen: "",
        mozallowfullscreen: "",
        allowfullscreen: "",
        frameborder: "0"
      });
    break;

    case 'photos':
      popinContent = createElem('div', container, {
        class: `${type}`
      });
      const popinImage = createElem('img', popinContent);

      createImage(popinImage, originElem.querySelector('img').src.replace('default', 'full'));
    break;
  }
}

const toPopin = (originElem, elemData, container, type) => {

  const popin = getMediaPopin(originElem, elemData, container, type);

  insertContentInPopin(elemData, type, popin.popinContainer, originElem);

  toggleScroll(pageScroller, 'disable');

  if(!popin.mediaPopin.classList.contains('open')){
    setTimeout(function() {
      popin.mediaPopin.classList.add('open');
    }, transitionSpeed);
  }

}


const scrollToElem = (hash) => {
  if(arrayHomePage.includes(hash)) {

    if(hash.charAt(0) !== '#') {
      hash = `#${hash}`;
    }

    $(function() {
      var scroller = (viewPort === "mobile") ? '#main-container' : 'html, body';
      $(scroller).animate({
        scrollTop: $((hash === '#') ? 'body' : hash).offset().top
      }, 250, function() {
        window.location.hash = hash;
      });

    });
    
  }
}


const dirtyHack = (elem, event) => {
  let hash = elem.hash;

  if(arrayHomePage.includes(hash)) {
    event.preventDefault();

    scrollToElem(hash);
  }
  else {
    return true;
  }
}