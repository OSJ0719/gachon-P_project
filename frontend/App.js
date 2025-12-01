import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

// 만든 화면들 가져오기
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen'; // 👈 새로 추가됨

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
        {/* 로그인 화면 */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* 회원가입 화면 */}
        <Stack.Screen name="Signup" component={SignupScreen} />
        
        {/* 🏠 홈 화면 (여기로 이동하게 됨) */}
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);