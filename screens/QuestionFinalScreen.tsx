// // screens/QuestionFinalScreen.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../App';
// import { sendQuestionnaireData, checkBackendConnection } from '../service/api';

// type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

// type Props = {
//   navigation: FinalScreenNavigationProp;
// };

// export default function QuestionFinalScreen({ navigation }: Props) {
//   const questionnaireData = useSelector((state: RootState) => state.questionnaire);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleStartChat = async () => {
//     setIsLoading(true);
//     try {
//       await checkBackendConnection();  // 检查后端连接
//       await sendQuestionnaireData(questionnaireData);
//       navigation.navigate('ChatScreen');
//     } catch (error) {
//       console.error('Failed to start AI chat, using mock data instead:', error);
//       navigation.navigate('ChatScreen');  // 即使失败也进入聊天页面
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>问卷完成</Text>
//       <Text style={styles.summary}>感谢您完成问卷！</Text>
//       <Text style={styles.summary}>您选择的答案：</Text>
//       <Text style={styles.text}>关系状态: {questionnaireData.current_state}</Text>
//       <Text style={styles.text}>分开时长: {questionnaireData.duration}</Text>
//       <Text style={styles.text}>当前感受: {questionnaireData.current_feeling}</Text>
//       <Text style={styles.text}>想要的结果: {questionnaireData.expectation}</Text>

//       <TouchableOpacity
//         style={[styles.nextButton, isLoading && styles.disabledNextButton]}  // 加载中时禁用按钮
//         onPress={handleStartChat}
//         disabled={isLoading}  // 禁用按钮防止重复点击
//       >
//         <Text style={[styles.nextButtonText, isLoading && styles.disabledNextButtonText]}>
//           {isLoading ? '加载中...' : '开始AI对话'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F7F4EE',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   summary: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   nextButton: {
//     backgroundColor: '#f06262',
//     padding: 15,
//     borderRadius: 30,
//     width: '80%',
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   disabledNextButton: {
//     backgroundColor: '#ccc',
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   disabledNextButtonText: {
//     color: '#666',
//   },
// });

// screens/QuestionFinalScreen.tsx
import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';  // 导入 RootState 类型
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { sendQuestionnaireData, checkBackendConnection } from '../service/api';

type FinalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FinalScreen'>;

type Props = {
  navigation: FinalScreenNavigationProp;
};

export default function QuestionFinalScreen({ navigation }: Props) {
  const questionnaireData = useSelector((state: RootState) => state.questionnaire);
  const userId = useSelector((state: RootState) => state.user.userId);  // 从 Redux 中获取 userId
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!userId) {
      Alert.alert('错误', '无法找到用户ID');
      return;
    }

    setIsLoading(true);
    try {
      await checkBackendConnection();  // 检查后端连接
      await sendQuestionnaireData(userId, questionnaireData);  // 将 userId 传递到后端
      navigation.navigate('ChatScreen');
    } catch (error) {
      console.error('启动AI对话失败:', error);
      navigation.navigate('ChatScreen');  // 即使失败也进入聊天页面
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>问卷完成</Text>
      <Text style={styles.summary}>感谢您完成问卷！</Text>
      <Text style={styles.summary}>您选择的答案：</Text>
      <Text style={styles.text}>关系状态: {questionnaireData.current_state}</Text>
      <Text style={styles.text}>分开时长: {questionnaireData.duration}</Text>
      <Text style={styles.text}>当前感受: {questionnaireData.current_feeling}</Text>
      <Text style={styles.text}>想要的结果: {questionnaireData.expectation}</Text>

      <TouchableOpacity
        style={[styles.nextButton, isLoading && styles.disabledNextButton]}  // 加载中时禁用按钮
        onPress={handleStartChat}
        disabled={isLoading}  // 禁用按钮防止重复点击
      >
        <Text style={[styles.nextButtonText, isLoading && styles.disabledNextButtonText]}>
          {isLoading ? '加载中...' : '开始AI对话'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summary: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  nextButton: {
    backgroundColor: '#f06262',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginTop: 30,
  },
  disabledNextButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledNextButtonText: {
    color: '#666',
  },
});