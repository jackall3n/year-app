import { IDocument } from "./document";

export interface IContactData {
  name: string;
  color: string;
}

export type IContact = IDocument<IContactData>;
