import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Info, CameraIcon } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Camera, CameraType, CameraView } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
//import { manipulateAsync, SaveFormat } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import { Asset } from 'expo-asset';

type WasteCategory = {
  id: string;
  name: string;
  points: number;
  // image: any;
  image: string;
  description: string;
  rules?: string[];
  nonRecyclable?: boolean;
  reason?: string;
};

// Define waste categories
const categories: WasteCategory[] = [
  {
    id: "1",
    name: "Paper & Cardboard ",
    points: 30,
    image: 'data:image/jpeg;base64,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',
    description: "Recyclable paper products.",
    rules: ["Clean and dry", "No food residue", "Flatten boxes"],
  },
  {
    id: "2",
    name: "Plastic Bottles & Containers",
    points: 35,
    image: 'https://cdn.factsasia.org/Article_2_3_44b6d9f89e.png',
    description: "Recyclable plastic items.",
    rules: ["Rinse containers", "Remove caps", "No plastic bags"],
  },
  {
    id: "3",
    name: "Glass Bottles & Jars",
    points: 50,
    image: 'https://theglassrecyclingcompany.co.za/wp-content/uploads/2022/04/glass04.png',
    description: "Glass bottles and containers.",
    rules: ["Rinse thoroughly", "Remove lids", "No broken glass"],
  },
  {
    id: "4",
    name: "Metal Cans & Scraps",
    points: 65,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqUymFvyPkvZ5Pe_eRVfrmAaNBsOo2Gc37Gw&s',
    description: "Recyclable Metal cans, containers and scraps.",
    rules: ["Remove non-metal parts and labels", "Rinse clean", "Flatten if possible", "Sort by type", "Handle safely"],
  },
  {
    id: "5",
    name: "Electronic Waste",
    points: 50,
    image: 'https://cdn.shopify.com/s/files/1/0658/0394/4185/files/img-bp-environmental-impact-electronic-waste-au-03-dt.png',
    description: "Electronic waste of sorts.",
    rules: ["Keep dry", "Tape battery terminals", "Separate by type"],
  },
  {
    id: "6",
    name: "Clothes & Textiles",
    points: 30,
    image: 'https://d3q0fpse3wbo5h.cloudfront.net/production/uploads/innovations/Recycle-Triangle-Cloth-CC-Licensed-noncommercial-share-1024x675.jpg',
    description: "Used clothing and textile items.",
    rules: ["Clean and dry", "Bag items", "Separate by condition"],
  },
  {
    id: "7",
    name: "Tyres",
    points: 75,
    image: 'https://s19532.pcdn.co/wp-content/uploads/2022/06/Tire-Recycling-Plants-1400.jpg',
    description: "Rubber products and used tyres.",
    rules: ["Clean off debris", "Keep dry", "Stack neatly"],
  },
  {
    id: "8",
    name: "Organic Waste",
    points: 15,
    image: 'https://kelvinindia.in/blog/wp-content/uploads/2023/02/MACHINE-1-1024x887.jpg',
    description: "Food scraps and yard waste.",
    rules: ["No meat or dairy", "No oils", "Keep free of plastics"],
  },
  {
    id: "9",
    name: "Shoes",
    points: 45,
    image: 'https://irp.cdn-website.com/ed061800/dms3rep/multi/shoes+sq+%282%29.png',
    description: "Used footwear in recyclable condition.",
    rules: ["Clean off dirt/debris", "Keep pairs together", "Remove insoles if possible"],
  },
  {
    id: "10",
    name: "Non-Recyclable & Trash",
    points: 0,
    image: 'https://www.stephensons.com/media/catalog/product/2/9/29238.jpg?width=700&height=700&canvas=700,700&optimize=high&bg-color=255,255,255&fit=bounds',
    description: "Items that cannot be recycled.",
    rules: ["Hazardous Waste", "Styrofoam", "Plastic wrap", "Dirty diapers"],
    nonRecyclable: true,
    reason: "Mixed materials or contamination",
  },
  
];

const model1 = {
  model: require('../../assets/model1/model.json'),
  weights: require('../../assets/model1/weights.bin'),
  classes: ["Shoes","Non-Recyclable & Trash","Organic Waste","Tyres"]
};

const model2 = {
  model: require('../../assets/model2/model.json'),
  weights: require('../../assets/model2/weights.bin'),
  classes: ["Paper & Cardboard","Plastic Bottles & Containers","Glass Bottles & Jars","Electronic Waste"]
};

const model3 = {
  model: require('../../assets/model3/model.json'),
  weights: require('../../assets/model3/weights.bin'),
  classes: ["Metal Cans & Scraps","Clothes & Textiles"]
};

let modelsLoaded = false;
let model1Instance: tf.LayersModel;
let model2Instance: tf.LayersModel;
let model3Instance: tf.LayersModel;
let loadingProgress = 0;

// After model definitions, add a mapping between model outputs and categories
const categoryMapping = {
  "Paper & Cardboard": ["paper", "cardboard", "paper & cardboard"],
  "Plastic Bottles & Containers": ["plastic", "bottle", "container", "plastic bottles", "plastic bottles & containers"],
  "Glass Bottles & Jars": ["glass", "bottle", "jar", "glass bottles", "glass bottles & jars"],
  "Metal Cans & Scraps": ["metal", "can", "scrap", "metal cans", "metal cans & scraps"],
  "Electronic Waste": ["electronic", "e-waste", "e waste", "electronic waste"],
  "Clothes & Textiles": ["clothes", "textile", "fabric", "clothes & textiles"],
  "Tyres": ["tyre", "tire", "tyres", "tires", "rubber tire"],
  "Organic Waste": ["organic", "food", "compost", "organic waste"],
  "Shoes": ["shoe", "shoes", "footwear"],
  "Non-Recyclable & Trash": ["trash", "non-recyclable", "garbage", "waste", "non-recyclable & trash"]
};

// Add a weights object to prioritize certain categories when multiple matches are found
const categoryPriority = {
  "Plastic Bottles & Containers": 1.0, 
  "Paper & Cardboard": 1.0,
  "Glass Bottles & Jars": 1.0,
  "Metal Cans & Scraps": 1.0,
  "Electronic Waste": 1.0,
  "Clothes & Textiles": 1.0,
  "Tyres": 1.0,
  "Organic Waste": 1.0,
  "Shoes": 1.0,
  "Non-Recyclable & Trash": 1.0 
};

// Add the missing findMaxIndex function
const findMaxIndex = (arr: number[]): number => {
  let maxIndex = 0;
  let maxValue = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }
  
  return maxIndex;
};

export default function WasteSelectorScreen() {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [uri, setUri] = useState<string | null>(null);
  const [wasteType, setWasteType] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add a useEffect to handle model loading timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isModelLoading) {
      // Set a timeout to automatically stop loading after 15 seconds
      timeout = setTimeout(() => {
        if (isModelLoading) {
          setIsModelLoading(false);
          console.warn('Model loading timed out, proceeding without models');
        }
      }, 15000); // 15 seconds timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isModelLoading]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      setIsModelLoading(true);
      try {
        // Update loading status
        setLoadingStatus('Preparing TensorFlow...');
        setLoadingPercentage(10);
        await tf.ready();
        setLoadingPercentage(20);
        
        // Load models with progress updates
        setLoadingStatus('Loading main classification model...');
        model1Instance = await tf.loadLayersModel(
          bundleResourceIO(model1.model, model1.weights)
        );
        setLoadingPercentage(50);
        
        setLoadingStatus('Loading secondary models...');
        model2Instance = await tf.loadLayersModel(
          bundleResourceIO(model2.model, model2.weights)
        );
        setLoadingPercentage(70);
        
        model3Instance = await tf.loadLayersModel(
          bundleResourceIO(model3.model, model3.weights)
        );
        setLoadingPercentage(90);
        
        // Warm up the models
        setLoadingStatus('Finalizing...');
        const warmupTensor = tf.zeros([1, 224, 224, 3]);
        await Promise.all([
          model1Instance.predict(warmupTensor),
          model2Instance.predict(warmupTensor),
          model3Instance.predict(warmupTensor)
        ]);
        warmupTensor.dispose();
        
        modelsLoaded = true;
        setLoadingPercentage(100);
        console.log('All models loaded and warmed up');
      } catch (error) {
        console.error('Model loading error:', error);
      } finally {
        // Important: Always make sure this gets called to exit loading state
        setIsModelLoading(false);
      }
    };
  
    loadModels();
  }, []);

  const handleScanPress = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = async () => {
    if (!cameraRef.current) {
      console.error("Camera reference is null");
      Alert.alert("Error", "Camera not available. Please try again.");
      return;
    }

    if (isProcessing) {
      console.log("Still processing previous capture, please wait");
      return;
    }

    try {
      // Take a single photo first to verify camera is working
      setIsProcessing(true);
      
      const initialPhoto = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
        skipProcessing: false
      });
      
      // Check if photo was successfully taken
      if (!initialPhoto || !initialPhoto.uri) {
        throw new Error("Failed to capture initial photo");
      }
      
      // Display the captured image immediately
      setUri(initialPhoto.uri);
      setShowCamera(false);
      
      // If models aren't loaded, use basic fallback
      if (!modelsLoaded) {
        console.log("Models not loaded, using manual category selection");
        return;
      }
      
      // Take additional photos for better prediction (if first one succeeded)
      const photos = [initialPhoto];
      try {
        // Add a short delay before taking more photos
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Try to take 2 more photos if possible
        for (let i = 0; i < 2; i++) {
          if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
              quality: 1,
              base64: true,
              skipProcessing: false
            });
            
            if (photo && photo.uri) {
              photos.push(photo);
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        }
      } catch (additionalPhotosError) {
        console.log("Couldn't take additional photos, continuing with the first one", additionalPhotosError);
      }
      
      // Disable automatic plastic fallback
      let useDefaultFallback = false;
      
      // Process photos and make predictions
      if (photos.length > 0) {
        try {
          const allResults = await Promise.all(photos.map(async (photo) => {
            if (!photo.uri) {
              throw new Error("Photo URI is undefined");
            }
            
            const processedImageTensor = await processImage(photo.uri);
            
            // Get predictions from all models
            const predictions = await Promise.all([
              model1Instance.predict(processedImageTensor) as tf.Tensor,
              model2Instance.predict(processedImageTensor) as tf.Tensor,
              model3Instance.predict(processedImageTensor) as tf.Tensor
            ]);
            
            // Get prediction arrays
            const predictionArrays = await Promise.all([
              Array.from(await (predictions[0] as tf.Tensor).data()),
              Array.from(await (predictions[1] as tf.Tensor).data()),
              Array.from(await (predictions[2] as tf.Tensor).data())
            ]);
            
            // Clean up tensors
            processedImageTensor.dispose();
            predictions.forEach(p => p.dispose());
            
            // Return the top prediction from each model
            return [
              { 
                class: model1.classes[findMaxIndex(predictionArrays[0])], 
                confidence: Math.max(...predictionArrays[0]) 
              },
              { 
                class: model2.classes[findMaxIndex(predictionArrays[1])], 
                confidence: Math.max(...predictionArrays[1]) 
              },
              { 
                class: model3.classes[findMaxIndex(predictionArrays[2])], 
                confidence: Math.max(...predictionArrays[2]) 
              }
            ];
          }));
          
          // Fix automatic plastic bottle bias by adjusting confidence thresholds
          // and requiring stronger evidence for plastic bottles
          
          // Combine results from all photos
          const aggregatedResults: {[key: string]: {count: number, confidenceSum: number}} = {};
          
          // For each photo's results
          allResults.forEach(photoResults => {
            // For each model's top prediction
            photoResults.forEach(prediction => {
              const className = prediction.class;
              if (!aggregatedResults[className]) {
                aggregatedResults[className] = { count: 0, confidenceSum: 0 };
              }
              aggregatedResults[className].count += 1;
              aggregatedResults[className].confidenceSum += prediction.confidence;
            });
          });
          
          // Convert to array and sort by weighted score, with reduced bias for plastic
          const rankedPredictions = Object.entries(aggregatedResults)
            .map(([className, stats]) => {
              let priorityMultiplier = getCategoryPriority(className) || 1.0;
              
              if (className.toLowerCase().includes("plastic") && stats.confidenceSum / stats.count < 0.7) {
                priorityMultiplier = 0.9; 
              }
              
              return {
                class: className,
                count: stats.count,
                avgConfidence: stats.confidenceSum / stats.count,
                // Adjusted score calculation
                score: stats.count * (stats.confidenceSum / stats.count) * priorityMultiplier
              };
            })
            .sort((a, b) => b.score - a.score);
          
          console.log("Ranked predictions:", JSON.stringify(rankedPredictions));
          
          // Only match plastic if confidence is reasonably high
          let matchedCategory = null;
          
          // First pass: Try direct matches with confidence thresholds
          for (const prediction of rankedPredictions) {
            // Skip low confidence plastic predictions
            if (prediction.class.toLowerCase().includes("plastic") && prediction.avgConfidence < 0.7) {
              console.log("Skipping low confidence plastic prediction:", prediction.class, prediction.avgConfidence);
              continue;
            }
            
            // For other categories, use normal matching
            // 1. Try direct match
            const directMatch = categories.find(cat => 
              cat.name.toLowerCase() === prediction.class.toLowerCase()
            );
            
            if (directMatch) {
              matchedCategory = directMatch;
              console.log("Found direct match:", directMatch.name, "confidence:", prediction.avgConfidence);
              break;
            }
            
            // 2. Try keyword mapping
            const matchedName = findCategoryByKeywords(prediction.class);
            if (matchedName) {
              const keywordMatch = categories.find(cat => 
                cat.name.toLowerCase() === matchedName.toLowerCase()
              );
              
              if (keywordMatch) {
                // For plastic, require higher confidence
                if (matchedName.toLowerCase().includes("plastic") && prediction.avgConfidence < 0.65) {
                  console.log("Skipping low confidence plastic keyword match");
                  continue;
                }
                
                matchedCategory = keywordMatch;
                console.log("Found keyword match:", keywordMatch.name, "from", prediction.class);
                break;
              }
            }
            
            // 3. Try partial matching (but not for plastic with low confidence)
            if (!prediction.class.toLowerCase().includes("plastic") || prediction.avgConfidence > 0.65) {
              const partialMatch = categories.find(cat => 
                cat.name.toLowerCase().includes(prediction.class.toLowerCase()) ||
                prediction.class.toLowerCase().includes(cat.name.toLowerCase())
              );
              
              if (partialMatch) {
                matchedCategory = partialMatch;
                console.log("Found partial match:", partialMatch.name);
                break;
              }
            }
          }
          
          // If no match yet, try word matching but with stricter rules for plastic
          if (!matchedCategory) {
            const allWords = rankedPredictions.flatMap(p => 
              p.class.toLowerCase().split(/\s+/)
            );
            
            // Score each category by word matches weighted by prediction scores
            const categoryScores = categories.map(category => {
              const categoryWords = category.name.toLowerCase().split(/\s+/);
              let score = 0;
              
              // Count matching words
              categoryWords.forEach(word => {
                if (word.length > 2 && allWords.includes(word)) {
                  // Apply special rule for "plastic" word
                  if (word === "plastic") {
                    // Check if any prediction with plastic has high confidence
                    const plasticPredictions = rankedPredictions.filter(p => 
                      p.class.toLowerCase().includes("plastic")
                    );
                    
                    if (plasticPredictions.length > 0 && plasticPredictions[0].avgConfidence > 0.6) {
                      score += getCategoryPriority(category.name) || 1.0;
                    } else {
                      // Lower score for plastic if no high confidence predictions
                      score += 0.5;
                    }
                  } else {
                    score += getCategoryPriority(category.name) || 1.0;
                  }
                }
              });
              
              return { category, score };
            });
            
            // Sort by score and pick the best
            categoryScores.sort((a, b) => b.score - a.score);
            
            if (categoryScores[0].score > 0) {
              matchedCategory = categoryScores[0].category;
              console.log("Found word match:", matchedCategory.name);
            }
          }
          
          // Apply the matched category or show options to the user
          if (matchedCategory) {
            // Special case for plastic - always ask user to confirm if confidence isn't very high
            if (matchedCategory.name.toLowerCase().includes("plastic") && 
                rankedPredictions.length > 0 && 
                rankedPredictions[0].avgConfidence < 0.8) {
              
              // Find the next best non-plastic category
              const alternativeCategory = categories.find(cat => 
                !cat.name.toLowerCase().includes("plastic") && 
                cat.id !== matchedCategory?.id
              );
              
              // Ask user to confirm
              Alert.alert(
                "Confirm Waste Type",
                `Is this ${matchedCategory.name}?`,
                [
                  {
                    text: "Yes",
                    onPress: () => {
                      setSelectedCategory(matchedCategory);
                      setWasteType(matchedCategory!.name);
                      setPointsEarned(matchedCategory!.points);
                    }
                  },
                  {
                    text: alternativeCategory ? `No, it's ${alternativeCategory.name}` : "No",
                    onPress: () => {
                      if (alternativeCategory) {
                        setSelectedCategory(alternativeCategory);
                        setWasteType(alternativeCategory.name);
                        setPointsEarned(alternativeCategory.points);
                      } else {
                        // Just use matched category if no alternative
                        setSelectedCategory(matchedCategory);
                        setWasteType(matchedCategory!.name);
                        setPointsEarned(matchedCategory!.points);
                      }
                    }
                  },
                  {
                    text: "Choose Manually",
                    onPress: () => {
                      // Leave without setting category so user can select manually
                    }
                  }
                ]
              );
            } else {
              setSelectedCategory(matchedCategory);
              setWasteType(matchedCategory.name);
              setPointsEarned(matchedCategory.points);
              console.log("Final matched category:", matchedCategory.name);
            }
          } else {
            // Always show confirmation if we're uncertain
            useDefaultFallback = true;
          }
        } catch (processingError) {
          console.error('Error processing predictions:', processingError);
          useDefaultFallback = true;
        }
      } else {
        useDefaultFallback = true;
      }
      
      // Only use fallback if needed
      if (useDefaultFallback) {
        // Let user choose instead of defaulting to plastic
        Alert.alert(
          "Couldn't Identify Waste",
          "We couldn't identify this waste type automatically. Please select manually.",
          [
            {
              text: "OK",
              onPress: () => {
                // Do nothing, let the user select manually
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
      // Show error to user
      Alert.alert(
        "Camera Error",
        "There was a problem capturing the image. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to find category name by keywords
  const findCategoryByKeywords = (predictionClass: string): string | null => {
    predictionClass = predictionClass.toLowerCase();
    
    for (const [categoryName, keywords] of Object.entries(categoryMapping)) {
      for (const keyword of keywords) {
        if (predictionClass.includes(keyword)) {
          return categoryName;
        }
      }
    }
    
    return null;
  };

  // Helper function to get the priority weight for a category
  const getCategoryPriority = (categoryName: string): number => {
    // Use type assertion to tell TypeScript this is a valid key
    if (Object.keys(categoryPriority).includes(categoryName)) {
      return categoryPriority[categoryName as keyof typeof categoryPriority] || 1.0;
    }
    return 1.0; // Default priority if not found
  };

  // Helper function to find the best possible category match for a class
  const findBestCategoryForClass = (className: string): WasteCategory | null => {
    // Try through our mapping first
    const mappedName = findCategoryByKeywords(className);
    if (mappedName) {
      const category = categories.find(cat => 
        cat.name.toLowerCase() === mappedName.toLowerCase()
      );
      if (category) return category;
    }
    
    // Try partial matches
    for (const category of categories) {
      if (
        category.name.toLowerCase().includes(className.toLowerCase()) ||
        className.toLowerCase().includes(category.name.toLowerCase())
      ) {
        return category;
      }
    }
    
    // If it contains "plastic" anywhere, return plastic
    if (className.toLowerCase().includes("plastic")) {
      return categories.find(cat => cat.id === "2") || null;
    }
    
    return null;
  };

  // Helper function for fallback logic
  const fallbackToDefault = () => {
    // Default to plastic bottles as fallback
    const plasticCategory = categories.find(cat => cat.id === "2");
    if (plasticCategory) {
      setSelectedCategory(plasticCategory);
      setWasteType(plasticCategory.name);
      setPointsEarned(plasticCategory.points);
    } else {
      // Use a random category if plastic not found (shouldn't happen)
      const randomCategory = categories[Math.floor(Math.random() * (categories.length - 1))];
      setSelectedCategory(randomCategory);
      setWasteType(randomCategory.name);
      setPointsEarned(randomCategory.points);
    }
  };

  // Improve the image processing function
  const processImage = async (uri: string) => {
    try {
      // Apply multiple preprocessing techniques for better recognition
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [
          // First resize to slightly larger than needed
          { resize: { width: 300, height: 300 } },
          // Then crop to ensure we get the center
          { crop: { originX: 38, originY: 38, width: 224, height: 224 } }
        ],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 0.95 }
      );
      
      // Read the file as base64
      const imgB64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to tensor
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      
      // Decode JPEG
      const imageTensor = decodeJpeg(raw);
      
      // Apply advanced preprocessing
      let processedTensor = tf.cast(imageTensor, 'float32');
      
      // Normalize to [0, 1]
      processedTensor = processedTensor.div(tf.scalar(255.0));
      
      // Add batch dimension
      processedTensor = processedTensor.expandDims(0);
      
      // Clean up the original tensor
      imageTensor.dispose();
      
      return processedTensor;
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  };

  const handleSubmitPress = () => {
    if (selectedCategory) {
      router.push({
        pathname: '/features/wasteSchedule',
        params: { wasteType: selectedCategory.id }
      });
    }  
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  if (showCamera) {
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

  if (isModelLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading Waste Recognition AI</Text>
        <Text style={styles.subtitleText}>{loadingStatus}</Text>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${loadingPercentage}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.percentageText}>{loadingPercentage}%</Text>
        
        {loadingPercentage > 80 && (
          <Text style={styles.almostDoneText}>Almost there...</Text>
        )}
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => setIsModelLoading(false)}
        >
          <Text style={styles.skipButtonText}>Skip Loading</Text>
        </TouchableOpacity>
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
      <CameraIcon size={24} color={Colors.secondary.white} />
      <Text style={styles.scanButtonText}>Scan Waste</Text>
      </TouchableOpacity>

      {uri && (
        <View style={styles.capturedImageContainer}>
          <Image source={{ uri }} style={styles.capturedImage} />
          <View style={styles.wasteInfoBox}>
            <Text style={styles.wasteTypeText}>Identified Waste: {wasteType}</Text>
            {pointsEarned !== null && (
              <Text style={styles.pointsText}>Points: +{pointsEarned}</Text>
            )}
          </View>
          
          {selectedCategory && (
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Recycling Rules:</Text>
              {selectedCategory.rules?.map((rule, index) => (
                <Text key={index} style={styles.ruleItem}>• {rule}</Text>
              ))}
            </View>
          )}
          
          <TouchableOpacity style={styles.verifyButton} onPress={handleSubmitPress}>
            <Text style={styles.verifyButtonText}>Submit for Verification</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or select manually</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, selectedCategory?.id === category.id && styles.selectedCard]}
            onPress={() => setSelectedCategory(category)}>
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <View style={styles.categoryContent}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryPoints}>+{category.points} points</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && !uri && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
              <Info size={20} color={Colors.primary.blue} />
            <Text style={styles.infoTitle}>Recycling Guidelines</Text>
          </View>
          <Text style={styles.infoText}>{selectedCategory.description}</Text>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Recycling Rules:</Text>
            {selectedCategory.rules?.map((rule, index) => (
              <Text key={index} style={styles.ruleItem}>• {rule}</Text>
            ))}
          </View>
          
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
    color: Colors.text.darker,
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
    color: Colors.text.primary,
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
  icon: {
   color: '#2196F3',
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
  rulesContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  rulesTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ruleItem: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
    marginLeft: 8,
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
    marginBottom: 40,
  },
  captureButton: {
    width: 120,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  closeButton: {
    width: 120,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  capturedImageContainer: {
    margin: 24,
    backgroundColor: Colors.background.modal,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  wasteInfoBox: {
    backgroundColor: Colors.primary.lightTeal,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  wasteTypeText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.green,
  },
  verifyButton: {
    backgroundColor: Colors.primary.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  verifyButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '80%',
    height: 10,
    backgroundColor: Colors.background.card,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.green,
  },
  percentageText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.green,
    marginBottom: 20,
  },
  almostDoneText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Italic',
    color: Colors.text.accent,
    marginBottom: 30,
  },
  skipButton: {
    padding: 10,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 5,
    marginTop: 20,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
});