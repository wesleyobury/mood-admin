#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 13."""

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
        "name": "Battle Rope Slams",
        "aliases": ["Battle Ropes", "Rope Slams", "Double Wave Slams"],
        "equipment": ["Battle Ropes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/szvihbh8_Battle%20rope%20slams.mov",
        "cues": [
            "Grip ropes, slight squat stance",
            "Raise arms high and slam ropes down hard",
            "Keep rhythm, engage core throughout"
        ],
        "mistakes": [
            "Standing too upright",
            "Using only arms instead of whole body"
        ]
    },
    {
        "name": "Bench Dips",
        "aliases": ["Tricep Dips", "Chair Dips", "Bodyweight Dips"],
        "equipment": ["Flat Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/ndedos99_Bench%20dips.mov",
        "cues": [
            "Hands on bench edge, legs extended",
            "Lower body until elbows at 90 degrees",
            "Press back up, squeeze triceps at top"
        ],
        "mistakes": [
            "Flaring elbows out too wide",
            "Not going deep enough"
        ]
    },
    {
        "name": "Bicycle Crunches",
        "aliases": ["Bicycle Abs", "Cross Body Crunches", "Cycling Crunches"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/9gpeq929_Bicycle%20crunches.mov",
        "cues": [
            "Lie flat, hands behind head, legs raised",
            "Rotate elbow to opposite knee, extend other leg",
            "Alternate sides in pedaling motion"
        ],
        "mistakes": [
            "Pulling on neck with hands",
            "Moving too fast without control"
        ]
    },
    {
        "name": "Bird Dog",
        "aliases": ["Quadruped Bird Dog", "Opposite Arm Leg Raise"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/e9sv9lwc_Bird%20dog.mov",
        "cues": [
            "Start on all fours, spine neutral",
            "Extend opposite arm and leg straight out",
            "Hold briefly, return with control, alternate"
        ],
        "mistakes": [
            "Arching or rounding the lower back",
            "Rotating hips during the movement"
        ]
    },
    {
        "name": "Cable Straight Bar Curl",
        "aliases": ["Cable Machine Straight Bar Curl", "Cable Bicep Curl", "Low Cable Curl"],
        "equipment": ["Cable Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/y8vqu6wh_Cable%20machine%20straight%20bar%20curl.mov",
        "cues": [
            "Stand facing cable, grip bar underhand",
            "Curl bar up, squeeze biceps at top",
            "Lower with control, keep elbows stationary"
        ],
        "mistakes": [
            "Swinging body for momentum",
            "Moving elbows forward during curl"
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
