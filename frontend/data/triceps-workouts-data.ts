import { EquipmentWorkouts } from '../types/workout';

export const tricepsWorkoutDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Seated DB Overhead Extension',
          duration: '12–14 min',
          description: 'Standard overhead extension workout emphasizing long-head triceps stretch.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 Seated DB Overhead Extensions — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/d78e5qae_fdbsc.webp',
          intensityReason: 'Overhead position maximizes long-head triceps stretch',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows point slightly in',
              description: 'Keeps tension on triceps'
            },
            {
              icon: 'trending-down',
              title: 'Lower slow and deep',
              description: 'Stretch drives activation'
            },
            {
              icon: 'flash',
              title: 'Lock out just before elbows stack',
              description: 'Peak extension creates the pump'
            }
          ]
        },
        {
          name: 'Lying DB Skullcrushers',
          duration: '12–14 min',
          description: 'Standard horizontal extension workout with stable positioning.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 DB Skullcrushers — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/nworhx1b_idbsc.webp',
          intensityReason: 'Horizontal position provides stable triceps isolation',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Lower DBs beside temples',
              description: 'Shoulder-friendly path'
            },
            {
              icon: 'body',
              title: 'Upper arms stay vertical',
              description: 'Prevents shoulder drift'
            },
            {
              icon: 'flash',
              title: 'Extend fully, squeeze hard',
              description: 'Shortened triceps pump best'
            }
          ]
        },
        {
          name: 'DB Kickback Builder',
          duration: '12–14 min',
          description: 'Beginner-only isolation workout emphasizing peak contraction.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×15 DB Kickbacks — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Kickbacks emphasize peak triceps contraction',
          moodTips: [
            {
              icon: 'body',
              title: 'Upper arm stays fixed',
              description: 'Pure elbow extension'
            },
            {
              icon: 'trending-up',
              title: 'Extend back, not up',
              description: 'Keeps tension on triceps'
            },
            {
              icon: 'flash',
              title: 'Light weight, hard lockout',
              description: 'Kickbacks pump from contraction'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Paused Overhead DB Extension',
          duration: '14–16 min',
          description: 'Pause-rep overhead extension workout removing momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Overhead DB Extensions — pause reps (1s bottom)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Pauses in the stretch emphasize long-head load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause in the stretch',
              description: 'Long-head emphasis'
            },
            {
              icon: 'body',
              title: 'Core tight',
              description: 'Prevents rib flare'
            },
            {
              icon: 'flash',
              title: 'Drive to full extension',
              description: 'Stretch + lockout = pump'
            }
          ]
        },
        {
          name: 'DB Skullcrusher Burn Builder',
          duration: '15–17 min',
          description: 'Burnout-style skullcrusher workout extending time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15 Skullcrushers — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Extended reps build endurance and pump',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Smooth cadence',
              description: 'Protects elbows'
            },
            {
              icon: 'shield',
              title: 'No lockout rest',
              description: 'Continuous tension'
            },
            {
              icon: 'flash',
              title: 'Moderate load, nonstop reps',
              description: 'Burnout = pump'
            }
          ]
        },
        {
          name: 'Overhead Extension + Skullcrusher Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing long-head stretch with horizontal extension.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 DB Overhead Extensions — standard reps\nsuperset with\n• 10 DB Skullcrushers\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Two angles maximize triceps fiber recruitment',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Overhead work first',
              description: 'Loads long head fully'
            },
            {
              icon: 'fitness',
              title: 'Skullcrushers finish fibers',
              description: 'Cleaner elbow extension'
            },
            {
              icon: 'flash',
              title: 'Control both lockouts',
              description: 'Two contractions = pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy DB Overhead Extension',
          duration: '18–20 min',
          description: 'Standard heavy overhead extension workout for advanced loading.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 DB Overhead Extensions — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/yyzj0dlo_download%20%281%29.png',
          intensityReason: 'Heavy loads with strict form build maximum strength',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows tight',
              description: 'Shoulder safety'
            },
            {
              icon: 'trending-down',
              title: 'Slow negatives',
              description: 'Triceps love eccentrics'
            },
            {
              icon: 'flash',
              title: 'Finish each rep fully extended',
              description: 'Lockout drives pump'
            }
          ]
        },
        {
          name: 'DB Extension Drop Cluster',
          duration: '18–20 min',
          description: 'Multi-drop overhead extension workout driving mechanical fatigue.',
          battlePlan: 'Battle Plan — Drop Cluster\n• Set 1: 10 reps\n• Set 2: drop set — 10 → drop ~20% → 8\n• Set 3: triple drop — 8 → drop ~15% → 6 → drop ~10% → 6\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Drop clusters extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Drops are immediate',
              description: 'No standing around'
            },
            {
              icon: 'shield',
              title: 'Smaller drops preserve elbow health',
              description: 'Clean reps matter'
            },
            {
              icon: 'timer',
              title: 'End every mini-set locked out',
              description: 'Peak extension seals pump'
            }
          ]
        },
        {
          name: 'Skullcrusher Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric skullcrusher workout emphasizing peak extension.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×12 DB Skullcrushers — burnout reps\n• Final set: squeeze to finish — hold full elbow extension 12–15s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/5cjqt0fg_download.png',
          intensityReason: 'Burnout with iso hold completely exhausts triceps',
          moodTips: [
            {
              icon: 'body',
              title: 'Upper arms fixed',
              description: 'Isolation preserved'
            },
            {
              icon: 'flash',
              title: 'Flex aggressively',
              description: 'Neural drive matters'
            },
            {
              icon: 'fitness',
              title: 'Moderate load, long hold',
              description: 'Pump > ego'
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
    equipment: 'EZ Bar',
    icon: 'remove',
    workouts: {
      beginner: [
        {
          name: 'EZ Skullcrusher Builder',
          duration: '12–14 min',
          description: 'Standard EZ-bar skullcrusher workout for joint-friendly loading.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 EZ Skullcrushers — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'EZ bar angle reduces wrist strain for comfortable loading',
          moodTips: [
            {
              icon: 'trending-down',
              title: 'Lower bar behind forehead',
              description: 'Shoulder-friendly'
            },
            {
              icon: 'body',
              title: 'Upper arms fixed',
              description: 'Prevents cheating'
            },
            {
              icon: 'flash',
              title: 'Extend fully each rep',
              description: 'Lockout fuels pump'
            }
          ]
        },
        {
          name: 'Close-Grip EZ Press',
          duration: '12–14 min',
          description: 'Standard compound triceps press using elbow-dominant grip.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 Close-Grip EZ Press — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Close grip transfers load to triceps for compound pressing',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Grip inside shoulder width',
              description: 'Triceps bias'
            },
            {
              icon: 'body',
              title: 'Elbows track in',
              description: 'Joint safety'
            },
            {
              icon: 'flash',
              title: 'Press to full extension',
              description: 'Compound lockout pumps hard'
            }
          ]
        },
        {
          name: 'EZ Extension + Iso Finish',
          duration: '12–14 min',
          description: 'Standard EZ extension workout with squeeze-to-finish.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×10 EZ Extensions — standard reps\n• Final set: squeeze to finish — hold lockout 10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Isometric finish maximizes triceps contraction',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex triceps hard',
              description: 'Neural drive'
            },
            {
              icon: 'shield',
              title: 'No elbow flare',
              description: 'Keeps load honest'
            },
            {
              icon: 'fitness',
              title: 'Use lighter bar for hold',
              description: 'Longer squeeze = pump'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Paused EZ Skullcrushers',
          duration: '14–16 min',
          description: 'Pause-rep EZ skullcrusher workout removing momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×10 Skullcrushers — pause reps (1s bottom)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Pauses in the stretch maximize long-head load',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause in the stretch',
              description: 'Long-head load'
            },
            {
              icon: 'body',
              title: 'Brace through torso',
              description: 'Stability matters'
            },
            {
              icon: 'flash',
              title: 'Drive to full extension',
              description: 'Stretch + squeeze = pump'
            }
          ]
        },
        {
          name: 'EZ Burn Builder',
          duration: '15–17 min',
          description: 'Burnout-style EZ extension workout extending time under tension.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×15 EZ Extensions — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Extended reps build endurance and pump',
          moodTips: [
            {
              icon: 'shield',
              title: 'No lockout rest',
              description: 'Constant tension'
            },
            {
              icon: 'refresh',
              title: 'Smooth cadence',
              description: 'Elbow friendly'
            },
            {
              icon: 'flash',
              title: 'Moderate weight, nonstop reps',
              description: 'Burnout = pump'
            }
          ]
        },
        {
          name: 'Skullcrusher + Close-Grip Contrast',
          duration: '15–17 min',
          description: 'Superset workout pairing isolation and compound extension.',
          battlePlan: 'Battle Plan — Superset\n• 4×10 EZ Skullcrushers\nsuperset with\n• 8 Close-Grip EZ Press\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Isolation + compound maximizes triceps fatigue',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Isolation first',
              description: 'Fatigue fibers'
            },
            {
              icon: 'fitness',
              title: 'Compound finishes strong',
              description: 'Load through lockout'
            },
            {
              icon: 'flash',
              title: 'Control both endings',
              description: 'Two contractions = pump'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Heavy EZ Skullcrusher',
          duration: '18–20 min',
          description: 'Standard heavy EZ skullcrusher workout emphasizing strict form.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×8 EZ Skullcrushers\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Heavy loads with strict form build maximum strength',
          moodTips: [
            {
              icon: 'shield',
              title: 'No ego loading',
              description: 'Elbow safety'
            },
            {
              icon: 'trending-down',
              title: 'Control negatives',
              description: 'Triceps respond well'
            },
            {
              icon: 'flash',
              title: 'Finish reps locked out',
              description: 'Peak extension matters'
            }
          ]
        },
        {
          name: 'EZ Extension Drop Cluster',
          duration: '18–20 min',
          description: 'Multi-drop EZ extension workout driving fatigue.',
          battlePlan: 'Battle Plan — Drop Cluster\n• Set 1: 10 reps\n• Set 2: drop — 10 → drop ~20% → 8\n• Set 3: triple drop — 8 → drop ~15% → 6 → drop ~10% → 6\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/ri9qkrqs_download%20%283%29.png',
          intensityReason: 'Drop clusters extend time under tension past failure',
          moodTips: [
            {
              icon: 'flash',
              title: 'Plate changes immediate',
              description: 'Stay on bench'
            },
            {
              icon: 'shield',
              title: 'Smaller drops protect elbows',
              description: 'Clean reps'
            },
            {
              icon: 'timer',
              title: 'End sets fully extended',
              description: 'Pump is in the lockout'
            }
          ]
        },
        {
          name: 'EZ Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric EZ extension workout.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×12 EZ Extensions\n• Final set: squeeze to finish — hold lockout 12–15s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/pa8x192c_download%20%282%29.png',
          intensityReason: 'Burnout with iso hold completely exhausts triceps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex aggressively',
              description: 'Neural drive'
            },
            {
              icon: 'shield',
              title: 'No resting at top',
              description: 'Tension stays high'
            },
            {
              icon: 'fitness',
              title: 'Lighter bar, longer hold',
              description: 'Pump > ego'
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
    equipment: 'TRX Bands',
    icon: 'link',
    workouts: {
      beginner: [
        {
          name: 'TRX Tricep Extension Builder',
          duration: '12–14 min',
          description: 'Standard TRX extension workout introducing bodyweight triceps loading.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×10 TRX Tricep Extensions — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Body angle controls resistance for progressive loading',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows stay high and fixed in space',
              description: 'Think "hinge at the elbows," not "push hands"'
            },
            {
              icon: 'trending-down',
              title: 'Lower your head forward between hands',
              description: 'Body moves, straps stay still'
            },
            {
              icon: 'flash',
              title: 'Choose an angle you can fully lock out',
              description: 'Clean extension creates the pump'
            }
          ]
        },
        {
          name: 'Incline TRX Extensions',
          duration: '12–14 min',
          description: 'Regression-based TRX workout using a more upright body angle.',
          battlePlan: 'Battle Plan — Standard Sets\n• 4×12 TRX Extensions (more upright) — standard reps\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Upright angle reduces load for form development',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Step closer to reduce load',
              description: 'Angle controls difficulty'
            },
            {
              icon: 'body',
              title: 'Body stays rigid like a plank',
              description: 'Prevents shoulder takeover'
            },
            {
              icon: 'flash',
              title: 'Lock out arms hard every rep',
              description: 'Shortened triceps pump fast'
            }
          ]
        },
        {
          name: 'TRX Extension + Iso Finish',
          duration: '12–14 min',
          description: 'Standard TRX workout with squeeze-to-finish at full elbow extension.',
          battlePlan: 'Battle Plan — Standard + Isometric Finish\n• 4×8 TRX Extensions — standard reps\n• Final set: squeeze to finish — hold arms fully straight 10s\nRest 60s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Isometric finish maximizes triceps contraction',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace core during the hold',
              description: 'Stability keeps load on triceps'
            },
            {
              icon: 'shield',
              title: 'Elbows don\'t drift outward',
              description: 'Shoulder motion = lost tension'
            },
            {
              icon: 'flash',
              title: 'Hold where arms are fully straight',
              description: 'That\'s peak contraction'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tempo TRX Extensions',
          duration: '14–16 min',
          description: 'Eccentric-focused TRX workout increasing time under tension.',
          battlePlan: 'Battle Plan — Eccentric Sets\n• 4×8 TRX Extensions — eccentric reps (4s lower)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Slow eccentrics maximize muscle fiber recruitment',
          moodTips: [
            {
              icon: 'timer',
              title: 'Lower body slowly as one unit',
              description: 'Arms don\'t move, body does'
            },
            {
              icon: 'body',
              title: 'Elbows bend under control',
              description: 'Keeps shoulders out'
            },
            {
              icon: 'flash',
              title: 'Extend hard at the top',
              description: 'Full lockout builds pump'
            }
          ]
        },
        {
          name: 'Paused TRX Extensions',
          duration: '14–16 min',
          description: 'Pause-rep TRX workout eliminating momentum.',
          battlePlan: 'Battle Plan — Pause Sets\n• 4×8 TRX Extensions — pause reps (1s bottom)\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Pauses eliminate momentum for honest tension',
          moodTips: [
            {
              icon: 'timer',
              title: 'Pause with elbows bent, body frozen',
              description: 'Don\'t sink into shoulders'
            },
            {
              icon: 'trending-up',
              title: 'Press body away by straightening arms',
              description: 'Hands stay fixed'
            },
            {
              icon: 'flash',
              title: 'Pause + full lockout = pump',
              description: 'Stretch then contraction wins'
            }
          ]
        },
        {
          name: 'TRX Burn Builder',
          duration: '15–17 min',
          description: 'Burnout-style TRX workout extending fatigue through volume.',
          battlePlan: 'Battle Plan — Burnout Sets\n• 4×AMRAP TRX Extensions — burnout reps\nRest 75s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Extended reps build endurance and pump',
          moodTips: [
            {
              icon: 'timer',
              title: 'Shorten rest each round',
              description: 'Fatigue stacks fast'
            },
            {
              icon: 'shield',
              title: 'Partial reps allowed late',
              description: 'Stay in the tension zone'
            },
            {
              icon: 'flash',
              title: 'Top-range dominance',
              description: 'Triceps stay shortened and pumped'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Decline TRX Extensions',
          duration: '18–20 min',
          description: 'Advanced TRX extension workout using feet elevation to increase load.',
          battlePlan: 'Battle Plan — Standard Sets\n• 6×6 TRX Extensions (feet elevated) — standard reps\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Feet elevation dramatically increases bodyweight load',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Steeper body angle = heavier load',
              description: 'Progress carefully'
            },
            {
              icon: 'body',
              title: 'Descend by bending elbows only',
              description: 'Shoulder movement is cheating'
            },
            {
              icon: 'flash',
              title: 'Lock out arms before feet touch down',
              description: 'Peak extension under fatigue drives pump'
            }
          ]
        },
        {
          name: 'TRX Extension Drop-Angle Ladder',
          duration: '18–20 min',
          description: 'Angle-based drop workout using body position instead of weight.',
          battlePlan: 'Battle Plan — Drop Ladder\n• 3 rounds:\n  8 reps (feet elevated) → step forward → 8 reps → step forward → AMRAP\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/e9mzj704_download%20%284%29.png',
          intensityReason: 'Angle changes extend set past failure without weight changes',
          moodTips: [
            {
              icon: 'flash',
              title: 'Angle changes are immediate',
              description: 'No standing around'
            },
            {
              icon: 'body',
              title: 'Maintain elbow height throughout',
              description: 'Keeps tension on triceps'
            },
            {
              icon: 'timer',
              title: 'Finish ladders fully extended',
              description: 'Contraction seals the pump'
            }
          ]
        },
        {
          name: 'TRX Burnout Hold',
          duration: '18–20 min',
          description: 'Burnout + isometric TRX workout for maximal triceps fatigue.',
          battlePlan: 'Battle Plan — Burnout + Isometric\n• 4×AMRAP TRX Extensions — burnout reps\n• Final set: squeeze to finish — hold full extension 15s\nRest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_inspiring-euler/artifacts/8ci4ug40_trx_kneeling_tricep_extensions.jpg',
          intensityReason: 'Burnout with iso hold completely exhausts triceps',
          moodTips: [
            {
              icon: 'flash',
              title: 'Flex triceps hard during hold',
              description: 'Neural drive matters'
            },
            {
              icon: 'body',
              title: 'Body stays rigid',
              description: 'Prevents shoulder dump'
            },
            {
              icon: 'timer',
              title: 'Hold where arms are straight',
              description: 'True shortened position'
            }
          ]
        }
      ]
    }
  }
];
