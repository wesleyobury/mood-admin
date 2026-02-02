#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 4."""

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
        "name": "Slam Ball Slams",
        "aliases": ["Medicine Ball Slams", "Ball Slams", "Med Ball Slams", "Overhead Slams"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/dhzukc4b_Slam%20ball%20slams.mov",
        "cues": [
            "Raise ball overhead with extended arms",
            "Slam ball down with full force",
            "Engage core and hips on the way down",
            "Catch ball on bounce and repeat"
        ],
        "mistakes": [
            "Not using full hip extension",
            "Bending arms too early",
            "Not following through to the ground"
        ]
    },
    {
        "name": "Slam Ball Squat Press",
        "aliases": ["Medicine Ball Squat Press", "Ball Thruster", "Med Ball Squat to Press"],
        "equipment": ["Slam Ball", "Medicine Ball"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/zq1rinkt_Slam%20ball%20squat%20press.mov",
        "cues": [
            "Hold ball at chest, squat down",
            "Drive up through heels",
            "Press ball overhead at the top",
            "Lower ball and descend into next squat"
        ],
        "mistakes": [
            "Not squatting deep enough",
            "Pressing before fully standing",
            "Letting knees cave inward"
        ]
    },
    {
        "name": "Sled Drag",
        "aliases": ["Backward Sled Drag", "Sled Pull", "Reverse Sled Drag"],
        "equipment": ["Sled"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/d9s4uxme_Sled%20drag.mov",
        "cues": [
            "Face the sled, grip handles or straps",
            "Stay low with bent knees",
            "Walk backward with controlled steps",
            "Keep tension on the sled throughout"
        ],
        "mistakes": [
            "Standing too upright",
            "Taking steps that are too large",
            "Losing grip tension"
        ]
    },
    {
        "name": "Split Squat Jump",
        "aliases": ["Jumping Lunges", "Lunge Jumps", "Alternating Lunge Jumps", "Plyometric Lunges"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/e4pgxfcg_Split%20squat%20jump.mov",
        "cues": [
            "Start in lunge position",
            "Explode upward, switching legs mid-air",
            "Land softly in opposite lunge",
            "Immediately jump into next rep"
        ],
        "mistakes": [
            "Not getting enough height",
            "Landing with stiff legs",
            "Letting front knee collapse inward"
        ]
    },
    {
        "name": "Squat Pop Stick",
        "aliases": ["Squat Jump Stick", "Squat Pop", "Explosive Squat Hold"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/z1k9rtrc_Squat%20pop%20stick.mov",
        "cues": [
            "Start in squat position",
            "Explode upward with power",
            "Land and immediately stick the landing",
            "Hold briefly, then repeat"
        ],
        "mistakes": [
            "Not sticking the landing",
            "Losing balance on landing",
            "Not fully extending hips on jump"
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
