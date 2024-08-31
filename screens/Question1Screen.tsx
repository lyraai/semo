// my-semo-app/screens/Question1Screen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Question1ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question1'>;

type Props = {
  navigation: Question1ScreenNavigationProp;
};

export default function Question1Screen({ navigation }: Props) {
  const dispatch = useDispatch();

  const handleAnswer = (answer: string) => {
    dispatch(updateAnswer({ question: 'relationshipStatus', answer }));
    navigation.navigate('Question2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>现在的关系状态是...</Text>
      <Button title="完全断联" onPress={() => handleAnswer('完全断联')} />
      <Button title="偶尔联系" onPress={() => handleAnswer('偶尔联系')} />
      <Button title="复复分合" onPress={() => handleAnswer('复复分合')} />
      <Button title="对方已有新恋情" onPress={() => handleAnswer('对方已有新恋情')} />
      <Button title="我已有新恋情" onPress={() => handleAnswer('我已有新恋情')} />
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