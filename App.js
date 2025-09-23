import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { app } from './firebaseConfig'; 
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  // 🔄 Ladataan ostokset Firebase Realtime Databasesta
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setItems(list);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 💾 Tallennetaan uusi ostos
  const saveItem = () => {
    if (product && amount) {
      const newItem = { product, amount };
      push(ref(database, 'items/'), newItem)
        .then(() => {
          setProduct('');
          setAmount('');
        })
        .catch(error => {
          Alert.alert('Save error', error.message);
        });
    } else {
      Alert.alert('Error', 'Type product and amount first');
    }
  };

  // 🗑️ Poistetaan ostos yksilöivän avaimen perusteella
  const deleteItem = (id) => {
    remove(ref(database, 'items/' + id))
      .catch(error => {
        Alert.alert('Delete error', error.message);
      });
  };

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
        keyExtractor={(item) => item.id}
        data={items}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.product}, {item.amount}</Text>
            <Text style={styles.bought} onPress={() => deleteItem(item.id)}>
              Delete
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
    color: 'red',
    fontWeight: 'bold',
  },
});
