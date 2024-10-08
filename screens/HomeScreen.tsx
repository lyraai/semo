import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color'; 
import CalendarHeader from '../components/CalenderHeader'; 

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CalendarHeader/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', //
    alignItems: 'center',
    backgroundColor: colors.background01, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textGray600,
    marginTop: 10,
  },
});
