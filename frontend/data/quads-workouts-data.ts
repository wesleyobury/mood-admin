import { EquipmentWorkouts } from '../types/workout';

export const quadsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Barbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Barbell Sissy Squat',
          duration: '10–12 min',
          description: 'Front held bar guides posture as quads take full load',
          battlePlan: '3 rounds\n• 10–12 Light Barbell Sissy Squats\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Teaches quad isolation through knee forward motion',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold bar against hips, elbows tucked in',
              description: 'Proper bar position maintains stability during quad isolation.'
            },
            {
              icon: 'trending-down',
              title: 'Lean back, knees push forward smoothly',
              description: 'Knee-forward motion maximizes quad activation while maintaining control.'
            }
          ]
        },
        {
          name: 'Assisted Sissy Squat Hold',
          duration: '10–12 min',
          description: 'Static hold reinforces posture and leg strength',
          battlePlan: '3 rounds\n• 6–8 Sissy Squats\n• Add 10s Hold each set\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Iso hold at squat bottom builds quad endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'At bottom hold position for 10s',
              description: 'Extended hold at bottom position builds isometric quad strength.'
            },
            {
              icon: 'flash',
              title: 'Drive knees forward, chest upright',
              description: 'Proper positioning ensures maximum quad engagement during hold.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Weighted Sissy Squat',
          duration: '14–16 min',
          description: 'Adds weight to sissy squat for deeper hypertrophy',
          battlePlan: '4 rounds\n• 8–10 Weighted Sissy Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3hob85xt_download%20%2822%29.png',
          intensityReason: 'Front bar load progression maximizes quad stress',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold bar firm at hip hinge crease',
              description: 'Secure bar position allows for controlled weighted movement.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, heels flat anchored',
              description: 'Controlled movement with stable base maximizes quad activation.'
            }
          ]
        },
        {
          name: 'Sissy Squat 1½ Reps',
          duration: '14–16 min',
          description: 'High tension squatting style grows endurance fast',
          battlePlan: '3 rounds\n• 8 Combo Reps (half + full = 1)\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Half+full rep sequence lengthens quad activation',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform half rep, then full as one',
              description: 'Complex rep pattern extends time under tension for quads.'
            },
            {
              icon: 'construct',
              title: 'Keep bar tight, don\'t roll forward',
              description: 'Maintain bar position and posture throughout complex movement.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Hack Squat',
          duration: '16–18 min',
          description: 'Upright torso hack squat builds quads with tension',
          battlePlan: '4 rounds\n• 8–10 Hack Squats\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/3hob85xt_download%20%2822%29.png',
          intensityReason: 'Behind back hold redirects load heavily to quads',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar low behind legs, shoulders tall',
              description: 'Proper bar positioning ensures maximum quad emphasis.'
            },
            {
              icon: 'flash',
              title: 'Drive knees forward over toes steady',
              description: 'Forward knee drive maintains quad focus throughout movement.'
            }
          ]
        },
        {
          name: 'Sissy + Hack Squat Combo',
          duration: '16–18 min',
          description: 'Dual movement combo overloads quads with fatigue',
          battlePlan: '3 rounds\n• 6 Front Hold Sissy Squats\n• 6 Barbell Hack Squats\nRest 120s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/sjqdvile_bbss.jpg',
          intensityReason: 'Pairing front and back styles crushes quad fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Do sissy squats first to pre fatigue',
              description: 'Pre-fatigue strategy maximizes quad overload in combination.'
            },
            {
              icon: 'flash',
              title: 'Transition fast to hack squats next',
              description: 'Quick transition maintains fatigue for maximum quad stress.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Leg Extension Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Standard Leg Extension',
          duration: '10–12 min',
          description: 'Perfect intro for building controlled quad strength',
          battlePlan: '3 rounds\n• 12–15 Leg Extensions\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Isolates quads through safe guided flexion path',
          moodTips: [
            {
              icon: 'body',
              title: 'Sit upright with back pressed tight',
              description: 'Proper seating position ensures isolated quad activation.'
            },
            {
              icon: 'construct',
              title: 'Kick straight, avoid locking knees',
              description: 'Controlled extension prevents joint stress while targeting quads.'
            }
          ]
        },
        {
          name: 'Iso Extension Hold',
          duration: '10–12 min',
          description: 'Builds mind muscle connection through iso tension',
          battlePlan: '3 rounds\n• 8–10 Iso Hold Extensions (3s hold)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Holding peak strengthens quads safely under load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Extend, hold 3s peak contraction',
              description: 'Isometric hold at peak builds strength and muscle control.'
            },
            {
              icon: 'construct',
              title: 'Lower pad smooth each rep',
              description: 'Controlled eccentric maximizes quad development.'
            }
          ]
        },
        {
          name: 'Controlled Leg Extension',
          duration: '10–12 min',
          description: 'Smooth extensions building basic quad control',
          battlePlan: '3 rounds\n• 12–15 Leg Extensions\nRest 60–75s',
          imageUrl: '',
          intensityReason: 'Controlled movement builds foundational quad strength',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Light load first',
              description: 'Prioritize control before increasing weight.'
            },
            {
              icon: 'resize',
              title: 'Full knee extension',
              description: 'Lock out gently to fully shorten quads.'
            },
            {
              icon: 'timer',
              title: 'Slow return down',
              description: 'Control keeps tension on the muscle.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Heavy Extensions',
          duration: '14–16 min',
          description: 'Machine allows safe overload using strict form',
          battlePlan: '4 rounds\n• 8–10 Heavy Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Progressive heavy loading maximizes quad growth',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Grip handles tight to stabilize',
              description: 'Secure grip maintains stability for heavy quad extensions.'
            },
            {
              icon: 'flash',
              title: 'Drive pad up forceful, control back',
              description: 'Explosive concentric with controlled eccentric builds strength.'
            }
          ]
        },
        {
          name: '1½ Rep Leg Extensions',
          duration: '14–16 min',
          description: 'Longer muscle strain increases hypertrophy response',
          battlePlan: '3 rounds\n• 8–10 Total Combo Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Half+full rep cycle expands quad time under load',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform one half + one full rep',
              description: 'Complex rep pattern extends time under tension significantly.'
            },
            {
              icon: 'construct',
              title: 'Keep tempo smooth, don\'t drop pad',
              description: 'Controlled movement maintains tension throughout range.'
            }
          ]
        },
        {
          name: 'Pause Leg Extension',
          duration: '12–14 min',
          description: 'Paused reps reinforcing peak quad contraction',
          battlePlan: '4 rounds\n• 10 Extensions (2s pause at top)\nRest 90s',
          imageUrl: '',
          intensityReason: 'Paused contractions maximize quad activation',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause at lockout',
              description: 'Two-second hold intensifies quad activation.'
            },
            {
              icon: 'footsteps',
              title: 'Toes slightly up',
              description: 'Encourages quad dominance.'
            },
            {
              icon: 'construct',
              title: 'Controlled eccentric',
              description: 'No dropping the weight stack.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Drop Set Leg Extensions',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 10 Heavy Extensions\n• Drop 15–20% → 8 reps\n• Drop 15–20% → 8 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/er89oli2_download%20%2823%29.png',
          intensityReason: 'Dropsets extend effort for intense quad overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Strip 15–20% weight fast',
              description: 'Quick weight reduction maintains fatigue for maximum benefit.'
            },
            {
              icon: 'construct',
              title: 'Don\'t rush, keep controlled tempo',
              description: 'Maintain movement quality throughout all drop sets.'
            }
          ]
        },
        {
          name: 'Leg Extension Iso Burnout',
          duration: '16–18 min',
          description: 'Pairing holds with reps completely crushes quads',
          battlePlan: '3 rounds\n• 10s Iso Hold at Extension\n• Immediately 10–12 Full Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/6hwlna7o_quad%20ext.png',
          intensityReason: 'Static hold plus reps maximizes quad endurance',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold pad high for 10s, then rep out',
              description: 'Isometric hold followed by reps creates maximum quad fatigue.'
            },
            {
              icon: 'shield',
              title: 'No bouncing pad into stack',
              description: 'Controlled movement prevents equipment damage and injury.'
            }
          ]
        }
      ]
    }
  }
];
