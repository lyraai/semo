// screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
  KeyboardAvoidingView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { getAIResponse } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../styles/color';

type Message = { sender: 'user' | 'ai'; text: string; delivered?: boolean; timestamp?: Date };

type Params = {
  initialMessage: string;
  initialOptions: string[];
  initialTopicId: number;
  initialSessionId: number;
};

const TypingIndicator = () => {
  const animations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    const sequence = Animated.sequence(
      animations.map((animation) =>
        Animated.sequence([
          Animated.timing(animation, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(animation, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    );

    Animated.loop(sequence).start();
  }, []);

  return (
    <View style={styles.typingIndicator}>
      {animations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// 在文件顶部添加这个函数
function getHumanLikeDelay(messageLength: number): number {
  // 基础思考时间：0.5到2秒
  const baseThinkingTime = Math.random() * 1500 + 500;
  
  // 根据消息长度添加额外时间
  // 假设平均打字速度是每分钟200个字符，也就是每秒3.33个字符
  const typingTime = (messageLength / 3.33) * 1000;
  
  // 添加一些随机变化，模拟思考和打字速度的不确定性
  const randomVariation = Math.random() * 1000 - 500; // -500到500毫秒的随机变化
  
  return baseThinkingTime + typingTime + randomVariation;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [topicId, setTopicId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [predictedOptions, setPredictedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const dispatch = useDispatch();

  const semoUserId = useSelector((state: RootState) => state.user.userId);

  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    if (!semoUserId) {
      console.error('No User ID available in Redux store');
    }
  }, [semoUserId]);

  // 设置初始消息、选项和 topicId
  useEffect(() => {
    const { initialMessage, initialOptions, initialTopicId, initialSessionId } = route.params || {};

    if (initialMessage) {
      setMessages([{ 
        sender: 'ai', 
        text: initialMessage, 
        timestamp: new Date() // 为初始消息添加时间戳
      }]);
    }

    if (initialOptions) {
      setPredictedOptions(initialOptions);
    }

    if (initialTopicId !== undefined) {
      setTopicId(initialTopicId);
    }

    if (initialSessionId) {
      setSessionId(initialSessionId);
    }
  }, [route.params]);

  // 新增一个函数来处理滚动到底部
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 发送消息函数
  const sendMessage = async () => {
    if (!semoUserId) {
      console.error('No User ID available');
      return;
    }

    if (inputText.trim() !== '') {
      // 发送消息时添加时间戳
      const newMessages: Message[] = [...messages, { 
        sender: 'user', 
        text: inputText, 
        delivered: false,
        timestamp: new Date() // 添加当前时间
      }];
      setMessages(newMessages);
      setInputText('');

      scrollToBottom();

      try {
        const response = await getAIResponse(semoUserId, inputText, topicId, sessionId);
        
        // 在收到响应后，更新最后一条用户消息的 delivered 状态
        const updatedMessages = newMessages.map((msg, index) => 
          index === newMessages.length - 1 ? { ...msg, delivered: true } : msg
        );
        setMessages(updatedMessages);

        // 设置 loading 状态为 true
        setLoading(true);
        
        const humanLikeDelay = getHumanLikeDelay(response.content.length);
        await new Promise(resolve => setTimeout(resolve, humanLikeDelay));

        // 添加 AI 的响应消息，包含时间戳
        const finalMessages = [...updatedMessages, { 
          sender: 'ai' as const, // 使用 'as const' 来明确指定类型
          text: response.content,
          timestamp: new Date()
        }];
        setMessages(finalMessages);
        setEmotion(response.emotion);
        setPredictedOptions(response.predicted_options);

        if (response.topic_id !== undefined) {
          setTopicId(response.topic_id);
        }

        if (response.session_id) {
          setSessionId(response.session_id);
        }

        scrollToBottom();
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Message not sent. Either input is empty, User ID is missing, or Session ID is missing.');
    }
  };

  // 处理选项点击
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

  // 添加一个格式化时间的函数
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 85}
    >
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((msg, index) => (
          <View key={index} style={[
            styles.messageRow,
            msg.sender === 'user' ? styles.userMessageRow : styles.aiMessageRow
          ]}>
            {msg.sender === 'user' ? (
              <View style={styles.userMessageContainer}>
                <View style={styles.userMessageInfo}>
                  {msg.delivered && <Text style={styles.deliveredIcon}>✓</Text>}
                  {msg.timestamp && (
                    <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
                  )}
                </View>
                <View style={styles.userMessageBubble}>
                  <Text style={styles.userMessageText}>{msg.text}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.aiMessageContainer}>
                <View style={styles.aiMessageBubble}>
                  <Text style={styles.aiMessageText}>{msg.text}</Text>
                </View>
                {msg.timestamp && (
                  <Text style={styles.aiMessageTime}>{formatTime(msg.timestamp)}</Text>
                )}
              </View>
            )}
          </View>
        ))}
        {loading && <TypingIndicator />}
      </ScrollView>

      <View style={styles.bottomContainer}>
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
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.plusButton}>
              <Image source={require('../assets/icons/2x/plus.png')} style={styles.plusIcon} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="你可以继续输入..."
              multiline={true}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              activeOpacity={inputText.trim() ? 0.7 : 1}
              disabled={!inputText.trim()}
            >
              <Image
                source={require('../assets/icons/2x/Sending.png')}
                style={[
                  styles.sendIcon,
                  { tintColor: inputText.trim() ? colors.primary : colors.gray300 },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background01,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  bottomContainer: {
    backgroundColor: colors.background01,
  },
  optionsAndEmotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.background01,
  },
  emotionIndicatorContainer: {
    marginLeft: 5,
    marginVertical: 3,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sub,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    margin: 3,
  },
  optionButtonText: {
    color: colors.primary,
    fontSize: 15,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  aiMessageBubble: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userMessageText: {
    fontSize: 17,
    lineHeight: 20,
    color: colors.white,
  },
  aiMessageText: {
    fontSize: 17,
    lineHeight: 20,
    color: colors.gray600,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  footerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.background01,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  plusButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 24,
    height: 24,
    tintColor: colors.gray400,
  },
  input: {
    flex: 1,
    fontSize: 17,
    maxHeight: 100,
    marginHorizontal: 10,
    marginBottom:5,
  },
  sendButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    marginTop: 5,
    marginBottom: 10, // 添加底部边距
  },
  dot: {
    width: 8, // 稍微增大点的大小
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray400,
    marginRight: 4, // 增加点之间的间距
  },
  messageRow: {
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  deliveredIcon: {
    fontSize: 16,
    color: colors.gray400,
    marginBottom: 2,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxWidth: '80%',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  userMessageInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 5,
    justifyContent: 'flex-end',
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  aiMessageBubble: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  userMessageText: {
    fontSize: 17,
    lineHeight: 20,
    color: colors.white,
  },
  aiMessageText: {
    fontSize: 17,
    lineHeight: 20,
    color: colors.gray600,
  },
  messageTime: {
    fontSize: 12,
    color: colors.gray400,
  },
  aiMessageTime: {
    fontSize: 12,
    color: colors.gray400,
    marginLeft: 5,
    alignSelf: 'flex-end',
  },
});
