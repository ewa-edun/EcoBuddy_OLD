import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import {useState, useEffect} from 'react';
import { Colors } from '../constants/Colors';
import { Link, router } from 'expo-router';
import { BookOpen, MessageSquare, TrendingUp, Plus } from 'lucide-react-native';
import { query, collection, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';
import React from 'react';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string; // Changed from image to imageUrl to match CreateBlogArticle
  type: 'ai' | 'human';
  readingTime: string;
  category: 'Sustainability' | 'Recycling' | 'Community' | 'Technology';
};

export default function EducationScreen() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(
        collection(db, 'blogArticles'),
        orderBy('date', 'desc'),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const fetchedArticles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        excerpt: doc.data().excerpt,
        imageUrl: doc.data().imageUrl, // Changed from image to imageUrl
        type: doc.data().type || 'human',
        readingTime: doc.data().readingTime,
        category: doc.data().category || 'Sustainability'
      }));
      setArticles(fetchedArticles);
    };

    fetchArticles();
    setLoading(false);
  }, []);
  
  const getCategoryColor = (category: 'Sustainability' | 'Recycling' | 'Community' | 'Technology') => {
    const colors = {
      'Sustainability': Colors.primary.green + '70',
      'Recycling': Colors.primary.blue + '60',
      'Community': Colors.secondary.yellow + '70',
      'Technology': Colors.primary.red + '60',
    };
    return colors[category] || Colors.primary.green + '20';
  };

  const handlePost = () => {
    router.replace('/features/createBlogArticle');
  };

  // Default image in case article doesn't have one
  const defaultImage = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Grow</Text>
        <Text style={styles.subtitle}>Expand your recycling knowledge</Text>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Plus size={20} color={Colors.text.primary} />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BookOpen size={24} color={Colors.primary.green} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Articles Read</Text>
        </View>
        <View style={styles.statCard}>
          <MessageSquare size={24} color={Colors.primary.blue} />
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Discussions</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color={Colors.secondary.yellow} />
          <Text style={styles.statValue}>Level 3</Text>
          <Text style={styles.statLabel}>Knowledge</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        <View style={styles.articlesList}>
        {articles?.length > 0 ? (
          articles.map((article) => (
            <TouchableOpacity 
            key={article.id} 
            style={styles.articleCard}
            onPress={() => router.push(`/features/BlogArticle?id=${article.id}`)}
          >
            <Image 
              source={{ uri: article.imageUrl || defaultImage }} 
              style={styles.articleImage} 
            />
            <View style={styles.articleContent}>
              <View style={styles.articleMeta}>
                <View style={[
                 styles.categoryPill,
                 { backgroundColor: getCategoryColor(article.category) }
               ]}>
                  <Text style={styles.categoryText}>{article.category}</Text>
                </View>
                <Text style={styles.readTime}>{article.readingTime}</Text>
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
            </View>
          </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noArticle}>No articles found</Text>
        )}
        </View>
      </View>

      <Link href="/features/chatbot" asChild>
      <TouchableOpacity style={styles.chatButton}>
        <MessageSquare size={24} color={Colors.primary.green} />
        <Text style={styles.chatButtonText}>Ask AI Assistant</Text>
      </TouchableOpacity>
      </Link>
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  noArticle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 16,
  },
  articlesList: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  articleType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  articleTypeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  readTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.primary,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    lineHeight: 20,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.modal,
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  chatButtonText: {
    color: Colors.secondary.white,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
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