// screens/Question3Screen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color';
import ProgressBar from '../components/ProgressBar';
import { t, languageCode } from '../locales/localization';

type Question3ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Question3'
>;

type Props = {
  navigation: Question3ScreenNavigationProp;
};

export default function Question3Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const pressStartTimes = useRef<Record<string, number>>({});

  const handlePressIn = (emotion: string) => {
    pressStartTimes.current[emotion] = Date.now();
    // 更新边框颜色
    setSelectedAnswers((prev) => ({ ...prev, [emotion]: prev[emotion] || 0 }));
  };

  const handlePressOut = (emotion: string) => {
    const startTime = pressStartTimes.current[emotion];
    const duration = Date.now() - startTime;
    delete pressStartTimes.current[emotion];

    // 将按压时间映射到 1-4 的等级
    const maxPressDuration = 200; // 最大按压时间，2秒
    let level = Math.ceil((duration / maxPressDuration) * 4);
    if (level > 4) level = 4;
    if (level < 1) level = 1;

    setSelectedAnswers((prev) => ({ ...prev, [emotion]: level }));

    // 更新答案
    dispatch(
      updateAnswer({
        question: 'current_feeling',
        answer: `${emotion} (level${level})`,
      })
    );
  };

  const handleReset = (emotion: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [emotion]: 0 }));
    dispatch(
      updateAnswer({ question: 'current_feeling', answer: `${emotion} (level0)` })
    );
  };

  const getButtonAlpha = (level: number) => {
    return level * 0.25; // 透明度与等级对应
  };

  const renderButton = (title: string, positionStyle: any) => {
    const level = selectedAnswers[title] || 0;
    const isSelected = level > 0;
    const isPressing = !!pressStartTimes.current[title];

    const borderColor = isPressing ? colors.primary : colors.gray400;

    return (
      <TouchableOpacity
        key={title}
        style={[
          styles.button,
          positionStyle,
          {
            borderColor: borderColor,
            borderWidth: 0,
            backgroundColor: isSelected
              ? `rgba(225,77,90,${getButtonAlpha(level)})`
              : 'transparent',
          },
        ]}
        onPress={() => handleReset(title)}
        onPressIn={() => handlePressIn(title)}
        onPressOut={() => handlePressOut(title)}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: isSelected ? colors.textPrimary : colors.textGray400,
            },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleNext = () => {
    navigation.navigate('Question4');
  };

  // 定义按钮的位置
  const buttonPositions = [
    { title: t('feeling_missing'), top: 0, left: 25 },
    { title: t('feeling_lonely'), top: 0, left: 155 },
    { title: t('feeling_confused'), top: 100, left: 75 },
    { title: t('feeling_guilty'), top: 100, left: 215 },
    { title: t('feeling_heartbroken'), top: 200, left: 25 },
    { title: t('feeling_angry'), top: 200, left: 155 },
    { title: t('feeling_hopeful'), top: 300, left: 75 },
    { title: t('feeling_relieved'), top: 300, left: 215 },
  ];

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={3} totalSteps={5} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{t('your_current_feeling')}</Text>
        <View style={styles.optionsContainer}>
          {buttonPositions.map((item) =>
            renderButton(item.title, { top: item.top, left: item.left })
          )}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t('continue_answer')}</Text>
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
    height: 80,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: colors.textGray600,
    textAlign: 'center',
    marginVertical: 15,
  },
  optionsContainer: {
    width: '100%',
    height: 300, // 调整高度以适应按钮
    position: 'relative',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // 背景颜色在 renderButton 中动态设置
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  nextButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});