#!/usr/bin/env python3
"""
Fix existing exercises and add new ones.
- Update cues to exactly 3
- Update mistakes to exactly 2
- Remove static thumbnail URLs
- Add 5 new exercises
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

# Fix existing 10 exercises with proper cues (3) and mistakes (2), remove thumbnails
FIXES = [
    {
        "name": "Barbell Deadlift",
        "thumbnail_url": "",  # Remove thumbnail
        "cues": [
            "Hinge at hips, grip bar outside knees",
            "Keep back flat and chest up throughout",
            "Drive through heels to lockout"
        ],
        "mistakes": [
            "Rounding the lower back",
            "Letting bar drift away from body"
        ]
    },
    {
        "name": "Barbell Front Squat",
        "thumbnail_url": "",
        "cues": [
            "Rest bar on front delts, elbows high",
            "Keep torso upright, descend to parallel",
            "Drive up through midfoot"
        ],
        "mistakes": [
            "Dropping elbows forward",
            "Leaning forward excessively"
        ]
    },
    {
        "name": "Barbell Hip Thrust",
        "thumbnail_url": "",
        "cues": [
            "Upper back against bench, bar over hips",
            "Drive hips up by squeezing glutes",
            "Hold at top, lower with control"
        ],
        "mistakes": [
            "Overarching lower back",
            "Not achieving full hip extension"
        ]
    },
    {
        "name": "Barbell Lunge",
        "thumbnail_url": "",
        "cues": [
            "Bar on upper back, core braced",
            "Step back, front knee tracks over toes",
            "Drive through front heel to stand"
        ],
        "mistakes": [
            "Knee caving inward",
            "Taking too short a step"
        ]
    },
    {
        "name": "Barbell Sumo Deadlift",
        "thumbnail_url": "",
        "cues": [
            "Wide stance, toes pointed out 45 degrees",
            "Grip bar inside knees, push knees out",
            "Drive hips forward to lockout"
        ],
        "mistakes": [
            "Knees caving inward",
            "Hips shooting up too fast"
        ]
    },
    {
        "name": "Cable Face Pull",
        "thumbnail_url": "",
        "cues": [
            "Set cable at face height, grip rope",
            "Pull toward face, spreading rope apart",
            "Externally rotate shoulders at end"
        ],
        "mistakes": [
            "Using too much weight",
            "No external rotation at end"
        ]
    },
    {
        "name": "Cable Glute Kickback",
        "thumbnail_url": "",
        "cues": [
            "Attach ankle strap to low cable",
            "Kick leg straight back, squeeze glute",
            "Lower with control"
        ],
        "mistakes": [
            "Arching lower back",
            "Swinging leg instead of controlled motion"
        ]
    },
    {
        "name": "Cable Lat Pullover",
        "thumbnail_url": "",
        "cues": [
            "Stand facing high cable, grip bar",
            "Pull bar down to thighs in arc",
            "Squeeze lats at bottom"
        ],
        "mistakes": [
            "Bending elbows too much",
            "Using momentum instead of lats"
        ]
    },
    {
        "name": "Cable Overhead Tricep Extension",
        "thumbnail_url": "",
        "cues": [
            "Face away from low cable, hold rope overhead",
            "Extend arms forward, keep upper arms still",
            "Squeeze triceps at full extension"
        ],
        "mistakes": [
            "Moving elbows during extension",
            "Not achieving full lockout"
        ]
    },
    {
        "name": "Cable Rope Curl",
        "thumbnail_url": "",
        "cues": [
            "Grip rope with neutral grip, elbows pinned",
            "Curl rope up toward shoulders",
            "Lower with control"
        ],
        "mistakes": [
            "Swinging body for momentum",
            "Moving elbows forward"
        ]
    }
]

# New 5 exercises to add
NEW_EXERCISES = [
    {
        "name": "Cable Rope Tricep Pushdown",
        "aliases": ["Tricep Pushdown", "Rope Pushdown", "Cable Tricep Extension"],
        "equipment": ["Cable Machine", "Rope Attachment"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/i2ddxe4w_Cable%20rope%20tricep%20pushdown.mov",
        "cues": [
            "Stand facing cable, grip rope at chest height",
            "Push down and spread rope at bottom",
            "Squeeze triceps, return with control"
        ],
        "mistakes": [
            "Flaring elbows outward",
            "Using body momentum"
        ]
    },
    {
        "name": "DB Front Squat",
        "aliases": ["Dumbbell Front Squat", "Goblet Squat Variation"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/gxr2dbow_DB%20front%20squat.mov",
        "cues": [
            "Hold dumbbells at shoulders, elbows high",
            "Squat down keeping torso upright",
            "Drive through heels to stand"
        ],
        "mistakes": [
            "Leaning forward excessively",
            "Letting elbows drop"
        ]
    },
    {
        "name": "DB RDL",
        "aliases": ["Dumbbell RDL", "Dumbbell Romanian Deadlift", "DB Romanian Deadlift"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/umom8xmj_DB%20rdl.mov",
        "cues": [
            "Hold dumbbells in front, soft knee bend",
            "Hinge at hips, lower weights along legs",
            "Squeeze glutes to return to standing"
        ],
        "mistakes": [
            "Rounding the lower back",
            "Bending knees too much"
        ]
    },
    {
        "name": "DB Side Lunge",
        "aliases": ["Dumbbell Side Lunge", "Lateral Lunge", "DB Lateral Lunge"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wkd8gj9e_DB%20side%20lunges.mov",
        "cues": [
            "Hold dumbbells at sides, step wide laterally",
            "Bend stepping leg, keep other leg straight",
            "Push off to return to center"
        ],
        "mistakes": [
            "Knee extending past toes",
            "Leaning torso too far forward"
        ]
    },
    {
        "name": "DB Single Leg RDL",
        "aliases": ["Single Leg RDL", "Dumbbell Single Leg Deadlift", "One Leg RDL"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/kci3qn9b_DB%20single%20leg%20rdl.mov",
        "cues": [
            "Stand on one leg, hold dumbbell opposite side",
            "Hinge forward, extend back leg for balance",
            "Return to standing with control"
        ],
        "mistakes": [
            "Rotating hips open",
            "Rounding the back"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Connected to {DB_NAME}")
    
    # Fix existing exercises
    print("\n=== Fixing existing 10 exercises ===")
    for fix in FIXES:
        result = await db.exercises.update_one(
            {'name': fix['name']},
            {'$set': {
                'thumbnail_url': fix['thumbnail_url'],
                'cues': fix['cues'],
                'mistakes': fix['mistakes']
            }}
        )
        if result.modified_count > 0:
            print(f"✓ Fixed: {fix['name']}")
        else:
            print(f"- No change: {fix['name']}")
    
    # Add new exercises
    print("\n=== Adding 5 new exercises ===")
    for exercise in NEW_EXERCISES:
        # Check if already exists
        existing = await db.exercises.find_one({'name': exercise['name']})
        if existing:
            # Update it
            await db.exercises.update_one(
                {'_id': existing['_id']},
                {'$set': exercise}
            )
            print(f"✓ Updated: {exercise['name']}")
        else:
            # Insert new
            exercise['created_at'] = datetime.now(timezone.utc)
            await db.exercises.insert_one(exercise)
            print(f"✓ Inserted: {exercise['name']}")
    
    # Verify
    print("\n=== Verification ===")
    total = await db.exercises.count_documents({})
    with_video = await db.exercises.count_documents({'video_url': {'$exists': True, '$ne': ''}})
    print(f"Total exercises: {total}")
    print(f"Exercises with video: {with_video}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
