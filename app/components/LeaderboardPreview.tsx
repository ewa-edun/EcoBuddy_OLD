import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Recycle, Trophy, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

// Mock data for top 3 leaders
const topPointsLeaders = [
  { id: '1', name: 'Adebayo J.', points: 5240, avatar: require('../../assets/user icon.png') },
  { id: '2', name: 'Chioma O.', points: 4830, avatar: require('../../assets/user icon.png') },
  { id: '3', name: 'Tunde B.', points: 4510, avatar: require('../../assets/user icon.png') },
];

const topWasteLeaders = [
  { id: '1', name: 'Chioma O.', recycled: 78, avatar: require('../../assets/user icon.png') },
  { id: '2', name: 'Adebayo J.', recycled: 65, avatar: require('../../assets/user icon.png') },
  { id: '3', name: 'Olufemi J.', recycled: 59, avatar: require('../../assets/user icon.png') },
];

const LeaderboardPreview = () => {
  const [activeTab, setActiveTab] = useState('points');
  const currentData = activeTab === 'points' ? topPointsLeaders : topWasteLeaders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Trophy size={20} color={Colors.secondary.yellow} />
          <Text style={styles.title}>Top Performers</Text>
        </View>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => router.push('/features/leaderboard')}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={Colors.primary.green} />
        </TouchableOpacity>
      </View>

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

      {currentData.map((item, index) => (
        <View key={item.id} style={styles.leaderItem}>
          <View style={[styles.rankBadge, index === 0 ? styles.firstPlace : (index === 1 ? styles.secondPlace : styles.thirdPlace)]}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <Image source={item.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={styles.statsContainer}>
              {activeTab === 'points' ? (
                <>
                  <Award size={14} color={Colors.secondary.yellow} />
                  <Text style={styles.pointsText}>{(item as { points: number }).points} points</Text>
                </>
              ) : (
                <>
                  <Recycle size={14} color={Colors.primary.green} />
                  <Text style={styles.wasteText}>{(item as { recycled: number }).recycled} kg recycled</Text>
                </>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginLeft: 6,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.background.modal,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary.green,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: Colors.text.darker,
  },
  activeTabText: {
    color: Colors.secondary.white,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.modal,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  firstPlace: {
    backgroundColor: Colors.secondary.yellow,
  },
  secondPlace: {
    backgroundColor: '#C0C0C0', // Silver
  },
  thirdPlace: {
    backgroundColor: '#CD7F32', // Bronze
  },
  rankText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: Colors.secondary.white,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: Colors.accent.darkGray,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pointsText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: Colors.secondary.yellow,
    marginLeft: 4,
  },
  wasteText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: Colors.primary.green,
    marginLeft: 4,
  },
});

export default LeaderboardPreview; 