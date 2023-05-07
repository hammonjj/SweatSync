import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { ActivityRecord } from "../hooks/useActivities";
import { IconButton } from "react-native-paper";

export default function ActivitySummaryScreen({ route,  navigation }) {
    const [activityRecord, setActivityRecord] = React.useState<ActivityRecord>(route.params.activityRecord);

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon="record-circle-outline"
                        size={25}
                        onPress={() => {
                            console.log("Record workout Pressed");
                            navigation.navigate("RecordWorkout", { activityRecord: route.params.activityRecord });
                        }} 
                    />
                    <IconButton
                        icon="dots-vertical" // Replace this with the actual icon name
                        size={25}
                        onPress={() => {
                            console.log("Second button Pressed");
                            //Create menu with options to edit or delete activity
                            
                        }} 
                    />
                </View>
          ),
        });
      }, [navigation]);

    return (
        <View>
            <Text>Activity Summary Screen: {activityRecord.title}</Text>
        </View>
    );
}