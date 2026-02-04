#!/usr/bin/env python3
"""
Script to migrate all workout media from emergentagent.com to Cloudinary
This ensures faster loading and reliable CDN delivery for production
"""

import cloudinary
import cloudinary.uploader
import requests
import json
import os
import re
from urllib.parse import unquote
from dotenv import load_dotenv
from pathlib import Path
import time

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

print(f"✅ Cloudinary configured: {os.environ.get('CLOUDINARY_CLOUD_NAME')}")

# All unique URLs to migrate
MEDIA_URLS_FILE = "/tmp/all_media_urls.txt"
MAPPING_OUTPUT_FILE = "/app/backend/cloudinary_url_mapping.json"

def get_clean_filename(url: str) -> str:
    """Extract and clean the filename from URL for use as public_id"""
    # Get the last part of the URL (filename)
    filename = url.split('/')[-1]
    # URL decode
    filename = unquote(filename)
    # Remove extension
    filename = os.path.splitext(filename)[0]
    # Clean for Cloudinary public_id (alphanumeric, underscores, hyphens)
    filename = re.sub(r'[^a-zA-Z0-9_-]', '_', filename)
    # Remove multiple underscores
    filename = re.sub(r'_+', '_', filename)
    return filename[:100]  # Max 100 chars

def get_resource_type(url: str) -> str:
    """Determine if URL is video or image"""
    lower_url = url.lower()
    if any(ext in lower_url for ext in ['.mov', '.mp4', '.webm', '.avi']):
        return 'video'
    return 'image'

def upload_to_cloudinary(url: str, retries: int = 3) -> dict:
    """Upload a single file to Cloudinary from URL"""
    filename = get_clean_filename(url)
    resource_type = get_resource_type(url)
    
    # Create a unique public_id with folder structure
    folder = "mood_app/workout_media"
    if resource_type == 'video':
        folder = "mood_app/workout_videos"
    
    public_id = f"{folder}/{filename}"
    
    for attempt in range(retries):
        try:
            print(f"📤 Uploading ({resource_type}): {filename}...")
            
            result = cloudinary.uploader.upload(
                url,
                public_id=public_id,
                resource_type=resource_type,
                overwrite=False,  # Don't overwrite if exists
                folder=None,  # Already in public_id
                transformation=[
                    {"quality": "auto:good"},
                    {"fetch_format": "auto"}
                ] if resource_type == 'image' else None
            )
            
            secure_url = result.get('secure_url')
            print(f"✅ Uploaded: {secure_url}")
            
            # For videos, also get thumbnail URL
            thumbnail_url = None
            if resource_type == 'video':
                thumbnail_url = f"https://res.cloudinary.com/{os.environ.get('CLOUDINARY_CLOUD_NAME')}/video/upload/so_2.0,w_400,h_400,c_fill/{result['public_id']}.jpg"
            
            return {
                'original_url': url,
                'cloudinary_url': secure_url,
                'public_id': result['public_id'],
                'resource_type': resource_type,
                'thumbnail_url': thumbnail_url,
                'width': result.get('width'),
                'height': result.get('height'),
                'bytes': result.get('bytes'),
                'format': result.get('format')
            }
            
        except cloudinary.exceptions.Error as e:
            error_msg = str(e)
            if 'already exists' in error_msg.lower():
                # Asset already uploaded, get existing URL
                print(f"ℹ️ Already exists: {filename}")
                existing_url = f"https://res.cloudinary.com/{os.environ.get('CLOUDINARY_CLOUD_NAME')}/{resource_type}/upload/{public_id}"
                if resource_type == 'image':
                    # Try common extensions
                    for ext in ['.png', '.jpg', '.webp', '.avif']:
                        existing_url = f"https://res.cloudinary.com/{os.environ.get('CLOUDINARY_CLOUD_NAME')}/{resource_type}/upload/{public_id}{ext}"
                return {
                    'original_url': url,
                    'cloudinary_url': existing_url,
                    'public_id': public_id,
                    'resource_type': resource_type,
                    'thumbnail_url': None,
                    'already_existed': True
                }
            
            print(f"⚠️ Attempt {attempt + 1} failed: {error_msg}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                return {
                    'original_url': url,
                    'error': error_msg,
                    'resource_type': resource_type
                }
        except Exception as e:
            print(f"⚠️ Attempt {attempt + 1} error: {str(e)}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                return {
                    'original_url': url,
                    'error': str(e),
                    'resource_type': resource_type
                }

def main():
    """Main migration function"""
    print("🚀 Starting Cloudinary Migration...")
    print("=" * 60)
    
    # Read all URLs
    with open(MEDIA_URLS_FILE, 'r') as f:
        urls = [line.strip() for line in f if line.strip()]
    
    print(f"📋 Found {len(urls)} unique media files to migrate")
    
    # Separate videos from images for prioritization
    videos = [u for u in urls if get_resource_type(u) == 'video']
    images = [u for u in urls if get_resource_type(u) == 'image']
    
    print(f"🎬 Videos: {len(videos)}")
    print(f"🖼️ Images: {len(images)}")
    print("=" * 60)
    
    # Track results
    results = {
        'success': [],
        'errors': [],
        'mapping': {}  # original_url -> cloudinary_url
    }
    
    # Process videos first (priority for quick wins)
    print("\n🎬 Processing Videos First...")
    for i, url in enumerate(videos, 1):
        print(f"\n[{i}/{len(videos)}] Video")
        result = upload_to_cloudinary(url)
        if 'error' in result:
            results['errors'].append(result)
        else:
            results['success'].append(result)
            results['mapping'][result['original_url']] = result['cloudinary_url']
        time.sleep(0.5)  # Rate limiting
    
    # Process images
    print("\n\n🖼️ Processing Images...")
    for i, url in enumerate(images, 1):
        print(f"\n[{i}/{len(images)}] Image")
        result = upload_to_cloudinary(url)
        if 'error' in result:
            results['errors'].append(result)
        else:
            results['success'].append(result)
            results['mapping'][result['original_url']] = result['cloudinary_url']
        
        # Progress update every 50
        if i % 50 == 0:
            print(f"\n📊 Progress: {i}/{len(images)} images uploaded")
        
        time.sleep(0.3)  # Rate limiting
    
    # Save results
    print("\n\n" + "=" * 60)
    print("📊 Migration Summary")
    print("=" * 60)
    print(f"✅ Successful: {len(results['success'])}")
    print(f"❌ Errors: {len(results['errors'])}")
    
    # Save mapping to file
    with open(MAPPING_OUTPUT_FILE, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Mapping saved to: {MAPPING_OUTPUT_FILE}")
    
    # Print errors if any
    if results['errors']:
        print("\n❌ Failed URLs:")
        for err in results['errors']:
            print(f"  - {err['original_url']}: {err.get('error', 'Unknown error')}")
    
    return results

if __name__ == "__main__":
    main()
