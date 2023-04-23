import React from "react";
import { SegmentedButtons } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import { View, StyleSheet, Alert } from "react-native";
import { Moment } from "moment";
import { getWeightDataAsync, getWorkoutDataAsync } from "../utils/AppleHealthKit";
import moment from "moment";


export default function CalendarContainer(props) {
    const [selectedButton, setSelectedButton] = React.useState('month');

    async function onMonthChange(momentDate: Moment) {
        console.log("CalendarContainer::OnMonthChange: " + momentDate.toString());
        const startDate = new Date(momentDate.format('YYYY-MM-DD hh:mm'));
        const endDate = new Date((momentDate.add(momentDate.daysInMonth() - 1, 'days')).format('YYYY-MM-DD hh:mm'));

        const weightDataResults = await getWeightDataAsync(startDate, endDate);
        //Get data for the current and previous months - should also call this on calendar load
        //  - Get Activity Data
        //  - Get Weight Data

        //const workoutData = await getWorkoutDataAsync(startDate, endDate);
        //props.setAnchorData(JSON.stringify(workoutData));
        //Alert.alert("Workout Data", JSON.stringify(workoutData));
    }   

    return (
        <View>
            <SegmentedButtons
                onValueChange={setSelectedButton}
                value={selectedButton}
                density="medium"
                style={styles.group}
                buttons={[
                    {
                        style: styles.button,
                        value: 'month',
                        label: 'Month',
                    },
                    {
                        style: styles.button,
                        value: 'week',
                        label: 'Week',
                        disabled: true,
                    },
                    {
                        style: styles.button,
                        value: 'hide',
                        label: 'Hide',
                    },
                ]}
            />

            {(selectedButton === "month" || selectedButton === "week") && 
                <View style={styles.calendarContainer}>
                    <CalendarPicker
                        showDayStragglers
                        //minDate={minDate} 
                        //maxDate={maxDate}
                        //startFromMonday={false}
                        onDateChange={props.onDateChange}
                        onMonthChange={onMonthChange}
                    />
                </View>
            }
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