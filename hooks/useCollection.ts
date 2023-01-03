import { useMemo } from "react";
import {
  collection,
  CollectionReference,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { mapValues } from "lodash";
import { db } from "../db";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {IDocument} from "../types/document";

function normalize<T>(data: T) {
  if (!data) {
    return data;
  }

  if (typeof data === "object") {
    if ("firestore" in data) {
      return data;
    }

    if ("toDate" in data && typeof data.toDate === "function") {
      return data.toDate();
    }

    return mapValues(data, (property) => normalize(property));
  }

  return data;
}

const converter = {
  fromFirestore(model: QueryDocumentSnapshot) {
    const normalised = normalize(model.data());

    return {
      id: model.id,
      reference: model.ref,
      ...normalised,
    };
  },
  toFirestore(object) {
    return object;
  },
};

export function useCollection<T>(name: string) {
  const reference = useMemo(
    () =>
      collection(db, "users", "dan", name).withConverter(
        converter
      ) as CollectionReference<T>,
    [name]
  );

  const [data = []] = useCollectionData(reference);

  return [data, reference] as [IDocument<T>[], CollectionReference<T>];
}

export default useCollection;
