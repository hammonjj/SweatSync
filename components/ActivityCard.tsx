import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Card, IconButton, customText } from "react-native-paper";
import { ActivityRecord } from "../hooks/useActivities";
import { useNavigation } from "@react-navigation/native";

interface IProps {
    record: ActivityRecord;
}

const Text = customText<'customVariant'>();

export default function ActivityCard(props: IProps) {
    //type === weighttraining -> icon="weight"
    //console.log("ActivityCard: " + JSON.stringify(props.record));
    const navigation = useNavigation();
    
    const workoutDurationString = !props.record.data || !props.record.data.workoutStarted ? "" :
      `Duration: ${getActivityDuration(props.record.data.workoutStarted, props.record.data.workoutEnded)}`;
      
    return(
        <Card 
          style={styles.card} 
          mode='contained' 
          onPress={() => {
            navigation.navigate("ActivitySummary" as never, {activityRecord: props.record} as never);
          }}
          >
          <Card.Title
            title={props.record.title}
            subtitle={workoutDurationString}
            left={(props: any) => <Avatar.Icon {...props} icon="weight" />}
            right={(props: any) => (<IconButton {...props} icon="chevron-right"/>)}
          />
          {props.record.plannedData?.description && 
            <Card.Content>
                <Text variant="bodyMedium">
                    {props.record.plannedData?.description}
                </Text>
            </Card.Content>}
        </Card>
    );
}

function getActivityDuration(activityBegin: Date, activityEnd: Date) {
  const duration = activityEnd.getTime() - activityBegin.getTime();

  const hoursDiff = Math.floor(duration / (1000 * 60 * 60));
  const minutesDiff = Math.floor((duration / (1000 * 60)) % 60);
  const secondsDiff = Math.floor((duration / 1000) % 60);

  return hoursDiff.toString().padStart(2, '0') + ":" + 
    minutesDiff.toString().padStart(2, '0') + ":" + 
    secondsDiff.toString().padStart(2, '0');
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 4,
    },
    card: {
        marginHorizontal: 8,
        marginTop: 8,
    },
    chip: {
      margin: 4,
    },
    preference: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    button: {
      borderRadius: 12,
    },
  });