import React from "react";
import { Snackbar } from "react-native-paper";

interface IProps {
    visible: boolean;
    message: string;
}

export default function SaveDataSnackBar(props: IProps) {
    const [visible, setVisible] = React.useState(props.visible);
    return (
        <Snackbar
            visible={visible}
            duration={3000}
            onDismiss={() => {setVisible(false)}}
        >
            {props.message}
        </Snackbar>
    );

}