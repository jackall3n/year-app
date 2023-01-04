import { IDocument } from "./document";

export interface IContactData {
  name: string;
  color: string;
  type: string;
}

export type IContact = IDocument<IContactData>;
