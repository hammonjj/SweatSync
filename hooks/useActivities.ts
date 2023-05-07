import { useEffect } from 'react';
import { supabase } from '../utils/initSupabase'
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFirstDayOfMonth, getLastDayOfMonth } from '../utils/DateUtils';
import { useAuth } from './useAuth';

interface ExerciseSet {
    id: number;
    reps: number;
    value: number | string; // value can be a number or a string depending on the exercise type (time vs. weight)
}
  
interface Exercise {
    name: string;
    noteForNextTime: string;
    unit: string;
    type: string;
    sets: ExerciseSet[];
}
  
export interface PlannedExercise {
    name: string;
    unit: string;
    type: string;
    tracking: string;
    plannedSets: number;
    plannedReps: number;
}

interface WorkoutData {
    workoutStarted?: Date;
    workoutEnded?: Date;
    postWorkoutNote?: string;
    exercises?: Exercise[];
}

export interface PlannedWorkout {
    description: string;
    exercises: PlannedExercise[];
}

export interface PlannedActivityRecord {
    type: string;
    title: string;
    data: PlannedWorkout;
    date: Date;
}

export interface ActivityRecord {
    id: number;
    type: string;
    title: string;
    data?: WorkoutData;
    plannedData?: PlannedWorkout;
    date: Date;
}

export default function useActivities(begin?: Date, end?: Date) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        refetch();
    }, [user?.id, begin, end]);

    const { isLoading, error, data: activities, refetch } = useQuery({
        queryKey: ['activitiesList', { userId: user?.id, begin: begin, end: end }],
        queryFn: fetchActivities,
        refetchOnWindowFocus: true,
    });

    const saveActivity = async (activity: PlannedActivityRecord) => {
        if(!user) {
            console.log("No user logged in - cannot save activity");
            return false;
        }
        console.log("Saving activity: ", activity);
        const { data, error } = await supabase
            .from('SweatSync.Activities')
            .insert([{ 
                date: activity.date.toISOString(), 
                title: activity.title,
                user: user.id, 
                type: activity.type,
                plannedData: activity.data, 
            }]);

        if(error) {
            console.log("Error adding activity: ", error);
            return false;
        }

        //Need to invalidate query key for this month
        queryClient.invalidateQueries(['activitiesList', { 
            userId: user?.id, 
            begin: getFirstDayOfMonth(activity.date), 
            end: getLastDayOfMonth(activity.date) 
        }]);

        console.log("Added activity");
        return true;
    }

    return {activities, saveActivity};
}

const fetchActivities: QueryFunction<ActivityRecord[], ["activitiesList", {
    userId: string;
    begin: Date;
    end: Date;
    }]> = async ({queryKey}) => {
        let userId = queryKey[1].userId;
        let begin = queryKey[1].begin;
        let end = queryKey[1].end;

        if(!userId) {
            return [] as ActivityRecord[];
        }

        if(!begin) {
            begin = new Date();
            begin.setDate(0);
        }

        if(!end) {
            end = new Date(begin.getFullYear(), begin.getMonth() + 2, 0);
        }

        const { data, error } = await supabase
            .from('SweatSync.Activities')
            .select('id, date, title, type, data, plannedData')
            .eq('user', userId)
            .gte('date', begin.toISOString())
            .lte('date', end.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return [] as ActivityRecord[];
        }
        
        const activityRecords: ActivityRecord[] = data.map((row) => {
            const workoutData: WorkoutData = {
                workoutStarted: row.data?.workoutStarted ? new Date(row.data?.workoutStarted) : undefined,
                workoutEnded: row.data?.workoutEnded ? new Date(row.data?.workoutEnded) : undefined,
                postWorkoutNote: row.data?.postWorkoutNote ?? "",
                exercises: parseExercises(row)
              };

            const plannedData: PlannedWorkout = {
                description: row.plannedData?.description ?? "",
                exercises: parsePlannedExercises(row)
            };

            const activityRecord: ActivityRecord = {
                id: row.id,
                type: row.type,
                title: row.title,
                data: workoutData,
                plannedData: plannedData,
                date: new Date(row.date)
            }

            return activityRecord;
        });

        //console.log("Activity Records: ", activityRecords);
        return activityRecords;
    }

function parsePlannedExercises(row: 
    { id: any; date: any; title: any; type: any; data: any; plannedData: any; }): PlannedExercise[] {
    
    if(!row.plannedData) {
        return [];
    }

    return row.plannedData.exercises.map(exercise => {
        const { name, unit, type, tracking, plannedSets, plannedReps } = exercise;
        return {
            name,
            unit,
            type,
            tracking,
            plannedSets,
            plannedReps
        };
    });
}

function parseExercises(row: { id: any; date: any; title: any; type: any; data: any; plannedData: any; }): Exercise[] {
    if(!row.data) {
        return [];
    }

    return row.data.exercises.map(exercise => {
        const { name, noteForNextTime, unit, type, sets } = exercise;
        return {
            name,
            noteForNextTime,
            unit,
            type,
            sets: sets.map(set => {
                const { id, reps, value } = set;
                return {
                    id,
                    reps,
                    value
                };
            })
        };
    });
}
