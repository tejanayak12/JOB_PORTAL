import { useSession } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";

const useFetch = (cb, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const { session } = useSession();

    const fn = useCallback(async (...args) => {
        if (!session) return;

        setLoading(true);
        setError(null);

        try {
            const supabaseAccessToken = await session.getToken({ template: 'supabase' });

            const response = await cb(supabaseAccessToken, options, ...args);
            setData(response);
            return response;

        } catch (error) {
            setError(error);
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [session, cb, JSON.stringify(options)]);

    useEffect(() => {
        if (!options?.manual && session) {
            fn();
        }
    }, [session, fn]); // Use fn as dependency since it's now stable

    return { fn, data, loading, error, setData };
};

export default useFetch;
