// screens/profile/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { getBasicUserInfo } from '../../service/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { colors } from '../../styles/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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
        <Text style={styles.userName}>{userInfo.username || '用户名'}</Text> 
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>编辑个人信息</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>年龄：</Text>
          <Text style={styles.infoValue}>{userInfo.age != null ? userInfo.age : '未填写'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>性别：</Text>
          <Text style={styles.infoValue}>{userInfo.gender || '未填写'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>当前感受：</Text>
          <Text style={styles.infoValue}>{userInfo.current_feeling || '未填写'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>当前状态：</Text>
          <Text style={styles.infoValue}>{userInfo.current_state || '未填写'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>期望疗程：</Text>
          <Text style={styles.infoValue}>{userInfo.duration || '未填写'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>期望：</Text>
          <Text style={styles.infoValue}>{userInfo.expectation || '未填写'}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>疗愈师风格</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>当前风格：</Text>
          <Text style={styles.infoValue}>{userInfo.therapist_style || '未选择'}</Text>
        </View>
        <TouchableOpacity style={styles.changeStyleButton} onPress={handleChangeTherapistStyle}>
          <Text style={styles.changeStyleButtonText}>修改疗愈师风格</Text>
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
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 10,
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
});
