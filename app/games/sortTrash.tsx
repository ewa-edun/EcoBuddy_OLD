import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

const wasteItems = [
  { id: 1, type: 'plastic', image: require('../../assets/wastes/plastic_bottle.jpg') },
  { id: 2, type: 'metal', image: require('../../assets/wastes/soda_can.jpg') },
  { id: 3, type: 'glass', image: require('../../assets/wastes/glass_jar.jpg') },
  { id: 4, type: 'paper', image: require('../../assets/wastes/newspaper.jpg') },
  { id: 5, type: 'trash', image: require('../../assets/wastes/banana_peel.jpg') },
  { id: 6, type: 'plastic', image: require('../../assets/wastes/plastic_bag.jpg') },
  { id: 7, type: 'metal', image: require('../../assets/wastes/metal_spoon.jpg') },
  { id: 8, type: 'glass', image: require('../../assets/wastes/glass_bottle.jpg') },
  { id: 9, type: 'paper', image: require('../../assets/wastes/cardboard.jpg') },
  { id: 10, type: 'trash', image: require('../../assets/wastes/food_scraps.jpg') },
];

const bins = [
  { id: 'plastic', label: 'Plastic', color: Colors.primary.blue },
  { id: 'metal', label: 'Metal', color: Colors.accent.darkGray },
  { id: 'glass', label: 'Glass', color: Colors.primary.green },
  { id: 'paper', label: 'Paper', color: Colors.secondary.yellow },
  { id: 'trash', label: 'Trash', color: Colors.primary.red },
];

const SortTrash = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameOver]);

  const handleDrop = (binType: string) => {
    const currentItem = wasteItems[currentItemIndex];

    if (currentItem.type === binType) {
      setScore(score + 10); // Correct match
    } else {
      setScore(score - 5); // Incorrect match
    }

    if (currentItemIndex < wasteItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    router.push({
      pathname: '/games/endingScreen',
      params: { score },
    });
  };

  if (gameOver) {
    return null; // Game over, redirecting to the ending screen
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
          {timeLeft % 60}
        </Text>
      </View>

      <View style={styles.itemContainer}>
        <Image source={wasteItems[currentItemIndex].image} style={styles.itemImage} />
      </View>

      <View style={styles.binsContainer}>
        {bins.map((bin) => (
          <TouchableOpacity
            key={bin.id}
            style={[styles.bin, { backgroundColor: bin.color }]}
            onPress={() => handleDrop(bin.id)}
          >
            <Text style={styles.binText}>{bin.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SortTrash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.primary.green,
    fontWeight: 'bold',
    marginTop: 30,
  },
  timerText: {
    fontSize: 18,
    color: Colors.primary.red,
    fontWeight: 'bold',
    marginTop: 30,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  binsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  bin: {
    width: 60,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingEnd: 7,
  },
  binText: {
    fontSize: 14,
    color: Colors.secondary.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
