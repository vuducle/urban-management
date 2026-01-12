import { COLORS, SPACING } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { ModalStyles } from '@/assets/styles';

//feature threejs
import ARCameraView from '@/components/core/ARCameraView';
import ErrorBoundary from '@/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
interface LocationResult {
  address: string;
  latitude: number;
  longitude: number;
  name?: string;
}

interface UploadedImage {
  uri: string;
  type: string;
  name: string;
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
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const [isARMode, setIsARMode] = useState<boolean>(false);

  if (isARMode) {
    return (
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('🚨 AR MODE CRASHED:');
          console.error('Error:', error.message);
          console.error('Stack:', error.stack);
          console.error('Component Stack:', errorInfo.componentStack);
          // Automatically return to normal mode on crash
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
      // Request photo library permissions
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
      // Request camera permissions
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

    setLoading(true);
    try {
      // Add location bias for Vietnam
      // If query doesn't contain Vietnam/city names, add it for better context
      let searchQueryWithContext = query;
      if (
        !query.toLowerCase().includes('vietnam') &&
        !query.toLowerCase().includes('việt nam')
      ) {
        searchQueryWithContext = `${query}, Vietnam`;
      }

      // Use Expo Location Geocoding for address search with better context
      const results = await Location.geocodeAsync(
        searchQueryWithContext
      );

      if (results && results.length > 0) {
        // Reverse geocode to get actual addresses
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
      setLoading(false);
    }
  };

  // Handle location selection from search results
  const selectLocation = (location: LocationResult) => {
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

  const reverseGeocode = async (lat: number, lng: number) => {
    // Don't update if user is actively typing
    if (isUserTyping) {
      return;
    }

    try {
      // Request permission before reverse geocoding (required on Android)
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn(
          'Location permission not granted for reverse geocoding'
        );
        return;
      }

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

  // Get current device location
  const getCurrentLocation = async () => {
    try {
      // Request location permissions
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        alert(
          'Cần cấp quyền truy cập vị trí để sử dụng tính năng này'
        );
        return;
      }

      setLoading(true);
      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);

      // Get address from coordinates
      setIsUserTyping(false);
      reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Không thể lấy vị trí hiện tại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={ModalStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={ModalStyles.sectionTitle}>Vị trí sự cố</Text>

      <View style={ModalStyles.mapCard}>
        <View style={ModalStyles.mapPlaceholder}>
          <MapView
            ref={mapRef}
            provider={
              Platform.OS === 'android'
                ? PROVIDER_GOOGLE
                : PROVIDER_DEFAULT
            }
            style={ModalStyles.mapImage}
            region={region}
            onRegionChangeComplete={(newRegion) => {
              setRegion(newRegion);
              // Only auto-reverse geocode when user is NOT typing
              if (!isUserTyping) {
                reverseGeocode(
                  newRegion.latitude,
                  newRegion.longitude
                );
              }
            }}
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
                // Delay to allow suggestion selection
                setTimeout(() => setIsUserTyping(false), 500);
              }}
              placeholderTextColor={COLORS.gray400}
            />
            {loading && (
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
      <View style={ModalStyles.headerRow}>
        <Text style={ModalStyles.sectionTitle}>
          Hình ảnh hiện trường
        </Text>
        <Text style={ModalStyles.counter}>{images.length}/5</Text>
      </View>

      {/* Upload Buttons */}
      <View style={ModalStyles.uploadButtonsContainer}>
        <TouchableOpacity
          style={[
            ModalStyles.uploadBtn,
            images.length >= 5 && ModalStyles.uploadBtnDisabled,
          ]}
          onPress={takePhoto}
          disabled={images.length >= 5}
        >
          <Ionicons
            name="camera"
            size={24}
            color={
              images.length >= 5 ? COLORS.gray400 : COLORS.primary
            }
          />
          <Text
            style={[
              ModalStyles.uploadBtnText,
              images.length >= 5 && { color: COLORS.gray400 },
            ]}
          >
            Chụp ảnh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ModalStyles.uploadBtn,
            images.length >= 5 && ModalStyles.uploadBtnDisabled,
          ]}
          onPress={() => setIsARMode(true)}
          disabled={images.length >= 5}
        >
          <Ionicons
            name="cube"
            size={24}
            color={
              images.length >= 5 ? COLORS.gray400 : COLORS.primary
            }
          />
          <Text
            style={[
              ModalStyles.uploadBtnText,
              images.length >= 5 && { color: COLORS.gray400 },
            ]}
          >
            AR View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            ModalStyles.uploadBtn,
            images.length >= 5 && ModalStyles.uploadBtnDisabled,
          ]}
          onPress={pickImage}
          disabled={images.length >= 5}
        >
          <Ionicons
            name="image"
            size={24}
            color={
              images.length >= 5 ? COLORS.gray400 : COLORS.primary
            }
          />
          <Text
            style={[
              ModalStyles.uploadBtnText,
              images.length >= 5 && { color: COLORS.gray400 },
            ]}
          >
            Tải lên ảnh
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <FlatList
          data={images}
          renderItem={({ item, index }) => (
            <View style={ModalStyles.imagePreviewContainer}>
              <Image
                source={{ uri: item.uri }}
                style={ModalStyles.imagePreview}
              />
              <TouchableOpacity
                style={ModalStyles.deleteImageBtn}
                onPress={() => removeImage(index)}
              >
                <Ionicons
                  name="close-circle"
                  size={28}
                  color={COLORS.danger}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(_, index) => `image-${index}`}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={ModalStyles.imageGridRow}
        />
      )}

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
