import { Button } from "@/components/ui/button";
import {
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
import { useToast } from "@/hooks/use-toast";
import { productWithoutLiquid, ProviderFormData } from "@/types/formdata";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";

interface productWithoutRegisterProps {
  providers: ProviderFormData[];
}

export default function ProductWithoutRegister({
  providers,
}: productWithoutRegisterProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
  const form = useForm<productWithoutLiquid>({
    defaultValues: {
      id: 0,
      name: "",
      unit_per_box: 0,
      quantity: 0,
      sales_price: 0,
      gross_price: 0,
      id_provider: 0,
    },
  });

  const onSubmmit = async (values: productWithoutLiquid) => {
    try{
        setLoading(true);
        if(!values) return;

        

        const res = await fetch("/api/products/cacheproductWithoutLiquid", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
        });

        if(!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.log("Error al crear el Producto");
        toast({
            title: "Producto creado",
            description: "Producto creado correctamente",
            variant: "destructive",
        })
    } finally {
        setLoading(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form>
          <div className="flex flex-row">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="text"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_per_box"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades por caja</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="number"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            </div>
            <div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="number"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de venta</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="number"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            </div>
            <div className="flex flex-row">
            <FormField
              control={form.control}
              name="gross_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio bruto</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="number"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_per_box"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades por caja</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="number"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            </div>
            <div className="flex flex-row">
            <FormField
              control={form.control}
              name="id_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un proveedor" />
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem
                              key={provider.id}
                              value={provider.id.toString()}
                            >
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button variant={"destructive"} type="submit" >
                Registrar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
