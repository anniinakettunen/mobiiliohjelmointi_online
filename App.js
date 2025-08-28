import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  const addItem = () => {
    if (item !== '') {
      setList([...list, item]);
      setItem('');
    }
  };

  const clearList = () => {
    setList([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ostoslista</Text>

      <TextInput
        style={styles.input}
        value={item}
        onChangeText={text => setItem(text)}
        placeholder="Kirjoita ostos"
      />

      <Button title="Add" onPress={addItem} />
      <Button title="Clear" onPress={clearList} />

      <FlatList
        data={list}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
});
