"use client";
import { UserFormData } from "@/types/formdata";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UsersTable } from "@/components/(usercomponents)/UsersTable";
import { UserEdit } from "@/components/(usercomponents)/UserEditDialog";
import { Loader } from "@/components/laoder/loader";
import { useToast } from "@/hooks/use-toast";

export default function ReadUser() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserFormData[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (data: UserFormData) => {
    if (!data) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('profile').update({
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        document: data.document,
        birth_date: data.birth_date,
        address: data.address,
        phone_number: data.phone_number
      }).eq('id', data.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Vendedor actualizado correctamente",
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el vendedor",
        variant: "destructive"
      })
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedUser(null);
    }
  }

  const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")

      if (error) {
        console.log("Error encontrando los vendedores: ", error);
      } else {
        setUsers(data);
      }

      setLoading(false);
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const handleCloseDialog = (value: boolean) => {
    setOpen(value);
    if (!value) setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader />
      </div>
    )
  }
  return (
    <>
      <div className="w-full flex items-center justify-center h-full">
        <UsersTable
          users={users}
          select={setSelectedUser}
          open={setOpen}
        />
      </div>

      <UserEdit
        open={open}
        setOpen={handleCloseDialog}
        user={selectedUser}
        onSubmit={handleSubmit}
        isSeller={true}
      />
    </>
  );
}
