import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

const transactions = [
  { id: '1', type: 'Plastic Bottles', status: 'successful', date: '2023-10-01', points: 150 },
  { id: '2', type: 'Glass Bottles', status: 'pending', date: '2023-10-02', points: 75 },
  { id: '3', type: 'Aluminum Cans', status: 'unsuccessful', date: '2023-10-03', points: 60, reason: 'Not properly cleaned' },
];

export default function WasteHistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waste History</Text>
      </View>

      <View style={styles.transactionList}>
        {['successful', 'pending', 'unsuccessful'].map((status) => (
          <View key={status}>
            <Text style={styles.statusTitle}>{status.charAt(0).toUpperCase() + status.slice(1)} Transactions</Text>
            {transactions.filter(tx => tx.status === status).map(tx => (
              <View key={tx.id} style={styles.transactionItem}>
                <Text style={styles.transactionText}>{tx.type} - {tx.date} - {tx.points} points</Text>
                {status === 'unsuccessful' && <Text style={styles.reasonText}>Reason: {tx.reason}</Text>}
              </View>
            ))}
          </View>
        ))}
      </View>

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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text.primary,
  },
  transactionList: {
    padding: 24,
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
    backgroundColor: Colors.primary.teal,
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
});
