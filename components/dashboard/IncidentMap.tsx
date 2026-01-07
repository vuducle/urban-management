import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_APPLE,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const IncidentMap = () => {
  // Example incidents - replace with your actual data
  const incidents = [
    {
      id: '1',
      latitude: 21.0285,
      longitude: 105.8542,
      title: 'Sự cố 1',
    },
    {
      id: '2',
      latitude: 21.0245,
      longitude: 105.8412,
      title: 'Sự cố 2',
    },
    {
      id: '3',
      latitude: 21.0325,
      longitude: 105.8622,
      title: 'Sự cố 3',
    },
  ];

  // Use Apple Maps on iOS, Google Maps on Android
  const provider =
    Platform.OS === 'ios' ? PROVIDER_APPLE : PROVIDER_GOOGLE;

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
        <MapView
          provider={provider}
          style={styles.map}
          initialRegion={{
            latitude: 21.0285,
            longitude: 105.8542,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              coordinate={{
                latitude: incident.latitude,
                longitude: incident.longitude,
              }}
              title={incident.title}
              pinColor={COLORS.primary}
            />
          ))}
        </MapView>

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
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  map: {
    flex: 1,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    right: 12,
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
