const API_URL =
  "https://script.google.com/macros/s/AKfycbygMXPJeooMPIt9yx_97BpKDxdeTB70PDmD1ZUEB7qGRkoBYVekn1Ay1gLVjXolh_BD/exec";

let category = "holud";
let items = [];
let index = 0;

let MEDIA = {
  holud: [],
  wedding: [],
  videos: []
};

const grid = document.getElementById("gallery-grid");
const videoGrid = document.getElementById("video-grid");

const lightbox = document.getElementById("lightbox");
const content = document.getElementById("lightbox-content");
const caption = document.getElementById("caption");


// --------------------------------------------------
// LOAD GOOGLE DRIVE MEDIA
// --------------------------------------------------

function loadDriveMedia() {
  return new Promise((resolve, reject) => {

    const callbackName =
      "shairyWeddingCallback_" +
      Date.now();

    window[callbackName] = function(data) {

      try {
        MEDIA.holud =
          data.wedding?.holud || [];

        MEDIA.wedding =
          data.wedding?.wedding || [];

        MEDIA.videos =
          data.wedding?.videos || [];

        delete window[callbackName];

        const oldScript =
          document.getElementById(
            "shairy-drive-api"
          );

        if (oldScript) {
          oldScript.remove();
        }

        resolve(data);

      } catch (error) {
        reject(error);
      }
    };


    const script =
      document.createElement("script");

    script.id = "shairy-drive-api";

    script.src =
      API_URL +
      "?callback=" +
      encodeURIComponent(callbackName);

    script.onerror = function() {
      delete window[callbackName];

      const oldScript =
        document.getElementById(
          "shairy-drive-api"
        );

      if (oldScript) {
        oldScript.remove();
      }

      reject(
        new Error(
          "Unable to load Google Drive media."
        )
      );
    };

    document.body.appendChild(script);
  });
}


// --------------------------------------------------
// GOOGLE DRIVE IMAGE URLS
// --------------------------------------------------

function imageThumbnail(file) {

  return (
    "https://drive.google.com/thumbnail" +
    "?id=" +
    encodeURIComponent(file.id) +
    "&sz=w1600"
  );
}


function imageFull(file) {

  return (
    "https://drive.google.com/uc" +
    "?export=view&id=" +
    encodeURIComponent(file.id)
  );
}


// --------------------------------------------------
// PHOTO GALLERY
// --------------------------------------------------

function renderPhotos() {

  items = MEDIA[category] || [];

  grid.innerHTML = "";

  if (!items.length) {

    grid.innerHTML =
      '<p class="empty-message">' +
      "No photos found." +
      "</p>";

    return;
  }


  items.forEach((file, i) => {

    const card =
      document.createElement("article");

    card.className = "photo";


    const img =
      document.createElement("img");

    img.loading = "lazy";

    img.src =
      imageThumbnail(file);

    img.alt =
      file.name;


    img.onerror = function() {

      this.src =
        imageFull(file);
    };


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


// --------------------------------------------------
// VIDEO GALLERY
// --------------------------------------------------

function renderVideos() {

  videoGrid.innerHTML = "";

  const videos =
    MEDIA.videos || [];


  if (!videos.length) {

    videoGrid.innerHTML =
      '<p class="empty-message">' +
      "No videos found." +
      "</p>";

    return;
  }


  videos.forEach(file => {

    const card =
      document.createElement("article");

    card.className =
      "video-card";


    card.innerHTML = `
      <div class="video-cover">
        <div class="play">▶</div>
      </div>
      <div class="video-name"></div>
    `;


    card.querySelector(
      ".video-name"
    ).textContent =
      file.name;


    card.onclick =
      () => openVideo(file);


    videoGrid.appendChild(card);
  });
}


// --------------------------------------------------
// PHOTO LIGHTBOX
// --------------------------------------------------

function openPhoto(i) {

  index = i;

  const file =
    items[index];


  content.innerHTML = "";


  const img =
    document.createElement("img");

  img.src =
    imageFull(file);

  img.alt =
    file.name;


  content.appendChild(img);


  caption.textContent =
    file.name;


  showLightbox(false);
}


// --------------------------------------------------
// VIDEO LIGHTBOX
// --------------------------------------------------

function openVideo(file) {

  content.innerHTML = "";


  // Google Drive preview works better
  // for very large MP4 files than trying
  // to download the entire file.

  const iframe =
    document.createElement("iframe");

  iframe.src =
    file.driveUrl;

  iframe.allow =
    "autoplay";

  iframe.allowFullscreen =
    true;

  iframe.frameBorder =
    "0";

  iframe.style.width =
    "min(95vw, 1200px)";

  iframe.style.height =
    "min(80vh, 700px)";

  iframe.style.border =
    "0";


  content.appendChild(iframe);


  caption.textContent =
    file.name;


  showLightbox(true);
}


// --------------------------------------------------
// LIGHTBOX
// --------------------------------------------------

function showLightbox(video = false) {

  lightbox.classList.add("open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";


  document.getElementById(
    "prev"
  ).style.display =
    video ? "none" : "";


  document.getElementById(
    "next"
  ).style.display =
    video ? "none" : "";
}


function closeLightbox() {

  lightbox.classList.remove(
    "open"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  content.innerHTML = "";

  document.body.style.overflow =
    "";
}


function move(dir) {

  if (!items.length) return;

  index =
    (index + dir + items.length) %
    items.length;

  openPhoto(index);
}


// --------------------------------------------------
// CATEGORY TABS
// --------------------------------------------------

document
  .querySelectorAll(".tab")
  .forEach(btn => {

    btn.onclick = () => {

      document
        .querySelectorAll(".tab")
        .forEach(x =>
          x.classList.remove(
            "active"
          )
        );


      btn.classList.add(
        "active"
      );


      category =
        btn.dataset.category;


      renderPhotos();
    };
  });


// --------------------------------------------------
// CONTROLS
// --------------------------------------------------

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
  e => {

    if (
      e.target === lightbox
    ) {
      closeLightbox();
    }
  };


document.addEventListener(
  "keydown",
  e => {

    if (
      e.key === "Escape"
    ) {
      closeLightbox();
    }


    if (
      e.key === "ArrowLeft" &&
      lightbox.classList.contains(
        "open"
      )
    ) {
      move(-1);
    }


    if (
      e.key === "ArrowRight" &&
      lightbox.classList.contains(
        "open"
      )
    ) {
      move(1);
    }
  }
);


// --------------------------------------------------
// START WEBSITE
// --------------------------------------------------

async function startWebsite() {

  try {

    await loadDriveMedia();

    renderPhotos();

    renderVideos();

  } catch (error) {

    console.error(
      "Google Drive error:",
      error
    );


    grid.innerHTML =
      '<p class="empty-message">' +
      "Unable to load wedding photos. " +
      "Please try again later." +
      "</p>";

  } finally {

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
