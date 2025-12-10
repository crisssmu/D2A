import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { typeOfMovementFormData } from "@/types/formdata";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../ui/form";

interface TypeOfMovementsRegisterProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}
export default function TypeOfMovementsRegister({
  open,
  setOpen,
}: TypeOfMovementsRegisterProps) {
    const {toast} = useToast();
  const form = useForm<typeOfMovementFormData>({
    defaultValues: {
      id: undefined,
      name: "",
      gross_price: 0,
    },
  });
  const supabase = createClient();
  const handleRegister = async(values: typeOfMovementFormData) => {
    if(values == null) return;
    const { data, error } = await supabase
      .from("type_of_movements")
      .insert(values).select();
      if(data != null) {
          toast({
              title: "Tipo de movimiento registrado",
              description: "El tipo de movimiento ha sido registrado exitosamente.",
              variant: "default",
          });
      }
    if (error) {
      console.error(error);
    }
    
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Tipo de Movimiento</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)}>
                <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre 
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ingrese el nombre"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gross_price"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Precio 
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Ingrese el precio"
                                className="w-full"
                                {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
              />
              </div>
              <Button type="submit">Registrar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
