
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidateCodeCache } from "../cacheCode/codeCompany";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const codeComapany = await req.json();

  const { data, error } = await supabase
    .from("codeCompany")
    .insert(codeComapany);

  revalidateCodeCache();

  if (error) {
    console.log("Error inserting code holder", error.message);
    return NextResponse.json(error, { status: 500 });
  } else {
    console.log("Code holder inserted successfully", data);
  }

  return NextResponse.json(data, { status: 201 });
}
