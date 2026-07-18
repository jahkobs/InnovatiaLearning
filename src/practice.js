/*
 * Practice Zone (v2) - unlimited, endlessly generated questions.
 * Each category exposes gen() which returns a fresh activity object in the
 * same shape the activity engine already understands (choice / count), so no
 * new renderer is needed. Questions never repeat identically - they are made
 * on the fly, giving effectively unlimited practice.
 */
(function () {
  function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function uid() { return 'gen-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6); }

  // Build a choice activity from a correct answer + some distractors.
  function choice(prompt, correct, distractors, say) {
    const opts = [{ label: String(correct), correct: true }]
      .concat(distractors.map((d) => ({ label: String(d) })));
    // de-dupe distractors that equal the answer
    const seen = new Set([String(correct)]);
    const options = [];
    opts.forEach((o) => {
      if (o.correct) { options.push(o); return; }
      if (!seen.has(o.label)) { seen.add(o.label); options.push(o); }
    });
    return { id: uid(), type: 'choice', prompt, options: shuffle(options), say: say || prompt };
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const EMOJI = ['🍎', '⭐', '🎈', '🐤', '🌸', '🍌', '🐞', '🚗', '⚽', '🧸'];
  const RHYMES = [
    ['cat', ['hat', 'mat', 'bat']], ['dog', ['log', 'frog']], ['sun', ['bun', 'run']],
    ['bee', ['tree', 'see']], ['star', ['car', 'jar']], ['ball', ['wall', 'tall']],
    ['cake', ['lake', 'snake']], ['ring', ['king', 'sing']]
  ];
  const NON_RHYMES = ['fish', 'book', 'lion', 'milk', 'door', 'shoe', 'hand', 'rain'];
  const WORDS_LETTER = [
    ['sun', 's'], ['moon', 'm'], ['tree', 't'], ['ball', 'b'], ['dog', 'd'],
    ['cat', 'c'], ['fish', 'f'], ['nest', 'n'], ['leaf', 'l'], ['pig', 'p']
  ];
  const FRENCH_NUM = [
    ['un', 1], ['deux', 2], ['trois', 3], ['quatre', 4], ['cinq', 5],
    ['six', 6], ['sept', 7], ['huit', 8], ['neuf', 9], ['dix', 10]
  ];

  const GEN = {
    addition() {
      const a = rint(1, 10), b = rint(1, 10), ans = a + b;
      return choice(`${a} + ${b} = ?`, ans, [ans + 1, ans - 1, ans + 2].filter((x) => x > 0),
        `${a} plus ${b}`);
    },
    subtraction() {
      const a = rint(2, 12), b = rint(1, a), ans = a - b;
      return choice(`${a} − ${b} = ?`, ans, [ans + 1, ans + 2, Math.max(0, ans - 1)],
        `${a} take away ${b}`);
    },
    counting() {
      const n = rint(3, 12), e = pick(EMOJI);
      return { id: uid(), type: 'count', prompt: `Count the ${e} — how many are there?`, emoji: e, answer: n };
    },
    compare() {
      let a = rint(1, 20), b = rint(1, 20);
      while (a === b) b = rint(1, 20);
      const bigger = Math.max(a, b);
      return choice(`Which number is BIGGER: ${a} or ${b}?`, bigger, [Math.min(a, b)],
        'Which is bigger?');
    },
    nextNumber() {
      const n = rint(0, 19);
      return choice(`What number comes AFTER ${n}?`, n + 1, [n + 2, Math.max(0, n - 1), n + 3],
        `What comes after ${n}?`);
    },
    doubles() {
      const a = rint(1, 10), ans = a + a;
      return choice(`Double ${a} is ?`, ans, [ans + 1, ans - 1, ans + 2].filter((x) => x > 0),
        `Double ${a}`);
    },
    rhyme() {
      const [word, rh] = pick(RHYMES);
      return choice(`Which word RHYMES with "${word}"?`, pick(rh),
        shuffle(NON_RHYMES).slice(0, 2), `Which word rhymes with ${word}?`);
    },
    firstLetter() {
      const [word, letter] = pick(WORDS_LETTER);
      const others = 'abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => c !== letter);
      return choice(`Which letter does "${word}" START with?`, letter.toUpperCase(),
        shuffle(others).slice(0, 3).map((c) => c.toUpperCase()), `${word} starts with?`);
    },
    frenchNumber() {
      const [fr, num] = pick(FRENCH_NUM);
      return choice(`In French, which number is "${fr}"?`, num,
        shuffle(FRENCH_NUM.map((x) => x[1]).filter((n) => n !== num)).slice(0, 3), fr);
    }
  };

  const CATEGORIES = [
    { id: 'add', name: 'Adding Fun', icon: '➕', color: '#70AD47', gen: GEN.addition },
    { id: 'sub', name: 'Taking Away', icon: '➖', color: '#5B9BD5', gen: GEN.subtraction },
    { id: 'count', name: 'Counting', icon: '🔟', color: '#ED7D31', gen: GEN.counting },
    { id: 'compare', name: 'Bigger Number', icon: '⚖️', color: '#9B59B6', gen: GEN.compare },
    { id: 'next', name: 'Next Number', icon: '➡️', color: '#00B0A6', gen: GEN.nextNumber },
    { id: 'doubles', name: 'Doubles', icon: '✌️', color: '#E67E22', gen: GEN.doubles },
    { id: 'rhyme', name: 'Rhyming Words', icon: '🎵', color: '#C0392B', gen: GEN.rhyme },
    { id: 'letter', name: 'First Letter', icon: '🔤', color: '#2E9E5B', gen: GEN.firstLetter },
    { id: 'french', name: 'French Numbers', icon: '🇫🇷', color: '#8E44AD', gen: GEN.frenchNumber }
  ];

  window.Practice = {
    categories: CATEGORIES,
    category(id) { return CATEGORIES.find((c) => c.id === id); },
    generate(id) { const c = this.category(id); return c ? c.gen() : GEN.addition(); }
  };
})();
