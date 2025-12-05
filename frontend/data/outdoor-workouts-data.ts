// Comprehensive outdoor workout data with detailed specifications

export const outdoorRunWorkoutDatabase = [
  {
    equipment: 'Outdoor Run',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Easy Interval Run',
          duration: '22–25 min',
          description: 'Walk–jog intervals build aerobic base and reinforce clean form.',
          battlePlan: '• 5 min brisk walk\n• 6 rounds: 1 min easy jog + 1 min walk\n• 5 min easy walk',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwb3V0ZG9vcnxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short jog bouts lift heart rate gently while protecting joints.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep tall posture; slight lean from ankles; eyes on horizon',
              description: 'Keep tall posture; slight lean from ankles; eyes on horizon'
            },
            {
              icon: 'walk',
              title: 'Land under hips with quiet steps to reduce impact and strain',
              description: 'Land under hips with quiet steps to reduce impact and strain'
            }
          ]
        },
        {
          name: 'Progressive Easy Run',
          duration: '25–30 min',
          description: 'Start relaxed and finish quicker while preserving smooth form.',
          battlePlan: '• 5 min easy jog\n• 15–20 min continuous easy→steady\n• 3–5 min walk',
          imageUrl: 'https://images.unsplash.com/photo-1506629905607-53e103a5301d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Gradual pace rise improves aerobic economy with low stress.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Relax shoulders; light hands "hold chips"; steady arm swing',
              description: 'Relax shoulders; light hands "hold chips"; steady arm swing'
            },
            {
              icon: 'leaf',
              title: 'Use 3-3 breathing; if form slips, slow to reset smooth rhythm',
              description: 'Use 3-3 breathing; if form slips, slow to reset smooth rhythm'
            }
          ]
        },
        {
          name: 'Run-Walk Loop',
          duration: '24–28 min',
          description: 'Two-minute run/walk blocks add safe volume with tight control.',
          battlePlan: '• 4 min brisk walk\n• 6 rounds: 2 min run + 2 min walk\n• 2–4 min walk',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Alternating run and walk develops endurance and steady rhythm.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Maintain light cadence; avoid overstriding to protect knees',
              description: 'Maintain light cadence; avoid overstriding to protect knees'
            },
            {
              icon: 'body',
              title: 'Keep chin level; engage core gently to stabilize torso posture',
              description: 'Keep chin level; engage core gently to stabilize torso posture'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tempo Finish Run',
          duration: '30–35 min',
          description: 'Easy running flows into short tempo to train pace discipline.',
          battlePlan: '• 8 min easy\n• 10–12 min easy\n• 8–10 min tempo (RPE 7–8)\n• 4–5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Late controlled tempo adds stress while preserving technique.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Midfoot land; elbows drive back; keep hands relaxed and quiet',
              description: 'Midfoot land; elbows drive back; keep hands relaxed and quiet'
            },
            {
              icon: 'body',
              title: 'Torso stays stacked; limit side sway for better energy transfer',
              description: 'Torso stays stacked; limit side sway for better energy transfer'
            }
          ]
        },
        {
          name: 'Fartlek Pyramid',
          duration: '30–34 min',
          description: '1-2-3-2-1 hard with equal easy jogs refines rhythm, recovery.',
          battlePlan: '• 8 min easy\n• 1 hard/1 easy\n• 2 hard/2 easy\n• 3 hard/3 easy\n• 2 hard/2 easy\n• 1 hard/1 easy\n• 5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Variable surges elevate output and sharpen pacing control.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pace the effort, not speed; adjust smoothly for terrain changes',
              description: 'Pace the effort, not speed; adjust smoothly for terrain changes'
            },
            {
              icon: 'cloud',
              title: 'Float recoveries; reset posture and breathing every easy rep',
              description: 'Float recoveries; reset posture and breathing every easy rep'
            }
          ]
        },
        {
          name: 'Steady State Run',
          duration: '32–36 min',
          description: 'Hold conversational pace steadily, then finish with cooldown.',
          battlePlan: '• 8–10 min easy\n• 20 min steady (talk in phrases)\n• 4–6 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Continuous sub-tempo builds durability and running economy.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Keep effort even; relax on mild inclines; avoid unnecessary surges',
              description: 'Keep effort even; relax on mild inclines; avoid unnecessary surges'
            },
            {
              icon: 'body',
              title: 'Shoulders down; check form every five minutes to stay efficient',
              description: 'Shoulders down; check form every five minutes to stay efficient'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Threshold Repeats',
          duration: '36–42 min',
          description: 'Three threshold blocks with short floats refine pacing control.',
          battlePlan: '• 10 min easy + 3x20s strides (40s easy)\n• 3x: 8 min threshold + 2 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Repeated threshold bouts raise LT while preserving form quality.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Keep cadence quick; avoid overstriding as fatigue accumulates',
              description: 'Keep cadence quick; avoid overstriding as fatigue accumulates'
            },
            {
              icon: 'leaf',
              title: 'Breathe rhythmically; relax jaw and hands to save upper body',
              description: 'Breathe rhythmically; relax jaw and hands to save upper body'
            }
          ]
        },
        {
          name: 'Long Fartlek',
          duration: '38–44 min',
          description: 'Alternate 1 hard/1 easy to train smooth accelerations and rhythm.',
          battlePlan: '• 10 min easy\n• 10x: 1 min hard + 1 min easy\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'One-minute surges build power and aerobic sharpness efficiently.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive arms during surges; keep chest tall and hips forward',
              description: 'Drive arms during surges; keep chest tall and hips forward'
            },
            {
              icon: 'walk',
              title: 'Make easy minutes truly easy to protect form and quality',
              description: 'Make easy minutes truly easy to protect form and quality'
            }
          ]
        },
        {
          name: 'Tempo Progression',
          duration: '40–45 min',
          description: 'Move from easy to steady to tempo, reinforcing smooth changes.',
          battlePlan: '• 10 min easy\n• 10 min steady\n• 10 min tempo\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Stepwise intensity rise builds resilience and precise pacing.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Increase effort smoothly; avoid abrupt pace jumps or surging',
              description: 'Increase effort smoothly; avoid abrupt pace jumps or surging'
            },
            {
              icon: 'body',
              title: 'Maintain midline stability; minimize torso twist as speed rises',
              description: 'Maintain midline stability; minimize torso twist as speed rises'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Bike',
    icon: 'bicycle',
    workouts: {
      beginner: [
        {
          name: 'Cadence Builder',
          duration: '25–30 min',
          description: 'Easy ride plus brief fast legs improves timing and smoothness.',
          battlePlan: '• 8 min easy\n• 6x: 30s 90–110 RPM + 90s easy\n• 6–8 min easy',
          imageUrl: 'https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/69v88tej_download%20%281%29.png',
          intensityReason: 'Short spin-ups add leg speed with minimal joint loading.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Knees track straight; light grip; relax shoulders and neck',
              description: 'Knees track straight; light grip; relax shoulders and neck'
            },
            {
              icon: 'leaf',
              title: 'Maintain neutral spine; breathe deep to reduce tension',
              description: 'Maintain neutral spine; breathe deep to reduce tension'
            }
          ]
        },
        {
          name: 'Intro Intervals',
          duration: '24–28 min',
          description: 'Alternate moderate and easy minutes to build base steadily.',
          battlePlan: '• 6–8 min easy\n• 6x: 1 min RPE 6 + 1 min easy\n• 5–6 min easy',
          imageUrl: 'https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/i40y65gs_download%20%282%29.png',
          intensityReason: 'One-minute efforts lift heart rate safely and smoothly.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Smooth pedal circles; avoid mashing low cadence under load',
              description: 'Smooth pedal circles; avoid mashing low cadence under load'
            },
            {
              icon: 'body',
              title: 'Breathe deep; keep hips steady to protect lower back',
              description: 'Breathe deep; keep hips steady to protect lower back'
            }
          ]
        },
        {
          name: 'Rolling Ride',
          duration: '30–35 min',
          description: 'Sprinkle moderates to learn effort control and posture skills.',
          battlePlan: '• 10 min easy\n• 3x3 min moderate + 2 min easy\n• 5–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Mostly easy riding with pick-ups enhances aerobic base.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips stable; gently brace core to limit side rocking',
              description: 'Hips stable; gently brace core to limit side rocking'
            },
            {
              icon: 'leaf',
              title: 'Relax neck and drop shoulders to reduce fatigue',
              description: 'Relax neck and drop shoulders to reduce fatigue'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sweet Spot Blocks',
          duration: '40–45 min',
          description: 'Three sweet-spot segments build sustained output and control.',
          battlePlan: '• 10 min easy + 3x20s spin-ups\n• 3x: 8 min RPE 7–8 + 3 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Near-threshold work boosts power and repeatable endurance.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Keep cadence steady; avoid mashing big gears that stress knees',
              description: 'Keep cadence steady; avoid mashing big gears that stress knees'
            },
            {
              icon: 'body',
              title: 'Soft elbows; quiet torso to improve power transfer and comfort',
              description: 'Soft elbows; quiet torso to improve power transfer and comfort'
            }
          ]
        },
        {
          name: 'Over-Unders',
          duration: '38–42 min',
          description: 'Alternate under/over efforts to refine pacing transitions.',
          battlePlan: '• 10 min easy\n• 3x: (1 min RPE 7, 1 min RPE 8) x4 + 3 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Fluctuating around threshold trains breath and control.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Breathe through surges; brace core to stabilize pelvis',
              description: 'Breathe through surges; brace core to stabilize pelvis'
            },
            {
              icon: 'bicycle',
              title: 'Avoid power spikes when exiting hard segments; stay smooth',
              description: 'Avoid power spikes when exiting hard segments; stay smooth'
            }
          ]
        },
        {
          name: 'Hill Simulation',
          duration: '35–40 min',
          description: 'Short climbs with easy spins improve torque and posture.',
          battlePlan: '• 10 min easy\n• 5x: 2 min 60–70 RPM RPE 7 + 2 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Low-cadence seated grinds build strength with safety.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive through heels; keep hips steady; avoid side rocking',
              description: 'Drive through heels; keep hips steady; avoid side rocking'
            },
            {
              icon: 'bicycle',
              title: 'Knees track forward; no collapse inward under higher torque',
              description: 'Knees track forward; no collapse inward under higher torque'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'VO2 Max Repeats',
          duration: '40–46 min',
          description: '6x2 minutes hard with equal easy sharpens sustainable power.',
          battlePlan: '• 12 min easy + 3x15s high cadence\n• 6x: 2 min RPE 9 + 2 min easy\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short hard reps raise aerobic ceiling with quality rest.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest proud; brace core; avoid excessive handlebar tension',
              description: 'Chest proud; brace core; avoid excessive handlebar tension'
            },
            {
              icon: 'bicycle',
              title: 'Ease into first 10 seconds; prevent spiky torque surges',
              description: 'Ease into first 10 seconds; prevent spiky torque surges'
            }
          ]
        },
        {
          name: 'Threshold Pyramid',
          duration: '42–48 min',
          description: '4-6-8-6-4 hard with equal easy improves sustained power.',
          battlePlan: '• 12 min easy\n• 4 hard + 4 easy\n• 6 hard + 6 easy\n• 8 hard + 8 easy\n• 6 hard + 6 easy\n• 4 hard + 4 easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Stepwise threshold sets build durable pacing control.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'If safe, hold aero; relax hands and jaw to save energy',
              description: 'If safe, hold aero; relax hands and jaw to save energy'
            },
            {
              icon: 'leaf',
              title: 'Pace by effort; exit reps smoothly without surging',
              description: 'Pace by effort; exit reps smoothly without surging'
            }
          ]
        },
        {
          name: 'Big Gear Bursts',
          duration: '38–44 min',
          description: 'Short surges then relaxed spin reinforce cadence economy.',
          battlePlan: '• 12 min easy\n• 10x: 30s RPE 9 + 90s easy\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'High-torque sprints train snap and smooth transitions.',
          moodTips: [
            {
              icon: 'body',
              title: 'Slight chest forward; stable hips; avoid heavy front load',
              description: 'Slight chest forward; stable hips; avoid heavy front load'
            },
            {
              icon: 'bicycle',
              title: 'Explode then settle cadence to reduce wasted movement',
              description: 'Explode then settle cadence to reduce wasted movement'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Swim',
    icon: 'water',
    workouts: {
      beginner: [
        {
          name: 'Freestyle 25s Easy Pace',
          duration: '18–24 min',
          description: 'Easy 25s with generous rest emphasize comfort and clean form.',
          battlePlan: '• 10x25 Freestyle, 30–45s rest (own pace if needed)\n• 4x25 Backstroke easy, 30–45s rest\n• 50 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Very short repeats reduce fatigue and shoulder strain safely.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Exhale fully underwater; avoid breath holding to relax stroke',
              description: 'Exhale fully underwater; avoid breath holding to relax stroke'
            },
            {
              icon: 'water',
              title: 'Eyes down; hips high; gentle kick to spare lower back strain',
              description: 'Eyes down; hips high; gentle kick to spare lower back strain'
            }
          ]
        },
        {
          name: 'Mixed 25s Own Pace',
          duration: '18–24 min',
          description: 'Simple free, back, breast 25s with long rest encourage skill.',
          battlePlan: '• 6x25 Freestyle, 30–45s rest (own pace)\n• 4x25 Backstroke, 30–45s rest\n• 4x25 Breaststroke, 40–60s rest\n• 50 easy choice',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Variety at self-selected pace builds comfort and confidence.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Gentle hand entry; avoid crossing midline to protect shoulders',
              description: 'Gentle hand entry; avoid crossing midline to protect shoulders'
            },
            {
              icon: 'water',
              title: 'Soft kick; toes pointed; relaxed ankles for efficient propulsion',
              description: 'Soft kick; toes pointed; relaxed ankles for efficient propulsion'
            }
          ]
        },
        {
          name: 'Freestyle 50s Light',
          duration: '20–26 min',
          description: 'Easy-moderate 50s refine breathing rhythm and streamline feel.',
          battlePlan: '• 6x50 Freestyle easy-moderate, 40–60s rest\n• 4x25 Kick easy (choice), 30–45s rest\n• 50 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short 50s with rest build pacing awareness and ease strain.',
          moodTips: [
            {
              icon: 'water',
              title: 'Count strokes per length; keep it steady to gauge efficiency',
              description: 'Count strokes per length; keep it steady to gauge efficiency'
            },
            {
              icon: 'body',
              title: 'Head still; rotate from torso; avoid lifting face to breathe',
              description: 'Head still; rotate from torso; avoid lifting face to breathe'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Free 50s Steady',
          duration: '24–32 min',
          description: 'Twelve 50s at relaxed pace build efficiency and control.',
          battlePlan: '• 12x50 Freestyle steady, 25–45s rest (own pace ok)\n• 100 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Steady 50s improve rhythm and base with flexible rests.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Early vertical forearm; patient catch to protect shoulders',
              description: 'Early vertical forearm; patient catch to protect shoulders'
            },
            {
              icon: 'body',
              title: 'Streamline off walls; brace core lightly to keep hips afloat',
              description: 'Streamline off walls; brace core lightly to keep hips afloat'
            }
          ]
        },
        {
          name: 'Stroke Mix 50s Steady',
          duration: '26–34 min',
          description: 'Free, back, breast 50s improve posture and comfort evenly.',
          battlePlan: '• 6x50 Freestyle steady, 25–40s rest\n• 4x50 Backstroke steady, 30–45s rest\n• 4x50 Breaststroke steady, 35–60s rest\n• 100 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Balanced stroke work builds coordination under control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Backstroke: neutral head, steady hip-driven roll for alignment',
              description: 'Backstroke: neutral head, steady hip-driven roll for alignment'
            },
            {
              icon: 'water',
              title: 'Breaststroke: glide briefly; gentle knee flex to spare joints',
              description: 'Breaststroke: glide briefly; gentle knee flex to spare joints'
            }
          ]
        },
        {
          name: 'Freestyle 100s Easy-Moderate',
          duration: '26–36 min',
          description: 'Six easy-moderate 100s train breathing and steady rhythm.',
          battlePlan: '• 6x100 Freestyle easy-moderate, 45–75s rest (own pace)\n• 100 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Longer 100s build pacing control without heavy fatigue.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Breathe bilaterally only if comfortable; prioritize relaxed rhythm',
              description: 'Breathe bilaterally only if comfortable; prioritize relaxed rhythm'
            },
            {
              icon: 'water',
              title: 'Keep kick light; save shoulders by avoiding overreaching pulls',
              description: 'Keep kick light; save shoulders by avoiding overreaching pulls'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Free 100s Strong-Relaxed',
          duration: '30–40 min',
          description: 'Eight strong 100s emphasize clean catch and even pacing.',
          battlePlan: '• 8x100 Freestyle strong, 45–75s rest\n• 200 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Firm 100s with rest sustain speed and technique quality.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Fast hand exit; avoid crossing centerline to protect shoulders',
              description: 'Fast hand exit; avoid crossing centerline to protect shoulders'
            },
            {
              icon: 'body',
              title: 'Neutral neck; minimal lifting; sight only as needed for comfort',
              description: 'Neutral neck; minimal lifting; sight only as needed for comfort'
            }
          ]
        },
        {
          name: 'Mixed Strokes 100s',
          duration: '32–40 min',
          description: 'Free, back, breast 100s with rest enhance technical stability.',
          battlePlan: '• 4x100 Freestyle, 40–60s\n• 3x100 Backstroke, 45–75s\n• 3x100 Breaststroke, 60–90s\n• 200 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Longer mixed repeats build resilience and balance safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Backstroke: hip-driven roll, straight entry line to reduce drag',
              description: 'Backstroke: hip-driven roll, straight entry line to reduce drag'
            },
            {
              icon: 'water',
              title: 'Breaststroke: controlled kick; avoid knee overflex to save joints',
              description: 'Breaststroke: controlled kick; avoid knee overflex to save joints'
            }
          ]
        },
        {
          name: 'Free Ladder Own Pace',
          duration: '32–42 min',
          description: '50-100-150-100-50 builds rhythm with own-pace recovery.',
          battlePlan: '• 50 Freestyle, 30–45s\n• 100 Freestyle, 45–75s\n• 150 Freestyle, 60–90s\n• 100 Freestyle, 45–75s\n• 50 Freestyle, 30–45s\n• 100 easy Freestyle',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Progressing distances train pacing and efficiency steadily.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Hold steady stroke counts; adjust breath timing as distance grows',
              description: 'Hold steady stroke counts; adjust breath timing as distance grows'
            },
            {
              icon: 'body',
              title: 'Maintain long body line; minimize sway for better propulsion',
              description: 'Maintain long body line; minimize sway for better propulsion'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Hills',
    icon: 'trending-up',
    workouts: {
      beginner: [
        {
          name: 'Hill Intro Mix',
          duration: '16–22 min',
          description: 'High knees, shuffles, jogs with walkbacks refine uphill form.',
          battlePlan: '• 4x 25 yd uphill high knees (walk down)\n• 4x 25 yd uphill side shuffle L/R (alt) (walk down)\n• 4x 30 yd uphill easy jog (walk down)',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short uphill drills build coordination and confidence safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Short steps; land under hips; keep chest tall to protect knees',
              description: 'Short steps; land under hips; keep chest tall to protect knees'
            },
            {
              icon: 'trending-up',
              title: 'Side shuffle with toes forward; soft knees to avoid valgus',
              description: 'Side shuffle with toes forward; soft knees to avoid valgus'
            }
          ]
        },
        {
          name: 'Hill Form Trio',
          duration: '16–22 min',
          description: 'Three drills uphill with walkbacks develop cadence control.',
          battlePlan: '• 4x 20 yd uphill skips (walk down)\n• 4x 20 yd uphill marching high knees (walk down)\n• 4x 20 yd uphill backpedal (walk down)',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Marching, skipping, backpedal build timing and balance.',
          moodTips: [
            {
              icon: 'body',
              title: 'March tall; ribs over hips; drive knee straight ahead',
              description: 'March tall; ribs over hips; drive knee straight ahead'
            },
            {
              icon: 'walk',
              title: 'Backpedal small steps; eyes forward to protect balance',
              description: 'Backpedal small steps; eyes forward to protect balance'
            }
          ]
        },
        {
          name: 'Hill Stability Mix',
          duration: '18–24 min',
          description: 'Shuffle, karaoke, jog sequence improves control transitions.',
          battlePlan: '• 3 rounds:\n\n25 yd uphill side shuffle L\n25 yd uphill side shuffle R\n25 yd uphill karaoke (lead L)\n25 yd uphill karaoke (lead R)\n30 yd uphill easy jog\nWalk down between each',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Lateral and rotational steps enhance hip strength safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Karaoke: rotate from hips, not knees; torso tall and relaxed',
              description: 'Karaoke: rotate from hips, not knees; torso tall and relaxed'
            },
            {
              icon: 'walk',
              title: 'Jog upright; stable ankles; avoid rolling outward on contact',
              description: 'Jog upright; stable ankles; avoid rolling outward on contact'
            }
          ]
        },
        {
          name: 'Sprint-Only Intro',
          duration: '16–22 min',
          description: 'Repeat brief sprints with walkbacks to engrain mechanics.',
          battlePlan: '• 8x 20–25 yd uphill sprints, full walk down',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Very short incline sprints teach speed with low impact.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode then relax; quick steps; posture tall; arms drive back',
              description: 'Explode then relax; quick steps; posture tall; arms drive back'
            },
            {
              icon: 'body',
              title: 'Stop early if technique fades; protect calves and hamstrings',
              description: 'Stop early if technique fades; protect calves and hamstrings'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hill Power Mix',
          duration: '18–24 min',
          description: 'Powerful jumps plus sprints develop rhythm and drive uphill.',
          battlePlan: '• 6x 12–15 uphill bounds (walk down)\n• 6x 25–30 yd uphill skips for height (walk down)\n• 6x 25–30 yd uphill sprints (walk down)',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Bounds, skips, sprints build elastic strength safely.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bounds: knee drive then hip extend; stick landings under control',
              description: 'Bounds: knee drive then hip extend; stick landings under control'
            },
            {
              icon: 'walk',
              title: 'Avoid heel striking uphill; keep cadence snappy and forward',
              description: 'Avoid heel striking uphill; keep cadence snappy and forward'
            }
          ]
        },
        {
          name: 'Agility Hill Circuit',
          duration: '20–26 min',
          description: 'Karaoke, shuffles, backpedal, sprints build coordination.',
          battlePlan: '• 4 rounds:\n\n30 yd uphill karaoke (lead L)\n30 yd uphill karaoke (lead R)\n25 yd uphill side shuffle L\n25 yd uphill side shuffle R\n25 yd uphill backpedal\n25 yd uphill sprint\nWalk down between reps',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Lateral and rotational moves challenge balance safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Torso tall; no side lean; keep steps quick to reduce slip risk',
              description: 'Torso tall; no side lean; keep steps quick to reduce slip risk'
            },
            {
              icon: 'walk',
              title: 'Backpedal toes up; short steps; maintain center over feet',
              description: 'Backpedal toes up; short steps; maintain center over feet'
            }
          ]
        },
        {
          name: 'Strength Endurance Mix',
          duration: '20–26 min',
          description: 'Lunges, broad jumps, sprints reinforce controlled power.',
          battlePlan: '• 6 sets:\n\n20 yd uphill walking lunges\n6–8 uphill broad jumps (~20 yd)\n20 yd uphill sprint\nWalk down recovery',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Lunges and jumps pre-fatigue, then sprints build posture.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lunges: knee over mid-foot; upright torso; no inward collapse',
              description: 'Lunges: knee over mid-foot; upright torso; no inward collapse'
            },
            {
              icon: 'trending-up',
              title: 'Broad jumps: swing arms; land softly; stabilize before sprint',
              description: 'Broad jumps: swing arms; land softly; stabilize before sprint'
            }
          ]
        },
        {
          name: 'Sprint-Only 30s',
          duration: '18–24 min',
          description: 'Ten uphill sprints at 30–40 yd build acceleration safely.',
          battlePlan: '• 10x 30–40 yd uphill sprints, full walk down',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short fast sprints improve power with full recovery.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Drive arms; chin level; tall posture; quick ground contacts',
              description: 'Drive arms; chin level; tall posture; quick ground contacts'
            },
            {
              icon: 'body',
              title: 'If hamstrings tighten, reduce volume to protect from strain',
              description: 'If hamstrings tighten, reduce volume to protect from strain'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Mixed Hill Gauntlet',
          duration: '24–30 min',
          description: 'Sprints, knees, bounds, karaoke, shuffles train versatility.',
          battlePlan: '• 3 rounds:\n\n40 yd uphill sprint\n30 yd uphill high knees\n12–15 uphill bounds\n30 yd uphill karaoke (each lead)\n30 yd uphill side shuffle (each)\nWalk down between all',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Varied drills challenge stiffness, power, and precision.',
          moodTips: [
            {
              icon: 'body',
              title: 'Crisp contacts; avoid overreaching; keep hips tall and aligned',
              description: 'Crisp contacts; avoid overreaching; keep hips tall and aligned'
            },
            {
              icon: 'trending-up',
              title: 'Take full walkbacks; quality first to protect tendons and calves',
              description: 'Take full walkbacks; quality first to protect tendons and calves'
            }
          ]
        },
        {
          name: 'Bear Crawl + Sprint',
          duration: '22–28 min',
          description: 'Crawl, backpedal, sprint rotations build control, quickness.',
          battlePlan: '• 8 sets:\n\n15–20 yd uphill bear crawl\n20 yd uphill backpedal\n20–25 yd uphill sprint\nWalk down recovery',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Crawling loads core; sprints add speed under fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Bear crawl: hips low; knees under hips; keep spine neutral',
              description: 'Bear crawl: hips low; knees under hips; keep spine neutral'
            },
            {
              icon: 'walk',
              title: 'Backpedal: short steps; eyes forward to maintain safe balance',
              description: 'Backpedal: short steps; eyes forward to maintain safe balance'
            }
          ]
        },
        {
          name: 'Jump + Sprint Mix',
          duration: '22–28 min',
          description: 'Skips, broad jumps, sprints build explosive rhythm safely.',
          battlePlan: '• 6 sets:\n\n25 yd uphill skips for distance\n6–8 uphill broad jumps (~20–25 yd)\n30 yd uphill sprint\nWalk down',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Jumps prime tissues; sprints reinforce fast mechanics.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Use strong arm swing; knees track; stick landings before moving',
              description: 'Use strong arm swing; knees track; stick landings before moving'
            },
            {
              icon: 'body',
              title: 'Keep volume crisp; if landings get loud, cut reps to protect joints',
              description: 'Keep volume crisp; if landings get loud, cut reps to protect joints'
            }
          ]
        },
        {
          name: 'Sprint-Only 20s',
          duration: '18–24 min',
          description: 'Twelve 20–25 yd sprints prioritize high-quality starts.',
          battlePlan: '• 12x 20–25 yd uphill sprints, full walk down',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Very short sprints train quickness with low cumulative load.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Explode then relax; quick turnover; hips tall; arms powerful',
              description: 'Explode then relax; quick turnover; hips tall; arms powerful'
            },
            {
              icon: 'body',
              title: 'End early if form fades; prioritize tendon and calf protection',
              description: 'End early if form fades; prioritize tendon and calf protection'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Park workout',
    icon: 'leaf',
    workouts: {
      beginner: [
        {
          name: 'Bench And Path',
          duration: '18–22 min',
          description: 'Squats, push-ups, dips plus walking maintain clean form.',
          battlePlan: '• 3 rounds:\n\n12 bench squats\n10 incline push-ups (bench)\n8 bench dips\n60s easy walk',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Simple bodyweight moves build strength with joint safety.',
          moodTips: [
            {
              icon: 'body',
              title: 'Squats: sit back; knees track over mid-foot; even foot pressure',
              description: 'Squats: sit back; knees track over mid-foot; even foot pressure'
            },
            {
              icon: 'leaf',
              title: 'Dips: shoulders down; slight forward lean; avoid shrugging',
              description: 'Dips: shoulders down; slight forward lean; avoid shrugging'
            }
          ]
        },
        {
          name: 'Park Circuit',
          duration: '18–22 min',
          description: 'Step-ups, rows, dips with light run build posture control.',
          battlePlan: '• 3 rounds:\n\n10 step-ups/side (bench)\n8 bench rows (underhand)\n8–10 bench dips\n150–200 m easy jog\n• 60–90s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Alternating strength and jog sustains HR without spikes.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Step-ups: full foot on bench; control descent to protect knees',
              description: 'Step-ups: full foot on bench; control descent to protect knees'
            },
            {
              icon: 'body',
              title: 'Rows: pull shoulder blades first; keep neck long and relaxed',
              description: 'Rows: pull shoulder blades first; keep neck long and relaxed'
            }
          ]
        },
        {
          name: 'Mobility And Strength',
          duration: '16–20 min',
          description: 'Lunges, elevated push-ups, dips with walks build control.',
          battlePlan: '• 3 rounds:\n\n8 walking lunges/side\n8–10 incline push-ups\n8 bench dips\n60s easy walk',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Gentle pairing improves movement quality and stability.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lunges: upright torso; knee follows toes; avoid inward collapse',
              description: 'Lunges: upright torso; knee follows toes; avoid inward collapse'
            },
            {
              icon: 'leaf',
              title: 'Push-ups: straight line ears-to-ankles; no low-back sagging',
              description: 'Push-ups: straight line ears-to-ankles; no low-back sagging'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Park Push-Pull-Run',
          duration: '22–26 min',
          description: 'Rows, push-ups, dips, step-ups, runs build endurance.',
          battlePlan: '• 4 rounds:\n\n10 bench rows\n10 push-ups\n10–12 dips\n10 step-ups/side\n200 m run\n• Rest 60–90s',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Balanced upper/lower work with runs sustains output.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rows: ribs down; avoid flaring; elbows track for shoulder safety',
              description: 'Rows: ribs down; avoid flaring; elbows track for shoulder safety'
            },
            {
              icon: 'leaf',
              title: 'Dips: slight forward lean; keep elbows near body; full control',
              description: 'Dips: slight forward lean; keep elbows near body; full control'
            }
          ]
        },
        {
          name: 'EMOM Park Strength',
          duration: '20–24 min',
          description: 'Dips, jumps, push-ups, short runs cycle with planned rest.',
          battlePlan: '• 20 min EMOM:\n\nMin 1: 10–12 dips\nMin 2: 10 bench jumps or step-ups/side\nMin 3: 10–12 push-ups\nMin 4: 200 m run',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'EMOM timing preserves quality while managing fatigue.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bench jumps: land softly; knees stacked; absorb through hips',
              description: 'Bench jumps: land softly; knees stacked; absorb through hips'
            },
            {
              icon: 'body',
              title: 'Push-ups: elbows ~45°; shoulder blades glide; avoid flares',
              description: 'Push-ups: elbows ~45°; shoulder blades glide; avoid flares'
            }
          ]
        },
        {
          name: 'Circuit With Runs',
          duration: '22–26 min',
          description: 'Dips, squats, rows, runs create balanced stress safely.',
          battlePlan: '• 4 rounds:\n\n12 bench dips\n15 air squats\n10 bench rows\n200 m run\n• 60–90s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Mixed calisthenics and light runs train steady output.',
          moodTips: [
            {
              icon: 'body',
              title: 'Squats: tripod foot; knees track; maintain even depth each rep',
              description: 'Squats: tripod foot; knees track; maintain even depth each rep'
            },
            {
              icon: 'leaf',
              title: 'Rows: neutral neck; engage lats first; avoid shrugging tension',
              description: 'Rows: neutral neck; engage lats first; avoid shrugging tension'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Park Gauntlet Strength',
          duration: '26–32 min',
          description: 'Dips, decline push-ups, jumps, runs challenge stamina.',
          battlePlan: '• 3 rounds:\n\n15 dips\n12 decline push-ups (feet on bench)\n12 bench jumps\n300 m run\n• 90s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Higher volumes with runs test posture and breathing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Decline push-ups: brace core; avoid lumbar sway; even tempo',
              description: 'Decline push-ups: brace core; avoid lumbar sway; even tempo'
            },
            {
              icon: 'trending-up',
              title: 'Bench jumps: toe-ball landings; soft knees; stabilize before move',
              description: 'Bench jumps: toe-ball landings; soft knees; stabilize before move'
            }
          ]
        },
        {
          name: 'EMOM Sprints And Dips',
          duration: '24–28 min',
          description: 'Alternate dips, push-ups with sprints and walkbacks.',
          battlePlan: '• 24 min alternating EMOM:\n\nOdd: 12 dips + 10 push-ups\nEven: 2x 50 m sprint (walk back)',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short sprints add intensity while EMOM preserves form.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Sprint tall; quick contacts; relax jaw; shorten steps slightly',
              description: 'Sprint tall; quick contacts; relax jaw; shorten steps slightly'
            },
            {
              icon: 'body',
              title: 'Dips: stop before shoulder pinch; keep scapulae moving freely',
              description: 'Dips: stop before shoulder pinch; keep scapulae moving freely'
            }
          ]
        },
        {
          name: 'Bars And Burpees',
          duration: '24–30 min',
          description: 'Dips, push-ups, burpees, runs test control and pacing.',
          battlePlan: '• 4 rounds:\n\n15 dips\n12 push-ups\n12 burpees\n200 m run\n• 60–90s rest',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Pairing push patterns and runs increases sustained load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Burpees: solid plank line; step out if low back feels stressed',
              description: 'Burpees: solid plank line; step out if low back feels stressed'
            },
            {
              icon: 'leaf',
              title: 'Dips: elbows track; avoid bouncing; prioritize full, stable range',
              description: 'Dips: elbows track; avoid bouncing; prioritize full, stable range'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Track workout',
    icon: 'ellipse-outline',
    workouts: {
      beginner: [
        {
          name: 'Drills And 40s',
          duration: '22–26 min',
          description: 'High knees, skips, strides refine cadence and alignment.',
          battlePlan: '• 2 laps easy jog\n• 2x40 m high knees (walk back)\n• 2x40 m A-skips (walk back)\n• 4x40 m relaxed strides (walk back)',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short drills improve rhythm and posture with low impact.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay tall; lean from ankles; hips stacked under ribcage alignment',
              description: 'Stay tall; lean from ankles; hips stacked under ribcage alignment'
            },
            {
              icon: 'walk',
              title: 'Land under hips; quick off ground to reduce braking and impact',
              description: 'Land under hips; quick off ground to reduce braking and impact'
            }
          ]
        },
        {
          name: 'Bounds And Straights',
          duration: '22–26 min',
          description: 'Bounds, skips, then 60 m straights at moderate pace.',
          battlePlan: '• 2 laps easy jog\n• 2x40 m bounds (walk back)\n• 2x40 m skips for height (walk back)\n• 4x60 m straights moderate (walk back)',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Low-volume plyos enhance elasticity with control.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Bounds: soft land; knee tracks forward; avoid excessive reach',
              description: 'Bounds: soft land; knee tracks forward; avoid excessive reach'
            },
            {
              icon: 'body',
              title: 'Skips: coordinated arm drive; tall posture for smooth rhythm',
              description: 'Skips: coordinated arm drive; tall posture for smooth rhythm'
            }
          ]
        },
        {
          name: 'Short Sprint Intro',
          duration: '22–26 min',
          description: 'Multiple 30 m sprints with walkbacks build speed safely.',
          battlePlan: '• 2 laps easy jog\n• 8–10x30 m sprints, full walk back',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Very short sprints teach acceleration without overload.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Build first 10 m; avoid lunging; keep chin level and relaxed',
              description: 'Build first 10 m; avoid lunging; keep chin level and relaxed'
            },
            {
              icon: 'walk',
              title: 'Short, fast steps under hips; arms punch back, not across body',
              description: 'Short, fast steps under hips; arms punch back, not across body'
            }
          ]
        },
        {
          name: 'Curves And Drills',
          duration: '24–28 min',
          description: 'Easy curves, drills, and 40 m sprints refine cadence.',
          battlePlan: '• 2 laps easy jog\n• 2x100 m curves easy (straights walk)\n• 2x30 m high knees (walk back)\n• 4x40 m sprints (walk back)',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Curved running practice improves balance and control.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Lean subtly through turns from ankles; keep posture upright',
              description: 'Lean subtly through turns from ankles; keep posture upright'
            },
            {
              icon: 'body',
              title: 'Knees lift; feet recover quickly under body; avoid overstride',
              description: 'Knees lift; feet recover quickly under body; avoid overstride'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: '150s With Drills',
          duration: '26–32 min',
          description: 'A-skips, bounds into controlled 150s with walkbacks.',
          battlePlan: '• 1 lap easy jog\n• 2x40 m A-skips\n• 2x40 m bounds\n• 4x150 m @ 3–5k effort, walk 150 m',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Drills then 150s build speed endurance with form.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep torso quiet; elbows drive straight; avoid crossing midline',
              description: 'Keep torso quiet; elbows drive straight; avoid crossing midline'
            },
            {
              icon: 'ellipse-outline',
              title: 'On 150s, relax face and jaw; hold tall hips as pace increases',
              description: 'On 150s, relax face and jaw; hold tall hips as pace increases'
            }
          ]
        },
        {
          name: 'Sprint 40s And 30s',
          duration: '26–32 min',
          description: 'Six 40s and six 30s build acceleration and posture.',
          battlePlan: '• 1 lap easy jog\n• 6x40 m fast, walk back\n• 6x30 m fast, walk back',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short sprints sharpen turnover with full recovery.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Smooth acceleration; avoid sudden lean; keep hips stacked tall',
              description: 'Smooth acceleration; avoid sudden lean; keep hips stacked tall'
            },
            {
              icon: 'walk',
              title: 'Quick steps; no braking; land under center to save joints',
              description: 'Quick steps; no braking; land under center to save joints'
            }
          ]
        },
        {
          name: 'Form Circuit',
          duration: '28–34 min',
          description: 'High knees, skips, bounds precede 60 m quality strides.',
          battlePlan: '• 3 rounds:\n\n30 m high knees (walk back)\n30 m A-skips (walk back)\n30 m bounds (walk back)\n60 m stride',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Drills with strides build posture and elasticity safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stack ribs over pelvis; reduce overreach for safer ground contact',
              description: 'Stack ribs over pelvis; reduce overreach for safer ground contact'
            },
            {
              icon: 'trending-up',
              title: 'Light, springy contacts; push back, not up; keep cadence smooth',
              description: 'Light, springy contacts; push back, not up; keep cadence smooth'
            }
          ]
        },
        {
          name: 'Straights And Turns',
          duration: '28–34 min',
          description: 'Faster straights, easy curves reinforce pacing transitions.',
          battlePlan: '• 8 laps: straights moderate-fast + curves easy jog',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Alternating straights and curves teaches rhythm control.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Float curves with relaxed cadence; avoid over-leaning torso',
              description: 'Float curves with relaxed cadence; avoid over-leaning torso'
            },
            {
              icon: 'body',
              title: 'Toe-off under center mass; arms drive straight back consistently',
              description: 'Toe-off under center mass; arms drive straight back consistently'
            }
          ]
        }
      ],
      advanced: [
        {
          name: '40s And 60s Speed',
          duration: '28–34 min',
          description: 'Eight 40s plus six 60s maintain crisp mechanics safely.',
          battlePlan: '• 8x40 m fast, full walk back\n• 6x60 m relaxed fast, walk back',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short sprints and relaxed strides refine max velocity.',
          moodTips: [
            {
              icon: 'body',
              title: 'Relax jaw and hands; tall hips; avoid collapsing into steps',
              description: 'Relax jaw and hands; tall hips; avoid collapsing into steps'
            },
            {
              icon: 'trending-up',
              title: 'Drive elbows back; keep contacts quick and under the body',
              description: 'Drive elbows back; keep contacts quick and under the body'
            }
          ]
        },
        {
          name: 'Drill-Sprint Matrix',
          duration: '30–36 min',
          description: 'Knees, skips, bounds before 50s reinforce timing, rhythm.',
          battlePlan: '• 3 rounds:\n\n30 m high knees (walk back)\n30 m A-skips (walk back)\n30 m bounds (walk back)\n2x50 m sprints, walk back',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Pairing drills and sprints engrains efficient patterns.',
          moodTips: [
            {
              icon: 'body',
              title: 'Knees punch up; feet recover under hips; avoid casting forward',
              description: 'Knees punch up; feet recover under hips; avoid casting forward'
            },
            {
              icon: 'trending-up',
              title: 'Strong posture with slight ankle lean; no waist bend at speed',
              description: 'Strong posture with slight ankle lean; no waist bend at speed'
            }
          ]
        },
        {
          name: 'Curve Flys + 30s',
          duration: '30–36 min',
          description: 'Fly-in curves into 50s, then 30s sharpen coordination.',
          battlePlan: '• 4x curve fly-in + 50 m fast, walk 200 m\n• 8x30 m sprints, full walk back',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Curve entries and short sprints develop balanced speed.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Smooth lean through curve from ankles; avoid inside foot collapse',
              description: 'Smooth lean through curve from ankles; avoid inside foot collapse'
            },
            {
              icon: 'walk',
              title: 'Quick contacts; no overstride; maintain tall posture throughout',
              description: 'Quick contacts; no overstride; maintain tall posture throughout'
            }
          ]
        },
        {
          name: 'Mixed Accels',
          duration: '30–36 min',
          description: 'Repeating 20-30-40 m efforts builds skill and control.',
          battlePlan: '• 3 sets:\n\n20 m fast, walk back\n30 m fast, walk back\n40 m fast, walk back\n• 2–3 min walk between sets',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Progressing distances train precise force application.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Build each rep smoothly; avoid blasting first step or overreach',
              description: 'Build each rep smoothly; avoid blasting first step or overreach'
            },
            {
              icon: 'body',
              title: 'Hips tall; midfoot contacts; prevent heel striking under fatigue',
              description: 'Hips tall; midfoot contacts; prevent heel striking under fatigue'
            }
          ]
        }
      ]
    }
  }
];