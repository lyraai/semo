// /Users/bailangcheng/Desktop/dev/semo/screens/AiChatReportScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart, Grid } from 'react-native-svg-charts';
import { colors } from '../styles/color';
import { getReport } from '../service/api'; 
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

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container}>
        {/* 第一部分：日期、时间和时长 */}
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

        {/* 第二部分：对话模式 */}
        <View style={styles.modeContainer}>
          <View style={styles.modeBox}>
            <View style={styles.modeBlock}>
              <Image source={require('../assets/icons/2x/Thinking Bubble.png')} style={styles.icon} />
              <Text style={styles.modeText}>思念</Text>
            </View>
            <View style={styles.modeBlock}>
              <Image source={require('../assets/icons/2x/Melting Heart.png')} style={styles.icon} />
              <Text style={styles.modeText}>前任</Text>
            </View>
            <View style={styles.modeBlock}>
              <Image source={require('../assets/icons/2x/Hand Holding Heart.png')} style={styles.icon} />
              <Text style={styles.modeText}>温暖模式</Text>
            </View>
          </View>
        </View>

        {/* 第三部分：总结和建议 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>对话总结</Text>
          <Text style={styles.summaryText}>{summary}</Text>
          {recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              {recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationText}>• {rec}</Text>
              ))}
            </View>
          )}
        </View>

        {/* 第四部分：情绪变化图表 */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>情绪变化</Text>
          {emotion_list.length > 0 ? (
            <View style={{ height: 150, flexDirection: 'row', alignItems: 'center' }}>
              {/* 左侧竖着显示悲伤到笑脸的图标 */}
              <View style={styles.emotionIconsContainer}>
                <Image source={require('../assets/icons/2x/Happy.png')} style={styles.emotionIcon} />
                <Image source={require('../assets/icons/2x/Disappointed.png')} style={styles.emotionIcon} />
              </View>
              {/* 线条颜色变浅，线条宽度减少 */}
              <View style={{ flex: 1, marginLeft: 15 }}>
                <LineChart
                  style={{ flex: 1 }}
                  data={emotion_list}
                  svg={{ stroke: colors.primary, strokeWidth: 3,strokeLinecap: 'round' }} 
                  contentInset={{ top: 0, bottom: 0 }}
                >
                  <Grid 
                    svg={{ stroke: '#E0E0E0', strokeWidth: 1 }} 
                    belowChart={true} 
                    yTicks={3} 

                  />
                </LineChart>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>暂无情绪变化数据</Text>
          )}
        </View>

        
      </ScrollView>
    </ErrorBoundary>
  );
}const styles = StyleSheet.create({
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
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.primary,
    fontSize: 16,
  },

  // 第一部分样式
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#ffffff', 
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  infoBlock: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9E9E9E',  
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textGray600,  
  },

  // 第二部分样式
  modeContainer: {
    justifyContent: 'center',
    backgroundColor: '#ffffff', 
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  modeBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeBlock: {
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    tintColor: colors.primary, 
  },
  modeText: {
    fontSize: 14,
    color: '#9E9E9E', 
  },

  // 第三部分样式
  summaryContainer: {
    backgroundColor: '#ffffff', 
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textGray600, 
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textGray600,
    lineHeight: 22,
  },
  recommendationsContainer: {
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.textGray600,
    marginBottom: 5,
  },

  // 第四部分样式
  chartContainer: {
    padding: 20,
    backgroundColor: '#ffffff',  
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  emotionIconsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionIcon: {
    width: 30,
    height: 30,
  },
  noDataText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 20,
  },

  // 底部操作栏样式
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ffffff', 
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
});
