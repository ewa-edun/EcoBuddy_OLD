import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import { db, auth } from '@lib/firebase/firebaseConfig'; 
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@lib/supabase/client';

export default function CreatePost() {
  const [postContent, setPostContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  interface UserInfo {
    id: string;
    name: string;
    avatar: string;
    badge: string;
  }

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Fetch current user data when component mounts
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
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToSupabase = async (uri: string) => {
    try {
      // Generate a unique file name
      const fileName = `post-image-${Date.now()}.jpg`;
      
      // Read the image file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to array buffer
      const arrayBuffer = decode(base64);
      
      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('post-images') // Your bucket name
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // For private buckets, we need to create a signed URL instead of a public URL
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('post-images')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7); // URL valid for 7 days
        
      if (signedUrlError) {
        throw new Error(signedUrlError.message);
      }
      
      return {
        url: signedUrlData.signedUrl,
        path: fileName // Store the path as well for future reference
      };
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      throw error;
    }
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }

    setIsLoading(true);

    try {
      let imageData = null;
      if (image) {
        try {
          imageData = await uploadImageToSupabase(image);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          // Continue without image if upload fails
        }
      }

      const user = auth.currentUser;
      
      // Create post data object with required fields
      const postData: {
        userId: string;
        authorId: string;
        author: UserInfo;
        content: string;
        createdAt: ReturnType<typeof serverTimestamp>;
        likes: string[];
        comments: number;
        imageUrl?: string;
        imagePath?: string;
      } = {
        userId: user.uid,
        authorId: user.uid, // Add this so rules can match it
        author: userInfo || {
          id: user.uid,
          name: user.displayName || "EcoBuddy User",
          avatar: user.photoURL || "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
          badge: "Member"
        },
        content: postContent,
        createdAt: serverTimestamp(),
        likes: [],
        comments: 0,
      };

      // Only add image fields if we have image data
      if (imageData?.url) {
        postData.imageUrl = imageData.url;
      }
      
      if (imageData?.path) {
        postData.imagePath = imageData.path;
      }

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
        style={styles.input}
        placeholder="Write your post here..."
        value={postContent}
        onChangeText={setPostContent}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.pickImage} onPress={pickImage}>
        <Text style={styles.pickImageText}>Pick an Image</Text>
        {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop:10 }} />}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.postButton, isLoading && styles.disabledButton]} 
        onPress={handlePostSubmit}
        disabled={isLoading}
      >
        <Text style={styles.postButtonText}>{isLoading ? 'Posting...' : 'Post'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        disabled={isLoading}
      >
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
  },
});