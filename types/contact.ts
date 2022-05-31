import { IDocument } from "./document";

export interface IContactData {
  name: string;
  color: string;
}

export interface IContactJobData {
  name: string;
}

export type IContact = IDocument<IContactData>;
export type IContactJob = IDocument<IContactJobData>;
