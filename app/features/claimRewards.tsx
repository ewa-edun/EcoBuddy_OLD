import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { db, auth } from '@lib/firebase/firebaseConfig';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, runTransaction } from 'firebase/firestore';

// Define waste category type
type WasteCategory = {
  id: string;
  name: string;
  points: number;
};

// List of waste categories matching those in wasteSelector.tsx
const wasteCategories: WasteCategory[] = [
  { id: "1", name: "Paper & Cardboard", points: 30 },
  { id: "2", name: "Plastic Bottles & Containers", points: 35 },
  { id: "3", name: "Glass Bottles & Jars", points: 50 },
  { id: "4", name: "Metal Cans & Scraps", points: 65 },
  { id: "5", name: "Electronic Waste", points: 50 },
  { id: "6", name: "Clothes & Textiles", points: 30 },
  { id: "7", name: "Tyres", points: 75 },
  { id: "8", name: "Organic Waste", points: 15 },
  { id: "9", name: "Shoes", points: 45 },
  { id: "10", name: "Non-Recyclable & Trash", points: 0 },
];

type PointsConversion = {
    id: string;
    name: string;
    data: number;
    cash: number;
  };

  const pointConverions: PointsConversion[] = [
    { id: "1", name: "50 Points", data: 45, cash: 35 },
    { id: "2", name: "100 points", data: 95, cash: 80 },
    { id: "3", name: "200 points", data: 190, cash: 160 },
    { id: "4", name: "300 points", data: 285, cash: 240 },
    { id: "5", name: "400 points", data: 380, cash: 320 },
    { id: "6", name: "500 points", data: 475, cash: 400 },
    { id: "7", name: "600 points", data: 570, cash: 480 },
    { id: "8", name: "700 points", data: 665, cash: 560 },
    { id: "9", name: "800 points", data: 760, cash: 640 },
    { id: "10", name: "900 points", data: 855, cash: 720 },
    { id: "12", name: "1000 points", data: 1100, cash: 950 },
  ];

  type OtherCategories = {
    id: string;
    name: string;
    points: number;
  };

  const otherCategories: OtherCategories[] = [
    { id: "1", name: "Referrals", points: 300 },
    { id: "2", name: "Game Sessions", points: 100 },
  ];
const ClaimRewards = () => {
    const [points, setPoints] = useState('');
    const [giftType, setGiftType] = useState('money'); // 'money' or 'data'
    const [bankAccount, setBankAccount] = useState('');
    const [bankName, setBankName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mobileNetwork, setMobileNetwork] = useState('');
    const [saveAsDefault, setSaveAsDefault] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

     // Load saved default info on component mount
     useEffect(() => {
        const loadDefaultInfo = async () => {
            try {
                const userRef = doc(db, 'users', auth.currentUser?.uid || '');
                const docSnap = await getDoc(userRef);
                
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.defaultClaimInfo) {
                        setGiftType(userData.defaultClaimInfo.giftType);
                        setBankAccount(userData.defaultClaimInfo.bankAccount || '');
                        setBankName(userData.defaultClaimInfo.bankName || '');
                        setPhoneNumber(userData.defaultClaimInfo.phoneNumber || '');
                        setMobileNetwork(userData.defaultClaimInfo.mobileNetwork || '');
                        setSaveAsDefault(true);
                    }
                }
            } catch (error) {
                console.error("Error loading default info:", error);
            }
        };
        loadDefaultInfo();
    }, []);

    const handleSubmit = async () => {
        if (!points || isNaN(Number(points))) {
            Alert.alert('Error', 'Please enter a valid points amount');
            return;
        }

        if (giftType === 'money' && (!bankAccount || !bankName)) {
            Alert.alert('Error', 'Please enter bank details');
            return;
        }

        if (giftType === 'data' && (!phoneNumber || !mobileNetwork)) {
            Alert.alert('Error', 'Please enter phone details');
            return;
        }

        setIsLoading(true);
        setIsSubmitting(true);

        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            // 1. Save the claim request
            const claimsRef = collection(db, 'claimRequests');
            const newClaimRef = doc(claimsRef);
            
            await setDoc(newClaimRef, {
                userId,
                points: Number(points),
                giftType,
                ...(giftType === 'money' ? {
                    bankAccount,
                    bankName
                } : {
                    phoneNumber,
                    mobileNetwork
                }),
                status: 'pending',
                createdAt: serverTimestamp()
            });

            // 2. Update user points (deduct claimed points)
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', userId);
                const userDoc = await transaction.get(userRef);
                
                if (!userDoc.exists()) throw new Error("User document doesn't exist");
                
                const currentPoints = userDoc.data().points || 0;
                if (currentPoints < Number(points)) {
                    throw new Error("Insufficient points");
                }
                
                transaction.update(userRef, {
                    points: currentPoints - Number(points)
                });
            });

            // 3. Save as default if requested
            if (saveAsDefault) {
                const userRef = doc(db, 'users', userId);
                await setDoc(userRef, {
                    defaultClaimInfo: {
                        giftType,
                        bankAccount,
                        bankName,
                        phoneNumber,
                        mobileNetwork
                    }
                }, { merge: true });
            }

            Alert.alert('Success', 'Your claim has been submitted!');
            router.push('/(tabs)/ecoRewards');
        } catch (error) {
            console.error("Claim error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit claim';
            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

// API for processing claims (Cloud Function)
    // Add this to your Firebase Cloud Functions
    /*
    exports.processClaim = functions.firestore
        .document('claimRequests/{claimId}')
        .onCreate(async (snap, context) => {
            const claim = snap.data();
            
            if (claim.giftType === 'data') {
                // Integrate with your data vendor API
                await dataVendorAPI.redeem(
                    claim.phoneNumber,
                    claim.mobileNetwork,
                    claim.points
                );
                
                await snap.ref.update({ 
                    status: 'completed',
                    completedAt: admin.firestore.FieldValue.serverTimestamp() 
                });
            } else {
                // Process bank transfer
                await bankAPI.transfer(
                    claim.bankAccount,
                    claim.bankName,
                    calculateCashAmount(claim.points)
                );
                
                await snap.ref.update({ 
                    status: 'completed',
                    completedAt: admin.firestore.FieldValue.serverTimestamp() 
                });
            }
        });
    */

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Claim Rewards</Text>
            <View style={styles.infoCard}>
             <Text style={styles.infoTitle}>Points to Data Conversion</Text>
             <View style={styles.conversionTable}>
                    {pointConverions.map((category) => (
                        <View key={category.id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{category.name}:</Text>
                            <Text style={styles.tablePoints}>{category.data} MB</Text>
                          <Text style={styles.tablePoints}>{category.cash} Naira</Text>
                        </View>
                    ))}
                </View>
             <Text style={styles.infoSubtitle}>Points Earned per Waste Category:</Text>
                <View style={styles.conversionTable}>
                    {wasteCategories.map((category) => (
                        <View key={category.id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{category.name}:</Text>
                        <Text style={styles.tablePoints}>{category.points} points</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.infoSubtitle}>Points Earned in Other Ways:</Text>
                <View style={styles.conversionTable}>
                    {otherCategories.map((category) => (
                        <View key={category.id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{category.name}:</Text>
                            <Text style={styles.tablePoints}>{category.points} points</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.infoRule}>*Rules and regulations apply.</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Amount of Points"
                keyboardType="numeric"
                value={points}
                onChangeText={setPoints}
            />
            <Text style={styles.label}>Select Gift Type:</Text>
            <View style={styles.radioGroup}>
                <TouchableOpacity onPress={() => setGiftType('money')} style={styles.radioButton}>
                    <Text style={styles.radioText}>Money</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setGiftType('data')} style={styles.radioButton}>
                    <Text style={styles.radioText}>Data</Text>
                </TouchableOpacity>
            </View>
            {giftType === 'money' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Bank Account Number"
                        value={bankAccount}
                        onChangeText={setBankAccount}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Bank Name"
                        value={bankName}
                        onChangeText={setBankName}
                    />
                </>
            )}
            {giftType === 'data' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Network (MTN, Airtel, Glo, 9Mobile)"
                        value={mobileNetwork}
                        onChangeText={setMobileNetwork}
                    />
                </>
            )}
            <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => setSaveAsDefault(!saveAsDefault)} style={styles.checkbox}>
                    {saveAsDefault && <View style={styles.checkedBox} />}
                    {!saveAsDefault && <View style={styles.uncheckedBox} />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Save this info as default account</Text>
            </View>
            <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Processing...' : 'Submit'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background.main,
    },
    header: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary.green,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    infoCard: {
        backgroundColor: Colors.background.modal,
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.secondary.white,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    infoText: {
        fontSize: 16,
        color: Colors.primary.cream,
        fontFamily: 'PlusJakartaSans-Regular',
    },
    infoRule: {
        fontSize: 16,
        color: Colors.text.darker,
        fontFamily: 'PlusJakartaSans-Regular',
    },
    infoSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: Colors.secondary.white,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    conversionTable: {
        marginBottom: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableCell: {
        fontSize: 16,
        color: Colors.primary.cream,
    },
    tablePoints: {
        fontSize: 16,
        color: Colors.primary.beige,
    },
    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: Colors.primary.cream,
        borderRadius: 8,
        fontFamily: 'PlusJakartaSans-Regular',
        color: Colors.accent.darkGray,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.text.secondary,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    radioButton: {
        padding: 10,
        backgroundColor: Colors.background.modal,
        borderRadius: 5,
    },
    radioText: {
        color: Colors.text.darker,
    fontFamily: 'PlusJakartaSans-Regular',

    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: Colors.primary.green,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedBox: {
        width: 16,
        height: 16,
        backgroundColor: Colors.primary.green,
    },
    uncheckedBox: {
        width: 16,
        height: 16,
        backgroundColor: 'transparent',
    },
    checkboxLabel: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    submitButton: {
        backgroundColor: Colors.primary.green,
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 50,
    },
    submitButtonText: {
        color: Colors.text.primary,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    disabledButton: {
        backgroundColor: Colors.primary.green + '50',
        opacity: 0.7
    },
});

export default ClaimRewards;
