#!/usr/bin/env python3
"""
Script to rotate exercise videos 90 degrees clockwise and re-upload to Cloudinary.
"""

import asyncio
import os
import subprocess
import tempfile
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import urllib.request

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Videos to rotate (the 10 we just uploaded)
VIDEOS_TO_ROTATE = [
    {
        "name": "Barbell Deadlift",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/kzlwio26_BB%20deadlift.mov"
    },
    {
        "name": "Barbell Front Squat",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wxe55iww_BB%20front%20squat.mov"
    },
    {
        "name": "Barbell Hip Thrust",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/j7wijuu5_BB%20hip%20thrust.mov"
    },
    {
        "name": "Barbell Lunge",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/jv2445o7_BB%20lunge.mov"
    },
    {
        "name": "Barbell Sumo Deadlift",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wwxkoqjg_BB%20sumo%20deadlift.mov"
    },
    {
        "name": "Cable Face Pull",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/5yzqau2v_Cable%20face%20pull.mov"
    },
    {
        "name": "Cable Glute Kickback",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/3eaq9i4y_Cable%20Glute%20Kickback.mov"
    },
    {
        "name": "Cable Lat Pullover",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7bwkj61d_Cable%20lat%20pullover.mov"
    },
    {
        "name": "Cable Overhead Tricep Extension",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7335p7s8_Cable%20overhead%20tricep%20extension.mov"
    },
    {
        "name": "Cable Rope Curl",
        "video_url": "https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/ng6d8jlv_Cable%20rope%20curl.mov"
    }
]

def download_video(url, output_path):
    """Download video from URL."""
    print(f"  Downloading from {url[:60]}...")
    urllib.request.urlretrieve(url, output_path)
    return output_path

def rotate_video(input_path, output_path):
    """Rotate video 90 degrees clockwise using ffmpeg."""
    print(f"  Rotating video...")
    # transpose=1 is 90 degrees clockwise
    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", "transpose=1",
        "-c:a", "copy",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  Error: {result.stderr}")
        return None
    return output_path

def upload_to_cloudinary(video_path, public_id):
    """Upload video to Cloudinary."""
    print(f"  Uploading to Cloudinary...")
    result = cloudinary.uploader.upload(
        video_path,
        resource_type="video",
        public_id=f"exercise_library/{public_id}",
        overwrite=True
    )
    return result.get("secure_url")

async def update_database(exercise_name, new_video_url):
    """Update the exercise in the database with new video URL."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    result = await db.exercises.update_one(
        {"name": exercise_name},
        {"$set": {"video_url": new_video_url}}
    )
    
    client.close()
    return result.modified_count > 0

async def process_videos():
    """Process all videos: download, rotate, upload, update DB."""
    print(f"Processing {len(VIDEOS_TO_ROTATE)} videos...\n")
    
    success_count = 0
    
    for video_info in VIDEOS_TO_ROTATE:
        name = video_info["name"]
        url = video_info["video_url"]
        
        print(f"\n[{name}]")
        
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                # Generate safe filename
                safe_name = name.lower().replace(" ", "_")
                input_path = os.path.join(tmpdir, f"{safe_name}_original.mov")
                output_path = os.path.join(tmpdir, f"{safe_name}_rotated.mp4")
                
                # Download
                download_video(url, input_path)
                
                # Rotate
                rotated = rotate_video(input_path, output_path)
                if not rotated:
                    print(f"  ✗ Failed to rotate")
                    continue
                
                # Upload to Cloudinary
                new_url = upload_to_cloudinary(output_path, safe_name)
                if not new_url:
                    print(f"  ✗ Failed to upload")
                    continue
                
                print(f"  New URL: {new_url}")
                
                # Update database
                updated = await update_database(name, new_url)
                if updated:
                    print(f"  ✓ Database updated")
                    success_count += 1
                else:
                    print(f"  ✗ Failed to update database")
                    
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    print(f"\n\nDone! Successfully processed {success_count}/{len(VIDEOS_TO_ROTATE)} videos")

if __name__ == "__main__":
    asyncio.run(process_videos())
