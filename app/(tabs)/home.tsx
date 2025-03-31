import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Gift, TrendingUp, Award, Camera, Recycle } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, John!</Text>
          <Text style={styles.points}>2,450 Points</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Gift size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>1.2GB</Text>
          <Text style={styles.statLabel}>Data Earned</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>45kg</Text>
          <Text style={styles.statLabel}>Waste Recycled</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>Silver</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Recycle size={24} color={Colors.primary.green} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Plastic Bottles Recycled</Text>
                <Text style={styles.activityMeta}>+150 points • 2 hours ago</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary.green + '20' }]}>
              <Camera size={24} color={Colors.primary.green} />
            </View>
            <Text style={styles.actionText}>Scan Waste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary.blue + '20' }]}>
              <Gift size={24} color={Colors.primary.blue} />
            </View>
            <Text style={styles.actionText}>Redeem Points</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  points: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent.darkGray,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginTop: 4,
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
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  activityMeta: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
});