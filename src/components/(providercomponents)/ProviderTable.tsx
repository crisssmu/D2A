import { ProviderFormData } from "@/types/formdata";
import { Pencil, Truck } from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { useRouter } from "next/navigation";


interface ProviderTableProps {
    providers: ProviderFormData[];
    openEditDialog: (open: boolean) => void;
    selectProvider: (provider: ProviderFormData) => void;
}

export default function ProviderTable({
    providers, openEditDialog, selectProvider
}: ProviderTableProps) {
    const router = useRouter();

    const handleAddProvider = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push("/providers/register");
    }

    return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Doc. Identificacion</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>N. Celular</TableHead>
                </TableRow>
                    </TableHeader>
                <TableBody>
                    {providers.map((provider: ProviderFormData) => (
                        <TableRow key={provider.id}>
                            <TableCell>{provider.document}</TableCell>
                            <TableCell>{provider.name}</TableCell>
                            <TableCell>{provider.email}</TableCell>
                            <TableCell>{provider.phone_number}</TableCell>
                            <TableCell>
                                <Pencil className="hover:cursor-pointer hover:text-red-600 transtion ease-in-out" size={18} onClick={() => { selectProvider(provider) ; openEditDialog(true); }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            <Truck size={22} className="hover:cursor-pointer hover:text-red-600 transtion ease-in-out" onClick={handleAddProvider} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
        </Table>
    </div>
    )
}   