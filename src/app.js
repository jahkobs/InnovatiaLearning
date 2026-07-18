/*
 * Application shell & navigation (v2).
 *   - First-run onboarding registers the child's name and an adult PIN
 *   - Learner: assigned activities + endless Practice Zone (simple, visual)
 *   - Teacher / Parent (PIN-protected): dashboards, development report, printing
 */
(function () {
  const view = document.getElementById('view');
  const roleSwitch = document.getElementById('roleSwitch');

  let currentRole = 'learner';
  let currentTermId = 'term1';
  let adultUnlocked = false; // set true once the adult PIN is verified this session

  /* ------------------------------ routing ------------------------------ */
  function render() {
    if (currentRole === 'learner') return renderLearnerHome();
    if (currentRole === 'teacher') return renderTeacherDash();
    if (currentRole === 'parent') return renderParentView();
    if (currentRole === 'report') return renderReportView();
  }
  function currentTerm() { return CURRICULUM.terms.find((t) => t.id === currentTermId); }

  /* --------------------------- learner: home --------------------------- */
  function renderLearnerHome() {
    const term = currentTerm();
    view.innerHTML = '';

    view.appendChild(h('h1', 'page-title', `Hello, ${Profile.childName()}! Let’s learn 🌟`));
    view.appendChild(h('p', 'page-sub',
      `${CURRICULUM.yearLevel} · ${term.name} · Tap a subject to start.`));

    // Practice Zone + Print row
    const quick = document.createElement('div');
    quick.className = 'quick-row';
    const practice = document.createElement('button');
    practice.className = 'quick-card practice';
    practice.setAttribute('data-quick', 'practice');
    practice.innerHTML = '<span class="q-icon">♾️</span><b>Practice Zone</b><span>Unlimited questions</span>';
    practice.onclick = renderPracticeZone;
    const print = document.createElement('button');
    print.className = 'quick-card print';
    print.setAttribute('data-quick', 'print');
    print.innerHTML = '<span class="q-icon">🖨️</span><b>Print a worksheet</b><span>Do it on paper</span>';
    print.onclick = () => Worksheet.print('all');
    quick.append(practice, print);
    view.appendChild(quick);

    view.appendChild(renderTermTabs());

    const grid = document.createElement('div');
    grid.className = 'subject-grid';
    term.subjects.forEach((subject) => {
      const cov = Progress.subjectCoverage(subject);
      const card = document.createElement('div');
      card.className = 'subject-card';
      card.setAttribute('data-subject', subject.id);
      card.style.borderTopColor = subject.color;

      const icon = h('div', 'subj-icon', subject.icon);
      icon.style.background = hexToSoft(subject.color);
      card.appendChild(icon);
      card.appendChild(h('h3', '', subject.subject));
      card.appendChild(h('p', 'strand', subject.strand));

      const meta = document.createElement('div');
      meta.className = 'subj-meta';
      const pill = document.createElement('div');
      pill.className = 'progress-pill';
      const fill = document.createElement('span');
      fill.style.width = cov.pct + '%';
      fill.style.background = subject.color;
      pill.appendChild(fill);
      meta.appendChild(pill);
      meta.appendChild(h('span', '', cov.pct + '%'));
      card.appendChild(meta);

      card.onclick = () => renderTopicList(subject);
      grid.appendChild(card);
    });
    view.appendChild(grid);
  }

  function renderTermTabs() {
    const tabs = document.createElement('div');
    tabs.className = 'term-tabs';
    CURRICULUM.terms.forEach((t) => {
      const b = document.createElement('button');
      b.textContent = t.name;
      if (t.id === currentTermId) b.classList.add('active');
      b.onclick = () => { currentTermId = t.id; render(); };
      tabs.appendChild(b);
    });
    return tabs;
  }

  /* ------------------------ learner: topic list ------------------------ */
  function renderTopicList(subject) {
    view.innerHTML = '';
    const back = h('button', 'back-link', '← All subjects');
    back.onclick = renderLearnerHome;
    view.appendChild(back);

    view.appendChild(h('h1', 'page-title', `${subject.icon} ${subject.subject}`));
    view.appendChild(h('p', 'page-sub', subject.strand));

    const list = document.createElement('div');
    list.className = 'topic-list';
    subject.topics.forEach((topic) => {
      const st = Progress.topicStatus(topic.id);
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.style.borderLeftColor = subject.color;
      card.setAttribute('data-topic', topic.id);

      card.appendChild(h('div', 't-emoji', subject.icon));
      const main = document.createElement('div');
      main.className = 't-main';
      main.appendChild(h('h4', '', topic.topic));
      main.appendChild(h('p', '', topic.objective));
      card.appendChild(main);

      const right = document.createElement('div');
      right.style.textAlign = 'right';
      const status = st.mastery === 'secure' ? '✅' : st.done > 0 ? '🟡' : '▶️';
      right.appendChild(h('div', 't-status', status));
      right.appendChild(h('div', 't-count', `${st.done}/${topic.activities.length}`));
      card.appendChild(right);

      card.onclick = () => Activities.open(subject, topic, () => renderTopicList(subject));
      list.appendChild(card);
    });
    view.appendChild(list);
  }

  /* ------------------------ learner: practice zone ------------------------ */
  function renderPracticeZone() {
    view.innerHTML = '';
    const back = h('button', 'back-link', '← Back');
    back.onclick = renderLearnerHome;
    view.appendChild(back);
    view.appendChild(h('h1', 'page-title', '♾️ Practice Zone'));
    view.appendChild(h('p', 'page-sub', 'Pick a game — the questions never run out! Keep going for more stars.'));

    const grid = document.createElement('div');
    grid.className = 'subject-grid';
    Practice.categories.forEach((cat) => {
      const card = document.createElement('div');
      card.className = 'subject-card practice-card';
      card.setAttribute('data-practice', cat.id);
      card.style.borderTopColor = cat.color;
      const icon = h('div', 'subj-icon', cat.icon);
      icon.style.background = hexToSoft(cat.color);
      card.appendChild(icon);
      card.appendChild(h('h3', '', cat.name));
      card.appendChild(h('p', 'strand', 'Unlimited questions'));
      card.onclick = () => Activities.openPractice(cat, renderPracticeZone);
      grid.appendChild(card);
    });
    view.appendChild(grid);
  }

  /* --------------------------- teacher view --------------------------- */
  function renderTeacherDash() {
    view.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'view-head';
    head.appendChild(h('h1', 'page-title', '👩‍🏫 Teacher Dashboard'));
    const actions = document.createElement('div');
    actions.className = 'head-actions';
    actions.appendChild(actionBtn('📊 Development report', () => { currentRole = 'report'; render(); }));
    actions.appendChild(actionBtn('🖨️ Print worksheet', () => Worksheet.print('all')));
    head.appendChild(actions);
    view.appendChild(head);
    view.appendChild(h('p', 'page-sub',
      `Curriculum coverage and mastery for ${Profile.childName()} · data from this device.`));

    const stats = computeStats();
    const dash = document.createElement('div');
    dash.className = 'dash-grid';
    dash.appendChild(statCard('Activities completed', `${stats.doneActs}/${stats.totalActs}`, `${stats.pct}% of tasks`));
    dash.appendChild(statCard('Objectives secure', `${stats.secure}/${stats.totalTopics}`, 'Mastery = all evidence (FR-040)'));
    dash.appendChild(statCard('Stars awarded', `⭐ ${Progress.stars}`, 'Positive reinforcement (FR-034)'));
    dash.appendChild(statCard('Practice answers', `${Progress.practice.total}`, `${Progress.practice.correct} correct`));
    view.appendChild(dash);

    CURRICULUM.terms.forEach((term) => {
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.appendChild(h('h3', '', `Curriculum coverage · ${term.name}`));
      panel.appendChild(h('p', 'panel-sub', 'Planned vs delivered/assessed coverage by subject (FR-025, FR-054).'));
      const table = document.createElement('table');
      table.className = 'data';
      table.innerHTML =
        '<thead><tr><th>Subject</th><th>Strand</th><th>Coverage</th><th>Objectives secure</th></tr></thead>';
      const tb = document.createElement('tbody');
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        const secure = subject.topics.filter((t) => Progress.topicStatus(t.id).mastery === 'secure').length;
        const tr = document.createElement('tr');
        tr.innerHTML =
          `<td><b>${subject.icon} ${subject.subject}</b></td>` +
          `<td>${subject.strand}</td>` +
          `<td>${barHTML(cov.pct, subject.color)}</td>` +
          `<td>${secure}/${subject.topics.length}</td>`;
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      panel.appendChild(table);
      view.appendChild(panel);
    });

    const mp = document.createElement('div');
    mp.className = 'panel';
    mp.appendChild(h('h3', '', 'Objective mastery detail'));
    mp.appendChild(h('p', 'panel-sub', 'Distinguishes “no evidence yet” from “developing” and “secure” (SRS 9.1).'));
    const mt = document.createElement('table');
    mt.className = 'data';
    mt.innerHTML =
      '<thead><tr><th>Subject</th><th>Learning objective</th><th>Evidence</th><th>Mastery</th></tr></thead>';
    const mtb = document.createElement('tbody');
    currentTerm().subjects.forEach((subject) => {
      subject.topics.forEach((topic) => {
        const st = Progress.topicStatus(topic.id);
        const tr = document.createElement('tr');
        tr.innerHTML =
          `<td>${subject.icon} ${subject.subject}</td>` +
          `<td>${topic.objective}</td>` +
          `<td>${st.done}/${topic.activities.length}</td>` +
          `<td>${masteryTag(st.mastery)}</td>`;
        mtb.appendChild(tr);
      });
    });
    mt.appendChild(mtb);
    mp.appendChild(mt);
    view.appendChild(renderTermTabs());
    view.appendChild(mp);
  }

  /* ---------------------------- parent view ---------------------------- */
  function renderParentView() {
    view.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'view-head';
    head.appendChild(h('h1', 'page-title', `👪 ${Profile.childName()}’s Progress`));
    const actions = document.createElement('div');
    actions.className = 'head-actions';
    actions.appendChild(actionBtn('📊 Full development report', () => { currentRole = 'report'; render(); }));
    actions.appendChild(actionBtn('🖨️ Print worksheet', () => Worksheet.print('all')));
    head.appendChild(actions);
    view.appendChild(head);

    const notice = document.createElement('div');
    notice.className = 'notice';
    notice.innerHTML =
      '<b>Plain-language summary:</b> This shows only approved progress for your linked child ' +
      '(SRS FR-046, FR-047). It never compares your child with other learners.';
    view.appendChild(notice);

    const stats = computeStats();
    const dash = document.createElement('div');
    dash.className = 'dash-grid';
    dash.appendChild(statCard('Activities finished', `${stats.doneActs}`, 'Great effort!'));
    dash.appendChild(statCard('Stars earned', `⭐ ${Progress.stars}`, 'Celebrating small wins'));
    dash.appendChild(statCard('Topics mastered', `${stats.secure}`, 'Objectives fully secure'));
    view.appendChild(dash);

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.appendChild(h('h3', '', `How ${Profile.childName()} is doing by subject`));
    panel.appendChild(h('p', 'panel-sub', 'And a simple way you can help at home.'));

    const helpTips = {
      Literacy: 'Read a short story together and talk about the main idea.',
      Numeracy: 'Count objects at home — spoons, fruit, or steps.',
      Science: 'Look for living and non-living things on a walk.',
      'Unit of Inquiry': 'Chat about helpers in your community.',
      ICT: 'Talk about keeping passwords secret and telling an adult about anything worrying.',
      French: 'Practise “Bonjour” and “Merci” together.',
      'Creative Arts': 'Make a colour pattern with crayons.',
      Arts: 'Draw a picture and mix two colours.'
    };
    let any = false;
    CURRICULUM.terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        if (cov.doneActs === 0) return;
        any = true;
        const row = document.createElement('div');
        row.className = 'parent-row';
        row.innerHTML =
          `<span style="font-size:26px">${subject.icon}</span>` +
          `<div style="flex:1"><b>${subject.subject}</b> <span style="color:#5a6b83">(${term.name})</span>` +
          `<div style="color:#5a6b83;font-size:13px">💡 ${helpTips[subject.subject] || 'Keep practising together.'}</div></div>` +
          `<div style="width:160px">${barHTML(cov.pct, subject.color)}</div>`;
        panel.appendChild(row);
      });
    });
    if (!any) panel.appendChild(h('p', '', 'No activities completed yet. Switch to the Learner view to begin! 🌟'));
    view.appendChild(panel);
  }

  /* --------------------------- report view --------------------------- */
  function renderReportView() {
    view.innerHTML = '';
    const back = h('button', 'back-link', '← Back to dashboard');
    back.onclick = () => { currentRole = 'teacher'; syncRoleButtons(); render(); };
    view.appendChild(back);
    const container = document.createElement('div');
    view.appendChild(container);
    Report.render(container);
  }

  /* ------------------------------ helpers ------------------------------ */
  function computeStats() {
    let doneActs = 0, totalActs = 0, secure = 0, totalTopics = 0;
    CURRICULUM.terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        doneActs += cov.doneActs; totalActs += cov.totalActs;
        subject.topics.forEach((t) => {
          totalTopics += 1;
          if (Progress.topicStatus(t.id).mastery === 'secure') secure += 1;
        });
      });
    });
    return { doneActs, totalActs, secure, totalTopics, pct: totalActs ? Math.round((doneActs / totalActs) * 100) : 0 };
  }

  function actionBtn(label, onClick) {
    const b = document.createElement('button');
    b.className = 'btn-ghost';
    b.textContent = label;
    b.onclick = onClick;
    return b;
  }
  function statCard(label, value, foot) {
    const c = document.createElement('div');
    c.className = 'stat-card';
    c.appendChild(h('div', 'stat-label', label));
    c.appendChild(h('div', 'stat-value', value));
    c.appendChild(h('div', 'stat-foot', foot || ''));
    return c;
  }
  function barHTML(pct, color) {
    return `<div class="bar"><span style="width:${pct}%;background:${color || '#2e9e5b'}"></span></div>` +
      `<span style="font-size:12px;color:#5a6b83;margin-left:8px">${pct}%</span>`;
  }
  function masteryTag(m) {
    if (m === 'secure') return '<span class="tag secure">Secure</span>';
    if (m === 'developing') return '<span class="tag developing">Developing</span>';
    return '<span class="tag none">No evidence</span>';
  }
  function h(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }
  function hexToSoft(hex) {
    const c = hex.replace('#', '');
    return `rgba(${parseInt(c.substr(0, 2), 16)},${parseInt(c.substr(2, 2), 16)},${parseInt(c.substr(4, 2), 16)},0.15)`;
  }

  /* ------------------------------ modals ------------------------------ */
  function showModal(node, dismissable) {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.appendChild(node);
    if (dismissable) back.onclick = (e) => { if (e.target === back) back.remove(); };
    document.body.appendChild(back);
    return back;
  }

  function showOnboarding() {
    const card = document.createElement('div');
    card.className = 'modal-card onboard';
    card.innerHTML =
      `<div class="onboard-mascot">🦉</div>
       <h2>Welcome to Innovatia Learning!</h2>
       <p class="modal-sub">Let’s set up your child’s account.</p>
       <label class="field-label">Child’s first name</label>
       <input id="obName" class="type-input" placeholder="e.g. Ama" maxlength="40" />
       <label class="field-label">Choose an avatar</label>
       <div class="avatar-row" id="obAvatars"></div>
       <label class="field-label">Set a 4-digit grown-up PIN <span class="hint">(for Teacher & Parent areas)</span></label>
       <input id="obPin" class="type-input" inputmode="numeric" placeholder="••••" maxlength="6" />
       <div class="modal-err" id="obErr"></div>
       <button class="btn-primary" id="obGo" style="width:100%;margin-top:12px">Start learning 🚀</button>`;
    const back = showModal(card, false);

    const avatars = ['🧒', '👦', '👧', '🐨', '🦊', '🐯', '🐱', '🦄'];
    let chosen = '🧒';
    const row = card.querySelector('#obAvatars');
    avatars.forEach((a) => {
      const b = document.createElement('button');
      b.className = 'avatar-opt' + (a === chosen ? ' sel' : '');
      b.textContent = a;
      b.onclick = () => {
        chosen = a;
        row.querySelectorAll('.avatar-opt').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
      };
      row.appendChild(b);
    });

    card.querySelector('#obGo').onclick = () => {
      const name = card.querySelector('#obName').value.trim();
      const pin = card.querySelector('#obPin').value.trim();
      const err = card.querySelector('#obErr');
      if (name.length < 1) { err.textContent = 'Please enter the child’s name.'; return; }
      if (!/^\d{4,6}$/.test(pin)) { err.textContent = 'PIN must be 4–6 digits.'; return; }
      Profile.setChild(name, 'Year 1', chosen);
      Profile.setPin(pin);
      back.remove();
      refreshChildChip();
      render();
    };
    setTimeout(() => card.querySelector('#obName').focus(), 50);
  }

  // Ask for the adult PIN; call onOk() when correct.
  function showPinPrompt(onOk) {
    if (!Profile.hasPin()) { onOk(); return; }
    const card = document.createElement('div');
    card.className = 'modal-card pin-card';
    card.innerHTML =
      `<div class="onboard-mascot">🔒</div>
       <h2>Grown-ups only</h2>
       <p class="modal-sub">Enter the PIN to open the Teacher / Parent area.</p>
       <input id="pinIn" class="type-input pin-input" inputmode="numeric" placeholder="••••" maxlength="6" />
       <div class="modal-err" id="pinErr"></div>
       <div class="modal-actions">
         <button class="btn-ghost" id="pinCancel">Cancel</button>
         <button class="btn-primary" id="pinOk">Unlock</button>
       </div>`;
    const back = showModal(card, true);
    const input = card.querySelector('#pinIn');
    function attempt() {
      if (Profile.verifyPin(input.value.trim())) {
        adultUnlocked = true;
        back.remove();
        onOk();
      } else {
        card.querySelector('#pinErr').textContent = 'That PIN is not right. Try again.';
        input.value = '';
        input.focus();
      }
    }
    card.querySelector('#pinOk').onclick = attempt;
    card.querySelector('#pinCancel').onclick = () => { back.remove(); syncRoleButtons(); };
    input.onkeydown = (e) => { if (e.key === 'Enter') attempt(); };
    setTimeout(() => input.focus(), 50);
  }

  function showSettings() {
    showPinPrompt(() => {
      const card = document.createElement('div');
      card.className = 'modal-card';
      card.innerHTML =
        `<h2>⚙️ Settings</h2>
         <label class="field-label">Child’s name</label>
         <input id="stName" class="type-input" value="${(Profile.child && Profile.child.name) || ''}" maxlength="40" />
         <label class="field-label">New PIN <span class="hint">(leave blank to keep)</span></label>
         <input id="stPin" class="type-input" inputmode="numeric" placeholder="••••" maxlength="6" />
         <div class="modal-err" id="stErr"></div>
         <div class="modal-actions">
           <button class="btn-ghost" id="stReset">Reset all progress</button>
           <span style="flex:1"></span>
           <button class="btn-ghost" id="stCancel">Close</button>
           <button class="btn-primary" id="stSave">Save</button>
         </div>`;
      const back = showModal(card, true);
      card.querySelector('#stSave').onclick = () => {
        const name = card.querySelector('#stName').value.trim();
        const pin = card.querySelector('#stPin').value.trim();
        if (name) Profile.setChild(name, 'Year 1', (Profile.child && Profile.child.avatar) || '🧒');
        if (pin) {
          if (!/^\d{4,6}$/.test(pin)) { card.querySelector('#stErr').textContent = 'PIN must be 4–6 digits.'; return; }
          Profile.setPin(pin);
        }
        back.remove();
        refreshChildChip();
        render();
      };
      card.querySelector('#stCancel').onclick = () => back.remove();
      card.querySelector('#stReset').onclick = () => {
        if (window.confirm('Reset all stars and progress for this child? This cannot be undone.')) {
          Progress.reset();
          back.remove();
          updateStars();
          render();
        }
      };
    });
  }

  /* --------------------------- header chip --------------------------- */
  function refreshChildChip() {
    const chip = document.getElementById('childChip');
    if (!chip) return;
    if (Profile.hasChild()) {
      chip.innerHTML = `<span class="chip-ava">${(Profile.child && Profile.child.avatar) || '🧒'}</span>` +
        `<b>${escapeHtml(Profile.childName())}</b>`;
      chip.classList.remove('hidden');
    } else {
      chip.classList.add('hidden');
    }
  }
  function updateStars() {
    const el = document.getElementById('starCount');
    if (el) el.querySelector('b').textContent = Progress.stars;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* --------------------------- global wiring --------------------------- */
  function syncRoleButtons() {
    roleSwitch.querySelectorAll('button').forEach((x) =>
      x.classList.toggle('active', x.getAttribute('data-role') === (currentRole === 'report' ? 'teacher' : currentRole)));
  }

  roleSwitch.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      const role = b.getAttribute('data-role');
      const go = () => {
        currentRole = role;
        currentTermId = 'term1';
        syncRoleButtons();
        render();
      };
      if (role === 'teacher' || role === 'parent') {
        if (adultUnlocked) go();
        else showPinPrompt(go);
      } else {
        go();
      }
    };
  });

  function raiseReport() {
    const reference = 'RPT-' + Date.now().toString().slice(-6);
    Progress.logEvent('safety-report', { reference });
    if (window.innovatia && window.innovatia.reportSafety) window.innovatia.reportSafety({ reference });
    else alert('Thank you for telling an adult. A grown-up will look at this soon.\nReference: ' + reference);
  }
  document.getElementById('reportBtn').onclick = raiseReport;
  document.getElementById('reportBtnActivity').onclick = raiseReport;
  document.getElementById('safeExit').onclick = () => Activities.close();
  const gear = document.getElementById('settingsBtn');
  if (gear) gear.onclick = showSettings;

  /* ------------------------------ start ------------------------------ */
  updateStars();
  refreshChildChip();
  if (!Profile.hasChild()) showOnboarding();
  render();
  window.__app = { render, showOnboarding }; // for verification tooling
})();
