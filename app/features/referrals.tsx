import React from 'react';
import { View, Text, Button, StyleSheet, Clipboard, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { Share2 } from 'lucide-react-native';

const Referrals = () => {
    const referralCode = "YOUR_REFERRAL_CODE"; // Replace with actual referral code logic
    const referredCount = 5; // Replace with actual count from state or props

    const copyToClipboard = () => {
        Clipboard.setString(referralCode);
        alert('Referral code copied to clipboard!');
    };

    return (
        <ScrollView style={styles.container}>
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

            <View style={styles.section}>
        <Text style={styles.sectionTitle}>People Referred</Text>
        <View style={styles.activityList}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <View key={item} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Share2 size={24} color={Colors.primary.blue} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Person you have referred</Text>
                <Text style={styles.activityMeta}>+300 points • 2 hours ago</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.background.main,
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 40,
        color: Colors.primary.green,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    code: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.text.darker,
    fontFamily: 'PlusJakartaSans-SemiBold',
    },
    copyButton: {
        backgroundColor: Colors.primary.green,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    copyButtonText: {
        color: Colors.text.primary,
        fontSize: 18,
    fontFamily: 'PlusJakartaSans-Regular',

    },
    info: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.text.secondary,
    fontFamily: 'PlusJakartaSans-Regular',

    },
    referredCount: {
        fontSize: 16,
        color: Colors.text.secondary,
    fontFamily: 'PlusJakartaSans-Regular',

    },
    section: {
        marginTop: 20,
      },
      sectionTitle: {
        fontSize: 20,
        fontFamily: 'PlusJakartaSans-SemiBold',
        color: Colors.secondary.white,
        marginBottom: 16,
      },
      activityList: {
        gap: 16,
      },
      activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      },
      activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary.green + '20',
        alignItems: 'center',
        justifyContent: 'center',
      },
      activityContent: {
        flex: 1,
      },
      activityTitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-Medium',
        color: Colors.text.secondary,
      },
      activityMeta: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Regular',
        color: Colors.text.darker,
        marginTop: 4,
      },
});

export default Referrals;
