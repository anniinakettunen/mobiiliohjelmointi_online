import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';
import PlacesScreen from './screens/PlacesScreen';
import MapScreen from './screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const initialize = async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY NOT NULL,
        address TEXT
      );
    `);
  };

  return (
    <SQLiteProvider
      databaseName="places.db"
      onInit={initialize}
      onError={(error) => console.error('DB init error', error)}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="My Places" component={PlacesScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}
