// Outdoor Run workout data for outdoor activities

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
          description: 'Simple 2-min run/2-min walk for controlled volume.',
          battlePlan: '• 4 min brisk walk\n• 6 rounds: 2 min run + 2 min walk\n• 2–4 min walk',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Alternating bouts build rhythm and stamina.',
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
          description: 'Easy running plus controlled 8–10 min tempo.',
          battlePlan: '• 8 min easy\n• 10–12 min easy\n• 8–10 min tempo (RPE 7–8)\n• 4–5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Late tempo adds stress while limiting fatigue.',
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
          description: '1-2-3-2-1 hard with equal easy jogs.',
          battlePlan: '• 8 min easy\n• 1 hard/1 easy\n• 2 hard/2 easy\n• 3 hard/3 easy\n• 2 hard/2 easy\n• 1 hard/1 easy\n• 5 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Variable surges raise output and leg pop.',
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
          description: '20 min steady after easy warm-up.',
          battlePlan: '• 8–10 min easy\n• 20 min steady (talk in phrases)\n• 4–6 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Continuous sub-tempo builds durability.',
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
          description: '3x8 min threshold with short easy jogs.',
          battlePlan: '• 10 min easy + 3x20s strides (40s easy)\n• 3x: 8 min threshold + 2 min easy\n• 6–8 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Repeated thresholds raise LT with control.',
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
          description: '10x1 min hard with 1 min easy.',
          battlePlan: '• 10 min easy\n• 10x: 1 min hard + 1 min easy\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Frequent surges build power and economy.',
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
          description: '10 easy, 10 steady, 10 tempo, cooldown.',
          battlePlan: '• 10 min easy\n• 10 min steady\n• 10 min tempo\n• 8–10 min easy',
          imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHw0fHxvdXRkb29yJTIwcnVubmluZ3xlbnwwfHx8fDE3MDM0NzU2NjM&ixlib=rb-4.0.3&q=85',
          intensityReason: 'Stepwise tempo raises stress gradually.',
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
  }
];