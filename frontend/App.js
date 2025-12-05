import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from './src/context/ThemeContext'; 

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import InitialSetupScreen from './src/screens/InitialSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import RecommendationScreen from './src/screens/RecommendationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SearchScreen from './src/screens/SearchScreen';
import PolicyDetailScreen from './src/screens/PolicyDetailScreen';
import NotificationScreen from './src/screens/NotificationScreen';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    async function hideSplash() {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await SplashScreen.hideAsync();
    }
    hideSplash();
  }, []);

  return (
    <ThemeProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="InitialSetup" component={InitialSetupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          
          <Stack.Screen name="MyPage" component={MyPageScreen} />
          <Stack.Screen name="Bookmark" component={BookmarkScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Recommendation" component={RecommendationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          
          <Stack.Screen name="Chatbot" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

registerRootComponent(App);