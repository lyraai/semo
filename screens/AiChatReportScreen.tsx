import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { colors } from '../styles/color';
import { getReport } from '../service/api'; // 引入后端 API 获取报告数据
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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
  const [reportData, setReportData] = useState<any>(null); // 于存储后端返回的数据
  const [loading, setLoading] = useState<boolean>(true);
  const userId = useSelector((state: RootState) => state.user.userId);// 从 Redux 获取 userId
  console.log("current user id", userId); 

  useEffect(() => {
    const fetchReport = async () => {
      try {
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
  }, [userId]);

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

  const summary = reportData?.summary ?? '暂无摘要';
  const recommendations = Array.isArray(reportData?.recommendations) ? reportData.recommendations : [];
  const emotion_list = Array.isArray(reportData?.emotion_list) ? reportData.emotion_list : [];
  
  console.log("Summary:", summary); // 保留这行调试输出

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

        {/* 摘要部分 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>情绪报告摘要</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        {/* 添加建议部分 */}
        {recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.sectionTitle}>建议</Text>
            {recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
          </View>
        )}

        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>建议</Text>
          {recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
        </View>

        {/* 情绪图表部分 */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>情绪变化图</Text>
          {emotion_list.length > 0 ? (
            <View style={{ height: 200, flexDirection: 'row' }}>
              <YAxis
                data={emotion_list}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 10, fill: colors.textGrey800 }}
                numberOfTicks={5}
                formatLabel={(value) => `${value}`}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <LineChart
                  style={{ flex: 1 }}
                  data={emotion_list}
                  svg={{ stroke: colors.primary, strokeWidth: 3 }}
                  contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
                >
                  <Grid />
                </LineChart>
                <XAxis
                  style={{ marginHorizontal: -10 }}
                  data={emotion_list}
                  formatLabel={(value, index) => `${index + 1}`}
                  contentInset={{ left: 10, right: 10 }}
                  svg={{ fontSize: 10, fill: colors.textGrey800 }}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>暂无情绪变化数据</Text>
          )}
        </View>

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
    backgroundColor: colors.textPrimary, // 确保这个颜色与背景形成对比
    marginBottom: 10,
    width: '100%', // 确保容器占满宽度
    borderWidth: 1, // 添加边框以便于调试
    borderColor: 'red',
  },
  infoBlock: {
    alignItems: 'center',
    flex: 1, // 使每个块平均分配空间
    borderWidth: 1, // 添加边框以便于调试
    borderColor: 'blue',
  },
  infoLabel: {
    color: 'black', // 改为明确的颜色
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold', // 加粗以便更容易看到
  },
  infoValue: {
    fontSize: 16,
    color: 'blue', // 使用明显的颜色
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0', // 使用明显的背景色
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'red',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: 'black',
    lineHeight: 20,
  },
  recommendationsContainer: {
    padding: 15,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.textBlack,
    marginBottom: 5,
  },
  chartContainer: {
    padding: 15,
    backgroundColor: colors.textPrimary,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    color: colors.textGrey800,
    textAlign: 'center',
    marginTop: 20,
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