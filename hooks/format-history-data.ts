/**
 * Helpers to format history data into sections like "HÔM NAY", "HÔM QUA", and "TRƯỚC ĐÓ".
 * @param data
 * @returns Formatted data grouped by date sections
 */
export function formatHistoryData(data: any[]) {
  const groups: { [key: string]: any[] } = {};
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split('T')[0];

  data.forEach((item) => {
    let sectionTitle = 'TRƯỚC ĐÓ';
    if (item.date === today) sectionTitle = 'HÔM NAY';
    else if (item.date === yesterday) sectionTitle = 'HÔM QUA';

    if (!groups[sectionTitle]) groups[sectionTitle] = [];
    groups[sectionTitle].push(item);
  });

  return Object.keys(groups).map((title) => ({
    title,
    data: groups[title],
  }));
}
