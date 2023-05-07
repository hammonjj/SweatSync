import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import useActivities, { ActivityRecord, ExerciseSet } from "../hooks/useActivities";
import { Surface, TextInput, Text, IconButton } from "react-native-paper";
import Stopwatch from "../components/Stopwatch";

export default function RecordWorkoutScreen({ route, navigation }) {
    const {recordActivity} = useActivities();
    const [currentIndex, setCurrentIndex] = useState(null);
    const [activityRecord, setActivityRecord] = useState<ActivityRecord>(route.params.activityRecord);
    const [recordedActivityRecord, setRecordedActivityRecord] = useState<ActivityRecord>(null);

    useEffect(() => {
        console.log("Activity Record: ", activityRecord);
        const updatedActivityRecord: ActivityRecord  = {
            ...activityRecord
        };

        if (!updatedActivityRecord.data) {
            updatedActivityRecord.data = {
              workoutStarted: new Date(),
              workoutEnded: undefined,
              postWorkoutNote: undefined,
              exercises: [],
            };
        }

        activityRecord.plannedData.exercises.forEach(element => {
            const sets: ExerciseSet[] = Array.from({ length: element.plannedSets }, (_, index) => ({
                id: index,
                reps: 0,
                value: 0,
            }));

            for (let index = 0; index < sets.length; index++) {
                sets[index].id = index;
                sets[index].reps = 0;
                sets[index].value = element.tracking === "weight" ? 0 : "";
            }
            
            updatedActivityRecord.data.exercises.push({
                name: element.name,
                unit: "imperial",
                sets: sets,
                type: "strength",
                noteForNextTime: "",
            });
        });

        //updatedActivityRecord.data.workoutStarted = new Date();
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
                    ...recordedActivityRecord
                };

                updatedActivityRecord.data.workoutEnded = new Date();
                recordActivity(updatedActivityRecord);
                setRecordedActivityRecord(updatedActivityRecord);
                navigation.navigate("Home");
              }} />
          ),
        });
      }, [navigation, recordedActivityRecord]);

      if(!recordedActivityRecord) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
      }
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
                                    value={recordedActivityRecord.data.exercises.find((e) => e.name === exercise.name).sets[i].reps.toString()}
                                    onChangeText={(text) => {
                                        const updatedRecord = { ...recordedActivityRecord };
                                        const currentExercise = updatedRecord.data.exercises.find((e) => e.name === exercise.name);
                                        currentExercise.sets[i].reps = parseInt(text);
                                        setRecordedActivityRecord(updatedRecord);
                                    }}
                                    //disabled={(
                                    //    i === 0 ? false : recordedActivityRecord.data.exercises.find((e) => e.name === exercise.name).sets[i-1].reps < 1
                                    //)}
                                />
                            </Surface>
                            <Surface style={styles.horizontalSurface}>
                                <TextInput
                                    style={{width: 85}}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    label={exercise.tracking === "weight" ? "Weight" : "Time"}
                                    value={recordedActivityRecord.data.exercises.find((e) => e.name === exercise.name).sets[i].value.toString()}
                                    onChangeText={(text) => {
                                        const updatedRecord = { ...recordedActivityRecord };
                                        const currentExercise = updatedRecord.data.exercises.find((e) => e.name === exercise.name);
                                        currentExercise.sets[i].value = parseInt(text);
                                        setRecordedActivityRecord(updatedRecord);
                                    }}
                                />
                            </Surface>
                            <Surface style={styles.horizontalSurface}>
                                <Text variant="displaySmall">Prev.</Text>
                            </Surface>
                      </View>
                    ))}
                    <TextInput
                        mode="outlined"
                        label="Lift Notes"
                        value={recordedActivityRecord.data.exercises.find((e) => e.name === exercise.name).noteForNextTime}
                        onChangeText={(text) => {
                            const updatedRecord = { ...recordedActivityRecord };
                            const currentExercise = updatedRecord.data.exercises.find((e) => e.name === exercise.name);
                            currentExercise.noteForNextTime = text;
                            setRecordedActivityRecord(updatedRecord);
                        }}
                    />
                  </View>
                )}
              </View>
              
            </TouchableOpacity>
          );
        })}
        <TextInput
            mode="outlined"
            label="Post Workout Notes"
            value={recordedActivityRecord.data.postWorkoutNote}
            style={{marginBottom: 20}}
            onChangeText={(text) => {
                const updatedRecord = { ...recordedActivityRecord };
                updatedRecord.data.postWorkoutNote = text;
                setRecordedActivityRecord(updatedRecord);
            }}
        />
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
        paddingTop: 3,
      },
      horizontalSurface: {
        width: '27%',
      }
});