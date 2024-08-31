import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import WelcomeScreen from './screens/WelcomeScreen';
import Question0Screen from './screens/Question0Screen'; 
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import QuestionFinalScreen from './screens/QuestionFinalScreen';
import ChatScreen from './screens/ChatScreen';

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
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Question0" component={Question0Screen} options={{ title: '基本信息' }} /> 
          <Stack.Screen name="Question1" component={Question1Screen} options={{ title: '失恋情况' }} />
          <Stack.Screen name="Question2" component={Question2Screen} options={{ title: '失恋情况' }} />
          <Stack.Screen name="Question3" component={Question3Screen} options={{ title: '失恋情况' }} />
          <Stack.Screen name="Question4" component={Question4Screen} options={{ title: '失恋情况' }} />
          <Stack.Screen name="FinalScreen" component={QuestionFinalScreen} options={{ title: '完成' }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'AI 对话' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}