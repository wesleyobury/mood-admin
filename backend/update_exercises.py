"""
Update exercises with new video URLs and trim all to max 3 cues, 2 mistakes
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ.get('DB_NAME', 'fitness_app')]

# New/updated videos with trimmed cues (3 max) and mistakes (2 max)
UPDATED_EXERCISES = [
    {
        'name': 'Pit Shark RDL',
        'aliases': ['pit shark romanian deadlift', 'pit shark rdl', 'pit shark hip hinge', 'belt squat rdl'],
        'equipment': ['pit shark', 'belt squat machine'],
        'video_url': 'https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/95coegz8_Pit%20shark%20rdl%20.mov',
        'cues': [
            'Push hips back with flat back',
            'Feel deep hamstring stretch',
            'Drive hips forward to stand'
        ],
        'mistakes': [
            'Rounding the lower back',
            'Bending knees too much'
        ]
    },
    {
        'name': 'Barbell Reverse Lunge',
        'aliases': ['reverse lunge', 'bb reverse lunge', 'barbell lunge', 'reverse lunges', 'back lunge'],
        'equipment': ['barbell', 'squat rack'],
        'video_url': 'https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/nxiiqw9r_Barbell%20reverse%20lunge%20.mov',
        'cues': [
            'Step back with control',
            'Lower until back knee nearly touches floor',
            'Drive through front heel to return'
        ],
        'mistakes': [
            'Front knee caving inward',
            'Leaning forward excessively'
        ]
    },
    {
        'name': 'Barbell Split Squat',
        'aliases': ['split squat', 'bb split squat', 'static lunge', 'barbell static lunge', 'split squats'],
        'equipment': ['barbell', 'squat rack'],
        'video_url': 'https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/n3u85pxr_Barbell%20split%20squat%20.mov',
        'cues': [
            'Stagger stance, feet hip-width apart',
            'Lower straight down, not forward',
            'Keep torso upright throughout'
        ],
        'mistakes': [
            'Stance too narrow side-to-side',
            'Leaning trunk forward'
        ]
    },
    {
        'name': 'Cable Rope Row',
        'aliases': ['rope row', 'cable row', 'seated cable rope row', 'rope cable row', 'seated row'],
        'equipment': ['cable machine', 'rope attachment'],
        'video_url': 'https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/i6e1sxen_Cable-rope%20row%20.mov',
        'cues': [
            'Pull rope toward lower chest',
            'Squeeze shoulder blades together',
            'Control the weight back slowly'
        ],
        'mistakes': [
            'Using momentum to pull',
            'Rounding the back'
        ]
    },
    {
        'name': 'Barbell Row',
        'aliases': ['bent over row', 'bb row', 'barbell bent over row', 'pendlay row', 'bent row'],
        'equipment': ['barbell'],
        'video_url': 'https://customer-assets.emergentagent.com/job_226a4724-7b18-4fb8-8c07-2f039b1d13c4/artifacts/8dtgwnox_Barbell%20row%20.mov',
        'cues': [
            'Hinge forward with flat back',
            'Pull bar toward lower chest',
            'Lead with elbows, squeeze lats'
        ],
        'mistakes': [
            'Using body momentum',
            'Rounding the lower back'
        ]
    }
]

async def update_and_trim():
    print('1. Updating 5 exercises with new video URLs...')
    
    for ex in UPDATED_EXERCISES:
        result = await db.exercises.update_one(
            {'name': ex['name']},
            {'$set': {
                'video_url': ex['video_url'],
                'cues': ex['cues'],
                'mistakes': ex['mistakes'],
                'aliases': ex['aliases'],
                'equipment': ex['equipment'],
                'thumbnail_url': ''
            }},
            upsert=True
        )
        status = 'Updated' if result.modified_count else 'Added'
        print(f'  ✅ {status}: {ex["name"]}')
    
    print('\n2. Trimming ALL exercises to max 3 cues, 2 mistakes...')
    
    all_exercises = await db.exercises.find().to_list(100)
    trimmed = 0
    
    for ex in all_exercises:
        cues = ex.get('cues', [])
        mistakes = ex.get('mistakes', [])
        
        if len(cues) > 3 or len(mistakes) > 2:
            await db.exercises.update_one(
                {'_id': ex['_id']},
                {'$set': {
                    'cues': cues[:3],
                    'mistakes': mistakes[:2]
                }}
            )
            print(f'  ✂️  Trimmed: {ex["name"]} ({len(cues)} cues → 3, {len(mistakes)} mistakes → 2)')
            trimmed += 1
    
    print(f'\nDone! Trimmed {trimmed} exercises')
    total = await db.exercises.count_documents({})
    print(f'Total exercises in library: {total}')

if __name__ == "__main__":
    asyncio.run(update_and_trim())
    client.close()
