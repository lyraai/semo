// screens/features/MoodJourneyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoodJourneyScreen() {
  return (
    <View style={styles.container}>
      <Text>Mood Journey Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
