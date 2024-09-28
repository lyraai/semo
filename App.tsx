// /Users/bailangcheng/Desktop/semo/App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
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
import ToolSelectionScreen from './screens/ToolSelectionScreen'; // 新增情绪疗愈选择页面
import TherapistSettingScreen from './screens/TherapistSettingScreen'; // 新增疗愈师风格页面
import { Icon } from 'react-native-elements';
import 'regenerator-runtime/runtime';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Welcome: undefined;
  Question0: undefined;
  Question1: undefined;
  Question2: undefined;
  Question3: undefined;
  Question4: undefined;
  FinalScreen: undefined;
  ChatScreen: undefined;
  MeditationScreen: undefined;
  DeepbreathingScreen: undefined;
  AiChatReportScreen: { userId: string; questionnaireData: any }; 
  ToolSelectionScreen: { userId: string; questionnaireData: any }; 
  TherapistSettingScreen: undefined; // 添加疗愈师风格选择页面
};

export default function App() {
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        await checkBackendConnection(); // 检查后端连接性
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

  const defaultScreenOptions = ({ navigation }) => ({
    headerLeft: () => (
      <Icon
        name="chevron-left"
        type="feather"
        color= '#E14D5A'
        size={30}
        onPress={() => navigation.goBack()}
        containerStyle={{ marginLeft: 15 }}
      />
    ),
    headerTitle: "", 
    headerStyle: {
      backgroundColor: '#F7F4EE',
    },
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: '#F7F4EE' }}>
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
              options={{ headerTitle: 'Meditation' }}
            />
            <Stack.Screen 
              name="AiChatReportScreen" 
              component={AiChatReportScreen} 
              options={{
                headerTitle: "semo总结",
              }} 
            />
            <Stack.Screen
              name="DeepBreathing"
              component={DeepBreathingScreen}
              options={{ headerTitle: '深呼吸练习' }}
            />
            <Stack.Screen
              name="ToolSelectionScreen"
              component={ToolSelectionScreen}
              options={{ headerTitle: "情绪疗愈选择" }}
            />
            <Stack.Screen
              name="TherapistSettingScreen" // 注册疗愈师风格选择页面
              component={TherapistSettingScreen}
              options={{ headerTitle: "选择疗愈师风格" }} // 自定义标题
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
}