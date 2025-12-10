import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-animate text-bla text-center px-4">

      <div className="background-bubbles">
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
      </div>

      <h1 className="text-4xl font-bold mb-4">Bienvenido al Depósito Los Dos Amigos</h1>
      <p className="mb-8 text-lg">
        una caja de cerveza para compartir
      </p>
      <Link href="/singin">
        <Button>Entrar</Button>
      </Link>
    </div>
  );
}
