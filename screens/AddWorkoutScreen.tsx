import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
//import DropDownPicker from "react-native-dropdown-picker";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
//import DateTimePicker from '@react-native-community/datetimepicker';
//import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import CreateStrengthTrainingExercises from "../components/CreateStrengthTrainingExercises";
import StrengthExerciseList from "../components/StrengthExerciseList";

interface IProps {
    selectedDate: Date;
}

export interface SelectedStengthExercise {
    exerciseId: number, 
    exerciseName: string,
    reps: number, 
    sets: number, 
    tracking: string
}

export default function AddWorkoutScreen(/*props: IProps*/) {
    const [workoutTitle, setWorkoutTitle] = useState("");
    //const [workoutDate, setWorkoutDate] = useState(props.selectedDate);
    const [workoutDuration, setWorkoutDuration] = useState(0);
    const [workoutDescription, setWorkoutDescription] = useState("");
    const [selectedStrengthExercises, setSelectedStrengthExercises] = useState<SelectedStengthExercise[]>([]);

    //Workout Type
    const [workoutTypeOpen, setWorkoutTypeOpen] = useState(false);
    const [workoutType, setWorkoutType] = useState<string>(null);
    const [workoutTypeItems, setWorkoutTypeItems] = useState([
        {label: 'Strength', value: 'strength'},
        {label: 'Run', value: 'run'}
    ]);

    const [showDatePicker, setShowDatePicker] = useState(false);

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

            {/*TODO: Add Date Picker*/}
            
            {/*multiline={true}*/}
            <TextInput
                mode="outlined"
                label="Workout Description"
                multiline={true}
                style={styles.textInput}
                onChangeText={(text) => setWorkoutDescription(text)}
                value={workoutDescription}
                placeholder="Workout Description"
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
            {workoutType === "strength" && 
                <>
                    <CreateStrengthTrainingExercises onExerciseConfirmed={onExerciseConfirmed} />
                    <StrengthExerciseList exercises={selectedStrengthExercises} removeExercise={onExerciseRemoved}/>
                </>
            }
        </View>)
        //<Button onPress={() => props.close(false)}>Cancel</Button>
        //<Button onPress={() => props.close(false)}>Save</Button>
        function onExerciseRemoved(exerciseId: number) {
            setSelectedStrengthExercises(prevState => prevState.filter(exercise => exercise.exerciseId !== exerciseId));
            /*
            setSelectedStrengthExercises(prevState => {
                const index = prevState.findIndex(exercise => exercise.exerciseId === exerciseId);
                if (index !== -1) {
                    const newState = [...prevState];
                    newState.splice(index, 1);
                    return newState;
                }
                return prevState;
                });
            */
        }

        function onExerciseConfirmed(exerciseId: number, exerciseName: string, reps: number, sets: number, tracking: string) {
            console.log(`Exercise: ${exerciseId}, Reps: ${reps}, Sets: ${sets}, Tracking: ${tracking}`);

            if(exerciseId === 0) {
                console.log("Add New Exercise - Not yet implemented")
                return;
                //Add New Exercise
            }

            const newExercise: SelectedStengthExercise = {
                exerciseId: exerciseId,
                exerciseName: exerciseName,
                reps: reps,
                sets: sets,
                tracking: tracking
            }

            setSelectedStrengthExercises(prevState => [
                ...prevState,
                newExercise,
              ]);
        }
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