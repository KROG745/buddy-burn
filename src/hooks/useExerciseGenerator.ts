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
  yoga: [
    { id: '1', name: 'Sun Salutations', sets: '5', reps: 'Flow', rest: '30s' },
    { id: '2', name: 'Warrior Poses', duration: '3 min each', rest: '30s' },
    { id: '3', name: 'Tree Pose', duration: '2 min each side', rest: '15s' },
    { id: '4', name: 'Downward Dog', duration: '2 min', rest: '30s' },
    { id: '5', name: 'Pigeon Pose', duration: '3 min each side', rest: '30s' },
    { id: '6', name: 'Savasana', duration: '5 min', rest: '' },
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
  pilates: [
    { id: '1', name: 'The Hundred', reps: '100 breaths', rest: '30s' },
    { id: '2', name: 'Roll Up', sets: '3', reps: '10', rest: '30s' },
    { id: '3', name: 'Single Leg Circle', sets: '2', reps: '10 each', rest: '20s' },
    { id: '4', name: 'Rolling Like a Ball', sets: '3', reps: '10', rest: '30s' },
    { id: '5', name: 'Leg Stretch Series', sets: '2', reps: '10 each', rest: '20s' },
    { id: '6', name: 'Plank to Pike', sets: '3', reps: '10', rest: '30s' },
  ],
  boxing: [
    { id: '1', name: 'Shadow Boxing Warm-up', duration: '5 min', rest: '1 min' },
    { id: '2', name: 'Jab-Cross Combo', sets: '4', duration: '2 min', rest: '1 min' },
    { id: '3', name: 'Heavy Bag Work', sets: '5', duration: '3 min', rest: '1 min' },
    { id: '4', name: 'Speed Bag', duration: '5 min', rest: '1 min' },
    { id: '5', name: 'Jump Rope', duration: '5 min', rest: '' },
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
