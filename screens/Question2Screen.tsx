// screens/Question2Screen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color';
import ProgressBar from '../components/ProgressBar';
import { t, languageCode } from '../locales/localization';

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
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={2} totalSteps={5} /> 
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{t('how_long_since_separation')}</Text>
        <View style={styles.optionsContainer}>
          {renderButton(t('separation_duration_within_one_week'), t('separation_duration_within_one_week'))}
          {renderButton(t('separation_duration_one_to_four_weeks'), t('separation_duration_one_to_four_weeks'))}
          {renderButton(t('separation_duration_one_to_three_months'), t('separation_duration_one_to_three_months'))}
          {renderButton(t('separation_duration_more_than_three_months'), t('separation_duration_more_than_three_months'))}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
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
            {t('continue_answer')}
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
  label: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: colors.textGray600,
    textAlign: 'center',
    marginVertical: 0,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
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
