import { createContext, PropsWithChildren, useContext } from "react";
import useCollection from "../hooks/useCollection";
import { ICreateEvent, IEvent } from "../types/event";
import { addDoc, CollectionReference } from "firebase/firestore";

export interface IEventsContext {
  events: IEvent[];

  addEvent(event: ICreateEvent): Promise<string>;
}

export const EventsContext = createContext<IEventsContext>(undefined as never);

export const useEvents = () => useContext(EventsContext);

function EventsProvider({ children }: PropsWithChildren<unknown>) {
  const [events, collection] = useCollection<IEvent>("events");

  async function addEvent(event: IEvent) {
    const reference = await addDoc(collection, event);

    return reference.id;
  }

  console.log(events);

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export default EventsProvider;
