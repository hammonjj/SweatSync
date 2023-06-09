import { QueryFunction, useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/initSupabase";
import { useAuth } from "./useAuth";

export type ExerciseType = "strength";

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string; //I don't think this is needed
    name: string;
}

export default function useExercises() {
    const { user } = useAuth();

    const { isLoading, error, data: ExerciseList } = useQuery({
        queryKey: ['exerciseList', { userId: user?.id }],
        queryFn: fetchExerciseList
    });

    const addExercise = async (name: string, type: string) => {
        if(!user) {
            return;
        }

        const { data, error } = await supabase
            .from('SweatSync.Exercises')
            .insert([{ name: name, type: type, created_by: user.id }]);

        if(error) {
            console.log("Error adding exercise: ", error);
            return;
        }

        console.log("Added exercise: ", data);
    }

    return {ExerciseList, error, isLoading, addExercise};
}

const fetchExerciseList: QueryFunction<Exercise[], ["exerciseList", {
    userId: string;
    }]> = async ({queryKey}) => {

    console.log("Fetching exercises for user: ", queryKey[1].userId);

    if(!queryKey[1].userId) {   
        console.log("No user id provided - returning empty list");
        return [];
    }
    
    const { userId } = queryKey[1];
    const { data, error } = await supabase
        .from('SweatSync.Exercises')
        .select('id, name, type')
        .eq('created_by', userId); //Later will need to add a system user for default exercises

    if(error) {
        console.log("Error fetching exercises: ", error);
        return [];
    }
    
    const ret: Exercise[] = data.map((exercise) => {
        return {
            id: exercise.id,
            name: exercise.name,
            title: exercise.name,
            type: exercise.type
        }
    });

    return ret;
}