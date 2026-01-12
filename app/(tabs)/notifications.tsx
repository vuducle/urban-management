import { COLORS } from '@/constants/colors';
import { getRelativeTime } from '@/hooks/get-relative-time';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NotificationsStyles } from '@/assets/styles';

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
    <SafeAreaView style={NotificationsStyles.container}>
      {/* Header */}
      <View style={NotificationsStyles.header}>
        <Text style={NotificationsStyles.headerTitle}>Thông báo</Text>
        <TouchableOpacity>
          <Text style={NotificationsStyles.markReadText}>
            Đánh dấu đã đọc
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={NotificationsStyles.filterBar}>
        {['Tất cả', 'Hồ sơ', 'Hệ thống'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              NotificationsStyles.filterTab,
              filter === item && NotificationsStyles.activeTab,
            ]}
          >
            <Text
              style={[
                NotificationsStyles.filterText,
                filter === item &&
                  NotificationsStyles.activeFilterText,
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
          <Text style={NotificationsStyles.sectionHeader}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={NotificationsStyles.notifCard}>
            <View
              style={[
                NotificationsStyles.iconBox,
                {
                  backgroundColor: item.unread
                    ? '#EFF6FF'
                    : '#F8FAFC',
                },
              ]}
            >
              {renderIcon(item.type)}
              {item.unread && (
                <View style={NotificationsStyles.unreadDot} />
              )}
            </View>
            <View style={NotificationsStyles.textContainer}>
              <View style={NotificationsStyles.titleRow}>
                <Text
                  style={NotificationsStyles.notifTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={NotificationsStyles.timeText}>
                  {getRelativeTime(item.timestamp)}
                </Text>
              </View>
              <Text
                style={NotificationsStyles.descText}
                numberOfLines={2}
              >
                {item.desc}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
