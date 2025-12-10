import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(req: NextRequest){
    const supabase = await createClient()
    const formData = await req.formData()

    const data = {
        documento: parseInt(formData.get('dni') as string, 10),
        numberPhone: parseInt(formData.get('number_phone') as string, 10),
        birthdate: new Date(formData.get('birthdate') as string).toISOString(),
        name: formData.get('name') as string,
        lastname: formData.get('lastname') as string,
        email: formData.get('email') as string,
        address: formData.get('address') as string,
    }

    const { error } = await supabase.from('users').insert([data])

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 200 })
}