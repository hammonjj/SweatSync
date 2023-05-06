import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { ActivityRecord } from "../hooks/useActivities";
import { IconButton } from "react-native-paper";

export default function ActivitySummaryScreen({ route,  navigation }) {
    const [activityRecord, setActivityRecord] = React.useState<ActivityRecord>(route.params.activityRecord);

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon="record-circle-outline"
              size={25}
              onPress={() => {
                console.log("Record workout Pressed")
                //navigation.navigate("RecordWorkout", {});
              }} />
          ),
        });
      }, [navigation]);

    return (
        <View>
            <Text>Activity Summary Screen: {activityRecord.title}</Text>
        </View>
    );
}