import { format } from "date-fns";
import Link from "next/link";
import { useEvents } from "../providers/EventsProvider";
import { useContacts } from "../providers/ContactsProvider";

export default function Home() {
  const { events } = useEvents();
  const { contacts } = useContacts();

  return (
    <div className="mx-auto max-w-[600px] flex flex-col px-10 pt-10 pb-32 bg-gray-100">
      <div className="grid grid-cols-1 gap-4">
        {events.map((e) => {
          const contact = contacts.find(
            (c) => c.reference.path === e.contact?.path
          );

          return (
            <Link key={e.id} href={{ query: { modal: `/event/${e.id}` } }}>
              <a className="bg-white rounded-md overflow-hidden flex shadow-md border hover:bg-gray-200 cursor-pointer transition-all hover:shadow-md">
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
      </div>
    </div>
  );
}
