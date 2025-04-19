import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

export default function CreateBlogArticle() {
  const [articleContent, setArticleContent] = useState('');
  const [readTime, setReadTime] = useState(0); // Placeholder for read time
  const [isExpert, setIsExpert] = useState(false); // Placeholder for article type

  const handleArticleSubmit = () => {
    if (!articleContent.trim()) {
      Alert.alert('Error', 'Article content cannot be empty.');
      return;
    }
// Here you would typically save the article to your backend or state management, for demonstration, we will just navigate back with the content
    router.push({
      pathname: '/(tabs)/education',
      params: { 
        articleContent: articleContent,
        readTime: readTime.toString(),
        isExpert: isExpert.toString()
      },
    });
  };

  const handleBack = () => {
    router.replace('/(tabs)/education');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Blog Article</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your article here..."
        value={articleContent}
        onChangeText={setArticleContent}
        multiline
        numberOfLines={4}
      />
      <Text style={styles.subtitle}>Estimated Read Time (minutes)</Text>

      <TextInput
        style={styles.numberinput}
        placeholder="Estimated Read Time (minutes)"
        value={readTime.toString()}
        onChangeText={(text) => setReadTime(Number(text))}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.postButton} onPress={handleArticleSubmit}>
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