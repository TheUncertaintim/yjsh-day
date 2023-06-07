import style from "../styles/messageEntry.module.css";

export default function MessageEntry({ msg, handleEntry, editable }) {
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
  // TODO restrict input chars
  if (msg.category === "Advice") {
    return (
      <AdviceEntry
        msg={msg}
        style={style}
        onInputChange={onInputChange}
        editable={editable}
      />
    );
  } else {
    return (
      <TextAreaEntry
        msg={msg}
        style={style}
        onInputChange={onInputChange}
        editable={editable}
      />
    );
  }
}

function AdviceEntry({ msg, style, onInputChange = null, editable = false }) {
  /**
   * note that the "onChange" iattribute handled dynamically, depending on
   * whether onInputChange is explicitly defined.
   */
  return (
    <>
      <TextInput
        name="_1_alwaysText"
        msg={msg}
        className={`${style.input} ${style.alwaysText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
      <TextInput
        name="_2_neverText"
        msg={msg}
        className={`${style.input} ${style.neverText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
      <TextInput
        name="_3_sometimesText"
        msg={msg}
        className={`${style.input} ${style.sometimesText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
      <div className={style.checkBoxes}>
        <div className={style.jokingOption}>
          <CheckBoxInput
            name="_4_jokingBox"
            msg={msg}
            onInputChange={onInputChange}
            disabled={!editable}
          />
        </div>
        <div className={style.trustMeOption}>
          <CheckBoxInput
            name="_5_trustMeBox"
            msg={msg}
            onInputChange={onInputChange}
            disabled={!editable}
          />
        </div>
        <div className={style.blankOption}>
          <CheckBoxInput
            name="_6_blankBox"
            msg={msg}
            onInputChange={onInputChange}
            disabled={!editable}
          />
          <TextInput
            name="_7_blankInput"
            msg={msg}
            className={`${style.input} ${style.blankInput}`}
            onInputChange={onInputChange}
            disabled={!editable}
          />
        </div>
      </div>
      <TextInput
        name="_8_signedBy"
        msg={msg}
        className={`${style.input} ${style.signedByText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
    </>
  );
}

function TextInput({ name, msg, onInputChange, className, disabled }) {
  return (
    <input
      type="text"
      name={name}
      value={msg[name] ?? ""}
      {...(onInputChange && {
        onChange: (e) => onInputChange({ [name]: e.target.value }),
      })}
      className={className}
      disabled={disabled}
    />
  );
}

function CheckBoxInput({ name, msg, onInputChange, className, disabled }) {
  return (
    <input
      type="checkbox"
      name={name}
      checked={msg[name] ?? false}
      {...(onInputChange && {
        onChange: (e) => onInputChange({ [name]: e.target.checked }),
      })}
      className={className ?? ""}
      disabled={disabled}
    />
  );
}

function TextAreaEntry({ msg, style, onInputChange = null, editable }) {
  /**
   * note that the "onChange" iattribute handled dynamically, depending on
   * whether onInputChange is explicitly defined.
   */
  return (
    <textarea
      name="message"
      value={msg["textArea"] ?? ""}
      placeholder="Long story short..."
      {...(onInputChange && {
        onChange: (e) => onInputChange({ textArea: e.target.value }),
      })}
      className={style.formTextArea}
      disabled={!editable}
    ></textarea>
  );
}
