// hooks/useLocationManager.ts
import { useState } from 'react';
import * as Location from 'expo-location';

interface LocationType {
  address: string;
  latitude: number;
  longitude: number;
}

export const useLocationManager = () => {
  const [region, setRegion] = useState({
    latitude: 10.7769,
    longitude: 106.7009,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [selectedLocation, setSelectedLocation] =
    useState<LocationType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (results.length > 0) {
        const r = results[0];
        const addr = `${r.street || ''} ${r.district || ''}, ${
          r.city || ''
        }`.trim();
        setSearchQuery(addr);
        setSelectedLocation({
          address: addr,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    const { status } =
      await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted')
      return alert('Access to location denied');

    const loc = await Location.getCurrentPositionAsync({});
    const newRegion = {
      ...region,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setRegion(newRegion);
    await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
    setLoading(false);
  };

  return {
    region,
    setRegion,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    loading,
    getCurrentLocation,
    reverseGeocode,
  };
};
