import "../styles/globals.css";
import NavLink from "../components/NavLink";
import { useRouter } from "next/router";
import EventsProvider, { useEvents } from "../providers/EventsProvider";
import ContactsProvider, { useContacts } from "../providers/ContactsProvider";
import { match } from "path-to-regexp";
import { PropsWithChildren } from "react";
import Modal from "../components/Modal";
import { format } from "date-fns";

function MyApp({ Component, pageProps }) {
  const { query, push } = useRouter();

  const modal = query?.modal as string;

  return (
    <EventsProvider>
      <ContactsProvider>
        <header className="sticky z-30 top-0 bg-white flex border-b">
          <div className="mx-auto max-w-[600px] flex-1 grid grid-cols-2 mx-auto h-16">
            <NavLink
              href="/"
              exact
              className="text-2xl px-10 flex items-center"
              activeClassName="border-b-2 border-purple-400"
            >
              Calendar
            </NavLink>
            <NavLink
              href="/contacts"
              className="text-2xl px-10 flex items-center justify-end"
              activeClassName="border-b-2 border-purple-400"
            >
              Contacts
            </NavLink>
          </div>
        </header>

        <ModalRoute path="/event/:id" component={ViewEvent} />

        <div className="bg-gray-100 min-h-[100vh]">
          <Component {...pageProps} />
        </div>
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

        {event.start && (
          <div>{format(event.start.toDate(), "EEE do MMM yyyy")}</div>
        )}
        {event.end && (
          <div>{format(event.end.toDate(), "EEE do MMM yyyy")}</div>
        )}
      </div>
    </Modal>
  );
}

export default MyApp;
