function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';  // 4th–20th
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export const getFormattedDate = (date: Date): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
}

/* Kinda messy :) */
export const calculateTimeAgo = (date: Date): string => {
  const now = new Date().getTime();
  const dateTime = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const seconds = Math.floor((now - dateTime) / 1000);
  console.log('seconds between now and posted', seconds);

  var interval = seconds / 31536000;

  if (interval > 1) {
    const label = Math.floor(interval) === 1 ? "year" : "years";
    return Math.floor(interval) + " " + label + " ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const label = Math.floor(interval) === 1 ? "month" : "months";
    return Math.floor(interval) + " " + label + " ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const label = Math.floor(interval) === 1 ? "day" : "days";
    return Math.floor(interval) + " " + label + " ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const label = Math.floor(interval) === 1 ? "hour" : "hours";
    return Math.floor(interval) + " " + label + " ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    const label = Math.floor(interval) === 1 ? "minute" : "minutes";
    return Math.floor(interval) + " " + label + " ago";
  }
  const label = Math.floor(seconds) === 1 ? "second" : "seconds";
  return Math.floor(seconds) + " " + label + " ago";
};
