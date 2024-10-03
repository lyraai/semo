// screens/Question0Screen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color'; 
import ProgressBar from '../components/ProgressBar';

type Question0ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question0'>;

type Props = {
  navigation: Question0ScreenNavigationProp;
};

export default function Question0Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const handleNext = () => {
    if (gender && age) {
      setIsLoading(true);
      dispatch(updateAnswer({ question: 'age', answer: age }));
      dispatch(updateAnswer({ question: 'gender', answer: gender }));
      setIsLoading(false);
      navigation.navigate('Question1');
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={0} totalSteps={5} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.label}>请选择您的性别</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity onPress={() => handleGenderSelect('male')} style={styles.genderButton}>
            <Image
              source={require('../assets/icons/1x/Male.png')}
              style={[
                styles.genderIcon,
                gender === 'male' && styles.selectedIcon
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGenderSelect('female')} style={styles.genderButton}>
            <Image
              source={require('../assets/icons/1x/Female.png')}
              style={[
                styles.genderIcon,
                gender === 'female' && styles.selectedIcon
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleGenderSelect('other')} style={styles.genderButton}>
            <Image
              source={require('../assets/icons/1x/OtherGender.png')}
              style={[
                styles.genderIcon,
                gender === 'other' && styles.selectedIcon
              ]}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>请选择您的年龄</Text>
        <View style={styles.ageContainer}>
          <Picker
            selectedValue={age}
            onValueChange={(itemValue) => setAge(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 81 }, (_, i) => i + 10).map((age) => (
              <Picker.Item key={age} label={`${age}`} value={`${age}`} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            (!gender || !age) && styles.disabledNextButton
          ]}
          disabled={!gender || !age || isLoading}
        >
          <Text style={[
            styles.nextButtonText,
            (!gender || !age) && styles.disabledNextButtonText
          ]}>
            {isLoading ? '加载中...' : '继续回答'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01
  },
  progressBarContainer: {
    height: 150,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
    justifyContent: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500', // 控制字体粗细
    lineHeight: 24,    // 行高
    letterSpacing: 0.5, // 字母间距
    color: colors.textGray600, // 设置文字颜色
    textAlign: 'center', // 居中对齐文本
    marginVertical: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 30,
    paddingHorizontal: 40, // 调整性别选项的左右间距
  },
  genderButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  genderIcon: {
    width: 50,
    height: 50,
    tintColor: colors.iconTint,
  },
  selectedIcon: {
    tintColor: colors.selectedIconTint,
  },
  ageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  picker: {
    width: '80%',
    height: 180,
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
    fontWeight: 'bold', // 粗体
    textTransform: 'uppercase', // 全部大写
    letterSpacing: 1, // 字母间距
  },
  disabledNextButtonText: {
    color: colors.textDisabled,
    fontSize: 18,
    fontWeight: 'bold', // 粗体
    letterSpacing: 1, // 字母间距
  },
});
