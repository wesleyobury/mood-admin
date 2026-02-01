#!/usr/bin/env python3
"""Add 5 new bodyweight/calisthenics exercise videos."""

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
        "name": "Chin Ups",
        "aliases": ["Chin Up", "Underhand Pull Up", "Supinated Pull Up"],
        "equipment": ["Pull Up Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/5zlwscvh_Chin%20ups.mov",
        "cues": [
            "Grip bar underhand, shoulder width apart",
            "Pull chest to bar, squeeze biceps",
            "Lower with control to full hang"
        ],
        "mistakes": [
            "Not reaching full range of motion",
            "Kipping or swinging excessively"
        ]
    },
    {
        "name": "Dip Bar L-Sit",
        "aliases": ["L-Sit", "Parallel Bar L-Sit", "L-Sit Hold"],
        "equipment": ["Dip Bars", "Parallel Bars"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/71errs65_Dip%20bar%20L%20sit.mov",
        "cues": [
            "Grip bars, press body up with straight arms",
            "Lift legs parallel to floor, toes pointed",
            "Hold with core tight, shoulders down"
        ],
        "mistakes": [
            "Bending knees to cheat position",
            "Letting shoulders shrug up"
        ]
    },
    {
        "name": "Dips",
        "aliases": ["Parallel Bar Dips", "Tricep Dips", "Chest Dips"],
        "equipment": ["Dip Bars", "Parallel Bars"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wd5v6ssq_Dips.mov",
        "cues": [
            "Grip bars, start with arms locked out",
            "Lower until upper arms parallel to floor",
            "Press back up to full lockout"
        ],
        "mistakes": [
            "Going too deep and straining shoulders",
            "Flaring elbows out wide"
        ]
    },
    {
        "name": "Hanging Knee Raise",
        "aliases": ["Knee Raise", "Hanging Knee Tuck", "Knee Ups"],
        "equipment": ["Pull Up Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/xzyxpluy_Hanging%20knee%20raise.mov",
        "cues": [
            "Hang from bar with arms straight",
            "Raise knees toward chest with control",
            "Lower slowly, avoid swinging"
        ],
        "mistakes": [
            "Using momentum to swing legs up",
            "Not engaging core throughout"
        ]
    },
    {
        "name": "Hanging Toe Touch",
        "aliases": ["Toes to Bar", "Hanging Leg Raise", "T2B"],
        "equipment": ["Pull Up Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/3a7pzy3v_Hanging%20toe%20touch.mov",
        "cues": [
            "Hang from bar, engage lats and core",
            "Raise straight legs to touch bar",
            "Lower with control to full hang"
        ],
        "mistakes": [
            "Kipping too much to get up",
            "Bending knees on the way up"
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
