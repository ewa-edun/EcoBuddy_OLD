import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Send } from 'lucide-react-native';
import { getGeminiResponse } from '@lib/gemini/geminiService';
import FloatingDots from '../components/FloatingDots';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@lib/firebase/firebaseConfig';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatbotScreen() {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your EcoBuddy AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Fetch bot response from Gemini API
    try {
      const botResponseText = (await getGeminiResponse(inputText)).join(' ');
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);

      // Scroll to bottom after bot response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I could not fetch a response at this time.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserAvatar(userDoc.data().photoURL || null);
        }
      }
    };
    
    fetchUserAvatar();
  }, []);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;
  
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setUserAvatar(doc.data().photoURL || null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContentContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}>
            <View style={styles.messageIcon}>
              {message.sender === 'user' ? (
                 <Image
                 source={userAvatar ? 
                   { uri: userAvatar } : 
                   require('../../assets/user icon.png')
                 }
                 style={styles.avatar}
                 onError={() => setUserAvatar(null)}
               />
              ) : (
                <Image
                  source={require('../../assets/EcoBuddy_logo.jpeg')}
                  style={styles.botIcon}
                />
              )}
            </View>
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user'
                  ? styles.userBubble
                  : styles.botBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'user'
                    ? styles.userMessageText
                    : styles.botMessageText,
                ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {loading && <FloatingDots />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about recycling..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim()}>
          <Send size={24} color={Colors.secondary.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContentContainer: {
    padding: 13,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20, // Ensure rounded corners
    backgroundColor: Colors.accent.lightGray, // Fallback color
  },
  botIcon: {
    width: '100%',
    height: '100%',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.primary.green,
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.primary.blue,
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  userMessageText: {
    color: Colors.secondary.white,
  },
  botMessageText: {
    color: Colors.secondary.white,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: Colors.background.main,
    borderTopWidth: 1,
    borderTopColor: Colors.background.main,
    paddingBottom: Platform.OS === 'ios' ? 25 : 16,
    bottom: 55, 
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.accent.lightGray,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    maxHeight: 130,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 10,
    backgroundColor: Colors.primary.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});