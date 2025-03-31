import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function RegisterScreen() {
  const handleRegister = () => {
    // Handle registration logic here
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the recycling revolution in Nigeria</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.accent.darkGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={Colors.accent.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.accent.darkGray}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={Colors.accent.darkGray}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.accent.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.blue,
  },
});