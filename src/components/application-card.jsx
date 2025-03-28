import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Boxes, BriefcaseBusiness, Download, School } from 'lucide-react'
import useFetch from '@/hooks/use-fetch';
import { updateApplicationsStatus } from '@/api/apiApplications';
import { BarLoader } from 'react-spinners';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

const ApplicationCard = ({ application, isCandidate = false }) => {

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    };

    const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
        updateApplicationsStatus,
        {
            job_id: application.job_id
        }
    );

    const handleStatusChange = (status) => {
        fnHiringStatus(status)
    }

    return (
        <Card>
            {loadingHiringStatus && <BarLoader width={"100%"} color='white' />}
            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {isCandidate
                        ? `${application?.job?.title} at ${application?.job?.company?.name}`
                        : application?.name
                    }

                    <Download
                        size={18}
                        className='w-8 h-8 text-black bg-white rounded-full cursor-pointer'
                        onClick={handleDownload}
                    />
                </CardTitle>
            </CardHeader>

            <CardContent className='flex flex-col flex-1 gap-4'>
                <div className='flex flex-col justify-between md:flex-row'>
                    <div className='flex items-center gap-2'>
                        <div><BriefcaseBusiness size={15} /> {application?.experience}years of experience</div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div><School size={15} /> {application?.education}</div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div><Boxes size={15} /> Skills : {application?.skills}</div>
                    </div>
                </div>

                <hr />

            </CardContent>
            <CardFooter className='flex justify-between'>
                <span>{new Date(application?.created_at).toLocaleString()}</span>
                {isCandidate ? (
                    <span className='font-bold capitalize'>Status: {application?.status}</span>
                ) : (
                    <Select onValueChange={handleStatusChange} defaultValue={application.status}>
                        <SelectTrigger className='w-52'>
                            <SelectValue
                                placeholder='Applications Status'
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='applied'>Applied</SelectItem>
                            <SelectItem value='interviewing'>Interviewing</SelectItem>
                            <SelectItem value='hired'>Hired</SelectItem>
                            <SelectItem value='rejected'>Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </CardFooter>
        </Card>
    )
}

export default ApplicationCard