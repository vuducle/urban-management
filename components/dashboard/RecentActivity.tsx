import { FontAwesome5 } from '@expo/vector-icons';
import { RecentActivityStyles } from '../../assets/styles';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// Importiere hier deine Konstanten (Pfad eventuell anpassen)
import { COLORS } from '@/constants/colors';

const ACTIVITIES = [
  {
    id: '1',
    title: 'Ổ gà nguy hiểm',
    location: 'Ngã tư Lê Lợi - Pasteur, Quận 1',
    time: '2 phút trước',
    status: 'Đã tiếp nhận',
    statusBg: '#EEF2FF', // Indigo tint
    statusText: COLORS.primary,
    icon: 'exclamation-triangle',
    iconColor: COLORS.warning,
  },
  {
    id: '2',
    title: 'Rò rỉ ống nước cấp 2',
    location: '123 Trần Hưng Đạo, Quận 5',
    time: '1 giờ trước',
    status: 'Đang xử lý',
    statusBg: '#FFFBEB', // Amber tint
    statusText: COLORS.warning,
    icon: 'tint',
    iconColor: COLORS.primary,
  },
  {
    id: '3',
    title: 'Đèn đường không sáng',
    location: 'Công viên 23/9',
    time: 'Hôm qua',
    status: 'Đã hoàn thành',
    statusBg: '#F0FDF4', // Emerald tint
    statusText: COLORS.success,
    icon: 'lightbulb',
    iconColor: COLORS.success,
  },
];

const RecentActivity = () => {
  return (
    <View style={RecentActivityStyles.container}>
      <View style={RecentActivityStyles.header}>
        <Text style={RecentActivityStyles.title}>
          Hoạt động gần đây
        </Text>
        <TouchableOpacity>
          <Text style={RecentActivityStyles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {ACTIVITIES.map((item) => (
        <View key={item.id} style={RecentActivityStyles.card}>
          {/* Left: Icon Box using BORDER_RADIUS and COLORS */}
          <View style={RecentActivityStyles.iconBox}>
            <FontAwesome5
              name={item.icon}
              size={20}
              color={item.iconColor}
            />
          </View>

          {/* Center: Info Section */}
          <View style={RecentActivityStyles.info}>
            <View style={RecentActivityStyles.titleRow}>
              <Text style={RecentActivityStyles.itemTitle}>
                {item.title}
              </Text>
              <Text style={RecentActivityStyles.timeText}>
                {item.time}
              </Text>
            </View>
            <Text style={RecentActivityStyles.locationText}>
              {item.location}
            </Text>

            {/* Status Badge using Dynamic Colors and BORDER_RADIUS.full */}
            <View
              style={[
                RecentActivityStyles.badge,
                { backgroundColor: item.statusBg },
              ]}
            >
              <View
                style={[
                  RecentActivityStyles.dot,
                  { backgroundColor: item.statusText },
                ]}
              />
              <Text
                style={[
                  RecentActivityStyles.badgeText,
                  { color: item.statusText },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default RecentActivity;
