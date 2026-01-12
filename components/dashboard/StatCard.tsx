import { COLORS } from '@/constants/colors';
import { StatCardStyles } from '../styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

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
    <View style={StatCardStyles.card}>
      <View style={StatCardStyles.topRow}>
        {/* Icon with dynamic background color */}
        <View
          style={[
            StatCardStyles.iconContainer,
            { backgroundColor: bgColor },
          ]}
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
              StatCardStyles.badge,
              title === 'Khẩn cấp' || title === 'Dringend'
                ? StatCardStyles.urgentBadge
                : StatCardStyles.normalBadge,
            ]}
          >
            <Text style={StatCardStyles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      <Text style={StatCardStyles.titleText}>{title}</Text>
      <Text style={StatCardStyles.valueText}>{value}</Text>
    </View>
  );
};

// Main Component to wrap the cards in a grid
export const StatsGrid = () => {
  return (
    <View style={StatCardStyles.grid}>
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

export default StatsGrid;
