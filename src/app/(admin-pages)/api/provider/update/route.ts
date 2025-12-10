import { createClient } from "@/utils/supabase/server";
import { revalidateProviderCache } from "../providerCache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const provider = await req.json();
    console.log(provider.id);
    const { error } = await supabase.from("providers").update(provider).eq("id", provider.id);
    revalidateProviderCache();
    if (error) {
        console.log("Error updating provider", error);
        return NextResponse.json(error, { status: 500 });
    } else {
        return NextResponse.json( { status: 200 });

    }
}