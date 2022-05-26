import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "../db";
import { orderBy, uniqBy } from "lodash";

function useData<T = any>(name: string) {
  const [data, setData] = useState<T[]>([]);

  const col = collection(db, name);

  useEffect(() => {
    const q = query(col);

    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        updated: new Date(),
        ref: doc.ref,
        ...doc.data(),
      }));

      const updated = [...data, ...results];

      setData(
        orderBy(uniqBy(orderBy(updated, "updated", "desc"), "id"), (e: any) => {
          if (e.end) {
            return e.end.toDate();
          }

          if (e.start) {
            return e.start.toDate();
          }

          return e.color;
        }) as T[]
      );
    });
  }, []);

  return [data, col] as const;
}

export default useData;
