import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import GameCard from '../components/GameCard';
import { router } from 'expo-router';

const GameScreen = () => {
  const games = [
    { title: 'Sort Trash', route: '/games/sortTrash' },
    { title: 'Eco Wordle', route: '/games/ecoWordle' },
    { title: 'Recycle Match', route: '/games/recycleMatch' },
    { title: 'EcoQuiz', route: '/games/ecoQuiz' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Choose a Game</Text>
      <View style={styles.grid}>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            onPress={() => router.push(game.route as any)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 20,
    textAlign: 'center', // Added for better appearance
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});

export default GameScreen;
