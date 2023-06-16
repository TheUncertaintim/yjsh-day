import Link from "next/link";
import style from "../styles/header.module.css";
import logoNormal from "/public/images/wedding-logo-ch.png";
import logoSmall from "/public/images/wedding-logo-ch-small.png";

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
        <Link href="/tellus">互動小卡</Link>
        <Link href="/photos">相片集</Link>
      </nav>
    </header>
  );
}
