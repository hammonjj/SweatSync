import React, { useState,  } from "react";
import { View, Text, StyleSheet } from "react-native";
import useExercises from "../hooks/useExercises";
import { Button } from "react-native-paper";
import SegmentedPicker from 'react-native-segmented-picker';

interface IProps {
    onExerciseConfirmed: (exerciseId: number, exerciseName: string, reps: number, sets: number, tracking: string) => void;
}

export default function CreateStrengthTrainingExercises(props: IProps) {
    const {ExerciseList, isLoading} = useExercises();

    /* Segmented Picker */
    const [showExercisePicker, setShowExercisePicker] = useState(false);
    const segmentedPicker = React.useRef();

    function onConfirm (selections) {
        setShowExercisePicker(false);
        const exerciseObj = ExerciseList.find((exercise) => (
            exercise.id == selections.exercise));

        props.onExerciseConfirmed(
            parseInt(selections.exercise), exerciseObj.name, selections.reps, selections.sets, selections.recordingType);
    }

    if(isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    
    //At some point I might need to convert to AutocompleteDropdown
    let itemList = ExerciseList.map((exercise) => {
        return { label: exercise.name, value: exercise.id.toString() }
    })

    itemList.unshift({ label: "Add New", value: "0" });

    return (
        <View>
            <Button
              mode="elevated"
              //buttonColor={color}
              onPress={() => {setShowExercisePicker(true)}}
              style={styles.button}
            >
              Add Exercise
            </Button>
            <SegmentedPicker
                ref={segmentedPicker}
                onConfirm={onConfirm}
                visible={showExercisePicker}
                //separatorStyle={{ backgroundColor: 'black' }}
                options={[
                {
                    key: 'exercise',
                    items: itemList
                },
                {
                    key: 'sets',
                    items: [
                        { label: '1 Set', value: '1' },
                        { label: '2 Sets', value: '2' },
                        { label: '3 Sets', value: '3' },
                        { label: '4 Sets', value: '4' },
                        { label: '5 Sets', value: '5' },
                    ],
                },
                {
                    key: 'reps',
                    items: [
                        { label: '1 Rep', value: '1' },
                        { label: '2 Reps', value: '2' },
                        { label: '3 Reps', value: '3' },
                        { label: '4 Reps', value: '4' },
                        { label: '5 Reps', value: '5' },
                        { label: '6 Reps', value: '6' },
                        { label: '7 Reps', value: '7' },
                        { label: '8 Reps', value: '8' },
                        { label: '9 Reps', value: '9' },
                        { label: '10 Reps', value: '10' },
                        { label: '11 Reps', value: '11' },
                        { label: '12 Reps', value: '12' },
                        { label: '13 Reps', value: '13' },
                        { label: '14 Reps', value: '14' },
                        { label: '15 Reps', value: '15' },
                        { label: '16 Reps', value: '16' },
                        { label: '17 Reps', value: '17' },
                        { label: '18 Reps', value: '18' },
                        { label: '19 Reps', value: '19' },
                        { label: '20 Reps', value: '20' },
                    ],
                },
                {
                    key: 'recordingType',
                    items: [
                        { label: 'Weight', value: 'weight' },
                        { label: 'Time', value: 'time' },
                    ],
                },
                ]}
            />
        </View>
    );
}
    
const styles = StyleSheet.create({
    horizontalSurfacesContainer: {
      flexDirection: 'row',
      width: '100%',
      marginBottom: 20,
      //padding: 10,
      //borderWidth: 1,
      //justifyContent: 'space-between',
    },
    horizontalSurfaceLeft: {
        width: '50%',
      },
    horizontalSurfaceSets: {
        width: '20%',
    },
    horizontalSurfaceReps: {
        width: '20%',
    },
    button: {
        margin: 4,
    },
  });