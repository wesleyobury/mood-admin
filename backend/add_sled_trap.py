#!/usr/bin/env python3
"""Add 3 new Sled and Trap Bar exercise videos."""

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
        "name": "Sled Push",
        "aliases": ["Prowler Push", "Weighted Sled Push"],
        "equipment": ["Sled"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/0f07forp_Sled%20push.mov",
        "cues": [
            "Grip handles, lean forward at 45 degrees",
            "Drive through legs with powerful steps",
            "Keep core braced, arms extended"
        ],
        "mistakes": [
            "Standing too upright",
            "Taking short choppy steps"
        ]
    },
    {
        "name": "Trap Bar Deadlift",
        "aliases": ["Hex Bar Deadlift", "Trap Bar DL"],
        "equipment": ["Trap Bar", "Hex Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/c69iy7pq_Trap%20bar%20deadlift.mov",
        "cues": [
            "Stand center of bar, grip handles",
            "Push floor away, keep chest up",
            "Lock out hips at top"
        ],
        "mistakes": [
            "Rounding the back",
            "Lifting with arms instead of legs"
        ]
    },
    {
        "name": "Trap Bar Squat Jump",
        "aliases": ["Hex Bar Jump", "Trap Bar Jump Squat"],
        "equipment": ["Trap Bar", "Hex Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/pbsl1n0p_Trap%20bar%20squat%20jump.mov",
        "cues": [
            "Grip trap bar handles, squat down",
            "Explode upward into jump",
            "Land soft, absorb into next squat"
        ],
        "mistakes": [
            "Landing with stiff legs",
            "Not reaching full squat depth"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Adding 3 new exercises to {DB_NAME}...")
    
    for exercise in NEW_EXERCISES:
        existing = await db.exercises.find_one({'name': exercise['name']})
        if existing:
            await db.exercises.update_one({'_id': existing['_id']}, {'$set': exercise})
            print(f"✓ Updated: {exercise['name']}")
        else:
            exercise['created_at'] = datetime.now(timezone.utc)
            await db.exercises.insert_one(exercise)
            print(f"✓ Inserted: {exercise['name']}")
    
    total = await db.exercises.count_documents({})
    print(f"\nTotal exercises: {total}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
