import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

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
  { id: "3", name: "Glass Bottles & Jars", points: 40 },
  { id: "4", name: "Metal Cans & Containers", points: 55 },
  { id: "5", name: "Batteries & E-Waste", points: 50 },
  { id: "6", name: "Clothes & Textiles", points: 30 },
  { id: "7", name: "Tyres & Rubber", points: 75 },
  { id: "8", name: "Organic Waste", points: 15 },
  { id: "9", name: "Scrap Metal", points: 65 },
  { id: "10", name: "Non-Recyclable", points: 0 },
];

const ClaimRewards = () => {
    const [points, setPoints] = useState('');
    const [giftType, setGiftType] = useState('money'); // 'money' or 'data'
    const [bankAccount, setBankAccount] = useState('');
    const [bankName, setBankName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mobileNetwork, setMobileNetwork] = useState('');
    const [saveAsDefault, setSaveAsDefault] = useState(false);

    const handleSubmit = () => {
        // Logic to handle submission
        Alert.alert('Success', 'Your claim has been submitted!');
        router.push('/(tabs)/ecoRewards'); 
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Claim Rewards</Text>
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Points to Data Conversion</Text>
                <Text style={styles.infoText}>1,000 points = 1GB of data</Text>
                <Text style={styles.infoSubtitle}>Points Earned per Waste Category:</Text>
                <View style={styles.conversionTable}>
                    {wasteCategories.map((category) => (
                        <View key={category.id} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{category.name}:</Text>
                            <Text style={styles.tableCell}>{category.points} points</Text>
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
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
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
        color: Colors.secondary.white,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    infoText: {
        fontSize: 16,
        color: Colors.text.secondary,
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
        marginTop: 17,
        marginBottom: 5,
        color: Colors.secondary.white,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
    conversionTable: {
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableCell: {
        fontSize: 16,
        color: Colors.text.secondary,
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
        marginBottom: 40,
    },
    submitButtonText: {
        color: Colors.text.primary,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-SemiBold',
    },
});

export default ClaimRewards;
