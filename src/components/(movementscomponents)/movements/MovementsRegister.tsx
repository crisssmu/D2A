import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MovementsFormData,
  ProductsFormData,
  ProviderFormData,
  typeOfMovementFormData,
} from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface MovementsRegisterProps {
  handleSubmit: (data: MovementsFormData) => void;
  products: ProductsFormData[];
  clients?: any[];
  providers?: ProviderFormData[];
  open?: boolean;
  setOpen?: (open: boolean) => void;
}
export default function MovementsRegister({
  handleSubmit,
  products,
  clients,
  providers,
  open,
  setOpen,
}: MovementsRegisterProps) {
  const form = useForm<any>({
    defaultValues: {
      id: undefined,
      id_product: undefined,
      quantity: 0,
      id_type_of_movement: undefined,
      note: "",
      date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      id_seller: "",
      id_source: "",
      id_invoices: undefined,
      type_invoices: undefined,
      type_source: undefined,
      aux_type_source: "",
      nameProduct: "",
    },
  });

  const supabase = createClient();

  const [typeMovements, setType_movements] = useState<typeOfMovementFormData[]>([]);
  const auxTypeSourceWatch = form.watch("aux_type_source");
  const typeSourceWatch = form.watch("type_source");
  const watchedIdProduct = useWatch({ control: form.control, name: "id_product" });

  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === Number(watchedIdProduct));
    if (selectedProduct) {
      form.setValue("nameProduct", selectedProduct.name);
    }
  }, [watchedIdProduct, products, form]);

  useEffect(() => {
    if (auxTypeSourceWatch === "TRUE") {
      form.setValue("type_source", true);
      console.log(form.getValues("type_source"), auxTypeSourceWatch);
    } else if (auxTypeSourceWatch === "FALSE") {
      form.setValue("type_source", false);
      console.log(form.getValues("type_source"), auxTypeSourceWatch);
    }
  }, [auxTypeSourceWatch]);

    const fetchTypeMovements = async () => {
    const { data, error } = await supabase
      .from("type_of_movements")
      .select("*");
    if (data) setType_movements(data);
    if (error) {
      console.log("Error fetching type movements", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTypeMovements();
  }, []);


  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
              </DialogHeader>
              <div className="flex flex-row gap-4">
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="id_product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producto</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elige el producto" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="border p-2 rounded w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id_type_of_movement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de movimiento</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elige el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeMovements.map((typeMovement) => (
                                <SelectItem
                                  key={typeMovement.id}
                                  value={typeMovement.id.toString()}
                                >
                                  {typeMovement.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="border p-2 rounded w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de vencimiento</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="border p-2 rounded w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aux_type_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo Persona</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elige el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TRUE">Cliente</SelectItem>
                              <SelectItem value="FALSE">Proveedor</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id_source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elige el usuario" />
                            </SelectTrigger>
                            <SelectContent>
                              {form.getValues("aux_type_source") === "" ? (
                                <p>Debe seleccionar un tipo de persona</p>
                              ) : typeSourceWatch === true ? (
                                clients?.map((client) => (
                                  <SelectItem
                                    key={client.id}
                                    value={client.id.toString()}
                                  >
                                    {client.name}
                                  </SelectItem>
                                ))
                              ) : (
                                providers?.map((provider) => (
                                  <SelectItem
                                    key={provider.id}
                                    value={provider.id.toString()}
                                  >
                                    {provider.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nota</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="border p-2 rounded w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Guardar</Button>
              </div>
              <div className="flex flex-row">
                <div>
                  <span title="Crear nueva movimiento">
                    <FilePlus
                      size={20}
                      className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                      onClick={() => setOpen}
                    />
                  </span>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
