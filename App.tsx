import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme, configureFonts } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React from 'react';

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

import AppleHealthKit, {
  HealthKitPermissions
} from 'react-native-health'
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ActivitySummaryScreen from './screens/ActivitySummaryScreen';
import RecordWorkoutScreen from './screens/RecordWorkoutScreen';

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//Healthkit initialization
/* Permission options */
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.Weight,
      AppleHealthKit.Constants.Permissions.BodyMassIndex,
      AppleHealthKit.Constants.Permissions.BodyFatPercentage,
      AppleHealthKit.Constants.Permissions.LeanBodyMass,
      AppleHealthKit.Constants.Permissions.Workout,
  ],
    //write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions

AppleHealthKit.initHealthKit(permissions, (error: string) => {
  /* Called after we receive a response from the system */

  if(error) {
    console.log('[ERROR] Cannot grant permissions!')
  }
})

export default function App() {
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = true ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <View style={styles.container}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={combinedTheme}>
            <NavigationContainer theme={combinedTheme}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  <Stack.Screen name="Home" component={BottomBarNavigation} />
                  <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{headerShown: true}}/>
                  <Stack.Screen name="ActivitySummary" component={ActivitySummaryScreen} options={{headerShown: true}}/>
                  <Stack.Screen name="RecordWorkout" component={RecordWorkoutScreen} options={{headerShown: true}}/>
                </Stack.Navigator>
              </NavigationContainer>
          </PaperProvider>
        </QueryClientProvider>
      </AuthProvider>
    </View>
  );
}

function BottomBarNavigation() {
  const { session, user } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerStyle: {
          backgroundColor: 'rgb(77, 67, 87)',
        },
      })}>
      {session && user ? (
        <>
          <Tab.Screen 
            name="Dashboard" 
            component={HomeScreen} 
            options={{
              headerShown: true, //hide header -> Will need new add workout button before implementing
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}/>
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="cog" size={size} color={color} />;
              },
            }} />
        </>
      ) : (
        <>
          <Tab.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="account" size={size} color={color} />;
              },
            }}
            />
          <Tab.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{
              tabBarIcon: ({ color, size }) => {
                return <Icon name="account-plus" size={size} color={color} />;
              },
            }}
            />
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
