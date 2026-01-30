"""
Seed featured workouts from the hardcoded data in the app.
This migrates existing featured workouts to the database.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Featured workouts data - matching the existing hardcoded data
FEATURED_WORKOUTS = [
    {
        "title": "Cardio Based",
        "mood": "Sweat / Burn Fat",
        "duration": "25–35 min",
        "badge": "Top pick",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/tfdiqbfo_download.png",
        "difficulty": "Intermediate",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Hill & Sprint",
                "equipment": "Stationary bike",
                "description": "Alternating seated climbs and standing sprints build explosive cardio power.",
                "battlePlan": "5 min warm-up at moderate resistance\n• 2 min seated climb (high resistance)\n• 1 min standing sprint (moderate resistance)\n• 2 min recovery spin\n• Repeat climb-sprint-recovery 3x\n• 5 min cool down",
                "duration": "20 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_fitness-app-ui/artifacts/fbe3z3jx_download%20%281%29.png",
                "intensityReason": "Hill climbs build leg strength while sprints maximize calorie burn",
                "difficulty": "intermediate",
                "workoutType": "Sweat / Burn Fat - Cardio Based",
                "moodCard": "Sweat / Burn Fat",
                "moodTips": [
                    {"icon": "speedometer", "title": "Maintain Cadence", "description": "Keep your pedaling cadence consistent during climbs for better muscle engagement."},
                    {"icon": "heart", "title": "Heart Rate Zone", "description": "Aim for 70-85% max heart rate during sprints, recover at 60% between intervals."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Hill Climb",
                "equipment": "Stair master",
                "description": "Progressive stair climbing builds cardiovascular endurance and leg strength.",
                "battlePlan": "3 min warm-up at level 4\n• 2 min at level 7\n• 1 min at level 10 (power steps)\n• 2 min at level 5 (recovery)\n• Repeat high-power-recovery 4x\n• 3 min cool down at level 3",
                "duration": "18 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_fitness-app-ui/artifacts/yjdyjdsw_sm.avif",
                "intensityReason": "Variable intensity stair climbing maximizes cardio adaptation",
                "difficulty": "intermediate",
                "workoutType": "Sweat / Burn Fat - Cardio Based",
                "moodCard": "Sweat / Burn Fat",
                "moodTips": [
                    {"icon": "body", "title": "Posture Check", "description": "Stand tall with slight forward lean. Avoid hunching over the machine."},
                    {"icon": "flame", "title": "Glute Activation", "description": "Press through your heels to maximize glute engagement on each step."}
                ]
            }
        ]
    },
    {
        "title": "Back & Bis Volume",
        "mood": "Muscle Gainer",
        "duration": "45–60 min",
        "badge": "Trending",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png",
        "difficulty": "Intermediate",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Chest-Support Row",
                "equipment": "Adjustable bench",
                "description": "Supported rows and flies promote strict contraction",
                "battlePlan": "4 rounds\n• 8 Chest-Supported Dumbbell Row\nRest 75-90s\n• 10 Incline Prone Reverse Fly\nRest 75-90s",
                "duration": "14-16 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/q6jestgn_download.png",
                "intensityReason": "Neutral spine from support isolates lats + traps",
                "difficulty": "intermediate",
                "workoutType": "Muscle Gainer - Back & Bis Volume",
                "moodCard": "Muscle Gainer",
                "moodTips": [
                    {"icon": "flash", "title": "Don't yank dumbbells-steady elbows driving back.", "description": "Controlled elbow drive maximizes lat activation over momentum."},
                    {"icon": "timer", "title": "Go light on reverse fly, pause 1s at top.", "description": "Peak contraction pause enhances rear delt development."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Slow Neg Row",
                "equipment": "T bar row machine",
                "description": "Time-under-tension row progression provides a challenging switchup",
                "battlePlan": "4 rounds\n• 8 Neutral Grip Row (3-4s eccentric)\nRest 90s after set",
                "duration": "12-14 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_0b65e409-b210-4730-af62-16b022c37685/artifacts/xdrugsxs_tr.jpg",
                "intensityReason": "3-4s eccentric tempo increases hypertrophy effect",
                "difficulty": "intermediate",
                "workoutType": "Muscle Gainer - Back & Bis Volume",
                "moodCard": "Muscle Gainer",
                "moodTips": [
                    {"icon": "trending-up", "title": "Explode to chest, lower slow & steady.", "description": "Fast concentric, slow eccentric maximizes muscle stimulus."},
                    {"icon": "timer", "title": "Keep weight lighter to maintain control.", "description": "Reduced load allows proper tempo execution and form."}
                ]
            },
            {
                "exerciseId": "",
                "order": 2,
                "name": "Pull-Up + Hold",
                "equipment": "Straight pull up bar",
                "description": "Combines pull-ups with a static hold for enhanced strength",
                "battlePlan": "3 rounds\n• 6 Pull-Ups\nEnd each set with a 3s hold at the top\nRest 90s after set",
                "duration": "12-14 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/toza6up4_pu.avif",
                "intensityReason": "Adds isometric hold to increase time under tension for growth",
                "difficulty": "intermediate",
                "workoutType": "Muscle Gainer - Back & Bis Volume",
                "moodCard": "Muscle Gainer",
                "moodTips": [
                    {"icon": "trending-up", "title": "Aim for unassisted reps.", "description": "Progressive overload with isometric challenge builds strength."},
                    {"icon": "timer", "title": "Hold chin above bar for 3 seconds.", "description": "Isometric hold maximizes time under tension and strength gains."}
                ]
            },
            {
                "exerciseId": "",
                "order": 3,
                "name": "Cable Negatives",
                "equipment": "Cable Machine",
                "description": "Negative bar curls grow size and total integrity",
                "battlePlan": "3 rounds\n• 8 Cable Bar Curls (3s eccentric)\nRest 75-90s",
                "duration": "12-14 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_fit-outdoor-views/artifacts/vqw55nvb_download%20%2818%29.png",
                "intensityReason": "Slow eccentrics amplify hypertrophy adaptation",
                "difficulty": "intermediate",
                "workoutType": "Muscle Gainer - Back & Bis Volume",
                "moodCard": "Muscle Gainer",
                "moodTips": [
                    {"icon": "flash", "title": "Drive up powerfully, lower 3s", "description": "Explosive concentric, controlled eccentric."},
                    {"icon": "fitness", "title": "Elbows fixed at torso sides", "description": "Locked elbows ensure bicep isolation."}
                ]
            },
            {
                "exerciseId": "",
                "order": 4,
                "name": "Narrow Curl",
                "equipment": "EZ Curl Bar",
                "description": "Close grip curls build stronger arm inner heads",
                "battlePlan": "4 rounds\n• 8-10 Narrow Grip EZ Curls\nRest 75-90s",
                "duration": "12-14 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_de06d55d-ac38-4152-bbf5-479c53d1fb22/artifacts/iskvqgub_download%20%284%29.png",
                "intensityReason": "Narrow grip overloads the biceps inner portion",
                "difficulty": "intermediate",
                "workoutType": "Muscle Gainer - Back & Bis Volume",
                "moodCard": "Muscle Gainer",
                "moodTips": [
                    {"icon": "hand-left", "title": "Keep palms inward, elbows close", "description": "Narrow grip targets inner biceps."},
                    {"icon": "trending-up", "title": "Pull bar to upper chest line", "description": "Full range maximizes muscle fiber recruitment."}
                ]
            }
        ]
    },
    {
        "title": "HIIT - Intense Full Body",
        "mood": "Sweat / Burn Fat",
        "duration": "45–55 min",
        "badge": "Intense",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/p7pyg0r0_download%20%289%29.png",
        "difficulty": "Advanced",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Kettlebell AMRAP 15",
                "equipment": "Kettlebells",
                "description": "Complete as many rounds as possible in 15 minutes.",
                "battlePlan": "AMRAP 15 minutes:\n• 10 double kettlebell swings\n• 8 alternating snatches (4 each side)\n• 6 goblet squat jumps\n• 4 Turkish get-ups (2 each side)\nNo scheduled rest-move continuously",
                "duration": "15 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/p7pyg0r0_download%20%289%29.png",
                "intensityReason": "Maximum intensity AMRAP combining power, agility, and complex movement patterns.",
                "difficulty": "advanced",
                "workoutType": "HIIT - Intense Full Body",
                "moodCard": "Sweat / Burn Fat",
                "moodTips": [
                    {"icon": "flash", "title": "Double Swing Power", "description": "Double swings-engage lats, keep wrists neutral throughout the movement."},
                    {"icon": "body", "title": "Turkish Get-up Control", "description": "Go slow on get-ups, stack joints overhead at each position."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Battle Rope Gauntlet",
                "equipment": "Battle Ropes",
                "description": "Extended high-intensity gauntlet testing advanced cardiovascular capacity.",
                "battlePlan": "Perform 4 rounds:\n• 30s alternating waves\n• 30s power slams\n• 30s side-to-side waves\n• 30s jumping jacks with ropes\n• 30s circles (15s each direction)\nRest 1 min between rounds",
                "duration": "24 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/eiulsyjf_download%20%285%29.png",
                "intensityReason": "Extended high-intensity gauntlet testing advanced cardiovascular capacity and rope mastery.",
                "difficulty": "advanced",
                "workoutType": "HIIT - Intense Full Body",
                "moodCard": "Sweat / Burn Fat",
                "moodTips": [
                    {"icon": "refresh", "title": "Rhythm Control", "description": "Keep steady rhythm across all rope patterns, even when fatigued."},
                    {"icon": "flash", "title": "Breathing Technique", "description": "Sync breathing pattern with wave count-exhale on each wave peak."}
                ]
            },
            {
                "exerciseId": "",
                "order": 2,
                "name": "Sled & Burpee Circuit",
                "equipment": "Sled",
                "description": "Ultimate challenge combining heavy sled work with burpees.",
                "battlePlan": "Perform 4 rounds:\n• 10m heavy sled push\n• 10 burpees\n• 10m backward sled drag\n• 10 burpees\nRest 1 min between rounds",
                "duration": "24 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/x5whpyy7_download%20copy.png",
                "intensityReason": "Ultimate challenge combining heavy sled work with burpees for maximum conditioning stress.",
                "difficulty": "advanced",
                "workoutType": "HIIT - Intense Full Body",
                "moodCard": "Sweat / Burn Fat",
                "moodTips": [
                    {"icon": "body", "title": "Burpee Transition", "description": "Drop tight into burpees-no sagging hips. Keep core braced."},
                    {"icon": "flash", "title": "Reset Power", "description": "Push explosively out of burpees and into the sled immediately."}
                ]
            }
        ]
    },
    {
        "title": "Power Lifting",
        "mood": "Build Explosion",
        "duration": "30–40 min",
        "badge": "Popular",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_3f3e12c6-013b-4158-b2e9-29980fb2b4f9/artifacts/o0vkrre5_download%20%289%29.png",
        "difficulty": "Intermediate",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Hang Clean Pull to Tall Shrug",
                "equipment": "Power Lifting Platform",
                "description": "Explosive hip extension with powerful shrug develops total body power.",
                "battlePlan": "5 sets\n• 5 Hang Clean Pulls with Tall Shrug\n• Focus on explosive hip drive\n• Arms stay straight until shrug\nRest 90-120s between sets",
                "duration": "12 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/9kehs3fb_Screenshot%202025-12-03%20at%204.15.03%E2%80%AFPM.png",
                "intensityReason": "Olympic lift derivative builds explosive power through triple extension",
                "difficulty": "intermediate",
                "workoutType": "Build Explosion - Power Lifting",
                "moodCard": "Build Explosion",
                "moodTips": [
                    {"icon": "flash", "title": "Hip Drive First", "description": "The power comes from snapping your hips forward, not pulling with arms."},
                    {"icon": "body", "title": "Triple Extension", "description": "Extend ankles, knees, and hips simultaneously for maximum power."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Push Press Launch",
                "equipment": "Power Lifting Platform",
                "description": "Explosive overhead press using leg drive for maximum power output.",
                "battlePlan": "5 sets\n• 5 Push Press\n• Quick dip, explosive drive\n• Lock out arms overhead\nRest 90-120s between sets",
                "duration": "10 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/1n6uft3o_pp.jpg",
                "intensityReason": "Leg-driven overhead press allows heavier loads than strict press",
                "difficulty": "intermediate",
                "workoutType": "Build Explosion - Power Lifting",
                "moodCard": "Build Explosion",
                "moodTips": [
                    {"icon": "trending-up", "title": "Vertical Path", "description": "Push your head through once the bar passes your face for proper lockout."},
                    {"icon": "flash", "title": "Speed Matters", "description": "The faster the dip-drive, the more weight you can move."}
                ]
            },
            {
                "exerciseId": "",
                "order": 2,
                "name": "Trap Bar Jump",
                "equipment": "Trap Hex Bar",
                "description": "Loaded jumps develop explosive lower body power.",
                "battlePlan": "4 sets\n• 6 Trap Bar Jumps\n• Use 50% deadlift max\n• Land softly, reset fully\nRest 90s between sets",
                "duration": "10 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/dpe352d2_tbj.webp",
                "intensityReason": "Loaded jumps bridge strength and explosive power development",
                "difficulty": "intermediate",
                "workoutType": "Build Explosion - Power Lifting",
                "moodCard": "Build Explosion",
                "moodTips": [
                    {"icon": "body", "title": "Soft Landing", "description": "Land with bent knees to absorb impact. Reset fully before each jump."},
                    {"icon": "flash", "title": "Max Intent", "description": "Jump as high as possible on every rep. Submaximal effort = submaximal results."}
                ]
            },
            {
                "exerciseId": "",
                "order": 3,
                "name": "Landmine Split Jerk Pop",
                "equipment": "Landmine Attachment",
                "description": "Landmine-loaded split jerk pops build single-leg explosive power.",
                "battlePlan": "4 sets\n• 4 per side Split Jerk Pops\n• Bar on shoulder, dip and explode\n• Land softly in split stance\nRest 90s between sets",
                "duration": "10 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_muscle-mapper-2/artifacts/40bblhga_lmspj.jpg",
                "intensityReason": "Angled path teaches leg drive and stable split catch safely",
                "difficulty": "intermediate",
                "workoutType": "Build Explosion - Power Lifting",
                "moodCard": "Build Explosion",
                "moodTips": [
                    {"icon": "body", "title": "Core Stability", "description": "Brace your core to prevent rotation. The landmine wants to twist you."},
                    {"icon": "flash", "title": "Reactive Power", "description": "Minimize time on the ground between reps for plyometric benefits."}
                ]
            }
        ]
    },
    {
        "title": "Pulls & Dips",
        "mood": "Calisthenics",
        "duration": "25–35 min",
        "badge": "Staff pick",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_healthtracker-133/artifacts/jiw9nz1m_download%20%282%29.png",
        "difficulty": "Intermediate",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Eccentric Lines",
                "equipment": "Pull up bar",
                "description": "Slow negative pull-ups build strength through controlled lowering.",
                "battlePlan": "5 sets\n• 3 Eccentric Pull-Ups\n• Jump to top position\n• Hold chin over bar 2 sec\n• Lower for 8 seconds\nRest 60-90s between sets",
                "duration": "10 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/7475d60t_chin%20ups.png",
                "intensityReason": "Eccentric training builds pulling strength even without full pull-up ability",
                "difficulty": "intermediate",
                "workoutType": "Calisthenics - Pulls & Dips",
                "moodCard": "Calisthenics",
                "moodTips": [
                    {"icon": "timer", "title": "Consistency", "description": "Each rep should take the same time. Don't speed up as you fatigue."},
                    {"icon": "fitness", "title": "Shoulder Engagement", "description": "Keep shoulders engaged even at the bottom. Don't just hang on joints."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Strict Pull",
                "equipment": "Pull up bar",
                "description": "Perfect form pull-ups with no kipping or swinging.",
                "battlePlan": "5 sets\n• Max Strict Pull-Ups\n• Dead hang start\n• No kipping or swinging\n• Lower with control (3 sec)\nRest 90s between sets",
                "duration": "12 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/kzuswott_download%20%2815%29.png",
                "intensityReason": "Strict form maximizes muscle activation and strength development",
                "difficulty": "advanced",
                "workoutType": "Calisthenics - Pulls & Dips",
                "moodCard": "Calisthenics",
                "moodTips": [
                    {"icon": "body", "title": "Dead Stop", "description": "Come to complete stop at bottom. No bouncing out of the hang."},
                    {"icon": "fitness", "title": "Elbow Path", "description": "Pull elbows down and back, not out to the sides."}
                ]
            },
            {
                "exerciseId": "",
                "order": 2,
                "name": "Eccentric Power",
                "equipment": "Parallel bars dip station",
                "description": "Slow descent dips with explosive push build upper body power.",
                "battlePlan": "4 sets\n• 6 Eccentric Power Dips\n• Lower for 5 seconds\n• Go below 90° elbow angle\n• Push back up explosively\nRest 60-90s between sets",
                "duration": "10 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_upper-body-enhance/artifacts/bhu7tjin_download%20%2814%29.png",
                "intensityReason": "Slow eccentric with explosive concentric builds strength and power",
                "difficulty": "intermediate",
                "workoutType": "Calisthenics - Pulls & Dips",
                "moodCard": "Calisthenics",
                "moodTips": [
                    {"icon": "body", "title": "Depth", "description": "Lower until shoulders are below elbows for full range of motion."},
                    {"icon": "flash", "title": "Explosive Push", "description": "Drive hard out of the bottom. Speed on the way up builds power."}
                ]
            }
        ]
    },
    {
        "title": "Hill Workout",
        "mood": "Get Outside",
        "duration": "30–40 min",
        "badge": "New",
        "heroImageUrl": "https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/zqqramht_download%20%2813%29.png",
        "difficulty": "Intermediate",
        "exercises": [
            {
                "exerciseId": "",
                "order": 0,
                "name": "Hill Power Mix",
                "equipment": "Hills",
                "description": "Hill sprint intervals build explosive leg power and cardio endurance.",
                "battlePlan": "10 min easy jog warm-up\n• Find a steep hill (30-60 sec climb)\n• Sprint up at 85% effort\n• Walk down for recovery\n• Repeat 6 times\n• 10 min easy jog cool-down",
                "duration": "25 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/zqqramht_download%20%2813%29.png",
                "intensityReason": "Hill sprints combine strength and cardio for complete conditioning",
                "difficulty": "intermediate",
                "workoutType": "Get Outside - Hill Workout",
                "moodCard": "Get Outside",
                "moodTips": [
                    {"icon": "body", "title": "Knee Drive", "description": "Lift knees high to engage hip flexors and glutes on the climb."},
                    {"icon": "heart", "title": "Recovery", "description": "Walk all the way down. Jogging down adds fatigue without building power."}
                ]
            },
            {
                "exerciseId": "",
                "order": 1,
                "name": "Sprint Only 30s",
                "equipment": "Hills",
                "description": "Short all-out sprints with full recovery maximize power output.",
                "battlePlan": "8 min easy jog warm-up\n• Find moderate incline\n• 30 sec all-out sprint\n• 90 sec walk recovery\n• Repeat 8 times\n• 5 min walk cool-down",
                "duration": "22 min",
                "imageUrl": "https://customer-assets.emergentagent.com/job_exercise-library-12/artifacts/8d9vosf3_download%20%2812%29.png",
                "intensityReason": "True max effort sprints with full recovery build explosive speed",
                "difficulty": "intermediate",
                "workoutType": "Get Outside - Hill Workout",
                "moodCard": "Get Outside",
                "moodTips": [
                    {"icon": "flash", "title": "Max Effort", "description": "30 seconds is short. Give it everything you have, every rep."},
                    {"icon": "timer", "title": "Full Recovery", "description": "Take the full 90 seconds. Partial recovery = partial effort on the next sprint."}
                ]
            }
        ]
    }
]

async def seed_featured_workouts():
    print("🌱 Seeding featured workouts...")
    
    # Check if workouts already exist
    existing_count = await db.featured_workouts.count_documents({})
    if existing_count > 0:
        print(f"⚠️  Found {existing_count} existing featured workouts.")
        response = input("Do you want to clear and re-seed? (y/n): ")
        if response.lower() != 'y':
            print("Skipping seeding.")
            return
        
        await db.featured_workouts.delete_many({})
        await db.featured_config.delete_many({})
        print("Cleared existing featured workouts.")
    
    # Insert workouts
    workout_ids = []
    for workout in FEATURED_WORKOUTS:
        workout_doc = {
            **workout,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "created_by": "system"
        }
        result = await db.featured_workouts.insert_one(workout_doc)
        workout_ids.append(str(result.inserted_id))
        print(f"✅ Created: {workout['mood']} - {workout['title']}")
    
    # Create featured config with all workouts
    config_doc = {
        "_id": "main",
        "schemaVersion": 1,
        "featuredWorkoutIds": workout_ids,
        "ttlHours": 12,
        "updatedAt": datetime.now(timezone.utc),
        "updatedBy": "system"
    }
    
    await db.featured_config.update_one(
        {"_id": "main"},
        {"$set": config_doc},
        upsert=True
    )
    
    print(f"\n🎉 Seeded {len(workout_ids)} featured workouts!")
    print(f"Featured order: {workout_ids}")
    print("\nWorkout IDs for reference:")
    for i, (workout, wid) in enumerate(zip(FEATURED_WORKOUTS, workout_ids)):
        print(f"  {i+1}. {workout['mood']} - {workout['title']}: {wid}")

if __name__ == "__main__":
    asyncio.run(seed_featured_workouts())
    client.close()
