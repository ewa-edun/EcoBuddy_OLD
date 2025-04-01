import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function FeaturesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.secondary.white,
        },
        headerTintColor: Colors.primary.green,
        headerTitleStyle: {
          fontFamily: 'PlusJakartaSans-SemiBold',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="chatbot"
        options={{
          title: 'AI Assistant',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help & Support',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="game"
        options={{
          title: 'Eco Game',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 