/*
 * Profile store (v2) - child registration and the adult (Teacher/Parent) gate.
 *
 * The child's name personalises the whole experience. The adult PIN is a
 * child-appropriate gate that keeps young learners out of the Teacher and
 * Parent areas - it is a deterrent for a local desktop app, not a security
 * boundary, so the PIN is only lightly hashed before being stored locally.
 */
(function () {
  const KEY = 'innovatia.profile.v1';
  const def = { child: null, pinHash: null, createdAt: null };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign({}, def, JSON.parse(raw)) : Object.assign({}, def);
    } catch (e) {
      return Object.assign({}, def);
    }
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  // Lightweight, non-cryptographic hash (djb2) - obscures the PIN at rest only.
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return String(h);
  }

  const s = load();

  const Profile = {
    get child() { return s.child; },
    childName() { return (s.child && s.child.name) || 'Friend'; },
    hasChild() { return !!(s.child && s.child.name); },
    setChild(name, ageGroup, avatar) {
      s.child = {
        name: String(name || '').trim().slice(0, 40) || 'Friend',
        ageGroup: ageGroup || 'Year 1',
        avatar: avatar || '🧒'
      };
      if (!s.createdAt) s.createdAt = Date.now();
      save(s);
    },

    hasPin() { return !!s.pinHash; },
    setPin(pin) { s.pinHash = hash(String(pin)); save(s); },
    verifyPin(pin) { return !!s.pinHash && hash(String(pin)) === s.pinHash; },

    get createdAt() { return s.createdAt; },

    reset() { Object.assign(s, { child: null, pinHash: null, createdAt: null }); save(s); }
  };

  window.Profile = Profile;
})();
