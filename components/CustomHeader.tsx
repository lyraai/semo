// components/CustomHeader.tsx
import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

const CustomHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        type="feather"
        color='#fff'
        size={30}
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconContainer}
      />
      {/* 其他自定义内容可以在这里添加 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60, // 自定义 Header 高度
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    // 根据需要调整背景色或其他样式
  },
  iconContainer: {
    // 这里可以添加额外的图标样式
  },
});

export default CustomHeader;