import classnames from "classnames";
import { format, getDay } from "date-fns";
import { IEvent } from "../../types/event";
import { orderBy } from "lodash";

interface IDay {
  date: Date;
  events: IEvent[];
}

interface Props {
  day: IDay;
  className?: string;
  selected: string[];
  onClick(date: string): void;
}

function createGradient(events: IEvent[]) {
  const gradients = events.map(({ color }, index) => {
    const start = (index / events.length) * 100;
    const end = ((index + 1) / events.length) * 100;

    return [`${color} ${start}%`, `${color} ${end}%`].join(", ");
  });

  if (!gradients.length) {
    return ``;
  }

  return `linear-gradient(135deg, ${gradients.join(", ")})`;
}

export function Day({ day, className, selected, onClick }: Props) {
  const { date, events } = day;

  const isWeekend = [5, 6].includes(getDay(date));

  const formatted = format(date, "yyyy-MM-dd");

  const [start, end] = orderBy(selected);

  const isSelected =
    selected.includes(formatted) || (start <= formatted && end >= formatted);

  const gradient = createGradient(events);

  const classNames = classnames(
    className,
    "cursor-pointer hover:bg-gray-200 text-xs flex items-center justify-center rounded-sm relative overflow-hidden",
    {
      "bg-gray-200": isWeekend,
      "bg-white": !isWeekend,
      "text-white": events.length,
    }
  );

  return (
    <div
      key={date.toISOString()}
      onClick={() => onClick(formatted)}
      className={classNames}
      style={{
        background: gradient,
      }}
    >
      <div className="relative">{format(date, "d")}</div>

      {isSelected && (
        <div
          className={classnames("absolute inset-0 bg-gray-800 bg-opacity-40")}
        />
      )}

      <div className="hidden absolute inset-0 flex flex-col divide-y divide-black divide-opacity-50">
        {events.map((e) => (
          <div
            className="flex-1"
            key={e.id}
            style={{ backgroundColor: e.color }}
          />
        ))}
      </div>
    </div>
  );
}
