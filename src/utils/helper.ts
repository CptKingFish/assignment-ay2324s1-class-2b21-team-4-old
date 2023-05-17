export const formatTimestampToTime = (timestamp: number) => {
  if (!timestamp) return "";
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
  const formattedDate = new Date(date);

  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear().toString();
  const hours = formattedDate.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes} ${amPm}`;
};
