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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/color';
import HomeHeader from '../components/HomeHeader';
import { t, languageCode } from '../locales/localization';

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
      
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('choose_healing_method')}</Text>
          <Text style={styles.subtitle}>{t('healing_subtitle')}</Text>

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
                  source={require('../assets/icons/feature-1.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>{t('healing_chat')}</Text>
                <Text style={styles.cardSubtitle}>
                  {t('healing_chat_description')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCardPress('Meditation')}>
              <View style={styles.card}>
                <Image
                  source={require('../assets/icons/feature-2.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>{t('guided_meditation')}</Text>
                <Text style={styles.cardSubtitle}>
                  {t('guided_meditation_description')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleCardPress('DeepBreathing')}>
              <View style={styles.card}>
                <Image
                  source={require('../assets/icons/feature-3.png')}
                  style={styles.icon}
                />
                <Text style={styles.cardTitle}>{t('deep_breathing')}</Text>
                <Text style={styles.cardSubtitle}>
                  {t('deep_breathing_description')}
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
          </Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
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
    height: 150,
    paddingVertical: 10,
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
    fontSize: 16,
    color: colors.textGray600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 0,
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
    marginBottom: 10,
  },
  icon: {
    width: 200,
    height: 200,
    marginTop:20,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 0,    // 行高
    letterSpacing: 1.5, // 字母间距
    color: colors.textPrimary,
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,    // 行高
    letterSpacing: 0.5, // 字母间距
    color: colors.textPrimary,
  },
  footerText: {
    fontSize: 16,
    color: colors.textGray600,
    lineHeight: 24,    // 行高
    letterSpacing: 0.5, // 字母间距
    textAlign: 'center',
    marginBottom: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: colors.disabled,
  },
});
