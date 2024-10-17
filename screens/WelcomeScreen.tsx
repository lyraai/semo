// screens/WelcomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, Platform, TouchableOpacity, Animated, SafeAreaView, NativeModules, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { checkBackendConnection, generateUserId } from '../service/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserId, loadUserIdFromStorage } from '../redux/slices/userSlice';
import { colors } from '../styles/color';
import Constants from 'expo-constants';
import { RootState, AppDispatch } from '../redux/store'; 
import { t, languageCode } from '../locales/localization';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [textOpacity] = useState(new Animated.Value(1));
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(loadUserIdFromStorage());
    const checkConnection = async () => {
      try {
        const result = await checkBackendConnection();
        setConnectionStatus(result.message || t('connectionSuccess'));
      } catch (error) {
        setConnectionStatus(t('connectionError'));
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

  const handleSignup = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newUserId = await generateUserId();
      await dispatch(updateUserId(newUserId)).unwrap();
      navigation.navigate('Question0');
    } catch (error) {
      console.error('Failed to generate or update user ID:', error);
      Alert.alert('Error', 'Failed to generate or update user ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const version = Constants.expoConfig?.version || t('unknown');
  const buildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }) || t('unknown');

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部Logo和欢迎信息 */}
      <View style={styles.topSection}>
        <Image source={require('../assets/logos/1x/logo.png')} style={styles.logo} />
        <Text style={styles.title}>semo</Text>
        <Text style={styles.subtitle}>
          version: {version} (build: {buildNumber}) - {t('lang')}: {languageCode}
        </Text>
      </View>

      {/* 固定高度的测试信息 */}
      <View style={styles.middleSection}>
        {connectionStatus && (
          <Text style={styles.connectionStatus}>{connectionStatus}</Text>
        )}
        {userId ? (
          <Text style={styles.userIdText}>ID: {userId}</Text>
        ) : (
          <Button title={t('generate_user_id')} onPress={generateUserId} color="#4CAF50" />
        )}
      </View>

      {/* 底部按钮容器 */}
      <View style={styles.buttonContainer}>
        {/* 注册按钮 */}
        <View style={styles.signupSection}>
          <TouchableOpacity 
            onPress={handleSignup} 
            disabled={isLoading}
            style={[styles.signupButton, isLoading && styles.disabledButton]}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Animated.Text style={[styles.signupText, { opacity: textOpacity }]}>
                {t('signup')}
              </Animated.Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 登录按钮 */}
        <View style={styles.loginSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Animated.Text style={[styles.loginText, { opacity: textOpacity }]}>
              {t('login')}
            </Animated.Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flex: 2, // 底部按钮容器占用的空间
    justifyContent: 'space-between', // 让按钮之间有间距
    alignItems: 'center',
    paddingBottom: 30, // 为按钮容器添加一些底部间距
    marginHorizontal: 10,
  },
  signupSection: {
    maxWidth: '50%',
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  loginSection: {
    marginTop: 10, // 使登录按钮与注册按钮有一些间距
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 18,
    color: colors.textGray600,
    textAlign: 'center',
  },
  signupButton: {
    width: '100%',
    height: 40, // 固定按钮高度
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
