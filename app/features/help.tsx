import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, } from 'react-native';
import { Colors } from '../constants/Colors';
import { ChevronDown, ChevronUp, Mail, Phone, MessageSquare, MapPin, } from 'lucide-react-native';
import { router } from 'expo-router';


type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'How do I use the Waste Selector?',
    answer: 'Simply take a photo of the item you want to dispose of, or select it from our catalog. The Waste Selector will tell you which bin it belongs in and provide recycling tips.',
  },
  {
    question: 'How do I earn Eco Rewards points?',
    answer: 'You can earn points by correctly sorting waste, participating in community events, and completing educational modules. Points can be redeemed for rewards in the Eco Rewards section.',
  },
  {
    question: 'What items can be recycled?',
    answer: 'Common recyclable items include paper, cardboard, plastic bottles, glass containers, and metal cans. Check the Waste Selector for specific items and local recycling guidelines.',
  },
  {
    question: 'How do I join the community?',
    answer: 'Create an account and start participating in community events, sharing tips, and connecting with other eco-conscious users in your area.',
  },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContact = (type: 'email' | 'phone' | 'chat') => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:ecobuddy2025@gmail.com');
        break;
      case 'phone':
        Linking.openURL('tel:+1234567890');
        break;
      case 'chat':
        router.push('/features/chatbot');
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>
          Find answers to common questions and get in touch with us
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFAQ(index)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {expandedIndex === index ? (
                <ChevronUp size={24} color={Colors.accent.darkGray} />
              ) : (
                <ChevronDown size={24} color={Colors.accent.darkGray} />
              )}
            </View>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactGrid}>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('email')}>
            <Mail size={24} color={Colors.primary.green} />
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('phone')}>
            <Phone size={24} color={Colors.primary.green} />
            <Text style={styles.contactText}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('chat')}>
            <MessageSquare size={24} color={Colors.primary.green} />
            <Text style={styles.contactText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Office Location</Text>
        <View style={styles.locationContainer}>
          <MapPin size={24} color={Colors.primary.green} />
          <Text style={styles.locationText}>
          American Corner Ikeja, Vibranium Valley, 42 Local Airport Road,{'\n'} Ikeja, Lagos, Nigeria.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Want to sponsor EcoBuddy and our mission? Kindly contact us through our official email. Thank you very much.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.lightTeal,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.background.main,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    opacity: 0.9,
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
  faqItem: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginTop: 12,
    lineHeight: 20,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contactItem: {
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    padding: 16,
    borderRadius: 12,
    width: '30%',
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    padding: 16,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.background.card,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.secondary.white,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
});