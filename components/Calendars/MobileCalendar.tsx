import { MouseEvent, useMemo, useState } from "react";
import classNames from "classnames";
import { IEvent } from "../../types/event";
import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  getDay,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { Day } from "./Day";
import { getDayFromDate } from "./utils";
import { make } from "../../utils/make";
import { range } from "../../utils/range";

interface Props {
  events: IEvent[];

  onClick(date: string, event: MouseEvent): void;

  selected: string[];
}

export function MobileCalendar({ events, onClick, selected }: Props) {
  const [year, setYear] = useState(2023);

  const months = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));

    return getMonths(start, events);
  }, [year, events]);

  return (
    <div className="grid gap-1 lg:hidden flex-1">
      <div className="grid grid-cols-7 gap-px sm:gap-1 items-center sticky top-16 z-20 pt-2 pb-1 bg-gray-100">
        {Array.from(Array(7)).map((_, i) => {
          const day = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);

          return (
            <div
              key={i}
              className={classNames(
                "h-8 text-xs flex items-center justify-center rounded-sm font-semibold",
                {
                  "bg-gray-200": [6, 0].includes(getDay(day)),
                }
              )}
            >
              {format(day, "E")[0]}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {months.map((month) => {
          return (
            <div
              className="contents"
              data-month={month.month}
              key={month.month}
            >
              <div className="col-span-7 text-sm font-semibold sticky top-28 z-20 bg-gray-200 px-2 py-1 mt-1">
                {month.month}
              </div>

              {month.padding.map((padding, index) => (
                <div key={index} className="aspect-square" />
              ))}

              {month.days.map((day) => (
                <Day
                  key={day.date.toISOString()}
                  day={day}
                  selected={selected}
                  onClick={onClick}
                  className="p-2"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getMonth(start: Date, events: IEvent[]) {
  const end = addMonths(start, 1);

  const days = range(start, end).map((date) => getDayFromDate(date, events));

  const fromStart = differenceInDays(
    start,
    startOfWeek(start, { weekStartsOn: 1 })
  );

  return {
    month: format(start, "MMM"),
    padding: make(fromStart),
    days,
  };
}

function getMonths(start: Date, events: IEvent[]) {
  return make(12).map((i) => getMonth(addMonths(start, i), events));
}

export default MobileCalendar;
