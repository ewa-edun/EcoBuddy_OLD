import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { db, auth } from '@lib/firebase/firebaseConfig'; 
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@lib/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `posts/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    setIsLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const postData = {
        userId: auth.currentUser ? auth.currentUser.uid : null,
        username: auth.currentUser ? auth.currentUser.displayName : null,
        content: postContent,
        imageUrl,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        shares: [],
        likedBy: [],
      };

      await addDoc(collection(db, 'posts'), postData);

    router.push({
      pathname: '/(tabs)/community',
      params: { refresh: 'true' },
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to create post. Please try again.');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
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
      <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
          <Text style={styles.pickImageText}>Pick an Image</Text>
          {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
        </TouchableOpacity>
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
    height: 200,
    borderColor: Colors.accent.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  pickImage: {
    backgroundColor: Colors.background.modal,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,

  },
  pickImageText: {
    color: Colors.text.darker,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
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
