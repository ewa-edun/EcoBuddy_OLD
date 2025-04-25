import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Share, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { Heart, MessageCircle, Share2, Award, Users, Trophy, Plus, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { db, auth } from '@lib/firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

type Post = {
  id: string;
  user?: {
    name: string;
    avatar: string;
    badge: string;
    id: string;
  };
  content: string;
  image?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: number;
  timestamp: string;
  commentsData?: Comment[];
};

type Comment = {
  id: string;
  postId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  timestamp: string;
};

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCommentPosts, setExpandedCommentPosts] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});
  const [hasMoreComments, setHasMoreComments] = useState<{ [key: string]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || "EcoBuddy User",
          avatar: user.photoURL || "https://placehold.co/100x100",
          badge: "Member" // You can fetch this from a user profile collection if needed
        });
      }
    });

    // Fetch posts from Firestore
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          user: data.author || { // Fallback to anonymous if author data missing
            name: "EcoBuddy User",
            avatar: "https://placehold.co/100x100",
            badge: "Member",
            id: data.authorId || "unknown"
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

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const updatedLikes = post.likes.includes(userId)
      ? post.likes.filter((id) => id !== userId)
      : [...post.likes, userId];

    await updateDoc(postRef, { likes: updatedLikes });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check Out my post on EcoBuddy and start your eco-friendly journey!`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const handlePost = () => {
    router.replace('/features/createPost');
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
            name: "EcoBuddy User",
            avatar: "https://placehold.co/100x100",
            badge: "Member"
          },
          content: data.content,
          timestamp: data.createdAt?.toDate().toLocaleString() || "Just now",
        };
      });
      
      // Update the post with comments
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentsData: comments
          };
        }
        return post;
      }));
      
      // Set if there are more comments than what's loaded
      setHasMoreComments({
        ...hasMoreComments,
        [postId]: comments.length < (posts.find(p => p.id === postId)?.comments || 0)
      });
      
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments({...loadingComments, [postId]: false});
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText[postId]?.trim() || !currentUser) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    try {
      // Create comment in Firestore
      const newComment = {
        postId,
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          badge: currentUser.badge
        },
        content: commentText[postId],
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'comments'), newComment);
      
      // Update post's comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: (post.comments || 0) + 1
      });
      
      // Clear input
      setCommentText({...commentText, [postId]: ''});
      
      // Reload comments to show the new one
      await loadComments(postId);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
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
                      onPress={() => handleLike(post.id)}>
                      <Heart
                        size={20}
                        color={
                          currentUser && post.likes.includes(currentUser.id)
                            ? Colors.primary.green
                            : Colors.accent.darkGray
                        }
                      />
                      <Text style={styles.actionText}>{post.likes.length}</Text>
                    </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => toggleComments(post.id)}>
                    <MessageCircle size={20} color={expandedCommentPosts.includes(post.id) ? Colors.primary.green : Colors.accent.darkGray} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Share2 size={20} color={Colors.accent.darkGray} />
                  </TouchableOpacity>
                </View>
                
                {/* Comment Section */}
                {expandedCommentPosts.includes(post.id) && (
                  <View style={styles.commentSection}>
                    {/* Comment Input */}
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
                        <Send size={20} color={commentText[post.id]?.trim() ? Colors.primary.green : Colors.accent.lightGray} />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Comment List */}
                    <View style={styles.commentsList}>
                      {loadingComments[post.id] ? (
                        <Text style={styles.commentStatusText}>Loading comments...</Text>
                      ) : post.commentsData?.length ? (
                        <>
                          {post.commentsData.map((comment) => (
                            <View key={comment.id} style={styles.commentItem}>
                              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                              <View style={styles.commentContent}>
                                <View style={styles.commentHeader}>
                                  <Text style={styles.commentUserName}>{comment.user.name}</Text>
                                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                                </View>
                                <Text style={styles.commentText}>{comment.content}</Text>
                              </View>
                            </View>
                          ))}
                          
                          {hasMoreComments[post.id] && (
                            <TouchableOpacity onPress={() => loadComments(post.id)}>
                              <Text style={styles.loadMoreText}>
                                Click to load more comments
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <Text style={styles.commentStatusText}>No comments yet. Be the first to comment!</Text>
                      )}
                    </View>
                  </View>
                )}
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
  commentUserName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    paddingLeft: 2,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  loadMoreText: {
    textAlign: 'center',
    color: Colors.primary.green,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    marginTop: 8,
    padding: 8,
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