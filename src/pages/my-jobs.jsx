import { useUser } from "@clerk/clerk-react";
import React from "react";
import { BarLoader } from "react-spinners";
import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";

const MyJobs = () => {

  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="white" />
  }

  return (
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">
        {
          user?.unsafeMetadata?.role === 'candidate'
            ? "My Applications"
            : "My Jobs"
        }
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (<CreatedApplications />) : (<CreatedJobs />)}
    </div>
  )
};

export default MyJobs;
