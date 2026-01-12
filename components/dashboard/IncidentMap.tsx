import { COLORS } from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import { IncidentMapStyles } from '../../assets/styles';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
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
    <View style={IncidentMapStyles.wrapper}>
      {/* Header Section */}
      <View style={IncidentMapStyles.header}>
        <Text style={IncidentMapStyles.title}>Bản đồ sự cố</Text>
        <TouchableOpacity>
          <Text style={IncidentMapStyles.expandText}>Mở rộng</Text>
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={IncidentMapStyles.mapContainer}>
        <MapView
          provider={provider}
          style={IncidentMapStyles.map}
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
        <TouchableOpacity style={IncidentMapStyles.detailsButton}>
          <Entypo
            name="map"
            size={18}
            color={COLORS.primary}
            style={IncidentMapStyles.buttonIcon}
          />
          <Text style={IncidentMapStyles.detailsText}>
            Xem chi tiết
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncidentMap;
