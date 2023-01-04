import { addDays } from "date-fns";

export function range(start: Date, end: Date) {
  let current = start;

  const dates = [];

  while (current < end) {
    dates.push(current);

    current = addDays(current, 1);
  }

  return dates;
}
