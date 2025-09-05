import { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, TextInput, View } from 'react-native';

export default function Calculator({ navigation }) {
  const [first, set1] = useState('');
  const [second, set2] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (first === '' || second === '') {
      setResult(null);
    }
  }, [first, second]);

  const addNumbers = () => {
    const sum = parseFloat(first) + parseFloat(second);
    const entry = `${first} + ${second} = ${sum}`;
    setResult(sum);
    setHistory(prev => [entry, ...prev]);
  };

  const subtractNumbers = () => {
    const difference = parseFloat(first) - parseFloat(second);
    const entry = `${first} - ${second} = ${difference}`;
    setResult(difference);
    setHistory(prev => [entry, ...prev]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>
        {result !== null ? `Result: ${result}` : 'Enter numbers:'}
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={first}
        onChangeText={set1}
        placeholder="First number"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={second}
        onChangeText={set2}
        placeholder="Second number"
      />

      <View style={styles.buttonContainer}>
        <Button title="+" onPress={addNumbers} />
        <Button title="-" onPress={subtractNumbers} />
      </View>

      <Button
        title="History"
        onPress={() => navigation.navigate('History', { history })}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
    marginTop: 5,
    marginBottom: 10,
  },
});
