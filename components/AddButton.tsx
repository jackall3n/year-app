import { PlusIcon } from "@heroicons/react/outline";
import { format, isSameMonth } from "date-fns";
import { parseDate } from "../utils/date";
import classnames from "classnames";

interface Props {
  onClick(): void;
  selected: string[];
  selecting: boolean;
}

function AddButton({ onClick, selected, selecting }: Props) {
  const [start, end] = selected.map(parseDate);

  const sameMonth = start  && end ? isSameMonth(start, end) : false;

  return (
    <button
      onClick={onClick}
      className="flex items-center h-18 bg-white rounded-full p-2 shadow-lg"
    >
      {start && (
        <div className="px-5">
          {/*<span>Add </span>*/}
          <strong>{format(start, sameMonth ? "do" : "do MMM")}</strong>
          {end && (
            <>
              <span> - </span>
              <strong>{format(end, "do MMM")}</strong>
            </>
          )}
          {/*<span>?</span>*/}
        </div>
      )}

      <div className="flex-0 rounded-full bg-blue-500 text-white h-16 w-16 flex items-center justify-center">
        <PlusIcon
          className={classnames("w-8 h-8 transition", {
            "rotate-45": selecting,
          })}
        />
      </div>
    </button>
  );
}

export default AddButton;
