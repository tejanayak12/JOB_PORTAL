import { getApplications } from '@/api/apiApplications'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import ApplicationCard from './application-card'

const CreatedApplications = () => {

    const { user } = useUser()

    const {
        loading: loadingApplications,
        data: applications = [],  // Ensure default empty array
        fn: fnApplications
    } = useFetch(getApplications, { user_id: user?.id });

    useEffect(() => {
        if (user?.id) {
            fnApplications();
        }
    }, [user?.id]);

    if (loadingApplications) {
        return <BarLoader className='mb-4' width={"100%"} color='white' />
    }

    return (
        <div className='flex flex-col gap-2'>
            {applications?.length > 0 ? (
                applications?.map((application) => (
                    <ApplicationCard key={application.id} application={application} isCandidate />
                ))
            ) : (
                <p>No applications found.</p>
            )}
        </div>
    );

}

export default CreatedApplications