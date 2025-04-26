import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Colors } from '../constants/Colors';
import { useNavigation, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, updateDoc, increment, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase/firebaseConfig';

const ConfettiPiece = ({ delay }: { delay: number }) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomX = Math.random() * 400 - 200;
    const randomRotation = Math.random() * 720 - 360;
    const randomDuration = 2000 + Math.random() * 1000;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: { 
            x: randomX,
            y: 1200
          },
          duration: randomDuration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: randomDuration * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: randomDuration * 0.2,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const randomSize = Math.random() * 12 + 6;
  const randomColor = [
    Colors.primary.green,
    Colors.primary.blue,
    Colors.secondary.yellow,
    Colors.primary.red,
    Colors.primary.cream,
    Colors.accent.brown,
  ][Math.floor(Math.random() * 6)];

  const randomShape = Math.random() > 0.5 ? 2 : 4;

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          width: randomSize,
          height: randomSize,
          backgroundColor: randomColor,
          borderRadius: randomShape,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale },
            { rotate: position.x.interpolate({
              inputRange: [-200, 200],
              outputRange: ['-720deg', '720deg'],
            })},
          ],
          opacity,
        },
      ]}
    />
  );
};

const EndingScreen = () => {
  const { score } = useLocalSearchParams();
  const router = useRouter();
  const scoreNum = typeof score === 'string' ? parseInt(score) : 0;
  const showConfetti = scoreNum > 50;
  const [pointsAdded, setPointsAdded] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const addGamePoints = async () => {
      if (!user || pointsAdded || scoreNum <= 0) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        
        await updateDoc(userRef, {
          points: increment(scoreNum),
          lastGamePlayed: new Date().toISOString(),
          gamesPlayed: increment(1),
        });

        setPointsAdded(true);
        console.log('Points added successfully');
      } catch (error) {
        console.error('Error adding points:', error);
      }
    };

    addGamePoints();
  }, [user, scoreNum, pointsAdded]);

  return (
    <View style={styles.container}>
      {showConfetti && (
        <View style={styles.confettiContainer}>
          {Array.from({ length: 100 }).map((_, i) => (
            <ConfettiPiece key={i} delay={i * 30} />
          ))}
        </View>
      )}
      <Text style={[styles.title, showConfetti && styles.celebrationTitle]}>
        {scoreNum > 50 ? '🎉 Congratulations! 🎉' : 'Quiz Completed!'}
      </Text>
      <Text style={[styles.scoreText, showConfetti && styles.celebrationScore]}>
        Your Score: {score}
      </Text>
      {pointsAdded && (
        <Text style={styles.pointsAddedText}>
          {scoreNum} points added to your account!
        </Text>
      )}
      <TouchableOpacity
        style={[styles.button, showConfetti && styles.celebrationButton]}
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
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    top: -20,
    left: '50%',
  },
  title: {
    fontSize: 24,
    color: Colors.primary.green,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 28,
    color: Colors.secondary.yellow,
    textShadowColor: Colors.primary.green,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreText: {
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 30,
  },
  celebrationScore: {
    fontSize: 24,
    color: Colors.primary.cream,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 15,
    borderRadius: 10,
  },
  celebrationButton: {
    backgroundColor: Colors.secondary.yellow,
    shadowColor: Colors.primary.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.secondary.white,
    fontWeight: 'bold',
  },
  pointsAddedText: {
    fontSize: 16,
    color: Colors.primary.green,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});