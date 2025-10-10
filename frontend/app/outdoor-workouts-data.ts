// Comprehensive outdoor workout data for all outdoor activities

export const outdoorRunWorkoutDatabase = [
  {
    equipment: 'Outdoor Run',
    icon: 'walk',
    workouts: {
      beginner: [
        {
          name: 'Easy Interval Run',
          duration: '22–25 min',
          description: 'Walk–jog intervals to build cardiovascular base safely without placing excessive strain on joints and muscles.',
          battlePlan: '• 5 min brisk walk\n• 6 rounds: 1 min easy jog + 1 min walk\n• 5 min easy walk',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwb3V0ZG9vcnxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Short jogging bouts effectively lift heart rate while maintaining low impact stress on joints and connective tissues.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep tall posture; slight forward lean from ankles',
              description: 'Keep tall posture; slight forward lean from ankles'
            },
            {
              icon: 'walk',
              title: 'Land under hips; quiet steps to reduce impact',
              description: 'Land under hips; quiet steps to reduce impact'
            }
          ]
        },
        {
          name: 'Progressive Easy Run',
          duration: '25–30 min',
          description: 'Start at comfortable easy pace and gradually finish slightly quicker to build aerobic capacity without excessive stress.',
          battlePlan: '• 5 min easy jog\n• 15–20 min continuous easy→steady\n• 3–5 min walk',
          imageUrl: 'https://images.unsplash.com/photo-1506629905607-53e103a5301d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Gentle progressive pace increase gradually improves aerobic efficiency and running economy without overloading the cardiovascular system.',
          moodTips: [
            {
              icon: 'hand-left',
              title: 'Relax shoulders, hands "hold chips"',
              description: 'Relax shoulders, hands "hold chips"'
            },
            {
              icon: 'leaf',
              title: 'Breathe 3-3; if form slips, slow down',
              description: 'Breathe 3-3; if form slips, slow down'
            }
          ]
        },
        {
          name: 'Run-Walk Loop',
          duration: '24–28 min',
          description: 'Simple run-walk pattern designed for controlled training volume and sustainable cardiovascular adaptation over time.',
          battlePlan: '• 4 min brisk walk\n• 6 rounds: 2 min run + 2 min walk\n• 2–4 min walk',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Alternating running and walking bouts build rhythm and cardiovascular stamina while allowing proper recovery between efforts.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Cadence light; avoid overstriding',
              description: 'Cadence light; avoid overstriding'
            },
            {
              icon: 'eye',
              title: 'Keep chin level; eyes on horizon',
              description: 'Keep chin level; eyes on horizon'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tempo Finish Run',
          duration: '30–35 min',
          description: 'Moderate easy running session with controlled 8–10 minute tempo finish to build lactate threshold and running strength.',
          battlePlan: '• 8 min easy\n• 10–12 min easy\n• 8–10 min tempo (RPE 7–8)\n• 4–5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxydW5uaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Late tempo segment adds physiological stress while limiting overall fatigue accumulation through controlled exposure to lactate threshold pace.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Midfoot land; arms drive straight back',
              description: 'Midfoot land; arms drive straight back'
            },
            {
              icon: 'body',
              title: 'Keep torso quiet; no side sway',
              description: 'Keep torso quiet; no side sway'
            }
          ]
        },
        {
          name: 'Fartlek Pyramid',
          duration: '30–34 min',
          description: 'Structured speed play workout using pyramid format of 1-2-3-2-1 minute hard efforts with equal recovery periods.',
          battlePlan: '• 8 min easy\n• 1 hard/1 easy\n• 2 hard/2 easy\n• 3 hard/3 easy\n• 2 hard/2 easy\n• 1 hard/1 easy\n• 5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Variable intensity surges raise anaerobic power output and improve neuromuscular coordination for enhanced running economy and leg turnover.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Run the effort; ignore small terrain changes',
              description: 'Run the effort; ignore small terrain changes'
            },
            {
              icon: 'cloud',
              title: 'Float recoveries; reset posture',
              description: 'Float recoveries; reset posture'
            }
          ]
        },
        {
          name: 'Steady State Run',
          duration: '32–36 min',
          description: 'Extended steady-state effort following thorough warm-up to build aerobic capacity and metabolic efficiency at moderate intensity.',
          battlePlan: '• 8–10 min easy\n• 20 min steady (talk in phrases)\n• 4–6 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Continuous sub-threshold effort builds aerobic durability and metabolic efficiency while staying below lactate accumulation point.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Even effort; relax on gentle inclines',
              description: 'Even effort; relax on gentle inclines'
            },
            {
              icon: 'body',
              title: 'Check form every 5 min; shoulders down',
              description: 'Check form every 5 min; shoulders down'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Threshold Repeats',
          duration: '36–42 min',
          description: 'Three sets of 8-minute lactate threshold intervals with short recovery jogs to develop sustained speed and metabolic power.',
          battlePlan: '• 10 min easy + 3x20s strides (40s easy)\n• 3x: 8 min threshold + 2 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Repeated threshold efforts with controlled recovery raise lactate threshold power while maintaining precise pacing and form control.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Cadence quick; avoid overstriding at fatigue',
              description: 'Cadence quick; avoid overstriding at fatigue'
            },
            {
              icon: 'leaf',
              title: 'Breathe rhythmically; relax jaw',
              description: 'Breathe rhythmically; relax jaw'
            }
          ]
        },
        {
          name: 'Long Fartlek',
          duration: '38–44 min',
          description: 'Extended fartlek session with ten 1-minute hard surges separated by equal easy recovery to build speed endurance.',
          battlePlan: '• 10 min easy\n• 10x: 1 min hard + 1 min easy\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Frequent high-intensity surges develop anaerobic power and running economy while improving neuromuscular coordination at speed.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive arms in surges; tall chest',
              description: 'Drive arms in surges; tall chest'
            },
            {
              icon: 'walk',
              title: 'Keep easy truly easy to protect form',
              description: 'Keep easy truly easy to protect form'
            }
          ]
        },
        {
          name: 'Tempo Progression',
          duration: '40–45 min',
          description: 'Progressive intensity session building from easy to steady to tempo pace followed by easy cooldown recovery.',
          battlePlan: '• 10 min easy\n• 10 min steady\n• 10 min tempo\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Stepwise intensity progression gradually raises metabolic stress and lactate accumulation while allowing physiological adaptation to increasing demands.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Build smoothly; no sudden pace jumps',
              description: 'Build smoothly; no sudden pace jumps'
            },
            {
              icon: 'body',
              title: 'Maintain midline; avoid torso twist',
              description: 'Maintain midline; avoid torso twist'
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
          name: 'Easy Spin',
          duration: '25–30 min',
          description: 'Gentle cycling session focusing on smooth pedaling technique and building base aerobic fitness without excessive leg fatigue.',
          battlePlan: '• 5 min easy warm-up\n• 15–20 min steady easy pace\n• 5 min cool-down spin',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Low-intensity cycling allows cardiovascular conditioning while minimizing impact stress and building pedaling efficiency for longer rides.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Smooth circular pedal strokes',
              description: 'Smooth circular pedal strokes'
            },
            {
              icon: 'leaf',
              title: 'Breathe naturally; maintain rhythm',
              description: 'Breathe naturally; maintain rhythm'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hill Intervals',
          duration: '35–40 min',
          description: 'Structured hill climbing session with repeated efforts to build leg strength and cardiovascular power on moderate inclines.',
          battlePlan: '• 10 min easy warm-up\n• 5x: 3 min hill climb + 2 min easy\n• 10 min easy cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Hill climbing intervals develop muscular power and aerobic capacity while improving pedaling efficiency under resistance load.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Steady power up hills; stay seated',
              description: 'Steady power up hills; stay seated'
            },
            {
              icon: 'body',
              title: 'Keep shoulders relaxed; grip light',
              description: 'Keep shoulders relaxed; grip light'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Power Intervals',
          duration: '45–50 min',
          description: 'High-intensity interval session with sustained power efforts to develop anaerobic capacity and sustained speed on the bike.',
          battlePlan: '• 15 min progressive warm-up\n• 6x: 4 min hard + 3 min easy\n• 10 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxjeWNsaW5nJTIwZml0bmVzc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Sustained power intervals at threshold intensity develop lactate buffering capacity and muscular endurance for competitive cycling performance.',
          moodTips: [
            {
              icon: 'bicycle',
              title: 'Maintain high cadence; steady pressure',
              description: 'Maintain high cadence; steady pressure'
            },
            {
              icon: 'leaf',
              title: 'Controlled breathing; focus forward',
              description: 'Controlled breathing; focus forward'
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
          name: 'Easy Pool Laps',
          duration: '20–25 min',
          description: 'Gentle swimming session focusing on stroke technique and breathing patterns while building water comfort and base fitness.',
          battlePlan: '• 5 min easy warm-up swim\n• 10–15 min continuous easy pace\n• 5 min cool-down and stretching',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Low-intensity swimming builds cardiovascular fitness while developing stroke efficiency and breathing technique in a joint-friendly environment.',
          moodTips: [
            {
              icon: 'water',
              title: 'Long smooth strokes; bilateral breathing',
              description: 'Long smooth strokes; bilateral breathing'
            },
            {
              icon: 'leaf',
              title: 'Relax between strokes; glide forward',
              description: 'Relax between strokes; glide forward'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Stroke Sets',
          duration: '30–35 min',
          description: 'Structured swimming workout with different stroke combinations and pacing to improve technique and cardiovascular endurance.',
          battlePlan: '• 10 min warm-up mixed strokes\n• 4x: 100m moderate + 50m easy\n• 10 min cool-down easy swim',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Interval swimming sets develop stroke power and aerobic capacity while maintaining technique under moderate fatigue stress.',
          moodTips: [
            {
              icon: 'water',
              title: 'Focus on stroke count; maintain rhythm',
              description: 'Focus on stroke count; maintain rhythm'
            },
            {
              icon: 'body',
              title: 'Core engaged; body position high',
              description: 'Core engaged; body position high'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Sprint Sets',
          duration: '40–45 min',
          description: 'High-intensity swimming workout with sprint intervals and technique focus to develop speed and anaerobic power in water.',
          battlePlan: '• 15 min progressive warm-up\n• 8x: 50m fast + 30s rest\n• 10 min easy cool-down swim',
          imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxzd2ltbWluZyUyMGZpdG5lc3N8ZW58MHx8fHwxNzAzNDc1NjYz&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Sprint swimming intervals develop anaerobic power and stroke rate while improving neuromuscular coordination at high speeds.',
          moodTips: [
            {
              icon: 'water',
              title: 'High stroke rate; explosive starts',
              description: 'High stroke rate; explosive starts'
            },
            {
              icon: 'leaf',
              title: 'Full recovery between sets; stay loose',
              description: 'Full recovery between sets; stay loose'
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
          name: 'Hill Walking',
          duration: '25–30 min',
          description: 'Gentle uphill walking session to build leg strength and cardiovascular fitness while enjoying natural terrain and fresh air.',
          battlePlan: '• 5 min flat warm-up walk\n• 15–20 min moderate hill walk\n• 5 min flat cool-down walk',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Uphill walking provides natural resistance training for legs while building cardiovascular endurance in a low-impact outdoor environment.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Short steps uphill; use handrails if needed',
              description: 'Short steps uphill; use handrails if needed'
            },
            {
              icon: 'leaf',
              title: 'Breathe deeply; enjoy the view',
              description: 'Breathe deeply; enjoy the view'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hill Repeats',
          duration: '30–35 min',
          description: 'Structured uphill running intervals with recovery walks to develop leg power and cardiovascular strength on natural terrain.',
          battlePlan: '• 10 min easy warm-up\n• 6x: 1 min uphill run + 2 min walk down\n• 5 min cool-down walk',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Uphill running intervals build leg strength and anaerobic power while improving running economy and mental toughness on challenging terrain.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Pump arms uphill; lean slightly forward',
              description: 'Pump arms uphill; lean slightly forward'
            },
            {
              icon: 'body',
              title: 'Stay relaxed on descents; control pace',
              description: 'Stay relaxed on descents; control pace'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Mountain Intervals',
          duration: '40–45 min',
          description: 'Challenging hill climbing session with extended uphill efforts to develop exceptional leg strength and aerobic power.',
          battlePlan: '• 15 min progressive warm-up\n• 4x: 4 min hard uphill + 3 min easy\n• 10 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxoaWtpbmclMjBmaXRuZXNzfGVufDB8fHx8MTcwMzQ3NTY2Mw&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Extended uphill intervals at high intensity develop maximum leg strength and cardiovascular power while building mental resilience.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Sustained effort; rhythmic breathing',
              description: 'Sustained effort; rhythmic breathing'
            },
            {
              icon: 'body',
              title: 'Drive with arms; maintain form',
              description: 'Drive with arms; maintain form'
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
          name: 'Park Circuit',
          duration: '20–25 min',
          description: 'Simple bodyweight circuit using park benches and open space to build functional strength and movement confidence outdoors.',
          battlePlan: '• 5 min walking warm-up\n• 3 rounds: bench step-ups, park bench pushups, walking lunges\n• 5 min stretching',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Park equipment circuit provides functional resistance training while building confidence with outdoor exercise and natural movement patterns.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Use benches for support; control movements',
              description: 'Use benches for support; control movements'
            },
            {
              icon: 'body',
              title: 'Focus on form; enjoy fresh air',
              description: 'Focus on form; enjoy fresh air'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Playground Power',
          duration: '30–35 min',
          description: 'Creative park workout using playground equipment and natural features to build functional strength and movement variety.',
          battlePlan: '• 10 min dynamic warm-up\n• 4 stations: pull-ups, bench jumps, bear crawls, sprints\n• 10 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Multi-station park training develops functional strength and coordination while providing variety and mental engagement through creative movement.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Be creative with equipment; stay safe',
              description: 'Be creative with equipment; stay safe'
            },
            {
              icon: 'body',
              title: 'Move efficiently between stations',
              description: 'Move efficiently between stations'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Park Athletics',
          duration: '40–45 min',
          description: 'High-intensity outdoor training session combining strength, power, and agility movements using park environment and natural terrain.',
          battlePlan: '• 15 min movement prep\n• 6 stations: weighted carries, plyometrics, hill sprints, calisthenics\n• 10 min recovery',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxwYXJrJTIwd29ya291dHxlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Advanced park training integrates strength, power, and conditioning while developing athletic movement patterns in natural outdoor environment.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Use terrain features; maintain intensity',
              description: 'Use terrain features; maintain intensity'
            },
            {
              icon: 'body',
              title: 'Explosive movements; controlled landings',
              description: 'Explosive movements; controlled landings'
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
          name: 'Track Walking',
          duration: '25–30 min',
          description: 'Structured walking workout on track surface to build cardiovascular base while learning proper pacing and distance awareness.',
          battlePlan: '• 5 min easy walking\n• 4x: 1 lap brisk walk + 1 lap easy\n• 5 min cool-down walk',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Track walking provides controlled environment for building cardiovascular fitness while learning pace awareness and distance measurement.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Stay in outer lanes; maintain steady pace',
              description: 'Stay in outer lanes; maintain steady pace'
            },
            {
              icon: 'leaf',
              title: 'Count laps; enjoy the rhythm',
              description: 'Count laps; enjoy the rhythm'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Track Intervals',
          duration: '35–40 min',
          description: 'Structured running intervals on measured track surface to develop speed and pacing skills with precise distance control.',
          battlePlan: '• 10 min warm-up jog\n• 6x: 400m moderate + 200m easy jog\n• 10 min cool-down',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Track intervals develop speed and pacing skills while providing precise distance measurement for consistent training adaptation.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Use inside lanes; consistent splits',
              description: 'Use inside lanes; consistent splits'
            },
            {
              icon: 'body',
              title: 'Smooth turns; relax on straights',
              description: 'Smooth turns; relax on straights'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Speed Sessions',
          duration: '45–50 min',
          description: 'High-intensity track workout with short fast intervals and full recovery to develop maximum speed and running mechanics.',
          battlePlan: '• 20 min progressive warm-up\n• 8x: 200m fast + 200m walk\n• 15 min cool-down jog',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHc0fHx0cmFjayUyMGF0aGxldGljc3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'High-intensity track sprints develop maximum speed and neuromuscular power while improving running mechanics at high velocities.',
          moodTips: [
            {
              icon: 'ellipse-outline',
              title: 'Lane discipline; explosive starts',
              description: 'Lane discipline; explosive starts'
            },
            {
              icon: 'body',
              title: 'Drive arms; maintain form at speed',
              description: 'Drive arms; maintain form at speed'
            }
          ]
        }
      ]
    }
  }
];