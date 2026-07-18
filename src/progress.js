/*
 * Progress store - save/resume, stars and objective mastery.
 * Persisted to localStorage so a learner can leave and come back
 * (FR-031 save & resume). Mastery is recorded per learning objective
 * (FR-040) and drives the teacher/parent dashboards.
 */
(function () {
  const KEY = 'innovatia.progress.v1';

  const defaultState = {
    stars: 0,
    // activityId -> { correct, attempts, completedAt }
    activities: {},
    // topicId -> { objective mastery: 'none' | 'developing' | 'secure' }
    topics: {},
    // audit-style event log (FR-057, simplified for the desktop pilot)
    events: []
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaultState);
      return Object.assign(structuredClone(defaultState), JSON.parse(raw));
    } catch (e) {
      return structuredClone(defaultState);
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage may be unavailable; app still works in-memory */
    }
  }

  const state = load();

  const Progress = {
    get stars() { return state.stars; },

    getActivity(id) { return state.activities[id]; },

    isActivityDone(id) {
      const a = state.activities[id];
      return !!(a && a.correct);
    },

    // Record the result of an activity attempt.
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
      state.events.push({
        t: Date.now(),
        type: 'activity',
        id: activity.id,
        correct
      });
      save(state);
      return { firstSolve };
    },

    // Objective mastery from evidence: all activities solved -> secure,
    // some -> developing, none -> none (SRS analytics rule: distinguish
    // "no evidence" from "not yet mastered").
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

    // Coverage across a subject: fraction of topics with any evidence.
    subjectCoverage(subject) {
      const topics = subject.topics;
      let doneActs = 0, totalActs = 0;
      topics.forEach((t) => {
        totalActs += t.activities.length;
        doneActs += t.activities.filter((a) => this.isActivityDone(a.id)).length;
      });
      return { doneActs, totalActs, pct: totalActs ? Math.round((doneActs / totalActs) * 100) : 0 };
    },

    logEvent(type, detail) {
      state.events.push({ t: Date.now(), type, detail });
      save(state);
    },

    recentEvents(n) {
      return state.events.slice(-n).reverse();
    },

    reset() {
      Object.assign(state, structuredClone(defaultState));
      save(state);
    }
  };

  // Helper: find a topic object by id across the whole curriculum.
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
