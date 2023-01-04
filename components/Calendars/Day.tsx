import { MouseEvent } from "react";
import classnames from "classnames";
import { format, getDay } from "date-fns";
import { IEvent } from "../../types/event";
import { orderBy } from "lodash";
import { getDayFromDate } from "./utils";

type IDay = ReturnType<typeof getDayFromDate>;

interface Props {
  day: IDay;
  className?: string;
  selected: string[];
  showMonth?: boolean;

  onClick(date: string, event: MouseEvent): void;
}

function createGradient(events: IEvent[]) {
  const gradients = events.map(({ color = "#000000" }, index) => {
    const start = (index / events.length) * 100;
    const end = ((index + 1) / events.length) * 100;

    return [`${color} ${start}%`, `${color} ${end}%`].join(", ");
  });

  if (!gradients.length) {
    return ``;
  }

  return `linear-gradient(135deg, ${gradients.join(", ")})`;
}

export function Day({ day, className, selected, onClick, showMonth }: Props) {
  const { date, events, formatted, isWeekend, dayOfMonth } = day;

  const [start, end] = orderBy(selected);

  const isSelected =
    selected.includes(formatted) || (start <= formatted && end >= formatted);

  const gradient = createGradient(events);

  const classNames = classnames(
    className,
    "aspect-square select-none cursor-pointer hover:bg-gray-200 text-xs flex rounded-sm relative overflow-hidden",
    {
      "bg-gray-50": isWeekend,
      "bg-white": !isWeekend,
      "font-bold": events.length,
    }
  );

  const isFirst = dayOfMonth === 1;

  return (
    <div
      key={date.toISOString()}
      onClick={(e) => onClick(formatted, e)}
      className={classNames}
      style={{
        background: gradient,
      }}
    >
      <div className={classnames("relative", { "font-semibold": isFirst })}>
        <span>{dayOfMonth}</span>
        {isFirst && showMonth && <span> {format(date, "MMM")}</span>}
      </div>

      {isSelected && (
        <div
          className={classnames("absolute inset-0 bg-gray-800 bg-opacity-40")}
        />
      )}
    </div>
  );
}
