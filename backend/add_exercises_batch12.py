#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 12."""

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
        "name": "Clamshells",
        "aliases": ["Clamshell Exercise", "Side Lying Clamshells", "Hip Clamshells"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/2mb09bex_Clamshells.mov",
        "cues": [
            "Lie on side, knees bent, feet together",
            "Raise top knee while keeping feet touching",
            "Lower with control, squeeze glutes at top"
        ],
        "mistakes": [
            "Rolling hips backward during lift",
            "Not squeezing glutes at the top"
        ]
    },
    {
        "name": "Crunches",
        "aliases": ["Ab Crunches", "Abdominal Crunches", "Basic Crunches"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/feuh3omn_Crunches.mov",
        "cues": [
            "Lie flat, knees bent, hands behind head",
            "Curl shoulders off ground, squeeze abs",
            "Lower with control, keep tension on abs"
        ],
        "mistakes": [
            "Pulling on neck with hands",
            "Using momentum instead of ab contraction"
        ]
    },
    {
        "name": "Dumbbell Curl",
        "aliases": ["DB Curl", "Bicep Curl", "Dumbbell Bicep Curl"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/450juhlt_DB%20Curl.mov",
        "cues": [
            "Stand tall, dumbbells at sides, palms forward",
            "Curl weights up, squeeze biceps at top",
            "Lower with control, full extension"
        ],
        "mistakes": [
            "Swinging body to lift weight",
            "Not fully extending arms at bottom"
        ]
    },
    {
        "name": "Dumbbell Goblet Squat",
        "aliases": ["DB Goblet Squat", "Goblet Squat", "Kettlebell Goblet Squat"],
        "equipment": ["Dumbbells", "Kettlebell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/ebpwbu6b_DB%20goblet%20squat.mov",
        "cues": [
            "Hold dumbbell at chest, elbows tucked",
            "Squat deep, keeping torso upright",
            "Drive through heels to stand"
        ],
        "mistakes": [
            "Letting torso fall forward",
            "Knees caving inward"
        ]
    },
    {
        "name": "Dumbbell Hammer Curl",
        "aliases": ["DB Hammer Curl", "Hammer Curl", "Neutral Grip Curl"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/qceq8o8n_DB%20hammer%20curl.mov",
        "cues": [
            "Stand with dumbbells at sides, palms facing in",
            "Curl weights up keeping neutral grip",
            "Lower with control to full extension"
        ],
        "mistakes": [
            "Swinging body for momentum",
            "Rotating wrists during the curl"
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
