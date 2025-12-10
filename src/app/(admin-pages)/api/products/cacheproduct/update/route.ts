'use server'

import { revalidateProductsCache } from "@/app/(admin-pages)/products/read/action";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const product = await request.json();
    console.log(product);

    const { error } = await supabase.from("products").update(product).eq("id", product.id);

    if (error) {
        console.error("Error details:" + error.message);
        throw error;
    }

    revalidateProductsCache();
    return NextResponse.json({ message: "Producto actualizado correctamente" }, { status: 200 });

}