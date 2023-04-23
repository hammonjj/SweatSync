import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import CalendarContainer from "../components/CalendarContainer";
import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions,
  } from 'react-native-health'
import { getAnchoredWorkoutsAsync, getWeightDataAsync } from "../utils/AppleHealthKit";

export default function HomeScreen() {
    const [weightValues, setWeightValues] = React.useState<HealthValue[]>([]);
    const [anchorData, setAnchorData] = React.useState(null);
    async function onDateChange(date: Date) {
        //Date is epoch time
        const formattedDate = new Date(date);
        console.log("Day Callback Date: " + formattedDate.toDateString());

        const startDate = new Date(2023, 3, 1);
        const endDate = new Date(2023, 3, 30);
        const results = await getWeightDataAsync(startDate);

        for(let i = 0; i < results.length; i++) {
            console.log("Callback Weight Value: " + results[i].value);
        }

        setWeightValues(results);

        const anchorResults = await getAnchoredWorkoutsAsync(startDate, endDate);
        setAnchorData(anchorResults.data);
    }

    return (
        <View>
          <CalendarContainer onDateChange={onDateChange} anchorData={setAnchorData}/>
          <ScrollView>
            <Text>Activity Container</Text>
            {weightValues.length === 0 ? (<Text>No Values</Text>) : weightValues.map((value) => (
              <Text key={value.id}>{value.value} - {value.startDate}</Text>
            ))}
            {!anchorData && <Text>No Anchor Data</Text>}
            {anchorData && <Text>Anchor Data: {JSON.stringify(anchorData)}</Text>}
          </ScrollView>
        </View>
      );
}

const styles = StyleSheet.create({
    button: {
      flex: 1,
      //borderRadius: 5,
    },
    group: { 
        paddingHorizontal: 20, 
        paddingTop: 8,
        paddingBottom: 8,
        justifyContent: 'center' 
    },
    calendarContainer: {
        backgroundColor: "#4d4357",
    },
    activityContainer: {
        flex: 1,
        justifyContent: 'center',
    }
  });