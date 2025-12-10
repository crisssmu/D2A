import { UserFormData } from "@/types/formdata";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pencil, Search, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

import { useState } from "react";
import { Loader } from "../laoder/loader";
import { useRouter } from "next/navigation";

interface TableUserProps {
  users: UserFormData[];
  select: (user: UserFormData) => void;
  open: (open: boolean) => void;
}

export const UsersTable = ({ users, select, open }: TableUserProps) => {
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoader(true);
        router.push("/users/register");
    }
    if (loader) {
        return (
            <div className="w-full h-full mx-auto p-4 items-center justify-center flex">
                <Loader />
            </div>
        );
    }
  return (
    <Card className="max-w-max flex items-center justify-center flex-col p-4 gap-5">
      <CardHeader className="w-full items-center justify-center">
        <CardTitle className="w-full flex items-center justify-center">
          Vendedores
        </CardTitle>
        <div className="w-full flex flex-row gap-2 items-center justify-center border p-2 rounded-md">
          <Search />
          <Input className="border-none w-md" placeholder="Buscar"></Input>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doc. Identificacion</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Cumpleaños</TableHead>
              <TableHead>Direccion</TableHead>
              <TableHead>N. Celular</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: UserFormData) => (
              <TableRow key={user.id}>
                <TableCell>{user.document}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.birth_date).toISOString().split("T")[0]}
                </TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
                  <Pencil
                    size={18}
                    className=" hover:cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out"
                    onClick={() => {
                      open(true);
                      select(user);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} className="text-center bg-white">
                <span className="font-semibold">
                <Link href="/users/register" onClick={handleRegisterClick}>
                  <UserPlus size={25} className="hover:cursor-pointer" />
                </Link>
                
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};
