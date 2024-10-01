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
    flexDirection: 'row',
    alignItems: 'center',
    // 添加更多样式以适应您的设计需求
  },
  iconContainer: {
    marginLeft: 15,
  },
});

export default CustomHeader;