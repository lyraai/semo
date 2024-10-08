// Root.tsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserId } from './redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUserId, checkBackendConnection } from './service/api';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import { TabNavigator } from './TabNavigator'; // 导入 TabNavigator
import Question0Screen from './screens/Question0Screen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import QuestionFinalScreen from './screens/QuestionFinalScreen';
import TherapistSettingScreen from './screens/TherapistSettingScreen';
import ChatScreen from './screens/ChatScreen';
import MeditationScreen from './screens/MeditationScreen';
import DeepBreathingScreen from './screens/DeepBreathingScreen';
import DefaultHeader from './components/DefaultHeader';
import ChatHeader from './components/ChatHeader';

const Stack = createStackNavigator();

export default function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeUserId = async () => {
      try {
        await checkBackendConnection();
        let storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          const newUserId = await generateUserId();
          storedUserId = newUserId;
          await AsyncStorage.setItem('userId', newUserId);
        }
        dispatch(updateUserId(storedUserId)); // 将 userId 存储到 Redux 中
      } catch (error) {
        console.error('Failed to initialize user ID:', error);
      }
    };

    initializeUserId();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* 欢迎页面 */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        
        {/* 问卷页面 */}
        <Stack.Screen
          name="Question0"
          component={Question0Screen}
          options={{ header: () => <DefaultHeader title="问卷" /> }}
        />
        <Stack.Screen
          name="Question1"
          component={Question1Screen}
          options={{ header: () => <DefaultHeader title="问卷" /> }}
        />
        <Stack.Screen
          name="Question2"
          component={Question2Screen}
          options={{ header: () => <DefaultHeader title="问卷" /> }}
        />
        <Stack.Screen
          name="Question3"
          component={Question3Screen}
          options={{ header: () => <DefaultHeader title="问卷" /> }}
        />
        <Stack.Screen
          name="Question4"
          component={Question4Screen}
          options={{ header: () => <DefaultHeader title="问卷" /> }}
        />
        <Stack.Screen
          name="FinalScreen"
          component={QuestionFinalScreen}
          options={{ header: () => <DefaultHeader title="问卷完成" /> }}
        />
        <Stack.Screen
          name="TherapistSettingScreen"
          component={TherapistSettingScreen}
          options={{ header: () => <DefaultHeader title="疗愈师设置" /> }}
        />

        {/* 主页面，使用 TabNavigator */}
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }} // Header is handled by TabNavigator
        />

        {/* AI Chat 页面，使用自定义的 ChatHeader */}
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            header: () => <ChatHeader title="与 Semo 聊天" />,
          }}
        />

        {/* 冥想页面 */}
        <Stack.Screen
          name="Meditation"
          component={MeditationScreen}
          options={{
            headerTitle: 'Meditation',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
              height: 60,
            },
            headerTitleStyle: {
              color: '#fff',
            },
          }}
        />

        {/* 深呼吸页面 */}
        <Stack.Screen
          name="DeepBreathingScreen"
          component={DeepBreathingScreen}
          options={{ headerTitle: '' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
