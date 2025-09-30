import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function App() {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        Alert.alert('Warning', 'No contacts found.');
      }
    } else {
      Alert.alert('Permission denied', 'Cannot access contacts without permission.');
    }
  };

  const renderItem = ({ item }) => {
    const phone = item.phoneNumbers && item.phoneNumbers.length > 0
      ? item.phoneNumbers[0].number
      : 'No number';

    return (
      <View style={styles.contactItem}>
        <Text style={styles.contactText}>{item.name}</Text>
        <Text style={styles.numberText}>{phone}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Get Contacts" onPress={getContacts} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberText: {
    fontSize: 14,
    color: '#555',
  },
});
