import { DocumentReference, Timestamp } from "firebase/firestore";
import { IContact, IContactData } from "./contact";
import { IDocument } from "../hooks/useCollection";

export interface IEventData {
  start?: Timestamp;
  end?: Timestamp;
  color?: string;
  notes?: string;
  contact?: DocumentReference<IContactData>;
}

export type IEvent = IDocument<IEventData>;
