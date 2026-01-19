import { Ionicons } from '@expo/vector-icons';

interface Workout {
  name: string;
  duration: string;
  description: string;
  battlePlan: string;
  imageUrl: string;
  intensityReason: string;
  moodTips: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
  }[];
}

interface EquipmentWorkouts {
  equipment: string;
  icon: keyof typeof Ionicons.glyphMap;
  workouts: {
    beginner: Workout[];
    intermediate: Workout[];
    advanced: Workout[];
  };
}

// Light weights workout database for "I want to sweat > Light weights" path
export const lightWeightsDatabase: EquipmentWorkouts[] = [
  {
    equipment: 'Dumbbells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Cardio Circuit',
          duration: '16–18 min',
          description: 'Four 4‑min rounds: squats, lunges, push press, programmed rest.',
          battlePlan: 'Perform 4 rounds (4 min each):\n• 30s Goblet Squat\n• 30s Alternating Reverse Lunge\n• 30s Push Press\n• 30s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/xgk4blng_download%20%282%29.png',
          intensityReason: 'Intervals raise HR while preserving form and control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest tall; knees track toes',
              description: 'Maintain upright posture and proper knee alignment over feet'
            },
            {
              icon: 'fitness',
              title: 'Exhale hard on push press',
              description: 'Use a forceful exhale to brace core during the pressing motion'
            }
          ]
        },
        {
          name: 'Flow',
          duration: '15–18 min',
          description: 'Three rounds: squat‑to‑press, light snatch, rows, steady rest.',
          battlePlan: 'Perform 3 rounds:\n• 8 Squat to Press\n• 8 Alternating Snatch (light)\n• 8 Bent-Over Row\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/0x3bwc7i_download%20%281%29.png',
          intensityReason: 'Continuous flow maintains pace with minimal setup time.',
          moodTips: [
            {
              icon: 'body',
              title: 'Neutral spine on rows',
              description: 'Keep back flat and hinge from hips during rowing movements'
            },
            {
              icon: 'refresh',
              title: 'Keep transitions smooth',
              description: 'Flow between exercises without rushing or losing control'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Complex',
          duration: '28–30 min',
          description: 'Four rounds of sixes: hinge, clean, squat, press, lunge, rest.',
          battlePlan: 'Perform 4 rounds (no rest between moves):\n• 6 Deadlifts\n• 6 Hang Cleans\n• 6 Front Squats\n• 6 Push Presses\n• 6 Reverse Lunges\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/guxsbtyu_download%20%283%29.png',
          intensityReason: 'Full‑body complex sustains output with limited resting.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Reset stance and grip each move',
              description: 'Take a brief moment to set proper position between exercises'
            },
            {
              icon: 'flash',
              title: 'Exhale sharply on push press',
              description: 'Power the press with an explosive breath to drive the weight'
            }
          ]
        },
        {
          name: 'EMOM 12',
          duration: '12 min',
          description: 'Odd: thrusters; Even: renegade rows; sustain steady pace.',
          battlePlan: 'For 12 minutes (alternating each minute):\n• Odd min: 10 Dumbbell Thrusters\n• Even min: 12 Alternating Renegade Rows',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/7dkvjash_download%20%286%29.png',
          intensityReason: 'Alternating minutes build cadence, repeatable intensity.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Thrusters: drive with hips',
              description: 'Use explosive hip extension to power the weight overhead'
            },
            {
              icon: 'body',
              title: 'Rows: keep hips square',
              description: 'Prevent rotation by bracing core and keeping hips level'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ladder',
          duration: '20–24 min',
          description: 'Five sets 10–2: squat clean, push press, burpee over DB.',
          battlePlan: 'Perform ladder 10–8–6–4–2 reps:\n• Squat Clean\n• Push Press\n• Burpee Over Dumbbell\n• Rest as needed to finish',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fitness-preview/artifacts/uz466s67_download%20%285%29.png',
          intensityReason: 'Descending reps sustain power under mounting fatigue.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Catch DBs close to shoulders',
              description: 'Catch DBs close to shoulders'
            },
            {
              icon: 'fitness',
              title: 'Land burpees soft and stacked',
              description: 'Land burpees soft and stacked'
            }
          ]
        },
        {
          name: 'AMRAP 15',
          duration: '15 min',
          description: 'Loop snatches, jump squats, push‑up rows, reverse lunges.',
          battlePlan: 'As many rounds as possible in 15 min:\n• 10 Alternating Snatches\n• 10 Goblet Jump Squats\n• 10 Push-Up to Row (5/side)\n• 10 Alternating Reverse Lunges (holding DBs)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/u48z26jq_download%20%288%29.png',
          intensityReason: 'Fixed clock drives density while encouraging smooth flow.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Snatch from hips, lockout clean',
              description: 'Snatch from hips, lockout clean'
            },
            {
              icon: 'fitness',
              title: 'Land jump squats softly',
              description: 'Land jump squats softly'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Kettlebells',
    icon: 'fitness',
    workouts: {
      beginner: [
        {
          name: 'Swing And Carry',
          duration: '15–18 min',
          description: 'Five rounds: short swings, longer carries, planned recovery.',
          battlePlan: 'Perform 5 rounds:\n• 20s Kettlebell Swings\n• 40s Farmer\'s Carry\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/sn9i3ng0_download%20%281%29.png',
          intensityReason: 'Hinge bursts plus carries elevate HR with safe loading.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hinge; snap hips on swings',
              description: 'Hinge; snap hips on swings'
            },
            {
              icon: 'walk',
              title: 'Shoulders back on carries',
              description: 'Shoulders back on carries'
            }
          ]
        },
        {
          name: 'Cardio Flow',
          duration: '12–15 min',
          description: 'Three rounds: goblet squats, swings, presses, one‑minute rest.',
          battlePlan: 'Perform 3 rounds:\n• 8 Goblet Squats\n• 8 Single-Arm Swings (each side)\n• 8 Overhead Presses (each side)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/6gvgn2e8_download.png',
          intensityReason: 'Simple sequence builds rhythm and steady conditioning.',
          moodTips: [
            {
              icon: 'body',
              title: 'Elbows tucked on presses',
              description: 'Elbows tucked on presses'
            },
            {
              icon: 'flash',
              title: 'Control swing arc; no yank',
              description: 'Control swing arc; no yank'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Ladder',
          duration: '20–24 min',
          description: 'Four rounds: swings, cleans, snatches, squats, push presses.',
          battlePlan: 'Perform 4 rounds:\n• 10 Swings\n• 8 Cleans (4/side)\n• 6 Snatches (3/side)\n• 4 Goblet Squats\n• 2 Push Presses (each side)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/x797b7x6_download%20%287%29.png',
          intensityReason: 'Mixed rep ladder balances power, skill, and position.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Rotate wrist under on cleans',
              description: 'Rotate wrist under on cleans'
            },
            {
              icon: 'flash',
              title: 'Exhale at top of snatch/press',
              description: 'Exhale at top of snatch/press'
            }
          ]
        },
        {
          name: 'Tabata',
          duration: '16 min',
          description: 'Four moves cycled Tabata‑style for sixteen total intervals.',
          battlePlan: '20s work / 10s rest, cycle through:\n• Swings\n• Goblet Squats\n• Alternating Lunges\n• High Pulls\nRepeat 4 rounds (16 intervals total).',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/9cotsg82_download.png',
          intensityReason: 'Timed sprints maximize output with controlled recovery.',
          moodTips: [
            {
              icon: 'body',
              title: 'Neutral spine when fatigued',
              description: 'Neutral spine when fatigued'
            },
            {
              icon: 'fitness',
              title: 'Drive legs on squats/lunges',
              description: 'Drive legs on squats/lunges'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '25–26 min',
          description: 'Five rounds, six per side: swing, clean, squat, press, snatch.',
          battlePlan: 'Perform 5 rounds (6 reps each, per side, no rest between moves):\n• Swing\n• Clean\n• Front Squat\n• Push Press\n• Snatch\n• Rest 1 min between rounds',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/x797b7x6_download%20%287%29.png',
          intensityReason: 'Continuous complex taxes full chain with minimal rest.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Flow positions smoothly',
              description: 'Flow positions smoothly'
            },
            {
              icon: 'body',
              title: 'Keep bell close; core on',
              description: 'Keep bell close; core on'
            }
          ]
        },
        {
          name: 'AMRAP 15',
          duration: '15 min',
          description: 'Double swings, alternating snatches, jump squats, TGUs.',
          battlePlan: 'As many rounds as possible in 15 min:\n• 10 Double Swings\n• 8 Alternating Snatches\n• 6 Goblet Squat Jumps\n• 4 Turkish Get-Ups (2/side)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/c1v64uta_download%20%289%29.png',
          intensityReason: 'Timed density pushes pace while preserving crisp form.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Double swings: engage lats',
              description: 'Double swings: engage lats'
            },
            {
              icon: 'walk',
              title: 'TGU: stack joints; move slow',
              description: 'TGU: stack joints; move slow'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Barbells',
    icon: 'barbell',
    workouts: {
      beginner: [
        {
          name: 'Metcon',
          duration: '12–15 min',
          description: 'Three rounds: deadlifts, front squats, push press, rest.',
          battlePlan: 'Perform 3 rounds (light weight):\n• 8 Deadlifts\n• 8 Front Squats\n• 8 Push Presses\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/7trsgls6_download%20%284%29.png',
          intensityReason: 'Light loads cycle quickly for safe cardio emphasis.',
          moodTips: [
            {
              icon: 'body',
              title: 'Deadlift: bar close, hinge hips',
              description: 'Deadlift: bar close, hinge hips'
            },
            {
              icon: 'fitness',
              title: 'Front squat: elbows tall',
              description: 'Front squat: elbows tall'
            }
          ]
        },
        {
          name: 'Cardio Flow',
          duration: '14–16 min',
          description: 'Three rounds: cleans, presses, back squats, rows, rest.',
          battlePlan: 'Perform 3 rounds:\n• 6 Hang Cleans\n• 6 Push Presses\n• 6 Back Squats\n• 6 Bent-Over Rows\n• Rest 90s',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/2tl6mdrg_download.png',
          intensityReason: 'Linked barbell lifts maintain tempo and breathing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Clean: tall chest on catch',
              description: 'Clean: tall chest on catch'
            },
            {
              icon: 'hand-right',
              title: 'Row: flat back; elbows to ribs',
              description: 'Row: flat back; elbows to ribs'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Complex',
          duration: '28–30 min',
          description: 'Four rounds of fives across six classic barbell patterns.',
          battlePlan: 'Perform 4 rounds (no rest between moves):\n• 5 Deadlifts\n• 5 Hang Power Cleans\n• 5 Front Squats\n• 5 Push Presses\n• 5 Back Squats\n• 5 Bent-Over Rows\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/aw3s2ke8_download%20%281%29.png',
          intensityReason: 'Full‑chain complex sustains output with minimal rest.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Use hook grip to reduce fatigue',
              description: 'Use hook grip to reduce fatigue'
            },
            {
              icon: 'flash',
              title: 'Exhale hard on presses, squats',
              description: 'Exhale hard on presses, squats'
            }
          ]
        },
        {
          name: 'EMOM 12',
          duration: '12 min',
          description: 'Odd minutes thrusters; even minutes sumo high pulls.',
          battlePlan: 'For 12 minutes (alternating each minute):\n• Odd min: 8 Thrusters\n• Even min: 10 Sumo Deadlift High Pulls',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/2tl6mdrg_download.png',
          intensityReason: 'Alternating minutes sharpen cadence and repeatability.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Thrusters: rebound into press',
              description: 'Thrusters: rebound into press'
            },
            {
              icon: 'trending-up',
              title: 'High pulls: elbows high, bar close',
              description: 'High pulls: elbows high, bar close'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Ladder',
          duration: '20–24 min',
          description: '10–2 reps: power clean, push jerk, front squat, burpees.',
          battlePlan: 'Perform 10–8–6–4–2 reps:\n• Power Clean\n• Push Jerk\n• Front Squat\n• Burpee Over Bar\n• Rest as needed to finish',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/k0r2xgj4_download%20%2810%29.png',
          intensityReason: 'Descending ladder sustains power as fatigue rises.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Clean: catch low, chest tall',
              description: 'Clean: catch low, chest tall'
            },
            {
              icon: 'fitness',
              title: 'Burpees: efficient footwork',
              description: 'Burpees: efficient footwork'
            }
          ]
        },
        {
          name: 'AMRAP 15',
          duration: '15 min',
          description: 'Continuous sixes of deads, cleans, presses, squats, burpees.',
          battlePlan: 'As many rounds as possible in 15 min:\n• 6 Deadlifts\n• 6 Hang Cleans\n• 6 Push Presses\n• 6 Back Squats\n• 6 Bar-Facing Burpees',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/2tl6mdrg_download.png',
          intensityReason: 'Fixed window promotes smooth cycling and steady pace.',
          moodTips: [
            {
              icon: 'barbell',
              title: 'Keep bar path consistent',
              description: 'Keep bar path consistent'
            },
            {
              icon: 'fitness',
              title: 'Breathe steady on burpees',
              description: 'Breathe steady on burpees'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Medicine Balls',
    icon: 'basketball',
    workouts: {
      beginner: [
        {
          name: 'Cardio Circuit',
          duration: '12–16 min',
          description: 'Three rounds: wall balls, slams, twists, one‑minute rest.',
          battlePlan: 'Perform 3 rounds:\n• 10 Wall Balls\n• 10 Slams\n• 10 Russian Twists (each side)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Short sets build rhythm and raise HR with control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Wall balls: chest tall',
              description: 'Wall balls: chest tall'
            },
            {
              icon: 'flash',
              title: 'Slams: hinge; hips drive',
              description: 'Slams: hinge; hips drive'
            }
          ]
        },
        {
          name: 'Flow',
          duration: '12–15 min',
          description: 'Three rounds: chest pass, overhead throw, squat press.',
          battlePlan: 'Perform 3 rounds:\n• 8 Chest Passes (against wall)\n• 8 Overhead Throws\n• 8 Squat-to-Press\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Linked throws and presses train drive and timing.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Chest pass: engage pecs',
              description: 'Chest pass: engage pecs'
            },
            {
              icon: 'trending-up',
              title: 'Overhead: legs drive up',
              description: 'Overhead: legs drive up'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'AMRAP 10',
          duration: '10–12 min',
          description: 'Ten‑minute loop: wall balls, slams, overhead lunges.',
          battlePlan: 'As many rounds as possible in 10 min:\n• 10 Wall Balls\n• 10 Ball Slams\n• 10 Lunges (ball overhead)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Short AMRAP encourages pace and crisp technique.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Lock elbows on overhead lunges',
              description: 'Lock elbows on overhead lunges'
            },
            {
              icon: 'flash',
              title: 'Exhale sharply on slams',
              description: 'Exhale sharply on slams'
            }
          ]
        },
        {
          name: 'Tabata',
          duration: '16 min',
          description: 'Four‑movement Tabata repeated for sixteen total intervals.',
          battlePlan: '20s work / 10s rest:\n• Wall Balls\n• Slams\n• Rotational Throws\n• Squat-to-Press\nRepeat 4 rounds (16 intervals total).',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Work‑rest cycles maximize output with quick resets.',
          moodTips: [
            {
              icon: 'checkmark',
              title: 'Reset chest up each catch',
              description: 'Reset chest up each catch'
            },
            {
              icon: 'body',
              title: 'Pivot hips on rotations',
              description: 'Pivot hips on rotations'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '16–20 min',
          description: 'Four rounds 12‑10‑8‑6 with one‑minute rests between sets.',
          battlePlan: 'Perform 4 rounds:\n• 12 Wall Balls\n• 10 Slams\n• 8 Rotations (per side)\n• 6 Burpee Slams\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/cu85n2we_download%20%281%29.png',
          intensityReason: 'Sequenced lifts elevate cardio under moderate load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rotate from hips, not knees',
              description: 'Rotate from hips, not knees'
            },
            {
              icon: 'hand-right',
              title: 'Neutral spine on pickups',
              description: 'Neutral spine on pickups'
            }
          ]
        },
        {
          name: 'Sprint Circuit',
          duration: '20–25 min',
          description: 'Five rounds: wall balls, sprint, slams, sprint, recover.',
          battlePlan: 'Perform 5 rounds:\n• 10 Wall Balls\n• 20 m Sprint (with ball)\n• 10 Slams\n• 20 m Sprint (with ball)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vv8j4fll_download.png',
          intensityReason: 'Throws plus sprints tax power and quick recovery.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Hug ball tight while sprinting',
              description: 'Hug ball tight while sprinting'
            },
            {
              icon: 'body',
              title: 'Reset stance before throws',
              description: 'Reset stance before throws'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Slam Balls',
    icon: 'baseball',
    workouts: {
      beginner: [
        {
          name: 'Basics',
          duration: '12–16 min',
          description: 'Three rounds: slams, squat‑to‑press, lunges, one‑minute rest.',
          battlePlan: 'Perform 3 rounds:\n• 10 Slams\n• 10 Squat-to-Press\n• 10 Reverse Lunges (ball at chest)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/rfw3jxg0_download%20%283%29.png',
          intensityReason: 'Repeated slams and squats build pace with control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Squat to pick ball up',
              description: 'Squat to pick ball up'
            },
            {
              icon: 'fitness',
              title: 'Keep ball close on lunges',
              description: 'Keep ball close on lunges'
            }
          ]
        },
        {
          name: 'Flow',
          duration: '12–15 min',
          description: 'Three rounds: slams, overhead throws, twists, recover.',
          battlePlan: 'Perform 3 rounds:\n• 8 Slams\n• 8 Overhead Throws\n• 8 Russian Twists (per side)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/twsti3d5_download%20%282%29.png',
          intensityReason: 'Linked throws maintain rhythm and moderate heart rate.',
          moodTips: [
            {
              icon: 'trending-up',
              title: 'Overhead: no back arch',
              description: 'Overhead: no back arch'
            },
            {
              icon: 'body',
              title: 'Twist from torso, not arms',
              description: 'Twist from torso, not arms'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'AMRAP 10',
          duration: '10–12 min',
          description: 'Ten‑minute loop: slams, lateral slams, squat jumps.',
          battlePlan: 'As many rounds as possible in 10 min:\n• 10 Slams\n• 10 Lateral Slams (5/side)\n• 10 Squat Jumps (ball at chest)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/rfw3jxg0_download%20%283%29.png',
          intensityReason: 'Short AMRAP drives pace while keeping form tidy.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pivot hips on lateral slams',
              description: 'Pivot hips on lateral slams'
            },
            {
              icon: 'fitness',
              title: 'Land jumps softly, stacked',
              description: 'Land jumps softly, stacked'
            }
          ]
        },
        {
          name: 'Tabata',
          duration: '16 min',
          description: 'Four‑move Tabata repeated to total sixteen intervals.',
          battlePlan: '20s work / 10s rest with:\n• Slams\n• Squat-to-Press\n• Lateral Slams\n• Burpee Slams\nRepeat 4 rounds (16 intervals total).',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/twsti3d5_download%20%282%29.png',
          intensityReason: 'Fast intervals spur output with quick station shifts.',
          moodTips: [
            {
              icon: 'body',
              title: 'Place ball centered for burpee',
              description: 'Place ball centered for burpee'
            },
            {
              icon: 'trending-up',
              title: 'Exhale on overhead drive',
              description: 'Exhale on overhead drive'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Complex',
          duration: '20–24 min',
          description: 'Four rounds 12‑10‑8‑6 with one‑minute rests between sets.',
          battlePlan: 'Perform 4 rounds:\n• 12 Slams\n• 10 Lateral Slams\n• 8 Burpee Slams\n• 6 Overhead Throws\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/rfw3jxg0_download%20%283%29.png',
          intensityReason: 'Linked series challenges power across repeated efforts.',
          moodTips: [
            {
              icon: 'body',
              title: 'Lateral: target obliques',
              description: 'Lateral: target obliques'
            },
            {
              icon: 'trending-up',
              title: 'Overhead: hips drive first',
              description: 'Overhead: hips drive first'
            }
          ]
        },
        {
          name: 'Sprint Circuit',
          duration: '20–25 min',
          description: 'Five rounds: slams, sprint, lateral slams, sprint, rest.',
          battlePlan: 'Perform 5 rounds:\n• 10 Slams\n• 20 m Sprint (with ball)\n• 10 Lateral Slams\n• 20 m Sprint (with ball)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/twsti3d5_download%20%282%29.png',
          intensityReason: 'Alternating slams and sprints elevate output safely.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Hug ball during sprints',
              description: 'Hug ball during sprints'
            },
            {
              icon: 'body',
              title: 'Reset stance after slams',
              description: 'Reset stance after slams'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Battle Ropes',
    icon: 'git-branch',
    workouts: {
      beginner: [
        {
          name: 'Waves And Slams',
          duration: '12–14 min',
          description: 'Five rounds alternating waves and double slams with rest.',
          battlePlan: 'Perform 5 rounds:\n• 20s Alternating Waves\n• 20s Rest\n• 20s Double Slams\n• 20s Rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/264ds1si_download.png',
          intensityReason: 'Short bouts build rhythm without technique overload.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace core; knees bent',
              description: 'Brace core; knees bent'
            },
            {
              icon: 'flash',
              title: 'Exhale on each slam',
              description: 'Exhale on each slam'
            }
          ]
        },
        {
          name: 'Rope Circuit',
          duration: '12–15 min',
          description: 'Four rounds: waves, side‑to‑side waves, slams, programmed rest.',
          battlePlan: 'Perform 4 rounds:\n• 20s Waves\n• 20s Side-to-Side Waves\n• 20s Slams\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/7urm2u9b_download%20%285%29.png',
          intensityReason: 'Cycling patterns sustains output and coordination.',
          moodTips: [
            {
              icon: 'git-branch',
              title: 'Keep steady rope slack',
              description: 'Keep steady rope slack'
            },
            {
              icon: 'body',
              title: 'Relax shoulders; no shrug',
              description: 'Relax shoulders; no shrug'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tabata',
          duration: '16 min',
          description: 'Waves, slams, circles, jacks rotated for sixteen intervals.',
          battlePlan: '20s work / 10s rest alternating:\n• Waves\n• Slams\n• Circles\n• Jumping Jacks\nRepeat 4 rounds (16 intervals).',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/264ds1si_download.png',
          intensityReason: 'Tabata sprints maximize power with managed fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Drive force from hips and core',
              description: 'Drive force from hips and core'
            },
            {
              icon: 'flash',
              title: 'Short, powerful bursts',
              description: 'Short, powerful bursts'
            }
          ]
        },
        {
          name: 'Rope And Burpee Combo',
          duration: '20–22 min',
          description: 'Four rounds: waves, burpees, slams, burpees, timed rest.',
          battlePlan: 'Perform 4 rounds:\n• 30s Waves\n• 5 Burpees\n• 30s Slams\n• 5 Burpees\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/7urm2u9b_download%20%285%29.png',
          intensityReason: 'Ropes plus burpees challenge power and recovery speed.',
          moodTips: [
            {
              icon: 'refresh',
              title: 'Transition rope to burpee fluidly',
              description: 'Transition rope to burpee fluidly'
            },
            {
              icon: 'fitness',
              title: 'Land burpees softly, absorb impact',
              description: 'Land burpees softly, absorb impact'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Gauntlet',
          duration: '24–26 min',
          description: 'Four rounds: waves, slams, sides, jacks, circles, rest.',
          battlePlan: 'Perform 4 rounds:\n• 30s Waves\n• 30s Slams\n• 30s Side-to-Sides\n• 30s Jacks\n• 30s Circles\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/264ds1si_download.png',
          intensityReason: 'Extended sequence sustains output across patterns.',
          moodTips: [
            {
              icon: 'speedometer',
              title: 'Keep rhythm constant throughout',
              description: 'Keep rhythm constant throughout'
            },
            {
              icon: 'leaf',
              title: 'Sync breathing with wave rhythm',
              description: 'Sync breathing with wave rhythm'
            }
          ]
        },
        {
          name: 'Rope And Sprint Circuit',
          duration: '20–25 min',
          description: 'Five rounds: waves, sprint, slams, sprint, planned rest.',
          battlePlan: 'Perform 5 rounds:\n• 20s Waves\n• 20 m Sprint\n• 20s Slams\n• 20 m Sprint\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/eezapz0l_download%20%282%29.png',
          intensityReason: 'High‑output rope bouts paired with short sprints.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Sprint upright, strong arm drive',
              description: 'Sprint upright, strong arm drive'
            },
            {
              icon: 'flash',
              title: 'Max rope effort before running',
              description: 'Max rope effort before running'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sled',
    icon: 'car-sport',
    workouts: {
      beginner: [
        {
          name: 'Push And Pull',
          duration: '12–15 min',
          description: 'Five rounds: 10 m push, 10 m backward pull, one‑minute rest.',
          battlePlan: 'Perform 5 rounds:\n• 10 m Push (light)\n• 10 m Backward Pull\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k6ha38p9_download%20%281%29.png',
          intensityReason: 'Light pushes and pulls build pace with safe control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Push with 45° lean, arms straight',
              description: 'Push with 45° lean, arms straight'
            },
            {
              icon: 'walk',
              title: 'Pull with short, fast steps',
              description: 'Pull with short, fast steps'
            }
          ]
        },
        {
          name: 'Sled March',
          duration: '12–16 min',
          description: 'Four rounds: 15 m slow push, 15 m slow pull, timed rest.',
          battlePlan: 'Perform 4 rounds:\n• 15 m Slow Push\n• 15 m Slow Pull\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k8lo936w_download.png',
          intensityReason: 'Slow pushes and pulls reinforce position and tempo.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Heel‑to‑toe push, core braced',
              description: 'Heel‑to‑toe push, core braced'
            },
            {
              icon: 'body',
              title: 'Upright chest while pulling',
              description: 'Upright chest while pulling'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Sprint Intervals',
          duration: '20 min',
          description: 'Ten rounds: 10 m sprint push, walk back recovery pacing.',
          battlePlan: 'Perform 10 rounds:\n• 10 m Sprint Push\n• Walk back slow (rest)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k6ha38p9_download%20%281%29.png',
          intensityReason: 'Short sprint pushes spike power with full walkback rest.',
          moodTips: [
            {
              icon: 'flash',
              title: 'Explode with leg drive',
              description: 'Explode with leg drive'
            },
            {
              icon: 'walk',
              title: 'Keep stride short and quick',
              description: 'Keep stride short and quick'
            }
          ]
        },
        {
          name: 'Push And Drag Circuit',
          duration: '20–22 min',
          description: 'Four rounds: push, backward drag, lateral push, rest.',
          battlePlan: 'Perform 4 rounds:\n• 10 m Push (moderate)\n• 10 m Backward Drag\n• 10 m Lateral Push (sideways)\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k8lo936w_download.png',
          intensityReason: 'Mixed directions tax mechanics and aerobic capacity.',
          moodTips: [
            {
              icon: 'walk',
              title: 'Lateral: hips square, steps controlled',
              description: 'Lateral: hips square, steps controlled'
            },
            {
              icon: 'body',
              title: 'Drag: knees bent, chest tall',
              description: 'Drag: knees bent, chest tall'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Gauntlet',
          duration: '24–28 min',
          description: 'Five rounds: heavy push, sprint push, drag, lateral, rest.',
          battlePlan: 'Perform 5 rounds:\n• 10 m Heavy Push\n• 10 m Sprint Push (light)\n• 10 m Backward Drag\n• 10 m Lateral Push\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k6ha38p9_download%20%281%29.png',
          intensityReason: 'Heavy plus fast bouts sustain output under fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Heavy pushes: glute/ham drive',
              description: 'Heavy pushes: glute/ham drive'
            },
            {
              icon: 'flash',
              title: 'Move fast between transitions',
              description: 'Move fast between transitions'
            }
          ]
        },
        {
          name: 'Sled And Burpee Circuit',
          duration: '24–26 min',
          description: 'Four rounds: heavy push, burpees, drag, burpees, rest.',
          battlePlan: 'Perform 4 rounds:\n• 10 m Heavy Push\n• 10 Burpees\n• 10 m Backward Drag\n• 10 Burpees\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/k8lo936w_download.png',
          intensityReason: 'Heavy sled plus burpees challenge power and recovery.',
          moodTips: [
            {
              icon: 'fitness',
              title: 'Burpees: core tight, hips level',
              description: 'Burpees: core tight, hips level'
            },
            {
              icon: 'flash',
              title: 'Push explosively after burpees',
              description: 'Push explosively after burpees'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Sledgehammer + Tire',
    icon: 'hammer',
    workouts: {
      beginner: [
        {
          name: 'Hammer Basics',
          duration: '12–15 min',
          description: 'Three rounds: strikes each side, tire step‑ups, rest block.',
          battlePlan: 'Perform 3 rounds:\n• 10 Hammer Strikes (each side)\n• 10 Tire Step-Ups\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/dehw59za_download%20%283%29.png',
          intensityReason: 'Simple strikes and steps elevate HR with safe skill.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Slide top hand down handle',
              description: 'Slide top hand down handle'
            },
            {
              icon: 'walk',
              title: 'Place whole foot on tire',
              description: 'Place whole foot on tire'
            }
          ]
        },
        {
          name: 'Hammer And March',
          duration: '12–16 min',
          description: 'Four rounds: strikes each side, toe taps on tire, recover.',
          battlePlan: 'Perform 4 rounds:\n• 8 Strikes (each side)\n• 8 Tire Toe Taps\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/v5drjc07_download%20%282%29.png',
          intensityReason: 'Moderate strikes with light footwork build steady pace.',
          moodTips: [
            {
              icon: 'body',
              title: 'Hips whip to generate speed',
              description: 'Hips whip to generate speed'
            },
            {
              icon: 'walk',
              title: 'Toe taps: fast, rhythmic',
              description: 'Toe taps: fast, rhythmic'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Hammer And Burpee Circuit',
          duration: '18–20 min',
          description: 'Four rounds: strikes, burpees, tire jumps, one‑minute rest.',
          battlePlan: 'Perform 4 rounds:\n• 10 Strikes (each side)\n• 8 Burpees\n• 10 Tire Jumps\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/dehw59za_download%20%283%29.png',
          intensityReason: 'Strikes, burpees, and jumps stress power and recovery.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rotate hips; snap wrists',
              description: 'Rotate hips; snap wrists'
            },
            {
              icon: 'fitness',
              title: 'Land softly on tire',
              description: 'Land softly on tire'
            }
          ]
        },
        {
          name: 'Hammer Tabata',
          duration: '16–18 min',
          description: 'Repeated sprints of strikes build power under fatigue.',
          battlePlan: '20s strikes (switch side halfway) / 10s rest\n8 rounds = 4 min\nRest 1 min\nRepeat for 3 cycles (~16–18 min)',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/v5drjc07_download%20%282%29.png',
          intensityReason: 'Repeated sprints of strikes build power under fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Aggressive hip snap on strikes',
              description: 'Aggressive hip snap on strikes'
            },
            {
              icon: 'flash',
              title: 'Exhale sharply each swing',
              description: 'Exhale sharply each swing'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Hammer Gauntlet',
          duration: '20–24 min',
          description: 'Four rounds: strikes, jumps, burpees, tire flips, recover.',
          battlePlan: 'Perform 4 rounds:\n• 12 Strikes (each side)\n• 10 Tire Jumps\n• 8 Burpees\n• 6 Tire Flips\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/dehw59za_download%20%283%29.png',
          intensityReason: 'Mixed tasks tax strength, power, and aerobic recovery.',
          moodTips: [
            {
              icon: 'body',
              title: 'Brace core during flips',
              description: 'Brace core during flips'
            },
            {
              icon: 'fitness',
              title: 'Land lightly on jumps',
              description: 'Land lightly on jumps'
            }
          ]
        },
        {
          name: 'Hammer And Sprint Circuit',
          duration: '20–25 min',
          description: 'Five rounds: strikes, sprint, jumps, sprint, planned rest.',
          battlePlan: 'Perform 5 rounds:\n• 10 Strikes (each side)\n• 20 m Sprint\n• 10 Tire Jumps\n• 20 m Sprint\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/v5drjc07_download%20%282%29.png',
          intensityReason: 'Strikes plus sprints challenge output and quick reset.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Reset grip each strike',
              description: 'Reset grip each strike'
            },
            {
              icon: 'walk',
              title: 'Sprint tall; full arm drive',
              description: 'Sprint tall; full arm drive'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Flipping Tire',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Tire Flip And Step',
          duration: '12–15 min',
          description: 'Three rounds: flips, step‑ups to tire, consistent recovery.',
          battlePlan: 'Perform 3 rounds:\n• 5 Flips\n• 10 Tire Step-Ups\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vyfyeozq_download%20%282%29.png',
          intensityReason: 'Light flip volume with steps raises HR without overload.',
          moodTips: [
            {
              icon: 'body',
              title: 'Chest tight to tire; drive hips',
              description: 'Chest tight to tire; drive hips'
            },
            {
              icon: 'walk',
              title: 'Full foot on tire for steps',
              description: 'Full foot on tire for steps'
            }
          ]
        },
        {
          name: 'Tire Flip And Tap',
          duration: '12–16 min',
          description: 'Four rounds: flips, fast toe taps on tire, minute rest.',
          battlePlan: 'Perform 4 rounds:\n• 4 Flips\n• 20 Toe Taps on Tire\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/q5iv9oux_download%20%281%29.png',
          intensityReason: 'Short flip sets plus quick feet build cardio safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Full hip extension on flips',
              description: 'Full hip extension on flips'
            },
            {
              icon: 'walk',
              title: 'Toe taps: quick and light',
              description: 'Toe taps: quick and light'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Tire Flip And Jump',
          duration: '14–16 min',
          description: 'Four rounds: flips, tire jumps, one‑minute recoveries.',
          battlePlan: 'Perform 4 rounds:\n• 6 Flips\n• 8 Tire Jumps\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vyfyeozq_download%20%282%29.png',
          intensityReason: 'Moderate flips plus jumps increase demand and pacing.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep back flat on flips',
              description: 'Keep back flat on flips'
            },
            {
              icon: 'fitness',
              title: 'Land softly, knees bent',
              description: 'Land softly, knees bent'
            }
          ]
        },
        {
          name: 'Tire Flip Circuit',
          duration: '14–18 min',
          description: 'Three rounds: flips, tire push‑ups, lateral jumps, rest.',
          battlePlan: 'Perform 3 rounds:\n• 5 Flips\n• 10 Tire Push-Ups\n• 10 Lateral Jumps\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/q5iv9oux_download%20%281%29.png',
          intensityReason: 'Mixed push, press, and jump patterns raise capacity.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Push‑ups: hands wide, stable',
              description: 'Push‑ups: hands wide, stable'
            },
            {
              icon: 'fitness',
              title: 'Lateral jumps: compact, quick',
              description: 'Lateral jumps: compact, quick'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Tire Flip Gauntlet',
          duration: '20–22 min',
          description: 'Four rounds: flips, burpees, jumps, push‑ups, programmed rest.',
          battlePlan: 'Perform 4 rounds:\n• 8 Flips\n• 8 Burpees\n• 8 Tire Jumps\n• 8 Tire Push-Ups\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/vyfyeozq_download%20%282%29.png',
          intensityReason: 'Repeated flips and plyos sustain power under fatigue.',
          moodTips: [
            {
              icon: 'body',
              title: 'Core braced; drive with legs',
              description: 'Core braced; drive with legs'
            },
            {
              icon: 'fitness',
              title: 'Control burpee pace',
              description: 'Control burpee pace'
            }
          ]
        },
        {
          name: 'Tire Flip And Sprint',
          duration: '20–22 min',
          description: 'Four rounds: flips, sprint, flips, sprint, one‑minute rest.',
          battlePlan: 'Perform 4 rounds:\n• 6 Flips\n• 20 m Sprint\n• 6 Flips\n• 20 m Sprint\n• Rest 1 min',
          imageUrl: 'https://customer-assets.emergentagent.com/job_workout-pics/artifacts/q5iv9oux_download%20%281%29.png',
          intensityReason: 'Heavy flips plus short sprints challenge recovery.',
          moodTips: [
            {
              icon: 'body',
              title: 'Grip low under tire; chest close',
              description: 'Grip low under tire; chest close'
            },
            {
              icon: 'walk',
              title: 'Sprint tall, relaxed after flips',
              description: 'Sprint tall, relaxed after flips'
            }
          ]
        }
      ]
    }
  }
];
