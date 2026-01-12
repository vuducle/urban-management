import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountInfoScreen() {
  const [notifications, setNotifications] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Nguyễn Văn A</Text>
          <Text style={styles.profileRole}>
            Cán bộ quản lý đô thị
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Thông tin cá nhân</Text>

          <Text style={styles.inputLabel}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            defaultValue="Nguyễn Văn A"
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            defaultValue="nguyen.vana@urban.gov.vn"
            keyboardType="email-address"
          />

          <Text style={styles.inputLabel}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            defaultValue="0912 345 678"
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Đơn vị công tác</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={{ color: COLORS.gray600 }}>
              Phòng Quản lý Đô thị Quận 1
            </Text>
            <Ionicons
              name="lock-closed"
              size={16}
              color={COLORS.slate}
            />
          </View>
          <Text style={styles.helperText}>
            Liên hệ quản trị viên để thay đổi đơn vị
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cài đặt</Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>
                Nhận thông báo sự cố
              </Text>
              <Text style={styles.switchSub}>
                Cập nhật trạng thái xử lý các vấn đề
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: COLORS.gray200,
                true: COLORS.primary,
              }}
            />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>
                Chia sẻ vị trí khi báo cáo
              </Text>
              <Text style={styles.switchSub}>
                Tự động gắn thẻ địa lý cho ảnh
              </Text>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{
                false: COLORS.gray200,
                true: COLORS.primary,
              }}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveBtnContainer}>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scrollContent: { padding: 0, backgroundColor: COLORS.gray50 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: 'white',
    paddingVertical: SPACING.lg,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.md,
  },
  profileRole: { fontSize: FONT_SIZES.sm, color: COLORS.slate },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: 'white',
    padding: SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  disabledInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
  },
  helperText: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: -8,
    marginBottom: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  switchTitle: { fontSize: FONT_SIZES.base, fontWeight: '600' },
  switchSub: { fontSize: 12, color: COLORS.slate },
  saveBtnContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl * 2,
    backgroundColor: 'white',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.md,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
