import { View, Text, TextComponent } from "react-native";
import { Button, Dialog, MD2Colors, Portal } from "react-native-paper";

interface IProps {
    visuble: boolean;
    close: () => void;
}
export default function AddWorkoutScreen(props) {
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
        <Dialog onDismiss={close} visible={props.visible} dismissable={false}>
          <Dialog.Title>Add Workout</Dialog.Title>
          <Dialog.Content>
            <Text>Add workout dialog</Text>
            </Dialog.Content>
          <Dialog.Actions>
            <Button color={MD2Colors.teal500} disabled>
              Disagree
            </Button>
            <Button onPress={close}>Agree</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>)
}