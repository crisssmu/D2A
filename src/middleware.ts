import { createClient } from '@/utils/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';


export const middleware = async (request: NextRequest) => {
    try {
        let response = NextResponse.next();

        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const currentPath = request.nextUrl.pathname;

        if (user) {
            const { data, error } = await supabase.from('profile').select(`isAdmin`).eq('id', user.id).single();
            if (error) {
                console.log("Error feching users", error);
                return NextResponse.next();
            }

            const isAdmin = data.isAdmin;

            if (currentPath === "/singin") {
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (isAdmin === true) {
                if (currentPath === "/") {
                    return NextResponse.redirect(new URL('/admindashboard', request.url));
                }
            } else {
                const adminPaths = [
                    "/admindashboard",
                    "/users/register",
                    "/users/read",
                    "/products/register",
                    "/providers/register",
                    "/products/read",
                    "/providers/read",
                    "/code/register",
                    "/code/read",
                    "/invoices/purchase/register",
                    "/invoices/purchase/read",
                ]

                const isAdminPath = adminPaths.some((path) => currentPath.startsWith(path));

                if (isAdminPath) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        } else {
            const protectedPaths = [
                "/admindashboard",
            ]

            const isProtectedPath = protectedPaths.some((path) => currentPath.startsWith(path));

            if (isProtectedPath) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }


    } catch (e) {
        console.error("Error in middleware:", e);
        return NextResponse.next();
    }
}