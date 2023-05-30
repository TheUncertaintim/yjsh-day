import { useRef, useState } from "react";
import MessageEntry from "./messageEntry";

import cardAdvice from "/public/images/advice_card_advice.png";
import cardPredict from "/public/images/advice_card_predict.png";
import cardShare from "/public/images/advice_card_share.png";
import cardSuggest from "/public/images/advice_card_suggest.png";
import cardTell from "/public/images/advice_card_tell.png";

import style from "../styles/adviceForm.module.css";

import { useSWRConfig } from "swr";

export default function AdviceForm({ defaultMsg, editable }) {
  // the form state could be either typing, sending or sent
  const [formState, setFormState] = useState("typing");
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  const { mutate } = useSWRConfig();

  function updateForm(state) {
    setFormState(state);
    // pull the forms again after user submitted a new form
    if (state === "sent") {
      mutate("/api/advices?entity=Card");
    }
  }

  function updateError(error) {
    setError(error);
  }

  // message is represented as an instance
  // TODO: perhaps use FormData here instead?
  const [msg, setMsg] = useState(defaultMsg);

  function handleInput(msg) {
    // remove redundant field in "msg"
    for (const key in msg) {
      if (msg[key].length === 0) {
        delete msg[key];
      }
    }
    setMsg(msg);
  }
  // the field is empty if there's only one key (category) in the "msg" instance
  const isFieldEmpty = Object.keys(msg).length === 1;
  // get the image of the interactive card that should be displayed
  const imagePath = getImagePathByCategory(defaultMsg.category);

  // dynamic style
  let dynamicStyle = style.cardBase;
  const customStyle =
    msg.category === "Advice" ? style.adviceCard : style.otherCard;
  dynamicStyle += " " + customStyle;

  switch (formState) {
    case "typing": {
      return (
        <>
          <form
            ref={formRef}
            className={dynamicStyle}
            style={{ backgroundImage: `url(${imagePath}` }}
          >
            <input name="category" value={`${msg.category}`} hidden readOnly />
            <MessageEntry
              key={msg.category}
              msg={msg}
              handleEntry={handleInput}
              editable={editable}
            />
          </form>
          {editable && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, msg, updateForm, updateError)}
              className={style.submitButton}
              disabled={isFieldEmpty}
            >
              CLICK TO SUBMIT
            </button>
          )}
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
      return <label>{error}</label>;
    }
  }
}

function getImagePathByCategory(category) {
  switch (category) {
    case "Advice":
      return cardAdvice.src;
    case "Suggest":
      return cardSuggest.src;
    case "Tell":
      return cardTell.src;
    case "Predict":
      return cardPredict.src;
    case "Share":
      return cardShare.src;
    default:
      // TODO: throw an error here
      return "";
  }
}

async function handleSubmit(event, msgData, updateForm, updateError) {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();

  // add a timestemp before submitting
  msgData["timeCreated"] = new Date().toString();

  // Send the data to the server in JSON format.
  const JSONdata = JSON.stringify(msgData);

  // API endpoint where we send form data.
  const endpoint = "/api/form?entity=Card";

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
  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);
  const result = await response.json();

  if (!response.ok) {
    updateForm("error");
    updateError(
      "Oops...! Your message did not go through. Try the physical card instead?"
    );
    return;
  }
  const cardKeyId = result.data;
  updateForm("sent");
}
