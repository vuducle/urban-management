import { COLORS } from '@/constants/colors';
export function getStatusConfig(status: string) {
  switch (status) {
    case 'Tiếp nhận':
      return {
        color: COLORS.primary,
        bg: COLORS.primaryLight,
        icon: 'clipboard-text-outline' as const,
      };
    case 'Đang xử lý':
      return {
        color: COLORS.warning,
        bg: COLORS.warningLight,
        icon: 'progress-wrench' as const,
      };
    case 'Hoàn thành':
      return {
        color: COLORS.success,
        bg: COLORS.successLight,
        icon: 'check-circle-outline' as const,
      };
    case 'Đã Huỷ':
      return {
        color: COLORS.gray600,
        bg: COLORS.gray100,
        icon: 'close-circle-outline' as const,
      };
    default:
      return {
        color: COLORS.gray500,
        bg: COLORS.gray50,
        icon: 'help-circle-outline' as const,
      };
  }
}
