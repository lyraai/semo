// // /Users/bailangcheng/Desktop/semo/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getAIResponse, checkBackendConnection, useMock} from '../service/api'; // 引入 checkBackendConnection
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/color';

type Message = { sender: 'user' | 'ai'; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [semoUserId, setSemoUserId] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [predictedOptions, setPredictedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 检查后端连接并判断是否进入模拟模式
  useEffect(() => {
    const initializeConnection = async () => {
      await checkBackendConnection();
      if (useMock) {
        console.log("Running in mock mode");
      } else {
        console.log("Connected to backend");
      }
    };
    initializeConnection();
  }, []);

  // 获取存储的用户 ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('semo_user_id');
        if (storedUserId) {
          setSemoUserId(storedUserId);
        } else {
          console.error('No User ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  // 消息发送后自动滚动到底部
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() !== '' && semoUserId) {
      const newMessages: Message[] = [...messages, { sender: 'user', text: inputText }];
      setMessages(newMessages);
      setInputText('');
      setLoading(true);
  
      try {
        const { response, emotion, predicted_options } = await getAIResponse(semoUserId, inputText);
        console.log("AI Response from backend:", response); // 添加日志以查看返回的AI响应
        setMessages([...newMessages, { sender: 'ai', text: response }]);
        setEmotion(emotion);
        setPredictedOptions(predicted_options);
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Message not sent. Either input is empty or User ID is missing.');
    }
  };

  const handleOptionPress = (option: string) => {
    setInputText(option);
  };

  const getEmotionColor = (emotionValue: number | null) => {
    if (emotionValue === null) return '#ddd';
    if (emotionValue > 0.75) return '#FF6347';
    if (emotionValue > 0.5) return '#FFA500';
    if (emotionValue > 0.25) return '#FFFF00';
    return '#32CD32';
  };

  const endConversation = () => {
    navigation.navigate('AiChatReportScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContentContainer}
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

      <View style={styles.footerContainer}>
        <View style={styles.emotionIndicatorContainer}>
          <View style={[styles.emotionIndicator, { backgroundColor: getEmotionColor(emotion) }]} />
        </View>
        <View style={styles.optionsContainer}>
          {predictedOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleOptionPress(option)}>
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    </SafeAreaView>
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
    justifyContent: 'flex-end',
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  aiMessageBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  userMessageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  aiMessageText: {
    fontSize: 16,
    color: '#333',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  emotionIndicatorContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  emotionIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  optionButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});