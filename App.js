import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [amount, setAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '1E5gKXHQMLG2gg1rbmcTkR8EXniDrdHf'; 

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.apilayer.com/exchangerates_data/latest?base=EUR', {
        headers: {
          'apikey': API_KEY,
        },
      });

      const text = await response.text();
      console.log('API response:', text);

      const data = JSON.parse(text);
      if (!data || typeof data.rates !== 'object' || Object.keys(data.rates).length === 0) {
        throw new Error('API ei palauttanut valuuttakursseja');
      }

      const currencyCodes = Object.keys(data.rates);
      setCurrencies(currencyCodes);
    } catch (error) {
      console.error('Virhe valuuttakursseissa:', error);
      Alert.alert('Virhe', 'Valuuttakurssien haku epäonnistui. Tarkista API-avain tai yhteys.');
    } finally {
      setLoading(false);
    }
  };

  const convertToEuro = async () => {
    if (!selectedCurrency || !amount) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.apilayer.com/exchangerates_data/latest?base=EUR', {
        headers: {
          'apikey': API_KEY,
        },
      });

      const data = await response.json();
      const rate = data.rates[selectedCurrency];
      if (!rate) {
        throw new Error('Valittu valuutta ei löytynyt');
      }

      const converted = parseFloat(amount) / rate;
      setResult(converted.toFixed(2));
    } catch (error) {
      console.error('Virhe muunnoksessa:', error);
      Alert.alert('Virhe', 'Muunnos epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Syötä summa:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Esim. 100"
      />

      <Text style={styles.label}>Valitse valuutta:</Text>
      {currencies.length > 0 ? (
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          style={styles.picker}
        >
          {currencies.map((code) => (
            <Picker.Item key={code} label={code} value={code} />
          ))}
        </Picker>
      ) : (
        <Text style={{ fontStyle: 'italic' }}>Valuuttalista latautuu...</Text>
      )}

      <Button title="Muunna euroiksi" onPress={convertToEuro} />
      {loading && <ActivityIndicator size="large" />}
      {result && (
        <Text style={styles.result}>
          {amount} {selectedCurrency} = {result} EUR
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
});
