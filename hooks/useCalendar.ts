import useActivities, { ActivityRecord } from "./useActivities";
import useMetrics, { Metric } from "./useMetrics";

export default function useCalendar(begin: Date, end: Date) {
    const metrics = useMetrics(begin, end);
    const activities = useActivities(begin, end);
    
    function currentDay(day: Date): { metric: Metric | null, activity: ActivityRecord | null } {
        let metric: Metric = null;
        for(let i = 0; i < metrics.length; i++) {
            if(metrics[i].date.getDate() === day.getDate()) {
                metric = metrics[i];
            }
        }

        let activity: ActivityRecord = null;
        for(let i = 0; i < activities.length; i++) {
            if(activities[i].date.getDate() === day.getDate()) {
                activity = activities[i];
            }
        }

        return {
            metric: metric,
            activity: activity
        }
    }

    return currentDay;
}