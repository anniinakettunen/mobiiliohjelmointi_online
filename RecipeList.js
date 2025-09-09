import React from 'react';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';

export default function RecipeList({ recipes }) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
