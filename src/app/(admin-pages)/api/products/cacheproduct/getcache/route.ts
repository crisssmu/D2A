import { getCachedProducts } from "@/app/(admin-pages)/products/read/action";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const products = await getCachedProducts();
        return NextResponse.json({ products });
    } catch (error){
        console.error("Error al obtener productos:", error);
        return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
    }
    
}