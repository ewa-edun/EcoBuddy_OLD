import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../constants/Colors';

type LoadingSpinnerProps = {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
};

const LoadingSpinner = ({ 
  size = 'large', 
  color = Colors.primary.green, 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={Colors.primary.green} />
      {text ? <Text style={[styles.text, { color }]}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.main,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background.main + 'E6', // Semi-transparent background
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
});

export default LoadingSpinner; 