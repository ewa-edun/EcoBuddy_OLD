import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { MapPin, Info, Scale } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

const wasteCategories = {
  '1': {
    name: 'Plastic Bottles',
    points: 50,
    description: 'Clean PET bottles without caps or labels',
    guidelines: [
      'Remove all caps and labels',
      'Rinse bottles thoroughly',
      'Flatten bottles to save space',
      'No food or liquid residue'
    ]
  },
  '2': {
    name: 'Glass Bottles',
    points: 75,
    description: 'Clear or colored glass bottles, no broken pieces',
    guidelines: [
      'Remove all caps and labels',
      'Rinse bottles thoroughly',
      'No broken glass pieces',
      'Separate by color if possible'
    ]
  },
  '3': {
    name: 'Aluminum Cans',
    points: 60,
    description: 'Clean aluminum beverage cans',
    guidelines: [
      'Rinse cans thoroughly',
      'Flatten cans to save space',
      'No food or liquid residue',
      'Remove any plastic or paper labels'
    ]
  },
  '4': {
    name: 'Paper & Cardboard',
    points: 40,
    description: 'Clean, dry paper and cardboard materials',
    guidelines: [
      'Flatten cardboard boxes',
      'Remove any plastic or metal parts',
      'Keep paper dry and clean',
      'No food-soiled paper products'
    ]
  }
};

const dropOffLocations = [
  {
    id: '1',
    name: 'Green Recycling Center',
    address: '123 Eco Street, Lagos',
    coordinates: { latitude: 6.5244, longitude: 3.3792 },
    hours: 'Mon-Sat: 8am-6pm'
  },
  {
    id: '2',
    name: 'Eco-Friendly Hub',
    address: '456 Green Avenue, Lagos',
    coordinates: { latitude: 6.5244, longitude: 3.3792 },
    hours: 'Mon-Fri: 9am-5pm'
  },
  {
    id: '3',
    name: 'Sustainable Solutions',
    address: '789 Earth Road, Lagos',
    coordinates: { latitude: 6.5244, longitude: 3.3792 },
    hours: 'Mon-Sun: 7am-7pm'
  }
];

export default function WasteScheduleScreen() {
  const { wasteType } = useLocalSearchParams();
  const [weight, setWeight] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(dropOffLocations[0]);

  const wasteInfo = wasteCategories[wasteType as keyof typeof wasteCategories];

  const handleSubmit = () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kilograms');
      return;
    }

    // Here you would typically make an API call to submit the waste, For now, we'll just navigate to the history page
    router.push('/features/wasteHistory');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule Waste Pickup</Text>
        <Text style={styles.subtitle}>{wasteInfo.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Info size={20} color={Colors.primary.blue} />
          <Text style={styles.infoTitle}>Recycling Guidelines</Text>
        </View>
        <Text style={styles.infoText}>{wasteInfo.description}</Text>
        <View style={styles.guidelines}>
          {wasteInfo.guidelines.map((guideline, index) => (
            <Text key={index} style={styles.guidelineText}>• {guideline}</Text>
          ))}
        </View>
      </View>

      <View style={styles.weightCard}>
        <View style={styles.weightHeader}>
          <Scale size={20} color={Colors.secondary.yellow} />
          <Text style={styles.weightTitle}>Waste Weight</Text>
        </View>
        <TextInput
          style={styles.weightInput}
          placeholder="Enter weight in kg"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={styles.pointsText}>You'll earn {wasteInfo.points} points per kg</Text>
      </View>

      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <MapPin size={20} color={Colors.primary.red} />
          <Text style={styles.mapTitle}>Drop-off Locations</Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 6.5244,
            longitude: 3.3792,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {dropOffLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={location.coordinates}
              title={location.name}
              description={location.address}
            />
          ))}
        </MapView>
        <View style={styles.locationList}>
          {dropOffLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationItem,
                selectedLocation.id === location.id && styles.selectedLocation
              ]}
              onPress={() => setSelectedLocation(location)}
            >
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
              <Text style={styles.locationHours}>{location.hours}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Waste</Text>
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
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
  },
  infoCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.modal,
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
    color: Colors.text.primary,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  guidelines: {
    gap: 8,
  },
  guidelineText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  weightCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  weightTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
  },
  weightInput: {
    backgroundColor: Colors.primary.beige,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  pointsText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.accent,
  },
  mapCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationList: {
    gap: 12,
  },
  locationItem: {
    backgroundColor: Colors.background.card,
    padding: 12,
    borderRadius: 8,
  },
  selectedLocation: {
    borderColor: Colors.primary.teal,
    borderWidth: 2,
  },
  locationName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  locationHours: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.accent,
  },
  submitButton: {
    backgroundColor: Colors.primary.beige,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.text.darker,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
