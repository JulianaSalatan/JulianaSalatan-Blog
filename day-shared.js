/* day-shared.js */

// Navigation function
function nav(e, url, label) {
  if (e) e.preventDefault();
  navigateTo(url, label);
}

// Zoom photo function
function zoomPhoto(emoji, title, desc, imgSrc) {
  const z = document.getElementById('photo-zoom');
  if (!z) return;
  
  const oldImg = z.querySelector('.zoom-img');
  if (oldImg) oldImg.remove();
  
  const img = document.createElement('img');
  img.src = imgSrc;
  img.className = 'zoom-img';
  img.style.cssText = 'max-width:80vw;max-height:60vh;border-radius:12px;border:4px solid white;box-shadow:0 0 30px rgba(0,0,0,0.5);';
  
  document.getElementById('pz-emoji').textContent = emoji;
  document.getElementById('pz-title').textContent = title;
  document.getElementById('pz-desc').textContent = desc;
  
  const emojiEl = document.getElementById('pz-emoji');
  emojiEl.parentNode.insertBefore(img, emojiEl.nextSibling);
  
  z.classList.add('open');
  z.style.display = 'flex';
}

// ===== CAPTIONS =====
// Format: { 'day-photoNumber': 'Your caption here' }
// Leave out any photo you don't want a caption on
const PHOTO_CAPTIONS = {
  'day1-photo1':  'Our first glimpse of Rizal Park',
  'day1-photo4':  'Lezgo maaar!',
  'day1-photo6':  'Manila Cathedral',
  'day1-photo12': 'SM MOA at sunset — what a view!',


  'day2-photo1':  'Hytec Power Inc. — where the real engineering happens',
  'day2-photo4':  'We had our orientation here and got to see the different departments',
  'day2-photo6':  '2 players robotic game',
  'day2-photo7':  'Magnetic Organs',
  'day2-photo8':  'Blackboard ft. touch screen',
  'day2-photo10':  'The OpenText Philippines office floor',
  'day2-photo12':  'Our batch listening to the OpenText talk',
  'day2-photo15':  'Some of the codes used in the first system of OpenText',


  'day3-photo2':  'Top Peg Animation Studio',
  'day3-photo3':  'We saw actual production in progress!',
  'day3-photo6':  'Tried their drawing equipment and it was so hard — salute to all animators out there!',
  'day3-photo7':  'Finished the drawing and it looked like a 5-year-old did it ',
  'day3-photo8':  'Final product of our drawing session which colored by JB. Not bad for first-timers, right?',
  'day3-photo9':  'The inspiration :) ',
  'day3-photo10':  'Next company site is Teleperformance ',
  'day3-photo11':  'Teleperformance — bigger than we expected',
  'day3-photo12':  'Selfie with their staff — they were so nice and welcoming!',
  'day3-photo15':  'Got some cool freebies from them too.',

  
  'day4-photo1':  'The MMDA Command Center',
  'day4-photo2':  'We all went quiet for a second :P',
  'day4-photo3':  'Walls of CCTV screens — just like in the movies',
  'day4-photo6':  'W the Bus B gurlsss!',
  'day4-photo7':  'Microsourcing Philippines!',
  'day4-photo8':  'Got some JCO donuts from them!',
  'day4-photo10': 'Yay, alcapone!!!',


  'day5-photo1':  'Tagaytay, lezgoo!',
  'day5-photo2':  '50? nope, higher!',
  'day5-photo3':  'People\'s Park in the Sky — cold, windy, and worth it',
  'day5-photo5':  'Extra extra',
  'day5-photo7':  'Suncreen is a must for the next destination.',
  'day5-photo10':  'MEH.',
  'day5-photo11': 'The not so expensive ice cream',
  'day5-photo12':  'Thanks to the sponsors!',
  'day5-photo13':  'Sky Ranch Ferris wheel',
  'day5-photo15':  'Groot and the two baby yoda ',
  'day5-photo17':  'FO!! FO!!',
  'day5-photo18':  'Ending our funtime with the express train',


  'day6-photo1': 'La Trinidad Strawberry Farm 🍓 first stop in Baguio!',
  'day6-photo2': 'Konishiwa',
  'day6-photo4': 'Thanks sir J',
  'day6-photo5': 'The Mansion',
  'day6-photo7': 'PMA',
  'day6-photo9': 'Hahahahahahahah',
  'day6-photo14':'Mines View Park',
  'day6-photo18':'Elevator shot',
  'day6-photo19':'Pregnant since 1st year',
  'day6-photo20':'Going to night market',
  'day6-photo22':'Going back after we secured the UNO cards',
  'day6-photo23':'1 game para di mahilak si mula',

  
  'day7-photo1': 'Sunkissed selfie!!!',
  'day7-photo2': 'Where\'s the umbrella?!?!',
  'day7-photo3': 'Hike going to SM Baguio. So fun :>',
  'day7-photo4': 'Went Back to DJM Dormitory',
  'day7-photo5': 'UNO before going back to ZC huhu'
};

function getCaption(dayNum, photoIndex) {
  return PHOTO_CAPTIONS[`day${dayNum}-photo${photoIndex}`] || '';
}

// ===== GALLERY FUNCTIONS =====
function loadGallery(dayNum, totalPhotos, folder = 'images') {
  const galleryContainer = document.getElementById(`gallery-day${dayNum}`);
  if (!galleryContainer) return;
  
  galleryContainer.innerHTML = '';
  const previewCount = Math.min(totalPhotos, 8);
  
  for (let i = 1; i <= previewCount; i++) {
    // CHANGE THIS LINE: .jpg to .jpeg
    const imgPath = `${folder}/day${dayNum}-photo${i}.jpeg`;
    const galleryItem = createGalleryItem(imgPath, i, dayNum);
    galleryContainer.appendChild(galleryItem);
  }
  
  if (totalPhotos > previewCount) {
    const moreItem = document.createElement('div');
    moreItem.className = 'gallery-item';
    moreItem.style.cssText = 'background: var(--ink); display: flex; align-items: center; justify-content: center; flex-direction: column; cursor: pointer;';
    moreItem.innerHTML = `
      <div style="font-size: 3rem; color: var(--yellow);">📸</div>
      <div style="color: white; font-family: var(--font-display); margin-top: 0.5rem;">+${totalPhotos - previewCount} more</div>
      <div style="color: rgba(255,255,255,0.6); font-family: var(--font-sketch); font-size: 0.7rem;">Click to view all</div>
    `;
    moreItem.onclick = () => openFullGallery(dayNum);
    galleryContainer.appendChild(moreItem);
  }
}

function createGalleryItem(imgPath, index, dayNum) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  
  const img = document.createElement('img');
  img.src = imgPath;
  img.alt = `Day ${dayNum} Photo ${index}`;
  img.loading = 'lazy';
  
  img.onerror = () => {
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23e63946" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpath d="M21 15l-5-4-3 3-4-4-6 6"%3E%3C/path%3E%3C/svg%3E';
    img.style.objectFit = 'contain';
    img.style.padding = '2rem';
  };
  
  const caption = getCaption(dayNum, index);
  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.textContent = caption || `Photo ${index}`;

  div.appendChild(img);
  div.appendChild(overlay);

  // Show caption gradient badge on thumbnail if caption exists
  if (caption) {
    const badge = document.createElement('div');
    badge.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.72));color:#fff;font-family:var(--font-sketch);font-size:0.72rem;padding:1.2rem 0.6rem 0.5rem;pointer-events:none;border-radius:0 0 10px 10px;line-height:1.3;';
    badge.textContent = caption;
    div.style.position = 'relative';
    div.appendChild(badge);
  }
  
  div.onclick = () => {
    // Populate currentLightboxImages for this day before opening lightbox
    const total = getTotalPhotosForDay(dayNum);
    currentLightboxImages = [];
    for (let i = 1; i <= total; i++) {
      currentLightboxImages.push(`images/day${dayNum}-photo${i}.jpeg`);
    }
    openLightbox(dayNum, index - 1);
  };
  
  return div;
}

let currentLightboxImages = [];

function openFullGallery(dayNum) {
  const totalPhotos = getTotalPhotosForDay(dayNum);
  currentLightboxImages = [];
  
  for (let i = 1; i <= totalPhotos; i++) {
    // CHANGE THIS LINE: .jpg to .jpeg
    currentLightboxImages.push(`images/day${dayNum}-photo${i}.jpeg`);
  }
  
  openLightbox(dayNum, 0);
}

function openLightbox(dayNum, startIndex) {
  const existing = document.getElementById('full-lightbox');
  if (existing) existing.remove();
  
  const lightbox = document.createElement('div');
  lightbox.id = 'full-lightbox';
  lightbox.className = 'lightbox-gallery';
  
  lightbox.innerHTML = `
    <div class="lightbox-header">
      <div style="font-family: var(--font-display);">Day ${dayNum} Gallery - ${currentLightboxImages.length} Photos</div>
      <button class="lightbox-close" style="cursor:none;" onclick="document.getElementById('full-lightbox').classList.remove('active')">✕ Close</button>
    </div>
    <div class="lightbox-grid" id="lightbox-grid"></div>
  `;
  
  document.body.appendChild(lightbox);
  
  const grid = lightbox.querySelector('#lightbox-grid');
  
  currentLightboxImages.forEach((imgPath, idx) => {
    const item = document.createElement('div');
    item.className = 'lightbox-item';
    item.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.4rem;';

    const img = document.createElement('img');
    img.src = imgPath;
    img.alt = `Photo ${idx + 1}`;
    img.loading = 'lazy';

    img.onerror = () => {
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="%23e63946" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpath d="M21 15l-5-4-3 3-4-4-6 6"%3E%3C/path%3E%3C/svg%3E';
      img.style.objectFit = 'contain';
      img.style.padding = '3rem';
    };

    item.appendChild(img);

    // Add caption if one exists for this photo
    const caption = getCaption(dayNum, idx + 1);
    if (caption) {
      const cap = document.createElement('div');
      cap.style.cssText = 'font-family:var(--font-sketch);font-size:0.78rem;color:rgba(255,255,255,0.75);text-align:center;padding:0.25rem 0.5rem;max-width:260px;line-height:1.4;';
      cap.textContent = caption;
      item.appendChild(cap);
    }

    grid.appendChild(item);
  });
  
  lightbox.classList.add('active');

  // Apply custom cursor & ripple to close button
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn && typeof addRipple === 'function') addRipple(closeBtn);

  // Ensure custom cursor elements are above the lightbox
  ['cursor','cursor-ring'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.zIndex = '99999';
  });
  
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
}

function getTotalPhotosForDay(dayNum) {
  const photoCounts = {
    1: 12,
    2: 15,
    3: 15,
    4: 10,
    5: 18,
    6: 23,
    7: 5,
    67: 28
  };
  return photoCounts[dayNum] || 0;
}

function initGalleries() {
  loadGallery(1, 12);
  loadGallery(2, 15);
  loadGallery(3, 15);
  loadGallery(4, 10);
  loadGallery(5, 18);
  loadGallery(6, 23);
  loadGallery(7, 5);
}

// ===== PRELOAD CODE (ADD THIS SECTION) =====
function preloadImages(dayNum, totalPhotos) {
  for (let i = 1; i <= totalPhotos; i++) {
    const img = new Image();
    // CHANGE THIS LINE: .jpg to .jpeg
    img.src = `images/day${dayNum}-photo${i}.jpeg`;
  }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize galleries if they exist on this page
  if (document.querySelector('.photo-grid-masonry')) {
    initGalleries();
  }
  
  // Preload current day's images
  const currentPage = window.location.pathname;
  let currentDay = null;
  
  if (currentPage.includes('day1')) currentDay = 1;
  else if (currentPage.includes('day2')) currentDay = 2;
  else if (currentPage.includes('day3')) currentDay = 3;
  else if (currentPage.includes('day4')) currentDay = 4;
  else if (currentPage.includes('day5')) currentDay = 5;
  else if (currentPage.includes('day67')) {
    preloadImages(6, 23);
    preloadImages(7, 5);
  }
  
  if (currentDay) {
    const counts = {1:12, 2:15, 3:15, 4:10, 5:18};
    if (counts[currentDay]) {
      preloadImages(currentDay, counts[currentDay]);
    }
  }
  
  // Preload on navigation button hover
  const navButtons = document.querySelectorAll('.day-nav-row .btn');
  navButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const onclickAttr = btn.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes('day')) {
        const dayMatch = onclickAttr.match(/day(\d+)/);
        if (dayMatch) {
          const dayNum = parseInt(dayMatch[1]);
          const counts = {1:12, 2:15, 3:15, 4:10, 5:18, 6:23, 7:5};
          if (counts[dayNum]) {
            preloadImages(dayNum, counts[dayNum]);
          }
        }
      }
    });
  });
});

// ===== EXISTING initDayPage FUNCTION =====
function initDayPage(dayId) {
  // Mark as visited
  setTimeout(() => {
    if (!STATE.visited.includes(dayId)) {
      unlockAchievement(dayId);
    }
    launchPetals(4);
  }, 800);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const pages = ['day1','day2','day3','day4','day5','day67'];
    const idx = pages.indexOf(dayId);
    if (e.key === 'ArrowRight' && idx < pages.length-1) navigateTo(pages[idx+1]+'.html','→');
    if (e.key === 'ArrowLeft'  && idx > 0)              navigateTo(pages[idx-1]+'.html','←');
    if (e.key === 'Escape')                              navigateTo('index.html','🏠');
    if (e.key === 'h' || e.key === 'H')                 navigateTo('index.html','🏠');
    if (e.key === 'p' || e.key === 'P') {
      const zoom = document.getElementById('photo-zoom');
      if (zoom) zoom.classList.remove('open');
    }
  });

  // Tilt on timeline cards
  document.querySelectorAll('.tl-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left)/r.width - 0.5;
      const cy = (e.clientY - r.top)/r.height - 0.5;
      card.style.transform = `translate(-2px,-2px) rotateY(${cx*6}deg) rotateX(${-cy*4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Ripple on buttons
  document.querySelectorAll('.btn').forEach(addRipple);
}