"""
Seed mock users and posts for testing the social feed
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    print("🌱 Seeding database with mock data...")
    
    # Create mock users
    mock_users = [
        {
            "username": "fitnessqueen",
            "email": "fitness@mood.com",
            "password": bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
            "name": "Sarah Martinez",
            "bio": "💪 Fitness enthusiast | Morning workout lover",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b332c5db?w=150&h=150&fit=crop&crop=face",
            "followers_count": 1250,
            "following_count": 342,
            "workouts_count": 128,
            "current_streak": 15,
            "created_at": datetime.now(timezone.utc) - timedelta(days=180)
        },
        {
            "username": "strengthbeast",
            "email": "strength@mood.com",
            "password": bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
            "name": "Marcus Johnson",
            "bio": "🏋️ Powerlifter | Chasing PRs daily",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "followers_count": 2100,
            "following_count": 189,
            "workouts_count": 245,
            "current_streak": 32,
            "created_at": datetime.now(timezone.utc) - timedelta(days=365)
        },
        {
            "username": "yogaflow_",
            "email": "yoga@mood.com",
            "password": bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
            "name": "Emma Chen",
            "bio": "🧘‍♀️ Yoga instructor | Finding balance",
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            "followers_count": 3450,
            "following_count": 567,
            "workouts_count": 412,
            "current_streak": 67,
            "created_at": datetime.now(timezone.utc) - timedelta(days=540)
        },
        {
            "username": "cardioking",
            "email": "cardio@mood.com",
            "password": bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
            "name": "Alex Rivera",
            "bio": "🏃‍♂️ Marathon runner | Endurance athlete",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "followers_count": 890,
            "following_count": 234,
            "workouts_count": 187,
            "current_streak": 22,
            "created_at": datetime.now(timezone.utc) - timedelta(days=200)
        }
    ]
    
    # Check if users already exist
    existing_users = await db.users.count_documents({"username": {"$in": [u["username"] for u in mock_users]}})
    
    if existing_users == 0:
        result = await db.users.insert_many(mock_users)
        user_ids = result.inserted_ids
        print(f"✅ Created {len(user_ids)} mock users")
    else:
        # Get existing user IDs
        users = await db.users.find({"username": {"$in": [u["username"] for u in mock_users]}}).to_list(length=10)
        user_ids = [user["_id"] for user in users]
        print(f"✅ Found {len(user_ids)} existing mock users")
    
    # Create mock posts
    mock_posts = [
        {
            "author_id": user_ids[0],
            "caption": "Started my day with an intense cardio session! 💪 Feeling energized and ready to conquer the day. Who else loves morning workouts? #morningworkout #cardio #fitness",
            "media_urls": [
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
            ],
            "hashtags": ["morningworkout", "cardio", "fitness"],
            "likes_count": 24,
            "comments_count": 8,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=2)
        },
        {
            "author_id": user_ids[1],
            "caption": "Heavy chest and shoulder day in the books! New PR on bench press 🔥 225 lbs for 5 reps! #strengthtraining #chestday #pr",
            "media_urls": [
                "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
            ],
            "hashtags": ["strengthtraining", "chestday", "pr"],
            "likes_count": 31,
            "comments_count": 12,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=4)
        },
        {
            "author_id": user_ids[2],
            "caption": "Morning yoga flow to start the day right ☀️ Nothing beats the peace of early morning practice. #yoga #mindfulness #wellness",
            "media_urls": [
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
            ],
            "hashtags": ["yoga", "mindfulness", "wellness"],
            "likes_count": 67,
            "comments_count": 15,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=6)
        },
        {
            "author_id": user_ids[3],
            "caption": "10K run done! ✅ Beautiful morning in the park. The grind never stops 🏃‍♂️ #running #10k #outdoorworkout",
            "media_urls": [
                "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=600&fit=crop",
            ],
            "hashtags": ["running", "10k", "outdoorworkout"],
            "likes_count": 43,
            "comments_count": 9,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=8)
        },
        {
            "author_id": user_ids[0],
            "caption": "Leg day = best day! Squats, lunges, and deadlifts. Feeling the burn 🔥 #legday #gains #neverskiplegday",
            "media_urls": [
                "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1517836477839-7072aaa8b121?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
            ],
            "hashtags": ["legday", "gains", "neverskiplegday"],
            "likes_count": 56,
            "comments_count": 18,
            "created_at": datetime.now(timezone.utc) - timedelta(hours=12)
        },
        {
            "author_id": user_ids[1],
            "caption": "Back and biceps pump session 💪 Feeling strong! #backday #biceps #gymlife",
            "media_urls": [
                "https://images.unsplash.com/photo-1583454155184-08e29cd2ca83?w=800&h=600&fit=crop",
            ],
            "hashtags": ["backday", "biceps", "gymlife"],
            "likes_count": 38,
            "comments_count": 7,
            "created_at": datetime.now(timezone.utc) - timedelta(days=1)
        },
    ]
    
    # Check if posts already exist
    existing_posts = await db.posts.count_documents({"author_id": {"$in": user_ids}})
    
    if existing_posts == 0:
        result = await db.posts.insert_many(mock_posts)
        print(f"✅ Created {len(result.inserted_ids)} mock posts")
    else:
        print(f"✅ Found {existing_posts} existing mock posts")
    
    print("🎉 Database seeding complete!")
    print("\nMock user credentials (all passwords: password123):")
    for user in mock_users:
        print(f"  - {user['username']} ({user['email']})")

if __name__ == "__main__":
    asyncio.run(seed_data())
    client.close()
