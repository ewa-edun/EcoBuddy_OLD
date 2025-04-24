import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { getGeminiResponse } from '@lib/gemini/geminiService';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  '/games/endingScreen': { score: number };
}

const Quiz = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions from Gemini API
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getGeminiResponse(
          `Generate 10 multiple-choice questions about recycling, waste management, and eco-friendliness. 
          Each question should have the following structure:
          [
            {
              "question": "Which of the following items should not be placed in a recycling bin?",
              "options": [
                { "text": "Plastic", "isCorrect": false },
                { "text": "Glass", "isCorrect": false },
                { "text": "Used tissue paper", "isCorrect": true },
                { "text": "Paper", "isCorrect": false }
              ]
            },
            {
        "question": "Which of the following is considered hazardous waste?",
        "options": [
           { "text": "Batteries", "isCorrect": true },
           { "text": "Cardboard", "isCorrect": false },
           { "text": "Plastic bottles", "isCorrect": false },
           { "text": "Glass jars", "isCorrect": false }
         ]
      },
            ...
          ]
          Ensure the response is a valid JSON array with 10 questions.`
        );
        setQuestions(response);
      } catch (error) {
        Alert.alert('Error', 'Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
    };
    
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      endGame();
    }
  }, [timeLeft]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    navigation.navigate('/games/endingScreen', { score });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available. Please try again later.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(option.isCorrect)}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Quiz;

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
  },
  timerText: {
    fontSize: 18,
    color: Colors.primary.red,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    color: Colors.text.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: Colors.primary.cream,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  loadingText: {
    fontSize: 30,
    color: Colors.primary.green,
    textAlign: 'center',
    marginTop: 40,
    padding: 20,
  },
  errorText: {
    fontSize: 25,
    color: Colors.primary.red,
    textAlign: 'center',
    marginTop: 40,
    padding: 20,
  },
});
