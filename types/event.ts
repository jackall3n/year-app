import { DocumentReference } from "firebase/firestore";
import { IContactData } from "./contact";
import { ICreateDocument, IDocument } from "./document";

export interface IEventData {
  start?: Date;
  end?: Date;
  color?: string;
  notes?: string;
  contact?: DocumentReference<IContactData>;
  job?: DocumentReference<any>;
}

export type IEvent = IDocument<IEventData>;
export type ICreateEvent = ICreateDocument<IEvent>;
