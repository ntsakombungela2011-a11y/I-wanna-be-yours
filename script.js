(function () {
  'use strict';


  // --- Original train soundscape (generated with Web Audio; no audio files required) ---
  let journeyAudio = null;
  let journeyMaster = null;
  let ambienceNodes = [];
  let railTimer = null;
  let soundEnabled = false;

  function getAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!journeyAudio) {
      journeyAudio = new AudioContextClass();
      journeyMaster = journeyAudio.createGain();
      journeyMaster.gain.value = 0.85;
      journeyMaster.connect(journeyAudio.destination);
    }
    if (journeyAudio.state === 'suspended') journeyAudio.resume();
    return journeyAudio;
  }

  function playTone(frequency, duration, wave, volume, endFrequency) {
    const ctx = getAudio();
    if (!ctx || !soundEnabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave || 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume || 0.08, ctx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(journeyMaster);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.04);
  }

  function railClack() {
    playTone(105, 0.075, 'triangle', 0.035, 58);
  }

  function startRailAmbience() {
    const ctx = getAudio();
    if (!ctx || !soundEnabled || ambienceNodes.length) return;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.32;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 175;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.28;
    noise.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(journeyMaster);
    noise.start();

    const engine = ctx.createOscillator();
    const engineGain = ctx.createGain();
    engine.type = 'sine';
    engine.frequency.value = 48;
    engineGain.gain.value = 0.055;
    engine.connect(engineGain);
    engineGain.connect(journeyMaster);
    engine.start();

    ambienceNodes = [noise, engine, filter, rumbleGain, engineGain];
    railTimer = window.setInterval(railClack, 620);
  }

  function stopRailAmbience() {
    if (railTimer) window.clearInterval(railTimer);
    railTimer = null;
    ambienceNodes.forEach(function (node) {
      try { if (node.stop) node.stop(); } catch (error) {}
      try { node.disconnect(); } catch (error) {}
    });
    ambienceNodes = [];
  }

  function playJourneySound(kind) {
    if (!soundEnabled) return;
    if (kind === 'ticket') {
      playTone(660, 0.22, 'sine', 0.09);
      window.setTimeout(function () { playTone(880, 0.32, 'sine', 0.07); }, 150);
    } else if (kind === 'click') {
      playTone(520, 0.055, 'triangle', 0.045, 390);
    } else if (kind === 'train') {
      playTone(95, 0.85, 'sawtooth', 0.075, 42);
      window.setTimeout(function () { playTone(330, 0.18, 'sine', 0.035); }, 180);
    } else if (kind === 'letter') {
      playTone(523, 0.3, 'sine', 0.075);
      window.setTimeout(function () { playTone(659, 0.3, 'sine', 0.075); }, 130);
      window.setTimeout(function () { playTone(784, 0.48, 'sine', 0.07); }, 260);
    } else if (kind === 'departure') {
      playTone(740, 0.16, 'sine', 0.07);
      window.setTimeout(function () { playTone(988, 0.22, 'sine', 0.06); }, 180);
    }
  }

  function startAudioExperience() {
    getAudio();
    startRailAmbience();
    const toggle = document.getElementById('sound-toggle');
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Turn sound off');
      toggle.innerHTML = '♫ <span>Sound on</span>';
    }
  }

  function setupSoundToggle() {
    const toggle = document.getElementById('sound-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      if (!soundEnabled) {
        soundEnabled = true;
        startAudioExperience();
        playTone(880, 0.42, 'sine', 0.18, 660);
      } else {
        soundEnabled = false;
        stopRailAmbience();
      }
      toggle.setAttribute('aria-pressed', String(soundEnabled));
      toggle.setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
      toggle.innerHTML = soundEnabled ? '♫ <span>Sound on</span>' : '♪ <span>Enable sound</span>';
    });
  }

  setupSoundToggle();

  // --- Apply CONFIG to DOM ---
  function applyConfig() {
    // Page title
    document.title = CONFIG.pageTitle;

    // Lock screen
    document.getElementById('passphrase-hint').textContent = CONFIG.passphraseHint;

    // Ticket
    document.getElementById('ticket-greeting').textContent = CONFIG.ticketGreeting;
    document.getElementById('ticket-passenger').textContent = 'PASSENGER: ' + CONFIG.ticketPassenger;
    document.getElementById('ticket-date').textContent = 'DATE: ' + CONFIG.ticketDate;
    document.getElementById('ticket-class').textContent = 'CLASS: ' + CONFIG.ticketClass;

    // Stops
    CONFIG.stops.forEach(function (stop, i) {
      var section = document.getElementById('scene-stop-' + (i + 1));
      if (!section) return;
      section.querySelector('[data-field="stampLocation"]').textContent = stop.stampLocation;
      section.querySelector('[data-field="title"]').textContent = stop.title;
      section.querySelector('[data-field="reflection"]').textContent = stop.reflection;
    });

    // Final destination
    document.getElementById('arrival-heading').textContent = CONFIG.finalDestinationTitle;
    document.getElementById('arrival-subtitle').textContent = CONFIG.finalDestinationSubtitle;

    // Letter
    document.getElementById('letter-heading').textContent = CONFIG.letterHeading;
    var letterBody = document.getElementById('letter-body');
    letterBody.innerHTML = '';
    CONFIG.letterParagraphs.forEach(function (text, i) {
      var p = document.createElement('p');
      p.className = 'letter-paragraph';
      if (i === CONFIG.letterParagraphs.length - 1) {
        p.classList.add('letter-birthday-message');
      }
      p.textContent = text;
      letterBody.appendChild(p);
    });
    document.getElementById('letter-signoff').textContent = CONFIG.letterSignoff;

    // Footer
    document.getElementById('footer-line').textContent = CONFIG.footerLine;
    document.getElementById('footer-copyright').innerHTML = CONFIG.footerCopyright;
  }

  applyConfig();

  // --- Lock Screen ---
  const lockScreen = document.getElementById('lock-screen');
  const mainContent = document.getElementById('main-content');
  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const lockError = document.getElementById('lock-error');

  function normalizePassphrase(value) {
    return String(value).trim().toLowerCase();
  }

  function validatePassword(input) {
    return normalizePassphrase(input) === normalizePassphrase(CONFIG.password);
  }

  function attemptUnlock() {
    const value = passwordInput.value.trim();
    if (!value) return;

    if (normalizePassphrase(value).includes(normalizePassphrase(CONFIG.bypass))) {
      lockScreen.classList.add('unlocked');
      mainContent.hidden = false;
      mainContent.classList.add('visible');
      initJourney(1);
      return;
    }

    if (validatePassword(value)) {
      lockScreen.classList.add('unlocked');
      showTicket();
    } else {
      const sassyErrors = [
        'Nice try.',
        'Good thing we tested this.',
        'We have industry-leading security.',
        'Passphrase not recognized. Shocking.',
        'That ain\'t it, chief.',
        'Access denied. Try harder.',
        'Bold guess. Wrong, but bold.',
      ];
      lockError.textContent = sassyErrors[Math.floor(Math.random() * sassyErrors.length)];
      lockError.hidden = false;
      passwordInput.classList.add('shake');
      passwordInput.addEventListener('animationend', () => {
        passwordInput.classList.remove('shake');
      }, { once: true });
    }
  }

  function showTicket() {
    playJourneySound('ticket');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      mainContent.hidden = false;
      mainContent.classList.add('visible');
      initJourney();
      return;
    }

    const ticketOverlay = document.getElementById('ticket-overlay');
    const ticketGreeting = document.getElementById('ticket-greeting');
    const trainTicket = document.getElementById('train-ticket');
    const ticketStamp = document.getElementById('ticket-stamp');

    ticketOverlay.setAttribute('aria-hidden', 'false');
    ticketOverlay.classList.add('visible');

    setTimeout(() => {
      ticketGreeting.classList.add('visible');
    }, 300);

    setTimeout(() => {
      trainTicket.style.opacity = '1';
      trainTicket.style.transform = 'translateY(0)';
    }, 1900);

    setTimeout(() => {
      ticketStamp.classList.add('visible');
    }, 2600);

    setTimeout(() => {
      ticketOverlay.classList.add('fading-out');
      ticketOverlay.classList.remove('visible');

      setTimeout(() => {
        ticketOverlay.style.display = 'none';
        mainContent.hidden = false;
        initJourney();
        requestAnimationFrame(() => {
          mainContent.classList.add('visible');
        });
      }, 400);
    }, 4800);
  }

  unlockBtn.addEventListener('click', attemptUnlock);
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  passwordInput.addEventListener('input', () => {
    if (!lockError.hidden) lockError.hidden = true;
  });

  // --- Journey State Machine ---
  function initJourney(startAt) {
    const scenes = [
      'scene-hero',
      'scene-stop-1',
      'scene-stop-2',
      'scene-stop-3',
      'scene-stop-4',
      'scene-stop-5',
      'scene-letter'
    ];

    const stopIndices = [1, 2, 3, 4, 5, 6];
    const totalStops = 6;

    const trainContainer = document.getElementById('train-container');
    const trainImg = document.getElementById('train-img');
    const journeyNav = document.getElementById('journey-nav');
    const navBack = document.getElementById('nav-back');
    const navForward = document.getElementById('nav-forward');
    const navTrackFilled = document.getElementById('nav-track-filled');
    const navTrainIcon = document.getElementById('nav-train-icon');
    const navStops = document.querySelectorAll('.nav-stop');
    const confettiContainer = document.getElementById('confetti-container');

    let currentIndex = 0;
    let transitioning = false;
    let confettiTriggered = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!startAt) {
      startSplitFlap();
    }

    showScene(startAt || 0, false);
    updateNav();

    document.querySelectorAll('.card-arrow-right').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (transitioning) return;
        advance();
      });
    });

    document.querySelectorAll('.card-arrow-left').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (transitioning) return;
        goBack();
      });
    });

    navBack.addEventListener('click', () => {
      if (transitioning || currentIndex <= 0) return;
      goBack();
    });

    navForward.addEventListener('click', () => {
      if (transitioning || currentIndex >= scenes.length - 1) return;
      advance();
    });

    navStops.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (transitioning) return;
        const targetIndex = i + 1;
        if (targetIndex === currentIndex) return;
        crossFade(targetIndex, targetIndex > currentIndex ? 'forward' : 'backward');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (lockScreen.classList.contains('unlocked') === false) return;
      if (transitioning) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goBack();
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    mainContent.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainContent.addEventListener('touchend', (e) => {
      if (transitioning) return;
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      const minSwipe = 60;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        if (dx < 0) {
          advance();
        } else {
          goBack();
        }
      }
    }

    function advance() {
      playJourneySound('click');
      const nextIndex = currentIndex + 1;
      if (nextIndex >= scenes.length) return;

      const needsTrain = stopIndices.includes(nextIndex);

      if (needsTrain && !prefersReducedMotion) {
        playTrainTransition(nextIndex, 'forward');
      } else {
        crossFade(nextIndex, 'forward');
      }
    }

    function goBack() {
      playJourneySound('click');
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0) return;
      crossFade(prevIndex, 'backward');
    }

    function showScene(index, animate) {
      const allScenes = document.querySelectorAll('.scene');
      allScenes.forEach((s) => {
        s.classList.remove('active', 'exiting', 'entering-back');
      });

      const target = document.getElementById(scenes[index]);
      if (target) {
        if (animate) {
          requestAnimationFrame(() => {
            target.classList.add('active');
          });
        } else {
          target.classList.add('active');
        }
      }
      currentIndex = index;
      updateNav();

      const footer = document.getElementById('site-footer');
      if (index >= 1 && index <= 5) {
        footer.classList.add('hidden');
      } else {
        footer.classList.remove('hidden');
      }

      if (scenes[index] === 'scene-letter' && !confettiTriggered) {
        initEnvelope();
      }
    }

    function updateNav() {
      journeyNav.hidden = currentIndex <= 0;

      navBack.disabled = currentIndex <= 0;
      navForward.disabled = currentIndex >= scenes.length - 1;

      let trackProgress = 0;
      if (currentIndex >= 1 && currentIndex <= 6) {
        trackProgress = (currentIndex - 1) / (totalStops - 1);
      } else if (currentIndex > 6) {
        trackProgress = 1;
      }

      const percent = trackProgress * 100;
      navTrackFilled.style.width = percent + '%';
      navTrainIcon.style.left = percent + '%';

      navStops.forEach((dot, i) => {
        const stopNum = i + 1;
        dot.classList.remove('visited', 'current');
        if (stopNum < currentIndex || (currentIndex > 7)) {
          dot.classList.add('visited');
        } else if (stopNum === currentIndex) {
          dot.classList.add('visited', 'current');
        }
      });
    }

    function crossFade(nextIndex, direction) {
      transitioning = true;
      const currentScene = document.getElementById(scenes[currentIndex]);

      if (currentScene) {
        currentScene.classList.add('exiting');
        currentScene.classList.remove('active');
      }

      setTimeout(() => {
        if (currentScene) {
          currentScene.classList.remove('exiting');
        }
        showScene(nextIndex, true);
        transitioning = false;
      }, 400);
    }

    function playTrainTransition(nextIndex, direction) {
      playJourneySound('train');
      transitioning = true;
      const currentScene = document.getElementById(scenes[currentIndex]);
      const isArrival = nextIndex === 6;

      if (currentScene) {
        currentScene.classList.add('exiting');
        currentScene.classList.remove('active');
      }

      setTimeout(() => {
        if (currentScene) {
          currentScene.classList.remove('exiting');
        }

        trainContainer.classList.remove('active', 'arriving');
        trainImg.style.animation = 'none';
        trainImg.style.transform = 'translateX(calc(-100% - 10px)) translateY(-50%)';

        void trainImg.offsetHeight;

        trainImg.style.animation = '';
        trainImg.style.transform = '';

        if (isArrival) {
          trainContainer.classList.add('active', 'arriving');
        } else {
          trainContainer.classList.add('active');
        }

        function onAnimEnd(e) {
          if (e.target !== trainImg) return;
          trainImg.removeEventListener('animationend', onAnimEnd);

          trainContainer.classList.remove('active', 'arriving');
          trainImg.style.visibility = 'hidden';
          trainImg.style.transform = 'translateX(calc(-100% - 10px)) translateY(-50%)';
          showScene(nextIndex, true);
          transitioning = false;
          trainImg.style.visibility = '';
        }

        trainImg.addEventListener('animationend', onAnimEnd);
      }, 250);
    }

    // --- Departure Board ---
    function startSplitFlap() {
      const container = document.getElementById('departure-rows');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const now = new Date();
      function formatTime(date) {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return h + ':' + m;
      }

      function offsetTime(hoursOffset) {
        const d = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);
        return formatTime(d);
      }

      const rows = [
        { time: formatTime(now), destination: CONFIG.expressName, status: 'NOW BOARDING', statusClass: 'status-now-boarding', animated: true },
        { time: offsetTime(-2), destination: 'CHICAGO EXPRESS', status: 'SCHEDULED', statusClass: 'status-arrived' },
        { time: offsetTime(1), destination: 'SEATTLE COAST', status: 'ON TIME', statusClass: 'status-on-time' },
        { time: offsetTime(1.5), destination: 'LOS ANGELES', status: 'CANCELLED', statusClass: 'status-cancelled' },
        { time: offsetTime(3), destination: 'WISCONSIN LINE', status: 'ON TIME', statusClass: 'status-on-time' }
      ];

      container.innerHTML = '';

      rows.forEach(function(rowData) {
        const row = document.createElement('div');
        row.className = 'departure-row';
        if (rowData.animated) row.setAttribute('data-daledo', 'true');

        const timeEl = document.createElement('span');
        timeEl.className = 'departure-row-time';

        const destEl = document.createElement('span');
        destEl.className = 'departure-row-destination';

        const statusEl = document.createElement('span');
        statusEl.className = 'departure-row-status';

        if (rowData.animated) {
          function randStr(len) {
            var s = '';
            for (var j = 0; j < len; j++) s += chars[Math.floor(Math.random() * chars.length)];
            return s;
          }
          timeEl.textContent = randStr(2) + ':' + randStr(2);
          destEl.textContent = randStr(14);
          statusEl.textContent = randStr(11);
        } else {
          timeEl.textContent = rowData.time;
          destEl.textContent = rowData.destination;
          statusEl.textContent = rowData.status;
          statusEl.classList.add(rowData.statusClass);
        }

        row.appendChild(timeEl);
        row.appendChild(destEl);
        row.appendChild(statusEl);
        container.appendChild(row);
      });

      if (prefersReducedMotion) {
        const daledoRow = container.querySelector('[data-daledo]');
        if (daledoRow) {
          const timeEl = daledoRow.querySelector('.departure-row-time');
          const destEl = daledoRow.querySelector('.departure-row-destination');
          const statusEl = daledoRow.querySelector('.departure-row-status');
          timeEl.textContent = formatTime(now);
          destEl.textContent = CONFIG.expressName;
          statusEl.textContent = 'NOW BOARDING';
          statusEl.classList.add('status-now-boarding');
          daledoRow.classList.add('daledo-highlight');
          daledoRow.classList.add('daledo-clickable');

          daledoRow.addEventListener('click', function handleDepart() {
            playJourneySound('departure');
            daledoRow.removeEventListener('click', handleDepart);
            daledoRow.classList.remove('daledo-clickable');
            statusEl.className = 'departure-row-status status-departed';
            statusEl.textContent = 'DEPARTED';
            setTimeout(function() { advance(); }, 800);
          });
        }
        return;
      }

      const daledoRow = container.querySelector('[data-daledo]');
      const timeEl = daledoRow.querySelector('.departure-row-time');
      const destEl = daledoRow.querySelector('.departure-row-destination');
      const statusEl = daledoRow.querySelector('.departure-row-status');

      const finalTime = formatTime(now);
      const finalDest = CONFIG.expressName;
      const finalStatus = 'NOW BOARDING';

      function createCharSpans(el, text) {
        el.innerHTML = '';
        var spans = [];
        for (var i = 0; i < text.length; i++) {
          var span = document.createElement('span');
          span.className = 'flip-char';
          span.textContent = text[i] === ' ' ? ' ' : (chars[Math.floor(Math.random() * chars.length)]);
          el.appendChild(span);
          spans.push({ el: span, target: text[i] });
        }
        return spans;
      }

      setTimeout(function() {
        var timeSpans = createCharSpans(timeEl, finalTime);
        var destSpans = createCharSpans(destEl, finalDest);
        var statusSpans = createCharSpans(statusEl, finalStatus);

        var allGroups = [
          { spans: timeSpans, delay: 0 },
          { spans: destSpans, delay: 100 },
          { spans: statusSpans, delay: 300 }
        ];

        var groupsDone = 0;
        var totalGroups = allGroups.length;

        allGroups.forEach(function(group) {
          animateCharGroup(group.spans, group.delay, function() {
            groupsDone++;
            if (groupsDone === totalGroups) {
              daledoRow.classList.add('daledo-highlight');
              daledoRow.classList.add('daledo-clickable');
              statusEl.classList.add('status-now-boarding');

              daledoRow.addEventListener('click', function handleDepart() {
                playJourneySound('departure');
                daledoRow.removeEventListener('click', handleDepart);
                daledoRow.classList.remove('daledo-clickable');

                var targetText = 'DEPARTED';
                var currentText = statusEl.textContent;
                statusEl.innerHTML = '';
                statusEl.className = 'departure-row-status status-departed';

                var maxLen = Math.max(currentText.length, targetText.length);
                var spans = [];
                for (var i = 0; i < maxLen; i++) {
                  var span = document.createElement('span');
                  span.className = 'flip-char';
                  span.textContent = i < currentText.length ? currentText[i] : ' ';
                  statusEl.appendChild(span);
                  spans.push({ el: span, target: i < targetText.length ? targetText[i] : ' ' });
                }

                var settled = 0;
                spans.forEach(function(s, idx) {
                  var stagger = idx * 50;
                  var flipDuration = 400 + Math.random() * 200;
                  var flipInterval = 50;
                  var elapsed = 0;

                  setTimeout(function() {
                    var interval = setInterval(function() {
                      elapsed += flipInterval;
                      s.el.textContent = chars[Math.floor(Math.random() * chars.length)];
                      s.el.classList.add('flipping');
                      setTimeout(function() { s.el.classList.remove('flipping'); }, 30);

                      if (elapsed >= flipDuration) {
                        clearInterval(interval);
                        s.el.textContent = s.target;
                        s.el.classList.add('settled');
                        settled++;
                        if (settled === spans.length) {
                          setTimeout(function() { advance(); }, 600);
                        }
                      }
                    }, flipInterval);
                  }, stagger);
                });
              });
            }
          });
        });
      }, 1000);

      function animateCharGroup(spans, baseDelay, onComplete) {
        var settled = 0;
        spans.forEach(function(s, i) {
          if (s.target === ' ' || s.target === ':') {
            s.el.textContent = s.target === ' ' ? ' ' : s.target;
            s.el.classList.add('settled');
            settled++;
            if (settled === spans.length && onComplete) onComplete();
            return;
          }

          var stagger = i * 40;
          var flipDuration = 1000 + Math.random() * 600;
          var flipInterval = 60;
          var elapsed = 0;

          setTimeout(function() {
            var interval = setInterval(function() {
              elapsed += flipInterval;
              s.el.textContent = chars[Math.floor(Math.random() * chars.length)];
              s.el.classList.add('flipping');
              setTimeout(function() {
                s.el.classList.remove('flipping');
              }, 40);

              if (elapsed >= flipDuration) {
                clearInterval(interval);
                s.el.textContent = s.target;
                s.el.classList.add('settled');
                settled++;
                if (settled === spans.length && onComplete) onComplete();
              }
            }, flipInterval);
          }, baseDelay + stagger);
        });
      }
    }

    // Envelope interaction
    function initEnvelope() {
      const envelopeWrapper = document.getElementById('envelope-wrapper');
      const envelope = document.getElementById('envelope');
      const letterContainer = document.getElementById('letter-container');

      if (!envelope || !envelopeWrapper || !letterContainer) return;

      function openEnvelope() {
        playJourneySound('letter');
        envelope.removeEventListener('click', openEnvelope);
        envelope.removeEventListener('keydown', onEnvelopeKey);

        document.getElementById('site-footer').classList.add('hidden');

        envelopeWrapper.classList.add('opening');

        if (prefersReducedMotion) {
          envelopeWrapper.classList.add('opened');
          letterContainer.setAttribute('aria-hidden', 'false');
          letterContainer.classList.add('revealed');
          confettiTriggered = true;
          triggerConfetti();
          navStops.forEach((dot) => dot.classList.add('visited'));
        } else {
          setTimeout(function() {
            envelopeWrapper.classList.add('opened');
            letterContainer.setAttribute('aria-hidden', 'false');
            letterContainer.classList.add('revealed');

            setTimeout(function() {
              confettiTriggered = true;
              triggerConfetti();
              navStops.forEach((dot) => dot.classList.add('visited'));
            }, 600);
          }, 600);
        }
      }

      function onEnvelopeKey(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEnvelope();
        }
      }

      envelope.addEventListener('click', openEnvelope);
      envelope.addEventListener('keydown', onEnvelopeKey);
    }

    // Confetti
    function triggerConfetti() {
      if (prefersReducedMotion) return;

      const colors = ['#C4A96A', '#D4C08A', '#E8D5A3', '#3D4F5F', '#9AABB8', '#F0E6CC', '#B89A5C'];
      const shapes = ['circle', 'square', 'strip'];

      for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 5;

        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = color;
        piece.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        piece.style.animationDelay = (Math.random() * 1.5) + 's';

        if (shape === 'circle') {
          piece.style.width = size + 'px';
          piece.style.height = size + 'px';
          piece.style.borderRadius = '50%';
        } else if (shape === 'square') {
          piece.style.width = size + 'px';
          piece.style.height = size + 'px';
          piece.style.borderRadius = '2px';
        } else {
          piece.style.width = (size * 0.4) + 'px';
          piece.style.height = (size * 1.5) + 'px';
          piece.style.borderRadius = '1px';
        }

        confettiContainer.appendChild(piece);
      }

      setTimeout(() => {
        confettiContainer.innerHTML = '';
      }, 6000);
    }
  }
})();
