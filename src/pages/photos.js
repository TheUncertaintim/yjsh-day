import { useRef, useState, useEffect } from "react";
import style from "@/styles/photos.module.css";
import Image from "next/image";
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
  const { data, error, isLoading } = useSWR("/api/photos", fetcher);

  if (error) {
    console.error("Error loading photos...", error);
  }
  const [fileSelected, setFileSelected] = useState(null);
  const [formState, setFormState] = useState("");
  const inputRef = useRef(null);

  function handleInputSelection() {
    const currFiles = inputRef.current.files;
    if (currFiles.length === 0) {
      return;
    }
    setFileSelected(currFiles[0]);
    setFormState("");
  }

  function updateFormState(formState) {
    setFormState(formState);
    if (formState === "uploaded") {
      setFileSelected(null);
    }
  }

  // display message to update user the status to the photo uploaded
  let feedbackMsg = null;
  switch (formState) {
    case "uploading": {
      feedbackMsg = <p>Uploading your photo...</p>;
      break;
    }
    case "uploaded": {
      feedbackMsg = (
        <p>
          Photo uploaded, thank you!
          <br />
          Come back later to view your photos!
        </p>
      );
      break;
    }
    case "error": {
      feedbackMsg = (
        <p>
          Oops... something went wrong! Guess Yu-Jeng got works to do now...
        </p>
      );
      break;
    }
  }

  return (
    <section>
      <p>
        Yu-Jeng doesn’t have Instagram, therefore there is no “Wedding Hashtag”,
        so I (Shao Hui) can’t ask you to tag us on Instagram.
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
            accept="image/*"
            onChange={handleInputSelection}
            className={style.filePicker}
          />
        </div>
        {fileSelected && (
          <>
            <Image
              src={URL.createObjectURL(fileSelected)}
              alt="image to upload"
              className={style.uploadedImage}
            />
            <button
              type="submit"
              className={style.shareButton}
              onClick={(e) => handleSubmit(e, fileSelected, updateFormState)}
            >
              Upload
            </button>
          </>
        )}
        {feedbackMsg}
      </form>
      <div className="divider" />
      <h1>This day, through your eyes.</h1>
      {isLoading && <p>Fetching images...This might take a while...</p>}
      {data && <PhotoCollection galleryID="my-test-gallery" images={data} />}
    </section>
  );
}

async function handleSubmit(event, fileSelected, updateFormState) {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const filename = encodeURIComponent(fileSelected.name);
  const endpoint = "/api/photos";
  const res = await fetch(`${endpoint}?file=${filename}`);
  // TODO: handle if response is not ok
  if (!res.ok) {
    updateFormState("error");
    return;
  }

  const { url, fields } = await res.json();

  const newInstance = { ...fields, ...{ file: fileSelected } };
  const formData = new FormData();
  // create a POST request to be posted to GCS
  Object.entries(newInstance).forEach(([key, value]) => {
    formData.append(key, value);
  });

  updateFormState("uploading");
  // Send the form data to our forms API on GCS and get a response.
  try {
    const response = await fetch(url, { method: "POST", body: formData });
    if (response.ok) {
      console.log(
        "Image ",
        fileSelected.name,
        " has been posted successfully to GCS!"
      );
      updateFormState("uploaded");
    } else {
      const data = await response.json();
      console.log(
        "Failed to upload image to Google Cloud Storage. Error:",
        data.err
      );
      updateFormState("error");
    }
  } catch (err) {
    console.error(err);
    updateFormState("error");
  }
}
