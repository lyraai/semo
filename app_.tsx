// app_1.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const App1 = () => {
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleSubmit = () => {
    setSubmittedText(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Test App</Text>

      <TextInput
        style={styles.input}
        placeholder="Type something here..."
        value={text}
        onChangeText={setText}
      />

      <Button title="Submit" onPress={handleSubmit} />

      {submittedText ? (
        <Text style={styles.output}>You submitted: {submittedText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  output: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default App1;