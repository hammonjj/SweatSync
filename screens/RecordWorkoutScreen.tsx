import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ActivityRecord } from "../hooks/useActivities";
import { Surface, TextInput, Text, IconButton } from "react-native-paper";
import Stopwatch from "../components/Stopwatch";

export default function RecordWorkoutScreen({ route, navigation }) {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [activityRecord, setActivityRecord] = useState<ActivityRecord>(route.params.activityRecord);
    const [recordedActivityRecord, setRecordedActivityRecord] = useState<ActivityRecord>(null);

    useEffect(() => {
        console.log("Activity Record: ", activityRecord);
        const updatedActivityRecord: ActivityRecord  = {
            ...activityRecord
        };

        updatedActivityRecord.data.workoutEnded = new Date();
        setRecordedActivityRecord(updatedActivityRecord);
    }, []);

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon="plus"
              size={25}
              onPress={() => {
                const updatedActivityRecord: ActivityRecord = {
                    ...activityRecord
                };

                updatedActivityRecord.data.workoutEnded = new Date();

                console.info("Save Recorded Activity", updatedActivityRecord);
                //Save Activity Data
                setRecordedActivityRecord(updatedActivityRecord);
              }} />
          ),
        });
      }, [navigation, activityRecord]);

    return (
      <View style={styles.container}>
        {activityRecord.plannedData.exercises.map((exercise, index) => {
          return (
            <TouchableOpacity
              key={exercise.name}
              onPress={() => {
                setCurrentIndex(index === currentIndex ? null : index);
              }}
              activeOpacity={0.9}
              style={styles.cardContainer}
            >
              <View style={styles.card}>
                <Text style={styles.heading}>{exercise.name}</Text>
                {index === currentIndex && (
                  <View>
                    {Array.from({ length: exercise.plannedSets }, (_, i) => (
                        <View style={styles.horizontalSurfacesContainer} key={i}>
                            <Surface style={styles.horizontalSurface}>
                                <Text variant="displaySmall">Set #{i + 1}</Text>
                            </Surface>
                            <Surface style={styles.horizontalSurface}>
                                <TextInput
                                    style={{width: 75}}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    label="Reps"
                                    value={''}
                                    onChangeText={(text) => {}}
                                />
                            </Surface>
                            <Surface style={styles.horizontalSurface}>
                                <TextInput
                                    style={{width: 100}}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    label="Weight"
                                    value={''}
                                    onChangeText={(text) => {}}
                                />
                            </Surface>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
            </TouchableOpacity>
          );
        })}
        <Stopwatch />       
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        flexGrow: 1,
    },
    card: {
        flexGrow: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    horizontalSurfacesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //width: '100%',
        //marginBottom: 20,
        padding: 5,

      },
      horizontalSurface: {
        width: '30%',
      }
});