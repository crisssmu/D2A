import { codeCompanyFormData } from "@/types/formdata";
import { Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface codeCompanyProps{
    selectCodeCompany: (code: codeCompanyFormData) => void;
    open: (open: boolean) => void;
    codes: codeCompanyFormData[];
    providers: { id: number; name: string }[] | null;
}

export default function CodeTable({selectCodeCompany, open, codes, providers}: codeCompanyProps) {  
    if(codes.length === 0){
        return (
          <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead rowSpan={2} className="text-center">Código</TableHead>
                        <TableHead rowSpan={2} className="text-center">Compañía</TableHead>
                        <TableHead rowSpan={2} className="text-center">Email</TableHead>
                        <TableHead rowSpan={2} className="text-center">Proveedor</TableHead>
                        <TableHead colSpan={5} className="text-center">Datos del titular</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow><TableCell colSpan={9} className="text-center">No hay códigos disponibles</TableCell></TableRow>
                </TableBody>
            </Table>
          </>
        );
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead rowSpan={2} className="text-center">Código</TableHead>
                        <TableHead rowSpan={2} className="text-center">Compañía</TableHead>
                        <TableHead rowSpan={2} className="text-center">Email</TableHead>
                        <TableHead rowSpan={2} className="text-center">Proveedor</TableHead>
                        <TableHead colSpan={5} className="text-center">Datos del titular</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Direccion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {codes.map((code) => (
                        <TableRow key={code.id} className="hover:cursor-pointer hover:bg-gray-100" onClick={() => {selectCodeCompany(code); open(true);}}>
                            <TableCell className=" ">{code.code}</TableCell>
                            <TableCell className="text-center ">{code.company_name}</TableCell>
                            <TableCell className="text-center ">{code.email}</TableCell>
                            <TableCell className="text-center ">{providers?.find(provider => provider.id === code.id_provider)?.name || 'N/A'}</TableCell>
                            <TableCell>{code.document}</TableCell>
                            <TableCell>{code.name} {code.lastname}</TableCell>
                            <TableCell>{code.phone_number === '' || code.phone_number === null ? 'N/A' : code.phone_number} </TableCell>
                            <TableCell>{code.address === '' || code.address === null ? 'N/A' : code.address}</TableCell>
                            <TableCell>
                                <Pencil size={18} className="cursor-pointer hover:text-red-600 transition-colors duration-200 ease-in-out" onClick={()=> selectCodeCompany(code)}/>
                            </TableCell>
                        </TableRow>
                    ))}     
                </TableBody>
            </Table>
        </>
    );
}
