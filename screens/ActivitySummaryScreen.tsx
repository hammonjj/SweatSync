import React from "react";
import { View, Text } from "react-native";
import useActivities, { ActivityRecord } from "../hooks/useActivities";
import { Appbar } from "react-native-paper";
import { Menu } from 'react-native-paper';


export default function ActivitySummaryScreen({ route,  navigation }) {
    const [activityRecord, setActivityRecord] = React.useState<ActivityRecord>(route.params.activityRecord);
    const [visible, setVisible] = React.useState(false);
    const {deleteActivity, saveActivityTemplate} = useActivities();
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {navigation.goBack()}} />
                <Appbar.Content title={activityRecord.title} />
                <Appbar.Action 
                    icon="record-circle-outline" 
                    onPress={() => {
                        navigation.navigate("RecordWorkout", { activityRecord: route.params.activityRecord });
                    }} 
                />
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={"dots-vertical" }onPress={openMenu}/>}>
                        <Menu.Item onPress={() => {
                            closeMenu();
                            saveActivityTemplate(activityRecord);
                        }} title="Save as Template" />
                        <Menu.Item onPress={() => {
                            deleteActivity(activityRecord);
                            navigation.navigate("Home");    
                        }} title="Delete" />
                </Menu>
            </Appbar.Header>
            <Text>Activity Summary Screen: {activityRecord.title}</Text>
        </View>
    );
}