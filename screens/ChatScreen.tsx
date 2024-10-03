// /Users/bailangcheng/Desktop/semo/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateUserId } from '../redux/slices/userSlice';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Animated,
  Platform,
} from 'react-native';
import { getAIResponse, checkBackendConnection, useMock } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/color';

type Message = { sender: 'user' | 'ai'; text: string };

type Params = {
  initialMessage: string;
  initialOptions: string[];
  initialTopicId: number;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  // 移除 semoUserId 的 useState
  const [topicId, setTopicId] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [predictedOptions, setPredictedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const animatedPadding = useRef(new Animated.Value(0)).current;
  const [optionsHeight, setOptionsHeight] = useState(0);
  const [bottomPadding, setBottomPadding] = useState(33); // 默认值设为 33

  // 从 Redux 获取 semoUserId
  const semoUserId = useSelector((state: RootState) => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Current semoUserId in ChatScreen:', semoUserId);
  }, [semoUserId]);

  // 如果需要，您可以在这里添加一个 effect 来从 AsyncStorage 获取 userId
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('semo_user_id');
        if (storedUserId && storedUserId !== semoUserId) {
          dispatch(updateUserId(storedUserId));
        }
      } catch (error) {
        console.error('Failed to fetch user ID from AsyncStorage:', error);
      }
    };

    if (!semoUserId) {
      fetchUserId();
    }
  }, [semoUserId, dispatch]);

  // 接收从 TherapistSettingScreen 传递过的初始消息、选项和 topicId
  useEffect(() => {
    const { initialMessage, initialOptions, initialTopicId } = route.params || {};

    // 设置初始消息
    if (initialMessage) {
      setMessages([{ sender: 'ai', text: initialMessage }]);
    }

    // 设置初始选项
    if (initialOptions) {
      setPredictedOptions(initialOptions);
    }

    // 设置初始 topicId
    if (initialTopicId !== undefined) {
      setTopicId(initialTopicId);
    }
  }, [route.params]);

  // 确保滚动视图自动滚动到末尾
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const height = e.endCoordinates.height;
        setKeyboardHeight(height);
        Animated.timing(animatedPadding, {
          toValue: height,
          duration: 250,
          useNativeDriver: false,
        }).start();
        // 添加延时以确保在键盘完全显示后滚动
        setTimeout(() => scrollToBottom(), 300);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        Animated.timing(animatedPadding, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // 添加一个新的函数来处理滚动到底部
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async () => {
    console.log('semoUserId in sendMessage:', semoUserId);
    if (!semoUserId) {
      console.error('No User ID available');
      return;
    }

    if (inputText.trim() !== '') {
      // 在发送前，打印 semoUserId 以确保它存在
      console.log('User ID being sent:', semoUserId);
  
      const newMessages: Message[] = [...messages, { sender: 'user', text: inputText }];
      setMessages(newMessages);
      setInputText('');
      setLoading(true);
  
      try {
        // 在发送之前，打印要发送的消息和 topicId
        console.log(`Sending message to backend:`, {
          user_input: inputText,
          topic_id: topicId
        });
  
        const response = await getAIResponse(semoUserId, inputText, topicId);
  
        // 打印从后端接收的完整响应
        console.log("AI Response from backend:", response);
  
        // 更新消息和其他状态
        setMessages([...newMessages, { sender: 'ai', text: response.content }]);
        setEmotion(response.emotion);
        setPredictedOptions(response.predicted_options);
  
        // 保存 topic_id
        if (response.topic_id !== undefined) {
          setTopicId(response.topic_id);
          console.log(`Updated topic_id: ${response.topic_id}`);
        }
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setLoading(false);
        // 添加延时以确保在新消息被添加到列表后滚动
        setTimeout(() => scrollToBottom(), 100);
      }
    } else {
      console.error('Message not sent. Either input is empty or User ID is missing.');
    }
  };

  const handleOptionPress = (option: string) => {
    setInputText(option);
  };

  // 根据情绪值设置颜色
  const getEmotionColor = (emotionValue: number | null) => {
    if (emotionValue === null) return colors.white;
    if (emotionValue > 0.75) return colors.sub;
    if (emotionValue > 0.5) return colors.primary;
    if (emotionValue > 0.25) return colors.sub;
    return colors.primary;
  };

  const endConversation = () => {
    navigation.navigate('AiChatReportScreen' as never);
  };

  const onOptionsLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setOptionsHeight(height);
  };

  return (
    <Animated.View style={[styles.container, { paddingBottom: animatedPadding }]}>
      <ScrollView 
        style={styles.messagesContainer} 
        contentContainerStyle={[
          styles.messagesContentContainer,
          { paddingBottom: bottomPadding }
        ]}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              msg.sender === 'user' ? styles.userMessageBubble : styles.aiMessageBubble,
            ]}
          >
            <Text style={msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color="#f06262" style={styles.loadingIndicator} />}
      </ScrollView>

      <View style={styles.optionsAndEmotionContainer}>
        <View style={styles.optionsContainer}>
          {predictedOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton} 
              onPress={() => handleOptionPress(option)}
            >
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.emotionIndicatorContainer}>
          <View style={[styles.emotionIndicator, { backgroundColor: getEmotionColor(emotion) }]} />
        </View>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="你可以继续输入..."
            multiline={true}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endButton} onPress={endConversation}>
          <Text style={styles.endButtonText}>结束对话</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    // paddingBottom 已移除，现在通过 state 控制
  },
  optionsAndEmotionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F7F4EE',
  },
  emotionIndicatorContainer: {
    marginLeft: 5,
    marginVertical:3,
  },
  emotionIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  optionsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  optionButton: {
    backgroundColor: colors.white, // 白色背景
    borderWidth: 1, // 添加边框
    borderColor: colors.sub, // 使用主色（红色）作为边框颜色
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    margin: 3,
  },
  optionButtonText: {
    color: colors.primary, // 使用主色（红色）作为文字颜色
    fontSize: 14,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal:15,
    borderRadius: 20,
    marginVertical: 5,
  },
  aiMessageBubble: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal:15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userMessageText: {
    fontSize: 15,
    color: colors.white,
  },
  aiMessageText: {
    fontSize: 15,
    color: colors.gray600,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5, // 减少底部padding
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#F7F4EE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  endButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom:20,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});