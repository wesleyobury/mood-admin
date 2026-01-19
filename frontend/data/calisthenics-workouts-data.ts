// Additional equipment workout data for calisthenics - Part 2

export const additionalWorkoutDatabase = [
  {
    equipment: 'Gymnast rings',
    icon: 'radio-button-off',
    workouts: {
      beginner: [
        {
          name: 'Ring Start',
          duration: '16–22 min',
          description: 'Support hold low, ring rows high, kneeling pushups.',
          battlePlan: 'Ring Support Lean (feet down)\n• 3 × 15–25s (RPE 4), 60s rest\nHigh Ring Row (knees bent)\n• 3 × 8–10 (RPE 4), 60s rest\nKneeling Ring Pushup\n• 3 × 8–12 (RPE 4), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/qhw328ft_download%20%286%29.png',
          intensityReason: 'Stable regressions teach alignment and shoulder set.',
          moodTips: [
            {
              icon: 'body',
              title: 'Rings close to body',
              description: 'Keep rings tight to your sides for better stability and control'
            },
            {
              icon: 'hand-right',
              title: 'Keep wrists neutral',
              description: 'Avoid bending wrists to prevent strain and maintain proper alignment'
            }
          ]
        },
        {
          name: 'Scap Lines',
          duration: '16–22 min',
          description: 'Scap rows, scap pushups, dead bug for core control.',
          battlePlan: 'Ring Scap Rows\n• 3 × 10–12 (RPE 4), 60s rest\nRing Scap Pushups\n• 3 × 10–12 (RPE 4), 60s rest\nDead Bug\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/n3zrasp5_download%20%285%29.png',
          intensityReason: 'Scap control on rings builds robust base stability.',
          moodTips: [
            {
              icon: 'body',
              title: 'Move just shoulder blades',
              description: 'Isolate scapular movement without bending elbows or using momentum'
            },
            {
              icon: 'body',
              title: 'Ribs down and quiet',
              description: 'Maintain core engagement to prevent rib flare and spine extension'
            }
          ]
        },
        {
          name: 'Angle Mix',
          duration: '16–22 min',
          description: 'Ring rows, ring pushups, hollow hold finisher for light challenge.',
          battlePlan: 'Ring Row (medium angle)\n• 3 × 8–10 (RPE 4), 60s rest\nRing Pushup (incline)\n• 3 × 8–12 (RPE 4), 60s rest\nHollow Hold\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/z7qrv937_download%20%284%29.png',
          intensityReason: 'Angle adjustments dial in intensity while stable.',
          moodTips: [
            {
              icon: 'body',
              title: 'Set feet to control load',
              description: 'Move feet closer to reduce difficulty or farther away to increase challenge'
            },
            {
              icon: 'body',
              title: 'Ring pushups: elbows 45°',
              description: 'Keep elbows at 45-degree angle to protect shoulders and engage chest'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Stable Lines',
          duration: '22–28 min',
          description: 'Mid-angle rows, pushups, knee tucks for core finish.',
          battlePlan: 'Ring Row (mid angle)\n• 4 × 8–10 (RPE 5), 75s rest\nRing Pushup (horizontal)\n• 4 × 8–12 (RPE 5), 75s rest\nRing Knee Tucks (support)\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/0ah02106_download%20%289%29.png',
          intensityReason: 'Moderate ring angles challenge stabilizers with control.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Squeeze rings lightly',
              description: 'A light grip activates forearms without excess tension or fatigue'
            },
            {
              icon: 'body',
              title: 'Keep shoulders packed',
              description: 'Pull shoulder blades down and back to create stable pressing position'
            }
          ]
        },
        {
          name: 'Archer Starts',
          duration: '22–28 min',
          description: 'Archer rows beginners, narrow pushups, hollow rocks.',
          battlePlan: 'Ring Archer Row (assisted)\n• 4 × 6–8/side (RPE 5–6), 90s rest\nRing Pushup (narrow)\n• 4 × 8–10 (RPE 5), 75s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wd1l2iea_download%20%288%29.png',
          intensityReason: 'Unilateral bias builds strength and positional control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Press through working hand',
              description: 'Drive force through the main arm to build unilateral strength'
            },
            {
              icon: 'body',
              title: 'Assist lightly with other',
              description: 'Use the assisting arm for balance only, not primary force production'
            }
          ]
        },
        {
          name: 'Volume Build',
          duration: '22–28 min',
          description: 'Straight rows and pushups, modest volume increase for strength gains.',
          battlePlan: 'Ring Row (neutral)\n• 4 × 8–12 (RPE 5), 75s rest\nRing Pushup (horizontal)\n• 4 × 10–12 (RPE 5), 75s rest\nFront Plank\n• 3 × 30–40s (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/fv7h4gkz_row.jpg',
          intensityReason: 'Moderate volume builds work capacity while stable.',
          moodTips: [
            {
              icon: 'leaf',
              title: 'Keep tempo smooth',
              description: 'Control the movement pace to maximize time under tension'
            },
            {
              icon: 'body',
              title: 'Avoid overflaring rings',
              description: 'Keep rings parallel to prevent excessive shoulder external rotation'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Archer Plus',
          duration: '24–32 min',
          description: 'Full archer rows and pushups, pistol assists for leg balance.',
          battlePlan: 'Ring Archer Row (full)\n• 5 × 4–6/side (RPE 6–7), 90–120s rest\nRing Archer Pushup\n• 4 × 4–6/side (RPE 6), 90s rest\nRing-Assisted Pistol\n• 3 × 6–8/side (RPE 6), 75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wd1l2iea_download%20%288%29.png',
          intensityReason: 'Full unilateral work challenges single-arm control.',
          moodTips: [
            {
              icon: 'body',
              title: 'Straight arm stays passive',
              description: 'Let the extended arm guide balance without contributing force'
            },
            {
              icon: 'leaf',
              title: 'Breathe through tension',
              description: 'Maintain steady breathing to prevent breath-holding under load'
            }
          ]
        },
        {
          name: 'Ring Muscle-Up Prep',
          duration: '24–32 min',
          description: 'False-grip rows, explosive transition drills, ring dips.',
          battlePlan: 'False-Grip Ring Row\n• 5 × 6–8 (RPE 6), 90s rest\nRing Muscle-Up Transition Practice (assisted)\n• 4 × 3–4 (RPE 6–7), 120s rest\nRing Dip\n• 4 × 6–8 (RPE 6), 90s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/dq0uzole_download%20%287%29.png',
          intensityReason: 'MU drills require powerful pull, dip, and transition.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Deep false grip patience',
              description: 'Master the false grip position before attempting muscle-up transitions'
            },
            {
              icon: 'flash',
              title: 'Explosive ring pull',
              description: 'Generate maximum power through hip drive and aggressive lat engagement'
            }
          ]
        },
        {
          name: 'High-Volume Endurance',
          duration: '24–32 min',
          description: 'High-rep rows and pushups, ring planks for total stability.',
          battlePlan: 'Ring Row (neutral)\n• 5 × 10–15 (RPE 6), 75s rest\nRing Pushup (horizontal)\n• 5 × 12–16 (RPE 6), 75s rest\nRing Front Plank\n• 4 × 30–50s (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/n2vbefok_download%20%287%29.png',
          intensityReason: 'High volume builds muscular endurance on unstable surface.',
          moodTips: [
            {
              icon: 'body',
              title: 'Maintain form all reps',
              description: 'Prioritize technique quality over rep count as fatigue increases'
            },
            {
              icon: 'leaf',
              title: 'Steady breathing rhythm',
              description: 'Sync breath with movement to optimize oxygen delivery and performance'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Ab wheel',
    icon: 'ellipse',
    workouts: {
      beginner: [
        {
          name: 'Wheel Intro',
          duration: '12–16 min',
          description: 'Kneeling short-rolls, dead bug, plank bracing closer.',
          battlePlan: 'Kneeling Ab Wheel (short ROM)\n• 3 × 6–8 (RPE 4), 75s rest\nDead Bug\n• 3 × 10–12/side (RPE 4), 45–60s rest\nFront Plank\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/pgkoxn00_download.png',
          intensityReason: 'Short ranges teach control without overloading spine.',
          moodTips: [
            {
              icon: 'body',
              title: 'Ribs down; small ranges',
              description: 'Keep core engaged and start with limited range to build safely'
            },
            {
              icon: 'body',
              title: 'Hips glide with torso',
              description: 'Move hips and torso as one unit to protect lower back'
            }
          ]
        },
        {
          name: 'Eccentric Teach',
          duration: '12–16 min',
          description: 'Eccentric kneeling rolls, hollow hold, bird dog for total ab development.',
          battlePlan: 'Kneeling Ab Wheel Eccentric (stand up after)\n• 3 × 4–6 (RPE 4), 90s rest\nHollow Hold\n• 3 × 20–30s (RPE 4), 45–60s rest\nBird Dog\n• 3 × 8–10/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/ytutfbco_download%20%281%29.png',
          intensityReason: 'Controlled negatives build safe end-range capacity.',
          moodTips: [
            {
              icon: 'body',
              title: '4s lowers; 1s pause',
              description: 'Use a 4-second eccentric phase with brief pause at bottom'
            },
            {
              icon: 'body',
              title: 'Keep low back quiet',
              description: 'Avoid lumbar extension by engaging core throughout movement'
            }
          ]
        },
        {
          name: 'Range Build',
          duration: '12–16 min',
          description: 'Kneeling rolls mid-range, side planks for stability development.',
          battlePlan: 'Kneeling Ab Wheel (moderate ROM)\n• 3 × 6–8 (RPE 4), 75s rest\nSide Plank\n• 3 × 20–30s/side (RPE 4), 45–60s rest\nFront Plank\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wgjgrxlk_download%20%282%29.png',
          intensityReason: 'Gradual ROM progression increases tension safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Add inches slowly',
              description: 'Gradually extend range as strength and control improve'
            },
            {
              icon: 'body',
              title: 'Keep hips tucked slightly',
              description: 'Maintain posterior pelvic tilt to protect lower spine'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Wheel Lines',
          duration: '14–18 min',
          description: 'Kneeling rolls fuller range, hollow rocks to polish.',
          battlePlan: 'Kneeling Ab Wheel (fuller ROM)\n• 4 × 6–8 (RPE 5), 90s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 60s rest\nSide Plank with Hip Tap\n• 3 × 8–10/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/pgkoxn00_download.png',
          intensityReason: 'Moderate volume kneeling rolls challenge midline.',
          moodTips: [
            {
              icon: 'body',
              title: 'Smooth 3s lowers',
              description: 'Control the eccentric for 3 seconds to maximize tension'
            },
            {
              icon: 'leaf',
              title: 'Exhale pulling back',
              description: 'Breathe out forcefully during concentric to aid core stability'
            }
          ]
        },
        {
          name: 'Eccentric Plus',
          duration: '14–18 min',
          description: '4–5s eccentrics, pause, return; then dead bugs.',
          battlePlan: 'Kneeling Ab Wheel Eccentric (4–5s down)\n• 4 × 4–6 (RPE 5–6), 90s rest\nDead Bug\n• 3 × 12–14/side (RPE 5), 60s rest\nFront Plank\n• 3 × 25–35s (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/ytutfbco_download%20%281%29.png',
          intensityReason: 'Longer negatives build strength in extended ranges.',
          moodTips: [
            {
              icon: 'body',
              title: 'Keep ribs stacked',
              description: 'Maintain rib-hip connection to avoid hyperextension'
            },
            {
              icon: 'body',
              title: 'Move only as range allows',
              description: 'Stop before form breaks down to prevent injury'
            }
          ]
        },
        {
          name: 'Angle Mix',
          duration: '14–18 min',
          description: 'Kneeling diagonals, side planks, hollow holds finish.',
          battlePlan: 'Kneeling Ab Wheel Diagonal Rolls\n• 4 × 5–6/side (RPE 5), 90s rest\nSide Plank\n• 3 × 25–35s/side (RPE 5), 45–60s rest\nHollow Hold\n• 3 × 25–35s (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wgjgrxlk_download%20%282%29.png',
          intensityReason: 'Slight angle changes load obliques and anti-rotation.',
          moodTips: [
            {
              icon: 'body',
              title: 'Small angle changes',
              description: 'Work obliques with slight diagonal movements for variety'
            },
            {
              icon: 'body',
              title: 'Keep hips square level',
              description: 'Prevent hip rotation to isolate core muscles effectively'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'Long Lines',
          duration: '16–22 min',
          description: 'Full kneeling rolls, hollow rocks, side plank reach.',
          battlePlan: 'Kneeling Ab Wheel (full ROM)\n• 5 × 6–8 (RPE 6), 90s rest\nHollow Rock\n• 4 × 12–16 (RPE 6), 60s rest\nSide Plank with Reach\n• 3 × 10–12/side (RPE 6), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/pgkoxn00_download.png',
          intensityReason: 'Full-range kneeling rolls challenge deep core safely.',
          moodTips: [
            {
              icon: 'body',
              title: 'Control end range',
              description: 'Maintain tension at full extension without losing form'
            },
            {
              icon: 'body',
              title: 'Avoid lumbar extension',
              description: 'Keep core braced to prevent lower back arching'
            }
          ]
        },
        {
          name: 'Eccentric Heavy',
          duration: '16–22 min',
          description: '5–6s eccentrics, micro-pauses, strict plank holds.',
          battlePlan: 'Kneeling Ab Wheel Eccentric (5–6s down)\n• 5 × 3–5 (RPE 6–7), 120s rest\nFront Plank (hard)\n• 4 × 30–45s (RPE 6), 60–75s rest\nHollow Hold\n• 3 × 30–40s (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/ytutfbco_download%20%281%29.png',
          intensityReason: 'Very slow negatives build resilience in long ranges.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stay stacked, glutes on',
              description: 'Engage glutes and maintain aligned posture throughout'
            },
            {
              icon: 'leaf',
              title: 'Nose breathe; calm rhythm',
              description: 'Nasal breathing helps maintain core tension and focus'
            }
          ]
        },
        {
          name: 'Midrange Control',
          duration: '16–22 min',
          description: 'Wheel outs with 1.5 reps, diagonal rolls light, side planks for core development.',
          battlePlan: 'Kneeling Ab Wheel (1.5 reps)\n• 4 × 5–6 (RPE 6), 90s rest\nKneeling Diagonal Rolls (short)\n• 3 × 5–6/side (RPE 6), 90s rest\nSide Plank\n• 3 × 30–40s/side (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/wgjgrxlk_download%20%282%29.png',
          intensityReason: '1.5 wheel reps add bracing time at safe midrange.',
          moodTips: [
            {
              icon: 'body',
              title: 'Pause mid, smooth return',
              description: 'Pause mid, smooth return'
            },
            {
              icon: 'body',
              title: 'Keep hips from swaying',
              description: 'Keep hips from swaying'
            }
          ]
        }
      ]
    }
  },
  {
    equipment: 'Pushup bars / parallettes',
    icon: 'reorder-three',
    workouts: {
      beginner: [
        {
          name: 'Bar Start',
          duration: '16–22 min',
          description: 'Incline pushups, row regressions, dead bug finish.',
          battlePlan: 'Incline Pushup on Parallettes\n• 3 × 8–12 (RPE 4), 60s rest\nTable Row or Band Row (if available)\n• 3 × 10–12 (RPE 4), 60s rest\nDead Bug\n• 3 × 10–12/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/kencpix3_incline%20pushup.png',
          intensityReason: 'Elevated grips reduce wrist strain and aid control.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Hands stacked under shoulders',
              description: 'Position hands directly beneath shoulders for optimal pressing mechanics'
            },
            {
              icon: 'arrow-forward',
              title: 'Elbows 30–45° path',
              description: 'Track elbows at 30-45 degrees to protect shoulders and engage chest'
            }
          ]
        },
        {
          name: 'Depth Intro',
          duration: '16–22 min',
          description: 'Deficit pushups, scap pushups, side planks finish.',
          battlePlan: 'Deficit Pushup (small blocks)\n• 3 × 8–10 (RPE 4), 60s rest\nScapular Pushups on Bars\n• 3 × 10–12 (RPE 4), 60s rest\nSide Plank\n• 3 × 20–30s/side (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/3ltjblfg_deficit%20pushup.jpg',
          intensityReason: 'Slight deficit allows safe depth and chest tension.',
          moodTips: [
            {
              icon: 'body',
              title: 'Ribs down; no sway',
              description: 'Keep ribs pulled down and core tight to prevent back arching'
            },
            {
              icon: 'time',
              title: 'Slow 2–1–3 tempo',
              description: 'Use 2 seconds down, 1 second pause, 3 seconds up for control'
            }
          ]
        },
        {
          name: 'Lean Prep',
          duration: '16–22 min',
          description: 'Pseudo planche lean, pushups, hollow holds finish.',
          battlePlan: 'Parallette Lean Hold (pseudo planche)\n• 3 × 15–25s (RPE 4), 60s rest\nParallette Pushup (neutral wrists)\n• 3 × 8–12 (RPE 4), 60s rest\nHollow Hold\n• 3 × 20–30s (RPE 4), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/yneg02k1_pseduo%20planch%20lean.png',
          intensityReason: 'Forward lean introduces planche-line loading gently.',
          moodTips: [
            {
              icon: 'arrow-forward',
              title: 'Protract, then lean',
              description: 'Push shoulders forward first, then shift weight into lean position'
            },
            {
              icon: 'body',
              title: 'Keep elbows soft, not locked',
              description: 'Maintain slight elbow bend to protect joints under tension'
            }
          ]
        }
      ],
      intermediate: [
        {
          name: 'Depth Lines',
          duration: '22–28 min',
          description: 'Deep pushups, ring/table rows, knee tucks finisher.',
          battlePlan: 'Deep Parallette Pushup\n• 4 × 8–12 (RPE 5), 75s rest\nInverted Row (table/rings)\n• 4 × 8–10 (RPE 5), 75s rest\nParallette Knee Tucks (L-sit prep)\n• 3 × 10–12 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/3ltjblfg_deficit%20pushup.jpg',
          intensityReason: 'Deeper range increases tension at manageable load.',
          moodTips: [
            {
              icon: 'body',
              title: 'Touch chest between bars',
              description: 'Lower chest fully between bars to maximize range of motion'
            },
            {
              icon: 'body',
              title: 'Keep scap packed and down',
              description: 'Retract and depress shoulder blades throughout the movement'
            }
          ]
        },
        {
          name: 'Lean Lines',
          duration: '22–28 min',
          description: 'Pseudo planche pushups, dips light, hollow rocks.',
          battlePlan: 'Pseudo Planche Pushup (on bars)\n• 4 × 6–8 (RPE 5–6), 90s rest\nBox/Bench Dips (light)\n• 3 × 8–10 (RPE 5), 60–75s rest\nHollow Rock\n• 3 × 10–15 (RPE 5), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/yneg02k1_pseduo%20planch%20lean.png',
          intensityReason: 'Lean progressions build anterior shoulder integrity.',
          moodTips: [
            {
              icon: 'arrow-forward',
              title: 'Protract; elbows soft',
              description: 'Push shoulders forward while maintaining slight elbow bend'
            },
            {
              icon: 'body',
              title: 'Rock smooth; ribs down',
              description: 'Keep hollow rocks controlled with ribs pulled toward hips'
            }
          ]
        },
        {
          name: 'Mixed Angle',
          duration: '22–28 min',
          description: 'Wide pushups, neutral pushups, side plank reaches.',
          battlePlan: 'Wide Parallette Pushup\n• 4 × 8–12 (RPE 5), 75s rest\nNeutral Parallette Pushup\n• 3 × 8–12 (RPE 5), 60–75s rest\nSide Plank with Reach\n• 3 × 8–10/side (RPE 5), 45–60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/9f2tiro6_download%20%2824%29.png',
          intensityReason: 'Hand placement changes emphasize different fibers.',
          moodTips: [
            {
              icon: 'hand-right',
              title: 'Keep forearms vertical',
              description: 'Stack forearms perpendicular to floor for efficient pressing'
            },
            {
              icon: 'body',
              title: 'Reach long; hips stacked',
              description: 'Extend fully through the reach while keeping hips aligned'
            }
          ]
        }
      ],
      advanced: [
        {
          name: 'HSPU Prep',
          duration: '26–34 min',
          description: 'Pike pushups feet-high, pseudo planche holds, L-sit.',
          battlePlan: 'Feet-Elevated Pike Pushup (on bars)\n• 5 × 6–8 (RPE 6), 90s rest\nParallette Lean Hold (harder angle)\n• 4 × 20–30s (RPE 6), 75s rest\nParallette Tuck L-Sit\n• 4 × 10–15s (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/yrisnwxk_pike.png',
          intensityReason: 'Elevated pike positions build overhead pressing lines.',
          moodTips: [
            {
              icon: 'body',
              title: 'Stack hips over hands',
              description: 'Align hips directly above hands for proper vertical pressing'
            },
            {
              icon: 'arrow-up',
              title: 'Press tall; no elbow flare',
              description: 'Drive straight up keeping elbows tracking forward'
            }
          ]
        },
        {
          name: 'Deficit Power',
          duration: '26–34 min',
          description: 'Deep deficit pushups, rows feet-high, hollow rocks.',
          battlePlan: 'Deep Deficit Parallette Pushup\n• 5 × 6–10 (RPE 6), 90s rest\nFeet-Elevated Inverted Row\n• 4 × 8–10 (RPE 6), 75s rest\nHollow Rock\n• 4 × 12–16 (RPE 6), 60s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/3ltjblfg_deficit%20pushup.jpg',
          intensityReason: 'Deeper deficit increases load and shoulder stability.',
          moodTips: [
            {
              icon: 'time',
              title: 'Move slow; chest between bars',
              description: 'Control descent and touch chest between bars at bottom'
            },
            {
              icon: 'pause',
              title: 'Row: pause 1s at top',
              description: 'Hold peak contraction for 1 second on each row rep'
            }
          ]
        },
        {
          name: 'Midrange Control',
          duration: '26–34 min',
          description: 'Pushup 1.5s, pseudo planche pushups, L-sit holds.',
          battlePlan: 'Parallette Pushup (1.5 reps)\n• 4 × 6–8 (RPE 6), 90s rest\nPseudo Planche Pushup\n• 4 × 6–8 (RPE 6), 90s rest\nParallette L-Sit (tuck or one leg)\n• 4 × 10–15s (RPE 6), 60–75s rest',
          imageUrl: 'https://customer-assets.emergentagent.com/job_fit-visuals/artifacts/hbfykdfb_download%20%2825%29.png',
          intensityReason: '1.5 pushups add tension without joint irritability.',
          moodTips: [
            {
              icon: 'pause',
              title: 'Pause mid; smooth return',
              description: 'Hold briefly at mid-point then return with control'
            },
            {
              icon: 'body',
              title: 'Long spine, neck relaxed',
              description: 'Maintain neutral spine with relaxed neck throughout'
            }
          ]
        }
      ]
    }
  }
];
