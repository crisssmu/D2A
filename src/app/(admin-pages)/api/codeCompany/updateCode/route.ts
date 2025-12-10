import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidateCodeCache } from "../cacheCode/codeCompany";


export async function POST(req : NextRequest) {
    const supabase = await createClient();

    const code = await req.json();

    const { error } = await supabase.from("codeCompany").update(code).eq("id", code.id);
    
    revalidateCodeCache();  

    if (error) {
        console.log("Error updating code holder", error);
        return NextResponse.json(error, { status: 500 });
    } else {
        console.log("Code holder updated successfully");
        return NextResponse.json(code, { status: 200 });
    }

}