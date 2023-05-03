import { useState } from "react";
import { View, Text } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import useExercises from "../hooks/useExercises";

import {Picker} from '@react-native-picker/picker';

export default function CreateStrengthTrainingExercises(props) {
    //Get Saved Exercises
    //EmptyResultComponent={<Text style={{ padding: 10, fontSize: 15 }}>Oops ¯\_(ツ)_/¯</Text>}
    //Typeable combobox or searchable text input
    //Plus Button to add exercise
    const {ExerciseList, isLoading} = useExercises();
    const [selectedExercise, setSelectedExercise] = useState(null);

    console.log(ExerciseList)

    if(isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    
    /*
    <AutocompleteDropdown
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={true}
        //initialValue={{ id: '0' }}
        dataSet={ExerciseList} />
    */


    return (
        <View>
            
            <Picker
                selectedValue={selectedExercise}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedExercise(itemValue)
                }>
                {ExerciseList && ExerciseList.map((exercise) => {
                    return (
                        <Picker.Item label={exercise.name} value={exercise.id} />
                    )
                })}
            </Picker>

        </View>
    )
}
    
