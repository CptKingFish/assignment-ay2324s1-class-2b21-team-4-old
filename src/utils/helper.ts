export const formatTimestampToTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.getHours().toString() + ":" + date.getMinutes().toString();
};

export const formatTimeStampToDate = (timestamp: number) => {
  const date = new Date(parseInt(timestamp.toString()));

  return date.toLocaleString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes} ${amPm}`;
};
