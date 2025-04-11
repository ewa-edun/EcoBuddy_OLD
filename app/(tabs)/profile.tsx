import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Gift, Share2 , Trash2, Key, ChevronRight, Recycle, TrendingUp, CircleHelp as HelpCircle, LogOut, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

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
];

export default function ProfileScreen() {
  const [avatar, setAvatar] = useState(Image.resolveAssetSource(require('../../assets/user icon.png')).uri);
  const [name, setName] = useState('Edun Ewaoluwa'); // Placeholder for name
  const [email, setEmail] = useState('ewaoluwa123@example.com'); // Placeholder for email
  const [phoneNumber, setPhoneNumber] = useState('+234 123 456 7890'); // Placeholder for phone number

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
      case 'changepassword':
        // Handle logout
        break;
        case 'logout':
        // Handle logout
        break;case 'deleteaccount':
        // Handle logout
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
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
                <Text style={styles.contactText}>{email}</Text>
                <Text style={styles.contactText}>{phoneNumber}</Text>
              </View>
          </View>
       </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>45kg</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
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

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleMenuPress('changepassword')}>
        <Key size={20} color={Colors.primary.blue} />
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleMenuPress('logout')}>
        <LogOut size={20} color={Colors.text.darker} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleMenuPress('deleteaccount')}>
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