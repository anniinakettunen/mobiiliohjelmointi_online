import { useState, useEffect } from 'react';
import {Alert,StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default function App() {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTarget(Math.floor(Math.random() * 100) + 1);
  }, []);

  const checkGuess = () => {
  const num = parseInt(guess);

  if (isNaN(num)) {
    setMessage('Please enter a number');
    return;
  }

  if (num < target) {
    setMessage(`Your guess ${guess} is too low`);
  } else if (num > target) {
    setMessage(`Your guess ${guess} is too high`);
  } else {
    Alert.alert(
    '',
    `You guessed the number in ${count + 1} guesses`,
    [{ text: 'OK' }]
  );
  
  }

  setCount(count + 1);
  setGuess('');
};

 return (
    <View style={styles.container}>
      <Text style={styles.resultText}>Guess a number between 1–100</Text>
      <TextInput
        value={guess}
        onChangeText={setGuess}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Guess" onPress={checkGuess} />
      </View>
      <Text style={styles.resultText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    width: 150,
    marginBottom: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 5,
  },
});

//Arvauspeli