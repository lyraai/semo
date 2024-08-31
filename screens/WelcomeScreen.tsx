// my-semo-app/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logos/1x/logo.png')} style={styles.logo} />
      <Text style={styles.title}>欢迎来到Semo</Text>
      <Text style={styles.subtitle}>你的情绪急救助手</Text>
      <Button
        title="下一步"
        onPress={() => navigation.navigate('Question1')}
        color="#f06262"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
});