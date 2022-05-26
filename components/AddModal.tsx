import { Field, Form, Formik, FormikHelpers, useFormikContext } from "formik";
import { useEffect } from "react";
import { IContact } from "../types/contact";

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
  color: string;
  note: string;
}

function AddModal({ onClose, onSave, start, end, contacts }: Props) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      <div className="relative z-40 bg-white p-5 mx-auto max-w-[300px] mt-20 rounded-md">
        <h2 className="pb-3 text-xl font-medium">Add</h2>

        <Formik<ICreateEvent>
          initialValues={{
            start: start ?? "",
            end: end ?? "",
            color: "",
            contact: "",
            note: "",
          }}
          onSubmit={onSave}
        >
          {({ values }) => (
            <Form className="grid grid-flow-row gap-3">
              <AutoSelectColor contacts={contacts} />

              <label className="flex-1 flex flex-col">
                <div className="text-sm">Start</div>
                <Field
                  className="border px-2 py-1 rounded-md mt-1"
                  name="start"
                  type="date"
                />
              </label>

              <label className="flex-1 flex flex-col">
                <div className="text-sm">End</div>
                <Field
                  className="border px-2 py-1 rounded-md mt-1"
                  name="end"
                  type="date"
                />
              </label>

              <label className="flex-1 flex flex-col">
                <div className="text-sm">Contact</div>
                <Field
                  className="border px-2 py-1 rounded-md mt-1"
                  as="select"
                  name="contact"
                >
                  <option value="" />

                  {contacts.map((e) => (
                    <option key={e.id} value={e.reference?.path}>
                      {e.name}
                    </option>
                  ))}
                </Field>
              </label>

              <label className="flex-1 flex flex-col">
                <div className="text-sm">Color</div>

                <div className="flex items-center">
                  <div
                    className="w-5 h-5 border border-black border-opacity-20 rounded-sm mr-2"
                    style={{ background: values.color }}
                  />
                  <Field
                    className="border px-2 py-1 rounded-md"
                    name="color"
                    disabled
                    type="text"
                  />
                </div>
              </label>

              <label className="flex-1 flex flex-col">
                <div className="text-sm">Notes</div>

                <Field
                  as="textarea"
                  className="border px-2 py-1 rounded-md"
                  name="notes"
                />
              </label>

              <button type="submit">Save</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function AutoSelectColor({ contacts }: { contacts: IContact[] }) {
  const { values, setFieldValue, touched } = useFormikContext<ICreateEvent>();

  useEffect(() => {
    if (values.contact && !touched.color) {
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
