#!/usr/bin/env python3
"""Add final 4 exercise videos."""

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
        "name": "Parallette Push Ups",
        "aliases": ["Parallette Pushups", "Deep Push Ups", "Elevated Push Ups"],
        "equipment": ["Parallettes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/29em9t3y_Parellette%20pushups.mov",
        "cues": [
            "Grip parallettes, body in plank position",
            "Lower chest below hand level",
            "Press back up to full lockout"
        ],
        "mistakes": [
            "Not using full range of motion",
            "Letting hips sag or pike up"
        ]
    },
    {
        "name": "Pike Jumps",
        "aliases": ["Pike Jump", "Tuck Jump to Pike", "Explosive Pike"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/bwgvvwvm_Pike%20jumps.mov",
        "cues": [
            "Start standing, jump explosively",
            "Pike legs up, touch toes mid-air",
            "Land soft with bent knees"
        ],
        "mistakes": [
            "Not reaching full pike position",
            "Landing with stiff legs"
        ]
    },
    {
        "name": "Pull Ups",
        "aliases": ["Pull Up", "Overhand Pull Up", "Pronated Pull Up"],
        "equipment": ["Pull Up Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/z0oxh2tg_Pull%20ups.mov",
        "cues": [
            "Grip bar overhand, shoulder width",
            "Pull chin over bar, squeeze lats",
            "Lower with control to full hang"
        ],
        "mistakes": [
            "Kipping or swinging excessively",
            "Not reaching full extension at bottom"
        ]
    },
    {
        "name": "V Ups",
        "aliases": ["V-Up", "V Sit Up", "Jackknife"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/ye5necoz_V%20ups.mov",
        "cues": [
            "Lie flat, arms overhead",
            "Lift legs and torso simultaneously",
            "Touch toes at top, lower with control"
        ],
        "mistakes": [
            "Using momentum instead of core",
            "Bending knees during the movement"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Adding 4 final exercises to {DB_NAME}...")
    
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
