import { COLORS } from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import { IncidentMapStyles } from '../../assets/styles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

const IncidentMap = () => {
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

  // OSM Tile Server URL
  const osmUrlTemplate =
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <View style={IncidentMapStyles.wrapper}>
      <View style={IncidentMapStyles.header}>
        <Text style={IncidentMapStyles.title}>
          Bản đồ sự cố (OSM)
        </Text>
        <TouchableOpacity>
          <Text style={IncidentMapStyles.expandText}>Mở rộng</Text>
        </TouchableOpacity>
      </View>

      <View style={IncidentMapStyles.mapContainer}>
        <MapView
          style={IncidentMapStyles.map}
          initialRegion={{
            latitude: 21.0285,
            longitude: 105.8542,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <UrlTile
            urlTemplate={osmUrlTemplate}
            maximumZ={19}
            flipY={false}
          />

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
