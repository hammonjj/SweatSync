import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase'
import useUser from './useUser';

interface ExerciseSet {
    id: number;
    reps: number;
    value: number | string; // value can be a number or a string depending on the exercise type
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
    const [activities, setActivites] = useState<ActivityRecord[]>([]);

    useEffect(() => {
        if(!user) {
            console.log("User is null - waiting to fetch activities.")
            return;
        }

        if(!begin) {
            begin = new Date();
            begin.setDate(0);
        }

        if(!end) {
            end = new Date(begin.getFullYear(), begin.getMonth() + 2, 0);
        }
        
        console.log("Fetching activities from ", begin, " to ", end);
        fetchActivities(begin, end);
    }, [begin, end, user]);

    //Convert this to useQuery later
    const fetchActivities = async (begin: Date, end: Date) => {
        const { data, error } = await supabase
            .from('SweatSync.Activities')
            .select('id, date, title, type, data')
            .eq('user', user?.id)
            .gte('date', begin.toISOString())
            .lte('date', end.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return;
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
        setActivites(activityRecords);
    }

    return activities;
}

function getUnit(unit) {
    console.log("Unit: ", unit);
    switch(unit) {
        case "imperial":
            return "lb";
        case "metric":
            return "kg";
        default:
            return "--";
    }
}