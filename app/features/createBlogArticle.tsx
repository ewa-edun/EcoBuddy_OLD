import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@lib/firebase/firebaseConfig';

type ArticleFormData = {
  title: string;
  content: string;
  image: string;
  category: string;
};

export default function CreateBlogArticle() {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    image: '',
    category: 'Sustainability'
  });

  const handleSubmit = async () => {
  try {
    const docRef = await addDoc(collection(db, 'blogArticles'), {
      ...formData,
      author: auth.currentUser?.displayName || 'Admin',
      date: serverTimestamp(),
      views: 0,
      readingTime: calculateReadingTime(formData.content),
    });
    
    Alert.alert('Success', 'Article published successfully!');
    router.replace(`/features/BlogArticle?id=${docRef.id}`);
  } catch (error) {
    console.error('Error publishing article:', error);
    Alert.alert('Error', 'Failed to publish article');
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
    <View style={styles.container}>
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
<TextInput
      style={styles.input}
      placeholder="Image URL"
      value={formData.image}
      onChangeText={(text) => setFormData({...formData, image: text})}
   />
      
      <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
        <Text style={styles.postButtonText}>Post Article</Text>
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
  subtitle: {
    fontSize: 17,
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