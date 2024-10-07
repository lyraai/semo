// screens/QuestionFinalScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { checkBackendConnection, sendQuestionnaireData } from '../service/api';
import { colors } from '../styles/color';
import { updateAnswer } from '../redux/slices/questionnaireSlice'; // 引入 updateAnswer
import ProgressBar from '../components/ProgressBar'; // 引入进度条组件

type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

type Props = {
  navigation: FinalScreenNavigationProp;
};

export default function QuestionFinalScreen({ navigation }: Props) {
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);
  const userId = useSelector((state: RootState) => state.user.userId);  // 从 Redux 中获取 userId
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch(); // 使用 dispatch 来更新 Redux 状态

  // 创建一个动画值数组
  const animations = useRef([new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    // 当组件挂载时，启动动画
    Animated.stagger(300, [
      Animated.timing(animations[0], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations[1], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [animations]);

  const handleStartChat = async () => {
    if (!userId) {
      Alert.alert('错误', '无法找到用户ID');
      return;
    }
  
    setIsLoading(true);
    try {
      await checkBackendConnection();  // 检查后端连接

      // 设置疗愈师风格为默认值，例如 '温暖' 或 '默认'
      const defaultTherapistStyle = '默认';
      dispatch(updateAnswer({ question: 'therapist_style', answer: defaultTherapistStyle }));

      // 将更新后的问卷数据发送到后端
      await sendQuestionnaireData(userId, {
        ...questionnaireData,
        therapist_style: defaultTherapistStyle,
      });

      // 导航到主界面
      navigation.navigate('Home');
    } catch (error) {
      console.error('初始化失败:', error);
      Alert.alert('错误', '初始化失败，请稍后重试');
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

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 感谢您的回答 Container */}
        <Animated.View style={[styles.summaryContainer, { opacity: animations[0] }]}>
          <Text style={styles.summaryText}>感谢您完成问卷！</Text>
        </Animated.View>

        {/* 问题和答案 Container */}
        <Animated.View style={[styles.answersContainer, { opacity: animations[1] }]}>
          <Text style={styles.answersHeader}>您选择的答案：</Text>
          <View style={styles.qaContainer}>
            <Text style={styles.questionText}>关系状态: </Text>
            <Text style={styles.answerText}>{questionnaireData.current_state}</Text>
          </View>
          <View style={styles.qaContainer}>
            <Text style={styles.questionText}>分开时长: </Text>
            <Text style={styles.answerText}>{questionnaireData.duration}</Text>
          </View>
          <View style={styles.qaContainer}>
            <Text style={styles.questionText}>当前感受: </Text>
            <Text style={styles.answerText}>{questionnaireData.current_feeling}</Text>
          </View>
          <View style={styles.qaContainer}>
            <Text style={styles.questionText}>想要的结果: </Text>
            <Text style={styles.answerText}>{questionnaireData.expectation}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.disabledNextButton]}  // 加载中时禁用按钮
          onPress={handleStartChat}
          disabled={isLoading}  // 禁用按钮防止重复点击
        >
          <Text style={[styles.nextButtonText, isLoading && styles.disabledNextButtonText]}>
            {isLoading ? '加载中...' : '开始心理疗愈之旅'}
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
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  // 小container：感谢您的回答
  summaryContainer: {
    marginBottom: 50,
    marginHorizontal: 20,

  },
  summaryText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  // 小container：问题和答案
  answersContainer: {
    alignItems: 'flex-start',
  },
  answersHeader: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.textGray500,  // 使用深灰色
    letterSpacing: 1.2,
    lineHeight: 24,
    marginHorizontal: 20,
  },
  qaContainer: {
    flexDirection: 'row',
    marginBottom:15,
    marginHorizontal: 20,
  },
  // 样式：问题（关系状态等）
  questionText: {
    fontSize: 18,
    color: colors.textGray500,
    letterSpacing: 1.0,
    lineHeight: 22,
  },
  // 样式：用户的答案，使用主题色
  answerText: {
    fontSize: 18,
    color: colors.primary,
    letterSpacing: 1.0,
    lineHeight: 22,
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
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2.0,
    lineHeight: 20,
  },
  disabledNextButtonText: {
    color: colors.textDisabled,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2.0,
    lineHeight: 20,
  },
});
