import { Ionicons } from '@expo/vector-icons';
import { TopHeaderStyles } from '../styles';
import { useRouter } from 'expo-router';

import { Image, Text, TouchableOpacity, View } from 'react-native';

const TopHeader = () => {
  const router = useRouter();
  return (
    <View style={TopHeaderStyles.container}>
      {/* Left section: Contains Avatar and Greeting Text */}
      <View style={TopHeaderStyles.leftSection}>
        <View style={TopHeaderStyles.avatarContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaB18Bs4ig0B5bu4_GjsBCPw25CyGkt9tXPrOyqCupCMLEZFT6YSl40-wosK2ELbKxs3Tch8hm3iZyrnPRBp1T53GW0ZeYfrVHRvYSnt0f2tto7gWLphTp485QL0Z6fpA4VHKLLGcwo-v4fP2s3qoP79SgsOeTmuHSJZWjeCE6KBcw6JEKrNXNI58n4WI5-hw-DgEaTGP9KbW9szCZSg8EaGstwaSEjFJAwK4irjGmiGfFEwHL_yz-5saJ5yxWvEPNRT0kWoiuZg',
            }} // Replace with actual image source later
            style={TopHeaderStyles.avatar}
          />
          {/* Green online status indicator */}
          <View style={TopHeaderStyles.onlineStatus} />
        </View>

        <View style={TopHeaderStyles.textContainer}>
          <Text style={TopHeaderStyles.greeting}>
            Buổi sáng tốt lành,
          </Text>
          <Text style={TopHeaderStyles.name}>Officer Minh</Text>
        </View>
      </View>

      {/* Right section: Notification Bell with Badge */}
      <TouchableOpacity
        onPress={() => router.push('/notifications')}
        style={TopHeaderStyles.notificationButton}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#4A5568"
        />
        <View style={TopHeaderStyles.redDot} />
      </TouchableOpacity>
    </View>
  );
};

export default TopHeader;
