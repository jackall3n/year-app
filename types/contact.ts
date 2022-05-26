import { IDocument } from "../hooks/useCollection";

export interface IContactData {
  name: string;
  color: string;
}

export type IContact = IDocument<IContactData>;
