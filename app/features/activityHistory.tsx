import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { getAuth } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import { Recycle, Gift } from 'lucide-react-native';
import { Stack } from 'expo-router';

// Define combined activity type
type CombinedActivity = {
  id: string;
  type: 'activity' | 'claim';
  points: number;
  date: Date;
  description: string;
  status?: string;
};

export default function ActivityHistoryScreen() {
  const [activities, setActivities] = useState<CombinedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchAllActivity = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);
        
        // Fetch recycling activities
        const activitiesQuery = query(
          collection(db, "activities"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("date", "desc")
        );
        
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const activitiesData = activitiesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'activity' as const,
            points: data.points,
            date: data.date.toDate(),
            description: data.description
          };
        });

        // Fetch claim requests
        const claimsQuery = query(
          collection(db, "claimRequests"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        
        const claimsSnapshot = await getDocs(claimsQuery);
        const claimsData = claimsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'claim' as const,
            points: data.points,
            date: data.createdAt ? data.createdAt.toDate() : new Date(),
            description: `${data.giftType === 'data' ? 'Data' : 'Cash'} reward claim`,
            status: data.status
          };
        });

        // Combine and sort all activities
        const allActivities = [...activitiesData, ...claimsData].sort(
          (a, b) => b.date.getTime() - a.date.getTime()
        );
        
        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activity history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivity();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderActivityItem = ({ item }: { item: CombinedActivity }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, 
        { backgroundColor: item.type === 'claim' ? 
          Colors.primary.blue + '20' : 
          Colors.primary.green + '20' 
        }]}>
        {item.type === 'claim' ? (
          <Gift size={24} color={Colors.primary.blue} />
        ) : (
          <Recycle size={24} color={Colors.primary.green} />
        )}
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {item.description}
          {item.status ? ` (${item.status})` : ''}
        </Text>
        <Text style={styles.activityPoints}>
          {item.type === 'claim' ? '-' : '+'}{item.points} points
        </Text>
        <Text style={styles.activityDate}>
          {formatDate(item.date)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Activity History" }} />
      
      <Text style={styles.headerTitle}>Your Activity History</Text>
      <Text style={styles.subtitle}>View all your recycling activities and reward claims</Text>
      
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No activity history found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  activityPoints: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
});