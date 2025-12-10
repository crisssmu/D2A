import { NextResponse } from "next/server";
import { cacheCode } from "../codeCompany";


export async function GET() {
    try{
        const code = await cacheCode();
        return NextResponse.json({ codes: code });
    } catch (error) {
        console.error("Error al obtener los códigos:", error);
        return new NextResponse(JSON.stringify({ error: "Error al obtener los códigos" }), { status: 500 });
    }
}