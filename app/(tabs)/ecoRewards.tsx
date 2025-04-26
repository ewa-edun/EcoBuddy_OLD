import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Link, router } from 'expo-router';
import { Gift, TrendingUp, Award, Coins } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '@lib/firebase/firebaseConfig';

// Define reward type
type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'data' | 'cash';
  dataAmount?: number; // in MB
  cashAmount?: number; // in Naira
  isActive: boolean;
};
  
export default function EcoRewardsScreen() {
  const [userPoints, setUserPoints] = useState(0);
  const [dataEarned, setDataEarned] = useState(0); // in MB
  const [userTier, setUserTier] = useState('Bronze');
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // 1. Fetch user stats (points, data earned, tier)
    const userRef = doc(db, 'users', userId);
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserPoints(userData.points || 0);
        setDataEarned(userData.rewards || 0);
        setUserTier(userData.tier || 'Bronze');
      }
    });

    // 2. Fetch available rewards (active rewards that user can afford)
    const rewardsQuery = query(
      collection(db, 'rewards'),
      where('isActive', '==', true)
    );
    
    const unsubscribeRewards = onSnapshot(rewardsQuery, (snapshot) => {
      const rewards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reward[];
      setAvailableRewards(rewards);
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribeRewards();
    };
  }, []);

  // Format numbers for display
  const formatPoints = (points: number) => points.toLocaleString();
  const formatData = (mb: number) => {
    if (mb >= 1000) return `${(mb / 1000).toFixed(1)}GB`;
    return `${mb}MB`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.green} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eco Rewards</Text>
        <Text style={styles.subtitle}>Your recycling rewards and benefits</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Gift size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>{formatPoints(userPoints)}</Text>
          <Text style={styles.statLabel}>Available Points</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>{formatData(dataEarned)}</Text>
          <Text style={styles.statLabel}>Data Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>{userTier}</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>
      </View>

         {/* Available Rewards Section */}
         <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <View style={styles.rewardsList}>
          {availableRewards.length > 0 ? (
            availableRewards
              .filter(reward => reward.points <= userPoints) // Only show rewards user can afford
              .map((reward) => (
                <TouchableOpacity 
                  key={reward.id} 
                  style={styles.rewardCard}
                  onPress={() => router.push(`/features/claimRewards?rewardId=${reward.id}`)}
                >
                  <View style={styles.rewardIcon}>
                    <Gift size={24} color={Colors.primary.green} />
                  </View>
                  <View style={styles.rewardContent}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    {reward.type === 'data' && (
                      <Text style={styles.rewardDescription}>
                        {reward.dataAmount}MB Mobile Data
                      </Text>
                    )}
                    {reward.type === 'cash' && (
                      <Text style={styles.rewardDescription}>
                        ₦{reward.cashAmount?.toLocaleString()}
                      </Text>
                    )}
                    <Text style={styles.rewardPoints}>
                      {reward.points.toLocaleString()} points
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          ) : (
            <Text style={styles.noRewardsText}>No available rewards at the moment</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  noRewardsText: {
    textAlign: 'center',
    color: Colors.text.darker,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: 20,
  },
}); 