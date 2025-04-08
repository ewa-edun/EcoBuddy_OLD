import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from './constants/Colors';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Image style={styles.image}
        source={require('../assets/EcoBuddy_logo.jpeg')}
      />
      <View style={styles.content}>
        <Text style={styles.title}>EcoBuddy</Text>
        <Text style={styles.subtitle}>
         ...no dey waste, make E pay
        </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 150,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.beige,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary.lightTeal,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary.cream,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});