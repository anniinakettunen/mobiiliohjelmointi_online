import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';


export default function App() {
  const [photoName, setPhotoName] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  const camera = useRef(null);

  
if (!permission) {
  // Camera permissions are still loading.
  return <View />;
}

if (!permission.granted) {
  // Camera permissions are not granted yet.
  return(
    <View style={styles.container}>
      <Button onPress={requestPermission} title="grant permission" />
    </View>
  );
}

const snap = async () => {
  if (camera) {
    const photo = await camera.current.takePictureAsync({base64: true});
    setPhotoName(photo.uri);
    setPhotoBase64(photo.base64); 
  }
};

return (
  <View style={{ flex: 1 }}>
    <CameraView style={{ flex: 1, minWidth: "100%" }} ref={camera} />
    <Button title="Take Photo" onPress={snap} />
    <View style={{ flex: 1 }}>
      {photoName && photoBase64 ? (
        <>
          <Image style={{ flex: 1 }} source={{ uri: photoName }} />
          <Image style={{ flex: 1 }} source={{ uri: `data:image/jpg;base64,${photoBase64}` }} />
        </>
      ) : (
        <Text>No photo taken yet.</Text>
      )}      
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
