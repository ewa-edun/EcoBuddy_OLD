import { Tabs } from 'expo-router';
import { Chrome as Home, Recycle, Users, BookOpen, User } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.green,
        tabBarInactiveTintColor: Colors.accent.darkGray,
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wasteSelector"
        options={{
          title: 'Recycle',
          tabBarIcon: ({ color, size }) => <Recycle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}