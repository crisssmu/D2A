'use client';

import { useForm } from "react-hook-form";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "../../ui/form";
import { codeCompanyFormData, purchaseInvoiceFormData } from "@/types/formdata";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface invoiceRegisterProps {
  handleSubmit: (data: purchaseInvoiceFormData) => void
  codeCompany: codeCompanyFormData[]
}

export default function InvoicePurchaseFilter({ handleSubmit, codeCompany}: invoiceRegisterProps) {
    
  const form = useForm<any>({
    defaultValues: {
      date_start: "",
      date_end: new Date().toISOString().split("T")[0],
      is_cash_payment: true,
      codeCompany: undefined
    },
  });
  
  return (
      <Form {...form} >
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className=" gap-4 flex flex-row relative">
            <FormField
              control={form.control}
              name="date_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="date"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de fin</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full max-w-2xl"
                      type="date"
                      required
                      {...field}
                    />
                  </FormControl>
                </FormItem> 
              )}
            />
            <FormField
              control={form.control}
              name="is_cash_payment"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de factura</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Contado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Contado</SelectItem>
                      <SelectItem value="false">Credito</SelectItem>
                    </SelectContent>
                  </Select>

                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="codeCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {codeCompany?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
              />
              <div className="self-end">
              <Button variant="destructive" type="submit" className=" hover:cursor-pointer shawdow-md">Buscar</Button>
              </div>
              
          </div>
        </form>
      </Form>
  );
}
