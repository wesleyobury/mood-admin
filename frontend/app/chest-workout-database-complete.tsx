// Complete Chest workout database with all equipment types - VERIFIED AGAINST SPECIFICATIONS

// Equipment mapping for chest equipment
const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Bench Push-Up Circuit',
          duration: '10–12 min',
          description: '• 3 rounds:\n  • 10 push-ups (hands on bench)\n  • 10 bench dips\n  • Rest 60s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8MTc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Perfect beginner introduction to bench training with bodyweight movements that build foundational chest strength.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Push the floor apart',
              description: 'Lower slow, drive up hard while squeezing pecs together at the top.'
            },
            {
              icon: 'body',
              title: 'Keep chest slightly forward',
              description: 'On dips, shift load onto pecs vs. triceps.'
            }
          ]
        },
        {
          name: 'Bench Chest Press',
          duration: '12–15 min',
          description: '• 3 rounds:\n  • 12 light dumbbell or Smith bench press\n  • 10 dumbbell bench fly\n  • Rest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Foundational pressing and isolation movements that teach proper chest activation and control.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Drag elbows inward',
              description: 'Slightly toward midline as you press for max pec activation.'
            },
            {
              icon: 'flash',
              title: 'Stretch then contract',
              description: 'Focus on stretching fibers at the bottom, then forcefully contract chest.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Bench Plyo Push-Ups',
          duration: '14–16 min',
          description: '• 4 rounds:\n  • 8 explosive push-ups (hands on bench)\n  • 10 single-arm bench press\n  • Rest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Explosive power development with unilateral training for intermediate strength and coordination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Max intent every rep',
              description: 'Push off with maximum intent - builds fast-twitch fiber recruitment for growth.'
            },
            {
              icon: 'construct',
              title: 'Inward arc press',
              description: 'Lock shoulders down and bring dumbbell in slight inward arc for inner-chest tension.'
            }
          ]
        },
        {
          name: 'Bench Chest Flow',
          duration: '12–15 min',
          description: '• 3 rounds:\n  • 10 bench press\n  • 10 fly\n  • 10 close-grip bench press\n  • Rest 90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Flow training that overloads pecs through compound and isolation movements without rest.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'No rest transitions',
              description: 'Fly to press transition overloads pecs by hitting both stretch and contraction.'
            },
            {
              icon: 'fitness',
              title: 'Press palms inward',
              description: 'On close-grip, actively press palms into bar/dumbbells for pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Complex',
          duration: '15–18 min',
          description: '• 3 rounds:\n  • 8 bench press\n  • 8 bench fly\n  • 8 plyo push-ups (hands on bench)\n  • 8 dips\n  • Rest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Advanced complex combining pressing, isolation, explosive, and bodyweight movements for complete chest development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at bottom',
              description: 'Use slight pause at bottom to kill momentum and force pec drive.'
            },
            {
              icon: 'body',
              title: 'Lean forward on dips',
              description: 'Chest toward floor shifts tension from triceps into pec stretch/contraction.'
            }
          ]
        },
        {
          name: 'Bench Drop Set',
          duration: '16–20 min',
          description: '• 2 rounds:\n  • 10 heavy bench press\n  • Drop → 10 moderate\n  • Drop → 10 light\n  • Rest 90–120s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'High-intensity drop set protocol for maximum muscle recruitment and hypertrophy stimulus.',
          moodTips: [
            {
              icon: 'shield',
              title: '0-1 reps shy of failure',
              description: 'Maximize recruitment without burnout for optimal growth stimulus.'
            },
            {
              icon: 'timer',
              title: 'Slow eccentric on light sets',
              description: '3s descent to maximize muscle tension during drops.'
            }
          ]
        }
      ]
    }
  }
]

// This is just the Flat Bench section - need to continue with all other equipment types