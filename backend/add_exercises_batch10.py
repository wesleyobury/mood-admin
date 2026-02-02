#!/usr/bin/env python3
"""Add 5 more exercise videos to the video library - Batch 10."""

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
        "name": "Plyo Box Jump",
        "aliases": ["Box Jump", "Plyometric Box Jump", "Jump to Box"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/48qr5yfq_Plyo%20box%20jump.mov",
        "cues": [
            "Stand facing box, swing arms back",
            "Explode up, drive knees high",
            "Land softly on box, stand tall"
        ],
        "mistakes": [
            "Not using arm swing for power",
            "Landing too hard on the box"
        ]
    },
    {
        "name": "Plyo Box Pulse Jumps",
        "aliases": ["Box Pulse Jumps", "Rapid Box Jumps", "Quick Box Hops"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/oz7kyif8_Plyo%20box%20pulse%20jumps.mov",
        "cues": [
            "Start on box, drop and immediately rebound",
            "Minimize ground contact time",
            "Keep jumps quick and rhythmic"
        ],
        "mistakes": [
            "Spending too long on the ground",
            "Losing rhythm between reps"
        ]
    },
    {
        "name": "Plyo Box Step Up Pops",
        "aliases": ["Box Step Up Pops", "Explosive Step Ups", "Step Up Jumps"],
        "equipment": ["Plyo Box"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/6x5zjy9h_Plyo%20box%20step%20up%20pops.mov",
        "cues": [
            "Place one foot on box, drive up explosively",
            "Pop off the box at the top",
            "Land softly and alternate legs"
        ],
        "mistakes": [
            "Not driving through the front heel",
            "Landing with stiff legs"
        ]
    },
    {
        "name": "Quad Extension",
        "aliases": ["Leg Extension", "Seated Leg Extension", "Machine Quad Extension"],
        "equipment": ["Machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/xqhw2pbw_Quad%20extension.mov",
        "cues": [
            "Sit with back against pad, ankles under roller",
            "Extend legs fully, squeeze quads at top",
            "Lower with control, don't let weight slam"
        ],
        "mistakes": [
            "Using momentum to swing weight",
            "Not fully extending at the top"
        ]
    },
    {
        "name": "Side Plank",
        "aliases": ["Lateral Plank", "Side Bridge", "Oblique Plank"],
        "equipment": ["Bodyweight"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/v6394ecd_Side%20plank.mov",
        "cues": [
            "Stack feet, prop on forearm, hips off ground",
            "Keep body in straight line from head to feet",
            "Hold position, engage obliques throughout"
        ],
        "mistakes": [
            "Letting hips sag toward ground",
            "Not stacking shoulders over elbow"
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
