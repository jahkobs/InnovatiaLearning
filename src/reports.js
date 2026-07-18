/*
 * Reports & printing (v2)
 *   window.Report    - comprehensive + summary child development report
 *   window.Worksheet - printable sample activity questions for the child
 *   window.PrintKit  - fills #printArea and opens the system print dialog
 *
 * Printing uses a dedicated #printArea that is hidden on screen and revealed
 * only for print media (see styles.css), so window.print() sends a clean,
 * child-friendly worksheet/report to the printer (Electron shows the OS
 * print dialog where a printer can be chosen).
 */
(function () {
  const PrintKit = {
    print(title, innerHTML) {
      const area = document.getElementById('printArea');
      if (!area) return;
      const date = new Date().toLocaleDateString(undefined,
        { year: 'numeric', month: 'long', day: 'numeric' });
      area.innerHTML =
        `<div class="print-doc">
           <div class="print-head">
             <div class="print-brand">✦ Innovatia Learning</div>
             <div class="print-meta">${escapeHtml(title)} · ${date}</div>
           </div>
           ${innerHTML}
           <div class="print-foot">Innovatia Learning · Year 1 Digital Learning Platform</div>
         </div>`;
      window.print();
    }
  };

  /* --------------------------- development report --------------------------- */
  const Report = {
    // Render the interactive report into a container element.
    render(container) {
      const r = Progress.buildReport();
      container.innerHTML = '';

      const head = document.createElement('div');
      head.className = 'report-head panel';
      head.innerHTML =
        `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
           <div class="report-avatar">${escapeHtml((Profile.child && Profile.child.avatar) || '🧒')}</div>
           <div style="flex:1;min-width:200px">
             <h2 style="margin:0">${escapeHtml(r.name)}</h2>
             <div style="color:#5a6b83">${escapeHtml(r.ageGroup)} · Development Report</div>
             <div style="color:#5a6b83;font-size:13px">${dateRange(r)}</div>
           </div>
           <button class="btn-primary" id="reportPrintBtn">🖨️ Print report</button>
         </div>`;
      container.appendChild(head);

      // headline stats
      const dash = document.createElement('div');
      dash.className = 'dash-grid';
      dash.appendChild(stat('Overall completion', r.overallPct + '%', `${r.doneActs} of ${r.totalActs} activities`));
      dash.appendChild(stat('Objectives mastered', `${r.secure}/${r.totalTopics}`, `${r.developing} developing`));
      dash.appendChild(stat('Stars earned', '⭐ ' + r.stars, 'Effort & progress'));
      dash.appendChild(stat('Practice questions', String(r.practice.total), `${r.practice.correct} correct`));
      container.appendChild(dash);

      // plain-language summary
      const sum = document.createElement('div');
      sum.className = 'panel';
      sum.innerHTML =
        `<h3>Summary</h3><p class="report-summary">${escapeHtml(r.summary)}</p>`;
      container.appendChild(sum);

      // strengths & focus
      const sf = document.createElement('div');
      sf.className = 'panel';
      sf.innerHTML =
        `<h3>Strengths & next steps</h3>
         <div class="sf-grid">
           <div><h4>🌟 Strengths</h4>${listOrNone(r.strengths.map((s) => `${s.icon} ${s.name} (${s.pct}%)`))}</div>
           <div><h4>🎯 A gentle focus</h4>${listOrNone(r.focus.map((s) => `${s.icon} ${s.name} (${s.pct}%)`))}</div>
         </div>`;
      container.appendChild(sf);

      // per-subject comprehensive table
      const tp = document.createElement('div');
      tp.className = 'panel';
      let rows = r.subjects.map((s) =>
        `<tr><td><b>${s.icon} ${escapeHtml(s.name)}</b></td>` +
        `<td>${barHTML(s.pct, s.color)}</td>` +
        `<td>${s.done}/${s.total}</td>` +
        `<td>${s.secure}/${s.topics}</td></tr>`).join('');
      tp.innerHTML =
        `<h3>Detailed progress by subject</h3>
         <table class="data"><thead><tr>
           <th>Subject</th><th>Completion</th><th>Activities</th><th>Objectives secure</th>
         </tr></thead><tbody>${rows}</tbody></table>`;
      container.appendChild(tp);

      const printBtn = head.querySelector('#reportPrintBtn');
      if (printBtn) printBtn.onclick = () => Report.print();
    },

    // Build a print-friendly version and open the print dialog.
    print() {
      const r = Progress.buildReport();
      const subjRows = r.subjects.map((s) =>
        `<tr><td>${s.icon} ${escapeHtml(s.name)}</td><td>${s.pct}%</td>` +
        `<td>${s.done}/${s.total}</td><td>${s.secure}/${s.topics}</td></tr>`).join('');
      const html =
        `<h2 class="print-title">${escapeHtml(r.name)} — Development Report</h2>
         <p class="print-sub">${escapeHtml(r.ageGroup)} · ${dateRange(r)}</p>
         <table class="print-kv">
           <tr><td>Overall completion</td><td>${r.overallPct}% (${r.doneActs}/${r.totalActs} activities)</td></tr>
           <tr><td>Objectives mastered</td><td>${r.secure} of ${r.totalTopics} (${r.developing} developing)</td></tr>
           <tr><td>Stars earned</td><td>${r.stars}</td></tr>
           <tr><td>Extra practice questions</td><td>${r.practice.total} (${r.practice.correct} correct)</td></tr>
         </table>
         <h3>Summary</h3>
         <p>${escapeHtml(r.summary)}</p>
         <h3>Strengths</h3>
         <p>${r.strengths.length ? r.strengths.map((s) => `${s.name} (${s.pct}%)`).join(', ') : 'Building evidence across all subjects.'}</p>
         <h3>A gentle focus</h3>
         <p>${r.focus.length ? r.focus.map((s) => `${s.name} (${s.pct}%)`).join(', ') : 'Keep enjoying every subject.'}</p>
         <h3>Detailed progress by subject</h3>
         <table class="print-table"><thead><tr>
           <th>Subject</th><th>Completion</th><th>Activities</th><th>Objectives secure</th>
         </tr></thead><tbody>${subjRows}</tbody></table>
         <p class="print-note">Please celebrate the effort with your child. This report reflects
         activity on this device and is a friendly guide, not a formal assessment.</p>`;
      PrintKit.print(r.name + ' — Development Report', html);
    }
  };

  /* ----------------------------- worksheet print ----------------------------- */
  const Worksheet = {
    // Build a printable worksheet of sample questions for a subject (or 'all').
    print(subjectName) {
      const name = Profile.childName();
      const items = collectSampleQuestions(subjectName, 12);
      const qHtml = items.map((q, i) =>
        `<div class="ws-q">
           <div class="ws-qn">${i + 1}.</div>
           <div class="ws-qbody">
             <div class="ws-prompt">${escapeHtml(q.prompt)}</div>
             ${q.options ? `<div class="ws-opts">${q.options.map((o) => `<span class="ws-opt">◯ ${escapeHtml(o)}</span>`).join('')}</div>`
               : '<div class="ws-answerline">Answer: ____________________________</div>'}
           </div>
         </div>`).join('');
      const title = (subjectName && subjectName !== 'all' ? subjectName : 'Mixed') + ' Worksheet';
      const html =
        `<h2 class="print-title">${escapeHtml(title)}</h2>
         <p class="print-sub">Name: ${escapeHtml(name)} &nbsp;&nbsp; Date: ____________</p>
         <p class="print-instr">Circle or write your answer. Take your time and do your best! 🌟</p>
         ${qHtml}`;
      PrintKit.print(title, html);
    }
  };

  /* ------------------------------- helpers -------------------------------- */
  // Pull a spread of sample questions from the curriculum + a few generated ones.
  function collectSampleQuestions(subjectName, limit) {
    const out = [];
    window.CURRICULUM.terms.forEach((term) => {
      term.subjects.forEach((subject) => {
        if (subjectName && subjectName !== 'all' && subject.subject !== subjectName) return;
        subject.topics.forEach((topic) => {
          topic.activities.forEach((a) => {
            const q = sampleFromActivity(a);
            if (q) out.push(q);
          });
        });
      });
    });
    // Add a few generated arithmetic questions for extra practice.
    if ((!subjectName || subjectName === 'all' || subjectName === 'Numeracy') && window.Practice) {
      for (let i = 0; i < 4; i++) {
        const g = window.Practice.generate(i % 2 ? 'sub' : 'add');
        out.push({ prompt: g.prompt.replace(' = ?', ' = ______'), options: null });
      }
    }
    return shuffle(out).slice(0, limit);
  }

  function sampleFromActivity(a) {
    switch (a.type) {
      case 'choice':
      case 'pattern':
        return { prompt: a.prompt, options: (a.options || []).map((o) => o.label) };
      case 'phonics':
        return { prompt: a.prompt + ' (say: "' + a.say + '")', options: (a.options || []).map((o) => o.label) };
      case 'count':
        return { prompt: a.prompt + ' ' + a.emoji.repeat(a.answer), options: null };
      case 'match':
        return { prompt: 'Draw a line to match: ' + a.pairs.map((p) => p.left).join(', ') +
          '  →  ' + a.pairs.map((p) => p.right).join(', '), options: null };
      case 'order':
        return { prompt: 'Number these in order: ' + a.items.join(', '), options: null };
      case 'sort':
        return { prompt: 'Sort into ' + a.bins.join(' / ') + ': ' + a.items.map((i) => i.label).join(', '), options: null };
      case 'fraction':
        return { prompt: a.prompt, options: null };
      case 'report':
        return { prompt: a.prompt, options: a.options };
      default:
        return { prompt: a.prompt, options: null };
    }
  }

  function stat(label, value, foot) {
    const c = document.createElement('div');
    c.className = 'stat-card';
    c.innerHTML =
      `<div class="stat-label">${escapeHtml(label)}</div>` +
      `<div class="stat-value">${escapeHtml(value)}</div>` +
      `<div class="stat-foot">${escapeHtml(foot || '')}</div>`;
    return c;
  }
  function barHTML(pct, color) {
    return `<div class="bar"><span style="width:${pct}%;background:${color || '#2e9e5b'}"></span></div>` +
      `<span style="font-size:12px;color:#5a6b83;margin-left:8px">${pct}%</span>`;
  }
  function listOrNone(arr) {
    if (!arr.length) return '<p style="color:#5a6b83">Building evidence — keep going!</p>';
    return '<ul class="sf-list">' + arr.map((x) => `<li>${escapeHtml(x)}</li>`).join('') + '</ul>';
  }
  function dateRange(r) {
    if (!r.firstActivityAt) return 'No activity recorded yet';
    const f = new Date(r.firstActivityAt).toLocaleDateString();
    const l = new Date(r.lastActivityAt || r.firstActivityAt).toLocaleDateString();
    return f === l ? `Activity on ${f}` : `Activity from ${f} to ${l}`;
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  window.PrintKit = PrintKit;
  window.Report = Report;
  window.Worksheet = Worksheet;
})();
