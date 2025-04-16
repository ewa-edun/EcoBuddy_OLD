import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';


const recycleMatch = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recycle Match</Text>
    </View>
  )
}

export default recycleMatch

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
