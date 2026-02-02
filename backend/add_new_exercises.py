#!/usr/bin/env python3
"""Add 5 new exercise videos to the video library."""

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
        "name": "Barbell Push Press",
        "aliases": ["BB Push Press", "Push Press", "Overhead Push Press"],
        "equipment": ["Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/uckume4l_BB%20push%20press.mov",
        "cues": [
            "Start with bar in front rack position",
            "Dip knees slightly, then explode upward",
            "Press bar overhead using leg drive",
            "Lock out arms fully at the top"
        ],
        "mistakes": [
            "Not using enough leg drive",
            "Pressing too early before hip extension",
            "Letting the bar drift forward"
        ]
    },
    {
        "name": "Barbell Snatch",
        "aliases": ["BB Snatch", "Power Snatch", "Olympic Snatch"],
        "equipment": ["Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/61h6jl5b_BB%20snatch.mov",
        "cues": [
            "Wide grip, shoulders over bar",
            "Explosive hip extension and pull",
            "Drop under bar quickly",
            "Catch with locked arms overhead"
        ],
        "mistakes": [
            "Pulling with arms too early",
            "Not extending hips fully before pulling under",
            "Bar swinging away from body"
        ]
    },
    {
        "name": "Barbell Split Jerk",
        "aliases": ["BB Split Jerk", "Split Jerk", "Jerk"],
        "equipment": ["Barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/oqbsaek2_BB%20split%20jerk.mov",
        "cues": [
            "Bar in front rack position",
            "Dip and drive explosively",
            "Split feet front and back as you press",
            "Lock out overhead, then recover feet"
        ],
        "mistakes": [
            "Not dipping straight down",
            "Pressing before the drive phase",
            "Front knee collapsing inward"
        ]
    },
    {
        "name": "Calf Raise",
        "aliases": ["Standing Calf Raise", "Heel Raise", "Calf Press"],
        "equipment": ["Bodyweight", "Dumbbells", "Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/4yfmpoli_Calf%20raise.mov",
        "cues": [
            "Stand tall on balls of feet",
            "Rise up as high as possible",
            "Pause at the top, squeeze calves",
            "Lower slowly with control"
        ],
        "mistakes": [
            "Bouncing at the bottom",
            "Not achieving full range of motion",
            "Leaning forward during the movement"
        ]
    },
    {
        "name": "Dumbbell Hang Clean",
        "aliases": ["DB Hang Clean", "Dumbbell Clean", "DB Clean from Hang"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/rcjdq18o_DB%20hang%20clean.mov",
        "cues": [
            "Start with dumbbells at hip height",
            "Explode hips and shrug shoulders",
            "Pull under and catch in front rack",
            "Stand up tall to complete rep"
        ],
        "mistakes": [
            "Using arms to curl the weight",
            "Not extending hips fully",
            "Catching with elbows too low"
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
