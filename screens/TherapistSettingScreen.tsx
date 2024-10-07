// screens/TherapistSettingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { sendQuestionnaireData } from '../service/api'; // 导入发送问卷数据的API
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../redux/store';
import { colors } from '../styles/color';

// 定义导航参数的类型
type RootStackParamList = {
  ChatScreen: {
    initialMessage: string;
    initialOptions: string[];
    initialTopicId: number;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatScreen'>;

// 定义疗愈师风格的类型
type TherapistStyle = {
  key: string;
  title: string;
  description: string;
  icon: any; // 可以根据实际情况调整图标类型
};

export default function TherapistSettingScreen() {
  const [selectedStyle, setSelectedStyle] = useState<string>(''); // 存储用户选择的疗愈师风格
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);
  const userId = useSelector((state: RootState) => state.user.userId); // 获取当前用户ID
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>(); // 使用 useNavigation 钩子

  // 定义疗愈师风格列表
  const therapistStyles: TherapistStyle[] = [
    {
      key: 'warm',
      title: '温暖',
      description: '提供温馨和支持的环境，帮助您放松身心。',
      icon: require('../assets/icons/style-1.png'), // 替换为实际图标路径
    },
    {
      key: 'rational',
      title: '理性',
      description: '注重逻辑和分析，帮助您理清思绪。',
      icon: require('../assets/icons/style-2.png'), // 替换为实际图标路径
    },
    {
      key: 'vibrant',
      title: '活力',
      description: '充满活力和动力，激发您的内在潜能。',
      icon: require('../assets/icons/style-3.png'), // 替换为实际图标路径
    },
    {
      key: 'spiritual',
      title: '灵性',
      description: '深度冥想和灵性疗愈，帮助您提升内在觉知。',
      icon: require('../assets/icons/style-4.png'), // 替换为实际图标路径
    },
  ];

  // 选择疗愈师风格并更新问卷数据
  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    dispatch(updateAnswer({ question: 'therapist_style', answer: style })); // 更新问卷中的风格
  };

  // 确认选择并发送数据到后端
  const handleConfirm = async () => {
    if (!userId) {
      console.error('User ID is missing.');
      Alert.alert('错误', '无法找到用户ID');
      return;
    }

    if (!selectedStyle) {
      Alert.alert('提示', '请选择一个疗愈师风格');
      return;
    }

    try {
      // 发送完整的问卷数据到后端，包括新的疗愈师风格
      const response = await sendQuestionnaireData(userId, {
        ...questionnaireData,
        therapist_style: selectedStyle,
      });

      console.log('API Response:', response);

      // 将 response 的内容传递到 ChatScreen
      navigation.navigate('ChatScreen', {
        initialMessage: response.content,
        initialOptions: response.predicted_options,
        initialTopicId: response.topic_id,
      });
    } catch (error) {
      console.error('Failed to send questionnaire data:', error);
      Alert.alert('错误', '发送数据失败，请稍后重试');
    }
  };

  return (
    <View style={styles.container}>
      {/* 内容容器 */}
      <View style={styles.contentContainer}>
        <View style={styles.cardsContainer}>
          {therapistStyles.map((style) => (
            <TouchableOpacity
              key={style.key}
              style={[
                styles.card,
                selectedStyle === style.key && styles.selectedCard,
              ]}
              onPress={() => handleStyleSelect(style.key)}
              activeOpacity={0.8}
            >
              <Image 
                source={style.icon} 
                style={[
                  styles.cardIcon,
                  selectedStyle === style.key && styles.selectedIcon,
                ]}
              />
              <Text
                style={[
                  styles.cardTitle,
                  selectedStyle === style.key && styles.selectedCardTitle,
                ]}
              >
                {style.title}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  selectedStyle === style.key && styles.selectedCardDescription,
                ]}
              >
                {style.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 新增说明容器 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            每个疗愈师都将共享您的记忆和信息，以便提供更好的疗愈体验。请放心，您的隐私将受到严格保护。
          </Text>
        </View>
      </View>

      {/* 底部容器 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedStyle && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedStyle} // 未选择风格时禁用按钮
        >
          <Text style={[
            styles.confirmButtonText,
            !selectedStyle && styles.disabledButtonText,
          ]}>开始对话</Text>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cardIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    tintColor: colors.iconTint, // 默认颜色
  },
  selectedIcon: {
    tintColor: colors.white, // 选中后变成白色
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 5,
    textAlign: 'center',
  },
  selectedCardTitle: {
    color: colors.white, // 选中后变为白色
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textGray500,
    textAlign: 'center',
  },
  selectedCardDescription: {
    color: colors.white, // 选中后变为白色
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textGray500,
    textAlign: 'center',
  },
  footer: {
    height: 120,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background01,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, 
  },
  confirmButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  disabledButton: {
    backgroundColor: colors.disabled,
  },
  disabledButtonText: {
    color: colors.textDisabled,
  },
});
