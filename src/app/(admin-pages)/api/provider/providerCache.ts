
import { createClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROL!
);



export async function fetchProvider() {
    
    const { data, error } = await supabase.from("providers").select("*");
    if (error) {
        console.error("Error fetching provider:", error);
        return;
    }
    if (data) {
        return data;
    }
}

export const cacheProvider = unstable_cache(fetchProvider, ["provider-cache"], {
    revalidate: 3600, 
    tags: ["providers"]
})

export async function revalidateProviderCache() {
    revalidateTag("providers");
}


