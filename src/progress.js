/*
 * Progress store - save/resume, stars, objective mastery and (v2) the data
 * that powers the child development report. Persisted to localStorage so a
 * learner can leave and come back (FR-031). Mastery is recorded per learning
 * objective (FR-040) and drives the teacher/parent dashboards and report.
 */
(function () {
  const KEY = 'innovatia.progress.v1';

  const defaultState = {
    stars: 0,
    activities: {},            // activityId -> { correct, attempts, completedAt }
    topics: {},                // topicId -> { mastery, done, total }
    practice: { total: 0, correct: 0, byCat: {} }, // v2 unlimited-practice tally
    firstActivityAt: null,
    lastActivityAt: null,
    events: []                 // audit-style log (FR-057, simplified)
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaultState);
      const merged = Object.assign(structuredClone(defaultState), JSON.parse(raw));
      // Ensure nested v2 fields exist for pre-v2 saves.
      merged.practice = Object.assign({ total: 0, correct: 0, byCat: {} }, merged.practice || {});
      return merged;
    } catch (e) {
      return structuredClone(defaultState);
    }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  const state = load();

  function touchDates() {
    const now = Date.now();
    if (!state.firstActivityAt) state.firstActivityAt = now;
    state.lastActivityAt = now;
  }

  const Progress = {
    get stars() { return state.stars; },

    getActivity(id) { return state.activities[id]; },
    isActivityDone(id) {
      const a = state.activities[id];
      return !!(a && a.correct);
    },

    recordActivity(activity, topicId, correct) {
      const prev = state.activities[activity.id] || { attempts: 0, correct: false };
      const firstSolve = correct && !prev.correct;
      state.activities[activity.id] = {
        attempts: prev.attempts + 1,
        correct: correct || prev.correct,
        completedAt: correct ? Date.now() : prev.completedAt
      };
      if (firstSolve) state.stars += 1;
      this._recomputeTopic(topicId);
      touchDates();
      state.events.push({ t: Date.now(), type: 'activity', id: activity.id, correct });
      save(state);
      return { firstSolve };
    },

    // v2: unlimited-practice questions don't map to a fixed objective; they
    // reward effort with stars and feed the report's practice tally.
    recordPractice(catId, correct) {
      state.practice.total += 1;
      if (correct) {
        state.practice.correct += 1;
        state.stars += 1;
        state.practice.byCat[catId] = (state.practice.byCat[catId] || 0) + 1;
      }
      touchDates();
      save(state);
    },

    _recomputeTopic(topicId) {
      const topic = findTopic(topicId);
      if (!topic) return;
      const total = topic.activities.length;
      const done = topic.activities.filter((a) => this.isActivityDone(a.id)).length;
      let mastery = 'none';
      if (done > 0 && done >= total) mastery = 'secure';
      else if (done > 0) mastery = 'developing';
      state.topics[topicId] = { mastery, done, total };
    },

    topicStatus(topicId) {
      return state.topics[topicId] || { mastery: 'none', done: 0, total: 0 };
    },

    subjectCoverage(subject) {
      let doneActs = 0, totalActs = 0;
      subject.topics.forEach((t) => {
        totalActs += t.activities.length;
        doneActs += t.activities.filter((a) => this.isActivityDone(a.id)).length;
      });
      return { doneActs, totalActs, pct: totalActs ? Math.round((doneActs / totalActs) * 100) : 0 };
    },

    logEvent(type, detail) {
      state.events.push({ t: Date.now(), type, detail });
      save(state);
    },
    recentEvents(n) { return state.events.slice(-n).reverse(); },

    get practice() { return state.practice; },
    get firstActivityAt() { return state.firstActivityAt; },
    get lastActivityAt() { return state.lastActivityAt; },

    /* ----- Development report data (v2) ----------------------------------
     * Aggregates by subject across both terms and derives strengths, focus
     * areas and a plain-language summary (SRS 9.1: distinguish "no evidence"
     * from "developing"/"secure"; FR-047 plain-language reporting).
     */
    buildReport() {
      const bySubject = {};      // subjectName -> aggregate
      let doneActs = 0, totalActs = 0, secure = 0, developing = 0, totalTopics = 0;

      window.CURRICULUM.terms.forEach((term) => {
        term.subjects.forEach((subject) => {
          const cov = this.subjectCoverage(subject);
          const agg = bySubject[subject.subject] || {
            name: subject.subject, icon: subject.icon, color: subject.color,
            done: 0, total: 0, secure: 0, topics: 0
          };
          agg.done += cov.doneActs;
          agg.total += cov.totalActs;
          subject.topics.forEach((t) => {
            agg.topics += 1;
            totalTopics += 1;
            const m = this.topicStatus(t.id).mastery;
            if (m === 'secure') { agg.secure += 1; secure += 1; }
            else if (m === 'developing') developing += 1;
          });
          bySubject[subject.subject] = agg;
          doneActs += cov.doneActs;
          totalActs += cov.totalActs;
        });
      });

      const subjects = Object.values(bySubject).map((a) => ({
        ...a,
        pct: a.total ? Math.round((a.done / a.total) * 100) : 0
      }));

      const withEvidence = subjects.filter((s) => s.done > 0).sort((a, b) => b.pct - a.pct);
      const strengths = withEvidence.slice(0, 3).filter((s) => s.pct >= 50);
      const focus = subjects
        .filter((s) => s.done === 0 || s.pct < 50)
        .sort((a, b) => a.pct - b.pct)
        .slice(0, 3);

      const overallPct = totalActs ? Math.round((doneActs / totalActs) * 100) : 0;
      const name = window.Profile ? window.Profile.childName() : 'Your child';

      return {
        name,
        ageGroup: (window.Profile && window.Profile.child && window.Profile.child.ageGroup) || 'Year 1',
        generatedAt: Date.now(),
        firstActivityAt: state.firstActivityAt,
        lastActivityAt: state.lastActivityAt,
        stars: state.stars,
        doneActs, totalActs, overallPct,
        secure, developing, totalTopics,
        practice: state.practice,
        subjects, strengths, focus,
        summary: buildSummary(name, overallPct, secure, totalTopics, strengths, focus, state)
      };
    },

    reset() {
      Object.assign(state, structuredClone(defaultState));
      save(state);
    }
  };

  function buildSummary(name, overallPct, secure, totalTopics, strengths, focus, st) {
    const parts = [];
    if (!st.firstActivityAt) {
      return `${name} has not started any activities yet. Switch to the Learner ` +
        `view together and tap a subject to make a happy start! 🌟`;
    }
    parts.push(
      `${name} has completed ${overallPct}% of the interactive activities so far and ` +
      `has fully mastered ${secure} of ${totalTopics} learning objectives.`
    );
    if (strengths.length) {
      parts.push(
        `${name} is doing especially well in ` +
        joinNames(strengths.map((s) => s.name)) + '. Lovely work!'
      );
    }
    if (focus.length) {
      parts.push(
        `A gentle focus for the coming weeks could be ` +
        joinNames(focus.map((s) => s.name)) +
        ` - short, playful practice at home will help a lot.`
      );
    }
    if (st.practice && st.practice.total > 0) {
      parts.push(
        `${name} has also answered ${st.practice.total} extra practice questions ` +
        `in the Practice Zone - great for building confidence.`
      );
    }
    parts.push('This is an encouraging start. Celebrate the effort, not just the answers. 💛');
    return parts.join(' ');
  }

  function joinNames(arr) {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }

  function findTopic(topicId) {
    for (const term of window.CURRICULUM.terms) {
      for (const subj of term.subjects) {
        for (const topic of subj.topics) {
          if (topic.id === topicId) return topic;
        }
      }
    }
    return null;
  }

  window.Progress = Progress;
  window.findTopic = findTopic;
})();
