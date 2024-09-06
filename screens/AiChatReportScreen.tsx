import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart } from 'react-native-svg-charts';

export default function AiChatReportScreen() {
  const data = [1, 2, 3, 2.5, 4, 5];

  return (
    <ScrollView style={styles.container}>

      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>日期</Text>
          <Text style={styles.infoValue}>2024/08/20</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>时间</Text>
          <Text style={styles.infoValue}>21:20</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>聊天时长</Text>
          <Text style={styles.infoValue}>18min</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBlock}>
          <Icon name="cloud-outline" type="ionicon" color="#f06262" size={30} />
          <Text style={styles.summaryLabel}>思念</Text>
        </View>
        <View style={styles.summaryBlock}>
          <Icon name="heart-broken" type="ionicon" color="#f06262" size={30} />
          <Text style={styles.summaryLabel}>前任</Text>
        </View>
        <View style={styles.summaryBlock}>
          <Icon name="hand-heart" type="material-community" color="#f06262" size={30} />
          <Text style={styles.summaryLabel}>温暖模式</Text>
        </View>
      </View>

      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>
          Semo: 在这次聊天中，我们讨论了您对前任挥之不去的思念，发现这些情感主要来自美好的回忆和未能实现的期望。
        </Text>
        <Text style={styles.feedbackText}>
          建议: 试着将注意力转移到自我成长上，每天抽出15分钟做一件纯粹为自己的事，这能帮助您重新建立独立的生活重心。
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>本次聊天中您的情绪变化</Text>
        <LineChart
          style={styles.chart}
          data={data}
          svg={{ stroke: '#f06262', strokeWidth: 3 }}
          contentInset={{ top: 20, bottom: 20 }}
          showGrid={false}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="history" type="material" color="#f06262" />
          <Text style={styles.footerButtonText}>历史</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="chatbubble-outline" type="ionicon" color="#f06262" />
          <Text style={styles.footerButtonText}>继续聊天</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Icon name="trash-outline" type="ionicon" color="#f06262" />
          <Text style={styles.footerButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F7F4EE',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  summaryBlock: {
    alignItems: 'center',
  },
  summaryLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#f06262',
  },
  feedbackContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    height: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    color: '#f06262',
    marginTop: 5,
  },
});