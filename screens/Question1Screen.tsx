// my-semo-app/screens/Question1Screen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color';

type Question1ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question1'>;

type Props = {
  navigation: Question1ScreenNavigationProp;
};

export default function Question1Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      dispatch(updateAnswer({ question: 'current_state', answer: selectedAnswer }));
      navigation.navigate('Question2');
    }
  };

  const renderButton = (title: string, answer: string) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedAnswer === answer && styles.selectedButton, // 根据是否选中修改样式
      ]}
      onPress={() => handleAnswer(answer)}
    >
      <Text style={[
        styles.buttonText, 
        selectedAnswer === answer && styles.selectedButtonText // 修改文字样式
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.question}>现在的关系状态是...</Text>
      <View style={styles.optionsContainer}>
        {renderButton('完全断联', '完全断联')}
        {renderButton('偶尔联系', '偶尔联系')}
        {renderButton('复复分合', '复复分合')}
        {renderButton('对方已有新恋情', '对方已有新恋情')}
        {renderButton('我已有新恋情', '我已有新恋情')}
      </View>
      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedAnswer && styles.disabledNextButton, // 未选中时的样式
        ]}
        onPress={handleNext}
        disabled={!selectedAnswer} // 选项未选择时禁用“下一步”按钮
      >
        <Text style={[
          styles.nextButtonText,
          !selectedAnswer && styles.disabledNextButtonText, // 未激活时的文字样式
        ]}>
          下一步
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f4EE',
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // 增加按钮与"下一步"按钮的间距
  },
  button: {
    backgroundColor: '#fff', // 默认未选中的按钮背景颜色
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 0,
  },
  selectedButton: {
    backgroundColor: colors.primary, // 选中时的按钮背景颜色
  },
  buttonText: {
    color: '#333231',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff', // 选中时的文字颜色
  },
  nextButton: {
    backgroundColor: colors.primary, // 激活时的背景颜色
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: '#ccc', // 未激活时的背景颜色
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledNextButtonText: {
    color: '#666', // 未激活时的文字颜色
  },
});