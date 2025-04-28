import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { db, auth } from '@lib/firebase/firebaseConfig';
import { doc, getDoc, updateDoc, runTransaction, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Colors } from '../constants/Colors';
import { Trophy, Users, Calendar, Award, ArrowLeft, CheckCircle, Clock, Target, Plus } from 'lucide-react-native';

type Challenge = {
  id: string;
  title: string;
  description: string;
  targetParticipants: number;
  rewardPoints: number;
  startDate: any;
  endDate: any;
  participants: string[];
  daysLeft: number;
  status: 'active' | 'completed' | 'upcoming';
};

type Participant = {
  id: string;
  fullName: string;
  avatar: string;
  badge: string;
};

export default function ChallengeDetails() {
  const { id } = useLocalSearchParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userJoined, setUserJoined] = useState(false);
  const [joiningChallenge, setJoiningChallenge] = useState(false);
  const [userData, setUserData] = useState<{fullName?: string; } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // Fetch user data
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData({
              fullName: data.fullName,
            });
          }
        } finally {
       }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchChallengeData = async () => {
      if (!id) return;
      
      try {
        // Get current user
        const user = auth.currentUser;
        if (user) {
          setCurrentUser({
            id: user.uid,
            name: userData?.fullName || "EcoBuddy User",
            avatar: user.photoURL || "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png"
          });
        }
        
        // Get challenge data
        const challengeRef = doc(db, 'challenges', id as string);
        const challengeDoc = await getDoc(challengeRef);
        
        if (challengeDoc.exists()) {
          const data = challengeDoc.data();
          const challenge: Challenge = {
            id: challengeDoc.id,
            title: data.title || "Untitled Challenge",
            description: data.description || "No description provided",
            targetParticipants: data.targetParticipants || 0,
            rewardPoints: data.rewardPoints || 0,
            startDate: data.startDate,
            endDate: data.endDate,
            participants: data.participants || [],
            daysLeft: data.endDate 
              ? Math.ceil((data.endDate.toMillis ? data.endDate.toMillis() - Date.now() : 
                  data.endDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : 0,
            status: data.status || "active",
            
          };
          
          setChallenge(challenge);
          
          // Check if current user has joined this challenge
          if (user) {
            setUserJoined(challenge.participants.includes(user.uid));
          }
          
          // Fetch participant details
          const participantsData: Participant[] = [];
          for (const participantId of challenge.participants.slice(0, 10)) { // Limit to 10 for performance
            const participantDoc = await getDoc(doc(db, 'users', participantId));
            if (participantDoc.exists()) {
              const userData = participantDoc.data();
              participantsData.push({
                id: participantId,
                fullName: userData.fullName || "EcoBuddy User",
                avatar: userData.avatar || "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
                badge: userData.tier || "Bronze"
              });
            }
          }
          
          setParticipants(participantsData);
        } else {
          Alert.alert("Error", "Challenge not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        Alert.alert("Error", "Failed to load challenge details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallengeData();
  }, [id]);

  const handleJoinChallenge = async () => {
    if (!currentUser?.id || !challenge) return;
    
    setJoiningChallenge(true);
    
    try {
      const challengeRef = doc(db, 'challenges', challenge.id);
      const userRef = doc(db, 'users', currentUser.id);
      
      await runTransaction(db, async (transaction) => {
        const challengeDoc = await transaction.get(challengeRef);
        const userDoc = await transaction.get(userRef);
        
        if (!challengeDoc.exists() || !userDoc.exists()) {
          throw new Error("Challenge or user not found");
        }
        
        if (userJoined) {
          // Leave challenge
          transaction.update(challengeRef, {
            participants: arrayRemove(currentUser.id)
          });
          
          transaction.update(userRef, {
            joinedChallenges: arrayRemove(challenge.id)
          });
          
          setUserJoined(false);
          setChallenge(prev => prev ? {
            ...prev,
            participants: prev.participants.filter(id => id !== currentUser.id)
          } : null);
        } else {
          // Join challenge
          transaction.update(challengeRef, {
            participants: arrayUnion(currentUser.id)
          });
          
          transaction.update(userRef, {
            joinedChallenges: arrayUnion(challenge.id)
          });
          
          setUserJoined(true);
          setChallenge(prev => prev ? {
            ...prev,
            participants: [...prev.participants, currentUser.id]
          } : null);
        }
      });
      
      Alert.alert(
        "Success", 
        userJoined 
          ? "You have left the challenge." 
          : "You have joined the challenge! Complete the goals to earn rewards."
      );
    } catch (error) {
      console.error("Error joining/leaving challenge:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred. Please try again.");
    } finally {
      setJoiningChallenge(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    return jsDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    if (!challenge) return 0;
    return Math.min(100, (challenge.participants.length / challenge.targetParticipants) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.primary.green;
      case 'completed':
        return Colors.primary.blue;
      case 'upcoming':
        return Colors.secondary.yellow;
      default:
        return Colors.accent.darkGray;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.green} />
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
        <ArrowLeft size={24} color={Colors.primary.green} />
      </TouchableOpacity>
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.challengeBadge}>
          <Trophy size={36} color={Colors.secondary.yellow} />
        </View>
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getStatusColor(challenge.status) }]}>
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </Text>
        </View>
      </View>
      
      {/* Info Cards */}
      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Users size={20} color={Colors.primary.green} />
          <Text style={styles.infoValue}>{challenge.participants.length}</Text>
          <Text style={styles.infoLabel}>Participants</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Target size={20} color={Colors.primary.blue} />
          <Text style={styles.infoValue}>{challenge.targetParticipants}</Text>
          <Text style={styles.infoLabel}>Goal</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Award size={20} color={Colors.secondary.yellow} />
          <Text style={styles.infoValue}>{challenge.rewardPoints}</Text>
          <Text style={styles.infoLabel}>Points</Text>
        </View>
      </View>
      
      {/* Progress Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressPercentage() >= 100 
                    ? Colors.primary.green 
                    : Colors.primary.blue
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.participants.length} / {challenge.targetParticipants} participants
          </Text>
        </View>
      </View>
      
      {/* Description */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About this Challenge</Text>
        <Text style={styles.description}>{challenge.description}</Text>
      </View>
      
      {/* Challenge Details */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Calendar size={20} color={Colors.primary.green} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{formatDate(challenge.startDate)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Calendar size={20} color={Colors.primary.green} />
          </View>
          <View>
            <Text style={styles.detailLabel}>End Date</Text>
            <Text style={styles.detailValue}>{formatDate(challenge.endDate)}</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Clock size={20} color={Colors.primary.green} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Time Remaining</Text>
            <Text style={styles.detailValue}>{challenge.daysLeft} days left</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <Users size={20} color={Colors.primary.green} />
          </View>
          <View>
            <Text style={styles.detailLabel}>Created By</Text>
            <Text style={styles.creatorValue}>{userData?.fullName}</Text>
          </View>
        </View>
      </View>
      
      {/* Participants */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Participants</Text>
        {participants.length > 0 ? (
          <View style={styles.participantsContainer}>
            {participants.map(participant => (
              <View key={participant.id} style={styles.participantItem}>
                <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>{participant.fullName}</Text>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{participant.badge}</Text>
                  </View>
                </View>
              </View>
            ))}
            {challenge.participants.length > 10 && (
              <Text style={styles.moreParticipants}>
                +{challenge.participants.length - 10} more participants
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noParticipantsText}>No participants yet. Be the first to join!</Text>
        )}
      </View>
      
      {/* Join Button */}
      <TouchableOpacity 
        style={[
          styles.joinButton,
          userJoined ? styles.leaveButton : null,
          joiningChallenge ? styles.disabledButton : null
        ]}
        onPress={handleJoinChallenge}
        disabled={joiningChallenge}
      >
        {joiningChallenge ? (
          <ActivityIndicator size="small" color={Colors.text.primary} />
        ) : (
          <>
            {userJoined ? (
              <CheckCircle size={20} color={Colors.text.primary} style={styles.buttonIcon} />
            ) : (
              <Plus size={20} color={Colors.text.primary} style={styles.buttonIcon} />
            )}
            <Text style={styles.joinButtonText}>
              {userJoined ? 'Leave Challenge' : 'Join Challenge'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.darker,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text.darker,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  challengeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary.yellow + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    color: Colors.primary.green,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background.modal,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.primary.cream,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent.darkGray,
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.text.darker,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.secondary.white,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.secondary.white,
  },
  detailsCard: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.green + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
  },
  creatorValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginEnd: 40,
  },
  participantsContainer: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  badgeContainer: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  moreParticipants: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.blue,
    marginTop: 8,
  },
  noParticipantsText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    textAlign: 'center',
    padding: 16,
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leaveButton: {
    backgroundColor: Colors.accent.darkGray,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  joinButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  }
});