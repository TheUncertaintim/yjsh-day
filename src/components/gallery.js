import { useEffect } from "react";
import useSWR from "swr";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import style from "@/styles/photos.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Gallery() {
  const { data, error, isLoading } = useSWR("/api/photos", fetcher);

  if (error) {
    return <h1>Oops...! Something went wrong. Photos cannot be loaded</h1>;
  }

  return (
    <>
      <h1>This day, through your eyes.</h1>
      {isLoading && <h2>Fetching images...This might take a while...</h2>}
      {data && <PhotoCollection galleryID="my-test-gallery" images={data} />}
    </>
  );
}

function PhotoCollection(props) {
  // load PhotoSwipe once
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + props.galleryID,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className={style.photoContainer} id={props.galleryID}>
      {props.images.map((image, index) => (
        <a
          href={image.originFile}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          key={props.galleryID + "-" + index}
          target="_blank"
          rel="noreferrer"
        >
          <img src={image.thumbnail} alt="thumbnail" />
        </a>
      ))}
    </div>
  );
}
