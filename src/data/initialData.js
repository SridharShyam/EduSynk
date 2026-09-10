export const INITIAL_SKILLS = [
  {
    id: 'skill-1',
    name: 'Python Programming',
    category: 'Programming & Tech',
    description: 'Learn Python basics, script automation, data structures, and web backend fundamentals.',
    popular: true,
    tags: ['Coding', 'Backend', 'Automation']
  },
  {
    id: 'skill-2',
    name: 'UI/UX Design & Figma',
    category: 'Design & Creative',
    description: 'Master wireframing, component design systems, prototyping, and user testing in Figma.',
    popular: true,
    tags: ['Design', 'Figma', 'User Experience']
  },
  {
    id: 'skill-3',
    name: 'Conversational Spanish',
    category: 'Languages',
    description: 'Practice real-life conversational Spanish, pronunciation, and everyday dialogue.',
    popular: true,
    tags: ['Spanish', 'Language', 'Culture']
  },
  {
    id: 'skill-4',
    name: 'Machine Learning & AI',
    category: 'AI & Data Science',
    description: 'Understand regression, neural networks, PyTorch basics, and model evaluation.',
    popular: true,
    tags: ['AI', 'Data Science', 'PyTorch']
  },
  {
    id: 'skill-5',
    name: 'Video Editing (Premiere Pro)',
    category: 'Media & Video',
    description: 'Timeline trimming, color grading, motion graphics, audio sync, and rendering formats.',
    popular: false,
    tags: ['Video', 'Editing', 'Premiere']
  },
  {
    id: 'skill-6',
    name: 'Public Speaking & Debate',
    category: 'Personal Growth & Leadership',
    description: 'Overcome stage fright, structure persuasive speeches, and refine body language.',
    popular: false,
    tags: ['Confidence', 'Presentation', 'Speech']
  },
  {
    id: 'skill-7',
    name: 'Data Structures & Algorithms',
    category: 'Programming & Tech',
    description: 'Trees, graphs, dynamic programming, time complexity analysis, and coding interviews.',
    popular: true,
    tags: ['CS', 'Algorithms', 'LeetCode']
  },
  {
    id: 'skill-8',
    name: 'Digital Illustration (Procreate)',
    category: 'Design & Creative',
    description: 'Character design, brush creation, color theory, and digital art techniques.',
    popular: false,
    tags: ['Art', 'Illustration', 'Drawing']
  },
  {
    id: 'skill-9',
    name: 'Financial Modeling & Excel',
    category: 'Business & Finance',
    description: 'Build discounted cash flow models, pivot tables, and financial projections.',
    popular: false,
    tags: ['Finance', 'Excel', 'Business']
  },
  {
    id: 'skill-10',
    name: 'Acoustic Guitar Basics',
    category: 'Music & Performing Arts',
    description: 'Open chords, strumming patterns, fingerpicking techniques, and tab reading.',
    popular: false,
    tags: ['Music', 'Guitar', 'Creative']
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    university: 'Stanford University',
    major: 'Computer Science (Senior)',
    bio: 'CS senior passionate about building practical software tools. Happy to teach Python or DS/Algo in exchange for design or language practice!',
    languages: ['English (Native)', 'Mandarin (Basic)'],
    availability: 'Weekday Evenings',
    preferredFormat: 'Online Live Sessions',
    reputationScore: 98,
    exchangesCompleted: 14,
    milestonesAchieved: 38,
    peerReviewsCount: 12,
    verifiedBadge: 'Master Peer Tutor',
    joinedDate: '2025-09-15',
    teachSkills: [
      { skillId: 'skill-1', level: 'Advanced', yearsExp: 3, notes: 'Can guide through real projects' },
      { skillId: 'skill-7', level: 'Advanced', yearsExp: 2, notes: 'Algorithm problem solving' }
    ],
    learnSkills: [
      { skillId: 'skill-2', level: 'Beginner', targetGoal: 'Design a polished mobile app mockup' },
      { skillId: 'skill-3', level: 'Beginner', targetGoal: 'Hold a 15-min conversational Spanish chat' }
    ]
  },
  {
    id: 'user-2',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    university: 'Rhode Island School of Design',
    major: 'Graphic & Product Design (Junior)',
    bio: 'UI/UX enthusiast who loves creating clean design systems. Looking to learn Python automation and backend basics to make interactive web prototypes.',
    languages: ['English (Native)', 'French (Intermediate)'],
    availability: 'Weekend Mornings',
    preferredFormat: 'Online Live Sessions',
    reputationScore: 96,
    exchangesCompleted: 11,
    milestonesAchieved: 29,
    peerReviewsCount: 10,
    verifiedBadge: 'Top Contributor',
    joinedDate: '2025-10-02',
    teachSkills: [
      { skillId: 'skill-2', level: 'Advanced', yearsExp: 3, notes: 'Figma component auto-layout pro' },
      { skillId: 'skill-8', level: 'Intermediate', yearsExp: 2, notes: 'Character illustration & color' }
    ],
    learnSkills: [
      { skillId: 'skill-1', level: 'Beginner', targetGoal: 'Automate design asset exports with Python' },
      { skillId: 'skill-6', level: 'Beginner', targetGoal: 'Deliver confident project presentations' }
    ]
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    university: 'Georgetown University',
    major: 'International Relations & Linguistics',
    bio: 'Native Spanish speaker and polyglot! I teach conversational Spanish and public speaking. Seeking help with Python data analysis for research.',
    languages: ['Spanish (Native)', 'English (Fluent)', 'Mandarin (Advanced)'],
    availability: 'Flexible Schedule',
    preferredFormat: 'Hybrid',
    reputationScore: 99,
    exchangesCompleted: 19,
    milestonesAchieved: 52,
    peerReviewsCount: 17,
    verifiedBadge: 'Community Mentor',
    joinedDate: '2025-08-20',
    teachSkills: [
      { skillId: 'skill-3', level: 'Advanced', yearsExp: 4, notes: 'Native speaker & culture coach' },
      { skillId: 'skill-6', level: 'Intermediate', yearsExp: 2, notes: 'Debate champ & speech structuring' }
    ],
    learnSkills: [
      { skillId: 'skill-1', level: 'Beginner', targetGoal: 'Analyze survey dataset with Pandas' },
      { skillId: 'skill-9', level: 'Beginner', targetGoal: 'Understand startup financial sheets' }
    ]
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    university: 'MIT',
    major: 'Bio-Data Science (M.S. Candidate)',
    bio: 'Data scientist researching neural networks. I love breaking down complex ML concepts into intuitive chunks. Want to learn digital art & presentation skills!',
    languages: ['Russian (Native)', 'English (Fluent)'],
    availability: 'Weekend Afternoons',
    preferredFormat: 'Online Live Sessions',
    reputationScore: 94,
    exchangesCompleted: 8,
    milestonesAchieved: 22,
    peerReviewsCount: 7,
    verifiedBadge: 'Verified Peer Scholar',
    joinedDate: '2025-11-10',
    teachSkills: [
      { skillId: 'skill-4', level: 'Advanced', yearsExp: 3, notes: 'PyTorch & statistical modeling' }
    ],
    learnSkills: [
      { skillId: 'skill-8', level: 'Beginner', targetGoal: 'Draw scientific diagrams & illustrations' },
      { skillId: 'skill-6', level: 'Intermediate', targetGoal: 'Keynote speaking at conferences' }
    ]
  },
  {
    id: 'user-5',
    name: 'Sam Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    university: 'NYU Tisch',
    major: 'Film & Sound Production',
    bio: 'Video producer and guitarist. Willing to teach video editing, audio mixing, or basic guitar in exchange for Figma UI design or AI fundamentals.',
    languages: ['English (Native)'],
    availability: 'Study Breaks (Lunch/Free Hours)',
    preferredFormat: 'Async Feedback & Notes',
    reputationScore: 92,
    exchangesCompleted: 6,
    milestonesAchieved: 16,
    peerReviewsCount: 5,
    verifiedBadge: 'Creative Partner',
    joinedDate: '2026-01-12',
    teachSkills: [
      { skillId: 'skill-5', level: 'Advanced', yearsExp: 3, notes: 'Premiere Pro & sound mixing' },
      { skillId: 'skill-10', level: 'Intermediate', yearsExp: 4, notes: 'Chords, strumming & rhythm' }
    ],
    learnSkills: [
      { skillId: 'skill-2', level: 'Beginner', targetGoal: 'Layout film storyboard UI in Figma' },
      { skillId: 'skill-4', level: 'Beginner', targetGoal: 'Understand AI video synthesis tools' }
    ]
  }
];

export const INITIAL_EXCHANGES = [
  {
    id: 'ex-101',
    requesterId: 'user-1', // Alex Chen
    recipientId: 'user-2', // Maya Lin
    offeredSkillId: 'skill-1', // Python
    requestedSkillId: 'skill-2', // UI/UX
    status: 'Active',
    createdAt: '2026-02-10T14:30:00Z',
    updatedAt: '2026-02-12T10:15:00Z',
    format: 'Online Live Sessions',
    proposedHoursPerWeek: 2,
    reciprocalAgreement: 'Alex teaches Maya 1 hr of Python script automation for 1 hr of Figma Component Auto-layout UI design.',
    milestones: [
      { id: 'm-1', title: 'Session 1: Figma Auto-Layout & Frame System', completed: true, completedBy: 'user-2', date: '2026-02-12' },
      { id: 'm-2', title: 'Session 1: Python Data Types & Script Setup', completed: true, completedBy: 'user-1', date: '2026-02-14' },
      { id: 'm-3', title: 'Session 2: Designing App Component Library', completed: false, assignedTo: 'user-2', date: '2026-02-20' },
      { id: 'm-4', title: 'Session 2: Writing Automated File Exporter Script', completed: false, assignedTo: 'user-1', date: '2026-02-22' }
    ],
    sessionLogs: [
      { id: 's-1', date: '2026-02-12', topic: 'Figma Auto-Layout Basics', notes: 'Covered vertical & horizontal auto-layout frames, padding, gap values, and responsive constraints.', videoLink: 'https://meet.jit.si/skillnexus-alex-maya-s1' },
      { id: 's-2', date: '2026-02-14', topic: 'Python Basics & Virtual Environments', notes: 'Installed Python 3.12, set up VS Code, wrote script to batch rename exported PNG assets.', videoLink: 'https://meet.jit.si/skillnexus-alex-maya-s2' }
    ]
  },
  {
    id: 'ex-102',
    requesterId: 'user-3', // Marcus Vance
    recipientId: 'user-1', // Alex Chen
    offeredSkillId: 'skill-3', // Spanish
    requestedSkillId: 'skill-1', // Python
    status: 'Pending',
    createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
    format: 'Hybrid',
    proposedHoursPerWeek: 1.5,
    reciprocalAgreement: 'Marcus provides 1.5 hrs of conversational Spanish practice in exchange for Alex guiding Python Pandas dataset parsing.',
    milestones: [
      { id: 'm-201', title: 'Initial Assessment & Vocabulary Goal Setup', completed: false }
    ],
    sessionLogs: []
  },
  {
    id: 'ex-103',
    requesterId: 'user-4', // Elena Rostova
    recipientId: 'user-2', // Maya Lin
    offeredSkillId: 'skill-4', // ML
    requestedSkillId: 'skill-8', // Illustration
    status: 'Completed',
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-02-01T16:00:00Z',
    format: 'Online Live Sessions',
    proposedHoursPerWeek: 2,
    reciprocalAgreement: 'Elena explained Neural Network intuition while Maya taught scientific illustration in Procreate.',
    milestones: [
      { id: 'm-301', title: 'Intro to Procreate Layers & Shading', completed: true, date: '2026-01-10' },
      { id: 'm-302', title: 'PyTorch Model Architecture Overview', completed: true, date: '2026-01-15' },
      { id: 'm-303', title: 'Final Project: Illustrated ML Diagram', completed: true, date: '2026-01-28' }
    ],
    sessionLogs: [],
    feedback: {
      user4Rating: 5,
      user4Comment: 'Maya was incredible! She broke down color theory so easily. Now I can draw clear figures for my thesis.',
      user2Rating: 5,
      user2Comment: 'Elena made PyTorch neural nets feel so intuitive! One of the best skill exchanges I have ever had.'
    }
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    exchangeId: 'ex-101',
    senderId: 'user-1', // Alex
    text: 'Hey Maya! Super excited for our Figma & Python exchange. Does Thursday at 4 PM work for our next session?',
    timestamp: '2026-02-14T10:20:00Z'
  },
  {
    id: 'msg-2',
    exchangeId: 'ex-101',
    senderId: 'user-2', // Maya
    text: 'Hi Alex! Yes, Thursday at 4 PM works great. I prepared some sample design files we can restructure with auto-layout!',
    timestamp: '2026-02-14T10:25:00Z'
  },
  {
    id: 'msg-3',
    exchangeId: 'ex-101',
    senderId: 'user-1', // Alex
    text: 'Awesome! I also put together a lightweight Python script template that we can test together.',
    timestamp: '2026-02-14T10:28:00Z'
  }
];

export const INITIAL_SKILL_REQUESTS = [
  {
    id: 'sr-1',
    skillName: 'Rust Programming',
    category: 'Programming & Tech',
    requestedBy: 'Alex Chen',
    upvotes: 14,
    status: 'Under Review',
    createdAt: '2026-02-01'
  },
  {
    id: 'sr-2',
    skillName: 'Blender 3D Modeling',
    category: 'Design & Creative',
    requestedBy: 'Sam Rivera',
    upvotes: 22,
    status: 'Approved',
    createdAt: '2026-01-20'
  }
];

export const INITIAL_SAFETY_REPORTS = [
  {
    id: 'rep-1',
    reportedUserId: 'user-5',
    reportedByUserId: 'user-3',
    reason: 'Unresponsive after scheduling session',
    details: 'Student rescheduled twice without notification.',
    status: 'Open',
    createdAt: '2026-02-12'
  }
];
