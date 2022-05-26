import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "../db";
import { orderBy, pullAt } from "lodash";
import { CollectionReference, DocumentReference } from "firebase/firestore";

export type IDocument<T> = T & {
  id: string;
  reference: DocumentReference<T>;
};

function useCollection<T>(name: string, options = { orderBy: undefined }) {
  const [data, setData] = useState<IDocument<T>[]>([]);

  const col = collection(db, name) as CollectionReference<T>;

  useEffect(() => {
    const q = query<T>(col);

    return onSnapshot(q, (snapshot) => {
      setData((data) => {
        const updated = [...data];

        console.log(name, updated.length);

        for (const change of snapshot.docChanges()) {
          const { doc, type } = change;

          const index = updated.findIndex((d) => d.id === doc.id);

          switch (type) {
            case "added":
            case "modified": {
              const item = {
                id: doc.id,
                reference: doc.ref,
                ...doc.data(),
              };

              if (index === -1) {
                updated.push(item);
              } else {
                updated[index] = item;
              }

              break;
            }
            case "removed": {
              if (index === -1) {
                break;
              }

              pullAt(updated, index);

              break;
            }
          }
        }

        console.log(name, { updated });

        return orderBy(updated, options.orderBy);
      });
    });
  }, []);

  console.log(name, data.length);

  return [data, col] as const;
}

export default useCollection;
