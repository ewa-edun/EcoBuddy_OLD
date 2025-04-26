import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { db, auth } from '@lib/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

const NewChallengeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetParticipants, setTargetParticipants] = useState('100');
  const [rewardPoints, setRewardPoints] = useState('500');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default 7 days from now
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      if (!auth.currentUser) throw new Error('User not authenticated');

      await addDoc(collection(db, 'challenges'), {
        title,
        description,
        targetParticipants: parseInt(targetParticipants),
        rewardPoints: parseInt(rewardPoints),
        startDate,
        endDate,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        participants: [], // Initialize with empty array
        status: 'active'
      });

      Alert.alert('Success', 'Challenge created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert('Error', 'Failed to create challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Challenge Title*</Text>
      <TextInput
        style={styles.input}
        placeholder="30-Day Recycling Sprint"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description*</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe the challenge details, rules, and objectives..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Participants num</Text>
          <Picker
            selectedValue={targetParticipants}
            onValueChange={setTargetParticipants}
            style={styles.picker}
          >
            <Picker.Item label="50" value="50" />
            <Picker.Item label="100" value="100" />
            <Picker.Item label="200" value="200" />
            <Picker.Item label="500" value="500" />
            <Picker.Item label="1000" value="1000" />
          </Picker>
        </View>

        <View style={styles.halfInput}>
          <Text style={styles.label}>Reward Points</Text>
          <Picker
            selectedValue={rewardPoints}
            onValueChange={setRewardPoints}
            style={styles.picker}
          >
            <Picker.Item label="200" value="200" />
            <Picker.Item label="500" value="500" />
            <Picker.Item label="1000" value="1000" />
            <Picker.Item label="2000" value="2000" />
            <Picker.Item label="5000" value="5000" />
          </Picker>
        </View>
      </View>

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowStartDatePicker(true)}
      >
        <Text>{startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowEndDatePicker(true)}
      >
        <Text>{endDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
          minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // At least 1 day after start
        />
      )}

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Creating...' : 'Create Challenge'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/(tabs)/community')}
      >
        <Text style={styles.backButtonText}>
          Back to community
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewChallengeForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background.main,
  },
  label: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.secondary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  picker: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 8,
  },
  dateInput: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    height: 50,
  },
  submitButton: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 5,
  },
  submitButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  disabledButton: {
          backgroundColor: Colors.primary.green + '50',
          opacity: 0.7
    },
    backButton: {
    backgroundColor: Colors.primary.red,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 50,
    },
    backButtonText: {
      color: Colors.text.primary,
      fontSize: 16,
      fontFamily: 'PlusJakartaSans-SemiBold',
    },
});
