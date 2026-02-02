#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library."""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

NEW_EXERCISES = [
    {
        "name": "Dumbbell Lateral Raise",
        "aliases": ["DB Lateral Raise", "Side Raise", "Lateral Delt Raise", "Side Delt Raise"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/mbe2mv2e_DB%20lateral%20raise.mov",
        "cues": [
            "Stand with dumbbells at sides",
            "Raise arms out to sides, elbows slightly bent",
            "Lift to shoulder height, pause briefly",
            "Lower with control"
        ],
        "mistakes": [
            "Using momentum to swing weights up",
            "Raising arms too high above shoulders",
            "Shrugging shoulders during the lift"
        ]
    },
    {
        "name": "Dumbbell Squat Press",
        "aliases": ["DB Squat Press", "Dumbbell Thruster", "Squat to Press", "DB Thruster"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/tgcfqpqg_DB%20squat%20press.mov",
        "cues": [
            "Hold dumbbells at shoulder height",
            "Squat down keeping chest up",
            "Drive up and press overhead",
            "Lower dumbbells and repeat"
        ],
        "mistakes": [
            "Not squatting deep enough",
            "Pressing before fully standing",
            "Letting knees cave inward"
        ]
    },
    {
        "name": "Depth Step Rebound",
        "aliases": ["Depth Jump", "Drop Jump", "Reactive Jump", "Plyometric Depth Jump"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/zjophypg_Depth%20step%20rebound.mov",
        "cues": [
            "Step off box, land softly on both feet",
            "Immediately explode upward",
            "Minimize ground contact time",
            "Land softly and reset"
        ],
        "mistakes": [
            "Spending too much time on the ground",
            "Landing with stiff legs",
            "Not fully extending on the jump"
        ]
    },
    {
        "name": "Hip Adductor Machine",
        "aliases": ["Glute Machine Hip Adductor", "Inner Thigh Machine", "Adductor Machine", "Seated Hip Adduction"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/3k0ex1gg_Glute%20machine%20hip%20adductor.mov",
        "cues": [
            "Sit with back against pad, legs apart",
            "Squeeze legs together using inner thighs",
            "Pause at the contracted position",
            "Return slowly to start"
        ],
        "mistakes": [
            "Using momentum instead of muscle control",
            "Not going through full range of motion",
            "Leaning forward during the movement"
        ]
    },
    {
        "name": "Hack Squat",
        "aliases": ["Machine Hack Squat", "Hack Squat Machine", "Reverse Hack Squat"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/ggnsiixp_Hack%20squat.mov",
        "cues": [
            "Position shoulders under pads, feet shoulder-width",
            "Release safety and lower with control",
            "Go to parallel or below",
            "Drive through heels to stand"
        ],
        "mistakes": [
            "Letting knees cave inward",
            "Not going deep enough",
            "Locking knees completely at the top"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Adding 5 new exercises to {DB_NAME}...")
    print("=" * 50)
    
    added = 0
    updated = 0
    
    for exercise in NEW_EXERCISES:
        existing = await db.exercises.find_one({'name': exercise['name']})
        if existing:
            await db.exercises.update_one(
                {'_id': existing['_id']}, 
                {'$set': {
                    **exercise,
                    'updated_at': datetime.now(timezone.utc)
                }}
            )
            print(f"✓ Updated: {exercise['name']}")
            updated += 1
        else:
            exercise['created_at'] = datetime.now(timezone.utc)
            await db.exercises.insert_one(exercise)
            print(f"✓ Inserted: {exercise['name']}")
            added += 1
    
    print("=" * 50)
    print(f"Added: {added}, Updated: {updated}")
    
    total = await db.exercises.count_documents({})
    print(f"Total exercises in library: {total}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
