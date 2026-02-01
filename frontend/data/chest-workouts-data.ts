import { EquipmentWorkouts } from '../types/workout';

export const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Bench Fundamentals',
          duration: '12–15 min',
          description: 'Foundational bench reps to build pressing confidence.',
          battlePlan: 'Instructions: Use a load you could complete for 2 more reps.\nSets: 4\nRest: 75–90s\n\n• Barbell Bench Press — 4 × 8',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Foundational bench reps to build pressing confidence.',
          moodTips: [
            {
              icon: 'body',
              title: 'Same setup every set',
              description: 'Feet rooted, shoulder blades pinned before unrack.'
            },
            {
              icon: 'shield-checkmark',
              title: 'Leave reps in reserve',
              description: 'Finish each set feeling confident, not rushed.'
            },
            {
              icon: 'checkmark-circle',
              title: 'No spotter needed',
              description: 'This should feel controlled, not risky.'
            }
          ]
        },
        {
          name: 'Pause & Control',
          duration: '12–16 min',
          description: 'Paused reps to reinforce control and chest tension.',
          battlePlan: 'Instructions: Pause for a full 1 second on the chest.\nSets: 4\nRest: 90s\n\n• Paused Barbell Bench Press — 4 × 5',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Paused reps to reinforce control and chest tension.',
          moodTips: [
            {
              icon: 'pause',
              title: 'Kill momentum completely',
              description: 'Let the bar settle softly on the chest.'
            },
            {
              icon: 'flame',
              title: 'Tension never leaves',
              description: 'Chest stays active before and after the pause.'
            },
            {
              icon: 'shield',
              title: 'Use safeties if alone',
              description: 'Pauses increase time under load.'
            }
          ]
        },
        {
          name: 'Slow Confidence',
          duration: '12–15 min',
          description: 'Slow eccentrics reinforce form and chest awareness.',
          battlePlan: 'Instructions: Lower the bar for 4 seconds each rep.\nSets: 3\nRest: 90s\n\n• Barbell Bench Press — 3 × 6 (4s eccentric)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Slow eccentrics reinforce form and chest awareness.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Own the descent',
              description: 'Resist gravity for the full negative.'
            },
            {
              icon: 'hand-left',
              title: 'Soft touch only',
              description: 'No bounce or collapse at the bottom.'
            },
            {
              icon: 'people',
              title: 'Spotter optional',
              description: 'Use one if fatigue causes loss of control.'
            }
          ]
        },
        {
          name: 'Light Bar Burn',
          duration: '10–14 min',
          description: 'High-rep benching to build endurance and comfort.',
          battlePlan: 'Instructions: Choose a light load and move continuously.\nSets: 3\nRest: 60s\n\n• Barbell Bench Press — 3 × 15–20',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'High-rep benching to build endurance and comfort.',
          moodTips: [
            {
              icon: 'heart',
              title: 'Ego stays out',
              description: 'Light weight keeps chest engaged nonstop.'
            },
            {
              icon: 'repeat',
              title: 'Every rep identical',
              description: 'Bar path never changes.'
            },
            {
              icon: 'shield',
              title: 'Have safeties set',
              description: 'High-rep fatigue sneaks up fast.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Cluster Control',
          duration: '14–18 min',
          description: 'Cluster benching to maintain power and bar speed.',
          battlePlan: 'Instructions: 15s breaths between mini-sets.\nSets: 4\nRest: 2:00 between clusters\n\n• Barbell Bench Press — 4 × (4 / 4 / 4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Cluster benching to maintain power and bar speed.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Each rep earns focus',
              description: 'Reset your brace before every mini-set.'
            },
            {
              icon: 'pulse',
              title: 'Short breaths only',
              description: 'Stay mentally locked in.'
            },
            {
              icon: 'people',
              title: 'Spotter recommended',
              description: 'Fatigue accumulates quickly in clusters.'
            }
          ]
        },
        {
          name: 'Working Sets',
          duration: '14–18 min',
          description: 'Traditional working bench sets with meaningful load.',
          battlePlan: 'Instructions: Increase load only if all reps stay clean.\nSets: 5\nRest: 90s\n\n• Barbell Bench Press — 5 × 6',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Traditional working bench sets with meaningful load.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Reps should challenge control',
              description: 'Bar speed slows slightly, form doesn\'t.'
            },
            {
              icon: 'body',
              title: 'Same setup every set',
              description: 'Consistency drives progress.'
            },
            {
              icon: 'people',
              title: 'Spotter optional',
              description: 'Useful on final sets as load climbs.'
            }
          ]
        },
        {
          name: 'Strength Pauses',
          duration: '14–18 min',
          description: 'Paused benching with a strong contraction finish.',
          battlePlan: 'Instructions: Final rep includes a 6–8s squeeze at lockout.\nSets: 4\nRest: 2:00\n\n• Paused Barbell Bench Press — 4 × 4\nFinal rep: 6–8s squeeze',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Paused benching with a strong contraction finish.',
          moodTips: [
            {
              icon: 'pause',
              title: 'Pause where strength fades',
              description: 'Bottom position exposes weakness.'
            },
            {
              icon: 'flash',
              title: 'Finish with intent',
              description: 'Lockout squeeze reinforces chest dominance.'
            },
            {
              icon: 'people',
              title: 'Spotter advised',
              description: 'Long pauses increase fatigue per rep.'
            }
          ]
        },
        {
          name: 'Press & Fire',
          duration: '15–18 min',
          description: 'Close-grip bench paired with explosive push-ups.',
          battlePlan: 'Instructions: Move immediately from bar to floor.\nSets: 4\nRest: 90s after push-ups\n\n• Close-Grip Bench Press — 4 × 6\n• Explosive Push-Ups — 4 × 12–15',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Close-grip bench paired with explosive push-ups.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip shift changes demand',
              description: 'Close grip increases control emphasis.'
            },
            {
              icon: 'flash',
              title: 'Explode cleanly',
              description: 'Push-ups stay athletic, not sloppy.'
            },
            {
              icon: 'alert-circle',
              title: 'Clear space first',
              description: 'Fast transitions matter for safety.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Clusters',
          duration: '16–20 min',
          description: 'Heavy cluster benching to sustain power output.',
          battlePlan: 'Instructions: Short breaths, full recovery between sets.\nSets: 5\nRest: 2:00\n\n• Barbell Bench Press — 5 × (3 / 3 / 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Heavy cluster benching to sustain power output.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Precision under load',
              description: 'Heavy reps stay calm and repeatable.'
            },
            {
              icon: 'refresh',
              title: 'Reset fully',
              description: 'Treat each mini-set as its own effort.'
            },
            {
              icon: 'people',
              title: 'Spotter strongly recommended',
              description: 'Output stays high under fatigue.'
            }
          ]
        },
        {
          name: 'Heavy Precision',
          duration: '16–20 min',
          description: 'Heavy benching focused on precision and output.',
          battlePlan: 'Instructions: Challenging load, zero missed reps.\nSets: 5\nRest: 2:00\n\n• Barbell Bench Press — 5 × 4',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Heavy benching focused on precision and output.',
          moodTips: [
            {
              icon: 'checkmark-done',
              title: 'Every rep deliberate',
              description: 'No rushed unracks or sloppy lockouts.'
            },
            {
              icon: 'timer',
              title: 'Rest with intent',
              description: 'Power lives in recovery.'
            },
            {
              icon: 'people',
              title: 'Spotter recommended',
              description: 'Especially on final sets.'
            }
          ]
        },
        {
          name: 'Bench Drop Authority',
          duration: '15–20 min',
          description: 'Four-stage bench drop set for maximal chest fatigue.',
          battlePlan: 'Instructions: Strip weight immediately between stages.\nSets: 3\nRest: 2:30\n\n• Bench Press (Heavy) — max reps\n• Drop 1 (Medium) — max reps\n• Drop 2 (Light) — 12–15 reps\n• Drop 3 (Very Light) — burnout',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Four-stage bench drop set for maximal chest fatigue.',
          moodTips: [
            {
              icon: 'flame',
              title: 'Heavy earns the drop',
              description: 'First weight should reach true fatigue.'
            },
            {
              icon: 'flash',
              title: 'No rest between stages',
              description: 'Weight moves fast, tension stays on.'
            },
            {
              icon: 'alert',
              title: 'Spotter required',
              description: 'This set pushes close to failure.'
            }
          ]
        },
        {
          name: 'Press & Explode',
          duration: '15–20 min',
          description: 'Heavy benching paired with explosive plyo push-ups.',
          battlePlan: 'Instructions: Move quickly but under control.\nSets: 4\nRest: 2:00 after push-ups\n\n• Bench Press — 4 × 4\n• Clap Push-Ups — 4 × 6–10',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Heavy benching paired with explosive plyo push-ups.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Heavy then fast',
              description: 'Contrast preserves power under fatigue.'
            },
            {
              icon: 'flash',
              title: 'Claps stay crisp',
              description: 'Quality beats height.'
            },
            {
              icon: 'alert-circle',
              title: 'Clear the area',
              description: 'Plyos demand space and focus.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Incline bench',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Upper Chest Foundations',
          duration: '12–15 min',
          description: 'Foundational incline pressing to build upper chest confidence.',
          battlePlan: 'Instructions: Use a load you could complete for 2 more reps.\nSets: 4\nRest: 75–90s\n\n• Incline Barbell Press — 4 × 8',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Foundational incline pressing to build upper chest confidence.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Set the angle first',
              description: 'Moderate incline keeps work in the chest, not shoulders.'
            },
            {
              icon: 'refresh',
              title: 'Move smoothly',
              description: 'Each rep should feel controlled and repeatable.'
            },
            {
              icon: 'checkmark-circle',
              title: 'No spotter needed',
              description: 'This should feel confident, not risky.'
            }
          ]
        },
        {
          name: 'Incline Control',
          duration: '12–16 min',
          description: 'Paused incline reps to reinforce upper chest control.',
          battlePlan: 'Instructions: Pause softly for 1 second on the chest.\nSets: 4\nRest: 90s\n\n• Paused Incline Press — 4 × 5',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Paused incline reps to reinforce upper chest control.',
          moodTips: [
            {
              icon: 'pause',
              title: 'Pause where tension peaks',
              description: 'Upper chest stays loaded at the bottom.'
            },
            {
              icon: 'body',
              title: 'Stay stacked',
              description: 'Wrists over elbows, elbows under the bar.'
            },
            {
              icon: 'shield',
              title: 'Use safeties if solo',
              description: 'Pauses increase time under load.'
            }
          ]
        },
        {
          name: 'Slow Incline',
          duration: '12–15 min',
          description: 'Slow eccentrics increase upper chest awareness and tension.',
          battlePlan: 'Instructions: Lower the bar for 4 seconds each rep.\nSets: 3\nRest: 90s\n\n• Incline Press — 3 × 6 (4s eccentric)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Slow eccentrics increase upper chest awareness and tension.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Own the descent',
              description: 'Resist gravity for the full negative.'
            },
            {
              icon: 'hand-left',
              title: 'Soft touch only',
              description: 'No collapse into the bottom position.'
            },
            {
              icon: 'people',
              title: 'Spotter optional',
              description: 'Helpful if control fades late.'
            }
          ]
        },
        {
          name: 'Incline Burn',
          duration: '10–14 min',
          description: 'High-rep incline pressing to build upper chest endurance.',
          battlePlan: 'Instructions: Choose a light load and move continuously.\nSets: 3\nRest: 60s\n\n• Incline Press — 3 × 15–20',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'High-rep incline pressing to build upper chest endurance.',
          moodTips: [
            {
              icon: 'flame',
              title: 'Light and relentless',
              description: 'Chest stays active nonstop.'
            },
            {
              icon: 'lock-closed',
              title: 'No lockout rest',
              description: 'Tension stays on the pecs.'
            },
            {
              icon: 'shield',
              title: 'Set safeties',
              description: 'Fatigue builds fast at high reps.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline Clusters',
          duration: '14–18 min',
          description: 'Cluster incline pressing to maintain power and bar speed.',
          battlePlan: 'Instructions: 15s breaths between mini-sets.\nSets: 4\nRest: 2:00 between clusters\n\n• Incline Press — 4 × (4 / 4 / 4)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Cluster incline pressing to maintain power and bar speed.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Each rep deserves focus',
              description: 'Reset your brace before every mini-set.'
            },
            {
              icon: 'pulse',
              title: 'Short breaths only',
              description: 'Stay tight and present.'
            },
            {
              icon: 'people',
              title: 'Spotter recommended',
              description: 'Fatigue accumulates quickly.'
            }
          ]
        },
        {
          name: 'Working Incline',
          duration: '14–18 min',
          description: 'Traditional incline benching with meaningful working weight.',
          battlePlan: 'Instructions: Increase load only if all reps stay clean.\nSets: 5\nRest: 90s\n\n• Incline Press — 5 × 6',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Traditional incline benching with meaningful working weight.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Reps should challenge control',
              description: 'Bar speed slows slightly, form doesn\'t.'
            },
            {
              icon: 'construct',
              title: 'Same angle every set',
              description: 'Consistency drives progress.'
            },
            {
              icon: 'people',
              title: 'Spotter optional',
              description: 'Useful on later sets.'
            }
          ]
        },
        {
          name: 'Upper Chest Holds',
          duration: '14–18 min',
          description: 'Paused incline pressing with a strong contraction finish.',
          battlePlan: 'Instructions: Final rep includes a 6–8s squeeze at lockout.\nSets: 4\nRest: 2:00\n\n• Paused Incline Press — 4 × 4\nFinal rep: 6–8s squeeze',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Paused incline pressing with a strong contraction finish.',
          moodTips: [
            {
              icon: 'pause',
              title: 'Pause where strength fades',
              description: 'Bottom position exposes weakness.'
            },
            {
              icon: 'flash',
              title: 'Finish with intent',
              description: 'Lockout squeeze reinforces chest dominance.'
            },
            {
              icon: 'people',
              title: 'Spotter advised',
              description: 'Long pauses increase fatigue per rep.'
            }
          ]
        },
        {
          name: 'Incline & Fire',
          duration: '15–18 min',
          description: 'Incline pressing paired with explosive push-ups.',
          battlePlan: 'Instructions: Move directly from bar to floor.\nSets: 4\nRest: 90s after push-ups\n\n• Incline Press — 4 × 6\n• Explosive Push-Ups — 4 × 12–15',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Incline pressing paired with explosive push-ups.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Press then explode',
              description: 'Contrast keeps intensity high.'
            },
            {
              icon: 'body',
              title: 'Chest leads the push',
              description: 'Push-ups stay chest-biased.'
            },
            {
              icon: 'alert-circle',
              title: 'Clear space first',
              description: 'Fast transitions require focus.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Incline Clusters',
          duration: '16–20 min',
          description: 'Heavy incline clusters to sustain upper chest power.',
          battlePlan: 'Instructions: Short breaths, full recovery between sets.\nSets: 5\nRest: 2:00\n\n• Incline Press — 5 × (3 / 3 / 3)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Heavy incline clusters to sustain upper chest power.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Precision under load',
              description: 'Heavy reps stay calm and repeatable.'
            },
            {
              icon: 'refresh',
              title: 'Reset fully',
              description: 'Treat each mini-set as a first rep.'
            },
            {
              icon: 'people',
              title: 'Spotter strongly recommended',
              description: 'Output stays high under fatigue.'
            }
          ]
        },
        {
          name: 'Heavy Incline',
          duration: '16–20 min',
          description: 'Heavy incline pressing focused on upper chest strength.',
          battlePlan: 'Instructions: Challenging load, zero missed reps.\nSets: 5\nRest: 2:00\n\n• Incline Press — 5 × 4',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Heavy incline pressing focused on upper chest strength.',
          moodTips: [
            {
              icon: 'checkmark-done',
              title: 'Every rep deliberate',
              description: 'No rushed unracks or loose lockouts.'
            },
            {
              icon: 'timer',
              title: 'Rest with intent',
              description: 'Power lives in recovery.'
            },
            {
              icon: 'people',
              title: 'Spotter recommended',
              description: 'Especially on final sets.'
            }
          ]
        },
        {
          name: 'Incline Drop Cascade',
          duration: '15–20 min',
          description: 'Four-stage incline drop set for deep upper chest fatigue.',
          battlePlan: 'Instructions: Strip weight immediately between stages.\nSets: 3\nRest: 2:30\n\n• Incline Press (Heavy) — max reps\n• Drop 1 (Medium) — max reps\n• Drop 2 (Light) — 12–15 reps\n• Drop 3 (Very Light) — burnout',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Four-stage incline drop set for deep upper chest fatigue.',
          moodTips: [
            {
              icon: 'flame',
              title: 'Heavy earns fatigue',
              description: 'First stage should reach true failure.'
            },
            {
              icon: 'flash',
              title: 'No rest between drops',
              description: 'Plates move, tension stays.'
            },
            {
              icon: 'alert',
              title: 'Spotter required',
              description: 'This set pushes close to failure.'
            }
          ]
        },
        {
          name: 'Press & Explode',
          duration: '15–20 min',
          description: 'Heavy incline pressing paired with explosive plyo push-ups.',
          battlePlan: 'Instructions: Move quickly but under control.\nSets: 4\nRest: 2:00 after push-ups\n\n• Incline Press — 4 × 4\n• Clap Push-Ups — 4 × 6–10',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Heavy incline pressing paired with explosive plyo push-ups.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Heavy then fast',
              description: 'Contrast preserves power under fatigue.'
            },
            {
              icon: 'flash',
              title: 'Claps stay crisp',
              description: 'Quality over height.'
            },
            {
              icon: 'alert-circle',
              title: 'Clear the area',
              description: 'Plyos demand space and focus.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Adjustable bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Press Circuit',
          duration: '15–18 min',
          description: 'Presses at flat, incline, and decline angles for full pec coverage.',
          battlePlan: '3 rounds:\n• 10 flat press\n• 10 incline press\n• 10 decline press (light)\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/avrgfl1y_download%20%2818%29.png',
          intensityReason: 'Perfect multi-angle introduction targeting all pec areas.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Think of targeting pecs from multiple angles',
              description: 'Flat = mid, incline = upper, decline = lower for complete development.'
            },
            {
              icon: 'trending-up',
              title: 'Drive elbows slightly inward',
              description: 'On all presses to maximize chest fiber recruitment and activation.'
            }
          ]
        },
        {
          name: 'Fly Flow',
          duration: '12–15 min',
          description: 'Flat, incline, and decline flys for chest isolation from all angles.',
          battlePlan: '3 rounds:\n• 10 flat fly\n• 10 incline fly\n• 10 decline fly (light)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/qt834fch_idbf.webp',
          intensityReason: 'Gentle fly progression across multiple angles.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at stretch position 1s',
              description: 'To expand pec fibers and maximize muscle growth stimulus.'
            },
            {
              icon: 'flash',
              title: 'Bring dumbbells together until they meet',
              description: 'Not just overhead—to force full contraction and muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Angle Ladder',
          duration: '14–16 min',
          description: 'Press progression across flat, incline, and decline angles for fiber recruitment.',
          battlePlan: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/avrgfl1y_download%20%2818%29.png',
          intensityReason: 'Progressive recruitment training across all chest angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Think progressive recruitment',
              description: 'Start more pec-dominant, progress to fatigue lower range.'
            },
            {
              icon: 'timer',
              title: 'Don\'t rush—feel pec stretch',
              description: 'On each angle for maximum muscle activation and growth.'
            }
          ]
        },
        {
          name: 'Plyo Push-Ups',
          duration: '14–16 min',
          description: 'Explosive push-ups at varying angles plus single-arm presses for adaptation.',
          battlePlan: '4 rounds:\n• 8 explosive plyo push-ups (vary bench angle each round)\n• 10 single-arm press\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/w699t364_download%20%287%29.png',
          intensityReason: 'Explosive multi-angle training for pec adaptation.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Varying angle forces pec adaptation',
              description: 'Greater growth stimulus through multi-angle training.'
            },
            {
              icon: 'trending-up',
              title: 'Press across midline with single-arm',
              description: 'For deeper chest contraction and unilateral strength.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '15–20 min',
          description: 'Multi-angle presses and fly for hypertrophy density.',
          battlePlan: '3 rounds:\n• 8 flat press\n• 8 incline press\n• 8 decline press\n• 8 fly (choose angle)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/avrgfl1y_download%20%2818%29.png',
          intensityReason: 'Advanced hypertrophy density training with multi-angle work.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Go for hypertrophy density',
              description: 'Aim for near-failure each angle, minimal rest for growth.'
            },
            {
              icon: 'body',
              title: 'On fly, think chest-to-chest squeeze',
              description: 'At top for maximum muscle contraction and activation.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–20 min',
          description: 'Heavy-to-light pressing at any angle for intense chest burnout.',
          battlePlan: '2 rounds:\n• 10 heavy press (any angle)\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/23ok9no5_download%20%2819%29.png',
          intensityReason: 'High-intensity drop sets with time under tension focus.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Don\'t save energy',
              description: 'Heavy set should be all-out near failure for maximum recruitment.'
            },
            {
              icon: 'timer',
              title: 'Focus on time under tension',
              description: 'During final drops for growth and muscle development.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Decline bench',
    icon: 'trending-down',
    workouts: {
      beginner: [
        {
          name: 'Push-Up Circuit',
          duration: '10–12 min',
          description: 'Decline push-ups and presses for lower chest activation.',
          battlePlan: '3 rounds:\n• 8 decline push-ups (feet on bench)\n• 10 decline bench press (light)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/kd2t1cpd_dbpp.jpg',
          intensityReason: 'Perfect introduction to lower chest development training.',
          moodTips: [
            {
              icon: 'body',
              title: 'Decline push-ups: Keep core tight',
              description: 'Maintain straight line from head to feet throughout the movement.'
            },
            {
              icon: 'trending-down',
              title: 'Decline press: Lower to nipple line',
              description: 'Focus on lower pec stretch and contraction for optimal activation.'
            }
          ]
        },
        {
          name: 'Chest Press',
          duration: '12–15 min',
          description: 'Decline press and fly combo for lower pec focus.',
          battlePlan: '3 rounds:\n• 12 decline bench press (light)\n• 10 decline fly\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/r1uig0ll_download%20%284%29.png',
          intensityReason: 'Beginner decline pressing and isolation combination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Focus on lower pec squeeze',
              description: 'At the top of each rep to maximize lower chest activation.'
            },
            {
              icon: 'construct',
              title: 'Secure feet properly',
              description: 'Good foot placement prevents sliding and ensures safety.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Plyo Push-Ups',
          duration: '14–15 min',
          description: 'Explosive decline push-ups and single-arm presses for power and tension.',
          battlePlan: '4 rounds:\n• 8 decline plyo push-ups\n• 10 single-arm decline press\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/kd2t1cpd_dbpp.jpg',
          intensityReason: 'Explosive training for intermediate lower chest power.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Explosive drive',
              description: 'Push with maximum intent to recruit fast-twitch fibers.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm: Control the negative',
              description: 'Slow descent creates more time under tension for growth.'
            }
          ]
        },
        {
          name: 'Chest Flow',
          duration: '12–15 min',
          description: 'Decline press, fly, and close-grip bench press for metabolic stress.',
          battlePlan: '3 rounds:\n• 10 decline bench press\n• 10 decline fly\n• 10 close-grip decline press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/r1uig0ll_download%20%284%29.png',
          intensityReason: 'Continuous flow training for lower chest overload.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Flow training creates metabolic stress',
              description: 'Key driver for lower chest hypertrophy and development.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Focus on inner chest',
              description: 'Emphasize adduction movement for maximum inner pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Decline press, fly, push-ups, and dips for complete chest overload.',
          battlePlan: '3 rounds:\n• 8 decline bench press\n• 8 decline fly\n• 8 decline plyo push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/kd2t1cpd_dbpp.jpg',
          intensityReason: 'Advanced complex training for maximum lower chest development.',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Decline angle maximizes lower chest',
              description: 'Focus on lower pec contraction throughout all movements.'
            },
            {
              icon: 'body',
              title: 'Dips complement decline work',
              description: 'Similar angle targets lower chest fibers effectively.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–20 min',
          description: 'Heavy-to-light decline presses for progressive hypertrophy.',
          battlePlan: '2 rounds:\n• 10 heavy decline press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/r1uig0ll_download%20%284%29.png',
          intensityReason: 'High-intensity decline drop sets for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Heavy set: All-out effort',
              description: 'Push to near failure for maximum muscle recruitment.'
            },
            {
              icon: 'speedometer',
              title: 'Light sets: Focus on control',
              description: 'Slow eccentrics maximize time under tension for growth.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Smith machine',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Chest Press',
          duration: '12–14 min',
          description: 'Flat and incline Smith presses for guided pressing strength.',
          battlePlan: '3 rounds:\n• 10 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/wqpgrlpk_download%20%289%29.png',
          intensityReason: 'Safe introduction to barbell movements with stability.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Set safety bars properly',
              description: 'Position safety bars just below chest level for protection.'
            },
            {
              icon: 'body',
              title: 'Maintain natural arch',
              description: 'Keep slight natural arch in back during pressing movements.'
            }
          ]
        },
        {
          name: 'Push-Up Circuit',
          duration: '10–12 min',
          description: 'Push-ups and close-grip Smith presses for foundational chest endurance.',
          battlePlan: '3 rounds:\n• 8 Smith bench press\n• 8 Smith close-grip press\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/pl1dkh7x_download%20%288%29.png',
          intensityReason: 'Basic Smith machine pressing with grip variations.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip width matters',
              description: 'Wide grip targets outer chest, close grip emphasizes inner chest.'
            },
            {
              icon: 'speedometer',
              title: 'Control the tempo',
              description: '2s down, 1s pause, 2s up for muscle control.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Angle Ladder',
          duration: '14–15 min',
          description: 'Flat, incline, and decline Smith presses to stress fibers at all angles.',
          battlePlan: '4 rounds:\n• 8 Smith bench press\n• 6 Smith incline press\n• 8 Smith close-grip press\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/wqpgrlpk_download%20%289%29.png',
          intensityReason: 'Strength-focused Smith machine training with multiple angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Progressive overload',
              description: 'Gradually increase weight as strength improves.'
            },
            {
              icon: 'construct',
              title: 'Adjust bench angles',
              description: 'Use different bench angles to target all areas of chest.'
            }
          ]
        },
        {
          name: 'Plyo Push-Ups',
          duration: '14–16 min',
          description: 'Explosive bar push-ups and single-arm presses for power and hypertrophy.',
          battlePlan: '3 rounds:\n• 6 Smith bench press\n• 8 Smith incline press\n• 10 push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/pl1dkh7x_download%20%288%29.png',
          intensityReason: 'Complex training combining Smith machine with bodyweight.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth transitions',
              description: 'Move efficiently between Smith machine and bodyweight exercises.'
            },
            {
              icon: 'flash',
              title: 'Maintain intensity',
              description: 'Keep workout intensity high throughout entire circuit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Pressing complex at multiple angles for sustained chest tension.',
          battlePlan: '3 rounds:\n• 6 heavy Smith bench press\n• Drop → 8 moderate\n• Drop → 10 light\n• 8 Smith incline press\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/wqpgrlpk_download%20%289%29.png',
          intensityReason: 'Advanced drop set protocol using Smith machine safety.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight changes',
              description: 'Practice efficient weight changes for minimal rest.'
            },
            {
              icon: 'shield',
              title: 'Safety first',
              description: 'Use safety bars and proper form even under fatigue.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–20 min',
          description: 'Heavy-to-light Smith pressing for chest fatigue and growth.',
          battlePlan: '3 rounds:\n• 5 explosive Smith bench press\n• 6 controlled Smith bench press\n• 8 Smith incline press\n• 10 push-ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/pl1dkh7x_download%20%288%29.png',
          intensityReason: 'Advanced power and control complex using Smith stability.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric',
              description: 'Drive the bar up with maximum speed and intent.'
            },
            {
              icon: 'timer',
              title: 'Controlled eccentric',
              description: '3s descent for maximum time under tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Chest press machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Press Circuit',
          duration: '12–14 min',
          description: 'Machine press variations with close-grip focus for controlled activation.',
          battlePlan: '3 rounds:\n• 12 chest press (light)\n• 10 wide grip press\n• 10 narrow grip press\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/etmzu51q_download%20%283%29.png',
          intensityReason: 'Safe machine-based introduction with different grip positions.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust seat height properly',
              description: 'Handles should align with mid-chest for optimal pressing angle.'
            },
            {
              icon: 'body',
              title: 'Keep back flat against pad',
              description: 'Maintain contact throughout entire range of motion.'
            }
          ]
        },
        {
          name: 'Press & Fly',
          duration: '12–14 min',
          description: 'Press and fly pairing for contraction and stretch under load.',
          battlePlan: '3 rounds:\n• 10 chest press\n• 10 pec deck (if available)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/67nyth7l_download%20%282%29.png',
          intensityReason: 'Simple machine circuit combining pressing and isolation.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Control the tempo',
              description: '2s down, 1s pause, 2s up for muscle control.'
            },
            {
              icon: 'flash',
              title: 'Focus on chest squeeze',
              description: 'Contract chest hard at the top of each press.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Drop Set',
          duration: '16–18 min',
          description: 'Heavy-to-light machine press drop set for maximum pump.',
          battlePlan: '4 rounds:\n• 12 light chest press\n• 10 moderate chest press\n• 8 heavy chest press\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/etmzu51q_download%20%283%29.png',
          intensityReason: 'Progressive loading pyramid across different rep ranges.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase weight progressively',
              description: 'Each set should challenge you at the target rep range.'
            },
            {
              icon: 'timer',
              title: 'Rest between weight changes',
              description: 'Take time to adjust weight properly between sets.'
            }
          ]
        },
        {
          name: 'Ladder',
          duration: '14–16 min',
          description: 'Wide, neutral, and close grips to target full chest fibers.',
          battlePlan: '3 rounds:\n• 8 heavy chest press\n• 10 single-arm chest press\n• 12 pec deck\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/67nyth7l_download%20%282%29.png',
          intensityReason: 'Strength-focused machine training with unilateral work.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Single-arm challenges core',
              description: 'Maintain stable torso during unilateral pressing.'
            },
            {
              icon: 'body',
              title: 'Feel the stretch on pec deck',
              description: 'Full range of motion for maximum muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'AMRAP',
          duration: '10 min',
          description: '10-minute maximum volume chest press challenge.',
          battlePlan: '3 rounds:\n• 8 heavy chest press\n• Drop → 10 moderate\n• Drop → 12 light\n• 10 pec deck\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/etmzu51q_download%20%283%29.png',
          intensityReason: 'Advanced drop set protocol using machine safety.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push to near failure',
              description: 'Machines provide safety to train intensely.'
            },
            {
              icon: 'speedometer',
              title: 'Quick weight adjustments',
              description: 'Minimize rest between drop set weights.'
            }
          ]
        },
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Wide, close, and single-arm presses for hypertrophy and stability.',
          battlePlan: '3 rounds:\n• 6 explosive chest press\n• 8 controlled chest press\n• 10 pec deck\n• 8 single-arm press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/67nyth7l_download%20%282%29.png',
          intensityReason: 'Advanced power and control complex using machine stability.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric',
              description: 'Drive the weight up with maximum intent.'
            },
            {
              icon: 'timer',
              title: 'Controlled eccentric',
              description: '3s descent for maximum time under tension.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pec dec machine',
    icon: 'contract',
    workouts: {
      beginner: [
        {
          name: 'Pec Dec Circuit',
          duration: '12–14 min',
          description: 'Pec fly and rear delt fly combo for chest-shoulder balance.',
          battlePlan: '3 rounds:\n• 12 pec dec fly\n• 10 reverse pec dec (rear delts)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/rf17lbcl_pmd2.jpg',
          intensityReason: 'Perfect introduction to pec dec training and shoulder balance.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust seat height properly',
              description: 'Upper arms should be parallel to floor at mid-chest level.'
            },
            {
              icon: 'body',
              title: 'Keep back flat against pad',
              description: 'Maintain contact and avoid arching during the movement.'
            }
          ]
        },
        {
          name: 'Pec Dec Hold',
          duration: '10–12 min',
          description: 'Pec flys with static holds for contraction emphasis.',
          battlePlan: '3 rounds:\n• 10 pec dec fly\n• 8 chest press (if available)\n• 10 pec dec fly\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/5hd3my3c_pdm.webp',
          intensityReason: 'Isolation-focused circuit combining pec dec with pressing.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Focus on the squeeze',
              description: 'Contract chest hard as pads come together.'
            },
            {
              icon: 'timer',
              title: 'Control the negative',
              description: 'Slow descent to maximize muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Drop Set',
          duration: '16–18 min',
          description: 'Heavy-to-light pec deck flys for stretch and squeeze combo.',
          battlePlan: '4 rounds:\n• 12 light pec dec\n• 10 moderate pec dec\n• 8 heavy pec dec\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/rf17lbcl_pmd2.jpg',
          intensityReason: 'Progressive loading across different rep ranges.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase weight progressively',
              description: 'Each set should challenge you at the target rep range.'
            },
            {
              icon: 'body',
              title: 'Feel the chest working',
              description: 'Mind-muscle connection is crucial for isolation work.'
            }
          ]
        },
        {
          name: 'Ladder',
          duration: '14–15 min',
          description: 'Wide-to-close grip fly ladder for full fiber recruitment.',
          battlePlan: '3 rounds:\n• 12 pec dec fly\n• 8 chest press (immediately after)\n• 10 push-ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/5hd3my3c_pdm.webp',
          intensityReason: 'Pre-exhaustion protocol using pec dec to fatigue chest.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'No rest between exercises',
              description: 'Move immediately from pec dec to pressing movements.'
            },
            {
              icon: 'flash',
              title: 'Push through fatigue',
              description: 'Chest will be pre-fatigued, focus on quality reps.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'AMRAP',
          duration: '10 min',
          description: 'Max pec deck fly reps in 10 minutes for burnout.',
          battlePlan: '3 rounds:\n• 10 heavy pec dec\n• Drop → 12 moderate\n• Drop → 15 light\n• 8 chest press\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/rf17lbcl_pmd2.jpg',
          intensityReason: 'Advanced drop set protocol maximizing chest isolation.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Quick weight adjustments',
              description: 'Minimize rest time between drop set weights.'
            },
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics even under fatigue for maximum growth.'
            }
          ]
        },
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Fly variations including rear delt and single-arm for chest/shoulder isolation.',
          battlePlan: '2 rounds:\n• 20 pec dec fly\n• 15 chest press\n• 20 pec dec fly\n• Max push-ups\nRest 2–3 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/5hd3my3c_pdm.webp',
          intensityReason: 'High-volume pec dec finisher for maximum chest pump.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'flash',
              title: 'Push through the burn',
              description: 'Mental toughness required for high-volume training.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable crossover',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Fly Circuit',
          duration: '12–14 min',
          description: 'Cable flys at standing and low-to-high angles for tension and stretch.',
          battlePlan: '3 rounds:\n• 10 cable fly (high position)\n• 10 cable fly (low position)\n• 8 cable press\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/4tqfn8rc_download.png',
          intensityReason: 'Perfect introduction to cable chest training with angles.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Adjust cable height for target area',
              description: 'High = upper chest, mid = middle chest, low = lower chest.'
            },
            {
              icon: 'body',
              title: 'Maintain slight forward lean',
              description: 'Stable stance with one foot forward for balance.'
            }
          ]
        },
        {
          name: 'Press Circuit',
          duration: '12–14 min',
          description: 'Standing and single-arm presses with cables for chest isolation.',
          battlePlan: '3 rounds:\n• 10 standing cable press\n• 8 single-arm cable press (each arm)\n• 10 cable fly\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/cvzywaoh_download%20%281%29.png',
          intensityReason: 'Functional cable training combining bilateral and unilateral work.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Engage core throughout',
              description: 'Standing position requires core stability for balance.'
            },
            {
              icon: 'flash',
              title: 'Control the cables',
              description: 'Smooth movement prevents momentum and maximizes tension.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Fly Ladder',
          duration: '14–16 min',
          description: 'High-to-low, low-to-high, and mid flys to hit pecs at every line.',
          battlePlan: '3 rounds:\n• 8 high cable fly\n• 8 mid cable fly\n• 8 low cable fly\n• 10 cable press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/4tqfn8rc_download.png',
          intensityReason: 'Comprehensive cable training targeting all chest angles.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Different angles target different fibers',
              description: 'High = upper, mid = middle, low = lower chest emphasis.'
            },
            {
              icon: 'refresh',
              title: 'Smooth transitions between angles',
              description: 'Keep muscles under constant tension for growth stimulus.'
            }
          ]
        },
        {
          name: 'Press & Fly',
          duration: '14–16 min',
          description: 'Press, fly, and single-arm fly sequence for hypertrophy density.',
          battlePlan: '3 rounds:\n• 8 explosive cable press\n• 10 single-arm cable fly\n• 8 cable punches\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/cvzywaoh_download%20%281%29.png',
          intensityReason: 'Power-focused cable training with explosive movements.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive press with control',
              description: 'Fast concentric, controlled eccentric for power development.'
            },
            {
              icon: 'fitness',
              title: 'Cable punches: Full extension',
              description: 'Drive through chest and maintain core stability.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Multi-plane cable presses and flys for total pec tension.',
          battlePlan: '3 rounds:\n• 8 heavy cable fly (all angles)\n• Drop → 10 moderate\n• Drop → 12 light\n• 8 cable press\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/4tqfn8rc_download.png',
          intensityReason: 'Advanced drop set training with constant cable tension.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Time under tension focus',
              description: 'Slow eccentrics on drop sets for maximum muscle growth.'
            },
            {
              icon: 'flash',
              title: 'Peak contraction emphasis',
              description: 'Hold squeeze for 1s at peak contraction on every rep.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–18 min',
          description: 'Heavy-to-light flys with holds for deep chest pump.',
          battlePlan: '2 rounds:\n• 15 high cable fly\n• 15 mid cable fly\n• 15 low cable fly\n• 10 cable press\nRest 2–3 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/cvzywaoh_download%20%281%29.png',
          intensityReason: 'High-volume cable finisher for maximum chest pump.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Maintain perfect form',
              description: 'Even under fatigue, prioritize form over speed.'
            },
            {
              icon: 'body',
              title: 'Feel the chest working',
              description: 'Mind-muscle connection crucial for high-volume training.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dip station',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dips',
          duration: '12–14 min',
          description: 'Assisted dips and bench dips for beginner chest activation.',
          battlePlan: '3 rounds:\n• 8 assisted dips (use band or machine)\n• 10 bench dips\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/sudzdwsx_download%20%283%29.png',
          intensityReason: 'Perfect introduction to dip movements with assistance.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lean slightly forward',
              description: 'Engage chest more than triceps during the movement.'
            },
            {
              icon: 'trending-down',
              title: 'Control the descent',
              description: 'Lower slowly to protect shoulders and maximize muscle activation.'
            }
          ]
        },
        {
          name: 'Dip & Push-Up',
          duration: '10–12 min',
          description: 'Dips and push-ups paired for chest pump endurance.',
          battlePlan: '3 rounds:\n• 6 assisted dips\n• 8 bench dips\n• 10 push-ups\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/i8tbsgyh_download%20%284%29.png',
          intensityReason: 'Progressive dip training with complementary movements.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Use assistance as needed',
              description: 'Gradually reduce assistance as strength improves.'
            },
            {
              icon: 'flash',
              title: 'Focus on chest engagement',
              description: 'Feel the stretch and contraction in chest muscles.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Dip Ladder',
          duration: '14–15 min',
          description: 'Standard, elevated, and negative dips for progressive overload.',
          battlePlan: '4 rounds:\n• 8 bodyweight dips\n• 10 bench dips\n• 8 diamond push-ups\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/sudzdwsx_download%20%283%29.png',
          intensityReason: 'Intermediate bodyweight dip training with supporting movements.',
          moodTips: [
            {
              icon: 'body',
              title: 'Maintain forward lean',
              description: 'Keep chest engaged throughout entire range of motion.'
            },
            {
              icon: 'fitness',
              title: 'Full range of motion',
              description: 'Lower until shoulders are below elbows, press to full extension.'
            }
          ]
        },
        {
          name: 'Dip & Plyo',
          duration: '15 min',
          description: 'Dips and plyo push-ups combined for strength and power.',
          battlePlan: '3 rounds:\n• 6 explosive dips\n• 8 controlled dips\n• 10 incline push-ups\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/i8tbsgyh_download%20%284%29.png',
          intensityReason: 'Power-focused dip training combining explosive and control.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive up, controlled down',
              description: 'Drive up with maximum intent, control the descent.'
            },
            {
              icon: 'timer',
              title: 'Quality over quantity',
              description: 'Perfect form is more important than speed.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Dips',
          duration: '10 min',
          description: 'Max dips in 10 minutes, adding weight if possible.',
          battlePlan: '3 rounds:\n• 8 weighted dips\n• 10 bodyweight dips\n• 12 bench dips\n• 10 push-ups\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/sudzdwsx_download%20%283%29.png',
          intensityReason: 'Advanced weighted dip complex with descending difficulty.',
          moodTips: [
            {
              icon: 'construct',
              title: 'Start with appropriate weight',
              description: 'Add weight gradually as strength improves over time.'
            },
            {
              icon: 'shield',
              title: 'Warm up thoroughly',
              description: 'Heavy dips require proper shoulder and chest preparation.'
            }
          ]
        },
        {
          name: 'Complex',
          duration: '15–18 min',
          description: 'Dips, push-ups, plyo push-ups, and negatives for chest finishing burnout.',
          battlePlan: '2 rounds:\n• Max bodyweight dips\n• 20 bench dips\n• 15 diamond push-ups\n• 20 regular push-ups\nRest 2–3 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/i8tbsgyh_download%20%284%29.png',
          intensityReason: 'Advanced endurance challenge testing maximum dip capacity.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pace yourself on max set',
              description: 'Start strong but maintain form throughout.'
            },
            {
              icon: 'refresh',
              title: 'Mental toughness required',
              description: 'Push through fatigue while maintaining perfect form.'
            }
          ]
        }
      ]
    }
  }
];
