# Innovatia Learning — Year 1 Digital Learning Platform (Windows Desktop)

## What’s new in v2.0

- **Child registration** — first-run onboarding registers the child’s name and avatar; the whole app greets them by name.
- **Adult PIN gate** — the Teacher and Parent areas are protected by a 4–6 digit grown-up PIN (set during onboarding; changeable in ⚙️ Settings).
- **Practice Zone (unlimited)** — 9 endlessly-generated question games (adding, taking away, counting, bigger number, next number, doubles, rhyming, first letter, French numbers). The questions never run out.
- **Development report** — a comprehensive + plain-language summary report per child (completion, mastery, strengths, gentle focus areas) that can be **printed**.
- **Print sample worksheets** — generate printer-friendly activity sheets for paper practice (opens the system print dialog).
- **Friendlier & more interactive** — read-aloud button on every question, auto voice-over, gentle sound effects, mascot onboarding, avatars and richer celebrations.
- More questions added across the built-in courses.

---

An **interactive Windows desktop application** for the *Innovatia Digital
Learning & Curriculum Management Platform*, built from the project
**Software Requirements Specification** (Year 1, Term 1 & Term 2, 2025/2026).

It packages a rich, child-friendly learning experience as a native Windows
app with a proper **installer (`.exe`, NSIS)** produced by `electron-builder`.

The app icon is generated at build time (a white star on the Innovatia blue
gradient) by `scripts/make-icon.js` — no binary assets are committed.

---

## What it does

Three role experiences from the SRS (Section 4), inside one desktop app:

| Role | Experience |
|------|-----------|
| 🧒 **Learner** | Simple, visual home screen with only assigned, approved activities. Ten interactive activity types across all seven Year 1 subjects and both terms. Immediate feedback, stars and celebrations. |
| 👩‍🏫 **Teacher** | Curriculum-coverage and learner-mastery dashboard — coverage bars by subject/term and objective-level mastery (*Secure / Developing / No evidence*). |
| 👪 **Parent** | Plain-language progress summary for a linked learner with practical "help at home" tips — never comparing learners. |

### Interactive activity types (the "more interactive content")

Every activity is **hands-on**, not multiple-choice-only:

| Type | What the learner does | SRS link |
|------|----------------------|----------|
| `choice` | Taps the correct picture/word | FR-029 (tap/click) |
| `count` | Taps each object to count, numbers appear, then picks the total | CR-004 |
| `match` | Taps a word, then its matching picture | FR-029 (matching) |
| `order` | Moves items up/down into the right sequence | FR-029 (ordering) |
| `sort` | Taps an item, then taps the correct category box | FR-029 (drag-and-drop / sorting) |
| `pattern` | Chooses what comes next in a colour/number pattern | Numeracy patterns |
| `fraction` | Taps the shaded shape showing ½ or ¼ (inline SVG) | CR-004 |
| `phonics` | Hears a spoken word/French phrase (speech synthesis) and picks the match | CR-003 (audio-led) |
| `type` | Types a short response | FR-029 (typed) |
| `report` | Practises the **"tell a trusted adult"** safe-content flow | CR-009, SEC-010 |

### Child-safety features baked in (SRS Section 11)

- **"Tell an adult" button** on every screen and inside every activity (FR-035, SEC-010).
- No public leaderboards or learner-to-learner comparison (BR-008).
- Positive reinforcement only — stars, badges and celebrations (FR-034).
- **No network access**: strict Content-Security-Policy, sandboxed renderer, and
  external links blocked/redirected to the system browser (learner containment).
- Save & resume via local progress store (FR-031).

---

## Curriculum content

Encoded in [`src/data/curriculum.js`](src/data/curriculum.js) directly from the
SRS **Appendix A** catalogue — data-driven so new terms/topics are configuration,
not code (NFR-011):

- **Term 1 & Term 2**, Year 1, 2025/2026
- **7 subjects**: Literacy, Numeracy, Science, Unit of Inquiry, ICT, French, Creative Arts/Arts
- Full hierarchy: *Term → Subject → Strand → Topic → Learning Objective → Activity* (SRS 3.2)

---

## Project structure

```
electron/
  main.js         Desktop window, safe menu, safety-report IPC, link containment
  preload.js      Minimal secure bridge (contextIsolation)
src/
  index.html      App shell (with CSP)
  styles.css      Child-friendly UI: large targets, high contrast (SRS 13.1)
  data/curriculum.js   Year 1 curriculum + activity catalogue (from SRS Appendix A)
  progress.js     Save/resume, stars, objective mastery (FR-031/034/040)
  activities.js   Interactive activity engine (all 10 types)
  app.js          Navigation + Learner/Teacher/Parent views
build/
  icon.ico / icon.png   App + installer icon
.github/workflows/
  build-windows.yml     CI that builds the Windows installer
```

---

## Building the Windows installer

The installer is built with **`electron-builder`** targeting **NSIS**
(a customisable `Innovatia-Learning-Setup-<version>.exe` that lets the user
choose an install directory, and creates Start-menu and desktop shortcuts).

### Option A — automated (recommended)

Push to `main` (or run the workflow manually). The
[`Build Windows Installer`](.github/workflows/build-windows.yml) GitHub Action
runs on a **Windows runner**, builds the installer, and uploads it as the
`innovatia-learning-windows-installer` artifact. Pushing a `v*` tag also
attaches the installer to a GitHub Release.

### Option B — locally on Windows

```powershell
npm install
npm run dist          # -> dist/Innovatia-Learning-Setup-1.0.0.exe
```

Other targets:

```powershell
npm run dist:portable # single portable .exe (no install)
npm run pack          # unpacked app folder (for quick testing)
```

> `electron-builder` assembles Windows installers on Windows. Build on a Windows
> machine or use the provided CI. Icons (`build/icon.ico`) are already included.

### Running in development (any OS)

```bash
npm install
npm start             # launches the Electron app
```

---

## Verification

The interactive renderer was exercised end-to-end in Chromium (the same engine
Electron uses): every activity type was driven to completion — counting, matching,
ordering, tap-to-sort, patterns, fractions, phonics, the report-safety drill —
plus star accrual, save/resume, and the Teacher and Parent dashboards, with no
console errors.

---

## Requirements traceability (summary)

| SRS area | Where implemented |
|----------|-------------------|
| Curriculum hierarchy & catalogue (FR-009, Appendix A) | `src/data/curriculum.js` |
| Learner experience & response types (FR-027–FR-035, CR-001–CR-011) | `src/activities.js` |
| Save & resume, mastery (FR-031, FR-040) | `src/progress.js` |
| Positive reinforcement, no ranking (FR-034, BR-008) | `activities.js` (stars/celebrate) |
| Safe exit & report unsafe content (FR-035, SEC-010) | `app.js`, `main.js` (IPC) |
| Coverage & mastery reporting (FR-025, FR-054, FR-055, §9) | `app.js` (Teacher view) |
| Parent plain-language progress (FR-046, FR-047) | `app.js` (Parent view) |
| Learner containment / no open browsing (SEC, §2.3) | `main.js`, `index.html` CSP |

---

*Built from the Innovatia Learning Platform SRS v1.0. Learning content is
illustrative for the pilot and must be validated by the academic owner before
publication (SRS Appendix A note).*
