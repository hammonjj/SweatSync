import { Ref } from "react";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { Text } from "react-native";

interface IProps {
    reference: Ref<ActionSheetRef>
}

export default function CalendarAddActionSheet(props: IProps) {
  return (
    <ActionSheet ref={props.reference}>
      <Text>Hi, I am here.</Text>
    </ActionSheet>
  );
}