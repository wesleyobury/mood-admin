#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 14 (Final)."""

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
        "name": "Alternating Toe Touch",
        "aliases": ["Toe Touches", "Lying Toe Touch", "Ab Toe Touch"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/5fe2dren_Alternating%20toe%20touch.mov",
        "cues": [
            "Lie flat, legs extended up toward ceiling",
            "Reach up and touch opposite hand to foot",
            "Alternate sides with controlled motion"
        ],
        "mistakes": [
            "Not keeping legs straight",
            "Using momentum instead of ab contraction"
        ]
    },
    {
        "name": "Assisted Dips",
        "aliases": ["Machine Dips", "Assisted Tricep Dips", "Dip Machine"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/jo7v589c_Assisted%20dips.mov",
        "cues": [
            "Grip handles, knees on pad, torso upright",
            "Lower until elbows at 90 degrees",
            "Press back up, squeeze triceps at top"
        ],
        "mistakes": [
            "Leaning too far forward",
            "Not going deep enough"
        ]
    },
    {
        "name": "Battle Rope Alternating Waves",
        "aliases": ["Rope Waves", "Alternating Waves", "Single Arm Waves"],
        "equipment": ["Battle Ropes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/ecr8qxno_Battle%20rope%20alternating%20waves.mov",
        "cues": [
            "Grip ropes, athletic stance, slight squat",
            "Alternate arms up and down creating waves",
            "Keep rhythm steady, engage core"
        ],
        "mistakes": [
            "Standing too upright",
            "Moving arms at same time instead of alternating"
        ]
    },
    {
        "name": "Battle Rope Lateral Raises",
        "aliases": ["Rope Lateral Raises", "Battle Rope Side Raises"],
        "equipment": ["Battle Ropes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/cf2av97w_Battle%20rope%20lateral%20raises.mov",
        "cues": [
            "Hold ropes at sides, slight squat stance",
            "Raise arms out to sides explosively",
            "Lower with control, repeat rhythmically"
        ],
        "mistakes": [
            "Using only arms instead of whole body",
            "Raising arms too high above shoulders"
        ]
    },
    {
        "name": "Battle Rope Side to Side Slams",
        "aliases": ["Rope Side Slams", "Lateral Rope Slams", "Side to Side Waves"],
        "equipment": ["Battle Ropes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/q7awgnl9_Battle%20rope%20side%20to%20side%20slams.mov",
        "cues": [
            "Grip both ropes together, athletic stance",
            "Slam ropes side to side with rotation",
            "Engage core, pivot hips with each slam"
        ],
        "mistakes": [
            "Not rotating through the core",
            "Using only arms without hip engagement"
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
