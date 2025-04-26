import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Recycle } from 'lucide-react-native';
import { collection, query, orderBy, limit, getDocs, onSnapshot, where } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import { supabase } from '@lib/supabase/client';

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'waste'>('points');
  interface Leader {
    id: string;
    fullName?: string;
    points?: number;
    recycled?: number;
    avatarUrl?: string;
  }

  const [pointsLeaders, setPointsLeaders] = useState<Leader[]>([]);
  const [wasteLeaders, setWasteLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  // Define fetchLeaders outside of useEffect
  const fetchLeaders = async () => {
    try {
      // 1. Points Leaderboard Query
      const pointsQuery = query(
        collection(db, 'users'),
        orderBy('points', 'desc'),
        limit(10),
        where('points', '>', 0) // Only active participants
      );
      const pointsSnapshot = await getDocs(pointsQuery);
      const pointsData = pointsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 2. Waste Leaderboard Query
      const wasteQuery = query(
        collection(db, 'users'),
        orderBy('recycled', 'desc'),
        limit(10),
        where('recycled', '>', 0) // Only users with recycling activity
      );
      const wasteSnapshot = await getDocs(wasteQuery);
      const wasteData = wasteSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPointsLeaders(pointsData);
      setWasteLeaders(wasteData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      Alert.alert("Error", "Could not load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  // First useEffect for initial data fetch
  useEffect(() => {
    fetchLeaders();
  }, []);

  // Second useEffect for real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), () => {
      fetchLeaders();
    });
    return () => unsubscribe();
  }, []);

  const renderPointsItem = ({ item, index }: { item: Leader; index: number }) => (
    <View style={styles.listItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <Image 
        source={item.avatarUrl ? 
          { uri: item.avatarUrl } : 
          require('../../assets/user icon.png')
        } 
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <View style={styles.pointsContainer}>
          <Award size={14} color={Colors.secondary.yellow} />
          <Text style={styles.pointsText}>{item.points} points</Text>
        </View>
      </View>
    </View>
  );

  const renderWasteItem = ({ item, index }: { item: Leader; index: number }) => (
    <View style={styles.listItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <Image 
        source={item.avatarUrl ? 
          { uri: item.avatarUrl } : 
          require('../../assets/user icon.png')
        } 
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <View style={styles.pointsContainer}>
          <Recycle size={14} color={Colors.primary.green} />
          <Text style={styles.wasteText}>{item.recycled} kg recycled</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'points' && styles.activeTab]}
          onPress={() => setActiveTab('points')}
        >
          <Text style={[styles.tabText, activeTab === 'points' && styles.activeTabText]}>Game Points</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'waste' && styles.activeTab]}
          onPress={() => setActiveTab('waste')}
        >
          <Text style={[styles.tabText, activeTab === 'waste' && styles.activeTabText]}>Waste Recycled</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'points' ? (
      <FlatList
        data={pointsLeaders}
        renderItem={renderPointsItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noDataText}>No data available</Text>}
      />
    ) : (
      <FlatList
        data={wasteLeaders}
        renderItem={renderWasteItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noDataText}>No data available</Text>}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 20,
    marginTop: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.modal,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary.green,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: Colors.text.darker,
  },
  activeTabText: {
    color: Colors.secondary.white,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.background.modal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rank: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: Colors.text.darker,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: Colors.secondary.yellow,
    marginLeft: 4,
  },
  wasteText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: Colors.primary.green,
    marginLeft: 4,
  },
  noDataText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 24,
    color: Colors.secondary.white,
    marginLeft: 4,
  },
});

export default LeaderboardScreen;