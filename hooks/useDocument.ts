import { useEffect, useMemo, useState } from "react";
import {
  doc,
  DocumentReference,
  Firestore,
  onSnapshot,
} from "@firebase/firestore";

import { IDocument } from "../types/document";
import { db } from "../db";

export function useDocument<T>(name: string) {
  const [data, setData] = useState<IDocument<T>>();

  const reference = useMemo(
    () => doc(db, name) as DocumentReference<T>,
    [name]
  );

  useEffect(() => {
    return onSnapshot(reference, (snapshot) => {
      if (!snapshot.exists()) {
        setData(undefined as any);
      }

      setData({
        id: snapshot.ref.id,
        reference,
        exists: snapshot.exists(),
        ...snapshot.data(),
      } as any);
    });
  }, [reference]);

  return [data, reference] as const;
}
