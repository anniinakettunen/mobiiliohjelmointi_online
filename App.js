import { StyleSheet, Text, Button, TextInput, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
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

      <Text style={styles.historyTitle}>Calculator History</Text>
      <FlatList
        style={styles.historyList}
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
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
    backgroundColor: '#fff',
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
  },
  historyTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  historyList: {
    maxHeight: 350, 
    width: '100%',
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 2,
    textAlign: 'center',
  },
});

