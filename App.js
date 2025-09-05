
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Remindmy from './Screens/Remindmy';  
import TodoList from './Screens/TodoList';
import Record from'./Screens/Record'; 
import MapScreen from './Screens/Map';

import { View } from 'react-native'; 
import * as Permissions from 'expo-permissions';
// Create a stack navigator
const Stack = createStackNavigator();

// Main navigator component
export default function MainNavigator() {
  return (
    // Wrap the app in a NavigationContainer to enable navigation
    <NavigationContainer>
      {/* Stack Navigator */}
      <Stack.Navigator initialRouteName="Remindmy">
        {/* Screen for Remindmy */}
        <Stack.Screen name="Remindmy" component={Remindmy} />

        {/* Screen for TodoList */}
        <Stack.Screen name="TodoList" component={TodoList} />

        {/* Screen for Record */}
        <Stack.Screen name="Record" component={Record} />
        {/*Screen for MapScreen*/}
       <Stack.Screen name="Map" component={MapScreen} />
     

      </Stack.Navigator>
    </NavigationContainer>
  );
}