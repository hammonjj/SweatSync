import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, ActionSheetIOS } from "react-native";
import CalendarContainer from "../components/CalendarContainer";
import useCalendar from "../hooks/useCalendar";
import ActivityCard from "../components/ActivityCard";
import { IconButton, customText } from "react-native-paper";
import { ActivityRecord } from "../hooks/useActivities";
import MetricsCard from "../components/MetricsCard";
import { Metric } from "../hooks/useMetrics";
import { ActionSheetRef } from "react-native-actions-sheet";
import CalendarAddActionSheet from "../components/CalendarAddActionSheet";
import SaveDataSnackBar from "../components/SaveDataSnackBar";

const Text = customText<'customVariant'>();

export default function HomeScreen({ route, navigation }) {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [todaysMetrics, setTodaysMetrics] = React.useState<Metric[]>(null);
  const [todaysActivities, setTodaysActivities] = React.useState<ActivityRecord[]>(null);
  const [monthStartDate, setMonthStartDate] = React.useState(null);
  const [monthEndDate, setMonthEndDate] = React.useState(null);

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const currentDay = useCalendar(monthStartDate, monthEndDate);
  
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          size={25}
          onPress={() => {
            navigation.navigate("AddWorkout", {selectedDate: selectedDate});
          }} />
      ),
    });
  }, [navigation, selectedDate]);

  useEffect(() => {
    if(route.params && route.params.hasOwnProperty("success")) {
      setShowSnackbar(true);
      setSnackbarMessage(route.params.message);
    }
  }, [route.params]);

  function onDateChange(date: Date) {
      //Date is epoch time
      const formattedDate = new Date(date);

      //This needs to return a list of metrics and activities, not just one
      const { metrics, activities } = currentDay(formattedDate);
      
      setTodaysMetrics(metrics); 
      setTodaysActivities(activities);
      setSelectedDate(formattedDate);
    }

  function onDateRangeChange(startDate: Date, endDate: Date) {
    setTodaysActivities(null);
    setTodaysMetrics(null);
    setSelectedDate(null);
    setMonthStartDate(startDate);
    setMonthEndDate(endDate);
  }

  //Need to make it so swiping on the bottom container changes the selected date
  return (
      <View>
        <SaveDataSnackBar visible={showSnackbar} message={snackbarMessage}/>
        <CalendarAddActionSheet reference={actionSheetRef}/>
        <CalendarContainer onDateChange={onDateChange} onDateRangeChange={onDateRangeChange}/>
        <ScrollView>
          {selectedDate && 
            <Text variant="headlineLarge" style={styles.dateHeading}>{selectedDate.toDateString()}</Text>}
          
          {todaysActivities &&
            todaysActivities.map((activity: ActivityRecord) => {
              return <ActivityCard key={activity.id} record={activity} />
          })}
          
          {todaysMetrics &&
            todaysMetrics.map((metric: Metric) => {
              return <MetricsCard 
                key={metric.id}
                title={"Today's Metrics"} 
                description={metric.type + ": " + metric.value + metric.unit} 
                type={""} />})}
        </ScrollView>
      </View>
    );

    function showAddActionSheet() {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Add Activity', 'Add Metrics', 'Record Workout'],
          //destructiveButtonIndex: 0,
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            console.log('Cancel');
          } else if (buttonIndex === 1) {
            console.log('Add Activity');
            setActionSheetVisible(true);
          } else if (buttonIndex === 2) {
            console.log('Add Metrics');
          } else if (buttonIndex === 3) {
          console.log('Record Workout');
          }
        },
      );
    }
}

const styles = StyleSheet.create({
    button: {
      flex: 1,
    },
    dateHeading: {
      paddingHorizontal: 10,
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
