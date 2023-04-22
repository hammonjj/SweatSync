import AppleHealthKit, { AnchoredQueryResults, HealthInputOptions, HealthObserver, HealthValue } from "react-native-health";
import { IWorkout } from "./ActivityTypes";

export async function getWeightDataAsync(startDate: Date): Promise<HealthValue[]> {
    let options: HealthInputOptions = {
        //unit: 'pound', // optional; default 'pound'
        startDate: new Date(2023, 3, 1).toISOString(), // required
        //endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      }

      return new Promise((resolve, reject) => {
        AppleHealthKit.getWeightSamples(options, (err: Object, results: Array<HealthValue>) => {
            if (err) {
                console.log('error getting weight samples: ', err)
                reject(err);
            }

            console.log("Weight Samples: " + results);
            resolve(results);
        })}
    );
}
export async function getAnchoredWorkoutsAsync(start: Date, end: Date): Promise<AnchoredQueryResults> {
    let options2: HealthInputOptions = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        //type: HealthObserver.Workout, // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
      };

      return new Promise((resolve, reject) => {
        AppleHealthKit.getAnchoredWorkouts(options2, (err: Object, results: AnchoredQueryResults) => {
            console.log("Entered getAnchoredWorkouts");
            if (err) {
                console.log('error getting anchored workouts: ', err);
                reject(err);
                return;
            }

            console.log("Anchored Workouts Data: ", results.data);
            console.log("Anchored Workouts Anchor: ", results.anchor);

            resolve(results);
        })}
    );
}

export async function getWorkoutDataAsync(start: Date, end: Date): Promise<IWorkout[]> {
    let options: HealthInputOptions = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        type: HealthObserver.Running, // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
    }

    const healthkitResults: Promise<IWorkout[]> = new Promise((resolve, reject) => {
        AppleHealthKit.getSamples(options, (err: Object, results: Array<Object>) => {
            console.log("Entered getSamples");
            if(err) {
                console.log('error getting workout samples: ', err)
                reject(err);
                return;
            }

            console.log("Workout Samples: " + results);
            const workouts: IWorkout[] = results.map((result: any) => {
                return {
                    activityId: result.workoutActivityType,
                    activityName: result.workoutActivityType,
                    calories: result.totalEnergyBurned,
                    tracked: result.metadata.HKMetadataKeyWasUserEntered !== 1,
                    sourceName: result.sourceRevision.source.name,
                    sourceId: result.sourceRevision.source.bundleIdentifier,
                    device: result.sourceRevision.productType,
                    distance: result.totalDistance,
                    start: result.startDate,
                    end: result.endDate,
                }
            });

            resolve(workouts);
          })}
    );

    const results = await healthkitResults;
   const tmp: IWorkout[] = [];
    return results;
}