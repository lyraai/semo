// screens/TherapistSettingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import { getTherapistStyles, updateTherapistStyle, initialiseChat } from '../service/api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';
import { updateAnswer } from '../redux/slices/questionnaireSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { t, languageCode } from '../locales/localization';

// 定义导航参数的类型
type RootStackParamList = {
  ChatScreen: {
    initialMessage: string;
    initialOptions: string[];
    initialTopicId: number;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatScreen'>;

export default function TherapistSettingScreen() {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [stylesList, setStylesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const semoUserId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchStyles = async () => {
      if (!semoUserId) {
        Alert.alert(t('error'), t('unable_to_get_user_id'));
        setLoading(false);
        return;
      }

      try {
        const data = await getTherapistStyles(semoUserId);
        console.log('获取疗愈师风格成功:', data);
        setStylesList(data.styles);
        setSelectedStyle(data.current_style);
      } catch (error) {
        console.error('获取疗愈师风格失败:', error);
        Alert.alert(t('error'), t('unable_to_get_therapist_style_list'));
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, [semoUserId]);

  // 根据风格ID返回对应的图标
  const getIconByStyleId = (styleId: string) => {
    switch (styleId) {
      case 'warm':
        return require('../assets/icons/style-1.png');
      case 'rational':
        return require('../assets/icons/style-2.png');
      case 'vibrant':
        return require('../assets/icons/style-3.png');
      case 'spiritual':
        return require('../assets/icons/style-4.png');
      default:
        return require('../assets/icons/style-1.png');
    }
  };

  // 定义疗愈师风格的数据，包括图标
  const therapistStyles = stylesList.map((item) => ({
    key: item.id,
    title: item.name,
    description: item.desc,
    icon: getIconByStyleId(item.id), // 根据风格ID获取对应的图标
  }));

  // 选择疗愈师风格并更新问卷数据
  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    dispatch(updateAnswer({ question: 'therapist_style', answer: styleId }));
    console.log(`选择的疗愈师风格ID: ${styleId}`);
  };

  // 确认选择并开始聊天
  const handleConfirm = async () => {
    if (!semoUserId) {
      Alert.alert(t('error'), t('unable_to_get_user_id'));
      return;
    }

    if (!selectedStyle) {
      Alert.alert(t('prompt'), t('please_select_therapist_style'));
      return;
    }

    try {
      // 更新疗愈师风格
      const updateResponse = await updateTherapistStyle(semoUserId, selectedStyle);
      console.log('更新疗愈师风格成功:', updateResponse);

      // 初始化聊天
      const chatData = await initialiseChat(semoUserId);
      console.log('初始化聊天成功:', chatData);

      // 导航到聊天界面，并传递初始消息和选项
      navigation.navigate('ChatScreen', {
        initialMessage: chatData.content,
        initialOptions: chatData.predicted_options,
        initialTopicId: chatData.topic_id,
      });
    } catch (error) {
      console.error('开始聊天失败:', error);
      Alert.alert(t('error'), t('unable_to_start_chat'));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 内容容器 */}
      <View style={styles.contentContainer}>
        <FlatList
          data={therapistStyles}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={styles.cardsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.card,
                selectedStyle === item.key && styles.selectedCard,
              ]}
              onPress={() => handleStyleSelect(item.key)}
              activeOpacity={0.8}
            >
              <Image
                source={item.icon}
                style={[
                  styles.cardIcon,
                  selectedStyle === item.key && styles.selectedIcon,
                ]}
              />
              <Text
                style={[
                  styles.cardTitle,
                  selectedStyle === item.key && styles.selectedCardTitle,
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  selectedStyle === item.key && styles.selectedCardDescription,
                ]}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 底部容器 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedStyle && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedStyle}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !selectedStyle && styles.disabledButtonText,
            ]}
          >
            {t('start_conversation')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cardsContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
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
    backgroundColor: colors.primary,
  },
  cardIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
    tintColor: colors.iconTint,
  },
  selectedIcon: {
    tintColor: colors.white,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 5,
    textAlign: 'center',
  },
  selectedCardTitle: {
    color: colors.white,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textGray500,
    textAlign: 'center',
  },
  selectedCardDescription: {
    color: colors.white,
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