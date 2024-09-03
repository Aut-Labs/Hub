import { getUnixTime, parseISO } from "date-fns";

export const timeLeft = ({ isStarted, timeleft, startsIn }) => {
  if (isStarted) {
    return `${timeleft} ${timeleft === 1 ? "day" : "days"} Left`;
  }
  return `Starts in ${startsIn} ${startsIn === 1 ? "day" : "days"}`;
};

export const parseDate = (date: Date | string | number) => {
  if (!date) {
    return;
  }
  if (typeof date === "string") {
    return parseISO(date)?.toDateString();
  }
  return (date as Date)?.toDateString();
};

export const dateToUnix = (date: Date | string | number) => {
  if (!date) {
    return;
  }
  if (typeof date === "string") {
    date = parseISO(date);
  }
  return getUnixTime(date);
};

export const parseTimestamp = (ts) => {
  const [time, date] = ts.split(" | ");
  const [hours, minutes, seconds] = time.split(":");
  const [day, month, year] = date.split("/").map((num) => parseInt(num, 10));

  // Note: month is 0-indexed in JavaScript Date, subtract 1 from the month
  const fullYear = year + 2000; // Adjust century
  return new Date(fullYear, month - 1, day, hours, minutes, seconds);
};

export const parsTimestamp = (ts) => {
  const dateObj = new Date(parseInt(ts));
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Month is 0-indexed in JavaScript Date
  const year = dateObj.getFullYear();

  return new Date(year, month - 1, day, hours, minutes, seconds);
};
