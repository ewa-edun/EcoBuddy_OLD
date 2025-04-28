import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Rules = () => {
  const router = useRouter();
  const { title, route } = useLocalSearchParams();
  const games: { title: string; route: '/games/sortTrash' | '/games/ecoWordle' | '/games/recycleMatch' | '/games/ecoQuiz' }[] = [
    { title: 'Sort Trash', route: '/games/sortTrash' },
    { title: 'Eco Wordle', route: '/games/ecoWordle' },
    { title: 'Recycle Match', route: '/games/recycleMatch' },
    { title: 'EcoQuiz', route: '/games/ecoQuiz' },
  ];

  // Define rules for each game
  const gameRules: { [key: string]: string } = {
    'Sort Trash': `
      - Drag and drop waste items into the correct recycling bins.
      - Gain +10 points for each correct match.
      - Lose -5 points for each incorrect match.
      - You have 2 minutes to sort all items.
    `,
    'Eco Wordle': `
      - Guess the 5-letter eco-related word in 5 attempts.
      - Automatially have 100 point from the start.
      - Lose -20 points for each incorrect guess.
      - You have 1 minute 30 seconds to complete the game.
    `,
    'Recycle Match': `
      - Match three or more of the same recyclable items in a grid.
      - Gain +4 points for each successful match.
      - Lose -2 points for each invalid move.
      - You have 1 minute to complete the game.
    `,
    'EcoQuiz': `
      - Answer 10 multiple-choice questions about recycling and eco-friendliness.
      - Gain +10 points for each correct answer.
      - You have 2 minutes to complete the quiz.
    `,
  };

const handleBack = () => {
    router.push('/features/game'); }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title} Rules</Text>
      <Text style={styles.rulesText}>{gameRules[title as string]}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const game = games.find((g) => g.title === title);
          if (game) {
            router.push(game.route);
          }
        }}
        >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBack} style={styles.button}>
      <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Rules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 20,
  },
  rulesText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.secondary.white,
    fontWeight: 'bold',
  },
});