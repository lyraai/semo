// screens/features/MoodJourneyScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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
    { id: '2', date: '2023-09-02', mood: '中性', note: '今天工作很忙，但感觉还可以。' },
    { id: '3', date: '2023-09-03', mood: '不开心', note: '今天遇到一些问题，心情不太好。' },
    { id: '4', date: '2023-09-04', mood: '开心', note: '解决了问题，心情好多了。' },
    { id: '5', date: '2023-09-05', mood: '满意', note: '今天进展顺利，感觉很充实。' },
  ];

  // 模拟情绪趋势数据
  const moodTrendData = {
    labels: ['1日', '2日', '3日', '4日', '5日', '6日', '7日'], // X轴的标签
    datasets: [
      {
        data: [3, 4, 2, 5, 3, 4, 5], // 情绪数据
        color: (opacity = 1) => `rgba(225, 77, 90, ${opacity})`, // 自定义线条颜色 (透明度控制)
        strokeWidth: 2, // 线条宽度
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* 情绪趋势图表 */}
      <ScrollView>
        <View style={styles.chartOuterContainer}>
          <Text style={styles.sectionTitle}>情绪趋势</Text>
          {/* 图表放在单独的容器中 */}
          <View style={styles.chartContainer}>
            <LineChart
              data={moodTrendData}
              width={Dimensions.get('window').width - 80} // 设置图表的宽度
              height={200} // 设置图表的高度
              chartConfig={{
                backgroundColor: colors.white,
                backgroundGradientFrom: colors.white,
                backgroundGradientTo:  colors.white,
                decimalPlaces: 0, // 数据显示的小数位数，0代表整数
                color: (opacity = 1) => `rgba(225, 77, 90, ${opacity})`, // 图表线条的颜色，带透明度
                labelColor: () => colors.textGray500, // X和Y轴标签的颜色
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "4", // 数据点的半径
                  strokeWidth: "2", // 数据点的边框宽度
                  stroke: colors.primary, // 数据点的边框颜色
                },
                propsForBackgroundLines: {
                  stroke: colors.gray200, // 背景线条的颜色
                  strokeDasharray: "5, 5", // 背景线条的虚线样式 (每条5px)
                },
                propsForLabels: {
                  fontSize: 12, // 标签字体大小
                  fontWeight: "bold", // 标签字体粗细
                },
              }}
              bezier // 使用贝塞尔曲线来平滑折线图
              style={{
                marginVertical: 8, // 上下外边距
                // 图表本身不需要边框圆角
              }}
            />
          </View>
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
    paddingHorizontal: 15, // 水平方向的内边距
    backgroundColor: colors.background01, // 页面背景颜色
  },
  chartOuterContainer: {
    marginTop: 15, // 外部容器的上外边距
    padding: 10, // 外部容器的内边距
    shadowColor: '#000', // 设置阴影颜色
    shadowOffset: { width: 0, height: 2 }, // 设置阴影偏移
    shadowOpacity: 0.1, // 阴影透明度
    shadowRadius: 8, // 阴影模糊半径
    elevation: 3, // Android专用的阴影效果
  },
  chartContainer: {
    backgroundColor: colors.white, // 外部容器的背景色
    borderRadius: 25, // 设置外部容器的圆角
    alignItems: 'center',
    // 图表容器不再需要边框圆角，只需要布局
  },
  sectionTitle: {
    fontSize: 18, // 标题文字大小
    fontWeight: '600', // 标题文字粗细
    color: colors.textGray700, // 标题文字颜色
    marginBottom: 10, // 标题下方的外边距
  },
  addButton: {
    backgroundColor: colors.primary, // 按钮背景色
    paddingVertical: 12, // 按钮上下内边距
    borderRadius: 25, // 按钮的圆角半径
    alignItems: 'center', // 居中对齐按钮内容
    marginVertical: 15, // 按钮上下外边距
  },
  addButtonText: {
    color: colors.white, // 按钮文字颜色
    fontSize: 16, // 按钮文字大小
  },
  sectionContainer: {
    marginBottom: 20, // 区块的下外边距
  },
  recordItem: {
    backgroundColor: colors.white, // 记录项的背景色
    padding: 15, // 记录项的内边距
    borderRadius: 10, // 记录项的圆角半径
    marginBottom: 10, // 记录项下方的外边距
  },
  recordInfo: {
    flexDirection: 'row', // 行方向布局
    justifyContent: 'space-between', // 两端对齐
    marginBottom: 5, // 信息栏的下外边距
  },
  recordMood: {
    fontSize: 16, // 情绪文字大小
    fontWeight: '500', // 情绪文字粗细
    color: colors.textGray700, // 情绪文字颜色
  },
  recordDate: {
    fontSize: 14, // 日期文字大小
    color: colors.textGray500, // 日期文字颜色
  },
  recordNote: {
    fontSize: 14, // 备注文字大小
    color: colors.textGray600, // 备注文字颜色
    marginTop: 5, // 备注上方的外边距
  },
});