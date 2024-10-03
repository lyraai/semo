// components/ProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/color';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  // 根据当前步骤设置提示语
  let promptText = '';
  if (currentStep === 0) {
    promptText = '请开始';
  } else if (currentStep === 1) {
    promptText = '很好，请继续 ';
  } else if (currentStep === 2) {
    promptText = '加油';
  } else if (currentStep === 3) {
    promptText = '还差一点点';
  } else if (currentStep === 4) {
    promptText = '我们快好了';
  }else {
    promptText = '完成了！';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>{promptText}</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  promptText: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.textGray600,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.gray300,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});

export default ProgressBar;