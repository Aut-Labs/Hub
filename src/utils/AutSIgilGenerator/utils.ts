export function reverse(s) {
  return s.split("").reverse().join("");
}

export function checkReversed(input: string, compare: string): boolean {
  if (input === compare || reverse(input) === compare) {
    return true;
  }
  return false;
}

export function randomIntFromInterval(
  min,
  max,
  excludeNumber?,
  excludeNumberSecond?
) {
  // min and max included
  const number = Math.floor(Math.random() * (max - min + 1) + min);
  return number === excludeNumber || number === excludeNumberSecond
    ? randomIntFromInterval(min, max, excludeNumber)
    : number;
}

export const calculateFontSize = (name: string) => {
  const words = name.split(" ");
  const longestWordLength = Math.max(...words.map((word) => word.length));
  if (longestWordLength >= 22) {
    return "0.85rem !important";
  } else if (longestWordLength >= 20) {
    return "0.95rem !important";
  } else if (longestWordLength >= 18) {
    return "1.05rem !important";
  } else if (longestWordLength >= 16) {
    return "1.15rem !important";
  } else if (longestWordLength >= 14) {
    return "1.25rem !important";
  } else if (longestWordLength >= 12) {
    return "1.35rem !important";
  } else if (longestWordLength >= 10) {
    return "1.45rem !important";
  } else {
    return "";
  }
};
