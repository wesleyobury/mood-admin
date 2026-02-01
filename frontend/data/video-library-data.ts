// Instructional Workout Video Library
// All exercise demonstration videos for reference

export interface VideoItem {
  id: string;
  name: string;
  category: string;
  equipment: string;
  videoUrl: string;
  muscleGroups: string[];
}

export const videoLibraryData: VideoItem[] = [
  // Barbell Exercises
  {
    id: 'bb-deadlift',
    name: 'Barbell Deadlift',
    category: 'Compound',
    equipment: 'Barbell',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/kzlwio26_BB%20deadlift.mov',
    muscleGroups: ['Back', 'Hamstrings', 'Glutes'],
  },
  {
    id: 'bb-front-squat',
    name: 'Barbell Front Squat',
    category: 'Compound',
    equipment: 'Barbell',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wxe55iww_BB%20front%20squat.mov',
    muscleGroups: ['Quads', 'Glutes', 'Core'],
  },
  {
    id: 'bb-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'Isolation',
    equipment: 'Barbell',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/j7wijuu5_BB%20hip%20thrust.mov',
    muscleGroups: ['Glutes', 'Hamstrings'],
  },
  {
    id: 'bb-lunge',
    name: 'Barbell Lunge',
    category: 'Compound',
    equipment: 'Barbell',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/jv2445o7_BB%20lunge.mov',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
  },
  {
    id: 'bb-sumo-deadlift',
    name: 'Barbell Sumo Deadlift',
    category: 'Compound',
    equipment: 'Barbell',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/wwxkoqjg_BB%20sumo%20deadlift.mov',
    muscleGroups: ['Glutes', 'Hamstrings', 'Back'],
  },
  // Cable Exercises
  {
    id: 'cable-face-pull',
    name: 'Cable Face Pull',
    category: 'Isolation',
    equipment: 'Cable Machine',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/5yzqau2v_Cable%20face%20pull.mov',
    muscleGroups: ['Shoulders', 'Back'],
  },
  {
    id: 'cable-glute-kickback',
    name: 'Cable Glute Kickback',
    category: 'Isolation',
    equipment: 'Cable Machine',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/3eaq9i4y_Cable%20Glute%20Kickback.mov',
    muscleGroups: ['Glutes'],
  },
  {
    id: 'cable-lat-pullover',
    name: 'Cable Lat Pullover',
    category: 'Isolation',
    equipment: 'Cable Machine',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7bwkj61d_Cable%20lat%20pullover.mov',
    muscleGroups: ['Back', 'Lats'],
  },
  {
    id: 'cable-overhead-tricep-extension',
    name: 'Cable Overhead Tricep Extension',
    category: 'Isolation',
    equipment: 'Cable Machine',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/7335p7s8_Cable%20overhead%20tricep%20extension.mov',
    muscleGroups: ['Triceps'],
  },
  {
    id: 'cable-rope-curl',
    name: 'Cable Rope Curl',
    category: 'Isolation',
    equipment: 'Cable Machine',
    videoUrl: 'https://customer-assets.emergentagent.com/job_954e4402-4776-4c5b-9208-0cdb91a40358/artifacts/ng6d8jlv_Cable%20rope%20curl.mov',
    muscleGroups: ['Biceps'],
  },
];

// Categories for filtering
export const videoCategories = ['All', 'Compound', 'Isolation'];

// Equipment types for filtering
export const videoEquipmentTypes = ['All', 'Barbell', 'Cable Machine'];

// Muscle groups for filtering
export const videoMuscleGroups = [
  'All',
  'Back',
  'Biceps',
  'Core',
  'Glutes',
  'Hamstrings',
  'Lats',
  'Quads',
  'Shoulders',
  'Triceps',
];
