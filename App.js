import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('shoppingdb');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

 
  const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS shopping (
          id INTEGER PRIMARY KEY NOT NULL,
          product TEXT,
          amount TEXT
        );
      `);
      await updateList();
    } catch (error) {
      console.error('DB init error', error);
    }
  };

  
  const updateList = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM shopping');
      setItems(result);
    } catch (error) {
      console.error('Fetch error', error);
    }
  };

 
  const saveItem = async () => {
    if (product && amount) {
      try {
        await db.runAsync('INSERT INTO shopping (product, amount) VALUES (?, ?)', product, amount);
        setProduct('');
        setAmount('');
        await updateList();
      } catch (error) {
        console.error('Save error', error);
      }
    }
  };


  const deleteItem = async (id) => {
    try {
      await db.runAsync('DELETE FROM shopping WHERE id=?', id);
      await updateList();
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  
  useEffect(() => {
    initialize();
  }, []);

  return (
  <View style={styles.container}>
    <View style={styles.form}>
      <TextInput
        placeholder="Product"
        style={styles.input}
        onChangeText={(text) => setProduct(text)}
        value={product}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />
      <Button onPress={saveItem} title="SAVE" />
    </View>

    <Text style={styles.title}>Shopping list</Text>

    <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={items}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text>
            {item.product}, {item.amount}{' '}
          </Text>
          <Text
            style={styles.bought}
            onPress={() => deleteItem(item.id)}
          >
            bought
          </Text>
        </View>
      )}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  form: {
    marginTop: 120,  
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 8,
    width: '100%',   
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '80%',
  },
  bought: {
    color: 'blue',
  },
});
