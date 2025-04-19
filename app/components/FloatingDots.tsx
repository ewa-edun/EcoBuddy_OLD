import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../constants/Colors';

type FloatingDotsProps = {
  color?: string;
  size?: number;
  spacing?: number;
}

const FloatingDots = ({ 
  color = Colors.primary.green, 
  size = 10, 
  spacing = 4 
}: FloatingDotsProps) => {
  // Animation values for three dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence for the three dots with staggered timing
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ]);
    };

    // Create the animation loop
    const startAnimation = () => {
      Animated.loop(
        Animated.parallel([
          animateDot(dot1, 0),
          animateDot(dot2, 150),
          animateDot(dot3, 300),
        ])
      ).start();
    };

    startAnimation();

    // Clean up animations when component unmounts
    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, [dot1, dot2, dot3]);

  // Map animation value to translateY for floating effect
  const translateY1 = dot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const translateY2 = dot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const translateY3 = dot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: color,
            marginRight: spacing,
            transform: [{ translateY: translateY1 }] 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: color,
            marginRight: spacing,
            transform: [{ translateY: translateY2 }] 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.dot, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            backgroundColor: color,
            transform: [{ translateY: translateY3 }] 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dot: {
    backgroundColor: Colors.primary.green,
  }
});

export default FloatingDots; 