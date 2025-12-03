// App.js

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

// 기존 화면
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';

// 🌟 새로 추가된 화면들 import
import MyPageScreen from './src/screens/MyPageScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import RecommendationScreen from './src/screens/RecommendationScreen';
import SettingsScreen from './src/screens/SettingsScreen';

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* 🌟 새 화면 등록 */}
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="Bookmark" component={BookmarkScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Recommendation" component={RecommendationScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        
        {/* 챗봇 화면 임시 (준비중) */}
        <Stack.Screen name="Chatbot" component={HomeScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);