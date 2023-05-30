import { useRef, useState, useEffect } from "react";
import Layout from "../components/layout";
import style from "../styles/photos.module.css";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

import useSWR from "swr";

function PhotoCollection(props) {
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

export default function Photos() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    "/api/advices?entity=ImageSummary",
    fetcher
  );

  const [fileSelected, setFileSelected] = useState(null);
  const inputRef = useRef(null);

  function handleInputSelection() {
    const currFiles = inputRef.current.files;
    if (currFiles.length === 0) {
      return;
    }
    console.log("currFiles[0]:", currFiles[0]);
    setFileSelected(currFiles[0]);
  }

  return (
    <Layout>
      <section>
        <p>
          Yu-Jeng doesn’t have Instagram, therefore there is no “Wedding
          Hashtag”, so I (Shao Hui) can’t ask you to tag us on Instagram.
        </p>
        <p>
          INSTEAD! Share with us your perspective of the day - Photos of you,
          photos of us, memories of this day to last a lifetime.
        </p>
        <form className={style.shareImageform}>
          <div>
            <label htmlFor="image-upload" className={style.filePickerLabel}>
              SELECT A PHOTO
            </label>
            <input
              id="image-upload"
              ref={inputRef}
              type="file"
              accept="image/*;capture=camera"
              onChange={handleInputSelection}
              className={style.filePicker}
            />
          </div>
          {fileSelected && (
            <img
              src={URL.createObjectURL(fileSelected)}
              alt="selected image"
              className={style.uploadedImage}
            />
          )}
          {fileSelected && (
            <button
              type="submit"
              className={style.shareButton}
              onClick={(e) => handleSubmit(e, fileSelected)}
            >
              Upload
            </button>
          )}
        </form>
        <div className="divider" />
        <h1>This day, through your eyes.</h1>
        <PhotoCollection
          galleryID="my-test-gallery"
          images={[
            {
              originFile:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg",
              thumbnail:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-200.jpg",
              width: 1875,
              height: 2500,
            },
            {
              originFile:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg",
              thumbnail:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg",
              width: 1669,
              height: 2500,
            },
            {
              originFile:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg",
              thumbnail:
                "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg",
              width: 2500,
              height: 1666,
            },
          ]}
        />
      </section>
    </Layout>
  );
}

async function handleSubmit(event, fileSelected) {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const filename = encodeURIComponent(fileSelected.name);
  const endpoint = "/api/gcs-upload-url";
  const res = await fetch(`${endpoint}?file=${filename}`);
  const { url, fields } = await res.json();

  const newInstance = { ...fields, ...{ file: fileSelected } };
  const formData = new FormData();
  // create a POST request to be posted to GCS
  Object.entries(newInstance).forEach(([key, value]) => {
    formData.append(key, value);
  });
  // Send the form data to our forms API on GCS and get a response.
  const response = await fetch(url, { method: "POST", body: formData });
  if (response.ok) {
    console.log(
      "Image ",
      fileSelected.name,
      " has been posted successfully to GCS!"
    );
  } else {
    console.log("Failed to upload image to Google Cloud Storage");
  }
}
