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
          name: 'EZ Bar Curl Builder',
          duration: '12–14 min',
          description: 'Standard barbell curl workout for joint-friendly loading.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 EZ Bar Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'EZ bar reduces wrist stress for comfortable curling',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Wrists stay neutral',
              description: 'Elbow comfort'
            },
            {
              icon: 'trending-up',
              title: 'Bar path straight up',
              description: 'Prevents shoulder drift'
            },
            {
              icon: 'flash',
              title: 'Lower fully, squeeze hard at top',
              description: 'Stretch + flex = pump'
            }
          ]
        },
        {
          name: 'Tempo EZ Curl',
          duration: '12–14 min',
          description: 'Eccentric-focused curl workout emphasizing control.',
          battlePlan: 'Battle Plan — Eccentric Sets\n• 4×10 EZ Curl — eccentric reps (3s down)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Slow eccentrics build strength through control',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Slow negatives matter',
              description: 'Biceps respond well to eccentrics'
            },
            {
              icon: 'body',
              title: 'Elbows don\'t drift forward',
              description: 'Keeps tension local'
            },
            {
              icon: 'flash',
              title: 'Stretch at bottom, flex fully',
              description: 'Controlled range drives pump'
            }
          ]
        },
        {
          name: 'Close-Grip EZ Curl',
          duration: '12–14 min',
          description: 'Standard close-grip curl workout biasing long head.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Close-Grip EZ Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Close grip emphasizes long head development',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Hands inside shoulder width',
              description: 'Long-head bias'
            },
            {
              icon: 'refresh',
              title: 'Smooth tempo',
              description: 'No jerking'
            },
            {
              icon: 'flash',
              title: 'Full ROM every rep',
              description: 'Better pump than heavier load'
            }
          ]
        },
        {
          name: 'Curl + Iso Finish',
          duration: '12–14 min',
          description: 'Standard curl workout with squeeze-to-finish at peak flexion.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 EZ Curl — standard reps\n• Final set: squeeze to finish — hold bar at top 8–10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Isometric finish maximizes muscle engagement',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows stay locked in place',
              description: 'No shoulder help'
            },
            {
              icon: 'flash',
              title: 'Flex hard during the hold',
              description: 'Neural drive matters'
            },
            {
              icon: 'fitness',
              title: 'Use lighter bar for the hold',
              description: 'Longer contraction = pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Wide-Grip EZ Curl',
          duration: '14–16 min',
          description: 'Standard curl workout biasing short head.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 Wide-Grip EZ Curl — standard reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Wide grip targets short head for peak development',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip wider than shoulders',
              description: 'Short-head emphasis'
            },
            {
              icon: 'body',
              title: 'No torso swing',
              description: 'Keeps tension pure'
            },
            {
              icon: 'flash',
              title: 'Squeeze hard at top',
              description: 'Short head pumps fast'
            }
          ]
        },
        {
          name: 'Paused EZ Curl',
          duration: '14–16 min',
          description: 'Pause-rep curl workout eliminating momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 EZ Curl — pause reps (1s halfway)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Pauses eliminate momentum for honest loading',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause kills stretch reflex',
              description: 'Honest loading'
            },
            {
              icon: 'hand-left',
              title: 'Grip tight',
              description: 'Improves force output'
            },
            {
              icon: 'flash',
              title: 'Finish each rep with intent',
              description: 'Strong contraction = pump'
            }
          ]
        },
        {
          name: 'EZ Curl Burn Builder',
          duration: '15–17 min',
          description: 'Burnout curl workout emphasizing time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15 EZ Curl — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Extended reps build endurance and pump',
          moodTips: [
            {
              icon: 'shield',
              title: 'No lockout at bottom',
              description: 'Constant tension'
            },
            {
              icon: 'refresh',
              title: 'Smooth cadence',
              description: 'Keeps elbows happy'
            },
            {
              icon: 'flash',
              title: 'Moderate weight, nonstop reps',
              description: 'Burnout = pump'
            }
          ]
        },
        {
          name: 'Curl + Reverse Curl Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing supinated and pronated grips.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 EZ Curl — standard reps\nsuperset with\n• 10 Reverse EZ Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Two grip styles maximize forearm and bicep development',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Supinated first',
              description: 'Max biceps output'
            },
            {
              icon: 'fitness',
              title: 'Reverse curls finish forearms',
              description: 'Support elbow health'
            },
            {
              icon: 'flash',
              title: 'Control both tops',
              description: 'Two squeezes = bigger pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy EZ Curl Builder',
          duration: '18–20 min',
          description: 'Standard heavy curl workout emphasizing control.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×6 EZ Curl — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
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
              title: 'Finish reps with a squeeze',
              description: 'Contracted biceps matter'
            }
          ]
        },
        {
          name: 'EZ Curl Drop Cluster',
          duration: '18–20 min',
          description: 'Multi-drop curl workout driving fatigue safely.',
          battlePlan: 'Battle Plan — Drop Cluster\n• Set 1: 10 reps\n• Set 2: drop set — 10 → drop ~20% → 8\n• Set 3: triple drop — 8 → drop ~15% → 6 → drop ~10% → 6\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png',
          intensityReason: 'Drop clusters extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plate changes are immediate',
              description: 'No walking away'
            },
            {
              icon: 'shield',
              title: 'Smaller drops preserve elbow comfort',
              description: 'Keep reps clean'
            },
            {
              icon: 'timer',
              title: 'End each set with a flex',
              description: 'Peak contraction seals pump'
            }
          ]
        },
        {
          name: 'EZ Curl Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric curl workout.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×12 EZ Curl — burnout reps\n• Final set: squeeze to finish — hold top 10s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: 'Burnout with iso hold completely exhausts biceps',
          moodTips: [
            {
              icon: 'shield',
              title: 'No cheating allowed',
              description: 'Fatigue should be local'
            },
            {
              icon: 'flash',
              title: 'Flex hard during hold',
              description: 'Neuromuscular demand'
            },
            {
              icon: 'fitness',
              title: 'Lighter bar, longer hold',
              description: 'Pump > ego'
            }
          ]
        },
        {
          name: '1.5-Rep EZ Curl',
          duration: '18–20 min',
          description: 'Partial-range curl workout extending time under tension.',
          battlePlan: 'Battle Plan — Standard Sets\n• 5×8 EZ Curl — 1.5 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/baaichm8_download%20%283%29.png',
          intensityReason: '1.5 reps double time under tension per rep',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Half rep stays near top',
              description: 'Contracted range emphasized'
            },
            {
              icon: 'timer',
              title: 'Smooth transitions',
              description: 'No bouncing'
            },
            {
              icon: 'flash',
              title: 'Top-range tension dominates',
              description: 'Biceps stay pumped'
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
          name: 'Standing Cable Curl Builder',
          duration: '12–14 min',
          description: 'Standard cable curl workout emphasizing constant tension.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Standing Cable Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/3z2y67t7_cc.jpg',
          intensityReason: 'Cables provide constant tension throughout the movement',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows stay pinned',
              description: 'Prevents shoulder takeover'
            },
            {
              icon: 'refresh',
              title: 'Smooth pull, smooth return',
              description: 'Cables reward control'
            },
            {
              icon: 'trending-up',
              title: 'Step back slightly for stretch',
              description: 'Longer starting position = better pump'
            }
          ]
        },
        {
          name: 'Rope Cable Curl',
          duration: '12–14 min',
          description: 'Standard neutral-grip curl workout for elbow-friendly loading.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Rope Cable Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Neutral grip with constant cable tension hits brachialis',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Split the rope at the top',
              description: 'Improves peak contraction'
            },
            {
              icon: 'fitness',
              title: 'Wrists stay neutral',
              description: 'Brachialis engagement'
            },
            {
              icon: 'flash',
              title: 'Light load, full ROM',
              description: 'Continuous tension = pump'
            }
          ]
        },
        {
          name: 'Seated Low Cable Curl',
          duration: '12–14 min',
          description: 'Standard seated curl workout removing momentum.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Seated Low Cable Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/3z2y67t7_cc.jpg',
          intensityReason: 'Seated position removes momentum for pure biceps isolation',
          moodTips: [
            {
              icon: 'body',
              title: 'Sit tall, don\'t lean',
              description: 'Zero cheating'
            },
            {
              icon: 'trending-down',
              title: 'Let arms fully extend',
              description: 'Cable stretch hits hard'
            },
            {
              icon: 'flash',
              title: 'Stretch deep, squeeze tight',
              description: 'Long-to-short tension fuels pump'
            }
          ]
        },
        {
          name: 'Curl + Iso Finish',
          duration: '12–14 min',
          description: 'Standard cable curl workout with squeeze-to-finish at peak flexion.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 Cable Curl — standard reps\n• Final set: squeeze to finish — hold handle at full elbow flexion 8–10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Isometric finish with cable tension maximizes pump',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex as hard as possible',
              description: 'Biceps respond to intent'
            },
            {
              icon: 'body',
              title: 'Elbows frozen during hold',
              description: 'Keeps tension local'
            },
            {
              icon: 'fitness',
              title: 'Reduce load for the hold',
              description: 'Longer squeeze = bigger pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline Cable Curl',
          duration: '14–16 min',
          description: 'Standard long-head curl workout using shoulder extension.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 Incline Cable Curl — standard reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qi05o2xg_download%20%2819%29.png',
          intensityReason: 'Incline position with cable creates extreme long-head stretch',
          moodTips: [
            {
              icon: 'body',
              title: 'Bench low, arms back',
              description: 'Long-head bias'
            },
            {
              icon: 'timer',
              title: 'Don\'t rush the bottom',
              description: 'Stretch drives growth'
            },
            {
              icon: 'trending-up',
              title: 'Lean back slightly',
              description: 'Cable stretch amplifies pump'
            }
          ]
        },
        {
          name: 'Paused Cable Curl',
          duration: '14–16 min',
          description: 'Pause-rep cable curl workout eliminating momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Cable Curl — pause reps (1s halfway)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png',
          intensityReason: 'Pauses eliminate cable rebound for honest tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause kills cable rebound',
              description: 'Honest tension'
            },
            {
              icon: 'hand-left',
              title: 'Grip stays tight',
              description: 'Improves neural drive'
            },
            {
              icon: 'flash',
              title: 'Finish with a hard squeeze',
              description: 'Shortened biceps pump best'
            }
          ]
        },
        {
          name: 'Single-Arm Cable Curl Burn',
          duration: '15–17 min',
          description: 'Burnout-style unilateral curl workout for extended tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×14 Single-Arm Cable Curls — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qi05o2xg_download%20%2819%29.png',
          intensityReason: 'Unilateral work with continuous cable tension builds endurance',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Alternate sides without rest',
              description: 'Density increases fatigue'
            },
            {
              icon: 'body',
              title: 'No torso twist',
              description: 'Isolates biceps'
            },
            {
              icon: 'trending-up',
              title: 'Step further back as fatigue rises',
              description: 'Stretch keeps pump alive'
            }
          ]
        },
        {
          name: 'Curl + Face-Away Curl Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing front-facing and face-away curls.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 Cable Curl (facing stack) — standard reps\nsuperset with\n• 10 Face-Away Cable Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png',
          intensityReason: 'Two angles maximize stretch and contraction phases',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Face-away curls stretch hardest',
              description: 'Long-head emphasis'
            },
            {
              icon: 'body',
              title: 'Keep shoulders fixed',
              description: 'Prevents cheating'
            },
            {
              icon: 'flash',
              title: 'Long stretch, hard squeeze',
              description: 'Two angles = massive pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Cable Curl Builder',
          duration: '18–20 min',
          description: 'Standard heavy cable curl workout emphasizing control.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 Cable Curl — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/waan6rau_download%20%2820%29.png',
          intensityReason: 'Heavy cable loads with constant tension build strength',
          moodTips: [
            {
              icon: 'body',
              title: 'No body sway',
              description: 'Load stays honest'
            },
            {
              icon: 'trending-down',
              title: 'Slow negatives',
              description: 'Cable eccentrics hit hard'
            },
            {
              icon: 'flash',
              title: 'Finish every rep with intent',
              description: 'Peak flexion matters'
            }
          ]
        },
        {
          name: 'Cable Curl Drop Ladder',
          duration: '18–20 min',
          description: 'Multi-drop cable curl workout driving mechanical fatigue.',
          battlePlan: 'Battle Plan — Drop Ladder\n• 3 rounds:\n  10 reps → drop ~15% → 8 reps → drop ~10% → AMRAP\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/waan6rau_download%20%2820%29.png',
          intensityReason: 'Cable drop sets maintain tension without momentum',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pin changes immediately',
              description: 'No stepping away'
            },
            {
              icon: 'shield',
              title: 'Smaller drops keep tension high',
              description: 'Cables don\'t need big drops'
            },
            {
              icon: 'timer',
              title: 'End ladders with a squeeze',
              description: 'Contracted biceps seal the pump'
            }
          ]
        },
        {
          name: 'Cable Curl Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric cable curl workout.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×15 Cable Curl — burnout reps\n• Final set: squeeze to finish — hold at peak flexion 10s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/jzrqwni6_download.png',
          intensityReason: 'Burnout with iso hold under cable tension exhausts biceps',
          moodTips: [
            {
              icon: 'shield',
              title: 'Nonstop tension',
              description: 'No resting on the stack'
            },
            {
              icon: 'flash',
              title: 'Flex aggressively',
              description: 'Neural drive counts'
            },
            {
              icon: 'trending-up',
              title: 'Step back slightly',
              description: 'Stretch + hold = pump'
            }
          ]
        },
        {
          name: '1.5-Rep Cable Curl',
          duration: '18–20 min',
          description: 'Partial-range curl workout emphasizing the strongest range.',
          battlePlan: 'Battle Plan — Standard Sets\n• 5×8 Cable Curl — 1.5 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/3z2y67t7_cc.jpg',
          intensityReason: '1.5 reps with cable tension double time under tension',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Half rep stays near top',
              description: 'Contracted bias'
            },
            {
              icon: 'timer',
              title: 'Smooth transitions',
              description: 'No jerking'
            },
            {
              icon: 'flash',
              title: 'Top-range dominance',
              description: 'Cables keep delts out, biceps pumped'
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
          name: 'Preacher Curl Builder',
          duration: '12–14 min',
          description: 'Standard preacher curl workout emphasizing strict elbow flexion.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Preacher Machine Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Preacher pad eliminates cheating for pure biceps isolation',
          moodTips: [
            {
              icon: 'body',
              title: 'Upper arms glued to pad',
              description: 'Zero momentum'
            },
            {
              icon: 'trending-down',
              title: 'Control the bottom',
              description: 'Protects elbows'
            },
            {
              icon: 'flash',
              title: 'Stretch deep, squeeze hard',
              description: 'Preacher pumps brutally'
            }
          ]
        },
        {
          name: 'Tempo Preacher Curl',
          duration: '12–14 min',
          description: 'Eccentric-focused preacher curl workout emphasizing control.',
          battlePlan: 'Battle Plan — Eccentric Sets\n• 4×10 Preacher Curl — eccentric reps (3s down)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Slow eccentrics on preacher pad hit hard',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Slow negatives matter',
              description: 'Preacher eccentrics hit hard'
            },
            {
              icon: 'shield',
              title: 'No lockout',
              description: 'Keeps tension'
            },
            {
              icon: 'flash',
              title: 'Bottom stretch fuels pump',
              description: 'Long range dominates'
            }
          ]
        },
        {
          name: 'Close-Grip Preacher Curl',
          duration: '12–14 min',
          description: 'Standard narrow-grip preacher curl biasing long head.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Close-Grip Preacher Curl — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Close grip on preacher targets long head effectively',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Hands narrow',
              description: 'Long-head emphasis'
            },
            {
              icon: 'fitness',
              title: 'Wrists neutral',
              description: 'Elbow comfort'
            },
            {
              icon: 'flash',
              title: 'Full ROM every rep',
              description: 'Better pump than load'
            }
          ]
        },
        {
          name: 'Curl + Iso Finish',
          duration: '12–14 min',
          description: 'Standard preacher curl workout with squeeze-to-finish at peak flexion.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 Preacher Curl — standard reps\n• Final set: squeeze to finish — hold top 8–10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Isometric finish on preacher maximizes contraction',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex hard',
              description: 'Preacher removes cheating'
            },
            {
              icon: 'body',
              title: 'Elbows stay pressed into pad',
              description: 'Keeps tension pure'
            },
            {
              icon: 'fitness',
              title: 'Use lighter load for hold',
              description: 'Longer squeeze = better pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Paused Preacher Curl',
          duration: '14–16 min',
          description: 'Pause-rep preacher curl workout removing momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Preacher Curl — pause reps (1s bottom)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Bottom pauses on preacher eliminate all momentum',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause kills bounce',
              description: 'Honest tension'
            },
            {
              icon: 'body',
              title: 'Brace into pad',
              description: 'Stability matters'
            },
            {
              icon: 'flash',
              title: 'Explode into contraction',
              description: 'Smooth squeeze fuels pump'
            }
          ]
        },
        {
          name: 'Wide-Grip Preacher Curl',
          duration: '14–16 min',
          description: 'Standard preacher curl workout biasing short head.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 Wide-Grip Preacher Curl — standard reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Wide grip on preacher targets short head for peak development',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip wide',
              description: 'Short-head focus'
            },
            {
              icon: 'body',
              title: 'No shoulder lift',
              description: 'Isolation preserved'
            },
            {
              icon: 'flash',
              title: 'Short-head pumps fast',
              description: 'Lean into the burn'
            }
          ]
        },
        {
          name: 'Preacher Burn Builder',
          duration: '15–17 min',
          description: 'Burnout preacher curl workout emphasizing time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15 Preacher Curl — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Extended reps on preacher build endurance and pump',
          moodTips: [
            {
              icon: 'shield',
              title: 'No lockout allowed',
              description: 'Constant tension'
            },
            {
              icon: 'refresh',
              title: 'Smooth cadence',
              description: 'Elbow-friendly'
            },
            {
              icon: 'flash',
              title: 'Moderate load, nonstop reps',
              description: 'Burnout = pump'
            }
          ]
        },
        {
          name: 'Full + Partial Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing full ROM with top-range preacher reps.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 Preacher Curl — standard reps\nsuperset with\n• 10 Top-Range Partial Preacher Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Full and partial reps maximize fiber recruitment',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Full reps first',
              description: 'Fiber recruitment'
            },
            {
              icon: 'timer',
              title: 'Partials stay high',
              description: 'Peak tension'
            },
            {
              icon: 'flash',
              title: 'Short-range burn seals pump',
              description: 'Preacher excels here'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Preacher Curl Builder',
          duration: '18–20 min',
          description: 'Standard heavy preacher curl workout emphasizing control.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 Preacher Curl — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Heavy loads on preacher build strength without cheating',
          moodTips: [
            {
              icon: 'shield',
              title: 'No ego loading',
              description: 'Preacher punishes cheating'
            },
            {
              icon: 'trending-down',
              title: 'Control negatives',
              description: 'Elbow safety'
            },
            {
              icon: 'flash',
              title: 'Finish reps with intent',
              description: 'Contracted biceps matter'
            }
          ]
        },
        {
          name: 'Preacher Drop Cluster',
          duration: '18–20 min',
          description: 'Multi-drop preacher curl workout driving fatigue.',
          battlePlan: 'Battle Plan — Drop Cluster\n• Set 1: 10 reps\n• Set 2: drop set — 10 → drop ~20% → 8\n• Set 3: triple drop — 8 → drop ~15% → 6 → drop ~10% → 6\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/rmfkhn59_download%20%286%29.png',
          intensityReason: 'Drop clusters on preacher extend time under tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'Stay on the pad'
            },
            {
              icon: 'shield',
              title: 'Smaller drops protect elbows',
              description: 'Keep reps clean'
            },
            {
              icon: 'timer',
              title: 'End with a hard squeeze',
              description: 'Peak contraction seals pump'
            }
          ]
        },
        {
          name: 'Preacher Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric preacher curl workout.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×12 Preacher Curl — burnout reps\n• Final set: squeeze to finish — hold top 10s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: 'Burnout with iso hold on preacher exhausts biceps completely',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex aggressively',
              description: 'Preacher isolates brutally'
            },
            {
              icon: 'shield',
              title: 'No resting on pad',
              description: 'Tension stays high'
            },
            {
              icon: 'fitness',
              title: 'Lighter load, longer hold',
              description: 'Pump > ego'
            }
          ]
        },
        {
          name: '1.5-Rep Preacher Curl',
          duration: '18–20 min',
          description: 'Partial-range preacher curl workout increasing time under tension.',
          battlePlan: 'Battle Plan — Standard Sets\n• 5×8 Preacher Curl — 1.5 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2h81ucwk_download%20%285%29.png',
          intensityReason: '1.5 reps on preacher double time under tension per rep',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Half rep near top',
              description: 'Contracted emphasis'
            },
            {
              icon: 'timer',
              title: 'Smooth transitions',
              description: 'No bouncing'
            },
            {
              icon: 'flash',
              title: 'Preacher tension stays constant',
              description: 'Biceps stay pumped'
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
