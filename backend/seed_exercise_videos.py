"""
Seed exercise videos to the media library
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'fitness_app')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# New exercise videos to add
NEW_EXERCISES = [
    {
        "name": "Power Clean",
        "aliases": ["clean", "olympic clean", "power clean from floor"],
        "equipment": ["barbell"],
        "thumbnail_url": "",  # Will auto-generate from video
        "video_url": "https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/shl7f1he_Power%20clean%20.mov",
        "cues": [
            "Start with feet hip-width apart, barbell over mid-foot",
            "Keep back flat, chest up as you grip the bar",
            "Drive through heels, explosively extend hips",
            "Shrug shoulders and pull elbows high",
            "Catch bar on front shoulders in quarter squat"
        ],
        "mistakes": [
            "Pulling with arms too early",
            "Not fully extending hips before the pull",
            "Catching with elbows pointing down",
            "Letting the bar drift forward away from body"
        ]
    },
    {
        "name": "Barbell RDL",
        "aliases": ["romanian deadlift", "rdl", "stiff leg deadlift", "barbell romanian deadlift"],
        "equipment": ["barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/qrrkkj98_Barbell%20RDL%20.mov",
        "cues": [
            "Stand tall with barbell at hip level",
            "Keep slight bend in knees throughout",
            "Push hips back while lowering the bar",
            "Keep bar close to legs the entire movement",
            "Feel the stretch in hamstrings, then drive hips forward to stand"
        ],
        "mistakes": [
            "Rounding the lower back",
            "Bending knees too much (turning it into a squat)",
            "Letting the bar drift away from the body",
            "Not hinging at the hips enough"
        ]
    },
    {
        "name": "Barbell Good Mornings",
        "aliases": ["good morning", "good mornings", "barbell good morning"],
        "equipment": ["barbell"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/ivrojdy4_Barbell%20goodmornings%20.mov",
        "cues": [
            "Position barbell on upper back like a squat",
            "Stand with feet shoulder-width apart",
            "Push hips back and bow forward at the waist",
            "Keep back flat and core braced",
            "Lower until torso is nearly parallel to floor, then return"
        ],
        "mistakes": [
            "Using too much weight before mastering form",
            "Rounding the back during the movement",
            "Bending knees excessively",
            "Looking up instead of keeping neutral neck"
        ]
    },
    {
        "name": "Wide Grip Assisted Pull-Up",
        "aliases": ["assisted pull-up", "wide grip pull-up", "lat pull-up", "assisted wide pull-up"],
        "equipment": ["pull-up bar", "resistance band", "assisted pull-up machine"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/pexkk7jt_Wide%20grip%20assisted%20pull-up.mov",
        "cues": [
            "Grip bar wider than shoulder width",
            "Engage lats by pulling shoulders down",
            "Pull chest toward the bar",
            "Squeeze at the top, focus on lat contraction",
            "Lower with control, fully extend arms"
        ],
        "mistakes": [
            "Using too much momentum/swinging",
            "Not fully extending arms at the bottom",
            "Shrugging shoulders instead of engaging lats",
            "Half-repping - not pulling high enough"
        ]
    },
    {
        "name": "Barbell Back Squat",
        "aliases": ["back squat", "squat", "barbell squat", "bb squat"],
        "equipment": ["barbell", "squat rack"],
        "thumbnail_url": "",
        "video_url": "https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/tlaztx9h_Barbell%20back%20squat%20.mov",
        "cues": [
            "Position bar on upper traps, not neck",
            "Feet shoulder-width apart, toes slightly out",
            "Brace core and descend by breaking at hips and knees",
            "Keep knees tracking over toes",
            "Drive through full foot to stand"
        ],
        "mistakes": [
            "Knees caving inward",
            "Rising on toes instead of driving through heels",
            "Forward lean/good morning the squat",
            "Not hitting proper depth (hip crease below knee)"
        ]
    }
]

async def seed_exercises():
    print("Adding new exercises to media library...")
    
    added_count = 0
    skipped_count = 0
    
    for exercise in NEW_EXERCISES:
        # Check if exercise already exists by name
        existing = await db.exercises.find_one({"name": exercise["name"]})
        
        if existing:
            print(f"  Skipping '{exercise['name']}' - already exists")
            skipped_count += 1
            continue
        
        # Add created timestamp
        exercise["created_at"] = datetime.now(timezone.utc)
        
        # Insert the exercise
        result = await db.exercises.insert_one(exercise)
        print(f"  Added '{exercise['name']}' with ID: {result.inserted_id}")
        added_count += 1
    
    print(f"\nCompleted!")
    print(f"  Added: {added_count}")
    print(f"  Skipped (already exist): {skipped_count}")
    
    # Show total count
    total = await db.exercises.count_documents({})
    print(f"  Total exercises in library: {total}")

if __name__ == "__main__":
    asyncio.run(seed_exercises())
    client.close()
