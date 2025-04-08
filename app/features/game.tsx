import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';


const game = () => {
  return (
    <View style={styles.container}>
      <Text>game</Text>
    </View>
  )
}

export default game

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: Colors.background.main,
},
})
