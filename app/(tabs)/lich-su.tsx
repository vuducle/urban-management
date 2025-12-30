import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import { formatHistoryData } from '@/hooks/format-history-data';
import { getStatusConfig } from '@/hooks/get-status';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const RAW_HISTORY = [
  {
    id: 'h1',
    date: '2025-12-30',
    title: 'Sụt lún đường Nguyễn Huệ',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    time: '10:30 AM',
    status: 'Đang xử lý',
    image:
      'https://images.unsplash.com/photo-1701397955118-79059690ef50?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },

  {
    id: 'h2',
    date: '2025-12-30',
    title: 'Sụt lún đường Nguyễn Huệ',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    time: '10:30 AM',
    status: 'Tiếp nhận',
    image:
      'https://images.unsplash.com/photo-1701397955118-79059690ef50?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },

  {
    id: 'h3',
    date: '2025-12-29',
    title: 'Rác thải chưa thu gom',
    address: '88 Hoàng Diệu, Quận 4, TP.HCM',
    time: '14:20 PM',
    status: 'Hoàn thành',
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
  },

  {
    id: 'h3',
    date: '2024-10-01',
    title: 'Rác thải chưa thu gom',
    address: '88 Hoàng Diệu, Quận 4, TP.HCM',
    time: '20:20 PM',
    status: 'Đã Huỷ',
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
  },
];

const HistoryScreen = () => {
  // State to manage active filter
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  // 2. Filter data based on active filter
  const sections = useMemo(() => {
    const filtered =
      activeFilter === 'Tất cả'
        ? RAW_HISTORY
        : RAW_HISTORY.filter((item) => item.status === activeFilter);

    return formatHistoryData(filtered);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* TODO: Implement it later with real data */}
        <Text style={styles.headerTitle}>Danh sách Phản ánh</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="search"
              size={24}
              color={COLORS.gray700}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications"
              size={24}
              color={COLORS.gray700}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Filter-Sektion mit horizontalem ScrollView */}
      <View style={{ backgroundColor: COLORS.white }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {/* Chip: Tất cả */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Tất cả')}
            style={[
              styles.chip,
              activeFilter === 'Tất cả' && styles.activeChip,
            ]}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={18}
              color={
                activeFilter === 'Tất cả'
                  ? COLORS.white
                  : COLORS.gray600
              }
            />
            <Text
              style={[
                styles.chipText,
                activeFilter === 'Tất cả' && styles.activeChipText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {/* Chip: Tiếp nhận */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Tiếp nhận')}
            style={[
              styles.chip,
              activeFilter === 'Tiếp nhận' && styles.activeChip,
            ]}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={18}
              color={
                activeFilter === 'Tiếp nhận'
                  ? COLORS.white
                  : COLORS.gray600
              }
            />
            <Text
              style={[
                styles.chipText,
                activeFilter === 'Tiếp nhận' && styles.activeChipText,
              ]}
            >
              Tiếp nhận
            </Text>
          </TouchableOpacity>

          {/* Chip: Đang xử lý */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Đang xử lý')}
            style={[
              styles.chip,
              activeFilter === 'Đang xử lý' && styles.activeChip,
            ]}
          >
            <MaterialCommunityIcons
              name="progress-wrench"
              size={18}
              color={
                activeFilter === 'Đang xử lý'
                  ? COLORS.white
                  : COLORS.gray600
              }
            />
            <Text
              style={[
                styles.chipText,
                activeFilter === 'Đang xử lý' &&
                  styles.activeChipText,
              ]}
            >
              Xử lý
            </Text>
          </TouchableOpacity>

          {/* Chip: Hoàn thành */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Hoàn thành')}
            style={[
              styles.chip,
              activeFilter === 'Hoàn thành' && styles.activeChip,
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={
                activeFilter === 'Hoàn thành'
                  ? COLORS.white
                  : COLORS.gray600
              }
            />
            <Text
              style={[
                styles.chipText,
                activeFilter === 'Hoàn thành' &&
                  styles.activeChipText,
              ]}
            >
              Xong
            </Text>
          </TouchableOpacity>

          {/* Chip: Đã Huỷ */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Đã Huỷ')}
            style={[
              styles.chip,
              activeFilter === 'Đã Huỷ' && styles.activeChip,
            ]}
          >
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={18}
              color={
                activeFilter === 'Đã Huỷ'
                  ? COLORS.white
                  : COLORS.gray600
              }
            />
            <Text
              style={[
                styles.chipText,
                activeFilter === 'Đã Huỷ' && styles.activeChipText,
              ]}
            >
              Huỷ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{title}</Text>
            <View style={styles.dateLine} />
          </View>
        )}
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemAddress} numberOfLines={1}>
                  {item.address}
                </Text>
                <Text
                  style={[
                    {
                      color: COLORS.gray400,
                      fontSize: 10,
                      marginBottom: 4,
                    },
                  ]}
                >
                  {item.date}
                </Text>
                <View style={styles.footerRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: statusConfig.bg,
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={statusConfig.icon}
                      size={14}
                      color={statusConfig.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusConfig.color },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gray300}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

// Styles bleiben fast identisch, nur kleine Korrekturen für die Chips
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray900,
  },
  headerIcons: { flexDirection: 'row' },
  iconButton: { marginLeft: SPACING.md },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeChipText: { color: COLORS.white },
  chipText: {
    color: COLORS.gray600,
    marginLeft: 4,
    fontWeight: FONT_WEIGHTS.medium,
  },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dateHeaderText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.slate,
    fontWeight: FONT_WEIGHTS.bold,
    marginRight: 10,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: COLORS.gray200 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
  },
  itemInfo: { flex: 1 },
  itemTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray900,
  },
  itemAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  timeText: { fontSize: FONT_SIZES.xs, color: COLORS.gray400 },

  filterScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
});

export default HistoryScreen;
