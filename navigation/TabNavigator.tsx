// navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/features/DiscoverScreen';
import ToolSelectionScreen from '../screens/ToolSelectionScreen';
import MoodJourneyScreen from '../screens/features/MoodJourneyScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../styles/color';
import HomeHeader from '../components/HomeHeader'; 

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <HomeHeader />, // Set HomeHeader as the default header for the tabs
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === '主页') {
            iconSource = require('../assets/icons/tab/Home.png');
          } else if (route.name === '发现') {
            iconSource = require('../assets/icons/tab/Search.png');
          } else if (route.name === '疗愈') {
            iconSource = require('../assets/icons/tab/Healingtool.png');
          } else if (route.name === '记录') {
            iconSource = require('../assets/icons/tab/MoodJourney.png');
          } else if (route.name === '用户') {
            iconSource = require('../assets/icons/tab/Profile.png');
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
      <Tab.Screen name="主页" component={HomeScreen} />
      <Tab.Screen name="发现" component={DiscoverScreen} />
      <Tab.Screen name="疗愈" component={ToolSelectionScreen} />
      <Tab.Screen name="记录" component={MoodJourneyScreen} />
      <Tab.Screen name="用户" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
