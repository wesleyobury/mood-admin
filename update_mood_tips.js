// This is a temporary helper file to update all MOOD tips at once
// Run this script to update all workout MOOD tips with the provided data

const fs = require('fs');
const path = require('path');

// All the MOOD tips data as provided by the user
const moodTipsData = {
  'Treadmill': {
    'beginner': {
      'Walk & Jog Mixer': [
        { icon: 'body', title: 'Posture & Form', description: 'Stay tall, no rail-holding; land mid-foot to protect knees.' },
        { icon: 'refresh', title: 'Breathing Pattern', description: 'Breathe rhythmically: 3 steps inhale, 2 steps exhale.' }
      ],
      'Rolling Hills': [
        { icon: 'walk', title: 'Incline Technique', description: 'Shorten stride, drive knees on inclines; avoid leaning.' },
        { icon: 'refresh', title: 'Core Engagement', description: 'Engage core for posture; use arms for momentum.' }
      ]
    },
    'intermediate': {
      'Speed Ladder': [
        { icon: 'flash', title: 'Cadence Focus', description: 'Increase cadence, not stride length, for speed.' },
        { icon: 'eye', title: 'Posture & Breathing', description: 'Gaze forward, shoulders relaxed for open lungs.' }
      ],
      'Incline Intervals': [
        { icon: 'trending-up', title: 'Glute Drive', description: 'Drive through glutes on inclines; keep upper body loose.' },
        { icon: 'refresh', title: 'Recovery Breathing', description: 'Use walk intervals for deep, belly-focused recovery breaths.' }
      ]
    },
    'advanced': {
      'Sprint Pyramid': [
        { icon: 'flash', title: 'Explosive Technique', description: 'Explode from balls of feet; quick, short steps for sprints.' },
        { icon: 'refresh', title: 'Active Recovery', description: 'Jogs are active recovery; shake out limbs, control breathing.' }
      ],
      'Tempo & Hill Challenge': [
        { icon: 'trending-up', title: 'Tempo Control', description: '"Comfortably hard" tempo; set incline changes beforehand.' },
        { icon: 'refresh', title: 'Breathing Technique', description: 'Drive through glutes on hills; maintain steady, deep breathing.' }
      ]
    }
  },
  'Elliptical': {
    'beginner': {
      'Resistance Rounds': [
        { icon: 'body', title: 'Heel Engagement', description: 'Heels down throughout stride for glute engagement.' },
        { icon: 'fitness', title: 'Posture & Power', description: 'Upright posture; 70% power from legs, light grip on handles.' }
      ],
      'Cadence Play': [
        { icon: 'refresh', title: 'Breathing Rhythm', description: 'Match breathing to RPM; smooth, circular motion.' },
        { icon: 'body', title: 'Chest Position', description: 'Keep chest lifted; avoid folding forward.' }
      ]
    },
    'intermediate': {
      'Climb & Sprint': [
        { icon: 'trending-up', title: 'Climb Technique', description: 'Push through heels on climbs; drive knees higher.' },
        { icon: 'flash', title: 'Sprint Focus', description: 'Sprints are for cadence, not just resistance; light grip.' }
      ],
      'Reverse & Forward': [
        { icon: 'body', title: 'Core Control', description: 'Core tight, avoid knee overextension in reverse.' },
        { icon: 'refresh', title: 'Direction Switch', description: 'Exhale fully when switching direction to reset rhythm.' }
      ]
    },
    'advanced': {
      'Tabata Elliptical': [
        { icon: 'flash', title: 'Max Effort', description: 'Explode into each 20-sec effort; no pacing.' },
        { icon: 'refresh', title: 'Recovery Form', description: 'Stay loose in shoulders; use recovery for deep breaths.' }
      ],
      'Endurance Builder': [
        { icon: 'timer', title: 'Energy Management', description: 'Conserve energy early; focus on consistent effort.' },
        { icon: 'refresh', title: 'Reverse Control', description: 'Control momentum in reverse for targeted muscle work.' }
      ]
    }
  }
  // Add more equipment types here as needed
};

console.log('MOOD tips data structure created successfully!');
console.log('Equipment types:', Object.keys(moodTipsData));