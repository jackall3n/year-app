import { useMemo, useState, MouseEvent } from "react";
import classNames from "classnames";
import { IEvent } from "../../types/event";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfDay,
  format,
  getDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { Day } from "./Day";

interface Props {
  events: IEvent[];
  onClick(date: string, event: MouseEvent): void;
  selected: string[];
}

export function DesktopCalendar({ events, onClick, selected }: Props) {
  const [year, setYear] = useState(2023);

  const months = useMemo(() => getMonths(year, events), [year, events]);

  return (
    <div className="grid gap-1 lg:block hidden mx-auto">
      <div className="flex gap-1 grid-flow-col items-center sticky top-0 pt-5">
        <div className="w-20 h-7 flex items-center justify-center" />

        {Array.from(Array(37)).map((_, i) => {
          const day = addDays(startOfYear(new Date(year, 0, 1)), i + 1);

          return (
            <div
              key={i}
              className={classNames(
                "w-7 h-7 text-xs flex items-center justify-center rounded-sm font-semibold",
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

      {months.map((month, index) => (
        <div key={index} className="flex gap-1 grid-flow-col items-center pt-1">
          <div
            className="w-20 h-7 flex items-center justify-center"
            data-offset={month.offset}
          >
            {format(month.days[0].date, "MMM")}
          </div>

          {Array.from(Array(month.padding.start)).map((_, i) => (
            <div key={i} className="w-7 h-7 bg-transparent" />
          ))}

          {month.days.map((day) => (
            <Day
              key={day.date.toISOString()}
              day={day}
              selected={selected}
              onClick={onClick}
              className="w-7 h-7"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function getMonths(year: number, events: IEvent[]) {
  const start = startOfYear(new Date(year, 0, 1));

  const months = Array.from(Array(12)).map((_, i) =>
    getMonth(addMonths(start, i), events)
  );

  return months;
}

function getMonth(date: Date, events: IEvent[]) {
  const start = startOfMonth(date);
  const end = addMonths(date, 1);
  const days = differenceInDays(end, start);

  const padding = {
    start: getDay(start) || 6,
    end: getDay(end) || 6,
  };

  return {
    padding,
    offset: getDay(start) || 7,
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

export default DesktopCalendar;
