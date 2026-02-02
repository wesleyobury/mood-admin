#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 7."""

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
        "name": "Barbell Military Press",
        "aliases": ["BB Military Press", "Overhead Press", "Strict Press", "Standing Barbell Press"],
        "equipment": ["Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/6lb7vrdh_BB%20military%20press.mov",
        "cues": [
            "Bar at shoulder height, grip just outside shoulders",
            "Press straight up, head through at top",
            "Lower with control to starting position"
        ],
        "mistakes": [
            "Excessive back arch",
            "Pressing the bar forward instead of straight up"
        ]
    },
    {
        "name": "Barbell Flat Bench Press",
        "aliases": ["BB Flat Bench", "Barbell Bench Press", "Bench Press"],
        "equipment": ["Barbell", "Flat Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/bov7l98c_BB%20flat%20bench.mov",
        "cues": [
            "Grip bar slightly wider than shoulders",
            "Lower to mid-chest with control",
            "Press up, locking out at the top"
        ],
        "mistakes": [
            "Bouncing bar off chest",
            "Flaring elbows too wide"
        ]
    },
    {
        "name": "Flat Bench Press",
        "aliases": ["Bench Press", "Chest Press", "Flat Press"],
        "equipment": ["Barbell", "Flat Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/c6yeuj8r_Flat%20bench%20press.mov",
        "cues": [
            "Set up with tight back, feet planted",
            "Lower bar to chest, elbows at 45 degrees",
            "Drive through feet and press to lockout"
        ],
        "mistakes": [
            "Lifting hips off the bench",
            "Not keeping shoulder blades retracted"
        ]
    },
    {
        "name": "Pec Deck Fly",
        "aliases": ["Pec Deck", "Machine Chest Fly", "Butterfly Machine"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/fnpdiu0q_Pec%20deck%20fly.mov",
        "cues": [
            "Sit with back flat, arms on pads",
            "Squeeze arms together in front of chest",
            "Return slowly with control"
        ],
        "mistakes": [
            "Using momentum to swing arms",
            "Not squeezing at the contracted position"
        ]
    },
    {
        "name": "Cable Machine Fly",
        "aliases": ["Cable Fly", "Cable Chest Fly", "Standing Cable Fly", "Cable Crossover"],
        "equipment": ["Cable Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/z486td8r_Cable%20machine%20fly.mov",
        "cues": [
            "Stand centered, slight forward lean",
            "Bring handles together in arc motion",
            "Squeeze chest at the bottom, return with control"
        ],
        "mistakes": [
            "Bending elbows too much",
            "Using body momentum to move weight"
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
