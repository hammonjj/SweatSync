import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase'
import useUser from './useUser';
import { HealthValue } from 'react-native-health';

export type MetricType = "weight" | "bodyfat";

interface IMetrics {
    type: MetricType,
    value: number,
    unit: string,
    date: Date,
}

interface IMetricsTableData {
    date: Date,
    data: IMetrics[]
}

export default function useMetrics() {
    const user = useUser();
    const [metrics, setMetrics] = useState<IMetrics[]>([]);

    const processMetrics = async (type: MetricType, metrics: HealthValue[]) => {

    }

    //Convert this to useQuery later
    const fetchMetrics = async (month: Date) => {
        const { data, error } = await supabase
            .from('SweatSync.Metrics')
            .select('date, data')
            .eq('user', user?.id)
            .gte('date', month.toISOString())
            .lte('date', new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return;
        }
        
        const processedMetrics: IMetrics[] = data.map((metric: IMetricsTableData) => {
            const parsedData = loadjsonb(metric.data);

            return {
                type: parsedData.type,
                value: parsedData.value,
                unit: parsedData.unit,
                date: new Date(metric.date),
            }
        });

        setMetrics(processedMetrics);
    }

    return { metrics, processMetrics, fetchMetrics }
}