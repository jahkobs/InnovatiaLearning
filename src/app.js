/*
 * Application shell & navigation.
 * Renders the three role experiences described in the SRS (Section 4):
 *   - Learner: assigned interactive activities (simple, visual)
 *   - Teacher: curriculum coverage + learner mastery dashboard
 *   - Parent : plain-language progress for a linked learner
 */
(function () {
  const view = document.getElementById('view');
  const roleSwitch = document.getElementById('roleSwitch');

  let currentRole = 'learner';
  let currentTermId = 'term1';

  /* ------------------------------ routing ------------------------------ */
  function render() {
    if (currentRole === 'learner') return renderLearnerHome();
    if (currentRole === 'teacher') return renderTeacherDash();
    if (currentRole === 'parent') return renderParentView();
  }

  function currentTerm() {
    return CURRICULUM.terms.find((t) => t.id === currentTermId);
  }

  /* --------------------------- learner: home --------------------------- */
  function renderLearnerHome() {
    const term = currentTerm();
    view.innerHTML = '';

    view.appendChild(h('h1', 'page-title', 'Hello! Choose something to learn 🌟'));
    view.appendChild(h('p', 'page-sub',
      `${CURRICULUM.yearLevel} · ${term.name} · Tap a subject to start.`));

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

      card.onclick = () => {
        Activities.open(subject, topic, () => renderTopicList(subject));
      };
      list.appendChild(card);
    });
    view.appendChild(list);
  }

  /* --------------------------- teacher view --------------------------- */
  function renderTeacherDash() {
    view.innerHTML = '';
    view.appendChild(h('h1', 'page-title', '👩‍🏫 Teacher Dashboard'));
    view.appendChild(h('p', 'page-sub',
      'Curriculum coverage and learner mastery for Year 1 · demonstration data from this device.'));

    // headline stats
    const stats = computeStats();
    const dash = document.createElement('div');
    dash.className = 'dash-grid';
    dash.appendChild(statCard('Activities completed', `${stats.doneActs}/${stats.totalActs}`,
      `${stats.pct}% of interactive tasks`));
    dash.appendChild(statCard('Objectives secure', `${stats.secure}/${stats.totalTopics}`,
      'Mastery = all evidence complete (FR-040)'));
    dash.appendChild(statCard('Stars awarded', `⭐ ${Progress.stars}`,
      'Positive reinforcement (FR-034)'));
    dash.appendChild(statCard('Safety drills', `${stats.safetyDrills}`,
      'Report-unsafe-content practice (SEC-010)'));
    view.appendChild(dash);

    // coverage per subject, per term
    CURRICULUM.terms.forEach((term) => {
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.appendChild(h('h3', '', `Curriculum coverage · ${term.name}`));
      panel.appendChild(h('p', 'panel-sub',
        'Planned vs delivered/assessed coverage by subject (FR-025, FR-054).'));

      const table = document.createElement('table');
      table.className = 'data';
      table.innerHTML =
        '<thead><tr><th>Subject</th><th>Strand</th><th>Coverage</th><th>Objectives secure</th></tr></thead>';
      const tb = document.createElement('tbody');
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        const secure = subject.topics.filter(
          (t) => Progress.topicStatus(t.id).mastery === 'secure'
        ).length;
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

    // objective mastery detail
    const mp = document.createElement('div');
    mp.className = 'panel';
    mp.appendChild(h('h3', '', 'Objective mastery detail'));
    mp.appendChild(h('p', 'panel-sub',
      'Distinguishes “no evidence yet” from “developing” and “secure” (SRS 9.1 analytics rule).'));
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
    view.appendChild(renderTermTabs()); // let teacher pick the term for the detail table
    view.appendChild(mp);
  }

  /* ---------------------------- parent view ---------------------------- */
  function renderParentView() {
    view.innerHTML = '';
    view.appendChild(h('h1', 'page-title', '👪 My Child’s Progress'));
    view.appendChild(h('p', 'page-sub', 'A clear, friendly summary for Ama (Year 1).'));

    const notice = document.createElement('div');
    notice.className = 'notice';
    notice.innerHTML =
      '<b>Plain-language summary:</b> This shows only approved progress for your linked child ' +
      '(SRS FR-046, FR-047). It never compares your child with other learners.';
    view.appendChild(notice);

    const stats = computeStats();
    const dash = document.createElement('div');
    dash.className = 'dash-grid';
    dash.appendChild(statCard('Activities finished', `${stats.doneActs}`, 'Great effort this term!'));
    dash.appendChild(statCard('Stars earned', `⭐ ${Progress.stars}`, 'Celebrating small wins'));
    dash.appendChild(statCard('Topics mastered', `${stats.secure}`, 'Objectives fully secure'));
    view.appendChild(dash);

    // friendly subject summaries
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.appendChild(h('h3', '', 'How Ama is doing by subject'));
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

    CURRICULUM.terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        if (cov.doneActs === 0) return; // parents see only where there is evidence
        const row = document.createElement('div');
        row.style.cssText =
          'display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #eef1f5;';
        row.innerHTML =
          `<span style="font-size:26px">${subject.icon}</span>` +
          `<div style="flex:1"><b>${subject.subject}</b> <span style="color:#5a6b83">(${term.name})</span>` +
          `<div style="color:#5a6b83;font-size:13px">💡 ${helpTips[subject.subject] || 'Keep practising together.'}</div></div>` +
          `<div style="width:160px">${barHTML(cov.pct, subject.color)}</div>`;
        panel.appendChild(row);
      });
    });

    if (!panel.querySelector('div[style]')) {
      panel.appendChild(h('p', '', 'No activities completed yet. Switch to the Learner view to begin! 🌟'));
    }
    view.appendChild(panel);
  }

  /* ------------------------------ helpers ------------------------------ */
  function computeStats() {
    let doneActs = 0, totalActs = 0, secure = 0, totalTopics = 0;
    CURRICULUM.terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        const cov = Progress.subjectCoverage(subject);
        doneActs += cov.doneActs;
        totalActs += cov.totalActs;
        subject.topics.forEach((t) => {
          totalTopics += 1;
          if (Progress.topicStatus(t.id).mastery === 'secure') secure += 1;
        });
      });
    });
    const safetyDrills = Progress.recentEvents(9999).filter((e) => e.type === 'safety-drill').length;
    return {
      doneActs, totalActs, secure, totalTopics, safetyDrills,
      pct: totalActs ? Math.round((doneActs / totalActs) * 100) : 0
    };
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
    return `<div class="bar"><span style="width:${pct}%;background:${color || '#2e9e5b'}"></span></div>`
      + `<span style="font-size:12px;color:#5a6b83;margin-left:8px">${pct}%</span>`;
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
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r},${g},${b},0.15)`;
  }

  /* --------------------------- global wiring --------------------------- */
  roleSwitch.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      roleSwitch.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      currentRole = b.getAttribute('data-role');
      currentTermId = 'term1';
      render();
    };
  });

  // Safe exit / report — available everywhere (FR-035, SEC-010).
  function raiseReport() {
    const reference = 'RPT-' + Date.now().toString().slice(-6);
    Progress.logEvent('safety-report', { reference });
    if (window.innovatia && window.innovatia.reportSafety) {
      window.innovatia.reportSafety({ reference });
    } else {
      alert('Thank you for telling an adult. A grown-up will look at this soon.\nReference: ' + reference);
    }
  }
  document.getElementById('reportBtn').onclick = raiseReport;
  document.getElementById('reportBtnActivity').onclick = raiseReport;
  document.getElementById('safeExit').onclick = () => Activities.close();

  // Update star badge on load.
  document.getElementById('starCount').querySelector('b').textContent = Progress.stars;

  render();
  window.__app = { render }; // exposed for verification tooling
})();
