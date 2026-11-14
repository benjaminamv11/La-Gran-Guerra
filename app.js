/**
 * PRIMERA GUERRA MUNDIAL: EL ÚLTIMO VERANO DE LA PAZ
 * Lógica interactiva, navegación, audio sintetizado y cuestionario histórico
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackgroundToggle();
  initConceptModals();
  initTimeline();
  initTabs();
  initQuiz();
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

  // Toggle menú móvil
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Estilo al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // ScrollSpy para resaltar sección actual
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
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
   2. ALTERNAR MODO DE FONDO (FONDO LIMPIO HD / ORIGINAL)
   ========================================================================== */
function initBackgroundToggle() {
  const bgSwitchBtn = document.getElementById('bg-switch-btn');
  const bgModeLabel = document.getElementById('bg-mode-label');

  if (!bgSwitchBtn) return;

  let isClean = true;

  bgSwitchBtn.addEventListener('click', () => {
    isClean = !isClean;
    if (isClean) {
      document.body.setAttribute('data-bg-mode', 'clean');
      bgModeLabel.textContent = 'Fondo Limpio';
      bgSwitchBtn.title = 'Mostrando fondo limpio optimizado. Clic para ver fondo original.';
    } else {
      document.body.setAttribute('data-bg-mode', 'original');
      bgModeLabel.textContent = 'Fondo Original';
      bgSwitchBtn.title = 'Mostrando fondo original. Clic para ver fondo limpio.';
    }
  });
}

/* ==========================================================================
   3. BARRA DE PROGRESO DE LECTURA
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
   4. MODAL INTERACTIVO DE CONCEPTOS (IMAGEN 2)
   ========================================================================== */
const CONCEPTS_DATA = {
  imperialismo: {
    title: 'IMPERIALISMO EN 1914',
    badge: 'Causa Estructural',
    desc: `El imperialismo a finales del siglo XIX y principios del XX fue la pugna desesperada entre las grandes potencias europeas por asegurar mercados cautivos, materias primas estratégicas (caucho, petróleo, minerales) y prestigio geopolítico mundial.`,
    exampleTitle: 'Antecedentes Clave en 1914:',
    example: `<strong>Las Crisis Marroquíes (1905 y 1911):</strong> El Káiser Guillermo II desafió frontalmente la influencia francesa en el norte de África. La crisis de Agadir (1911) estuvo a punto de desatar la guerra tres años antes de 1914 y consolidó la alianza militar anglo-francesa.`
  },
  nacionalismo: {
    title: 'NACIONALISMO Y EL POLVORÍN',
    badge: 'Fuerza Desestabilizadora',
    desc: `El nacionalismo actuaba en dos vertientes explosivas: por un lado, el chauvinismo de las grandes potencias que consideraban la guerra una prueba biológica de superioridad cultural; por otro, los anhelos de autodeterminación de minorías oprimidas dentro de imperios multiétnicos.`,
    exampleTitle: 'El Escenario de los Balcanes:',
    example: `<strong>El Paneslavismo y la Gran Serbia:</strong> Serbia aspiraba a unificar a todos los eslavos del sur (yugoslavos) bajo su égida, contando con el respaldo de la "Madre Rusia". Esto amenazaba directamente la integridad territorial del Imperio Austro-Húngaro, que albergaba a millones de eslavos insatisfechos.`
  },
  militarismo: {
    title: 'MILITARISMO Y PAZ ARMADA',
    badge: 'Carrera Armamentística',
    desc: `Bajo la máxima latina <em>Si vis pacem, para bellum</em> ("Si quieres la paz, prepárate para la guerra"), los presupuestos militares europeos se dispararon entre 1870 y 1914. Los estados mayores militares ganaron una influencia casi absoluta sobre la diplomacia civil.`,
    exampleTitle: 'La Carrera Naval Anglo-Alemana:',
    example: `<strong>La revolución del HMS Dreadnought (1906):</strong> La botadura de este acorazado con artillería de gran calibre y propulsión por turbinas desató una costosa competencia de construcción naval entre el Reino Unido y el Imperio Alemán de Von Tirpitz, sembrando desconfianza mutua irremediable.`
  },
  alianza: {
    title: 'EL SISTEMA DE ALIANZAS',
    badge: 'Mecanismo de Escalada',
    desc: `Lejos de garantizar el equilibrio de fuerzas diseñado inicialmente por Otto von Bismarck, las alianzas se convirtieron en un sistema rígido de compromisos automáticos y cláusulas secretas. Un conflicto local entre dos estados implicaba matemáticamente la entrada de seis grandes potencias.`,
    exampleTitle: 'El Efecto Dominó:',
    example: `<strong>Tratados Encadenados:</strong> La alianza ruso-serbia activó la alianza franco-rusa; la garantía alemana a Austria-Hungría activó el Plan Schlieffen; y la defensa del tratado de neutralidad belga de 1839 forzó la declaración de guerra del Imperio Británico.`
  },
  potencia: {
    title: 'LAS GRANDES POTENCIAS',
    badge: 'Hegemonía y Rivalidad',
    desc: `En 1914, el orden global estaba dominado por seis imperios y estados europeos: Gran Bretaña, Alemania, Francia, Rusia, Austria-Hungría e Italia. Concentraban el 80% de la producción industrial militar y se repartían el 75% del globo terrestre en posesiones coloniales.`,
    exampleTitle: 'El Dilema de Seguridad Alemán:',
    example: `<strong>El cerco geopolítico:</strong> Alemania era la potencia con mayor crecimiento demográfico e industrial, pero temía el despertar industrial y la modernización ferroviaria del coloso ruso, calculando que después de 1916 sería imposible derrotar a Rusia en el frente oriental.`
  },
  movilizacion: {
    title: 'MOVILIZACIÓN GENERAL',
    badge: 'El Punto Sin Retorno',
    desc: `La movilización general no era un simple gesto disuasorio, sino el despliegue irrevocable de millones de reservistas mediante planes ferroviarios exhaustivos calculados al minuto. Si un país comenzaba a movilizarse, sus rivales debían movilizarse de inmediato para no quedar indefensos.`,
    exampleTitle: 'La Tiranía de los Horarios Ferroviarios:',
    example: `<strong>La paradoja de 1914:</strong> Cuando el Zar Nicolás II decretó la movilización general el 30 de julio para defender a Serbia, los generales alemanes advirtieron que no podían esperar ni 48 horas sin perder la iniciativa bélica. La movilización significó, de facto, la guerra.`
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
   5. LÍNEA DE TIEMPO INTERACTIVA (CRISIS DE JULIO)
   ========================================================================== */
function initTimeline() {
  const cards = document.querySelectorAll('.timeline-card');
  const dots = document.querySelectorAll('.timeline-dots .dot');
  const prevBtn = document.getElementById('timelinePrevBtn');
  const nextBtn = document.getElementById('timelineNextBtn');
  const indicator = document.getElementById('timelineStepIndicator');

  if (!cards.length) return;

  let currentStep = 1;
  const totalSteps = cards.length;

  function showStep(step) {
    currentStep = Math.max(1, Math.min(step, totalSteps));

    cards.forEach(card => {
      const cardStep = parseInt(card.getAttribute('data-step'), 10);
      card.classList.toggle('active', cardStep === currentStep);
    });

    dots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.toggle('active', dotStep === currentStep);
    });

    if (indicator) {
      indicator.textContent = `Paso ${currentStep} de ${totalSteps}`;
    }

    if (prevBtn) prevBtn.disabled = (currentStep === 1);
    if (nextBtn) nextBtn.disabled = (currentStep === totalSteps);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showStep(currentStep - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showStep(currentStep + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      showStep(step);
    });
  });

  // Soporte de navegación por teclado en la sección
  const timelineSection = document.getElementById('crisis-1914');
  if (timelineSection) {
    window.addEventListener('keydown', (e) => {
      const rect = timelineSection.getBoundingClientRect();
      const inView = (rect.top < window.innerHeight && rect.bottom > 0);
      if (!inView) return;

      if (e.key === 'ArrowRight' && currentStep < totalSteps) {
        showStep(currentStep + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  showStep(1);
}

/* ==========================================================================
   6. PESTAÑAS DE CONSECUENCIAS Y TRANSFORMACIONES
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. CUESTIONARIO HISTÓRICO INTERACTIVO
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    question: "¿Cuál fue el detonante inmediato (la 'chispa') que activó la crisis de julio de 1914?",
    options: [
      "La invasión alemana de la neutral Bélgica",
      "El magnicidio del archiduque Francisco Fernando en Sarajevo",
      "El hundimiento del transatlántico británico RMS Lusitania",
      "La proclamación de la Revolución Bolchevique en San Petersburgo"
    ],
    answer: 1,
    explanation: "El 28 de junio de 1914, el archiduque Francisco Fernando, heredero al trono austrohúngaro, fue asesinado por el nacionalista Gavrilo Princip en Sarajevo. Este magnicidio brindó a Austria-Hungría la excusa para lanzar su ultimátum a Serbia."
  },
  {
    question: "¿Qué compromiso diplomático dio pie a la denominación de 'El Cheque en Blanco' en julio de 1914?",
    options: [
      "El préstamo financiero de Estados Unidos a Gran Bretaña",
      "El apoyo incondicional de Alemania a las acciones de Austria-Hungría contra Serbia",
      "El acuerdo secreto entre Francia e Italia para repartirse el norte de África",
      "La rendición sin condiciones del Imperio Otomano"
    ],
    answer: 1,
    explanation: "El 5-6 de julio, el Káiser Guillermo II prometió a Viena que Alemania respaldaría plenamente cualquier decisión austrohúngara contra Serbia, asumiendo el riesgo de una guerra europea."
  },
  {
    question: "¿Por qué motivo formal declaró el Reino Unido la guerra al Imperio Alemán el 4 de agosto de 1914?",
    options: [
      "Por la invasión alemana de la neutral Bélgica violando el tratado de 1839",
      "Por el ataque aéreo alemán sobre la ciudad de Londres",
      "Por el reclamo territorial sobre las colonias de Sudáfrica",
      "Por la movilización de la flota alemana en el Canal de Suez"
    ],
    answer: 0,
    explanation: "Gran Bretaña era garante de la neutralidad belga según el Tratado de Londres de 1839. Cuando el Plan Schlieffen alemán violó el territorio belga para envolver al ejército francés, Londres emitió un ultimátum y entró formalmente en guerra."
  },
  {
    question: "¿Qué cuatro grandes dinastías e imperios desaparecieron tras el desenlace de la Gran Guerra en 1918?",
    options: [
      "Británico, Francés, Español y Belga",
      "Alemán (Hohenzollern), Austro-Húngaro (Habsburgo), Ruso (Romanov) y Otomano",
      "Chino (Qing), Italiano (Saboya), Portugués y Sueco",
      "Persa, Griego, Búlgaro y Danés"
    ],
    answer: 1,
    explanation: "El derrumbe de los imperios Alemán, Austro-Húngaro, Ruso y Otomano reconfiguró por completo el mapa político de Europa Central, Oriental y de Oriente Medio, dando paso a nuevas repúblicas y tratados como el de Versalles."
  },
  {
    question: "¿Cuál de estos conceptos explica el fenómeno por el cual una vez iniciada la movilización general era casi imposible frenar la guerra?",
    options: [
      "La rigidez de los horarios ferroviarios y planes de contingencia militar masivos",
      "La falta total de telégrafos y teléfonos entre las cancillerías europeas",
      "Las votaciones parlamentarias secretas de los ciudadanos en los frentes",
      "La intervención directa de la Sociedad de Naciones"
    ],
    answer: 0,
    explanation: "La movilización general implicaba millones de reservistas y miles de trenes operando bajo un cronograma férreo. Detener o alterar los trenes significaba dejar las fronteras desprotegidas ante un ataque relámpago enemigo, arrebatando el control a los diplomáticos civiles."
  }
];

function initQuiz() {
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  const tracker = document.getElementById('quizQuestionTracker');
  const scorePill = document.getElementById('quizCurrentScore');
  const questionText = document.getElementById('quizQuestionText');
  const optionsList = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const feedbackBadge = document.getElementById('feedbackBadge');
  const feedbackExplanation = document.getElementById('feedbackExplanation');
  const nextBtn = document.getElementById('quizNextBtn');
  const resultsBox = document.getElementById('quizResultsBox');
  const questionBox = document.querySelector('.quiz-question-box');
  const quizHeader = document.querySelector('.quiz-header');
  const retryBtn = document.getElementById('quizRetryBtn');
  const finalScore = document.getElementById('resultsFinalScore');
  const badgeTitle = document.getElementById('resultsBadgeTitle');
  const feedbackText = document.getElementById('resultsFeedbackText');

  if (!questionText || !optionsList) return;

  function loadQuestion(index) {
    answered = false;
    const q = QUIZ_QUESTIONS[index];
    tracker.textContent = `Pregunta ${index + 1} de ${QUIZ_QUESTIONS.length}`;
    scorePill.textContent = `Aciertos: ${score}`;
    questionText.textContent = q.question;
    optionsList.innerHTML = '';
    feedbackBox.style.display = 'none';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="font-weight:700; color:var(--coral-accent); width:24px;">${String.fromCharCode(65 + i)}.</span> <span>${opt}</span>`;
      btn.addEventListener('click', () => handleOptionClick(i, btn));
      optionsList.appendChild(btn);
    });
  }

  function handleOptionClick(selectedIndex, chosenBtn) {
    if (answered) return;
    answered = true;

    const q = QUIZ_QUESTIONS[currentIndex];
    const optionButtons = optionsList.querySelectorAll('.quiz-option-btn');

    optionButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) {
        b.classList.add('correct');
      } else if (i === selectedIndex) {
        b.classList.add('wrong');
      }
    });

    if (selectedIndex === q.answer) {
      score++;
      scorePill.textContent = `Aciertos: ${score}`;
      feedbackBadge.textContent = '¡CORRECTO!';
      feedbackBadge.className = 'feedback-badge correct';
    } else {
      feedbackBadge.textContent = 'INCORRECTO';
      feedbackBadge.className = 'feedback-badge wrong';
    }

    feedbackExplanation.textContent = q.explanation;
    feedbackBox.style.display = 'block';

    if (currentIndex === QUIZ_QUESTIONS.length - 1) {
      nextBtn.innerHTML = 'Ver Calificación Final <i class="fa-solid fa-trophy"></i>';
    } else {
      nextBtn.innerHTML = 'Siguiente Pregunta <i class="fa-solid fa-arrow-right"></i>';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      currentIndex++;
      loadQuestion(currentIndex);
    } else {
      showResults();
    }
  });

  function showResults() {
    quizHeader.style.display = 'none';
    questionBox.style.display = 'none';
    feedbackBox.style.display = 'none';
    resultsBox.style.display = 'block';

    finalScore.textContent = `Has acertado ${score} de ${QUIZ_QUESTIONS.length} preguntas (${Math.round((score / QUIZ_QUESTIONS.length) * 100)}%).`;

    if (score === 5) {
      badgeTitle.textContent = 'Rango: Historiador Distinguido de 1914';
      feedbackText.textContent = '¡Extraordinario! Posees un dominio absoluto de los antecedentes, la crisis diplomática y las transformaciones de la Gran Guerra.';
    } else if (score >= 3) {
      badgeTitle.textContent = 'Rango: Cronista de la Gran Guerra';
      feedbackText.textContent = '¡Muy buen trabajo! Comprendes con solidez la concatenación de acontecimientos que llevaron a la catástrofe bélica europea.';
    } else {
      badgeTitle.textContent = 'Rango: Aprendiz de Historia Moderna';
      feedbackText.textContent = 'Un buen comienzo. Te invitamos a repasar los conceptos y la línea de tiempo de la Crisis de Julio para perfeccionar tu análisis.';
    }
  }

  retryBtn.addEventListener('click', () => {
    currentIndex = 0;
    score = 0;
    quizHeader.style.display = 'flex';
    questionBox.style.display = 'block';
    resultsBox.style.display = 'none';
    loadQuestion(0);
  });

  loadQuestion(0);
}

/* ==========================================================================
   8. AMBIENTACIÓN SONORA HISTÓRICA (SINTETIZADA CON WEB AUDIO API)
   Genera viento sutil, lluvia lejana y retumbe apagado sin descargar archivos
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
  let thunderInterval = null;

  function createNoiseBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Generar ruido tipo "pink noise" para simular lluvia constante suave
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 2.5; // Escala
    }
    return buffer;
  }

  function startAudio() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();

      // Master gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 2.5);
      masterGain.connect(audioCtx.destination);

      // Generador de lluvia / viento tenue con filtro pasa-bajos
      const buffer = createNoiseBuffer(audioCtx);
      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, audioCtx.currentTime);

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start(0);

      // Retumbe distante periódico (trueno / artillería lejana en la bruma)
      function scheduleDistantRumble() {
        if (!isPlaying || !audioCtx) return;

        const rumbleOsc = audioCtx.createOscillator();
        const rumbleGain = audioCtx.createGain();
        const rumbleFilter = audioCtx.createBiquadFilter();

        rumbleOsc.type = 'triangle';
        rumbleOsc.frequency.setValueAtTime(45 + Math.random() * 20, audioCtx.currentTime);
        rumbleOsc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 3.0);

        rumbleFilter.type = 'lowpass';
        rumbleFilter.frequency.setValueAtTime(90, audioCtx.currentTime);

        rumbleGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        rumbleGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.6);
        rumbleGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.2);

        rumbleOsc.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(masterGain);

        rumbleOsc.start(audioCtx.currentTime);
        rumbleOsc.stop(audioCtx.currentTime + 3.5);

        const nextDelay = 7000 + Math.random() * 11000;
        thunderInterval = setTimeout(scheduleDistantRumble, nextDelay);
      }

      scheduleDistantRumble();

      isPlaying = true;
      audioBtn.classList.add('playing');
      audioIcon.className = 'fa-solid fa-volume-high';
      if (btnText) btnText.textContent = 'Sonido: Activado';
    } catch (err) {
      console.warn('Audio contextual no disponible:', err);
    }
  }

  function stopAudio() {
    if (!audioCtx) return;
    if (thunderInterval) clearTimeout(thunderInterval);

    if (masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (noiseNode) {
          try { noiseNode.stop(); } catch (e) {}
        }
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close();
        }
        audioCtx = null;
      }, 900);
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
