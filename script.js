let category="holud", items=[], index=0;
const grid=document.getElementById("gallery-grid"), videoGrid=document.getElementById("video-grid");
const lightbox=document.getElementById("lightbox"), content=document.getElementById("lightbox-content"), caption=document.getElementById("caption");
function pathJoin(folder,file){return "media/"+folder+"/"+encodeURIComponent(file).replace(/%2F/g,"/");}
function renderPhotos(){
  items=MEDIA[category]||[]; grid.innerHTML="";
  items.forEach((name,i)=>{
    const card=document.createElement("article"); card.className="photo";
    const img=document.createElement("img"); img.loading="lazy"; img.src=pathJoin(category,name); img.alt=name;
    const label=document.createElement("span"); label.textContent=name;
    card.append(img,label); card.onclick=()=>openPhoto(i); grid.append(card);
  });
}
function renderVideos(){
  videoGrid.innerHTML="";
  MEDIA.videos.forEach(name=>{
    const card=document.createElement("article"); card.className="video-card";
    card.innerHTML='<div class="video-cover"><div class="play">▶</div></div><div class="video-name"></div>';
    card.querySelector(".video-name").textContent=name;
    card.onclick=()=>openVideo(name); videoGrid.append(card);
  });
}
function openPhoto(i){index=i; content.innerHTML=""; const img=document.createElement("img"); img.src=pathJoin(category,items[i]); img.alt=items[i]; content.append(img); caption.textContent=items[i]; showLightbox();}
function openVideo(name){content.innerHTML="";const v=document.createElement("video");v.controls=true;v.autoplay=true;v.playsInline=true;v.src=pathJoin("videos",name);content.append(v);caption.textContent=name;showLightbox(true);}
function showLightbox(video=false){lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";document.getElementById("prev").style.display=video?"none":"";document.getElementById("next").style.display=video?"none":""}
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");content.innerHTML="";document.body.style.overflow=""}
function move(dir){if(!items.length)return;index=(index+dir+items.length)%items.length;openPhoto(index)}
document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");category=btn.dataset.category;renderPhotos()});
document.getElementById("close").onclick=closeLightbox;
document.getElementById("prev").onclick=()=>move(-1); document.getElementById("next").onclick=()=>move(1);
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft"&&lightbox.classList.contains("open"))move(-1);if(e.key==="ArrowRight"&&lightbox.classList.contains("open"))move(1)});
renderPhotos();renderVideos();setTimeout(()=>document.getElementById("loader").classList.add("hide"),450);
