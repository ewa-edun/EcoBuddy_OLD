import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Share, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Heart, MessageCircle, Share2, Award, Users, Trophy, Plus, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { db, auth } from '@lib/firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc, addDoc, getDoc, query, where, orderBy, getDocs, getCountFromServer, increment, serverTimestamp, runTransaction, arrayUnion, arrayRemove } from 'firebase/firestore';
import NewChallengeForm from '../features/newChallengeForm';

type Post = {
  id: string;
  user?: {
    fullName: string;
    avatar: string;
    badge: string;
    id: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: number;
  timestamp: string;
  commentsData?: Comment[];
};

type Comment = {
  id: string;
  postId: string;
  user: {
    id: string;
    fullName: string;
    avatar: string;
    badge: string;
  };
  content: string;
  timestamp: string;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  targetParticipants: number;
  rewardPoints: number;
  startDate: Date | import('firebase/firestore').Timestamp;
  endDate: Date | import('firebase/firestore').Timestamp;
  participants: string[];
  daysLeft: number;
  createdBy: string;
  status: 'active' | 'completed' | 'upcoming';
};

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewChallengeForm, setShowNewChallengeForm] = useState(false);
  const [expandedCommentPosts, setExpandedCommentPosts] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [communityStats, setCommunityStats] = useState({
    memberCount: 0,
    activeChallenges: 0,
    userTier: 'Bronze'
  });
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(false);

  // Fetch current user and community stats
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          fullName: user.displayName || "EcoBuddy User",
          avatar: user.photoURL || "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
          badge: "Member"
        });

        // Fetch user tier
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCommunityStats(prev => ({
            ...prev,
            userTier: userDoc.data().tier || 'Bronze'
          }));
        }
      }
    });

    // Fetch member count
    const fetchMemberCount = async () => {
      const snapshot = await getCountFromServer(collection(db, 'users'));
      setCommunityStats(prev => ({
        ...prev,
        memberCount: snapshot.data().count
      }));
    };

    fetchMemberCount();

    return () => unsubscribeAuth();
  }, []);

  // Fetch posts
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            user: data.author || {
              fullName: "EcoBuddy User",
              avatar: "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
              badge: "Member",
              id: data.authorId || "unknown"
            },
            content: data.content,
            image: data.imageUrl || undefined,
            likes: data.likes || [],
            comments: data.comments || 0,
            timestamp: data.createdAt?.toDate().toLocaleString() || "Just now",
          };
        });
        setPosts(fetchedPosts);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch challenges when tab is active
  useEffect(() => {
    if (activeTab !== 'challenges') return;

    const fetchChallenges = async () => {
      setChallengesLoading(true);
      try {
        const q = query(
          collection(db, 'challenges'),
          where('endDate', '>=', new Date()),
          orderBy('endDate', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        const challengesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Challenge",
            description: data.description || "No description provided",
            targetParticipants: data.targetParticipants || 0,
            rewardPoints: data.rewardPoints || 0,
            startDate: data.startDate || new Date(),
            endDate: data.endDate || new Date(),
            participants: data.participants || [],
            daysLeft: data.endDate 
              ? Math.ceil((data.endDate.toMillis ? data.endDate.toMillis() - Date.now() : 
                  data.endDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : 0,
            createdBy: data.createdBy || "Unknown",
            status: data.status || "upcoming"
          };
        });

        setChallenges(challengesData);
        setCommunityStats(prev => ({
          ...prev,
          activeChallenges: challengesData.length
        }));
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setChallengesLoading(false);
      }
    };

    fetchChallenges();
  }, [activeTab]);

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const postRef = doc(db, 'posts', postId);
    
    // Find the post in local state to check if user already liked it
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const userLiked = post.likes.includes(userId);
    
    if (userLiked) {
      // Remove like
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: p.likes.filter(id => id !== userId) } 
          : p
      ));
    } else {
      // Add like
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes: [...p.likes, userId] } 
          : p
      ));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my post on EcoBuddy and start your eco-friendly journey!`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedCommentPosts.includes(postId)) {
      setExpandedCommentPosts(expandedCommentPosts.filter(id => id !== postId));
      return;
    }
    
    setExpandedCommentPosts([...expandedCommentPosts, postId]);
    await loadComments(postId);
  };

  const loadComments = async (postId: string) => {
    if (loadingComments[postId]) return;
    
    setLoadingComments({...loadingComments, [postId]: true});
    
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      
      const commentSnapshot = await getDocs(commentsQuery);
      const comments = commentSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          postId: data.postId,
          user: data.user || {
            id: data.userId,
            fullName: "EcoBuddy User",
            avatar: "https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png",
            badge: "Member"
          },
          content: data.content,
          timestamp: data.createdAt?.toDate().toLocaleString() || "Just now",
        };
      });
      
      setPosts(posts.map(post => 
        post.id === postId ? {...post, commentsData: comments} : post
      ));
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments({...loadingComments, [postId]: false});
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText[postId]?.trim() || !currentUser) return;
    
    try {
      const newComment = {
        postId,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar,
          badge: currentUser.badge
        },
        content: commentText[postId],
        createdAt: serverTimestamp()
      };
      

    // Update local state immediately for better UX
    const newCommentWithClientTimestamp = {
      ...newComment,
      id: `temp-${Date.now()}`, // Temporary ID until Firestore assigns one
      timestamp: new Date().toLocaleString() // Local timestamp for immediate display
    };
    
    // Update posts state with the new comment count and add comment to commentsData
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = (post.comments || 0) + 1;
        const updatedCommentsData = [
          newCommentWithClientTimestamp,
          ...(post.commentsData || [])
        ];
        return {
          ...post,
          comments: updatedComments,
          commentsData: updatedCommentsData
        };
      }
      return post;
    }));
    
    // Clear the comment input field
    setCommentText({...commentText, [postId]: ''});

      // Add comment
      await addDoc(collection(db, 'comments'), newComment);
      
      // Update comment count
      await updateDoc(doc(db, 'posts', postId), {
        comments: increment(1)
      });
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? {...post, comments: (post.comments || 0) + 1} 
          : post
      ));
      
      setCommentText({...commentText, [postId]: ''});
      await loadComments(postId);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!currentUser?.id) return;
    
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      const userRef = doc(db, 'users', currentUser.id);
      
      await runTransaction(db, async (transaction) => {
        const challengeDoc = await transaction.get(challengeRef);
        const userDoc = await transaction.get(userRef);
        
        if (!challengeDoc.exists() || !userDoc.exists()) {
          throw new Error("Challenge or user not found");
        }
        
        const participants = challengeDoc.data().participants || [];
        if (participants.includes(currentUser.id)) {
          throw new Error("You already joined this challenge");
        }
        
        transaction.update(challengeRef, {
          participants: [...participants, currentUser.id]
        });
        
        transaction.update(userRef, {
          joinedChallenges: [...(userDoc.data().joinedChallenges || []), challengeId]
        });
      });
      
      // Refresh challenges
      const q = query(
        collection(db, 'challenges'),
        where('endDate', '>=', new Date()),
        orderBy('endDate', 'asc')
      );
      const snapshot = await getDocs(q);
      setChallenges(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              title: data.title || "Untitled Challenge",
              description: data.description || "No description provided",
              targetParticipants: data.targetParticipants || 0,
              rewardPoints: data.rewardPoints || 0,
              startDate: data.startDate || new Date(),
              endDate: data.endDate || new Date(),
              participants: data.participants || [],
              daysLeft: data.endDate 
                ? Math.ceil((data.endDate.toMillis ? data.endDate.toMillis() - Date.now() : 
                           data.endDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : 0,
              createdBy: data.createdBy || "Unknown",
              status: data.status || "upcoming"
          };
      }));
    } catch (error) {
      console.error("Error joining challenge:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with eco-warriors</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.postButton} onPress={() => router.replace('/features/createPost')}>
            <Plus size={20} color={Colors.text.primary} />
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
          
          {activeTab === 'challenges' && (
            <TouchableOpacity 
              style={styles.postButton} 
              onPress={() => setShowNewChallengeForm(true)}
            >
              <Plus size={20} color={Colors.text.primary} />
              <Text style={styles.postButtonText}>New Challenge</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>
            {communityStats.memberCount > 1000 
              ? `${(communityStats.memberCount / 1000).toFixed(1)}K` 
              : communityStats.memberCount}
          </Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>{communityStats.activeChallenges}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>{communityStats.userTier}</Text>
          <Text style={styles.statLabel}>Current Tier</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Community Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            Active Challenges
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'feed' ? (
          <View style={styles.feed}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary.green} />
            ) : posts.length === 0 ? (
              <Text style={styles.noContentText}>No posts available yet</Text>
            ) : (
              posts.map((post) => (
                <View key={post.id} style={styles.post}>
                  {/* Post header */}
                  <View style={styles.postHeader}>
                    <Image 
                      source={{ uri: post.user?.avatar }} 
                      style={styles.avatar} 
                    />
                    <View style={styles.postHeaderText}>
                      <Text style={styles.userfullName}>{post.user?.fullName}</Text>
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badge}>{post.user?.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.timeAgo}>{post.timestamp}</Text>
                  </View>
                  
                  {/* Post content */}
                  <Text style={styles.postContent}>{post.content}</Text>
                  {post.image && (
                    <Image source={{ uri: post.image }} style={styles.postImage} />
                  )}
                  
                  {/* Post actions */}
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id)}
                    >
                      <Heart
                        size={20}
                        color={post.likes.includes(currentUser?.id) 
                          ? Colors.primary.green 
                          : Colors.accent.darkGray}
                      />
                      <Text style={styles.actionText}>{post.likes.length}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => toggleComments(post.id)}
                    >
                      <MessageCircle 
                        size={20} 
                        color={expandedCommentPosts.includes(post.id) 
                          ? Colors.primary.green 
                          : Colors.accent.darkGray} 
                      />
                      <Text style={styles.actionText}>{post.comments}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                      <Share2 size={20} color={Colors.accent.darkGray} />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Comments section */}
                  {expandedCommentPosts.includes(post.id) && (
                    <View style={styles.commentSection}>
                      <View style={styles.commentInputContainer}>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Write a comment..."
                          value={commentText[post.id] || ''}
                          onChangeText={(text) => setCommentText({...commentText, [post.id]: text})}
                          multiline
                        />
                        <TouchableOpacity 
                          style={styles.sendButton}
                          onPress={() => handleCommentSubmit(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                        >
                          <Send 
                            size={20} 
                            color={commentText[post.id]?.trim() 
                              ? Colors.primary.green 
                              : Colors.accent.lightGray} 
                          />
                        </TouchableOpacity>
                      </View>
                      
                      {loadingComments[post.id] ? (
                        <ActivityIndicator size="small" color={Colors.primary.green} />
                      ) : post.commentsData?.length ? (
                        <View style={styles.commentsList}>
                          {post.commentsData.map((comment) => (
                            <View key={comment.id} style={styles.commentItem}>
                              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                              <View style={styles.commentContent}>
                                <View style={styles.commentHeader}>
                                  <Text style={styles.commentUserfullName}>{comment.user.fullName}</Text>
                                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                                </View>
                                <Text style={styles.commentText}>{comment.content}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.commentStatusText}>No comments yet. Be the first to comment!</Text>
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.challengesContainer}>
            {challengesLoading ? (
              <ActivityIndicator size="large" color={Colors.primary.green} />
            ) : challenges.length === 0 ? (
              <Text style={styles.noContentText}>No active challenges at the moment</Text>
            ) : (
              challenges.map((challenge) => (
                <TouchableOpacity 
                  key={challenge.id} 
                  style={styles.challengeCard}
                  onPress={() => router.push(`/features/challengeDetails?id=${challenge.id}`)}
                >
                  <View style={styles.challengeBadge}>
                    <Trophy size={24} color={Colors.secondary.yellow} />
                  </View>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeDesc}>{challenge.description}</Text>
                  
                  <View style={styles.challengeMeta}>
                    <Text style={styles.challengeParticipants}>
                      {challenge.participants.length} participants
                    </Text>
                    <Text style={styles.challengeTimeLeft}>
                      {challenge.daysLeft} days left
                    </Text>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progress, 
                      { 
                        width: `${Math.min(100, (challenge.participants.length / challenge.targetParticipants) * 100)}%`,
                        backgroundColor: challenge.participants.length >= challenge.targetParticipants 
                          ? Colors.primary.green 
                          : Colors.primary.blue
                      }
                    ]} />
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.joinButton,
                      challenge.participants.includes(currentUser?.id) && styles.joinedButton
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleJoinChallenge(challenge.id);
                    }}
                  >
                    <Text style={styles.joinButtonText}>
                      {challenge.participants.includes(currentUser?.id) 
                        ? 'Joined' 
                        : 'Join Challenge'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>

      {/* New Challenge Modal */}
      <Modal
        visible={showNewChallengeForm}
        animationType="slide"
        onRequestClose={() => setShowNewChallengeForm(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowNewChallengeForm(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Create New Challenge</Text>
          
          <NewChallengeForm 
            onSuccess={() => {
              setShowNewChallengeForm(false);
              setActiveTab('challenges');
            }} 
          />
        </View>
      </Modal>
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primary.cream,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent.darkGray,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.accent.lightGray + '20',
  },
  activeTab: {
    backgroundColor: Colors.primary.green + '20',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
  activeTabText: {
    color: Colors.primary.green,
  },
  content: {
    flex: 1,
  },
  feed: {
    padding: 16,
    gap: 16,
  },
  noContentText: {
    textAlign: 'center',
    color: Colors.text.darker,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: 20,
  },
  post: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderText: {
    flex: 1,
  },
  userfullName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
  },
  badgeContainer: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badge: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  commentSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.accent.lightGray,
    paddingTop: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.background.main,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  commentsList: {
    gap: 12,
  },
  commentStatusText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
    backgroundColor: Colors.background.main,
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUserfullName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  challengesContainer: {
    padding: 16,
    gap: 16,
  },
  challengeCard: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  challengeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary.yellow + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.accent.darkGray,
    marginBottom: 8,
  },
  challengeDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  challengeParticipants: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  challengeTimeLeft: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 2,
    marginBottom: 12,
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  joinButton: {
    backgroundColor: Colors.primary.green,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: Colors.accent.darkGray,
  },
  joinButtonText: {
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.modal,
    padding: 10,
    borderRadius: 5,
  },
  postButtonText: {
    marginLeft: 5,
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.background.main,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.modal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.text.primary,
  },
});