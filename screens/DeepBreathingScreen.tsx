import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import { colors } from '../styles/color';

const { width } = Dimensions.get('window');

export default function DeepBreathingScreen({ navigation }) { // 添加 navigation 用于跳转
  const [scaleAnim] = useState(new Animated.Value(1));  

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5, // 扩大
          duration: 4000, // 吸气时间
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // 收缩
          duration: 4000, // 呼气时间
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();

    return () => breathingAnimation.stop(); // 停止动画在组件卸载时
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus on your breath</Text>
      <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
      <Button 
        title="开始冥想" 
        buttonStyle={styles.button} 
        onPress={() => navigation.goBack()} // 示例按钮返回上一页
      />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: '#81c784',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    width: 200,
  },
});