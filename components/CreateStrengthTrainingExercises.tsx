import React, { useState,  } from "react";
import { View, Text, ActionSheetIOS, StyleSheet } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import useExercises from "../hooks/useExercises";
//import {Picker} from '@react-native-picker/picker';
//import DropDownPicker from 'react-native-dropdown-picker';
import DropDown from 'react-native-paper-dropdown';
import { IconButton, Surface, TextInput } from "react-native-paper";

export default function CreateStrengthTrainingExercises(props) {
    //Get Saved Exercises
    //EmptyResultComponent={<Text style={{ padding: 10, fontSize: 15 }}>Oops ¯\_(ツ)_/¯</Text>}
    //Typeable combobox or searchable text input
    //Plus Button to add exercise
    let selectedExerciseList: string[] = [];
    const {ExerciseList, isLoading} = useExercises();
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    //console.log(ExerciseList)

    const [open, setOpen] = useState(false);

    if(isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    
    //At some point I might need to convert to AutocompleteDropdown
    const itemList = ExerciseList.map((exercise) => {
        return { label: exercise.name, value: exercise.id }
    })
/*
<View>
            <DropDown
              label={'Exercise'}
              mode={'outlined'}
              visible={open}
              showDropDown={() => setOpen(true)}
              onDismiss={() => setOpen(false)}
              value={selectedExercise}
              setValue={setSelectedExercise}
              list={itemList}
            />
        <IconButton
            icon="delete"
            mode="contained"
            size={24}
            onPress={() => {}}
          />
        </View>
*/
    return (
        <View style={styles.horizontalSurfacesContainer}>
            <View style={styles.horizontalSurfaceLeft}>
                <DropDown
                    label={'Exercise'}
                    mode={'outlined'}
                    visible={open}
                    showDropDown={() => setOpen(true)}
                    onDismiss={() => setOpen(false)}
                    value={selectedExercise}
                    setValue={setSelectedExercise}
                    list={itemList}
                />
            </View>
            <View style={styles.horizontalSurfaceSets}>
                <TextInput
                    style={{width: 65}}
                    mode="outlined"
                    label="Sets"
                    onChangeText={(text) => setSets(parseInt(text))}
                    value={sets.toString()}
                    placeholder=""
                    maxLength={1}
                    keyboardType = 'number-pad'
                />
            </View>
            <View style={styles.horizontalSurfaceReps}>
                <TextInput
                    style={{width: 69}}
                    mode="outlined"
                    label="Reps"
                    onChangeText={(text) => setReps(parseInt(text))}
                    value={reps.toString()}
                    placeholder=""
                    maxLength={2}
                    keyboardType = 'number-pad'
                />
            </View>
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
  });