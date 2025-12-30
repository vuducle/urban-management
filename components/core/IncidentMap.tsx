import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const IncidentMap = () => {
  return (
    <View style={styles.wrapper}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Bản đồ sự cố</Text>
        <TouchableOpacity>
          <Text style={styles.expandText}>Mở rộng</Text>
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <ImageBackground
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqPgCo-aBg45sE1k7veJtSp6zTgaua738vvP9d-hbSVZB05kQn_kB4VMaQ9EEElyERGcw4GNd7qc6RECUFHbAO2f31nZ7qUXrUmp94FMNrIqgT1dLQMJLTMkL0z8Uc2z5mSv3W6saCytnarEIieSxU6J8Q8NkOmWjYxAcgTWtKCVL9owlOqDPeVzwyqPzRFQwz2fCSQ4i7TbMEFw8d__JQptGMyzcmfNHLDMR6iatTAGwKyuxO1ISlo_E82V9OkPdQw8wh5MMAEw',
          }} // Replace with actual Map screenshot or real Google Maps
          style={styles.mapImage}
          imageStyle={{ borderRadius: 20 }}
        >
          {/* Details Button - bottom right */}
          <TouchableOpacity style={styles.detailsButton}>
            <Entypo
              name="map"
              size={18}
              color={COLORS.primary}
              style={styles.buttonIcon}
            />
            <Text style={styles.detailsText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  expandText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    height: 180,
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    ...SHADOWS.md,
  },
  mapImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  buttonIcon: {
    marginRight: 8,
  },
  detailsText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray800,
  },
});

export default IncidentMap;
