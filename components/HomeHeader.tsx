// components/HomeHeader.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../styles/color';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logos/1x/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140, // 自定义 Header 高度
    backgroundColor: colors.background01,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  logo: {
    marginTop: 30,
    width: 100, // 自定义 Logo 宽度
    height: 40, // 自定义 Logo 高度
  },
});

export default HomeHeader;
