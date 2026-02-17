"""
Migration script to populate thumbnail_url for all exercises using Cloudinary's
server-side thumbnail generation.

This replaces client-side thumbnail generation with instant Cloudinary poster frames.
"""

import os
import re
from urllib.parse import quote
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")


def cloudinary_public_id_from_url(cloudinary_url: str) -> str | None:
    """Extract Cloudinary public_id from a Cloudinary delivery URL."""
    try:
        from urllib.parse import urlparse, unquote
        
        parsed = urlparse(cloudinary_url)
        parts = parsed.path.split("/")
        
        # Find "/upload/" segment
        try:
            upload_idx = parts.index("upload")
        except ValueError:
            return None
        
        # Get everything after upload/
        after_upload = [p for p in parts[upload_idx + 1:] if p]
        
        # Skip transformation segments and version
        i = 0
        while i < len(after_upload):
            seg = after_upload[i]
            # Version segment like v123456
            if re.match(r'^v\d+$', seg):
                i += 1
                break
            # Transformation segments contain commas, colons, or start with common prefixes
            if (',' in seg or ':' in seg or 
                seg.startswith(('c_', 'w_', 'q_', 'f_', 'sp_', 'so_', 'h_', 'ar_', 'g_'))):
                i += 1
                continue
            break
        
        # Join remaining parts as public_id with extension
        public_path = "/".join(after_upload[i:])
        if not public_path:
            return None
        
        # Strip extension
        public_id = re.sub(r'\.(mp4|mov|m4v|webm|m3u8|jpg|png|jpeg)$', '', public_path, flags=re.IGNORECASE)
        return unquote(public_id)
    except Exception as e:
        print(f"Error parsing URL {cloudinary_url}: {e}")
        return None


def generate_cloudinary_thumbnail_url(video_url: str) -> str:
    """
    Generate a Cloudinary thumbnail URL from a video URL.
    Uses: 1s offset, 720px width, fill crop, auto quality, jpg format.
    """
    public_id = cloudinary_public_id_from_url(video_url)
    if not public_id:
        return ""
    
    try:
        from urllib.parse import urlparse
        parsed = urlparse(video_url)
        parts = parsed.path.split("/")
        
        # Get cloud name (first path segment)
        cloud_name = parts[1] if len(parts) > 1 else "dfsygar5c"
        
        base = f"{parsed.scheme}://{parsed.netloc}/{cloud_name}/video/upload"
        thumbnail_url = f"{base}/so_1.0,w_720,c_fill,q_auto,f_jpg/{quote(public_id, safe='/')}.jpg"
        return thumbnail_url
    except Exception as e:
        print(f"Error generating thumbnail URL: {e}")
        return ""


def migrate_thumbnails():
    """Update all exercises with Cloudinary-generated thumbnail URLs."""
    client = MongoClient(MONGO_URL)
    db = client.test_database
    exercises = db.exercises
    
    # Get all exercises
    all_exercises = list(exercises.find({}))
    print(f"Found {len(all_exercises)} exercises to process")
    
    updated = 0
    skipped = 0
    errors = 0
    
    for ex in all_exercises:
        video_url = ex.get("video_url", "")
        current_thumbnail = ex.get("thumbnail_url", "")
        
        if not video_url:
            print(f"⚠️  Skipping {ex.get('name', 'Unknown')} - no video_url")
            skipped += 1
            continue
        
        # Check if current thumbnail is a Cloudinary-generated one (contains our transformation params)
        is_cloudinary_thumb = "so_1.0,w_720,c_fill" in current_thumbnail
        
        # Skip if already has proper Cloudinary thumbnail
        if is_cloudinary_thumb:
            skipped += 1
            continue
        
        # Generate new thumbnail URL
        new_thumbnail = generate_cloudinary_thumbnail_url(video_url)
        
        if not new_thumbnail:
            print(f"❌ Failed to generate thumbnail for: {ex.get('name', 'Unknown')}")
            errors += 1
            continue
        
        # Update the exercise
        result = exercises.update_one(
            {"_id": ex["_id"]},
            {"$set": {"thumbnail_url": new_thumbnail}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Updated: {ex.get('name', 'Unknown')}")
            updated += 1
        else:
            skipped += 1
    
    print(f"\n{'='*50}")
    print(f"Migration Complete!")
    print(f"  Updated: {updated}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors:  {errors}")
    print(f"{'='*50}")
    
    client.close()


if __name__ == "__main__":
    migrate_thumbnails()
