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
    image: 'data:image/jpeg;base64,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',
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