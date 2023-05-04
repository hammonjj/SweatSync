import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider, adaptNavigationTheme, configureFonts } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js'
import { supabase } from './utils/initSupabase'

import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';

import AppleHealthKit, {
  HealthKitPermissions
} from 'react-native-health'
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import AddWorkoutScreen_V2 from './screens/AddWorkoutScreen_v2';

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

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, []);
  
  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={combinedTheme}>
          <NavigationContainer theme={combinedTheme}>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={BottomBarNavigation} />
                <Stack.Screen name="AddWorkout" component={AddWorkoutScreen_V2} />
              </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );

/*
  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={combinedTheme}>
          <NavigationContainer theme={combinedTheme}>
            <Tab.Navigator
              screenOptions={({ route }: { route: any }) => ({
                headerStyle: {
                  backgroundColor: 'rgb(77, 67, 87)',
                },
              })}>
              {session && session.user ? (
                <>
                  <Tab.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{
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
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </View>
  );
  */
}

function BottomBarNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Calendar" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
