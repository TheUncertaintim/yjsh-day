import Image from "next/image";
import styles from "@/styles/Home.module.css";
import background from "../../public/images/a1-signage-web-v3.png";

function LandingImage() {
  return (
    <div id={styles.container}>
      <Image
        src={background}
        width={1000}
        height={600}
        alt="A logo with date of the wedding"
        style={{ maxWidth: "100%", margin: "5vh auto" }}
      />
    </div>
  );
}

export default function Home() {
  return <LandingImage />;
}
