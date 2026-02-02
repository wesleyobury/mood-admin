#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 9."""

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
        "name": "Sit Ups",
        "aliases": ["Situps", "Abdominal Sit Ups", "Ab Sit Ups"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/4v96n7au_Sit%20ups.mov",
        "cues": [
            "Lie flat, knees bent, hands behind head",
            "Curl up bringing chest toward knees",
            "Lower with control, don't collapse"
        ],
        "mistakes": [
            "Pulling on neck with hands",
            "Using momentum instead of abs"
        ]
    },
    {
        "name": "TRX Knee Crunches",
        "aliases": ["TRX Knee Tucks", "Suspension Knee Crunches", "TRX Ab Tucks"],
        "equipment": ["TRX", "Suspension Trainer"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/jsgzp8qc_Trx%20knee%20crunches.mov",
        "cues": [
            "Start in plank, feet in TRX straps",
            "Drive knees toward chest",
            "Extend back to plank with control"
        ],
        "mistakes": [
            "Letting hips sag in plank",
            "Not fully extending legs on return"
        ]
    },
    {
        "name": "TRX Push Ups",
        "aliases": ["TRX Pushups", "Suspension Push Ups", "TRX Chest Press"],
        "equipment": ["TRX", "Suspension Trainer"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/5fs8suca_TRX%20pushups.mov",
        "cues": [
            "Grip handles, lean forward in plank",
            "Lower chest between hands",
            "Press back up to starting position"
        ],
        "mistakes": [
            "Letting straps swing uncontrolled",
            "Sagging hips during the movement"
        ]
    },
    {
        "name": "TRX Rows",
        "aliases": ["TRX Row", "Suspension Rows", "Inverted TRX Row"],
        "equipment": ["TRX", "Suspension Trainer"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/ynoj97og_TRX%20rows.mov",
        "cues": [
            "Lean back holding handles, body straight",
            "Pull chest to hands, squeeze shoulder blades",
            "Lower with control to full arm extension"
        ],
        "mistakes": [
            "Letting hips drop during pull",
            "Not fully extending arms at bottom"
        ]
    },
    {
        "name": "Walking Lunges",
        "aliases": ["Lunge Walk", "Forward Walking Lunges", "Traveling Lunges"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/5iljqr9g_Walking%20lunges.mov",
        "cues": [
            "Step forward into deep lunge",
            "Drive through front heel to stand",
            "Step forward with back leg into next lunge"
        ],
        "mistakes": [
            "Front knee extending past toes",
            "Torso leaning too far forward"
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
