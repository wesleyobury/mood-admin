import { EquipmentWorkouts } from '../types/workout';

export const tricepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbell',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Flat DB Ext',
          duration: '10–12 min',
          description: 'Lying dumbbell extensions build safe, strict strength',
          battlePlan: '3 rounds\n• 10–12 Flat Bench DB Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/d78e5qae_fdbsc.webp',
          intensityReason: 'Stable flat bench isolates movement to triceps only',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flat bench support reduces back strain and keeps core relaxed',
              description: 'Lower DBs behind head for stretch, extend arms fully each rep.'
            },
            {
              icon: 'body',
              title: 'Keep elbows fixed upward, no drifting outward during press',
              description: 'Fixed elbow position maximizes tricep isolation.'
            }
          ]
        },
        {
          name: 'Incline DB Ext',
          duration: '10–12 min',
          description: 'Extended angle overhead hits fibers more intensely',
          battlePlan: '3 rounds\n• 10–12 Incline Overhead DB Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/nworhx1b_idbsc.webp',
          intensityReason: 'Incline bench increases stretch on long triceps head',
          moodTips: [
            {
              icon: 'body',
              title: 'Incline bench places arms behind torso for deeper stretch',
              description: 'Keep elbows fixed upward, no drifting outward during press.'
            },
            {
              icon: 'timer',
              title: 'Control descent 3s, then snap lockout for crisp contraction',
              description: 'Controlled eccentric movement builds strength and prevents injury.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Eccentric Incline Ext',
          duration: '12–14 min',
          description: 'Incline bench enhances stretch with eccentric focus',
          battlePlan: '4 rounds\n• 8–10 Incline Overhead DB Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Three second negatives reinforce hypertrophy load',
          moodTips: [
            {
              icon: 'flash',
              title: 'Use incline bench to safely deepen long head under load',
              description: 'Control descent 3s, then snap lockout for crisp contraction.'
            },
            {
              icon: 'shield',
              title: 'Pause 1–2s at bottom before powering extension upward',
              description: 'Stable torso ensures triceps handle all resistance.'
            }
          ]
        },
        {
          name: 'Pause Skull Crusher',
          duration: '12–14 min',
          description: 'Incline position plus pause extends hypertrophy work',
          battlePlan: '3 rounds\n• 8–10 Incline Skull Crushers w/2s Pause\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Skull crushers with pause build stronger end range',
          moodTips: [
            {
              icon: 'timer',
              title: 'Incline bench increases elbow flex angle for greater loading',
              description: 'Pause 1–2s at bottom before powering extension upward.'
            },
            {
              icon: 'fitness',
              title: 'Switch quickly to keep constant pressure on muscles',
              description: 'Fixed elbows ensure triceps do all the work.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ext Superset',
          duration: '14–16 min',
          description: 'Two extension positions maximize complete training',
          battlePlan: '4 rounds\n• 8 Flat DB Extensions\nRest 60s\n• 8 Incline Skull Crushers\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Flat and incline superset hits triceps from angles',
          moodTips: [
            {
              icon: 'shield',
              title: 'Flat bench = stability; incline = deeper stretch and fiber hit',
              description: 'Switch quickly to keep constant pressure on muscles.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows locked narrow both variations',
              description: 'Feel the muscle working through full range.'
            }
          ]
        },
        {
          name: 'Iso Burn Ext',
          duration: '16–18 min',
          description: 'Incline curl then isometric hold finishes triceps hard',
          battlePlan: '4 rounds\n• 8 Incline Overhead Extensions (3s eccentric)\n• 8 Incline Skull Crushers\n• End with 10s Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Superset with eccentric and iso hold maximizes load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Combine deep incline stretch with slow eccentric lowering',
              description: 'Finish every round with a 10s mid extension iso hold.'
            },
            {
              icon: 'flame',
              title: 'Control bar path entire round',
              description: 'Mental toughness through metabolic stress builds strength.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettle bell',
    icon: 'diamond',
    workouts: {
      beginner: [
        {
          name: 'Flat KB Ext',
          duration: '10–12 min',
          description: 'Beginner kettlebell extensions build pressing base',
          battlePlan: '3 rounds\n• 10–12 Flat Bench KB Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Flat bench keeps posture stable, isolating triceps',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Flat bench stability prevents arching and strict isolates arms',
              description: 'Lower bell behind head, drive up until full elbow lockout.'
            },
            {
              icon: 'body',
              title: 'Keep elbows aligned upward, resist flaring outward',
              description: 'Fixed elbow position despite challenging grip.'
            }
          ]
        },
        {
          name: 'Incline KB Ext',
          duration: '10–12 min',
          description: 'Incline position loads arms with deeper extension',
          battlePlan: '3 rounds\n• 10–12 Incline Overhead KB Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Incline angle extends stretch on long triceps head',
          moodTips: [
            {
              icon: 'timer',
              title: 'Incline back support creates longer lever for muscle growth',
              description: 'Keep elbows aligned upward, resist flaring outward.'
            },
            {
              icon: 'fitness',
              title: 'Keep shoulders still, only forearms hinge during rep',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Eccentric Ext',
          duration: '12–14 min',
          description: 'Controlled eccentrics optimize fiber recruitment',
          battlePlan: '4 rounds\n• 8–10 Incline KB Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Slow negatives increase hypertrophy efficiency',
          moodTips: [
            {
              icon: 'flash',
              title: 'Use incline for safer elbow line, stretch 3s on descent',
              description: 'Keep shoulders still, only forearms hinge during rep.'
            },
            {
              icon: 'shield',
              title: 'Keep grip neutral, wrists aligned with elbows fully',
              description: 'Control the bell behind head - kettlebell weight shifts require extra control.'
            }
          ]
        },
        {
          name: 'Pause Crusher',
          duration: '12–14 min',
          description: 'Incline crusher with pause stresses long head more',
          battlePlan: '3 rounds\n• 8–10 Incline KB Skull Crushers (2s pause)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Pausing at stretch prolongs muscular demand',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause 1–2s at bottom increases tension and control',
              description: 'Keep grip neutral, wrists aligned with elbows fully.'
            },
            {
              icon: 'fitness',
              title: 'Move quickly bench to bench for constant pressure',
              description: 'Fixed elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'KB Ext Superset',
          duration: '14–16 min',
          description: 'Flat plus incline overloads fibers across ranges',
          battlePlan: '4 rounds\n• 8 Flat KB Extensions\n• 8 Incline KB Skull Crushers\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/oei647bg_download%20%285%29.png',
          intensityReason: 'Superset angles maximize triceps hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Move quickly bench to bench for constant pressure',
              description: 'Flat = stability, incline = deep stretch.'
            },
            {
              icon: 'fitness',
              title: 'Maintain technique under fatigue',
              description: 'Form degradation reduces effectiveness.'
            }
          ]
        },
        {
          name: 'Eccentric + Iso',
          duration: '16–18 min',
          description: 'Combo layering builds fibers with greater intensity and control.',
          battlePlan: '4 rounds\n• 8 Incline KB Extensions (3s eccentric)\n• 8 Incline KB Skull Crushers\n• End with 10s Iso Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/uwwxoov7_download%20%284%29.png',
          intensityReason: 'Negatives plus holds prolong hypertrophy stress',
          moodTips: [
            {
              icon: 'timer',
              title: 'Descend slowly, finish with 10s mid rep hold',
              description: 'Incline support ensures safe stretch depth at long head.'
            },
            {
              icon: 'flame',
              title: 'No rest between exercises',
              description: 'Advanced training requires mental fortitude.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'EZ bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Flat EZ Ext',
          duration: '10–12 min',
          description: 'Lying EZ extensions target long head efficiently',
          battlePlan: '3 rounds\n• 10–12 Flat Bench EZ Extensions\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Flat bench setup teaches safer pushing mechanics',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Flat support reduces arching, focusing stress on arms',
              description: 'Lower EZ bar slowly, extend overhead in a straight track.'
            },
            {
              icon: 'body',
              title: 'Wrists stay neutral, elbows drive straight upward',
              description: 'EZ bar curve matches natural wrist position.'
            }
          ]
        },
        {
          name: 'Incline EZ Ext',
          duration: '10–12 min',
          description: 'EZ bar incline extension builds deeper triceps load',
          battlePlan: '3 rounds\n• 10–12 Incline EZ Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Incline increases long head activation via angle',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Incline position intensifies stretch tension safely',
              description: 'Wrists stay neutral, elbows drive straight upward.'
            },
            {
              icon: 'flash',
              title: 'Keep elbows tight, no shoulder involvement',
              description: 'Steady press pattern builds consistent strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'EZ Crushers',
          duration: '12–14 min',
          description: 'Benchmark triceps builder with strict execution',
          battlePlan: '4 rounds\n• 8–10 EZ Skull Crushers\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Skull crushers stretch and contract muscle fully',
          moodTips: [
            {
              icon: 'body',
              title: 'With flat bench, lower bar near forehead for line',
              description: 'Keep elbows tight, no shoulder involvement.'
            },
            {
              icon: 'trending-up',
              title: 'Lower bar over 3s, press up without bouncing',
              description: 'Control the stretch for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Eccentric Crushers',
          duration: '12–14 min',
          description: 'Negatives extend overall time under triceps tension',
          battlePlan: '3 rounds\n• 8 EZ Skull Crushers (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: '3s lower phase increases hypertrophy precision',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower bar over 3s, press up without bouncing',
              description: 'Incline bench option deepens long head involvement.'
            },
            {
              icon: 'shield',
              title: 'Keep elbows locked narrow both variations',
              description: 'Never let the weight drop or bounce.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ext Superset',
          duration: '14–16 min',
          description: 'Combo adds angles for complete triceps overload',
          battlePlan: '4 rounds\n• 8 Flat EZ Extensions\n• 8 Incline EZ Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Pair flat extension with incline for volume boost',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform flat reps strict, hit incline immediately',
              description: 'Keep elbows locked narrow both variations.'
            },
            {
              icon: 'fitness',
              title: 'Control bar path entire round',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'Crusher Burnout',
          duration: '16–18 min',
          description: 'Burnout ends with static hold for max triceps fatigue',
          battlePlan: '4 rounds\n• 8 Incline EZ Skull Crushers\n• 8 Flat EZ Extensions\n• End with 10s Iso Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Multi set pairing with iso hold taxes endurance',
          moodTips: [
            {
              icon: 'flame',
              title: 'Final rep: hold halfway down for 10s',
              description: 'Control bar path entire round.'
            },
            {
              icon: 'body',
              title: 'Listen to your body',
              description: 'Stop if form breaks down significantly.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Single extension cable',
    icon: 'swap-vertical',
    workouts: {
      beginner: [
        {
          name: 'Rope Pushdowns',
          duration: '10–12 min',
          description: 'Rope attachment separates arms, isolates better',
          battlePlan: '3 rounds\n• 10–12 Rope Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lruescv6_download%20%281%29.png',
          intensityReason: 'Pushdowns teach elbow lockout form safely',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Keep elbows tight; only forearms hinge down',
              description: 'Spread rope ends apart fully at lockout.'
            },
            {
              icon: 'body',
              title: 'Upright stance, elbows glued to ribcage',
              description: 'Full lockout down, slow reset up.'
            }
          ]
        },
        {
          name: 'Straight Bar Push',
          duration: '10–12 min',
          description: 'Bar option builds controlled starting triceps form',
          battlePlan: '3 rounds\n• 10–12 Straight Bar Pushdowns\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: 'Straight bar teaches strict downward extension',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Upright stance, elbows glued to ribcage',
              description: 'Full lockout down, slow reset up.'
            },
            {
              icon: 'flash',
              title: 'Press straight up with control',
              description: 'Steady press pattern builds consistent strength.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Overhead Rope Ext',
          duration: '12–14 min',
          description: 'Rope overhead creates long head hypertrophy focus',
          battlePlan: '4 rounds\n• 8–10 Overhead Rope Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k3gdq2dy_download%20%281%29.png',
          intensityReason: 'Overhead path lengthens triceps time under load',
          moodTips: [
            {
              icon: 'body',
              title: 'Step away, lean slightly forward for tension',
              description: 'Elbows remain by ears, press rope forward/up.'
            },
            {
              icon: 'trending-up',
              title: 'Keep constant rope tension, no slack',
              description: 'Control the stretch for safety and effectiveness.'
            }
          ]
        },
        {
          name: 'Negative Pushdown',
          duration: '12–14 min',
          description: 'Slow eccentrics keep stack tension constant longer',
          battlePlan: '3 rounds\n• 8 Cable Pushdowns (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: '3s lowering phase enhances cable tension output',
          moodTips: [
            {
              icon: 'timer',
              title: 'Press down firmly, return bar in 3 slow seconds',
              description: 'Keep stack plates off rest between reps.'
            },
            {
              icon: 'fitness',
              title: 'Elbows fixed at torso sides',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Superset challenges both control and arm strength',
          battlePlan: '4 rounds\n• 8 Rope Pushdowns\n• 8 Straight Bar Pushdowns\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lruescv6_download%20%281%29.png',
          intensityReason: 'Pair grips for full fiber recruitment and volume',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Rope flare trains outer head, bar keeps line strict',
              description: 'Transition smooth, elbows never leave side.'
            },
            {
              icon: 'fitness',
              title: 'Focus on form as fatigue builds',
              description: 'Quality reps more important than quantity.'
            }
          ]
        },
        {
          name: 'Overhead Iso Burn',
          duration: '16–18 min',
          description: 'Rope overhead extension plus hold maximizes stress',
          battlePlan: '4 rounds\n• 8 Overhead Rope Extensions\n• End each with 10s Hold Mid Rep\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/lv1qz5u4_download.png',
          intensityReason: 'Overhead with timeout hold creates total fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway extended for 10s each superset',
              description: 'Keep slight lean to maintain line of pull.'
            },
            {
              icon: 'flame',
              title: 'No rest between movements',
              description: 'Continuous work for maximum growth stimulus.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Cable crossover machine',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Rope Pushdown',
          duration: '10–12 min',
          description: 'Rope attachment builds triceps with simple tension',
          battlePlan: '3 rounds\n• 10–12 Rope Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/kn9gulrn_download%20%282%29.png',
          intensityReason: 'Pushdowns teach elbow lockout form safely with traditional movements.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Spread rope ends apart at bottom lockout',
              description: 'Keep elbows locked by torso, no flaring.'
            },
            {
              icon: 'body',
              title: 'Step forward, lean slightly for rope clearance',
              description: 'Keep elbows fixed toward ceiling, extend fully.'
            }
          ]
        },
        {
          name: 'Overhead Rope Ext',
          duration: '10–12 min',
          description: 'Cable overhead isolates stretch for stronger arms',
          battlePlan: '3 rounds\n• 10–12 Overhead Rope Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k3gdq2dy_download%20%281%29.png',
          intensityReason: 'Overhead cable path increases long head tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Step forward, lean slightly for rope clearance',
              description: 'Keep elbows fixed toward ceiling, extend fully.'
            },
            {
              icon: 'fitness',
              title: 'Brace forward lean to prevent back strain',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Overhead Bar Ext',
          duration: '12–14 min',
          description: 'Straight bar hits triceps with longer stretch angle',
          battlePlan: '4 rounds\n• 8–10 Overhead Bar Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fo2f287e_download%20%2821%29.png',
          intensityReason: 'Bar overhead creates continuous long head stress',
          moodTips: [
            {
              icon: 'body',
              title: 'Position hands shoulder width on bar',
              description: 'Brace forward lean to prevent back strain.'
            },
            {
              icon: 'trending-up',
              title: 'Extend quickly, return rope over 3s',
              description: 'Keep constant rope tension, no slack.'
            }
          ]
        },
        {
          name: 'Negative Rope Ext',
          duration: '12–14 min',
          description: 'Slow eccentric rope reps increase hypertrophy load',
          battlePlan: '3 rounds\n• 8 Rope Overhead Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/d111pjm2_download%20%282%29.png',
          intensityReason: 'Three second lowers extend constant cable time',
          moodTips: [
            {
              icon: 'timer',
              title: 'Extend quickly, return rope over 3s',
              description: 'Keep constant rope tension, no slack.'
            },
            {
              icon: 'fitness',
              title: 'Keep constant rope tension, no slack',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Rope + Bar Combo',
          duration: '14–16 min',
          description: 'Superset strategy hits triceps with extra volume',
          battlePlan: '4 rounds\n• 8 Rope Overhead Extensions\n• 8 Bar Overhead Extensions\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/kn9gulrn_download%20%282%29.png',
          intensityReason: 'Two grips build variety across pushdown fibers',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Rope fully flared, bar strict and straight',
              description: 'Minimal rest between switches.'
            },
            {
              icon: 'fitness',
              title: 'Focus on form as fatigue builds',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'Overhead 21s',
          duration: '16–18 min',
          description: 'Overhead 21 style burns fibers through completion',
          battlePlan: '3 rounds\n• 7 Bottom Half Reps\n• 7 Top Half Reps\n• 7 Full Range Reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/fo2f287e_download%20%2821%29.png',
          intensityReason: 'Seven seven seven partials overload triceps range',
          moodTips: [
            {
              icon: 'timer',
              title: 'Control half reps, don\'t rush transitions',
              description: 'Keep elbows high, upper arms locked in.'
            },
            {
              icon: 'trending-up',
              title: 'Keep elbows high, upper arms locked in',
              description: 'Control movement through each range.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Tricep Pushdown Machine',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Pushdown Builder',
          duration: '12–14 min',
          description: 'Standard pushdown workout building foundational triceps strength using a fixed handle.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Tricep Pushdowns — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Fixed path helps build strict elbow extension form',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows stay pinned slightly in front of ribs',
              description: 'Keeps long head loaded, not shoulders'
            },
            {
              icon: 'trending-down',
              title: 'Push straight down and slightly out',
              description: 'Matches machine path and improves extension'
            },
            {
              icon: 'flash',
              title: 'Lock out under control',
              description: 'Peak triceps contraction happens just before joints stack'
            }
          ]
        },
        {
          name: 'Tempo Pushdown Control',
          duration: '12–14 min',
          description: 'Eccentric-focused pushdown workout emphasizing control on a fixed path.',
          battlePlan: 'Battle Plan — Eccentric Sets\n• 4×10 Pushdowns — eccentric reps (3s return)\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Slow eccentrics maximize triceps time under tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Slow return, smooth press',
              description: 'Tension stays on triceps'
            },
            {
              icon: 'body',
              title: 'Elbows never drift',
              description: 'Static grip rewards precision'
            },
            {
              icon: 'flash',
              title: 'Fully extend every rep',
              description: 'Shortened triceps = better pump'
            }
          ]
        },
        {
          name: 'Pushdown + Iso Finish',
          duration: '12–14 min',
          description: 'Standard pushdown workout with squeeze-to-finish at peak elbow extension.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 Pushdowns — standard reps\n• Final set: squeeze to finish — hold full extension 10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Isometric finish maximizes triceps contraction',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex triceps hard during hold',
              description: 'Neural drive matters'
            },
            {
              icon: 'hand-left',
              title: 'Wrists neutral, shoulders quiet',
              description: 'Fixed handle means elbows do the work'
            },
            {
              icon: 'fitness',
              title: 'Use lighter pin for the hold',
              description: 'Longer contraction = deeper pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Paused Pushdowns',
          duration: '14–16 min',
          description: 'Pause-rep pushdown workout removing momentum on a fixed track.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Pushdowns — pause reps (1s at full extension)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Pauses eliminate rebound for pure elbow extension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause kills rebound',
              description: 'Pure elbow extension'
            },
            {
              icon: 'body',
              title: 'Brace lightly through torso',
              description: 'Prevents shoulder compensation'
            },
            {
              icon: 'flash',
              title: 'Pause at full lockout',
              description: 'Shortened triceps pump hardest'
            }
          ]
        },
        {
          name: 'Pushdown Burn Builder',
          duration: '15–17 min',
          description: 'Burnout-style pushdown workout extending time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15–20 Pushdowns — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Extended reps build endurance and pump',
          moodTips: [
            {
              icon: 'shield',
              title: 'No resting at the top',
              description: 'Continuous tension'
            },
            {
              icon: 'refresh',
              title: 'Smooth, repeatable cadence',
              description: 'Keeps elbows healthy'
            },
            {
              icon: 'flash',
              title: 'Moderate load, nonstop reps',
              description: 'Burnout = pump'
            }
          ]
        },
        {
          name: 'Density Pushdowns',
          duration: '15–17 min',
          description: 'High-density pushdown workout with shortened rest.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×10 Pushdowns — standard reps\nRest 45–60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Short rest forces efficiency and stacks fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Short rest forces efficiency',
              description: 'Fatigue stacks quickly'
            },
            {
              icon: 'body',
              title: 'Elbows stay fixed even when tired',
              description: 'Prevents form breakdown'
            },
            {
              icon: 'flash',
              title: 'Finish reps clean',
              description: 'Lockout quality drives pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy Pushdown Builder',
          duration: '18–20 min',
          description: 'Standard heavy pushdown workout emphasizing strict elbow control.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 Pushdowns — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Heavy loads with strict form build maximum strength',
          moodTips: [
            {
              icon: 'body',
              title: 'No torso lean',
              description: 'Load stays honest'
            },
            {
              icon: 'trending-down',
              title: 'Control negatives',
              description: 'Triceps love eccentrics'
            },
            {
              icon: 'flash',
              title: 'Finish every rep deliberately',
              description: 'Extension, not momentum'
            }
          ]
        },
        {
          name: 'Pushdown Drop Cluster',
          duration: '18–20 min',
          description: 'Multi-drop pushdown workout driving mechanical fatigue on a fixed handle.',
          battlePlan: 'Battle Plan — Drop Cluster\n• Set 1: 10 reps\n• Set 2: drop set — 10 → drop ~20% → 8\n• Set 3: triple drop — 8 → drop ~15% → 6 → drop ~10% → 6\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ccill0t9_download%20%283%29.png',
          intensityReason: 'Drop clusters extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Pin changes are immediate',
              description: 'Stay locked into position'
            },
            {
              icon: 'shield',
              title: 'Smaller drops preserve form',
              description: 'Fixed path punishes slop'
            },
            {
              icon: 'timer',
              title: 'End each mini-set fully extended',
              description: 'Peak contraction seals the pump'
            }
          ]
        },
        {
          name: 'Pushdown Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric pushdown workout for maximal triceps fatigue.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×12 Pushdowns — burnout reps\n• Final set: squeeze to finish — hold full extension 12–15s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yfoavc6k_download%20%282%29.png',
          intensityReason: 'Burnout with iso hold completely exhausts triceps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex triceps aggressively',
              description: 'Neural drive matters'
            },
            {
              icon: 'shield',
              title: 'No resting on the stack',
              description: 'Tension stays high'
            },
            {
              icon: 'fitness',
              title: 'Lighter pin, longer hold',
              description: 'Pump > ego'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Dip station / machine',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'Assisted Dips',
          duration: '10–12 min',
          description: 'Builds pressing power with reduced bodyweight load',
          battlePlan: '3 rounds\n• 6–8 Assisted Dips\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Assistance teaches proper form and depth safely',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep torso vertical for max triceps',
              description: 'Lower under control, don\'t bounce.'
            },
            {
              icon: 'hand-left',
              title: 'Hands behind hips, elbows drive straight back',
              description: 'Don\'t let shoulders shrug, torso stays tall.'
            }
          ]
        },
        {
          name: 'Bench Dips',
          duration: '10–12 min',
          description: 'Simple bench dip strengthens arms with low setup',
          battlePlan: '3 rounds\n• 8–10 Bench Dips\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/pkwqrz0u_bdips.webp',
          intensityReason: 'Bench setup improves stability via shorter lever',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hands behind hips, elbows drive straight back',
              description: 'Don\'t let shoulders shrug, torso stays tall.'
            },
            {
              icon: 'fitness',
              title: 'Stay upright for triceps, no leaning forward',
              description: 'Bend to 90° elbow, press back up strong.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Parallel Dips',
          duration: '12–14 min',
          description: 'Strict parallel bar dips overload pressing muscles',
          battlePlan: '4 rounds\n• 6–8 Parallel Bar Dips\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Bodyweight dips build compound triceps strength',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay upright for triceps, no leaning forward',
              description: 'Bend to 90° elbow, press back up strong.'
            },
            {
              icon: 'trending-up',
              title: 'Lower slowly for 3s each rep',
              description: 'Press up fast, don\'t swing legs.'
            }
          ]
        },
        {
          name: 'Dip Negatives',
          duration: '12–14 min',
          description: 'Dip negatives accelerate strength and growth gains',
          battlePlan: '3 rounds\n• 6 Negative Dips (3s descent)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/74stkm4f_download%20%283%29.png',
          intensityReason: '3s controlled descent creates heavy eccentric load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slowly for 3s each rep',
              description: 'Press up fast, don\'t swing legs.'
            },
            {
              icon: 'shield',
              title: 'Control descent, never overload reps',
              description: 'Smooth transition prevents joint stress.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Weighted Dips',
          duration: '14–16 min',
          description: 'Weighted dipping expands pressing endurance power',
          battlePlan: '4 rounds\n• 6–8 Weighted Dips\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/o9irqfer_download%20%284%29.png',
          intensityReason: 'Added external load enhances triceps hypertrophy',
          moodTips: [
            {
              icon: 'construct',
              title: 'Add plates via belt, keep body upright',
              description: 'Control descent, never overload reps.'
            },
            {
              icon: 'fitness',
              title: 'Control descent, never overload reps',
              description: 'Quality reps more important than quantity.'
            }
          ]
        },
        {
          name: 'Dip + Hold',
          duration: '16–18 min',
          description: 'Weighted or strict dips end with static position hold',
          battlePlan: '4 rounds\n• 6–8 Dips (bodyweight or weighted)\n• End with 10s Iso Hold\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/74stkm4f_download%20%283%29.png',
          intensityReason: 'Iso hold at midpoint deepens muscular fatigue',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway down for 10s at last rep',
              description: 'Elbows aligned straight back, chest tall.'
            },
            {
              icon: 'flame',
              title: 'Elbows aligned straight back, chest tall',
              description: 'Advanced training requires mental fortitude.'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'TRX bands',
    icon: 'link',
    workouts: {
      beginner: [
        {
          name: 'TRX Pushdown',
          duration: '10–12 min',
          description: 'Easy scale body angle to increase or reduce load',
          battlePlan: '3 rounds\n• 10–12 TRX Pushdowns\nRest 60–75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Body angled band push teaches triceps extension',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Step forward deeper for more resistance',
              description: 'Keep elbows pinned, hinge only forearms.'
            },
            {
              icon: 'body',
              title: 'Control rope tension across full rep',
              description: 'Fixed elbow position maximizes tricep isolation.'
            }
          ]
        },
        {
          name: 'TRX Overhead Ext',
          duration: '10–12 min',
          description: 'Overhead TRX extension increases stretch safely',
          battlePlan: '3 rounds\n• 10–12 TRX Overhead Extensions\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Lean forward position stretches tricep long head',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lean slightly forward, keep arms overhead',
              description: 'Control rope tension across full rep.'
            },
            {
              icon: 'fitness',
              title: 'Don\'t let straps slack mid rep',
              description: 'Full body tension supports arm position.'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Incline TRX Ext',
          duration: '12–14 min',
          description: 'Body angle incline forces longer extension workload',
          battlePlan: '4 rounds\n• 8–10 Incline TRX Extensions\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Sharper incline builds greater triceps range use',
          moodTips: [
            {
              icon: 'body',
              title: 'Walk feet closer to anchor for load',
              description: 'Bend elbows fully before locking out.'
            },
            {
              icon: 'trending-up',
              title: 'Lower slowly for 3s with solid core',
              description: 'Don\'t let straps slack mid rep.'
            }
          ]
        },
        {
          name: 'TRX Negatives',
          duration: '12–14 min',
          description: 'Controlled negatives raise extension efficiency',
          battlePlan: '3 rounds\n• 8 TRX Extensions (3s eccentric)\nRest 75–90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: '3s eccentric phases enhance hypertrophy tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower slowly for 3s with solid core',
              description: 'Don\'t let straps slack mid rep.'
            },
            {
              icon: 'fitness',
              title: 'Brace entire body to stop strap sway',
              description: 'Stable elbow position ensures tricep isolation.'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'TRX Ext Combo',
          duration: '14–16 min',
          description: 'Superset TRX pushes and overheads overload fibers',
          battlePlan: '4 rounds\n• 8 TRX Overhead Extensions\n• 8 TRX Pushdowns\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Overhead plus pushdown adds training variety',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Perform overhead stretch then pushdown strict',
              description: 'Minimal time between moves keeps arms loaded.'
            },
            {
              icon: 'fitness',
              title: 'Hold halfway extended for 10s, elbows locked in',
              description: 'Each angle hits triceps differently.'
            }
          ]
        },
        {
          name: 'TRX Iso Burn',
          duration: '16–18 min',
          description: 'Pause holds in mid rep create intense arm fatigue',
          battlePlan: '3 rounds\n• 8 TRX Extensions\n• End with 10s Hold Mid Extension\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Static positions drive endurance under band load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Hold halfway extended for 10s, elbows locked in',
              description: 'Brace entire body to stop strap sway.'
            },
            {
              icon: 'flame',
              title: 'Brace entire body to stop strap sway',
              description: 'Advanced training requires mental fortitude.'
            }
          ]
        }
      ]
    }
  }
];
