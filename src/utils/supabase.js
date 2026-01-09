
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClientInstance = null;

const SupabaseClient = async (supabaseAccessToken) => {
    if (!supabaseClientInstance) {
        supabaseClientInstance = createClient(supabaseUrl, supabaseKey);
    }

    // Update the Authorization header for the current request
    const { data: { session } } = await supabaseClientInstance.auth.setSession({
        access_token: supabaseAccessToken,
        refresh_token: null, // Refresh tokens are handled by Clerk
    });

    return supabaseClientInstance;
}

export default SupabaseClient
