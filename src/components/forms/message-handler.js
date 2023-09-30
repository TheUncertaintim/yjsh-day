import { useState } from "react";
import { useSWRConfig } from "swr";
import style from "@/styles/form.module.css";
import Message from "./message";

export default function MessageHandler({ msgCategory }) {
  // the form state could be either typing, sending or sent
  const [formState, setFormState] = useState("typing");

  const { mutate } = useSWRConfig();

  function updateForm(state) {
    setFormState(state);
    // pull the forms again after user submitted a new form
    if (state === "sent") {
      mutate("/api/cards");
    }
  }

  // message is represented as an instance
  const [msg, setMsg] = useState({});

  function onEntry(msg) {
    setMsg(msg);
  }
  //
  const valueStrings = Object.values(msg).join("");
  const isFieldEmpty = valueStrings.replaceAll("false", "").length == 0;

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

  const formId = "message-form";

  switch (formState) {
    case "typing": {
      return (
        <>
          <Message
            id={formId}
            category={msgCategory}
            msg={msg}
            handleSubmit={onSubmit}
            handleEntry={onEntry}
          />
          <input
            type="submit"
            className={style.submitButton}
            disabled={isFieldEmpty}
            value={"CLICK TO SUBMIT"}
            form={formId}
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
