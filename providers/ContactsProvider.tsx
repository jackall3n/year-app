import { createContext, PropsWithChildren, useContext } from "react";
import { addDoc } from "@firebase/firestore";
import { IContact, IContactData } from "../types/contact";
import useCollection from "../hooks/useCollection";
import { IDocument } from "../types/document";

export interface IContactsContext {
  contacts: IDocument<IContact>[];
  addContact(contact: IContactData): Promise<string>;
}

export const ContactsContext = createContext<IContactsContext>({
  contacts: [],
  addContact: () => Promise.resolve(''),
});

export const useContacts = () => useContext(ContactsContext);

function ContactsProvider({ children }: PropsWithChildren<unknown>) {
  const [contacts, collection] = useCollection<IContact>("contacts");

  async function addContact(contact: IContact) {
    const reference = await addDoc(collection, contact);

    return reference.path;
  }

  return (
    <ContactsContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsProvider;
