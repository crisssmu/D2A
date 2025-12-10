import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user } = await req.json();
    
    const res = new NextResponse(JSON.stringify({ message: 'User set in cookies' }), { status: 200 });

    res.cookies.set('user', JSON.stringify(user), { httpOnly: true, path: '/', });
    console.log('Set user cookie:', user);  
    return res;
}
