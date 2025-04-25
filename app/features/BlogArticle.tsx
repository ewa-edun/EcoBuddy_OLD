import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { ArrowLeft, Share2, Bookmark, Clock, Calendar, User } from 'lucide-react-native';
import { getDoc, doc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@lib/firebase/firebaseConfig';
import LoadingSpinner from '../components/LoadingSpinner';
//import { LinearGradient } from 'expo-linear-gradient';
//import Markdown from 'react-native-markdown-display';

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string | any[]; // Can be string or array of sections
  author: string;
  authorId: string;
  date: Timestamp;
  views: number;
  readingTime: string;
  lastUpdated?: Timestamp;
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
          router.back();
          return;
        }
        
        const articleData = articleDoc.data();
        setArticle({
          id: articleDoc.id,
          ...articleData,
          // Ensure author data exists
        author: articleData.author || {
          name: 'EcoBuddy Team',
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
        
        // Fetch related articles
        // In a real app, you'd implement a more sophisticated recommendation system
        // For now, we'll just get 3 random articles from the same category
        if (articleData.category) {
          // This is a simplified approach - in production you'd use a more efficient query
          // const relatedDocs = await getDocs(
          //   query(
          //     collection(db, 'blogArticles'),
          //     where('category', '==', articleData.category),
          //     where('id', '!=', params.id),
          //     limit(3)
          //   )
          // );
          
          // const relatedData: any[] = [];
          // relatedDocs.forEach((doc) => {
          //   relatedData.push({
          //     id: doc.id,
          //     ...doc.data()
          //   });
          // });
          
          // setRelatedArticles(relatedData);
          
          // For now, use hardcoded related articles
          setRelatedArticles([
            {
              id: 'related1',
              title: 'Global Recycling Trends in 2024',
              image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
              author: 'Sarah Bunmi'
            },
            {
              id: 'related2',
              title: 'How To Start Composting At Home',
              image: 'https://images.unsplash.com/photo-1595163788995-a027797fd8b2',
              author: 'Mike Chukuwunonye'
            },
            {
              id: 'related3',
              title: 'Plastic-Free Kitchen Swaps',
              image: 'https://images.unsplash.com/photo-1590136019848-8d650328b645',
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

// Add a function to format the date
const formatDate = (timestamp: Timestamp | string | null) => {
  if (!timestamp) return 'Unknown date';
  
  // Check if it's a Firestore Timestamp
  if (timestamp instanceof Timestamp) {
    // Convert to JavaScript Date
    const date = timestamp.toDate();
    // Format the date (you can adjust the format as needed)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // If it's already a string, just return it
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
          source={{ uri: article.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b' }} 
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
            <Text style={styles.metaText}>{article.author?.name || 'EcoBuddy Team'}</Text>
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
  {article.content && Array.isArray(article.content) ? (
    // If we have structured content, render it properly
    article.content.map((section: any, index: number) => (
      <View key={index} style={styles.section}>
        {section.title && (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        {section.paragraphs && section.paragraphs.map((paragraph: string, pIndex: number) => (
          <Text key={pIndex} style={styles.paragraph}>{paragraph}</Text>
        ))}
        {section.image && (
          <Image source={{ uri: (require('../../assets/user icon.png')) }} style={styles.contentImage} />
        )}
        {section.caption && (
          <Text style={styles.imageCaption}>{section.caption}</Text>
        )}
      </View>
            ))
          ) : (
            // Fallback to a default article structure
            <>
              <Text style={styles.paragraph}>
                Climate change is one of the most pressing issues of our time. The Earth's climate has always changed naturally over thousands or millions of years, but what we're experiencing now is happening much faster, and humans are causing it.
              </Text>
              <Text style={styles.paragraph}>
                The primary driver of today's warming is the release of carbon dioxide and other greenhouse gases through human activities like burning fossil fuels, deforestation, and industrial processes. These gases trap heat in the atmosphere, leading to global warming and climate change.
              </Text>
              <Text style={styles.sectionTitle}>The Impact on Our Environment</Text>
              <Text style={styles.paragraph}>
                The effects of climate change are far-reaching and increasingly severe. Rising temperatures lead to melting ice caps and glaciers, resulting in sea level rise that threatens coastal communities. Extreme weather events like hurricanes, droughts, and floods are becoming more frequent and intense.
              </Text>
              <Text style={styles.paragraph}>
                Ecosystems and wildlife are also being disrupted. Many species are struggling to adapt to rapidly changing conditions, leading to biodiversity loss. Some areas are experiencing changes in growing seasons, impacting agriculture and food security.
              </Text>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce' }} 
                style={styles.contentImage} 
              />
              <Text style={styles.imageCaption}>Melting glaciers are one visible effect of climate change</Text>
              <Text style={styles.sectionTitle}>What Can We Do?</Text>
              <Text style={styles.paragraph}>
                While the challenge is immense, there are steps we can all take to help combat climate change. Transitioning to renewable energy sources like solar and wind power is crucial for reducing greenhouse gas emissions. Energy efficiency measures in homes and buildings can also make a significant difference.
              </Text>
              <Text style={styles.paragraph}>
                On an individual level, we can reduce our carbon footprint by choosing sustainable transportation options, consuming less meat, reducing waste, and supporting businesses and policies that prioritize environmental sustainability.
              </Text>
              <Text style={styles.paragraph}>
                By working together at all levels of society—from individual choices to corporate decisions to government policies—we can address climate change and create a more sustainable future for our planet.
              </Text>
            </>
          )}
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