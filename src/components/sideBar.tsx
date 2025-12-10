"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  BottleWine,
  FileText,
  PanelRight,
  PanelRightClose,
  Truck,
  User,
} from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";


export function SideBar() {
  const { user } = useUser();
  const [openSideBar, setOpenSideBar] = useState(true);

  if (!user) {
    return (
      <></>
    );
  }

  return (
    <div
      className={`flex flex-col h-full border-r p-2 bg-white gap-3 ${
        openSideBar ? "w-full" : "w-15"
      }`}
      style={{ minHeight: "90vh" }}
    >
      {/* top */}
      <div
        className={`flex items-center gap-3 flex-col`}
      >
        {openSideBar ? (
          <PanelRightClose
            onClick={() => setOpenSideBar(false)}
            className="hover:cursor-pointer ease-in-out items-center justify-center text-red-600 "
          />
        ) : (
          <PanelRight
            onClick={() => setOpenSideBar(true)}
            className="hover:cursor-pointer ease-in-out items-center justify-center text-red-600 "
          />
        )}
      </div>
      {/* body */}
      <div
        className={`flex flex-col gap-3 align-baseline ${
          openSideBar ? "items-start" : ""
        }`}
      >
        {/* User */}
        <div className="items-center justify-center flex">
          <Link href="/users/read" className="flex">
            <User
              size={30}
              className="hover:cursor-pointer ease-in-out hover:text-red-600 "
            />
            <Label
              hidden={!openSideBar}
              className="hover:cursor-pointer ease-in-out  hover:text-red-600"
            >
              Clientes
            </Label>
          </Link>
        </div>
        {/* Provider */}
        <div className="justify-center items-center flex">
          <Link href="/providers/read" className="flex">
            <Truck
              size={30}
              className="hover:cursor-pointer ease-in-out hover:text-red-600"
            />
            <Label
              hidden={!openSideBar}
              className="hover:cursor-pointer ease-in-out  hover:text-red-600"
            >
              Proveedores
            </Label>
          </Link>
        </div>
        {/* Products */}
        <div className="justify-center items-center flex">
          <Link href="/products/read" className="flex">
            <BottleWine
              size={30}
              className="hover:cursor-pointer ease-in-out hover:text-red-600"
            />
            <Label
              hidden={!openSideBar}
              className="hover:cursor-pointer ease-in-out  hover:text-red-600"
            >
              Productos
            </Label>
          </Link>
        </div>
        <div className="justify-center items-center flex">
          <Link href="/invoices/purchase/register" className="flex">
            <FileText
              size={30}
              className="hover:cursor-pointer ease-in-out hover:text-red-600"
            />
            <Label
              hidden={!openSideBar}
              className="hover:cursor-pointer ease-in-out  hover:text-red-600"
            >
              Facturas de compra
            </Label>
          </Link>
        </div>
      </div>
    </div>
  );
}