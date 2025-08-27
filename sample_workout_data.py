#!/usr/bin/env python3
"""
Sample workout data for MOOD app - Ready for your actual workout content

This script contains the structure for importing workout data into the MOOD app.
Replace the sample data below with your actual workouts, equipment lists, and exercises.

Run this script to populate the database with workout data:
python sample_workout_data.py
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'mood_app')

# Sample workout data structure - REPLACE WITH YOUR ACTUAL CONTENT
SAMPLE_WORKOUTS = [
    # "I want to sweat" - High intensity cardio
    {
        "title": "High Intensity Cardio Blast",
        "mood_category": "i want to sweat",
        "exercises": [
            {"name": "Jumping Jacks", "reps": 30, "sets": 4, "rest_seconds": 30},
            {"name": "Burpees", "reps": 15, "sets": 4, "rest_seconds": 45},
            {"name": "Mountain Climbers", "reps": 20, "sets": 4, "rest_seconds": 30},
            {"name": "High Knees", "reps": 30, "sets": 4, "rest_seconds": 30}
        ],
        "duration": 25,
        "difficulty": "intermediate",
        "equipment": ["none"],
        "calories_estimate": 300,
        "description": "Get your heart pumping with this intense cardio workout"
    },
    
    # "I want to push and gain muscle" - Strength training
    {
        "title": "Upper Body Strength Builder",
        "mood_category": "i want to push and gain muscle",
        "exercises": [
            {"name": "Push-ups", "reps": 12, "sets": 4, "rest_seconds": 60},
            {"name": "Dumbbell Chest Press", "reps": 10, "sets": 4, "rest_seconds": 90},
            {"name": "Shoulder Press", "reps": 12, "sets": 3, "rest_seconds": 60},
            {"name": "Tricep Dips", "reps": 10, "sets": 3, "rest_seconds": 60}
        ],
        "duration": 45,
        "difficulty": "intermediate",
        "equipment": ["dumbbells", "bench"],
        "calories_estimate": 250,
        "description": "Build upper body strength and muscle mass"
    },
    
    # "I want to build explosiveness" - Power & plyometric
    {
        "title": "Explosive Power Training",
        "mood_category": "i want to build explosiveness",
        "exercises": [
            {"name": "Box Jumps", "reps": 8, "sets": 4, "rest_seconds": 90},
            {"name": "Plyometric Push-ups", "reps": 6, "sets": 4, "rest_seconds": 90},
            {"name": "Jump Squats", "reps": 10, "sets": 4, "rest_seconds": 60},
            {"name": "Medicine Ball Slams", "reps": 12, "sets": 3, "rest_seconds": 75}
        ],
        "duration": 35,
        "difficulty": "advanced",
        "equipment": ["box", "medicine ball"],
        "calories_estimate": 280,
        "description": "Develop explosive power and athletic performance"
    },
    
    # "I want a light sweat" - Moderate intensity
    {
        "title": "Gentle Movement Flow",
        "mood_category": "i want a light sweat",
        "exercises": [
            {"name": "Walking Lunges", "reps": 16, "sets": 3, "rest_seconds": 45},
            {"name": "Bodyweight Squats", "reps": 15, "sets": 3, "rest_seconds": 45},
            {"name": "Wall Push-ups", "reps": 12, "sets": 3, "rest_seconds": 30},
            {"name": "Standing Side Bends", "reps": 20, "sets": 2, "rest_seconds": 30}
        ],
        "duration": 20,
        "difficulty": "beginner",
        "equipment": ["none"],
        "calories_estimate": 150,
        "description": "Light movement to get your body warmed up"
    },
    
    # "I'm feeling lazy" - Gentle movement
    {
        "title": "Couch to Movement",
        "mood_category": "im feeling lazy",
        "exercises": [
            {"name": "Seated Leg Extensions", "reps": 15, "sets": 2, "rest_seconds": 30},
            {"name": "Arm Circles", "reps": 20, "sets": 2, "rest_seconds": 20},
            {"name": "Neck Rolls", "reps": 10, "sets": 2, "rest_seconds": 20},
            {"name": "Gentle Stretching", "duration_minutes": 5}
        ],
        "duration": 15,
        "difficulty": "beginner",
        "equipment": ["chair"],
        "calories_estimate": 80,
        "description": "Gentle movements to get started when motivation is low"
    },
    
    # "I want to do calisthenics" - Bodyweight exercises
    {
        "title": "Bodyweight Mastery",
        "mood_category": "i want to do calisthenics",
        "exercises": [
            {"name": "Pull-ups", "reps": 8, "sets": 4, "rest_seconds": 90},
            {"name": "Push-ups", "reps": 15, "sets": 4, "rest_seconds": 60},
            {"name": "Pistol Squats", "reps": 5, "sets": 3, "rest_seconds": 75},
            {"name": "Handstand Practice", "duration_seconds": 30, "sets": 3, "rest_seconds": 90}
        ],
        "duration": 40,
        "difficulty": "advanced",
        "equipment": ["pull-up bar"],
        "calories_estimate": 220,
        "description": "Master your bodyweight with these calisthenics moves"
    },
    
    # "I want to get outside" - Outdoor activities
    {
        "title": "Fresh Air Fitness",
        "mood_category": "i want to get outside",
        "exercises": [
            {"name": "Brisk Walk/Jog", "duration_minutes": 15},
            {"name": "Park Bench Step-ups", "reps": 12, "sets": 3, "rest_seconds": 45},
            {"name": "Tree Push-ups", "reps": 10, "sets": 3, "rest_seconds": 45},
            {"name": "Nature Squats", "reps": 15, "sets": 3, "rest_seconds": 45}
        ],
        "duration": 30,
        "difficulty": "beginner",
        "equipment": ["none"],
        "calories_estimate": 200,
        "description": "Connect with nature while staying active"
    }
]

async def import_workout_data():
    """Import sample workout data into MongoDB"""
    print("🏋️ Starting MOOD workout data import...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Clear existing workouts (optional - remove this line to keep existing data)
        # await db.workouts.delete_many({})
        # print("Cleared existing workout data")
        
        # Insert sample workouts
        for workout_data in SAMPLE_WORKOUTS:
            workout_data["created_at"] = datetime.now(timezone.utc)
            workout_data["created_by"] = "system"  # System-generated workout
            
        result = await db.workouts.insert_many(SAMPLE_WORKOUTS)
        print(f"✅ Successfully imported {len(result.inserted_ids)} workouts")
        
        # Print summary
        for mood_category in set(w["mood_category"] for w in SAMPLE_WORKOUTS):
            count = len([w for w in SAMPLE_WORKOUTS if w["mood_category"] == mood_category])
            print(f"   - {mood_category}: {count} workout(s)")
            
    except Exception as e:
        print(f"❌ Error importing workout data: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    print("""
    🎯 MOOD App Workout Data Import Tool
    
    This script contains sample workout data for all 7 mood categories:
    1. I want to sweat
    2. I want to push and gain muscle  
    3. I want to build explosiveness
    4. I want a light sweat
    5. I'm feeling lazy
    6. I want to do calisthenics
    7. I want to get outside
    
    NEXT STEPS:
    -----------
    1. Replace the SAMPLE_WORKOUTS with your actual workout content
    2. Add more exercises, equipment types, and difficulty variations
    3. Run this script to populate your database: python sample_workout_data.py
    
    STRUCTURE GUIDE:
    ----------------
    Each workout should have:
    - title: Workout name
    - mood_category: One of the 7 mood types (exact match required)
    - exercises: List of exercises with reps/sets or duration
    - duration: Total workout time in minutes
    - difficulty: beginner, intermediate, or advanced
    - equipment: List of required equipment (use "none" for bodyweight)
    - calories_estimate: Estimated calories burned
    - description: Brief workout description
    """)
    
    asyncio.run(import_workout_data())