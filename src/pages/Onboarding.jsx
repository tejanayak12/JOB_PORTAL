import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Onboarding = () => {
  const { user, isLoaded } = useUser();

  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user.update({
      unsafeMetadata: { role },
    }).then(() => {
      navigate(role === 'recruiter' ? '/post-job' : '/jobs')
    }).catch((error) => {
      console.error("Error Updating Role", error)
    });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user?.unsafeMetadata?.role === 'recruiter' ? '/post-job' : '/jobs')
    }
  }, [user]);


  if (!isLoaded) {
    return (
      <div className="w-full mb-4">
        <BarLoader color="white" width="100%" />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center mt-30'>
      <h2 className='font-extrabold tracking-tighter gradient-title text-7xl sm:text-8xl'>
        I am a...
      </h2>

      <div className='grid w-full grid-cols-2 gap-4 mt-16 md:px-40'>

        <Button variant='blue' className='text-2xl h-36' onClick={() => handleRoleSelection("candidate")}>
          Candidate
        </Button>

        <Button variant='destructive' className='text-2xl h-36' onClick={() => handleRoleSelection("recruiter")}>
          Recruiter
        </Button>

      </div>
    </div>

  )
}

export default Onboarding
