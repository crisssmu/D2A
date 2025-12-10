"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import UserDropMenu from "./(profilecomponents)/UserDropMenu";
import { useAuthStore } from "@/lib/store/auth";
import { useUser } from "@/context/UserContext";
import { getNavItems, NavItem } from "@/lib/constants/nav-items";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useGlobalStore } from "@/lib/store/global";
import { Loader } from "./laoder/loader";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const firstPath = pathname.split("/")[1];

  const { isLogged, setIsLogged } = useAuthStore();
  const { user, setUser } = useUser();

  const { actualUserRol, setActualUserRol } = useAuthStore();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const { loader, setLoader } = useGlobalStore();

  const handleRole = useMemo(
    () =>
      (islogged: boolean, role: boolean = false) => {
        setIsLogged(islogged);
        setActualUserRol(role);
        setLoader(false);
      },
    [setActualUserRol, setIsLogged, setLoader]
  );

  useEffect(() => {
    setLoader(true);
    supabase.auth.getUser().then((res) => {
      const { data, error: userError } = res;
      //failfast conditions
      if (userError || !data.user) {
        handleRole(false);
        handleLogout();
        return;
      }
      supabase
        .from("profile")
        .select(`isAdmin`)
        .eq("id", data.user?.id)
        .single()
        .then((userProfileRes) => {
          const { data: dataProfile, error: profileError } = userProfileRes;
          if (profileError) {
            handleRole(false);
            handleLogout();
            return;
          }
          handleRole(true, dataProfile.isAdmin ? true : false);
        });
    });
    setUser(true);
  }, [isLogged]);

  const handleLogout = () => {
    setLoader(true);
    supabase.auth.signOut();
    setIsLogged(false);
    setUser(false);
    router.push("/");
    setLoader(false);
  };

  useEffect(() => {
    setNavItems(getNavItems(firstPath, actualUserRol));
  }, [firstPath, actualUserRol]);

  if (loader)
    return (
      <div className="w-full h-full mx-auto p-4 items-center justify-center flex">
        <Loader />
      </div>
    );

  return (
    <header className="flex flex-row justify-between p-2 border-b items-center">
      <Link href="/">
        <Image src="/logo_trans.svg" alt="Logo" width={50} height={50} />
      </Link>

      {isLogged && (
        <div className="flex w-full justify-between items-center">
          <div className="flex-1 flex justify-center">
            <nav>
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.links.map((link) => (
                        <NavigationMenuLink key={link.name} href={link.href}>
                          {link.name}
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>
          <UserDropMenu user={user} logOut={handleLogout} />
        </div>
      )}
      {!isLogged && (
        <Button onClick={() => router.push("/singin")}> Iniciar sesion </Button>
      )}
    </header>
  );
}
