import React from "react";
import classnames from "classnames";
import { Field as FormikField, FieldAttributes } from "formik";

interface Props extends FieldAttributes<any> {
  label: string | React.ComponentElement<any, any>;
  labelClassName?: string;
  footer?: React.ComponentElement<any, any>;
}

export function Field({ label, labelClassName, footer, ...props }: Props) {
  return (
    <label className={labelClassName}>
      <span className="text-gray-700 block mb-1">{label}</span>
      <div className="flex">
        <>
          <FormikField
            {...props}
            className={classnames(
              props.className,
              "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
              "disabled:bg-gray-200"
            )}
          />
          {footer}
        </>
      </div>
    </label>
  );
}
