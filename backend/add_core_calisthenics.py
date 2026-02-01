#!/usr/bin/env python3
"""Add 5 new core and calisthenics exercise videos."""

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
        "name": "Hollow Holds",
        "aliases": ["Hollow Body Hold", "Hollow Rock Position", "Gymnast Hollow"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/rk4wimu2_Hollow%20holds.mov",
        "cues": [
            "Lie flat, press lower back into floor",
            "Lift arms and legs off ground",
            "Hold position with core engaged"
        ],
        "mistakes": [
            "Lower back lifting off floor",
            "Holding breath instead of breathing"
        ]
    },
    {
        "name": "Kneeling Ab Wheel",
        "aliases": ["Ab Wheel Rollout", "Kneeling Rollout", "Ab Roller"],
        "equipment": ["Ab Wheel"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/j21vjpqh_Kneeling%20ab%20wheel.mov",
        "cues": [
            "Kneel with wheel in front, arms straight",
            "Roll out slowly with tight core",
            "Pull back using abs, not arms"
        ],
        "mistakes": [
            "Letting hips sag toward floor",
            "Going too far and losing control"
        ]
    },
    {
        "name": "Muscle Ups",
        "aliases": ["Bar Muscle Up", "Pull Up to Dip"],
        "equipment": ["Pull Up Bar"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/1hfmnqr3_Muscle%20ups.mov",
        "cues": [
            "Pull explosively, chest to bar",
            "Transition over bar quickly",
            "Press out to full lockout"
        ],
        "mistakes": [
            "Not pulling high enough",
            "Slow transition over the bar"
        ]
    },
    {
        "name": "Parallette L-Sit",
        "aliases": ["L-Sit on Parallettes", "Floor L-Sit", "Parallette Hold"],
        "equipment": ["Parallettes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/mku1xfq5_Parallette%20L%20sit.mov",
        "cues": [
            "Grip parallettes, press body up",
            "Lift legs to parallel, toes pointed",
            "Keep shoulders down, core tight"
        ],
        "mistakes": [
            "Bending knees to hold position",
            "Shoulders shrugging up to ears"
        ]
    },
    {
        "name": "Parallette Pike Press",
        "aliases": ["Pike Push Up", "Parallette Pike Push Up", "Pike Press"],
        "equipment": ["Parallettes"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/2sl9g5a8_Parallette%20pike%20press.mov",
        "cues": [
            "Pike position with hands on parallettes",
            "Lower head between hands",
            "Press back up to pike position"
        ],
        "mistakes": [
            "Flaring elbows out wide",
            "Not reaching full depth"
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
