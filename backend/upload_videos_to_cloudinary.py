"""
Upload exercise videos to Cloudinary and update database
"""
import asyncio
import cloudinary
import cloudinary.uploader
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Load env manually
from pathlib import Path
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                # Remove quotes from value
                value = value.strip('"').strip("'")
                os.environ[key] = value

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

async def upload_videos_to_cloudinary():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    exercises = await db.exercises.find().to_list(50)
    print(f"Found {len(exercises)} exercises to process\n")
    
    success_count = 0
    error_count = 0
    
    for ex in exercises:
        name = ex.get('name', 'Unknown')
        video_url = ex.get('video_url', '')
        
        # Skip if already on Cloudinary
        if 'cloudinary.com' in video_url or 'res.cloudinary.com' in video_url:
            print(f"✓ {name}: Already on Cloudinary")
            success_count += 1
            continue
        
        # Skip if no URL
        if not video_url:
            print(f"⚠ {name}: No video URL")
            continue
        
        try:
            print(f"⏳ Uploading: {name}...")
            
            # Create a safe public_id from the exercise name
            safe_name = name.lower().replace(' ', '_').replace('/', '_').replace('&', 'and')
            public_id = f"exercise_library/{safe_name}"
            
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                video_url,
                resource_type="video",
                public_id=public_id,
                overwrite=True
            )
            
            new_url = result['secure_url']
            
            # Update database
            await db.exercises.update_one(
                {"_id": ex["_id"]},
                {"$set": {"video_url": new_url}}
            )
            
            print(f"✅ {name}: Uploaded successfully")
            print(f"   URL: {new_url}")
            success_count += 1
            
        except Exception as e:
            print(f"❌ {name}: Failed - {str(e)}")
            error_count += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {error_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(upload_videos_to_cloudinary())
