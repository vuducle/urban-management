// components/ImageUploadSection.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModalStyles } from '@/assets/styles';
import { COLORS } from '@/constants/colors';

interface ImageUploadSectionProps {
  images: { uri: string }[];
  onTakePhoto: () => void;
  onPickImage: () => void;
  onOpenAR: () => void;
  onRemove: (index: number) => void;
}

interface UploadBtnProps {
  icon: string;
  label: string;
  onPress: () => void;
  disabled: boolean;
}

export const ImageUploadSection = ({
  images,
  onTakePhoto,
  onPickImage,
  onOpenAR,
  onRemove,
}: ImageUploadSectionProps) => {
  return (
    <View>
      <View style={ModalStyles.headerRow}>
        <Text style={ModalStyles.sectionTitle}>
          Hình ảnh hiện trường
        </Text>
        <Text style={ModalStyles.counter}>{images.length}/5</Text>
      </View>

      <View style={ModalStyles.uploadButtonsContainer}>
        <UploadBtn
          icon="camera"
          label="Chụp ảnh"
          onPress={onTakePhoto}
          disabled={images.length >= 5}
        />
        <UploadBtn
          icon="cube"
          label="AR View"
          onPress={onOpenAR}
          disabled={images.length >= 5}
        />
        <UploadBtn
          icon="image"
          label="Tải lên"
          onPress={onPickImage}
          disabled={images.length >= 5}
        />
      </View>

      <FlatList
        data={images}
        renderItem={({ item, index }) => (
          <View style={ModalStyles.imagePreviewContainer}>
            <Image
              source={{ uri: item.uri }}
              style={ModalStyles.imagePreview}
            />
            <TouchableOpacity
              onPress={() => onRemove(index)}
              style={ModalStyles.deleteImageBtn}
            >
              <Ionicons
                name="close-circle"
                size={28}
                color={COLORS.danger}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        scrollEnabled={false}
      />
    </View>
  );
};

const UploadBtn = ({
  icon,
  label,
  onPress,
  disabled,
}: UploadBtnProps) => (
  <TouchableOpacity
    style={[
      ModalStyles.uploadBtn,
      disabled && ModalStyles.uploadBtnDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons
      name={icon}
      size={24}
      color={disabled ? COLORS.gray400 : COLORS.primary}
    />
    <Text
      style={[
        ModalStyles.uploadBtnText,
        disabled && { color: COLORS.gray400 },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
