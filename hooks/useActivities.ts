import { useEffect } from 'react';
import { supabase } from '../utils/initSupabase'
import useUser from './useUser';
import { QueryFunction, useQuery } from '@tanstack/react-query';

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
  
interface Workout {
    workoutStarted: Date;
    workoutEnded: Date;
    postWorkoutNote: string;
    exercises: Exercise[];
}
  
export interface ActivityRecord {
    id: number;
    type: string;
    title: string;
    data: Workout;
    date: Date;
}

export default function useActivities(begin: Date, end: Date) {
    const user = useUser();

    useEffect(() => {
        refetch();
    }, [user?.id, begin, end]);

    const { isLoading, error, data: activities, refetch } = useQuery({
        queryKey: ['activitiesList', { userId: user?.id, begin: begin, end: end }],
        queryFn: fetchActivities,
        refetchOnWindowFocus: true,
    });

    return activities;
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
            console.log("User is null - waiting to fetch activities.")
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
            .select('id, date, title, type, data')
            .eq('user', userId)
            .gte('date', begin.toISOString())
            .lte('date', end.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return [] as ActivityRecord[];
        }
        
        console.log("Activity Data: ", data);
        
        const activityRecords: ActivityRecord[] = data.map((row) => {
            const workout: Workout = {
                workoutStarted: new Date(row.data.workoutStarted),
                workoutEnded: new Date(row.data.workoutEnded),
                postWorkoutNote: row.data.postWorkoutNote,
                exercises: row.data.exercises.map(exercise => {
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
                })
              };

            const activityRecord: ActivityRecord = {
                id: row.id,
                type: row.type,
                title: row.title,
                data: workout,
                date: new Date(row.date)
            }

            return activityRecord;
        });

        console.log("Activity Records: ", activityRecords);
        return activityRecords;
    }