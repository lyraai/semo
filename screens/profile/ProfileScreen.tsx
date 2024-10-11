// screens/profile/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { getBasicUserInfo } from '../../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { colors } from '../../styles/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { t, languageCode } from '../../locales/localization';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const semoUserId = useSelector((state: RootState) => state.user.userId);
  const navigation = useNavigation();

  const fetchUserInfo = async () => {
    console.log('Attempting to fetch user info with semoUserId:', semoUserId);

    if (!semoUserId) {
      Alert.alert('错误', '无法获取用户ID');
      setLoading(false);
      return;
    }

    try {
      const data = await getBasicUserInfo(semoUserId);
      console.log('Received user info:', data);
      setUserInfo(data.data); // 这里确保只存储 userInfo 的 data 部分
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      Alert.alert('错误', '无法获取用户信息');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchUserInfo();
    }, [semoUserId])
  );

  useEffect(() => {
    console.log('semoUserId from Redux:', semoUserId);
  }, [semoUserId]);

  useEffect(() => {
    console.log('userInfo updated:', userInfo);
  }, [userInfo]);

  const handleEditProfile = () => {
    Alert.alert('提示', '编辑个人信息功能尚未实现');
  };

  const handleChangeTherapistStyle = () => {
    navigation.navigate('TherapistSettingScreen');
  };

  const handleLogout = () => {
    // 这里可以添加登出逻辑，比如清除用户状态等
    navigation.navigate('Welcome' as never);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!userInfo || Object.keys(userInfo).length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>无法加载用户信息</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/icons/default-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userInfo.username || t('default_username')}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>{t('edit_profile')}</Text>
        </TouchableOpacity>
        
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('basic_info')}</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('age')}：</Text>
          <Text style={styles.infoValue}>{userInfo.age != null ? userInfo.age : t('not_filled')}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('gender')}：</Text>
          <Text style={styles.infoValue}>{userInfo.gender || t('not_filled')}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('current_feeling')}：</Text>
          <Text style={styles.infoValue}>{userInfo.current_feeling || t('not_filled')}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('current_state')}：</Text>
          <Text style={styles.infoValue}>{userInfo.current_state || t('not_filled')}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('expected_duration')}：</Text>
          <Text style={styles.infoValue}>{userInfo.duration || t('not_filled')}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('expectation')}：</Text>
          <Text style={styles.infoValue}>{userInfo.expectation || t('not_filled')}</Text>
        </View>
        {/* 添加当前系统语言显示 */}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('current_language')}：</Text>
          <Text style={styles.infoValue}>{t(languageCode)}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>{t('therapist_style')}</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('current_style')}：</Text>
          <Text style={styles.infoValue}>{userInfo.therapist_style || t('not_selected')}</Text>
        </View>
        <TouchableOpacity style={styles.changeStyleButton} onPress={handleChangeTherapistStyle}>
          <Text style={styles.changeStyleButtonText}>{t('change_therapist_style')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background01,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background01,
  },
  errorText: {
    fontSize: 16,
    color: colors.textGray500,
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.white,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 25,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 15,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textGray700,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  editButton: {
    backgroundColor: colors.sub,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textGray600,
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textGray600,
    flex: 1,
  },
  changeStyleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  changeStyleButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  logoutButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '600',
  },
});

