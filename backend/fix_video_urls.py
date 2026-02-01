#!/usr/bin/env python3
"""
Fix the remaining exercise video URLs in the database.
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

# The rotated video URLs from Cloudinary that weren't updated
UPDATES = [
    ('Barbell Front Squat', 'https://res.cloudinary.com/dfsygar5c/video/upload/v1769962599/exercise_library/barbell_front_squat.mp4'),
    ('Barbell Hip Thrust', 'https://res.cloudinary.com/dfsygar5c/video/upload/v1769962672/exercise_library/barbell_hip_thrust.mp4'),
    ('Barbell Sumo Deadlift', 'https://res.cloudinary.com/dfsygar5c/video/upload/v1769962765/exercise_library/barbell_sumo_deadlift.mp4'),
    ('Cable Face Pull', 'https://res.cloudinary.com/dfsygar5c/video/upload/v1769962801/exercise_library/cable_face_pull.mp4'),
    ('Cable Glute Kickback', 'https://res.cloudinary.com/dfsygar5c/video/upload/v1769962893/exercise_library/cable_glute_kickback.mp4'),
]

async def fix_urls():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Connected to {DB_NAME}")
    
    for name, url in UPDATES:
        result = await db.exercises.update_one(
            {'name': name},
            {'$set': {'video_url': url}}
        )
        if result.modified_count > 0:
            print(f'✓ Updated: {name}')
        else:
            print(f'✗ Not found: {name}')
    
    print("\nVerifying all exercises with videos:")
    exercises = await db.exercises.find({'video_url': {'$regex': 'cloudinary'}}).to_list(100)
    for ex in exercises:
        print(f"  - {ex.get('name')}: {ex.get('video_url', '')[:60]}...")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_urls())
