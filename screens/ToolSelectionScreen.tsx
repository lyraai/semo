// /screens/ToolSelectionScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { colors } from '../styles/color';

const { width } = Dimensions.get('window');

export default function ToolSelectionScreen({ navigation }) {
  const handleCardPress = (healingMethod) => {
    // 根据选择的疗愈方式进行跳转
    navigation.navigate(healingMethod);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>选择一种方式</Text>
      <Text style={styles.subtitle}>情绪急救选项</Text>
      
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.cardContainer}>
        <TouchableOpacity onPress={() => handleCardPress('ChatScreen')}>
          <View style={styles.card}>
            <Image source={require('../assets/icons/1x/Lotus.png')} style={styles.icon} />
            <Text style={styles.cardTitle}>疗愈对话</Text>
            <Text style={styles.cardSubtitle}>与疗愈师进行温暖的对话，倾诉您的感受</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleCardPress('Meditation')}>
          <View style={styles.card}>
            <Image source={require('../assets/icons/1x/Lotus.png')} style={styles.icon} />
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

      <Text style={styles.footerText}>亲爱的，您很勇敢。记住，每一步都是向着光明前进。</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert('确认选择')}>
        <Text style={styles.confirmButtonText}>我选择好了</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // 使用背景颜色
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary, // 使用主颜色
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.primary, // 使用主颜色
    marginBottom: 20,
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.primary, // 使用主颜色
    width: width * 0.8,
    height: 300,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary, // 使用按钮文本颜色
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textPrimary, // 使用按钮文本颜色
  },
  footerText: {
    fontSize: 16,
    color: colors.textDisabled, // 使用禁用文本颜色
    marginTop: 20,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary, // 使用主按钮颜色
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.textPrimary, // 使用按钮文本颜色
    fontSize: 18,
    fontWeight: 'bold',
  },
});