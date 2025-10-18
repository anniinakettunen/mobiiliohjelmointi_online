import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

export default function PlacesScreen() {
  const [address, setAddress] = useState('');
  const [places, setPlaces] = useState([]);
  const db = useSQLiteContext();
  const navigation = useNavigation();

  const updateList = async () => {
    const list = await db.getAllAsync('SELECT * FROM places');
    setPlaces(list);
  };

  const savePlace = async () => {
    if (!address.trim()) return;
    await db.runAsync('INSERT INTO places (address) VALUES (?)', address);
    setAddress('');
    await updateList();
  };

  const deletePlace = async (id) => {
    await db.runAsync('DELETE FROM places WHERE id = ?', id);
    await updateList();
  };

  useEffect(() => {
    updateList();
  }, []);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Input
        placeholder="Syötä osoite"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Tallenna osoite" onPress={savePlace} />

      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('Map', { address: item.address })}
            onLongPress={() =>
              Alert.alert('Poista', 'Haluatko poistaa osoitteen?', [
                { text: 'Peruuta' },
                { text: 'Poista', onPress: () => deletePlace(item.id) },
              ])
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.address}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}
