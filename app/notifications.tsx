import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATION_DATA = [
  {
    title: 'HÔM NAY',
    data: [
      {
        id: '1',
        title: 'Phản ánh #1234 đã được xử lý',
        desc: 'Sự cố đèn đường tại Nguyễn Huệ đang được xử lý bởi đơn vị thi công...',
        time: '10p trước',
        type: 'success',
        unread: true,
      },
      {
        id: '2',
        title: 'Cảnh báo ngập lụt Quận 1',
        desc: 'Khu vực Quận 1 đang có triều cường dâng cao, vui lòng tránh...',
        time: '30p trước',
        type: 'warning',
        unread: true,
      },
    ],
  },
  {
    title: 'HÔM QUA',
    data: [
      {
        id: '3',
        title: 'Bảo trì hệ thống bản đồ GIS',
        desc: 'Hệ thống sẽ tạm ngưng hoạt động từ 00:00 đến 02:00 ngày mai...',
        time: '14:00',
        type: 'system',
        unread: false,
      },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('Tất cả');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <MaterialCommunityIcons
            name="check-decagram"
            size={22}
            color={COLORS.primary}
          />
        );
      case 'warning':
        return (
          <MaterialCommunityIcons
            name="alert-rhombus"
            size={22}
            color={COLORS.danger}
          />
        );
      default:
        return (
          <MaterialCommunityIcons
            name="bullhorn-variant"
            size={22}
            color={COLORS.slate}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Đánh dấu đã đọc</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {['Tất cả', 'Hồ sơ', 'Hệ thống'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterTab,
              filter === item && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.activeFilterText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={NOTIFICATION_DATA}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notifCard}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: item.unread
                    ? '#EFF6FF'
                    : '#F8FAFC',
                },
              ]}
            >
              {renderIcon(item.type)}
              {item.unread && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.descText} numberOfLines={2}>
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  markReadText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: { backgroundColor: COLORS.white, ...SHADOWS.sm },
  filterText: { color: COLORS.gray500, fontWeight: '500' },
  activeFilterText: { color: COLORS.gray900 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.slate,
    marginLeft: SPACING.lg,
    marginTop: SPACING.md,
  },
  notifCard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  textContainer: { flex: 1, marginLeft: SPACING.md },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray900,
    flex: 1,
    marginRight: 8,
  },
  timeText: { fontSize: 11, color: COLORS.slate },
  descText: { fontSize: 13, color: COLORS.gray600, lineHeight: 18 },
});
