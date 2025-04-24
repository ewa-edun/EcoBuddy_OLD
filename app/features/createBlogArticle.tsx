import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, storage } from '@lib/firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type ArticleFormData = {
  title: string;
  content: string;
  image: string;
  category: string;
};

export default function CreateBlogArticle() {
const [loading, setLoading] = useState(false);
const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    image: '',
    category: 'Sustainability'
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `blogImages/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    setLoading(true);
  try {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create articles');
      return;
    }

    let imageUrl = '';
    if (imageUri) {
      imageUrl = await uploadImage(imageUri);
    }

    const docRef = await addDoc(collection(db, 'blogArticles'), {
      title: formData.title,
      content: formData.content,
      image: imageUrl,
      category: formData.category,
      author: {
        name: auth.currentUser.displayName || 'Anonymous',
        id: auth.currentUser.uid,
        avatar: auth.currentUser.photoURL || null
      },
      date: serverTimestamp(),
      views: 0,
      readingTime: calculateReadingTime(formData.content),
      lastUpdated: serverTimestamp()
    });
    
    Alert.alert('Success', 'Article published successfully!');
    router.replace(`/features/BlogArticle?id=${docRef.id}`);
  } catch (error) {
    console.error('Error publishing article:', error);
    if ((error as { code: string }).code === 'permission-denied') {
      Alert.alert('Error', 'You do not have permission to create articles');
    } else {
      Alert.alert('Error', 'Failed to publish article');
    }
  } finally {
    setLoading(false);
  }
 };

  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };
  

  const handleBack = () => {
    router.replace('/(tabs)/education');
  };

  return (
    <ScrollView style={styles.container}>
      <View>
      <Text style={styles.title}>Create a Blog Article</Text>
      <TextInput
        style={styles.input}
        placeholder="Article Title"
        value={formData.title}
        onChangeText={(text) => setFormData({...formData, title: text})}
   />
   <TextInput
       style={styles.input}
       placeholder="Article Content"
       value={formData.content}
       onChangeText={(text) => setFormData({...formData, content: text})}
       multiline
    />
  <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
    <Text style={styles.pickImageText}>Pick an Image</Text>
    {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
  </TouchableOpacity>
      
      <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
        <Text style={styles.postButtonText}>Post Article</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.postButtonText}>Back</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 16,
  },
  input: {
    height: 180,
    borderColor: Colors.accent.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  numberinput: {
    height: 70,
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