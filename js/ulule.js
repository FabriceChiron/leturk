var showUlule = (window.localStorage.getItem('showUlule') !== null) ? window.localStorage.getItem('showUlule') : "showPopin";

const showUluleElem = (showElem) => {

  console.log()

  switch (showElem) {
    case "showPopin":
      document.querySelector(`#ulule`).classList.add('show');
      document.querySelector(`#ulule-strip`).classList.remove('show');
    break;

    case "showStrip":
      document.querySelector(`#ulule`).classList.remove('show');
      document.querySelector(`#ulule-strip`).classList.add('show');
    break;

    case "showNothing":
      document.querySelector(`#ulule`).classList.remove('show');
      document.querySelector(`#ulule-strip`).classList.remove('show');
    break;
  }

  window.localStorage.setItem('showUlule', showElem);
}

showUluleElem(showUlule);

document.querySelector("#close-ulule").onclick = () => {
  showUluleElem('showStrip');
}

document.querySelector("#ulule-strip").onclick = () => {
  showUluleElem('showPopin');
}