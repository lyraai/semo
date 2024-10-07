// screens/MeditationScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video, Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';  // 使用Svg绘制圆形
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';  // 使用reanimated来做动画
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function MeditationScreen({ navigation }) {
  const scaleAnim = useSharedValue(1);  // 使用useSharedValue来处理圆形缩放动画
  const [breathText, setBreathText] = useState("请慢慢呼吸...");
  const videoRef = useRef(null);
  const soundRef = useRef(null); // 用来管理音频播放

  // 设置音频的播放
  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/soundscape-nightforest.mp3'),
      { shouldPlay: true, isLooping: true }
    );
    soundRef.current = sound;
    await sound.playAsync();
  };

  // 清理音频资源
  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    }
  };

  // 呼吸动画和文本变化
  useEffect(() => {
    // 让圆形在呼吸过程中放大和缩小
    scaleAnim.value = withRepeat(
      withTiming(1.5, { duration: 4000 }),  // 缩放倍数和时间
      -1,  // 无限循环
      true  // 往返动画
    );

    const textInterval = setInterval(() => {
      setBreathText((prevText) => (prevText === "请慢慢吸气..." ? "请慢慢呼气..." : "请慢慢吸气..."));
    }, 4000);

    return () => {
      clearInterval(textInterval);
    };
  }, []);

  // 确保视频和音频在屏幕聚焦时播放
  useFocusEffect(
    React.useCallback(() => {
      videoRef.current.playAsync();
      playAudio();  // 开始播放音频

      return () => {
        videoRef.current.pauseAsync();
        stopAudio();  // 停止播放音频
      };
    }, [])
  );

  // 动态缩放样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/animation/gradient-01-mobile.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      {/* 呼吸可视化的圆形 */}
      <Animated.View style={[styles.breathingCircle, animatedStyle]}>
        <Svg width={width * 0.6} height={width * 0.6} viewBox={`0 0 ${width * 0.6} ${width * 0.6}`}>
          <Circle
            cx={width * 0.3}
            cy={width * 0.3}
            r={width * 0.25}
            stroke="rgba(255, 255, 255, 0.8)"  // 描边颜色
            strokeWidth={3}  // 描边宽度
            fill="none"  // 没有填充
          />
        </Svg>
      </Animated.View>

      {/* 呼吸提示文本 */}
      <Text style={[styles.breathingText, { top: height / 2 + 250 }]}> 
        {breathText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    position: 'absolute',
    top: height / 2 - (width * 0.3),
  },
  breathingText: {
    position: 'absolute',
    top: height / 2 - 50,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    zIndex: 2,
  },
});