import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Camera, Info } from 'lucide-react-native';
import { useState } from 'react';

type WasteCategory = {
  id: string;
  name: string;
  points: number;
  image: string;
  description: string;
};

const wasteCategories: WasteCategory[] = [
  {
    id: '1',
    name: 'Plastic Bottles',
    points: 50,
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800',
    description: 'Clean PET bottles without caps or labels',
  },
  {
    id: '2',
    name: 'Glass Bottles',
    points: 75,
    image: 'https://images.unsplash.com/photo-1550411294-56f7d0c7fbe6?w=800',
    description: 'Clear or colored glass bottles, no broken pieces',
  },
  {
    id: '3',
    name: 'Aluminum Cans',
    points: 60,
    image: 'https://images.unsplash.com/photo-1576398289164-c48dc021b4e1?w=800',
    description: 'Clean aluminum beverage cans',
  },
  {
    id: '4',
    name: 'Paper & Cardboard',
    points: 40,
    image: 'https://images.unsplash.com/photo-1605600658977-4e8080ea7d7e?w=800',
    description: 'Clean, dry paper and cardboard materials',
  },
];

export default function WasteSelectorScreen() {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waste Selector</Text>
        <Text style={styles.subtitle}>Select waste type or scan with camera</Text>
      </View>

      <TouchableOpacity style={styles.scanButton}>
        <Camera size={24} color={Colors.secondary.white} />
        <Text style={styles.scanButtonText}>Scan Waste</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or select manually</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.categoriesGrid}>
        {wasteCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory?.id === category.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <View style={styles.categoryContent}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryPoints}>+{category.points} points</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={Colors.primary.blue} />
            <Text style={styles.infoTitle}>Recycling Guidelines</Text>
          </View>
          <Text style={styles.infoText}>{selectedCategory.description}</Text>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
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
    color: Colors.accent.darkGray,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.green,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    marginTop: 0,
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.accent.lightGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.accent.darkGray,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  categoriesGrid: {
    padding: 16,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: Colors.secondary.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary.green,
    borderWidth: 2,
  },
  categoryImage: {
    width: '100%',
    height: 160,
  },
  categoryContent: {
    padding: 16,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
  },
  categoryPoints: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
    marginTop: 4,
  },
  infoCard: {
    margin: 24,
    padding: 16,
    backgroundColor: Colors.primary.blue + '10',
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.blue,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});