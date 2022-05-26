import { parse } from "date-fns";

export function parseDate(date: string) {
  if (!date) {
    return null;
  }

  return parse(date, "yyyy-MM-dd", new Date());
}
