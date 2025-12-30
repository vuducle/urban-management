import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { getRelativeTime } from '@/hooks/get-relative-time';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Type definition for better type safety
interface Notification {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  type: 'success' | 'warning' | 'system' | 'profile';
  category: 'Tất cả' | 'Hồ sơ' | 'Hệ thống';
  unread: boolean;
}

// Raw notification data - easy to replace with backend API call
const ALL_NOTIFICATIONS: Notification[] = [
  // TODAY
  {
    id: '1',
    title: 'Phản ánh #1234 đã được xử lý',
    desc: 'Sự cố đèn đường tại Nguyễn Huệ đang được xử lý bởi đơn vị thi công...',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: 'success',
    category: 'Tất cả',
    unread: true,
  },
  {
    id: '2',
    title: 'Cảnh báo ngập lụt Quận 1',
    desc: 'Khu vực Quận 1 đang có triều cường dâng cao, vui lòng tránh...',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'warning',
    category: 'Tất cả',
    unread: true,
  },
  {
    id: '4',
    title: 'Cập nhật hồ sơ thành công',
    desc: 'Hồ sơ cá nhân của bạn đã được cập nhật...',
    timestamp: new Date(
      Date.now() - 2 * 60 * 60 * 1000
    ).toISOString(),
    type: 'profile',
    category: 'Hồ sơ',
    unread: true,
  },
  {
    id: '5',
    title: 'Xác nhận đổi mật khẩu',
    desc: 'Mật khẩu của bạn đã được thay đổi thành công...',
    timestamp: new Date(
      Date.now() - 3 * 60 * 60 * 1000
    ).toISOString(),
    type: 'success',
    category: 'Hồ sơ',
    unread: false,
  },

  // YESTERDAY
  {
    id: '3',
    title: 'Bảo trì hệ thống bản đồ GIS',
    desc: 'Hệ thống sẽ tạm ngưng hoạt động từ 00:00 đến 02:00 ngày mai...',
    timestamp: new Date(
      Date.now() - 17 * 60 * 60 * 1000
    ).toISOString(),
    type: 'system',
    category: 'Hệ thống',
    unread: false,
  },
  {
    id: '6',
    title: 'Nâng cấp ứng dụng khả dụng',
    desc: 'Phiên bản mới 2.5.0 đã sẵn sàng để tải xuống...',
    timestamp: new Date(
      Date.now() - 20 * 60 * 60 * 1000
    ).toISOString(),
    type: 'system',
    category: 'Hệ thống',
    unread: false,
  },
  {
    id: '7',
    title: 'Báo cáo sự cố hàng tuần',
    desc: 'Báo cáo tổng hợp sự cố tuần này đã được tạo...',
    timestamp: new Date(
      Date.now() - 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ).toISOString(),
    type: 'success',
    category: 'Tất cả',
    unread: false,
  },

  // OLDER
  {
    id: '8',
    title: 'Thay đổi quyền truy cập được phê duyệt',
    desc: 'Yêu cầu truy cập của bạn đối với khu vực mới đã được phê duyệt...',
    timestamp: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    type: 'profile',
    category: 'Hồ sơ',
    unread: false,
  },
  {
    id: '9',
    title: 'Thông báo bảo dưỡng định kỳ',
    desc: 'Bảo dưỡng hệ thống được lên lịch cho tuần tới...',
    timestamp: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    type: 'system',
    category: 'Hệ thống',
    unread: false,
  },
  {
    id: '10',
    title: 'Phản ánh #999 đã hoàn thành',
    desc: 'Sự cố trước đó đã được hoàn toàn xử lý...',
    timestamp: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
    type: 'success',
    category: 'Tất cả',
    unread: false,
  },
];

// Helper to group notifications by date
interface Section {
  title: string;
  data: Notification[];
}

function groupNotificationsByDate(
  notifications: Notification[]
): Section[] {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sections: Section[] = [];

  const todayNotifs = notifications.filter((n) => {
    const notifDate = new Date(n.timestamp);
    return (
      notifDate.getFullYear() === today.getFullYear() &&
      notifDate.getMonth() === today.getMonth() &&
      notifDate.getDate() === today.getDate()
    );
  });

  const yesterdayNotifs = notifications.filter((n) => {
    const notifDate = new Date(n.timestamp);
    return (
      notifDate.getFullYear() === yesterday.getFullYear() &&
      notifDate.getMonth() === yesterday.getMonth() &&
      notifDate.getDate() === yesterday.getDate()
    );
  });

  const olderNotifs = notifications.filter((n) => {
    const notifDate = new Date(n.timestamp);
    return (
      notifDate <
      new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
      )
    );
  });

  if (todayNotifs.length > 0) {
    sections.push({ title: 'HÔM NAY', data: todayNotifs });
  }
  if (yesterdayNotifs.length > 0) {
    sections.push({ title: 'HÔM QUA', data: yesterdayNotifs });
  }
  if (olderNotifs.length > 0) {
    sections.push({ title: 'CŨ HƠN', data: olderNotifs });
  }

  return sections;
}

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<
    'Tất cả' | 'Hồ sơ' | 'Hệ thống'
  >('Tất cả');

  // Filter notifications based on selected category
  const filteredNotifications = useMemo(() => {
    if (filter === 'Tất cả') {
      return ALL_NOTIFICATIONS;
    }
    return ALL_NOTIFICATIONS.filter((n) => n.category === filter);
  }, [filter]);

  // Group by date
  const sections = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications]
  );

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
      case 'profile':
        return (
          <MaterialCommunityIcons
            name="account-check"
            size={22}
            color={COLORS.info}
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
        sections={sections}
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
                <Text style={styles.timeText}>
                  {getRelativeTime(item.timestamp)}
                </Text>
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
