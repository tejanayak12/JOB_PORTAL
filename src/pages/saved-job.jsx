import { getSavedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/Job-Card";

const SavedJob = () => {

  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded])

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="white" />
  }

  return <div>
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard key={saved.id} job={saved.job} savedInit={true} onJobSaved={fnSavedJobs} />
            ))
          ) : (
            <div>No Saved Jobs Found</div>
          )}
        </div>
      )}
    </div>
  </div>;
};

export default SavedJob;
