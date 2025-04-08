import { Tabs } from 'expo-router';
import { Home, Recycle, Gift, BookOpen, Users, User } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.beige,
        tabBarInactiveTintColor: Colors.secondary.white,
        
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 9,
          paddingTop: 6,
          backgroundColor: Colors.background.main, // Teal background
          borderTopWidth: 0, // Removes default border
          elevation: 0, 
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
        name="ecoRewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, size }) => <Gift size={size} color={color} />,
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
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
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