/*
 * Interactive activity engine (v2).
 * Renders each activity type into the overlay, handles the interaction, gives
 * immediate child-friendly feedback (FR-032), reads prompts aloud, plays gentle
 * sound effects, celebrates success with stars/badges (FR-034) and never
 * publicly ranks learners (BR-008).
 *
 * Public API:
 *   Activities.open(subject, topic, onClose)     - a fixed topic (array of activities)
 *   Activities.openPractice(category, onClose)   - endless generated practice
 *   Activities.close()
 */
(function () {
  const overlay = document.getElementById('overlay');
  const bodyEl = document.getElementById('activityBody');
  const footEl = document.getElementById('activityFoot');
  const progressEl = document.getElementById('activityProgress');
  const celebrateEl = document.getElementById('celebrate');

  let session = null;

  const CHEERS = ['⭐ Well done!', '🌟 Brilliant!', '🎉 You did it!', '👏 Great job!',
    '💫 Superstar!', '🙌 Amazing!', '✨ Fantastic!'];

  /* --------------------------- session control --------------------------- */
  function open(subject, topic, onClose) {
    session = { mode: 'topic', subject, topic, index: 0, onClose };
    overlay.classList.remove('hidden');
    renderStep();
  }

  function openPractice(category, onClose) {
    session = { mode: 'practice', category, count: 0, correct: 0, onClose };
    overlay.classList.remove('hidden');
    nextPractice();
  }

  function close() {
    overlay.classList.add('hidden');
    bodyEl.innerHTML = '';
    footEl.innerHTML = '';
    const cb = session && session.onClose;
    session = null;
    if (cb) cb();
  }

  /* ------------------------------- topic mode ------------------------------ */
  function renderStep() {
    const { topic, index } = session;
    if (index >= topic.activities.length) return close();
    const activity = topic.activities[index];
    progressEl.innerHTML = topic.activities
      .map((_, i) => {
        const cls = i < index ? 'done' : i === index ? 'current' : '';
        return `<span class="dot ${cls}"></span>`;
      })
      .join('');
    renderActivity(activity);
  }
  function next() { session.index += 1; renderStep(); }

  /* ------------------------------ practice mode ---------------------------- */
  function nextPractice() {
    session.count += 1;
    session.current = window.Practice.generate(session.category.id);
    progressEl.innerHTML =
      `<span class="practice-score">${session.category.icon} ${escapeHtml(session.category.name)}` +
      ` · Question ${session.count} · Score ${session.correct} ⭐</span>`;
    renderActivity(session.current);
  }

  /* --------------------------- render one activity ------------------------- */
  function renderActivity(activity) {
    bodyEl.innerHTML = '';
    footEl.innerHTML = '';

    const promptRow = document.createElement('div');
    promptRow.className = 'prompt-row';
    const p = document.createElement('p');
    p.className = 'activity-prompt';
    p.textContent = activity.prompt;
    const say = document.createElement('button');
    say.className = 'read-aloud';
    say.title = 'Read it to me';
    say.textContent = '🔊';
    say.onclick = () => speak(activity.say || activity.prompt, activity.lang || 'en-US');
    promptRow.append(p, say);
    bodyEl.appendChild(promptRow);

    const holder = document.createElement('div');
    bodyEl.appendChild(holder);

    const ctx = makeContext(activity, holder);
    const renderer = RENDERERS[activity.type];
    if (renderer) renderer(activity, ctx);
    else holder.textContent = 'Activity type not supported: ' + activity.type;

    // Friendly: read the question aloud once, shortly after it appears.
    setTimeout(() => speak(activity.say || activity.prompt, activity.lang || 'en-US'), 300);
  }

  /* --------------------------- shared context --------------------------- */
  function makeContext(activity, holder) {
    let finalized = false;

    function feedback(text, kind) {
      let fb = footEl.querySelector('.feedback');
      if (!fb) {
        fb = document.createElement('span');
        fb.className = 'feedback';
        footEl.insertBefore(fb, footEl.firstChild);
      }
      fb.textContent = text;
      fb.className = 'feedback ' + (kind || '');
      if (kind === 'bad') playBad();
    }

    function setCheck(label, onCheck) {
      let btn = footEl.querySelector('.btn-check');
      if (!btn) {
        btn = document.createElement('button');
        btn.className = 'btn-primary btn-check';
        footEl.appendChild(btn);
      }
      btn.textContent = label || 'Check my answer';
      btn.onclick = onCheck;
      return btn;
    }

    function showNext() {
      footEl.querySelectorAll('.btn-check').forEach((b) => b.remove());
      const btn = document.createElement('button');
      btn.className = 'btn-primary btn-next';
      if (session.mode === 'practice') {
        btn.textContent = 'Next question →';
        btn.onclick = nextPractice;
      } else {
        const last = session.index >= session.topic.activities.length - 1;
        btn.textContent = last ? '🎉 Finish' : 'Next →';
        btn.onclick = next;
      }
      footEl.appendChild(btn);
    }

    function solved(correct) {
      if (finalized) return;
      finalized = true;
      let firstSolve = true;
      if (session.mode === 'practice') {
        if (correct) session.correct += 1;
        Progress.recordPractice(session.category.id, correct);
      } else {
        firstSolve = Progress.recordActivity(activity, session.topic.id, correct).firstSolve;
      }
      updateStarBadge();
      if (correct) {
        playGood();
        feedback(pick(CHEERS), 'good');
        // Bigger celebration every 5th practice answer, or on topic solves.
        if (session.mode !== 'practice' || session.correct % 5 === 0) celebrate();
        else miniCelebrate();
        showNext();
      }
    }

    return { holder, activity, feedback, setCheck, solved, speak, isFinal: () => finalized };
  }

  /* ------------------------------ renderers ------------------------------ */
  const RENDERERS = {
    choice: renderChoice, phonics: renderPhonics, pattern: renderPattern,
    count: renderCount, match: renderMatch, order: renderOrder, sort: renderSort,
    fraction: renderFraction, type: renderType, report: renderReport
  };

  function renderOptionButtons(options, holder, ctx, extraClass) {
    const grid = document.createElement('div');
    grid.className = 'options ' + (extraClass || '');
    options.forEach((opt) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = opt.label;
      b.onclick = () => {
        if (ctx.isFinal()) return;
        if (opt.correct) {
          b.classList.add('correct');
          grid.querySelectorAll('.option').forEach((x) => x.classList.add('disabled'));
          ctx.solved(true);
        } else {
          b.classList.add('wrong');
          ctx.feedback('Not quite — try again! 🙂', 'bad');
          setTimeout(() => b.classList.remove('wrong'), 700);
        }
      };
      grid.appendChild(b);
    });
    holder.appendChild(grid);
  }

  function renderChoice(activity, ctx) {
    renderOptionButtons(activity.options, ctx.holder, ctx);
  }

  function renderPattern(activity, ctx) {
    const seq = document.createElement('div');
    seq.className = 'options';
    seq.style.gridTemplateColumns = 'repeat(auto-fit, minmax(70px, 90px))';
    seq.style.justifyContent = 'center';
    activity.sequence.forEach((s) => {
      const cell = document.createElement('div');
      cell.className = 'option disabled';
      cell.style.pointerEvents = 'none';
      cell.textContent = s;
      seq.appendChild(cell);
    });
    const q = document.createElement('div');
    q.className = 'option disabled';
    q.textContent = '❓';
    q.style.pointerEvents = 'none';
    seq.appendChild(q);
    ctx.holder.appendChild(seq);

    const label = document.createElement('p');
    label.style.textAlign = 'center';
    label.style.color = '#5a6b83';
    label.style.margin = '18px 0 10px';
    label.textContent = 'Choose what comes next:';
    ctx.holder.appendChild(label);
    renderOptionButtons(activity.options, ctx.holder, ctx);
  }

  function renderPhonics(activity, ctx) {
    const wrap = document.createElement('div');
    wrap.className = 'audio-wrap';
    const btn = document.createElement('button');
    btn.className = 'audio-btn';
    btn.innerHTML = '🔊 Play the sound';
    btn.onclick = () => speak(activity.say, activity.lang || 'en-US');
    wrap.appendChild(btn);
    ctx.holder.appendChild(wrap);
    setTimeout(() => speak(activity.say, activity.lang || 'en-US'), 450);
    renderOptionButtons(activity.options, ctx.holder, ctx);
  }

  function renderCount(activity, ctx) {
    const tapped = new Set();
    const area = document.createElement('div');
    area.className = 'count-area';
    for (let i = 0; i < activity.answer; i++) {
      const item = document.createElement('span');
      item.className = 'count-item';
      item.textContent = activity.emoji;
      item.setAttribute('role', 'button');
      item.onclick = () => {
        if (tapped.has(i)) return;
        tapped.add(i);
        item.classList.add('tapped');
        playTick();
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = tapped.size;
        item.appendChild(badge);
      };
      area.appendChild(item);
    }
    ctx.holder.appendChild(area);

    const hint = document.createElement('p');
    hint.className = 'count-hint';
    hint.textContent = 'Tap each one to count. Then choose the number.';
    ctx.holder.appendChild(hint);

    const answer = activity.answer;
    const set = new Set([answer, answer - 1, answer + 1, answer + 2]);
    const nums = [...set].filter((n) => n > 0).sort((a, b) => a - b);
    const opts = nums.map((n) => ({ label: String(n), correct: n === answer }));
    renderOptionButtons(opts, ctx.holder, ctx, 'count-options');
  }

  function renderMatch(activity, ctx) {
    const pairs = activity.pairs;
    const lefts = pairs.map((p, i) => ({ text: p.left, key: i }));
    const rights = shuffle(pairs.map((p, i) => ({ text: p.right, key: i })));
    let selected = null;
    let matchedCount = 0;

    const area = document.createElement('div');
    area.className = 'match-area';
    const colL = document.createElement('div');
    colL.className = 'match-col';
    const colR = document.createElement('div');
    colR.className = 'match-col';

    function tileClick(tile, side, key) {
      if (tile.classList.contains('matched')) return;
      if (!selected) {
        if (side !== 'L') return;
        selected = { tile, key };
        tile.classList.add('selected');
        return;
      }
      if (side === 'L') {
        selected.tile.classList.remove('selected');
        selected = { tile, key };
        tile.classList.add('selected');
        return;
      }
      if (key === selected.key) {
        selected.tile.classList.remove('selected');
        selected.tile.classList.add('matched');
        tile.classList.add('matched');
        selected = null;
        matchedCount += 1;
        playTick();
        if (matchedCount === pairs.length) ctx.solved(true);
      } else {
        tile.classList.add('wrong-flash');
        ctx.feedback('Try another one 🙂', 'bad');
        setTimeout(() => tile.classList.remove('wrong-flash'), 600);
      }
    }

    lefts.forEach((l) => {
      const t = document.createElement('button');
      t.className = 'match-tile';
      t.textContent = l.text;
      t.onclick = () => tileClick(t, 'L', l.key);
      colL.appendChild(t);
    });
    rights.forEach((r) => {
      const t = document.createElement('button');
      t.className = 'match-tile';
      t.textContent = r.text;
      t.onclick = () => tileClick(t, 'R', r.key);
      colR.appendChild(t);
    });
    area.appendChild(colL);
    area.appendChild(colR);
    ctx.holder.appendChild(area);
  }

  function renderOrder(activity, ctx) {
    let order = shuffle(activity.items.slice());
    if (arraysEqual(order, activity.correctOrder) && order.length > 1) {
      order = order.slice().reverse();
    }
    const list = document.createElement('div');
    list.className = 'order-list';
    ctx.holder.appendChild(list);

    function draw() {
      list.innerHTML = '';
      order.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'token';
        const idx = document.createElement('span');
        idx.className = 'slot-index';
        idx.textContent = i + 1;
        const label = document.createElement('span');
        label.style.flex = '1';
        label.textContent = item;
        const up = document.createElement('button');
        up.className = 'btn-ghost';
        up.textContent = '▲';
        up.style.padding = '6px 12px';
        up.disabled = i === 0;
        up.onclick = () => swap(i, i - 1);
        const down = document.createElement('button');
        down.className = 'btn-ghost';
        down.textContent = '▼';
        down.style.padding = '6px 12px';
        down.disabled = i === order.length - 1;
        down.onclick = () => swap(i, i + 1);
        row.append(idx, label, up, down);
        list.appendChild(row);
      });
    }
    function swap(a, b) {
      if (ctx.isFinal()) return;
      [order[a], order[b]] = [order[b], order[a]];
      playTick();
      draw();
    }
    draw();

    ctx.setCheck('Check the order', () => {
      if (arraysEqual(order, activity.correctOrder)) {
        list.querySelectorAll('.token').forEach((t) => {
          t.classList.add('correct');
          t.style.borderColor = 'var(--good)';
          t.style.background = 'var(--good-soft)';
        });
        ctx.solved(true);
      } else {
        ctx.feedback('Nearly! Move them and try again 🙂', 'bad');
      }
    });
  }

  function renderSort(activity, ctx) {
    const remaining = shuffle(activity.items.slice());
    let picked = null;
    const source = document.createElement('div');
    source.className = 'sort-source';
    const bins = document.createElement('div');
    bins.className = 'sort-bins';
    const binState = {};
    activity.bins.forEach((name) => (binState[name] = []));

    function makeToken(item) {
      const t = document.createElement('button');
      t.className = 'token';
      t.textContent = item.label;
      t.onclick = () => {
        if (ctx.isFinal()) return;
        if (picked && picked.el === t) {
          t.style.borderColor = '';
          picked = null;
          return;
        }
        source.querySelectorAll('.token').forEach((x) => (x.style.borderColor = ''));
        picked = { item, el: t };
        t.style.borderColor = 'var(--brand-2)';
      };
      return t;
    }
    function drawSource() {
      source.innerHTML = '';
      if (remaining.length === 0) {
        const done = document.createElement('span');
        done.style.color = '#5a6b83';
        done.textContent = 'All sorted! Tap "Check my answer".';
        source.appendChild(done);
        return;
      }
      remaining.forEach((item) => source.appendChild(makeToken(item)));
    }
    function drawBins() {
      bins.innerHTML = '';
      activity.bins.forEach((name) => {
        const bin = document.createElement('div');
        bin.className = 'sort-bin';
        const hh = document.createElement('h5');
        hh.textContent = name;
        const items = document.createElement('div');
        items.className = 'bin-items';
        binState[name].forEach((entry) => {
          const tok = document.createElement('span');
          tok.className = 'token';
          tok.textContent = entry.label;
          tok.title = 'Tap to take back';
          tok.onclick = () => {
            if (ctx.isFinal()) return;
            binState[name] = binState[name].filter((e) => e !== entry);
            remaining.push(entry);
            drawSource(); drawBins();
          };
          items.appendChild(tok);
        });
        bin.appendChild(hh);
        bin.appendChild(items);
        bin.onclick = () => {
          if (ctx.isFinal() || !picked) return;
          binState[name].push(picked.item);
          const idx = remaining.indexOf(picked.item);
          if (idx >= 0) remaining.splice(idx, 1);
          picked = null;
          playTick();
          drawSource(); drawBins();
        };
        bins.appendChild(bin);
      });
    }
    drawSource(); drawBins();
    ctx.holder.appendChild(source);
    ctx.holder.appendChild(bins);

    ctx.setCheck('Check my answer', () => {
      if (remaining.length > 0) { ctx.feedback('Sort them all first 🙂', 'bad'); return; }
      let allRight = true;
      activity.bins.forEach((name) => {
        binState[name].forEach((entry) => { if (entry.bin !== name) allRight = false; });
      });
      if (allRight) {
        bins.querySelectorAll('.token').forEach((t) => t.classList.add('correct'));
        ctx.solved(true);
      } else {
        bins.querySelectorAll('.sort-bin').forEach((binEl, bi) => {
          const name = activity.bins[bi];
          binEl.querySelectorAll('.token').forEach((tok, ti) => {
            const entry = binState[name][ti];
            tok.classList.toggle('wrong', entry && entry.bin !== name);
          });
        });
        ctx.feedback('Some are in the wrong box — fix the red ones 🙂', 'bad');
      }
    });
  }

  function renderFraction(activity, ctx) {
    const target = activity.target;
    const shapes = [
      { frac: '1/2', shaded: [0, 1], parts: 2, shape: 'circle' },
      { frac: '1/4', shaded: [0], parts: 4, shape: 'square' },
      { frac: '1/3', shaded: [0], parts: 3, shape: 'circle' },
      { frac: '3/4', shaded: [0, 1, 2], parts: 4, shape: 'square' },
      { frac: '2/2', shaded: [0, 1], parts: 2, shape: 'square' }
    ];
    const correct = fractionSpec(target);
    const distractors = shuffle(shapes.filter((s) => s.frac !== target)).slice(0, 2);
    const choices = shuffle([correct, ...distractors]);
    const grid = document.createElement('div');
    grid.className = 'fraction-grid';
    choices.forEach((spec) => {
      const cell = document.createElement('button');
      cell.className = 'fraction-choice';
      cell.innerHTML = fractionSVG(spec);
      cell.onclick = () => {
        if (ctx.isFinal()) return;
        if (spec.frac === target) {
          cell.classList.add('correct');
          grid.querySelectorAll('.fraction-choice').forEach((c) => (c.style.pointerEvents = 'none'));
          ctx.solved(true);
        } else {
          cell.classList.add('wrong');
          ctx.feedback('Not that one — try again 🙂', 'bad');
          setTimeout(() => cell.classList.remove('wrong'), 700);
        }
      };
      grid.appendChild(cell);
    });
    ctx.holder.appendChild(grid);
  }

  function fractionSpec(frac) {
    if (frac === '1/2') return { frac: '1/2', shaded: [0], parts: 2, shape: 'circle' };
    if (frac === '1/4') return { frac: '1/4', shaded: [0], parts: 4, shape: 'square' };
    if (frac === '1/3') return { frac: '1/3', shaded: [0], parts: 3, shape: 'circle' };
    if (frac === '3/4') return { frac: '3/4', shaded: [0, 1, 2], parts: 4, shape: 'square' };
    return { frac: frac, shaded: [0], parts: 2, shape: 'circle' };
  }
  function fractionSVG(spec) {
    const fill = '#ED7D31', empty = '#ffffff', stroke = '#23324a';
    if (spec.shape === 'circle') {
      let paths = '';
      const cx = 60, cy = 60, r = 52;
      for (let i = 0; i < spec.parts; i++) {
        const a0 = (i / spec.parts) * 2 * Math.PI - Math.PI / 2;
        const a1 = ((i + 1) / spec.parts) * 2 * Math.PI - Math.PI / 2;
        const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const c = spec.shaded.includes(i) ? fill : empty;
        paths += `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>`;
      }
      return `<svg viewBox="0 0 120 120">${paths}</svg>`;
    }
    let rects = '';
    const w = 104 / spec.parts;
    for (let i = 0; i < spec.parts; i++) {
      const c = spec.shaded.includes(i) ? fill : empty;
      rects += `<rect x="${8 + i * w}" y="8" width="${w}" height="104" fill="${c}" stroke="${stroke}" stroke-width="2"/>`;
    }
    return `<svg viewBox="0 0 120 120">${rects}</svg>`;
  }

  function renderType(activity, ctx) {
    const input = document.createElement('input');
    input.className = 'type-input';
    input.setAttribute('aria-label', 'Type your answer');
    input.placeholder = 'Type here…';
    ctx.holder.appendChild(input);
    const accept = (activity.accept || []).map((s) => s.toLowerCase().trim());
    ctx.setCheck('Check my answer', () => {
      const val = input.value.toLowerCase().trim();
      if (accept.includes(val)) {
        input.style.borderColor = 'var(--good)';
        input.disabled = true;
        ctx.solved(true);
      } else {
        ctx.feedback('Try again 🙂', 'bad');
      }
    });
  }

  function renderReport(activity, ctx) {
    const wrap = document.createElement('div');
    wrap.className = 'report-scenario';
    const grid = document.createElement('div');
    grid.className = 'options';
    grid.style.gridTemplateColumns = '1fr';
    activity.options.forEach((text) => {
      const b = document.createElement('button');
      b.className = 'option';
      b.textContent = text;
      b.onclick = () => {
        if (ctx.isFinal()) return;
        if (text === activity.correctChoice) {
          b.classList.add('correct');
          grid.querySelectorAll('.option').forEach((x) => x.classList.add('disabled'));
          Progress.logEvent('safety-drill', { activity: activity.id });
          ctx.solved(true);
        } else {
          b.classList.add('wrong');
          ctx.feedback('The safe choice is to tell a trusted adult 🙂', 'bad');
          setTimeout(() => b.classList.remove('wrong'), 800);
        }
      };
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    ctx.holder.appendChild(wrap);
  }

  /* ------------------------------ audio/effects ------------------------------ */
  function speak(text, lang) {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'en-US';
      u.rate = 0.9;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) { /* audio optional */ }
  }

  let audioCtx = null;
  function tones(freqs, step, dur, type) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      freqs.forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type || 'sine';
        o.frequency.value = f;
        const t0 = now + i * step;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t0); o.stop(t0 + dur + 0.02);
      });
    } catch (e) { /* audio optional */ }
  }
  function playGood() { tones([523.25, 659.25, 783.99], 0.09, 0.16); }        // C-E-G
  function playBad() { tones([311.13, 246.94], 0.09, 0.16, 'triangle'); }     // gentle down
  function playTick() { tones([880], 0, 0.06, 'sine'); }

  function celebrate() {
    const emojis = ['🎉', '⭐', '🌟', '✨', '🎈', '🏆', '💫'];
    celebrateEl.classList.remove('hidden');
    celebrateEl.innerHTML = '<div class="burst">🎉</div>';
    for (let i = 0; i < 20; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.animationDuration = 0.9 + Math.random() * 0.8 + 's';
      celebrateEl.appendChild(c);
    }
    setTimeout(() => { celebrateEl.classList.add('hidden'); celebrateEl.innerHTML = ''; }, 1300);
  }
  function miniCelebrate() {
    celebrateEl.classList.remove('hidden');
    celebrateEl.innerHTML = '<div class="burst" style="font-size:64px">' + pick(['⭐', '🌟', '👏', '✨']) + '</div>';
    setTimeout(() => { celebrateEl.classList.add('hidden'); celebrateEl.innerHTML = ''; }, 700);
  }

  function updateStarBadge() {
    const el = document.getElementById('starCount');
    if (el) el.querySelector('b').textContent = Progress.stars;
  }

  /* ------------------------------- utilities ------------------------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function arraysEqual(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.Activities = { open, openPractice, close };
})();
