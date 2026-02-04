#!/usr/bin/env python3
"""
Background script to migrate all workout images to Cloudinary
"""
import cloudinary
import cloudinary.uploader
import os
import re
import json
import time
from urllib.parse import unquote

# Configure Cloudinary directly
cloudinary.config(
    cloud_name='dfsygar5c',
    api_key='214795317623821',
    api_secret='clP7UOJRY4y8E_eVyP3t0ZowFQQ',
    secure=True
)

# Read all URLs
with open('/tmp/all_media_urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]

# Filter out videos (already done) and get only images
images = [u for u in urls if not any(ext in u.lower() for ext in ['.mov', '.mp4', '.webm', '.avi'])]

print(f"Starting upload of {len(images)} images to Cloudinary...")

results = {'success': [], 'errors': [], 'mapping': {}}
log_file = '/tmp/cloudinary_migration_log.txt'

with open(log_file, 'w') as f:
    f.write(f"Starting migration of {len(images)} images...\n")

for i, url in enumerate(images):
    try:
        # Create clean public_id
        filename = url.split('/')[-1]
        filename = unquote(filename)
        filename = os.path.splitext(filename)[0]
        filename = re.sub(r'[^a-zA-Z0-9_-]', '_', filename)
        filename = re.sub(r'_+', '_', filename)[:80]
        
        public_id = f"mood_app/workout_images/{filename}"
        
        result = cloudinary.uploader.upload(
            url,
            public_id=public_id,
            resource_type='image',
            overwrite=False,
            transformation=[{"quality": "auto:good"}, {"fetch_format": "auto"}]
        )
        
        results['success'].append({'original': url, 'cloudinary': result['secure_url']})
        results['mapping'][url] = result['secure_url']
        
        if (i+1) % 25 == 0:
            with open(log_file, 'a') as f:
                f.write(f"Progress: {i+1}/{len(images)} images uploaded\n")
            print(f"Progress: {i+1}/{len(images)}")
            
        time.sleep(0.2)  # Rate limiting
        
    except Exception as e:
        error_str = str(e)
        if 'already exists' in error_str.lower():
            # Already uploaded, construct URL
            cloudinary_url = f"https://res.cloudinary.com/dfsygar5c/image/upload/{public_id}"
            results['success'].append({'original': url, 'cloudinary': cloudinary_url, 'existed': True})
            results['mapping'][url] = cloudinary_url
        else:
            results['errors'].append({'url': url, 'error': error_str})
            with open(log_file, 'a') as f:
                f.write(f"Error on {url}: {error_str}\n")

# Save final results
with open('/app/backend/cloudinary_image_mapping.json', 'w') as f:
    json.dump(results, f, indent=2)

with open(log_file, 'a') as f:
    f.write(f"\nCOMPLETE: {len(results['success'])} success, {len(results['errors'])} errors\n")
    
print(f"DONE! {len(results['success'])} success, {len(results['errors'])} errors")
