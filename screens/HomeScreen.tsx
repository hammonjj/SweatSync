import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import CalendarContainer from "../components/CalendarContainer";
import useCalendar from "../hooks/useCalendar";

export default function HomeScreen() {
    const [todaysMetric, setTodaysMetric] = React.useState(null);
    const [todaysActivity, setTodaysActivity] = React.useState(null);
    const [monthStartDate, setMonthStartDate] = React.useState(null);
    const [monthEndDate, setMonthEndDate] = React.useState(null);

    const currentDay = useCalendar(monthStartDate, monthEndDate);
    
    async function onDateChange(date: Date) {
        //Date is epoch time
        const formattedDate = new Date(date);
        console.log("Day Callback Date: " + formattedDate.toDateString());
        const { metric, activity } = await currentDay(date);
        setTodaysMetric(metric);
        setTodaysActivity(activity);
    }

    function onDateRangeChange(startDate: Date, endDate: Date) {
      setMonthStartDate(startDate);
      setMonthEndDate(endDate);
    }

    //Need to create activity/metric containers
    return (
        <View>
          <CalendarContainer onDateChange={onDateChange} onDateRangeChange={onDateRangeChange}/>
          <ScrollView>
            <Text>Activity Container</Text>
            
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