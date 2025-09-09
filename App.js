import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, ActivityIndicator, FlatList, Image, Text, StatusBar } from 'react-native';

export default function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Virhe haussa: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data.meals || []);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TextInput
        style={styles.input}
        placeholder="Syötä raaka-aine (esim. tomato)"
        value={ingredient}
        onChangeText={setIngredient}
      />
      <Button title="Hae" onPress={handleSearch} />
      {loading && <ActivityIndicator size="large" />}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.title}>{item.strMeal}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
  },
  input: {
    fontSize: 18,
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
    padding: 5,
  },
  item: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
});
