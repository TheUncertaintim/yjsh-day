import landingImgNormal from "/public/images/en/landing-image-800w.png";
import landingImgSmall from "/public/images/en/landing-image-400w.png";

export default function LandingImage() {
  // Note: Using Next/Image requires nextjs cache folder to be read/written
  // on runtime, which is not possible with Google App Engine Standard Environment
  // https://stackoverflow.com/questions/71429343/is-google-app-engine-standard-environment-compatible-with-next-image
  // For this reason we're using traditional <img> tag here
  return (
    <img
      srcSet={`${landingImgSmall.src} 400w, ${landingImgNormal.src} 800w`}
      sizes="(max-width: 600px) 400px, 800px"
      src={landingImgNormal.src}
      alt="A logo with date of the wedding"
      style={{
        maxWidth: "100%",
        margin: "0 auto",
      }}
    />
  );
}
