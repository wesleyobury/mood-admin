#!/usr/bin/env python3
"""Clean up duplicates and add 2 new exercises - Batch 8."""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

# New exercises to add
NEW_EXERCISES = [
    {
        "name": "Dumbbell Shoulder Press",
        "aliases": ["DB Shoulder Press", "Seated DB Press", "Dumbbell Overhead Press"],
        "equipment": ["Dumbbells"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/e66yc5tr_DB%20shoulder%20press.mov",
        "cues": [
            "Sit with dumbbells at shoulder height",
            "Press straight up, bringing weights together",
            "Lower with control to starting position"
        ],
        "mistakes": [
            "Arching back excessively",
            "Not fully extending arms at the top"
        ]
    },
    {
        "name": "Barbell Incline Bench Press",
        "aliases": ["BB Incline Bench", "Incline Bench Press", "Incline Barbell Press"],
        "equipment": ["Barbell", "Incline Bench"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/o2194eqp_BB%20incline%20bench.mov",
        "cues": [
            "Set bench to 30-45 degrees, grip slightly wide",
            "Lower bar to upper chest with control",
            "Press up to lockout, keeping shoulder blades tight"
        ],
        "mistakes": [
            "Setting bench angle too steep",
            "Bouncing bar off chest"
        ]
    }
]

# Duplicates to remove (keep only the main one)
DUPLICATES_TO_REMOVE = [
    "Flat Bench Press",  # Keep "Barbell Flat Bench Press" with the BB flat bench video
    "Barbell Flat Bench Press"  # Will update this one with correct video
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("=" * 50)
    print("CLEANUP: Removing duplicate exercises...")
    print("=" * 50)
    
    # Remove duplicates
    for name in DUPLICATES_TO_REMOVE:
        result = await db.exercises.delete_one({'name': name})
        if result.deleted_count > 0:
            print(f"✗ Deleted: {name}")
        else:
            print(f"  Not found: {name}")
    
    # Check for Dumbbell Squat Press duplicates
    squat_press_docs = await db.exercises.find({
        'name': {'$regex': 'Dumbbell Squat Press|DB Squat Press', '$options': 'i'}
    }).to_list(length=10)
    
    print(f"\nFound {len(squat_press_docs)} Dumbbell Squat Press entries")
    
    # Keep only one with the correct 4-second video URL
    correct_video_url = "https://customer-assets.emergentagent.com/job_chestworkoutfix/artifacts/tysldqr4_DB%20squat%20press.mov"
    
    if len(squat_press_docs) > 1:
        # Delete all and re-insert correct one
        await db.exercises.delete_many({
            'name': {'$regex': 'Dumbbell Squat Press', '$options': 'i'}
        })
        print("✗ Deleted duplicate Dumbbell Squat Press entries")
        
        # Re-insert the correct one
        await db.exercises.insert_one({
            "name": "Dumbbell Squat Press",
            "aliases": ["DB Squat Press", "Dumbbell Thruster", "DB Thruster"],
            "equipment": ["Dumbbells"],
            "thumbnail_url": "",
            "video_url": correct_video_url,
            "cues": [
                "Hold dumbbells at shoulders, squat deep",
                "Drive up explosively through heels",
                "Press overhead at the top, lower and repeat"
            ],
            "mistakes": [
                "Pressing before fully standing",
                "Not squatting deep enough"
            ],
            "created_at": datetime.now(timezone.utc)
        })
        print("✓ Re-inserted: Dumbbell Squat Press (with 4-sec video)")
    elif len(squat_press_docs) == 1:
        # Update the existing one to use correct video
        await db.exercises.update_one(
            {'_id': squat_press_docs[0]['_id']},
            {'$set': {'video_url': correct_video_url}}
        )
        print("✓ Updated: Dumbbell Squat Press video URL")
    
    print("\n" + "=" * 50)
    print("ADDING: 2 new exercises...")
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
    
    print("\n" + "=" * 50)
    print(f"Added: {added}, Updated: {updated}")
    
    total = await db.exercises.count_documents({})
    print(f"Total exercises in library: {total}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
