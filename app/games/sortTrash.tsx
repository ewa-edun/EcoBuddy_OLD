import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';


const sortTrash = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sort Trash</Text>
    </View>
  )
}

export default sortTrash

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
