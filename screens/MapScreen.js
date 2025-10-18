import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ route }) {
  const { address } = route.params;
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (!data || data.length === 0) {
          Alert.alert('Osoitetta ei löytynyt');
          return;
        }

        const { lat, lon } = data[0];
        setRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        Alert.alert('Virhe karttahaussa', error.message);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region}>
          <Marker coordinate={region} title={address} />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
