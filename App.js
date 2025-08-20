import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState("");

const pressHandler = () => {
  Alert.alert(text)
}

  return (
    <View style={styles.container}>
      <TextInput
      placeholder='Enter some text'
      onChange={text => setText(text)}
      value={text}
      />
      <Button onPress={pressHandler}title = "Press!"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
