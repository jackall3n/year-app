import { useEffect, useMemo, useState } from "react";
import { collection, CollectionReference, Firestore, onSnapshot, query } from "@firebase/firestore";
import { pullAt } from "lodash";

import { IDocument } from "../types/document";
import { db } from "../db";

export function useCollection<T>(name: string) {

  const [data, setData] = useState<IDocument<T>[]>([]);

  const reference = useMemo(() => collection(db, name) as CollectionReference<T>, [name])

  useEffect(() => {
    const q = query<T>(reference);

    return onSnapshot(q, (snapshot) => {
      setData((data) => {
        const updated = [...data];

        for (const change of snapshot.docChanges()) {
          const { doc, type } = change;

          const index = updated.findIndex((d) => d.id === doc.id);

          switch (type) {
            case "added":
            case "modified": {
              const item = {
                id: doc.id,
                reference: doc.ref,
                exists: doc.exists(),
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

        return updated;
      });
    });
  }, [reference]);

  return [data, reference] as const;
}

export default useCollection;
