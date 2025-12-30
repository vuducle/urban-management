/**
 * Helper to convert ISO Date to Vietnamese relative time
 * Example: 2025-12-30T14:20:00 -> "10p trước" or "2 giờ trước"
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}p trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays === 1) {
    return 'Hôm qua';
  } else {
    return `${diffInDays} ngày trước`;
  }
}
