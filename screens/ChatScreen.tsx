// /screens/ChatScreen.tsx
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
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { getAIResponse } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../styles/color';
import { color } from 'react-native-elements/dist/helpers';

type Message = { sender: 'user' | 'ai'; text: string };

type Params = {
  initialMessage: string;
  initialOptions: string[];
  initialTopicId: number;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [topicId, setTopicId] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [predictedOptions, setPredictedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: Params }, 'params'>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const dispatch = useDispatch();

  const semoUserId = useSelector((state: RootState) => state.user.userId);

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

  useEffect(() => {
    const { initialMessage, initialOptions, initialTopicId } = route.params || {};

    if (initialMessage) {
      setMessages([{ sender: 'ai', text: initialMessage }]);
    }

    if (initialOptions) {
      setPredictedOptions(initialOptions);
    }

    if (initialTopicId !== undefined) {
      setTopicId(initialTopicId);
    }
  }, [route.params]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!semoUserId) {
      console.error('No User ID available');
      return;
    }

    if (inputText.trim() !== '') {
      const newMessages: Message[] = [...messages, { sender: 'user', text: inputText }];
      setMessages(newMessages);
      setInputText('');
      setLoading(true);

      try {
        const response = await getAIResponse(semoUserId, inputText, topicId);
        setMessages([...newMessages, { sender: 'ai', text: response.content }]);
        setEmotion(response.emotion);
        setPredictedOptions(response.predicted_options);

        if (response.topic_id !== undefined) {
          setTopicId(response.topic_id);
        }
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setLoading(false);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } else {
      console.error('Message not sent. Either input is empty or User ID is missing.');
    }
  };

  const handleOptionPress = (option: string) => {
    setInputText(option);
  };

  const getEmotionColor = (emotionValue: number | null) => {
    if (emotionValue === null) return colors.white;
    if (emotionValue > 0.75) return colors.sub;
    if (emotionValue > 0.5) return colors.primary;
    if (emotionValue > 0.25) return colors.sub;
    return colors.primary;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />}
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
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.plusButton}>
            <Image source={require('../assets/icons/1x/plus.png')} style={styles.plusIcon} />
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
              source={require('../assets/icons/1x/Sending.png')}
              style={[
                styles.sendIcon,
                { tintColor: inputText.trim() ? colors.primary : colors.gray300 },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    fontSize: 17,
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
    paddingVertical: 10,
    
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
    paddingTop: 0,
    fontSize: 17,
    maxHeight: 100, // 限制最大高度
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
});
