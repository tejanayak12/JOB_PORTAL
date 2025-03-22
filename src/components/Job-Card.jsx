import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { SaveJob } from '@/api/apiJobs';

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => { },
}) => {

    const [saved, SetSaved] = useState(savedInit)

    const {
        fn: fnSavedJob,
        data: savedJob,
        loading: loadingSavedJob,
    } = useFetch(SaveJob, {
        alreadySaved: saved,
    })

    const { user } = useUser();

    const handleSaveJob = async () => {
        // Toggle saved state immediately for better UI response
        SetSaved(prevSaved => !prevSaved);

        // Make the API call to save or unsave the job
        const result = await fnSavedJob({
            user_id: user.id,
            job_id: job.id
        });

        // Update state based on the response, in case something went wrong
        if (result && Array.isArray(result)) {
            SetSaved(result.length > 0);
        }
    };


    useEffect(() => {
        if (savedJob && Array.isArray(savedJob)) SetSaved(savedJob.length > 0);
    }, [savedJob]);



    return (
        <Card className=''>

            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {job.title}
                    {isMyJob && (<Trash2Icon fill='red' size={18} className='text-red-300 cursor-pointer' />)}
                </CardTitle>
            </CardHeader>

            <CardContent className='flex flex-col flex-1 gap-4'>
                <div className='flex items-center justify-between'>
                    {job.company && <img src={job.company.logo_url} className='h-6' />}
                    <div className='flex items-center gap-2'>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                {job.description.substring(0, job.description.indexOf('.'))}...
            </CardContent>

            <CardFooter className='flex gap-2'>
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant='secondary' className='w-full cursor-pointer'>
                        More Details
                    </Button>
                </Link>

                {!isMyJob && (
                    <Button
                        variant="outline"
                        className='w-15'
                        onClick={handleSaveJob}
                        disabled={loadingSavedJob}
                    >
                        {saved ? (
                            <Heart size={20} stroke='red' fill='red' />
                        ) : (
                            <Heart size={20} />
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default JobCard