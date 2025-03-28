import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useFetch from '@/hooks/use-fetch';
import { addNewCompany } from '@/api/apicompanies';
import { BarLoader } from 'react-spinners';

const schema = z.object({
  name: z.string().min(1, { message: 'Company Name is required' }),
  logo: z.any(),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', logo: null },
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch((token, _, companyData) => addNewCompany(token, _, companyData));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setValue('logo', file);
    }
  };

  const onSubmit = (data, event) => {
    event.preventDefault();

    if (!data.name || !selectedFile) {
      console.error('Form data is missing:', { name: data.name, logo: selectedFile });
      return;
    }

    console.log("Submitting company data:", { name: data.name, logo: selectedFile });

    fnAddCompany(undefined, undefined, {
      name: data.name,
      logo: selectedFile,
    });
  };

  useEffect(() => {
    if (dataAddCompany) {
      fetchCompanies();
      setIsOpen(false);
      reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setIsOpen(true)}
        >
          Add Your Own Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex flex-col gap-2 p-4 pb-0" onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder="Company Name" {...register('name')} />

          <Input
            type="file"
            accept="image/png, image/jpeg"
            className="file:text-gray-500"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          <Button type="submit" variant="destructive" className="w-40" disabled={loadingAddCompany}>
            {loadingAddCompany ? 'Adding...' : 'Add'}
          </Button>
        </form>

        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorAddCompany?.message && <p className="text-red-500">{errorAddCompany?.message}</p>}

        {loadingAddCompany && <BarLoader width={'100%'} color="white" />}

        <DrawerFooter>
          <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
