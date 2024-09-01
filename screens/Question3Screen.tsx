// my-semo-app/screens/Question3Screen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Question3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question3'>;

type Props = {
  navigation: Question3ScreenNavigationProp;
};

export default function Question3Screen({ navigation }: Props) {
  const dispatch = useDispatch();

  const handleAnswer = (answer: string) => {
    dispatch(updateAnswer({ question: 'current_feeling', answer }));
    navigation.navigate('Question4');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>您现在的感受是...</Text>
      <Button title="思念" onPress={() => handleAnswer('思念')} />
      <Button title="孤独" onPress={() => handleAnswer('孤独')} />
      <Button title="迷茫" onPress={() => handleAnswer('迷茫')} />
      <Button title="内疚" onPress={() => handleAnswer('内疚')} />
      <Button title="心痛" onPress={() => handleAnswer('心痛')} />
      <Button title="愤怒" onPress={() => handleAnswer('愤怒')} />
      <Button title="希望" onPress={() => handleAnswer('希望')} />
      <Button title="解脱" onPress={() => handleAnswer('解脱')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});