// screens/features/MoodJourneyScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { colors } from '../../styles/color';
import { LineChart } from 'react-native-chart-kit'; // 需要安装第三方库
import { Dimensions } from 'react-native';

type MoodRecord = {
  id: string;
  date: string;
  mood: string;
  note?: string;
};

export default function MoodJourneyScreen() {
  // 模拟情绪记录数据
  const moodRecords: MoodRecord[] = [
    { id: '1', date: '2023-09-01', mood: '开心', note: '今天和朋友出去玩了，很开心！' },
    // 更多情绪记录...
  ];

  // 模拟情绪趋势数据
  const moodTrendData = {
    labels: ['9月1日', '9月2日', '9月3日', '9月4日', '9月5日', '9月6日', '9月7日'],
    datasets: [
      {
        data: [3, 4, 2, 5, 3, 4, 5],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* 情绪趋势图表 */}
      <ScrollView>
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>情绪趋势</Text>
          <LineChart
            data={moodTrendData}
            width={Dimensions.get('window').width - 30}
            height={220}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(225, 77, 90, ${opacity})`,
              labelColor: () => colors.textGray500,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* 添加情绪记录按钮 */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>添加情绪记录</Text>
        </TouchableOpacity>

        {/* 情绪记录列表 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>情绪记录</Text>
          <FlatList
            data={moodRecords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordMood}>{item.mood}</Text>
                  <Text style={styles.recordDate}>{item.date}</Text>
                </View>
                {item.note ? <Text style={styles.recordNote}>{item.note}</Text> : null}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.background01,
  },
  chartContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textGray700,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 15,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  recordItem: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  recordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordMood: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textGray700,
  },
  recordDate: {
    fontSize: 14,
    color: colors.textGray500,
  },
  recordNote: {
    fontSize: 14,
    color: colors.textGray600,
    marginTop: 5,
  },
});
