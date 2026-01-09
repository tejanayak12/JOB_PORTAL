import SupabaseClient from "@/utils/supabase";
import { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
    const supabase = await SupabaseClient(token);

    const { data, error } = await supabase.from('companies').select("*");

    if (error) {
        console.error("Error Fetching from companies", error);
        return null;
    }

    return data;
}

export async function addNewCompany(token, _, companyData) {
    if (!companyData || !companyData.name || !companyData.logo) {
        console.error("Invalid company data passed to addNewCompany:", companyData);
        return null;
    }

    console.log("Adding company - Name:", companyData.name);

    const supabase = await SupabaseClient(token);
    const random = Math.floor(Math.random() * 89999) + 10000;
    const fileName = `logo-${random}-${companyData.name.replace(/\s+/g, "-")}`;

    console.log("Uploading logo to storage - FileName:", fileName);
    const { error: storageError } = await supabase.storage.from('company-logo').upload(fileName, companyData.logo);

    if (storageError) {
        console.error("Error uploading Company Logo to storage:", storageError);
        throw new Error("Error uploading Company Logo");
    }

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
    console.log("Logo uploaded successfully. URL:", logo_url);

    console.log("Inserting company into database...");
    const { data, error } = await supabase
        .from('companies')
        .insert([{ name: companyData.name, logo_url }])
        .select();

    if (error) {
        console.error("Error Inserting Company into DB:", error);
        throw new Error("Error Submitting Company");
    }

    console.log("Company added successfully to DB:", data);
    return data;
}
