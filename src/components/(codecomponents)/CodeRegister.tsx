"use client";

import { useToast } from "@/hooks/use-toast";
import { codeCompanyFormData, ProviderFormData } from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "../laoder/loader";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export default function CodesRegister() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<ProviderFormData[]>([]);
  const { toast } = useToast();

  const form = useForm<codeCompanyFormData>({
    defaultValues: {
      id: undefined,
      code: "",
      company_name: "",
      document: "",
      name: "",
      lastname: "",
      email: "",
      phone_number: undefined,
      address: "",
      id_provider: undefined,
    },
  });

  const fechProviders = async () => {
    const { data, error } = await supabase.from("providers").select("*");
    if (error) {
      console.log("Error fetching providers", error);
      return [];
    }
    setProviders(data);
  };
  useEffect(() => {
    fechProviders();
  }, []);

  const onSubmit = async (values: codeCompanyFormData) => {
    if (values == null) return;
    setLoading(true);

    try {
      const res = await fetch("/api/codeCompany/registerCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.log("Error inserting code holder", data);
        throw new Error(res.statusText);
      } else {
        toast({
          title: "Code Holder creado",
          description: "Code Holder creado correctamente",
          variant: "default",
        });
        console.log("Code holder inserted successfully", data);
      }
    } catch (error) {
      console.log("Unexpected error", error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registrar Codigo</CardTitle>
          <CardDescription>
            Ingrese los detalles del código del comprador
          </CardDescription>
          <CardContent className="p-4">
            <Form {...form}>
              <form className="">
                <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem className="w-full p-2">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la empresa
                        </FormLabel>
                        <Input
                        className="w-full"
                          type="text"
                          placeholder="Ingrese el nombre de la empresa"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                

                <div className="flex flex-row gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="w-full ">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Código
                        </FormLabel>
                        <Input className="w-full" type="text" placeholder="Ingrese el código" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Documento
                        </FormLabel>
                        <Input type="text" placeholder="Ingrese el documento" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row w-full gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </FormLabel>
                        <Input type="text" placeholder="Ingrese el nombre" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </FormLabel>
                        <Input type="text" placeholder="Ingrese el apellido" {...field} />
                      </FormItem>
                    )}
                  />
                  
                  
                </div>
                <div className="flex flex-row gap-4 w-full p-2">
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Correo
                        </FormLabel>
                        <Input type="email" placeholder="Ingrese el correo" {...field} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Direccion
                        </FormLabel>
                        <Input type="text" placeholder="Ingrese la direccion" {...field} />
                      </FormItem>
                    )}
                    />
                </div>
                <div className="flex flex-row gap-4 p-2">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Telefono
                        </FormLabel>
                        <Input type="text" placeholder="Ingrese el telefono" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id_provider"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Proveedor
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                              {providers.map((provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={String(provider.id)}
                                >
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                    Guardar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}
