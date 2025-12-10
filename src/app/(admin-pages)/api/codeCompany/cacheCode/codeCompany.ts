
import { createClient } from '@supabase/supabase-js'
import { revalidateTag, unstable_cache } from 'next/cache';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!
)

export async function fetchCodeCompany(){
    const { data, error } = await supabase.from("codeCompany").select("*");
    if (error) {
        console.error("Error fetching codeCompany:", error);
        return;
    }
    if (data) {
        return data;
    }
}

export const cacheCode = unstable_cache(fetchCodeCompany, ["codeCompany-cache"], {
    revalidate: 3600, 
    tags: ["codeCompany"]
});

export async function revalidateCodeCache(){
    revalidateTag("codeCompany");
}