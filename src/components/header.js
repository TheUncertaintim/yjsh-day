import Link from "next/link";
import style from "@/styles/header.module.css";
import headerImage from "/public/images/en/header-logo-en.png";

export default function Header() {
  // Note: Using Next/Image requires nextjs cache folder to be read/written
  // on runtime, which is not possible with Google App Engine Standard Environment
  // https://stackoverflow.com/questions/71429343/is-google-app-engine-standard-environment-compatible-with-next-image
  // For this reason we're using traditional <img> tag here
  return (
    <header>
      <Link href="/">
        <img
          src={headerImage.src}
          alt="ribbon with newlyweds' name"
          style={{ margin: "2vh auto", maxWidth: "70vw" }}
        />
      </Link>
      <nav className={style.navItems}>
        <Link href="/tellus">TELL US</Link>
        <Link href="/photos">PHOTOS</Link>
      </nav>
    </header>
  );
}
