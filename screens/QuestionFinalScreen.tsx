// screens/QuestionFinalScreen.tsximport React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { sendQuestionnaireData, checkBackendConnection } from '../service/api';

type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

type Props = {
  navigation: FinalScreenNavigationProp;
};

export default function QuestionFinalScreen({ navigation }: Props) {
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);

  const handleStartChat = async () => {
    try {
      await checkBackendConnection();  // 检查后端连接
      await sendQuestionnaireData(questionnaireData);
      navigation.navigate('ChatScreen');
    } catch (error) {
      console.error('Failed to start AI chat, using mock data instead:', error);
      navigation.navigate('ChatScreen');  // 即使失败也进入聊天页面
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>问卷完成</Text>
      <Text style={styles.summary}>感谢您完成问卷！</Text>
      <Text style={styles.summary}>您选择的答案：</Text>
      <Text style={styles.text}>关系状态: {questionnaireData.current_state}</Text>
      <Text style={styles.text}>分开时长: {questionnaireData.duration}</Text>
      <Text style={styles.text}>当前感受: {questionnaireData.current_feeling}</Text>
      <Text style={styles.text}>想要的结果: {questionnaireData.expectation}</Text>
      <Button title="开始AI对话" onPress={handleStartChat} />
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