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
