import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ArrowLeft, Share2, Bookmark, Clock, Calendar, User } from 'lucide-react-native';
import { getDoc, doc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase/firebaseConfig';
import LoadingSpinner from '../components/LoadingSpinner';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  category: string;
  author: {
    fullName: string;
    id: string;
    avatar: string | null;
  };
  date: Timestamp;
  views: number;
  readingTime: string;
}

type BlogArticleParams = {
  id: string;
};

const BlogArticle = () => {
  const params = useLocalSearchParams<BlogArticleParams>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!params.id) {
        router.back();
        return;
      }

      try {
        const articleDoc = await getDoc(doc(db, 'blogArticles', params.id));
        
        if (!articleDoc.exists()) {
          console.error('Article not found');
          router.push('/(tabs)/education');
          setLoading(false);
          return;
        }
        
        const articleData = articleDoc.data();
        
        // Set the article with all its data
        setArticle({
          id: articleDoc.id,
          ...articleData,
          // Ensure author data exists
          author: articleData.author || {
            fullName: 'EcoBuddy Team',
            avatar: null
          }
        });
        
        // Increment view count
        await updateDoc(doc(db, 'blogArticles', params.id), {
          views: increment(1)
        });
        
        // Check if user has bookmarked this article
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const bookmarks = userData.bookmarkedArticles || [];
            setBookmarked(bookmarks.includes(params.id));
          }
        }
        
        // Fetch related articles with the same category
        if (articleData.category) {
          // For now, use hardcoded related articles
 // In a production app, you would query Firestore for articles with the same category
          setRelatedArticles([
            {
              id: 'related1',
              title: 'Global Recycling Trends in 2024',
              image: 'https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png',
              author: 'Sarah Bunmi'
            },
            {
              id: 'related2',
              title: 'How To Start Composting At Home',
              image: 'https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png',
              author: 'Mike Chukuwunonye'
            },
            {
              id: 'related3',
              title: 'Plastic-Free Kitchen Swaps',
              image: 'https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/user-avatars//ecobuddy-adaptive-icon.png',
              author: 'Bello Susan'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [params.id]);

  const handleBookmark = async () => {
    if (!auth.currentUser) {
      router.push('/(auth)/login');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const bookmarks = userData.bookmarkedArticles || [];
        
        if (bookmarked) {
          // Remove from bookmarks
          const updatedBookmarks = bookmarks.filter((id: string) => id !== params.id);
          await updateDoc(userRef, {
            bookmarkedArticles: updatedBookmarks
          });
        } else {
          // Add to bookmarks
          const updatedBookmarks = [...bookmarks, params.id];
          await updateDoc(userRef, {
            bookmarkedArticles: updatedBookmarks
          });
        }
        
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
  };

  // Format the date
  const formatDate = (timestamp: Timestamp | string | null) => {
    if (!timestamp) return 'Unknown date';
    
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    return 'Unknown date';
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article on EcoBuddy: ${article.title}\n\nDownload EcoBuddy to read more!`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const navigateToRelatedArticle = (articleId: string) => {
    router.push(`/features/BlogArticle?id=${articleId}`);
  };

  if (loading) {
    return <LoadingSpinner text="Loading article..." />;
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Article not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/(tabs)/education')}
        >
          <ArrowLeft size={24} color={Colors.text.darker} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleBookmark}
          >
            <Bookmark 
              size={24} 
              color={bookmarked ? Colors.primary.green : Colors.text.darker} 
              fill={bookmarked ? Colors.primary.green : 'transparent'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
          >
            <Share2 size={24} color={Colors.text.darker} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroSection}>
        <Image 
          source={{ 
            uri: article.imageUrl || 
                 'https://xrhcligrahuvtfolotpq.supabase.co/storage/v1/object/public/blog-images//EcoBuddy_logo.jpeg' 
          }} 
          style={styles.heroImage} 
        />
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{article.category || 'Sustainability'}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <User size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{article.author?.fullName || 'EcoBuddy Team'}</Text>
          </View>
          <View style={styles.metaItem}>
             <Calendar size={16} color={Colors.text.secondary} />
             <Text style={styles.metaText}>{formatDate(article.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{article.readingTime || '5 min read'}</Text>
          </View>
        </View>

        {/* Main article content */}
        <View style={styles.articleContent}>
          {/* Display the actual content */}
          <Text style={styles.paragraph}>{article.content}</Text>
        </View>

        {/* Related articles section */}
        <View style={styles.relatedArticlesSection}>
          <Text style={styles.relatedTitle}>Related Articles</Text>
          <View style={styles.relatedArticlesContainer}>
            {relatedArticles.map((article, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.relatedArticleCard}
                onPress={() => navigateToRelatedArticle(article.id)}
              >
                <Image 
                  source={{ uri: article.image }} 
                  style={styles.relatedArticleImage} 
                />
                <View style={styles.relatedArticleContent}>
                  <Text style={styles.relatedArticleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.relatedArticleAuthor}>{article.author}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
  },
  backButtonText: {
    color: Colors.primary.green,
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
  },
  heroSection: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  categoryPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: Colors.text.primary,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  articleContent: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    lineHeight: 24,
    marginBottom: 16,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
  },
  imageCaption: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Italic',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  relatedArticlesSection: {
    marginTop: 16,
  },
  relatedTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
    marginBottom: 16,
  },
  relatedArticlesContainer: {
    gap: 16,
  },
  relatedArticleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    height: 100,
  },
  relatedArticleImage: {
    width: 100,
    height: '100%',
  },
  relatedArticleContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  relatedArticleTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.text.darker,
  },
  relatedArticleAuthor: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
    marginBottom: 16,
  },
});

export default BlogArticle;