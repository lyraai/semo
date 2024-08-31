import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { sendQuestionnaireData } from '../service/api';

type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

type Props = {
  navigation: FinalScreenNavigationProp;
};

export default function QuestionFinalScreen({ navigation }: Props) {
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);

  const handleStartChat = async () => {
    try {
      await sendQuestionnaireData(questionnaireData);
      navigation.navigate('ChatScreen');
    } catch (error) {
      console.error('Failed to start AI chat:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>问卷完成</Text>
      <Text style={styles.summary}>感谢您完成问卷！</Text>
      <Text style={styles.summary}>您选择的答案：</Text>
      <Text style={styles.text}>关系状态: {questionnaireData.relationshipStatus}</Text>
      <Text style={styles.text}>分开时长: {questionnaireData.breakupDuration}</Text>
      <Text style={styles.text}>当前感受: {questionnaireData.currentEmotion}</Text>
      <Text style={styles.text}>想要的结果: {questionnaireData.desiredOutcome}</Text>
      <Button title="开始AI对话" onPress={handleStartChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summary: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});