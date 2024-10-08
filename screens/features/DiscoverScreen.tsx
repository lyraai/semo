// screens/DiscoverScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { colors } from '../../styles/color';

type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: any;
  category: string;
};

export default function DiscoverScreen() {
  // 模拟课程数据
  const courses: Course[] = [
    {
      id: '1',
      title: '释放压力的冥想课程',
      description: '通过冥想练习，帮助您缓解压力，放松身心。',
      duration: '10分钟',
      image: require('../../assets/icons/style-1.png'),
      category: '压力',
    },{
      id: '2',
      title: '释放压力的冥想课程',
      description: '通过冥想练习，帮助您缓解压力，放松身心。',
      duration: '10分钟',
      image: require('../../assets/icons/style-2.png'),
      category: '压力',
    },
    {
      id: '3',
      title: '释放压力的冥想课程',
      description: '通过冥想练习，帮助您缓解压力，放松身心。',
      duration: '10分钟',
      image: require('../../assets/icons/style-3.png'),
      category: '压力',
    },
    {
      id: '4',
      title: '释放压力的冥想课程',
      description: '通过冥想练习，帮助您缓解压力，放松身心。',
      duration: '10分钟',
      image: require('../../assets/icons/style-4.png'),
      category: '压力',
    },
    // 更多课程数据...
  ];

  // 模拟课程分类
  const categories = ['全部', '压力', '孤独感', '焦虑', '情绪修复'];

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索课程"
          placeholderTextColor={colors.textGray500}
        />
      </View>

      <ScrollView>
        {/* 轮播图 Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/banner-1.png')}
            style={styles.bannerImage}
          />
        </View>

        {/* 课程分类 */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 推荐课程列表 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>推荐课程</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.courseCard}>
                <Image source={item.image} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{item.title}</Text>
                  <Text style={styles.courseDuration}>{item.duration}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 更多课程 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>更多课程</Text>
          {/* 可以使用 FlatList 或自定义组件展示更多课程 */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  searchInput: {
    backgroundColor: colors.background01,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
    color: colors.textGray700,
  },
  bannerContainer: {
    height: 220,
    marginBottom: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonText: {
    color: colors.white,
    fontSize: 14,
  },
  sectionContainer: {
    
    paddingVertical: 15,
    paddingLeft: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 10,
  },
  courseCard: {

    width: 140,
    marginRight: 15,
  },
  courseImage: {
    backgroundColor:colors.white,
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  courseInfo: {
    marginTop: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textGray700,
    marginBottom: 5,
  },
  courseDuration: {
    fontSize: 14,
    color: colors.textGray500,
  },
});
