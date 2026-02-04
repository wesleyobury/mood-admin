import { EquipmentWorkouts } from '../types/workout';

export const calvesWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Standing DB Calf Raise',
          duration: '10–12 min',
          description: 'Simple standing lift for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/ag6d909x_download%20%2828%29.png',
          intensityReason: 'Basic raise builds calf strength with controlled range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold dumbbells, stand tall, rise high',
              description: 'Proper posture and maximum range ensure effective calf activation.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Controlled eccentric maximizes muscle development and safety.'
            }
          ]
        },
        {
          name: 'Seated DB Calf Raise',
          duration: '10–12 min',
          description: 'Targets deeper calf muscle with stable seated form',
          battlePlan: '3 rounds\n• 12–15 Seated Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Seated position isolates soleus muscle for growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Place DB on knee, press through ball of foot',
              description: 'Proper weight placement ensures targeted soleus activation.'
            },
            {
              icon: 'shield',
              title: 'Control stretch, avoid bouncing weight',
              description: 'Smooth movement prevents injury and maintains muscle tension.'
            }
          ]
        },
        {
          name: 'Dumbbell Supported Calf Raise',
          duration: '8–10 min',
          description: 'Assisted calf raises improving balance and control',
          battlePlan: '3 rounds\n• 15 Raises\nRest 60s',
          imageUrl: '',
          intensityReason: 'Supported position allows focus on calf activation',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Hold support lightly',
              description: 'Balance aid only.'
            },
            {
              icon: 'resize',
              title: 'Full heel drop',
              description: 'Stretch calves completely.'
            },
            {
              icon: 'timer',
              title: 'Slow tempo',
              description: 'Improves mind–muscle connection.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg DB Calf Raise',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/comj9q78_download%20%284%29.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'Hold DB opposite working leg, use wall for balance',
              description: 'Strategic weight placement and support optimize single-leg training.'
            },
            {
              icon: 'shield',
              title: 'Rise high, control stretch, no bouncing',
              description: 'Full range with control maximizes unilateral calf development.'
            }
          ]
        },
        {
          name: 'DB Calf Raise (Tempo + Bodyweight)',
          duration: '14–16 min',
          description: 'Controlled tempo builds endurance and hypertrophy',
          battlePlan: '3 rounds\n• 10–12 Tempo Calf Raises\n• • Immediately 15 Bodyweight Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Slow eccentric phase maximizes calf time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: '3s lowering, 1s hold top, 1s up',
              description: 'Strict tempo control maximizes muscle activation and growth.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training stimulus beyond failure.'
            }
          ]
        },
        {
          name: 'Dumbbell Single-Leg Calf Raise',
          duration: '10–12 min',
          description: 'Unilateral raises increasing calf loading',
          battlePlan: '4 rounds\n• 10 Raises per leg\nRest 75s',
          imageUrl: '',
          intensityReason: 'Single-leg work doubles effective load per calf',
          moodTips: [
            {
              icon: 'body',
              title: 'Non-working leg off floor',
              description: 'One calf does all work.'
            },
            {
              icon: 'timer',
              title: 'Pause at lockout',
              description: 'Peak contraction emphasis.'
            },
            {
              icon: 'shield',
              title: 'Control balance first',
              description: 'Stability before weight.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'DB Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/ag6d909x_download%20%2828%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick weight reduction maintains fatigue for maximum benefit.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout drops ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'DB Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1iqoqmt3_download%20%2829%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Isometric hold maximizes muscle tension and metabolic stress.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Standing Barbell Calf Raise',
          duration: '10–12 min',
          description: 'Classic standing raise for overall calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Barbell load builds foundational calf strength',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Bar on traps, stand tall, rise high',
              description: 'Proper bar position and posture maximize calf activation safely.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Full range of motion maximizes muscle development.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Elevated)',
          duration: '10–12 min',
          description: 'Plate under toes enhances calf muscle activation',
          battlePlan: '3 rounds\n• 12–15 Elevated Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Elevated toes increase stretch for deeper range',
          moodTips: [
            {
              icon: 'construct',
              title: 'Stand on 1–2" plate, heels off edge',
              description: 'Elevated position increases range for deeper calf stretch.'
            },
            {
              icon: 'flash',
              title: 'Control stretch, rise high on toes',
              description: 'Extended range maximizes muscle activation and development.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Barbell Calf Raise',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '4 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends stimulus beyond normal capacity.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Tempo)',
          duration: '14–16 min',
          description: 'Controlled tempo builds endurance and hypertrophy',
          battlePlan: '3 rounds\n• 10–12 Tempo Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Slow eccentric phase maximizes calf time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: '3s lowering, 1s hold top, 1s up',
              description: 'Tempo control maximizes time under tension for growth.'
            },
            {
              icon: 'construct',
              title: 'Keep full range, don\'t cut reps short',
              description: 'Complete range of motion ensures maximum muscle activation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Barbell Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/vfevelz1_download%20%2824%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick transitions maintain fatigue for maximum overload.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'Barbell Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/xf7sknhj_download%20%2825%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended isometric maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Leg Press Machine',
    icon: 'hardware-chip',
    workouts: {
      beginner: [
        {
          name: 'Leg Press Calf Raise (Neutral)',
          duration: '10–12 min',
          description: 'Basic press for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/jwime8o9_download%20%2830%29.png',
          intensityReason: 'Machine guidance builds calf strength safely',
          moodTips: [
            {
              icon: 'construct',
              title: 'Feet shoulder width, toes on bottom edge',
              description: 'Proper foot placement ensures optimal calf activation angle.'
            },
            {
              icon: 'flash',
              title: 'Press through balls of feet, full stretch',
              description: 'Complete range maximizes calf muscle development.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise (Toes Out)',
          duration: '10–12 min',
          description: 'Foot angle variation for balanced calf growth and stimulation',
          battlePlan: '3 rounds\n• 12–15 Toes Out Calf Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Toes out stance targets inner calf muscle fibers',
          moodTips: [
            {
              icon: 'construct',
              title: 'Toes pointed out 45°, heels off edge',
              description: 'Angled foot position targets different calf muscle fibers.'
            },
            {
              icon: 'flash',
              title: 'Control stretch, rise high on toes',
              description: 'Full range with angle variation maximizes muscle activation.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg Press Calf Raise',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/kwq6qti7_Screenshot%202025-12-06%20at%209.20.46%E2%80%AFPM.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'One foot on platform, other off',
              description: 'Single-leg setup doubles load and improves balance.'
            },
            {
              icon: 'flash',
              title: 'Press through ball of foot, full stretch',
              description: 'Complete range ensures maximum unilateral development.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '3 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training beyond machine capacity.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Leg Press Calf Raise (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/jwime8o9_download%20%2830%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick weight reduction maintains fatigue for benefit.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout drops ensures effectiveness.'
            }
          ]
        },
        {
          name: 'Leg Press Calf Raise (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/02ysdj6y_download%20%2831%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended hold maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Calf Raise Machine',
    icon: 'arrow-up',
    workouts: {
      beginner: [
        {
          name: 'Standing Calf Raise Machine',
          duration: '10–12 min',
          description: 'Basic standing raise for foundational calf development',
          battlePlan: '3 rounds\n• 15–20 Standing Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/kh18cxcw_Screenshot%202025-12-06%20at%209.24.28%E2%80%AFPM.png',
          intensityReason: 'Machine guidance builds calf strength safely',
          moodTips: [
            {
              icon: 'body',
              title: 'Stand tall, rise high on toes',
              description: 'Proper posture ensures maximum calf activation with machine guidance.'
            },
            {
              icon: 'trending-down',
              title: 'Control descent, feel full stretch low',
              description: 'Full range of motion maximizes muscle development safely.'
            }
          ]
        },
        {
          name: 'Seated Calf Raise Machine',
          duration: '10–12 min',
          description: 'Targets deeper calf muscle with stable seated form',
          battlePlan: '3 rounds\n• 12–15 Seated Calf Raises\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Seated position isolates soleus muscle for growth',
          moodTips: [
            {
              icon: 'construct',
              title: 'Pad on knees, press through ball of foot',
              description: 'Proper pad placement ensures targeted soleus activation.'
            },
            {
              icon: 'shield',
              title: 'Control stretch, avoid bouncing weight',
              description: 'Smooth movement maintains tension and prevents injury.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Single‑Leg Calf Raise Machine',
          duration: '14–16 min',
          description: 'Isolates each calf for balanced strength and size',
          battlePlan: '4 rounds\n• 10–12 per leg Single‑Leg Raises\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/97bkhdmm_Screenshot%202025-12-06%20at%209.25.30%E2%80%AFPM.png',
          intensityReason: 'Unilateral raise increases load and balance demand',
          moodTips: [
            {
              icon: 'construct',
              title: 'One foot on platform, other off',
              description: 'Single-leg setup doubles training load for each calf.'
            },
            {
              icon: 'flash',
              title: 'Press through ball of foot, full stretch',
              description: 'Complete range ensures maximum unilateral development.'
            }
          ]
        },
        {
          name: 'Calf Raise Machine',
          duration: '14–16 min',
          description: 'Builds strength and control through isometric hold',
          battlePlan: '3 rounds\n• 10–12 Pause Calf Raises\n• Immediately 15 Bodyweight Calf Raises\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Pause at top maximizes peak contraction tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 2s at peak contraction',
              description: 'Isometric hold builds strength and muscle control.'
            },
            {
              icon: 'flash',
              title: 'Finish with quick bodyweight reps',
              description: 'High-rep finisher extends training beyond machine limit.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Calf Raise Machine (Drop Set)',
          duration: '16–18 min',
          description: 'Stripping load forces fibers to contract under fatigue',
          battlePlan: '3 rounds\n• 12 Heavy Calf Raises\n• Drop 15–20% → 10 reps\n• Drop 15–20% → 10 reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/1jerzr2s_download%20%2827%29.png',
          intensityReason: 'Drop sets extend effort for intense calf overload',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drop 15–20% weight fast, keep going',
              description: 'Quick transitions maintain fatigue for maximum overload.'
            },
            {
              icon: 'construct',
              title: 'Maintain full range across all drops',
              description: 'Consistent form throughout ensures continued effectiveness.'
            }
          ]
        },
        {
          name: 'Calf Raise Machine (Iso + Jumps)',
          duration: '16–18 min',
          description: 'Combo reps with iso hold completely crushes calves',
          battlePlan: '3 rounds\n• 12–15 Calf Raises\n• Finish with 10s Iso Hold at top\n• Immediately 10 Stiff Leg Jumps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/tp1piceg_download%20%2826%29.png',
          intensityReason: 'Static hold at peak contraction maximizes tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold peak contraction 10s on last rep',
              description: 'Extended isometric maximizes metabolic stress on calves.'
            },
            {
              icon: 'flash',
              title: 'Explode into jumps, land soft on balls',
              description: 'Plyometric finish develops power and completes muscle fatigue.'
            }
          ]
        }
      ]
    }
  }
];
