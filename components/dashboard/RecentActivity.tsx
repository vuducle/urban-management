import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Importiere hier deine Konstanten (Pfad eventuell anpassen)
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoạt động gần đây</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {ACTIVITIES.map((item) => (
        <View key={item.id} style={styles.card}>
          {/* Left: Icon Box using BORDER_RADIUS and COLORS */}
          <View style={styles.iconBox}>
            <FontAwesome5
              name={item.icon}
              size={20}
              color={item.iconColor}
            />
          </View>

          {/* Center: Info Section */}
          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.locationText}>{item.location}</Text>

            {/* Status Badge using Dynamic Colors and BORDER_RADIUS.full */}
            <View
              style={[
                styles.badge,
                { backgroundColor: item.statusBg },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: item.statusText },
                ]}
              />
              <Text
                style={[styles.badgeText, { color: item.statusText }]}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray900,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    // Using your Shadow Constraint
    ...SHADOWS.sm,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray900,
  },
  timeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.slate,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginVertical: SPACING.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default RecentActivity;
