import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';

const EndingScreen = () => {
  const { score } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>
      <Text style={styles.scoreText}>Your Score: {score}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/features/leaderboard')}
      >
        <Text style={styles.buttonText}>Go to Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EndingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.primary.green,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.secondary.white,
    fontWeight: 'bold',
  },
});