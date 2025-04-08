import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Info } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Camera, CameraType, CameraView } from 'expo-camera';

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
    image: 'https://cdn.factsasia.org/Article_2_3_44b6d9f89e.png',
    description: 'Clean PET bottles without caps or labels',
  },
  {
    id: '2',
    name: 'Glass Bottles',
    points: 75,
    image: 'https://theglassrecyclingcompany.co.za/wp-content/uploads/2022/04/glass04.png',
    description: 'Clear or colored glass bottles, no broken pieces',
  },
  {
    id: '3',
    name: 'Aluminum Cans',
    points: 60,
    image: 'data:image/jpeg;base64,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',
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [uri, setUri] = useState<string | null>(null);
  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanPress = () => {
    setShowCamera(true);
  };

  const handleSubmitPress = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/features/wasteSchedule',
        params: { wasteType: selectedCategory.id }
      });
    }
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync().catch(error => {
        console.error('Error taking picture:', error);
      });
      if (photo) {
        setUri(photo.uri);
        setShowCamera(false);
      }
    }  
  };

  if (showCamera) {
    if (hasPermission === null) {
      return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
      return <View style={styles.container}><Text>No access to camera</Text></View>;
    }

    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCameraCapture}
            >
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waste Selector</Text>
        <Text style={styles.subtitle}>Select waste type or scan with camera</Text>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPress}>
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
    color: Colors.text.primary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.beige,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: Colors.text.darker,
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
    color: Colors.text.secondary,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  categoriesGrid: {
    padding: 16,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: Colors.primary.lightTeal,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary.teal,
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
    color: Colors.text.primary,
  },
  categoryPoints: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.accent,
    marginTop: 4,
  },
  infoCard: {
    margin: 24,
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
  },
  submitButton: {
    backgroundColor: Colors.primary.teal,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background.card,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  closeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background.card,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
})