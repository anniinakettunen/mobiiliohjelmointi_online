import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [marker, setMarker] = useState(null);

  const fetchCoordinates = async () => {
    if (!address.trim()) {
      Alert.alert('Please enter an address');
      return;
    }

    try {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`
      );

      const text = await response.text(); // luetaan ensin tekstinä
      let data;
      try {
        data = JSON.parse(text); // yritetään parsia JSONiksi
      } catch {
        Alert.alert('Error', 'API did not return valid JSON. Check the address.');
        return;
      }

      if (!data || data.length === 0) {
        Alert.alert('Address not found');
        return;
      }

      const { lat, lon, display_name } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      setRegion({
        ...region,
        latitude,
        longitude,
      });

      setMarker({
        latitude,
        longitude,
        title: display_name,
      });
    } catch (error) {
      Alert.alert('Error fetching coordinates', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Kartta */}
      <MapView style={styles.map} region={region}>
        {marker && (
          <Marker
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
          />
        )}
      </MapView>

      {/* Syöttökenttä ja nappi ALAS */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Show" onPress={fetchCoordinates} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
    borderRadius: 4,
  },
});
