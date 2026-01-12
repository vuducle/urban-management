import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { AccountInfoScreenStyles } from '../../assets/styles';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
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
    <SafeAreaView style={AccountInfoScreenStyles.container}>
      <View style={AccountInfoScreenStyles.topHeader}>
        <TouchableOpacity
          style={AccountInfoScreenStyles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.gray900}
          />
        </TouchableOpacity>
        <Text style={AccountInfoScreenStyles.headerTitle}>
          Thông tin tài khoản
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={AccountInfoScreenStyles.scrollContent}
      >
        <View style={AccountInfoScreenStyles.avatarSection}>
          <View style={AccountInfoScreenStyles.avatarWrapper}>
            <Image
              source={{ uri: 'https://avatar.iran.liara.run/public' }}
              style={AccountInfoScreenStyles.avatar}
            />
            <TouchableOpacity
              style={AccountInfoScreenStyles.cameraBtn}
            >
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={AccountInfoScreenStyles.profileName}>
            Nguyễn Văn A
          </Text>
          <Text style={AccountInfoScreenStyles.profileRole}>
            Cán bộ quản lý đô thị
          </Text>
        </View>

        <View style={AccountInfoScreenStyles.section}>
          <Text style={AccountInfoScreenStyles.sectionLabel}>
            Thông tin cá nhân
          </Text>

          <Text style={AccountInfoScreenStyles.inputLabel}>
            Họ và tên
          </Text>
          <TextInput
            style={AccountInfoScreenStyles.input}
            defaultValue="Nguyễn Văn A"
          />

          <Text style={AccountInfoScreenStyles.inputLabel}>
            Email
          </Text>
          <TextInput
            style={AccountInfoScreenStyles.input}
            defaultValue="nguyen.vana@urban.gov.vn"
            keyboardType="email-address"
          />

          <Text style={AccountInfoScreenStyles.inputLabel}>
            Số điện thoại
          </Text>
          <TextInput
            style={AccountInfoScreenStyles.input}
            defaultValue="0912 345 678"
            keyboardType="phone-pad"
          />

          <Text style={AccountInfoScreenStyles.inputLabel}>
            Đơn vị công tác
          </Text>
          <View
            style={[
              AccountInfoScreenStyles.input,
              AccountInfoScreenStyles.disabledInput,
            ]}
          >
            <Text style={{ color: COLORS.gray600 }}>
              Phòng Quản lý Đô thị Quận 1
            </Text>
            <Ionicons
              name="lock-closed"
              size={16}
              color={COLORS.slate}
            />
          </View>
          <Text style={AccountInfoScreenStyles.helperText}>
            Liên hệ quản trị viên để thay đổi đơn vị
          </Text>
        </View>

        <View style={AccountInfoScreenStyles.section}>
          <Text style={AccountInfoScreenStyles.sectionLabel}>
            Cài đặt
          </Text>

          <View style={AccountInfoScreenStyles.switchRow}>
            <View>
              <Text style={AccountInfoScreenStyles.switchTitle}>
                Nhận thông báo sự cố
              </Text>
              <Text style={AccountInfoScreenStyles.switchSub}>
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

          <View style={AccountInfoScreenStyles.switchRow}>
            <View>
              <Text style={AccountInfoScreenStyles.switchTitle}>
                Chia sẻ vị trí khi báo cáo
              </Text>
              <Text style={AccountInfoScreenStyles.switchSub}>
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
        <View style={AccountInfoScreenStyles.saveBtnContainer}>
          <TouchableOpacity style={AccountInfoScreenStyles.saveBtn}>
            <Text style={AccountInfoScreenStyles.saveBtnText}>
              Lưu thay đổi
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
