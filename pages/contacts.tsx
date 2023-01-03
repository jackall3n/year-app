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
        {contacts.map((contact) => {
          return (
            <Link
              key={contact.id}
              href={`/contacts/${contact.id}`}
              className="bg-white rounded-md overflow-hidden flex shadow-md border hover:bg-gray-200 cursor-pointer transition-all hover:shadow-md"
            >
              <div
                className="w-1 h-full rounded-full"
                style={{ backgroundColor: contact.color }}
              />

              <div className="flex-1 flex justify-between px-4 py-3">
                <div className="flex flex-col">
                  <div className="font-medium">{contact?.name}</div>
                </div>

                <div className="flex flex-col items-end pt-0.5">
                  <div className="flex"></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
