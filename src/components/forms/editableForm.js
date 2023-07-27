import { useState } from "react";
import MessageEntry from "../messageEntry";
import { getImagePathByCategory } from "./utils";
import style from "../../styles/form.module.css";

import { useSWRConfig } from "swr";

export default function EditableForm({ formCategory }) {
  // the form state could be either typing, sending or sent
  const [formState, setFormState] = useState("typing");
  const { mutate } = useSWRConfig();

  function updateForm(state) {
    setFormState(state);
    // pull the forms again after user submitted a new form
    if (state === "sent") {
      mutate("/api/advices?entity=Card");
    }
  }

  // message is represented as an instance
  // TODO: perhaps use FormData here instead?
  const [msg, setMsg] = useState({
    category: formCategory,
  });

  function handleInput(msg) {
    // remove redundant field in "msg"
    // so that the var "isFieldEmpty" works properly
    for (const key in msg) {
      const entry = msg[key];
      if (typeof entry === "string" && entry.length === 0) {
        delete msg[key];
      } else if (typeof entry === "boolean" && msg[key] === false) {
        delete msg[key];
      }
    }
    setMsg(msg);
  }
  // the field is empty if there's only one key (category) in the "msg" instance
  const isFieldEmpty = Object.keys(msg).length === 1;
  // get the image of the interactive card that should be displayed
  const imagePath = getImagePathByCategory(msg.category);

  // dynamic style
  let dynamicStyle = style.cardBase;
  if (msg.category === "Advice") {
    dynamicStyle += " " + style.adviceCard;
  } else {
    dynamicStyle += " " + style.otherCard;
  }

  switch (formState) {
    case "typing": {
      return (
        <>
          <form
            className={dynamicStyle}
            style={{ backgroundImage: `url(${imagePath}` }}
          >
            <input name="category" value={`${msg.category}`} hidden readOnly />
            <MessageEntry msg={msg} handleEntry={handleInput} editable={true} />
          </form>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, msg, updateForm)}
            className={style.submitButton}
            disabled={isFieldEmpty}
          >
            CLICK TO SUBMIT
          </button>
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

async function handleSubmit(event, msgData, updateForm) {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  // add a timestemp before submitting
  msgData["timeCreated"] = new Date().toString();

  // Send the data to the server in JSON format.
  const JSONdata = JSON.stringify(msgData);

  // API endpoint where we send form data.
  const endpoint = "/api/form";

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "POST",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // TODO: client side validation here
  // if (...) {
  //   return false;
  // }

  updateForm("sending");
  // Send the form data to our forms API and get a response.
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    updateForm("error");
  } else {
    console.log(`Another message has been sent successfully!`);
    updateForm("sent");
  }
}
