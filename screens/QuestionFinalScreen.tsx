// screens/QuestionFinalScreen.tsx
import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { checkBackendConnection } from '../service/api';
import { colors } from '../styles/color';
import ProgressBar from '../components/ProgressBar'; // 引入进度条组件

type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

type Props = {
  navigation: FinalScreenNavigationProp;
};

export default function QuestionFinalScreen({ navigation }: Props) {
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);
  const userId = useSelector((state: RootState) => state.user.userId);  // 从 Redux 中获取 userId
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!userId) {
      Alert.alert('错误', '无法找到用户ID');
      return;
    }
  
    setIsLoading(true);
    try {
      await checkBackendConnection();  // 检查后端连接
      navigation.navigate('ToolSelectionScreen', {
        userId,
        questionnaireData,
      });
    } catch (error) {
      console.error('跳转到疗愈工具选择页面失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={5} totalSteps={5} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>问卷完成</Text>
        <Text style={styles.summary}>感谢您完成问卷！</Text>
        <Text style={styles.summary}>您选择的答案：</Text>
        <Text style={styles.text}>关系状态: {questionnaireData.current_state}</Text>
        <Text style={styles.text}>分开时长: {questionnaireData.duration}</Text>
        <Text style={styles.text}>当前感受: {questionnaireData.current_feeling}</Text>
        <Text style={styles.text}>想要的结果: {questionnaireData.expectation}</Text>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.disabledNextButton]}  // 加载中时禁用按钮
          onPress={handleStartChat}
          disabled={isLoading}  // 禁用按钮防止重复点击
        >
          <Text style={[styles.nextButtonText, isLoading && styles.disabledNextButtonText]}>
            {isLoading ? '加载中...' : '选择疗愈方式'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  progressBarContainer: {
    height: 150,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textGray600,
  },
  summary: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: colors.textGray600,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: colors.textGray500,
  },
  bottomButtonContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: colors.disabled,
  },
  nextButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabledNextButtonText: {
    color: colors.textDisabled,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
