import { useState, useReducer } from "react";
import { useSWRConfig } from "swr";
import style from "@/styles/form.module.css";
import Message from "./message";
import { DispatchContext, MessageDataContext } from "./form-context";

function msgReducer(msg, action) {
  switch (action.type) {
    case "text":
      return {
        ...msg,
        [action.name]: action.value,
      };
    case "checkbox":
      return {
        ...msg,
        [action.name]: action.value,
      };
    default:
      throw Error("Unknown action type:", action.type);
  }
}

// different form state
const FormState = {
  Typing: "typing",
  Sending: "sending",
  IsSent: "isSent",
  Error: "error",
};

export default function MessageHandler({ msgCategory }) {
  // initial state is an empty message
  const [msg, dispatch] = useReducer(msgReducer, {});
  // the form state could be either typing, sending or sent
  const [formState, setFormState] = useState(FormState.Typing);

  const { mutate } = useSWRConfig();

  function updateForm(state) {
    setFormState(state);
    if (state === FormState.IsSent) {
      // pull the forms again after user submitted a new form
      mutate("/api/cards");
    }
  }

  // If the form was sent successfully
  if (formState == FormState.IsSent) {
    return <h1>Thank you for your advice!</h1>;
  }
  // If an error occurred
  if (formState == FormState.Error) {
    return (
      <h1>Oops...! Something went wrong. Try the physical card instead?</h1>
    );
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    // // add a timestamp and category before submitting
    let data = structuredClone(msg);
    data["timeCreated"] = new Date().toString();
    data["category"] = msgCategory;

    updateForm(FormState.Sending);

    // POST the data to the API endpoint
    const res = await fetch("/api/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      updateForm(FormState.Error);
    } else {
      updateForm(FormState.IsSent);
    }
  };
  // the form shall not be submitted when empty
  const valueStrings = Object.values(msg).join("");
  const isFieldEmpty = valueStrings.replaceAll("false", "").length === 0;

  const formId = "message-form";
  return (
    <DispatchContext.Provider value={dispatch}>
      <MessageDataContext.Provider value={msg}>
        <Message id={formId} category={msgCategory} handleSubmit={onSubmit} />
        <input
          type="submit"
          className={style.submitButton}
          disabled={isFieldEmpty}
          value="CLICK TO SUBMIT"
          form={formId}
        />
        {formState === FormState.IsSent && <h1>Sending your advice...</h1>}
      </MessageDataContext.Provider>
    </DispatchContext.Provider>
  );
}
