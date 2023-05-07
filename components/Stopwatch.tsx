import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const Stopwatch: React.FC = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 10);
      }, 10);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timer]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleStopwatchEvent = () => {
    if (isActive) {
      handleStop();
    } else {
      handleStart();
    }
  };

  const handleClearTimer = () => {
    setTimer(0);
    handleStop();
  };

  const formatTime = (timer: number) => {
    const minutes = Math.floor(timer / 6000);
    const seconds = Math.floor((timer - minutes * 6000) / 100);
    const milliseconds = timer % 100;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <TouchableOpacity onPress={handleStopwatchEvent}>
        <View style={styles.container} >
          <Text style={styles.timeText}>{formatTime(timer)}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttons}>
      <TouchableOpacity onPress={handleClearTimer} style={styles.stopButton}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
      </View>   
  </> 
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

  },
  timer: {
    //flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 40,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    width: 30,
    //textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  startButton: {
    backgroundColor: 'green',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default Stopwatch;
