import { revalidateProductsCache } from "@/app/(admin-pages)/products/read/action";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const product = await request.json(); // <-- puede lanzar error

    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error || !data) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: true, message: error?.message || "Error insertando producto" },
        { status: 500 }
      );
    }
    if (typeof product !== "object" || Array.isArray(product)) {
      return NextResponse.json(
        { error: true, message: "Formato inválido: se esperaba un objeto" },
        { status: 400 }
      );
    }

    await revalidateProductsCache();

    return NextResponse.json(
      { success: true, message: "Producto agregado" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Server error:", err);

    return NextResponse.json(
      { error: true, message: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
