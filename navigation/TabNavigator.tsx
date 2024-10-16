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

          if (route.name === t("home_screen")) {
            iconSource = require('../assets/icons/tab/Home.png');
          } else if (route.name === t("discover_screen")) {
            iconSource = require('../assets/icons/tab/Search.png');
          } else if (route.name === t("healing_screen")) {
            iconSource = require('../assets/icons/tab/Healingtool.png');
          } else if (route.name === t("record_screen")) {
            iconSource = require('../assets/icons/tab/MoodJourney.png');
          } else if (route.name === t("profile_screen")) {
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
      <Tab.Screen name={t("home_screen")} component={HomeScreen} />
      <Tab.Screen name={t("discover_screen")} component={DiscoverScreen} />
      <Tab.Screen name={t("healing_screen")} component={ToolSelectionScreen} />
      <Tab.Screen name={t("record_screen")} component={MoodJourneyScreen} />
      <Tab.Screen name={t("profile_screen")} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
