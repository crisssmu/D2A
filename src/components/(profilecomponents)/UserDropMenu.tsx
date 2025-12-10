import React from 'react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'


interface userDropMenuProps {
    user: boolean,
    logOut: () => void
}

export default function userDropMenu({ user, logOut }: userDropMenuProps) {
   
    return (
            <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="hover:cursor-pointer ease-in-out items-center justify-center ">
              <AvatarFallback className="rounded-md">D2A</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 bg-white p-2 rounded-md' align='start'>
            <DropdownMenuItem>
                Perfil
            </DropdownMenuItem>
            <DropdownMenuItem variant="normal" onClick={logOut}>
                Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       
    )
}