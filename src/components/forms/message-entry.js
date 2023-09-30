import style from "@/styles/messageEntry.module.css";
import { useContext } from "react";
import {
  EditableContext,
  DispatchContext,
  MessageDataContext,
} from "./form-context";
import CARD_CATEGORY from "@/lib/card-categories";

export default function MessageEntry({ category }) {
  if (category === CARD_CATEGORY.ADVICE) {
    return <MultiEntry />;
  } else {
    return <SingleEntry />;
  }
}

function SingleEntry({ name = "textArea" }) {
  const isEditable = useContext(EditableContext);
  const dispatch = useContext(DispatchContext);
  const msg = useContext(MessageDataContext);

  return (
    <textarea
      name={name}
      value={msg[name] ?? ""}
      placeholder="Long story short..."
      maxLength="350"
      onChange={(e) => dispatch({ type: "text", name, value: e.target.value })}
      className={style.formTextArea}
      disabled={!isEditable}
    ></textarea>
  );
}

function MultiEntry() {
  return (
    <>
      <TextInput
        name="_1_alwaysText"
        maxLength="70"
        placeholder="...water your plant?"
        className={`${style.input} ${style.alwaysText}`}
      />
      <TextInput
        name="_2_neverText"
        maxLength="70"
        placeholder="...sleepwalking?"
        className={`${style.input} ${style.neverText}`}
      />
      <TextInput
        name="_3_sometimesText"
        maxLength="70"
        placeholder="...find your ME time?"
        className={`${style.input} ${style.sometimesText}`}
      />
      <div className={style.checkBoxes}>
        <div className={style.jokingOption}>
          <CheckBoxInput name="_4_jokingBox" />
        </div>
        <div className={style.trustMeOption}>
          <CheckBoxInput name="_5_trustMeBox" />
        </div>
        <CheckBoxInput name="_6_blankBox" />
        <TextInput
          name="_7_blankInput"
          maxLength="15"
          placeholder="...or?"
          className={`${style.input} ${style.blankInput}`}
        />
      </div>
      <TextInput
        name="_8_signedBy"
        maxLength="15"
        className={`${style.input} ${style.signedByText}`}
      />
    </>
  );
}

function TextInput({ name, maxLength, placeholder, className }) {
  const isEditable = useContext(EditableContext);
  const dispatch = useContext(DispatchContext);
  const msg = useContext(MessageDataContext);

  return (
    <input
      type="text"
      name={name}
      value={msg[name] ?? ""}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => dispatch({ type: "text", name, value: e.target.value })}
      className={className}
      disabled={!isEditable}
    />
  );
}

function CheckBoxInput({ name }) {
  const isEditable = useContext(EditableContext);
  const dispatch = useContext(DispatchContext);
  const msg = useContext(MessageDataContext);

  return (
    <input
      type="checkbox"
      name={name}
      checked={msg[name] ?? false}
      onChange={(e) =>
        dispatch({ type: "checkbox", name, value: e.target.checked })
      }
      disabled={!isEditable}
    />
  );
}
