import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@lib/firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@lib/supabase/client';

type ArticleFormData = {
  title: string;
  content: string;
  image: string;
  category: string;
  excerpt: string; // Added excerpt field
};

const CATEGORIES = ['Sustainability', 'Recycling', 'Community', 'Technology'];

export default function CreateBlogArticle() {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    image: '',
    category: 'Sustainability',
    excerpt: '', // Initialize the excerpt field
  });

interface UserInfo {
    id: string;
    name: string;
    avatar: string;
    badge: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserInfo({
          id: currentUser.uid,
          name: currentUser.displayName || "EcoBuddy User",
          avatar: currentUser.photoURL || "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
          badge: "Member"
        });
      }
    }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToSupabase = async (uri: string) => {
    try {
      // Generate a unique file name
      const fileName = `blog-image-${Date.now()}.jpg`;
      
      // Read the image file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to array buffer
      const arrayBuffer = decode(base64);
      
      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('blog-images') // Your bucket name
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // For private buckets, create a signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('blog-images')
        .createSignedUrl(fileName, 60 * 60 * 24 * 30); // URL valid for 30 days
        
      if (signedUrlError) {
        throw new Error(signedUrlError.message);
      }
      
      return {
        url: signedUrlData.signedUrl,
        path: fileName // Store the path for future reference
      };
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to create articles');
        return;
      }

      if (!formData.title.trim()) {
        Alert.alert('Error', 'Please enter a title for your article');
        setLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        Alert.alert('Error', 'Please enter content for your article');
        setLoading(false);
        return;
      }

      if (!formData.excerpt.trim()) {
        Alert.alert('Error', 'Please enter a headline/excerpt for your article');
        setLoading(false);
        return;
      }

      let imageData = null;
      if (imageUri) {
        imageData = await uploadImageToSupabase(imageUri);
      }

      const docRef = await addDoc(collection(db, 'blogArticles'), {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt, // Save the excerpt to Firestore
        // Only add these fields if imageData exists
        ...(imageData?.url && { imageUrl: imageData.url }),
        ...(imageData?.path && { imagePath: imageData.path }),
        category: formData.category, // Save the selected category
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

  const selectCategory = (category: string) => {
    setFormData({...formData, category});
    setShowCategoryModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Create a Blog Article</Text>
        
{/* Show user info when logged in */}
      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: userInfo.avatar }} 
            style={styles.userAvatar} 
          />
          <Text style={styles.userName}>Posting as: {userInfo.name}</Text>
        </View>
      )}

        <TextInput
          style={styles.titleInput}
          placeholder="Article Title"
          value={formData.title}
          onChangeText={(text) => setFormData({...formData, title: text})}
        />
        
        {/* Excerpt/Headline Input */}
        <TextInput
          style={styles.excerptInput}
          placeholder="Article Headline/Excerpt (brief summary)"
          value={formData.excerpt}
          onChangeText={(text) => setFormData({...formData, excerpt: text})}
          multiline
          numberOfLines={2}
        />
        
        {/* Category Selector */}
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryLabel}>Category:</Text>
          <View style={styles.selectedCategoryContainer}>
            <Text style={styles.selectedCategory}>{formData.category}</Text>
          </View>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Article Content"
          value={formData.content}
          onChangeText={(text) => setFormData({...formData, content: text})}
          multiline
        />
        
        <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
          <Text style={styles.pickImageText}>Pick an Image</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop:10 }} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.postButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post Article'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryOption}
                onPress={() => selectCategory(category)}
              >
                <Text style={styles.categoryOptionText}>{category}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
   userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      padding: 12,
      backgroundColor: Colors.primary.cream,
      borderRadius: 12,
    },
    userAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    userName: {
      fontSize: 14,
      fontFamily: 'PlusJakartaSans-Medium',
      color: Colors.accent.darkGray,
    },
  titleInput: {
    height: 50,
    borderColor: Colors.accent.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  excerptInput: {
    height: 80,
    borderColor: Colors.accent.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
    marginRight: 10,
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  selectedCategory: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.primary.green,
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
    textAlignVertical: 'top',
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
  disabledButton: {
    backgroundColor: Colors.primary.green + '80', // Add opacity to show disabled state
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
    marginBottom: 60,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.background.main,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent.lightGray,
  },
  categoryOptionText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.accent.lightGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
  },
});