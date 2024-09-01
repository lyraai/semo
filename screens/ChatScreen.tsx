// /Users/bailangcheng/Desktop/semo/screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { getAIResponse } from '../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [semoUserId, setSemoUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('semo_user_id');
        if (storedUserId) {
          setSemoUserId(storedUserId);
          console.log('User ID fetched:', storedUserId); // 调试日志
        } else {
          console.error('No User ID found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() !== '' && semoUserId) {
      const newMessages = [...messages, { sender: 'user', text: inputText }];
      setMessages(newMessages);
      setInputText('');

      try {
        console.log('Sending message:', inputText, 'with user ID:', semoUserId); // 调试日志
        const aiResponse = await getAIResponse(semoUserId, inputText);
        setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
      } catch (error) {
        console.error('Failed to get AI response:', error);
      }
    } else {
      console.error('Message not sent. Either input is empty or User ID is missing.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
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
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="你可以继续输入..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userMessageBubble: {
    backgroundColor: '#f06262',
    alignSelf: 'flex-end',
    maxWidth: '70%',
    padding: 15,
    borderRadius: 30,
    marginVertical: 5,
  },
  aiMessageBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    padding: 15,
    borderRadius: 30,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
    borderTopWidth: 0,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#f06262',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#f06262',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});