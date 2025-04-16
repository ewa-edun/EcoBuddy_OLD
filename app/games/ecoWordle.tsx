import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';

const ecoWordle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>eco Wordle</Text>
    </View>
  )
}

export default ecoWordle

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
      },
      text: {
        fontSize: 35,
        padding: 40,
        color: Colors.primary.green
      },
})