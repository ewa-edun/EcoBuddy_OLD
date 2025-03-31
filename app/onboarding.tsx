import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from './constants/Colors';
import logo from '../assets/EcoBuddy_logo.jpeg';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>EcoBuddy Nigeria</Text>
        <Text style={styles.subtitle}>
         ...no dey waste, E dey pay
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
    backgroundColor: Colors.secondary.white,
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
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
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary.blue,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});