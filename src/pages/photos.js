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
      feedbackMsg = <p>照片上傳中...</p>;
      break;
    }
    case "uploaded": {
      feedbackMsg = (
        <p>
          上傳完成！謝謝！
          <br />
          照片正在雲端處理中，請稍後再回來看照片哦！
        </p>
      );
      break;
    }
    case "error": {
      feedbackMsg = <p>噢...請告訴育仁他的網站壞了的樣子！</p>;
      break;
    }
  }

  return (
    <Layout>
      <section>
        <p>育仁沒有IG，所以我 (曉惠) 沒辦法請你在IG上標記我們。</p>
        <p>
          但沒關係！請跟我們分享一張你今天拍的照片，讓這些回憶可以永遠保存。
        </p>
        <form className={style.shareImageform}>
          <div>
            <label htmlFor="image-upload" className={style.filePickerLabel}>
              上傳照片
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
              <img
                src={URL.createObjectURL(fileSelected)}
                alt="image to upload"
                className={style.uploadedImage}
              />
              <button
                type="submit"
                className={style.shareButton}
                onClick={(e) => handleSubmit(e, fileSelected, updateFormState)}
              >
                上傳
              </button>
            </>
          )}
          {feedbackMsg}
        </form>
        <div className="divider" />
        <h1>你的眼中的這一天...</h1>
        {isLoading && <p>照片下載中，請稍等一下囉...</p>}
        {data && <PhotoCollection galleryID="my-test-gallery" images={data} />}
      </section>
    </Layout>
  );
}

async function handleSubmit(event, fileSelected, updateFormState) {
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
