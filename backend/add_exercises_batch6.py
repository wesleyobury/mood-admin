#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 6."""

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
        "name": "Dumbbell Squat Press",
        "aliases": ["DB Squat Press", "Dumbbell Thruster", "DB Thruster"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/tysldqr4_DB%20squat%20press.mov",
        "cues": [
            "Hold dumbbells at shoulders, squat deep",
            "Drive up explosively through heels",
            "Press overhead at the top, lower and repeat"
        ],
        "mistakes": [
            "Pressing before fully standing",
            "Not squatting deep enough"
        ]
    },
    {
        "name": "Landmine Rotational Punch and Bound",
        "aliases": ["Landmine Punch Bound", "Rotational Punch Jump"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/b59mw9fd_Landmine%20rotational%20punch%20and%20bound.mov",
        "cues": [
            "Rotate and punch the bar forward",
            "Bound laterally as you punch",
            "Land soft, reset and repeat other side"
        ],
        "mistakes": [
            "Not syncing punch with bound",
            "Landing with stiff legs"
        ]
    },
    {
        "name": "Cable Lateral Raise",
        "aliases": ["Cable Machine Lateral Raise", "Cable Side Raise", "Single Arm Cable Lateral Raise"],
        "equipment": ["Cable Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/b5mjd4fr_Cable%20machine%20lateral%20raise.mov",
        "cues": [
            "Stand sideways to cable, handle in far hand",
            "Raise arm out to shoulder height",
            "Lower with control, keep slight elbow bend"
        ],
        "mistakes": [
            "Using momentum to swing the weight",
            "Shrugging shoulders during the lift"
        ]
    },
    {
        "name": "Cable Rear Delt Fly",
        "aliases": ["Cable Machine Rear Delt Fly", "Cable Reverse Fly", "Rear Delt Cable Fly"],
        "equipment": ["Cable Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/j5gtni5z_Cable%20machine%20rear%20dealt%20fly.mov",
        "cues": [
            "Cross cables, grip opposite handles",
            "Pull arms back and out, squeeze rear delts",
            "Return slowly with control"
        ],
        "mistakes": [
            "Using too much weight and losing form",
            "Not squeezing at the contracted position"
        ]
    },
    {
        "name": "Dumbbell Flat Bench Press",
        "aliases": ["DB Flat Bench Press", "Dumbbell Bench Press", "DB Bench Press"],
        "equipment": ["Dumbbells", "Flat Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/y6i7m5ns_Db%20flat%20bench%20press.mov",
        "cues": [
            "Lie flat, dumbbells at chest level",
            "Press up and slightly inward",
            "Lower with control, elbows at 45 degrees"
        ],
        "mistakes": [
            "Flaring elbows too wide",
            "Bouncing weights at the bottom"
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
