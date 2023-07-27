import Link from "next/link";
import style from "../styles/header.module.css";
import logoNormal from "/public/images/wedding-logo.png";
import logoSmall from "/public/images/wedding-logo-small.png";

export default function Header() {
  let logo = (
    <img
      srcSet={`${logoNormal.src} 482w, ${logoSmall.src} 241w`}
      sizes="(max-width: 600px) 241px, 482px"
      src={logoNormal}
      alt="ribbon with newlyweds' name"
      style={{ margin: "2vh auto" }}
    />
  );
  return (
    <header>
      <Link href="/">{logo}</Link>
      <nav className={style.navItems}>
        <Link href="/tellus">TELL US</Link>
        <Link href="/photos">PHOTOS</Link>
      </nav>
    </header>
  );
}
