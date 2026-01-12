import { COLORS } from '@/constants/colors';
import { formatHistoryData } from '@/hooks/format-history-data';
import { getStatusConfig } from '@/hooks/get-status';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileScreenStyles } from '@/assets/styles';

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
    <SafeAreaView style={ProfileScreenStyles.container}>
      <View style={ProfileScreenStyles.header}>
        {/* TODO: Implement it later with real data */}
        <Text style={ProfileScreenStyles.headerTitle}>
          Danh sách Phản ánh
        </Text>
        <View style={ProfileScreenStyles.headerIcons}>
          <TouchableOpacity style={ProfileScreenStyles.iconButton}>
            <Ionicons
              name="search"
              size={24}
              color={COLORS.gray700}
            />
          </TouchableOpacity>
          <TouchableOpacity style={ProfileScreenStyles.iconButton}>
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
          contentContainerStyle={
            ProfileScreenStyles.filterScrollContent
          }
        >
          {/* Chip: Tất cả */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Tất cả')}
            style={[
              ProfileScreenStyles.chip,
              activeFilter === 'Tất cả' &&
                ProfileScreenStyles.activeChip,
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
                ProfileScreenStyles.chipText,
                activeFilter === 'Tất cả' &&
                  ProfileScreenStyles.activeChipText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {/* Chip: Tiếp nhận */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Tiếp nhận')}
            style={[
              ProfileScreenStyles.chip,
              activeFilter === 'Tiếp nhận' &&
                ProfileScreenStyles.activeChip,
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
                ProfileScreenStyles.chipText,
                activeFilter === 'Tiếp nhận' &&
                  ProfileScreenStyles.activeChipText,
              ]}
            >
              Tiếp nhận
            </Text>
          </TouchableOpacity>

          {/* Chip: Đang xử lý */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Đang xử lý')}
            style={[
              ProfileScreenStyles.chip,
              activeFilter === 'Đang xử lý' &&
                ProfileScreenStyles.activeChip,
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
                ProfileScreenStyles.chipText,
                activeFilter === 'Đang xử lý' &&
                  ProfileScreenStyles.activeChipText,
              ]}
            >
              Xử lý
            </Text>
          </TouchableOpacity>

          {/* Chip: Hoàn thành */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Hoàn thành')}
            style={[
              ProfileScreenStyles.chip,
              activeFilter === 'Hoàn thành' &&
                ProfileScreenStyles.activeChip,
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
                ProfileScreenStyles.chipText,
                activeFilter === 'Hoàn thành' &&
                  ProfileScreenStyles.activeChipText,
              ]}
            >
              Xong
            </Text>
          </TouchableOpacity>

          {/* Chip: Đã Huỷ */}
          <TouchableOpacity
            onPress={() => setActiveFilter('Đã Huỷ')}
            style={[
              ProfileScreenStyles.chip,
              activeFilter === 'Đã Huỷ' &&
                ProfileScreenStyles.activeChip,
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
                ProfileScreenStyles.chipText,
                activeFilter === 'Đã Huỷ' &&
                  ProfileScreenStyles.activeChipText,
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
        contentContainerStyle={ProfileScreenStyles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={ProfileScreenStyles.dateHeader}>
            <Text style={ProfileScreenStyles.dateHeaderText}>
              {title}
            </Text>
            <View style={ProfileScreenStyles.dateLine} />
          </View>
        )}
        renderItem={({ item }) => {
          const statusConfig = getStatusConfig(item.status);
          return (
            <TouchableOpacity style={ProfileScreenStyles.card}>
              <Image
                source={{ uri: item.image }}
                style={ProfileScreenStyles.itemImage}
              />
              <View style={ProfileScreenStyles.itemInfo}>
                <Text
                  style={ProfileScreenStyles.itemTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={ProfileScreenStyles.itemAddress}
                  numberOfLines={1}
                >
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
                <View style={ProfileScreenStyles.footerRow}>
                  <View
                    style={[
                      ProfileScreenStyles.statusBadge,
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
                        ProfileScreenStyles.statusText,
                        { color: statusConfig.color },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Text style={ProfileScreenStyles.timeText}>
                    {item.time}
                  </Text>
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

export default HistoryScreen;
