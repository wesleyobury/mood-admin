import { EquipmentWorkouts } from '../types/workout';

export const backWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'fitness-outline',
    workouts: {
      beginner: [
        {
          name: 'DB Row + Rear Fly',
          duration: '12–14 min',
          description: 'Rows for pulling power and rear flies for stability',
          battlePlan: '3 rounds\n• 10 Single-Arm Dumbbell Row (each side, supported on bench)\nRest 60s after each side\n• 10 Prone Rear Delt Fly (lying face down)\nRest 60s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Targets lats + rear delts with simple supported lifts',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep bench as chest support, avoid over-arching.',
              description: 'Proper bench support isolates target muscles and protects spine.'
            },
            {
              icon: 'timer',
              title: 'Move light on rear flies; control beats swinging.',
              description: 'Controlled tempo maximizes rear delt activation over momentum.'
            }
          ]
        },
        {
          name: 'Y-T Row Flow',
          duration: '12–14 min',
          description: 'Rows with Y + T raises for posture and shoulder health',
          battlePlan: '3 rounds\n• 10 Single-Arm Row (each side)\n• 10 Incline Prone Y-Raise\n• 10 Incline Prone T-Raise\nRest 75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/928yql53_download%20%2822%29.png',
          intensityReason: 'Basic scapular + rear delt balance with angles',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Slow and deliberate Y/T raises, not weight-focused.',
              description: 'Movement quality over load for postural muscle activation.'
            },
            {
              icon: 'construct',
              title: 'Keep forehead against pad for no neck strain.',
              description: 'Pad contact maintains neutral neck alignment throughout movement.'
            }
          ]
        },
        {
          name: 'Supported One-Arm Rows',
          duration: '12–14 min',
          description: 'Bench-supported rows to learn clean pulling mechanics',
          battlePlan: '3 rounds\n• 10 Single-Arm DB Rows (each side)\nRest 60s per side',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Supported setup teaches proper mechanics',
          moodTips: [
            {
              icon: 'construct',
              title: 'Support removes cheating',
              description: 'Knee and hand on bench keep spine neutral.'
            },
            {
              icon: 'flash',
              title: 'Pull with the elbow',
              description: 'Elbow drives past ribs, not dumbbell toward shoulder.'
            },
            {
              icon: 'body',
              title: 'Feel the lat stretch',
              description: 'Let shoulder protract slightly at the bottom.'
            }
          ]
        },
        {
          name: 'Chest-Supported Dumbbell Rows',
          duration: '12–14 min',
          description: 'Prone rows emphasizing mid-back control',
          battlePlan: '3 rounds\n• 12 Chest-Supported DB Rows\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/928yql53_download%20%2822%29.png',
          intensityReason: 'Chest support isolates mid-back muscles',
          moodTips: [
            {
              icon: 'construct',
              title: 'Chest stays glued',
              description: 'No torso lift or momentum.'
            },
            {
              icon: 'timer',
              title: 'Pause at the squeeze',
              description: '1–2s hold reinforces contraction.'
            },
            {
              icon: 'flash',
              title: 'Think shoulder blades first',
              description: 'Arms follow scapular movement.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Chest-Support Row',
          duration: '14–16 min',
          description: 'Supported rows and flies promote strict contraction',
          battlePlan: '4 rounds\n• 8 Chest-Supported Dumbbell Row\nRest 75–90s\n• 10 Incline Prone Reverse Fly\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Neutral spine from support isolates lats + traps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Don\'t yank dumbbells—steady elbows driving back.',
              description: 'Controlled elbow drive maximizes lat activation over momentum.'
            },
            {
              icon: 'timer',
              title: 'Go light on reverse fly, pause 1s at top.',
              description: 'Peak contraction pause enhances rear delt development.'
            }
          ]
        },
        {
          name: 'W-Rear Flow',
          duration: '14–16 min',
          description: 'Rows, W-raises, and flys refine mid-back strength',
          battlePlan: '3 rounds\n• 8 Single-Arm Row (each side)\n• 8 Incline Prone W-Raise\n• 8 Incline Prone Reverse Fly\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k5agvaci_download%20%2823%29.png',
          intensityReason: 'W-raises + flys emphasize scapular control within a circuit',
          moodTips: [
            {
              icon: 'flash',
              title: 'In W-raise, squeeze shoulder blades hard.',
              description: 'Maximum scapular retraction activates mid-traps effectively.'
            },
            {
              icon: 'construct',
              title: 'Keep reps slow, avoid shrugging shoulders.',
              description: 'Controlled tempo with depressed shoulders isolates target muscles.'
            }
          ]
        },
        {
          name: 'Paused Dumbbell Rows',
          duration: '14–16 min',
          description: 'One-arm rows with extended peak contraction',
          battlePlan: '4 rounds\n• 8 DB Rows (2s pause, each side)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Paused reps maximize peak contraction time',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause every rep',
              description: 'Hold 2s at the top.'
            },
            {
              icon: 'construct',
              title: 'No torso rotation',
              description: 'Hips and shoulders stay square.'
            },
            {
              icon: 'flash',
              title: 'Peak form feels tight',
              description: 'Lat and mid-back should cramp slightly.'
            }
          ]
        },
        {
          name: 'Dumbbell Row Drop Set',
          duration: '14–16 min',
          description: 'Heavy rows extended using fast weight drops',
          battlePlan: '3 rounds\n• 8 DB Rows\n• Drop → 8\n• Drop → 8\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k5agvaci_download%20%2823%29.png',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'Reduce weight fast, no rest.'
            },
            {
              icon: 'construct',
              title: 'Drop size stays clean',
              description: '~20–30% each drop.'
            },
            {
              icon: 'body',
              title: 'Straps are allowed',
              description: 'Grip shouldn\'t cap back overload.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '3-Way Pull Row',
          duration: '16–18 min',
          description: 'Supported row, reverse fly, and single-arm grind',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\nRest 90s\n• 8 Incline Prone Reverse Fly\nRest 90s\n• 8 Single-Arm Row (each side)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Multiple row/rear delt moves for depth of fatigue',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stay strict: upper body still, arms pulling only.',
              description: 'Isolated arm movement maximizes target muscle activation.'
            },
            {
              icon: 'flash',
              title: 'Neutral spine always, no jerking.',
              description: 'Consistent spinal alignment prevents compensation patterns.'
            }
          ]
        },
        {
          name: 'Y-T Row Blast',
          duration: '18–20 min',
          description: 'Rows plus Y/T raises for balanced shoulder growth',
          battlePlan: '4 rounds\n• 8 Chest-Supported Row\n• 8 Incline Prone Y-Raise\n• 8 Incline Prone T-Raise\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/e00z2xt6_download%20%281%29.png',
          intensityReason: 'Multi-angle raises + row overload scapular support',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Limit load on Y/T—goal is posture, not strain.',
              description: 'Light loads with perfect form for postural muscle development.'
            },
            {
              icon: 'timer',
              title: 'Breathe steady during high fatigue at end.',
              description: 'Controlled breathing maintains performance through fatigue.'
            }
          ]
        },
        {
          name: 'Heavy Dumbbell Rows',
          duration: '16–18 min',
          description: 'Heavy unilateral rows for maximal lat loading',
          battlePlan: '4 rounds\n• 6 Heavy DB Rows (each side)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png',
          intensityReason: 'Heavy loads maximize strength development',
          moodTips: [
            {
              icon: 'construct',
              title: 'Load stays strict',
              description: 'Reduce weight if torso twists.'
            },
            {
              icon: 'flash',
              title: 'Explode then control',
              description: 'Fast pull, slow return.'
            },
            {
              icon: 'body',
              title: 'Straps encouraged',
              description: 'Let lats fail before grip.'
            }
          ]
        },
        {
          name: 'Triple Drop Dumbbell Rows',
          duration: '18–20 min',
          description: 'Extended drop sets to fully exhaust back',
          battlePlan: '3 rounds\n• 6 Rows\n• Drop → 6\n• Drop → 6\n• Drop → 6\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/e00z2xt6_download%20%281%29.png',
          intensityReason: 'Triple drops maximize muscle fatigue and pump',
          moodTips: [
            {
              icon: 'flash',
              title: 'Three fast drops',
              description: 'No rest between reductions.'
            },
            {
              icon: 'construct',
              title: 'Same pull pattern',
              description: 'Elbow path stays identical.'
            },
            {
              icon: 'body',
              title: 'Chase deep lat pump',
              description: 'Under-armpit burn is the goal.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift',
          duration: '14–16 min',
          description: 'Rows and deadlifts develop base power and muscle control.',
          battlePlan: '3 rounds:\n• 10 Barbell Bent-Over Row\nRest 60–75s after each set\n• 10 Barbell Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/kzlwio26_BB%20deadlift.mov',
          intensityReason: 'Builds foundational back strength with compound lifts.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, hinge hips, maintain flat back',
              description: 'Proper spine alignment protects back on all lifts.'
            },
            {
              icon: 'flash',
              title: 'Tight lats protect spine',
              description: 'Lat engagement improves pulling strength and safety.'
            }
          ]
        },
        {
          name: 'Row Flow Combo',
          duration: '12–14 min',
          description: 'Combines row grips and good mornings for total back work.',
          battlePlan: '3 rounds:\n• 10 Bent-Over Row\n• 10 Underhand Grip Row\n• 10 Barbell Good Morning\nRest 60–75s after completing the full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/8q41tii0_download%20%281%29.png',
          intensityReason: 'Varied grip rowing boosts muscular activation volume.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition smoothly between grips',
              description: 'Don\'t rush form between grip changes for better activation.'
            },
            {
              icon: 'body',
              title: 'Drive hips back, spine neutral',
              description: 'Proper hip hinge pattern during good mornings.'
            }
          ]
        },
        {
          name: 'Tempo Bent-Over Rows',
          duration: '12–14 min',
          description: 'Controlled barbell rows emphasizing strict tempo',
          battlePlan: '3 rounds\n• 10 Bent-Over Rows (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          intensityReason: 'Tempo work builds control and strength foundation',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace before pulling',
              description: 'Lock core to protect spine.'
            },
            {
              icon: 'timer',
              title: 'Lower slow and steady',
              description: '3s eccentric each rep.'
            },
            {
              icon: 'body',
              title: 'Back stays flat',
              description: 'Think proud chest, neutral neck.'
            }
          ]
        },
        {
          name: 'Pause Rows',
          duration: '12–14 min',
          description: 'Barbell rows with pauses at contraction',
          battlePlan: '3 rounds\n• 8 Paused Bent-Over Rows\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/8q41tii0_download%20%281%29.png',
          intensityReason: 'Paused reps reinforce form and peak contraction',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause every rep',
              description: 'Hold bar against torso for 2s.'
            },
            {
              icon: 'construct',
              title: 'Reset between reps',
              description: 'Dead stop removes momentum.'
            },
            {
              icon: 'flash',
              title: 'Feel mid-back squeeze',
              description: 'Not arms, not hips.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Pendlay + RDL',
          duration: '16–18 min',
          description: 'Pendlay rows and RDLs balance power with hamstring load.',
          battlePlan: '4 rounds:\n• 8 Pendlay Row\nRest 75–90s after each set\n• 10 Romanian Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/5s4czjs3_download%20%283%29.png',
          intensityReason: 'Explosive pulls and slow RDLs strengthen full posterior.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset back tightness between Pendlay reps',
              description: 'Dead stop allows full lat engagement each rep.'
            },
            {
              icon: 'timer',
              title: 'Lower bar under control',
              description: 'Control eccentric to fully stretch hamstrings.'
            }
          ]
        },
        {
          name: 'Row Shrug Flow',
          duration: '16–18 min',
          description: 'Multi-grip rows, shrugs, deads build traps and mid-back.',
          battlePlan: '3 rounds:\n• 8 Bent-Over Row\n• 8 Reverse-Grip Row\n• 8 Barbell Shrugs\n• 8 Deadlift\nRest 90s after finishing the full circuit',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/a5y4znby_download%20%282%29.png',
          intensityReason: 'Combo of rows, shrugs, and deads creates dense fatigue.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Squeeze shrugs hard for one second',
              description: 'Peak contraction at top maximizes trap activation.'
            },
            {
              icon: 'construct',
              title: 'Stabilize posture before transitioning',
              description: 'Reset form between exercises for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Barbell Row Drop Set',
          duration: '16–18 min',
          description: 'Heavy rows extended using plate reductions',
          battlePlan: '3 rounds\n• 6 Rows\n• Drop → 6\n• Drop → 6\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/5s4czjs3_download%20%283%29.png',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are fast',
              description: 'Strip plates immediately.'
            },
            {
              icon: 'construct',
              title: 'Moderate drops work best',
              description: '~20% per reduction.'
            },
            {
              icon: 'body',
              title: 'Straps are allowed',
              description: 'Grip shouldn\'t limit back loading.'
            }
          ]
        },
        {
          name: 'Iso-Finish Rows',
          duration: '16–18 min',
          description: 'Rows finished with static bar holds',
          battlePlan: '4 rounds\n• 8 Rows\n• Finish with 10s hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/a5y4znby_download%20%282%29.png',
          intensityReason: 'Isometric finisher maximizes time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold at the top',
              description: '10s contraction after last rep.'
            },
            {
              icon: 'construct',
              title: 'No torso lift',
              description: 'Stay hinged, chest stable.'
            },
            {
              icon: 'flash',
              title: 'Peak form feels crushing',
              description: 'Upper-back squeeze dominates.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Barbell',
          duration: '20–22 min',
          description: 'Rows, deads, shrugs overload traps and spinal erectors.',
          battlePlan: '4 rounds:\n• 8 Barbell Bent-Over Row\nRest 90–120s after each set\n• 8 Barbell Deadlift\nRest 90–120s after each set\n• 8 Barbell Shrug\nRest 90–120s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          intensityReason: 'Higher volume heavy lifts establish raw size and mass.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control eccentric for time under tension',
              description: 'Slow lowering phase builds strength and muscle mass.'
            },
            {
              icon: 'trending-up',
              title: 'Drive hips and traps through lockouts',
              description: 'Complete range of motion for maximum development.'
            }
          ]
        },
        {
          name: 'Power Complex',
          duration: '20–22 min',
          description: 'Row, high pull, and clean complex maximizes back output.',
          battlePlan: '4 rounds:\n• 8 Barbell Row\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after completing the full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/hnesh89k_download.png',
          intensityReason: 'Explosive high pulls and cleans target power capacity.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep elbows leading bar path',
              description: 'Proper elbow position in high pulls for maximum power.'
            },
            {
              icon: 'flash',
              title: 'Explode hips to drive bar fast',
              description: 'Hip drive generates power for explosive cleans.'
            }
          ]
        },
        {
          name: 'Heavy Tempo Rows',
          duration: '18–20 min',
          description: 'Heavy barbell rows with long controlled eccentrics',
          battlePlan: '4 rounds\n• 6 Rows (5s eccentric)\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png',
          intensityReason: 'Extended eccentrics maximize strength and hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Weight stays clean',
              description: 'Reduce load if tempo breaks.'
            },
            {
              icon: 'timer',
              title: 'Explode up, crawl down',
              description: '4–5s eccentric.'
            },
            {
              icon: 'body',
              title: 'Straps protect output',
              description: 'Let back, not grip, fail.'
            }
          ]
        },
        {
          name: 'Row Mechanical Drop',
          duration: '20–22 min',
          description: 'Grip-width changes to extend heavy sets',
          battlePlan: '3 rounds\n• 6 Wide-Grip Rows\n• Immediately 6 Standard Rows\n• Immediately 6 Underhand Rows\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/hnesh89k_download.png',
          intensityReason: 'Mechanical drops maximize volume and muscle fatigue',
          moodTips: [
            {
              icon: 'flash',
              title: 'Grip narrows as fatigue rises',
              description: 'Mechanical advantage keeps reps moving.'
            },
            {
              icon: 'construct',
              title: 'Same bar, no reset',
              description: 'Continuous tension.'
            },
            {
              icon: 'body',
              title: 'Chase lat density',
              description: 'You should feel deep thickness building.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle bells',
    icon: 'cafe-outline',
    workouts: {
      beginner: [
        {
          name: 'Row & Deadlift KB',
          duration: '12–14 min',
          description: 'Rows and deadlifts with kettlebells build back base',
          battlePlan: '3 rounds\n• 10 Single-Arm KB Row (each side)\nRest 60–75s after each set\n• 10 KB Deadlift\nRest 60–75s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s9jbh6k2_download%20%286%29.png',
          intensityReason: 'Simple pull + hinge strengthen grip and core and with modest intensity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep bell close to shins during deadlifts.',
              description: 'Proper bell placement protects back and maximizes posterior activation.'
            },
            {
              icon: 'flash',
              title: 'Drive elbows back, not out, when rowing.',
              description: 'Proper elbow path targets lats more effectively than rear delts.'
            }
          ]
        },
        {
          name: 'Row Swing Flow',
          duration: '14–15 min',
          description: 'Grip and back strength with flow style movements',
          battlePlan: '3 rounds\n• 10 KB Single-Arm Row (each side)\n• 10 KB Suitcase Deadlift (each side)\n• 10 KB Swing\nRest 60–75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s1nbakqw_download%20%287%29.png',
          intensityReason: 'Combines rows, deadlifts, swings for endurance',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Snap hips for swings, don\'t squat them.',
              description: 'Hip hinge pattern generates power and protects lower back.'
            },
            {
              icon: 'body',
              title: 'Keep chest high in suitcase deadlift.',
              description: 'Maintain proud chest to avoid rounding and target glutes properly.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Double Row + Suitcase',
          duration: '16–18 min',
          description: 'Double rows with suitcase pulls train grip/core',
          battlePlan: '4 rounds\n• 8 Double KB Row\nRest 75–90s after each set\n• 10 KB Suitcase Deadlift\nRest 75–90s after each set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e9kn8lqs_download%20%285%29.png',
          intensityReason: 'Heavier bilateral pulls build lats and posture within a circuit format',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Chest parallel to floor for full activation.',
              description: 'Proper rowing angle maximizes lat stretch and contraction range.'
            },
            {
              icon: 'flash',
              title: 'Suitcase pulls = anti-tilt stability focus.',
              description: 'Resist lateral flexion to build core strength and stability.'
            }
          ]
        },
        {
          name: 'Gorilla Row Flow',
          duration: '16–18 min',
          description: 'Renegade, gorilla, high pulls for dense volume',
          battlePlan: '3 rounds\n• 8 Renegade Row (each side)\n• 8 Gorilla Row (each side)\n• 8 KB High Pull (each side)\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/e9kn8lqs_download%20%285%29.png',
          intensityReason: 'Combo flow hits lats, core, and traps together',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core during renegade rows to stop hip twist.',
              description: 'Maintain plank position to maximize core engagement and stability.'
            },
            {
              icon: 'trending-up',
              title: 'Pull elbows high and wide in KB high pulls.',
              description: 'High elbow position targets upper traps and rear delts effectively.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Row Swing Dead',
          duration: '18–20 min',
          description: 'Balanced rotational pulls and hip hinge strength',
          battlePlan: '4 rounds\n• 8 Single-Arm Row (each side)\nRest 90s after set\n• 8 KB Swing\nRest 90s after set\n• 8 KB Deadlift\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/s9jbh6k2_download%20%286%29.png',
          intensityReason: 'Loaded volume builds strength and conditioning',
          moodTips: [
            {
              icon: 'flash',
              title: 'Stay explosive in swings.',
              description: 'Maintain power output throughout sets for maximum posterior development.'
            },
            {
              icon: 'construct',
              title: 'Row with control, don\'t twist torso.',
              description: 'Keep spine stable to isolate lats and prevent compensatory movement.'
            }
          ]
        },
        {
          name: 'Snatch Clean Flow',
          duration: '20–22 min',
          description: 'Combo snatch, renegade, clean flow builds power',
          battlePlan: '4 rounds\n• 8 Renegade Row (alternating sides)\n• 8 KB Snatch (each side)\n• 8 KB Clean and Pull\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qcfdfm3u_download%20%284%29.png',
          intensityReason: 'Explosive circuit of pulls, cleans, and snatches',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Punch bell overhead on snatch to reduce impact.',
              description: 'Active lockout reduces joint stress and improves control.'
            },
            {
              icon: 'flash',
              title: 'Keep spine solid in cleans, power from hips.',
              description: 'Hip drive generates force while spine stability protects back.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Roman chair',
    icon: 'analytics-outline',
    workouts: {
      beginner: [
        {
          name: 'Extensions + Hold',
          duration: '10–12 min',
          description: 'Bodyweight extensions paired with short static holds',
          battlePlan: '3 rounds\n• 12 Back Extensions\nRest 45–60s\n• 2 Roman Chair Holds (20s each)\nRest 60s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Introduces endurance and stability to lower back',
          moodTips: [
            {
              icon: 'body',
              title: 'Engage glutes/hamstrings to spare low back strain.',
              description: 'Posterior chain activation protects lumbar spine during extensions.'
            },
            {
              icon: 'construct',
              title: 'Keep chin tucked to maintain neutral posture.',
              description: 'Neutral neck alignment prevents cervical hyperextension.'
            }
          ]
        },
        {
          name: 'Twist & Hold Flow',
          duration: '12–14 min',
          description: 'Extension, twist, and short hold combo for endurance',
          battlePlan: '3 rounds\n• 10 Back Extensions\n• 10 Side-to-Side Twists (at top of extension)\n• 1 Roman Chair Hold (30s)\nRest 60–75s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Adds light rotation and isometrics for core demands',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Turn from ribs, not shoulders, during twists.',
              description: 'Ribcage initiation creates safer rotational movement pattern.'
            },
            {
              icon: 'timer',
              title: 'Breathe steady during holds, don\'t "crank."',
              description: 'Controlled breathing maintains position without excessive strain.'
            }
          ]
        },
        {
          name: 'Tempo Extensions',
          duration: '10–12 min',
          description: 'Slow tempo extensions emphasizing controlled spinal motion',
          battlePlan: '3 rounds\n• 10 Back Extensions (3s eccentric)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Controlled tempo builds strength without excessive load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Own the eccentric',
              description: 'Lower for a full 3 seconds every rep.'
            },
            {
              icon: 'construct',
              title: 'Stay in tension',
              description: 'Stop just before full lockout to keep load on the back.'
            },
            {
              icon: 'body',
              title: 'Drive with glutes',
              description: 'Feel glutes/hamstrings initiate so low back doesn\'t take over.'
            }
          ]
        },
        {
          name: 'Partial Extension Burn',
          duration: '10–12 min',
          description: 'Short-range extensions to build endurance safely',
          battlePlan: '3 rounds\n• 20 Partial Back Extensions\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Partial range builds endurance without overextension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Top-half only',
              description: 'Work the upper half where you can stay strict.'
            },
            {
              icon: 'flash',
              title: 'No momentum',
              description: 'Smooth continuous reps instead of swinging.'
            },
            {
              icon: 'body',
              title: 'Feel erectors working',
              description: 'You should feel a tight "brace" through low back, not a hinge snap.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Ext',
          duration: '14–16 min',
          description: 'Weighted extensions and basic hyperextensions for mass',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 75s after set\n• 10 Roman Chair Hyperextensions\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'External load strengthens spinal erectors safely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hug plate close to stomach/chest.',
              description: 'Keeping weight close maintains balance and control during movement.'
            },
            {
              icon: 'timer',
              title: 'Lower slowly, 2–3s, for stronger gains.',
              description: 'Controlled eccentric phase maximizes strength development.'
            }
          ]
        },
        {
          name: 'Extension Circuit',
          duration: '14–16 min',
          description: 'Blends extension, superman, side bends for variety',
          battlePlan: '3 rounds\n• 8 Back Extensions\n• 8 Alternating Superman (1 arm + opposite leg)\n• 8 Side Bends (each side)\nRest 90s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Mix of dynamic posterior moves challenges control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Lift opposite arm/leg smoothly in superman.',
              description: 'Coordinated contralateral movement improves stability and strength.'
            },
            {
              icon: 'flash',
              title: 'Don\'t rush side bends; full ROM and squeeze.',
              description: 'Complete range of motion with peak contraction maximizes benefits.'
            }
          ]
        },
        {
          name: 'Pause Extensions',
          duration: '14–16 min',
          description: 'Paused reps reinforce control and mid-range strength',
          battlePlan: '4 rounds\n• 8 Back Extensions (2s pause)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Paused reps eliminate momentum and build control',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at peak',
              description: 'Hold 2 seconds at the top of every rep.'
            },
            {
              icon: 'construct',
              title: 'Brace before lowering',
              description: 'Lock ribs down so spine stays neutral.'
            },
            {
              icon: 'body',
              title: 'Peak form looks flat',
              description: 'Torso reaches parallel with glutes tight, no overextension.'
            }
          ]
        },
        {
          name: 'Extension Drop Set',
          duration: '14–16 min',
          description: 'Mechanical fatigue using fast load reductions',
          battlePlan: '3 rounds\n• 8 Weighted Extensions\n• Drop → 8 reps\n• Drop → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Drop sets extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'Reduce weight fast without leaving the station.'
            },
            {
              icon: 'construct',
              title: 'Drop amount stays clean',
              description: 'Aim ~25% reduction each drop to keep reps smooth.'
            },
            {
              icon: 'timer',
              title: 'Keep ROM identical',
              description: 'Same depth and same top position through all drops.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Twist',
          duration: '16–18 min',
          description: 'Weighted extensions with twist patterns for obliques',
          battlePlan: '4 rounds\n• 10 Weighted Back Extensions\nRest 90s after set\n• 10 Roman Chair Hyperextensions\nRest 90s after set\n• 10 Roman Chair Twists\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Adds load and rotation for advanced spinal strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep ribcage engaged, don\'t torque spine.',
              description: 'Core stability prevents excessive spinal rotation under load.'
            },
            {
              icon: 'flash',
              title: 'Brace core before rotating under load.',
              description: 'Pre-bracing creates safe foundation for rotational movements.'
            }
          ]
        },
        {
          name: 'Superman + Iso Hold',
          duration: '18–20 min',
          description: 'Superman lifts plus holds improve stability capacity',
          battlePlan: '4 rounds\n• 8 Weighted Back Extensions\n• 8 Alternating Supermans\n• 1 Roman Chair Hold (20–30s)\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Extended isometrics + dynamic raises build max control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep limbs only slightly above parallel, not over-extended.',
              description: 'Moderate range prevents hyperextension while maintaining effectiveness.'
            },
            {
              icon: 'timer',
              title: 'Squeeze glutes during 20s hold to protect spine.',
              description: 'Glute activation provides spinal stability during isometric holds.'
            }
          ]
        },
        {
          name: 'Heavy Eccentric Extensions',
          duration: '18–20 min',
          description: 'Overloaded eccentrics to build posterior strength',
          battlePlan: '4 rounds\n• 6 Weighted Extensions (4s eccentric)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/8tyq8yxs_download%20%2810%29.png',
          intensityReason: 'Extended eccentrics maximize strength development',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slower than you lift',
              description: 'Lift controlled, lower for 4 seconds.'
            },
            {
              icon: 'construct',
              title: 'Cut sets before breakdown',
              description: 'If tempo slips or hips snap, end the set.'
            },
            {
              icon: 'flash',
              title: 'Chase tension, not ego',
              description: 'Use straps/assistance if needed so back stays the limiter.'
            }
          ]
        },
        {
          name: 'Extension Iso Burnout',
          duration: '18–20 min',
          description: 'Dynamic reps finished with a long isometric hold',
          battlePlan: '3 rounds\n• 10 Weighted Extensions\n• Immediately 30s Roman Chair Hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/uud5nxsk_download%20%2811%29.png',
          intensityReason: 'Combines dynamic movement with isometric endurance',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold in neutral',
              description: 'Lock torso near parallel without overextending.'
            },
            {
              icon: 'body',
              title: 'Squeeze glutes hard',
              description: 'Protects spine and stabilizes the hold.'
            },
            {
              icon: 'flash',
              title: 'Peak contraction is rigid',
              description: 'You should feel full-body bracing with zero swinging.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'T bar row machine',
    icon: 'add-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Grip Row',
          duration: '10–12 min',
          description: 'Simple neutral rowing pattern for beginners to build back thickness.',
          battlePlan: '3 rounds\n• 12 Neutral Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Neutral grip builds confidence & lat line strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest against pad, no hip driving.',
              description: 'Chest support isolates lats and prevents momentum cheating.'
            },
            {
              icon: 'flash',
              title: 'Pull elbows straight back, not out.',
              description: 'Proper elbow path targets lats more effectively than rear delts.'
            }
          ]
        },
        {
          name: 'Wide Grip Row',
          duration: '10–12 min',
          description: 'Wide row variation for upper-back foundation',
          battlePlan: '3 rounds\n• 10 Wide Grip T-Bar Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Wide grip shifts load to traps/rhomboids for posture',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull chest high into pad during contraction.',
              description: 'Active chest engagement maximizes upper back activation.'
            },
            {
              icon: 'body',
              title: 'Avoid shrugging shoulders during pull.',
              description: 'Keep shoulders down and back to isolate target muscles.'
            }
          ]
        },
        {
          name: 'Tempo T-Bar Rows',
          duration: '10–12 min',
          description: 'Controlled T-bar rows emphasizing slow negatives',
          battlePlan: '3 rounds\n• 12 Neutral Grip T-Bar Rows (3s eccentric)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Tempo work builds control and mind-muscle connection',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slow on the way down',
              description: 'Lower for a full 3 seconds each rep.'
            },
            {
              icon: 'construct',
              title: 'Chest stays pinned',
              description: 'No hip drive or torso lift.'
            },
            {
              icon: 'flash',
              title: 'Feel mid-back tighten',
              description: 'Think squeezing shoulder blades together.'
            }
          ]
        },
        {
          name: 'Peak Pause Rows',
          duration: '10–12 min',
          description: 'Paused rows reinforcing contraction awareness',
          battlePlan: '3 rounds\n• 10 Wide Grip T-Bar Rows (2s pause)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Paused reps reinforce peak contraction',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause every rep',
              description: 'Hold 1–2s at full contraction.'
            },
            {
              icon: 'construct',
              title: 'Smooth return',
              description: 'Control back to stretch, no drop.'
            },
            {
              icon: 'flash',
              title: 'Peak form feels compact',
              description: 'Elbows tight, chest tall, no shrug.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Close Grip Row',
          duration: '12–14 min',
          description: 'Simple close grip with moderate-to-heavy focus',
          battlePlan: '4 rounds\n• 10 Close Grip T-Bar Row\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Close grip overloads lats with higher load capacity',
          moodTips: [
            {
              icon: 'construct',
              title: 'Brace core, avoid torso swing.',
              description: 'Core stability prevents momentum and isolates target muscles.'
            },
            {
              icon: 'flash',
              title: 'Drive elbows low, past hip line.',
              description: 'Deep elbow drive maximizes lat contraction and range.'
            }
          ]
        },
        {
          name: 'Slow Neg Row',
          duration: '12–14 min',
          description: 'Time-under-tension row progression provides a challenging switchup',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row (3–4s eccentric)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: '3–4s eccentric tempo increases hypertrophy effect',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode to chest, lower slow & steady.',
              description: 'Fast concentric, slow eccentric maximizes muscle stimulus.'
            },
            {
              icon: 'timer',
              title: 'Keep weight lighter to maintain control.',
              description: 'Reduced load allows proper tempo execution and form.'
            }
          ]
        },
        {
          name: 'T-Bar Drop Set',
          duration: '14–16 min',
          description: 'Heavy rows extended with rapid load reductions',
          battlePlan: '3 rounds\n• 8 T-Bar Rows\n• Drop → 8 reps\n• Drop → 8 reps\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'Strip weight quickly, stay in position.'
            },
            {
              icon: 'construct',
              title: 'Drop amount stays moderate',
              description: 'Reduce ~25% to keep reps strict.'
            },
            {
              icon: 'body',
              title: 'Straps encouraged here',
              description: 'Keep lats as the limiting factor.'
            }
          ]
        },
        {
          name: 'Iso-Finish Rows',
          duration: '14–16 min',
          description: 'Standard rows finished with long isometric holds',
          battlePlan: '4 rounds\n• 8 T-Bar Rows\n• Finish with 10s hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Isometric finisher maximizes time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold the last rep',
              description: 'Lock elbows back for 10 seconds.'
            },
            {
              icon: 'construct',
              title: 'No shoulder shrug',
              description: 'Keep traps quiet, squeeze mid-back.'
            },
            {
              icon: 'flash',
              title: 'Peak contraction should burn',
              description: 'That deep mid-back cramp is the goal.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Iso Wide Rows',
          duration: '14–16 min',
          description: 'Wide grip rows with static squeeze finish to bring muscles to full fatigue',
          battlePlan: '4 rounds\n• 8 Wide Grip T-Bar Row\nEnd each set with 10s static hold at full contraction\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Isometric holds create intense contraction stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold elbows back & chest tall in iso.',
              description: 'Maintain peak contraction position throughout hold duration.'
            },
            {
              icon: 'flash',
              title: 'Aim for smooth squeeze across mid-back.',
              description: 'Focus on scapular retraction and mid-trap engagement.'
            }
          ]
        },
        {
          name: 'Combo Superset',
          duration: '16–18 min',
          description: 'Wide-to-underhand superset with scap squeezes',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Back Squeezes (bodyweight, no load)\nRest 120s after full superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Pairing grips + post-set contractions maximizes fatigue',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Moderate weight, strict form for both grips.',
              description: 'Controlled loads allow proper execution of superset protocol.'
            },
            {
              icon: 'refresh',
              title: 'Squeezes: think small, controlled scap retractions.',
              description: 'Bodyweight squeezes enhance muscle activation and recovery.'
            }
          ]
        },
        {
          name: 'Heavy Tempo Rows',
          duration: '16–18 min',
          description: 'Heavy T-bar rows with long controlled eccentrics',
          battlePlan: '4 rounds\n• 6 T-Bar Rows (4s eccentric)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/figwdo7y_download%20%2817%29.png',
          intensityReason: 'Extended eccentrics maximize strength and hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Weight stays honest',
              description: 'Reduce load if tempo breaks.'
            },
            {
              icon: 'timer',
              title: 'Explode up, slow down',
              description: '4s eccentric on every rep.'
            },
            {
              icon: 'body',
              title: 'Straps are acceptable',
              description: 'Prioritize back overload over grip.'
            }
          ]
        },
        {
          name: 'Triple Drop Grinder',
          duration: '18–20 min',
          description: 'Extended triple-drop sets for maximal fatigue',
          battlePlan: '3 rounds\n• 6 Rows\n• Drop → 6\n• Drop → 6\n• Drop → 6\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg',
          intensityReason: 'Triple drops maximize muscle fatigue and pump',
          moodTips: [
            {
              icon: 'flash',
              title: 'Three drops, no rest',
              description: 'Strip plates fast and keep moving.'
            },
            {
              icon: 'construct',
              title: 'Same pull path every drop',
              description: 'Elbows drive low and back.'
            },
            {
              icon: 'body',
              title: 'Chase deep fatigue',
              description: 'You should feel lats throb, not arms.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Powerlifting Platform',
    icon: 'barbell-outline',
    workouts: {
      beginner: [
        {
          name: 'Dead + Row',
          duration: '14–16 min',
          description: 'Deadlifts and rows for beginner back foundation',
          battlePlan: '3 rounds\n• 10 Barbell Deadlift\nRest 60–75s\n• 10 Barbell Bent-Over Row\nRest 60–75s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxlbGxpcHRpY2FsJTIwd29ya291dHxlbnwxfHx8fDE3NTY4ODMyMjN8MA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Intro hinge + pull to teach proper barbell basics',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hinge, don\'t squat, on deadlifts.',
              description: 'Hip hinge pattern targets posterior chain effectively.'
            },
            {
              icon: 'flash',
              title: 'Lats tight on rows to build pulling base.',
              description: 'Lat engagement improves pulling strength and spinal stability.'
            }
          ]
        },
        {
          name: 'Dead Row Shrug',
          duration: '14–16 min',
          description: 'Deads, rows, shrugs train erectors and upper traps',
          battlePlan: '3 rounds\n• 10 Barbell Deadlift\n• 10 Barbell Bent-Over Row\n• 10 Barbell Power Shrug\nRest 75s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1590847330116-ea94fb93eac3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MHx8fHwxNzU2ODgzMjMxfDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Adds shrug finish for trap-dominant overload',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode hips in dead, pause with bar tight to legs.',
              description: 'Hip drive generates power while maintaining bar path control.'
            },
            {
              icon: 'timer',
              title: 'Shrugs: no bounce, pause 1 count at top.',
              description: 'Controlled shrugs with pause maximize trap activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'RDL + Pendlay',
          duration: '16–18 min',
          description: 'Romanian deadlifts with Pendlay rows for balance',
          battlePlan: '4 rounds\n• 8 Romanian Deadlift\nRest 75–90s\n• 10 Pendlay Row\nRest 75–90s',
          imageUrl: 'https://images.pexels.com/photos/6551174/pexels-photo-6551174.jpeg',
          intensityReason: 'Posterior strength + explosive pull development',
          moodTips: [
            {
              icon: 'timer',
              title: 'Go slow with RDL to maximize hamstring loading.',
              description: 'Controlled tempo increases hamstring and glute activation.'
            },
            {
              icon: 'refresh',
              title: 'Reset bar dead-stop every time in Pendlay.',
              description: 'Dead stop allows full lat engagement each rep.'
            }
          ]
        },
        {
          name: 'Pull Combo',
          duration: '16–18 min',
          description: 'Deadlifts plus Olympic pulls for hybrid training',
          battlePlan: '3 rounds\n• 8 Barbell Deadlift\n• 8 Barbell High Pull\n• 8 Barbell Clean Pull\nRest 90s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwdHJhaW5pbmc&ZW54MHx8fHwxNzU2ODgzMjM3fDA&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Add high pulls + clean pulls to boost explosiveness',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Hips and legs drive bar, elbows guide.',
              description: 'Lower body power generation with upper body guidance.'
            },
            {
              icon: 'construct',
              title: 'Keep tight core, don\'t overextend at top.',
              description: 'Core stability prevents hyperextension during pulls.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Dead Row Shrug',
          duration: '18–20 min',
          description: 'Heavy hinge, row, shrug focus for dense back work',
          battlePlan: '4 rounds\n• 8 Barbell Deadlift\nRest 90s\n• 8 Barbell Bent-Over Row\nRest 90s\n• 8 Power Shrug\nRest 90s',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjYXJkaW8lMjB3b3Jrb3V0fGVufDF8fHx8MVc1Nijg4MzIyM3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Adds volume with heavy compound barbell pulls',
          moodTips: [
            {
              icon: 'construct',
              title: 'Belt useful here for safe bracing.',
              description: 'Lifting belt provides additional core support for heavy loads.'
            },
            {
              icon: 'flash',
              title: 'Pull bar into thighs at shrug peak.',
              description: 'Bar contact maximizes trap activation and stability.'
            }
          ]
        },
        {
          name: 'Dead Clean Flow',
          duration: '20–22 min',
          description: 'Heavy compound pulls with clean finish',
          battlePlan: '4 rounds\n• 8 Barbell Deadlift\n• 8 Barbell High Pull\n• 8 Barbell Power Clean\nRest 90–120s after sequence',
          imageUrl: 'https://images.unsplash.com/photo-1571019613242-c5c5dee9f50b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw5fHxyaW5nfGVufDB8fHx8TVc1MzA5MTY0M3ww&ixlib=rb-4.1.0&q=85',
          intensityReason: 'Olympic-style lifts tie power explosiveness to back',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode hips, bar close on clean.',
              description: 'Hip explosion with tight bar path for clean efficiency.'
            },
            {
              icon: 'refresh',
              title: 'Keep arms relaxed until pull finish.',
              description: 'Delayed arm pull maximizes lower body power contribution.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Seated cable machine',
    icon: 'accessibility-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Row Start',
          duration: '10–12 min',
          description: 'Single movement to master seated row mechanics',
          battlePlan: '3 rounds\n• 12 Neutral Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Neutral grip anchor builds confidence + control',
          moodTips: [
            {
              icon: 'construct',
              title: 'Sit tall, chest steady, no torso rocking.',
              description: 'Stable posture isolates target muscles and prevents momentum.'
            },
            {
              icon: 'timer',
              title: 'Pull elbows near ribs, pause each rep.',
              description: 'Controlled movement with pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Wide Row Intro',
          duration: '10–12 min',
          description: 'Focuses on wide row control & back width for beginners',
          battlePlan: '3 rounds\n• 10 Wide Grip Cable Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Wide grip recruits upper back posture muscles',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Elbows flare naturally but keep chest upright.',
              description: 'Natural elbow path with stable torso for optimal activation.'
            },
            {
              icon: 'body',
              title: 'Pull to sternum level, no lower.',
              description: 'Proper pull height maximizes upper back engagement.'
            }
          ]
        },
        {
          name: 'Tempo Neutral Rows',
          duration: '10–12 min',
          description: 'Neutral cable rows emphasizing smooth control',
          battlePlan: '3 rounds\n• 12 Neutral Grip Cable Rows (3s eccentric)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Tempo work builds control and mind-muscle connection',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slow negatives matter',
              description: 'Lower handle for 3 seconds.'
            },
            {
              icon: 'construct',
              title: 'Torso stays tall',
              description: 'No rocking or leaning back.'
            },
            {
              icon: 'flash',
              title: 'Feel lats stretch',
              description: 'Control the return fully.'
            }
          ]
        },
        {
          name: 'Pause & Squeeze Rows',
          duration: '10–12 min',
          description: 'Paused rows to reinforce contraction',
          battlePlan: '3 rounds\n• 10 Wide Grip Cable Rows (2s pause)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Paused reps reinforce peak contraction awareness',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause every rep',
              description: 'Hold 2s at chest.'
            },
            {
              icon: 'construct',
              title: 'Keep stack floating',
              description: 'Don\'t let weight touch down.'
            },
            {
              icon: 'flash',
              title: 'Mid-back should light up',
              description: 'Think shoulder blades pinching.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Underhand Row',
          duration: '12–14 min',
          description: 'Control-focused row variation with palms up to target lower lats and scaps.',
          battlePlan: '4 rounds\n• 10 Underhand Grip Cable Row\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/4jf014no_rgr.jpg',
          intensityReason: 'Underhand row shifts focus to lower lats & biceps',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep wrists straight, elbows tight to body.',
              description: 'Proper wrist alignment and elbow path optimize muscle targeting.'
            },
            {
              icon: 'timer',
              title: 'Hold 1s at contraction for stronger squeeze.',
              description: 'Pause at peak contraction enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Slow Negatives',
          duration: '12–14 min',
          description: 'Single movement with emphasized negative control',
          battlePlan: '4 rounds\n• 8 Neutral Grip Cable Row (3–4s eccentric each rep)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/83ut7zg6_download%20%2813%29.png',
          intensityReason: 'Extended 3–4s eccentrics boost hypertrophy',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull powerfully, but lower slow and steady.',
              description: 'Fast concentric with controlled eccentric maximizes stimulus.'
            },
            {
              icon: 'construct',
              title: 'Brace abs so spine stays neutral.',
              description: 'Core engagement maintains proper spinal alignment.'
            }
          ]
        },
        {
          name: 'Cable Row Drop Set',
          duration: '14–16 min',
          description: 'Mechanical fatigue using quick pin drops',
          battlePlan: '3 rounds\n• 8 Cable Rows\n• Drop → 8 reps\n• Drop → 8 reps\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/4jf014no_rgr.jpg',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are instant',
              description: 'Change pin fast, no standing.'
            },
            {
              icon: 'construct',
              title: 'Drop size stays controlled',
              description: '~20–30% each reduction.'
            },
            {
              icon: 'body',
              title: 'Straps welcome',
              description: 'Keep grip from limiting volume.'
            }
          ]
        },
        {
          name: 'Iso-Hold Cable Rows',
          duration: '14–16 min',
          description: 'Rows with extended static holds',
          battlePlan: '4 rounds\n• 8 Cable Rows\n• Finish with 12s hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/83ut7zg6_download%20%2813%29.png',
          intensityReason: 'Isometric finisher maximizes time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold after final rep',
              description: 'Lock in contraction for 12 seconds.'
            },
            {
              icon: 'construct',
              title: 'Chest stays proud',
              description: 'Avoid rounding during hold.'
            },
            {
              icon: 'flash',
              title: 'Peak form feels compressed',
              description: 'Tight squeeze between shoulder blades.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Iso Hold Rows',
          duration: '14–16 min',
          description: 'Rows with a final long hold at contraction to fully fatigue muscles.',
          battlePlan: '4 rounds\n• 8 Wide Grip Row\nEnd each set with 10s hold at contraction\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Isometric finish after working sets increases time under tension',
          moodTips: [
            {
              icon: 'flash',
              title: 'Crush shoulder blades tight in hold.',
              description: 'Maximum scapular retraction during isometric phase.'
            },
            {
              icon: 'trending-up',
              title: 'Think "chest proud" during static phase.',
              description: 'Proud chest position maintains optimal muscle activation.'
            }
          ]
        },
        {
          name: 'Superset Grind',
          duration: '16–18 min',
          description: 'Wide-to-underhand superset with post-set squeezes',
          battlePlan: '4 rounds\n• 8 Wide Grip Row (controlled)\n• Immediately 8 Underhand Grip Row\n• Finish with 10 Standing Back Squeezes (bodyweight scapular retractions, no load)\nRest 120s after full superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Combo of two grips + contractions maximizes fatigue',
          moodTips: [
            {
              icon: 'construct',
              title: 'Go moderate weight, perfect form on both grips.',
              description: 'Controlled loads ensure proper execution throughout superset.'
            },
            {
              icon: 'refresh',
              title: 'Post-set back squeezes: keep tiny ROM, lats locked.',
              description: 'Small range squeezes enhance activation and recovery.'
            }
          ]
        },
        {
          name: 'Long Eccentric Rows',
          duration: '16–18 min',
          description: 'Cable rows using extended negative tempo',
          battlePlan: '4 rounds\n• 6 Cable Rows (5s eccentric)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/7hcpy4r7_download%20%2812%29.png',
          intensityReason: 'Extended eccentrics maximize strength and hypertrophy',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower longer than you lift',
              description: '5s eccentric each rep.'
            },
            {
              icon: 'construct',
              title: 'No stack touch allowed',
              description: 'Keep tension constant.'
            },
            {
              icon: 'body',
              title: 'Straps keep lats primary',
              description: 'Forearms shouldn\'t fail first.'
            }
          ]
        },
        {
          name: 'Triple Drop Cable Burn',
          duration: '18–20 min',
          description: 'Extended drop sets to fully exhaust lats',
          battlePlan: '3 rounds\n• 6 Rows\n• Drop → 6\n• Drop → 6\n• Drop → 6\nRest 150s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/gdb1l44p_wgr.png',
          intensityReason: 'Triple drops maximize muscle fatigue and pump',
          moodTips: [
            {
              icon: 'flash',
              title: 'Three clean drops',
              description: 'Reduce load fast, no pauses.'
            },
            {
              icon: 'construct',
              title: 'Elbow path stays identical',
              description: 'Don\'t turn drops into shrugs.'
            },
            {
              icon: 'body',
              title: 'Chase lat pump',
              description: 'Deep burn under armpits = success.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Lat pull down machine',
    icon: 'arrow-down-circle-outline',
    workouts: {
      beginner: [
        {
          name: 'Wide Pulldown',
          duration: '10–12 min',
          description: 'Wide grip basis for learning lat engagement to build pull-up strength',
          battlePlan: '3 rounds\n• 10–12 Wide Grip Pulldown\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Wide grip teaches lat activation and form control',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep chest tall and lean slightly back for contraction.',
              description: 'Proper posture maximizes lat engagement and range of motion.'
            },
            {
              icon: 'timer',
              title: 'Pull bar to upper chest, pause, control the return.',
              description: 'Full range with pause enhances muscle activation and control.'
            }
          ]
        },
        {
          name: 'Underhand Pulldown',
          duration: '10–12 min',
          description: 'Easier grip variation supports early progression',
          battlePlan: '3 rounds\n• 10–12 Underhand Pulldown\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fkpr9mxh_lprg.jpg',
          intensityReason: 'Underhand grip recruits arms to aid pulling work',
          moodTips: [
            {
              icon: 'construct',
              title: 'Elbows tucked, bar to chest line for full range.',
              description: 'Proper elbow position maximizes lat stretch and contraction.'
            },
            {
              icon: 'flash',
              title: 'Squeeze lats and biceps hard each rep.',
              description: 'Dual muscle activation enhances strength and development.'
            }
          ]
        },
        {
          name: 'Assisted Tempo Pulldown',
          duration: '10–12 min',
          description: 'Slow pulldowns building lat control and discipline',
          battlePlan: '3 rounds\n• 12 Pulldowns (3s eccentric)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Controlled tempo builds lat activation and mind-muscle connection',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slow on the way up',
              description: 'Lower for 3 seconds every rep.'
            },
            {
              icon: 'construct',
              title: 'Chest stays tall',
              description: 'Slight lean back, no swinging.'
            },
            {
              icon: 'flash',
              title: 'Lats pull via elbows',
              description: 'Think "elbows to pockets" to feel the lat line engage.'
            }
          ]
        },
        {
          name: 'Bottom-Half Pulldowns',
          duration: '10–12 min',
          description: 'Short-range reps focused on peak lat contraction',
          battlePlan: '3 rounds\n• 15 Partial Pulldowns\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fkpr9mxh_lprg.jpg',
          intensityReason: 'Partial range maximizes peak contraction time',
          moodTips: [
            {
              icon: 'construct',
              title: 'Work the squeeze zone',
              description: 'Only move from chest level to mid-range.'
            },
            {
              icon: 'timer',
              title: 'Never relax at the top',
              description: 'Keep the stack hovering for constant tension.'
            },
            {
              icon: 'flash',
              title: 'Feel lats, not biceps',
              description: 'If arms burn first, lighten load and drive elbows down.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Neutral Pulldown',
          duration: '12–14 min',
          description: 'Stronger setup for progressive overload recruiting a wider variety of muscles',
          battlePlan: '4 rounds\n• 8–10 Neutral Grip Pulldown (moderate to heavy)\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vydcatjw_nglp.webp',
          intensityReason: 'Neutral grip enables heavier lat loading safely',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drive elbows to ribs, no shoulder shrug.',
              description: 'Proper elbow drive isolates lats and prevents compensation.'
            },
            {
              icon: 'timer',
              title: 'Lower weight slowly to maximize tension.',
              description: 'Controlled eccentric phase enhances muscle stimulus.'
            }
          ]
        },
        {
          name: 'Pulldown + Hold',
          duration: '12–14 min',
          description: 'Controlled reps followed by static contraction',
          battlePlan: '3 rounds\n• 8–10 Pulldown (neutral or wide, consistent grip choice)\nEnd each set with 5s hold at bottom\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Isometric hold boosts tension and endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold bar at chest for 5s after last rep.',
              description: 'Isometric contraction increases time under tension.'
            },
            {
              icon: 'construct',
              title: 'Keep shoulders down, blades squeezed tight.',
              description: 'Proper scapular position maintains optimal muscle activation.'
            }
          ]
        },
        {
          name: 'Pulldown Drop Set',
          duration: '14–16 min',
          description: 'Rapid drops to extend sets past fatigue',
          battlePlan: '3 rounds\n• 8 Pulldowns\n• Drop → 8 reps\n• Drop → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vydcatjw_nglp.webp',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pin changes are instant',
              description: 'Drop immediately with no standing around.'
            },
            {
              icon: 'construct',
              title: 'Drop size matches control',
              description: 'Use ~20–30% drops so reps stay clean.'
            },
            {
              icon: 'body',
              title: 'Straps are allowed',
              description: 'If grip limits you, strap up so lats get overloaded.'
            }
          ]
        },
        {
          name: 'Pulse Rep Pulldowns',
          duration: '14–16 min',
          description: 'Full reps followed by pulses in the contraction zone',
          battlePlan: '3 rounds\n• 12 Pulldowns\n• Immediately 10 Pulse Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Pulses extend peak contraction for maximum pump',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pulse at the bottom',
              description: 'Small pulses in the last third of ROM.'
            },
            {
              icon: 'body',
              title: 'Shoulders stay down',
              description: 'No shrugging into traps during fatigue.'
            },
            {
              icon: 'flash',
              title: 'Feel the lat shorten',
              description: 'You should feel a tight "cramp" under armpit at squeeze.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Close',
          duration: '14–16 min',
          description: 'Mix of wide and close grips for full lat work and development',
          battlePlan: '4 rounds\n• 8 Wide Grip Pulldown\nRest 90s\n• 8 Close Grip Pulldown\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Grip pairing develops width and back thickness',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Breathe out as you pull down, in as you rise.',
              description: 'Proper breathing pattern maintains core stability and power.'
            },
            {
              icon: 'construct',
              title: 'Don\'t swing stack — keep it controlled.',
              description: 'Smooth movement prevents momentum and maintains tension.'
            }
          ]
        },
        {
          name: 'Pulldown Superset',
          duration: '16–18 min',
          description: 'Wide-to-underhand with controlled lowering for mastery of movement.',
          battlePlan: '4 rounds\n• 8 Wide Grip Pulldown\n• Immediately 8 Underhand Pulldown (3s eccentric each)\nRest 120s after superset',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Superset + eccentrics maximize hypertrophy stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use moderate weight to hold perfect form.',
              description: 'Controlled loads ensure proper execution throughout superset.'
            },
            {
              icon: 'timer',
              title: 'Each rep: take 3s to lower bar slowly.',
              description: 'Extended eccentric phase maximizes muscle development.'
            }
          ]
        },
        {
          name: 'Long Eccentric Pulldowns',
          duration: '16–18 min',
          description: 'Full ROM pulldowns with extended 5s negatives',
          battlePlan: '4 rounds\n• 6 Pulldowns (5s eccentric)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/diugpoq6_download%20%288%29.png',
          intensityReason: 'Extended eccentrics maximize strength and hypertrophy',
          moodTips: [
            {
              icon: 'timer',
              title: 'Eccentric is the work',
              description: 'Lower for 5 seconds every rep.'
            },
            {
              icon: 'construct',
              title: 'Reduce load if tempo breaks',
              description: 'Form > weight at this difficulty.'
            },
            {
              icon: 'body',
              title: 'Straps to keep lats primary',
              description: 'If forearms fail first, straps keep tension where it belongs.'
            }
          ]
        },
        {
          name: 'Iso-Hold Drop Burn',
          duration: '18–20 min',
          description: 'Holds plus drops to build extreme lat fatigue',
          battlePlan: '3 rounds\n• 8 Pulldowns + 10s Hold\n• Drop → 8 reps\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/j967e9c7_download%20%289%29.png',
          intensityReason: 'Combines isometric fatigue with mechanical drop sets',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold before you drop',
              description: '8–10s hold at chest height on final rep.'
            },
            {
              icon: 'flash',
              title: 'Drop immediately after hold',
              description: 'Strip ~20% and keep moving.'
            },
            {
              icon: 'construct',
              title: 'Peak form is zero swing',
              description: 'Chest proud, elbows drive down, stack stays controlled.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Straight pull up bar',
    icon: 'remove-circle-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Pull-Ups',
          duration: '10–12 min',
          description: 'Focuses on mastering the basic pull-up movement pattern',
          battlePlan: '3 rounds\n• 5 Pull-Ups (use band or assisted machine if needed)\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Builds foundational pulling strength with necessary support',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use a band or assisted machine to complete all reps with good form, focusing on lat engagement.',
              description: 'Assistance ensures proper form while building strength foundation.'
            },
            {
              icon: 'trending-up',
              title: 'Drive chin above bar every rep; control the lowering phase.',
              description: 'Full range of motion with controlled eccentric builds strength.'
            }
          ]
        },
        {
          name: 'Pull-Up Negatives',
          duration: '10–12 min',
          description: 'Focuses on controlled lowering to build pulling power',
          battlePlan: '3 rounds\n• 5 Negative Pull-Ups (jump to top, 3-5s lower)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Eccentric training builds strength for full pull-ups',
          moodTips: [
            {
              icon: 'timer',
              title: 'Jump to the top position and take 3-5 seconds to lower yourself. This builds strength even if you can\'t pull up yet.',
              description: 'Eccentric strength training effectively builds pulling power.'
            },
            {
              icon: 'construct',
              title: 'Keep core tight throughout the lowering phase.',
              description: 'Core stability enhances control and safety during negatives.'
            }
          ]
        },
        {
          name: 'Assisted Full-Range Pull-Ups',
          duration: '10–12 min',
          description: 'Assisted pull-ups reinforcing clean full-range mechanics',
          battlePlan: '3 rounds\n• 6 Assisted Pull-Ups\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Full-range assistance builds proper movement patterns',
          moodTips: [
            {
              icon: 'construct',
              title: 'Full stretch every rep',
              description: 'Start from a dead hang with no bounce.'
            },
            {
              icon: 'body',
              title: 'Assistance supports form',
              description: 'Use enough help to keep reps smooth.'
            },
            {
              icon: 'flash',
              title: 'Back initiates the pull',
              description: 'Drive elbows down before arms bend.'
            }
          ]
        },
        {
          name: 'Assisted Pause Pull-Ups',
          duration: '10–12 min',
          description: 'Assisted pull-ups with controlled pauses at the top',
          battlePlan: '3 rounds\n• 5 Assisted Pull-Ups (1–2s top pause)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Pauses at peak contraction build control and strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause with control',
              description: 'Hold 1–2s with chin clearly over bar.'
            },
            {
              icon: 'construct',
              title: 'Stay tight at the top',
              description: 'Shoulders down, chest tall.'
            },
            {
              icon: 'trending-up',
              title: 'Peak form is chest-led',
              description: 'Chest rises toward bar before chin.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Chin-Up Strength',
          duration: '12–14 min',
          description: 'Builds pulling power with a slightly easier grip variation',
          battlePlan: '4 rounds\n• 6 Chin-Ups\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fox3rjq4_chu.jpg',
          intensityReason: 'Chin-ups engage biceps more, aiding overall pull strength',
          moodTips: [
            {
              icon: 'flash',
              title: 'If needed, use light assistance (thin band) to maintain strict form. Focus on squeezing your biceps and lats.',
              description: 'Minimal assistance maintains form while building strength.'
            },
            {
              icon: 'construct',
              title: 'Keep elbows tucked, pull chest to bar.',
              description: 'Proper elbow path maximizes muscle activation and range.'
            }
          ]
        },
        {
          name: 'Pull-Up + Hold',
          duration: '12–14 min',
          description: 'Combines pull-ups with a static hold for enhanced strength',
          battlePlan: '3 rounds\n• 6 Pull-Ups\nEnd each set with a 3s hold at the top\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Adds isometric hold to increase time under tension for growth',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Aim for unassisted reps. If form breaks, use minimal assistance. The hold should be challenging but maintainable.',
              description: 'Progressive overload with isometric challenge builds strength.'
            },
            {
              icon: 'timer',
              title: 'Hold chin above bar for 3 seconds at the top of each final rep.',
              description: 'Isometric hold maximizes time under tension and strength gains.'
            }
          ]
        },
        {
          name: 'Tempo Pull-Ups',
          duration: '12–14 min',
          description: 'Strict pull-ups emphasizing slow controlled eccentrics',
          battlePlan: '4 rounds\n• 6 Pull-Ups (3s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fox3rjq4_chu.jpg',
          intensityReason: 'Extended eccentrics maximize strength and control',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode up, control down',
              description: 'Pull fast, lower for 3 seconds.'
            },
            {
              icon: 'construct',
              title: 'Reset tension each rep',
              description: 'Brief dead hang before next pull.'
            },
            {
              icon: 'body',
              title: 'Feel the lat stretch',
              description: 'Eccentrics should load the lats, not arms.'
            }
          ]
        },
        {
          name: 'Pull-Ups + Iso Finisher',
          duration: '12–14 min',
          description: 'Full pull-ups finished with a static top hold',
          battlePlan: '3 rounds\n• 6 Pull-Ups\n• Finish with 10s chin-over-bar hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Isometric finisher extends time under tension',
          moodTips: [
            {
              icon: 'construct',
              title: 'Reps stay strict',
              description: 'Finish all reps before adding the hold.'
            },
            {
              icon: 'trending-up',
              title: 'Hold with intent',
              description: 'Chest high, shoulders depressed.'
            },
            {
              icon: 'timer',
              title: 'Peak contraction is motionless',
              description: 'No shaking, no bar drift.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Neutral Pull',
          duration: '14–16 min',
          description: 'Two key pull-up variations for comprehensive back development',
          battlePlan: '4 rounds\n• 8 Wide Grip Pull-Ups\nRest 90s\n• 8 Neutral Grip Pull-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Targets outer lats and overall back width with varied grips',
          moodTips: [
            {
              icon: 'construct',
              title: 'These are unassisted. Focus on maximizing muscle activation with each grip.',
              description: 'Different grips target various muscle fibers for complete development.'
            },
            {
              icon: 'trending-up',
              title: 'Wide grip emphasizes lat stretch; neutral grip allows for more power.',
              description: 'Grip variation optimizes both width and strength development.'
            }
          ]
        },
        {
          name: 'Chest-to-Bar Flow',
          duration: '16–18 min',
          description: 'Advanced pull-ups with deep range and controlled lowering',
          battlePlan: '4 rounds\n• 6 Chest-to-Bar Pull-Ups\n• 6 Negative Pull-Ups (3–5s lower)\nRest 90–120s after sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/r3n8muv4_cbpu.webp',
          intensityReason: 'Higher pull range and negatives build extreme strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is for high-level strength. Ensure full control throughout.',
              description: 'Advanced technique requires complete movement mastery.'
            },
            {
              icon: 'timer',
              title: 'Drive chest to bar, then control the 3-5 second negative.',
              description: 'Extended range with controlled eccentric maximizes strength gains.'
            }
          ]
        },
        {
          name: 'Weighted Pull-Ups',
          duration: '14–16 min',
          description: 'Loaded pull-ups to overload back strength',
          battlePlan: '4 rounds\n• 5 Weighted Pull-Ups\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'External load maximizes strength development',
          moodTips: [
            {
              icon: 'construct',
              title: 'Load stays honest',
              description: 'Add weight only if reps stay strict.'
            },
            {
              icon: 'body',
              title: 'Dead hang matters',
              description: 'Full lockout on every rep.'
            },
            {
              icon: 'flash',
              title: 'Straps are acceptable',
              description: 'Don\'t let grip cap lat overload.'
            }
          ]
        },
        {
          name: 'Eccentric Pull-Ups',
          duration: '14–16 min',
          description: 'Pull-ups emphasizing long controlled negatives',
          battlePlan: '3 rounds\n• 5 Pull-Ups (5s eccentric)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif',
          intensityReason: 'Extended eccentrics maximize strength adaptation',
          moodTips: [
            {
              icon: 'timer',
              title: 'Eccentric is the work',
              description: 'Lower for a full 5 seconds.'
            },
            {
              icon: 'construct',
              title: 'Stop before breakdown',
              description: 'End set when tempo slips.'
            },
            {
              icon: 'body',
              title: 'Peak form stays rigid',
              description: 'Core tight, no swinging.'
            }
          ]
        },
        {
          name: 'Burnout Pull-Up Ladder',
          duration: '16–18 min',
          description: 'Descending-rep ladder taken near strict failure',
          battlePlan: 'Ladder format\n• 8 Pull-Ups\n• 6 Pull-Ups\n• 4 Pull-Ups\n• 2 Pull-Ups\nRest 30–45s between rungs',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/r3n8muv4_cbpu.webp',
          intensityReason: 'Ladder format maximizes volume and fatigue',
          moodTips: [
            {
              icon: 'flash',
              title: 'Chase clean fatigue',
              description: 'End sets when reps slow or kip appears.'
            },
            {
              icon: 'timer',
              title: 'Minimal rest matters',
              description: 'Short breaks keep tension high.'
            },
            {
              icon: 'body',
              title: 'Back should fail first',
              description: 'Strap up if grip limits output.'
            }
          ]
        },
        {
          name: 'Muscle-Up Skill Sets',
          duration: '18–20 min',
          description: 'Explosive pull-to-transition muscle-up practice',
          battlePlan: '4 rounds\n• 3–5 Muscle-Ups\n(strict, band-assisted, or low-kip)\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/zpcds83n_download%20%2815%29.png',
          intensityReason: 'Explosive pulling develops power and skill',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull higher than needed',
              description: 'Chest must clear bar height.'
            },
            {
              icon: 'flash',
              title: 'Transition stays tight',
              description: 'Elbows whip fast around bar.'
            },
            {
              icon: 'construct',
              title: 'Quality beats volume',
              description: 'Stop before technique degrades.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Grip variation pull up bar',
    icon: 'git-branch-outline',
    workouts: {
      beginner: [
        {
          name: 'Assisted Neutral',
          duration: '10–12 min',
          description: 'Focuses on the neutral grip pull-up with support',
          battlePlan: '3 rounds\n• 5 Neutral Grip Pull-Ups (use band or assisted machine if needed)\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/ve6lcl2d_Screenshot%202025-12-05%20at%2011.11.07%E2%80%AFPM.png',
          intensityReason: 'Neutral grip is often easiest, building initial pulling strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use a band or assisted machine to ensure you can complete all reps with good form. This helps build the mind-muscle connection.',
              description: 'Assistance allows focus on movement quality and muscle activation.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows tucked, pull with your lats.',
              description: 'Proper elbow position targets lats effectively while learning.'
            }
          ]
        },
        {
          name: 'Assisted Chin-Ups',
          duration: '10–12 min',
          description: 'Builds pulling strength using an underhand grip with assistance',
          battlePlan: '3 rounds\n• 5 Chin-Ups (use band or assisted machine if needed)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/9ie9z8cd_chu.jpg',
          intensityReason: 'Chin-ups recruit biceps, making them slightly easier to learn',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Use assistance to focus on the movement pattern. As you get stronger, reduce the assistance.',
              description: 'Progressive assistance reduction builds strength systematically.'
            },
            {
              icon: 'flash',
              title: 'Palms face you, squeeze biceps at the top.',
              description: 'Underhand grip engages biceps more for easier progression.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Mixed Grip Pulls',
          duration: '12–14 min',
          description: 'Alternating grip for balanced strength development',
          battlePlan: '4 rounds\n• 6 Mixed Grip Pull-Ups (swap grip each set)\nRest 75–90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/knkswnzw_download%20%284%29.png',
          intensityReason: 'Mixed grip helps overcome sticking points, building unilateral strength',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Aim for unassisted reps. If needed, use a very light band. Swap your mixed grip hand position each set.',
              description: 'Alternating grip position ensures balanced development.'
            },
            {
              icon: 'trending-up',
              title: 'Focus on pulling with the supinated hand, then switch.',
              description: 'Supinated hand leads pull for optimal activation pattern.'
            }
          ]
        },
        {
          name: 'Commando Pulls',
          duration: '12–14 min',
          description: 'Dynamic pull-up variation for core and back engagement',
          battlePlan: '3 rounds\n• 6 Commando Pull-Ups (chest to each side)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/v94peb1z_Screenshot%202025-12-05%20at%2011.08.43%E2%80%AFPM.png',
          intensityReason: 'Commando pulls challenge stability and unilateral strength',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is a step up. If needed, use a light band. Focus on moving your chest to each side of your hands.',
              description: 'Dynamic movement challenges core stability and coordination.'
            },
            {
              icon: 'flash',
              title: 'Keep body tight, move chest side-to-side over hands.',
              description: 'Core tension maintains control during lateral movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Wide + Neutral',
          duration: '14–16 min',
          description: 'Targets both back width and overall pulling power',
          battlePlan: '4 rounds\n• 8 Wide Grip Pull-Ups\nRest 90s\n• 8 Neutral Grip Pull-Ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/knkswnzw_download%20%284%29.png',
          intensityReason: 'Combines two primary grips for comprehensive back development',
          moodTips: [
            {
              icon: 'construct',
              title: 'These are unassisted. Focus on perfect form and full range of motion.',
              description: 'Unassisted reps with perfect form maximize strength development.'
            },
            {
              icon: 'trending-up',
              title: 'Wide grip for lat spread, neutral for power and depth.',
              description: 'Different grips target width versus thickness development.'
            }
          ]
        },
        {
          name: 'Archer Pulls',
          duration: '16–18 min',
          description: 'Highly challenging pull-up variation for extreme strength',
          battlePlan: '4 rounds\n• 6 Archer Pull-Ups (each side)\nRest 90–120s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/yk99v1xl_archpu.jpg',
          intensityReason: 'Unilateral strength builder, progressing towards one-arm pull-ups',
          moodTips: [
            {
              icon: 'construct',
              title: 'This is very advanced. Keep the non-pulling arm extended.',
              description: 'Advanced unilateral training requires exceptional control.'
            },
            {
              icon: 'trending-up',
              title: 'Focus on pulling with one arm while the other provides minimal assistance.',
              description: 'Single-arm emphasis builds towards ultimate pulling strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Seated Chest Supported Row Machine',
    icon: 'desktop-outline',
    workouts: {
      beginner: [
        {
          name: 'Neutral Row',
          duration: '10–12 min',
          description: 'Builds pulling strength with a natural elbow path',
          battlePlan: '3 rounds\n• 10–12 Neutral Grip Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/lmxixaaf_scsngr.webp',
          intensityReason: 'Neutral grip row teaches form with stable setup',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest pressed firmly to pad, no torso lift.',
              description: 'Stable chest position isolates back muscles effectively.'
            },
            {
              icon: 'timer',
              title: 'Pull elbows straight back, pause at squeeze.',
              description: 'Straight elbow path with pause maximizes muscle activation.'
            }
          ]
        },
        {
          name: 'Wide Row',
          duration: '10–12 min',
          description: 'Engages rhomboids and traps with safer alignment',
          battlePlan: '3 rounds\n• 10–12 Wide Grip Row\nRest 60–75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/aod60178_scswgr.jpg',
          intensityReason: 'Wide row variation builds posture and width with added support.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Lead with elbows, not forearms.',
              description: 'Elbow-led movement optimizes lat and rhomboid activation.'
            },
            {
              icon: 'flash',
              title: 'Pull bar toward upper chest line for best squeeze.',
              description: 'Upper chest pull height maximizes upper back engagement.'
            }
          ]
        },
        {
          name: 'Pause Rows',
          duration: '10–12 min',
          description: 'Controlled rows emphasizing peak contraction and posture',
          battlePlan: '3 rounds\n• 12 Rows (2s pause)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/lmxixaaf_scsngr.webp',
          intensityReason: 'Paused reps reinforce form and mind-muscle connection',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at squeeze',
              description: 'Hold 2 seconds at full contraction.'
            },
            {
              icon: 'construct',
              title: 'Chest stays glued',
              description: 'Do not lift off pad to cheat.'
            },
            {
              icon: 'flash',
              title: 'Feel mid-back tighten',
              description: 'Think "shoulder blades together" more than arms pulling.'
            }
          ]
        },
        {
          name: 'Partial Row Burn',
          duration: '10–12 min',
          description: 'Short-range rows for endurance without form breakdown',
          battlePlan: '3 rounds\n• 20 Partial Rows\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/aod60178_scswgr.jpg',
          intensityReason: 'Partial range builds endurance while maintaining strict form',
          moodTips: [
            {
              icon: 'construct',
              title: 'Mid-to-top range only',
              description: 'Work where you can stay strict.'
            },
            {
              icon: 'timer',
              title: 'Keep tension constant',
              description: 'Don\'t let stack touch between reps.'
            },
            {
              icon: 'flash',
              title: 'Feel rhomboids working',
              description: 'You should feel squeeze between shoulder blades, not low back.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Underhand Row',
          duration: '12–14 min',
          description: 'Stronger pull variation for controlled overload',
          battlePlan: '4 rounds\n• 8–10 Underhand Grip Row (moderate to heavy)\nRest 75s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pm9titrm_scsrgr.webp',
          intensityReason: 'Underhand angle shifts load to lats and biceps',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep wrists straight, elbows close to torso.',
              description: 'Proper wrist alignment and elbow path optimize pulling mechanics.'
            },
            {
              icon: 'timer',
              title: 'Hold 1s at contraction to deepen squeeze.',
              description: 'Peak contraction pause enhances muscle activation.'
            }
          ]
        },
        {
          name: 'Slow Negatives',
          duration: '12–14 min',
          description: 'Focuses on lat control with longer lowering phase',
          battlePlan: '3 rounds\n• 8 Neutral Grip Row (3s eccentric each rep)\nRest 90s after set',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: '3s eccentric reps add high time under tension',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pull explosively, lower over full 3 count.',
              description: 'Fast concentric with slow eccentric maximizes muscle stimulus.'
            },
            {
              icon: 'construct',
              title: 'Don\'t let weight touch stack between reps.',
              description: 'Constant tension maintains muscle activation throughout set.'
            }
          ]
        },
        {
          name: 'Row Drop Set',
          duration: '14–16 min',
          description: 'Heavy rows extended using fast load reductions',
          battlePlan: '3 rounds\n• 8 Rows\n• Drop → 8 reps\n• Drop → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pm9titrm_scsrgr.webp',
          intensityReason: 'Drop sets extend time under tension beyond failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'Change weight fast while staying seated.'
            },
            {
              icon: 'construct',
              title: 'Drop size stays clean',
              description: '~25% reduction to keep path identical.'
            },
            {
              icon: 'body',
              title: 'Straps are fine here',
              description: 'If grip fails early, strap up so lats get full load.'
            }
          ]
        },
        {
          name: 'Slow Negative Rows',
          duration: '14–16 min',
          description: 'Time-under-tension rows using long eccentrics',
          battlePlan: '4 rounds\n• 8 Rows (4s eccentric)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: 'Extended eccentrics maximize strength development',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pull fast, lower slow',
              description: '4-second eccentric each rep.'
            },
            {
              icon: 'construct',
              title: 'No stack touch',
              description: 'Hover the weight for constant tension.'
            },
            {
              icon: 'flash',
              title: 'Peak form is elbows back',
              description: 'Elbows travel past ribs with chest still pinned to pad.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Neutral + Wide',
          duration: '14–16 min',
          description: 'Neutral rows + wide rows maximize pulling volume',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row\nRest 90s\n• 8 Wide Grip Row\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/ty987c3z_download%20%2814%29.png',
          intensityReason: 'Two grips stimulate width and thickness growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Keep chest glued down on all reps.',
              description: 'Stable torso position ensures isolated back muscle targeting.'
            },
            {
              icon: 'flash',
              title: 'Squeeze each rep at peak for best activation.',
              description: 'Peak contraction squeeze maximizes muscle fiber recruitment.'
            }
          ]
        },
        {
          name: 'Row Superset + Iso',
          duration: '16–18 min',
          description: 'Neutral-to-underhand rows plus isometric finisher',
          battlePlan: '4 rounds\n• 8 Neutral Grip Row\n• Immediately 8 Underhand Grip Row\n• Finish with 10s Hold at peak contraction\nRest 120s after full sequence',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: 'Superset adds load, holds extend time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Focus on slow return, don\'t drop stack.',
              description: 'Controlled eccentric maintains tension and prevents momentum.'
            },
            {
              icon: 'flash',
              title: 'Lock in hard squeeze during iso hold.',
              description: 'Maximum contraction during hold maximizes strength gains.'
            }
          ]
        },
        {
          name: 'Iso Squeeze Rows',
          duration: '16–18 min',
          description: 'Heavy rows finished with long isometric contractions',
          battlePlan: '4 rounds\n• 8 Rows + 10s Hold\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/ty987c3z_download%20%2814%29.png',
          intensityReason: 'Isometric holds build peak contraction strength',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold the last rep',
              description: '10s hold at peak contraction.'
            },
            {
              icon: 'construct',
              title: 'No shrugging',
              description: 'Keep shoulders down as elbows pull back.'
            },
            {
              icon: 'flash',
              title: 'Chase a "mid-back cramp"',
              description: 'The goal is deep squeeze, not moving more weight.'
            }
          ]
        },
        {
          name: 'Triple Drop Row',
          duration: '18–20 min',
          description: 'Extended drop set to drive maximum pulling fatigue',
          battlePlan: '3 rounds\n• 6 Rows\n• Drop → 6\n• Drop → 6\n• Drop → 6\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/1uyss7y4_csrr.webp',
          intensityReason: 'Triple drops maximize muscle fatigue and pump',
          moodTips: [
            {
              icon: 'flash',
              title: 'Three drops, no rest',
              description: 'Strip load quickly and keep reps moving.'
            },
            {
              icon: 'construct',
              title: 'Keep same elbow path',
              description: 'Don\'t turn it into a shrug as weight falls.'
            },
            {
              icon: 'body',
              title: 'Straps are recommended',
              description: 'Keep grip from limiting back overload.'
            }
          ]
        }
      ]
    }
  }
];
