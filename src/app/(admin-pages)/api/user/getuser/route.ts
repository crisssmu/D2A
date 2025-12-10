import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = await cookies();

  const userCookie =  cookieStore.get("user");

  if (!userCookie) {
    return new NextResponse(JSON.stringify({ message: "No user cookie found" }), { status: 404 });
  }

  const user = JSON.parse(userCookie.value);
  console.log('Retrieved user from cookie:', user);
  return NextResponse.json({ user });
}