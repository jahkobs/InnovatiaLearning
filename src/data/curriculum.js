/*
 * Innovatia Year 1 Curriculum & Interactive Activity Catalogue
 * -----------------------------------------------------------------
 * Derived from the Software Requirements Specification (Appendix A,
 * Term 1 & Term 2, Academic Year 2025/2026) and Section 7 (Curriculum
 * Content Requirements). Content is data-driven so new terms, topics
 * and activities are configuration rather than code (NFR-011).
 *
 * Hierarchy (SRS 3.2): Academic Year > Year Level > Term > Subject >
 * Strand > Topic > Learning Objective > Activity.
 *
 * Each activity declares a `type` understood by the activity engine:
 *   choice   - tap the correct option(s)          (FR-029 tap/click)
 *   count    - count objects and choose the number (CR-004)
 *   match    - match pairs, word <-> picture       (FR-029 matching)
 *   order    - arrange items into the right order  (FR-029 ordering)
 *   sort     - drag items into category bins        (FR-029 drag-and-drop)
 *   pattern  - choose what comes next in a pattern  (Numeracy patterns)
 *   fraction - choose the picture showing a fraction (CR-004)
 *   phonics  - hear a sound, choose the match        (CR-003 audio-led)
 *   type     - short typed response                  (FR-029 typed)
 *   report   - practise reporting unsafe content     (CR-009, SEC-010)
 */

const CURRICULUM = {
  academicYear: '2025/2026',
  yearLevel: 'Year 1',
  terms: [
    /* ================================ TERM 1 ================================ */
    {
      id: 'term1',
      name: 'Term 1',
      subjects: [
        /* ------------------------------ LITERACY ------------------------------ */
        {
          id: 't1-literacy',
          subject: 'Literacy',
          icon: '📖',
          color: '#5B9BD5',
          strand: 'Reading, Grammar & Phonics',
          topics: [
            {
              id: 't1-lit-main-idea',
              topic: 'Informative texts: main idea & details',
              objective: 'I can find the main idea and a detail in a short text.',
              activities: [
                {
                  id: 't1-lit-main-idea-a1',
                  type: 'choice',
                  prompt: 'The bee makes honey. It buzzes from flower to flower. What is this about?',
                  options: [
                    { label: '🐝 Bees', correct: true },
                    { label: '🚗 Cars' },
                    { label: '🌧️ Rain' }
                  ],
                  successCriteria: 'Chooses the main idea.'
                },
                {
                  id: 't1-lit-main-idea-a2',
                  type: 'choice',
                  prompt: 'Which sentence tells a DETAIL about the bee?',
                  options: [
                    { label: 'It buzzes from flower to flower.', correct: true },
                    { label: 'The sky is blue.' },
                    { label: 'I like ice cream.' }
                  ]
                },
                {
                  id: 't1-lit-main-idea-a3',
                  type: 'choice',
                  prompt: 'Fish live in water. They swim with their fins. What is this about?',
                  options: [
                    { label: '🐟 Fish', correct: true },
                    { label: '🌳 Trees' },
                    { label: '🚌 Buses' }
                  ]
                }
              ]
            },
            {
              id: 't1-lit-sentences',
              topic: 'Sentence types',
              objective: 'I can tell a question from a statement.',
              activities: [
                {
                  id: 't1-lit-sentences-a1',
                  type: 'choice',
                  prompt: 'Which one is a QUESTION?',
                  options: [
                    { label: 'What is your name?', correct: true },
                    { label: 'I have a red ball.' },
                    { label: 'The dog ran fast.' }
                  ]
                },
                {
                  id: 't1-lit-sentences-a2',
                  type: 'choice',
                  prompt: 'A sentence that gives an order is a COMMAND. Which is a command?',
                  options: [
                    { label: 'Close the door.', correct: true },
                    { label: 'Is it raining?' },
                    { label: 'My cat is soft.' }
                  ]
                }
              ]
            },
            {
              id: 't1-lit-phonics',
              topic: 'Phonics: short vowels & rhyming',
              objective: 'I can hear a sound and match it, and I can find rhyming words.',
              activities: [
                {
                  id: 't1-lit-phonics-a1',
                  type: 'phonics',
                  prompt: 'Listen to the word. Which letter does it START with?',
                  say: 'sun',
                  options: [
                    { label: 'S s', correct: true },
                    { label: 'M m' },
                    { label: 'T t' }
                  ]
                },
                {
                  id: 't1-lit-phonics-a2',
                  type: 'choice',
                  prompt: 'Which word RHYMES with "cat"?',
                  options: [
                    { label: '🎩 hat', correct: true },
                    { label: '🐕 dog' },
                    { label: '☀️ sun' }
                  ]
                }
              ]
            }
          ]
        },
        /* ------------------------------ NUMERACY ------------------------------ */
        {
          id: 't1-numeracy',
          subject: 'Numeracy',
          icon: '🔢',
          color: '#70AD47',
          strand: 'Number Sense, Place Value & Patterns',
          topics: [
            {
              id: 't1-num-count',
              topic: 'Counting & how many (0–100)',
              objective: 'I can count objects and say how many.',
              activities: [
                {
                  id: 't1-num-count-a1',
                  type: 'count',
                  prompt: 'Tap each apple to count them. How many are there?',
                  emoji: '🍎',
                  answer: 6
                },
                {
                  id: 't1-num-count-a2',
                  type: 'count',
                  prompt: 'Count the stars. How many?',
                  emoji: '⭐',
                  answer: 9
                },
                {
                  id: 't1-num-count-a3',
                  type: 'count',
                  prompt: 'Count the balloons. How many?',
                  emoji: '🎈',
                  answer: 5
                },
                {
                  id: 't1-num-count-a4',
                  type: 'choice',
                  prompt: 'How many fingers are on ONE hand? 🖐️',
                  options: [
                    { label: '5', correct: true },
                    { label: '4' },
                    { label: '10' }
                  ]
                }
              ]
            },
            {
              id: 't1-num-compare',
              topic: 'Comparing & ordering numbers',
              objective: 'I can find the bigger number.',
              activities: [
                {
                  id: 't1-num-compare-a1',
                  type: 'choice',
                  prompt: 'Which number is BIGGER?',
                  options: [
                    { label: '17', correct: true },
                    { label: '11' }
                  ]
                },
                {
                  id: 't1-num-compare-a2',
                  type: 'order',
                  prompt: 'Put the numbers in order from SMALLEST to biggest.',
                  items: ['3', '7', '10', '15'],
                  correctOrder: ['3', '7', '10', '15']
                }
              ]
            },
            {
              id: 't1-num-patterns',
              topic: 'Patterns & relationships',
              objective: 'I can find what comes next in a pattern.',
              activities: [
                {
                  id: 't1-num-patterns-a1',
                  type: 'pattern',
                  prompt: 'What comes NEXT in the pattern?',
                  sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'],
                  options: [
                    { label: '🔵', correct: true },
                    { label: '🔴' },
                    { label: '🟢' }
                  ]
                },
                {
                  id: 't1-num-patterns-a2',
                  type: 'pattern',
                  prompt: 'Skip counting by 2. What comes NEXT?',
                  sequence: ['2', '4', '6', '8'],
                  options: [
                    { label: '10', correct: true },
                    { label: '9' },
                    { label: '12' }
                  ]
                }
              ]
            }
          ]
        },
        /* ------------------------------ SCIENCE ------------------------------ */
        {
          id: 't1-science',
          subject: 'Science',
          icon: '🔬',
          color: '#ED7D31',
          strand: 'Life Processes, Body & Forces',
          topics: [
            {
              id: 't1-sci-living',
              topic: 'Living & non-living things',
              objective: 'I can sort living and non-living things.',
              activities: [
                {
                  id: 't1-sci-living-a1',
                  type: 'sort',
                  prompt: 'Tap a thing, then tap the right box.',
                  bins: ['Living', 'Non-living'],
                  items: [
                    { label: '🐶 dog', bin: 'Living' },
                    { label: '🌳 tree', bin: 'Living' },
                    { label: '🪨 rock', bin: 'Non-living' },
                    { label: '🚗 car', bin: 'Non-living' },
                    { label: '🦋 butterfly', bin: 'Living' },
                    { label: '⚽ ball', bin: 'Non-living' }
                  ]
                }
              ]
            },
            {
              id: 't1-sci-senses',
              topic: 'Body parts & the five senses',
              objective: 'I can match a sense to the body part.',
              activities: [
                {
                  id: 't1-sci-senses-a1',
                  type: 'match',
                  prompt: 'Match the body part to what it does.',
                  pairs: [
                    { left: '👀 Eyes', right: 'See' },
                    { left: '👂 Ears', right: 'Hear' },
                    { left: '👃 Nose', right: 'Smell' },
                    { left: '👅 Tongue', right: 'Taste' }
                  ]
                }
              ]
            },
            {
              id: 't1-sci-forces',
              topic: 'Pushes, pulls, float & sink',
              objective: 'I can tell a push from a pull, and floating from sinking.',
              activities: [
                {
                  id: 't1-sci-forces-a1',
                  type: 'choice',
                  prompt: 'You open a drawer by moving it toward you. Is that a push or a pull?',
                  options: [
                    { label: '⬅️ Pull', correct: true },
                    { label: '➡️ Push' }
                  ]
                },
                {
                  id: 't1-sci-forces-a2',
                  type: 'sort',
                  prompt: 'Which FLOAT and which SINK? Tap one, then tap a box.',
                  bins: ['Float', 'Sink'],
                  items: [
                    { label: '🍃 leaf', bin: 'Float' },
                    { label: '🪨 stone', bin: 'Sink' },
                    { label: '🦆 rubber duck', bin: 'Float' },
                    { label: '🔑 metal key', bin: 'Sink' }
                  ]
                }
              ]
            }
          ]
        },
        /* -------------------------------- UOI -------------------------------- */
        {
          id: 't1-uoi',
          subject: 'Unit of Inquiry',
          icon: '🌍',
          color: '#9B59B6',
          strand: 'Identity, Community & History',
          topics: [
            {
              id: 't1-uoi-community',
              topic: 'Home, school & community helpers',
              objective: 'I can match community helpers to what they do.',
              activities: [
                {
                  id: 't1-uoi-community-a1',
                  type: 'match',
                  prompt: 'Match the helper to their job.',
                  pairs: [
                    { left: '👩‍⚕️ Nurse', right: 'Helps sick people' },
                    { left: '👨‍🏫 Teacher', right: 'Helps you learn' },
                    { left: '👮 Police', right: 'Keeps us safe' },
                    { left: '👨‍🌾 Farmer', right: 'Grows food' }
                  ]
                }
              ]
            },
            {
              id: 't1-uoi-weather',
              topic: 'Weather',
              objective: 'I can choose the right clothes for the weather.',
              activities: [
                {
                  id: 't1-uoi-weather-a1',
                  type: 'choice',
                  prompt: 'It is raining. ☔ What should you take?',
                  options: [
                    { label: '☂️ Umbrella', correct: true },
                    { label: '🕶️ Sunglasses' },
                    { label: '🧣 Warm scarf' }
                  ]
                }
              ]
            }
          ]
        },
        /* -------------------------------- ICT -------------------------------- */
        {
          id: 't1-ict',
          subject: 'ICT',
          icon: '💻',
          color: '#00B0A6',
          strand: 'Introduction to Computers',
          topics: [
            {
              id: 't1-ict-parts',
              topic: 'Parts of a computer',
              objective: 'I can name the parts of a computer.',
              activities: [
                {
                  id: 't1-ict-parts-a1',
                  type: 'match',
                  prompt: 'Match the computer part to its name.',
                  pairs: [
                    { left: '🖱️', right: 'Mouse' },
                    { left: '⌨️', right: 'Keyboard' },
                    { left: '🖥️', right: 'Monitor' },
                    { left: '🖨️', right: 'Printer' }
                  ]
                },
                {
                  id: 't1-ict-parts-a2',
                  type: 'choice',
                  prompt: 'Which part do you use to TYPE letters?',
                  options: [
                    { label: '⌨️ Keyboard', correct: true },
                    { label: '🖥️ Monitor' },
                    { label: '🔊 Speaker' }
                  ]
                }
              ]
            }
          ]
        },
        /* ------------------------------- FRENCH ------------------------------- */
        {
          id: 't1-french',
          subject: 'French',
          icon: '🇫🇷',
          color: '#C0392B',
          strand: 'Communication',
          topics: [
            {
              id: 't1-fr-greetings',
              topic: 'Greetings & self (les salutations)',
              objective: 'I can greet people in French.',
              activities: [
                {
                  id: 't1-fr-greetings-a1',
                  type: 'phonics',
                  prompt: 'Listen. Which French word means "Hello"?',
                  say: 'Bonjour',
                  lang: 'fr-FR',
                  options: [
                    { label: 'Bonjour 👋', correct: true },
                    { label: 'Merci 🙏' },
                    { label: 'Au revoir 👋' }
                  ]
                },
                {
                  id: 't1-fr-greetings-a2',
                  type: 'match',
                  prompt: 'Match the French word to English.',
                  pairs: [
                    { left: 'Bonjour', right: 'Hello' },
                    { left: 'Merci', right: 'Thank you' },
                    { left: 'Oui', right: 'Yes' },
                    { left: 'Non', right: 'No' }
                  ]
                }
              ]
            },
            {
              id: 't1-fr-numbers',
              topic: 'Counting 0–10 (les nombres)',
              objective: 'I can order French numbers.',
              activities: [
                {
                  id: 't1-fr-numbers-a1',
                  type: 'order',
                  prompt: 'Put the French numbers in order: un, deux, trois, quatre.',
                  items: ['quatre', 'deux', 'un', 'trois'],
                  correctOrder: ['un', 'deux', 'trois', 'quatre']
                }
              ]
            }
          ]
        },
        /* ---------------------------- CREATIVE ARTS ---------------------------- */
        {
          id: 't1-arts',
          subject: 'Creative Arts',
          icon: '🎨',
          color: '#E67E22',
          strand: 'Visual & Performing Arts',
          topics: [
            {
              id: 't1-arts-pattern',
              topic: 'Pattern making',
              objective: 'I can continue a colour pattern.',
              activities: [
                {
                  id: 't1-arts-pattern-a1',
                  type: 'pattern',
                  prompt: 'Finish the weaving pattern. What comes next?',
                  sequence: ['🟥', '🟨', '🟥', '🟨', '🟥'],
                  options: [
                    { label: '🟨', correct: true },
                    { label: '🟥' },
                    { label: '🟦' }
                  ]
                }
              ]
            },
            {
              id: 't1-arts-music',
              topic: 'Music: high & low sounds',
              objective: 'I can order sounds from low to high (tonic solfa).',
              activities: [
                {
                  id: 't1-arts-music-a1',
                  type: 'order',
                  prompt: 'Order the notes going UP: do, re, mi, fa.',
                  items: ['mi', 'do', 'fa', 're'],
                  correctOrder: ['do', 're', 'mi', 'fa']
                }
              ]
            }
          ]
        }
      ]
    },

    /* ================================ TERM 2 ================================ */
    {
      id: 'term2',
      name: 'Term 2',
      subjects: [
        /* ------------------------------ LITERACY ------------------------------ */
        {
          id: 't2-literacy',
          subject: 'Literacy',
          icon: '📖',
          color: '#5B9BD5',
          strand: 'Reading Strategies, Procedural Writing & Grammar',
          topics: [
            {
              id: 't2-lit-sequence',
              topic: 'Procedural writing: sequencing',
              objective: 'I can put the steps of an instruction in order.',
              activities: [
                {
                  id: 't2-lit-sequence-a1',
                  type: 'order',
                  prompt: 'Order the steps to wash your hands.',
                  items: [
                    'Dry your hands',
                    'Turn on the tap',
                    'Rub with soap',
                    'Rinse with water'
                  ],
                  correctOrder: [
                    'Turn on the tap',
                    'Rub with soap',
                    'Rinse with water',
                    'Dry your hands'
                  ]
                }
              ]
            },
            {
              id: 't2-lit-adjectives',
              topic: 'Adjectives & prepositions',
              objective: 'I can find the describing word (adjective).',
              activities: [
                {
                  id: 't2-lit-adjectives-a1',
                  type: 'choice',
                  prompt: 'Find the ADJECTIVE (describing word): "The fluffy cat sleeps."',
                  options: [
                    { label: 'fluffy', correct: true },
                    { label: 'cat' },
                    { label: 'sleeps' }
                  ]
                },
                {
                  id: 't2-lit-adjectives-a2',
                  type: 'choice',
                  prompt: 'The cat is ___ the box. 🐱📦 Which word fits the picture?',
                  options: [
                    { label: 'on', correct: true },
                    { label: 'under' },
                    { label: 'behind' }
                  ]
                }
              ]
            },
            {
              id: 't2-lit-synonyms',
              topic: 'Synonyms & antonyms',
              objective: 'I can find a word with the opposite meaning.',
              activities: [
                {
                  id: 't2-lit-synonyms-a1',
                  type: 'match',
                  prompt: 'Match each word to its OPPOSITE (antonym).',
                  pairs: [
                    { left: 'big', right: 'small' },
                    { left: 'hot', right: 'cold' },
                    { left: 'up', right: 'down' },
                    { left: 'happy', right: 'sad' }
                  ]
                }
              ]
            }
          ]
        },
        /* ------------------------------ NUMERACY ------------------------------ */
        {
          id: 't2-numeracy',
          subject: 'Numeracy',
          icon: '🔢',
          color: '#70AD47',
          strand: 'Addition, Money & Fractions',
          topics: [
            {
              id: 't2-num-addition',
              topic: 'Addition & subtraction',
              objective: 'I can add and subtract small numbers.',
              activities: [
                {
                  id: 't2-num-addition-a1',
                  type: 'choice',
                  prompt: '3 🍏 + 2 🍏 = ?',
                  options: [
                    { label: '5', correct: true },
                    { label: '4' },
                    { label: '6' }
                  ]
                },
                {
                  id: 't2-num-addition-a2',
                  type: 'choice',
                  prompt: 'There are 7 birds. 3 fly away. How many are left?',
                  options: [
                    { label: '4', correct: true },
                    { label: '10' },
                    { label: '3' }
                  ]
                }
              ]
            },
            {
              id: 't2-num-money',
              topic: 'Ghanaian money',
              objective: 'I can add amounts of Ghana cedis.',
              activities: [
                {
                  id: 't2-num-money-a1',
                  type: 'choice',
                  prompt: 'You have GH₵2 and get GH₵3 more. How much now?',
                  options: [
                    { label: 'GH₵5', correct: true },
                    { label: 'GH₵1' },
                    { label: 'GH₵6' }
                  ]
                }
              ]
            },
            {
              id: 't2-num-fractions',
              topic: 'Fractions: equal parts',
              objective: 'I can choose the shape showing one half.',
              activities: [
                {
                  id: 't2-num-fractions-a1',
                  type: 'fraction',
                  prompt: 'Tap the pizza that shows ONE HALF ( ½ ) shaded.',
                  target: '1/2'
                },
                {
                  id: 't2-num-fractions-a2',
                  type: 'fraction',
                  prompt: 'Tap the shape that shows ONE QUARTER ( ¼ ) shaded.',
                  target: '1/4'
                }
              ]
            }
          ]
        },
        /* ------------------------------ SCIENCE ------------------------------ */
        {
          id: 't2-science',
          subject: 'Science',
          icon: '🔬',
          color: '#ED7D31',
          strand: 'Animals, Ecosystems & Materials',
          topics: [
            {
              id: 't2-sci-animals',
              topic: 'Classification of animals',
              objective: 'I can sort animals into groups.',
              activities: [
                {
                  id: 't2-sci-animals-a1',
                  type: 'sort',
                  prompt: 'Tap an animal, then tap its group.',
                  bins: ['Birds', 'Fish', 'Reptiles'],
                  items: [
                    { label: '🦅 eagle', bin: 'Birds' },
                    { label: '🐟 tuna', bin: 'Fish' },
                    { label: '🐊 crocodile', bin: 'Reptiles' },
                    { label: '🦜 parrot', bin: 'Birds' },
                    { label: '🐠 clownfish', bin: 'Fish' },
                    { label: '🐍 snake', bin: 'Reptiles' }
                  ]
                }
              ]
            },
            {
              id: 't2-sci-ecosystem',
              topic: 'Ecosystems: habitats',
              objective: 'I can match an animal to its home.',
              activities: [
                {
                  id: 't2-sci-ecosystem-a1',
                  type: 'match',
                  prompt: 'Match the animal to where it lives.',
                  pairs: [
                    { left: '🐫 Camel', right: 'Desert' },
                    { left: '🐸 Frog', right: 'Pond' },
                    { left: '🦁 Lion', right: 'Grassland' },
                    { left: '🐙 Octopus', right: 'Ocean' }
                  ]
                }
              ]
            },
            {
              id: 't2-sci-lifecycle',
              topic: 'Life cycle: seeds & plants',
              objective: 'I can order the stages a plant grows.',
              activities: [
                {
                  id: 't2-sci-lifecycle-a1',
                  type: 'order',
                  prompt: 'Order how a plant grows.',
                  items: ['🌻 flower', '🌱 seedling', '🌰 seed', '🌿 small plant'],
                  correctOrder: ['🌰 seed', '🌱 seedling', '🌿 small plant', '🌻 flower']
                }
              ]
            }
          ]
        },
        /* -------------------------------- UOI -------------------------------- */
        {
          id: 't2-uoi',
          subject: 'Unit of Inquiry',
          icon: '🌍',
          color: '#9B59B6',
          strand: 'Leadership, Citizenship & Maps',
          topics: [
            {
              id: 't2-uoi-directions',
              topic: 'Maps & cardinal directions',
              objective: 'I can name the cardinal directions.',
              activities: [
                {
                  id: 't2-uoi-directions-a1',
                  type: 'choice',
                  prompt: 'The sun rises in the ___.',
                  options: [
                    { label: '➡️ East', correct: true },
                    { label: '⬅️ West' },
                    { label: '⬆️ North' }
                  ]
                }
              ]
            },
            {
              id: 't2-uoi-citizen',
              topic: 'Citizenship: rights & responsibilities',
              objective: 'I can tell a good-citizen action.',
              activities: [
                {
                  id: 't2-uoi-citizen-a1',
                  type: 'choice',
                  prompt: 'Which one is being a GOOD citizen?',
                  options: [
                    { label: '🗑️ Putting litter in the bin', correct: true },
                    { label: '🌿 Picking all the flowers' },
                    { label: '📢 Shouting in class' }
                  ]
                }
              ]
            }
          ]
        },
        /* -------------------------------- ICT -------------------------------- */
        {
          id: 't2-ict',
          subject: 'ICT',
          icon: '💻',
          color: '#00B0A6',
          strand: 'Keyboard, Passwords & Digital Safety',
          topics: [
            {
              id: 't2-ict-gestures',
              topic: 'Mouse & keyboard skills',
              objective: 'I can match a computer action to what it does.',
              activities: [
                {
                  id: 't2-ict-gestures-a1',
                  type: 'match',
                  prompt: 'Match the action to what it means.',
                  pairs: [
                    { left: '👆 Click', right: 'Choose something' },
                    { left: '✋ Drag', right: 'Move something' },
                    { left: '🖐️ Scroll', right: 'Move up or down' },
                    { left: '⌨️ Type', right: 'Write letters' }
                  ]
                }
              ]
            },
            {
              id: 't2-ict-password',
              topic: 'Passwords & digital safety',
              objective: 'I know a password is secret, and I know how to report unsafe content.',
              activities: [
                {
                  id: 't2-ict-password-a1',
                  type: 'choice',
                  prompt: 'What should you do with your password?',
                  options: [
                    { label: '🤫 Keep it secret', correct: true },
                    { label: '📣 Tell everyone' },
                    { label: '✏️ Write it on your desk' }
                  ]
                },
                {
                  id: 't2-ict-password-a2',
                  type: 'report',
                  prompt:
                    'Something on the screen makes you feel worried or uncomfortable. ' +
                    'What is the safe thing to do?',
                  correctChoice: 'Tell a trusted adult and use the Report button',
                  options: [
                    'Tell a trusted adult and use the Report button',
                    'Keep it a secret',
                    'Click on it to see more'
                  ]
                }
              ]
            }
          ]
        },
        /* ------------------------------- FRENCH ------------------------------- */
        {
          id: 't2-french',
          subject: 'French',
          icon: '🇫🇷',
          color: '#C0392B',
          strand: 'Communication (revision & days)',
          topics: [
            {
              id: 't2-fr-days',
              topic: 'Days of the week (les jours)',
              objective: 'I can order the first French days of the week.',
              activities: [
                {
                  id: 't2-fr-days-a1',
                  type: 'order',
                  prompt: 'Order the French days: lundi, mardi, mercredi, jeudi.',
                  items: ['mercredi', 'lundi', 'jeudi', 'mardi'],
                  correctOrder: ['lundi', 'mardi', 'mercredi', 'jeudi']
                },
                {
                  id: 't2-fr-days-a2',
                  type: 'phonics',
                  prompt: 'Listen. Which French word means "Goodbye"?',
                  say: 'Au revoir',
                  lang: 'fr-FR',
                  options: [
                    { label: 'Au revoir 👋', correct: true },
                    { label: 'Bonjour 👋' },
                    { label: 'Merci 🙏' }
                  ]
                }
              ]
            }
          ]
        },
        /* ---------------------------------- ARTS ---------------------------------- */
        {
          id: 't2-arts',
          subject: 'Arts',
          icon: '🎨',
          color: '#E67E22',
          strand: 'Drawing, Print & Performance',
          topics: [
            {
              id: 't2-arts-colour',
              topic: 'Colour & printmaking',
              objective: 'I can mix primary colours.',
              activities: [
                {
                  id: 't2-arts-colour-a1',
                  type: 'choice',
                  prompt: 'Blue 🔵 and Yellow 🟡 mixed together make ___',
                  options: [
                    { label: '🟢 Green', correct: true },
                    { label: '🟣 Purple' },
                    { label: '🟠 Orange' }
                  ]
                }
              ]
            },
            {
              id: 't2-arts-sound',
              topic: 'Sound exploration',
              objective: 'I can compare loud and quiet sounds.',
              activities: [
                {
                  id: 't2-arts-sound-a1',
                  type: 'choice',
                  prompt: 'Which is usually the LOUDEST?',
                  options: [
                    { label: '🥁 Drum', correct: true },
                    { label: '🍃 Leaf falling' },
                    { label: '🐜 Ant walking' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Expose for both the browser (renderer) and any test tooling.
if (typeof window !== 'undefined') window.CURRICULUM = CURRICULUM;
if (typeof module !== 'undefined' && module.exports) module.exports = CURRICULUM;
