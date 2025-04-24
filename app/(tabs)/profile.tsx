import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Gift, Share2 , Trash2, Key, ChevronRight, Recycle, TrendingUp, HelpCircle, LogOut, Stars, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@lib/firebase/firebaseConfig';

const auth = getAuth();
const storage = getStorage();

const achievements = [
  {
    id: '1',
    title: 'Eco Warrior',
    description: 'Recycled over 100kg of waste',
    progress: 85,
    icon: Recycle,
  },
  {
    id: '2',
    title: 'Community Leader',
    description: 'Inspired 50 people to start recycling',
    progress: 60,
    icon: Award,
  },
  {
    id: '3',
    title: 'Plastic Hero',
    description: 'Collected 1000 plastic bottles',
    progress: 40,
    icon: Gift,
  },
];

const menuItems = [
  {
    id: 'rewards',
    title: 'My Rewards',
    icon: Gift,
    color: Colors.primary.green,
  },
  {
    id: 'progress',
    title: 'Recycling Progress',
    icon: TrendingUp,
    color: Colors.primary.blue,
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: HelpCircle,
    color: Colors.secondary.yellow,
  },
  {
    id: 'referrals',
    title: 'Referrals',
    icon: Share2 ,
    color: Colors.accent.darkGray,
  },
  {
    id: 'review',
    title: 'Share Review on EcoBuddy',
    icon: Stars ,
    color: Colors.primary.lightTeal,
  },
];

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    points: 0,
    recycled: 0,
    rewards: 0,
    photoURL: '',
    role: 'myself',
  });

  const [avatar, setAvatar] = useState(Image.resolveAssetSource(require('../../assets/user icon.png')).uri);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.fullName || auth.currentUser?.displayName || 'EcoBuddy User',
            email: auth.currentUser?.email || 'No email',
            phone: data.phone || 'No phone number',
            points: data.points || 0,
            recycled: data.recycled || 0,
            rewards: data.rewards || 0,
            photoURL: auth.currentUser?.photoURL || '',
            role: data.role || 'myself',
          });
          
          if (auth.currentUser?.photoURL) {
            setAvatar(auth.currentUser.photoURL);
          }
        }
        setLoading(false);
    }
  };

  fetchUserData();
}, []);

const handleImagePicker = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setAvatar(result.assets[0].uri);
  }
};

  const handleMenuPress = (route: string) => {
    switch (route) {
      case 'rewards':
        router.push('/(tabs)/ecoRewards');
        break;
      case 'progress':
        router.push('/features/wasteHistory');
        break;
      case 'help':
        router.push('/features/help');
        break;
      case 'referrals':
        router.push('/features/referrals');
        break;
      case 'review':
        handleReviewModal();
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out.');
    }
  };

  const handleChangePassword = async () => {
    router.push('/(auth)/changePassword');
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;
              
              // Delete user data from Firestore
              await deleteDoc(doc(db, "users", user.uid));
              
              // Delete auth account
              await deleteUser(user);
              
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              router.replace('/(auth)/login');
            } catch (error: any) {
              console.error('Delete account error:', error);
              
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Reauthentication Required',
                  'Please log in again to confirm account deletion.',
                  [
                    { text: 'OK', onPress: () => handleLogout() }
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to delete account. Please try again.');
              }
            }
          }
        }
      ]
    );
  };

  const handleReviewModal = () => {
    Alert.alert(
      'Share Your Feedback',
      'How would you like to share your review?',
      [
        {
          text: 'App Store',
          onPress: () => {
            // Opens app store for review - update the URL to your actual app store URL
            Linking.openURL('https://play.google.com/store/apps/details?id=com.ecobuddy.app');
          }
        },
        {
          text: 'Send to Developers',
          onPress: () => showFeedbackForm()
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const showFeedbackForm = () => {

    Alert.alert(
      'Feedback for EcoBuddy',
      'Please send us an email with your feedback:',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send Email',
          onPress: () => {
            // Direct email instead of using a form
            const subject = encodeURIComponent('EcoBuddy App Feedback');
            const body = encodeURIComponent('Write your feedback here:');
            const emailUrl = `mailto:ecobuddy2025@gmail.com?subject=${subject}&body=${body}`;
            
            Linking.canOpenURL(emailUrl)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(emailUrl);
                } else {
                  Alert.alert(
                    'Email Not Available',
                    'Could not open email client. Please send your feedback to ecobuddy2025@gmail.com',
                    [{ text: 'OK' }]
                  );
                }
              })
              .catch((error) => {
                console.error('Error opening email client:', error);
                Alert.alert(
                  'Error',
                  'Could not open email client. Please try again later.',
                  [{ text: 'OK' }]
                );
              });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.role}>{userData.role}</Text>
            <View style={styles.badgeContainer}>
              <Award size={16} color={Colors.secondary.yellow} />
              <Text style={styles.badge}>Gold Member</Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.editSection}>
            <TouchableOpacity style={styles.editButton} onPress={handleImagePicker}>
            <Text style={styles.editButtonText}>Edit image</Text>
          </TouchableOpacity>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>{userData.email}</Text>
              <Text style={styles.contactText}>{userData.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.recycled}kg</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.rewards}</Text>
            <Text style={styles.statLabel}>Rewards</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: Colors.primary.green + '20' },
                ]}>
                <achievement.icon size={24} color={Colors.primary.green} />
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progress, { width: `${achievement.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{achievement.progress}%</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item.id)}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={Colors.accent.darkGray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleChangePassword}>
        <Key size={20} color={Colors.primary.blue} />
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={Colors.text.darker} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleDeleteAccount}>
        <Trash2 size={20} color={Colors.primary.red} />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.background.main,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.secondary.yellow,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.text.darker + '20',
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.accent.lightGray,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  achievementsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  achievementCard: {
    width: 200,
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary.green,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  menuContainer: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent.lightGray + '40',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    margin: 24,
    marginTop: 0,
    borderRadius: 12,
    backgroundColor: Colors.accent.lightGray + '20',
  },
  changePasswordText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.blue,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
  deleteText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.red,
  },
  editSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  contactInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  contactText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
});