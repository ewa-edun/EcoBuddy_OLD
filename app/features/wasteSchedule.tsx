import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { MapPin, Info, Scale } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

const wasteCategories = {
  '1': {
    name: 'Paper & Cardboard',
    points: 30,
    description: 'Recyclable paper products.',
    guidelines: [
      'Clean and dry',
      'No food residue',
      'Flatten boxes'
    ]
  },
  '2': {
    name: 'Plastic Bottles & Containers',
    points: 35,
    description: 'Recyclable plastic items.',
    guidelines: [
      'Rinse containers',
      'Remove caps',
      'No plastic bags'
    ]
  },
  '3': {
    name: 'Glass Bottles & Jars',
    points: 50,
    description: 'Glass bottles and containers.',
    guidelines: [
      'Rinse thoroughly',
      'Remove lids',
      'No broken glass'
    ]
  },
  '4': {
    name: 'Metal Cans & Scraps',
    points: 65,
    description: 'Metal cans and containers.',
    guidelines: [
      'Remove non-metal parts and labels',
      'Rinse clean',
      'Flatten if possible',
      "Sort by type", 
      "Handle safely"
    ]
  },
  '5': {
    name: 'Electronic Waste',
    points: 50,
    description: 'Electronic waste of sorts.',
    guidelines: [
      'Keep dry',
      'Tape battery terminals',
      'Separate by type'
    ]
  },
  '6': {
    name: 'Clothes & Textiles',
    points: 30,
    description: 'Used clothing and textile items.',
    guidelines: [
      'Clean and dry',
      'Bag items',
      'Separate by condition'
    ]
  },
  '7': {
    name: 'Tyres',
    points: 75,
    description: 'Rubber products and used tyres.',
    guidelines: [
      'Clean off debris',
      'Keep dry',
      'Stack neatly'
    ]
  },
  '8': {
    name: 'Organic Waste',
    points: 15,
    description: 'Food scraps and yard waste.',
    guidelines: [
      'No meat or dairy',
      'No oils',
      'Keep free of plastics'
    ]
  },
  '9': {
    name: 'Shoes',
    points: 45,
    description: 'Used footwear in recyclable condition.',
    guidelines: [
      'Clean off dirt/debris',
      'Keep pairs together',
      'Remove insoles if possible'
    ]
  },
  '10': {
    name: 'Non-Recyclable & Trash',
    points: 0,
    description: 'Items that cannot be recycled.',
    guidelines: [
      'Hazardous Waste',
      'Styrofoam',
      'Plastic wrap',
      'Dirty diapers'
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

 // Here you would make an API call to submit the waste, For now, we'll just navigate to the history page
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
    backgroundColor: Colors.primary.green,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
