import { FlatList, RectButton, Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { SelectedStengthExercise } from "../screens/AddWorkoutScreen";
import { Animated, ListRenderItemInfo, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "react-native-paper";

interface IProps {
    exercises: SelectedStengthExercise[];
    removeExercise: (exerciseId: number) => void;
}

export default function StrengthExerciseList(props: IProps) {
    const [exercises, setExercises] = React.useState<SelectedStengthExercise[]>(props.exercises);
    console.log("StrengthExerciseList props.exercises: " + JSON.stringify(props.exercises));
    console.log("StrengthExerciseList exercises: " + JSON.stringify(exercises));
    
    useEffect(() => {
        setExercises(props.exercises);
    }, [props.exercises]);

    function onDeleteRow(deletedItem: SelectedStengthExercise) {
        props.removeExercise(deletedItem.exerciseId);
        //const filteredData = props.exercises.filter(item => item.exerciseId !== deletedItem.exerciseId);
        //setExercises(filteredData);
        console.log("Delete Exercise Pressed  Callback: " + deletedItem.exerciseId)
    }

    const SwipeableRow = ({ item, index }) => {
        return (
            <AppleStyleSwipeableRow item={item}>
                <Row item={item} />
            </AppleStyleSwipeableRow>
        );
    };
    
    const AppleStyleSwipeableRow = ({ children, item }) => {
        const renderRightActions = (progress, dragX) => {
            const trans = dragX.interpolate({
              inputRange: [0, 50, 100, 101],
              outputRange: [-20, 0, 0, 1],
            });

            return (
              <RectButton 
                style={styles.leftAction} 
                onPress={()=> {onDeleteRow(item)}}>
                    <Animated.Text style={[styles.actionText]}>Delete</Animated.Text>
              </RectButton>
            );
          };
    
        return (
            <Swipeable
                friction={2}
                leftThreshold={30}
                rightThreshold={40}
                renderRightActions={renderRightActions}
            >
                {children}
            </Swipeable>);
    }
    
    //exerciseName: string,
    //reps: number, 
    //sets: number, 
    //tracking: string
    const Row = ({ item }) => {
        //console.log("Row item: " + JSON.stringify(item));
    
        return (
            <TouchableOpacity onPress={() => console.log("Item pressed")} style={styles.rectButton}>
                <Text>{item.exerciseName} - Reps: {item.reps} - Sets: {item.sets} - Tracking: {item.tracking}</Text>
            </TouchableOpacity>
        );
      };

    return (
        <FlatList
            data={exercises} 
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => (
                <SwipeableRow item={item} index={index} />
            )} 
        />
    );
}



  const styles = StyleSheet.create({
    rectButton: {
      flex: 1,
      height: 80,
      paddingVertical: 10,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    separator: {
      backgroundColor: 'rgb(200, 199, 204)',
      height: StyleSheet.hairlineWidth,
    },
    fromText: {
      fontWeight: 'bold',
      backgroundColor: 'transparent',
    },
    messageText: {
      color: '#999',
      backgroundColor: 'transparent',
    },
    dateText: {
      backgroundColor: 'transparent',
      position: 'absolute',
      right: 20,
      top: 10,
      color: '#999',
      fontWeight: 'bold',
    },

    //Swipeable Row
    leftAction: {
        flex: 1,
        backgroundColor: '#497AFC',
        justifyContent: 'center',
      },
      actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
      },
  });