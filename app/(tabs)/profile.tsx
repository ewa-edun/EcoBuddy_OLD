import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Gift, Settings, ChevronRight, Recycle, TrendingUp, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

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
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    color: Colors.accent.darkGray,
  },
];

export default function ProfileScreen() {
  const handleMenuPress = (route: string) => {
    switch (route) {
      case 'rewards':
        router.push('/(tabs)/ecoRewards');
        break;
      case 'progress':
        router.push('/(tabs)/wasteSelector');
        break;
      case 'help':
        router.push('/features/help');
        break;
      case 'settings':
        // Handle settings navigation
        break;
      case 'logout':
        // Handle logout
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/user icon.png')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <View style={styles.badgeContainer}>
              <Award size={16} color={Colors.secondary.yellow} />
              <Text style={styles.badge}>Gold Member</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
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

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleMenuPress('logout')}>
        <LogOut size={20} color={Colors.text.darker} />
        <Text style={styles.logoutText}>Log Out</Text>
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
    marginBottom: 24,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.text.darker + '20',
  },
  editButtonText: {
    fontSize: 14,
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
    color: Colors.accent.darkGray,
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
  logoutText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
});