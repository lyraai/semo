// /Users/bailangcheng/Desktop/semo/screens/ToolSelectionScreen.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { colors } from '../styles/color';

const { width } = Dimensions.get('window');

export default function ToolSelectionScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardPress = (healingMethod) => {
    if (healingMethod === 'ChatScreen') {
      // 如果选择的是对话疗愈，则导航到疗愈师风格选择页面
      navigation.navigate('TherapistSettingScreen');
    } else {
      navigation.navigate(healingMethod); // 导航到其他疗愈工具
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>选择一种方式</Text>
        <Text style={styles.subtitle}>情绪急救选项</Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width} // 确保卡片居中对齐
          decelerationRate="fast"
          contentContainerStyle={styles.cardContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { listener: handleScroll, useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <TouchableOpacity onPress={() => handleCardPress('ChatScreen')}>
            <View style={styles.card}>
              <Image source={require('../assets/icons/1x/Telegram App.png')} style={styles.icon} />
              <Text style={styles.cardTitle}>疗愈对话</Text>
              <Text style={styles.cardSubtitle}>与疗愈师进行温暖的对话，倾诉您的感受</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCardPress('Meditation')}>
            <View style={styles.card}>
              <Image source={require('../assets/icons/1x/Thinking Bubble-1.png')} style={styles.icon} />
              <Text style={styles.cardTitle}>引导冥想</Text>
              <Text style={styles.cardSubtitle}>通过冥想练习平静心灵，缓解情绪</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCardPress('DeepBreathing')}>
            <View style={styles.card}>
              <Image source={require('../assets/icons/1x/Lotus.png')} style={styles.icon} />
              <Text style={styles.cardTitle}>深呼吸练习</Text>
              <Text style={styles.cardSubtitle}>学习深呼吸技巧，快速舒缓情绪</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* 指示器 */}
        <View style={styles.indicatorContainer}>
          {[...Array(3).keys()].map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                { backgroundColor: activeIndex === i ? colors.primary : colors.disabled }
              ]}
            />
          ))}
        </View>

        <Text style={styles.footerText}>亲爱的，您很勇敢。{"\n"}记住，每一步都是向着光明前进。</Text>
    

        <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert('确认选择')}>
          <Text style={styles.confirmButtonText}>我选择好了</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // 确保背景颜色一致
  },
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column', // 确保从上到下排列
    backgroundColor: colors.background,
    paddingTop: 0, // 可以根据需要调整
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 10,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: colors.primary,
    width: width * 0.8,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  footerText: {
    fontSize: 16,
    color: colors.textDisabled,
    marginTop: 20,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: width * 0.8,
    alignItems: 'center',
    marginBottom: 20, // 避免与底部重叠
  },
  confirmButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: colors.disabled,
  },
});