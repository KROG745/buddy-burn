import { useState } from 'react';

export interface Exercise {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  rest?: string;
}

const exerciseLibrary: Record<string, Exercise[]> = {
  chest: [
    { id: '1', name: 'Barbell Bench Press', sets: '4', reps: '8-10', rest: '90s' },
    { id: '2', name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', rest: '90s' },
    { id: '3', name: 'Chest Flyes', sets: '3', reps: '12-15', rest: '60s' },
    { id: '4', name: 'Dips', sets: '3', reps: '8-12', rest: '90s' },
    { id: '5', name: 'Cable Crossovers', sets: '3', reps: '12-15', rest: '60s' },
  ],
  shoulders: [
    { id: '1', name: 'Overhead Press', sets: '4', reps: '8-10', rest: '90s' },
    { id: '2', name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '60s' },
    { id: '3', name: 'Front Raises', sets: '3', reps: '12-15', rest: '60s' },
    { id: '4', name: 'Rear Delt Flyes', sets: '3', reps: '12-15', rest: '60s' },
    { id: '5', name: 'Arnold Press', sets: '3', reps: '10-12', rest: '90s' },
  ],
  legs: [
    { id: '1', name: 'Barbell Squat', sets: '4', reps: '8-10', rest: '120s' },
    { id: '2', name: 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '90s' },
    { id: '3', name: 'Leg Press', sets: '3', reps: '12-15', rest: '90s' },
    { id: '4', name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
    { id: '5', name: 'Calf Raises', sets: '4', reps: '15-20', rest: '60s' },
  ],
  back: [
    { id: '1', name: 'Deadlift', sets: '3', reps: '5-8', rest: '120s' },
    { id: '2', name: 'Pull-ups', sets: '3', reps: '8-12', rest: '90s' },
    { id: '3', name: 'Barbell Row', sets: '4', reps: '8-10', rest: '90s' },
    { id: '4', name: 'Lat Pulldown', sets: '3', reps: '10-12', rest: '90s' },
    { id: '5', name: 'Cable Rows', sets: '3', reps: '12-15', rest: '60s' },
  ],
  arms: [
    { id: '1', name: 'Barbell Curl', sets: '3', reps: '10-12', rest: '60s' },
    { id: '2', name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '60s' },
    { id: '3', name: 'Hammer Curls', sets: '3', reps: '12-15', rest: '60s' },
    { id: '4', name: 'Overhead Tricep Extension', sets: '3', reps: '12-15', rest: '60s' },
    { id: '5', name: 'Cable Curls', sets: '3', reps: '12-15', rest: '60s' },
  ],
  abs: [
    { id: '1', name: 'Plank', duration: '60s', sets: '3', rest: '30s' },
    { id: '2', name: 'Crunches', sets: '3', reps: '20-25', rest: '30s' },
    { id: '3', name: 'Russian Twists', sets: '3', reps: '20-30', rest: '30s' },
    { id: '4', name: 'Leg Raises', sets: '3', reps: '12-15', rest: '30s' },
    { id: '5', name: 'Mountain Climbers', duration: '45s', sets: '3', rest: '30s' },
  ],
  'full-body': [
    { id: '1', name: 'Barbell Squat', sets: '3', reps: '8-10', rest: '90s' },
    { id: '2', name: 'Bench Press', sets: '3', reps: '8-10', rest: '90s' },
    { id: '3', name: 'Deadlift', sets: '3', reps: '5-8', rest: '120s' },
    { id: '4', name: 'Pull-ups', sets: '3', reps: '8-12', rest: '90s' },
    { id: '5', name: 'Overhead Press', sets: '3', reps: '8-10', rest: '90s' },
    { id: '6', name: 'Barbell Row', sets: '3', reps: '8-10', rest: '90s' },
  ],
  strength: [
    { id: '1', name: 'Barbell Squat', sets: '4', reps: '8-10', rest: '90s' },
    { id: '2', name: 'Bench Press', sets: '4', reps: '8-10', rest: '90s' },
    { id: '3', name: 'Deadlift', sets: '3', reps: '5-8', rest: '120s' },
    { id: '4', name: 'Overhead Press', sets: '3', reps: '8-10', rest: '90s' },
    { id: '5', name: 'Barbell Row', sets: '4', reps: '8-10', rest: '90s' },
    { id: '6', name: 'Pull-ups', sets: '3', reps: '8-12', rest: '90s' },
  ],
  running: [
    { id: '1', name: 'Warm-up Jog', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Main Run', duration: '20-30 min', rest: '2 min' },
    { id: '3', name: 'Cool-down Walk', duration: '5 min', rest: '' },
    { id: '4', name: 'Stretching', duration: '5 min', rest: '' },
  ],
  rowing: [
    { id: '1', name: 'Warm-up Row', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Main Row', duration: '20-30 min', rest: '2 min' },
    { id: '3', name: 'Cool-down', duration: '5 min', rest: '' },
  ],
  elliptical: [
    { id: '1', name: 'Warm-up', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Steady State', duration: '25-35 min', rest: '2 min' },
    { id: '3', name: 'Cool-down', duration: '5 min', rest: '' },
  ],
  'stair-climbing': [
    { id: '1', name: 'Warm-up', duration: '3 min', rest: '1 min' },
    { id: '2', name: 'Steady Climb', duration: '20-30 min', rest: '2 min' },
    { id: '3', name: 'Cool-down', duration: '5 min', rest: '' },
  ],
  yoga: [
    { id: '1', name: 'Sun Salutations', sets: '5', reps: 'Flow', rest: '30s' },
    { id: '2', name: 'Warrior Poses', duration: '3 min each', rest: '30s' },
    { id: '3', name: 'Tree Pose', duration: '2 min each side', rest: '15s' },
    { id: '4', name: 'Downward Dog', duration: '2 min', rest: '30s' },
    { id: '5', name: 'Pigeon Pose', duration: '3 min each side', rest: '30s' },
    { id: '6', name: 'Savasana', duration: '5 min', rest: '' },
  ],
  vinyasa: [
    { id: '1', name: 'Sun Salutation A', sets: '5', reps: 'Flow', rest: '30s' },
    { id: '2', name: 'Sun Salutation B', sets: '5', reps: 'Flow', rest: '30s' },
    { id: '3', name: 'Standing Sequence', duration: '10 min', rest: '1 min' },
    { id: '4', name: 'Balance Poses', duration: '5 min', rest: '30s' },
    { id: '5', name: 'Savasana', duration: '5 min', rest: '' },
  ],
  hatha: [
    { id: '1', name: 'Breathing Exercises', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Standing Poses', duration: '10 min', rest: '1 min' },
    { id: '3', name: 'Seated Poses', duration: '10 min', rest: '1 min' },
    { id: '4', name: 'Relaxation', duration: '10 min', rest: '' },
  ],
  'power-yoga': [
    { id: '1', name: 'Dynamic Warm-up', duration: '5 min', rest: '30s' },
    { id: '2', name: 'Power Flow', duration: '20 min', rest: '1 min' },
    { id: '3', name: 'Core Work', duration: '10 min', rest: '30s' },
    { id: '4', name: 'Cool-down & Stretch', duration: '5 min', rest: '' },
  ],
  'yin-yoga': [
    { id: '1', name: 'Butterfly Pose', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Dragon Pose', duration: '5 min each side', rest: '1 min' },
    { id: '3', name: 'Sphinx Pose', duration: '5 min', rest: '1 min' },
    { id: '4', name: 'Supine Twist', duration: '5 min each side', rest: '' },
  ],
  restorative: [
    { id: '1', name: 'Supported Child Pose', duration: '10 min', rest: '2 min' },
    { id: '2', name: 'Legs Up The Wall', duration: '10 min', rest: '2 min' },
    { id: '3', name: 'Supported Savasana', duration: '15 min', rest: '' },
  ],
  cycling: [
    { id: '1', name: 'Warm-up', duration: '5 min', rest: '' },
    { id: '2', name: 'Steady Pace', duration: '20-30 min', rest: '2 min' },
    { id: '3', name: 'Hill Intervals', sets: '4', duration: '2 min', rest: '1 min' },
    { id: '4', name: 'Cool-down', duration: '5 min', rest: '' },
  ],
  swimming: [
    { id: '1', name: 'Warm-up Freestyle', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Main Set - Freestyle', sets: '4', duration: '5 min', rest: '90s' },
    { id: '3', name: 'Backstroke', duration: '5 min', rest: '90s' },
    { id: '4', name: 'Cool-down', duration: '5 min', rest: '' },
  ],
  hiit: [
    { id: '1', name: 'Jumping Jacks', duration: '45s', rest: '15s' },
    { id: '2', name: 'Burpees', duration: '45s', rest: '15s' },
    { id: '3', name: 'Mountain Climbers', duration: '45s', rest: '15s' },
    { id: '4', name: 'High Knees', duration: '45s', rest: '15s' },
    { id: '5', name: 'Plank', duration: '60s', rest: '30s' },
    { id: '6', name: 'Jump Squats', duration: '45s', rest: '15s' },
  ],
  tabata: [
    { id: '1', name: 'Burpees', duration: '20s work / 10s rest', sets: '8', rest: '1 min' },
    { id: '2', name: 'Jump Squats', duration: '20s work / 10s rest', sets: '8', rest: '1 min' },
    { id: '3', name: 'Mountain Climbers', duration: '20s work / 10s rest', sets: '8', rest: '1 min' },
  ],
  'circuit-training': [
    { id: '1', name: 'Push-ups', sets: '3', reps: '15', rest: '30s' },
    { id: '2', name: 'Squats', sets: '3', reps: '20', rest: '30s' },
    { id: '3', name: 'Plank', duration: '45s', sets: '3', rest: '30s' },
    { id: '4', name: 'Lunges', sets: '3', reps: '12 each', rest: '30s' },
    { id: '5', name: 'Dips', sets: '3', reps: '12', rest: '30s' },
  ],
  'interval-training': [
    { id: '1', name: 'Sprint Intervals', duration: '30s sprint / 90s walk', sets: '8', rest: '2 min' },
    { id: '2', name: 'Recovery Walk', duration: '5 min', rest: '' },
  ],
  pilates: [
    { id: '1', name: 'The Hundred', reps: '100 breaths', rest: '30s' },
    { id: '2', name: 'Roll Up', sets: '3', reps: '10', rest: '30s' },
    { id: '3', name: 'Single Leg Circle', sets: '2', reps: '10 each', rest: '20s' },
    { id: '4', name: 'Rolling Like a Ball', sets: '3', reps: '10', rest: '30s' },
    { id: '5', name: 'Leg Stretch Series', sets: '2', reps: '10 each', rest: '20s' },
    { id: '6', name: 'Plank to Pike', sets: '3', reps: '10', rest: '30s' },
  ],
  'mat-pilates': [
    { id: '1', name: 'The Hundred', reps: '100 breaths', rest: '30s' },
    { id: '2', name: 'Roll Up', sets: '3', reps: '10', rest: '30s' },
    { id: '3', name: 'Single Leg Stretch', sets: '3', reps: '10 each', rest: '20s' },
    { id: '4', name: 'Criss Cross', sets: '3', reps: '10 each', rest: '20s' },
    { id: '5', name: 'Spine Stretch', sets: '3', reps: '10', rest: '30s' },
  ],
  reformer: [
    { id: '1', name: 'Footwork', sets: '3', reps: '15', rest: '30s' },
    { id: '2', name: 'Leg Circles', sets: '2', reps: '10 each', rest: '30s' },
    { id: '3', name: 'Long Stretch', sets: '3', reps: '10', rest: '30s' },
    { id: '4', name: 'Elephant', sets: '3', reps: '10', rest: '30s' },
  ],
  barre: [
    { id: '1', name: 'Pliés at Barre', sets: '3', reps: '20', rest: '30s' },
    { id: '2', name: 'Leg Lifts', sets: '3', reps: '15 each', rest: '30s' },
    { id: '3', name: 'Core Work', duration: '5 min', rest: '1 min' },
    { id: '4', name: 'Stretching', duration: '5 min', rest: '' },
  ],
  boxing: [
    { id: '1', name: 'Shadow Boxing Warm-up', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Jab-Cross Combo', sets: '4', duration: '2 min', rest: '1 min' },
    { id: '3', name: 'Heavy Bag Work', sets: '5', duration: '3 min', rest: '1 min' },
    { id: '4', name: 'Speed Bag', duration: '5 min', rest: '1 min' },
    { id: '5', name: 'Jump Rope', duration: '5 min', rest: '' },
  ],
  'heavy-bag': [
    { id: '1', name: 'Warm-up', duration: '3 min', rest: '1 min' },
    { id: '2', name: 'Jab-Cross Combos', sets: '5', duration: '3 min', rest: '1 min' },
    { id: '3', name: 'Power Punches', sets: '4', duration: '2 min', rest: '1 min' },
    { id: '4', name: 'Body Shots', sets: '3', duration: '2 min', rest: '1 min' },
  ],
  'speed-bag': [
    { id: '1', name: 'Warm-up', duration: '3 min', rest: '1 min' },
    { id: '2', name: 'Speed Bag Rounds', sets: '6', duration: '3 min', rest: '1 min' },
    { id: '3', name: 'Cool-down', duration: '3 min', rest: '' },
  ],
  'mitt-work': [
    { id: '1', name: 'Warm-up', duration: '3 min', rest: '1 min' },
    { id: '2', name: 'Mitt Rounds', sets: '5', duration: '3 min', rest: '1 min' },
    { id: '3', name: 'Defense Drills', sets: '3', duration: '2 min', rest: '1 min' },
  ],
  'shadow-boxing': [
    { id: '1', name: 'Footwork Drills', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Shadow Boxing Rounds', sets: '6', duration: '3 min', rest: '1 min' },
    { id: '3', name: 'Cool-down', duration: '3 min', rest: '' },
  ],
};

export const useExerciseGenerator = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const generateExercises = (workoutType: string): Exercise[] => {
    const generated = exerciseLibrary[workoutType.toLowerCase()] || [];
    setExercises([...generated]);
    return generated;
  };

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, ...updates } : ex
    ));
  };

  return {
    exercises,
    setExercises,
    generateExercises,
    addExercise,
    removeExercise,
    updateExercise,
  };
};
