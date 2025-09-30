import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');

  const speak = () => {
    if (text.trim().length === 0) return;
    Speech.speak(text, { language });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kirjoita teksti:</Text>
      <TextInput
        style={styles.input}
        placeholder="Kirjoita tähän..."
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>Valitse kieli:</Text>
      <View style={styles.languageContainer}>
        <TouchableOpacity
          style={[styles.langButton, language === 'en-US' && styles.langButtonSelected]}
          onPress={() => setLanguage('en-US')}
        >
          <Text style={styles.langText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === 'fi-FI' && styles.langButtonSelected]}
          onPress={() => setLanguage('fi-FI')}
        >
          <Text style={styles.langText}>Suomi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === 'sv-SE' && styles.langButtonSelected]}
          onPress={() => setLanguage('sv-SE')}
        >
          <Text style={styles.langText}>Svenska</Text>
        </TouchableOpacity>
      </View>

      <Button title="Puhu" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#d0d0d0',
  },
  langButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  langText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

