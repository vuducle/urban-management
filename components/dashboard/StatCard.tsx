import { COLORS } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

// Define the shape of the data we want to display
interface StatCardProps {
  title: string;
  value: string | number;
  iconName: any;
  iconColor: string;
  bgColor: string;
  badgeText?: string; // Optional: for the "+2" or "!" badge
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  iconColor,
  bgColor,
  badgeText,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* Icon with dynamic background color */}
        <View
          style={[styles.iconContainer, { backgroundColor: bgColor }]}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={iconColor}
          />
        </View>

        {/* Optional Badge on the right */}
        {badgeText && (
          <View
            style={[
              styles.badge,
              title === 'Khẩn cấp' || title === 'Dringend'
                ? styles.urgentBadge
                : styles.normalBadge,
            ]}
          >
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

// Main Component to wrap the cards in a grid
export const StatsGrid = () => {
  return (
    <View style={styles.grid}>
      <StatCard
        title="Tổng sự cố"
        value="12"
        iconName="clipboard-text"
        iconColor={COLORS.primary}
        bgColor={COLORS.gray100}
        badgeText="+2"
      />
      <StatCard
        title="Đang chờ"
        value="5"
        iconName="clipboard-clock"
        iconColor={COLORS.warning}
        bgColor="#FFFBEB"
      />
      <StatCard
        title="Đã xử lý"
        value="3"
        iconName="check-circle"
        iconColor={COLORS.success}
        bgColor="#ECFDF5"
      />
      <StatCard
        title="Khẩn cấp"
        value="4"
        iconName="alert-decagram"
        iconColor={COLORS.danger}
        bgColor="#FEF2F2"
        badgeText="!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width / 2 - 20, // Calculates width for 2 columns
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    // Shadow for a clean look
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  titleText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  normalBadge: {
    backgroundColor: '#F0FDF4',
  },
  urgentBadge: {
    backgroundColor: '#FEF2F2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981', // Green for +2
  },
});

export default StatsGrid;
