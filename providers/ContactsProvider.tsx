import { createContext, PropsWithChildren, useContext } from "react";
import { addDoc, DocumentReference } from "firebase/firestore";
import { IContact, IContactData } from "../types/contact";
import useCollection from "../hooks/useCollection";
import { IDocument } from "../types/document";

export interface IContactsContext {
  contacts: IDocument<IContact>[];

  addContact(contact: IContactData): Promise<DocumentReference<IContact>>;
}

export const ContactsContext = createContext<IContactsContext>(
  undefined as never
);

export const useContacts = () => useContext(ContactsContext);

function ContactsProvider({ children }: PropsWithChildren<unknown>) {
  const [contacts, collection] = useCollection<IContact>("contacts");

  async function addContact(contact: IContact) {
    return await addDoc(collection, contact);
  }

  return (
    <ContactsContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsProvider;
