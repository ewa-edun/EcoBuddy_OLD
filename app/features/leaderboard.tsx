import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Award, Recycle } from 'lucide-react-native';

// Mock data for leaderboards
const pointsLeaderboardData = [
  { id: '1', name: 'Adebayo James', points: 5240, avatar: require('../../assets/user icon.png') },
  { id: '2', name: 'Chioma Obi', points: 4830, avatar: require('../../assets/user icon.png') },
  { id: '3', name: 'Tunde Bakare', points: 4510, avatar: require('../../assets/user icon.png') },
  { id: '4', name: 'Amaka Zuma', points: 3950, avatar: require('../../assets/user icon.png') },
  { id: '5', name: 'Olufemi Johnson', points: 3720, avatar: require('../../assets/user icon.png') },
  { id: '6', name: 'Ngozi Adichie', points: 3450, avatar: require('../../assets/user icon.png') },
  { id: '7', name: 'David Adeleke', points: 3200, avatar: require('../../assets/user icon.png') },
  { id: '8', name: 'Sarah Ibrahim', points: 2980, avatar: require('../../assets/user icon.png') },
  { id: '9', name: 'Michael Ojo', points: 2760, avatar: require('../../assets/user icon.png') },
  { id: '10', name: 'Fatima Hassan', points: 2540, avatar: require('../../assets/user icon.png') },
];

const wasteLeaderboardData = [
  { id: '1', name: 'Chioma Obi', recycled: 78, avatar: require('../../assets/user icon.png') },
  { id: '2', name: 'Adebayo James', recycled: 65, avatar: require('../../assets/user icon.png') },
  { id: '3', name: 'Olufemi Johnson', recycled: 59, avatar: require('../../assets/user icon.png') },
  { id: '4', name: 'Tunde Bakare', recycled: 52, avatar: require('../../assets/user icon.png') },
  { id: '5', name: 'Ngozi Adichie', recycled: 48, avatar: require('../../assets/user icon.png') },
  { id: '6', name: 'Amaka Zuma', recycled: 45, avatar: require('../../assets/user icon.png') },
  { id: '7', name: 'Fatima Hassan', recycled: 42, avatar: require('../../assets/user icon.png') },
  { id: '8', name: 'David Adeleke', recycled: 38, avatar: require('../../assets/user icon.png') },
  { id: '9', name: 'Sarah Ibrahim', recycled: 36, avatar: require('../../assets/user icon.png') },
  { id: '10', name: 'Michael Ojo', recycled: 33, avatar: require('../../assets/user icon.png') },
];

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'waste'>('points');

  const renderPointsItem = ({ item, index }: { item: typeof pointsLeaderboardData[0], index: number }) => (
    <View style={styles.listItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.pointsContainer}>
          <Award size={14} color={Colors.secondary.yellow} />
          <Text style={styles.pointsText}>{item.points} points</Text>
        </View>
      </View>
    </View>
  );

  const renderWasteItem = ({ item, index }: { item: typeof wasteLeaderboardData[0], index: number }) => (
    <View style={styles.listItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
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
          data={pointsLeaderboardData}
          renderItem={renderPointsItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      ) : (
        <FlatList
          data={wasteLeaderboardData}
          renderItem={renderWasteItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.list}
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
});

export default LeaderboardScreen;
