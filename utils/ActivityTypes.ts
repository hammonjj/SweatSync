export interface IWorkout {
    activityId: Number, // [NSNumber numberWithInt:[sample workoutActivityType]]
    activityName: Number, // [RCTAppleHealthKit stringForHKWorkoutActivityType:[sample workoutActivityType]]
    calories: Number, // [[sample totalEnergyBurned] doubleValueForUnit:[HKUnit kilocalorieUnit]]
    tracked: Boolean, // [[sample metadata][HKMetadataKeyWasUserEntered] intValue] !== 1
    sourceName: String, // [[[sample sourceRevision] source] name]
    sourceId: String, // [[[sample sourceRevision] source] bundleIdentifier]
    device: String, // [[sample sourceRevision] productType] or 'iPhone'
    distance: Number, // [[sample totalDistance] doubleValueForUnit:[HKUnit mileUnit]]
    start: String, // [RCTAppleHealthKit buildISO8601StringFromDate:sample.startDate];
    end: String, // [RCTAppleHealthKit buildISO8601StringFromDate:sample.endDate];
}