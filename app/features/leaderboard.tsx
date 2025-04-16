import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';


const leaderboard = () => {
  return (
    <View style={styles.container}>
      <Text>leaderboard</Text>
    </View>
  )
}

export default leaderboard

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: Colors.background.main,
},
})
