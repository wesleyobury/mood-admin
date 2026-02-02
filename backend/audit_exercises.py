#!/usr/bin/env python3
"""Audit and fix all exercises to have exactly 3 cues and 2 mistakes."""

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
    print("AUDITING ALL EXERCISES FOR GUIDELINE COMPLIANCE")
    print("Guidelines: 3 cues, 2 mistakes")
    print("=" * 60)
    
    # Find all exercises
    exercises = await db.exercises.find({}).to_list(length=500)
    
    non_compliant = []
    
    for ex in exercises:
        cues_count = len(ex.get('cues', []))
        mistakes_count = len(ex.get('mistakes', []))
        
        if cues_count != 3 or mistakes_count != 2:
            non_compliant.append({
                'id': ex['_id'],
                'name': ex['name'],
                'cues': ex.get('cues', []),
                'cues_count': cues_count,
                'mistakes': ex.get('mistakes', []),
                'mistakes_count': mistakes_count
            })
    
    print(f"\nTotal exercises: {len(exercises)}")
    print(f"Non-compliant: {len(non_compliant)}")
    print("\n" + "=" * 60)
    
    if non_compliant:
        print("\nNON-COMPLIANT EXERCISES:\n")
        for ex in non_compliant:
            print(f"❌ {ex['name']}")
            print(f"   Cues: {ex['cues_count']} (need 3)")
            print(f"   Mistakes: {ex['mistakes_count']} (need 2)")
            print()
    
    client.close()
    return non_compliant

if __name__ == "__main__":
    asyncio.run(main())
