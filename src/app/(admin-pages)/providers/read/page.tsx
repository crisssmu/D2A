"use client";
import ProviderEditDialog from "@/components/(providercomponents)/ProviderEditDialog";
import ProviderTable from "@/components/(providercomponents)/ProviderTable";
import { Loader } from "@/components/laoder/loader";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProviderFormData } from "@/types/formdata";
import { useEffect, useState } from "react";


export default function ReadProvidersPage() {
  const [selProvider, setSelProvider] = useState<ProviderFormData | null>(null);
  const [provider, setProviders] = useState<ProviderFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const providerUpdate = async (data: ProviderFormData) => {
    if (selProvider === null) return;
    setLoading(true);
    try {
      const res = await fetch('/api/provider/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      toast({
        title: "Éxito",
        description: "Proveedor actualizado correctamente",
      });
      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el proveedor.",
        variant: "destructive",
      });
      console.error("Error updating provider:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProviders = async () => {
    if (provider === null) return;
    setLoading(true);
    try {
      const res = await fetch('/api/provider/getCache');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      const providersArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.providers)
        ? data.providers
        : [];

        console.log(providersArray);
      setProviders(providersArray);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
      setOpen(false);
      setSelProvider(null);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  const handleCloseDialog = (value: boolean) => {
    setOpen(value);
    if (!value) setSelProvider(null);
  };
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Aquí puedes ver y gestionar los proveedores registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderTable
            providers={provider}
            openEditDialog={setOpen}
            selectProvider={setSelProvider}
          />
          <ProviderEditDialog
            provider={selProvider}
            isOpen={open}
            onClose={handleCloseDialog}
            onUpdateSuccess={providerUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
