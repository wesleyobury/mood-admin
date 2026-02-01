#!/usr/bin/env python3
"""Add 4 new exercise videos."""

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
        "name": "Burpee Box Jump",
        "aliases": ["Burpee to Box Jump", "Box Jump Burpee"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/1poz21cl_Burpee%20-%20Box%20jump.mov",
        "cues": [
            "Drop into burpee, chest to floor",
            "Explode up and jump onto box",
            "Step down, immediately into next rep"
        ],
        "mistakes": [
            "Not fully extending hips on jump",
            "Landing with stiff legs on box"
        ]
    },
    {
        "name": "Ab Wheel Standing Rollout",
        "aliases": ["Standing Ab Rollout", "Ab Wheel Rollout", "Standing Wheel Rollout"],
        "equipment": ["Ab Wheel"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/agxkqkpc_Ab%20wheel%20standing%20rollout.mov",
        "cues": [
            "Start standing, hinge and roll wheel out",
            "Extend fully with tight core",
            "Pull back to standing using abs"
        ],
        "mistakes": [
            "Letting lower back sag",
            "Using arms instead of core to pull back"
        ]
    },
    {
        "name": "Hang Clean",
        "aliases": ["Barbell Hang Clean", "Power Clean from Hang"],
        "equipment": ["Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/4b2hxw4m_Hang%20clean.mov",
        "cues": [
            "Start at hip height, shoulders over bar",
            "Explode hips, shrug and pull under",
            "Catch in front rack, stand up"
        ],
        "mistakes": [
            "Pulling with arms too early",
            "Not getting under the bar fast enough"
        ]
    },
    {
        "name": "Tire Flip",
        "aliases": ["Tyre Flip", "Strongman Tire Flip"],
        "equipment": ["Tire"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/3ju0njpj_Tire%20flip.mov",
        "cues": [
            "Squat down, hands under tire edge",
            "Drive through legs to lift and push",
            "Flip tire over, reset for next rep"
        ],
        "mistakes": [
            "Rounding back during the lift",
            "Using only arms instead of legs"
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
