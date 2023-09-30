import Link from "next/link";
import Image from "next/image";
import style from "@/styles/header.module.css";
import headerImage from "/public/images/en/header-logo-en.png";

export default function Header() {
  return (
    <header>
      <Link href="/">
        <Image
          src={headerImage}
          width={568}
          height={156}
          alt="ribbon with newlyweds' name"
          style={{ margin: "2vh auto" }}
        />
      </Link>
      <nav className={style.navItems}>
        <Link href="/tellus">TELL US</Link>
        <Link href="/photos">PHOTOS</Link>
      </nav>
    </header>
  );
}
