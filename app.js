/**
 * PRIMERA GUERRA MUNDIAL: LÍNEA DE TIEMPO INTERACTIVA 1914 — 1919
 * Lógica interactiva de navegación de años, diapositivas, modales y audio
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initConceptModals();
  initTimeline1914to1919();
  initAmbientAudio();
  initScrollProgress();
});

/* ==========================================================================
   1. NAVEGACIÓN Y NAVBAR
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. BARRA DE PROGRESO DE LECTURA
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   3. MODALES DE CONCEPTOS (IMAGEN 2)
   ========================================================================== */
const CONCEPTS_DATA = {
  imperialismo: {
    title: 'IMPERIALISMO EN 1914',
    badge: 'Causa Estructural',
    desc: `Pugna voraz entre las potencias europeas por materias primas, nuevos mercados cautivos y prestigio geopolítico en África y Asia.`,
    exampleTitle: 'Antecedentes Clave:',
    example: `<strong>Las Crisis Marroquíes (1905 y 1911):</strong> Alemania desafió la influencia francesa en el norte de África, forzando la cooperación militar anglo-francesa previa a 1914.`
  },
  nacionalismo: {
    title: 'NACIONALISMO Y EL POLVORÍN',
    badge: 'Fuerza Desestabilizadora',
    desc: `Sentimiento de pertenencia exaltado y rivalidad chauvinista, sumado al deseo de autodeterminación de minorías oprimidas dentro de imperios multiétnicos.`,
    exampleTitle: 'El Escenario de los Balcanes:',
    example: `<strong>El Paneslavismo y la Gran Serbia:</strong> Serbia aspiraba a unificar a los eslavos del sur con apoyo del Imperio Ruso, amenazando directamente a Austria-Hungría.`
  },
  militarismo: {
    title: 'MILITARISMO Y PAZ ARMADA',
    badge: 'Carrera Armamentística',
    desc: `Aumento desmesurado de los ejércitos, flotas y presupuestos de guerra bajo la doctrina de que la fuerza bélica garantizaba la supervivencia.`,
    exampleTitle: 'La Carrera Naval:',
    example: `<strong>La revolución del HMS Dreadnought (1906):</strong> Acorazados con artillería pesada que desataron una competencia frenética de construcción naval anglo-alemana.`
  },
  alianza: {
    title: 'EL SISTEMA DE ALIANZAS',
    badge: 'Mecanismo de Escalada',
    desc: `Acuerdos militares defensivos y cláusulas secretas que convirtieron cualquier disputa bilateral en una conflagración automática a escala continental.`,
    exampleTitle: 'Efecto Dominó en Cadena:',
    example: `<strong>Tratados Encadenados:</strong> La defensa de Serbia por Rusia activó a Francia y Alemania; la invasión de Bélgica activó al Imperio Británico.`
  },
  potencia: {
    title: 'LAS GRANDES POTENCIAS',
    badge: 'Hegemonía y Rivalidad',
    desc: `Gran Bretaña, Alemania, Francia, Rusia, Austria-Hungría e Italia concentraban el poder industrial militar y el control de las colonias globales en 1914.`,
    exampleTitle: 'El Dilema de Seguridad Alemán:',
    example: `<strong>El cerco geopolítico:</strong> Berlín temía el crecimiento industrial y la modernización ferroviaria del coloso ruso, buscando un golpe rápido en Occidente.`
  },
  movilizacion: {
    title: 'MOVILIZACIÓN GENERAL',
    badge: 'El Punto Sin Retorno',
    desc: `Preparación y despliegue irrevocable de millones de reservistas regido por horarios ferroviarios estrictos calculados al minuto.`,
    exampleTitle: 'La Tiranía de los Trenes:',
    example: `<strong>Punto de no retorno:</strong> Una vez ordenada la movilización rusa el 30 de julio, los planes militares alemanes impedían detener la marcha hacia la guerra.`
  }
};

function initConceptModals() {
  const cards = document.querySelectorAll('.concepto-card');
  const modal = document.getElementById('conceptModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal) return;

  function openModal(conceptKey) {
    const data = CONCEPTS_DATA[conceptKey];
    if (!data) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = `
      <p>${data.desc}</p>
      <div class="historical-example-box">
        <strong>${data.exampleTitle}</strong>
        ${data.example}
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const conceptKey = card.getAttribute('data-concept');
      openModal(conceptKey);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const conceptKey = card.getAttribute('data-concept');
        openModal(conceptKey);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. LÍNEA DE TIEMPO INTERACTIVA AÑO A AÑO (1914 — 1919)
   ========================================================================== */
function initTimeline1914to1919() {
  const years = ['1914', '1915', '1916', '1917', '1918', '1919'];
  let currentYearIndex = 0;

  const yearButtons = document.querySelectorAll('.timeline-year-btn');
  const slideCards = document.querySelectorAll('.year-slide-card');
  const trackFill = document.getElementById('timelineTrackFill');
  const prevBtn = document.getElementById('btnPrevYear');
  const nextBtn = document.getElementById('btnNextYear');
  const statusLabel = document.getElementById('timelineCurrentStatus');
  const quickJumpButtons = document.querySelectorAll('.year-mini-btn');

  function setYear(index, scrollIntoView = false) {
    if (index < 0 || index >= years.length) return;
    currentYearIndex = index;
    const selectedYear = years[currentYearIndex];

    // 1. Actualizar botones principales de año
    yearButtons.forEach((btn, i) => {
      const isActive = (i === currentYearIndex);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 2. Actualizar tarjetas de diapositivas
    slideCards.forEach(card => {
      const cardYear = card.getAttribute('data-year');
      card.classList.toggle('active', cardYear === selectedYear);
    });

    // 3. Actualizar barra de progreso del riel
    if (trackFill) {
      const progressPercent = ((currentYearIndex + 1) / years.length) * 100;
      trackFill.style.width = `${progressPercent}%`;
    }

    // 4. Actualizar botones Anterior / Siguiente
    if (prevBtn) prevBtn.disabled = (currentYearIndex === 0);
    if (nextBtn) nextBtn.disabled = (currentYearIndex === years.length - 1);

    // 5. Actualizar texto de estado
    if (statusLabel) {
      statusLabel.innerHTML = `Mostrando <strong>${selectedYear}</strong> (${currentYearIndex + 1} de ${years.length})`;
    }

    // 6. Actualizar píldoras rápidas en el navbar
    quickJumpButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-jump-year') === selectedYear);
    });

    // 7. Desplazar suavemente a la diapositiva si se requiere
    if (scrollIntoView) {
      const timelineSection = document.getElementById('timeline-section');
      if (timelineSection) {
        timelineSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Event listeners para los botones de la barra de años
  yearButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      setYear(index);
    });
  });

  // Botón Año Anterior
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentYearIndex > 0) {
        setYear(currentYearIndex - 1);
      }
    });
  }

  // Botón Año Siguiente
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentYearIndex < years.length - 1) {
        setYear(currentYearIndex + 1);
      }
    });
  }

  // Píldoras del Header (salto directo)
  quickJumpButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const y = btn.getAttribute('data-jump-year');
      const idx = years.indexOf(y);
      if (idx !== -1) {
        setYear(idx, true);
      }
    });
  });

  // Navegación por teclado (Flechas izquierda y derecha)
  window.addEventListener('keydown', (e) => {
    const timelineEl = document.getElementById('timeline-section');
    if (!timelineEl) return;
    
    const rect = timelineEl.getBoundingClientRect();
    const inViewport = (rect.top < window.innerHeight && rect.bottom > 0);
    if (!inViewport) return;

    if (e.key === 'ArrowRight' && currentYearIndex < years.length - 1) {
      setYear(currentYearIndex + 1);
    } else if (e.key === 'ArrowLeft' && currentYearIndex > 0) {
      setYear(currentYearIndex - 1);
    }
  });

  // Inicializar en 1914
  setYear(0);
}

/* ==========================================================================
   5. AMBIENTACIÓN SONORA (WEB AUDIO API)
   Genera viento y lluvia tenue sin archivos de audio externos
   ========================================================================== */
function initAmbientAudio() {
  const audioBtn = document.getElementById('ambient-audio-btn');
  const audioIcon = document.getElementById('audio-icon');
  const btnText = audioBtn ? audioBtn.querySelector('.audio-btn-text') : null;

  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let noiseNode = null;
  let rumbleInterval = null;

  function createPinkNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  function startAudio() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      audioCtx = new AudioCtxClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.16, audioCtx.currentTime + 2.0);
      masterGain.connect(audioCtx.destination);

      // Lluvia/Viento continuo
      const noiseBuffer = createPinkNoiseBuffer(audioCtx);
      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(600, audioCtx.currentTime);

      noiseNode.connect(lowpass);
      lowpass.connect(masterGain);
      noiseNode.start(0);

      // Retumbe lejano
      function triggerRumble() {
        if (!isPlaying || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(45 + Math.random() * 25, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 2.8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(80, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 3.2);

        rumbleInterval = setTimeout(triggerRumble, 8000 + Math.random() * 12000);
      }

      triggerRumble();

      isPlaying = true;
      audioBtn.classList.add('playing');
      audioIcon.className = 'fa-solid fa-volume-high';
      if (btnText) btnText.textContent = 'Sonido: Activado';
    } catch (e) {
      console.warn('Audio no disponible:', e);
    }
  }

  function stopAudio() {
    if (!audioCtx) return;
    if (rumbleInterval) clearTimeout(rumbleInterval);

    if (masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      setTimeout(() => {
        if (noiseNode) {
          try { noiseNode.stop(); } catch (err) {}
        }
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close();
        }
        audioCtx = null;
      }, 700);
    }

    isPlaying = false;
    audioBtn.classList.remove('playing');
    audioIcon.className = 'fa-solid fa-volume-xmark';
    if (btnText) btnText.textContent = 'Sonido Ambiental';
  }

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });
}
