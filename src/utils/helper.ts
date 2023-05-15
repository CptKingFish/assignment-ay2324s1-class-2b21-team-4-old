export const formatTimestampToTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.getHours().toString() + ":" + date.getMinutes().toString();
};
