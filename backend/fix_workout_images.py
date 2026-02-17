"""
Script to replace Unsplash URLs in cardio-workouts-data.ts with proper Cloudinary thumbnails.
"""
import os
import re
os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
from pymongo import MongoClient

def get_exercise_thumbnails():
    """Get all exercise thumbnails from database."""
    client = MongoClient(os.environ['MONGO_URL'])
    db = client.test_database
    
    thumbnails = {}
    for ex in db.exercises.find({}):
        thumb = ex.get('thumbnail_url', '')
        if thumb and 'so_1.0,w_720' in thumb:
            name_key = ex.get('name', '').lower()
            thumbnails[name_key] = thumb
    
    client.close()
    return thumbnails

def get_equipment_thumbnails(exercise_thumbnails):
    """Map equipment types to appropriate exercise thumbnails."""
    # Map equipment keywords to specific exercises
    equipment_to_exercise = {
        'barbell': 'barbell row',
        'dumbbell': 'db bulgarian split squat', 
        'dumbbells': 'db bulgarian split squat',
        'kettlebell': 'kb single arm swing',
        'kettlebells': 'kb single arm swing',
        'kettle bell': 'kb single arm swing',
        'kettle bells': 'kb single arm swing',
        'kb': 'kb single arm swing',
        'medicine ball': 'slam ball chest pass',
        'med ball': 'slam ball chest pass',
        'slam ball': 'slam ball chest pass',
        'slam balls': 'slam ball chest pass',
        'battle rope': 'battle rope slams',
        'battle ropes': 'battle rope slams',
        'sled': 'sled push',
        'box': 'burpee box jump',
        'plyo': 'burpee box jump',
        'hammer': 'hip abductor',  # Machine based
        'tire': 'tire flip',
        'flipping tire': 'tire flip',
        'resistance band': 'wide grip assisted pull-up',
        'resistance bands': 'wide grip assisted pull-up',
    }
    
    equipment_thumbnails = {}
    for equip, ex_name in equipment_to_exercise.items():
        if ex_name in exercise_thumbnails:
            equipment_thumbnails[equip] = exercise_thumbnails[ex_name]
    
    return equipment_thumbnails

def replace_unsplash_urls(file_path, equipment_thumbnails):
    """Replace Unsplash URLs in file based on equipment context."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find all equipment blocks and replace their unsplash imageUrls
    # Pattern: equipment: 'Something', followed later by imageUrl with unsplash
    
    # Split by equipment blocks
    blocks = re.split(r"(equipment:\s*'[^']+',)", content)
    
    new_blocks = []
    current_equipment = None
    replacements = 0
    
    for block in blocks:
        # Check if this is an equipment declaration
        equip_match = re.search(r"equipment:\s*'([^']+)'", block)
        if equip_match:
            current_equipment = equip_match.group(1).lower()
            new_blocks.append(block)
            continue
        
        # If we have a current equipment, look for unsplash URLs to replace
        if current_equipment:
            # Find the best matching thumbnail
            replacement_url = None
            for equip_key, thumb_url in equipment_thumbnails.items():
                if equip_key in current_equipment:
                    replacement_url = thumb_url
                    break
            
            if replacement_url:
                # Replace unsplash URLs in this block
                def replace_url(match):
                    nonlocal replacements
                    replacements += 1
                    return f"imageUrl: '{replacement_url}'"
                
                block = re.sub(
                    r"imageUrl:\s*'https://images\.unsplash\.com/[^']+'",
                    replace_url,
                    block
                )
        
        new_blocks.append(block)
    
    new_content = ''.join(new_blocks)
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    return replacements

if __name__ == "__main__":
    print("Getting exercise thumbnails from database...")
    exercise_thumbnails = get_exercise_thumbnails()
    print(f"Found {len(exercise_thumbnails)} exercise thumbnails")
    
    print("\nBuilding equipment thumbnail mapping...")
    equipment_thumbnails = get_equipment_thumbnails(exercise_thumbnails)
    for k, v in equipment_thumbnails.items():
        print(f"  {k}: {v[:60]}...")
    
    print("\nReplacing Unsplash URLs in cardio-workouts-data.ts...")
    file_path = "/app/frontend/data/cardio-workouts-data.ts"
    count = replace_unsplash_urls(file_path, equipment_thumbnails)
    print(f"Replaced {count} Unsplash URLs")
    
    # Also check back-workouts-data.ts
    file_path2 = "/app/frontend/data/back-workouts-data.ts"
    count2 = replace_unsplash_urls(file_path2, equipment_thumbnails)
    print(f"Replaced {count2} Unsplash URLs in back-workouts-data.ts")
    
    print("\nDone!")
