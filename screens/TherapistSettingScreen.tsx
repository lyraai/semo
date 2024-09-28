// /Users/bailangcheng/Desktop/semo/screens/TherapistSettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { sendQuestionnaireData } from '../service/api'; // 导入发送问卷数据的API
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';

export default function TherapistSettingScreen() {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);
  const userId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    dispatch(updateAnswer({ question: 'therapist_style', answer: style })); // 更新问卷中的风格
  };

  const handleConfirm = async () => {
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }

    // 发送完整的问卷数据到后端
    try {
      await sendQuestionnaireData(userId, questionnaireData);
      navigation.navigate('ChatScreen'); // 进入AI对话
    } catch (error) {
      console.error('Failed to send questionnaire data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>选择您的疗愈师风格</Text>
      <TouchableOpacity
        style={[styles.styleButton, selectedStyle === '温暖' && styles.selectedButton]}
        onPress={() => handleStyleSelect('温暖')}
      >
        <Text style={styles.buttonText}>温暖</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.styleButton, selectedStyle === '理性' && styles.selectedButton]}
        onPress={() => handleStyleSelect('理性')}
      >
        <Text style={styles.buttonText}>理性</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={!selectedStyle} // 未选择风格时禁用按钮
      >
        <Text style={styles.confirmButtonText}>确认并开始对话</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  styleButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginTop: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});