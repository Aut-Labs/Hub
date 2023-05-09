import {
  addMinutes,
  format,
  isBefore,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds
} from "date-fns";

export const countWords = (value: string) =>
  (value || "").split(" ").filter((x) => !!x).length;

export const generateTimeSlots = ({
  date = new Date(),
  start,
  end,
  interval
}: {
  date?: Date;
  start: number;
  end: number;
  interval: number;
}): Date[] => {
  const setTime = (x: Date, h = 0, m = 0, s = 0, ms = 0): Date =>
    setHours(setMinutes(setSeconds(setMilliseconds(x, ms), s), m), h);

  const from = setTime(date, start);
  const to = setTime(date, end);
  const step = (x: Date): Date => addMinutes(x, interval);

  const blocks: Date[] = [];

  let cursor = from;

  while (isBefore(cursor, to)) {
    blocks.push(cursor);
    cursor = step(cursor);
  }
  // return blocks.map((d) => format(d, 'hh:mm a'));
  return blocks;
};

export const generateDurationInterval = () => {
  return [
    {
      label: "15 mins",
      value: "15m"
    },
    {
      label: "30 mins",
      value: "30m"
    },
    {
      label: "45 mins",
      value: "45m"
    },
    {
      label: "1 hour",
      value: "1h"
    }
  ];
};

export const trimAddress = (address: string) => {
  if (!address) {
    return "";
  }
  const middle = Math.ceil(address.length / 2);
  const left = address.slice(0, middle).substring(0, 6);
  let right = address.slice(middle);
  right = right.substr(right.length - 4);
  return `${left}...${right}`.toUpperCase();
};

export const toHex = (num) => {
  const val = Number(num);
  return `0x${val.toString(16)}`;
};
