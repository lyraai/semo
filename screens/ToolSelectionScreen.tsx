// screens/ToolSelectionScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/color';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8 + 30; // 卡片宽度 + 左右边距

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
    const index = Math.round(contentOffsetX / cardWidth);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 内容容器 */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>选择疗愈方式</Text>
          <Text style={styles.subtitle}>在主界面可以选择疗愈方式</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth}
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
                <Image
                  source={require('../assets/icons/2x/Telegram App.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>疗愈对话</Text>
                <Text style={styles.cardSubtitle}>
                  与疗愈师进行温暖的对话，{"\n"}倾诉您的感受
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCardPress('Meditation')}>
              <View style={styles.card}>
                <Image
                  source={require('../assets/icons/2x/Thinking Bubble-1.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>引导冥想</Text>
                <Text style={styles.cardSubtitle}>
                  通过冥想练习{"\n"}平静心灵，缓解情绪
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCardPress('DeepBreathing')}>
              <View style={styles.card}>
                <Image
                  source={require('../assets/icons/2x/Lotus.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>深呼吸练习</Text>
                <Text style={styles.cardSubtitle}>
                  学习深呼吸技巧，{"\n"}快速舒缓情绪
                </Text>
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
                  {
                    backgroundColor:
                      activeIndex === i ? colors.primary : colors.disabled,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* 底部容器 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            亲爱的，您很勇敢。{'\n'}记住，每一步都是向着光明前进。
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background01, // 确保背景颜色一致
  },
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  contentContainer: {
    flex: 1, // 占据剩余空间
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: colors.background01,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGray600,
    marginBottom: 10,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: (width - cardWidth) / 2, // 调整左右内边距，使第一个和最后一个卡片居中
  },
  card: {
    backgroundColor: colors.primary,
    width: width * 0.8,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    padding: 40,
  },
  icon: {
    width: 150,
    height: 150,
    marginTop:20,
    marginBottom: 50,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 0,    // 行高
    letterSpacing: 0, // 字母间距
    color: colors.textPrimary,
    marginBottom: 20,
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,    // 行高
    letterSpacing: 0.5, // 字母间距
    color: colors.textPrimary,
  },
  footerText: {
    fontSize: 14,
    color: colors.textGray600,
    lineHeight: 24,    // 行高
    letterSpacing: 0.5, // 字母间距
    textAlign: 'center',
    marginBottom: 20,
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
