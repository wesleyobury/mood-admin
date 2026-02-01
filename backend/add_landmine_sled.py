#!/usr/bin/env python3
"""Add 4 new Landmine and Sled exercise videos."""

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
        "name": "Landmine Push Press",
        "aliases": ["Landmine Shoulder Press", "Single Arm Landmine Press"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/mi4jngx6_Landmine%20push%20press.mov",
        "cues": [
            "Hold barbell end at shoulder, slight knee bend",
            "Dip and drive through legs to press",
            "Lock out overhead, lower with control"
        ],
        "mistakes": [
            "Not using leg drive",
            "Pressing before the dip"
        ]
    },
    {
        "name": "Landmine Rotation",
        "aliases": ["Landmine Twist", "Russian Twist Landmine", "Landmine Core Rotation"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/dhvo096t_Landmine%20rotation.mov",
        "cues": [
            "Hold barbell end with arms extended",
            "Rotate torso side to side with control",
            "Keep hips stable, core tight"
        ],
        "mistakes": [
            "Rotating hips instead of torso",
            "Moving too fast without control"
        ]
    },
    {
        "name": "Landmine Squat Press",
        "aliases": ["Landmine Thruster", "Squat to Press Landmine"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/fw68gcml_Landmine%20squat%20press.mov",
        "cues": [
            "Hold barbell end at chest, squat down",
            "Drive up explosively from squat",
            "Press overhead at top of movement"
        ],
        "mistakes": [
            "Separating squat and press movements",
            "Not reaching full depth on squat"
        ]
    },
    {
        "name": "Sled Pull",
        "aliases": ["Sled Row", "Rope Sled Pull", "Hand Over Hand Sled"],
        "equipment": ["Sled", "Rope"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/70lk2gh1_Sled%20pull.mov",
        "cues": [
            "Sit or stand with rope in hands",
            "Pull rope hand over hand toward you",
            "Keep core braced, back straight"
        ],
        "mistakes": [
            "Rounding the back while pulling",
            "Using momentum instead of controlled pulls"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Adding 4 new exercises to {DB_NAME}...")
    
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
