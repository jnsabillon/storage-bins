// Each bin: label and the things inside it (tag/key are unused leftovers).
// Items are placeholders — back-most card first, front-most (the one that shows content) last.
const bins = [
  {
    id: 'film', label: 'Film', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', cls: 'card-photo', photo: 'images/film/roll-01/10-group.jpg' },
      { c: '#ecece8', cls: 'card-photo', photo: 'images/film/roll-01/09-limo.jpg' },
      { c: '#f3f3f0', cls: 'card-photo', photo: 'images/film/roll-01/01-stairs.jpg' },
      { c: '#fbfbf9', html: '<b>Roll 01</b><small>03.29.2026</small>' },
    ],
    rolls: [
      {
        title: 'Roll 01',
        subtitle: 'wedding',
        date: 'March 29, 2026',
        photos: [
          { src: 'images/film/roll-01/01-stairs.jpg',     alt: 'Bride and groom embracing on an old stone staircase' },
          { src: 'images/film/roll-01/07-robe.jpg',       alt: 'Bride smiling in a white robe while bridesmaids laugh behind her' },
          { src: 'images/film/roll-01/03-flowers.jpg',    alt: 'Bride in a white robe holding a colorful bouquet' },
          { src: 'images/film/roll-01/08-overhead.jpg',   alt: 'Overhead view of the gown train being arranged by bridesmaids' },
          { src: 'images/film/roll-01/09-limo.jpg',       alt: 'Bride and bridesmaids taking a selfie in a limo' },
          { src: 'images/film/roll-01/10-group.jpg',      alt: 'The wedding party posed together on a sofa' },
          { src: 'images/film/roll-01/06-thumbs-up.jpg',  alt: 'Couple giving thumbs up, holding a pair of sandals' },
          { src: 'images/film/roll-01/02-hug.jpg',        alt: 'Two women hugging and laughing at the reception' },
          { src: 'images/film/roll-01/04-tequila.jpg',    alt: 'Guests sharing a bottle of tequila on the dance floor' },
          { src: 'images/film/roll-01/05-dancefloor.jpg', alt: 'Guests dancing under a purple stage light' },
        ],
      },
    ],
  },
  {
    id: 'books', label: 'Books', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', html: '' },
      { c: '#ecece8', html: '' },
      { c: '#f3f3f0', html: '' },
      { c: '#fbfbf9', html: '<b>Book title</b><span class="stars">★★★★☆</span><br><small>my review goes here…</small>' },
    ],
  },
  {
    id: 'trips', label: 'Trips', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', html: '' },
      { c: '#ecece8', html: '' },
      { c: '#f3f3f0', html: '' },
      { c: '#fbfbf9', cls: 'card-ticket', html: '<span>SFO</span><span class="go">✈</span><span>JFK</span><span style="margin-left:auto">11A</span>' },
    ],
  },
  {
    id: 'patterns', label: 'Crochet & Knit', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', html: '' },
      { c: '#ecece8', html: '' },
      { c: '#f3f3f0', html: '' },
      { c: '#fbfbf9', html: '<b>Pattern name</b><small>yarn · hook · skill level</small><div class="stitches"></div>' },
    ],
  },
  {
    id: 'flowers', label: 'Flowers', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', html: '' },
      { c: '#ecece8', html: '' },
      { c: '#f3f3f0', html: '' },
      { c: '#fbfbf9', html: '<svg class="bloom" viewBox="0 0 30 30"><g fill="#e2e2de" stroke="#6a6a67" stroke-width="1"><circle cx="15" cy="7" r="5"/><circle cx="23" cy="13" r="5"/><circle cx="20" cy="23" r="5"/><circle cx="10" cy="23" r="5"/><circle cx="7" cy="13" r="5"/></g><circle cx="15" cy="16" r="4" fill="#bdbdb8"/></svg><b>Flower name</b><small>where &amp; when found</small>' },
    ],
  },
  {
    id: 'horror', label: 'Horror Movies', tag: '#f1f1ee', key: '#d9d9d5',
    items: [
      { c: '#e4e4e0', html: '' },
      { c: '#ecece8', html: '' },
      { c: '#f3f3f0', html: '' },
      { c: '#fbfbf9', html: '<b>Movie title <small>· year</small></b><span class="stars">★★★★☆</span><br><small>my thoughts go here…</small>' },
    ],
  },
];

const cabinet = document.getElementById('cabinet');

cabinet.innerHTML = bins.map(b => `
  <div class="cell" id="bin-${b.id}" tabindex="0" role="button" aria-label="${b.label} bin"
       style="--tag:${b.tag};--key:${b.key}">
    <div class="interior"><div class="ink"></div><div class="hatch"></div></div>
    <div class="items">
      ${b.items.map((it, i) => `<div class="card ${it.cls || ''}" style="--i:${i};--c:${it.c}${it.photo ? `;background-image:url('${it.photo}')` : ''}">${it.html || ''}</div>`).join('')}
    </div>
    <svg class="side" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="0,28.57 100,0 100,71.43 0,100"/>
    </svg>
    <div class="front">
      <div class="pill"><span>${b.label}</span></div>
      <div class="handle"></div>
    </div>
  </div>`).join('');

// ---------- gallery (opens when a bin with rolls is clicked) ----------
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
let lastFocus = null;
let shots = [];       // photos of the roll currently in the lightbox
let shotIndex = 0;

function openGallery(bin) {
  lastFocus = document.activeElement;
  gallery.innerHTML = `
    <div class="gallery-panel" role="dialog" aria-modal="true" aria-label="${bin.label}">
      <button class="gallery-close" type="button"><span>close</span></button>
      <h2>${bin.label}</h2>
      ${bin.rolls.map((r, ri) => `
        <section class="roll">
          <header>
            <h3>${r.title}</h3>
            <p>${r.subtitle} · ${r.date}</p>
          </header>
          <div class="shots">
            ${r.photos.map((p, pi) => `
              <button class="shot" type="button" data-roll="${ri}" data-i="${pi}">
                <img src="${p.src}" alt="${p.alt}" loading="lazy">
              </button>`).join('')}
          </div>
        </section>`).join('')}
    </div>`;
  gallery.hidden = false;
  document.body.style.overflow = 'hidden';
  gallery.scrollTop = 0;
  gallery.querySelector('.gallery-close').focus();
  gallery._bin = bin;
}

function closeGallery() {
  gallery.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

function showShot(i) {
  shotIndex = (i + shots.length) % shots.length;
  const p = shots[shotIndex];
  lightbox.querySelector('img').src = p.src;
  lightbox.querySelector('img').alt = p.alt;
  lightbox.querySelector('figcaption').textContent = `${shotIndex + 1} / ${shots.length}`;
}

gallery.addEventListener('click', e => {
  const shot = e.target.closest('.shot');
  if (shot) {
    shots = gallery._bin.rolls[+shot.dataset.roll].photos;
    showShot(+shot.dataset.i);
    lightbox.hidden = false;
    return;
  }
  // the close button, or the blurred backdrop outside the panel
  if (e.target.closest('.gallery-close') || !e.target.closest('.gallery-panel')) closeGallery();
});

lightbox.addEventListener('click', e => {
  const half = e.clientX < window.innerWidth / 2;
  if (e.target.closest('img')) showShot(shotIndex + (half ? -1 : 1));
  else lightbox.hidden = true;
});

document.addEventListener('keydown', e => {
  if (!lightbox.hidden) {
    if (e.key === 'Escape') lightbox.hidden = true;
    if (e.key === 'ArrowLeft') showShot(shotIndex - 1);
    if (e.key === 'ArrowRight') showShot(shotIndex + 1);
  } else if (!gallery.hidden && e.key === 'Escape') {
    closeGallery();
  }
});

// ---------- bins ----------
// Mouse: hover opens, click opens the gallery. Touch: first tap opens, second tap opens the gallery.
const canHover = matchMedia('(hover: hover)').matches;
const cells = [...cabinet.querySelectorAll('.cell')];
cells.forEach((cell, i) => {
  const bin = bins[i];
  cell.addEventListener('click', e => {
    e.stopPropagation();
    const wasOpen = cell.classList.contains('is-open');
    if (bin.rolls && (canHover || wasOpen)) { openGallery(bin); return; }
    cells.forEach(c => c.classList.remove('is-open'));
    if (!wasOpen) cell.classList.add('is-open');
  });
  cell.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cell.click(); }
    if (e.key === 'Escape') cell.blur();
  });
});
document.addEventListener('click', () => cells.forEach(c => c.classList.remove('is-open')));
