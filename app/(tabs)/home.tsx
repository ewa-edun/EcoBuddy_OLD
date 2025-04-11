import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Gift, TrendingUp, Award, Camera, Recycle, HelpCircle, ChevronRight, Gamepad2, MessageSquare, Calendar } from 'lucide-react-native';
import { router, Link } from 'expo-router';
import { getAuth } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig'; 
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const auth = getAuth();
  const [userData, setUserData] = useState<{fullName?: string, points?: number} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleQuickAction = (action: 'scan' | 'redeem') => {
    switch (action) {
      case 'scan':
        router.push('/(tabs)/wasteSelector');
        break;
      case 'redeem':
        router.push('/(tabs)/ecoRewards');
        break;
    }
  };
  
  const handleFeaturePress = (feature: 'game' | 'chatbot') => {
    switch (feature) {
      case 'game':
        router.push('/features/game');
        break;
      case 'chatbot':
        router.push('/features/chatbot');
        break;
    }
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
        <View>
          <Text style={styles.greeting}>
            Hello, {userData?.fullName || 'Eco Warrior'}
          </Text>
          <Text style={styles.points}>
            {userData?.points || '0'} Eco Points
          </Text>
        </View>
        <Image
          source={require('../../assets/EcoBuddy_logo.jpeg')}
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
          {[1, 2].map((item) => (
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
        <Text style={styles.sectionTitle}>Additional Features</Text>
        <View style={styles.featureGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleFeaturePress('game')}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary.blue + '20' }]}>
              <Gamepad2 size={24} color={Colors.primary.blue} />
            </View>
            <Text style={styles.featureText}>Eco Game</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => handleFeaturePress('chatbot')}>
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary.green + '20' }]}>
              <MessageSquare size={24} color={Colors.primary.green} />
            </View>
            <Text style={styles.featureText}>AI Assistant</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('scan')}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary.green + '20' }]}>
              <Camera size={24} color={Colors.primary.green} />
            </View>
            <Text style={styles.actionText}>Scan Waste</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('redeem')}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary.blue + '20' }]}>
              <Gift size={24} color={Colors.primary.blue} />
            </View>
            <Text style={styles.actionText}>Redeem Points</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/features/help')}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary.green} />
          </TouchableOpacity>
        </View>
        <View style={styles.helpPreview}>
          <View style={styles.helpItem}>
            <HelpCircle size={24} color={Colors.primary.green} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>How do I use the Waste Selector?</Text>
              <Text style={styles.helpPreviewText} numberOfLines={2}>
                Simply take a photo of the item you want to dispose of, or select it from our catalog. The Waste Selector will tell you which bin it belongs in and provide recycling tips.
              </Text>
            </View>
          </View>
          <View style={styles.helpItem}>
            <HelpCircle size={24} color={Colors.primary.green} />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>How do I earn Eco Rewards points?</Text>
              <Text style={styles.helpPreviewText} numberOfLines={2}>
                You can earn points by correctly sorting waste, participating in community events, and completing educational modules.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Link href="/features/wasteHistory" asChild>
      <TouchableOpacity style={styles.claimButton}>
        <Calendar size={24} color={Colors.secondary.yellow} />
        <Text style={styles.claimButtonText}>View Waste History</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.secondary.white,
  },
  points: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginTop: 4,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 24,
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
    color: Colors.text.secondary,
  },
  activityMeta: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  helpPreview: {
    gap: 16,
  },
  helpItem: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  helpPreviewText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    lineHeight: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  featureCard: {
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    marginLeft: 8,
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
    backgroundColor: Colors.background.main
  },
});