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
      //.eq('name', liftName)
      .order('date', { ascending: false })
      //.limit(1);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      throw new Error('No data found');
    }

    const responseData = data[0];
    const record: LiftRecord = {
      lift: JSON.parse(responseData.data),
      id: responseData.id,
      date: new Date(responseData.date),
      name: responseData.name,
    };

    return record;
  };

  const recordLift = async (lift: LiftRecord) => {
    if (!user) {
      console.log('No user logged in - cannot save lift');
      return false;
    }
    console.log('Saving lift: ', lift);
    const { data, error } = await supabase
      .from('SweatSync.PreviousLifts')
      .upsert([
        {
          date: lift.date.toISOString(),
          name: lift.name,
          user: user.id,
          data: JSON.stringify(lift.lift),
        },
        { returning: 'minimal', onConflict: 'name'}
      ]);
  };

  const { data: previousLift } = useQuery<LiftRecord>(['previousLifts'], getPreviousLift);

  return { previousLifts: previousLift?.[0], recordLift };
}