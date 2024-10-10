import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, Platform, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { checkBackendConnection, generateUserId } from '../service/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserId, loadUserIdFromStorage } from '../redux/slices/userSlice';
import { colors } from '../styles/color';
import Constants from 'expo-constants';
import { RootState } from '../redux/store'; 

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [textOpacity] = useState(new Animated.Value(1));
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    dispatch(loadUserIdFromStorage());
    const checkConnection = async () => {
      try {
        const result = await checkBackendConnection();
        setConnectionStatus(result.message || '连接成功');
      } catch (error) {
        setConnectionStatus('无法连接到服务器，已切换到模拟模式');
      }
    };
    checkConnection();
  }, [dispatch]);

  // 动态文字透明度变化效果
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [textOpacity]);

  const version = Constants.expoConfig?.version || '未知';
  const buildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }) || '未知';

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部Logo和欢迎信息 */}
      <View style={styles.topSection}>
        <Image source={require('../assets/logos/1x/logo.png')} style={styles.logo} />
        <Text style={styles.title}>semo</Text>
        <Text style={styles.subtitle}>version: {version} (build: {buildNumber})</Text>
      </View>

      {/* 固定高度的测试信息 */}
      <View style={styles.middleSection}>
        {connectionStatus && (
          <Text style={styles.connectionStatus}>{connectionStatus}</Text>
        )}
        {userId ? (
          <Text style={styles.userIdText}>ID: {userId}</Text>
        ) : (
          <Button title="生成用户ID" onPress={generateUserId} color="#4CAF50" />
        )}
      </View>

      {/* 底部固定按钮 */}
      <View style={styles.signupSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Question0')}>
          <Animated.Text style={[styles.signupText, { opacity: textOpacity }]}>
            注册
          </Animated.Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Animated.Text style={[styles.loginText, { opacity: textOpacity }]}>
            登录
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  topSection: {
    flex: 12, // 顶部部分占据较大空间
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 0,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textGray500,
    textAlign: 'center',
  },
  middleSection: {
    flex: 1, // 中间部分固定高度
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 0,
    marginBottom: 30,
  },
  connectionStatus: {
    fontSize: 14,
    color: colors.textGray500,
    marginBottom: 0,
    textAlign: 'left',
  },
  userIdText: {
    fontSize: 14,
    color: colors.textGray500,
    marginBottom: 0,
    textAlign: 'left',
  },
  signupSection: {
    flex: 1, 
    backgroundColor: colors.primary,
    borderRadius:25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40, 
    marginHorizontal: 120,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
    marginBottom: 40,
  },
  signupText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'regular',
    color: colors.textGray600,
    marginTop: 10, // 和“开始”按钮之间保持间距
  },
});
