import React from "react";
import classnames from "classnames";
import { Field, FieldAttributes } from "formik";

export function TextField({ ...props }: FieldAttributes<unknown>) {
  return (
    <Field
      {...props}
      className={classnames(
        props.className,
        "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      )}
    />
  );
}
