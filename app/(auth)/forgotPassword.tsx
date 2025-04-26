import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const auth = getAuth(); 

//export const ForgotPassword = () => {
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); 

  const handlePasswordReset = async () => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset email sent!');
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Password reset error:', error);
            Alert.alert('Error', 'Failed to send password reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.replace('/(auth)/login');
    };

    if (loading) {
        return <LoadingSpinner text="Sending reset link..." />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.description}>
                Enter your email address to receive a password reset link.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
                <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background.main,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary.green,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: Colors.text.secondary,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: Colors.background.modal,
    },
    button: {
        backgroundColor: Colors.primary.green,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: Colors.text.primary,
        fontSize: 18,
    },
    backButton: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: Colors.background.modal,
        borderRadius: 5,
    },
    backButtonText: {
        color: Colors.primary.green,
        fontSize: 18,
    },
});
