import { ICreateDocument, IDocument } from "./document";
import { DocumentReference } from "firebase/firestore";
import { IContact } from "./contact";

export interface IJobData {
  name: string;
  contact: DocumentReference<IContact>;
}

export type IJob = IDocument<IJobData>;
export type ICreateJob = ICreateDocument<IJob>;
