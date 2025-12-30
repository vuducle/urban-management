import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_APPLE } from 'react-native-maps';

interface LocationResult {
  address: string;
  latitude: number;
  longitude: number;
  name?: string;
}

export default function CreateReportModal() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 10.7769, // Ho Chi Minh City
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    LocationResult[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search locations using Expo Location Geocoding
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Use Expo Location Geocoding for address search
      const results = await Location.geocodeAsync(query);

      if (results && results.length > 0) {
        const mapped = results.slice(0, 5).map((result, index) => ({
          address: query, // Fallback to search query as address
          latitude: result.latitude,
          longitude: result.longitude,
          name: `${result.latitude.toFixed(
            4
          )}, ${result.longitude.toFixed(4)}`,
        }));
        setSearchResults(mapped);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection from search results
  const selectLocation = (location: LocationResult) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setShowSuggestions(false);

    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (results && results.length > 0) {
        const result = results[0];
        const address = `${
          result.street ? result.street + ', ' : ''
        }${result.district ? result.district + ', ' : ''}${
          result.city ? result.city : ''
        }`;
        setSearchQuery(address);
        setSelectedLocation({
          address,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Vị trí sự cố</Text>

      <View style={styles.mapCard}>
        <View style={styles.mapPlaceholder}>
          <MapView
            ref={mapRef}
            provider={
              Platform.OS === 'ios' ? PROVIDER_APPLE : undefined
            }
            style={styles.mapImage}
            region={region}
            onRegionChangeComplete={(newRegion) =>
              setRegion(newRegion)
            }
          >
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

        {/* SEARCH LOCATION INPUT */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: SPACING.md }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm địa điểm (vd: Yoshiyoshi Ho Chi Minh)..."
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() =>
                searchResults.length > 0 && setShowSuggestions(true)
              }
              placeholderTextColor={COLORS.gray400}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
              />
            )}
          </View>

          {/* SEARCH RESULTS DROPDOWN */}
          {showSuggestions && searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectLocation(item)}
                >
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={COLORS.primary}
                    style={{ marginRight: SPACING.md }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={styles.suggestionText}
                      numberOfLines={1}
                    >
                      {item.address}
                    </Text>
                    <Text style={styles.suggestionMeta}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.suggestionsDropdown}
            />
          )}
        </View>
      </View>

      {/* SECTION: Image Upload */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Hình ảnh hiện trường</Text>
        <Text style={styles.counter}>0/5</Text>
      </View>
      <TouchableOpacity style={styles.uploadBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera" size={30} color={COLORS.primary} />
        </View>
        <Text style={styles.uploadText}>Chụp ảnh / Tải lên</Text>
        <Text style={styles.uploadSub}>
          Định dạng JPG, PNG tối đa 10MB
        </Text>
      </TouchableOpacity>

      {/* SECTION: Details Form */}
      <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

      <Text style={styles.label}>
        Tiêu đề phản ánh{' '}
        <Text style={{ color: COLORS.danger }}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Hố ga bị vỡ gây nguy hiểm"
      />

      <Text style={styles.label}>
        Nội dung phản ánh{' '}
        <Text style={{ color: COLORS.danger }}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="Mô tả chi tiết sự việc..."
      />

      <Text style={styles.label}>Thời gian</Text>
      <View style={styles.datePicker}>
        <Text>10:30 - 24/05/2024</Text>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={COLORS.gray500}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn}>
        <Ionicons name="send" size={18} color="white" />
        <Text style={styles.submitText}>Gửi Phản ánh</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  content: { padding: SPACING.lg },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  mapCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.sm,
    marginBottom: SPACING.xl,
  },
  addressLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: '700',
  },
  addressText: { fontSize: 13, color: COLORS.gray800 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: { color: COLORS.slate },
  uploadBox: {
    height: 160,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
    backgroundColor: 'white',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  uploadSub: { fontSize: 12, color: COLORS.slate },
  label: {
    marginTop: SPACING.lg,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    ...SHADOWS.md,
  },
  submitText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray900,
  },
  suggestionsDropdown: {
    maxHeight: 250,
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray900,
  },
  suggestionMeta: {
    fontSize: 11,
    color: COLORS.gray500,
    marginTop: 4,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  addressRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
});
