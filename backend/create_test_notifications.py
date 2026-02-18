"""
Create test notifications for officialmoodapp for marketing screenshots.
Creates realistic-looking notifications from various profile types.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")

# Realistic fitness influencer profiles
TEST_PROFILES = [
    {
        "username": "sarah_lifts",
        "name": "Sarah Chen",
        "avatar": "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "mike.fitness",
        "name": "Mike Johnson",
        "avatar": "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "fitwithjess",
        "name": "Jessica Rivera",
        "avatar": "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "ironchris_",
        "name": "Chris Park",
        "avatar": "https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "maya.moves",
        "name": "Maya Thompson",
        "avatar": "https://images.unsplash.com/photo-1609899464726-209befde tried?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "alexfitpro",
        "name": "Alex Martinez",
        "avatar": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "strongemma",
        "name": "Emma Wilson",
        "avatar": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&h=150&fit=crop&crop=faces"
    },
    {
        "username": "jordan.gym",
        "name": "Jordan Lee",
        "avatar": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=150&h=150&fit=crop&crop=faces"
    }
]

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.mood_fitness
    
    # Find officialmoodapp user
    target_user = await db.users.find_one({"username": {"$regex": "^officialmoodapp$", "$options": "i"}})
    if not target_user:
        print("❌ officialmoodapp user not found!")
        return
    
    target_user_id = str(target_user["_id"])
    print(f"✅ Found officialmoodapp: {target_user_id}")
    
    # Create test users if they don't exist, and create notifications
    notifications_created = []
    now = datetime.now(timezone.utc)
    
    notification_templates = [
        # Likes
        {"type": "like", "body": "liked your post", "minutes_ago": 2},
        {"type": "like", "body": "liked your post", "minutes_ago": 8},
        # Comments
        {"type": "comment", "body": "commented: \"This workout was insane! 🔥\"", "minutes_ago": 5},
        {"type": "comment", "body": "commented: \"Love this routine!\"", "minutes_ago": 15},
        # Follows
        {"type": "follow", "body": "started following you", "minutes_ago": 12},
        {"type": "follow", "body": "started following you", "minutes_ago": 25},
        {"type": "follow", "body": "started following you", "minutes_ago": 45},
        # More engagement
        {"type": "like", "body": "liked your post", "minutes_ago": 30},
    ]
    
    for i, template in enumerate(notification_templates):
        profile = TEST_PROFILES[i % len(TEST_PROFILES)]
        
        # Check if test user exists, create if not
        test_user = await db.users.find_one({"username": profile["username"]})
        if not test_user:
            test_user = {
                "_id": ObjectId(),
                "username": profile["username"],
                "name": profile["name"],
                "email": f"{profile['username']}@test.mood.app",
                "avatar": profile["avatar"],
                "created_at": now - timedelta(days=30),
                "is_test_user": True,
                "followers_count": 0,
                "following_count": 0,
            }
            await db.users.insert_one(test_user)
            print(f"  Created test user: @{profile['username']}")
        
        actor_id = str(test_user["_id"])
        
        # Create notification
        notification = {
            "user_id": target_user_id,
            "type": template["type"],
            "title": profile["name"],
            "body": template["body"],
            "actor_id": actor_id,
            "actor_username": profile["username"],
            "actor_avatar": profile["avatar"],
            "entity_id": None,
            "entity_type": "post" if template["type"] in ["like", "comment"] else None,
            "image_url": profile["avatar"],
            "deep_link": "mood://notifications",
            "created_at": now - timedelta(minutes=template["minutes_ago"]),
            "read": False,
            "read_at": None,
            "metadata": {},
        }
        
        result = await db.notifications.insert_one(notification)
        notifications_created.append(str(result.inserted_id))
        print(f"  ✅ Created {template['type']} notification from @{profile['username']}")
    
    print(f"\n🎉 Created {len(notifications_created)} notifications for officialmoodapp!")
    print("Open the app and check the notifications tab.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
