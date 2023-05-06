import useActivities, { ActivityRecord } from "./useActivities";
import useMetrics, { Metric } from "./useMetrics";

export default function useCalendar(begin: Date, end: Date) {
    const metrics = useMetrics(begin, end);
    const {activities} = useActivities(begin, end);
    
    //TODO: When the begin and end dates change, create a data structure that
    //is searchable that contains both activities and metrics for faster lookup
    function currentDay(day: Date): { metrics: Metric[] | null, activities: ActivityRecord[] | null } {
        //console.log("Day: ", day);
        const dt = new Date(day)
        const dayNumber = dt.getDate();

        let dailyMetrics: Metric[] = [];
        for(let i = 0; i < metrics.length; i++) {
            if(metrics[i].date.getDate() === dayNumber) {
                dailyMetrics.push(metrics[i]);
            }
        }

        let dailyActivities: ActivityRecord[] = [];
        for(let i = 0; i < activities.length; i++) {
            if(activities[i].date.getDate() === dayNumber) {
                dailyActivities.push(activities[i]);
            }
        }

        return {
            metrics: dailyMetrics,
            activities: dailyActivities
        }
    }

    return currentDay;
}