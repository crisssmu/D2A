import { redirect } from 'next/navigation'
import { LoginFormData } from '@/types/formdata'
import { createClient } from '@/utils/supabase/client'

const supabase = await createClient();

export async function login(loginformdata : LoginFormData) {
    const {data, error } = await supabase.auth.signInWithPassword(loginformdata)
    if (error) {
        console.log('Error al ingresar el usuario', error)
    }
    return data
}


export async function singup(){
    const {data, error } = await supabase.auth.signUp({
        email: "garciasierrandres@gmail.com",
        password: ""
    })

    console.log(data)

    if(error){
        console.log('Error al crear el usuario', error)
    }
}
