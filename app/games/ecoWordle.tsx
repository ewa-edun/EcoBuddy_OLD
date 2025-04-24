import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { ecoWords } from './ecoWords';
import { useRouter, useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  '/games/endingScreen': { score: number };
}
const EcoWordle = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [targetWord, setTargetWord] = useState('');
  const [description, setDescription] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(100); // Initial score
  const [timeLeft, setTimeLeft] = useState(90); // Timer starts at 1 minute 30 seconds
  const router = useRouter();

  useEffect(() => {
    // Select a random word from the ecoWords list
    const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
    setTargetWord(randomWord.word.toLowerCase());
    setDescription(randomWord.description);
  }, []);

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameOver]);

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      Alert.alert('Invalid Guess', 'Your guess must be a 5-letter word.');
      return;
    }

    setGuesses([...guesses, currentGuess.toLowerCase()]);

    if (currentGuess.toLowerCase() === targetWord) {
      setWin(true);
      setGameOver(true);
    } else if (guesses.length === 5) {
      setScore(score - 20); // Deduct 20 points for a missed word
      setGameOver(true);
    } else {
      setScore(score - 20); // Deduct 20 points for an incorrect guess
    }

    setCurrentGuess('');
  };

  const endGame = () => {
    setGameOver(true);
    router.push({
      pathname: '/games/endingScreen',
      params: { score },
    });
  };

  const getTileColor = (letter: string, index: number) => {
    if (targetWord[index] === letter) {
      return Colors.primary.green; // Correct letter in the correct position
    } else if (targetWord.includes(letter)) {
      return Colors.secondary.yellow; // Correct letter in the wrong position
    } else {
      return Colors.accent.darkGray ; // Incorrect letter
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
          {timeLeft % 60}
        </Text>
      </View>

      <Text style={styles.title}>Eco Wordle</Text>
      <Text style={styles.description}>Hint: {description}</Text>

      <View style={styles.grid}>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = guesses[rowIndex]?.[colIndex] || '';
              const color = guesses[rowIndex]
                ? getTileColor(letter, colIndex)
                : Colors.primary.cream;

              return (
                <View key={colIndex} style={[styles.tile, { backgroundColor: color }]}>
                  <Text style={styles.tileText}>{letter.toUpperCase()}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {!gameOver && (
        <TextInput
          style={styles.input}
          value={currentGuess}
          onChangeText={(text) => setCurrentGuess(text)}
          maxLength={5}
          placeholder="Enter your guess"
          placeholderTextColor={Colors.text.secondary}
        />
      )}

      {!gameOver && (
        <TouchableOpacity style={styles.button} onPress={handleGuess}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {gameOver && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {win ? 'Congratulations! You guessed the word!' : `Game Over! The word was "${targetWord.toUpperCase()}".`}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setGuesses([]);
              setGameOver(false);
              setWin(false);
              setScore(100); // Reset score
              setTimeLeft(90); // Reset timer
              const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
              setTargetWord(randomWord.word.toLowerCase());
              setDescription(randomWord.description);
            }}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endGame} style={styles.button}>
          <Text style={styles.buttonText}>End Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EcoWordle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.primary.green,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 18,
    color: Colors.primary.red,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.primary.green,
    marginBottom: 10,
    marginTop: 40,
  },
  description: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  tile: {
    width: 50,
    height: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  tileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary.white,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.accent.darkGray,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
});