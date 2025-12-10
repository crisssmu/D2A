import { NextResponse } from "next/server";


export function POST(){
    try{
        const res = new NextResponse(JSON.stringify({ message: 'User logged out' }), { status: 200 });
        res.cookies.set('user', '', { path: '/', expires: new Date(0) });
        console.log('User logged out, cookie cleared', res.cookies.get('user'));
        return res;
    } catch(error){
        return NextResponse.json({ error: 'Error logging out user', details: error, ok: false }, { status: 500 });
    }
}