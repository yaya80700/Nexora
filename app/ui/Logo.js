import Image from "next/image";
import Link from "next/link";

export default function Logo({compact=false}) {
  return <Link href="/" className={compact ? "logo compact" : "logo"} aria-label="Nexora - Accueil">
    <Image src="/nexora-logo.png" alt="Nexora" width={42} height={42} priority />
    {!compact && <span>NEXORA</span>}
  </Link>;
}
