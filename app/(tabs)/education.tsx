import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Link } from 'expo-router';
import { BookOpen, MessageSquare, TrendingUp } from 'lucide-react-native';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  type: 'ai' | 'human';
  readTime: string;
};

const articles: Article[] = [
  {
    id: '1',
    title: 'The Impact of Plastic Waste on Nigerian Waterways',
    excerpt: 'Discover how plastic pollution affects our local ecosystems and what we can do about it.',
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
    type: 'human',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Innovative Recycling Solutions for Urban Areas',
    excerpt: 'AI-generated insights on modern recycling techniques for densely populated cities.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    type: 'ai',
    readTime: '3 min read',
  },
  {
    id: '3',
    title: 'Community Success: Lagos Recycling Initiative',
    excerpt: 'How one community transformed their waste management system.',
    image: 'data:image/jpeg;base64,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',
    type: 'human',
    readTime: '4 min read',
  },
];

export default function EducationScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Grow</Text>
        <Text style={styles.subtitle}>Expand your recycling knowledge</Text>
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
          {articles.map((article) => (
            <TouchableOpacity key={article.id} style={styles.articleCard}>
              <Image source={{ uri: article.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <View style={styles.articleMeta}>
                  <View
                    style={[
                      styles.articleType,
                      {
                        backgroundColor:
                          article.type === 'ai' ? Colors.primary.blue + '20' : Colors.primary.green + '20',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.articleTypeText,
                        {
                          color: article.type === 'ai' ? Colors.primary.blue : Colors.primary.green,
                        },
                      ]}>
                      {article.type === 'ai' ? 'AI Generated' : 'Expert Article'}
                    </Text>
                  </View>
                  <Text style={styles.readTime}>{article.readTime}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleExcerpt}>{article.excerpt}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Link href="/features/chatbot" asChild>
      <TouchableOpacity style={styles.chatButton}>
        <MessageSquare size={24} color={Colors.secondary.white} />
        <Text style={styles.chatButtonText}>Ask AI Assistant</Text>
      </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
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
    color: Colors.accent.darkGray,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.secondary.white,
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 16,
  },
  articlesList: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: Colors.secondary.white,
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
    backgroundColor: Colors.primary.blue,
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
});