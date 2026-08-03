/**
 * RISE Dashboard — Configuration
 * Edit this file to customize content, branding, and payment links.
 */

const RISE_CONFIG = {

  // ── Branding ───────────────────────────────────────
  brandName: 'Rise',
  tagline: 'Rise Artist Academy',

  // Brand palette (Rise identity)
  accentColor: '#ff683e',        // Primary orange
  darkColor: '#1e1e1e',          // Primary dark
  deepAccent: '#7f1900',         // Deep accent
  midGray: '#a6a6a6',            // Mid gray
  whiteColor: '#ffffff',         // White

  // ── Hero / Intro ───────────────────────────────────
  heroTitle: 'Rise | Complete Overview',
  heroSubtitle: 'A structured artist development platform for electronic music creators.',
  introText: 'Rise combines coaching, community, and tools into one unified system built for electronic artists who are serious about growth. This is not passive education \u2014 it is an active environment where direction, feedback, and accountability drive consistent progress. Every artist works inside a personal dashboard, sets clear goals, and is guided through a structured path from clarity to execution.',

  // ── Footer ─────────────────────────────────────────
  footerText: '\u00A9 2026 Rise. All rights reserved. Confidential.',

  // ── Access Codes ──────────────────────────────────
  masterAccessCode: 'squad',
  universalAccessCodes: ['squad', 'RiseAcademy612'],
  courseAccessCodes: ['RISE-COURSE-2026', 'COURSE-ACCESS'],
  platformAccessCodes: ['RISE-PLATFORM-2026', 'PLATFORM-ACCESS'],
  communityAccessCodes: ['RISE-COMMUNITY-2026', 'COMMUNITY-ACCESS'],
  coachingAccessCodes: ['RISE-COACHING-2026', 'COACHING-ACCESS'],

  // ── Legal Links ───────────────────────────────────
  termsUrl: '/terms/',
  privacyUrl: '/privacy/',

  // ── Customer Portal Prices (visible to customers) ──
  customerPrices: {
    course: '\u20AC 65,-',
    courseOldPrice: '\u20AC 210,-',
    courseNote: 'Normally \u20AC 210,-',
    community: '\u20AC 1.500,-',
    communityOldPrice: '\u20AC 2.650,-',
    communityNote: 'Normally \u20AC 2.650,-',
    communityDeposit: '\u20AC 375,-',
    coaching: '\u20AC 5.550,-',
    coachingDeposit: '\u20AC 875,-'
  },

  // ── Subscription Tab Label ─────────────────────────
  subscriptionTabLabel: 'Coming Soon',

  // ── Coaches Access Code ────────────────────────────
  coachesAccessCode: 'Team010#',

  // ── Subscription Portal (Coming Soon) ──────────────
  subscriptionLabel: 'Coming Soon',
  subscriptionNote: 'Subscription is currently being prepared and will be released soon.',
  subscriptionSubnote: 'More details will be announced soon.',

  // ── Payment Links ──────────────────────────────────
  coursePaymentUrl: 'https://buy.stripe.com/7sYdR2ac1gcs9Qr8cwcfK03',
  platformPaymentUrl: '',
  communityPaymentUrl: 'https://buy.stripe.com/5kQ5kwck9bWc2nZgJ2cfK02',
  coachingPaymentUrl: 'https://buy.stripe.com/3cI6oA0Br0du5AbeAUcfK04',

  // ── Coaches ────────────────────────────────────────
  coaches: [
    {
      name: 'Remy',
      specialization: 'Pop & Dance Music Production',
      description: 'Producer from The Hague focused on pop and dance music. Known for layered textures and emotional depth. Has collaborated with Lost Frequencies and achieved multiple Eurovision placements.',
      credibility: 'Multiple international placements and major artist collaborations.'
    },
    {
      name: 'Artcode',
      specialization: 'Electronic Production & Audiovisual Performance',
      description: 'Based in Rotterdam with 15+ years across electronic genres. Works with a major label on developing distinctive new music. Runs the Artcode project combining music with TouchDesigner visuals and live modular performance.',
      credibility: 'Over 15 years of electronic production and major label development.'
    },
    {
      name: 'Vannood',
      specialization: 'Entrepreneur & Artist',
      description: 'Over 15 years of experience specializing in techno production. Expert in identifying inefficiencies, structuring creative processes, and translating abstract concepts into finished work.',
      credibility: 'Over 15 years in techno production and artist development.'
    },
    {
      name: 'Paul',
      specialization: 'Mix & Master Engineer',
      description: 'Focused on market translation, release planning, and building sustainable audience growth strategies for independent electronic artists.',
      credibility: 'Proven track record in artist management and strategic growth planning.'
    },
    {
      name: 'Maurits',
      specialization: 'Business & Operations',
      description: 'Handles the operational and business side of artist development. Focused on building sustainable structures that support long-term creative growth.',
      credibility: 'Extensive experience in music industry operations and business development.'
    }
  ],

  // ── Objection Categories ──────────────────────────
  objectionCategories: [
    { id: 'time', name: 'Time' },
    { id: 'money', name: 'Money' },
    { id: 'price', name: 'Price Sensitivity' },
    { id: 'doubt', name: 'Offer Confusion / Doubt' },
    { id: 'skepticism', name: 'Past Failure / Skepticism' }
  ],

  // ── Objections (categorized, for both Community and Course) ──
  objections: [
    // ── Time ──
    { categoryId: 'time', product: 'community', objection: 'I do not have time for weekly calls.', response: 'The calls are typically 60 to 90 minutes. If you cannot find 90 minutes a week for your career, that is actually the problem the Community solves: prioritizing progress over busyness.' },
    { categoryId: 'time', product: 'course', objection: 'I do not have time for a full course.', response: 'It is self-paced. Most artists complete it in 4 to 6 weeks doing one or two modules per week. Each module is focused and action-based, not hours of passive video.' },
    { categoryId: 'time', product: 'community', objection: 'I am too busy with gigs and releases right now.', response: 'That is exactly when structured support matters most. The Community keeps you from burning out and losing direction during busy periods. It is the system that keeps your momentum organized.' },

    // ── Money ──
    { categoryId: 'money', product: 'community', objection: 'I cannot afford the Community right now.', response: 'We offer a deposit option to get started. The real cost is staying stuck for another year without direction or accountability. Think of it as an investment in the career you are building, not an expense.' },
    { categoryId: 'money', product: 'course', objection: '65 euro is still money. What if it is not worth it?', response: 'At 65 euro, one insight that changes your approach already pays for itself. Most artists spend more on a single plugin they never use. This gives you a complete roadmap.' },
    { categoryId: 'money', product: 'community', objection: 'I would rather invest in gear or plugins.', response: 'Gear does not give you direction. Plugins do not give you accountability. The Community gives you both, plus a network of serious artists and structured feedback. That is what actually moves the needle.' },

    // ── Price Sensitivity ──
    { categoryId: 'price', product: 'community', objection: 'The Community seems expensive compared to other options.', response: 'Compare it to what you get: weekly calls, monthly workshops, peer feedback, the full Rise Course, and a curated network. No other option gives you all of this in one structured environment. The price reflects the commitment.' },
    { categoryId: 'price', product: 'course', objection: 'There are free courses online.', response: 'Free courses give you random puzzle pieces. This gives you the complete picture in the right order, plus sample packs, a manual, and a structured roadmap. The difference is direction, not information.' },
    { categoryId: 'price', product: 'community', objection: 'Can I get a discount?', response: 'The pricing is already positioned as a limited early-member rate. The value is in the structure and the network. This is not something where cutting the price makes sense, because the investment reflects the commitment we ask of every member.' },

    // ── Offer Confusion / Doubt ──
    { categoryId: 'doubt', product: 'community', objection: 'I am not sure which option is right for me.', response: 'If you are serious about building a career and want accountability, go with the Community. It includes the Course and gives you everything you need: structure, feedback, and a network. The Course alone is a great starting point if you want to build your foundation first.' },
    { categoryId: 'doubt', product: 'community', objection: 'What if the Community is not active enough?', response: 'This is not a forum. It has mandatory weekly calls, structured agendas, and active moderation. Members who stop participating are addressed. That keeps the energy high and the group committed.' },
    { categoryId: 'doubt', product: 'course', objection: 'How is this different from other production courses?', response: 'It is not a production course. It is an artist development course. Production is one piece. Identity, positioning, release strategy, and business fundamentals are the rest. That is the gap most artists have.' },
    { categoryId: 'doubt', product: 'community', objection: 'I am not a group person. I work better alone.', response: 'That is exactly why this works. The Community is not about socializing. It is a structured accountability system. The weekly rhythm pushes you further than working alone ever could.' },

    // ── Past Failure / Skepticism ──
    { categoryId: 'skepticism', product: 'community', objection: 'Online communities never stay active.', response: 'This is not a Discord server. It has mandatory weekly calls, structured agendas, and a limited number of members. The barrier to entry and participation requirements keep the group focused and active.' },
    { categoryId: 'skepticism', product: 'course', objection: 'I have already taken other music courses and they did not help.', response: 'Most music courses focus only on production. This covers the business and strategy side that actually turns production skills into a career. It is designed to complement what you already know, not repeat it.' },
    { categoryId: 'skepticism', product: 'community', objection: 'I have tried coaching before and it did not work.', response: 'Most coaching in music is unstructured: someone listens to your track and gives vague feedback. The Community provides structured accountability, group sessions with clear agendas, and a peer network that holds you to your commitments. It is a system, not a service.' },
    { categoryId: 'skepticism', product: 'course', objection: 'I can figure this out on my own.', response: 'Eventually, maybe. But the Course compresses months of trial and error into a focused, structured roadmap. Time is the most expensive thing an artist spends. This gives you the shortcut.' }
  ],

  // ── Sales Flow Instructions ───────────────────────
  salesFlow: {
    primary: 'community',
    fallback: 'course',
    instruction: 'Always guide the prospect toward the Community first. The Community is the primary offer: it includes the Course, provides accountability, and delivers the highest long-term value. If the prospect shows resistance (price, time, commitment level), offer the Course as a lower-commitment alternative. The Course is the fallback, not the default.',
    pitchOrder: [
      'Open with the Community: accountability, network, structure, and included Course access.',
      'Highlight outcomes: artists who stay accountable make more progress in 3 months than most do in a year alone.',
      'If resistance: pivot to the Course as an accessible entry point that builds foundation.',
      'Always leave the door open: the Course is the first step, and Community membership can follow.'
    ],
    objectionStrategy: 'When an objection comes up, first try to resolve it within the Community context. Only switch to offering the Course if the objection is fundamentally about commitment level, budget, or readiness.'
  },

  // ── Products (order: Course, Community) ───────────
  products: [

    // ─── 1. Course ─────────────────────────────────
    {
      id: 'course',
      title: 'Course',
      price: '\u20AC 65,-',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      subtitle: 'The foundational training that gives you direction, structure, and a clear creative roadmap.',
      benefits: [
        '10 in-depth video modules covering both creative and business fundamentals',
        'Hands-on exercises and sample packs designed for immediate application',
        'Action-based learning that builds a concrete artist roadmap',
        'Includes a manual (PDF) with insights from key industry players',
        'Self-paced with structured milestones to track your progress'
      ],
      whatsIncluded: [
        '10-module video curriculum',
        'Downloadable sample packs and exercise templates',
        'Manual (PDF with insights from key industry players)',
        'Progress tracking dashboard'
      ],
      whoItsFor: 'Electronic artists who want a clear starting point \u2014 whether you are just beginning or resetting your direction. Ideal for anyone who feels scattered and needs a structured foundation to build from.',
      pdfIntro: 'The Rise Course is a foundational training program built for electronic music artists who need clarity, structure, and direction. Through 10 action-based video modules and a manual with key industry insights, artists develop a concrete roadmap that bridges the gap between creative vision and professional execution.',
      pdfWhyItMatters: 'Most artists spend years experimenting without a clear path forward. The Course eliminates that uncertainty by providing a structured learning journey that covers both the creative and business sides of an artist career. Every module is designed for immediate application \u2014 not passive consumption.',
      pdfCTA: 'Ready to build your foundation? Start the Rise Course and gain the clarity and direction your career needs.',
      pitch: [
        'The Course is the fastest way to go from scattered creative energy to a concrete artist roadmap. In 10 modules plus a manual with key industry insights, artists get the structure they have been missing.',
        'This is not another production tutorial. It covers the full picture: identity, positioning, production workflow, and release strategy. Most courses only teach one piece.',
        'Every module has hands-on exercises. Artists do not just watch, they build their roadmap as they go. By the end, they have an actual plan.',
        'Artists can revisit any module as their career evolves. The content stays relevant because it focuses on strategy, not trends.',
        'At 65 euro, it is one of the most accessible entry points in the Rise ecosystem. The included sample packs and templates alone deliver outsized value.'
      ],
      objections: [
        { q: 'I can learn this stuff on YouTube for free', a: 'You can find individual pieces, yes. But the Course is a structured system that connects everything into one roadmap. YouTube gives you random puzzle pieces. This gives you the complete picture in the right order.' },
        { q: 'I do not have time for a full course', a: 'It is self-paced. Most artists complete it in 4 to 6 weeks doing one or two modules per week. Each module is focused and action-based, not hours of passive video. Plus you get a manual with key industry insights to reference anytime.' },
        { q: 'I have already taken other music courses', a: 'Most music courses focus only on production. This covers the business and strategy side that actually turns production skills into a career. It is designed to complement what you already know.' },
        { q: 'How is this different from other production courses?', a: 'It is not a production course. It is an artist development course. Production is one piece. Identity, positioning, release strategy, and business fundamentals are the rest. That is the gap most artists have.' }
      ]
    },

    // ─── 3. Community ──────────────────────────────
    {
      id: 'community',
      title: 'Community',
      price: '\u20AC 2.650,-/yr',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      subtitle: 'A structured network built on accountability, execution, and shared momentum.',
      benefits: [
        'Weekly group calls focused on accountability and forward progress',
        'Monthly deep-dive sessions with expert-led workshops',
        'Track feedback and coaching opportunities from peers and mentors',
        'Direct connection to a network of serious electronic artists',
        'Access to the course (includes video modules, sample packs, and manual)'
      ],
      whatsIncluded: [
        'Weekly accountability calls',
        'Monthly deep-dive workshop sessions',
        'Peer feedback and coaching options',
        'Private community network access',
        'Access to the course (video modules, sample packs, and manual)'
      ],
      whoItsFor: 'Artists who thrive in a collaborative environment and understand that consistent accountability accelerates growth. Built for those who want to be surrounded by serious peers, not passive observers.',
      pdfIntro: 'The Rise Community is a structured environment where electronic artists connect, share progress, and hold each other accountable. This is not a passive forum \u2014 it is an active network built on execution, feedback, and shared momentum.',
      pdfWhyItMatters: 'Isolation is one of the biggest obstacles in an artist career. The Community provides a structured support system where participation is mandatory, accountability is built in, and every member is invested in moving forward. The connections you build here become long-term assets.',
      pdfCTA: 'Join a network that moves at your speed. Become part of the Rise Community and accelerate your growth through accountability and connection.',
      pitch: [
        'Making music alone is normal, but building a career alone is a mistake. The Community gives artists a structured accountability system with people who are on the same level.',
        'Weekly calls are not casual hangouts. They are focused sessions where members share progress, get feedback, and commit to next steps. That rhythm drives results.',
        'Monthly deep-dives bring in expert knowledge on specific topics like release strategy, branding, or industry networking. It is ongoing education built into the membership.',
        'The network effect is the real value. Collaborations, introductions, and opportunities happen naturally when serious artists are in the same room consistently.',
        'Community members get full access to the Rise Course as part of their membership. That means video modules, sample packs, and the manual are included from day one.'
      ],
      objections: [
        { q: 'I am not a group person, I work better alone', a: 'That is exactly why this works. The Community is not about socializing. It is a structured accountability system. The weekly rhythm pushes you further than working alone ever could, and you can still do your creative work in isolation.' },
        { q: 'Online communities never stay active', a: 'This is not a forum. It has mandatory weekly calls, structured agendas, and active moderation. Members who stop participating are removed. That keeps the energy high and the group small and committed.' },
        { q: 'I do not have time for weekly calls', a: 'The calls are typically 60 to 90 minutes. If you cannot find 90 minutes a week for your career, that is actually the problem the Community solves: prioritizing progress over busyness.' },
        { q: 'How is this different from Discord or Facebook groups?', a: 'Those are open forums with no structure or accountability. This is a curated group with scheduled calls, expert sessions, and active participation requirements. The difference is commitment.' }
      ]
    }
  ]
};
