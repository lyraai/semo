import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>('');

  const sendMessage = async () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, inputText]);
      setInputText('');
      // 这里调用你的 AI 后端服务获取回复
      // const aiResponse = await getAIResponse(inputText);
      // setMessages([...messages, inputText, aiResponse]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.message}>{msg}</Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="输入你的消息..."
      />
      <Button title="发送" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  message: {
    fontSize: 16,
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});