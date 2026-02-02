#!/usr/bin/env python3
"""Fix all exercises to have exactly 3 cues and 2 mistakes."""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'test_database')

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print("=" * 60)
    print("FIXING ALL EXERCISES TO HAVE 3 CUES AND 2 MISTAKES")
    print("=" * 60)
    
    # Find all exercises
    exercises = await db.exercises.find({}).to_list(length=500)
    
    fixed_count = 0
    
    for ex in exercises:
        cues = ex.get('cues', [])
        mistakes = ex.get('mistakes', [])
        
        needs_fix = False
        
        # Trim or pad cues to exactly 3
        if len(cues) > 3:
            cues = cues[:3]
            needs_fix = True
        elif len(cues) < 3:
            # Pad with generic cues if needed
            while len(cues) < 3:
                cues.append("Maintain proper form throughout")
            needs_fix = True
        
        # Trim or pad mistakes to exactly 2
        if len(mistakes) > 2:
            mistakes = mistakes[:2]
            needs_fix = True
        elif len(mistakes) < 2:
            # Pad with generic mistakes if needed
            while len(mistakes) < 2:
                mistakes.append("Using improper form")
            needs_fix = True
        
        if needs_fix:
            await db.exercises.update_one(
                {'_id': ex['_id']},
                {'$set': {
                    'cues': cues,
                    'mistakes': mistakes,
                    'updated_at': datetime.now(timezone.utc)
                }}
            )
            print(f"✓ Fixed: {ex['name']}")
            fixed_count += 1
    
    print("\n" + "=" * 60)
    print(f"Total fixed: {fixed_count}")
    print("=" * 60)
    
    # Verify
    print("\nVERIFYING...")
    non_compliant = 0
    exercises = await db.exercises.find({}).to_list(length=500)
    for ex in exercises:
        if len(ex.get('cues', [])) != 3 or len(ex.get('mistakes', [])) != 2:
            non_compliant += 1
            print(f"❌ Still non-compliant: {ex['name']}")
    
    if non_compliant == 0:
        print("✅ All exercises now comply with guidelines!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
