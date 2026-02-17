"""
Migration script to upload videos from customer-assets.emergentagent.com to Cloudinary.

This script:
1. Downloads videos from customer-assets URLs
2. Uploads them to Cloudinary with proper naming
3. Updates the database with new Cloudinary URLs
4. Generates proper thumbnail URLs

Run with: python migrate_videos_to_cloudinary.py
"""

import os
import re
import time
import requests
import cloudinary
import cloudinary.api
import cloudinary.uploader
from urllib.parse import unquote, quote
from pymongo import MongoClient

# Configuration
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', 'dfsygar5c')
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '214795317623821')
CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', 'clP7UOJRY4y8E_eVyP3t0ZowFQQ')

# Configure Cloudinary
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True
)


def sanitize_public_id(name: str) -> str:
    """Convert exercise name to a valid Cloudinary public_id."""
    # Convert to lowercase, replace spaces with underscores
    public_id = name.lower().strip()
    public_id = re.sub(r'[^a-z0-9\s-]', '', public_id)  # Remove special chars
    public_id = re.sub(r'\s+', '_', public_id)  # Replace spaces with underscores
    public_id = re.sub(r'-+', '_', public_id)  # Replace hyphens with underscores
    public_id = re.sub(r'_+', '_', public_id)  # Remove duplicate underscores
    return public_id.strip('_')


def generate_thumbnail_url(video_url: str, public_id: str) -> str:
    """Generate Cloudinary thumbnail URL from video."""
    base = f"https://res.cloudinary.com/{CLOUDINARY_CLOUD_NAME}/video/upload"
    return f"{base}/so_1.0,w_720,c_fill,q_auto,f_jpg/exercise_library/{quote(public_id, safe='/')}.jpg"


def upload_video_to_cloudinary(video_url: str, exercise_name: str) -> dict:
    """
    Upload a video to Cloudinary.
    
    Returns dict with 'video_url' and 'thumbnail_url' or None on failure.
    """
    public_id = sanitize_public_id(exercise_name)
    full_public_id = f"exercise_library/{public_id}"
    
    try:
        print(f"  Uploading to Cloudinary as: {full_public_id}")
        
        # Upload directly from URL (Cloudinary fetches it)
        result = cloudinary.uploader.upload(
            video_url,
            public_id=full_public_id,
            resource_type="video",
            overwrite=True,
            invalidate=True,
            # Optimize for web/mobile
            eager=[
                {"width": 720, "crop": "scale", "quality": "auto"}
            ],
            eager_async=True
        )
        
        new_video_url = result.get('secure_url', result.get('url'))
        new_thumbnail_url = generate_thumbnail_url(new_video_url, public_id)
        
        return {
            'video_url': new_video_url,
            'thumbnail_url': new_thumbnail_url,
            'public_id': full_public_id
        }
        
    except Exception as e:
        print(f"  ❌ Upload failed: {str(e)}")
        return None


def migrate_exercises():
    """Migrate all customer-assets videos to Cloudinary."""
    client = MongoClient(MONGO_URL)
    db = client.test_database
    exercises = db.exercises
    
    # Find all exercises with customer-assets URLs
    to_migrate = list(exercises.find({
        "video_url": {"$regex": "customer-assets.emergentagent.com"}
    }))
    
    print(f"Found {len(to_migrate)} exercises to migrate to Cloudinary\n")
    
    migrated = 0
    failed = 0
    skipped = 0
    
    for i, ex in enumerate(to_migrate):
        name = ex.get('name', 'Unknown')
        video_url = ex.get('video_url', '')
        
        print(f"[{i+1}/{len(to_migrate)}] {name}")
        
        if not video_url:
            print("  ⚠️ No video URL, skipping")
            skipped += 1
            continue
        
        # Upload to Cloudinary
        result = upload_video_to_cloudinary(video_url, name)
        
        if result:
            # Update database
            update_result = exercises.update_one(
                {"_id": ex["_id"]},
                {"$set": {
                    "video_url": result['video_url'],
                    "thumbnail_url": result['thumbnail_url']
                }}
            )
            
            if update_result.modified_count > 0:
                print(f"  ✅ Migrated successfully")
                print(f"     New URL: {result['video_url'][:60]}...")
                migrated += 1
            else:
                print(f"  ⚠️ Upload succeeded but DB update failed")
                failed += 1
        else:
            failed += 1
        
        # Rate limiting - be nice to Cloudinary
        if (i + 1) % 10 == 0:
            print(f"\n--- Progress: {migrated} migrated, {failed} failed, {skipped} skipped ---\n")
            time.sleep(2)  # Brief pause every 10 uploads
    
    print(f"\n{'='*60}")
    print(f"Migration Complete!")
    print(f"  Migrated: {migrated}")
    print(f"  Failed:   {failed}")
    print(f"  Skipped:  {skipped}")
    print(f"{'='*60}")
    
    client.close()
    return migrated, failed, skipped


if __name__ == "__main__":
    print("=" * 60)
    print("Cloudinary Video Migration Script")
    print("=" * 60)
    print()
    
    # Verify Cloudinary credentials
    print("Verifying Cloudinary connection...")
    try:
        cloudinary.api.ping()
        print("✅ Cloudinary connection successful\n")
    except Exception as e:
        print(f"❌ Cloudinary connection failed: {e}")
        print("Please check your credentials")
        exit(1)
    
    migrate_exercises()
