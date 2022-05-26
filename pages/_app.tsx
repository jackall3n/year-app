import "../styles/globals.css";
import NavLink from "../components/NavLink";
import { useRouter } from "next/router";
import EventsProvider from "../providers/EventsProvider";
import ContactsProvider from "../providers/ContactsProvider";

function MyApp({ Component, pageProps }) {
  const { query } = useRouter();

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
              href="/jobs"
              className="text-2xl px-10 flex items-center justify-end"
              activeClassName="border-b-2 border-purple-400"
            >
              Jobs
            </NavLink>
          </div>
        </header>

        {modal?.startsWith("/event/") && (
          <div className="absolute inset-0 z-50 bg-white">Event</div>
        )}

        <div className="bg-gray-100 min-h-[100vh]">
          <Component {...pageProps} />
        </div>
      </ContactsProvider>
    </EventsProvider>
  );
}

export default MyApp;
