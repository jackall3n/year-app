import { Form, Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { IContact } from "../types/contact";
import { useContacts } from "../providers/ContactsProvider";
import { Field } from "./Form";

import colors from "../colors.json";
import { orderBy } from "lodash";
import useCollection from "../hooks/useCollection";

interface Props {
  onClose(): void;
  onSave(values: ICreateEvent, helpers: FormikHelpers<ICreateEvent>): void;
  start?: string;
  end?: string;
  contacts: IContact[];
}

export interface ICreateEvent {
  start: string;
  end: string;
  contact: string;
  contactName: string;
  job: string;
  jobName: string;
  color: string;
  notes: string;
}

function AddModal({ onClose, onSave, start, end, contacts }: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />

      <div className="relative z-40 bg-white mx-auto max-w-md mb-5 mt-5 sm:mt-20 rounded-xl fixed overflow-y-auto">
        <h2 className="mb-6 text-xl font-semibold flex items-center px-8 pt-8">
          <span>Add a new event</span>
        </h2>

        <Formik<ICreateEvent>
          initialValues={{
            start: start ?? "",
            end: end ?? "",
            color: "",
            contact: "",
            notes: "",
            contactName: "",
            job: "",
            jobName: "",
          }}
          onSubmit={onSave}
        >
          {({ values }) => (
            <Form className="contents">
              <div className="grid grid-cols-1 gap-4 px-8 pt-4">
                <AutoSelectColor contacts={contacts} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Start" name="start" type="date" />
                  <Field label="End" name="end" type="date" />
                </div>

                <AddEventContact values={values} />

                <Field label="Notes" name="notes" as="textarea" rows={3} />
              </div>

              <div className="flex justify-between bg-gray-100 px-8 py-5 mt-16">
                <button
                  onClick={onClose}
                  type="button"
                  className="text-black text-sm px-4 py-2 rounded-md border border-black border-opacity-30"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md"
                >
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function AddEventContact({ values }: { values: ICreateEvent }) {
  const { contacts } = useContacts();

  const { setFieldValue } = useFormikContext<ICreateEvent>();

  return (
    <>
      <Field
        label="Contact"
        name="contact"
        as="select"
        labelClassName="flex-1 relative"
        footer={
          <div
            className="w-12 border border-black border-opacity-20 rounded-md ml-3"
            style={{ background: values.color }}
          />
        }
      >
        <option value="" hidden />
        <option value="NEW">-- Add New --</option>

        {contacts.map((e) => (
          <option key={e.id} value={e.reference?.path}>
            {e.name}
          </option>
        ))}
      </Field>

      {values.contact === "NEW" && (
        <>
          <Field label="Contact name" name="contactName" type="text" />
          <Field label="Contact color" name="color" as="select">
            <option value="" hidden />

            {orderBy(colors, "name").map((group) => (
              <React.Fragment key={group.name}>
                {group.items
                  .filter((r) => ["400", "600"].includes(r.variant))
                  .map((item) => (
                    <option key={item.variant} value={item.value}>
                      {group.name} ({item.variant})
                    </option>
                  ))}
              </React.Fragment>
            ))}
          </Field>
        </>
      )}

      {values.contact && <AddEventContactJob values={values} />}
    </>
  );
}

function AddEventContactJob({ values }: { values: ICreateEvent }) {
  const [jobs] = useCollection<{ name: string }>(
    `${values.contact}/jobs`
  );

  return (
    <>
      <Field label="Job" name="job" as="select">
        <option value="" hidden />
        <option value="NEW">-- Add New --</option>

        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.name}
          </option>
        ))}
      </Field>

      {values.job === "NEW" && (
        <>
          <Field label="Job name" name="jobName" type="text" />
        </>
      )}
    </>
  );
}

function AutoSelectColor({ contacts }: { contacts: IContact[] }) {
  const { values, setFieldValue, touched } = useFormikContext<ICreateEvent>();

  useEffect(() => {
    if (values.contact === "NEW") {
      setFieldValue("color", "");
    }

    if (values.contact) {
      const contact = contacts.find((e) => e.reference.path === values.contact);

      if (!contact) {
        return;
      }

      setFieldValue("color", contact.color);
    }
    // eslint-disable-next-line
  }, [values.contact]);

  return null;
}

export default AddModal;
