import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './Job-Card';

const CreatedJobs = () => {

    const { user } = useUser();

    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs
    } = useFetch(getMyJobs, {
        recruiter_id: user.id
    });

    useEffect(() => {
        fnCreatedJobs()
    }, [])

    if (loadingCreatedJobs) {
        return <BarLoader className='mb-4' width={"100%"} color='white' />
    }

    return (
        <div>
            <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
                {createdJobs?.length ? (
                    createdJobs.map((job) => (
                        <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} isMyJob />
                    ))
                ) : (
                    <div>No Jobs Found</div>
                )}
            </div>
        </div>
    )
}

export default CreatedJobs