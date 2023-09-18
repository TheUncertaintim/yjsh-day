import Layout from "../components/layout";
import styles from "@/styles/Home.module.css";
import bgImageNormal from "../../public/images/background-image-570px.png";
import bgImageSmall from "../../public/images/background-image-285px.png";
import a1Signage from "../../public/images/A1signage_web v3.png";

function LandingImage() {
  return (
    <div id={styles.container}>
      <img
        // srcSet={`${bgImageNormal.src} 570w, ${bgImageSmall.src} 285w`}
        sizes="(max-width: 600px) 285px, 570px"
        src={a1Signage.src}
        alt="a logo with date of the wedding"
        style={{ maxWidth: "100%", margin: "5vh auto" }}
      />
      {/* <img src={a1Signage.src} alt="background" /> */}
    </div>
  );
}

export default function Home() {
  return <LandingImage />;
}
