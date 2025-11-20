#!/usr/bin/env python3
"""
Script to seed the database with test users and interactions
"""
import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from passlib.context import CryptContext
import random

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "test_database")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Test users data
TEST_USERS = [
    {
        "username": "fitnessguru",
        "email": "guru@test.com",
        "name": "Alex Rivera",
        "bio": "💪 Fitness coach | 🏋️ Strength training enthusiast | Helping you reach your goals",
        "avatar": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"
    },
    {
        "username": "yogalife",
        "email": "yoga@test.com",
        "name": "Maya Chen",
        "bio": "🧘‍♀️ Yoga instructor | Mindfulness advocate | Living my best life",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
    },
    {
        "username": "cardioking",
        "email": "cardio@test.com",
        "name": "Marcus Johnson",
        "bio": "🏃 Marathon runner | Cardio is life | Always pushing limits",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
    },
    {
        "username": "strengthqueen",
        "email": "strength@test.com",
        "name": "Sarah Williams",
        "bio": "🏋️‍♀️ Powerlifter | Breaking records | Strong is beautiful",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
        "username": "hiitmaster",
        "email": "hiit@test.com",
        "name": "Jake Thompson",
        "bio": "⚡ HIIT specialist | No pain, no gain | Let's get it!",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
    }
]

# Sample comments for variety
COMMENTS = [
    "This is amazing! 🔥",
    "Great work! Keep it up! 💪",
    "Inspiring! 👏",
    "This is my goal too!",
    "How did you do this? Tips please!",
    "Absolutely crushing it! 🙌",
    "This motivated me to workout today!",
    "Love the dedication! ❤️",
    "You're an inspiration! ⭐",
    "Wow, incredible progress!",
    "This is exactly what I needed to see! 💯",
    "Beast mode activated! 🦁",
    "Respect! 🙏",
    "Goals right there!",
    "This is next level! 🚀",
    "Can't wait to try this!",
    "You make it look so easy!",
    "Legendary! 👑",
    "Keep grinding! 💪",
    "Absolutely amazing! 😍"
]

# Sample posts data
SAMPLE_POSTS = [
    {
        "caption": "Morning cardio session! Feeling energized 💪 #fitness #cardio",
        "media_urls": ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Leg day complete! No pain, no gain 🦵🔥 #legday #strength",
        "media_urls": ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Yoga flow to end the day 🧘‍♀️ Finding my balance #yoga #mindfulness",
        "media_urls": ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Chest and arms today! Feeling the pump 💪 #gymlife #gains",
        "media_urls": ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop"],
    },
    {
        "caption": "5K run in the park this morning 🏃‍♂️ Beautiful weather! #running #outdoor",
        "media_urls": ["https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=800&fit=crop"],
    },
    {
        "caption": "HIIT session done! 30 minutes of pure intensity ⚡ #hiit #cardio",
        "media_urls": ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Back and biceps day 💪 Building that V-taper #backday #lifting",
        "media_urls": ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Post-workout smoothie time! 🥤 Fuel for recovery #nutrition #healthy",
        "media_urls": ["https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Deadlift PR today! 💪 Hard work paying off #powerlifting #strength",
        "media_urls": ["https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=800&fit=crop"],
    },
    {
        "caption": "Evening stretching routine 🌙 Recovery is key #flexibility #recovery",
        "media_urls": ["https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=800&fit=crop"],
    },
]

def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_test_users():
    """Create test users in the database"""
    print("Creating test users...")
    created_users = []
    
    for user_data in TEST_USERS:
        # Check if user already exists
        existing = db.users.find_one({"username": user_data["username"]})
        if existing:
            print(f"  User {user_data['username']} already exists, skipping...")
            created_users.append(existing)
            continue
        
        # Create new user
        user = {
            "username": user_data["username"],
            "email": user_data["email"],
            "name": user_data["name"],
            "bio": user_data["bio"],
            "avatar": user_data["avatar"],
            "password": hash_password("password123"),
            "created_at": datetime.utcnow(),
            "followers_count": 0,
            "following_count": 0,
            "workouts_count": 0,
            "current_streak": random.randint(1, 30)
        }
        
        result = db.users.insert_one(user)
        user["_id"] = result.inserted_id
        created_users.append(user)
        print(f"  ✓ Created user: {user_data['username']}")
    
    return created_users

def create_test_posts(test_users):
    """Create test posts from test users"""
    print("\nCreating test posts...")
    
    if not test_users:
        print("  No test users available to create posts")
        return []
    
    created_posts = []
    
    # Create 2-3 posts per user
    for user in test_users:
        num_posts = random.randint(2, 3)
        user_posts = random.sample(SAMPLE_POSTS, min(num_posts, len(SAMPLE_POSTS)))
        
        for post_data in user_posts:
            post = {
                "author_id": user["_id"],
                "caption": post_data["caption"],
                "media_urls": post_data["media_urls"],
                "hashtags": [],
                "likes_count": 0,
                "comments_count": 0,
                "created_at": datetime.utcnow() - timedelta(
                    days=random.randint(0, 7),
                    hours=random.randint(0, 23)
                )
            }
            
            result = db.posts.insert_one(post)
            post["_id"] = result.inserted_id
            created_posts.append(post)
            print(f"  ✓ Created post for {user['username']}")
    
    print(f"  Total posts created: {len(created_posts)}")
    return created_posts

def add_likes_to_posts(test_users):
    """Add likes from test users to existing posts"""
    print("\nAdding likes to posts...")
    
    # Get all posts
    posts = list(db.posts.find())
    if not posts:
        print("  No posts found to like")
        return
    
    likes_added = 0
    for post in posts:
        # Randomly select 1-4 users to like each post
        num_likes = random.randint(1, min(4, len(test_users)))
        likers = random.sample(test_users, num_likes)
        
        for user in likers:
            # Check if already liked
            existing_like = db.likes.find_one({
                "post_id": post["_id"],
                "user_id": user["_id"]
            })
            
            if not existing_like:
                db.likes.insert_one({
                    "post_id": post["_id"],
                    "user_id": user["_id"],
                    "created_at": datetime.utcnow() - timedelta(
                        hours=random.randint(1, 48)
                    )
                })
                likes_added += 1
    
    print(f"  ✓ Added {likes_added} likes")

def add_comments_to_posts(test_users):
    """Add comments from test users to existing posts"""
    print("\nAdding comments to posts...")
    
    # Get all posts
    posts = list(db.posts.find())
    if not posts:
        print("  No posts found to comment on")
        return
    
    comments_added = 0
    for post in posts:
        # Randomly add 1-5 comments per post
        num_comments = random.randint(1, min(5, len(COMMENTS)))
        
        for _ in range(num_comments):
            user = random.choice(test_users)
            comment_text = random.choice(COMMENTS)
            
            db.comments.insert_one({
                "post_id": post["_id"],
                "user_id": user["_id"],
                "text": comment_text,
                "created_at": datetime.utcnow() - timedelta(
                    hours=random.randint(1, 72)
                )
            })
            comments_added += 1
    
    print(f"  ✓ Added {comments_added} comments")

def update_post_counts():
    """Update likes_count and comments_count for all posts"""
    print("\nUpdating post counts...")
    
    posts = list(db.posts.find())
    for post in posts:
        likes_count = db.likes.count_documents({"post_id": post["_id"]})
        comments_count = db.comments.count_documents({"post_id": post["_id"]})
        
        db.posts.update_one(
            {"_id": post["_id"]},
            {"$set": {
                "likes_count": likes_count,
                "comments_count": comments_count
            }}
        )
    
    print(f"  ✓ Updated counts for {len(posts)} posts")

def main():
    """Main function to seed test data"""
    print("=" * 50)
    print("Seeding Test Data")
    print("=" * 50)
    
    try:
        # Create test users
        test_users = create_test_users()
        
        if not test_users:
            print("\n❌ No test users created")
            return
        
        # Create test posts
        test_posts = create_test_posts(test_users)
        
        if not test_posts:
            print("\n⚠️  No posts created, skipping likes and comments")
        else:
            # Add likes and comments
            add_likes_to_posts(test_users)
            add_comments_to_posts(test_users)
            
            # Update counts
            update_post_counts()
        
        print("\n" + "=" * 50)
        print("✅ Test data seeding complete!")
        print("=" * 50)
        print(f"\nCreated/Found {len(test_users)} test users")
        print(f"Created {len(test_posts)} test posts")
        print("\nTest user credentials:")
        print("Username: Any of the above usernames")
        print("Password: password123")
        print("\nYou can now like and comment from these test accounts!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
