import "../styles/globals.css";
import NavLink from "../components/NavLink";
import { useRouter } from "next/router";
import EventsProvider, { useEvents } from "../providers/EventsProvider";
import ContactsProvider, { useContacts } from "../providers/ContactsProvider";
import { match } from "path-to-regexp";
import { PropsWithChildren } from "react";
import Modal from "../components/Modal";
import { format } from "date-fns";
import { AppProps } from "next/app";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import JobsProvider from "../providers/JobsProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const { query, push } = useRouter();

  const modal = query?.modal as string;

  return (
    <EventsProvider>
      <ContactsProvider>
        <JobsProvider>
          <header className="sticky z-30 top-0 bg-white flex border-b">
            <div className="mx-auto max-w-[600px] flex-1 px-2 flex items-center h-16">
              <Link
                href="/"
                className="block flex-1 text-base font-bold px-5 h-16 flex items-center"
              >
                Yearly
              </Link>

              <div className="grid grid-cols-2">
                <NavLink
                  href="/"
                  exact
                  className="flex items-center w-16 h-16 justify-center"
                  activeClassName="border-b-2 border-purple-400 bg-gray-50"
                >
                  <CalendarIcon className="w-5 h-5" />
                </NavLink>
                <NavLink
                  href="/contacts"
                  className="flex items-center w-16 h-16 justify-center"
                  activeClassName="border-b-2 border-purple-400 bg-gray-50"
                >
                  <UserIcon className="w-5 h-5" />
                </NavLink>
              </div>
            </div>
          </header>

          <ModalRoute path="/event/:id" component={ViewEvent} />

          <div className="bg-gray-100 min-h-[100vh]">
            <Component {...pageProps} />
          </div>
        </JobsProvider>
      </ContactsProvider>
    </EventsProvider>
  );
}

function ModalRoute({
  children,
  path,
  component: Component,
}: PropsWithChildren<{ path: string; component: any }>) {
  const { query } = useRouter();

  const modal = query?.modal as string;

  const fn = match(path);

  const result = fn(modal);

  console.log(result);

  if (!result) {
    return null;
  }

  if (children) {
    return <>{children}</>;
  }

  if (Component) {
    return <Component match={result} />;
  }

  return null;
}

function ViewEvent({
  children,
  match,
}: PropsWithChildren<{ match: { params: { id } } }>) {
  const { push } = useRouter();
  const { events } = useEvents();
  const { contacts } = useContacts();

  const { id } = match.params;

  const event = events.find((e) => e.id === id);
  const contact = contacts.find(
    (c) => c.reference.path === event?.contact?.path
  );

  if (!event) {
    return null;
  }

  return (
    <Modal onClose={() => push({ query: {} })}>
      <div>
        <div className="text-2xl">{contact?.name}</div>

        {event.start && <div>{format(event.start, "EEE do MMM yyyy")}</div>}
        {event.end && <div>{format(event.end, "EEE do MMM yyyy")}</div>}
      </div>
    </Modal>
  );
}

export default MyApp;
