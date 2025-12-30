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
    padding: 16,
    backgroundColor: '#F7FAFC', // Light background color from the image
    borderRadius: 20,
    marginHorizontal: 10,
    marginTop: 10,
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
    backgroundColor: '#CBD5E0',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#48BB78', // Online green
    borderWidth: 2,
    borderColor: '#FFFFFF', // White border to make it pop
  },
  textContainer: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#718096', // Muted grey text
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C', // Dark text for the name
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS/Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
