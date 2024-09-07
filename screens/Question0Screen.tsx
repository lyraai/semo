// my-semo-app/screens/Question0Screen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { colors } from '../styles/color'; // 导入颜色文件

type Question0ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question0'>;

type Props = {
  navigation: Question0ScreenNavigationProp;
};

export default function Question0Screen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [age, setAge] = useState('20');  // 默认年龄
  const [gender, setGender] = useState('');  // 默认性别为空，用户需要选择
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
      <Text style={styles.label}>请选择您的性别:</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity onPress={() => handleGenderSelect('male')}>
          <Image
            source={require('../assets/icons/1x/Male User-1.png')}
            style={[styles.genderIcon, gender === 'male' && styles.selectedIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleGenderSelect('female')}>
          <Image
            source={require('../assets/icons/1x/Male User-1.png')}
            style={[styles.genderIcon, gender === 'female' && styles.selectedIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleGenderSelect('other')}>
          <Image
            source={require('../assets/icons/1x/Male User-1.png')}
            style={[styles.genderIcon, gender === 'other' && styles.selectedIcon]}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>请选择您的年龄:</Text>
      <Picker
        selectedValue={age}
        onValueChange={(itemValue) => setAge(itemValue)}
        style={styles.picker}
      >
        {Array.from({ length: 81 }, (_, i) => i + 10).map((age) => (
          <Picker.Item key={age} label={`${age}`} value={`${age}`} />
        ))}
      </Picker>

      <TouchableOpacity
        onPress={handleNext}
        style={[styles.nextButton, (!gender || !age) && styles.disabledNextButton]}
        disabled={!gender || !age || isLoading}  // 禁用条件
      >
        <Text style={[styles.nextButtonText, (!gender || !age) && styles.disabledNextButtonText]}>
          {isLoading ? '加载中...' : '下一步'}
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
    backgroundColor: colors.background, // 使用全局背景颜色
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 15,
    tintColor: colors.iconTint, // 使用全局图标默认颜色
  },
  selectedIcon: {
    tintColor: colors.selectedIconTint, // 使用全局选中图标颜色
  },
  picker: {
    width: 150,
    height: 180,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: colors.primary, // 使用全局按钮颜色
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledNextButton: {
    backgroundColor: colors.disabled, // 使用全局禁用按钮颜色
  },
  nextButtonText: {
    color: colors.textPrimary, // 使用全局按钮文本颜色
    fontSize: 18,
  },
  disabledNextButtonText: {
    color: colors.textDisabled, // 使用全局禁用文本颜色
  },
});