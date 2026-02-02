#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 5."""

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
        "name": "Landmine Split Jerk",
        "aliases": ["Landmine Jerk", "Single Arm Landmine Jerk"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/5g4hten1_Landmine%20split%20jerk.mov",
        "cues": [
            "Hold barbell end at shoulder, dip and drive",
            "Split feet as you press overhead",
            "Lock out arm, recover feet together"
        ],
        "mistakes": [
            "Not using leg drive",
            "Splitting feet too narrow"
        ]
    },
    {
        "name": "Landmine Triple Extension Heave",
        "aliases": ["Landmine Heave", "Triple Extension Throw"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/psbxwuw0_Landmine%20triple%20extension%20heave.mov",
        "cues": [
            "Start low, grip barbell end",
            "Extend ankles, knees, and hips explosively",
            "Drive bar up and forward with full body"
        ],
        "mistakes": [
            "Using arms before hips extend",
            "Not achieving full triple extension"
        ]
    },
    {
        "name": "Dumbbell Incline Press",
        "aliases": ["DB Incline Press", "Incline Dumbbell Bench Press", "Incline DB Press"],
        "equipment": ["Dumbbells", "Incline Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/58cs7s12_DB%20incline%20press.mov",
        "cues": [
            "Set bench to 30-45 degrees, dumbbells at chest",
            "Press up and slightly inward",
            "Lower with control, elbows at 45 degrees"
        ],
        "mistakes": [
            "Flaring elbows too wide",
            "Bouncing weights at the bottom"
        ]
    },
    {
        "name": "Single Leg Box Jump",
        "aliases": ["One Leg Box Jump", "Unilateral Box Jump"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/sgp25luy_Single%20leg%20box%20jump.mov",
        "cues": [
            "Stand on one leg facing the box",
            "Swing arms and explode upward",
            "Land softly on the box, stabilize"
        ],
        "mistakes": [
            "Not using arm swing for power",
            "Landing with a stiff leg"
        ]
    },
    {
        "name": "Landmine Rotation Punch",
        "aliases": ["Landmine Punch", "Rotational Punch Press"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/xm1wv8g3_Landmine%20rotation%20punch.mov",
        "cues": [
            "Start with bar at shoulder, rotate hips away",
            "Drive rotation from hips as you punch",
            "Fully extend arm, pivot back foot"
        ],
        "mistakes": [
            "Punching without hip rotation",
            "Not pivoting on the back foot"
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
