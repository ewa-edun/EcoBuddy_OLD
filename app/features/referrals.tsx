import React from 'react';
import { View, Text, Button, StyleSheet, Clipboard, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

const Referrals = () => {
    const referralCode = "YOUR_REFERRAL_CODE"; // Replace with actual referral code logic
    const referredCount = 5; // Replace with actual count from state or props

    const copyToClipboard = () => {
        Clipboard.setString(referralCode);
        alert('Referral code copied to clipboard!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Referral Code</Text>
            <Text style={styles.code}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>Copy Code</Text>
            </TouchableOpacity>
            <Text style={styles.info}>
                Earn 300 points for every person you refer!
            </Text>
            <Text style={styles.referredCount}>
                You have referred {referredCount} people.
            </Text>
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
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary.green,
    },
    code: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary.green,
    },
    copyButton: {
        backgroundColor: Colors.primary.beige,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    copyButtonText: {
        color: Colors.text.primary,
        fontSize: 18,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.text.secondary,
    },
    referredCount: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
});

export default Referrals;
