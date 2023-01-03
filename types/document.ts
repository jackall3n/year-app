import { DocumentReference } from "firebase/firestore";

export type IDocumentBase<T> = {
  id: string;
  reference: DocumentReference<T>;
  exists: boolean;
};

export type IDocument<T> = T & IDocumentBase<T>;
export type ICreateDocument<T extends IDocument<any>> = Omit<
  T,
  "id" | "ref" | "exists"
>;
