import React from "react";
import { SegmentedButtons } from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import { View, StyleSheet } from "react-native";
import { Moment } from "moment";
import useMetrics, { Metric } from "../hooks/useMetrics";
import useActivities, { ActivityRecord } from "../hooks/useActivities";


export default function CalendarContainer(props) {
    const [monthStartDate, setMonthStartDate] = React.useState(null);
    const [monthEndDate, setMonthEndDate] = React.useState(null);
    const [selectedButton, setSelectedButton] = React.useState('month');

    const metrics = useMetrics(monthStartDate, monthEndDate);
    const activities = useActivities(monthStartDate, monthEndDate);
    
    //console.log("CalendarContainer::Metrics: " + JSON.stringify(metrics));
    //console.log("CalendarContainer::Activities: " + JSON.stringify(activities));

    async function onMonthChange(momentDate: Moment) {
        console.log("onMonthChange: " + momentDate.toString());
        const startDate = new Date(momentDate.format('YYYY-MM-DD hh:mm'));
        const endDate = new Date((momentDate.add(momentDate.daysInMonth() - 1, 'days')).format('YYYY-MM-DD hh:mm'));

        setMonthStartDate(startDate);
        setMonthEndDate(endDate);

        props.onDateRangeChange(startDate, endDate);
    }   

    //Activities: Gray background for day circles
    //Metrics: Dark, small dot for just under the day number
    const customDatesStyles = createActivityCalendarStyles(activities, metrics);
    
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
                        customDatesStyles={customDatesStyles}
                    />
                </View>
            }
        </View>
    );
}

function createActivityCalendarStyles(activityRecords: ActivityRecord[], metrics: Metric[]) {
    let customDatesStyles = [];
    for(let i = 0; i < activityRecords.length; i++) {
        const activityRecord = activityRecords[i];

        //console.log("createActivityCalendarStyles: " + JSON.stringify(activityRecord));
        customDatesStyles.push({
            date: activityRecord.date,
            //style: {backgroundColor: '#000000'},
            style:{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderWidth: 1,
                //borderLeftWidth: 5,
                //borderRightWidth: 5,
                //borderBottomWidth: 10,
                //borderLeftColor: "transparent",
                //borderRightColor: "transparent",
              },
            textStyle: {color: 'black'}, // sets the font color
            containerStyle: [], // extra styling for day container
            allowDisabled: true, // allow custom style to apply to disabled dates
          }
        )
    };

    for(let i = 0; i < metrics.length; i++) {
        const metric = metrics[i];

        const matchingDate = customDatesStyles.find((dateStyle) => {
            return dateStyle.date.getTime() === metric.date.getTime();
        });
        
        if (matchingDate) {
            // The current date has a custom style, need to decide if going to overlay
        } else {
            // The current day does not have a custom style - apply metric style
            customDatesStyles.push({
                date: metric.date,
                textStyle: {color: 'black'}, // sets the font color
                containerStyle: [{backgroundColor: '#666666'}], // extra styling for day container
                allowDisabled: true, // allow custom style to apply to disabled dates
              }
            )
        }
    }

    

    return customDatesStyles;
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