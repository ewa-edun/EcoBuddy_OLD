import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert, Linking, TextInput, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Gift, Share2 , Trash2, Key, ChevronRight, Recycle, TrendingUp, HelpCircle, LogOut, Stars, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import { supabase } from '@lib/supabase/client';
import { uploadAvatar } from '@lib/supabase/storage';

const auth = getAuth();

// Default achievements data (will be replaced with Firestore data)
const defaultAchievements = [
  {
    id: '1',
    title: 'Eco Warrior',
    description: 'Recycled over 100kg of waste',
    progress: 0,
    icon: Recycle,
    target: 100,
    current: 0,
    type: 'recycled',
    unlocked: false, 
  },
  {
    id: '2',
    title: 'Community Leader',
    description: 'Inspired 50 people to start recycling',
    progress: 0,
    icon: Award,
    target: 50,
    current: 0,
    type: 'referrals',
    unlocked: false, 
  },
  {
    id: '3',
    title: 'Plastic Hero',
    description: 'Collected 1000 plastic bottles',
    progress: 0,
    icon: Gift,
    target: 1000,
    current: 0,
    type: 'items',
    unlocked: false, 
  },
];

// Update the userData state interface to include more fields
interface UserData {
  name: string;
  email: string;
  phone: string;
  points: number;
  recycled: number;
  rewards: number;
  photoURL: string;
  role: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievementsUnlocked: string[]; // Array of achievement IDs
  badges: string[]; // Array of badge names
}

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
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    achievementsUnlocked: [],
    badges: [],
  });
  
  // Add level thresholds configuration
const levelThresholds = [
  { level: 1, xpRequired: 0, title: 'Eco Beginner' },
  { level: 2, xpRequired: 100, title: 'Eco Explorer' },
  { level: 3, xpRequired: 300, title: 'Eco Enthusiast' },
  { level: 4, xpRequired: 600, title: 'Eco Champion' },
  { level: 5, xpRequired: 1000, title: 'Eco Master' },
];

// Enhanced calculateLevel function
const calculateLevel = (xp: number): number => {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i].xpRequired) {
      return levelThresholds[i].level;
    }
  }
  return 1;
};

// Enhanced calculateNextLevelXp function
const calculateNextLevelXp = (currentLevel: number): number => {
  const nextLevel = levelThresholds.find(threshold => threshold.level === currentLevel + 1);
  return nextLevel ? nextLevel.xpRequired : levelThresholds[levelThresholds.length - 1].xpRequired;
};

// Get level title
const getLevelTitle = (level: number): string => {
  const levelData = levelThresholds.find(threshold => threshold.level === level);
  return levelData ? levelData.title : 'Eco Beginner';
};

  const [achievements, setAchievements] = useState(defaultAchievements);
  const [avatar, setAvatar] = useState(Image.resolveAssetSource(require('../../assets/user icon.png')).uri);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          
          // Set up real-time listener for user data
          const unsubscribe = onSnapshot(userDocRef, async (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              const xp = data.xp || 0;
              const level = calculateLevel(xp);
              const nextLevelXp = calculateNextLevelXp(level);
              
              setUserData({
                name: data.fullName || auth.currentUser?.displayName || 'EcoBuddy User',
                email: auth.currentUser?.email || 'No email',
                phone: data.phone || 'No phone number',
                points: data.points || 0,
                recycled: data.recycled || 0,
                rewards: data.rewards || 0,
                photoURL: auth.currentUser?.photoURL || '',
                role: data.role || 'myself',
                level,
                xp,
                nextLevelXp,
                achievementsUnlocked: data.achievementsUnlocked || [],
                badges: data.badges || [],
              });
    
              if (auth.currentUser?.photoURL) {
                setAvatar(auth.currentUser.photoURL);
              }
    
              // Refresh achievements when user data changes
              await fetchAchievements(data);
            }
          });
    
          // Cleanup function for the useEffect
          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not load profile data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  // Enhanced fetchAchievements function
// Define a proper type for achievements
interface Achievement {
  id: string;
  type: string;
  target: number;
  unlocked: boolean; // Add the unlocked property
  [key: string]: any; // Allow additional properties
}

const fetchAchievements = async (userData: any) => {
  try {
    const achievementsRef = collection(db, "achievements");
    const q = query(achievementsRef, where("isActive", "==", true));
    const achievementsSnapshot = await getDocs(q);
    
    const loadedAchievements: Achievement[] = achievementsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || '', // Ensure type is provided
        target: data.target || 0, // Ensure target is provided
        unlocked: false, // Default value for unlocked
        ...data
      };
    });

    const updatedAchievements = loadedAchievements.map((achievement: Achievement) => {
      const currentValue = userData[achievement.type] || 0;
      const targetValue = achievement.target || 0;
      const progress = targetValue > 0 ? Math.min(Math.floor((currentValue / targetValue) * 100), 100) : 0;
      const isUnlocked = userData.achievementsUnlocked?.includes(achievement.id) || false;

      return {
        id: achievement.id,
        title: achievement.title || 'Untitled Achievement', // Default title if missing
        description: achievement.description || 'No description available', // Default description if missing
        progress,
        current: currentValue,
        target: targetValue,
        unlocked: isUnlocked,
        icon: getAchievementIcon(achievement.id), // Helper function to get the right icon
        type: achievement.type,
      };
    });

    // Sort achievements: unlocked first, then by progress
    updatedAchievements.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return b.progress - a.progress;
    });

    setAchievements(updatedAchievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    setAchievements(defaultAchievements);
  }
};

// Helper function to get achievement icon
const getAchievementIcon = (achievementId: string) => {
  switch(achievementId) {
    case 'eco-warrior': return Recycle;
    case 'community-leader': return Award;
    case 'plastic-hero': return Gift;
    case 'waste-reducer': return Trash2;
    case 'green-ambassador': return Share2;
    default: return Stars;
  }
};          

const handleImagePicker = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'EcoBuddy needs access to your photos to update your avatar');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],  // Square aspect for avatars
    quality: 0.8,
  });

  if (!result.canceled && auth.currentUser) {
    try {
      setLoading(true);

 // Validate the image exists and has a valid URI
 if (!result.assets || !result.assets[0] || !result.assets[0].uri) {
  throw new Error("Selected image is invalid or missing URI");
}

const imageUri = result.assets[0].uri;
console.log("Selected image URI:", imageUri);

// Check file size (optional - large files might cause upload issues)
const fileInfo = await fetch(imageUri).then(response => ({
  size: parseInt(response.headers.get('Content-Length') || '0'),
  type: response.headers.get('Content-Type')
})).catch(err => {
  console.log("Error checking file info:", err);
  return { size: 0, type: null };
});

console.log("File size:", fileInfo.size, "bytes, type:", fileInfo.type);

if (fileInfo.size > 5000000) { // 5MB limit example
  Alert.alert('File too large', 'Please select an image smaller than 5MB');
  setLoading(false);
  return;
}

      // Upload image to Supabase with detailed error handling
      console.log("Starting upload to Supabase for user:", auth.currentUser.uid);
      const publicUrl = await uploadAvatar(auth.currentUser.uid, imageUri)
        .catch(error => {
          console.error("Supabase upload error details:", error);
          Alert.alert(
            'Upload Error', 
            `Failed to upload image: ${error.message || 'Unknown error'}`
          );
          throw error; // Re-throw to stop the process
        });
      
      console.log("Image uploaded successfully, public URL:", publicUrl);
      
       // Update Firebase auth profile
       await updateProfile(auth.currentUser, { photoURL: publicUrl })
       .catch(error => {
         console.error("Firebase profile update error:", error);
         Alert.alert(
           'Profile Update Error',
           `Failed to update profile: ${error.message || 'Unknown error'}`
         );
         throw error;
       });
     
     console.log("Auth profile updated successfully");
      
      // Update Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: publicUrl,
        avatarLastUpdated: new Date().toISOString()
      }).catch(error => {
        console.error("Firestore update error:", error);
        Alert.alert(
          'Database Update Error',
          `Failed to update user data: ${error.message || 'Unknown error'}`
        );
        throw error;
      });
      
      console.log("Firestore updated successfully");

      setAvatar(publicUrl);
      Alert.alert('Success', 'Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Avatar Update Failed', 
        `Error: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`
      );
    } finally {
      setLoading(false);
    }
  }
};

const renderAvatar = () => {
  if (loading) {
    return (
      <View style={[styles.avatar, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary.green} />
      </View>
    );
  }
}

{loading && (
  <View style={[styles.avatar, styles.loadingOverlay]}>
    <ActivityIndicator color={Colors.primary.green} />
  </View>
)}

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
              router.replace('/(auth)/register'); // Redirect to register page after deletion
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
          text: 'Apple Store',
          onPress: () => {
  //Opens app store for review . update the URL to actual app store URL once deployed
            Linking.openURL('https://play.google.com/store/apps/details?id=com.ecobuddy.app');
          }
        },
        {
          text: 'Google Play Store',
          onPress: () => {
  //Opens play store for review. update the URL to actual play store URL once deployed
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
        <Image 
      source={{ 
        uri: avatar || 
        'https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars/default-avatar.png' 
      }} 
      style={styles.avatar}
      onError={(e) => {
        console.error("Image loading error:", e.nativeEvent.error);
        setAvatar('https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars/default-avatar.png');
      }}
    />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.role}>{userData.role}</Text>

            <View style={styles.badgeContainer}>
            <Award size={16} color={Colors.secondary.yellow} />
            <Text style={styles.badge}>{getLevelTitle(userData.level)}</Text>
             {userData.badges?.length > 0 && (
            <View style={styles.badgesList}>
             {userData.badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
            <Text style={styles.badgeText}>{badge}</Text>
           </View>
          ))}
        </View>
        )}
      </View>

            <View style={styles.xpContainer}>
              <Text style={styles.xpText}>XP: {userData.xp}/{userData.nextLevelXp}</Text>
              <View style={styles.xpBar}>
                <View 
                  style={[
                    styles.xpProgress, 
                    { 
                      width: `${(userData.xp % 100)}%`,
                      backgroundColor: Colors.primary.green 
                    }
                  ]} 
                />
              </View>
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
          <View key={achievement.id} style={[
           styles.achievementCard,
           achievement.unlocked && styles.unlockedAchievement
        ]}>
    <View style={[
      styles.achievementIcon,
      { 
        backgroundColor: achievement.unlocked 
          ? Colors.secondary.yellow + '20' 
          : Colors.primary.green + '20'
        },
        ]}>
         <achievement.icon size={24} color={achievement.unlocked ? Colors.secondary.yellow : Colors.primary.green} />
         {achievement.unlocked && (
        <View style={styles.achievementBadge}>
          <Award size={12} color={Colors.text.secondary} />
        </View>
           )}
         </View>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDesc}>{achievement.description}</Text>
          {!achievement.unlocked && (
         <>
           <Text style={styles.achievementProgress}>{achievement.current}/{achievement.target}</Text>
            <View style={styles.progressBar}>
              <View
             style={[styles.progress, { width: `${achievement.progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{achievement.progress}%</Text>
           </>
          )}
           {achievement.unlocked && (
              <View style={styles.unlockedContainer}>
              <Text style={styles.unlockedText}>Unlocked!</Text>
              </View>
             )}
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
  achievementProgress: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
    marginBottom: 4,
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
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  badgeItem: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent.lightGray,
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
    paddingEnd: 55,
  
  },
  achievementCard: {
    width: 200,
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 16,
    paddingEnd: 24,
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
  loadingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
  xpContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  xpText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  xpBar: {
    height: 8,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpProgress: {
    width: '100%',
    height: 10,
    backgroundColor: 'blue',
  },
  unlockedAchievement: {
    borderWidth: 2,
    borderColor: Colors.secondary.yellow,
  },
  achievementBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.secondary.yellow,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedContainer: {
    marginTop: 8,
    padding: 4,
    backgroundColor: Colors.secondary.yellow + '20',
    borderRadius: 4,
  },
  unlockedText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.yellow,
    textAlign: 'center',
  },
});