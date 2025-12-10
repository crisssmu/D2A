"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "@/types/formdata";
import { useToast } from "@/hooks/use-toast";
type RegisterFormProps = {
  onSubmit: (data: any) => Promise<void>;
  isAdmin?: boolean;
};

export const RegisterForm = ({
  onSubmit,
  isAdmin
}: RegisterFormProps) => {

  const [hidden, setHidden] = useState(true);
  const { toast } = useToast();
  const [form, setForm] = useState<RegisterFormData>({
    document: "",
    phone_number: "",
    birth_date: "",
    name: "",
    last_name: "",
    email: "",
    address: "",
    password: "",
    confirm_password: "",
  });

  const clear = () => {
    setForm({
      document: "",
      phone_number: "",
      birth_date: "",
      name: "",
      last_name: "",
      email: "",
      address: "",
      password: "",
      confirm_password: "",
    });
    toast({
      title: "Formulario limpiado",
      description: "El formulario ha sido limpiado exitosamente.",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Usuario</CardTitle>
        <CardDescription>Registrar usuario</CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2 w-58.5">
                <Label>Documento de identidad</Label>
                <Input
                  type="text"
                  name="document"
                  value={form.document || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, document: e.target.value }))}
                  placeholder="1.123.467"
                  pattern="^\d{1,3}(\.\d{3}){0,2}$"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fecha nacimiento</Label>
                <Input
                  className="w-36.75"
                  type="date"
                  name="birth_date"
                  value={form.birth_date}
                  onChange={(e) => setForm(prev => ({ ...prev, birth_date: new Date(e.target.value).toISOString().split('T')[0] }))}
                  required

                />
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2 w-full">
                <Label>Nombre</Label>
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Juan"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Apellido</Label>
                <Input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Perez"
                  required
                />
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2 w-58.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="juanperez@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-58.5">
                <Label>Numero celular</Label>
                <Input
                  type="text"
                  name="number_phone"
                  value={form.phone_number}
                  onChange={(e) => setForm(prev => ({ ...prev, number_phone: e.target.value }))}
                  placeholder="312 00 000 000"
                  pattern="^\d{3} \d{3} \d{4}$"
                  required
                />
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2 w-full">
                <Label>Dirección</Label>
                <Input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Calle 123"
                  required
                />
              </div>
            </div>

            {isAdmin &&
              (
                <>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="******"
                      required
                    />
                  </div>
                  <div>
                    <Label>Confirmar contraseña</Label>
                    <Input
                      type="password"
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={(e) => setForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                      placeholder="******"
                      required
                    />
                  </div>
                </>
              )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 justify-center">
        <div className="flex flex-row gap-5 items-center justify-center">
          <Button variant={"normal"} onClick={() => onSubmit(form)} className="hover: cursor-pointer">
            Guardar
          </Button>
          <Button className="hover: cursor-pointer" variant={"normal"} onClick={clear}>
            Limpiar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
