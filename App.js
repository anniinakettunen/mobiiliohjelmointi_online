import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');     
  const [marker, setMarker] = useState(null);      
  const [loading, setLoading] = useState(true);   

 
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to get location. Using fallback location.');
         
          setLocation({
            latitude: 60.1699,
            longitude: 24.9384,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        Alert.alert('Error getting location. Using fallback location.', error.message);
        // Fallback Helsinki
        setLocation({
          latitude: 60.1699,
          longitude: 24.9384,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const fetchCoordinates = async () => {
    if (!address.trim()) {
      Alert.alert('Please enter an address');
      return;
    }

    try {
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
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

      setLocation({
        ...location,
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


  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={location}>
        {marker && (
          <Marker
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
          />
        )}
      </MapView>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
