import { IEvent } from "../../types/event";
import {
  endOfDay,
  format,
  getDate,
  getDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";

export function getDayFromDate(date: Date, events: IEvent[]) {
  const isWeekend = [0, 6].includes(getDay(date));

  const formatted = format(date, "yyyy-MM-dd");

  return {
    date,
    isWeekend,
    formatted,
    dayOfMonth: getDate(date),
    events: events.filter((event) => {
      const { start, end } = event;

      if (!start) {
        return false;
      }

      const endDate = end || start;

      if (endDate < start) {
        return false;
      }

      return isWithinInterval(date, {
        start: startOfDay(start),
        end: endOfDay(endDate),
      });
    }),
  };
}
