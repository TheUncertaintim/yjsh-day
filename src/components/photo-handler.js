import { useRef, useState } from "react";
import style from "@/styles/photos.module.css";

const FormState = {
  Ready: "Ready",
  Uploading: "Uploading",
  Uploaded: "Uploaded",
  Error: "Error",
};

export default function PhotoHandler() {
  const [fileSelected, setFileSelected] = useState(null);
  const [formState, setFormState] = useState(FormState.Ready);
  const inputRef = useRef(null);

  function handleInputSelection() {
    const currFiles = inputRef.current.files;
    if (currFiles.length === 0) {
      return;
    }
    setFileSelected(currFiles[0]);
    setFormState(FormState.Ready);
  }

  function updateFormState(formState) {
    setFormState(formState);
  }

  if (formState == FormState.Error) {
    return (
      <h1>
        Oops... something went wrong! Guess Yu-Jeng got works to do now...
      </h1>
    );
  }

  // test the current state
  const isUploading = formState === FormState.Uploading;
  const isUploaded = formState === FormState.Uploaded;

  return (
    <form
      className={style.shareImageForm}
      onSubmit={(e) => handleSubmit(e, fileSelected, updateFormState)}
    >
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
          <img
            src={URL.createObjectURL(fileSelected)}
            alt="image to upload"
            className={style.uploadedImage}
          />
          <button
            type="submit"
            className={style.shareButton}
            disabled={formState === FormState.Uploaded}
          >
            UPLOAD
          </button>
        </>
      )}
      {isUploading && <h1>Uploading your photo...</h1>}
      {isUploaded && (
        <p>
          Photo uploaded, thank you!
          <br />
          Come back later to view your photos!
        </p>
      )}
    </form>
  );
}

async function handleSubmit(event, fileSelected, updateFormState) {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  const filename = encodeURIComponent(fileSelected.name);
  const endpoint = "/api/photos";
  const res = await fetch(`${endpoint}`, {
    method: "POST",
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) {
    if (res.status === 405) {
      alert(
        "This website is now archived and no longer accepts new photos.\nBut THANK YOU!"
      );
      updateFormState(FormState.Ready);
    } else {
      updateFormState(FormState.Error);
    }
  } else {
    // uploading photo to GCS from client
    const { url, fields } = await res.json();
    console.log("Url:", url);
    console.log("Fields:", fields);
    const newInstance = { ...fields, ...{ file: fileSelected } };
    const formData = new FormData();
    // create a POST request to be posted to GCS
    Object.entries(newInstance).forEach(([key, value]) => {
      formData.append(key, value);
    });

    updateFormState(FormState.Uploading);
    // Send the form data to our forms API on GCS and get a response.
    const response = await fetch(url, { method: "POST", body: formData });
    if (response.ok) {
      updateFormState(FormState.Uploaded);
    } else {
      updateFormState(FormState.Error);
    }
  }
}
