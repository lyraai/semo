import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { colors } from '../styles/color';
import { getReport } from '../service/api'; // 引入后端 API 获取报告数据

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>An error occurred: {this.state.error.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function AiChatReportScreen({ route }) {
  const [reportData, setReportData] = useState<any>(null); // 用于存储后端返回的数据
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userId = route.params?.userId; // 从路由参数获取用户ID
        const report = await getReport(userId); // 调用API获取报告
        console.log("Report data received from backend:", report); // Console 中显示后端返回的数据
        setReportData(report);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [route.params?.userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 确保在数据加载完成后再进行渲染
  if (!reportData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>无法加载报告数据，请稍后再试。</Text>
      </View>
    );
  }

  const { summary, recommendations = [], emotion_list = [] } = reportData || {};

  return (
    <ErrorBoundary>
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
          <Text style={styles.chartTitle}>情绪报告摘要</Text>
          <Text style={styles.feedbackText}>{summary || '暂无摘要'}</Text>
        </View>

        {recommendations.length > 0 && (
          <View style={styles.feedbackContainer}>
            {recommendations.map((rec, index) => (
              <Text key={index} style={styles.feedbackText}>建议: {rec}</Text>
            ))}
          </View>
        )}

        {emotion_list.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>情绪变化图</Text>
            <View style={{ height: 200, flexDirection: 'row' }}>
              <YAxis
                data={emotion_list}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 12, fill: colors.textGrey800 }}
              />
              <LineChart
                style={styles.chart}
                data={emotion_list}
                svg={{
                  stroke: colors.primary,
                  strokeWidth: 3,
                }}
                contentInset={{ top: 20, bottom: 20 }}
              >
                <Grid />
              </LineChart>
            </View>
            <XAxis
              style={{ marginHorizontal: -10, marginTop: 10 }}
              data={emotion_list}
              formatLabel={(value, index) => `点${index + 1}`}
              contentInset={{ left: 30, right: 30 }}
              svg={{ fontSize: 12, fill: colors.textGrey800 }}
            />
          </View>
        ) : (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>暂无情绪变化数据</Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="history" type="material" color={colors.primary} />
            <Text style={styles.footerButtonText}>历史</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="chatbubble-outline" type="ionicon" color={colors.primary} />
            <Text style={styles.footerButtonText}>继续聊天</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Icon name="trash-outline" type="ionicon" color={colors.primary} />
            <Text style={styles.footerButtonText}>删除</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.primary,
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoLabel: {
    color: colors.textGrey800,
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textBlack,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  feedbackContainer: {
    padding: 20,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.textBlack,
    marginBottom: 10,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    color: colors.textBlack,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: colors.textPrimary,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  chart: {
    flex: 1,
    marginLeft: 16,
  },
});