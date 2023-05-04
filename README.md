# SweatSync

## Build Commands
npx react-native start -> for rebuilding Metro bundle

For installing native packages:
cd ios
pod install

# To Test Flight
Increase build number in app.json
eas build
eas submit

# To Native Expo
eas build --profile preview --platform ios

# Validate Output
eas build:inspect --platform ios --stage archive --output ~/dist/ --profile preview

## Code for Later
const weightDataResults = await getWeightDataAsync(startDate, endDate);
Get data for the current and previous months - should also call this on calendar load
  - Get Activity Data
  - Get Weight Data
const workoutData = await getWorkoutDataAsync(startDate, endDate);
props.setAnchorData(JSON.stringify(workoutData));
Alert.alert("Workout Data", JSON.stringify(workoutData));

const [weightValues, setWeightValues] = React.useState<HealthValue[]>([]);
    const [anchorData, setAnchorData] = React.useState(null);
    async function onDateChange(date: Date) {
        //Date is epoch time
        const formattedDate = new Date(date);
        console.log("Day Callback Date: " + formattedDate.toDateString());

        const startDate = new Date(2023, 3, 1);
        const endDate = new Date(2023, 3, 30);
/*
        const results = await getWeightDataAsync(startDate);

        for(let i = 0; i < results.length; i++) {
            console.log("Callback Weight Value: " + results[i].value);
        }

        setWeightValues(results);
*/
        //const anchorResults = await getAnchoredWorkoutsAsync(startDate, endDate);
        //setAnchorData(anchorResults.data);