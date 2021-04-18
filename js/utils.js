let imagesRoot, imagesFolder; 

if(window.location.pathname.indexOf('/wip') === -1 || window.location.hostname === 'localhost'){
  imagesRoot = 'images';
  imagesFolder = 'photos';
}
else {
  imagesRoot = './images';
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

const generateLogoLink = (container, category, target) => {
  const logoLink = createElem('a', container, {
    href: `#${(target !== undefined) ? `${target}` : ''}`,
    class: 'logo-link'
  });

  const logoImg = createElem('img', logoLink, {
    src: `${imagesRoot}/logo/${category.source}`
  });

  if(target) {
    const logoSubTitle = createElem('h2', logoLink);
    logoSubTitle.innerHTML = category.subtitle;
  }

  // if(target) {
  //   logoLink.onclick = function(event) {
  //     event.preventDefault();
      
  //     document.body.classList.add('to-content');

  //     setTimeout(function(){
  //       window.location.hash = target;
  //     }, 250);
  //   }
  // }
}

const createImage = (imgElem, imgSrc, toBackground) => {
  // console.log(imgElem, imgSrc);
  const newImg = new Image();

  newImg.onload = function() {
    imgElem.src = this.src;
    getAspectRatio(imgElem);

    if(toBackground) {
      setAttributes(imgElem.parentElement, {
        style: `background-image: url(${imgSrc})`
      });

      imgElem.parentElement.classList.add('bg-img');
    }
  }
  newImg.src = imgSrc;
}

const getAspectRatio = (img) => {
  let imgWidth = img.naturalWidth;
  let imgHeight = img.naturalHeight;
  let ratio;

  // console.table(imgWidth, imgHeight);

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

  const popinContainer = document.querySelector('#media-popin-container') || createElem('div', mediaPopin, {
    id: "media-popin-container"
  });

  const btnClosePopin = createElem('button', popinToolbar, {
    id: 'close-popin'
  });

  btnClosePopin.innerText = 'Î';

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
      setTimeout(function() {
        popinContent = createElem('div', container);
        const popinImage = createElem('img', popinContent);

        createImage(popinImage, originElem.querySelector('img').src.replace('default', 'full'), true);
      }, transitionSpeed * 2);

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

const dirtyHack = () => {
  $(function() {
    console.log($('#home .logo-link').length);

    $('#home .logo-link').on('click', function(event) {
      console.log('yo');
      event.preventDefault();

      var hash = this.hash;

      console.log(this.hash);

      var scroller = (viewPort === "mobile") ? '#main-container' : 'html, body';

      $(scroller).animate({
        scrollTop: $(hash).offset().top
      }, 250, function() {
        window.location.hash = hash;
      });

    })
  })
}