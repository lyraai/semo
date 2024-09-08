import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color';

type Question3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question3'>;

type Props = {
  navigation: Question3ScreenNavigationProp;
};

export default function Question3Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      dispatch(updateAnswer({ question: 'current_feeling', answer: selectedAnswer }));
      navigation.navigate('Question4');
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
      <Text style={styles.question}>您现在的感受是...</Text>
      <View style={styles.optionsContainer}>
        {renderButton('思念', '思念')}
        {renderButton('孤独', '孤独')}
        {renderButton('迷茫', '迷茫')}
        {renderButton('内疚', '内疚')}
        {renderButton('心痛', '心痛')}
        {renderButton('愤怒', '愤怒')}
        {renderButton('希望', '希望')}
        {renderButton('解脱', '解脱')}
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
    borderWidth: 0,
  },
  selectedButton: {
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
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
