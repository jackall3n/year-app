import { createContext, PropsWithChildren, useContext } from "react";
import useCollection from "../hooks/useCollection";
import { IEvent } from "../types/event";
import { addDoc } from "@firebase/firestore";
import firebase from "firebase/compat";
import CollectionReference = firebase.firestore.CollectionReference;

export interface IEventsContext {
  events: Array<IEvent & { ref: CollectionReference<IEvent>; id: string }>;
  addEvent(event: IEvent): Promise<void>;
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

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export default EventsProvider;
