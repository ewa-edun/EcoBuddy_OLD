import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

interface WasteTransaction {
  id: string;
  wasteType: string;
  status: 'successful' | 'pending' | 'unsuccessful';
  date: string;
  points: number;
  reason?: string;
  weight: number;
  location: string;
}

export default function WasteHistoryScreen() {
  const [transactions, setTransactions] = useState<WasteTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'wasteHistory'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const txns: WasteTransaction[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        txns.push({
          id: doc.id,
          wasteType: data.wasteType,
          status: data.status,
          date: new Date(data.date).toLocaleDateString(),
          points: data.points,
          reason: data.reason,
          weight: data.weight,
          location: data.location,
        });
      });
      setTransactions(txns);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your waste history</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waste History</Text>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar size={48} color={Colors.text.secondary} />
          <Text style={styles.emptyText}>No waste transactions yet</Text>
          <Text style={styles.emptySubtext}>Your recycling history will appear here</Text>
        </View>
      ) : (
        <View style={styles.transactionList}>
          {['successful', 'pending', 'unsuccessful'].map((status) => {
            const filteredTxns = transactions.filter(tx => tx.status === status);
            if (filteredTxns.length === 0) return null;
            
            return (
              <View key={status}>
                <Text style={styles.statusTitle}>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Transactions
                </Text>
                {filteredTxns.map(tx => (
                  <View key={tx.id} style={styles.transactionItem}>
                    <Text style={styles.transactionText}>
                      {tx.wasteType} - {tx.weight}kg
                    </Text>
                    <Text style={styles.transactionText}>
                      {tx.date} - {tx.points} points
                    </Text>
                    <Text style={styles.transactionText}>
                      Location: {tx.location}
                    </Text>
                    {status === 'unsuccessful' && tx.reason && (
                      <Text style={styles.reasonText}>Reason: {tx.reason}</Text>
                    )}
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}

   <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/home')}>
      <Text style={styles.backButtonText}>Back to Home</Text>
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
    paddingTop: 25,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
  },
  transactionList: {
    padding: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  transactionItem: {
    backgroundColor: Colors.background.modal,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.accent,
  },
  backButton: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 24,
  },
  backButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginTop: 8,
  },
});
