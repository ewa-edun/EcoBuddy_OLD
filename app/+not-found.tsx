import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from './constants/Colors';


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/home" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background.main,
  },
  text: {
    fontSize: 27,
    fontWeight: 600,
    color: Colors.primary.green,
  },
  link: {
    fontSize: 17,
    marginTop: 15,
    paddingVertical: 15,
    color: Colors.text.primary,
  },
});
