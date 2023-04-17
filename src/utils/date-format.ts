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
