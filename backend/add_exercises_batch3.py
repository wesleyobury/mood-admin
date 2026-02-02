#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 3."""

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
        "name": "Skater Bounds",
        "aliases": ["Skater Jumps", "Lateral Bounds", "Side to Side Jumps", "Skaters"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/qm8cz7md_Skater%20bounds.mov",
        "cues": [
            "Push off one leg, leap laterally",
            "Land softly on opposite foot",
            "Swing arms for momentum",
            "Immediately bound to other side"
        ],
        "mistakes": [
            "Landing with stiff legs",
            "Not driving arms for power",
            "Cutting the range of motion short"
        ]
    },
    {
        "name": "Slam Ball Chest Pass",
        "aliases": ["Medicine Ball Chest Pass", "Med Ball Chest Throw", "Wall Ball Chest Pass"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/eosdhh4o_Slam%20ball%20chest%20pass.mov",
        "cues": [
            "Hold ball at chest level",
            "Step forward and extend arms explosively",
            "Push through chest and triceps",
            "Catch and repeat with rhythm"
        ],
        "mistakes": [
            "Not using legs for power",
            "Throwing from too high or low",
            "Losing core engagement"
        ]
    },
    {
        "name": "Slam Ball Heave",
        "aliases": ["Medicine Ball Heave", "Backward Ball Throw", "Ball Heave Toss"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/59h442nb_Slam%20ball%20heave.mov",
        "cues": [
            "Hold ball low, hinge at hips",
            "Extend hips and swing ball up",
            "Release at peak extension",
            "Follow through with full body"
        ],
        "mistakes": [
            "Using only arms instead of hips",
            "Releasing too early or late",
            "Not following through completely"
        ]
    },
    {
        "name": "Slam Ball Overhead Toss",
        "aliases": ["Medicine Ball Overhead Throw", "Overhead Ball Toss", "Backward Overhead Throw"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/jgk6ev4w_Slam%20ball%20overhead%20toss.mov",
        "cues": [
            "Start with ball overhead",
            "Extend through hips and core",
            "Release ball behind you",
            "Drive power from legs up"
        ],
        "mistakes": [
            "Not using full hip extension",
            "Releasing too early",
            "Arching lower back excessively"
        ]
    },
    {
        "name": "Slam Ball Rotational Throw",
        "aliases": ["Medicine Ball Rotational Throw", "Rotational Ball Toss", "Med Ball Side Throw", "Torso Rotation Throw"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/v3imqlsh_Slam%20ball%20rotational%20throw.mov",
        "cues": [
            "Start with ball at hip, rotate away",
            "Drive rotation from hips and core",
            "Release ball explosively toward wall",
            "Follow through with rotation"
        ],
        "mistakes": [
            "Rotating only with arms",
            "Not pivoting on back foot",
            "Losing core stability during throw"
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
