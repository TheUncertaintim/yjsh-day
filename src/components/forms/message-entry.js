import style from "@/styles/messageEntry.module.css";
import { useContext } from "react";
import { EditableContext } from "./form-context";

export default function MessageEntry({ category, msg, handleEntry }) {
  const onInputChange = handleEntry
    ? (change) => {
        // compose new entry instance
        const newEntry = {
          ...msg,
          ...change,
        };
        // update new entry
        handleEntry(newEntry);
      }
    : null;

  if (category === "Advice") {
    return <MultiEntry msg={msg} onInputChange={onInputChange} />;
  } else {
    return <SingleEntry msg={msg} onInputChange={onInputChange} />;
  }
}

function MultiEntry({ msg, onInputChange }) {
  /**
   * note that the "onChange" iattribute handled dynamically, depending on
   * whether onInputChange is explicitly defined.
   */
  return (
    <>
      <TextInput
        name="_1_alwaysText"
        msg={msg}
        maxLength="70"
        placeholder="...water your plant?"
        className={`${style.input} ${style.alwaysText}`}
        onInputChange={onInputChange}
      />
      <TextInput
        name="_2_neverText"
        msg={msg}
        maxLength="70"
        placeholder="...sleepwalking?"
        className={`${style.input} ${style.neverText}`}
        onInputChange={onInputChange}
      />
      <TextInput
        name="_3_sometimesText"
        msg={msg}
        maxLength="70"
        placeholder="...find your ME time?"
        className={`${style.input} ${style.sometimesText}`}
        onInputChange={onInputChange}
      />
      <div className={style.checkBoxes}>
        <div className={style.jokingOption}>
          <CheckBoxInput
            name="_4_jokingBox"
            msg={msg}
            onInputChange={onInputChange}
          />
        </div>
        <div className={style.trustMeOption}>
          <CheckBoxInput
            name="_5_trustMeBox"
            msg={msg}
            onInputChange={onInputChange}
          />
        </div>
        <CheckBoxInput
          name="_6_blankBox"
          msg={msg}
          onInputChange={onInputChange}
        />
        <TextInput
          name="_7_blankInput"
          msg={msg}
          maxLength="15"
          placeholder="...or?"
          className={`${style.input} ${style.blankInput}`}
          onInputChange={onInputChange}
        />
      </div>
      <TextInput
        name="_8_signedBy"
        msg={msg}
        maxLength="15"
        className={`${style.input} ${style.signedByText}`}
        onInputChange={onInputChange}
      />
    </>
  );
}

function TextInput(prop) {
  const isEditable = useContext(EditableContext);

  return (
    <input
      type="text"
      name={prop.name}
      value={prop.msg[prop.name] ?? ""}
      placeholder={prop.placeholder}
      maxLength={prop.maxLength}
      onChange={(e) => prop.onInputChange({ [prop.name]: e.target.value })}
      className={prop.className}
      disabled={!isEditable}
    />
  );
}

function CheckBoxInput({ name, msg, onInputChange }) {
  const isEditable = useContext(EditableContext);

  return (
    <input
      type="checkbox"
      name={name}
      checked={msg[name] ?? false}
      onChange={(e) => onInputChange({ [name]: e.target.checked })}
      disabled={!isEditable}
    />
  );
}

function SingleEntry({ msg, onInputChange }) {
  const isEditable = useContext(EditableContext);

  return (
    <textarea
      name="message"
      value={msg["textArea"] ?? ""}
      placeholder="Long story short..."
      maxLength="350"
      onChange={(e) => onInputChange({ textArea: e.target.value })}
      className={style.formTextArea}
      disabled={!isEditable}
    ></textarea>
  );
}
