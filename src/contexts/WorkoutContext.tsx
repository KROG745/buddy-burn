import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export interface Workout {
  id: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  duration: string;
  goal?: string;
  location?: string;
  notes?: string;
  intensity: 'low' | 'medium' | 'high';
  completed?: boolean;
  completedAt?: Date;
}

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsForDate: (date: Date) => Workout[];
  getTodaysWorkouts: () => Workout[];
  getUpcomingWorkouts: () => Workout[];
  getRecentActivities: () => Workout[];
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      title: 'Morning Run',
      type: 'cardio',
      date: new Date(),
      time: '07:00',
      duration: '45',
      goal: 'Improve cardiovascular endurance',
      location: 'Central Park',
      intensity: 'medium',
      completed: true,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      title: 'Strength Training',
      type: 'strength',
      date: new Date(),
      time: '18:00',
      duration: '60',
      goal: 'Build upper body strength',
      location: 'Fitness Plus Gym',
      intensity: 'high',
      completed: true,
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      id: '3',
      title: 'Yoga Flow',
      type: 'flexibility',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '19:00',
      duration: '30',
      goal: 'Flexibility and relaxation',
      location: 'Zen Yoga Studio',
      intensity: 'low'
    }
  ]);

  const addWorkout = useCallback((workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString()
    };
    setWorkouts(prev => [...prev, newWorkout]);
  }, []);

  const updateWorkout = useCallback((id: string, updates: Partial<Workout>) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id ? { ...workout, ...updates } : workout
      )
    );
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  }, []);

  const getWorkoutsForDate = useCallback((date: Date) => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.toDateString() === date.toDateString();
    });
  }, [workouts]);

  const getTodaysWorkouts = useCallback(() => {
    return getWorkoutsForDate(new Date());
  }, [getWorkoutsForDate]);

  const getUpcomingWorkouts = useCallback(() => {
    const now = new Date();
    return workouts.filter(workout => 
      new Date(workout.date) >= now && !workout.completed
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [workouts]);

  const getRecentActivities = useCallback(() => {
    return workouts
      .filter(workout => workout.completed)
      .sort((a, b) => {
        const aTime = a.completedAt?.getTime() || 0;
        const bTime = b.completedAt?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [workouts]);

  const value: WorkoutContextType = useMemo(() => ({
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutsForDate,
    getTodaysWorkouts,
    getUpcomingWorkouts,
    getRecentActivities
  }), [workouts, addWorkout, updateWorkout, deleteWorkout, getWorkoutsForDate, getTodaysWorkouts, getUpcomingWorkouts, getRecentActivities]);

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};