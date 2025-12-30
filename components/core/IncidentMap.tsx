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
              color="#3B82F6"
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
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
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
    color: '#1E293B',
  },
  expandText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    // Shadow/Elevation
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    // Button Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  detailsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
});

export default IncidentMap;
