import { Dimensions, StyleSheet, Platform } from 'react-native';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  SPACING,
} from '@/constants/colors';

// ============================================================================
// AR CAMERA VIEW STYLES
// ============================================================================
export const ARCameraViewStyles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

// ============================================================================
// AR MODEL VIEW STYLES
// ============================================================================
export const ARModelViewStyles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: 'black' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});

// ============================================================================
// AR CONTROLS STYLES
// ============================================================================
export const ARControlsStyles = StyleSheet.create({
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 10,
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  sideButton: {
    alignItems: 'center',
    width: 60,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  modelSelector: {
    position: 'absolute',
    bottom: 130,
    flexDirection: 'row',
    gap: 8,
  },
  modelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  modelBtnActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  modelBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// ============================================================================
// AR OVERLAY STYLES
// ============================================================================
export const AROverlayStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    position: 'absolute',
  },
  crosshairRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshairRingInner: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  loadingContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 12,
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.95)',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '80%',
    zIndex: 1000,
  },
  errorText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});

// ============================================================================
// OBJECT ROTATION CONTROLS STYLES
// ============================================================================
export const ObjectRotationControlsStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetButton: {
    padding: 4,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  axesContainer: {
    gap: 4,
    marginTop: 4,
  },
  axisContainer: {
    marginBottom: 2,
  },
  axisButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 3,
    padding: 6,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  axisButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  axisValue: {
    fontSize: 11,
    color: '#aaa',
  },
  rotationControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  rotateButton: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  rotateLabel: {
    fontSize: 9,
    color: '#fff',
    marginTop: 1,
  },
  moveControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 6,
  },
  moveAxis: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  moveButton: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    minWidth: 32,
    textAlign: 'center',
  },
  scaleControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  scaleDisplayBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  scaleValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#33B5E5',
  },
});

// ============================================================================
// OBJECT SELECTOR STYLES
// ============================================================================
export const ObjectSelectorStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    right: 16,
    alignItems: 'flex-end',
    maxHeight: 400,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    maxHeight: 300,
  },
  objectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  objectItemSelected: {
    backgroundColor: '#007AFF',
  },
  objectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  objectName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  objectNameSelected: {
    color: '#fff',
  },
});

// ============================================================================
// TOP HEADER STYLES
// ============================================================================
export const TopHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS['2xl'],
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray300,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  textContainer: {
    marginLeft: SPACING.md,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  redDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
  },
});

// ============================================================================
// STAT CARD STYLES
// ============================================================================
export const StatCardStyles = StyleSheet.create({
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

// ============================================================================
// INCIDENT MAP STYLES
// ============================================================================
export const IncidentMapStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  expandText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    height: 180,
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  map: {
    flex: 1,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  buttonIcon: {
    marginRight: 8,
  },
  detailsText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray800,
  },
});

// ============================================================================
// RECENT ACTIVITY STYLES
// ============================================================================
export const RecentActivityStyles = StyleSheet.create({
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

// ============================================================================
// NEWS SLIDER STYLES
// ============================================================================
export const NewsSliderStyles = StyleSheet.create({
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
    width: 360,
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

// ============================================================================
// ACCOUNT INFO SCREEN STYLES
// ============================================================================
export const AccountInfoScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  headerTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
  },
  scrollContent: { padding: 0, backgroundColor: COLORS.gray50 },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: 'white',
    paddingVertical: SPACING.lg,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.md,
  },
  profileRole: { fontSize: FONT_SIZES.sm, color: COLORS.slate },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: 'white',
    padding: SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  disabledInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
  },
  helperText: {
    fontSize: 11,
    color: COLORS.slate,
    marginTop: -8,
    marginBottom: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  switchTitle: { fontSize: FONT_SIZES.base, fontWeight: '600' },
  switchSub: { fontSize: 12, color: COLORS.slate },
  saveBtnContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl * 2,
    backgroundColor: 'white',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    ...SHADOWS.md,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================================
// NOTIFICATIONS STYLES
// ============================================================================
export const NotificationsStyles = StyleSheet.create({
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

// ============================================================================
// MODAL STYLES
// ============================================================================
export const ModalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  content: { padding: SPACING.lg },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
  },
  mapCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.sm,
    marginBottom: SPACING.xl,
  },
  addressLabel: {
    fontSize: 10,
    color: COLORS.slate,
    fontWeight: '700',
  },
  addressText: { fontSize: 13, color: COLORS.gray800 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: { color: COLORS.slate },
  uploadBox: {
    height: 160,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
    backgroundColor: 'white',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  uploadSub: { fontSize: 12, color: COLORS.slate },
  label: {
    marginTop: SPACING.lg,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    ...SHADOWS.md,
  },
  submitText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
    backgroundColor: 'white',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray900,
  },
  currentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  currentLocationText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  suggestionsDropdown: {
    maxHeight: 250,
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.gray900,
  },
  suggestionMeta: {
    fontSize: 11,
    color: COLORS.gray500,
    marginTop: 4,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  addressRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  uploadBtnDisabled: {
    borderColor: COLORS.gray300,
    opacity: 0.6,
  },
  uploadBtnText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.sm,
  },
  imageGridRow: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  imagePreviewContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
    marginBottom: SPACING.md,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.lg,
    margin: 6,
  },
  deleteImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 2,
  },
});

// ============================================================================
// LGON PAGE STYLES
// ============================================================================
export const LoginPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandingSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  textCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  forgotWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    marginHorizontal: 12,
  },
  alternativeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  alternativeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  alternativeButtonPressed: {
    backgroundColor: '#f9fafb',
  },
  alternativeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 32,
  },
});

// ============================================================================
// Profile SCREEN STYLES
// ============================================================================
export const ProfileScreenStyles = StyleSheet.create({
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

//
// ============================================================================
// Layout styles
// ============================================================================
export const LayoutStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabBarMain: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    width: '100%',
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
    borderTopLeftRadius: BORDER_RADIUS['2xl'],
    borderTopRightRadius: BORDER_RADIUS['2xl'],
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.lg,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: SPACING.xs,
    color: COLORS.slate,
    fontWeight: '500',
  },
  placeholder: {
    width: 65,
  },
  fabButton: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

//
// ============================================================================
// Error Boundary Styles
// ============================================================================
export const ErrorBoundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  stackText: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
// ============================================================================
