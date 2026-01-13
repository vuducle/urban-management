import { COLORS, SPACING } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { ModalStyles } from '@/assets/styles';

import ARCameraView from '@/components/core/ARCameraView';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ImageUploadSection } from '@/components/ui/ImageUploadSection';
import { OSMMapSection } from '@/components/ui/OSMMapSection';
import { useLocationManager } from '@/hooks/use-location-manager';

interface UploadedImage {
  uri: string;
  type: string;
  name: string;
}

export default function CreateReportModal() {
  const mapRef = useRef<MapView>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isARMode, setIsARMode] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    Array<{
      address: string;
      latitude: number;
      longitude: number;
      name?: string;
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    region,
    setRegion,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    loading,
    getCurrentLocation,
    reverseGeocode,
  } = useLocationManager();

  if (isARMode) {
    return (
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('🚨 AR MODE CRASHED:');
          console.error('Error:', error.message);
          console.error('Stack:', error.stack);
          console.error('Component Stack:', errorInfo.componentStack);
          setTimeout(() => setIsARMode(false), 3000);
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ARCameraView
            onClose={() => {
              console.log('📍 AR Mode closed by user');
              setIsARMode(false);
            }}
          />
        </GestureHandlerRootView>
      </ErrorBoundary>
    );
  }

  // Pick image from library
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần cấp quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `image_${Date.now()}.jpg`,
        }));

        const totalImages = images.length + newImages.length;
        if (totalImages > 5) {
          alert('Tối đa 5 ảnh');
          return;
        }

        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Lỗi khi chọn ảnh');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Cần cấp quyền truy cập camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const asset = result.assets[0];
        const totalImages = images.length + 1;

        if (totalImages > 5) {
          alert('Tối đa 5 ảnh');
          return;
        }

        const newImage: UploadedImage = {
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        };

        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Lỗi khi chụp ảnh');
    }
  };

  // Remove image from selected images
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Search locations using Expo Location Geocoding
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsUserTyping(true);

    if (query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      let searchQueryWithContext = query;
      if (
        !query.toLowerCase().includes('vietnam') &&
        !query.toLowerCase().includes('việt nam')
      ) {
        searchQueryWithContext = `${query}, Vietnam`;
      }

      const results = await Location.geocodeAsync(
        searchQueryWithContext
      );

      if (results && results.length > 0) {
        const mapped = await Promise.all(
          results.slice(0, 5).map(async (result) => {
            try {
              const reverseResults =
                await Location.reverseGeocodeAsync({
                  latitude: result.latitude,
                  longitude: result.longitude,
                });

              if (reverseResults && reverseResults.length > 0) {
                const addr = reverseResults[0];
                const address = `${
                  addr.street ? addr.street + ', ' : ''
                }${addr.district ? addr.district + ', ' : ''}${
                  addr.city ? addr.city : ''
                }`;

                return {
                  address: address || query,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  name: `${result.latitude.toFixed(
                    4
                  )}, ${result.longitude.toFixed(4)}`,
                };
              }
            } catch (e) {
              console.warn('Reverse geocode error:', e);
            }

            return {
              address: query,
              latitude: result.latitude,
              longitude: result.longitude,
              name: `${result.latitude.toFixed(
                4
              )}, ${result.longitude.toFixed(4)}`,
            };
          })
        );

        setSearchResults(mapped);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle location selection from search results
  const selectLocation = (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setShowSuggestions(false);
    setIsUserTyping(false);

    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={ModalStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={ModalStyles.sectionTitle}>Vị trí sự cố</Text>

      <View style={ModalStyles.mapCard}>
        <OSMMapSection
          mapRef={mapRef}
          region={region}
          selectedLocation={selectedLocation}
          onRegionChange={(newRegion) => {
            setRegion(newRegion);
            if (!isUserTyping) {
              reverseGeocode(newRegion.latitude, newRegion.longitude);
            }
          }}
        />

        {/* SEARCH LOCATION INPUT */}
        <View style={ModalStyles.searchWrapper}>
          <View style={ModalStyles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.primary}
              style={{ marginLeft: SPACING.md }}
            />
            <TextInput
              style={ModalStyles.searchInput}
              placeholder="Tìm kiếm địa điểm (vd: Yoshiyoshi Ho Chi Minh)..."
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => {
                setIsUserTyping(true);
                if (searchResults.length > 0)
                  setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsUserTyping(false), 500);
              }}
              placeholderTextColor={COLORS.gray400}
            />
            {searchLoading && (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
              />
            )}
          </View>

          {/* CURRENT LOCATION BUTTON */}
          <TouchableOpacity
            style={ModalStyles.currentLocationBtn}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            <Ionicons
              name="locate"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={ModalStyles.currentLocationText}>
              Vị trí hiện tại
            </Text>
          </TouchableOpacity>

          {/* SEARCH RESULTS DROPDOWN */}
          {showSuggestions && searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={ModalStyles.suggestionItem}
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
                      style={ModalStyles.suggestionText}
                      numberOfLines={1}
                    >
                      {item.address}
                    </Text>
                    <Text style={ModalStyles.suggestionMeta}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={ModalStyles.suggestionsDropdown}
            />
          )}
        </View>
      </View>

      {/* SECTION: Image Upload */}
      <ImageUploadSection
        images={images}
        onTakePhoto={takePhoto}
        onPickImage={pickImage}
        onOpenAR={() => setIsARMode(true)}
        onRemove={removeImage}
      />

      {/* SECTION: Details Form */}
      <Text style={ModalStyles.sectionTitle}>Thông tin chi tiết</Text>

      <Text style={ModalStyles.label}>
        Tiêu đề phản ánh{' '}
        <Text style={{ color: COLORS.danger }}>*</Text>
      </Text>
      <TextInput
        style={ModalStyles.input}
        placeholder="Ví dụ: Hố ga bị vỡ gây nguy hiểm"
      />

      <Text style={ModalStyles.label}>
        Nội dung phản ánh{' '}
        <Text style={{ color: COLORS.danger }}>*</Text>
      </Text>
      <TextInput
        style={[ModalStyles.input, ModalStyles.textArea]}
        multiline
        placeholder="Mô tả chi tiết sự việc..."
      />

      <Text style={ModalStyles.label}>Thời gian</Text>
      <View style={ModalStyles.datePicker}>
        <Text>10:30 - 24/05/2024</Text>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={COLORS.gray500}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={ModalStyles.submitBtn}>
        <Ionicons name="send" size={18} color="white" />
        <Text style={ModalStyles.submitText}>Gửi Phản ánh</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
