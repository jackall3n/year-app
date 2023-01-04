import { TagIcon } from "@heroicons/react/24/outline";
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
              className="bg-white rounded-md overflow-hidden flex flex-col shadow hover:bg-gray-100 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="border-b flex items-center px-3 py-2">
                <div
                  className="rounded-full aspect-square w-7 text-sm flex items-center justify-center text-white font-medium mr-2"
                  style={{ backgroundColor: contact.color }}
                >
                  {contact.name[0]}
                </div>

                <div className="font-medium">{contact.name} </div>
              </div>

              <div className="px-3 py-3">
                <div className="flex">
                  <div className="w-7 flex items-center justify-center mr-1">
                    <TagIcon className="w-5 h-5 text-gray-500" />
                  </div>

                  {contact.type && (
                    <div className="text-xs border px-1 text-gray-700 font-semibold py-0.5 rounded-md">
                      {contact.type}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
