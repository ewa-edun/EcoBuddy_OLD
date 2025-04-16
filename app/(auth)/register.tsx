import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserCog } from 'lucide-react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@lib/firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import RNPickerSelect from 'react-native-picker-select';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'myself',
  });
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // 2. Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        role: formData.role,
        points: 0,
        recycled: 0,
        rewards: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      console.log('User registered:', userCredential.user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/EcoBuddy_logo.jpeg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the recycling revolution in Nigeria</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholderTextColor={Colors.accent.darkGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholderTextColor={Colors.accent.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholderTextColor={Colors.accent.darkGray}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholderTextColor={Colors.accent.darkGray}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff size={20} color={Colors.accent.darkGray} />
              ) : (
                <Eye size={20} color={Colors.accent.darkGray} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <UserCog size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
            <Text style={styles.roleText}>
              {formData.role === 'myself' ? 'Myself' : 'Agent'}
            </Text>
            <RNPickerSelect
              onValueChange={(value) => {
                setFormData({ ...formData, role: value });
                setShowRoleDropdown(false);
              }}
              items={[
                { label: 'Myself', value: 'myself' },
                { label: 'Agent (someone else)', value: 'agent' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select your role...', value: null }}
              useNativeAndroidPickerStyle={false}
              onUpArrow={() => setShowRoleDropdown(false)}
              onDownArrow={() => setShowRoleDropdown(false)}
            />
          </TouchableOpacity>

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
    backgroundColor: Colors.background.main,
  },
  content: {
    padding: 24,
    paddingTop: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 13,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.beige,
  },
  roleText: {
    flex: 1,
    fontSize: 16,
    color: Colors.accent.darkGray,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.accent.lightGray,
    borderRadius: 8,
    color: Colors.accent.darkGray,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.accent.lightGray,
    borderRadius: 8,
    color: Colors.accent.darkGray,
    paddingRight: 20,
  },
});