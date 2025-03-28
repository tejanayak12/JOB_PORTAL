import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { getCompanies } from "@/api/apicompanies";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJobs";

const schema = z.object({
  title: z.string().min(1, { message: 'Title Is Required' }),
  description: z.string().min(1, { message: 'Description Is Required' }),
  location: z.string().min(1, { message: 'Select a Location' }),
  company_id: z.string().min(1, { message: 'Select or add a new company' }),
  requirements: z.string().min(1, { message: 'Requirements are Required' }),
})

const PostJob = () => {

  const { isLoaded, user } = useUser();

  const navigate = useNavigate()

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      location: '',
      company_id: '',
      requirements: ''
    },
    resolver: zodResolver(schema)
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    console.log("Form Data:", data); // Debugging
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs")
  }, [loadingCreateJob])


  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="white" />
  }

  if (user?.unsafeMetadata?.role !== 'recruiter') {
    return <Navigate to='/jobs' />
  }

  return (
    <div>
      <h1 className="pb-8 text-5xl font-extrabold text-center gradient-title sm:text-7xl">Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder='Job Title' {...register('title')} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}


        <Textarea placeholder='Job Description' {...register('description')} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex items-center gap-4">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
                  <SelectValue placeholder="Filter By Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry('IN').map(({ name }) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>)}
          />


          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              < Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
                  <SelectValue placeholder="Filter By Companies">
                    {field.value ? companies?.find((com) => com.id === Number(field.value))?.name : 'Company'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.isArray(companies) && companies.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {/* {Add Company drawer} */}
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}

        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />

        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}

        {loadingCreateJob && <BarLoader width={"100%"} color="white" />}

        <Button type='submit' variant='blue' size='lg' className='mt-2'>
          Submit
        </Button>
      </form >
    </div >
  )
};

export default PostJob;
