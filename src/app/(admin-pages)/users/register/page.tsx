"use client";
import { Loader } from "@/components/laoder/loader";
import { RegisterForm } from "@/components/register/formRegister";
import { useToast } from "@/hooks/use-toast";
import { RegisterFormData } from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@radix-ui/react-label";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

export default function CreateUserPage() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmmit = async (form: RegisterFormData) => {
    setLoading(true);
    if (!form) return;
    if (form.password !== form.confirm_password) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      })
      setLoading(false);
      return;
    }
    try {
      console.log("Creando usuario...");
      console.log(form);
      const { data: user, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      console.log(user);
      if (error) {
        console.log(error);
        throw error;
      }
      const { data, error: insertError } = await supabase.from('profile').insert([
        {
          id: user.user?.id,
          name: form.name,
          last_name: form.last_name,
          email: form.email,
          document: form.document,
          birth_date: form.birth_date,
          address: form.address,
          phone_number: form.phone_number,
        }
      ]);

      if (insertError) {
        console.log(insertError);
        await supabase.auth.admin.deleteUser(form.email);
        throw insertError;
      }

      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente",
      })
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el usuario",
        variant: "destructive"
      })
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader />
        <div className="flex flex-row">
          <Label>Creando tu cuenta... </Label>
          <LoaderIcon className="animate-spin" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center h-full">
      <RegisterForm
        onSubmit={handleSubmmit}
        isAdmin={true}
      />
    </div>
  )
}
