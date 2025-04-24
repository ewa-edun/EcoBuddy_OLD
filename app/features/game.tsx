import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import GameCard from '../components/GameCard';
import { router } from 'expo-router';

const GameScreen = () => {
  const games: { title: string; route: '/games/rules' | '/games/rules' | '/games/rules' | '/games/rules' }[] = [
    { title: 'Sort Trash', route: '/games/rules' },
    { title: 'Eco Wordle', route: '/games/rules' },
    { title: 'Recycle Match', route: '/games/rules' },
    { title: 'EcoQuiz', route: '/games/rules' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Choose a Game</Text>
      <View style={styles.grid}>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            onPress={() =>
              router.push({
                pathname: game.route,
                params: { title: game.title, route: game.route },
              })
            }
          />
        ))}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary.green,
          padding: 15,
          borderRadius: 15,
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={{ color: Colors.secondary.white, fontSize: 16, fontFamily: 'PlusJakartaSans-Bold', }}>Back to Home</Text>
      </TouchableOpacity>
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
