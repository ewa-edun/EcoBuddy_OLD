import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { MapPin, Info, Scale, CameraIcon, Calendar } from 'lucide-react-native';
import { Camera, CameraView } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { db } from '@lib/firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, increment, updateDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@lib/supabase/client'; // Make sure you have this import set up
import { decode } from 'base64-arraybuffer';

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
    hours: 'Mon-Sat: 8am-6pm',
    wasteTypes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    distance: '0.3'
  },
  {
    id: '2',
    name: 'Eco-Friendly Hub',
    address: '456 Green Avenue, Lagos',
    coordinates: { latitude: 6.5344, longitude: 3.3692 },
    hours: 'Mon-Fri: 9am-5pm',
    wasteTypes: ['1', '2', '3', '8'],
    distance: '1.5'
  },
  {
    id: '3',
    name: 'Sustainable Solutions',
    address: '789 Earth Road, Lagos',
    coordinates: { latitude: 6.5144, longitude: 3.3892 },
    hours: 'Mon-Sun: 7am-7pm',
    wasteTypes: ['4', '5', '6', '7'],
    distance: '2.3'
  },
  {
    id: '4',
    name: 'LAWMA Recycling Center',
    address: '10 Government Way, Lagos',
    coordinates: { latitude: 6.5044, longitude: 3.3592 },
    hours: 'Mon-Fri: 8am-4pm',
    wasteTypes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    distance: '3.1'
  },
  {
    id: '5',
    name: 'WeCycle Processing Plant',
    address: '55 Industry Lane, Lagos',
    coordinates: { latitude: 6.5444, longitude: 3.3992 },
    hours: '24/7',
    wasteTypes: ['2', '3', '4', '5'],
    distance: '4.0'
  }
];

export default function WasteScheduleScreen() {
  const { wasteType } = useLocalSearchParams();
  const [weight, setWeight] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(dropOffLocations[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [image, setImage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const wasteInfo = wasteCategories[wasteType as keyof typeof wasteCategories];

  // Request camera permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setImage(photo.uri);
        } else {
          Alert.alert('Error', 'Failed to capture photo. Please try again.');
        }
        setShowCamera(false);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your media library');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (uri: string | URL | Request) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            if (reader.result) {
              if (typeof reader.result === 'string') {

                const base64 = (reader.result as string).split(',')[1]!;
                if (!base64) {
                  throw new Error('Failed to extract base64 data from the file');
                }
              } else {
                throw new Error('Failed to read file: result is not a string');
              }
            if (!user) {
              throw new Error('User is not logged in');
            }
            const fileName = `waste_${user.uid}_${new Date().getTime()}.jpg`;
             // Read the image file as base64
                  const base64 = await FileSystem.readAsStringAsync(String(uri), {
                    encoding: FileSystem.EncodingType.Base64,
                  });
                  
            // Convert base64 to array buffer
            const arrayBuffer = decode(base64);

            const { data, error } = await supabase.storage
              .from('waste-image')
              .upload(fileName, arrayBuffer, {
                contentType: 'image/jpeg',
                upsert: false
              });
            
            if (error) throw error;
            
            // Get the public URL for the uploaded image
            const publicUrlResponse = supabase.storage
              .from('waste-image')
              .getPublicUrl(fileName);

            if (!publicUrlResponse.data) {
              throw new Error('Failed to retrieve public URL');
            }

            resolve(publicUrlResponse.data.publicUrl);
            } else {
              reject(new Error('Failed to read file: result is null'));
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            reject(error);
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kilograms');
      return;
    }

    if (!image) {
      Alert.alert('Missing Image', 'Please upload a photo of your waste for verification');
      return;
    }

    if (!user) {
      Alert.alert('Not logged in', 'Please log in to submit waste');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image and get public URL
      const imageUrl = await uploadImage(image);
      
      // Calculate points
      const pointsEarned = wasteInfo.points * Number(weight);
      
      // Add to waste history
      const wasteRef = await addDoc(collection(db, 'wasteHistory'), {
        userId: user.uid,
        wasteType: wasteInfo.name,
        weight: Number(weight),
        points: pointsEarned,
        location: selectedLocation.name,
        status: 'pending',
        date: new Date().toISOString(),
        preferredPickupDate: date.toISOString(),
        wasteImageUrl: imageUrl
      });

      // Update user's total points
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        points: increment(pointsEarned),
        lastRecycled: new Date().toISOString(),
      });

      Alert.alert('Success', 'Your waste submission has been recorded!');
      router.push('/features/wasteHistory');
    } catch (error) {
      console.error('Error submitting waste:', error);
      Alert.alert('Error', 'There was a problem submitting your waste. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* New Photo Upload Section */}
      <View style={styles.photoCard}>
        <View style={styles.photoHeader}>
          <CameraIcon size={20} color={Colors.primary.purple} />
          <Text style={styles.photoTitle}>Upload Waste Photo</Text>
        </View>
        <Text style={styles.photoSubtext}>
          Upload a photo of your waste to help us verify it's recyclable
        </Text>
        
        {showCamera ? (
          <View style={styles.cameraContainer}>
            <CameraView
                      ref={cameraRef}
                      style={styles.camera}
                      facing={facing}
                    >
              <View style={styles.cameraButtonsContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View/>
                   <Text style={styles.captureButtonText}>Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : (
          <View style={styles.photoActions}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={() => setShowCamera(true)}
                >
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickImage}
                >
                  <Text style={styles.photoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      {/* New Preferred Pickup Date Section */}
      <View style={styles.dateCard}>
        <View style={styles.dateHeader}>
          <Calendar size={20} color={Colors.primary.orange} />
          <Text style={styles.dateTitle}>Preferred Pickup Date</Text>
        </View>
        <Text style={styles.dateSubtext}>
          Note: This is your preferred date. Final pickup will be confirmed after verification.
        </Text>
        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
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

              <View style={styles.wasteTypesContainer}>
              <Text style={styles.wasteTypesLabel}>Accepts:</Text>
              <View style={styles.wasteTypesList}>
              {location.wasteTypes.map((type) => (
              <View key={type} style={styles.wasteTypeTag}>
              <Text style={styles.wasteTypeText}>
              {wasteCategories[type as keyof typeof wasteCategories]?.name.split(' ')[0]}
             </Text>
           </View>
         ))}
       </View>
     </View>
  
        {/* Distance indicator */}
             <View style={styles.distanceContainer}>
               <MapPin size={14} color={Colors.primary.red} />
               <Text style={styles.distanceText}>
               {location.distance} km away
              </Text>
             </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Waste'}
        </Text>
      </TouchableOpacity>

      {/* New Disclaimer Section */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Note: Your request will be reviewed by our team. Points will be awarded after verification of waste type and weight.
        </Text>
      </View>
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
    fontSize: 27,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
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
  photoCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  photoTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
  },
  photoSubtext: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  photoActions: {
    alignItems: 'center',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  photoButton: {
    backgroundColor: Colors.primary.teal,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  photoButtonText: {
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
  },
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: Colors.primary.red + '46',
    padding: 7,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: Colors.primary.red,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 15,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  captureButton: {
    width: 90,
    height: 60,
    borderRadius: 35,
    backgroundColor: Colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cancelButton: {
    padding: 15,
    width: 90,
    height: 60,
    borderRadius: 35,
    backgroundColor: Colors.primary.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  dateCard: {
    margin: 24,
    marginTop: 0,
    padding: 16,
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
  },
  dateSubtext: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  dateSelector: {
    backgroundColor: Colors.primary.beige,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    fontSize: 14,
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
    borderWidth: 5,
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
wasteTypesContainer: {
  marginTop: 8,
},
wasteTypesLabel: {
  fontSize: 12,
  fontFamily: 'PlusJakartaSans-SemiBold',
  color: Colors.text.secondary,
  marginBottom: 4,
},
wasteTypesList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 6,
},
wasteTypeTag: {
  backgroundColor: Colors.primary.green + '30',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 16,
},
wasteTypeText: {
  fontSize: 10,
  fontFamily: 'PlusJakartaSans-Medium',
  color: Colors.primary.green,
},
distanceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
  gap: 4,
},
distanceText: {
  fontSize: 12,
  fontFamily: 'PlusJakartaSans-Medium',
  color: Colors.secondary.white,
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
  disclaimerContainer: {
    margin: 24,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
    backgroundColor: Colors.primary.red + '45',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.red + '30',
  },
  disclaimerText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});