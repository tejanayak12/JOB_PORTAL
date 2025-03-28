import SupabaseClient from "@/utils/supabase";
import { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
    const supabase = await SupabaseClient(token);

    const { data, error } = await supabase.from('companies').select("*");

    if (error) {
        console.log("Error Fetching from companies", error);
        return null;
    }

    return data;
}

export async function addNewCompany(token, _, companyData) {
    if (!companyData || !companyData.name || !companyData.logo) {
        console.error("Invalid company data:", companyData);
        return null;
    }

    console.log("Adding company:", companyData);

    const supabase = await SupabaseClient(token);
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    const { error: storageError } = await supabase.storage.from('company-logo').upload(fileName, companyData.logo);

    if (storageError) {
        console.log("Error uploading Company Logo", storageError);
        return null;
    }

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

    const { data, error } = await supabase
        .from('companies')
        .insert([{ name: companyData.name, logo_url }])
        .select();

    if (error) {
        console.log("Error Submitting Company", error);
        return null;
    }

    return data;
}
