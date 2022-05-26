import { createContext, PropsWithChildren, useContext } from "react";
import { addDoc } from "@firebase/firestore";
import { IContact } from "../types/contact";
import useCollection, { IDocument } from "../hooks/useCollection";

export interface IContactsContext {
  contacts: IDocument<IContact>[];
  addContact(contact: IContact): Promise<void>;
}

export const ContactsContext = createContext<IContactsContext>({
  contacts: [],
  addContact: () => Promise.resolve(),
});

export const useContacts = () => useContext(ContactsContext);

function ContactsProvider({ children }: PropsWithChildren<unknown>) {
  const [contacts, collection] = useCollection<IContact>("contacts");

  async function addContact(contact: IContact) {
    await addDoc(collection, contact);
  }

  return (
    <ContactsContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export default ContactsProvider;
