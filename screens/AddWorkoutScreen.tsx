import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
//import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
//import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { DatePickerInput } from 'react-native-paper-dates';
import CreateStrengthTrainingExercises from "../components/CreateStrengthTrainingExercises";
import StrengthExerciseList from "../components/StrengthExerciseList";
import useActivities, { PlannedActivityRecord, PlannedExercise, PlannedWorkout } from "../hooks/useActivities";

export interface SelectedStengthExercise {
    exerciseId: number, 
    exerciseName: string,
    reps: number, 
    sets: number, 
    tracking: string
}

export default function AddWorkoutScreen({ route,  navigation }) {
    const {saveActivity} = useActivities();
    const [workoutTitle, setWorkoutTitle] = useState("");
    console.log("AddWorkoutScreen Params: " + route.params.selectedDate);
    const [workoutDate, setWorkoutDate] = useState<Date>(route.params.selectedDate);
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

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon="plus"
              size={25}
              onPress={() => {
                saveCurrentActivity();
              }} /> //Add new activity
          ),
        });
      }, [navigation, selectedStrengthExercises, workoutTitle, workoutDate, workoutDuration, workoutDescription, workoutType]);

    async function saveCurrentActivity() {
        const plannedExercises: PlannedExercise[] = selectedStrengthExercises.map((exercise) => {
            return {
                name: exercise.exerciseName,
                unit: "imperial",
                plannedReps: exercise.reps,
                plannedSets: exercise.sets,
                tracking: exercise.tracking,
                type: "strength"
            }
        });
        
        let plannedWorkout: PlannedWorkout = {
            description: workoutDescription,
            exercises: plannedExercises
        }
        let plannedActivity: PlannedActivityRecord = {
            title: workoutTitle,
            date: workoutDate,
            //duration: workoutDuration,
            type: workoutType,
            data: plannedWorkout
        }

        const success = await saveActivity(plannedActivity);
        navigation.navigate("Home", {success: success, message: success ? "Activity Saved" : "Activity Failed to Save"});
    }

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

            <DatePickerInput
                locale="en"
                value={workoutDate}
                onChange={(d) => setWorkoutDate(d)}
                inputMode="end"
            />
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

        function onExerciseRemoved(exerciseId: number) {
            setSelectedStrengthExercises(prevState => prevState.filter(exercise => exercise.exerciseId !== exerciseId));
        }

        function onExerciseConfirmed(exerciseId: number, exerciseName: string, reps: number, sets: number, tracking: string) {
            console.log(`Exercise: ${exerciseId}, Reps: ${reps}, Sets: ${sets}, Tracking: ${tracking}`);

            if(exerciseId === 0) {
                console.log("Add New Exercise - Not yet implemented");
                //Create modal that takes a new string and save the exervcise
                return;
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