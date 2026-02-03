import { EquipmentWorkouts } from '../types/workout';

export const absWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Body Weight',
    icon: 'body',
    workouts: {
      beginner: [
        {
          name: 'Standard Crunch',
          duration: '8–10 min',
          description: 'Simple crunch develops mind-muscle connection safely for beginner abs.\n ',
          battlePlan: '3 rounds\n• 12–15 Crunches\nRest 45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ppti423_download%20%2811%29.png',
          intensityReason: 'Intro movement builds baseline flexion ab strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl upper back, don\'t yank neck',
              description: 'Proper form protects your neck and maximizes ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Exhale as you reach contraction',
              description: 'Coordinated breathing enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Forearm Plank Hold',
          duration: '8–10 min',
          description: 'Teaches proper core bracing and builds strong foundational abdominal stability..\n ',
          battlePlan: '3 rounds\n• 3 × 20–30s Plank Holds\nRest 45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/rptdlvng_download%20%2812%29.png',
          intensityReason: 'Static hold trains core for anti extension endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep hips level, don\'t sag',
              description: 'Maintain proper plank alignment for maximum effectiveness.'
            },
            {
              icon: 'shield',
              title: 'Brace abs like resisting a hit',
              description: 'Think about bracing for impact to engage deep core muscles.'
            }
          ]
        },
        {
          name: 'Knee Tuck Crunch Circuit',
          duration: '8–10 min',
          description: 'Fast-paced floor circuit to build beginner ab endurance.',
          battlePlan: '3 rounds\n• 15 Crunches\n• 12 Knee Tucks\n• 20 Alt Toe Taps\nRest 45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ppti423_download%20%2811%29.png',
          intensityReason: 'Combines flexion + knee tuck without long levers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pull knees in using abs, not momentum',
              description: 'Focus on ab contraction to initiate movement.'
            },
            {
              icon: 'shield',
              title: 'Keep lower back lightly pressed into floor',
              description: 'Proper back position protects spine and maximizes ab work.'
            }
          ]
        },
        {
          name: 'High-Tempo Crunch Ladder',
          duration: '8–10 min',
          description: 'Simple but spicy crunch-based density workout.',
          battlePlan: '4 rounds\n• 20 Crunches\n• 15 Crunches\n• 10 Crunches\nRest 30–45s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ppti423_download%20%2811%29.png',
          intensityReason: 'Short rest + fast reps increase metabolic ab demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'Small, fast crunches — don\'t yank neck',
              description: 'Quick controlled movements protect your neck.'
            },
            {
              icon: 'flash',
              title: 'Exhale sharply each rep',
              description: 'Sharp exhales enhance ab contraction.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'V Up',
          duration: '10–12 min',
          description: 'Challenging bodyweight drill effectively targets the entire abdominal wall..\n ',
          battlePlan: '4 rounds\n• 10–12 V Ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/cesyx69b_download%20%2815%29.png',
          intensityReason: 'Combines flexion of torso + legs for full ab load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Legs + arms rise together',
              description: 'Coordinate movement for maximum ab contraction.'
            },
            {
              icon: 'timer',
              title: 'Balance at top momentarily',
              description: 'Brief pause at peak increases muscle activation.'
            }
          ]
        },
        {
          name: 'Bicycle Crunch',
          duration: '10–12 min',
          description: 'Builds rotational endurance and activates entire core musculature effectively..\n ',
          battlePlan: '3 rounds\n• 12 per side Bicycle Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pvvftlsu_download%20%2816%29.png',
          intensityReason: 'Alternating twist works obliques + midline control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Elbow toward opposite knee',
              description: 'Focus on rotation to engage obliques effectively.'
            },
            {
              icon: 'flash',
              title: 'Keep knees hovering off floor',
              description: 'Constant tension maintains ab engagement throughout.'
            }
          ]
        },
        {
          name: 'V-Up & Oblique Crunch Circuit',
          duration: '10–12 min',
          description: 'Fast circuit hitting upper, lower, and obliques.',
          battlePlan: '3 rounds\n• 12 V-Ups\n• 16 Oblique Crunches (8/side)\n• 30 Alt Toe Taps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/cesyx69b_download%20%2815%29.png',
          intensityReason: 'Adds long lever flexion + rotation under fatigue',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep legs long on V-ups',
              description: 'Extended legs maximize ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Rotate shoulders, not elbows',
              description: 'Proper rotation targets obliques effectively.'
            }
          ]
        },
        {
          name: 'Sit-Up Density Burner',
          duration: '10–12 min',
          description: 'Minimal rest sit-up progression for ab stamina.',
          battlePlan: '3 rounds\n• 15 Sit-Ups\n• 12 Sit-Ups\n• 10 Sit-Ups\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/cesyx69b_download%20%2815%29.png',
          intensityReason: 'High rep sit-ups push flexion endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use abs to rise, not hip snap',
              description: 'Core-driven movement builds true strength.'
            },
            {
              icon: 'timer',
              title: 'Control the descent every rep',
              description: 'Eccentric control maximizes muscle development.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Hanging Leg Raise (Bar)',
          duration: '12–14 min',
          description: 'Very challenging hanging movement requiring strength and controlled execution..\n ',
          battlePlan: '3 rounds\n• 8–10 Hanging Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/n5wg8sb5_download%20%2817%29.png',
          intensityReason: 'Hanging position overloads abs through hip flexion',
          moodTips: [
            {
              icon: 'construct',
              title: 'Don\'t swing torso, control legs',
              description: 'Strict form prevents momentum and maximizes ab work.'
            },
            {
              icon: 'flash',
              title: 'Bring toes high toward bar',
              description: 'Full range of motion maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Hollow Body + Pike Jump',
          duration: '12–14 min',
          description: 'Brutal hybrid workout testing both dynamic and static abdominal strength capacity..\n ',
          battlePlan: '3 rounds\n• 20s Hollow Hold\n• Immediately 8 Stiff Leg Pike Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/x9dvjaa1_download%20%282%29.png',
          intensityReason: 'Iso hold builds endurance, jumps build explosiveness',
          moodTips: [
            {
              icon: 'shield',
              title: 'Lower back pressed into floor',
              description: 'Maintain hollow position to protect lower back.'
            },
            {
              icon: 'flash',
              title: 'Jump quick, land on soft toes',
              description: 'Explosive movement with controlled landing.'
            }
          ]
        },
        {
          name: 'Hanging Leg Raise Speed Sets',
          duration: '12–14 min',
          description: 'Fast, controlled hanging reps drive intense lower-ab fatigue.',
          battlePlan: '4 rounds\n• 10 Hanging Leg Raises\n• 8 Hanging Knee-to-Chest\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/n5wg8sb5_download%20%2817%29.png',
          intensityReason: 'High-tempo raises overload abs without long isometrics',
          moodTips: [
            {
              icon: 'construct',
              title: 'No swinging — abs initiate every rep',
              description: 'Core-driven movement maximizes ab work.'
            },
            {
              icon: 'flash',
              title: 'Toes rise higher as fatigue builds',
              description: 'Push through fatigue for maximum results.'
            }
          ]
        },
        {
          name: 'Dragon Flag + V-Up Finisher',
          duration: '12–14 min',
          description: 'Brutal pairing of eccentric strength and speed.',
          battlePlan: '3 rounds\n• 4–6 Dragon Flag Negatives\n• Immediately 12 V-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/n5wg8sb5_download%20%2817%29.png',
          intensityReason: 'Extreme lever length + explosive flexion',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control the dragon flag descent',
              description: 'Slow eccentric builds incredible strength.'
            },
            {
              icon: 'flash',
              title: 'Snap fast into V-ups',
              description: 'Explosive V-ups after slow eccentrics torch abs.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Ab Roller',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Wall Assisted Rollout',
          duration: '8–10 min',
          description: 'Lets true beginners practice safe core extension with wall support assistance..\n ',
          battlePlan: '3 rounds\n• 12–15 Wall Rollouts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Wall stop reduces risk while building bracing control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Roll until wheel meets wall soft',
              description: 'Controlled movement prevents overextension.'
            },
            {
              icon: 'flash',
              title: 'Brace abs, squeeze pulling back',
              description: 'Focus on core strength to return to start position.'
            }
          ]
        },
        {
          name: 'Short Range Rollout',
          duration: '8–10 min',
          description: 'Builds starter strength to prepare for full extensions.\n ',
          battlePlan: '3 rounds\n• 12–15 Short Rollouts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Controlled partial rep trains tension in safer range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Extend halfway, ribs tucked',
              description: 'Maintain rib position to protect lower back.'
            },
            {
              icon: 'timer',
              title: 'Pause, squeeze contraction top',
              description: 'Brief pause builds strength and control.'
            }
          ]
        },
        {
          name: 'Eccentric-Only Kneeling Rollouts',
          duration: '8–10 min',
          description: 'Negative-only rollouts building anti-extension strength safely.',
          battlePlan: '3 rounds\n• 8–10 Eccentric Rollouts\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Eccentric focus builds strength without strain',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slowly under control',
              description: 'Slow eccentric builds strength safely.'
            },
            {
              icon: 'construct',
              title: 'Reset fully each rep',
              description: 'No rebound — clean reps only.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Full Ab Rollout',
          duration: '10–12 min',
          description: 'Long stretch motion challenges anterior abs strongly.\n ',
          battlePlan: '4 rounds\n• 8 Full Rollouts\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Full range engages deep abdominals with control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hips stay tucked, no sagging',
              description: 'Maintain proper hip position throughout movement.'
            },
            {
              icon: 'flash',
              title: 'Pull back squeezing abs tight',
              description: 'Active ab contraction powers the return movement.'
            }
          ]
        },
        {
          name: 'Rollout + Plank Hold',
          duration: '12–14 min',
          description: 'Pair movement rollout and plank for total ab burn.\n ',
          battlePlan: '3 rounds\n• 8 Rollouts\n• 20s Plank Hold\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Flexion with static hold strengthens ab endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Core braced during rollout',
              description: 'Maintain constant core tension throughout.'
            },
            {
              icon: 'shield',
              title: 'Stay rigid in plank position',
              description: 'Perfect plank form after rollouts challenges endurance.'
            }
          ]
        },
        {
          name: 'Offset-Hand Kneeling Rollouts',
          duration: '10–12 min',
          description: 'Staggered hand position increases anti-rotation demand.',
          battlePlan: '4 rounds\n• 8 per side Offset Rollouts\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Uneven hands engage obliques and challenge stability',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hands uneven on handles',
              description: 'Staggered grip increases anti-rotation demand.'
            },
            {
              icon: 'shield',
              title: 'Hips stay square',
              description: 'Resist rotation throughout movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Standing Rollout',
          duration: '12–14 min',
          description: 'Requires elite bracing strength and anterior stability.\n ',
          battlePlan: '3 rounds\n• 5–6 Standing Rollouts\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Max difficulty rollout challenges core extension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start near wall, progress away',
              description: 'Gradually increase difficulty as strength improves.'
            },
            {
              icon: 'shield',
              title: 'Keep ribs pulled down strict',
              description: 'Rib position is crucial for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Rollout with 3s Eccentric',
          duration: '12–14 min',
          description: '3s descend rollout punishes abs with strict tempo.\n ',
          battlePlan: '3 rounds\n• 6–8 Slow Eccentric Rollouts (3s down)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/7i1n31ck_download.png',
          intensityReason: 'Slow lowering multiplies tension for maximal core',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower forward on 3 count',
              description: 'Controlled eccentric builds incredible strength.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs returning smooth',
              description: 'Focus on smooth, controlled return movement.'
            }
          ]
        },
        {
          name: 'Paused Mid-Range Rollouts',
          duration: '12–14 min',
          description: 'Rollouts paused halfway to maximize core tension.',
          battlePlan: '3 rounds\n• 6–8 Paused Rollouts (2s mid-range)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gw2t6eg7_download%20%281%29.png',
          intensityReason: 'Mid-range pause maximizes ab tension at hardest point',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause where abs shake',
              description: 'Mid-range is the hardest position.'
            },
            {
              icon: 'construct',
              title: 'Resume smoothly',
              description: 'Control keeps tension throughout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Ab Crunch Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Machine Crunch (Light)',
          duration: '8–10 min',
          description: 'Builds abdominal control using small guided resisted spinal flexion movement..\n ',
          battlePlan: '3 rounds\n• 12–15 Light Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Entry movement teaches crunch with resistance path',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl spine, don\'t pull arms',
              description: 'Focus on spinal flexion, not arm movement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs at top hard',
              description: 'Peak contraction maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Machine Crunch Pause',
          duration: '8–10 min',
          description: 'Isometric crunch teaches control and endurance reps.\n ',
          battlePlan: '3 rounds\n• 10 Crunches (2s hold)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Static top hold boosts power of ab contraction',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak 2s contraction',
              description: 'Isometric holds build strength and control.'
            },
            {
              icon: 'flash',
              title: 'Exhale and squeeze abs top',
              description: 'Breathing coordination enhances contraction.'
            }
          ]
        },
        {
          name: 'Slow Eccentric Machine Crunch',
          duration: '8–10 min',
          description: 'Controlled crunch emphasizing lengthened ab tension.',
          battlePlan: '3 rounds\n• 10 Slow Eccentric Crunches (4s down)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Eccentric time builds control and strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower weight on a slow 4-count',
              description: 'Slow eccentric builds incredible control.'
            },
            {
              icon: 'construct',
              title: 'Stop just before full stretch',
              description: 'Keeps tension on abs throughout.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Crunch',
          duration: '10–12 min',
          description: 'Machine allows safe progressive overload to abs.\n ',
          battlePlan: '4 rounds\n• 8–10 Heavy Crunches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Increased resistance thickens ab structure well',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pull slow, avoid jerking pad',
              description: 'Smooth movement ensures proper muscle engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze crunch peak contraction',
              description: 'Focus on quality contraction over speed.'
            }
          ]
        },
        {
          name: 'Crunch + Leg Raise',
          duration: '12–14 min',
          description: 'Isolation combo burns abdominal wall comprehensively.\n ',
          battlePlan: '3 rounds\n• 8 Crunches\n• 10 Hanging Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Superset works upper + lower abs in one session',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl torso tight at crunch top',
              description: 'Maximize spinal flexion for upper ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Lift legs smooth, no swing',
              description: 'Controlled leg raises target lower abs effectively.'
            }
          ]
        },
        {
          name: 'Top-Half Machine Crunch Pulses',
          duration: '10–12 min',
          description: 'Partial-range crunch focused on peak contraction.',
          battlePlan: '4 rounds\n• 15 Top-Half Pulses\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Constant tension in shortened position maximizes pump',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stay in top third of motion',
              description: 'Constant tension throughout range.'
            },
            {
              icon: 'shield',
              title: 'Small, controlled pulses',
              description: 'No momentum — pure ab work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Crunch',
          duration: '12–14 min',
          description: 'Extended time under tension breaks ab plateaus.\n ',
          battlePlan: '3 rounds\n• 10 Heavy Crunches\n• Drop → 8 reps\n• Drop → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Drop weight pushes contraction beyond fatigue point',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip 15–20% fast, keep form',
              description: 'Quick weight changes maintain intensity.'
            },
            {
              icon: 'construct',
              title: 'Crunch, pause, squeeze at top',
              description: 'Maintain quality throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Iso Crunch + Flutter Kicks',
          duration: '12–14 min',
          description: 'Extended tension exercise strengthens abs endurance.\n ',
          battlePlan: '3 rounds\n• 8 Crunches + 10s Hold\n• Immediately 15 Flutter Kicks\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9jii3lwp_abs.jpg',
          intensityReason: 'Holds plus kicks exhaust abs dynamically and isometric',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold contraction top 10s',
              description: 'Sustained contraction builds incredible endurance.'
            },
            {
              icon: 'flash',
              title: 'Keep abs braced with flutter',
              description: 'Maintain core tension throughout flutter kicks.'
            }
          ]
        },
        {
          name: 'Iso-Hold Machine Crunch Ladder',
          duration: '12–14 min',
          description: 'Progressive isometric holds layered with reps.',
          battlePlan: '4 rounds\n• 8 Crunches + Hold (5s/8s/10s/12s)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/i706j2jh_abss.webp',
          intensityReason: 'Increasing hold duration compounds fatigue each round',
          moodTips: [
            {
              icon: 'timer',
              title: 'Increase hold duration each round',
              description: 'Fatigue compounds throughout workout.'
            },
            {
              icon: 'shield',
              title: 'Breathe shallow under load',
              description: 'Abs stay braced throughout hold.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Captain\'s Chair',
    icon: 'desktop',
    workouts: {
      beginner: [
        {
          name: 'Knee Raise',
          duration: '8–10 min',
          description: 'Controlled movement isolates lower ab recruitment.\n ',
          battlePlan: '3 rounds\n• 10–12 Knee Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/bvoxdf8z_download%20%2814%29.png',
          intensityReason: 'Basic raise builds lower abdominal lift strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pull knees slow to chest',
              description: 'Controlled movement maximizes muscle engagement.'
            },
            {
              icon: 'shield',
              title: 'Back pressed against pad',
              description: 'Maintain back contact for stability and safety.'
            }
          ]
        },
        {
          name: 'Straight Leg Hold',
          duration: '8–10 min',
          description: 'Lockout position burns abs for lower focus stability.\n ',
          battlePlan: '3 rounds\n• 15s Holds\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e782pm7q_download%20%2813%29.png',
          intensityReason: 'Isometric hold increases abs\' endurance demands',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold legs extended forward',
              description: 'Maintain straight leg position throughout hold.'
            },
            {
              icon: 'shield',
              title: 'Don\'t let hips shift around',
              description: 'Stable hip position maintains proper muscle activation.'
            }
          ]
        },
        {
          name: 'Alternating Knee Raises',
          duration: '8–10 min',
          description: 'Unilateral knee lifts improving control and reducing swing.',
          battlePlan: '3 rounds\n• 12 per side Alternating Knee Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/bvoxdf8z_download%20%2814%29.png',
          intensityReason: 'One knee at a time reduces momentum for better activation',
          moodTips: [
            {
              icon: 'construct',
              title: 'One knee at a time',
              description: 'Momentum reduced for better control.'
            },
            {
              icon: 'timer',
              title: 'Brief pause at top',
              description: 'Better activation with each rep.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Straight Leg Raise',
          duration: '10–12 min',
          description: 'Builds strength in lower abs with stable path control.\n ',
          battlePlan: '4 rounds\n• 8–10 Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/0ga9gll0_download%20%285%29.png',
          intensityReason: 'Full ROM raise loads abs through longer range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Lower legs slow and steady',
              description: 'Controlled eccentric maximizes muscle development.'
            },
            {
              icon: 'flash',
              title: 'Avoid swinging up quick',
              description: 'Smooth movement prevents momentum compensation.'
            }
          ]
        },
        {
          name: 'Knee Raise + Twist',
          duration: '12–14 min',
          description: 'Hits lower abs and sides in one combined superset.\n ',
          battlePlan: '3 rounds\n• 8 per side Knee Raise Twist\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/gtb4564s_download%20%284%29.png',
          intensityReason: 'Twist adds oblique rotation into lower ab raises',
          moodTips: [
            {
              icon: 'construct',
              title: 'Twist knees left, right alternate',
              description: 'Alternating rotation engages obliques effectively.'
            },
            {
              icon: 'shield',
              title: 'Keep torso steady upright',
              description: 'Stable torso isolates the twisting movement.'
            }
          ]
        },
        {
          name: 'Extended-Knee Raises (45°)',
          duration: '10–12 min',
          description: 'Partial straight-leg raises increasing lever length.',
          battlePlan: '4 rounds\n• 10 Extended-Knee Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/0ga9gll0_download%20%285%29.png',
          intensityReason: 'Stopping at 45° keeps abs loaded throughout',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stop legs at 45°',
              description: 'Abs stay loaded in this partial range.'
            },
            {
              icon: 'timer',
              title: 'Lower slow',
              description: 'Eccentric matters for strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Leg Raise',
          duration: '12–14 min',
          description: 'Dumbbell held securely between feet amplifies difficulty and muscle activation..\n ',
          battlePlan: '3 rounds\n• 8–10 Weighted Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9xx4tww6_Screenshot%202025-12-05%20at%206.17.40%E2%80%AFPM.png',
          intensityReason: 'Extra load maximizes ab contraction from raises',
          moodTips: [
            {
              icon: 'construct',
              title: 'Secure weight firm at feet',
              description: 'Proper weight placement ensures safety and control.'
            },
            {
              icon: 'flash',
              title: 'Control lowering slowly',
              description: 'Resist gravity to maximize muscle engagement.'
            }
          ]
        },
        {
          name: 'Leg Raise + Slow Eccentric',
          duration: '12–14 min',
          description: 'Builds more strength with controlled negative reps.\n ',
          battlePlan: '3 rounds\n• 8–10 Leg Raises (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pow4f7e4_download%20%2813%29.png',
          intensityReason: 'Slow eccentric multiplies ab contraction stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lift quick, lower 3s slow',
              description: 'Emphasis on eccentric builds exceptional strength.'
            },
            {
              icon: 'flash',
              title: 'Keep tension through descent',
              description: 'Maintain muscle engagement throughout lowering.'
            }
          ]
        },
        {
          name: 'L-Sit Hold (Captain\'s Chair)',
          duration: '12–14 min',
          description: 'Static compression hold demanding full core tension.',
          battlePlan: '4 rounds\n• Max L-Sit Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9xx4tww6_Screenshot%202025-12-05%20at%206.17.40%E2%80%AFPM.png',
          intensityReason: 'Legs parallel to floor demands maximum engagement',
          moodTips: [
            {
              icon: 'construct',
              title: 'Legs parallel to floor',
              description: 'Maximum engagement throughout hold.'
            },
            {
              icon: 'shield',
              title: 'Shallow breathing',
              description: 'Brace maintained throughout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Roman Hyperextension',
    icon: 'return-down-forward',
    workouts: {
      beginner: [
        {
          name: 'Bodyweight Side Bend',
          duration: '8–10 min',
          description: 'Learns lateral bending to build oblique connection.\n ',
          battlePlan: '3 rounds\n• 10 per side Side Bends\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Basic side crunch trains obliques with safe control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Move slow, don\'t swing torso',
              description: 'Controlled movement prevents injury and maximizes engagement.'
            },
            {
              icon: 'flash',
              title: 'Focus on oblique squeeze top',
              description: 'Peak contraction builds mind-muscle connection.'
            }
          ]
        },
        {
          name: 'Supported Crunch',
          duration: '8–10 min',
          description: 'Controlled entry drill targets upper ab connection.\n ',
          battlePlan: '3 rounds\n• 10–12 Supported Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Small crunch on bench works abs beginner safe',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl spine slightly forward',
              description: 'Focus on spinal flexion for proper ab engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze abs hard top rep',
              description: 'Peak contraction maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Anti-Extension Neutral Hold',
          duration: '8–10 min',
          description: 'Static trunk hold resisting spinal extension.',
          battlePlan: '3 rounds\n• 20–30s Holds\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Core stabilizes spine in anti-extension position',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace like a plank',
              description: 'Core stabilizes spine throughout hold.'
            },
            {
              icon: 'shield',
              title: 'Neck neutral',
              description: 'Alignment matters for safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Side Bend',
          duration: '10–12 min',
          description: 'Builds oblique thickness with controlled weighted reps.\n ',
          battlePlan: '4 rounds\n• 8–10 per side Weighted Bends\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Progression adds resistance for lateral growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate firm to chest',
              description: 'Secure weight placement ensures proper form.'
            },
            {
              icon: 'flash',
              title: 'Move only side to side',
              description: 'Pure lateral movement isolates obliques effectively.'
            }
          ]
        },
        {
          name: 'Oblique Twist Sit Up',
          duration: '12–14 min',
          description: 'Twisting sit up enhances rotational ab engagement.\n ',
          battlePlan: '3 rounds\n• 8 per side Twisting Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Rotating adds dynamic work for obliques strongly',
          moodTips: [
            {
              icon: 'construct',
              title: 'Rotate torso controlled',
              description: 'Smooth rotation prevents injury and maximizes engagement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze on each twist top',
              description: 'Peak contraction at each twist builds strength.'
            }
          ]
        },
        {
          name: 'Alternating Reach Extensions',
          duration: '10–12 min',
          description: 'Controlled reach adding anti-rotation demand.',
          battlePlan: '4 rounds\n• 8 per side Alternating Reaches\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Opposite arm reach engages obliques with anti-rotation',
          moodTips: [
            {
              icon: 'construct',
              title: 'Opposite arm reach',
              description: 'Obliques engage to stabilize.'
            },
            {
              icon: 'shield',
              title: 'Minimal torso shift',
              description: 'Stability wins over movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Sit Up',
          duration: '12–14 min',
          description: 'Progressive overload thickens abs via weighted and controlled sit ups.\n ',
          battlePlan: '3 rounds\n• 8–10 Weighted Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Added weight enhances muscular demand on abs',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate tight chest',
              description: 'Secure weight placement maintains proper form.'
            },
            {
              icon: 'timer',
              title: 'Squeeze abs at top pause',
              description: 'Brief pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Sit Up with 3s Hold Top',
          duration: '12–14 min',
          description: 'Hold then release makes sit up much more demanding.\n ',
          battlePlan: '3 rounds\n• 8 Sit Ups (3s hold top)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/geuifix4_download%20%288%29.png',
          intensityReason: 'Iso contraction hold increases abs endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Rise slow, pause 3s top',
              description: 'Extended hold builds incredible endurance.'
            },
            {
              icon: 'flash',
              title: 'Abs squeeze hard at hold',
              description: 'Maximum contraction during isometric phase.'
            }
          ]
        },
        {
          name: 'Weighted Anti-Rotation Hold',
          duration: '12–14 min',
          description: 'Static hold resisting rotation under load.',
          battlePlan: '4 rounds\n• 20–30s per side Weighted Holds\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/9xys14l8_download%20%289%29.png',
          intensityReason: 'Offset load fires obliques under anti-rotation demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'Weight offset to one side',
              description: 'Obliques fire to resist rotation.'
            },
            {
              icon: 'shield',
              title: 'No hip shift',
              description: 'Control the base throughout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Medicine Ball',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'MB Crunch',
          duration: '8–10 min',
          description: 'Beginner crunch builds control with small resistance.\n ',
          battlePlan: '3 rounds\n• 12 MB Crunches\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Light ball adds gentle overload to crunch pattern',
          moodTips: [
            {
              icon: 'construct',
              title: 'Ball above chest steady',
              description: 'Stable ball position maintains proper form.'
            },
            {
              icon: 'flash',
              title: 'Squeeze contraction top hard',
              description: 'Peak contraction maximizes muscle engagement.'
            }
          ]
        },
        {
          name: 'Seated MB Twist',
          duration: '8–10 min',
          description: 'Dynamic twisting strengthens side core stability.\n ',
          battlePlan: '3 rounds\n• 10 per side Twists\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Rotation works obliques with ball resistance control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Torso upright, feet up off mat',
              description: 'Proper position isolates core muscles effectively.'
            },
            {
              icon: 'flash',
              title: 'Rotate shoulders, squeeze side',
              description: 'Focus on oblique contraction with each twist.'
            }
          ]
        },
        {
          name: 'MB Dead Bug Press',
          duration: '8–10 min',
          description: 'Dead bug variation adding anterior load.',
          battlePlan: '3 rounds\n• 10 per side MB Dead Bugs\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Pressing ball upward increases core engagement',
          moodTips: [
            {
              icon: 'construct',
              title: 'Press ball upward',
              description: 'Core engagement increases with press.'
            },
            {
              icon: 'timer',
              title: 'Slow limb movement',
              description: 'Stability first, speed later.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'MB Overhead Sit Up',
          duration: '10–12 min',
          description: 'Long lever increases core demand and stretch tension.\n ',
          battlePlan: '4 rounds\n• 8–10 MB Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Lever arm extended overhead intensifies abs load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Arms straight, no bending',
              description: 'Maintain extended lever throughout movement.'
            },
            {
              icon: 'flash',
              title: 'Squeeze top contraction tight',
              description: 'Peak contraction overcomes longer lever arm.'
            }
          ]
        },
        {
          name: 'MB Slam + Plank Hold',
          duration: '12–14 min',
          description: 'Dynamic then static pairing builds full capacity.\n ',
          battlePlan: '3 rounds\n• 8 MB Slams\n• 25s Plank Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Explosive slam pairs with core static endurance',
          moodTips: [
            {
              icon: 'flash',
              title: 'Slam ball with abs not arms',
              description: 'Core-driven slam maximizes ab engagement.'
            },
            {
              icon: 'shield',
              title: 'Keep hips level plank',
              description: 'Perfect plank form after dynamic movement.'
            }
          ]
        },
        {
          name: 'MB Sit-Up to Press-Out',
          duration: '10–12 min',
          description: 'Sit-up finishing with press to extend tension.',
          battlePlan: '4 rounds\n• 10 MB Sit-Up Press-Outs\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Pressing ball at top keeps abs active longer',
          moodTips: [
            {
              icon: 'construct',
              title: 'Press ball at top',
              description: 'Abs stay active through press.'
            },
            {
              icon: 'timer',
              title: 'Control both phases',
              description: 'No momentum allowed.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'MB V Sit Twist',
          duration: '12–14 min',
          description: 'Heavy core load combining balance and twist with med ball.\n ',
          battlePlan: '3 rounds\n• 10 per side V Twists\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Rotational V sit fires obliques under high stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Chest tall, core braced firm',
              description: 'Maintain posture throughout challenging movement.'
            },
            {
              icon: 'flash',
              title: 'Rotate slow, abs squeezed',
              description: 'Controlled rotation with constant core tension.'
            }
          ]
        },
        {
          name: 'MB Slam + Toe Touch Finisher',
          duration: '12–14 min',
          description: 'Brutal pairing challenges power and contraction.\n ',
          battlePlan: '3 rounds\n• 8 MB Slams\n• 10 MB Toe Touches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Targets entire abs with slam then toe reach combo',
          moodTips: [
            {
              icon: 'flash',
              title: 'Slam strong with abs engaged',
              description: 'Core-driven power movement builds explosive strength.'
            },
            {
              icon: 'construct',
              title: 'Strive to touch toes top',
              description: 'Full range toe touch maximizes ab contraction.'
            }
          ]
        },
        {
          name: 'MB Overhead Hold Flutter Kicks',
          duration: '12–14 min',
          description: 'Long-lever flutter kicks under overhead load.',
          battlePlan: '4 rounds\n• 20 Flutter Kicks (MB overhead)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Arms locked overhead maximizes lever and core demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'Arms locked overhead',
              description: 'Lever maximized for extreme challenge.'
            },
            {
              icon: 'flash',
              title: 'Small fast kicks',
              description: 'Abs stay braced throughout.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Decline Bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Decline Sit Up (Bodyweight)',
          duration: '8–10 min',
          description: 'Bodyweight baseline drill builds control and strength.\n ',
          battlePlan: '3 rounds\n• 10–12 Decline Sit Ups\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Decline angle increases core range and challenge',
          moodTips: [
            {
              icon: 'construct',
              title: 'Curl torso slowly up',
              description: 'Controlled movement maximizes muscle engagement.'
            },
            {
              icon: 'flash',
              title: 'Hard squeeze at top rep',
              description: 'Peak contraction maximizes ab activation.'
            }
          ]
        },
        {
          name: 'Decline Crunch',
          duration: '8–10 min',
          description: 'Works midline without excessive torso movement.\n ',
          battlePlan: '3 rounds\n• 12–15 Decline Crunches\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Short ROM targets abs intensely with safety and lower tension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Small crunch only, spine curl',
              description: 'Focus on spinal flexion for targeted ab work.'
            },
            {
              icon: 'flash',
              title: 'Exhale squeeze contraction',
              description: 'Coordinate breathing for maximum muscle activation.'
            }
          ]
        },
        {
          name: 'Decline Heel Slides',
          duration: '8–10 min',
          description: 'Controlled lower-ab movement minimizing hip flexor dominance.',
          battlePlan: '3 rounds\n• 12 per side Heel Slides\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Posterior pelvic tilt ensures lower abs fire',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slide heels slowly',
              description: 'Abs stay engaged throughout.'
            },
            {
              icon: 'construct',
              title: 'Posterior pelvic tilt',
              description: 'Lower abs fire properly.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Sit Up',
          duration: '10–12 min',
          description: 'Strengthens core wall with consistent loaded work.\n ',
          battlePlan: '4 rounds\n• 8 Sit Ups w/ Plate\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Holding plate increases progressive overload stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate close chest',
              description: 'Secure weight placement maintains proper form.'
            },
            {
              icon: 'timer',
              title: 'Pause squeeze contraction',
              description: 'Brief hold at peak maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Twisting Sit Up',
          duration: '12–14 min',
          description: 'Full abs trained with twist motion superset strategy.\n ',
          battlePlan: '3 rounds\n• 8 per side Twisting Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Rotational sit up engages obliques + rectus combo',
          moodTips: [
            {
              icon: 'construct',
              title: 'Rotate elbow toward knee',
              description: 'Twisting motion engages obliques effectively.'
            },
            {
              icon: 'flash',
              title: 'Core tight, control twist',
              description: 'Maintain core tension throughout rotation.'
            }
          ]
        },
        {
          name: 'Arms-Overhead Decline Sit-Ups',
          duration: '10–12 min',
          description: 'Long-lever sit-up increasing difficulty without weight.',
          battlePlan: '4 rounds\n• 10 Arms-Overhead Sit-Ups\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Arms straight overhead increases lever and load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Arms stay straight',
              description: 'Lever increases load on abs.'
            },
            {
              icon: 'timer',
              title: 'Control descent',
              description: 'Tension maintained throughout.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '1½ Rep Sit Up',
          duration: '12–14 min',
          description: 'Time under tension drill builds durability fully while adding strength.\n ',
          battlePlan: '3 rounds\n• 8 Combo Reps (half+full =1)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Combo half+full doubles ab contraction under load',
          moodTips: [
            {
              icon: 'construct',
              title: 'Perform half then full smoothly',
              description: 'Continuous movement maintains muscle tension.'
            },
            {
              icon: 'flash',
              title: 'Squeeze hard both times',
              description: 'Dual contractions maximize muscle engagement.'
            }
          ]
        },
        {
          name: 'Decline Sit Up + Flutter Kicks',
          duration: '12–14 min',
          description: 'Powerful finisher blends flexion and endurance set.\n ',
          battlePlan: '3 rounds\n• 8 Decline Sit Ups\n• Immediately 15 Flutter Kicks\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Sit ups paired with flutter kicks torch abs fully',
          moodTips: [
            {
              icon: 'flash',
              title: 'Abs tight during sit ups',
              description: 'Maintain core engagement throughout movement.'
            },
            {
              icon: 'construct',
              title: 'Kick legs steady below bench',
              description: 'Controlled flutter kicks maintain constant tension.'
            }
          ]
        },
        {
          name: 'Weighted Decline Sit Up',
          duration: '12–14 min',
          description: 'Weighted movement builds advanced ab strength capacity.\n ',
          battlePlan: '3 rounds\n• 8–10 Weighted Sit Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/azdoubte_download%20%286%29.png',
          intensityReason: 'Weight adds progressive ab load challenge',
          moodTips: [
            {
              icon: 'shield',
              title: 'Hug weight at chest',
              description: 'Proper weight position prevents injury.'
            },
            {
              icon: 'flash',
              title: 'Squeeze hard both times',
              description: 'Maximum contraction on way up and down.'
            }
          ]
        },
        {
          name: 'Offset Load Decline Sit-Ups',
          duration: '12–14 min',
          description: 'Anti-rotation sit-ups using unbalanced loading.',
          battlePlan: '4 rounds\n• 8 per side Offset Sit-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_sweat-weights-images/artifacts/lwwxsgl0_download%20%287%29.png',
          intensityReason: 'Weight to one side forces core to resist twist',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold weight to one side',
              description: 'Core resists twist throughout.'
            },
            {
              icon: 'flash',
              title: 'Alternate sides',
              description: 'Balanced development for both sides.'
            }
          ]
        }
      ]
    }
  }
];
