import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { checkBackendConnection, generateUserId } from '../service/api';
import { useDispatch } from 'react-redux';
import { updateUserId } from '../redux/slices/userSlice';
import { colors } from '../styles/color';
import Constants from 'expo-constants';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const dispatch = useDispatch();  // 使用 Redux dispatch
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkBackendConnection();
        setConnectionStatus(result.message || '连接成功'); // 假设返回的对象有 message 属性
      } catch (error) {
        setConnectionStatus('无法连接到服务器，已切换到模拟模式');
      }
    };

    checkConnection();
  }, []);

  const handleGenerateUserId = async () => {
    try {
      const id = await generateUserId();
      dispatch(updateUserId(id));  // 将 userId 存储到 Redux
      Alert.alert('用户ID生成成功', `生成的用户ID: ${id}`);
    } catch (error) {
      Alert.alert('生成用户ID失败', '请检查网络连接或后端状态');
    }
  };

  const version = Constants.expoConfig?.version || '未知';
  const buildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }) || '未知';

  console.log('Version:', version);
  console.log('Build Number:', buildNumber);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logos/1x/logo.png')} style={styles.logo} />
      <Text style={styles.title}>欢迎来到Semo心茉</Text>
      <Text style={styles.subtitle}>你的情绪急救助手 version: {version} (build: {buildNumber})</Text>
      {connectionStatus && (
        <Text style={styles.connectionStatus}>{connectionStatus}</Text>
      )}

      <Button
        title="开始"
        onPress={() => navigation.navigate('Question0')}
        color="#f06262"
      />
      
      {/* 新增的生成用户ID的按钮 */}
      <View style={styles.testButtonContainer}>
        <Button title="测试生成用户ID" onPress={handleGenerateUserId} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666', // 确保这个颜色与背景形成对比
    marginBottom: 10,
  },
  connectionStatus: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 20,
  },
  testButtonContainer: {
    marginTop: 20,
  },
  userIdText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  }
});