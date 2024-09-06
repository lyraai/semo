import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      dispatch(updateAnswer({ question: 'expectation', answer: selectedAnswer }));
      navigation.navigate('FinalScreen');
    }
  };

  const renderButton = (title: string, answer: string) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedAnswer === answer && styles.selectedButton,
      ]}
      onPress={() => handleAnswer(answer)}
    >
      <Text style={[
        styles.buttonText,
        selectedAnswer === answer && styles.selectedButtonText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.question}>您现在最想要的是...</Text>
      <View style={styles.optionsContainer}>
        {renderButton('缓解情绪', '缓解情绪')}
        {renderButton('复合', '复合')}
        {renderButton('彻底放下', '彻底放下')}
        {renderButton('开始新恋情', '开始新恋情')}
      </View>
      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedAnswer && styles.disabledNextButton,
        ]}
        onPress={handleNext}
        disabled={!selectedAnswer}
      >
        <Text style={[
          styles.nextButtonText,
          !selectedAnswer && styles.disabledNextButtonText,
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#f06262',
  },
  buttonText: {
    color: '#333231',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#f06262',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledNextButtonText: {
    color: '#666',
  },
});
