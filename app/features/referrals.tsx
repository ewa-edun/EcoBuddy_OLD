import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Share, Alert, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { Users, Copy, Share2, Gift } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import LoadingSpinner from '../components/LoadingSpinner';

const ReferralsScreen = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>({});
  const [referralSuccess, setReferralSuccess] = useState<boolean>(false);
  const auth = getAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);
          
          // Generate referral code based on user's name and ID
          const fullName = data.fullName || auth.currentUser.displayName || '';
          const userId = auth.currentUser.uid;
          const generatedCode = generateReferralCode(fullName, userId);
          setReferralCode(generatedCode);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const generateReferralCode = (fullName: string, userId: string) => {
    // Clean up the name (remove spaces, special characters)
    const cleanName = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    // Take first 10 characters of name (or all if shorter)
    const namePart = cleanName.substring(0, 10);
    // Take last 5 characters of userId
    const idPart = userId.substring(userId.length - 5);
    
    return `${namePart}${idPart}`;
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(referralCode);
      Alert.alert('Copied!', 'Referral code copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join me on EcoBuddy and start your eco-friendly journey! Use my referral code: ${referralCode}`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handleSubmitCode = async () => {
    if (!enteredCode || enteredCode.trim() === '') {
      Alert.alert('Error', 'Please enter a referral code');
      return;
    }

    if (enteredCode === referralCode) {
      Alert.alert('Error', 'You cannot use your own referral code');
      return;
    }

    setLoading(true);
    try {
      // Check if this referral code exists by querying users
      // This is a simplified approach - in production, you'd use a more efficient query
      const usersSnapshot = await getDoc(doc(db, "referralCodes", enteredCode));
      
      if (usersSnapshot.exists()) {
        const referrerUserId = usersSnapshot.data().userId;
        
        // Update the referrer's points (reward them for the referral)
        const referrerUserRef = doc(db, "users", referrerUserId);
        await updateDoc(referrerUserRef, {
          points: increment(300), // Give 300 points for a successful referral
          referrals: increment(1)
        });
        
        // Update current user to mark as referred
        if (auth.currentUser) {
          const currentUserRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(currentUserRef, {
            referredBy: enteredCode,
            points: increment(300) // Also give the referred user same points
          });
        }
        
        setReferralSuccess(true);
        Alert.alert(
          'Success!', 
          'Referral code applied successfully! You and your friend have received bonus points.'
        );
        setEnteredCode('');
      } else {
        Alert.alert('Invalid Code', 'This referral code does not exist or has expired');
      }
    } catch (error) {
      console.error('Error applying referral code:', error);
      Alert.alert('Error', 'Failed to apply referral code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading referrals..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Referrals</Text>
        <Text style={styles.subtitle}>
          Invite friends and earn rewards together
        </Text>
      </View>

      <View style={styles.rewardsCard}>
        <View style={styles.rewardIconContainer}>
          <Gift size={24} color={Colors.primary.green} />
        </View>
        <Text style={styles.rewardsTitle}>Referral Rewards</Text>
        <Text style={styles.rewardsDescription}>
          Earn 300 points for each friend who signs up using your code. They'll get 300 points too!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{referralCode}</Text>
          <View style={styles.codeActions}>
            <TouchableOpacity
              style={styles.codeActionButton}
              onPress={handleCopyCode}
            >
              <Copy size={20} color={Colors.primary.green} />
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.codeActionButton}
              onPress={handleShareCode}
            >
              <Share2 size={20} color={Colors.primary.green} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter a Referral Code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter code here"
            placeholderTextColor={Colors.text.secondary}
            value={enteredCode}
            onChangeText={setEnteredCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitCode}
          >
            <Text style={styles.submitButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Users size={20} color={Colors.primary.green} />
          </View>
          <Text style={styles.statValue}>{userData.referrals || 0}</Text>
          <Text style={styles.statLabel}>Friends Referred</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Gift size={20} color={Colors.primary.green} />
          </View>
          <Text style={styles.statValue}>{(userData.referrals || 0) * 100}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </View>

      {referralSuccess && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>Referral Applied!</Text>
          <Text style={styles.successText}>
            You've earned 50 points and your friend received 100 points!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    padding: 24,
    paddingTop: 20,
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
    color: Colors.text.darker,
  },
  rewardsCard: {
    margin: 24,
    padding: 20,
    backgroundColor: Colors.primary.lightTeal,
    borderRadius: 16,
    alignItems: 'center',
  },
  rewardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardsTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  rewardsDescription: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.primary,
    lineHeight: 20,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  codeContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  code: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    letterSpacing: 2,
    marginBottom: 16,
  },
  codeActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  codeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.background.main,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.background.modal,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
  },
  submitButton: {
    marginLeft: 12,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary.green,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
  },
  statsSection: {
    padding: 24,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.lightTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
  },
  successCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.primary.lightTeal,
    borderRadius: 12,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.primary,
    lineHeight: 20,
  },
});

export default ReferralsScreen;
