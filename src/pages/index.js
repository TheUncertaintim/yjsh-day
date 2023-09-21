import Image from "next/image";
import background from "/public/images/en/landing-image-en.png";

export default function LandingImage() {
  return (
    <Image
      src={background}
      alt="A logo with date of the wedding"
      style={{
        maxWidth: "100%",
        height: "auto",
        margin: "0 auto",
      }}
    />
  );
}
