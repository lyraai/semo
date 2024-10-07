// components/ChatHeader.tsx
import React from 'react';
import { Icon } from 'react-native-elements';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/color';

const ChatHeader = ({ title }) => {
  const navigation = useNavigation();

  const goToReport = () => {
    // 跳转到 AiChatReportScreen，并发送请求获取报告
    navigation.navigate('AiChatReportScreen');
  };

  return (
    <View style={styles.container}>
      {/* 左侧返回按钮 */}
      <Icon
        name="chevron-left"
        type="feather"
        color={colors.primary}
        size={30}
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconContainer}
      />

      {/* 中间标题 */}
      <Text style={styles.title}>{title}</Text>

      {/* 右侧报告按钮 */}
      <TouchableOpacity onPress={goToReport}>
        <Text style={styles.buttonText}>报告</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: colors.background01,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 0, // 如果需要适配刘海屏，可以调整这个值
  },
  iconContainer: {
    marginTop: 30,

  },
  buttonText: {
    marginTop: 30,
    color: colors.primary,
    fontSize: 16,
  },
  title: {
    marginTop: 30,
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatHeader;
