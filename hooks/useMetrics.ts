import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase'
import useUser from './useUser';

export type MetricType = "weight" | "bodyfat";

export interface Metric {
    id: number,
    type: MetricType,
    value: number,
    unit: string,
    date: Date,
}

export default function useMetrics(begin: Date, end: Date) {
    const user = useUser();
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        if(!user) {
            console.log("User is null - waiting to fetching metrics.")
            return;
        }

        if(!begin) {
            begin = new Date();
            begin.setDate(0);
        }

        if(!end) {
            end = new Date(begin.getFullYear(), begin.getMonth() + 1, 0);
        }
        
        console.log("Fetching metrics from ", begin, " to ", end);
        fetchMetrics(begin, end);
    }, [begin, end, user]);

    //Convert this to useQuery later
    const fetchMetrics = async (begin: Date, end: Date) => {
        const { data, error } = await supabase
            .from('SweatSync.Metrics')
            .select('id, date, type, value, unit')
            .eq('user', user?.id)
            .gte('date', begin.toISOString())
            .lte('date', end.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return;
        }
        
        console.log("Metrics Data: ", data);
        
        const processedMetrics: Metric[] = data.map((row) => {
            const parsedMetric: Metric = {
                id: row.id,
                type: row.type,
                value: row.value,
                unit: getUnit(row.unit),
                date: new Date(row.date)
            }

            return parsedMetric;
        });

        setMetrics(processedMetrics);
    }

    return metrics;
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