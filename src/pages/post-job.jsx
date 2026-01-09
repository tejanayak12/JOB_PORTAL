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
import { useCallback, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";

const schema = z.object({
  title: z.string().trim().min(1, { message: 'Title Is Required' }),
  description: z.string().trim().min(1, { message: 'Description Is Required' }),
  location: z.string().trim().min(1, { message: 'Select a Location' }),
  company_id: z.string().min(1, { message: 'Select or add a new company' }),
  requirements: z.string().trim().min(1, { message: 'Requirements are Required' }),
})

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate()

  const { register, control, handleSubmit, formState: { errors, isValid }, setValue, watch, trigger } = useForm({
    mode: 'all',
    defaultValues: {
      location: '',
      company_id: '',
      requirements: ''
    },
    resolver: zodResolver(schema)
  });



  const formValues = watch();

  const handleCompanyAdd = useCallback((newCompany) => {
    if (!newCompany?.id) return;
    const newId = String(newCompany.id);
    console.log("New Company Added. Forcing Selection of ID:", newId);

    // Explicitly set value and trigger validation
    setValue('company_id', newId, { shouldValidate: true, shouldDirty: true });

    // Safety timeout to ensure the UI list has rendered before forcing value
    setTimeout(() => {
      trigger('company_id');
      console.log("Post-Add Validation Triggered for ID:", newId);
    }, 200);
  }, [setValue, trigger]);

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
  } = useFetch(addNewJob, { manual: true });

  const onSubmit = (data) => {
    if (!user?.id) return;

    console.log("✅ Validation Passed! Final Data:", data);
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      is_open: true,
      company_id: Number(data.company_id)
    });
  };

  const onInvalid = (errs) => {
    console.error("❌ Form Validation Blocked Submission!", errs);
    // Force a scroll to the first error if possible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      console.log("Job Created Successfully! Redirecting...");
      navigate("/jobs");
    }
  }, [dataCreateJob, navigate]);


  if (!isLoaded || (loadingCompanies && !companies)) {
    return <BarLoader className="mb-4" width={"100%"} color="white" />
  }

  if (user?.unsafeMetadata?.role !== 'recruiter') {
    return <Navigate to='/jobs' />
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="pb-8 text-5xl font-extrabold text-center gradient-title sm:text-7xl">Post a Job</h1>

      {/* Form Status Badge */}
      <div className="flex justify-center mb-4">
        <span className={`px-4 py-1 rounded-full text-xs font-bold opacity-75 ${isValid ? 'bg-green-600' : 'bg-red-600'}`}>
          Form Status: {isValid ? 'Valid' : 'Incomplete'}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4 p-4 pb-0 max-w-4xl mx-auto">
        <Input placeholder='Job Title' {...register('title')} className="text-lg" />
        {errors.title && <p className="text-red-500 text-sm font-medium">{errors.title.message}</p>}


        <Textarea placeholder='Job Description' {...register('description')} className="min-h-[100px]" />
        {errors.description && (
          <p className="text-red-500 text-sm font-medium">{errors.description.message}</p>
        )}

        <div className="flex flex-wrap items-center justify-center w-full gap-4 md:flex-nowrap">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(val) => {
                  setValue('location', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
                  <SelectValue placeholder="Add Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry('IN').map(({ name }) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(val) => {
                  setValue('company_id', val, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full border-gray-500 rounded-lg shadow-sm sm:w-52">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.isArray(companies) && companies.map(({ name, id }) => (
                      <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <AddCompanyDrawer
            fetchCompanies={fnCompanies}
            onCompanyAdd={handleCompanyAdd}
          />
        </div>

        <div className="flex gap-4">
          {errors.location && (
            <p className="text-red-500 text-sm font-medium flex-1">{errors.location.message}</p>
          )}
          {errors.company_id && (
            <p className="text-red-500 text-sm font-medium flex-1">{errors.company_id.message}</p>
          )}
        </div>

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <div data-color-mode="dark">
              <MDEditor
                value={field.value || ""}
                onChange={(val) => {
                  setValue('requirements', val || "", { shouldValidate: true });
                }}
                preview="edit"
                className="rounded-lg border border-gray-500 overflow-hidden"
              />
            </div>
          )}
        />

        {errors.requirements && (
          <p className="text-red-500 text-sm font-medium">{errors.requirements.message}</p>
        )}

        {errorCreateJob && (
          <p className="text-red-500 text-sm font-bold bg-red-100 p-2 rounded">{errorCreateJob?.message || "Something went wrong"}</p>
        )}

        {loadingCreateJob && <BarLoader width={"100%"} color="white" />}

        <Button type='submit' variant='blue' size='lg' className='mt-2 font-bold py-6 text-xl'>
          Submit Job Listing
        </Button>
      </form >
    </div >
  )
};

export default PostJob;
