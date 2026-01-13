import React from 'react';
import { View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { ModalStyles } from '@/assets/styles';

interface OSMMapSectionProps {
  mapRef: React.RefObject<MapView | null>;
  region: any;
  selectedLocation: any;
  onRegionChange: (region: any) => void;
}

export const OSMMapSection = ({
  mapRef,
  region,
  selectedLocation,
  onRegionChange,
}: OSMMapSectionProps) => {
  const osmUrlTemplate =
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <View style={ModalStyles.mapPlaceholder}>
      <MapView
        ref={mapRef}
        style={ModalStyles.mapImage}
        region={region}
        onRegionChangeComplete={onRegionChange}
      >
        <UrlTile urlTemplate={osmUrlTemplate} maximumZ={19} />

        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Vị trí sự cố"
          />
        )}
      </MapView>
    </View>
  );
};
