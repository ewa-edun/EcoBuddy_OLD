import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
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
    image: 'https://images.unsplash.com/photo-1591193443107-10485832c3d1?w=800',
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

      <TouchableOpacity style={styles.chatButton}>
        <MessageSquare size={24} color={Colors.secondary.white} />
        <Text style={styles.chatButtonText}>Ask AI Assistant</Text>
      </TouchableOpacity>
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