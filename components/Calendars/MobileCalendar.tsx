import { Fragment, useMemo, useState, MouseEvent } from "react";
import classNames from "classnames";
import { IEvent } from "../../types/event";
import {
  addDays,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInWeeks,
  endOfDay,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isWithinInterval,
  max,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { Day } from "./Day";

interface Props {
  events: IEvent[];

  onClick(date: string, event: MouseEvent): void;

  selected: string[];
}

export function MobileCalendar({ events, onClick, selected }: Props) {
  const [year, setYear] = useState(2023);

  const { days, padding } = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const days = getDays(start, events);
    const fromStart = differenceInDays(start, startOfWeek(start, { weekStartsOn: 1 }))
    const padding = Array.from(Array(fromStart));

    return { days, padding };
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
        {padding.map((padding, index) => (
          <div key={index} className="aspect-square" />
        ))}

        {days.map((day) => (
          <Day
            key={day.date.toISOString()}
            day={day}
            selected={selected}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}

function getWeeks(year: number, events: IEvent[]) {
  const start = startOfYear(new Date(year, 0, 1));
  const end = addYears(start, 1);
  const difference = differenceInWeeks(end, start) + 1;

  const weeks = Array.from(Array(difference)).map((_, i) =>
    getWeek(addWeeks(start, i), events)
  );

  return weeks;
}

function getDays(start: Date, events: IEvent[]) {
  const end = addYears(start, 1);

  const days = range(start, end);

  return days.map((date) => {
    const e = events.filter((event) => {
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
    });

    return {
      id: date.toISOString(),
      date,
      events: e,
    };
  });
}

function range(start: Date, end: Date) {
  let current = start;

  const dates = [];

  while (current < end) {
    dates.push(current);

    current = addDays(current, 1);
  }

  return dates;
}

function getWeek(date: Date, events: IEvent[]) {
  const start = max([startOfYear(date), startOfWeek(date)]);
  const month = startOfMonth(date);
  const end = endOfWeek(date);
  const days = differenceInDays(end, start) + 1;

  const label = isWithinInterval(month, { start, end })
    ? format(month, "MMM")
    : "";

  const padding = {
    start: (getDay(start) as number) || 6,
  };

  if (!label) {
    padding.start = 0;
  }

  console.log(label);

  return {
    label,
    padding,
    days: Array.from(Array(days)).map((_, i) => {
      const date = addDays(start, i);
      const e = events.filter((event) => {
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
      });

      return {
        date,
        events: e,
      };
    }),
  };
}

export default MobileCalendar;
