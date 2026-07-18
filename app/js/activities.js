/*
 * Interactive learning activities for Year 1, mapped to curriculum topics.
 * Activity mechanics implement SRS FR-029 response types and the minimum
 * digital activity types listed in SRS section 7.1:
 *   choice  – tap/click choice (supports pictures, audio prompts, patterns, counting)
 *   order   – tap items in the correct sequence (sequencing / ordering)
 *   sort    – drag or tap items into labelled groups (classification)
 *   type    – short typed response / keyboard practice
 *   draw    – free drawing canvas with teacher-observed completion
 * Every step may carry `say` (spoken aloud, FR-030 audio support) and `lang`.
 */
window.ACTIVITIES = [

  /* ---------------- LITERACY ---------------- */
  {
    id: 'act-rhyme-time', subject: 'literacy', term: 1, topicId: 'lit-phonemes',
    title: 'Rhyme Time', icon: '🎵',
    objective: 'I can hear and match rhyming words.',
    type: 'choice',
    steps: [
      { prompt: 'Which word rhymes with CAT?', say: 'Which word rhymes with cat?', visual: '🐱',
        options: [{ label: 'hat', emoji: '🎩' }, { label: 'dog', emoji: '🐶' }, { label: 'sun', emoji: '☀️' }], answer: 0 },
      { prompt: 'Which word rhymes with STAR?', say: 'Which word rhymes with star?', visual: '⭐',
        options: [{ label: 'moon', emoji: '🌙' }, { label: 'car', emoji: '🚗' }, { label: 'tree', emoji: '🌳' }], answer: 1 },
      { prompt: 'Which word rhymes with FROG?', say: 'Which word rhymes with frog?', visual: '🐸',
        options: [{ label: 'fish', emoji: '🐟' }, { label: 'bird', emoji: '🐦' }, { label: 'log', emoji: '🪵' }], answer: 2 },
      { prompt: 'Which word rhymes with CAKE?', say: 'Which word rhymes with cake?', visual: '🎂',
        options: [{ label: 'snake', emoji: '🐍' }, { label: 'bread', emoji: '🍞' }, { label: 'milk', emoji: '🥛' }], answer: 0 }
    ]
  },
  {
    id: 'act-vowel-sounds', subject: 'literacy', term: 1, topicId: 'lit-phonemes',
    title: 'Listen for the Sound', icon: '👂',
    objective: 'I can hear short vowel sounds at the start of words.',
    type: 'choice',
    steps: [
      { prompt: 'Tap the picture that starts with the “a” sound.', say: 'a, a, a. Which picture starts with the a sound?',
        options: [{ label: 'apple', emoji: '🍎' }, { label: 'ball', emoji: '⚽' }, { label: 'cup', emoji: '🥤' }], answer: 0 },
      { prompt: 'Tap the picture that starts with the “e” sound.', say: 'e, e, e. Which picture starts with the e sound?',
        options: [{ label: 'sock', emoji: '🧦' }, { label: 'egg', emoji: '🥚' }, { label: 'moon', emoji: '🌙' }], answer: 1 },
      { prompt: 'Tap the picture that starts with the “o” sound.', say: 'o, o, o. Which picture starts with the o sound?',
        options: [{ label: 'fish', emoji: '🐟' }, { label: 'hat', emoji: '🎩' }, { label: 'octopus', emoji: '🐙' }], answer: 2 }
    ]
  },
  {
    id: 'act-sentence-types', subject: 'literacy', term: 1, topicId: 'lit-sentences',
    title: 'What Kind of Sentence?', icon: '❓',
    objective: 'I can tell statements, questions and exclamations apart.',
    type: 'choice',
    steps: [
      { prompt: '“Where is my book?” — what kind of sentence is this?', say: 'Where is my book?',
        options: [{ label: 'Question', emoji: '❓' }, { label: 'Statement', emoji: '💬' }, { label: 'Exclamation', emoji: '❗' }], answer: 0 },
      { prompt: '“I like mangoes.” — what kind of sentence is this?', say: 'I like mangoes.',
        options: [{ label: 'Question', emoji: '❓' }, { label: 'Statement', emoji: '💬' }, { label: 'Exclamation', emoji: '❗' }], answer: 1 },
      { prompt: '“What a beautiful day!” — what kind of sentence is this?', say: 'What a beautiful day!',
        options: [{ label: 'Question', emoji: '❓' }, { label: 'Statement', emoji: '💬' }, { label: 'Exclamation', emoji: '❗' }], answer: 2 },
      { prompt: '“Please close the door.” — this sentence gives a…', say: 'Please close the door.',
        options: [{ label: 'Command', emoji: '👉' }, { label: 'Question', emoji: '❓' }, { label: 'Exclamation', emoji: '❗' }], answer: 0 }
    ]
  },
  {
    id: 'act-story-order', subject: 'literacy', term: 2, topicId: 'lit-procedural',
    title: 'Put the Story in Order', icon: '📖',
    objective: 'I can sequence the steps of a simple procedure.',
    type: 'order',
    steps: [
      { prompt: 'How do we wash our hands? Tap the steps in order.',
        say: 'Tap the steps for washing your hands in the right order.',
        items: [{ label: 'Turn on the tap', emoji: '🚰' }, { label: 'Rub with soap', emoji: '🧼' }, { label: 'Rinse with water', emoji: '💦' }, { label: 'Dry your hands', emoji: '🤲' }] },
      { prompt: 'How do we plant a seed? Tap the steps in order.',
        say: 'Tap the steps for planting a seed in the right order.',
        items: [{ label: 'Dig a hole', emoji: '🕳️' }, { label: 'Put in the seed', emoji: '🌰' }, { label: 'Cover with soil', emoji: '🟤' }, { label: 'Water it', emoji: '💧' }] }
    ]
  },
  {
    id: 'act-noun-verb-sort', subject: 'literacy', term: 1, topicId: 'lit-speech',
    title: 'Noun or Verb?', icon: '🏷️',
    objective: 'I can sort naming words and doing words.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each word to the right box.',
        say: 'Is it a naming word or a doing word? Drag each word to the right box.',
        bins: [{ label: 'Nouns (naming words)', emoji: '🏠' }, { label: 'Verbs (doing words)', emoji: '🏃' }],
        items: [
          { label: 'school', emoji: '🏫', bin: 0 }, { label: 'jump', emoji: '🤸', bin: 1 },
          { label: 'teacher', emoji: '🧑‍🏫', bin: 0 }, { label: 'sing', emoji: '🎤', bin: 1 },
          { label: 'drum', emoji: '🥁', bin: 0 }, { label: 'run', emoji: '🏃', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-opposites', subject: 'literacy', term: 2, topicId: 'lit-digraphs',
    title: 'Opposites Attract', icon: '🔄',
    objective: 'I can match words with their antonyms.',
    type: 'choice',
    steps: [
      { prompt: 'What is the opposite of BIG?', say: 'What is the opposite of big?', visual: '🐘',
        options: [{ label: 'small', emoji: '🐭' }, { label: 'tall', emoji: '🦒' }, { label: 'fast', emoji: '🐆' }], answer: 0 },
      { prompt: 'What is the opposite of HOT?', say: 'What is the opposite of hot?', visual: '🔥',
        options: [{ label: 'wet', emoji: '💧' }, { label: 'cold', emoji: '🧊' }, { label: 'soft', emoji: '🧸' }], answer: 1 },
      { prompt: 'What is the opposite of HAPPY?', say: 'What is the opposite of happy?', visual: '😊',
        options: [{ label: 'sleepy', emoji: '😴' }, { label: 'hungry', emoji: '😋' }, { label: 'sad', emoji: '😢' }], answer: 2 }
    ]
  },

  /* ---------------- NUMERACY ---------------- */
  {
    id: 'act-count-me', subject: 'numeracy', term: 1, topicId: 'num-counting',
    title: 'Count with Me', icon: '🦋',
    objective: 'I can count objects up to 20.',
    type: 'choice',
    steps: [
      { prompt: 'How many butterflies can you count?', say: 'How many butterflies can you count?', visual: '🦋🦋🦋🦋🦋',
        options: [{ label: '4' }, { label: '5' }, { label: '6' }], answer: 1 },
      { prompt: 'How many stars can you count?', say: 'How many stars can you count?', visual: '⭐⭐⭐⭐⭐⭐⭐',
        options: [{ label: '7' }, { label: '6' }, { label: '8' }], answer: 0 },
      { prompt: 'How many mangoes can you count?', say: 'How many mangoes can you count?', visual: '🥭🥭🥭🥭🥭🥭🥭🥭🥭',
        options: [{ label: '8' }, { label: '10' }, { label: '9' }], answer: 2 },
      { prompt: 'Which group has MORE?', say: 'Which group has more?',
        options: [{ label: '3 drums', emoji: '🥁🥁🥁' }, { label: '5 drums', emoji: '🥁🥁🥁🥁🥁' }], answer: 1 }
    ]
  },
  {
    id: 'act-number-order', subject: 'numeracy', term: 1, topicId: 'num-counting',
    title: 'Number Line Builder', icon: '📏',
    objective: 'I can order numbers from smallest to biggest.',
    type: 'order',
    steps: [
      { prompt: 'Tap the numbers from smallest to biggest.', say: 'Tap the numbers from smallest to biggest.',
        items: [{ label: '3' }, { label: '7' }, { label: '12' }, { label: '20' }] },
      { prompt: 'Now try these! Smallest to biggest.', say: 'Tap the numbers from smallest to biggest.',
        items: [{ label: '14' }, { label: '41' }, { label: '44' }, { label: '50' }] }
    ]
  },
  {
    id: 'act-odd-even', subject: 'numeracy', term: 1, topicId: 'num-oddeven',
    title: 'Odd and Even Sort', icon: '⚖️',
    objective: 'I can sort odd and even numbers.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each number into the right box.',
        say: 'Is the number odd or even? Drag each number into the right box.',
        bins: [{ label: 'Even', emoji: '🟦' }, { label: 'Odd', emoji: '🟨' }],
        items: [
          { label: '2', bin: 0 }, { label: '7', bin: 1 }, { label: '10', bin: 0 },
          { label: '13', bin: 1 }, { label: '16', bin: 0 }, { label: '9', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-patterns', subject: 'numeracy', term: 1, topicId: 'num-pattern',
    title: 'Pattern Detective', icon: '🔍',
    objective: 'I can find the missing item in a pattern.',
    type: 'choice',
    steps: [
      { prompt: 'What comes next? 🔴 🔵 🔴 🔵 🔴 …', say: 'Red, blue, red, blue, red. What comes next?', visual: '🔴🔵🔴🔵🔴❔',
        options: [{ label: 'blue', emoji: '🔵' }, { label: 'red', emoji: '🔴' }, { label: 'green', emoji: '🟢' }], answer: 0 },
      { prompt: 'What comes next? 🐘 🐘 🐢 🐘 🐘 …', say: 'Elephant, elephant, turtle. Elephant, elephant. What comes next?', visual: '🐘🐘🐢🐘🐘❔',
        options: [{ label: 'elephant', emoji: '🐘' }, { label: 'lion', emoji: '🦁' }, { label: 'turtle', emoji: '🐢' }], answer: 2 },
      { prompt: 'What number is missing? 2, 4, 6, ❔, 10', say: 'Two, four, six, something, ten. What number is missing?', visual: '2️⃣ 4️⃣ 6️⃣ ❔ 🔟',
        options: [{ label: '7' }, { label: '8' }, { label: '9' }], answer: 1 }
    ]
  },
  {
    id: 'act-place-value', subject: 'numeracy', term: 1, topicId: 'num-placevalue',
    title: 'Tens and Ones', icon: '🧮',
    objective: 'I can say how many tens and ones make a number.',
    type: 'choice',
    steps: [
      { prompt: '2 tens and 3 ones make…', say: 'Two tens and three ones make what number?', visual: '🔟🔟 + ●●●',
        options: [{ label: '23' }, { label: '32' }, { label: '13' }], answer: 0 },
      { prompt: '4 tens and 0 ones make…', say: 'Four tens and zero ones make what number?', visual: '🔟🔟🔟🔟',
        options: [{ label: '14' }, { label: '4' }, { label: '40' }], answer: 2 },
      { prompt: 'In the number 57, the 5 means…', say: 'In the number fifty seven, what does the five mean?', visual: '5️⃣7️⃣',
        options: [{ label: '5 ones' }, { label: '5 tens' }, { label: '5 hundreds' }], answer: 1 }
    ]
  },
  {
    id: 'act-add-sub', subject: 'numeracy', term: 2, topicId: 'num-addition',
    title: 'Market Maths', icon: '🧺',
    objective: 'I can solve addition and subtraction word problems.',
    type: 'choice',
    steps: [
      { prompt: 'Ama has 3 oranges. Kofi gives her 4 more. How many now?', say: 'Ama has three oranges. Kofi gives her four more. How many oranges does she have now?', visual: '🍊🍊🍊 + 🍊🍊🍊🍊',
        options: [{ label: '6' }, { label: '7' }, { label: '8' }], answer: 1 },
      { prompt: 'There were 9 birds. 3 flew away. How many are left?', say: 'There were nine birds. Three flew away. How many are left?', visual: '🐦×9 − 🐦×3',
        options: [{ label: '6' }, { label: '5' }, { label: '12' }], answer: 0 },
      { prompt: 'What makes 10? 7 + ❔ = 10', say: 'Seven plus what makes ten?', visual: '7️⃣ ➕ ❔ = 🔟',
        options: [{ label: '2' }, { label: '4' }, { label: '3' }], answer: 2 },
      { prompt: 'Doubles! 6 + 6 = ?', say: 'Six plus six equals what?', visual: '🎲🎲',
        options: [{ label: '12' }, { label: '11' }, { label: '13' }], answer: 0 }
    ]
  },
  {
    id: 'act-cedi-shop', subject: 'numeracy', term: 2, topicId: 'num-cedi',
    title: 'Cedi Shop', icon: '🪙',
    objective: 'I can add Ghanaian coins and notes.',
    type: 'choice',
    steps: [
      { prompt: 'A pencil costs 2 cedis. Which note pays for it exactly?', say: 'A pencil costs two cedis. Which money pays for it exactly?', visual: '✏️ = GH₵2',
        options: [{ label: 'GH₵2 note' }, { label: 'GH₵5 note' }, { label: 'GH₵1 coin' }], answer: 0 },
      { prompt: 'GH₵1 + GH₵2 = ?', say: 'One cedi plus two cedis equals how many cedis?', visual: '🪙 + 💵',
        options: [{ label: 'GH₵2' }, { label: 'GH₵3' }, { label: 'GH₵4' }], answer: 1 },
      { prompt: 'You have GH₵5. A ball costs GH₵3. How much change?', say: 'You have five cedis. A ball costs three cedis. How much change do you get?', visual: '💵5 − ⚽3',
        options: [{ label: 'GH₵1' }, { label: 'GH₵3' }, { label: 'GH₵2' }], answer: 2 }
    ]
  },
  {
    id: 'act-fractions', subject: 'numeracy', term: 2, topicId: 'num-fraction',
    title: 'Fair Shares', icon: '🍕',
    objective: 'I can recognise halves and equal parts.',
    type: 'choice',
    steps: [
      { prompt: 'Which pizza is cut into 2 EQUAL parts?', say: 'Which pizza is cut into two equal parts?',
        options: [{ label: 'Two equal halves', emoji: '🍕|🍕' }, { label: 'One big, one small', emoji: '🍕|🤏' }], answer: 0 },
      { prompt: 'Ama eats one half of the orange. How much is left?', say: 'Ama eats one half of the orange. How much is left?', visual: '🍊 ➗ 2',
        options: [{ label: 'The whole orange' }, { label: 'One half' }, { label: 'Nothing' }], answer: 1 },
      { prompt: 'Share 6 sweets EQUALLY between 2 friends. Each gets…', say: 'Share six sweets equally between two friends. How many does each friend get?', visual: '🍬🍬🍬🍬🍬🍬 👧👦',
        options: [{ label: '2' }, { label: '4' }, { label: '3' }], answer: 2 }
    ]
  },

  /* ---------------- SCIENCE ---------------- */
  {
    id: 'act-living-sort', subject: 'science', term: 1, topicId: 'sci-living',
    title: 'Living or Non-living?', icon: '🌱',
    objective: 'I can sort living and non-living things.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each picture to the right box.',
        say: 'Is it living or non-living? Drag each picture to the right box.',
        bins: [{ label: 'Living', emoji: '🌱' }, { label: 'Non-living', emoji: '🪨' }],
        items: [
          { label: 'goat', emoji: '🐐', bin: 0 }, { label: 'rock', emoji: '🪨', bin: 1 },
          { label: 'tree', emoji: '🌳', bin: 0 }, { label: 'chair', emoji: '🪑', bin: 1 },
          { label: 'bird', emoji: '🐦', bin: 0 }, { label: 'bus', emoji: '🚌', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-five-senses', subject: 'science', term: 1, topicId: 'sci-body',
    title: 'My Five Senses', icon: '👀',
    objective: 'I can match each sense to its body part.',
    type: 'choice',
    steps: [
      { prompt: 'Which body part do we SEE with?', say: 'Which body part do we see with?', visual: '🌈',
        options: [{ label: 'eyes', emoji: '👀' }, { label: 'ears', emoji: '👂' }, { label: 'nose', emoji: '👃' }], answer: 0 },
      { prompt: 'Which body part do we HEAR with?', say: 'Which body part do we hear with?', visual: '🥁',
        options: [{ label: 'tongue', emoji: '👅' }, { label: 'ears', emoji: '👂' }, { label: 'hands', emoji: '🤲' }], answer: 1 },
      { prompt: 'Which body part do we SMELL with?', say: 'Which body part do we smell with?', visual: '🌸',
        options: [{ label: 'eyes', emoji: '👀' }, { label: 'feet', emoji: '🦶' }, { label: 'nose', emoji: '👃' }], answer: 2 },
      { prompt: 'Which body part do we TASTE with?', say: 'Which body part do we taste with?', visual: '🍉',
        options: [{ label: 'tongue', emoji: '👅' }, { label: 'ears', emoji: '👂' }, { label: 'hair', emoji: '💇' }], answer: 0 }
    ]
  },
  {
    id: 'act-float-sink', subject: 'science', term: 1, topicId: 'sci-forces1',
    title: 'Float or Sink?', icon: '🛁',
    objective: 'I can predict which objects float and which sink.',
    type: 'sort',
    steps: [
      { prompt: 'Predict! Drag each object to Float or Sink.',
        say: 'Will it float or sink? Drag each object to the right box.',
        bins: [{ label: 'Floats', emoji: '🛟' }, { label: 'Sinks', emoji: '⬇️' }],
        items: [
          { label: 'leaf', emoji: '🍃', bin: 0 }, { label: 'stone', emoji: '🪨', bin: 1 },
          { label: 'ball', emoji: '🏐', bin: 0 }, { label: 'key', emoji: '🔑', bin: 1 },
          { label: 'paper boat', emoji: '⛵', bin: 0 }, { label: 'coin', emoji: '🪙', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-push-pull', subject: 'science', term: 1, topicId: 'sci-forces1',
    title: 'Push or Pull?', icon: '💪',
    objective: 'I can say when a force is a push or a pull.',
    type: 'choice',
    steps: [
      { prompt: 'Kicking a football is a…', say: 'Kicking a football is a push or a pull?', visual: '⚽🦵',
        options: [{ label: 'push', emoji: '👉' }, { label: 'pull', emoji: '👈' }], answer: 0 },
      { prompt: 'Opening a drawer is a…', say: 'Opening a drawer is a push or a pull?', visual: '🗄️',
        options: [{ label: 'push', emoji: '👉' }, { label: 'pull', emoji: '👈' }], answer: 1 },
      { prompt: 'A tug-of-war team uses a…', say: 'A tug of war team uses a push or a pull?', visual: '🪢',
        options: [{ label: 'push', emoji: '👉' }, { label: 'pull', emoji: '👈' }], answer: 1 }
    ]
  },
  {
    id: 'act-animal-families', subject: 'science', term: 2, topicId: 'sci-classify',
    title: 'Animal Families', icon: '🦎',
    objective: 'I can classify animals into their families.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each animal to its family.',
        say: 'Is it a bird, a fish, or an insect? Drag each animal to its family.',
        bins: [{ label: 'Birds', emoji: '🐦' }, { label: 'Fishes', emoji: '🐟' }, { label: 'Insects', emoji: '🐜' }],
        items: [
          { label: 'eagle', emoji: '🦅', bin: 0 }, { label: 'tilapia', emoji: '🐟', bin: 1 },
          { label: 'butterfly', emoji: '🦋', bin: 2 }, { label: 'hen', emoji: '🐔', bin: 0 },
          { label: 'shark', emoji: '🦈', bin: 1 }, { label: 'bee', emoji: '🐝', bin: 2 }
        ] }
    ]
  },
  {
    id: 'act-habitats', subject: 'science', term: 2, topicId: 'sci-habitats',
    title: 'Where Do I Live?', icon: '🏞️',
    objective: 'I can match animals to land and water habitats.',
    type: 'sort',
    steps: [
      { prompt: 'Land or water? Drag each animal home.',
        say: 'Does it live on land or in water? Drag each animal to its home.',
        bins: [{ label: 'Land (terrestrial)', emoji: '🌾' }, { label: 'Water (aquatic)', emoji: '🌊' }],
        items: [
          { label: 'camel', emoji: '🐫', bin: 0 }, { label: 'octopus', emoji: '🐙', bin: 1 },
          { label: 'lion', emoji: '🦁', bin: 0 }, { label: 'whale', emoji: '🐋', bin: 1 },
          { label: 'crab', emoji: '🦀', bin: 1 }, { label: 'goat', emoji: '🐐', bin: 0 }
        ] }
    ]
  },
  {
    id: 'act-seed-cycle', subject: 'science', term: 2, topicId: 'sci-seeds',
    title: 'From Seed to Plant', icon: '🌻',
    objective: 'I can sequence how a seed grows into a plant.',
    type: 'order',
    steps: [
      { prompt: 'Tap the pictures to show how a seed grows.',
        say: 'Tap the pictures in order to show how a seed grows into a plant.',
        items: [{ label: 'Seed', emoji: '🌰' }, { label: 'Sprout', emoji: '🌱' }, { label: 'Seedling', emoji: '🪴' }, { label: 'Flower', emoji: '🌻' }] }
    ]
  },

  /* ---------------- UOI ---------------- */
  {
    id: 'act-directions', subject: 'uoi', term: 2, topicId: 'uoi-maps',
    title: 'Compass Explorer', icon: '🧭',
    objective: 'I can use North, South, East and West.',
    type: 'choice',
    steps: [
      { prompt: 'On a compass, which direction points UP on a map?', say: 'On a map, which direction usually points up?', visual: '🧭',
        options: [{ label: 'North', emoji: '⬆️' }, { label: 'South', emoji: '⬇️' }, { label: 'East', emoji: '➡️' }], answer: 0 },
      { prompt: 'The sun rises in the…', say: 'The sun rises in which direction?', visual: '🌅',
        options: [{ label: 'West', emoji: '⬅️' }, { label: 'East', emoji: '➡️' }, { label: 'North', emoji: '⬆️' }], answer: 1 },
      { prompt: 'Which is a landmark you might draw on a map of your town?', say: 'Which one is a landmark for your map?',
        options: [{ label: 'a cloud', emoji: '☁️' }, { label: 'a dream', emoji: '💭' }, { label: 'a market', emoji: '🏪' }], answer: 2 }
    ]
  },
  {
    id: 'act-rights-resp', subject: 'uoi', term: 2, topicId: 'uoi-rights',
    title: 'Rights and Responsibilities', icon: '🤝',
    objective: 'I can sort rights and responsibilities.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each card to Rights or Responsibilities.',
        say: 'Is it a right or a responsibility? Drag each card to the right box.',
        bins: [{ label: 'My Rights', emoji: '⭐' }, { label: 'My Responsibilities', emoji: '✅' }],
        items: [
          { label: 'Go to school', emoji: '🏫', bin: 0 }, { label: 'Tidy my room', emoji: '🧹', bin: 1 },
          { label: 'Be safe and cared for', emoji: '🛡️', bin: 0 }, { label: 'Help at home', emoji: '🏠', bin: 1 },
          { label: 'Have food and water', emoji: '🍲', bin: 0 }, { label: 'Respect others', emoji: '🤝', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-leaders', subject: 'uoi', term: 2, topicId: 'uoi-leaders',
    title: 'Great Leaders', icon: '🏛️',
    objective: 'I know about Kwame Nkrumah and our national days.',
    type: 'choice',
    steps: [
      { prompt: 'Who was Ghana’s first President?', say: 'Who was Ghana’s first President?', visual: '🇬🇭',
        options: [{ label: 'Kwame Nkrumah' }, { label: 'A footballer' }, { label: 'A singer' }], answer: 0 },
      { prompt: 'On Independence Day we celebrate…', say: 'What do we celebrate on Independence Day?', visual: '🎉🇬🇭',
        options: [{ label: 'A birthday party' }, { label: 'Ghana becoming free' }, { label: 'The rainy season' }], answer: 1 },
      { prompt: 'A good leader is someone who…', say: 'What does a good leader do?',
        options: [{ label: 'keeps everything', emoji: '🙅' }, { label: 'shouts loudest', emoji: '📢' }, { label: 'helps and listens', emoji: '👂🤝' }], answer: 2 }
    ]
  },
  {
    id: 'act-family-sort', subject: 'uoi', term: 1, topicId: 'uoi-family',
    title: 'Home and School Helpers', icon: '🏡',
    objective: 'I can say who helps me at home and at school.',
    type: 'sort',
    steps: [
      { prompt: 'Who helps where? Drag each helper to Home or School.',
        say: 'Who helps you at home, and who helps you at school? Drag each helper to the right place.',
        bins: [{ label: 'At Home', emoji: '🏡' }, { label: 'At School', emoji: '🏫' }],
        items: [
          { label: 'mother', emoji: '👩', bin: 0 }, { label: 'teacher', emoji: '🧑‍🏫', bin: 1 },
          { label: 'father', emoji: '👨', bin: 0 }, { label: 'head teacher', emoji: '🧑‍💼', bin: 1 },
          { label: 'grandmother', emoji: '👵', bin: 0 }, { label: 'school nurse', emoji: '🧑‍⚕️', bin: 1 }
        ] }
    ]
  },
  {
    id: 'act-weather', subject: 'uoi', term: 1, topicId: 'uoi-weather',
    title: 'Weather Watch', icon: '🌦️',
    objective: 'I can match weather to what we wear and do.',
    type: 'choice',
    steps: [
      { prompt: 'It is raining! What do we use?', say: 'It is raining. What do we use?', visual: '🌧️',
        options: [{ label: 'umbrella', emoji: '☂️' }, { label: 'sunglasses', emoji: '🕶️' }, { label: 'kite', emoji: '🪁' }], answer: 0 },
      { prompt: 'It is very sunny. What keeps us cool?', say: 'It is very sunny. What helps keep us cool?', visual: '☀️',
        options: [{ label: 'a thick coat', emoji: '🧥' }, { label: 'a hat and water', emoji: '👒💧' }, { label: 'gloves', emoji: '🧤' }], answer: 1 },
      { prompt: 'A windy day is good for…', say: 'A windy day is good for what?', visual: '💨',
        options: [{ label: 'swimming', emoji: '🏊' }, { label: 'sleeping', emoji: '😴' }, { label: 'flying a kite', emoji: '🪁' }], answer: 2 }
    ]
  },

  /* ---------------- ICT ---------------- */
  {
    id: 'act-computer-parts', subject: 'ict', term: 1, topicId: 'ict-parts',
    title: 'Name That Part', icon: '🖥️',
    objective: 'I can identify the parts of a computer.',
    type: 'choice',
    steps: [
      { prompt: 'Which part shows pictures and words?', say: 'Which part of the computer shows pictures and words?', visual: '🖥️',
        options: [{ label: 'monitor', emoji: '🖥️' }, { label: 'mouse', emoji: '🖱️' }, { label: 'keyboard', emoji: '⌨️' }], answer: 0 },
      { prompt: 'Which part do we use to point and click?', say: 'Which part do we use to point and click?', visual: '👆',
        options: [{ label: 'monitor', emoji: '🖥️' }, { label: 'mouse', emoji: '🖱️' }, { label: 'speaker', emoji: '🔊' }], answer: 1 },
      { prompt: 'Which part has letter and number keys?', say: 'Which part has letters and numbers we press?', visual: '🔤',
        options: [{ label: 'mouse', emoji: '🖱️' }, { label: 'system unit', emoji: '🗄️' }, { label: 'keyboard', emoji: '⌨️' }], answer: 2 },
      { prompt: 'Which part is the computer’s “brain box”?', say: 'Which part is the computer’s brain box?', visual: '🧠',
        options: [{ label: 'system unit', emoji: '🗄️' }, { label: 'monitor', emoji: '🖥️' }, { label: 'mouse', emoji: '🖱️' }], answer: 0 }
    ]
  },
  {
    id: 'act-typing', subject: 'ict', term: 2, topicId: 'ict-typing',
    title: 'Keyboard Hero', icon: '⌨️',
    objective: 'I can find keys and type short words.',
    type: 'type',
    steps: [
      { prompt: 'Find the keys and type:', target: 'cat', say: 'Type the word cat. c. a. t.' },
      { prompt: 'Great! Now type:', target: 'sun', say: 'Type the word sun. s. u. n.' },
      { prompt: 'Now a longer one! Type:', target: 'school', say: 'Type the word school.' },
      { prompt: 'Type your number:', target: '10', say: 'Type the number ten. one, zero.' }
    ]
  },
  {
    id: 'act-password', subject: 'ict', term: 2, topicId: 'ict-password',
    title: 'Password Power', icon: '🔐',
    objective: 'I know how to keep my password safe.',
    type: 'choice',
    steps: [
      { prompt: 'What is a password for?', say: 'What is a password for?', visual: '🔐',
        options: [{ label: 'Keeping my things safe', emoji: '🛡️' }, { label: 'Sharing with everyone', emoji: '📣' }, { label: 'Decoration', emoji: '🎀' }], answer: 0 },
      { prompt: 'Who can I share my password with?', say: 'Who can I share my password with?', visual: '🤫',
        options: [{ label: 'Everyone in class', emoji: '🏫' }, { label: 'Only my trusted adult', emoji: '👨‍👩‍👧' }, { label: 'A stranger', emoji: '❓' }], answer: 1 },
      { prompt: 'Which is the strongest password?', say: 'Which password is the strongest?', visual: '💪',
        options: [{ label: '1111' }, { label: 'password' }, { label: 'Blue7Drum!' }], answer: 2 }
    ]
  },
  {
    id: 'act-safe-online', subject: 'ict', term: 2, topicId: 'ict-report',
    title: 'Tell an Adult', icon: '🚨',
    objective: 'I know what to do if something online feels wrong.',
    type: 'choice',
    steps: [
      { prompt: 'A picture on the screen makes you feel scared. What do you do?', say: 'A picture on the screen makes you feel scared. What should you do?', visual: '😟🖥️',
        options: [{ label: 'Tell a trusted adult', emoji: '🧑‍🏫' }, { label: 'Keep it secret', emoji: '🤐' }, { label: 'Show a friend', emoji: '👀' }], answer: 0 },
      { prompt: 'A message asks for your home address. What do you do?', say: 'A message asks where you live. What should you do?', visual: '✉️❓',
        options: [{ label: 'Type my address' }, { label: 'Do not answer, tell an adult' }, { label: 'Guess an address' }], answer: 1 },
      { prompt: 'Where is the “Tell an adult” button in this app?', say: 'Where is the tell an adult button in this app?', visual: '🚨',
        options: [{ label: 'There isn’t one' }, { label: 'Hidden in settings' }, { label: 'Top of the screen' }], answer: 2 }
    ]
  },

  /* ---------------- FRENCH ---------------- */
  {
    id: 'act-french-greetings', subject: 'french', term: 1, topicId: 'fr-greetings',
    title: 'Bonjour !', icon: '👋',
    objective: 'I can greet people in French.',
    type: 'choice',
    steps: [
      { prompt: 'Listen! “Bonjour” means…', say: 'Bonjour', lang: 'fr-FR', visual: '☀️👋',
        options: [{ label: 'Hello / Good day', emoji: '👋' }, { label: 'Goodbye', emoji: '🚪' }, { label: 'Thank you', emoji: '🙏' }], answer: 0 },
      { prompt: 'Listen! “Au revoir” means…', say: 'Au revoir', lang: 'fr-FR', visual: '🚪👋',
        options: [{ label: 'Hello', emoji: '👋' }, { label: 'Goodbye', emoji: '🚪' }, { label: 'Please', emoji: '🙏' }], answer: 1 },
      { prompt: 'How do you say “My name is Ama”?', say: 'Je m’appelle Ama', lang: 'fr-FR', visual: '👧',
        options: [{ label: 'Merci beaucoup' }, { label: 'Bonne nuit' }, { label: 'Je m’appelle Ama' }], answer: 2 },
      { prompt: 'Listen! “Merci” means…', say: 'Merci', lang: 'fr-FR', visual: '🙏',
        options: [{ label: 'Thank you', emoji: '🙏' }, { label: 'Sorry', emoji: '😔' }, { label: 'Stop', emoji: '✋' }], answer: 0 }
    ]
  },
  {
    id: 'act-french-numbers', subject: 'french', term: 1, topicId: 'fr-numbers',
    title: 'Compter 0–10', icon: '🔟',
    objective: 'I can count to ten in French.',
    type: 'choice',
    steps: [
      { prompt: 'Listen! “trois” is which number?', say: 'trois', lang: 'fr-FR', visual: '❔',
        options: [{ label: '3', emoji: '3️⃣' }, { label: '5', emoji: '5️⃣' }, { label: '7', emoji: '7️⃣' }], answer: 0 },
      { prompt: 'Listen! “cinq” is which number?', say: 'cinq', lang: 'fr-FR', visual: '❔',
        options: [{ label: '2', emoji: '2️⃣' }, { label: '5', emoji: '5️⃣' }, { label: '9', emoji: '9️⃣' }], answer: 1 },
      { prompt: 'Listen! “dix” is which number?', say: 'dix', lang: 'fr-FR', visual: '❔',
        options: [{ label: '6', emoji: '6️⃣' }, { label: '8', emoji: '8️⃣' }, { label: '10', emoji: '🔟' }], answer: 2 },
      { prompt: 'How do you say 1 in French?', say: 'un', lang: 'fr-FR', visual: '1️⃣',
        options: [{ label: 'un' }, { label: 'deux' }, { label: 'quatre' }], answer: 0 }
    ]
  },
  {
    id: 'act-french-days', subject: 'french', term: 1, topicId: 'fr-days',
    title: 'Les Jours', icon: '📅',
    objective: 'I can order the days of the week in French.',
    type: 'order',
    steps: [
      { prompt: 'Tap the French days in order, starting with Monday (lundi).',
        say: 'lundi, mardi, mercredi, jeudi. Tap the days in order.', lang: 'fr-FR',
        items: [{ label: 'lundi' }, { label: 'mardi' }, { label: 'mercredi' }, { label: 'jeudi' }] }
    ]
  },
  {
    id: 'act-french-family', subject: 'french', term: 1, topicId: 'fr-family',
    title: 'Ma Famille', icon: '👨‍👩‍👧‍👦',
    objective: 'I can name my family in French.',
    type: 'choice',
    steps: [
      { prompt: 'Listen! “la mère” means…', say: 'la mère', lang: 'fr-FR', visual: '👨‍👩‍👧‍👦',
        options: [{ label: 'mother', emoji: '👩' }, { label: 'brother', emoji: '👦' }, { label: 'dog', emoji: '🐶' }], answer: 0 },
      { prompt: 'Listen! “le père” means…', say: 'le père', lang: 'fr-FR', visual: '👨‍👩‍👧‍👦',
        options: [{ label: 'sister', emoji: '👧' }, { label: 'father', emoji: '👨' }, { label: 'baby', emoji: '👶' }], answer: 1 },
      { prompt: 'Listen! “la sœur” means…', say: 'la sœur', lang: 'fr-FR', visual: '👨‍👩‍👧‍👦',
        options: [{ label: 'grandfather', emoji: '👴' }, { label: 'mother', emoji: '👩' }, { label: 'sister', emoji: '👧' }], answer: 2 }
    ]
  },

  /* ---------------- CREATIVE ARTS ---------------- */
  {
    id: 'act-pattern-maker', subject: 'arts', term: 1, topicId: 'arts-pattern',
    title: 'Pattern Painter', icon: '🖌️',
    objective: 'I can continue a colour pattern.',
    type: 'choice',
    steps: [
      { prompt: 'Continue the kente pattern: 🟨 🟩 🟥 🟨 🟩 …', say: 'Yellow, green, red. Yellow, green. What comes next?', visual: '🟨🟩🟥🟨🟩❔',
        options: [{ label: 'red', emoji: '🟥' }, { label: 'yellow', emoji: '🟨' }, { label: 'blue', emoji: '🟦' }], answer: 0 },
      { prompt: 'Continue: 🔺 🔵 🔺 🔵 …', say: 'Triangle, circle, triangle, circle. What comes next?', visual: '🔺🔵🔺🔵❔',
        options: [{ label: 'circle', emoji: '🔵' }, { label: 'triangle', emoji: '🔺' }, { label: 'square', emoji: '🟪' }], answer: 1 },
      { prompt: 'Which two colours mix to make GREEN?', say: 'Which two colours mix together to make green?', visual: '🎨',
        options: [{ label: 'red + white' }, { label: 'black + red' }, { label: 'blue + yellow' }], answer: 2 }
    ]
  },
  {
    id: 'act-free-draw', subject: 'arts', term: 2, topicId: 'arts-drawing',
    title: 'My Drawing Board', icon: '✏️',
    objective: 'I can make a picture and show my teacher.',
    type: 'draw',
    steps: [
      { prompt: 'Draw a picture of your family, your school or your favourite animal!',
        say: 'Use the colours to draw a picture of your family, your school, or your favourite animal.' }
    ]
  },
  {
    id: 'act-solfa', subject: 'arts', term: 1, topicId: 'arts-music',
    title: 'Do Re Mi', icon: '🎼',
    objective: 'I can order the tonic solfa notes.',
    type: 'order',
    steps: [
      { prompt: 'Tap the solfa notes going UP the ladder.',
        say: 'Do, re, mi, fa. Tap the notes in order going up.',
        items: [{ label: 'do', emoji: '🎵' }, { label: 're', emoji: '🎵' }, { label: 'mi', emoji: '🎵' }, { label: 'fa', emoji: '🎵' }] }
    ]
  },
  {
    id: 'act-sounds', subject: 'arts', term: 2, topicId: 'arts-sound',
    title: 'Loud or Soft?', icon: '🔊',
    objective: 'I can compare loud and soft sounds.',
    type: 'sort',
    steps: [
      { prompt: 'Drag each sound-maker to Loud or Soft.',
        say: 'Does it make a loud sound or a soft sound? Drag each one to the right box.',
        bins: [{ label: 'Loud sounds', emoji: '🔊' }, { label: 'Soft sounds', emoji: '🔈' }],
        items: [
          { label: 'drum', emoji: '🥁', bin: 0 }, { label: 'whisper', emoji: '🤫', bin: 1 },
          { label: 'trumpet', emoji: '🎺', bin: 0 }, { label: 'falling leaf', emoji: '🍃', bin: 1 },
          { label: 'thunder', emoji: '⛈️', bin: 0 }, { label: 'kitten', emoji: '🐱', bin: 1 }
        ] }
    ]
  }
];
