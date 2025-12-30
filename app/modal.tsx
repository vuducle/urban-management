import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateReportModal() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* SECTION: Location */}
      <Text style={styles.sectionTitle}>Vị trí sự cố</Text>
      <View style={styles.mapCard}>
        <View style={styles.mapPlaceholder}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.addressRow}>
          <Ionicons
            name="location"
            size={20}
            color={COLORS.primary}
          />
          <View style={{ marginLeft: SPACING.sm }}>
            <Text style={styles.addressLabel}>ĐỊA CHỈ HIỆN TẠI</Text>
            <Text style={styles.addressText}>
              123 Đường Nguyễn Huệ, Quận 1, TP. HCM
            </Text>
          </View>
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
  addressRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
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
    height: 150,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});
