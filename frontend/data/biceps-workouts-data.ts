import { EquipmentWorkouts } from '../types/workout';

export const bicepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'DB Curl',
          duration: '10–12 min',
          description: 'Standard dumbbell curl increases beginner strength',
          battlePlan: '3 rounds\n• 10–12 Dumbbell Curls\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Builds curl discipline with stable elbow position',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep elbows pinned at sides',
              description: 'Maintain strict form throughout movement.'
            },
            {
              icon: 'trending-down',
              title: 'Lower weights slowly, avoid swinging',
              description: 'Control the negative for better gains.'
            }
          ]
        },
        {
          name: 'Hammer Curl',
          duration: '10–12 min',
          description: 'Hammer curl variation develops early arm thickness',
          battlePlan: '3 rounds\n• 10–12 Hammer Curls\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Neutral grip activates forearms and brachialis',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Palms face each other all reps',
              description: 'Neutral grip maximizes forearm engagement.'
            },
            {
              icon: 'timer',
              title: 'Pause lightly at top of curl',
              description: 'Brief pause increases muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Alternating Curl',
          duration: '12–14 min',
          description: 'Alternating curls sharpen balance and strict form',
          battlePlan: '4 rounds\n• 8–10 per arm Alternating DB Curls\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Alternating arms builds strength and discipline',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn palms up fully at top',
              description: 'Full supination maximizes bicep contraction.'
            },
            {
              icon: 'body',
              title: 'Don\'t rotate torso when curling',
              description: 'Keep core stable for isolated arm work.'
            }
          ]
        },
        {
          name: 'Negative Curl',
          duration: '12–14 min',
          description: 'Negative dumbbell curls extend training stimulus',
          battlePlan: '3 rounds\n• 8 Dumbbell Curls (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Controlled eccentric adds greater hypertrophy load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Raise quickly, lower over 3s',
              description: 'Extended negative phase builds strength.'
            },
            {
              icon: 'body',
              title: 'Stay tall, don\'t lean',
              description: 'Proper posture prevents momentum.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Curl + Hammer',
          duration: '14–16 min',
          description: 'Pairing curls with hammer expands overall growth',
          battlePlan: '4 rounds\n• 8 Standard DB Curls\nRest 90s\n• 8 Hammer Curls\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/azkbdoo3_download%20%282%29.png',
          intensityReason: 'Combining grips overloads arms with intensity',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Keep form strict, reduce weight if swinging',
              description: 'Quality over quantity for best results.'
            },
            {
              icon: 'flash',
              title: 'Maintain tension, no resting at bottom',
              description: 'Constant tension maximizes hypertrophy.'
            }
          ]
        },
        {
          name: 'Curl Complex',
          duration: '16–18 min',
          description: 'Complex mix of curls and holds builds serious pump',
          battlePlan: '4 rounds\n• 8 Alternating DB Curls\n• Immediately 8 Hammer Curls\n• End with 10s DB Curl Hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/2j38bvu7_download%20%281%29.png',
          intensityReason: 'Supersets and holds maximize tension duration',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold at 90° to keep muscle fully engaged',
              description: 'Isometric hold increases time under tension.'
            },
            {
              icon: 'flame',
              title: 'Push through the burn — don\'t disengage',
              description: 'Mental toughness builds physical results.'
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
