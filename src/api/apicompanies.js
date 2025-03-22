import SupabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
    const supabase = await SupabaseClient(token);


    const { data, error } = await supabase
        .from('companies')
        .select("*")

    if (error) {
        console.log("Error Fetching from companies", error);
        return null

    }

    return data
}