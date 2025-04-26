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
      <Stack.Screen
        name="claimRewards"
        options={{
          title: 'Claim Rewards',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="createBlogArticle"
        options={{
          title: 'Create Blog Article',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createPost"
        options={{
          title: 'Create Post',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="referrals"
        options={{
          title: 'Referrals',
          headerShown: true,
        }}
      />
       <Stack.Screen
        name="wasteHistory"
        options={{
          title: 'Waste History',
          headerShown: true,
        }}
      />
       <Stack.Screen
        name="wasteSchedule"
        options={{
          title: 'Waste Schedule',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="charity"
        options={{
          title: 'Charity/Donations',
          headerShown: true,
        }}
      />
      <Stack.Screen
      name="kiosk"
      options={{
        title: 'Mobile Kiosk',
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="BlogArticle"
      options={{
        title: 'Blog Article',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="newChallengeForm"
      options={{
        title: 'Challenge Form',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="challengeDetails"
      options={{
        title: 'Challenge Details',
        headerShown: false,
      }}
    />
    </Stack>
  );
} 