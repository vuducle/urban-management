import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TopHeader = () => {
  return (
    <View style={styles.container}>
      {/* Left section: Contains Avatar and Greeting Text */}
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaB18Bs4ig0B5bu4_GjsBCPw25CyGkt9tXPrOyqCupCMLEZFT6YSl40-wosK2ELbKxs3Tch8hm3iZyrnPRBp1T53GW0ZeYfrVHRvYSnt0f2tto7gWLphTp485QL0Z6fpA4VHKLLGcwo-v4fP2s3qoP79SgsOeTmuHSJZWjeCE6KBcw6JEKrNXNI58n4WI5-hw-DgEaTGP9KbW9szCZSg8EaGstwaSEjFJAwK4irjGmiGfFEwHL_yz-5saJ5yxWvEPNRT0kWoiuZg',
            }} // Replace with actual image source later
            style={styles.avatar}
          />
          {/* Green online status indicator */}
          <View style={styles.onlineStatus} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Buổi sáng tốt lành,</Text>
          <Text style={styles.name}>Officer Minh</Text>
        </View>
      </View>

      {/* Right section: Notification Bell with Badge */}
      <TouchableOpacity style={styles.notificationButton}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#4A5568"
        />
        <View style={styles.redDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS['2xl'],
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray300,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  textContainer: {
    marginLeft: SPACING.md,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E', // Notification red
  },
});

export default TopHeader;
