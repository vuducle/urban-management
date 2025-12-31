import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Static data for the slider in Vietnamese
const NEWS_DATA = [
  {
    id: '1',
    title: 'Sửa chữa đường chính',
    description:
      'Công tác trải nhựa tại Quận 1 đã bắt đầu triển khai.',
    status: 'Hạ tầng',
    statusColor: '#EEF2FF',
    textColor: '#4F46E5',
    date: '01/10/2024',
    image:
      'https://images.unsplash.com/photo-1599708153386-62bf3f035c78?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    title: 'Trồng thêm cây xanh mới',
    description:
      '50 cây sồi mới đã được trồng tại công viên thành phố.',
    status: 'Cây xanh',
    statusColor: '#F0FDF4',
    textColor: '#16A34A',
    date: '02/10/2024',
    image:
      'https://images.unsplash.com/photo-1536086845112-89de23aa4772?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    title: 'Nâng cấp hệ thống đèn',
    description:
      'Đèn đường tại đại lộ đã được chuyển sang hệ thống LED.',
    status: 'Hạ tầng',
    statusColor: '#EEF2FF',
    textColor: '#4F46E5',
    date: '03/10/2024',
    image:
      'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&w=400',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const NewsSlider = () => {
  const renderItem = ({ item }: { item: (typeof NEWS_DATA)[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        {/* Row for Status Label and Date */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.statusColor },
            ]}
          >
            <Text
              style={[styles.statusText, { color: item.textColor }]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông báo mới</Text>
      <FlatList
        data={NEWS_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16} // Snapping adjustment for margin
        decelerationRate="fast"
        contentContainerStyle={styles.listPadding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
    marginBottom: SPACING['2xl'],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray900,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.md,
  },
  listPadding: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS['2xl'],
    marginRight: SPACING.lg,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});

export default NewsSlider;
