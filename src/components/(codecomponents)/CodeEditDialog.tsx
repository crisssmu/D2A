import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { codeCompanyFormData, ProviderFormData } from "@/types/formdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface codeCompanyProps {
  selectCodeCompany: codeCompanyFormData | null;
  close: (open: boolean) => void;
  providers: ProviderFormData[] | null;
  open: boolean;
  onSubmmit: (data: codeCompanyFormData) => Promise<void>;
}

export default function CodeEditDialog({
  selectCodeCompany,
  open,
  close,
  onSubmmit,
  providers,
}: codeCompanyProps) {
  const form = useForm<codeCompanyFormData>({
    defaultValues: {
      id: 0,
      code: "",
      company_name: "",
      document: "",
      name: "",
      lastname: "",
      email: "",
      phone_number: undefined,
      address: "",
      id_provider: 0,
    },
  });

  useEffect(() => {
    const setCodeCompany = () => {
      const codeCompany = selectCodeCompany;
      if (codeCompany) {
        form.setValue("id", codeCompany.id);
        form.setValue("name", codeCompany.name);
        form.setValue("lastname", codeCompany.lastname);
        form.setValue("email", codeCompany.email);
        form.setValue("phone_number", codeCompany.phone_number);
        form.setValue("document", codeCompany.document);
        form.setValue("company_name", codeCompany.company_name);
        form.setValue("code", codeCompany.code);
        form.setValue("address", codeCompany.address);
        form.setValue("id_provider", codeCompany.id_provider);
      }
    };
    setCodeCompany();
  }, [selectCodeCompany, open]);

  const closeEdit = () => {
    close(false);
  };
  return (
    <>
      <Dialog
        open={open && selectCodeCompany !== null}
        onOpenChange={closeEdit}
      >
        <DialogContent className="sm:max-w-2xl space-y-4">
          <DialogTitle>Editar datos del código</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmmit(data))}>
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
                              {providers!.map((provider) => (
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
                  <Button type="button" onClick={form.handleSubmit(onSubmmit)}>
                    Guardar
                  </Button>
                </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
