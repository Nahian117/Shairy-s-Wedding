const API_URL =
  "https://script.google.com/macros/s/AKfycbzpuUJnvo6PlTS-oAfcUWVFKkS3UgLesmYSDXaJC6TZUjYsQugwbG58VZWjm4CS_r6Y/exec";

let category = "holud";
let items = [];
let index = 0;

let MEDIA = {
  holud: [],
  wedding: []
};

const grid = document.getElementById("gallery-grid");

const lightbox =
  document.getElementById("lightbox");

const content =
  document.getElementById("lightbox-content");

const caption =
  document.getElementById("caption");


// ==========================================
// LOAD PHOTOS FROM GOOGLE DRIVE
// ==========================================

function loadDrivePhotos() {

  return new Promise((resolve, reject) => {

    const callbackName =
      "shairyWedding_" + Date.now();


    window[callbackName] = function(data) {

      try {

        MEDIA.holud =
          data.wedding?.holud || [];

        MEDIA.wedding =
          data.wedding?.wedding || [];


        delete window[callbackName];


        const oldScript =
          document.getElementById(
            "shairy-drive-api"
          );

        if (oldScript) {
          oldScript.remove();
        }


        resolve();

      } catch (error) {

        reject(error);

      }
    };


    const script =
      document.createElement("script");

    script.id =
      "shairy-drive-api";


    script.src =
      API_URL +
      "?callback=" +
      encodeURIComponent(callbackName);


    script.onerror = function() {

      delete window[callbackName];

      reject(
        new Error(
          "Google Drive connection failed."
        )
      );

    };


    document.body.appendChild(script);

  });

}


// ==========================================
// DRIVE IMAGE URL
// ==========================================

function getImageURL(file) {

  return (
    "https://drive.google.com/thumbnail" +
    "?id=" +
    encodeURIComponent(file.id) +
    "&sz=w1600"
  );

}


// ==========================================
// RENDER PHOTOS
// ==========================================

function renderPhotos() {

  items =
    MEDIA[category] || [];


  grid.innerHTML = "";


  if (!items.length) {

    grid.innerHTML =
      `
      <div class="empty-message">
        No photos found.
      </div>
      `;

    return;

  }


  items.forEach((file, i) => {

    const card =
      document.createElement("article");

    card.className =
      "photo";


    const img =
      document.createElement("img");


    img.loading =
      "lazy";


    img.src =
      getImageURL(file);


    img.alt =
      file.name;


    const label =
      document.createElement("span");

    label.textContent =
      file.name;


    card.appendChild(img);

    card.appendChild(label);


    card.onclick =
      () => openPhoto(i);


    grid.appendChild(card);

  });

}


// ==========================================
// OPEN FULL PHOTO
// ==========================================

function openPhoto(i) {

  index = i;


  const file =
    items[index];


  content.innerHTML = "";


  const img =
    document.createElement("img");


  img.src =
    getImageURL(file);


  img.alt =
    file.name;


  content.appendChild(img);


  caption.textContent =
    file.name;


  showLightbox();

}


// ==========================================
// LIGHTBOX
// ==========================================

function showLightbox() {

  lightbox.classList.add(
    "open"
  );


  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  document.getElementById(
    "prev"
  ).style.display = "";


  document.getElementById(
    "next"
  ).style.display = "";

}


function closeLightbox() {

  lightbox.classList.remove(
    "open"
  );


  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  content.innerHTML =
    "";


  document.body.style.overflow =
    "";

}


// ==========================================
// NEXT / PREVIOUS
// ==========================================

function move(dir) {

  if (!items.length)
    return;


  index =
    (
      index +
      dir +
      items.length
    ) %
    items.length;


  openPhoto(index);

}


// ==========================================
// CATEGORY BUTTONS
// ==========================================

document
  .querySelectorAll(".tab")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".tab")
        .forEach(x =>
          x.classList.remove(
            "active"
          )
        );


      button.classList.add(
        "active"
      );


      category =
        button.dataset.category;


      renderPhotos();

    };

  });


// ==========================================
// LIGHTBOX CONTROLS
// ==========================================

document.getElementById(
  "close"
).onclick =
  closeLightbox;


document.getElementById(
  "prev"
).onclick =
  () => move(-1);


document.getElementById(
  "next"
).onclick =
  () => move(1);


lightbox.onclick =
  event => {

    if (
      event.target === lightbox
    ) {

      closeLightbox();

    }

  };


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeLightbox();

    }


    if (
      event.key === "ArrowLeft" &&
      lightbox.classList.contains(
        "open"
      )
    ) {

      move(-1);

    }


    if (
      event.key === "ArrowRight" &&
      lightbox.classList.contains(
        "open"
      )
    ) {

      move(1);

    }

  }
);


// ==========================================
// START
// ==========================================

async function startWebsite() {

  try {

    await loadDrivePhotos();

    renderPhotos();

  }

  catch (error) {

    console.error(error);


    grid.innerHTML =
      `
      <div class="empty-message">
        Unable to load photos.
        Please refresh the page.
      </div>
      `;

  }

  finally {

    const loader =
      document.getElementById(
        "loader"
      );


    if (loader) {

      setTimeout(() => {

        loader.classList.add(
          "hide"
        );

      }, 300);

    }

  }

}


startWebsite();
