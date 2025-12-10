import { NextResponse } from "next/server";
import { cacheProvider } from "../providerCache";

export async function GET() {
    try {
        const providers = await cacheProvider();
        return NextResponse.json({ providers : providers });
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 });
    }
}