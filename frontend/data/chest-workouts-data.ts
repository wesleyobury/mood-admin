import { EquipmentWorkouts } from '../types/workout';

export const chestWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Flat bench',
    icon: 'square',
    workouts: {
      beginner: [
        {
          name: 'Push-Up Circuit',
          duration: '10–12 min',
          description: 'Push-ups and dips using the bench to build beginner chest strength and control.',
          battlePlan: '3 rounds:\n• 10 push-ups (hands on bench)\n• 10 bench dips\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Perfect bench-assisted introduction to chest and tricep strength.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Push-ups: Lower slow, drive up hard',
              description: 'Squeeze pecs together at the top. Think "push the floor apart."'
            },
            {
              icon: 'body',
              title: 'Dips: Keep chest slightly forward',
              description: 'Shift load onto pecs vs. triceps for better chest activation.'
            }
          ]
        },
        {
          name: 'Chest Press',
          duration: '12–15 min',
          description: 'Light bench press and fly pairing to develop chest contraction and stretch.',
          battlePlan: '3 rounds:\n• 12 light dumbbell or Smith bench press\n• 10 dumbbell bench fly\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Beginner-friendly pressing and isolation movement foundation.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bench press: Drag elbows slightly in',
              description: 'Move toward midline as you press for max pec activation.'
            },
            {
              icon: 'body',
              title: 'Fly: Focus on stretching fibers',
              description: 'Stretch at bottom, then forcefully contract chest to bring dumbbells together.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Plyo Push-Ups',
          duration: '14–16 min',
          description: 'Explosive push-ups and single-arm presses for power and unilateral strength.',
          battlePlan: '4 rounds:\n• 8 explosive push-ups (hands on bench)\n• 10 single-arm bench press\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Explosive plyometric training with unilateral strength development.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Push off with max intent',
              description: 'Builds fast-twitch fiber recruitment for growth every rep.'
            },
            {
              icon: 'fitness',
              title: 'Single-arm press: Lock shoulders down',
              description: 'Bring dumbbell in slight inward arc to increase inner-chest tension.'
            }
          ]
        },
        {
          name: 'Chest Flow',
          duration: '12–15 min',
          description: 'Bench press, fly, and close-grip sequence for balanced chest hypertrophy.',
          battlePlan: '3 rounds:\n• 10 bench press\n• 10 fly\n• 10 close-grip bench press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'Continuous flow training for chest overload and development.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Fly → press transition, don\'t rest',
              description: 'Overloads pecs by hitting both stretch and contraction.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Press palms inward',
              description: 'Into bar/dumbbells to increase pec activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Bench Complex',
          duration: '15–18 min',
          description: 'Multi-move complex combining presses, flys, push-ups, and dips for overload.',
          battlePlan: '3 rounds:\n• 8 bench press\n• 8 bench fly\n• 8 plyo push-ups (hands on bench)\n• 8 dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/hs5s9gux_download%20%286%29.png',
          intensityReason: 'Advanced complex training for maximum chest development.',
          moodTips: [
            {
              icon: 'timer',
              title: 'Bench press: Use slight pause at bottom',
              description: 'Kill momentum and force pec drive for better activation.'
            },
            {
              icon: 'trending-down',
              title: 'Dips: Lean forward, chest toward floor',
              description: 'Shifts tension from triceps into pec stretch/contraction.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–20 min',
          description: 'Heavy-to-light drop set presses to maximize fatigue and muscle growth.',
          battlePlan: '2 rounds:\n• 10 heavy bench press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/1yb66xch_download%20%285%29.png',
          intensityReason: 'High-intensity drop sets for advanced muscle failure.',
          moodTips: [
            {
              icon: 'shield',
              title: 'Keep reps 0–1 shy of failure',
              description: 'Maximize recruitment without burnout for optimal results.'
            },
            {
              icon: 'speedometer',
              title: 'Lighter sets: slow eccentric',
              description: '3s descent to maximize muscle tension and growth.'
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
          name: 'Push-Up Circuit',
          duration: '10–12 min',
          description: 'Incline push-ups and presses to target upper chest endurance.',
          battlePlan: '3 rounds:\n• 10 incline push-ups\n• 10 light incline bench press\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Perfect introduction to upper chest development training.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push-ups: Push through hands',
              description: 'As if you\'re "wrapping chest around ribcage" for better activation.'
            },
            {
              icon: 'trending-up',
              title: 'Incline press: Bring bar/bells below clavicles',
              description: 'Elbows just inside wrists for better upper pec stretch.'
            }
          ]
        },
        {
          name: 'Chest Press',
          duration: '12–15 min',
          description: 'Incline press and fly combo for upper pec activation.',
          battlePlan: '3 rounds:\n• 12 incline bench press (light)\n• 10 incline fly\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Beginner incline pressing and isolation combination.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Exhale and squeeze pecs hard',
              description: 'As dumbbells come together; imagine bringing elbows to midline.'
            },
            {
              icon: 'construct',
              title: 'Keep bench angle at ~30°',
              description: 'To avoid shoulder takeover and maximize chest activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Plyo Push-Ups',
          duration: '14–16 min',
          description: 'Plyo push-ups and single-arm presses for explosive upper chest strength.',
          battlePlan: '4 rounds:\n• 8 incline plyo push-ups\n• 10 single-arm incline press\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Explosive training for intermediate upper chest power.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plyo push-ups: Think "fast hands"',
              description: 'Maximal intent recruits more fibers for better development.'
            },
            {
              icon: 'trending-up',
              title: 'Single-arm press: Press toward midline',
              description: 'Not straight up, for maximum pec contraction and activation.'
            }
          ]
        },
        {
          name: 'Chest Flow',
          duration: '12–15 min',
          description: 'Incline press, fly, and close-grip press sequence for growth density.',
          battlePlan: '3 rounds:\n• 10 incline bench press\n• 10 incline fly\n• 10 close-grip incline press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'Continuous flow training for upper chest overload.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Minimal rest transitions overload pecs',
              description: 'Forces metabolic stress, a key growth driver for muscle development.'
            },
            {
              icon: 'hand-left',
              title: 'Close-grip: Apply inward force',
              description: 'On dumbbells/bar to emphasize chest squeeze and contraction.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Incline Complex',
          duration: '15–18 min',
          description: 'Press, fly, push-ups, and dips for complete incline overload.',
          battlePlan: '3 rounds:\n• 8 incline bench press\n• 8 incline fly\n• 8 incline plyo push-ups\n• 8 dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/jz7j4fdt_download%20%287%29.png',
          intensityReason: 'Advanced complex training for maximum upper chest development.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Incline presses: Drive bar/dumbbells',
              description: 'In straight bar path angled slightly toward nose for max chest fiber alignment.'
            },
            {
              icon: 'body',
              title: 'Dips: Aim chin slightly down',
              description: 'Chest forward, elbows flared slightly = deep pec stretch and activation.'
            }
          ]
        },
        {
          name: 'Drop Set',
          duration: '16–20 min',
          description: 'Heavy-to-light incline presses for maximum fatigue and hypertrophy.',
          battlePlan: '2 rounds:\n• 10 heavy incline press\n• Drop → 10 moderate\n• Drop → 10 light\nRest 90–120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-img-update/artifacts/lnd9yph3_ibp.webp',
          intensityReason: 'High-intensity incline drop sets for advanced hypertrophy.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explosive concentric on heavy sets',
              description: 'On light sets, slow eccentric + peak contraction squeeze for growth.'
            },
            {
              icon: 'shield',
              title: 'Keep scapula pinned',
              description: 'Don\'t let shoulders roll forward under fatigue for safety and effectiveness.'
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
