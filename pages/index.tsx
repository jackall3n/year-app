import { doc } from "@firebase/firestore";
import { db } from "../db";
import { useState } from "react";
import { orderBy } from "lodash";

import AddButton from "../components/AddButton";
import AddModal from "../components/AddModal";
import { DesktopCalendar, MobileCalendar } from "../components/Calendars";
import { useEvents } from "../providers/EventsProvider";
import { useContacts } from "../providers/ContactsProvider";
import { format, isSameDay, isWithinInterval } from "date-fns";
import { parseDate } from "../utils/date";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/solid";

export default function Home() {
  const [showAdd, setShowAdd] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const { events, addEvent } = useEvents();
  const { contacts } = useContacts();

  const [selected, setSelected] = useState<string[]>([]);
  const [start, end] = orderBy(selected);

  function onClick(date: string) {
    if (selected.includes(date)) {
      setSelected(selected.filter((s) => s !== date));

      return;
    }

    if (!selecting) {
      setSelected([date]);

      return;
    }

    const [start, end] = [date, ...selected];

    setSelected([start, end].filter(Boolean));
  }

  async function onSave(values, helpers) {
    await addEvent({
      ...values,
      start: values.start ? new Date(values.start) : null,
      end: values.end ? new Date(values.end) : null,
      contact: doc(db, values.contact),
    });

    helpers.resetForm();

    setShowAdd(false);
    setSelecting(false);
    setSelected([]);
  }

  function onToggleSelecting() {
    if (selecting) {
      setSelecting(false);
      setSelected([]);

      return;
    }

    setSelecting(true);
  }

  return (
    <div className="mx-auto flex flex-col px-7 pt-10 pb-80 bg-gray-100">
      <DesktopCalendar events={events} onClick={onClick} selected={selected} />
      <MobileCalendar events={events} onClick={onClick} selected={selected} />

      {showAdd && (
        <AddModal
          onClose={() => setShowAdd(false)}
          onSave={onSave}
          start={start}
          end={end}
          contacts={contacts}
        />
      )}

      <div className="fixed flex flex-col bottom-0 right-0 left-0">
        <div className="flex items-center justify-end p-4 sm:p-8">
          <AddButton
            onClick={onToggleSelecting}
            selecting={selecting}
            selected={[start, end]}
          />
        </div>

        <Events
          start={start}
          end={end}
          selecting={selecting}
          onSetAdd={() => setShowAdd(true)}
        />
      </div>
    </div>
  );
}

function Events({ start, end, onSetAdd, selecting }: any) {
  const { events } = useEvents();
  const { contacts } = useContacts();

  const parsedStart = parseDate(start);
  const parsedEnd = parseDate(end);

  const filtered = events.filter((event) => {
    if (selecting) {
      return false;
    }

    if (!event.start) {
      return false;
    }

    if (!event.end) {
      return isSameDay(event.start.toDate(), parsedStart);
    }

    return isWithinInterval(parsedStart, {
      start: event.start.toDate(),
      end: event.end.toDate(),
    });
  });

  if (!selecting && !filtered.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-t-xl border-t py-5 shadow-lg max-h-[350px] overflow-y-auto">
      <div className="mx-auto max-w-[600px] grid grid-cols-1 gap-3 px-5">
        {filtered.map((e) => {
          const contact = contacts.find(
            (c) => c.reference.path === e.contact?.path
          );

          return (
            <Link key={e.id} href={{ query: { modal: `/event/${e.id}` } }}>
              <a className="bg-white rounded-md overflow-hidden flex shadow-md border border-gray-100 hover:bg-gray-200 cursor-pointer transition-all hover:shadow-md">
                <div
                  className="w-1 h-full rounded-full"
                  style={{ backgroundColor: e.color }}
                />

                <div className="flex-1 flex justify-between px-4 py-3">
                  <div className="flex flex-col">
                    <div className="font-medium">{contact?.name}</div>
                    {e.notes && (
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis text-xs text-gray-400 pt-0.5">
                        {e.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end pt-0.5">
                    <div className="flex">
                      {e.start ? (
                        <div className="uppercase bg-purple-400 text-purple-900 text-xs font-medium rounded-md px-2 py-0.5">
                          Booked
                        </div>
                      ) : (
                        <div className="uppercase bg-yellow-400 text-yellow-900 text-xs font-medium rounded-md px-2 py-0.5">
                          Planned
                        </div>
                      )}
                    </div>

                    {Boolean(e.start || e.end) && (
                      <div className="text-xs pt-2">
                        <span>
                          {e.start && format(e.start?.toDate(), "do MMM")}
                        </span>

                        {e.end && (
                          <span>
                            <span> - </span>

                            <span>{format(e.end?.toDate(), "do MMM")}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </Link>
          );
        })}

        {selecting && (
          <button
            className="opacity-75 bg-white rounded-md overflow-hidden flex shadow-md border hover:bg-gray-200 cursor-pointer transition-all hover:shadow-md"
            onClick={onSetAdd}
          >
            <div className="w-1 h-full rounded-full bg-blue-500" />

            <div className="flex-1 flex justify-between px-4 py-3">
              <div className="flex flex-col">
                <div className="font-medium flex items-center">
                  <span>Create a new job</span>
                  <PlusCircleIcon className="w-5 h-5 ml-1 text-blue-500" />
                </div>
              </div>

              <div className="flex flex-col items-end pt-0.5">
                <div className="flex">
                  <div className="uppercase bg-blue-400 text-blue-900 text-xs font-medium rounded-md px-2 py-0.5">
                    New
                  </div>
                </div>

                <div className="text-xs pt-2">
                  <span>
                    {parsedStart ? (
                      format(parsedStart, "do MMM")
                    ) : (
                      <span className="italic">No date</span>
                    )}
                  </span>

                  {parsedEnd && (
                    <span>
                      <span> - </span>

                      <span>{format(parsedEnd, "do MMM")}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
