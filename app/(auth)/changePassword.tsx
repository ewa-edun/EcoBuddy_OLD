import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { getAuth, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { router } from 'expo-router';
import { reauthenticateWithCredential } from 'firebase/auth';

const ChangePassword = () => {
    const auth = getAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const user = auth.currentUser;

        if (user) {
            try {
                // Reauthenticate the user
                if (user.email) {
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);
                } else {
                    throw new Error('User email is not available.');
                }
                
                // Update the password
                await updatePassword(user, newPassword);
                Alert.alert('Success', 'Password changed successfully');
                router.replace('/(tabs)/profile'); // Redirect to profile page after success
            } catch (error) {
                console.error('Change password error:', error);
                let errorMessage = 'Failed to change password.';

                if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Current password is incorrect.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'New password should be at least 6 characters.';
                }

                Alert.alert('Error', errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.description}>Please enter your current password and a new password.</Text>
            <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Changing...' : 'Change Password'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/(tabs)/profile')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

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
    cancelButton: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: Colors.background.modal,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: Colors.primary.green,
        fontSize: 18,
    },
});

export default ChangePassword;
