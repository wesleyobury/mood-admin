import { EquipmentWorkouts } from '../types/workout';

export const bicepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Alternating DB Curl Builder',
          duration: '12–14 min',
          description: 'Standard curl workout building foundational elbow-flexion strength.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Alternating Dumbbell Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Builds curl discipline with stable elbow position',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Elbows stay pinned',
              description: 'Keeps tension on biceps'
            },
            {
              icon: 'refresh',
              title: 'Rotate smoothly into supination',
              description: 'Improves peak contraction'
            },
            {
              icon: 'trending-down',
              title: 'Lower fully, squeeze hard at the top',
              description: 'Full stretch + tight flex = pump'
            }
          ]
        },
        {
          name: 'Seated DB Curl Control',
          duration: '12–14 min',
          description: 'Standard seated curl workout removing momentum.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Seated Dumbbell Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Seated position removes momentum for better isolation',
          moodTips: [
            {
              icon: 'body',
              title: 'Sit tall, no lean',
              description: 'Zero cheating'
            },
            {
              icon: 'trending-down',
              title: 'Slow the negative',
              description: 'Eccentric builds fatigue'
            },
            {
              icon: 'hand-left',
              title: 'Let arms hang fully',
              description: 'Deeper stretch = better pump'
            }
          ]
        },
        {
          name: 'Hammer Curl Builder',
          duration: '12–14 min',
          description: 'Standard neutral-grip curl workout targeting brachialis.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Hammer Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Neutral grip activates forearms and brachialis',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Wrists stay neutral',
              description: 'Transfers load correctly'
            },
            {
              icon: 'trending-up',
              title: 'Curl straight up, not across',
              description: 'Cleaner elbow path'
            },
            {
              icon: 'flash',
              title: 'Control the top squeeze',
              description: 'Brachialis pumps fast when shortened'
            }
          ]
        },
        {
          name: 'Curl + Iso Finish',
          duration: '12–14 min',
          description: 'Standard curl workout with squeeze-to-finish at peak flexion.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 Dumbbell Curl — standard reps\n• Final set: squeeze to finish — hold at top (elbow fully flexed) 8–10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Isometric finish maximizes muscle recruitment',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex as hard as possible',
              description: 'Biceps respond to contraction'
            },
            {
              icon: 'body',
              title: 'Elbows stay still during hold',
              description: 'Prevents shoulder takeover'
            },
            {
              icon: 'fitness',
              title: 'Use lighter weight for the hold',
              description: 'Longer squeeze = better pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline DB Curl',
          duration: '14–16 min',
          description: 'Standard long-head curl workout using shoulder extension.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 Incline Dumbbell Curl — standard reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Incline position maximizes long-head stretch',
          moodTips: [
            {
              icon: 'body',
              title: 'Shoulders stay back',
              description: 'Maximizes long-head stretch'
            },
            {
              icon: 'timer',
              title: 'Don\'t rush the bottom',
              description: 'Stretch drives growth'
            },
            {
              icon: 'trending-up',
              title: 'Curl through full arc',
              description: 'Long stretch → hard squeeze = pump'
            }
          ]
        },
        {
          name: 'Paused DB Curl',
          duration: '14–16 min',
          description: 'Pause-rep curl workout removing momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Dumbbell Curl — pause reps (1s halfway up)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Pauses eliminate momentum for honest tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause kills bounce',
              description: 'Honest tension'
            },
            {
              icon: 'hand-left',
              title: 'Grip tight throughout',
              description: 'Improves neural drive'
            },
            {
              icon: 'flash',
              title: 'Finish with a hard top squeeze',
              description: 'Shortened biceps pump best'
            }
          ]
        },
        {
          name: 'Alternating Curl Burn Builder',
          duration: '15–17 min',
          description: 'Burnout-style curl workout extending time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×16 Alternating DB Curls — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Extended time under tension builds endurance and pump',
          moodTips: [
            {
              icon: 'shield',
              title: 'No swinging allowed',
              description: 'Fatigue should stay local'
            },
            {
              icon: 'body',
              title: 'Steady breathing',
              description: 'Keeps rhythm clean'
            },
            {
              icon: 'flash',
              title: 'Light weight, nonstop reps',
              description: 'Continuous tension = pump'
            }
          ]
        },
        {
          name: 'Curl + Hammer Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing supinated and neutral curls.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 Dumbbell Curl — standard reps\nsuperset with\n• 10 Hammer Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Two grip styles maximize total arm development',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Supinated curl first',
              description: 'Peak biceps output'
            },
            {
              icon: 'fitness',
              title: 'Hammers finish the arm',
              description: 'Brachialis assists growth'
            },
            {
              icon: 'flash',
              title: 'Control both tops',
              description: 'Two contractions = massive pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy DB Curl Builder',
          duration: '18–20 min',
          description: 'Standard heavy curl workout emphasizing load control.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 Dumbbell Curl — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Heavy loads with strict form build maximum strength',
          moodTips: [
            {
              icon: 'body',
              title: 'No torso movement',
              description: 'Load stays honest'
            },
            {
              icon: 'trending-down',
              title: 'Lower slower than you lift',
              description: 'Eccentric overload'
            },
            {
              icon: 'flash',
              title: 'Squeeze before elbow lockout',
              description: 'Peak flexion is the goal'
            }
          ]
        },
        {
          name: 'DB Curl Drop Ladder',
          duration: '18–20 min',
          description: 'Multi-drop curl workout driving mechanical fatigue.',
          battlePlan: 'Battle Plan — Drop Ladder\n• 3 rounds:\n  10 reps → drop ~20% → 8 reps → drop ~15% → AMRAP\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Drop sets extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'No rest between changes'
            },
            {
              icon: 'shield',
              title: 'Smaller drops preserve form',
              description: 'Keep elbows pinned'
            },
            {
              icon: 'timer',
              title: 'End each mini-set with a squeeze',
              description: 'Contracted biceps, not momentum'
            }
          ]
        },
        {
          name: 'Incline Curl Burnout',
          duration: '18–20 min',
          description: 'Burnout long-head curl workout using stretch-bias.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15 Incline DB Curl — burnout reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Stretch-biased burnout maximizes long-head hypertrophy',
          moodTips: [
            {
              icon: 'body',
              title: 'Arms stay behind torso',
              description: 'Stretch bias maintained'
            },
            {
              icon: 'shield',
              title: 'No half reps',
              description: 'Full ROM matters'
            },
            {
              icon: 'flash',
              title: 'Stretch deep, squeeze hard',
              description: 'Long-to-short tension = pump'
            }
          ]
        },
        {
          name: '21s + Iso Finish',
          duration: '18–20 min',
          description: 'Partial-range burnout workout finishing with peak contraction hold.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 3 rounds of 21s\n• Final set: squeeze to finish — hold top flex 10s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: '21s with iso hold completely exhausts biceps fibers',
          moodTips: [
            {
              icon: 'timer',
              title: 'Partials stay controlled',
              description: 'No bouncing'
            },
            {
              icon: 'trending-up',
              title: 'Top-range reps dominate',
              description: 'Peak biceps tension'
            },
            {
              icon: 'flash',
              title: 'Hold the flex hard',
              description: 'Shortened position seals the pump'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ Curl Bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Bar Curl',
          duration: '10–12 min',
          description: 'Straightforward curls build solid foundation form',
          battlePlan: '3 rounds\n• 10–12 EZ Bar Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'EZ bar reduces wrist stress for easier motion and more power',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip the angled bar comfortably',
              description: 'EZ bar angle protects wrists.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows locked at your sides',
              description: 'Fixed elbow position isolates biceps.'
            }
          ]
        },
        {
          name: 'Wide Grip Curl',
          duration: '10–12 min',
          description: 'Wide grip curls improve control and arm balance',
          battlePlan: '3 rounds\n• 10 Wide Grip EZ Curls\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Wide grip shifts stress toward the outer heads',
          moodTips: [
            {
              icon: 'body',
              title: 'Wide stance, no shoulder flare',
              description: 'Stable base prevents momentum.'
            },
            {
              icon: 'flash',
              title: 'Squeeze at the top each rep',
              description: 'Peak contraction builds definition.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Narrow Curl',
          duration: '12–14 min',
          description: 'Close grip curls build stronger arm inner heads',
          battlePlan: '4 rounds\n• 8–10 Narrow Grip EZ Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Narrow grip overloads the biceps inner portion',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep palms inward, elbows close',
              description: 'Narrow grip targets inner biceps.'
            },
            {
              icon: 'trending-up',
              title: 'Pull bar to upper chest line',
              description: 'Full range maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Controlled lowering builds growth development fast',
          battlePlan: '3 rounds\n• 8 EZ Bar Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Three second eccentric exaggerates curl tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower in 3s',
              description: 'Fast concentric, slow eccentric.'
            },
            {
              icon: 'body',
              title: 'Stay tall with posture locked',
              description: 'Prevent body English for isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Narrow',
          duration: '14–16 min',
          description: 'Wide and narrow grips develop balance and size',
          battlePlan: '4 rounds\n• 8 Wide Grip Curl\nRest 90s\n• 8 Narrow Grip Curl\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Grip variance maximizes recruitment across arms',
          moodTips: [
            {
              icon: 'shield',
              title: 'Don\'t overload; stay controlled',
              description: 'Form matters more than weight.'
            },
            {
              icon: 'fitness',
              title: 'Keep elbows locked at sides',
              description: 'Consistent elbow position ensures isolation.'
            }
          ]
        },
        {
          name: 'Curl + Hold',
          duration: '16–18 min',
          description: 'Fast curls then iso hold fully exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Wide Grip EZ Curl\n• 8 Narrow Grip Curl\n• End with 10s Hold Mid Curl\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Static hold after volume increases muscle stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold mid curl for 10s each set',
              description: 'Isometric position builds endurance.'
            },
            {
              icon: 'body',
              title: 'Keep posture strict under load',
              description: 'Don\'t sacrifice form when fatigued.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable Machine',
    icon: 'swap-vertical',
    workouts: {
      beginner: [
        {
          name: 'Straight Bar Curl',
          duration: '10–12 min',
          description: 'Straight bar curl develops controlled curling form',
          battlePlan: '3 rounds\n• 10–12 Straight Bar Cable Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/3z2y67t7_cc.jpg',
          intensityReason: 'Cable tension enforces strict and smooth curling',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep elbows tucked, bar path vertical',
              description: 'Straight bar path maximizes bicep engagement.'
            },
            {
              icon: 'body',
              title: 'Don\'t lean back or swing',
              description: 'Cable provides constant tension.'
            }
          ]
        },
        {
          name: 'Rope Hammer Curl',
          duration: '10–12 min',
          description: 'Rope hammer curl adds overall forearm thickness',
          battlePlan: '3 rounds\n• 10–12 Rope Hammer Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Neutral grip cable work hits brachialis harder for fuller arms',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Spread rope ends at the top',
              description: 'Spreading rope increases peak contraction.'
            },
            {
              icon: 'trending-down',
              title: 'Controlled lowering enhances result',
              description: 'Slow negative builds strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'EZ Bar Curl',
          duration: '12–14 min',
          description: 'Stronger sets develop hypertrophy with posture',
          battlePlan: '4 rounds\n• 8–10 EZ Bar Cable Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qi05o2xg_download%20%2819%29.png',
          intensityReason: 'Angled bar grip improves joint comfort heavy',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall, no torso swing',
              description: 'Stable core isolates arm work.'
            },
            {
              icon: 'timer',
              title: 'Lower bar slowly, keep tension',
              description: 'Cable provides constant resistance.'
            }
          ]
        },
        {
          name: 'Cable Negatives',
          duration: '12–14 min',
          description: 'Negative bar curls grow size and total integrity with greater muscle fiber recruitment',
          battlePlan: '3 rounds\n• 8 Cable Bar Curls (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png',
          intensityReason: 'Slow eccentrics amplify hypertrophy adaptation',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive up powerfully, lower 3s',
              description: 'Explosive concentric, controlled eccentric.'
            },
            {
              icon: 'fitness',
              title: 'Elbows fixed at torso sides',
              description: 'Locked elbows ensure bicep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Rope plus bar combo overloads total arm volume',
          battlePlan: '4 rounds\n• 8 Rope Hammer Curls\nRest 60–75s\n• 8 Straight Bar Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/waan6rau_download%20%2820%29.png',
          intensityReason: 'Grip pairing works multiple arm muscle fibers',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rope = neutral, bar = strict supination',
              description: 'Different grips target different fibers.'
            },
            {
              icon: 'flash',
              title: 'Focus pump control with each grip',
              description: 'Mind-muscle connection is key.'
            }
          ]
        },
        {
          name: 'Cable Curl 21s',
          duration: '16–18 min',
          description: 'Seven seven seven set fully exhausts every curl',
          battlePlan: '3 rounds\n• 7 Bottom Half Cable Curls\n• 7 Top Half Cable Curls\n• 7 Full Range Cable Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Partial and full ranges maximize biceps fatigue',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep tension, no stack resting',
              description: 'Constant tension throughout all 21 reps.'
            },
            {
              icon: 'trending-up',
              title: 'Smooth range in all three phases',
              description: 'Control through partial and full ranges.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Preacher Curl Machine',
    icon: 'desktop',
    workouts: {
      beginner: [
        {
          name: 'Preacher Intro',
          duration: '10–12 min',
          description: 'Guided preacher curls isolate and strengthen arms',
          battlePlan: '3 rounds\n• 10–12 Preacher Curls\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Arm pad stabilizes curl motion and builds control',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep arms locked to the pad',
              description: 'Pad support ensures strict isolation.'
            },
            {
              icon: 'shield',
              title: 'Avoid bouncing at the bottom',
              description: 'Controlled movement prevents injury.'
            }
          ]
        },
        {
          name: 'Slow Preacher',
          duration: '10–12 min',
          description: 'Tempo preacher curls enhance control and tension',
          battlePlan: '3 rounds\n• 10 Preacher Curls (2–3s descent)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Slowed cadence develops precision under load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower in 2–3s each rep',
              description: 'Slow tempo increases time under tension.'
            },
            {
              icon: 'flash',
              title: 'Pause and squeeze at top',
              description: 'Peak contraction builds strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Preacher',
          duration: '12–14 min',
          description: 'Heavier preacher curls grow arms with intensity',
          battlePlan: '4 rounds\n• 8–10 Heavy Preacher Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Stable preacher pad allows progressive overload',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive bar smooth each rep',
              description: 'Consistent tempo under heavy load.'
            },
            {
              icon: 'fitness',
              title: 'Maintain full pad contact',
              description: 'Pad contact ensures proper isolation.'
            }
          ]
        },
        {
          name: 'Negative Preacher',
          duration: '12–14 min',
          description: 'Slow negatives increase biceps time under tension',
          battlePlan: '3 rounds\n• 8 Negative Preacher Curls (3s lowering)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: '3 second eccentrics add enhanced hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, lower 3s down',
              description: 'Fast up, slow down for growth.'
            },
            {
              icon: 'shield',
              title: 'Control bar to avoid bounce',
              description: 'Smooth transition at bottom protects elbows.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Narrow',
          duration: '14–16 min',
          description: 'Wide and narrow grips target both biceps heads',
          battlePlan: '4 rounds\n• 8 Wide Grip Preachers\nRest 75s\n• 8 Narrow Grip Preachers\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Changing grips stresses variation in fiber lines',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Wide hits outer, narrow inner',
              description: 'Different grips target different heads.'
            },
            {
              icon: 'body',
              title: 'Keep torso against the pad',
              description: 'Body position maintains strict form.'
            }
          ]
        },
        {
          name: 'Preacher Burnout',
          duration: '16–18 min',
          description: 'Burnout preacher curls finish arms under tension',
          battlePlan: '4 rounds\n• 8–10 Preacher Curls\n• End with 10s Midpoint Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Iso holds combined with sets maximize fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Last rep hold 10s halfway',
              description: 'Isometric hold fully exhausts muscle.'
            },
            {
              icon: 'flame',
              title: 'Keep tension strict to end',
              description: 'Mental toughness completes the set.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Biceps Curl Machine',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Machine Curl',
          duration: '10–12 min',
          description: 'Standard machine curls build early strength base',
          battlePlan: '3 rounds\n• 10–12 Machine Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Fixed pathway ensures easier curling technique',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Sit tall and grip handles tight',
              description: 'Proper posture ensures effective movement.'
            },
            {
              icon: 'shield',
              title: 'Pull smooth without bounce',
              description: 'Controlled reps prevent injury.'
            }
          ]
        },
        {
          name: 'Curl with Pause',
          duration: '10–12 min',
          description: 'Isometric hold improves mind muscle link early, with curl machine hyper extension',
          battlePlan: '3 rounds\n• 10 Machine Curls (2s pause top)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Peak pause builds muscle contraction strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold 2s at top of each rep',
              description: 'Pause increases peak contraction.'
            },
            {
              icon: 'trending-down',
              title: 'Control return phase',
              description: 'Slow negative builds strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Machine Curl',
          duration: '12–14 min',
          description: 'Stronger machine curls stimulate hypertrophy gains',
          battlePlan: '4 rounds\n• 8–10 Heavy Machine Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Safe machine setup supports heavier overload',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Lock elbows down to pad',
              description: 'Fixed position maximizes isolation.'
            },
            {
              icon: 'refresh',
              title: 'Perform with steady rhythm',
              description: 'Consistent tempo builds strength.'
            }
          ]
        },
        {
          name: 'Eccentric Curl',
          duration: '12–14 min',
          description: 'Negative machine curls deepen hypertrophy drive',
          battlePlan: '3 rounds\n• 8 Curls (3s eccentric lowering)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Slower eccentric motion builds harder tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Drive up then lower for 3s',
              description: 'Extended negative phase builds size.'
            },
            {
              icon: 'fitness',
              title: 'Keep pads tight to arms',
              description: 'Proper pad contact ensures isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Curls',
          duration: '14–16 min',
          description: 'Drop sets extend working time for biceps growth',
          battlePlan: '4 rounds\n• 8 Heavy Machine Curls\n• Drop 20% → 8 More Reps\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/um46qpzr_download%20%283%29.png',
          intensityReason: 'Removing weight sustains prolonged curl strain',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip weight quickly after set',
              description: 'Fast transition maximizes intensity.'
            },
            {
              icon: 'trending-up',
              title: 'Keep reps smooth each drop',
              description: 'Maintain form through fatigue.'
            }
          ]
        },
        {
          name: 'Machine Curl Burn',
          duration: '16–18 min',
          description: 'Iso holds at midpoint greatly exhaust the biceps',
          battlePlan: '4 rounds\n• 8 Machine Curls\n• End with 10s Mid Curl Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/h9obln9e_download%20%282%29.png',
          intensityReason: 'Static holds boost stimulus beyond normal sets',
          moodTips: [
            {
              icon: 'timer',
              title: 'After last rep, hold 10s mid',
              description: 'Isometric position creates metabolic stress.'
            },
            {
              icon: 'shield',
              title: 'No stack slamming at bottom',
              description: 'Control throughout maintains tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pull Up Bar',
    icon: 'remove-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Chins',
          duration: '10–12 min',
          description: 'Assisted chin ups help beginners build curl strength',
          battlePlan: '3 rounds\n• 5 Assisted Chin Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Band or machine assistance teaches strict form',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face you, elbows tucked',
              description: 'Underhand grip targets biceps.'
            },
            {
              icon: 'fitness',
              title: 'Use band/machine as needed',
              description: 'Assistance helps build strength gradually.'
            }
          ]
        },
        {
          name: 'Negative Chins',
          duration: '10–12 min',
          description: 'Negative chin ups improve strength for real reps',
          battlePlan: '3 rounds\n• 5 Negative Chin Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
          intensityReason: 'Controlled descent builds stronger arm pulling',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower for 3–5s on each rep',
              description: 'Slow negatives build eccentric strength.'
            },
            {
              icon: 'body',
              title: 'Keep torso steady, no swing',
              description: 'Strict form prevents momentum.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Strict Chins',
          duration: '12–14 min',
          description: 'Strict chin ups strengthen biceps and lats together',
          battlePlan: '4 rounds\n• 6 Chin Ups\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Bodyweight movement grows pulling arm power',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest high to bar line',
              description: 'Full range maximizes muscle recruitment.'
            },
            {
              icon: 'fitness',
              title: 'Extend fully at bottom each rep',
              description: 'Complete extension ensures full range.'
            }
          ]
        },
        {
          name: 'Chin + Hold',
          duration: '12–14 min',
          description: 'Isometric on bar builds tougher pulling strength',
          battlePlan: '3 rounds\n• 6 Chin Ups\n• End with 3s Hold at Top\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
          intensityReason: 'Finishing hold improves control and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold top for 3s after last rep',
              description: 'Isometric hold builds endurance.'
            },
            {
              icon: 'body',
              title: 'Do not shrug shoulders up',
              description: 'Keep shoulders down and engaged.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Chins',
          duration: '14–16 min',
          description: 'Weighted chin ups grow mass with strict posture',
          battlePlan: '4 rounds\n• 6–8 Weighted Chin Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h4qn95p_download.png',
          intensityReason: 'Adding load forces stronger hypertrophy gains',
          moodTips: [
            {
              icon: 'construct',
              title: 'Add belt or dumbbell slowly',
              description: 'Progressive overload builds strength.'
            },
            {
              icon: 'shield',
              title: 'Never kip or swing body',
              description: 'Strict form prevents injury.'
            }
          ]
        },
        {
          name: 'Chest Bar + Negs',
          duration: '16–18 min',
          description: 'High pulls combined with negatives boost strength',
          battlePlan: '4 rounds\n• 6 Chest to Bar Pull Ups\n• 6 Negative Chin Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iac5dn06_cups.jpeg',
          intensityReason: 'Chest to bar reps plus negatives overload arms',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest to bar every rep',
              description: 'Full range maximizes development.'
            },
            {
              icon: 'timer',
              title: 'Descend 3–5s consistently',
              description: 'Controlled negatives build strength.'
            }
          ]
        }
      ]
    }
  }
];
