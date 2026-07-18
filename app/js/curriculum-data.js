/*
 * Curriculum baseline for Year Level One, Terms 1 & 2, Academic Year 2025/2026.
 * Derived from the SRS "Appendix A. Detailed Curriculum Catalogue".
 * Hierarchy (SRS 3.2): Subject → Strand → Topic. Activities reference topics
 * by id so the teacher dashboard can compute curriculum coverage (FR-025).
 */
window.CURRICULUM = {
  academicYear: '2025/2026',
  yearLevel: 'Year 1',
  subjects: [
    {
      id: 'literacy',
      name: 'Literacy',
      icon: '📚',
      color: '#e8556d',
      strands: [
        { id: 'lit-genres', name: 'Reading & Writing Genres', topics: [
          { id: 'lit-informative', term: 1, name: 'Informative texts: main idea and details' },
          { id: 'lit-tales', term: 1, name: 'Traditional tales: characters and setting' },
          { id: 'lit-rhymes', term: 1, name: 'Poetry: traditional rhymes' },
          { id: 'lit-stories', term: 2, name: 'Stories with familiar settings' },
          { id: 'lit-procedural', term: 2, name: 'Instructions and procedural writing' }
        ]},
        { id: 'lit-grammar', name: 'Grammar & Punctuation', topics: [
          { id: 'lit-sentences', term: 1, name: 'Sentence types: statements, questions, commands, exclamations' },
          { id: 'lit-speech', term: 1, name: 'Parts of speech: nouns, verbs, pronouns' },
          { id: 'lit-adjectives', term: 2, name: 'Adjectives, prepositions and punctuation' }
        ]},
        { id: 'lit-phonics', name: 'Phonics & Vocabulary', topics: [
          { id: 'lit-phonemes', term: 1, name: 'Phonemes, short and long vowels, rhyming words' },
          { id: 'lit-digraphs', term: 2, name: 'Digraphs, synonyms and antonyms' }
        ]}
      ]
    },
    {
      id: 'numeracy',
      name: 'Numeracy',
      icon: '🔢',
      color: '#2f7de1',
      strands: [
        { id: 'num-sense', name: 'Number & Number Sense 0–100', topics: [
          { id: 'num-counting', term: 1, name: 'Counting, comparing and ordering numbers' },
          { id: 'num-oddeven', term: 1, name: 'Skip counting, even and odd numbers' }
        ]},
        { id: 'num-place', name: 'Place Value', topics: [
          { id: 'num-placevalue', term: 1, name: 'Place value to 100 and ordinals' }
        ]},
        { id: 'num-patterns', name: 'Algebra: Patterns & Relationship', topics: [
          { id: 'num-pattern', term: 1, name: 'Number, shape, sound and action patterns' }
        ]},
        { id: 'num-addsub', name: 'Addition & Subtraction', topics: [
          { id: 'num-addition', term: 2, name: 'Addition and subtraction strategies and word problems' },
          { id: 'num-factfam', term: 2, name: 'Fact families and missing addends' }
        ]},
        { id: 'num-money', name: 'Money', topics: [
          { id: 'num-cedi', term: 2, name: 'Ghanaian coins and notes; money addition' }
        ]},
        { id: 'num-fractions', name: 'Fractions', topics: [
          { id: 'num-fraction', term: 2, name: 'Wholes, equal parts and unit fractions' }
        ]}
      ]
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      color: '#1fa06a',
      strands: [
        { id: 'sci-enquiry', name: 'Scientific Enquiry', topics: [
          { id: 'sci-tools', term: 1, name: 'Models, tools and safety' },
          { id: 'sci-measure', term: 2, name: 'Purpose, planning and measurement' }
        ]},
        { id: 'sci-life', name: 'Life Processes & Life Cycles', topics: [
          { id: 'sci-living', term: 1, name: 'Living and non-living things' },
          { id: 'sci-body', term: 1, name: 'External body parts and the five senses' },
          { id: 'sci-seeds', term: 2, name: 'Seeds and plants' }
        ]},
        { id: 'sci-animals', name: 'Classification of Animals', topics: [
          { id: 'sci-classify', term: 2, name: 'Animal families: reptiles, birds, insects, fishes' }
        ]},
        { id: 'sci-eco', name: 'Ecosystems & Materials', topics: [
          { id: 'sci-habitats', term: 2, name: 'Terrestrial and aquatic habitats' }
        ]},
        { id: 'sci-forces', name: 'Forces & Movement', topics: [
          { id: 'sci-forces1', term: 1, name: 'Pushes, pulls, float and sink' }
        ]}
      ]
    },
    {
      id: 'uoi',
      name: 'Unit of Inquiry',
      icon: '🌍',
      color: '#b3641f',
      strands: [
        { id: 'uoi-identity', name: 'Identity, Community & Environment', topics: [
          { id: 'uoi-family', term: 1, name: 'Myself, family, home, school and community' },
          { id: 'uoi-weather', term: 1, name: 'Environment and weather' }
        ]},
        { id: 'uoi-express', name: 'How We Express Ourselves', topics: [
          { id: 'uoi-maps', term: 2, name: 'Map making, landmarks and cardinal directions' }
        ]},
        { id: 'uoi-citizen', name: 'Constitution & Citizenship', topics: [
          { id: 'uoi-rights', term: 2, name: 'Rights, responsibilities and being a good citizen' },
          { id: 'uoi-leaders', term: 2, name: 'Leaders, Kwame Nkrumah and national days' }
        ]}
      ]
    },
    {
      id: 'ict',
      name: 'ICT',
      icon: '💻',
      color: '#6a51c7',
      strands: [
        { id: 'ict-intro', name: 'Introduction to Computer', topics: [
          { id: 'ict-parts', term: 1, name: 'Computer parts: mouse, keyboard, monitor, system unit' },
          { id: 'ict-data', term: 1, name: 'Data, information and data collection' }
        ]},
        { id: 'ict-skills', name: 'Mouse & Keyboard', topics: [
          { id: 'ict-typing', term: 2, name: 'Clicking, dragging, keys and typing' }
        ]},
        { id: 'ict-safety', name: 'Password & Digital Safety', topics: [
          { id: 'ict-password', term: 2, name: 'Passwords and why they matter' },
          { id: 'ict-report', term: 2, name: 'Reporting unsafe or uncomfortable content' }
        ]}
      ]
    },
    {
      id: 'french',
      name: 'French',
      icon: '🇫🇷',
      color: '#0f7f8c',
      strands: [
        { id: 'fr-comm', name: 'Communication', topics: [
          { id: 'fr-greetings', term: 1, name: 'Greetings and introducing myself' },
          { id: 'fr-numbers', term: 1, name: 'Counting 0–10' },
          { id: 'fr-days', term: 1, name: 'Days of the week' },
          { id: 'fr-family', term: 1, name: 'Nuclear family vocabulary' }
        ]}
      ]
    },
    {
      id: 'arts',
      name: 'Creative Arts',
      icon: '🎨',
      color: '#c23fa4',
      strands: [
        { id: 'arts-visual', name: 'Visual Arts', topics: [
          { id: 'arts-pattern', term: 1, name: 'Pattern making, printmaking and lettering' },
          { id: 'arts-drawing', term: 2, name: 'Making pictures, drawing and colour' }
        ]},
        { id: 'arts-perform', name: 'Performing Arts', topics: [
          { id: 'arts-music', term: 1, name: 'Music, tonic solfa and singing' },
          { id: 'arts-sound', term: 2, name: 'Sound exploration and comparing sounds' }
        ]}
      ]
    }
  ]
};
