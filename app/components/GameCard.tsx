import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';

interface GameCardProps {
  title: string;
  onPress: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={require('../../assets/user icon.png')}
        style={styles.image}
      />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 150,
    margin: 5,
    borderRadius: 10,
    backgroundColor: Colors.primary.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.green,
  },
});

export default GameCard;