// components/DefaultHeader.tsx
import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/color';

const DefaultHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        type="feather"
        color='#E14D5A'
        size={30}
        onPress={() => navigation.goBack()}
        containerStyle={styles.iconContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60, // 自定义 Header 高度
    backgroundColor: colors.background01,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  iconContainer: {
    // 这里可以添加额外的图标样式
  },
});

export default DefaultHeader;