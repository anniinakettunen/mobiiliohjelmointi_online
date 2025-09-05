import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function History({ route }) {
  const { history } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.historyTitle}>Calculator History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  historyTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    paddingVertical: 2,
  },
});

