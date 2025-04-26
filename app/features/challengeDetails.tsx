import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';


export default function ChallengeDetails() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge Details</Text>
      <Text style={styles.text}>Challenge ID: {id}</Text>
      {/* Add your challenge details UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.main,
  },
  title: {
    fontSize: 24,
    color: Colors.primary.green,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: Colors.text.darker,
  }
});