import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { getGeminiResponse } from '@lib/gemini/geminiService';
import { useNavigation, useRouter } from 'expo-router';
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
  const router = useRouter();

  useEffect(() => {
    const validateQuestions = (questions: any[]): boolean => {
      if (!Array.isArray(questions)) return false;
      
      return questions.every(q => 
        typeof q?.question === 'string' &&
        Array.isArray(q?.options) &&
        q.options.length === 4 &&
        q.options.filter((o: any) => o.isCorrect).length === 1
      );
    };

    // Fetch questions from Gemini API
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getGeminiResponse(
          `Generate exactly 10 multiple-choice questions about recycling, waste management, sustainability, and eco-friendliness. 
          Format each question EXACTLY like this example:
           [
       {
           "question": "Which item is NOT recyclable?",
           "options": [
               {"text": "Plastic bottles", "isCorrect": false},
               {"text": "Pizza boxes with grease", "isCorrect": true},
               {"text": "Glass jars", "isCorrect": false},
               {"text": "Aluminum cans", "isCorrect": false}
             ]
        }
    ]
          
         Rules:
    1. Return ONLY the JSON array, no other text
    2. Each question must have exactly 4 options
    3. Only one option should be correct (isCorrect: true) and it can be any of the options available from 1 to 4
    4. Ensure the JSON is valid and parsable`
        );
        if (!validateQuestions(response)) {
          throw new Error('Invalid question format received');
        }
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
    router.push({
      pathname: '/games/endingScreen',
      params: { score }
    });
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
    marginTop: 20,
    padding: 12,
  },
  timerText: {
    fontSize: 18,
    color: Colors.primary.red,
    fontWeight: 'bold',
    marginTop: 20,
    padding: 12,
  },
  questionContainer: {
    marginTop: 30,
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
    color: Colors.primary.blue,
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
