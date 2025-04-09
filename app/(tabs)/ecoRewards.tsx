import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Link } from 'expo-router';

import { Gift, TrendingUp, Award, Coins } from 'lucide-react-native';

export default function EcoRewardsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eco Rewards</Text>
        <Text style={styles.subtitle}>Your recycling rewards and benefits</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Gift size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>2,450</Text>
          <Text style={styles.statLabel}>Available Points</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>1.2GB</Text>
          <Text style={styles.statLabel}>Data Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>Silver</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <View style={styles.rewardsList}>
          {[1, 2].map((item) => (
            <TouchableOpacity key={item} style={styles.rewardCard}>
              <View style={styles.rewardIcon}>
                <Gift size={24} color={Colors.primary.green} />
              </View>
              <View style={styles.rewardContent}>
                <Text style={styles.rewardTitle}>500MB Mobile Data</Text>
                <Text style={styles.rewardPoints}>500 points</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Link href="/features/claimRewards" asChild>
      <TouchableOpacity style={styles.claimButton}>
        <Coins size={24} color={Colors.secondary.yellow} />
        <Text style={styles.claimButtonText}>Claim Rewards</Text>
      </TouchableOpacity>
      </Link>
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
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primary.cream,
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
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  rewardsList: {
    gap: 16,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  rewardPoints: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.primary.green,
    marginTop: 4,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.modal,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  claimButtonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
}); 