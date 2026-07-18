/*
 * Innovatia Learning — Year 1 desktop edition.
 * Single-page renderer. Screens: role select → learner home → subject →
 * activity player → celebration, plus adult-gated teacher and parent views.
 * Progress is stored locally (FR-031 save & resume; no cloud account needed
 * for the desktop edition). Safety reports go to the main process (FR-035).
 */
(function () {
  'use strict';

  const $app = document.getElementById('app');
  const CURRICULUM = window.CURRICULUM;
  const ACTIVITIES = window.ACTIVITIES;
  const bridge = window.innovatia || null; // absent when opened in a plain browser

  /* ---------------- progress store ---------------- */
  const STORE_KEY = 'innovatia.progress.v1';

  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(STORE_KEY));
      return p && typeof p === 'object' ? p : {};
    } catch (e) { return {}; }
  }
  function saveProgress() {
    localStorage.setItem(STORE_KEY, JSON.stringify(progress));
  }
  let progress = loadProgress(); // { [activityId]: { stars, completedAt, attempts } }

  function starsFor(id) { return progress[id] ? progress[id].stars : 0; }
  function totalStars() { return Object.values(progress).reduce((s, p) => s + (p.stars || 0), 0); }

  function subjectActivities(subjectId) { return ACTIVITIES.filter(a => a.subject === subjectId); }
  function subjectStars(subjectId) {
    return subjectActivities(subjectId).reduce((s, a) => s + starsFor(a.id), 0);
  }
  function subjectComplete(subjectId) {
    const acts = subjectActivities(subjectId);
    return acts.length > 0 && acts.every(a => starsFor(a.id) > 0);
  }

  /* ---------------- speech (FR-030 audio support) ---------------- */
  let voicesReady = false;
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = () => { voicesReady = true; };
    speechSynthesis.getVoices();
  }
  function speak(text, lang) {
    if (!('speechSynthesis' in window) || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || 'en-GB';
    u.rate = 0.9;
    u.pitch = 1.05;
    const voices = speechSynthesis.getVoices();
    const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith((lang || 'en').slice(0, 2).toLowerCase()));
    if (match) u.voice = match;
    speechSynthesis.speak(u);
  }

  /* ---------------- tiny helpers ---------------- */
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function toast(msg, good) {
    const t = el(`<div class="toast ${good ? 'good' : ''}">${esc(msg)}</div>`);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }
  function confetti(n) {
    const shapes = ['🎉', '⭐', '🎈', '✨', '🌟'];
    for (let i = 0; i < (n || 24); i++) {
      const c = el(`<div class="confetti">${shapes[i % shapes.length]}</div>`);
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDuration = (2 + Math.random() * 2.5) + 's';
      c.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5500);
    }
  }
  function subjectById(id) { return CURRICULUM.subjects.find(s => s.id === id); }
  function topicById(id) {
    for (const s of CURRICULUM.subjects)
      for (const st of s.strands)
        for (const t of st.topics)
          if (t.id === id) return { subject: s, strand: st, topic: t };
    return null;
  }

  /* ---------------- shell ---------------- */
  function renderShell(screenNode, opts) {
    opts = opts || {};
    $app.innerHTML = '';
    const bar = el(`
      <header class="topbar">
        <span class="logo">🎓</span>
        <div>
          <div class="title">Innovatia Learning</div>
          <div class="subtitle">Year 1 · Terms 1 &amp; 2 · ${esc(CURRICULUM.academicYear)}</div>
        </div>
        <div class="spacer"></div>
      </header>`);
    if (opts.showStars) {
      bar.appendChild(el(`<span class="btn-top" aria-label="My stars">⭐ ${totalStars()}</span>`));
    }
    const reportBtn = el(`<button class="btn-top report" aria-label="Tell an adult about something that worried you">🚨 Tell an adult</button>`);
    reportBtn.addEventListener('click', openReportModal);
    bar.appendChild(reportBtn);
    const homeBtn = el(`<button class="btn-top" aria-label="Safe exit to the start screen">🏠 Home</button>`);
    homeBtn.addEventListener('click', () => { speechSynthesis && speechSynthesis.cancel(); showRoleSelect(); });
    bar.appendChild(homeBtn);
    $app.appendChild(bar);
    $app.appendChild(screenNode);
  }

  /* ---------------- role select ---------------- */
  function showRoleSelect() {
    const s = el(`
      <main class="screen">
        <div class="hero-banner">
          <span class="big">🌞</span>
          <h1>Welcome to Innovatia Learning!</h1>
          <p class="lead">Who is learning today?</p>
        </div>
        <div class="role-grid"></div>
      </main>`);
    const grid = s.querySelector('.role-grid');

    const roles = [
      { icon: '🧒', name: 'I am a Learner', desc: 'Play activities and collect stars!', go: showLearnerHome },
      { icon: '🧑‍🏫', name: 'I am a Teacher', desc: 'Curriculum coverage, mastery and safety reports.', go: () => adultGate(showTeacherDashboard) },
      { icon: '👨‍👩‍👧', name: 'I am a Parent', desc: 'See progress and how to help at home.', go: () => adultGate(showParentView) }
    ];
    roles.forEach(r => {
      const card = el(`
        <button class="role-card">
          <span class="big">${r.icon}</span>
          <span class="name">${esc(r.name)}</span>
          <span class="desc">${esc(r.desc)}</span>
        </button>`);
      card.addEventListener('click', r.go);
      grid.appendChild(card);
    });
    renderShell(s, {});
  }

  /* ---------------- adult gate (simple child lock, FR-004 spirit) ---------------- */
  function adultGate(onPass) {
    const a = 3 + Math.floor(Math.random() * 6);
    const b = 4 + Math.floor(Math.random() * 6);
    const m = el(`
      <div class="modal-backdrop" role="dialog" aria-modal="true">
        <div class="modal">
          <h2>👋 Grown-ups only</h2>
          <p>This area shows teacher and parent information.<br>Please answer to continue:</p>
          <p style="font-size:26px;font-weight:800;color:var(--ink)">${a} × ${b} = ?</p>
          <input class="gate-input" inputmode="numeric" autocomplete="off" aria-label="Answer">
          <div class="option-row">
            <button class="btn-primary" data-act="ok">Continue</button>
            <button class="btn-soft" data-act="cancel">Go back</button>
          </div>
        </div>
      </div>`);
    const input = m.querySelector('input');
    function submit() {
      if (parseInt(input.value, 10) === a * b) { m.remove(); onPass(); }
      else { input.value = ''; input.placeholder = 'Try again'; }
    }
    m.querySelector('[data-act=ok]').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    m.querySelector('[data-act=cancel]').addEventListener('click', () => m.remove());
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    document.body.appendChild(m);
    input.focus();
  }

  /* ---------------- safety reporting (FR-035 / SEC-010) ---------------- */
  function openReportModal() {
    const m = el(`
      <div class="modal-backdrop" role="dialog" aria-modal="true">
        <div class="modal">
          <h2>🚨 Tell an adult</h2>
          <p>If something made you feel sad, scared or uncomfortable,<br>choose a button. A trusted adult will look at it.</p>
          <div class="option-row" style="flex-direction:column;align-items:stretch"></div>
          <button class="btn-soft" style="margin-top:16px" data-act="close">Never mind, go back</button>
        </div>
      </div>`);
    const row = m.querySelector('.option-row');
    const reasons = [
      { emoji: '😟', label: 'Something made me feel sad or scared' },
      { emoji: '🖼️', label: 'I saw a picture or words that felt wrong' },
      { emoji: '🙋', label: 'I need help from my teacher' }
    ];
    reasons.forEach(r => {
      const b = el(`<button class="btn-option" style="min-height:64px;flex-direction:row"><span class="emoji" style="font-size:28px">${r.emoji}</span> ${esc(r.label)}</button>`);
      b.addEventListener('click', async () => {
        const payload = { reporterRole: 'learner', context: r.label };
        if (bridge) {
          await bridge.submitSafetyReport(payload);
        } else {
          const key = 'innovatia.safetyReports';
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          list.push(Object.assign({ id: 'SR-' + Date.now(), createdAt: new Date().toISOString(), status: 'Open' }, payload));
          localStorage.setItem(key, JSON.stringify(list));
        }
        m.remove();
        toast('✅ Thank you for telling us. A trusted adult will check.', true);
        speak('Thank you for telling us. A trusted adult will check.');
      });
      row.appendChild(b);
    });
    m.querySelector('[data-act=close]').addEventListener('click', () => m.remove());
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    document.body.appendChild(m);
  }

  async function getSafetyReports() {
    if (bridge) return bridge.listSafetyReports();
    return JSON.parse(localStorage.getItem('innovatia.safetyReports') || '[]');
  }

  /* ---------------- learner home ---------------- */
  function showLearnerHome() {
    const s = el(`
      <main class="screen">
        <h1>Pick a subject! 🎒</h1>
        <p class="lead">Tap a subject to see your activities. Collect ⭐ for every activity you finish!</p>
        <div class="subject-grid"></div>
      </main>`);
    const grid = s.querySelector('.subject-grid');
    CURRICULUM.subjects.forEach(sub => {
      const acts = subjectActivities(sub.id);
      const stars = subjectStars(sub.id);
      const done = subjectComplete(sub.id);
      const card = el(`
        <button class="subject-card" style="background:${sub.color}">
          <span class="stars">⭐ ${stars}${done ? ' 🏅' : ''}</span>
          <span class="icon">${sub.icon}</span>
          <span class="name">${esc(sub.name)}</span>
          <span class="meta">${acts.length} activities</span>
        </button>`);
      card.addEventListener('click', () => showSubject(sub.id));
      grid.appendChild(card);
    });
    renderShell(s, { showStars: true });
  }

  /* ---------------- subject view ---------------- */
  function showSubject(subjectId) {
    const sub = subjectById(subjectId);
    const acts = subjectActivities(subjectId);
    const s = el(`
      <main class="screen">
        <button class="btn-back">⬅️ All subjects</button>
        <h1>${sub.icon} ${esc(sub.name)}</h1>
        <p class="lead">Tap an activity to start playing!</p>
        <div class="activity-grid"></div>
      </main>`);
    s.querySelector('.btn-back').addEventListener('click', showLearnerHome);
    const grid = s.querySelector('.activity-grid');
    acts.forEach(a => {
      const stars = starsFor(a.id);
      const starStr = stars ? '⭐'.repeat(stars) : '';
      const card = el(`
        <button class="activity-card" style="border-left-color:${sub.color}">
          <span class="icon">${a.icon}</span>
          <span class="name">${esc(a.title)}</span>
          <span class="obj">${esc(a.objective)}</span>
          <span class="badge-row"><span class="chip">Term ${a.term}</span>${starStr || '<span class="chip">New!</span>'}</span>
        </button>`);
      card.addEventListener('click', () => startActivity(a));
      grid.appendChild(card);
    });
    renderShell(s, { showStars: true });
  }

  /* ---------------- activity player ---------------- */
  function startActivity(activity) {
    const state = { step: 0, mistakes: 0, total: activity.steps.length };
    renderStep(activity, state);
  }

  function renderStep(activity, state) {
    const sub = subjectById(activity.subject);
    const step = activity.steps[state.step];
    const pct = Math.round((state.step / state.total) * 100);

    const s = el(`
      <main class="screen">
        <div class="player">
          <button class="btn-back">⬅️ Stop and go back</button>
          <div class="player-head">
            <span class="icon">${activity.icon}</span>
            <div>
              <div class="title">${esc(activity.title)}</div>
              <div class="obj">${esc(activity.objective)}</div>
            </div>
          </div>
          <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width:${Math.max(pct, 4)}%"></div>
          </div>
          <div class="step-card"></div>
        </div>
      </main>`);
    s.querySelector('.btn-back').addEventListener('click', () => { speechSynthesis && speechSynthesis.cancel(); showSubject(activity.subject); });

    const card = s.querySelector('.step-card');
    card.appendChild(el(`<div class="prompt">${esc(step.prompt)}</div>`));
    if (step.visual) card.appendChild(el(`<div class="visual" aria-hidden="true">${step.visual}</div>`));
    if (step.say) {
      const btn = el(`<button class="btn-audio" aria-label="Hear the question again">🔊 Listen</button>`);
      btn.addEventListener('click', () => speak(step.say, step.lang));
      card.appendChild(btn);
    }

    const feedback = el(`<div class="feedback-line" aria-live="polite"></div>`);

    function onStepDone() {
      speechSynthesis && speechSynthesis.cancel();
      state.step += 1;
      if (state.step >= state.total) finishActivity(activity, state);
      else renderStep(activity, state);
    }
    function cheer() {
      const msgs = ['Well done!', 'Great job!', 'Fantastic!', 'You did it!', 'Super!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      feedback.className = 'feedback-line good';
      feedback.textContent = '🎉 ' + msg;
      speak(msg);
    }
    function tryAgain() {
      state.mistakes += 1;
      feedback.className = 'feedback-line try';
      feedback.textContent = '💛 Nearly! Try again.';
      speak('Nearly! Try again.');
    }

    const mechanics = { choice: renderChoice, order: renderOrder, sort: renderSort, type: renderType, draw: renderDraw };
    mechanics[activity.type](card, step, { cheer, tryAgain, done: onStepDone });
    card.appendChild(feedback);

    renderShell(s, { showStars: true });
    if (step.say) setTimeout(() => speak(step.say, step.lang), 350);
  }

  /* choice: tap the right answer */
  function renderChoice(card, step, hooks) {
    const row = el(`<div class="option-row"></div>`);
    const order = shuffle(step.options.map((o, i) => ({ o, i })));
    order.forEach(({ o, i }) => {
      const b = el(`<button class="btn-option">${o.emoji ? `<span class="emoji">${o.emoji}</span>` : ''}<span>${esc(o.label)}</span></button>`);
      b.addEventListener('click', () => {
        if (i === step.answer) {
          row.querySelectorAll('button').forEach(x => x.disabled = true);
          b.classList.add('correct');
          hooks.cheer();
          setTimeout(hooks.done, 1100);
        } else {
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 600);
          hooks.tryAgain();
        }
      });
      row.appendChild(b);
    });
    card.appendChild(row);
  }

  /* order: tap items in the correct sequence */
  function renderOrder(card, step, hooks) {
    const slots = el(`<div class="order-slots"></div>`);
    const pool = el(`<div class="order-pool"></div>`);
    const placed = [];
    step.items.forEach(() => slots.appendChild(el(`<div class="slot">?</div>`)));

    shuffle(step.items.map((it, i) => ({ it, i }))).forEach(({ it, i }) => {
      const b = el(`<button class="btn-option" style="min-height:70px">${it.emoji ? `<span class="emoji">${it.emoji}</span>` : ''}<span>${esc(it.label)}</span></button>`);
      b.addEventListener('click', () => {
        if (i === placed.length) {
          const slot = slots.children[placed.length];
          slot.textContent = (it.emoji ? it.emoji + ' ' : '') + it.label;
          slot.classList.add('filled');
          placed.push(i);
          b.disabled = true;
          b.style.visibility = 'hidden';
          if (placed.length === step.items.length) {
            hooks.cheer();
            setTimeout(hooks.done, 1100);
          }
        } else {
          b.classList.add('wrong');
          setTimeout(() => b.classList.remove('wrong'), 600);
          hooks.tryAgain();
        }
      });
      pool.appendChild(b);
    });
    card.appendChild(slots);
    card.appendChild(pool);
  }

  /* sort: drag (or tap-tap) items into bins */
  function renderSort(card, step, hooks) {
    const bins = el(`<div class="sort-bins"></div>`);
    const pool = el(`<div class="sort-pool"></div>`);
    let remaining = step.items.length;
    let selected = null; // tap-to-place fallback for touch/keyboard

    function place(itemBtn, itemData, binIdx, binNode) {
      if (binIdx === itemData.bin) {
        itemBtn.classList.remove('selected');
        itemBtn.classList.add('placed', 'placed-correct');
        itemBtn.draggable = false;
        itemBtn.disabled = true;
        binNode.querySelector('.bin-items').appendChild(itemBtn);
        remaining -= 1;
        if (remaining === 0) {
          hooks.cheer();
          setTimeout(hooks.done, 1100);
        }
      } else {
        itemBtn.classList.add('wrong');
        setTimeout(() => itemBtn.classList.remove('wrong'), 600);
        hooks.tryAgain();
      }
      selected = null;
      pool.querySelectorAll('.sort-item').forEach(x => x.classList.remove('selected'));
    }

    step.bins.forEach((b, binIdx) => {
      const bin = el(`
        <div class="bin" data-bin="${binIdx}">
          <div class="bin-title">${b.emoji || ''} ${esc(b.label)}</div>
          <div class="bin-items"></div>
        </div>`);
      bin.addEventListener('dragover', e => { e.preventDefault(); bin.classList.add('dragover'); });
      bin.addEventListener('dragleave', () => bin.classList.remove('dragover'));
      bin.addEventListener('drop', e => {
        e.preventDefault();
        bin.classList.remove('dragover');
        const id = e.dataTransfer.getData('text/plain');
        const itemBtn = pool.querySelector(`[data-item="${id}"]`);
        if (itemBtn) place(itemBtn, step.items[Number(id)], binIdx, bin);
      });
      bin.addEventListener('click', () => {
        if (selected !== null) {
          const itemBtn = pool.querySelector(`[data-item="${selected}"]`);
          if (itemBtn) place(itemBtn, step.items[selected], binIdx, bin);
        }
      });
      bins.appendChild(bin);
    });

    shuffle(step.items.map((it, i) => ({ it, i }))).forEach(({ it, i }) => {
      const b = el(`<button class="sort-item" draggable="true" data-item="${i}">${it.emoji ? `<span class="emoji">${it.emoji}</span>` : ''}${esc(it.label)}</button>`);
      b.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', String(i)));
      b.addEventListener('click', () => {
        pool.querySelectorAll('.sort-item').forEach(x => x.classList.remove('selected'));
        selected = i;
        b.classList.add('selected');
      });
      pool.appendChild(b);
    });

    card.appendChild(bins);
    card.appendChild(el(`<p style="margin-top:16px;color:var(--ink-soft);font-size:14px">Drag a card into a box — or tap the card, then tap the box.</p>`));
    card.appendChild(pool);
  }

  /* type: keyboard practice */
  function renderType(card, step, hooks) {
    const target = step.target.toLowerCase();
    const display = el(`<div class="type-target"></div>`);
    const input = el(`<input class="type-input" autocomplete="off" spellcheck="false" aria-label="Type here">`);

    function paint(value) {
      display.innerHTML = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        const ok = i < value.length && value[i] === ch;
        display.appendChild(el(`<span class="${ok ? 'done' : 'todo'}">${esc(ch)}</span>`));
      }
    }
    paint('');
    input.addEventListener('input', () => {
      let v = input.value.toLowerCase();
      // keep only a correct prefix so young learners always see forward progress
      let keep = '';
      for (let i = 0; i < v.length && i < target.length; i++) {
        if (v[i] === target[i]) keep += v[i]; else break;
      }
      if (keep !== v) {
        input.value = keep;
        hooks.tryAgain();
      }
      paint(keep);
      if (keep === target) {
        input.disabled = true;
        hooks.cheer();
        setTimeout(hooks.done, 1100);
      }
    });
    card.appendChild(display);
    card.appendChild(input);
    setTimeout(() => input.focus(), 300);
  }

  /* draw: free canvas with palette; teacher-observed completion */
  function renderDraw(card, step, hooks) {
    const wrap = el(`<div class="draw-wrap"></div>`);
    const canvas = el(`<canvas id="drawCanvas" width="640" height="380" aria-label="Drawing board"></canvas>`);
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    let color = '#e8556d';
    let drawing = false;
    let drew = false;

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: (p.clientX - r.left) * (canvas.width / r.width), y: (p.clientY - r.top) * (canvas.height / r.height) };
    }
    function down(e) { drawing = true; drew = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
    function move(e) { if (!drawing) return; const p = pos(e); ctx.strokeStyle = color; ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); }
    function up() { drawing = false; }
    canvas.addEventListener('mousedown', down); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down); canvas.addEventListener('touchmove', move); canvas.addEventListener('touchend', up);

    const palette = el(`<div class="palette"></div>`);
    ['#e8556d', '#2f7de1', '#1fa06a', '#f4b71a', '#6a51c7', '#8a5a2b', '#111111'].forEach((c, i) => {
      const sw = el(`<button class="swatch ${i === 0 ? 'active' : ''}" style="background:${c}" aria-label="Colour ${i + 1}"></button>`);
      sw.addEventListener('click', () => {
        color = c;
        palette.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
        sw.classList.add('active');
      });
      palette.appendChild(sw);
    });

    const controls = el(`<div class="option-row" style="margin-top:6px"></div>`);
    const clearBtn = el(`<button class="btn-soft">🧽 Start again</button>`);
    clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    const doneBtn = el(`<button class="btn-primary" style="margin-top:0">✅ I am finished!</button>`);
    doneBtn.addEventListener('click', () => {
      if (!drew) { hooks.tryAgain(); return; }
      hooks.cheer();
      setTimeout(hooks.done, 1100);
    });
    controls.appendChild(clearBtn);
    controls.appendChild(doneBtn);

    wrap.appendChild(palette);
    wrap.appendChild(canvas);
    wrap.appendChild(controls);
    card.appendChild(wrap);
  }

  /* ---------------- celebration & scoring ---------------- */
  function finishActivity(activity, state) {
    // 3 stars = no mistakes, 2 = a couple, 1 = finished. Never a fail — SRS 13.1
    // avoids negative labels for Year 1 learners.
    const stars = state.mistakes === 0 ? 3 : state.mistakes <= 2 ? 2 : 1;
    const prev = progress[activity.id];
    progress[activity.id] = {
      stars: Math.max(stars, prev ? prev.stars : 0),
      completedAt: new Date().toISOString(),
      attempts: (prev ? prev.attempts : 0) + 1
    };
    saveProgress();

    const sub = subjectById(activity.subject);
    const gotBadge = subjectComplete(activity.subject);
    const s = el(`
      <main class="screen">
        <div class="celebrate">
          <span class="big">🎉</span>
          <h1>You finished ${esc(activity.title)}!</h1>
          <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <p class="msg">${esc(activity.objective)}</p>
          ${gotBadge ? `<p class="msg" style="margin-top:12px;font-size:22px">🏅 You earned the <b>${esc(sub.name)}</b> badge!</p>` : ''}
          <div class="option-row">
            <button class="btn-primary" data-act="more">🎒 More ${esc(sub.name)}</button>
            <button class="btn-soft" data-act="home" style="align-self:center">🏠 All subjects</button>
          </div>
        </div>
      </main>`);
    s.querySelector('[data-act=more]').addEventListener('click', () => showSubject(activity.subject));
    s.querySelector('[data-act=home]').addEventListener('click', showLearnerHome);
    renderShell(s, { showStars: true });
    confetti(stars * 10);
    toast('✅ Your work is saved!', true);
    speak(stars === 3 ? 'Amazing! Three stars!' : 'Well done! You finished the activity!');
  }

  /* ---------------- teacher dashboard ---------------- */
  async function showTeacherDashboard() {
    const totalActs = ACTIVITIES.length;
    const doneActs = ACTIVITIES.filter(a => starsFor(a.id) > 0).length;
    const allTopics = [];
    CURRICULUM.subjects.forEach(sub => sub.strands.forEach(st => st.topics.forEach(t => allTopics.push({ sub, st, t }))));
    const coveredTopics = allTopics.filter(({ t }) => ACTIVITIES.some(a => a.topicId === t.id));
    const reports = await getSafetyReports();

    const s = el(`
      <main class="screen">
        <button class="btn-back">⬅️ Start screen</button>
        <h1>🧑‍🏫 Teacher Dashboard</h1>
        <p class="lead">Curriculum coverage and learner progress for Year 1, Terms 1 &amp; 2 (${esc(CURRICULUM.academicYear)}). This desktop edition tracks the learner on this device.</p>
        <div class="stat-row">
          <div class="stat-tile"><div class="value">${allTopics.length}</div><div class="label">Curriculum topics configured</div></div>
          <div class="stat-tile"><div class="value">${coveredTopics.length}</div><div class="label">Topics with digital activities</div></div>
          <div class="stat-tile"><div class="value">${doneActs} / ${totalActs}</div><div class="label">Activities completed on this device</div></div>
          <div class="stat-tile"><div class="value">${totalStars()}</div><div class="label">Stars earned</div></div>
          <div class="stat-tile"><div class="value">${reports.length}</div><div class="label">Safety reports (🚨)</div></div>
        </div>
        <h2>Curriculum coverage by subject (FR-025)</h2>
        <table class="report" id="covTable">
          <thead><tr><th>Subject</th><th>Activities done</th><th>Coverage</th><th>Stars</th><th>Status</th></tr></thead>
          <tbody></tbody>
        </table>
        <h2>Topic catalogue &amp; delivery status</h2>
        <table class="report" id="topicTable">
          <thead><tr><th>Subject</th><th>Strand</th><th>Topic</th><th>Term</th><th>Status</th></tr></thead>
          <tbody></tbody>
        </table>
        <h2>Safety reports (SEC-010)</h2>
        <div id="safetyList"></div>
      </main>`);
    s.querySelector('.btn-back').addEventListener('click', showRoleSelect);

    const covBody = s.querySelector('#covTable tbody');
    CURRICULUM.subjects.forEach(sub => {
      const acts = subjectActivities(sub.id);
      const done = acts.filter(a => starsFor(a.id) > 0).length;
      const pct = acts.length ? Math.round((done / acts.length) * 100) : 0;
      const status = pct === 100 ? '<span class="pill done">Complete</span>' : pct > 0 ? '<span class="pill progress">In progress</span>' : '<span class="pill todo">Not started</span>';
      covBody.appendChild(el(`
        <tr>
          <td>${sub.icon} ${esc(sub.name)}</td>
          <td>${done} / ${acts.length}</td>
          <td><span class="coverage-bar"><span style="width:${pct}%"></span></span> ${pct}%</td>
          <td>⭐ ${subjectStars(sub.id)}</td>
          <td>${status}</td>
        </tr>`));
    });

    const topicBody = s.querySelector('#topicTable tbody');
    allTopics.forEach(({ sub, st, t }) => {
      const acts = ACTIVITIES.filter(a => a.topicId === t.id);
      const done = acts.length > 0 && acts.every(a => starsFor(a.id) > 0);
      const started = acts.some(a => starsFor(a.id) > 0);
      const status = acts.length === 0
        ? '<span class="pill todo">Planned (no digital activity yet)</span>'
        : done ? '<span class="pill done">Assessed</span>'
        : started ? '<span class="pill progress">In progress</span>'
        : '<span class="pill todo">Assigned</span>';
      topicBody.appendChild(el(`
        <tr>
          <td>${sub.icon} ${esc(sub.name)}</td>
          <td>${esc(st.name)}</td>
          <td>${esc(t.name)}</td>
          <td>Term ${t.term}</td>
          <td>${status}</td>
        </tr>`));
    });

    const list = s.querySelector('#safetyList');
    if (reports.length === 0) {
      list.appendChild(el(`<p class="lead">No safety reports — nothing has been flagged on this device. 💚</p>`));
    } else {
      const tbl = el(`<table class="report"><thead><tr><th>ID</th><th>When</th><th>Reported by</th><th>What happened</th><th>Status</th></tr></thead><tbody></tbody></table>`);
      reports.slice().reverse().forEach(r => {
        tbl.querySelector('tbody').appendChild(el(`
          <tr>
            <td>${esc(r.id)}</td>
            <td>${esc(new Date(r.createdAt).toLocaleString())}</td>
            <td>${esc(r.reporterRole)}</td>
            <td>${esc(r.context)}</td>
            <td><span class="pill progress">${esc(r.status)}</span></td>
          </tr>`));
      });
      list.appendChild(tbl);
    }
    renderShell(s, {});
  }

  /* ---------------- parent view ---------------- */
  function showParentView() {
    const doneActs = ACTIVITIES.filter(a => starsFor(a.id) > 0);
    const s = el(`
      <main class="screen">
        <button class="btn-back">⬅️ Start screen</button>
        <h1>👨‍👩‍👧 Parent View</h1>
        <p class="lead">A friendly summary of your child's learning on this device — and simple ways you can help at home. (FR-046, FR-047)</p>
        <div class="stat-row">
          <div class="stat-tile"><div class="value">${doneActs.length}</div><div class="label">Activities your child finished</div></div>
          <div class="stat-tile"><div class="value">⭐ ${totalStars()}</div><div class="label">Stars collected</div></div>
          <div class="stat-tile"><div class="value">${CURRICULUM.subjects.filter(x => subjectComplete(x.id)).length}</div><div class="label">Subject badges earned 🏅</div></div>
        </div>
        <h2>Progress by subject</h2>
        <table class="report"><thead><tr><th>Subject</th><th>Progress</th><th>How you can help at home</th></tr></thead><tbody id="pBody"></tbody></table>
      </main>`);
    s.querySelector('.btn-back').addEventListener('click', showRoleSelect);

    const tips = {
      literacy: 'Read a bedtime story together and ask “what happened first, next, last?”',
      numeracy: 'Count objects at home — spoons, buttons, oranges. Play “which group has more?”',
      science: 'At bath time, guess together which toys will float and which will sink.',
      uoi: 'Talk about your family, your town and who helps in your community.',
      ict: 'Remind your child: passwords are secret, and always tell an adult if something online feels wrong.',
      french: 'Say “Bonjour!” and “Merci!” together at breakfast — little and often works best.',
      arts: 'Sing together, clap rhythms, and put their drawings up at home.'
    };
    const body = s.querySelector('#pBody');
    CURRICULUM.subjects.forEach(sub => {
      const acts = subjectActivities(sub.id);
      const done = acts.filter(a => starsFor(a.id) > 0).length;
      const pct = acts.length ? Math.round((done / acts.length) * 100) : 0;
      body.appendChild(el(`
        <tr>
          <td>${sub.icon} ${esc(sub.name)}</td>
          <td><span class="coverage-bar"><span style="width:${pct}%"></span></span> ${done} of ${acts.length}</td>
          <td>${esc(tips[sub.id] || '')}</td>
        </tr>`));
    });
    renderShell(s, {});
  }

  /* ---------------- boot ---------------- */
  showRoleSelect();
})();
