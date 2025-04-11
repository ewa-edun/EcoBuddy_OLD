import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const FloatingDots = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.dot}>.</Text>
      <Text style={styles.dot}>.</Text>
      <Text style={styles.dot}>.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    fontSize: 40,
    color: Colors.primary.green,
    marginHorizontal: 2,
  },
});

export default FloatingDots; 