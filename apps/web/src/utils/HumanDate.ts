export function humanizeDate(datetime: string): string {
  const date = new Date(datetime);
  const now = new Date();

  // Remove seconds and ms for comparison
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.floor((d.getTime() - n.getTime()) / (1000 * 60 * 60 * 24));

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) {
    return `Today at ${timeString}`;
  }

  if (diffDays === 1) {
    return `Tomorrow at ${timeString}`;
  }

  if (diffDays > 1 && diffDays <= 7) {
    const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
    return `${weekday} at ${timeString}`;
  }

  // More than a week away → shorter, less noisy
  const month = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return `${month} at ${timeString}`;
}