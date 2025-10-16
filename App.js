import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Input, Button, ListItem, Icon, Text } from '@rneui/themed';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);


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


  const deleteItem = (id) => {
    remove(ref(database, 'items/' + id))
      .catch(error => {
        Alert.alert('Delete error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.header}>🛒 Shopping List</Text>

      <Input
        placeholder="Product"
        value={product}
        onChangeText={setProduct}
        leftIcon={{ name: 'local-grocery-store', color: '#6F1D1B' }}
        inputStyle={{ color: '#FFF' }}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#6F1D1B"
      />

      <Input
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        leftIcon={{ name: 'numbers', color: '#6F1D1B' }}
        inputStyle={{ color: '#6F1D1B' }}
        inputContainerStyle={styles.inputContainer}
        placeholderTextColor="#6F1D1B"
      />

      <Button
        title="Add Item"
        icon={{ name: 'add-circle-outline', color: 'white' }}
        onPress={saveItem}
        buttonStyle={styles.addButton}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            containerStyle={styles.listItem}
          >
            <Icon name="shopping-cart" color="#6F1D1B" />
            <ListItem.Content>
              <ListItem.Title style={styles.itemText}>{item.product}</ListItem.Title>
              <ListItem.Subtitle style={styles.subText}>Amount: {item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon
              name="delete-outline"
              color="#ff0101ff"
              onPress={() => deleteItem(item.id)}
            />
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF2D7', 
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6F1D1B',
    fontWeight: 'bold',
  },
  inputContainer: {
    borderBottomColor: '#FFD7BA', 
  },
  addButton: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#6F1D1B', 
    },
  listItem: {
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#FFD7BA', 
  },
  itemText: {
    fontWeight: 'bold',
    color: '#6F1D1B',
  },
  subText: {
    color: '#6F1D1B',
  },
});

