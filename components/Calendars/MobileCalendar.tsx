import { Fragment, useMemo, useState } from "react";
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
  onClick(date: string): void;
  selected: string[];
}

export function MobileCalendar({ events, onClick, selected }: Props) {
  const [year, setYear] = useState(2022);

  const weeks = useMemo(() => getWeeks(year, events), [year, events]);

  return (
    <div className="grid gap-1 lg:hidden flex-1">
      <div className="grid grid-cols-8 gap-1 items-center sticky top-16 z-20 pt-2 pb-1 bg-gray-100">
        <div />

        {Array.from(Array(7)).map((_, i) => {
          const day = addDays(startOfYear(new Date(year, 0, 1)), i + 2);

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

      <div className="square-grid grid gap-1 grid-cols-8 items-center">
        {weeks.map((week, index) => (
          <Fragment key={index}>
            <div
              className={classNames(
                "flex items-center text-sm font-medium text-gray-600 bg-gray-100",
                {
                  "sticky top-24": week.label,
                }
              )}
            >
              {week.label}
            </div>

            {index === 0 && (
              <>
                {Array.from(Array(week.padding.start)).map((_, i) => (
                  <div key={i} className="w-7 h-7 bg-transparent" />
                ))}
              </>
            )}

            {week.days.map((day) => (
              <Day
                key={day.date.toISOString()}
                day={day}
                selected={selected}
                onClick={onClick}
              />
            ))}
          </Fragment>
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

function getWeek(date: Date, events: IEvent[]) {
  const start = max([startOfYear(date), startOfWeek(date)]);
  const month = startOfMonth(date);
  const end = endOfWeek(date);
  const days = differenceInDays(end, start) + 1;
  const firstLine = isSameDay(startOfYear(date), startOfWeek(date));

  const label = isWithinInterval(month, { start, end })
    ? format(month, "MMM")
    : "";

  const padding = {
    start: getDay(start) || 7,
    end: getDay(end) || 7,
  };

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

        if (endDate.toDate() < start.toDate()) {
          return false;
        }

        return isWithinInterval(date, {
          start: startOfDay(start.toDate()),
          end: endOfDay(endDate.toDate()),
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
