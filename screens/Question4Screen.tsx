// my-semo-app/screens/Question4Screen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Question4ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question4'>;

type Props = {
  navigation: Question4ScreenNavigationProp;
};

export default function Question4Screen({ navigation }: Props) {
  const dispatch = useDispatch();

  const handleAnswer = (answer: string) => {
    dispatch(updateAnswer({ question: 'desiredOutcome', answer }));
    navigation.navigate('FinalScreen'); // 假设接下来有一个终点页面
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>您现在最想要的是...</Text>
      <Button title="缓解情绪" onPress={() => handleAnswer('缓解情绪')} />
      <Button title="复合" onPress={() => handleAnswer('复合')} />
      <Button title="彻底放下" onPress={() => handleAnswer('彻底放下')} />
      <Button title="开始新恋情" onPress={() => handleAnswer('开始新恋情')} />
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