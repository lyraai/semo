// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUserId, checkBackendConnection } from './service/api';
import WelcomeScreen from './screens/WelcomeScreen';
import Question0Screen from './screens/Question0Screen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import MeditationScreen from './screens/MeditationScreen';
import DeepBreathingScreen from './screens/DeepBreathingScreen';
import QuestionFinalScreen from './screens/QuestionFinalScreen';
import ChatScreen from './screens/ChatScreen';
import AiChatReportScreen from './screens/AiChatReportScreen';
import ToolSelectionScreen from './screens/ToolSelectionScreen'; 
import TherapistSettingScreen from './screens/TherapistSettingScreen'; 
import DefaultHeader from './components/DefaultHeader';
import CustomHeader from './components/CustomHeader';
import 'regenerator-runtime/runtime';

// 定义 Stack 参数列表的类型
export type RootStackParamList = {
  Welcome: undefined;
  Question0: undefined;
  Question1: undefined;
  Question2: undefined;
  Question3: undefined;
  Question4: undefined;
  FinalScreen: undefined;
  ChatScreen: undefined;
  Meditation: undefined;
  DeepbreathingScreen: undefined;
  AiChatReportScreen: { userId: string; questionnaireData: any }; 
  ToolSelectionScreen: { userId: string; questionnaireData: any }; 
  TherapistSettingScreen: undefined; 
};

// 获取 StackNavigationProp 的类型
type ScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        await checkBackendConnection();
        const storedUserId = await AsyncStorage.getItem('semo_user_id');
        if (!storedUserId) {
          const newUserId = await generateUserId();
          await AsyncStorage.setItem('semo_user_id', newUserId);
        }
      } catch (error) {
        console.error('Failed to initialize user ID:', error);
      }
    };

    initializeUserId();
  }, []);

  // 定义 screenOptions，使用 DefaultHeader 作为默认的 headerLeft
  const defaultScreenOptions = {
    headerLeft: () => <DefaultHeader />,
    headerTitle: "", 
    headerStyle: {
      backgroundColor: '#F7F4EE',
      height: 110,
     // 自定义 Header 的高度
      // 其他样式如 padding, border, etc.
    },
    headerTitleStyle: {
      // 根据需要设置标题样式
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerTintColor: '#E14D5A', // 统一设置 tintColor
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={defaultScreenOptions}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Question0" component={Question0Screen} />
          <Stack.Screen name="Question1" component={Question1Screen} />
          <Stack.Screen name="Question2" component={Question2Screen} />
          <Stack.Screen name="Question3" component={Question3Screen} />
          <Stack.Screen name="Question4" component={Question4Screen} />
          <Stack.Screen name="FinalScreen" component={QuestionFinalScreen} />
          <Stack.Screen 
            name="ChatScreen" 
            component={ChatScreen} 
            options={{
              headerTitle: "与semo聊天",
            }} 
          />
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
                height: 60, // 确保高度一致
              },
              headerTitleStyle: {
                color: '#fff',
              },
              headerLeft: () => <CustomHeader />,  // 使用自定义头部
            }}
          />
          <Stack.Screen 
            name="AiChatReportScreen" 
            component={AiChatReportScreen} 
            options={{
              headerTitle: "semo总结",
            }} 
          />
          <Stack.Screen
            name="DeepBreathingScreen"
            component={DeepBreathingScreen}
            options={{ headerTitle: '' }}
          />
          <Stack.Screen
            name="ToolSelectionScreen"
            component={ToolSelectionScreen}
            options={{ headerTitle: "" }}
          />
          <Stack.Screen
            name="TherapistSettingScreen"
            component={TherapistSettingScreen}
            options={{ headerTitle: "" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
});