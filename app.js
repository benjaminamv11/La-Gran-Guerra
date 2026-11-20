/* =============================================
   PRIMERA GUERRA MUNDIAL - App.js
   Lógica de la línea de tiempo interactiva
   ============================================= */

// === CONFIG ===
const VIDEO_URL = ''; // Poner URL de YouTube, Google Drive o archivo local

// === SLIDE NAVIGATION ===
const TOTAL_SLIDES = 23;
let currentSlide = 1;

// Map: which slides show the timeline bar + their year
const TIMELINE_SLIDES = {
  4: 1914, 5: 1914, 6: 1914, 7: 1914,
  8: 1914, 9: 1914, 10: 1914,
  11: 1915,
  12: 1916,
  13: 1917, 14: 1917,
  15: 1918,
  16: 1919, 17: 1919
};

// Map: year -> first slide of that year
const YEAR_FIRST_SLIDE = {
  1914: 4,
  1915: 11,
  1916: 12,
  1917: 13,
  1918: 15,
  1919: 16
};

// Navigation flow (sequential order for prev/next)
const SLIDE_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
// Auxiliary slides not in main flow
const AUX_SLIDES = [20, 21, 22, 23];
// Slides sin barra inferior (portada + conceptos + protagonistas)
const NO_BAR_SLIDES = [1, 2, 3];

// === DOM ===
const slides = document.querySelectorAll('.slide');
const progressFill = document.getElementById('progress-bar-fill');
const slideCounter = document.getElementById('slideCounter');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const timelineBar = document.getElementById('timelineBar');
const timelineFill = document.getElementById('timelineFill');
const timelineYears = document.querySelectorAll('.timeline-year');

// === FUNCTIONS ===
function goSlide(n) {
  if (n < 1 || n > TOTAL_SLIDES) return;
  
  // Hide current
  const current = document.querySelector('.slide.active');
  if (current) current.classList.remove('active');
  
  // Show target
  const target = document.querySelector(`[data-slide="${n}"]`);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0; // reset scroll
  }
  
  currentSlide = n;
  updateUI();
}

function nextSlide() {
  const idx = SLIDE_ORDER.indexOf(currentSlide);
  if (idx !== -1 && idx < SLIDE_ORDER.length - 1) {
    goSlide(SLIDE_ORDER[idx + 1]);
  }
}

function prevSlide() {
  const idx = SLIDE_ORDER.indexOf(currentSlide);
  if (idx > 0) {
    goSlide(SLIDE_ORDER[idx - 1]);
  }
}

function updateUI() {
  // Progress bar
  const mainIdx = SLIDE_ORDER.indexOf(currentSlide);
  const progress = mainIdx !== -1 
    ? ((mainIdx) / (SLIDE_ORDER.length - 1)) * 100 
    : 100;
  progressFill.style.width = progress + '%';
  
  // Slide counter
  if (mainIdx !== -1) {
    slideCounter.textContent = `${mainIdx + 1} / ${SLIDE_ORDER.length}`;
  } else {
    slideCounter.textContent = '';
  }
  
  // Portada y diapositivas 2-3: sin barra inferior (llevan sus propios botones)
  document.body.classList.toggle('no-bottom-bar', NO_BAR_SLIDES.includes(currentSlide));

  // Prev/Next buttons
  const isAux = AUX_SLIDES.includes(currentSlide);
  if (isAux) {
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  } else {
    btnPrev.style.display = '';
    btnNext.style.display = '';
    btnPrev.disabled = (mainIdx <= 0);
    btnNext.disabled = (mainIdx >= SLIDE_ORDER.length - 1);
  }
  
  // Timeline bar
  const year = TIMELINE_SLIDES[currentSlide];
  if (year) {
    timelineBar.classList.add('visible');
    updateTimeline(year);
  } else {
    timelineBar.classList.remove('visible');
  }
}

function updateTimeline(activeYear) {
  const years = [1914, 1915, 1916, 1917, 1918, 1919];
  const activeIdx = years.indexOf(activeYear);
  
  timelineYears.forEach(btn => {
    const y = parseInt(btn.dataset.year);
    const idx = years.indexOf(y);
    btn.classList.remove('active', 'past');
    if (idx === activeIdx) {
      btn.classList.add('active');
    } else if (idx < activeIdx) {
      btn.classList.add('past');
    }
  });
  
  // Fill line progress
  if (activeIdx >= 0) {
    const pct = (activeIdx / (years.length - 1)) * 100;
    const trackWidth = document.querySelector('.timeline-track');
    if (trackWidth) {
      const usableWidth = trackWidth.offsetWidth - 60; // minus padding
      timelineFill.style.width = (usableWidth * activeIdx / (years.length - 1)) + 'px';
    }
  }
}

// === TIMELINE YEAR CLICKS ===
timelineYears.forEach(btn => {
  btn.addEventListener('click', () => {
    const year = parseInt(btn.dataset.year);
    if (YEAR_FIRST_SLIDE[year]) {
      goSlide(YEAR_FIRST_SLIDE[year]);
    }
  });
});

// === LIGHTBOX (imagen ampliada) ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let lightboxOpener = null;

function openLightbox(img) {
  if (!img) return;
  lightboxOpener = document.activeElement;
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = img.alt;
  lightbox.classList.add('open');
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  if (lightboxOpener && lightboxOpener.focus) lightboxOpener.focus();
  lightboxOpener = null;
}

// === KEYBOARD NAVIGATION ===
document.addEventListener('keydown', (e) => {
  // Con la imagen ampliada abierta, solo Escape actúa (cierra) y se bloquea la navegación
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    return;
  }
  if (e.key === 'ArrowRight') {
    const idx = SLIDE_ORDER.indexOf(currentSlide);
    if (idx !== -1 && idx < SLIDE_ORDER.length - 1) {
      goSlide(SLIDE_ORDER[idx + 1]);
    }
  }
  if (e.key === 'ArrowLeft') {
    const idx = SLIDE_ORDER.indexOf(currentSlide);
    if (idx > 0) {
      goSlide(SLIDE_ORDER[idx - 1]);
    }
  }
  if (e.key === 'Escape') {
    // If in aux slide, go back to slide 19
    if (AUX_SLIDES.includes(currentSlide)) {
      goSlide(19);
    }
  }
});

// === REVEAL/EXPAND TOGGLES ===
function toggleReveal(btn) {
  const content = btn.nextElementSibling || btn.parentElement.querySelector('.reveal-content');
  if (!content) return;
  
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    content.classList.add('visible');
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ocultar detalles';
  } else {
    content.classList.add('hidden');
    content.classList.remove('visible');
    btn.innerHTML = '<i class="fa-solid fa-eye"></i> Revelar detalles';
  }
}

// === QUIZ ===
const QUIZ_DATA = [
  {
    question: '¿Qué provocó la entrada de EE.UU. a la Gran Guerra?',
    options: [
      'El telegrama de Zimmermann y la guerra submarina sin restricciones.',
      'El ataque alemán indiscriminado a navíos extranjeros.',
      'La derrota francesa en la batalla de Verdún.',
      'Una alianza militar firmada entre México y Alemania contra Estados Unidos.'
    ],
    correct: 0
  },
  {
    question: '¿Qué países formaban la Triple Alianza, impulsada por Otto von Bismarck en 1882?',
    options: [
      'Austria-Hungría, Italia y Gran Bretaña',
      'Alemania, Imperio Otomano y Rusia',
      'Alemania, Austria-Hungría e Italia',
      'Francia, Rusia y Gran Bretaña'
    ],
    correct: 2
  },
  {
    question: '¿Por qué fue tan importante la batalla del Marne (septiembre de 1914)?',
    options: [
      'Puso fin a la guerra en el frente occidental.',
      'Frustró la posibilidad de una victoria rápida alemana y cambió el rumbo del conflicto.',
      'Provocó la entrada de Estados Unidos en la guerra.',
      'Obligó a Rusia a firmar un armisticio.'
    ],
    correct: 1
  },
  {
    question: '¿A qué suceso se le atribuye como la causa principal de la Primera Guerra Mundial?',
    options: [
      'El telegrama de Zimmermann y la guerra submarina sin restricciones.',
      'La guerra entre la Liga Balcánica.',
      'La derrota francesa en la guerra Franco-Prusiana.',
      'El asesinato del archiduque Francisco Fernando.'
    ],
    correct: 3
  }
];

function buildQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  
  container.innerHTML = QUIZ_DATA.map((q, qi) => {
    const optionsHTML = q.options.map((opt, oi) => 
      `<div class="quiz-option" data-q="${qi}" data-o="${oi}" onclick="answerQuiz(this, ${qi}, ${oi})">
        <div class="circle"></div>
        <span>${opt}</span>
      </div>`
    ).join('');
    
    return `
      <div class="quiz-question" data-q="${qi}">
        <h4>${q.question}</h4>
        ${optionsHTML}
        <div class="quiz-feedback" id="feedback-${qi}"></div>
      </div>
    `;
  }).join('');
}

function answerQuiz(el, qi, oi) {
  const qBlock = el.closest('.quiz-question');
  if (qBlock.classList.contains('answered')) return;
  qBlock.classList.add('answered');
  
  const correct = QUIZ_DATA[qi].correct;
  const options = qBlock.querySelectorAll('.quiz-option');
  
  options.forEach(opt => opt.classList.add('answered'));
  
  if (oi === correct) {
    el.classList.add('correct');
    document.getElementById(`feedback-${qi}`).textContent = '¡Correcto!';
    document.getElementById(`feedback-${qi}`).className = 'quiz-feedback correct';
  } else {
    el.classList.add('incorrect');
    options[correct].classList.add('correct');
    document.getElementById(`feedback-${qi}`).textContent = 'Incorrecto';
    document.getElementById(`feedback-${qi}`).className = 'quiz-feedback incorrect';
  }
}

// === VIDEO ===
function buildVideo() {
  const container = document.getElementById('videoContainer');
  if (!container || !VIDEO_URL) return;
  
  const u = VIDEO_URL.trim();
  if (!u) return;
  
  if (/youtu\.be|youtube\.com/.test(u)) {
    const m = u.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    container.innerHTML = `<iframe src="https://www.youtube.com/embed/${m ? m[1] : ''}" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>`;
  } else if (/drive\.google\.com/.test(u)) {
    container.innerHTML = `<iframe src="${u.replace(/\/view.*$/, '/preview')}" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  } else {
    container.innerHTML = `<video controls preload="metadata" src="${u}"></video>`;
  }
}

// === INIT ===
function init() {
  buildQuiz();
  buildVideo();
  goSlide(1);
}

// Window resize: update timeline fill
window.addEventListener('resize', () => {
  const year = TIMELINE_SLIDES[currentSlide];
  if (year) updateTimeline(year);
});

init();
