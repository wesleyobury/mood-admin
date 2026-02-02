#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 11."""

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
        "name": "Dumbbell Step Ups",
        "aliases": ["DB Step Ups", "Weighted Step Ups", "Step Ups with Dumbbells"],
        "equipment": ["Dumbbells", "Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/au75warz_DB%20step%20ups.mov",
        "cues": [
            "Hold dumbbells at sides, step up onto box",
            "Drive through front heel to stand tall",
            "Step down with control, alternate legs"
        ],
        "mistakes": [
            "Pushing off back foot instead of driving through front",
            "Leaning torso too far forward"
        ]
    },
    {
        "name": "Knee Tuck Crunches",
        "aliases": ["Knee Tucks", "Tuck Crunches", "Double Crunch"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/sk96wby9_Knee%20tuck%20crunches.mov",
        "cues": [
            "Lie flat, hands behind head, legs extended",
            "Crunch up while bringing knees to chest",
            "Lower back down with control"
        ],
        "mistakes": [
            "Pulling on neck with hands",
            "Using momentum instead of ab contraction"
        ]
    },
    {
        "name": "Leg Press",
        "aliases": ["Machine Leg Press", "Seated Leg Press", "45 Degree Leg Press"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/xplynzmo_Leg%20press.mov",
        "cues": [
            "Feet shoulder-width on platform, back flat",
            "Lower weight until knees at 90 degrees",
            "Press through heels to full extension"
        ],
        "mistakes": [
            "Letting lower back round off the pad",
            "Locking knees completely at the top"
        ]
    },
    {
        "name": "Medicine Ball Russian Twists",
        "aliases": ["Med Ball Russian Twists", "Weighted Russian Twists", "Russian Twist"],
        "equipment": ["Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/irhzzpya_Med%20ball%20russian%20twists.mov",
        "cues": [
            "Sit with knees bent, lean back slightly, hold ball",
            "Rotate torso and tap ball side to side",
            "Keep core tight, feet can be elevated"
        ],
        "mistakes": [
            "Moving only arms instead of rotating torso",
            "Rounding the lower back"
        ]
    },
    {
        "name": "Plank",
        "aliases": ["Front Plank", "Forearm Plank", "Core Plank"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/71clw8hp_Plank.mov",
        "cues": [
            "Forearms on ground, body in straight line",
            "Engage core, squeeze glutes",
            "Hold position, breathe steadily"
        ],
        "mistakes": [
            "Letting hips sag toward ground",
            "Piking hips too high"
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
