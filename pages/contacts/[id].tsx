import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useDocument } from "../../hooks/useDocument";
import { IContact } from "../../types/contact";
import { IJob  } from "../../types/job";
import useCollection from "../../hooks/useCollection";

export default function Contact(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { id } = props;

  const [contact] = useDocument<IContact>(`contacts/${id}`);
  const [jobs] = useCollection<IJob>(`jobs`);

  if (!contact?.exists) {
    return null;
  }

  console.log(contact);

  return (
    <div className="mx-auto max-w-[600px] flex flex-col px-10 pt-10 pb-32 bg-gray-100">
      <div className="grid grid-cols-1 gap-4">
        <h1 className="text-xl">{contact.name}</h1>

        <h2>Jobs</h2>

        <div>
          {jobs.map((job) => (
            <div key={job.id}>{job.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id;

  return {
    props: {
      id,
    },
  };
}
