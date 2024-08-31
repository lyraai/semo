// my-semo-app/screens/Question2Screen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Question2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question2'>;

type Props = {
  navigation: Question2ScreenNavigationProp;
};

export default function Question2Screen({ navigation }: Props) {
  const dispatch = useDispatch();

  const handleAnswer = (answer: string) => {
    dispatch(updateAnswer({ question: 'breakupDuration', answer }));
    navigation.navigate('Question3');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>分开多久了？</Text>
      <Button title="一周内" onPress={() => handleAnswer('一周内')} />
      <Button title="1-4周" onPress={() => handleAnswer('1-4周')} />
      <Button title="1-3个月" onPress={() => handleAnswer('1-3个月')} />
      <Button title="3个月以上" onPress={() => handleAnswer('3个月以上')} />
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
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});