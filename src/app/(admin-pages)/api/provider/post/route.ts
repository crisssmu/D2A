import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidateProviderCache } from "../providerCache";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const provider = await req.json();
    const { data, error } = await supabase.from("provider").insert(provider);
    revalidateProviderCache();
    if (error) {
        console.log("Error inserting provider", error);
        return NextResponse.json(error, { status: 500 });
    } else {
        console.log("Provider inserted successfully", data);
    }
    return NextResponse.json(data, { status: 201 });
}


