import { DocumentReference } from "firebase/firestore";

export type IDocumentBase<T> = {
  id: string;
  reference: DocumentReference<T>;
  exists: boolean;
};

export type IDocument<T> = T & IDocumentBase<T>;
