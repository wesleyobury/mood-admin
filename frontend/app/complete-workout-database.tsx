// Complete workout database with all 12 equipment types
export const completeWorkoutDatabase = [
  {
    equipment: 'Treadmill',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Walk & Jog Mixer',
          duration: '20 min',
          description: '3 min brisk walk (3.0 mph), 2 min power walk (4.0 mph, incline 2%), 1 min light jog (5.0 mph), repeat 3x, finish with 3 min walk (3.0 mph, incline 1%).',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect for beginners with alternating walking and light jogging to gradually build cardiovascular endurance.'
        },
        {
          name: 'Rolling Hills',
          duration: '20 min',
          description: '2 min walk (3.0 mph, incline 0%), 2 min walk (3.0 mph, incline 4%), 2 min walk (3.5 mph, incline 2%), 2 min jog (4.5 mph, incline 0%), repeat sequence, finish with 2 min walk (3.0 mph).',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Uses gentle incline changes and moderate pace increases to build basic strength and endurance safely.'
        }
      ],
      intermediate: [
        {
          name: 'Speed Ladder',
          duration: '25 min',
          description: '3 min jog (5.5 mph), 2 min run (6.5 mph), 1 min fast run (7.5 mph), 2 min walk (3.5 mph, incline 3%), repeat 3x, finish with 3 min jog (5.5 mph).',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressively increases speed while maintaining good recovery periods for intermediate fitness levels.'
        },
        {
          name: 'Incline Intervals',
          duration: '30 min',
          description: '2 min run (6.0 mph, incline 1%), 1 min run (6.0 mph, incline 5%), 2 min walk (3.5 mph, incline 2%), repeat 5x, finish with 3 min walk (3.0 mph).',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Combines consistent running pace with challenging inclines to build both cardiovascular and muscular endurance.'
        }
      ],
      advanced: [
        {
          name: 'Sprint Pyramid',
          duration: '30 min',
          description: '2 min jog (6.0 mph), 30 sec sprint (9.0 mph), 1 min jog, 45 sec sprint, 1 min jog, 1 min sprint, 2 min jog, repeat pyramid, finish with 5 min incline walk (4.0 mph, incline 8%).',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints at 9.0 mph challenge maximum cardiovascular capacity and anaerobic power.'
        },
        {
          name: 'Tempo & Hill Challenge',
          duration: '35 min',
          description: '5 min warm-up (jog), 10 min tempo run (7.0 mph, incline 2%), 5 x 1 min hill sprints (8.0 mph, incline 6%, 1 min walk between), 5 min cool-down.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Extended tempo runs plus high-intensity hill sprints demand advanced cardiovascular fitness and mental toughness.'
        }
      ]
    }
  },
  {
    equipment: 'Elliptical',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Resistance Rounds',
          duration: '20 min',
          description: '3 min easy (resistance 3), 2 min moderate (resistance 6), 1 min fast (resistance 4), repeat 4x, finish with 3 min easy (resistance 2).',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Low-impact movement with gentle resistance changes, ideal for building cardio base without joint stress.'
        },
        {
          name: 'Cadence Play',
          duration: '18 min',
          description: '2 min steady (RPM 55), 1 min fast (RPM 70), 2 min moderate (RPM 60), 1 min slow (RPM 50, resistance 5), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Moderate RPM variations help beginners learn rhythm control while building steady-state endurance.'
        }
      ],
      intermediate: [
        {
          name: 'Climb & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 5), 1 min climb (resistance 10), 1 min sprint (resistance 4, RPM 80+), repeat 5x, finish with 3 min easy.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between high resistance climbs and fast sprints to challenge both strength and speed.'
        },
        {
          name: 'Reverse & Forward',
          duration: '30 min',
          description: '3 min forward (resistance 6), 2 min reverse (resistance 4), 1 min sprint (forward, resistance 5), repeat 4x, finish with 2 min easy.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Direction changes engage different muscle groups while maintaining consistent cardiovascular demand.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Elliptical',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol demands maximum effort bursts, pushing VO2 max and anaerobic capacity to limits.'
        },
        {
          name: 'Endurance Builder',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, RPM 80+), 5 min reverse (resistance 6), 5 min cool-down.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Long duration with varied intensities tests cardiovascular endurance and mental resilience.'
        }
      ]
    }
  },
  {
    equipment: 'Arm bicycle',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Speed & Resistance Mix',
          duration: '12 min',
          description: '2 min easy (resistance 2), 1 min moderate (resistance 4), 1 min fast (resistance 2), repeat 3x, finish with 2 min easy.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals with varied resistance help beginners build upper body endurance gradually.'
        },
        {
          name: 'Interval Builder',
          duration: '15 min',
          description: '1 min easy, 1 min moderate, 30 sec fast, 1 min easy, 1 min reverse, repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Basic interval structure with reverse motion introduces beginners to upper body cardio safely.'
        }
      ],
      intermediate: [
        {
          name: 'Pyramid Challenge',
          duration: '18 min',
          description: '1 min easy, 1 min moderate, 1 min hard, 1 min moderate, 1 min easy, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramid challenges intermediate upper body strength and endurance.'
        },
        {
          name: 'Reverse & Forward',
          duration: '20 min',
          description: '2 min forward (resistance 5), 1 min reverse (resistance 3), 1 min sprint (forward, resistance 4), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternating directions engage different muscle groups while building intermediate cardiovascular capacity.'
        }
      ],
      advanced: [
        {
          name: 'HIIT Sprints',
          duration: '20 min',
          description: '30 sec max effort (resistance 8), 1 min easy (resistance 3), repeat 10x, finish with 5 min moderate.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity sprints demand maximum upper body power and anaerobic capacity.'
        },
        {
          name: 'Endurance & Power',
          duration: '25 min',
          description: '5 min moderate, 10 x 30 sec sprint (resistance 10) with 30 sec easy, 5 min reverse, 5 min cool-down.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended power intervals with reverse work test advanced upper body endurance and strength.'
        }
      ]
    }
  },
  {
    equipment: 'Stationary bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Rolling Ride',
          duration: '20 min',
          description: '3 min easy (resistance 2), 2 min moderate (resistance 5), 1 min fast (resistance 3), repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Gentle resistance changes help beginners build leg strength and cardiovascular base.'
        },
        {
          name: 'Cadence Intervals',
          duration: '18 min',
          description: '2 min steady (70 RPM), 1 min fast (90 RPM), 2 min moderate (80 RPM), 1 min slow (60 RPM, resistance 6), repeat 3x.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'RPM variations teach beginners pedaling rhythm while maintaining moderate intensity.'
        }
      ],
      intermediate: [
        {
          name: 'Hill & Sprint',
          duration: '25 min',
          description: '2 min moderate (resistance 6), 1 min hill (resistance 10), 1 min sprint (resistance 4, 100+ RPM), repeat 5x.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Alternates between strength-building hills and speed-focused sprints for balanced intermediate training.'
        },
        {
          name: 'Pyramid Ride',
          duration: '30 min',
          description: '3 min easy, 2 min moderate, 1 min hard, 2 min moderate, 3 min easy, repeat 3x.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive intensity pyramids challenge intermediate riders with sustained effort periods.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Bike',
          duration: '24 min',
          description: '8 rounds: 20 sec max effort (resistance 8), 10 sec easy (resistance 3), 2 min recovery, repeat for 3 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata protocol pushes advanced cyclists to maximum anaerobic power and VO2 capacity.'
        },
        {
          name: 'Endurance & Power',
          duration: '35 min',
          description: '5 min easy, 10 min moderate (resistance 7), 5 min hard (resistance 10), 5 min fast (resistance 5, 100+ RPM), 5 min standing climb (resistance 8), 5 min cool-down.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended workout with varied challenges tests advanced cardiovascular endurance and power.'
        }
      ]
    }
  },
  {
    equipment: 'Assault bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Intro Intervals',
          duration: '12 min',
          description: '1 min easy, 30 sec moderate, 1 min easy, 30 sec fast, repeat 4x.',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Short intervals introduce beginners to assault bike intensity while allowing adequate recovery.'
        },
        {
          name: 'Resistance Play',
          duration: '15 min',
          description: '2 min easy, 1 min moderate (increase resistance), 1 min fast, repeat 3x, finish with 2 min easy.',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Gradual resistance increases help beginners adapt to full-body assault bike movement.'
        }
      ],
      intermediate: [
        {
          name: 'Sprint & Recover',
          duration: '18 min',
          description: '20 sec sprint, 40 sec easy, repeat 10x, 5 min moderate.',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmd8ZW58MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Classic 1:2 work-to-rest ratio challenges intermediate full-body power and recovery.'
        },
        {
          name: 'Ladder Intervals',
          duration: '20 min',
          description: '30 sec sprint, 1 min easy, 45 sec sprint, 1 min easy, 1 min sprint, 1 min easy, repeat sequence.',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Progressive interval lengths challenge intermediate athletes with increasing demands.'
        }
      ],
      advanced: [
        {
          name: 'Tabata Assault',
          duration: '16 min',
          description: '8 rounds: 20 sec max effort, 10 sec rest, 2 min easy, repeat for 2 cycles.',
          imageUrl: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MTc1Njg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Tabata on assault bike demands maximum full-body power and elite anaerobic capacity.'
        },
        {
          name: 'EMOM Challenge',
          duration: '20 min',
          description: 'Every minute: 20 sec sprint, 40 sec moderate, repeat for 20 min.',
          imageUrl: 'https://images.pexels.com/photos/2774172/pexels-photo-2774172.jpeg',
          intensityReason: 'Extended EMOM format tests advanced endurance under consistent high-intensity demands.'
        }
      ]
    }
  }
];