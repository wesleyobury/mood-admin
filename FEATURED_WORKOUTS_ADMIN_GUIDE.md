# Featured Workouts Admin Guide

## How to Add/Edit Featured Workouts (< 2 minutes)

### Access the Editor
1. Log in as **admin** (username: `officialmoodapp`)
2. Go to **Profile** → **Admin Dashboard**
3. Under "Moderation Actions", tap **Featured Workouts**

### Managing the Featured Carousel

#### Reorder Featured Workouts
1. Long-press any workout in the "Featured Carousel Order" list
2. Drag to reorder
3. Tap **Publish** in the top-right to save

#### Add a Workout to Featured
1. Tap **Add** next to "Featured Carousel Order"
2. Select from available workouts
3. Tap **Publish** to make it live

#### Remove from Featured
1. Tap the red minus icon on any featured workout
2. This removes it from the carousel but keeps the workout in the database
3. Tap **Publish** to apply changes

### Creating New Workouts

1. Tap **Create New** in the "All Workouts" section
2. Fill in the form:
   - **Title** (required): e.g., "Back & Bis Volume"
   - **Mood Category** (required): Select from presets
   - **Duration**: e.g., "30-40 min"
   - **Badge** (optional): Top pick, Trending, New, etc.
   - **Difficulty**: Beginner, Intermediate, Advanced
   - **Hero Image URL** (optional): Cover image for carousel
   - **Exercises** (required): At least one

3. For each exercise, provide:
   - Name (required)
   - Equipment
   - Description
   - Battle Plan / Instructions
   - Duration
   - Image URL
   - Intensity Reason

4. Tap **Save** to create the workout
5. Add it to the featured carousel if desired

### Editing Existing Workouts
1. Tap the blue pencil icon on any workout
2. Make changes
3. Tap **Save**

### Deleting Workouts
1. Tap the red trash icon on any workout
2. Confirm deletion
3. Note: Cannot delete workouts that are currently featured

## Technical Notes

### Data Flow
- Featured config is cached in AsyncStorage with 12-hour TTL
- App shows cached data instantly on launch, refreshes in background
- Falls back to hardcoded workouts if API fails

### API Endpoints
- `GET /api/featured/config` - Get featured workout IDs (public)
- `POST /api/featured/workouts/batch` - Fetch workouts by ID (public)
- `PUT /api/featured/config` - Update featured config (admin only)
- `GET/POST/PUT/DELETE /api/featured/workouts` - CRUD workouts (admin only)

### Database Collections
- `featured_config` - Single document with `featuredWorkoutIds` array
- `featured_workouts` - Individual workout documents

## Troubleshooting

**Changes not appearing?**
- Pull-to-refresh on the home screen
- Wait up to 12 hours for TTL cache to expire
- Or clear app cache/reinstall

**Can't delete workout?**
- Remove it from featured carousel first, then delete

**Validation errors?**
- Ensure all workouts have at least one exercise
- Ensure featured list is not empty
