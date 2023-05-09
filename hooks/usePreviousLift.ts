import { supabase } from '../utils/initSupabase';
import { useAuth } from './useAuth';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Lift {
    set: number;
    reps: number;
    weight: number;
}

export interface LiftRecord {
    id: number;
    date: Date;
    name: string;
    lift: Lift[];
}
export default function usePreviousLift() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const getPreviousLift: QueryFunction<LiftRecord> = async ({ queryKey }) => {
        const [liftName] = queryKey;
        console.log('getPreviousLift', liftName);
        const { data, error } = await supabase
            .from('SweatSync.PreviousLifts')
            .select('id, date, name, data')
            .eq('user', user?.id)
            .eq('name', liftName)
            .order('date', { ascending: false })
            .limit(1);

        if (error) {
            throw error;
        }

        const record: LiftRecord = {
            ...data,
            lift: JSON.parse(data.data)
        };
        
        return record;
    };

    const { data: previousLift } = useQuery(['previousLift', new Date()], getPreviousLift);

    return previousLift?.[0];
}
