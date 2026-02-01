#!/usr/bin/env python3
"""
Script to seed exercise videos into the database for the "Find Visuals" feature.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mood_app")

# Exercise video data to seed
EXERCISES = [
    # Barbell Exercises
    {
        "name": "Barbell Deadlift",
        "aliases": ["Deadlift", "BB Deadlift", "Conventional Deadlift"],
        "equipment": ["Barbell"],
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/x2wxwvpl_download%20%282%29.png",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/kzlwio26_BB%20deadlift.mov",
        "cues": [
            "Stand with feet hip-width apart",
            "Hinge at hips, grip bar outside knees",
            "Keep back flat, chest up",
            "Drive through heels, extend hips and knees together",
            "Lock out at top, squeeze glutes"
        ],
        "mistakes": [
            "Rounding the lower back",
            "Letting bar drift away from body",
            "Hyperextending at the top"
        ]
    },
    {
        "name": "Barbell Front Squat",
        "aliases": ["Front Squat", "BB Front Squat"],
        "equipment": ["Barbell", "Squat Rack"],
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_workout-media-fix/artifacts/wag3ztrn_bbfs.jpg",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wxe55iww_BB%20front%20squat.mov",
        "cues": [
            "Rest bar on front delts, elbows high",
            "Keep torso upright throughout",
            "Descend by breaking at hips and knees",
            "Go to parallel or below",
            "Drive up through midfoot"
        ],
        "mistakes": [
            "Dropping elbows forward",
            "Leaning forward excessively",
            "Not hitting proper depth"
        ]
    },
    {
        "name": "Barbell Hip Thrust",
        "aliases": ["Hip Thrust", "BB Hip Thrust", "Glute Bridge"],
        "equipment": ["Barbell", "Bench"],
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/odvl0o6h_ht.webp",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/j7wijuu5_BB%20hip%20thrust.mov",
        "cues": [
            "Upper back against bench, feet flat on floor",
            "Bar positioned over hips with pad",
            "Drive hips up by squeezing glutes",
            "Hold at top for a count",
            "Lower with control"
        ],
        "mistakes": [
            "Overarching lower back",
            "Pushing through toes instead of heels",
            "Not achieving full hip extension"
        ]
    },
    {
        "name": "Barbell Lunge",
        "aliases": ["BB Lunge", "Barbell Walking Lunge", "Reverse Lunge"],
        "equipment": ["Barbell"],
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_workout-visuals-1/artifacts/a96gl1sh_download%20%287%29.png",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/jv2445o7_BB%20lunge.mov",
        "cues": [
            "Bar on upper back, core braced",
            "Step back into lunge position",
            "Front knee tracks over toes",
            "Lower until back knee nearly touches floor",
            "Drive through front heel to stand"
        ],
        "mistakes": [
            "Knee caving inward",
            "Leaning forward excessively",
            "Taking too short a step"
        ]
    },
    {
        "name": "Barbell Sumo Deadlift",
        "aliases": ["Sumo Deadlift", "BB Sumo Deadlift", "Wide Stance Deadlift"],
        "equipment": ["Barbell"],
        "thumbnail_url": "https://customer-assets.emergentagent.com/job_85724e25-1f59-4628-b049-647d06432207/artifacts/46ki5rsl_download%20%2815%29.png",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wwxkoqjg_BB%20sumo%20deadlift.mov",
        "cues": [
            "Wide stance, toes pointed out 45 degrees",
            "Grip bar inside knees",
            "Push knees out over toes",
            "Drive hips forward to lockout",
            "Keep chest up throughout"
        ],
        "mistakes": [
            "Knees caving inward",
            "Hips shooting up too fast",
            "Not opening hips enough"
        ]
    },
    # Cable Exercises
    {
        "name": "Cable Face Pull",
        "aliases": ["Face Pull", "Rope Face Pull"],
        "equipment": ["Cable Machine", "Rope Attachment"],
        "thumbnail_url": "https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/5yzqau2v_Cable%20face%20pull.mov",
        "cues": [
            "Set cable at face height",
            "Grip rope with thumbs toward you",
            "Pull toward face, spreading rope apart",
            "Externally rotate shoulders at end",
            "Squeeze rear delts, hold briefly"
        ],
        "mistakes": [
            "Using too much weight",
            "Not pulling high enough",
            "No external rotation at end"
        ]
    },
    {
        "name": "Cable Glute Kickback",
        "aliases": ["Glute Kickback", "Cable Kickback", "Donkey Kick"],
        "equipment": ["Cable Machine", "Ankle Strap"],
        "thumbnail_url": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/3eaq9i4y_Cable%20Glute%20Kickback.mov",
        "cues": [
            "Attach ankle strap to low cable",
            "Hold machine for support",
            "Kick leg straight back",
            "Squeeze glute at top",
            "Lower with control"
        ],
        "mistakes": [
            "Arching lower back",
            "Swinging leg instead of controlled motion",
            "Not fully extending hip"
        ]
    },
    {
        "name": "Cable Lat Pullover",
        "aliases": ["Lat Pullover", "Straight Arm Pulldown", "Cable Pullover"],
        "equipment": ["Cable Machine", "Straight Bar"],
        "thumbnail_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7bwkj61d_Cable%20lat%20pullover.mov",
        "cues": [
            "Stand facing high cable",
            "Grip bar with straight arms",
            "Slight forward lean, core engaged",
            "Pull bar down to thighs in arc",
            "Squeeze lats at bottom"
        ],
        "mistakes": [
            "Bending elbows too much",
            "Using momentum",
            "Not engaging lats, using arms"
        ]
    },
    {
        "name": "Cable Overhead Tricep Extension",
        "aliases": ["Overhead Tricep Extension", "Cable Tricep Extension", "Rope Overhead Extension"],
        "equipment": ["Cable Machine", "Rope Attachment"],
        "thumbnail_url": "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7335p7s8_Cable%20overhead%20tricep%20extension.mov",
        "cues": [
            "Face away from low cable",
            "Hold rope overhead, elbows bent",
            "Extend arms forward",
            "Keep upper arms stationary",
            "Squeeze triceps at full extension"
        ],
        "mistakes": [
            "Moving elbows during extension",
            "Arching back excessively",
            "Not achieving full lockout"
        ]
    },
    {
        "name": "Cable Rope Curl",
        "aliases": ["Rope Curl", "Cable Bicep Curl", "Hammer Rope Curl"],
        "equipment": ["Cable Machine", "Rope Attachment"],
        "thumbnail_url": "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/ng6d8jlv_Cable%20rope%20curl.mov",
        "cues": [
            "Grip rope with neutral grip",
            "Keep elbows pinned at sides",
            "Curl rope up toward shoulders",
            "Spread rope apart at top",
            "Lower with control"
        ],
        "mistakes": [
            "Swinging body for momentum",
            "Moving elbows forward",
            "Not controlling the negative"
        ]
    }
]

async def seed_exercises():
    """Seed exercises into the database."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.mood_app
    
    print(f"Connected to MongoDB: {MONGO_URL}")
    print(f"Seeding {len(EXERCISES)} exercises...")
    
    inserted_count = 0
    updated_count = 0
    
    for exercise in EXERCISES:
        # Check if exercise already exists by name
        existing = await db.exercises.find_one({"name": exercise["name"]})
        
        if existing:
            # Update with new video_url if different
            if existing.get("video_url") != exercise["video_url"]:
                await db.exercises.update_one(
                    {"_id": existing["_id"]},
                    {"$set": {
                        "video_url": exercise["video_url"],
                        "thumbnail_url": exercise.get("thumbnail_url", existing.get("thumbnail_url")),
                        "aliases": exercise.get("aliases", existing.get("aliases", [])),
                        "cues": exercise.get("cues", existing.get("cues", [])),
                        "mistakes": exercise.get("mistakes", existing.get("mistakes", [])),
                        "updated_at": datetime.now(timezone.utc)
                    }}
                )
                print(f"  ✓ Updated: {exercise['name']}")
                updated_count += 1
            else:
                print(f"  - Skipped (already exists): {exercise['name']}")
        else:
            # Insert new exercise
            exercise_doc = {
                **exercise,
                "created_at": datetime.now(timezone.utc)
            }
            await db.exercises.insert_one(exercise_doc)
            print(f"  ✓ Inserted: {exercise['name']}")
            inserted_count += 1
    
    print(f"\nDone! Inserted: {inserted_count}, Updated: {updated_count}")
    
    # Show total count
    total = await db.exercises.count_documents({})
    print(f"Total exercises in database: {total}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_exercises())
