import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

interface IProps {
    selectedDate: Date;
    visible: boolean;
    close: (boolean) => void;
}
export default function AddWorkoutScreen(props: IProps) {
    const [workoutTitle, setWorkoutTitle] = useState("");
    const [workoutDate, setWorkoutDate] = useState(props.selectedDate);
    const [workoutDuration, setWorkoutDuration] = useState(0);
    const [workoutDescription, setWorkoutDescription] = useState("");
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
        <Portal>
            <Dialog visible={props.visible} dismissable={false}>
                <Dialog.Title>Add Workout</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Workout Title"
                        style={styles.textInput}
                        onChangeText={(text) => setWorkoutTitle(text)}
                        value={workoutTitle}
                        placeholder="Workout Title"
                    />
                    {/*TODO: Add Date Picker*/}
                    {/*TODO: Workout Type*/}
                    {/*multiline={true}*/}
                    <TextInput
                        mode="flat"
                        
                        label="Workout Description"
                        style={styles.textInput}
                        onChangeText={(text) => setWorkoutDescription(text)}
                        value={workoutDescription}
                        placeholder="Workout Description"
                    />
                    <Text>Add workout dialog: {props.selectedDate.toDateString()}</Text>
                    </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => props.close(false)}>Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>)
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