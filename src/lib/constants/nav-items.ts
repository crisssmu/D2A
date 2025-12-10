export type NavLink = {
  name: string;
  href: string;
};

export type NavItem = {
  title: string;
  links: NavLink[];
};

export const getNavItems = (path: string, role: boolean): NavItem[] => {
  if(role) return navItemsAdmin(path);
  else return navItemsSeller(path);
};

const navItemsSeller = (path: string): NavItem[] => {
  switch (path) {
    case "users":
      return [
        {
          title: "Usuarios",
          links: [
            { name: "Registrar usuarios", href: "/users/register" },
          ],
        },
      ];
    case "providers":
      return [
        {
          title: "Codigo de empresas",
          links: [
            { name: "Codigo de empresas", href: "/code/read" },
          ],
        },
      ];
    case "code":
      return [
        {
          title: "Proveedor",
          links: [
            { name: "Proveedor", href: "/providers/read" },
          ],
        },
      ];
    case "products":
      return [
        {
          title: "",
          links: [
            { name: "Crear producto", href: "/products/register" },
          ],
        },
    ];
    case "invoices":
      return [
        {
          title: "Listar facturas de compra",
          links: [
            { name: "Listar facturas de compra", href: "/invoices/purchase/read" },
          ],
        },
    ]
    default:
      return [
        {
          title: "Inicio",
          links: [{ name: "Ir al inicio", href: "/" }],
        },
      ];
  }
}

const navItemsAdmin = (path: string): NavItem[] => {
  switch (path) {
    case "users":
      return [
        {
          title: "Usuarios",
          links: [
            { name: "Registrar usuarios", href: "/users/register" },
          ],
        },
      ];
    case "providers":
      return [
        {
          title: "Codigo de empresas",
          links: [
            { name: "Codigo de empresas", href: "/code/read" },
          ],
        },
      ];
    case "code":
      return [
        {
          title: "Proveedor",
          links: [
            { name: "Proveedor", href: "/providers/read" },
          ],
        },
      ];
    case "products":
      return [
        {
          title: "",
          links: [
            { name: "Crear producto", href: "/products/register" },
          ],
        },
    ];
    case "invoices":
      return [
        {
          title: "Listar facturas de compra",
          links: [
            { name: "Listar facturas de compra", href: "/invoices/purchase/read" },
          ],
        },
    ]
    default:
      return [
        {
          title: "Inicio",
          links: [{ name: "Ir al inicio", href: "/" }],
        },
      ];
  }
};