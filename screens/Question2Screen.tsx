import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Question2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question2'>;

type Props = {
  navigation: Question2ScreenNavigationProp;
};

export default function Question2Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      dispatch(updateAnswer({ question: 'duration', answer: selectedAnswer }));
      navigation.navigate('Question3');
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
      <Text style={styles.question}>分开多久了？</Text>
      <View style={styles.optionsContainer}>
        {renderButton('一周内', '一周内')}
        {renderButton('1-4周', '1-4周')}
        {renderButton('1-3个月', '1-3个月')}
        {renderButton('3个月以上', '3个月以上')}
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