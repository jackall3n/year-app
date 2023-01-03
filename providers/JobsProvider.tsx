import { createContext, PropsWithChildren, useContext } from "react";
import { addDoc, DocumentReference } from "firebase/firestore";
import { IContact, IContactData } from "../types/contact";
import useCollection from "../hooks/useCollection";
import { IDocument } from "../types/document";
import { ICreateJob, IJob, IJobData } from "../types/job";

export interface IJobsContext {
  jobs: IDocument<IJob>[];

  addJob(contact: ICreateJob): Promise<DocumentReference<ICreateJob>>;
}

export const JobsContext = createContext<IJobsContext>(undefined as never);

export const useJobs = () => useContext(JobsContext);

function JobsProvider({ children }: PropsWithChildren<unknown>) {
  const [jobs, collection] = useCollection<IJob>("jobs");

  async function addJob(job: ICreateJob) {
    return await addDoc(collection, job);
  }

  return (
    <JobsContext.Provider value={{ jobs, addJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export default JobsProvider;
