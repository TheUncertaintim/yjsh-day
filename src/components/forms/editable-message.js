import { useRef, useState } from "react";
import MessageEntry from "./message-entry";
import { getImagePathByCategory } from "@/utils/utils";
import style from "@/styles/form.module.css";

import { useSWRConfig } from "swr";

export default function EditableMessage({ msgCategory }) {
  // the form state could be either typing, sending or sent
  const [formState, setFormState] = useState("typing");
  const ref = useRef();

  const { mutate } = useSWRConfig();

  function updateForm(state) {
    setFormState(state);
    // pull the forms again after user submitted a new form
    if (state === "sent") {
      mutate("/api/card");
    }
  }

  // message is represented as an instance
  const [msg, setMsg] = useState({});

  function handleInput(msg) {
    setMsg(msg);
  }
  //
  const valueStrings = Object.values(msg).join("");
  const isFieldEmpty = valueStrings.replaceAll("false", "").length == 0;
  // get the image of the interactive card that should be displayed
  const imagePath = getImagePathByCategory(msgCategory);

  // dynamic style
  let dynamicStyle;
  if (msgCategory === "Advice") {
    dynamicStyle = `${style.cardBase} ${style.adviceCard}`;
  } else {
    dynamicStyle = `${style.cardBase} ${style.otherCard}`;
  }

  const onSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // // add a timestemp and category before submitting
    let data = structuredClone(msg);
    data["timeCreated"] = new Date().toString();
    data["category"] = msgCategory;

    updateForm("sending");

    // POST the data to the API endpoint
    const res = await fetch("/api/card", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // TODO: handle if response is not ok
    if (!res.ok) {
      updateForm("error");
      return;
    }

    const response = await res.json();
    if (!response.ok) {
      updateForm("error");
    } else {
      updateForm("sent");
    }
  };

  switch (formState) {
    case "typing": {
      return (
        <>
          <form
            id="editableForm"
            ref={ref}
            className={dynamicStyle}
            onSubmit={onSubmit}
            style={{ backgroundImage: `url(${imagePath}` }}
          >
            <MessageEntry
              category={msgCategory}
              msg={msg}
              handleEntry={handleInput}
            />
          </form>
          <input
            type="submit"
            className={style.submitButton}
            disabled={isFieldEmpty}
            value={"CLICK TO SUBMIT"}
            form="editableForm"
          />
        </>
      );
    }
    case "sending": {
      return <label>Sending your advice...</label>;
    }
    case "sent": {
      return <label>Thank you for your advice!</label>;
    }
    case "error": {
      return (
        <label>
          Oops...! Your message did not go through. Try the physical card
          instead?
        </label>
      );
    }
  }
}
