import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
//import DropDownPicker from "react-native-dropdown-picker";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
//import DateTimePicker from '@react-native-community/datetimepicker';
//import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import CreateStrengthTrainingExercises from "../components/CreateStrengthTrainingExercises";

interface IProps {
    selectedDate: Date;

}
export default function AddWorkoutScreen_V2(props: IProps) {
    const [workoutTitle, setWorkoutTitle] = useState("");
    const [workoutDate, setWorkoutDate] = useState(props.selectedDate);
    const [workoutDuration, setWorkoutDuration] = useState(0);
    const [workoutDescription, setWorkoutDescription] = useState("");

    //Workout Type
    const [workoutTypeOpen, setWorkoutTypeOpen] = useState(false);
    const [workoutType, setWorkoutType] = useState<string>(null);
    const [workoutTypeItems, setWorkoutTypeItems] = useState([
        {label: 'Strength', value: 'strength'},
        {label: 'Run', value: 'run'}
    ]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    //Top Left Icon -> Cancel
    //Top Right Icon -> Save
    //Top Center Text -> Add Workout
    //
    //Fields to Add:
    //Title
    //Date
    //Type
    //  - If type is strength, ask for template
    //Planned Duration
    //Planned Distance
    //Workout Description
    //Save

    return (
        <View>
            <TextInput
                mode="outlined"
                label="Workout Title"
                style={styles.textInput}
                onChangeText={(text) => setWorkoutTitle(text)}
                value={workoutTitle}
                placeholder="Workout Title"
            />
            <DropDown
                label={"Workout Type"}
                mode={"outlined"}
                visible={workoutTypeOpen}
                showDropDown={() => setWorkoutTypeOpen(true)}
                onDismiss={() => setWorkoutTypeOpen(false)}
                value={workoutType}
                setValue={setWorkoutType}
                list={workoutTypeItems}
            />

            {/*TODO: Add Date Picker*/}
            
            {/*multiline={true}*/}
            <TextInput
                mode="outlined"
                label="Workout Description"
                style={styles.textInput}
                onChangeText={(text) => setWorkoutDescription(text)}
                value={workoutDescription}
                placeholder="Workout Description"
            />
            {workoutType === "strength" && <CreateStrengthTrainingExercises />}
        </View>)
        //<Button onPress={() => props.close(false)}>Cancel</Button>
        //<Button onPress={() => props.close(false)}>Save</Button>
}

const styles = StyleSheet.create({
    textInput: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        minWidth: 250,
    }
});