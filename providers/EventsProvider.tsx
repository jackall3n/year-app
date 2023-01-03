import { createContext, PropsWithChildren, useContext } from "react";
import useCollection from "../hooks/useCollection";
import { ICreateEvent, IEvent } from "../types/event";
import { addDoc, CollectionReference } from "firebase/firestore";

export interface IEventsContext {
  events: IEvent[];

  addEvent(event: ICreateEvent): Promise<void>;
}

export const EventsContext = createContext<IEventsContext>({
  events: [],
  addEvent: () => Promise.resolve(),
});

export const useEvents = () => useContext(EventsContext);

function EventsProvider({ children }: PropsWithChildren<unknown>) {
  const [events, collection] = useCollection<IEvent>("events");

  async function addEvent(event: IEvent) {
    await addDoc(collection, event);
  }

  console.log(events);

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export default EventsProvider;
