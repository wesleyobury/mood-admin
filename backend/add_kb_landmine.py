#!/usr/bin/env python3
"""Add 5 new KB and Landmine exercise videos."""

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
        "name": "KB High Pull",
        "aliases": ["Kettlebell High Pull", "KB Upright Pull"],
        "equipment": ["Kettlebell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/12gxc1r9_KB%20high%20pull.mov",
        "cues": [
            "Hinge and swing KB between legs",
            "Drive hips forward, pull KB to chin",
            "Keep elbows high, lower with control"
        ],
        "mistakes": [
            "Using arms instead of hip drive",
            "Letting KB pull you forward"
        ]
    },
    {
        "name": "KB Pull Press",
        "aliases": ["Kettlebell Pull Press", "KB Clean and Press"],
        "equipment": ["Kettlebell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/6bhp0o0e_KB%20pull%20press.mov",
        "cues": [
            "Clean KB to rack position",
            "Press overhead with tight core",
            "Lower to rack, then swing back down"
        ],
        "mistakes": [
            "Pressing before full rack position",
            "Leaning back excessively on press"
        ]
    },
    {
        "name": "Landmine Hack Squat Jump",
        "aliases": ["Landmine Jump Squat", "Explosive Hack Squat"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/fml1w1yi_Landmine%20hack%20squat%20jump.mov",
        "cues": [
            "Hold barbell end at chest, feet shoulder width",
            "Squat down then explode upward",
            "Land soft, immediately descend into next rep"
        ],
        "mistakes": [
            "Landing with locked knees",
            "Not reaching full squat depth"
        ]
    },
    {
        "name": "Landmine Hack Squat",
        "aliases": ["Landmine Squat", "Barbell Landmine Squat"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/1aiaiunc_Landmine%20hack%20squat.mov",
        "cues": [
            "Hold barbell end at chest height",
            "Squat down keeping torso upright",
            "Drive through heels to stand"
        ],
        "mistakes": [
            "Letting torso fall forward",
            "Rising on toes during squat"
        ]
    },
    {
        "name": "Landmine Lateral Lunge",
        "aliases": ["Landmine Side Lunge", "Barbell Lateral Lunge"],
        "equipment": ["Landmine", "Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/9ov38k6l_Landmine%20lateral%20lunge.mov",
        "cues": [
            "Hold barbell end, step wide to side",
            "Bend stepping leg, keep other straight",
            "Push off to return to center"
        ],
        "mistakes": [
            "Knee caving inward on lunge",
            "Not stepping wide enough"
        ]
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Adding 5 new exercises to {DB_NAME}...")
    
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
