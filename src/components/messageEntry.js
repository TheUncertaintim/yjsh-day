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
        maxLength="70"
        placeholder="...water your plant?"
        className={`${style.input} ${style.alwaysText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
      <TextInput
        name="_2_neverText"
        msg={msg}
        maxLength="70"
        placeholder="...sleepwalking?"
        className={`${style.input} ${style.neverText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
      <TextInput
        name="_3_sometimesText"
        msg={msg}
        maxLength="70"
        placeholder="...find your ME time?"
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
        <CheckBoxInput
          name="_6_blankBox"
          msg={msg}
          onInputChange={onInputChange}
          disabled={!editable}
        />
        <TextInput
          name="_7_blankInput"
          msg={msg}
          maxLength="15"
          placeholder="...or?"
          className={`${style.input} ${style.blankInput}`}
          onInputChange={onInputChange}
          disabled={!editable}
        />
      </div>
      <TextInput
        name="_8_signedBy"
        msg={msg}
        maxLength="15"
        className={`${style.input} ${style.signedByText}`}
        onInputChange={onInputChange}
        disabled={!editable}
      />
    </>
  );
}

function TextInput(prop) {
  return (
    <input
      type="text"
      name={prop.name}
      value={prop.msg[prop.name] ?? ""}
      placeholder={prop.placeholder}
      maxLength={prop.maxLength}
      {...(prop.onInputChange && {
        onChange: (e) => prop.onInputChange({ [prop.name]: e.target.value }),
      })}
      className={prop.className}
      disabled={prop.disabled}
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
      maxLength="350"
      {...(onInputChange && {
        onChange: (e) => onInputChange({ textArea: e.target.value }),
      })}
      className={style.formTextArea}
      disabled={!editable}
    ></textarea>
  );
}
