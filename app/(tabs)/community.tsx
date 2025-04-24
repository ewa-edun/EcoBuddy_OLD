import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Heart, MessageCircle, Share2, Award, Users, Trophy, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { db } from '@lib/firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
//import UserIcon from '@assets/user icon.png'; // Adjust path as needed

type Post = {
  id: string;
  user?: {
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  image?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: number;
  timestamp: string;
};

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts from Firestore
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          user: {
            name: data.username || "Anonymous", // Fallback if username missing
            avatar: data.user?.avatar || "https://placehold.co/100x100", // Fallback avatar
            badge: data.user?.badge || "Member", // Fallback badge
          },
          content: data.content,
          image: data.imageUrl || undefined,
          likes: data.likes || [],
          comments: data.comments || 0,
          timestamp: data.createdAt?.toDate().toLocaleString() || "Just now",
        };
      }) as Post[];
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId: string, userId: string) => {
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const updatedLikes = post.likes.includes(userId)
      ? post.likes.filter((id) => id !== userId)
      : [...post.likes, userId];

    await updateDoc(postRef, { likes: updatedLikes });
  };

  const handlePost = () => {
    router.replace('/features/createPost');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with eco-warriors</Text>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Plus size={20} color={Colors.text.primary} />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>2.4K</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>#12</Text>
          <Text style={styles.statLabel}>Your Rank</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => setActiveTab('feed')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'feed' && styles.activeTabText,
            ]}>
            Community Feed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'challenges' && styles.activeTabText,
            ]}>
            Active Challenges
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'feed' ? (
          <View style={styles.feed}>
            {loading ? (
              <Text style={{ color:Colors.primary.green, textAlign: 'center', marginTop: 20 }}>Loading...</Text>
            ) : posts.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No posts available</Text>
            ) : null}
            {posts.map((post) => (
              <View key={post.id} style={styles.post}>
                <View style={styles.postHeader}>
                <Image 
               source={{ uri: post.user?.avatar || "https://placehold.co/100x100" }} 
               style={styles.avatar} 
                />
                  <View style={styles.postHeaderText}>
                <Text style={styles.userName}>{post.user?.name || "EcoBuddy User"}</Text>
                  <View style={styles.badgeContainer}>
                     <Text style={styles.badge}>{post.user?.badge ?? "Member"}</Text>
                  </View>
                </View>
                  <Text style={styles.timeAgo}>{post.timestamp}</Text>
              </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                )}
                <View style={styles.postActions}>
                <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id, 'currentUserId')}>
                      <Heart
                        size={20}
                        color={
                          post.likes.includes('currentUserId')
                            ? Colors.primary.green
                            : Colors.accent.darkGray
                        }
                      />
                      <Text style={styles.actionText}>{post.likes.length}</Text>
                    </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color={Colors.accent.darkGray} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color={Colors.accent.darkGray} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.challengesContainer}>
            <TouchableOpacity style={styles.challengeCard}>
              <View style={styles.challengeBadge}>
                <Trophy size={24} color={Colors.secondary.yellow} />
              </View>
              <Text style={styles.challengeTitle}>30-Day Recycling Sprint</Text>
              <Text style={styles.challengeDesc}>
                Recycle 100kg of waste in 30 days to earn special badges and 2000 bonus points!
              </Text>
              <View style={styles.challengeMeta}>
                <Text style={styles.challengeParticipants}>1.2K participants</Text>
                <Text style={styles.challengeTimeLeft}>20 days left</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '60%' }]} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.challengeCard}>
              <View style={[styles.challengeBadge, { backgroundColor: Colors.primary.blue + '20' }]}>
                <Users size={24} color={Colors.primary.blue} />
              </View>
              <Text style={styles.challengeTitle}>Community Clean-up</Text>
              <Text style={styles.challengeDesc}>
                Join forces with your community to clean up local areas and earn rewards together!
              </Text>
              <View style={styles.challengeMeta}>
                <Text style={styles.challengeParticipants}>856 participants</Text>
                <Text style={styles.challengeTimeLeft}>5 days left</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '80%', backgroundColor: Colors.primary.blue }]} />
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  userName: {
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
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary.green,
    borderRadius: 2,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.modal,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  postButtonText: {
    marginLeft: 5,
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});
