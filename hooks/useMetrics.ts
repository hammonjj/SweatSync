import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase'
import useUser from './useUser';
import { QueryFunction, useQuery } from '@tanstack/react-query';

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

    useEffect(() => {
        refetch();
    }, [user?.id, begin, end]);

    const { isLoading, error, data: metrics, refetch } = useQuery({
        queryKey: ['metricsList', { userId: user?.id, begin: begin, end: end }],
        queryFn: fetchMetrics,
        refetchOnWindowFocus: true,
    });
    
    return metrics;
}

function getUnit(unit) {
    switch(unit) {
        case "imperial":
            return "lb";
        case "metric":
            return "kg";
        default:
            return "--";
    }
}

const fetchMetrics: QueryFunction<Metric[], ["metricsList", {
    userId: string;
    begin: Date;
    end: Date;
    }]> = async ({queryKey}) => {
        let userId = queryKey[1].userId;
        let begin = queryKey[1].begin;
        let end = queryKey[1].end;

        if(!userId) {
            console.log("User is null - waiting to fetch metrics.")
            return [] as Metric[];
        }

        if(!begin) {
            begin = new Date();
            begin.setDate(0);
        }

        if(!end) {
            end = new Date(begin.getFullYear(), begin.getMonth() + 2, 0);
        }

        const { data, error } = await supabase
            .from('SweatSync.Metrics')
            .select('id, date, type, value, unit')
            .eq('user', userId)
            .gte('date', begin.toISOString())
            .lte('date', end.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.log("Error fetching metrics: ", error);
            return [] as Metric[];
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

        return processedMetrics;
    }