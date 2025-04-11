import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

export default function CreatePost() {
  const [postContent, setPostContent] = useState('');

  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    // Here you would typically save the post to your backend or state management
    // For demonstration, we will just navigate back with the content
    router.push({
      pathname: '/(tabs)/community',
      params: { newPost: postContent },
    });
  };

  const handleBack = () => {
    router.replace('/(tabs)/community');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your post here..."
        value={postContent}
        onChangeText={setPostContent}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.postButton} onPress={handlePostSubmit}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.postButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 24,
    backgroundColor: Colors.background.main,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 16,
  },
  input: {
    height: 300,
    borderColor: Colors.accent.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  postButton: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  backButton: {
    backgroundColor: Colors.primary.red,
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
}); 