// components/DefaultHeader.tsx
import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../styles/color';

const DefaultHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <Icon
        name="chevron-left"
        type="feather"
        color={colors.primary}
        size={30}
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconContainer}
      />
      {/* 标题 */}
      <Text style={styles.title}>{title}</Text>
      {/* 右侧占位，使标题居中 */}
      <View style={{ width: 30 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120, // 自定义 Header 高度
    backgroundColor: colors.background01,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
 
  },
  iconContainer: {
    marginTop: 30,
  },
  title: {
    marginTop: 30,
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DefaultHeader;
