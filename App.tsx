// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUserId, checkBackendConnection } from './service/api';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import Question0Screen from './screens/Question0Screen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import MeditationScreen from './screens/MeditationScreen';
import DeepBreathingScreen from './screens/DeepBreathingScreen';
import DiscoverScreen from './screens/features/DiscoverScreen';
import MoodJourneyScreen from './screens/features/MoodJourneyScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import QuestionFinalScreen from './screens/QuestionFinalScreen';
import ChatScreen from './screens/ChatScreen';
import AiChatReportScreen from './screens/AiChatReportScreen';
import ToolSelectionScreen from './screens/ToolSelectionScreen';
import TherapistSettingScreen from './screens/TherapistSettingScreen';
import DefaultHeader from './components/DefaultHeader';
import HomeHeader from './components/HomeHeader';
import ChatHeader from './components/ChatHeader';
import { colors } from './styles/color';
import 'regenerator-runtime/runtime';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 为了在 Tab 内部添加堆栈导航器，我们需要创建一个新的 Stack Navigator
function MoodJourneyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MoodJourneyScreen" component={MoodJourneyScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AiChatReportScreen"
        component={AiChatReportScreen}
        options={{ header: () => <HomeHeader /> }}
      />
    </Stack.Navigator>
  );
}

// 定义 Tab Navigator，包含主页面，并使用 HomeHeader 作为 header
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <HomeHeader />, // 使用 HomeHeader
        tabBarIcon: ({ focused }) => {
          let iconSource;

          // 根据不同的 route.name 设置不同的图标
          if (route.name === '主页') {
            iconSource = require('./assets/icons/1x/Home-1.png');
          } else if (route.name === '发现') {
            iconSource = require('./assets/icons/1x/Search.png');
          } else if (route.name === '疗愈') {
            iconSource = require('./assets/icons/1x/Healingtool.png');
          } else if (route.name === '记录') {
            iconSource = require('./assets/icons/1x/MoodJourney.png');
          } else if (route.name === '用户') {
            iconSource = require('./assets/icons/1x/Profile.png');
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? colors.primary : colors.iconTint,
              }}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.iconTint,
        tabBarStyle: {
          height: 100,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.white,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          elevation: 0,
          paddingHorizontal: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      {/* 定义各个页面 */}
      <Tab.Screen name="主页" component={HomeScreen} />
      <Tab.Screen name="发现" component={DiscoverScreen} />
      <Tab.Screen name="疗愈" component={ToolSelectionScreen} />
      {/* 将 MoodJourneyStack 替换 MoodJourneyScreen */}
      <Tab.Screen name="记录" component={MoodJourneyStack} options={{ headerShown: false }} />
      <Tab.Screen name="用户" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

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

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          {/* 欢迎页面，不显示 header */}
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          {/* 问卷页面和 TherapistSettingScreen，使用 DefaultHeader */}
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
            options={{ headerShown: false }}
          />

          {/* AI Chat 页面，使用自定义的 ChatHeader */}
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              header: () => <ChatHeader title="与 Semo 聊天" />,
            }}
          />

          {/* 其他页面 */}
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
              headerLeft: () => <DefaultHeader />,
            }}
          />
          <Stack.Screen
            name="DeepBreathingScreen"
            component={DeepBreathingScreen}
            options={{ headerTitle: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
